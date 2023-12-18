const hre = require("hardhat")

async function main() {
    const AssetManagement =
        await hre.ethers.getContractFactory("AssetManagement")

    console.log("Deploying...")

    assetManagement = await AssetManagement.deploy()

    await assetManagement.waitForDeployment()

    console.log(`AssetManagement deployed to: ${assetManagement.target}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
