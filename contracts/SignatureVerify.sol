//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.10;

import "hardhat/console.sol";

import "./utils/RLPReader.sol";
import "./utils/ECDSA.sol";
import "./utils/Ownable.sol";
import "./utils/IPermissionOracle.sol";

contract SignatureVerify is Ownable, IPermissionOracle {
    using RLPReader for RLPReader.RLPItem;
    using RLPReader for bytes;
    using ECDSA for bytes32;

    mapping(address => bool) private _blacklistedContracts;
    mapping(address => bool) public blacklistedUsers;

    // constructor() Ownable() public {}

    function report(bytes memory message, bytes calldata signature)
        external
        returns (address)
    {
        address to = _rlpToTo(message);
        if (_blacklistedContracts[to]) {
            address from = keccak256(message).recover(signature);
            blacklistedUsers[from] = true;
            console.log(from);
        }
        return to;
    }

    function addBlacklistedContract(address contractAddress)
        external
        onlyOwner
    {
        _blacklistedContracts[contractAddress] = true;
    }

    function _rlpToTo(bytes memory message) private pure returns (address) {
        (bytes1 txType, bytes memory rlpBytes) = _splitBytesFromRLPTransaction(
            message
        );
        RLPReader.RLPItem[] memory ls = rlpBytes.toRlpItem().toList();

        if (txType == 0x01) {
            return ls[4].toAddress();
        } else if (txType == 0x02) {
            return ls[5].toAddress();
        } else {
            return ls[3].toAddress();
        }
    }

    function _splitBytesFromRLPTransaction(bytes memory data)
        private
        pure
        returns (bytes1, bytes memory)
    {
        bytes memory prefix = new bytes(1);
        bytes memory suffix = new bytes(data.length - 1);

        for (uint256 i = 0; i < data.length; i++) {
            if (i < 1) prefix[i] = data[i];
            else suffix[i - 1] = data[i];
        }

        bytes1 txType = prefix[0];
        if (txType != 0x01 && txType != 0x02) {
            return (0x00, data);
        }
        return (txType, suffix);
    }

    function isGranted(
        address _where,
        address _who,
        bytes32 _permissionId,
        bytes calldata _data
    ) override external view returns (bool allowed) {
        allowed = !blacklistedUsers[_who];
    }
}
