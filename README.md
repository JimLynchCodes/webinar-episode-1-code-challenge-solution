# Webinar Episode 1 Code Challenge Solutio

This is my solution to the code challenge at the end of the code challenge at the end of the [REAMDE file](https://github.com/trufflesuite/webinar-episode-01) for the [Truffle Webinar](https://www.crowdcast.io/e/truffle-webinar-series-episode1).

## What We Have Already

So, from episode 1 we have a Solidity contract called `SimpleStorage` with two functions, `getStoredData` and `setStoredData` which respectively read and write some unsigned integer to and from the blockchain.

```
//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;

contract SimpleStorage {
    uint256 public storedData;

    function getStoredData() public view returns (uint256) {
        return storedData;
    }

    function setStoredData(uint256 x) public {
        storedData = x;
    }
}
```

We also have this nice JavaScript test file that verifies that our contract can do these things:

  - it can be compiled and deployed with no errors.
  - it has an initial value of 0 when first deployed.
  - it stores some positive integer.

Here's the full code file:

```
const SimpleStorage = artifacts.require("SimpleStorage");

contract("SimpleStorage", function (accounts) {
  describe("Initial deployment", async () => {
    it("should assert true", async function () {
      await SimpleStorage.deployed();
      assert.isTrue(true);
    });

    it("was deployed and it's intial value is 0", async () => {
      // get subject
      const ssInstance = await SimpleStorage.deployed();
      // verify it starts with zero
      const storedData = await ssInstance.getStoredData.call();
      assert.equal(storedData, 0, `Initial state should be zero`);
    });
  });
  describe("Functionality", () => {
    it("should store the value 42", async () => {
      // get subject
      const ssInstance = await SimpleStorage.deployed();

      // change the subject
      await ssInstance.setStoredData(42, { from: accounts[0] });

      // verify we changed the subject
      const storedData = await ssInstance.getStoredData.call();
      assert.equal(storedData, 42, `${storedData} was not stored!`);
    });
  });
});
```

We also have a migration file which we need once we want to deploy:
```
const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
}
```

Okay! Now that we've gone over where we're starting from here, let's review what the code challenge wants us to do.

<br/>

## Code Challenge 

- a mapping mapping[address => uint] and update it every time someone calls setStoredData
- a function getCount(address _address) that returns the count associated with _address
- a modifier to guard that only the owner can call getCount which should revert when invoked with the wrong caller.
- This Truffle Assertion plugin which helps test for revert.


## Starting With New Tests




