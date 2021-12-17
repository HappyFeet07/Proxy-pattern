// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './UpgradeabilityStorage.sol';
import './IUpgradeable.sol';

abstract contract Upgradeable is UpgradeabilityStorage, IUpgradeable {
    function initialize(address sender) external virtual override payable {
        require(sender == address(registry));
    }
}
