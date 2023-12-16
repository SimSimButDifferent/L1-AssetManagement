const hre = require("hardhat");

async function main() {
  const AssetManagement = await hre.ethers.getContractFactory(
    "AssetManagement"
  );

  console.log("Deploying...");

  assetManagement = await AssetManagement.deploy;

  console.log("AssetManagement deployed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
