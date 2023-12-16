require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("ethers");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.23",
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
};
