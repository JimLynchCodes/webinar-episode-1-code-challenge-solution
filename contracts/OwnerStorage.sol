//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;

import "./Ownable.sol";

contract OwnerStorage is Ownable {

    mapping(address => uint256) UserToNumber;

    function getStoredData() public view returns (uint256) {
        return UserToNumber[msg.sender];
    }

    function setStoredData(uint256 num) public {
        UserToNumber[msg.sender] = num;
    }

    modifier onlyOwner {
        require(msg.sender == _owner);
        _;
    }

    function getCount(address _address) public view onlyOwner returns (uint256) {
        return UserToNumber[_address];
    }

}
