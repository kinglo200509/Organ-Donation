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
]
const contractAddress = "0xbacB051e43d6D07ddE586212f5AC2e6EA13950a0";

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
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signerInstance);
  
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
        const tx = await contract.registerDonor(organ, blood, hla, age);
        await tx.wait();
        alert("✅ Donor registered on the blockchain!");
      } catch (error) {
        console.error("❌ Registration failed", error);
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
        alert(`Matching Donors: ${JSON.stringify(matchedDonors, null, 2)}`);
      } else {
        console.log("❌ No Matching Donors Found");
        alert("No matching donors found.");
      }
  
      return matchedDonors;
    } catch (error) {
      console.error("Error fetching donors:", error);
      alert("Error fetching donors. Check the console for more details.");
    }
  };

  return (
    <div className="organ-search-container">
      {/* Flash Message */}
      <FlashMessage
        message={flashMessage.message}
        type={flashMessage.type}
        onClose={() => setFlashMessage({ message: "", type: "" })}
      />

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