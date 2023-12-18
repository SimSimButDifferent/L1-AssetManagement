const { assert, expect, config } = require("chai")
const hre = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("AssetManagement", async function () {
          let deployer
          let accounts
          let assetManagement
          let assetDescription
          let assetValue

          beforeEach(async function () {
              accounts = await hre.ethers.getSigners()
              const AssetManagement =
                  await hre.ethers.getContractFactory("AssetManagement")
              assetManagement = await AssetManagement.deploy()
              await assetManagement.waitForDeployment()
          })

          describe("assetRegistration", async function () {
              it("Reverts if asset value is not above zero", async function () {
                  assetValue = 0
                  assetDescription = "asset description"
                  await expect(
                      assetManagement.assetRegistration(
                          assetValue,
                          assetDescription,
                      ),
                  ).to.be.revertedWith("Asset value must be above zero")
              })

              it("Reverts if asset does not have a description", async function () {
                  assetValue = 1
                  assetDescription = ""
                  await expect(
                      assetManagement.assetRegistration(
                          assetValue,
                          assetDescription,
                      ),
                  ).to.be.revertedWith("Asset must have a description")
              })

              it("Adds an asset to mapping correctly", async function () {
                  assetValue = 10
                  assetDescription = "good description"
                  const assetOwnerAddress = accounts[0].address
                  await assetManagement.assetRegistration(
                      assetValue,
                      assetDescription,
                  )

                  const asset = await assetManagement.getAsset(1)
                  // Must assert each part, because solidity structs do not equate equally to javascript arrays.
                  assert.equal(asset[0].toString(), "1")
                  assert.equal(asset[1].toString(), "10")
                  assert.equal(asset[2], true)
                  assert.equal(asset[3], assetOwnerAddress)
                  assert.equal(asset[4], "good description")
              })
          })

          describe("updateAsset", async function () {
              beforeEach(async function () {
                  assetValue = 10
                  assetDescription = "good description"
                  const assetOwnerAddress = accounts[0].address
                  await assetManagement.assetRegistration(
                      assetValue,
                      assetDescription,
                  )
              })
              it("Reverts if asset does not exist", async function () {
                  const assetId = 2
                  await expect(
                      assetManagement.updateAsset(
                          assetId,
                          assetValue,
                          assetDescription,
                      ),
                  ).to.be.revertedWith("Asset does not exist")
              })
          })
      })
