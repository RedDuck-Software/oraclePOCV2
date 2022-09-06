//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SignatureVerify {
    address blacklistContract;
    mapping (address => bool) blacklistedUsers;

    constructor(address _blacklist){
        blacklistContract = _blacklist;
    }

    // function report(address to, uint256 gasLimit, uint8 _v, bytes32 _r, bytes32 _s,) public {
    //     recoverMessage(to, gasLimit)
    // }

    // function report2(address to, uint256 gasLimit, uint256 maxGas, uint8 _v, bytes32 _r, bytes32 _s,) public {
    //     recoverMessage(to, gasLimit, maxGas)
    // }
}
