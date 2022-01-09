// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dai is ERC20 {
    constructor() ERC20("DAI", "DAI"){
        // ?: mint a lot of tokens to the creator of the contract
        _mint(msg.sender, 10000000000000000000000000);
    }
}