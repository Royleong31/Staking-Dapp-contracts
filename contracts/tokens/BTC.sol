// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Bitcoin is ERC20 {
    constructor() ERC20("Bitcoin", "BTC") {
        // ?: mint a lot of tokens to the creator of the contract
        _mint(msg.sender, 2000000000000000000000000);
    }
}
