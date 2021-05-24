//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;

contract Ownable {
    
    address public _owner;

    constructor() public {
      _owner = msg.sender;
    }

}
