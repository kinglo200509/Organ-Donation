from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests for React frontend

# Database connection
def get_db_connection():
    return psycopg2.connect(
        dbname="PatientQueue",
        user="postgres",
        password="root",
        host="localhost",
        port="5432"
    )

# Create table if not exists
def create_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS patients (
            id SERIAL PRIMARY KEY,
            name TEXT,
            age INT,
            blood_group TEXT,
            hla TEXT,
            organ_needed TEXT,
            urgency_score INT
        );
    """)
    conn.commit()
    cursor.close()
    conn.close()

create_table()

@app.route("/add_patient", methods=["POST"])
def add_patient():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO patients (name, age, blood_group, hla, organ_needed, urgency_score)
        VALUES (%s, %s, %s, %s, %s, %s);
    """, (data["name"], data["age"], data["blood_group"], data["hla"], data["organ_needed"], data["urgency_score"]))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": f"Patient {data['name']} added successfully"}), 201

@app.route("/view_patients", methods=["GET"])
def view_patients():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patients ORDER BY urgency_score DESC;")
    patients = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify([{"id": p[0], "name": p[1], "age": p[2], "blood_group": p[3], "hla": p[4], "organ_needed": p[5], "urgency_score": p[6]} for p in patients])

@app.route("/next_patient", methods=["GET"])
def next_patient():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patients ORDER BY urgency_score DESC LIMIT 1;")
    patient = cursor.fetchone()
    if patient:
        cursor.execute("DELETE FROM patients WHERE id = %s;", (patient[0],))
        conn.commit()
    cursor.close()
    conn.close()
    if patient:
        return jsonify({"id": patient[0], "name": patient[1], "age": patient[2], "blood_group": patient[3], "hla": patient[4], "organ_needed": patient[5], "urgency_score": patient[6]})
    return jsonify({"message": "No patients in the list"}), 404

if __name__ == "__main__":
    app.run(debug=True)
