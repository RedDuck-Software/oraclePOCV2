//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

import "hardhat/console.sol";
import "solidity-rlp/contracts/RLPReader.sol";


/*
    type2
    const fields: any = [
        formatNumber(transaction.chainId || 0, "chainId"),
        formatNumber(transaction.nonce || 0, "nonce"),
        formatNumber(transaction.maxPriorityFeePerGas || 0, "maxPriorityFeePerGas"),
        formatNumber(transaction.maxFeePerGas || 0, "maxFeePerGas"),
        formatNumber(transaction.gasLimit || 0, "gasLimit"),
        ((transaction.to != null) ? getAddress(transaction.to): "0x"),
        formatNumber(transaction.value || 0, "value"),
        (transaction.data || "0x"),
        (formatAccessList(transaction.accessList || []))
    ];

    type1
    const fields: any = [
        formatNumber(transaction.chainId || 0, "chainId"),
        formatNumber(transaction.nonce || 0, "nonce"),
        formatNumber(transaction.gasPrice || 0, "gasPrice"),
        formatNumber(transaction.gasLimit || 0, "gasLimit"),
        ((transaction.to != null) ? getAddress(transaction.to): "0x"),
        formatNumber(transaction.value || 0, "value"),
        (transaction.data || "0x"),
        (formatAccessList(transaction.accessList || []))
    ];

*/

contract SignatureVerify {
    using RLPReader for RLPReader.RLPItem;
    using RLPReader for RLPReader.Iterator;
    using RLPReader for bytes;


    address _blacklistContract;
    mapping (address => bool) _blacklistedUsers;

    constructor(address _blacklist) public {
        _blacklistContract = _blacklist;
    }

    function report(bytes memory rlpBytes) public {
        RLPReader.RLPItem[] memory ls = rlpBytes.toRlpItem().toList();
        RLPReader.RLPItem memory item = ls[0];
        console.log(item.toUint());
    }

    function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        return ecrecover(hash, v, r, s);
    }

    // function serializeTransaction(uint8 v, bytes32 r, bytes32 s, uint nonce, uint maxPriorityFeePerGas, uint maxFeePerGas, uint gasLimit, address to, uint value)

    // function report(address to, uint256 gasLimit, uint8 _v, bytes32 _r, bytes32 _s,) public {
    //     recoverMessage(to, gasLimit)
    // }

    // function report2(address to, uint256 gasLimit, uint256 maxGas, uint8 _v, bytes32 _r, bytes32 _s,) public {
    //     recoverMessage(to, gasLimit, maxGas)
    // }
}
