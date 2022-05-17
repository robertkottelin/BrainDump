// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract InputData {
    string public info;

    function setInfo(string memory _info) public {
        info = _info;
    }

    function getInfo() public view returns (string memory) {
        return info;
    }
}
