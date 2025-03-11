import { useEffect, useState } from "react";
import axios from "axios";
import "../OrganSearch.css"; // Keeping background styles

function ViewPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/view_patients");
        setPatients(response.data);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to load patients. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="organ-search-container">
      {/* Background Video */}
      <video autoPlay loop muted className="background-video">
        <source src="your-video.mp4" type="video/mp4" />
      </video>

      <div
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(10px)",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0px 4px 15px rgba(255, 255, 255, 0.2)",
          textAlign: "center",
          animation: "fadeInUp 0.6s ease-in-out",
          width: "95%",
          maxWidth: "600px",
          color: "white",
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          Patient Queue
        </h2>

        {error && <p style={{ color: "white", fontWeight: "bold" }}>{error}</p>}
        {loading ? (
          <p style={{ color: "white", fontWeight: "bold" }}>Loading...</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
            }}
          >
            {/* Table Header */}
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Age</th>
                <th style={tableHeaderStyle}>Blood Group</th>
                <th style={tableHeaderStyle}>HLA</th>
                <th style={tableHeaderStyle}>Organ Needed</th>
                <th style={tableHeaderStyle}>Urgency Score</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr
                    key={patient.id}
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      transition: "all 0.3s ease-in-out",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")
                    }
                  >
                    <td style={tableCellStyle}>{patient.name}</td>
                    <td style={tableCellStyle}>{patient.age}</td>
                    <td style={tableCellStyle}>{patient.blood_group}</td>
                    <td style={tableCellStyle}>{patient.hla}</td>
                    <td style={tableCellStyle}>{patient.organ_needed}</td>
                    <td style={tableCellStyle}>{patient.urgency_score}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: "15px", fontWeight: "bold", color: "white" }}>
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Inline styles for table cells
const tableHeaderStyle = {
  padding: "12px",
  fontSize: "1rem",
  fontWeight: "bold",
  borderBottom: "2px solid rgba(255, 255, 255, 0.5)", // Soft border for clean look
};

const tableCellStyle = {
  padding: "12px",
  fontSize: "1rem",
  color: "white",
};

export default ViewPatients;
