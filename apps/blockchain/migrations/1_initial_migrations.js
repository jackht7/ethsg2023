const factoryContract = artifacts.require('./FactoryContract.sol');

module.exports = function (deployer) {
  deployer.deploy(factoryContract);
};
