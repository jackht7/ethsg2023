const FactoryContract = artifacts.require("FactoryContract");
const StorageContract = artifacts.require("StorageContract");

contract("StorageContract", accounts => {
  let factoryContract;
  let storageContract;

  beforeEach(async () => {
    factoryContract = await FactoryContract.new();
    const amount = web3.utils.toWei("100", "ether");
    const seniorAddress = accounts[1];
    const clientAddress = accounts[2];
    const ipfsHash = "QmXyZ";
    await factoryContract.createProject(amount, seniorAddress, clientAddress, ipfsHash);
    const result = await factoryContract.getProjectsOfUser(accounts[1]);
    storageContract = await StorageContract.at(result[0]);
  });

  it("0. Storage contract deploys successfully", async () => {
    const address = storageContract.address;
    assert.isDefined(address);    
    assert.notEqual(address, "0x0000000000000000000000000000000000000000");    
  });  
});