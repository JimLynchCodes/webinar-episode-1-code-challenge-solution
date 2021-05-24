const OwnerStorage = artifacts.require("OwnerStorage");

module.exports = function(deployer) {
  deployer.deploy(OwnerStorage);
}