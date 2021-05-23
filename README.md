# Webinar Episode 1 Code Challenge Solution

This is my solution to the code challenge at the end of the code challenge at the end of the [REAMDE file](https://github.com/trufflesuite/webinar-episode-01) for the [Truffle Webinar](https://www.crowdcast.io/e/truffle-webinar-series-episode1).


<br/>


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

We also have a migration file which we need to deploy to a local or network blockchain:
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


<br/>


## Thinking About The Behavior

It's important to make sure you understand the behavior before you start coding. What I think they are asking for here is a mapping stored on the blockchain (similar to a hashmap in other languages) where the _keys_ are the id of the user calling "setStoredData", and the values of the mapping are the number which the user has last set his or user value to (with 0 as the default).

Then we also want a "getCount" function which can only be called by the contract owner, and this function should basically return the number of keys that are in our mapping.


<br/>


## Naming Our New Contract

Naming things can be hard! It can also be hard to know sometimes whether you should make a new file or modify an existing file...

In this case, I have decided to make a new contract named `OwnerStorage`.

<br/>


## Creating New Files For Our New Contract 

Remeber, TDD means you write the tests first!

So, let's create a test that checks that our contract doesn't error and can be deployed:

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





<br/>


## Starting With Our Current Tests

Many of the things that were true about our SimpleStorage contract are also true about OwnerStorage.

In fact these two tests can be exactly the same for our OwnerStorage contract:


    - it can be compiled and deployed with no errors.
    - it has an initial value of 0 when first deployed.
    
    
    
    
    
    
    
    
<br/>

    
## Storing Values In A Mapping
   
Note the last test we had in SimpleStorage, "it stores some positive integer".

Things are a bit more nuanced with our new desired behavior in OwnerStorage- we want users to be able to store _their own_ values rather than everyone overwriting the one, global number.

So, I'm going to start











<br/>



## Building The GetCount Function






