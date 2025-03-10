from flask import Flask, request, jsonify
from flask_cors import CORS
from web3 import Web3
import pandas as pd
from eth_account import Account

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

# Load the donor dataset (CSV)
file_path = "donor.csv"
df = pd.read_csv(file_path)

# Connect to Ethereum Blockchain
w3 = Web3(Web3.HTTPProvider("https://eth-holesky.g.alchemy.com/v2/ge6W5zqlJUiXV-Im8Kw89L19gNnxqI8n"))
contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

# Contract ABI
contract_abi = [
      {
          "anonymous": False,
          "inputs": [
              {"indexed": False, "internalType": "uint256", "name": "id", "type": "uint256"},
              {"indexed": False, "internalType": "string", "name": "organType", "type": "string"},
              {"indexed": False, "internalType": "string", "name": "bloodType", "type": "string"},
              {"indexed": False, "internalType": "string", "name": "hlaType", "type": "string"},
              {"indexed": False, "internalType": "uint256", "name": "age", "type": "uint256"}
          ],
          "name": "DonorRegistered",
          "type": "event"
      },
      {
          "anonymous": False,
          "inputs": [
              {"indexed": False, "internalType": "uint256", "name": "donorId", "type": "uint256"}
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
] # Your contract ABI here

# Instantiate the contract
contract = w3.eth.contract(address=contract_address, abi=contract_abi)

# Private key for signing transactions
private_key = "b3351219e889deccaa53ddbaa7f2fea190d6bdf2066fc899f4ef9419af43994a"
account = Account.from_key(private_key)


@app.route("/register_donor", methods=["POST"])
def register_donor():
    try:
        data = request.json
        organ = data["organ"]
        blood = data["blood"]
        hla = data["hla"]
        age = int(data["age"])

        # Register donor on blockchain
        nonce = w3.eth.get_transaction_count(account.address)
        tx = contract.functions.registerDonor(organ, blood, hla, age).build_transaction({
            "from": account.address,
            "gas": 200000,
            "gasPrice": w3.eth.gas_price,
            "nonce": nonce,
        })
        signed_tx = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        return jsonify({"message": "✅ Donor registered on blockchain!", "txHash": receipt.transactionHash.hex()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/find_donor", methods=["POST"])
def find_matching_donor():
    try:
        data = request.json
        organ = data["organ"]
        blood = data["blood"]
        hla = data["hla"]

        matches = df[
            (df["Organ_Type"] == organ) &
            (df["Recipient_Blood_Type"] == blood) &
            (df["Recipient_HLA"] == hla)
        ].sort_values(by=["Urgency_Score", "Transport_Time_Hrs"], ascending=[False, True])

        if matches.empty:
            return jsonify({"message": "❌ No matching donor found!"}), 404
        else:
            best_match = matches.iloc[0]
            donor_id = int(best_match["Donor_ID"][1:])  # Remove 'D' prefix
            nonce = w3.eth.get_transaction_count(account.address)

            # Confirm match on blockchain
            tx = contract.functions.confirmMatch(donor_id).build_transaction({
                "from": account.address,
                "gas": 200000,
                "gasPrice": w3.eth.gas_price,
                "nonce": nonce,
            })
            signed_tx = w3.eth.account.sign_transaction(tx, private_key)
            tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

            return jsonify({
                "message": "✅ Match found!",
                "donor": best_match.to_dict(),
                "txHash": receipt.transactionHash.hex(),
            }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)