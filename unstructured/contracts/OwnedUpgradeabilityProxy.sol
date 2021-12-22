// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import './UpgradeabilityProxy.sol';

contract OwnedUpgradeabilityProxy is UpgradeabilityProxy {

    event TransferProxyOwnership(address oldOwner, address newOwner);

    bytes32 private constant proxyOwnerPosition = keccak256("proxy.Owner");

    constructor() {
        _setProxyOwner(msg.sender);
    }
    modifier onlyOwner() {
        require(msg.sender == proxyOwner(), "Sender isn't proxy owner");
        _;
    }

    function proxyOwner() public view returns (address owner) {
        bytes32 location = proxyOwnerPosition;
        assembly {
            owner := sload(location)
        }
    }

    function _setProxyOwner(address newOwner) internal {
        bytes32 location = proxyOwnerPosition;
        assembly {
            sstore(location, newOwner)
        }
    }

    function transferOwnership(address newOwner) external onlyOwner {
        _setProxyOwner(newOwner);
        emit TransferProxyOwnership(proxyOwner(), newOwner);
    }

    function upgradeTo(address newImpl) external onlyOwner {
        _upgradeTo(newImpl);
    }


    function upgradeToCall(address newImpl, bytes memory data) external payable onlyOwner {
        _upgradeTo(newImpl);
        (bool success, ) = address(this).call{value: msg.value}(data);
        require(success , "upgradeToCall Failed");
    }
}
