import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import "./OrganSearch.css"; // Import styles

const contractABI =  [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "organType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "bloodType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "hlaType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "age",
        "type": "uint256"
      }
    ],
    "name": "DonorRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "donorId",
        "type": "uint256"
      }
    ],
    "name": "MatchFound",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_donorId",
        "type": "uint256"
      }
    ],
    "name": "confirmMatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "donorCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "donors",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "organType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "bloodType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "hlaType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "age",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "matched",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_organType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_bloodType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_hlaType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_age",
        "type": "uint256"
      }
    ],
    "name": "registerDonor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
const contractAddress = "0xbacB051e43d6D07ddE586212f5AC2e6EA13950a0";

function FlashMessage({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div className={`flash-message ${type}`}>
      {message}
      <button className="close-btn" onClick={onClose}>✖</button>
    </div>
  );
}

function OrganSearch() {
  const videoRef = useRef(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [flashMessage, setFlashMessage] = useState({ message: "", type: "" }); // Added Flash Message state
  const [formData, setFormData] = useState({
    organ: "",
    hla: "",
    blood: "",
    age: "",
  });

  useEffect(() => {
    const initEthers = async () => {
      try {
        if (!window.ethereum) {
          setFlashMessage({ message: "MetaMask is not installed. Please install it.", type: "error" });
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
        setFlashMessage({ message: "Failed to connect to MetaMask.", type: "error" });
      }
    };

    initEthers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerDonor = async (event) => {
    event.preventDefault();
    const { organ, hla, blood, age } = formData;

    if (contract) {
      try {
        const tx = await contract.registerDonor(organ, blood, hla, age);
        await tx.wait();
        setFlashMessage({ message: "✅ Donor registered on the blockchain!", type: "success" });
      } catch (error) {
        console.error("❌ Registration failed", error);
        setFlashMessage({ message: "❌ Registration failed. Please try again.", type: "error" });
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

        const donorDetails = {
          id: donor.id.toString(),
          organType: donor.organType,
          bloodType: donor.bloodType,
          hlaType: donor.hlaType,
          age: donor.age.toString(),
          matched: donor.matched,
        };

        console.log("Donor Info:", donorDetails);

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
        setFlashMessage({ message: `✅ ${matchedDonors.length} Matching Donor(s) Found!`, type: "success" });
      } else {
        console.log("❌ No Matching Donors Found");
        setFlashMessage({ message: "❌ No matching donors found.", type: "error" });
      }

      return matchedDonors;
    } catch (error) {
      console.error("Error fetching donors:", error);
      setFlashMessage({ message: "⚠️ Error fetching donors. Check console for details.", type: "error" });
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
      <video ref={videoRef} autoPlay loop muted playsInline className="background-video">
        <source src="/bgVid2.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Content on top of the video */}
      <div className="form-overlay">
        <h1 className="title">Find a Matching Organ</h1>
        <p>Connected Account: {account}</p>

        <form className="organ-search-form" onSubmit={registerDonor}>
          {/* Organ Name */}
          <div className="input-group">
            <label>Organ Name</label>
            <input type="text" name="organ" placeholder="Enter organ name" value={formData.organ} onChange={handleChange} required />
          </div>

          {/* HLA */}
          <div className="input-group">
            <label>HLA</label>
            <input type="text" name="hla" placeholder="Enter HLA type" value={formData.hla} onChange={handleChange} required />
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
            <input type="number" name="age" placeholder="Enter age" value={formData.age} onChange={handleChange} required />
          </div>

          {/* Submit Button */}
          <button type="submit" className="search-btn">Register Donor</button>
        </form>

        <button onClick={findMatchingDonor} className="search-btn">Find Matching Donor</button>
      </div>
    </div>
  );
}

export default OrganSearch;
