// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import './Proxy.sol';

contract UpgradeabilityProxy is Proxy {
    event Upgraded(address indexed implementation);

    bytes32 private constant implementationPosition = keccak256("proxy.implementation");

    function implementation() public view override returns (address target) {
        bytes32 impl = implementationPosition;
        assembly {
            target := sload(impl)
        }
    }

    function _setImplementation(address newImplementation) internal {
        bytes32 impl = implementationPosition;
        assembly {
            sstore(impl, newImplementation)
        }
    }

    function _upgradeTo(address _impl) internal {
        address currentImpl = implementation();
        require(currentImpl != _impl, "Duplicate upgrade");
        _setImplementation(_impl);
        emit Upgraded(_impl);
    }
}
