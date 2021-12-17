// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./proxy.sol";
import "./IRegistry.sol";
import "./IUpgradeable.sol";
import "./UpgradeabilityStorage.sol";

contract UpgradeabilityProxy is Proxy, UpgradeabilityStorage {

    constructor (string memory _version) {
        registry = IRegistry(msg.sender);
        upgradeTo(_version);
    }

    function implementation() public override view returns (address) {
        return _implementation;
    }
    
    function upgradeTo(string memory _version) public {
        _implementation = registry.getVersion(_version);
    }
}
