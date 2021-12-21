// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import './Proxy.sol';
import './UpgradeabilityStorage.sol';

abstract contract UpgradeabilityProxy is Proxy, UpgradeabilityStorage {
  event Upgraded(string version, address indexed implementation);

  function implementation() public view override returns (address) {
    return _implementation;
  }

  function _upgradeTo(string memory version_, address implementation_) internal {
    require(_implementation != implementation_);
    _version = version_;
    _implementation = implementation_;
    emit Upgraded(version_, implementation_);
  }
}
