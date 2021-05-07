require('dotenv').config();
//Configure API and Alchemy Data
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_URL = process.env.API_URL;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

//Contract ABI

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

const contractAddress = "0xC96Ca055912102D80Aa25De26eaC5618FB2559b4"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

//console.log(JSON.stringify(contract.abi));

async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

    //the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise.then((signedTx) => {

        web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
            if (!err) {
                console.log("The hash of the transaction is: ", hash, "\nCheck Alchemy mempool for more details");

            } else {
                console.log("Something went wrong while attempting to submit your transaction: ", err)

            }
        });
        
    }).catch((err) => {
        console.log(" Promise failed:", err);
    });
}
//call function
mintNFT("https://gateway.pinata.cloud/ipfs/QmTax7EBPFGT82SyVaUYKvJZebJdVvwgVNs59rEzEnbydu");