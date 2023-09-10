import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const FactoryContract = await ethers.getContractFactory("FactoryContract");
    const factoryContract = await FactoryContract.deploy();
    return { factoryContract };
  }    

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { factoryContract } = await loadFixture(deployFixture);

      expect(factoryContract.address).to.not.equal(ethers.constants.AddressZero);
    });
  });
});
