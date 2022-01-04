// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

contract LibraryLock{
    // Ensures no one can manipulate the Logic Contract once it is deployed.
    // PARITY WALLET HACK PREVENTION
    bool public initialized;

    modifier delegatedOnly() {
        require(initialized == true, "The library is locked. No direct 'call' is allowed");
        _;
    }
    function _initialize() internal {
        initialized = true;
    }
}
