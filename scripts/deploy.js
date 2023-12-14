const hre = require("hardhat");

async function main() {
  const AssetManagement = await hre.ethers.getContractFactory(
    "AssetManagement"
  );
  const assetManagement = await AssetManagement.deploy();

  await assetManagement.deployed();

  console.log("AssetManagement deployed to:", assetManagement.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
