import { useState , useEffect } from "react";
import {ethers} from "ethers";

// Blockchain-Data
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;  
const CONTRACT_ABI = import.meta.env.VITE_CONTRACT_ABI;

function App() {

  const[account , setAccount] = useState(null);
  const[contract , setcontract] = useState(null);

  useEffect(()=>{
    async function connectWallet() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
    
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
    
        setcontract(contractInstance);
        setAccount(await signer.getAddress());
        console.log("THis is the account address: " , setAccount)
      } else {
        alert("Please install MetaMask!");
      }
    }

    connectWallet()
    
  })

  return (
    <div>
      <div className="bg-amber-950">Pokemon 2</div>
    </div>
  );
}

export default App;
