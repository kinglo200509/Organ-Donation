import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./OrganSearch.css"; // Import styles
import { ethers } from "ethers";

// Contract Details
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ABI = [
  {
      "anonymous": false,
      "inputs": [
          {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"},
          {"indexed": false, "internalType": "string", "name": "organType", "type": "string"},
          {"indexed": false, "internalType": "string", "name": "bloodType", "type": "string"},
          {"indexed": false, "internalType": "string", "name": "hlaType", "type": "string"},
          {"indexed": false, "internalType": "uint256", "name": "age", "type": "uint256"}
      ],
      "name": "DonorRegistered",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {"indexed": false, "internalType": "uint256", "name": "donorId", "type": "uint256"}
      ],
      "name": "MatchFound",
      "type": "event"
  },
  {
      "inputs": [{"internalType": "uint256", "name": "_donorId", "type": "uint256"}],
      "name": "confirmMatch",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "donorCount",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "name": "donors",
      "outputs": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "string", "name": "organType", "type": "string"},
          {"internalType": "string", "name": "bloodType", "type": "string"},
          {"internalType": "string", "name": "hlaType", "type": "string"},
          {"internalType": "uint256", "name": "age", "type": "uint256"},
          {"internalType": "bool", "name": "matched", "type": "bool"}
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {"internalType": "string", "name": "_organType", "type": "string"},
          {"internalType": "string", "name": "_bloodType", "type": "string"},
          {"internalType": "string", "name": "_hlaType", "type": "string"},
          {"internalType": "uint256", "name": "_age", "type": "uint256"}
      ],
      "name": "registerDonor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  }
];
const API_URL = "http://127.0.0.1:5000"; // Flask API URL

function OrganSearch() {
  const videoRef = useRef(null);
  const [formData, setFormData] = useState({
    organ: "",
    hla: "",
    blood: "",
    age: "",
  });
  const [flashMessage, setFlashMessage] = useState(null);

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          console.log("Wallet connected!");
          return { contract, signer };
        } catch (error) {
          console.error("Error connecting wallet:", error);
        }
      } else {
        alert("Install MetaMask!");
      }
    }

    connectWallet();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Search Request
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/find_donor`, formData);
      setFlashMessage({ message: response.data.message, type: "success" });
    } catch (error) {
      setFlashMessage({ message: "❌ No matching donor found!", type: "error" });
    }
  };

  return (
    <div className="organ-search-container">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      >
        <source src="/bgVid2.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Content on top of the video */}
      <div className="form-overlay">
        <h1 className="title">Find a Matching Organ</h1>

        {flashMessage && (
          <div className={`flash-message ${flashMessage.type}`}>
            {flashMessage.message}
          </div>
        )}

        <form className="organ-search-form" onSubmit={handleSubmit}>
          {/* Organ Name */}
          <div className="input-group">
            <label>Organ Name</label>
            <input
              type="text"
              name="organ"
              placeholder="Enter organ name"
              value={formData.organ}
              onChange={handleChange}
              required
            />
          </div>

          {/* HLA */}
          <div className="input-group">
            <label>HLA</label>
            <input
              type="text"
              name="hla"
              placeholder="Enter HLA type"
              value={formData.hla}
              onChange={handleChange}
              required
            />
          </div>

          {/* Blood Group */}
          <div className="input-group">
            <label>Blood Group</label>
            <select name="blood" value={formData.blood} onChange={handleChange} required>
              <option value="">Select Blood Group</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="O">O</option>
              <option value="AB">AB</option>
            </select>
          </div>

          {/* Age */}
          <div className="input-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              placeholder="Enter age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrganSearch;