const OwnerStorage = artifacts.require("OwnerStorage");
const truffleAssert = require('truffle-assertions');

contract("OwnerStorage", function (accounts) {
  describe("Initial deployment", async () => {
    it("should assert true", async function () {
      await OwnerStorage.deployed();
      assert.isTrue(true);
    });
  });

  describe("Getting And Setting Values", () => {
    
    it("should initialize each user's value to 0", async () => {
      
      // get subject
      const ownerStorage = await OwnerStorage.deployed();

      // get the current values
      const user1storedData = await ownerStorage.getStoredData.call({ from: accounts[0] });
      const user2storedData = await ownerStorage.getStoredData.call({ from: accounts[1] });
      
      // verify the values are zero
      assert.equal(user1storedData, 0, `user1storedData inital value: ${user1storedData} was not 0!`);
      assert.equal(user2storedData, 0, `user1storedData inital value: ${user2storedData} was not 0!`);
    
    });

    it("should store a value for each user", async () => {
      
      // get subject
      const ownerStorage = await OwnerStorage.deployed();

      // Set the values for the first three users to 1, 2 respectively.
      await ownerStorage.setStoredData(1, { from: accounts[0] });
      await ownerStorage.setStoredData(2, { from: accounts[1] });

      // get the actual values now
      const user1storedData = await ownerStorage.getStoredData.call({ from: accounts[0] });
      const user2storedData = await ownerStorage.getStoredData.call({ from: accounts[1] });
      
      // verify we changed the subject
      assert.equal(user1storedData, 1, `user1storedData: ${user1storedData} was not 1!`);
      assert.equal(user2storedData, 2, `user1storedData: ${user2storedData} was not 2!`);
    
    });

  });

  
  describe("Getting values for a specified address", () => {

    it('should return the specified user\'s value when called by contract owner', async () => {
        // get subject
        const ownerStorage = await OwnerStorage.deployed();

        // Set the values for the first three users to 1, 2 respectively.
        await ownerStorage.setStoredData(1, { from: accounts[0] });
        await ownerStorage.setStoredData(2, { from: accounts[1] });

        // get the actual values now
        const user1storedData = await ownerStorage.getCount.call(accounts[0], { from: accounts[0] });
        const user2storedData = await ownerStorage.getCount.call(accounts[1], { from: accounts[0] });
        
        // verify we changed the subject
        assert.equal(user1storedData, 1, `user1storedData: ${user1storedData} was not 1!`);
        assert.equal(user2storedData, 2, `user1storedData: ${user2storedData} was not 2!`);
    })

    it('should reject when called by a user who is not the contract owner', async () => {
        // get subject
        const ownerStorage = await OwnerStorage.deployed();

        // a non-owner calling getCount for any user should revert
        await truffleAssert.reverts(ownerStorage.getCount.call(accounts[0], { from: accounts[1] }));
        await truffleAssert.reverts(ownerStorage.getCount.call(accounts[2], { from: accounts[2] }));
    })

  })

});
