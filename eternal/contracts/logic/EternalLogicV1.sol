// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import '../EternalStorage.sol';

contract EternalLogicV1 is EternalStorage {

    event Deposit(address account, uint256 amount);

    function deposit() external payable {
        uintStorage[keccak256(abi.encodePacked('balanceOf', msg.sender))] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function balanceOf(address account) public view returns(uint256) {
        return uintStorage[keccak256(abi.encodePacked('balanceOf', account))];
    }
}
