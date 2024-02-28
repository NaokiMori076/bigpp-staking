// import Web3 from "web3";
// import contract from "truffle-contract";

// const provider = () => {
//   // If the user has MetaMask:
//   if (typeof web3 !== "undefined") {
//     return window.ethereum;
//   } else {
//     console.error("You need to install MetaMask for this app to work!");
//   }
// };

// export const eth = new Web3(provider()).eth;
// export const myWeb3 = new Web3(provider());

// export const getInstance = (artifact) => {
//   const contractObj = contract(artifact);
//   contractObj.setProvider(provider());

//   return contractObj.deployed();
// };

import Web3 from "web3";
import contract from "truffle-contract";

const getProvider = () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // We're in the browser and MetaMask is available
    return window.ethereum;
  } else {
    // Server-side or MetaMask is not installed
    console.error(
      "Ethereum provider (e.g., MetaMask) not found. You need to install MetaMask for this app to work!"
    );
    // You could return a default provider here or handle the lack of provider appropriately
    return null;
  }
};

const createWeb3Instance = () => {
  const provider = getProvider();
  if (!provider) {
    return null; // Or handle as appropriate
  }
  return new Web3(provider);
};

// Initialize Web3 and contract instances conditionally
const web3Instance = createWeb3Instance();
export const eth = web3Instance ? web3Instance.eth : null;
export const myWeb3 = web3Instance;

export const getInstance = (artifact) => {
  if (!web3Instance) {
    console.error("Web3 instance not available.");
    return null; // Or handle as appropriate
  }
  const contractObj = contract(artifact);
  contractObj.setProvider(web3Instance.currentProvider);
  if (typeof contractObj.currentProvider.sendAsync !== "function") {
    contractObj.currentProvider.sendAsync = function () {
      return contractObj.currentProvider.send.apply(
        contractObj.currentProvider,
        arguments
      );
    };
  }
  return contractObj.deployed();
};

// import Web3 from "web3";
// import contract from "truffle-contract";

// const provider = () => {
//   // Check if we're in a browser environment
//   if (typeof window !== "undefined") {
//     // If the user has MetaMask or another Ethereum provider:
//     if (window.ethereum) {
//       return window.ethereum;
//     } else {
//       // Fallback to a default provider or display an error if MetaMask is not installed
//       console.error(
//         "Ethereum provider (e.g., MetaMask) not found. You need to install MetaMask for this app to work!"
//       );
//       // You could return a default Web3 provider here, but it's better to prompt the user to install MetaMask
//       return null;
//     }
//   } else {
//     // Server-side or environments where window is not defined
//     console.log("No Ethereum provider available outside browser");
//     // Return a default provider or null
//     return null;
//   }
// };

// // Initialize Web3 with the provider
// const web3Instance = () => {
//   const web3Prov = provider();
//   if (web3Prov) {
//     return new Web3(web3Prov);
//   } else {
//     // Handle the case where there is no provider
//     return null;
//   }
// };

// const myWeb3 = web3Instance();

// export const eth = myWeb3 ? myWeb3.eth : null;
// export const getInstance = (artifact) => {
//   if (!myWeb3) return null; // Early return if Web3 instance is not available
//   const contractObj = contract(artifact);
//   contractObj.setProvider(myWeb3.currentProvider);
//   if (typeof contractObj.currentProvider.sendAsync !== "function") {
//     contractObj.currentProvider.sendAsync = function () {
//       return contractObj.currentProvider.send.apply(
//         contractObj.currentProvider,
//         arguments
//       );
//     };
//   }
//   return contractObj.deployed();
// };
