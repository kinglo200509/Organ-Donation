import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./OrganSearch.css"; // Import styles
import { ethers } from "ethers";

// Contract Details
const CONTRACT_ADDRESS = "0xbacB051e43d6D07ddE586212f5AC2e6EA13950a0";
const CONTRACT_ABI = [
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

const FlashMessage = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(false);
  
    useEffect(() => {
      if (message) {
        setVisible(true);
        const timer = setTimeout(() => {
          setVisible(false);
          setTimeout(onClose, 500); // Delay onClose to match fade-out
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [message, onClose]);
  
    if (!message) return null;
  
    return (
      <div
        style={{
          position: "fixed",
          top: "15px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 25px",
          backgroundColor: type === "success" ? "#28a745" : "#dc3545",
          color: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 6px 15px rgba(0,0,0,0.2)",
          fontSize: "16px",
          fontWeight: "bold",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          zIndex: 1000,
          textAlign: "center",
          minWidth: "200px",
        }}
      >
        {message}
      </div>
    );
  };
  
function OrganSearch() {
  const videoRef = useRef(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [formData, setFormData] = useState({
    organ: "",
    hla: "",
    blood: "",
    age: "",
  });
  const [flashMessage, setFlashMessage] = useState(null);

  useEffect(() => {
    const initEthers = async () => {
      try {
        if (!window.ethereum) {
          alert("MetaMask is not installed. Please install it.");
          return;
        }
  
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
  
        const signerInstance = await web3Provider.getSigner();
        const userAccount = await signerInstance.getAddress();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerInstance);
  
        setProvider(web3Provider);
        setSigner(signerInstance);
        setContract(contractInstance);
        setAccount(userAccount);
      } catch (error) {
        console.error("Error initializing ethers:", error);
      }
    };
  
    initEthers();
  }, []);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Search Request
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { organ, hla, blood, age } = formData;
  
    if (contract) {
      try {
        setFlashMessage({
          message: "⏳ Waiting for MetaMask confirmation...",
          type: "info",
        });
  
        console.log("Sending transaction to register donor...");
        const tx = await contract.registerDonor(organ, blood, hla, age);
  
        setFlashMessage({
          message: "⏳ Transaction submitted! Waiting for confirmation...",
          type: "info",
        });
  
        await tx.wait(); // Wait for confirmation
  
        console.log("✅ Transaction successful:", tx);
        setFlashMessage({
          message: "✅ Donor registered successfully!",
          type: "success",
        });
  
      } catch (error) {
        console.error("❌ Registration failed:", error);
        setFlashMessage({
          message: "❌ Transaction failed! Please try again.",
          type: "error",
        });
      }
    }
  };

  const findMatchingDonor = async () => {
    if (!contract) return;
  
    try {
      const donorCount = await contract.donorCount();
      let matchedDonors = [];
  
      for (let i = 1; i <= donorCount; i++) {
        const donor = await contract.donors(i);
  
        // Extract donor details
        const donorDetails = {
          id: donor.id.toString(),
          organType: donor.organType,
          bloodType: donor.bloodType,
          hlaType: donor.hlaType,
          age: donor.age.toString(),
          matched: donor.matched,
        };
  
        console.log("Donor Info:", donorDetails);
  
        // Check if donor matches the search criteria
        if (
          donor.organType === formData.organ &&
          donor.bloodType === formData.blood &&
          donor.hlaType === formData.hla &&
          donor.matched === false
        ) {
          matchedDonors.push(donorDetails);
        }
      }
  
      if (matchedDonors.length > 0) {
        console.log("✅ Matching Donors Found:", matchedDonors);
        setFlashMessage({
          message: `Matching Donors Found: ${matchedDonors.length}`,
          type: "success"
        });
      } else {
        console.log("❌ No Matching Donors Found");
        setFlashMessage({
          message: "No matching donors found.",
          type: "error"
        });
      }
  
      return matchedDonors;
    } catch (error) {
      console.error("Error fetching donors:", error);
      setFlashMessage({
        message: "Error fetching donors.",
        type: "error"
      });
    }
  };

  return (
    <div className="organ-search-container">
      {/* Flash Message */}
      {flashMessage && flashMessage.message && (
        <FlashMessage
          message={flashMessage.message}
          type={flashMessage.type}
          onClose={() => setFlashMessage(null)}
        />
      )}

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
          <button type="submit" className="search-btn" onClick={findMatchingDonor}>
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrganSearch;