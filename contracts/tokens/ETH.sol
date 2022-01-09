// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Ether is ERC20 {
    constructor() ERC20("Ether", "ETH") {
        // ?: mint a lot of tokens to the creator of the contract
        _mint(msg.sender, 1000000000000000000000000);
    }
}
