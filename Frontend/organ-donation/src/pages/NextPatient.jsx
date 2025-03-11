import { useState } from "react";
import axios from "axios";

function NextPatient() {
  const [patient, setPatient] = useState(null);

  const fetchNextPatient = async () => {
    const res = await axios.get("http://127.0.0.1:5000/next_patient");
    setPatient(res.data);
  };

  return (
    <div>
      <h2>Next Patient</h2>
      <button onClick={fetchNextPatient}>Find Next</button>
      {patient && (
        <div>
          <p>{patient.name} - Urgency: {patient.urgency_score}</p>
        </div>
      )}
    </div>
  );
}

export default NextPatient;
