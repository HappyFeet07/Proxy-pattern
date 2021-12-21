// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './IRegistry.sol';
import './Upgradeable.sol';
import './UpgradeabilityProxy.sol';

contract Registry is IRegistry {
    mapping (string => address) internal versions;

    function addVersion(string memory version, address implementation) external override {
        require(versions[version] == address(0));
        versions[version] = implementation;
        emit VersionAdded(version, implementation);
    }

    function getVersion(string memory version) external override view returns (address) {
        return versions[version];
    }

    function createProxy(string memory version) public payable returns (UpgradeabilityProxy) {
        UpgradeabilityProxy proxy = new UpgradeabilityProxy(version);
        address(proxy).call(abi.encodeWithSignature("initialize(address)", address(this)));
        emit ProxyCreated(address(proxy));
        return proxy;
    }
}
