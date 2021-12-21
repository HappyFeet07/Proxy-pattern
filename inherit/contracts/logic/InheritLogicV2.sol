// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import '../Upgradeable.sol';

contract InheritLogicV2 is Upgradeable {
    
    address public importantDataA;
    uint256 public importantDataB;
    bytes32 public importantDataC;

    function initialize(address sender) external payable override {
        importantDataA = sender;
    }

    function updateB(uint256 B) external {
        importantDataB = B;
    }
    
    function getSlot(uint256 slot) external view returns(bytes32 n) {
        assembly {
            n := sload(slot)
        }
    }

    function setSlot(uint256 slot, uint256 num) external {
        assembly {
            sstore(slot, num)
        }
    }

    function setSlot(uint256 slot, address newAddr) external {
        assembly {
            sstore(slot, newAddr)
        }
    }
}
