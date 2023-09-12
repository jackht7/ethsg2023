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

  it("1. Factory contract address is correct", async () => {
    const address = await storageContract.factoryAddress();
    assert.isDefined(address);    
    assert.notEqual(address, "0x0000000000000000000000000000000000000000");    
    assert.equal(address, factoryContract.address);
  });  

  it("2. Project details can be retrieved from the contract", async () => {
    const project = await storageContract.project();
    assert.isDefined(project);
    assert.equal(project.projectId.toString(), "0");
    assert.equal(project.juniorAddress, accounts[0]);
    assert.equal(project.seniorAddress, accounts[1]);
    assert.equal(project.clientAddress, accounts[2]);
    assert.equal(project.ipfsHash, "QmXyZ");

    const status = await storageContract.status();
    assert.isDefined(status);
    assert.equal(status.toString(), "0");
  }); 

  it("3. List of requests pertaining to a user can be obtained", async () => {
    const requests = await storageContract.getRequests(accounts[1]);
    assert.isDefined(requests);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].txId.toString(), "0");
    assert.equal(requests[0].approved, false);
    assert.equal(requests[0].status.toString(), "0");
    assert.equal(requests[0].amount.toString(), web3.utils.toWei("100", "ether"));
    assert.equal(requests[0].ipfsHash, "QmXyZ");
  }); 

  it("5. Stakeholders can approve requests", async () => {
    const tx = await storageContract.approveRequest(0, {from: accounts[1]});
    const requests = await storageContract.getRequests(accounts[1]);
    assert.equal(requests[0].approved, true);
  }); 

  it("6. Stakeholders can reject requests", async () => {
    const tx = await storageContract.rejectRequest(0, {from: accounts[1]});
    const status = await storageContract.status();
    assert.equal(status.toString(), "2");
  }); 

  it("7. NFT is minted upon approval from all stakeholders", async () => {
    const tx1 = await storageContract.approveRequest(0, {from: accounts[1]});
    const tx2 = await storageContract.approveRequest(0, {from: accounts[2]});
    
    const owner = await factoryContract.ownerOf(0);
    assert.equal(owner, storageContract.address);
  });
});