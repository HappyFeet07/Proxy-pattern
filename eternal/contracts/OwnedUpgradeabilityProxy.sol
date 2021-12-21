// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import './UpgradeabilityProxy.sol';
import './UpgradeabilityOwnerStorage.sol';

contract OwnedUpgradeabilityProxy is UpgradeabilityOwnerStorage, UpgradeabilityProxy {

    event ProxyOwnershipTransferred(address previousOwner, address newOwner);

    constructor() {
        setUpgradeabilityOwner(msg.sender);
    }

    modifier onlyProxyOwner() {
        require(msg.sender == proxyOwner());
        _;
    }

    function proxyOwner() public view returns (address) {
        return upgradeabilityOwner();
    }

    function transferProxyOwnership(address newOwner) public onlyProxyOwner {
        require(newOwner != address(0));
        ProxyOwnershipTransferred(proxyOwner(), newOwner);
        setUpgradeabilityOwner(newOwner);
    }
  
    function upgradeTo(string memory version_, address implementation_) public onlyProxyOwner {
        _upgradeTo(version_, implementation_);
    }

    function upgradeToAndCall(string memory version_, address implementation_, bytes memory data) payable public onlyProxyOwner {
        upgradeTo(version_, implementation_);
        (bool success,) = address(this).call{value: msg.value}(data);
        require(success, "Call failed");
    }
}
