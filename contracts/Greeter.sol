//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

contract Greeter {
    string private _greeting;

    constructor(string memory greeting) public {
        _greeting = greeting;
    }

    function greet() public view returns (string memory) {
        return _greeting;
    }

    function setGreeting(string memory greeting) public {
        _greeting = greeting;
    }
}
