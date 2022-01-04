// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library ChimpLibrary {
    function calculateRoyalties(uint256 amount, uint256 royaltiesBips)
        internal
        pure
        returns (uint256, uint256)
    {
        uint256 royaltiesAmount = (amount / 10000) * royaltiesBips;
        uint256 amountAfterRoyalties = amount - royaltiesAmount;

        return (amountAfterRoyalties, royaltiesAmount);
    }
}
