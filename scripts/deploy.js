const hre = require("hardhat")
const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

async function main() {
    if (developmentChains.includes(network.name)) {
        const AssetManagement =
            await hre.ethers.getContractFactory("AssetManagement")

        console.log("Deploying...")

        const assetManagement = await AssetManagement.deploy()
        console.log(`AssetManagement deployed to: ${assetManagement.target}`)
    }

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        const AssetManagement =
            await hre.ethers.getContractFactory("AssetManagement")

        console.log("Deploying...")

        const assetManagement = await AssetManagement.deploy()
        console.log(`AssetManagement deployed to: ${assetManagement.target}`)

        const desiredConfirmations = 2
        const receipt = await assetManagement
            .deploymentTransaction()
            .wait(desiredConfirmations)

        console.log(
            `Transaction confirmed. Block number: ${receipt.blockNumber}`,
        )
        await hre.run("verify:etherscan", { address: assetManagement.target })
        console.log("AssetManagement verified!")
        console.log("--------------------------------------------------")
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
