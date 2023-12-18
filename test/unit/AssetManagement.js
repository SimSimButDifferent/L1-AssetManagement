const { assert, expect, config } = require("chai")
const hre = require("hardhat")
// const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("AssetManagement", async function () {
          let assetManagement
          let assetDescription
          let assetValue

          beforeEach(async function () {
              const AssetManagement =
                  await hre.ethers.getContractFactory("AssetManagement")
              assetManagement = await AssetManagement.deploy()
              await assetManagement.waitForDeployment()
          })

          describe("assetRegistration", async function () {
              it("Fails if asset value is not above zero", async function () {
                  assetValue = 0
                  assetDescription = "asset description"
                  await expect(
                      assetManagement.assetRegistration(
                          assetValue,
                          assetDescription,
                      ),
                  ).to.be.revertedWith("Asset value must be above zero")
              })

              it("Fails if asset does not have a description", async function () {
                  assetValue = 1
                  assetDescription = ""
                  await expect(
                      assetManagement.assetRegistration(
                          assetValue,
                          assetDescription,
                      ),
                  ).to.be.revertedWith("Asset must have a description")
              })
          })
      })
