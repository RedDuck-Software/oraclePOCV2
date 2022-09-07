//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SignatureVerify {
    using ECDSA for bytes32;

    address _blacklistContract;
    mapping (address => bool) _blacklistedUsers;

    constructor(address _blacklist){
        _blacklistContract = _blacklist;
    }

    function recover2(bytes32 message, bytes calldata signature) public pure returns (address) {
        address result = message.recover(signature);
        return result;
    }

    // function serializeTransaction(uint8 v, bytes32 r, bytes32 s, uint nonce, uint maxPriorityFeePerGas, uint maxFeePerGas, uint gasLimit, address to, uint value)

    // function report(address to, uint256 gasLimit, uint8 _v, bytes32 _r, bytes32 _s,) public {
    //     recoverMessage(to, gasLimit)
    // }

    // function report2(address to, uint256 gasLimit, uint256 maxGas, uint8 _v, bytes32 _r, bytes32 _s,) public {
    //     recoverMessage(to, gasLimit, maxGas)
    // }
}
