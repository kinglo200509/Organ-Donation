import { useState, useEffect } from "react";
import { ethers, keccak256, AbiCoder, toUtf8Bytes } from "ethers";

// Blockchain-Data
const VITE_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const VITE_CONTRACT_ABI = JSON.parse(import.meta.env.VITE_CONTRACT_ABI || "[]");

console.log("Contract Address:", VITE_CONTRACT_ADDRESS);
console.log("Contract ABI:", VITE_CONTRACT_ABI);

function Blockchain() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [hash, setHash] = useState(null);

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          console.log(`This is the provider:`, provider);

          const signer = await provider.getSigner();
          console.log("This is the signer:", signer);

          const contractInstance = new ethers.Contract(
            VITE_CONTRACT_ADDRESS,
            VITE_CONTRACT_ABI,
            signer
          );
          console.log("This is the contract instance:", contractInstance);

          setContract(contractInstance);
          setAccount(await signer.getAddress());
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    }

    connectWallet();
  }, []);

  async function newUser(name, age, organ, hla) {
    if (!contract) {
      console.error("Contract is not initialized yet!");
      return;
    }

    try {
      // Call smart contract function
      const tx = await contract.receipientHash(name, age, organ, hla);
      await tx.wait(); // Wait for transaction confirmation

      // Compute keccak256 hash
      const abiCoder = new ethers.AbiCoder();
      const encoded = abiCoder.encode(
        ["string", "uint8", "string", "string"],
        [name, age, organ, hla]
      );
      const hashedId = keccak256(toUtf8Bytes(encoded));
      console.log(`This is the hash of the HashedId: ${hashedId}`);
      setHash(hashedId);
    } catch (error) {
      console.error("Error calling newUser:", error);
    }
  }

  async function findUser() {
    if (!contract) {
      console.log("Contract is not initialized yet");
      return;
    }

    // Check if hash is generated
    if (!hash) {
      console.error("Hash is not set yet! Generate the hash first.");
      return;
    }

    try {
      // Call the smart contract function with the hash value
      const userData = await contract.returnReceipientData(hash);
      console.log("User Data:", userData);
    } catch (error) {
      console.error("Error finding user:", error);
    }
  }

  return (
    <div>
      <div className="bg-amber-950 text-white p-4">
        Connected Account: {account || "Not Connected"}
      </div>
      <div className="pl-3 text-4xl">
        <button
          onClick={() => newUser("saswt", 19, "liver", "A10")}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        >
          Generate Hash ID
        </button>
        {hash && (
          <div className="mt-4 text-lg text-green-500">
            Hash ID: {hash}
          </div>
        )}
        <button
          onClick={findUser}
          className="bg-green-500 text-white px-4 py-2 mt-4 rounded ml-4"
        >
          Find User
        </button>
      </div>
    </div>
  );
}

export default Blockchain;
