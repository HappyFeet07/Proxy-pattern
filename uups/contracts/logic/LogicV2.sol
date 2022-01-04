// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import './Proxiable.sol';
import './DataLayout.sol';
import './LibraryLock.sol';

contract LogicV2 is Proxiable, DataLayout, LibraryLock {

    event Deposit(address account, uint256 amount);
    event Withdraw(address account, uint256 amount);

    function initialize() external {
        _initialize();
    }

    function deposit() delegatedOnly external payable {
        balance[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function balanceOf(address account) public view returns(uint256 ret) {
        ret = balance[account];
    }

    function withdraw(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Withdraw more than balance");
        payable(msg.sender).transfer(amount);
        balance[msg.sender] -= amount;
        emit Withdraw(msg.sender, amount);
    }

    function updateCode(address newAddress) external delegatedOnly {
        updateCodeAddress(newAddress);
    }

}