import { useState } from "react";
import axios from "axios";
import "../OrganSearch.css"; // Uses your existing CSS file

function AddPatient() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    blood_group: "",
    hla: "",
    organ_needed: "",
    urgency_score: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/add_patient", form);
      alert(response.data.message);
      setForm({
        name: "",
        age: "",
        blood_group: "",
        hla: "",
        organ_needed: "",
        urgency_score: "",
      });
    } catch (err) {
      console.error("Error adding patient:", err);
      setError("Failed to add patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="organ-search-container">
      {/* Background Video */}
      <video autoPlay loop muted className="background-video">
        <source src="your-video.mp4" type="video/mp4" />
      </video>

      {/* Form Overlay */}
      <div className="form-overlay">
        <h2 className="title">Add Patient</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="patient-form">
          <div className="input-group">
            <label>Name</label>
            <input type="text" name="name" placeholder="Enter Name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Age</label>
            <input type="number" name="age" placeholder="Enter Age" value={form.age} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Blood Group</label>
            <input type="text" name="blood_group" placeholder="Enter Blood Group" value={form.blood_group} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>HLA Type</label>
            <input type="text" name="hla" placeholder="Enter HLA Type" value={form.hla} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Organ Needed</label>
            <input type="text" name="organ_needed" placeholder="Enter Organ Needed" value={form.organ_needed} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Urgency Score (1-100)</label>
            <input type="number" name="urgency_score" placeholder="Enter Urgency Score" value={form.urgency_score} onChange={handleChange} required />
          </div>

          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? "Adding..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPatient;
