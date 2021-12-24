//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import './UpgradeabilityProxy.sol';

contract TransparentUpgradeabilityProxy is UpgradeabilityProxy{

    event TransferProxyAdmin(address previousAdmin, address newAdmin);

    bytes32 private constant ADMIN_SLOT = keccak256("proxy.admin");
    
    constructor() {
        _setAdmin(msg.sender);
    }

    modifier isAdmin() {
        if (msg.sender == getAdmin()){
            _;
        } else {
            _fallback();
        }
    }
 
    function _getAdmin() internal view returns (address admin) {
        bytes32 location = ADMIN_SLOT;
        assembly {
            admin := sload(location)
        }
    }

    function getAdmin() public view returns(address) {
        return _getAdmin();
    }

    function _setAdmin(address newAdmin) internal {
        bytes32 location = ADMIN_SLOT;
        assembly {
            sstore(location, newAdmin)
        }
    }

    function upgradeTo(address newImpl) external isAdmin {
        _upgradeTo(newImpl);
    }

    function upgradeToCall(address newImpl, bytes memory data) external payable isAdmin {
        _upgradeTo(newImpl);
        (bool success, ) = address(this).call{value: msg.value}(data);
        require(success , "upgradeToCall Failed");
    }

    function changeProxyAdmin(address newAdmin) external isAdmin {
        _setAdmin(newAdmin);
        TransferProxyAdmin(msg.sender, newAdmin);
    }
}
