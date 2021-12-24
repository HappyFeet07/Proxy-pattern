// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

contract LogicV1 {

    mapping(address => uint256) balance;
    address public owner; 
    event Deposit(address account, uint256 amount);

    function deposit() external payable {
        balance[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function balanceOf(address account) public view returns(uint256 ret) {
        ret = balance[account];
    }

    function upgradeTo(address _impl) external {
        owner = _impl;
    }
}
