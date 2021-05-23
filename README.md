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

So, let's create a test that does the bare minimum to check that our contract exists error and can be deployed.

owner-storage.js

```
const OwnerStorage = artifacts.require("OwnerStorage");

contract("OwnerStorage", function (accounts) {
  describe("Initial deployment", async () => {
    it("should assert true", async function () {
      await OwnerStorage.deployed();
      assert.isTrue(true);
    });
  });
```


When we run this we should see an error that "OwnerStorage" does not exist, so let's make it!

/contracts/OwnerStorage.sol
```
//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;

contract OwnerStorage {


}
```

## Describing The New Functionality

Okay, now let's write a new test that describes our new functinality.

Here I'll just look at two different users, the first and second account of our array created by truffle.

Notice that this test is extremely similar to our SimpleStorage test!

The only difference is that we are calling "setStoredData" twice, calling once as each of our users.

Then we are reading the value for each user, and asserting that that are equal to 1 and 2, respectively.

```
describe("Functionality", () => {

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
```


Great! Looks like a nice test to me, so let's run it and look at the output:

```
 4 passing (281ms)
  1 failing

  1) Contract: OwnerStorage
       Functionality
         should store a value for each user:
     TypeError: ownerStorage.setStoredData is not a function
      at Context.<anonymous> (test/owner-storage.js:19:26)
      at processTicksAndRejections (internal/process/task_queues.js:95:5)
```


Right, I guess we'll need to add some functions into that OwnerStorage contract!

We can have functions here with the same names as SimpleStorage, `getStoredData` and `setStoredData`.

Let's just put some empty functions into our contract for now:

```
function getStoredData() public view returns (uint256) {

}

function setStoredData(uint256 x) public {

}
```

Let's rerun the tests, and we can see they now fail for a new reason (hey, it's progress!)

```
 4 passing (445ms)
  1 failing

  1) Contract: OwnerStorage
       Functionality
         should store a value for each user:
     AssertionError: user1storedData: 0 was not 1!: expected <BN: 0> to equal 1
      at Context.<anonymous> (test/owner-storage.js:27:14)
      at processTicksAndRejections (internal/process/task_queues.js:95:5)

```


Ok, this is great. We have a really good test, and we're ready to implement code...

BUT, seeing this 0 in the output just reminded we that we can write a test for the "zero condition" for OwnerStorage as well.

All we have to not is _not_ set anything initially! We just go right into asserting that each user's value is 0.

```
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
```

This one passes now, but we'll also want to make sure it continuous to pass as we code out the real implmentation for our OwnerStorage functions.


## Creating The Mapping

Ok, _now_ we can actually get to writing the business logic of saving each user's value! 

In Solidity we hav the keyword `mapping` to create our hashmap style data structure, but when defining it we need to be explicit about the type for our keys and values. 

The values can be of type uint256 (just to be consistent with the original webinar 1 code), but what type do we use for for our user identifier? 🤔

A key thing to remember is the global variable `msg` that we have access to, and the property we acre about here is called `sender`. 

Feel free to play around with `msg.sender` in a separate _spike project._ You should see that Solidity uses a special type `address` to refer to this user's unique identifier, which is also just their wallet address.

Phew, ok so after all that theory we have decided that we want to have a mapping of addresses to uints, and I'll name the mapping `UserToNumber`.

```
mapping (address -> uint256) UserToNumber;
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






