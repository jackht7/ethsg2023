const FactoryContract = artifacts.require("FactoryContract");
const StorageContract = artifacts.require("StorageContract");

contract("FactoryContract", accounts => {
  let factoryContract;

  beforeEach(async () => {
    factoryContract = await FactoryContract.new();
  });

  it("0. Factory contract deploys successfully", async () => {
    const address = factoryContract.address;
    assert.isDefined(address);    
    assert.notEqual(address, "0x0000000000000000000000000000000000000000");    
  });

  it("1. Implementation contract deploys successfully", async () => {
    const address = await factoryContract.implementation();
    assert.isDefined(address);    
    assert.notEqual(address, "0x0000000000000000000000000000000000000000");    
  });

  it("2. Factory contract can create new projects", async () => {
    const amount = web3.utils.toWei("100", "ether");
    const seniorAddress = accounts[1];
    const clientAddress = accounts[2];
    const ipfsHash = "QmXyZ";
    const tx = await factoryContract.createProject(amount, seniorAddress, clientAddress, ipfsHash);
    const result = await factoryContract.getProjectsOfUser(accounts[1]);
    assert.equal(result.length, 1);
  });

  it("3. List of user projects can be retrieved", async () => {
    const amount = web3.utils.toWei("100", "ether");
    const seniorAddress = accounts[2];
    const clientAddress = accounts[3];
    const ipfsHash = "QmXyZ";
    const tx = await factoryContract.createProject(amount, seniorAddress, clientAddress, ipfsHash);

    const result = await factoryContract.getProjectsOfUser(accounts[2]);
    assert.equal(result.length, 1);
    assert.isDefined(result[0]);    
    assert.notEqual(result[0], "0x0000000000000000000000000000000000000000");    
  });

  it("4. NFT name and symbol are correct", async () => {
    const name = await factoryContract.name();
    const symbol = await factoryContract.symbol();
    assert.equal(name, "SynthWork");
    assert.equal(symbol, "SNWK");
  });

  it("5. NFT's can be minted", async () => {
    const uri = "QmXyZ";
    const tx = await factoryContract.safeMint(1, accounts[1], uri);
    const owner = await factoryContract.ownerOf(1);
    assert.equal(owner, accounts[1]);
  });
});