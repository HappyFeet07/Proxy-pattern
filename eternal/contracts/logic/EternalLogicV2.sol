// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import './EternalLogicV1.sol';

contract EternalLogicV2 is EternalLogicV1 {
    
    event Withdraw(address account, uint256 amount);

    function withdraw(uint256 amount) external {
        require(balanceOf(msg.sender) > amount, "Withdraw more than balance");
        payable(msg.sender).transfer(amount);
        uintStorage[keccak256(abi.encodePacked('balanceOf', msg.sender))] -= amount;
        Withdraw(msg.sender, amount);
    }
}
