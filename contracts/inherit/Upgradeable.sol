// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './UpgradeabilityStorage.sol';

abstract contract Upgradeable is UpgradeabilityStorage {
    function initialize(address sender) external virtual payable {
        require(sender == address(registry));
    }
}
