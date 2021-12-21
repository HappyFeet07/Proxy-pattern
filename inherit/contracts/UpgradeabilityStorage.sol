// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IRegistry.sol";

contract UpgradeabilityStorage {

    address internal _implementation;
    uint256 internal importantUint256;
    address internal importantAddress;
    bytes32 internal importantString;
    IRegistry internal registry;
}
