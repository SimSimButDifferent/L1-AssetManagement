const { assert, expect } = require("chai")
const hre = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("AssetManagement", async function () {
          let assetManagement
          let assetDescription
          let assetValue
          let assetId

          beforeEach(async function () {
              ;[owner1, owner2, owner3] = await hre.ethers.getSigners()
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

              it("Adds assets to mapping correctly", async function () {
                  const assetOneValue = 10
                  const assetTwoValue = 20
                  const assetOneDescription = "good description"
                  const assetTwoDescription = "another good description"

                  await assetManagement.assetRegistration(
                      assetOneValue,
                      assetOneDescription,
                  )
                  await assetManagement
                      .connect(owner2)
                      .assetRegistration(assetTwoValue, assetTwoDescription)

                  const assetOne = await assetManagement.getAsset(1)
                  // Must assert each part, because solidity structs do not equate equally to javascript arrays.
                  assert.equal(assetOne[0].toString(), "1")
                  assert.equal(assetOne[1].toString(), "10")
                  assert.equal(assetOne[2], true)
                  assert.equal(assetOne[3], owner1.address)
                  assert.equal(assetOne[4], "good description")

                  const assetTwo = await assetManagement.getAsset(2)

                  assert.equal(assetTwo[0].toString(), "2")
                  assert.equal(assetTwo[1].toString(), "20")
                  assert.equal(assetTwo[2], true)
                  assert.equal(assetTwo[3], owner2.address)
                  assert.equal(assetTwo[4], "another good description")
              })
          })

          describe("updateAsset", async function () {
              beforeEach(async function () {
                  assetValue = 10
                  assetDescription = "good description"
                  await assetManagement.assetRegistration(
                      assetValue,
                      assetDescription,
                  )
              })
              it("Reverts if asset does not exist", async function () {
                  assetId = 2
                  await expect(
                      assetManagement.updateAsset(
                          assetId,
                          assetValue,
                          assetDescription,
                      ),
                  ).to.be.revertedWith("Asset does not exist")
              })
              it("Reverts if caller is not asset owner", async function () {
                  assetId = 1
                  await expect(
                      assetManagement
                          .connect(owner2)
                          .updateAsset(assetId, assetValue, assetDescription),
                  ).to.be.revertedWith("Caller is not asset owner")
              })
              it("Correctly updates assets", async function () {
                  assetId = 1
                  const newAssetValue = 100
                  const newAssetDescription = "new description"
                  await assetManagement.updateAsset(
                      assetId,
                      newAssetValue,
                      newAssetDescription,
                  )

                  const updatedAsset = await assetManagement.getAsset(1)

                  assert.equal(updatedAsset[0].toString(), "1")
                  assert.equal(updatedAsset[1].toString(), "100")
                  assert.equal(updatedAsset[2], true)
                  assert.equal(updatedAsset[3], owner1.address)
                  assert.equal(updatedAsset[4], "new description")
              })
          })
      })
