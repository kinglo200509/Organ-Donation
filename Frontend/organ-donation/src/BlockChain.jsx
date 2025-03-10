import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Blockchain-Data
const VITE_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;  
const VITE_CONTRACT_ABI = import.meta.env.VITE_CONTRACT_ABI; // Ensure ABI is properly parsed

console.log("Contract Address:", VITE_CONTRACT_ADDRESS);
console.log("Contract ABI:", VITE_CONTRACT_ABI);


function Blockchain() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        try {
          // wrapping the etherrun in the ethers
          const provider = new ethers.BrowserProvider(window.ethereum);
          console.log(`This is the provider ${provider}`)
          // mkaing the signer
          const signer = await provider.getSigner();
          
          console.log("This is the signer:", signer);
          // to interact with the contract
          const contractInstance = new ethers.Contract(
            VITE_CONTRACT_ADDRESS,
            VITE_CONTRACT_ABI,
            signer
          );
          console.log(`This is the contractInstance : ${contractInstance}`)

          setContract(contractInstance);

          const address = await signer.getAddress();
          setAccount(address);
          console.log("This is the account address:", address);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    }

    connectWallet();
  }, []); // ✅ Add dependency array to run only on mount

 

  return (
    <div>
      <div className="bg-amber-950 text-white p-4">Connected Account: {account || "Not Connected"}</div>
    </div>
  );
}

export default Blockchain;
