// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import './LogicV1.sol';

contract LogicV2 is LogicV1 {
    
    event Withdraw(address account, uint256 amount);

    function withdraw(uint256 amount) external {
        require(balanceOf(msg.sender) > amount, "Withdraw more than balance");
        payable(msg.sender).transfer(amount);
        balance[msg.sender] -= amount;
        emit Withdraw(msg.sender, amount);
    }
}