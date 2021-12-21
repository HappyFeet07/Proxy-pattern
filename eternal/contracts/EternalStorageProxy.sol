// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import './EternalStorage.sol';
import './OwnedUpgradeabilityProxy.sol';

contract EternalStorageProxy is EternalStorage, OwnedUpgradeabilityProxy {}
