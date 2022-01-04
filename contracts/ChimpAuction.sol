// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./utils/ChimpLibrary.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract ChimpAuction is IERC721Receiver, Ownable {
    using Address for address payable;

    address public tokenContract;
    uint256 public uncollectedRoyalties = 0;
    mapping(uint256 => Auction) public chimpsOnAuction;

    struct Auction {
        bool isOnAuction;
        uint256 auctionEndTime;
        uint256 highestBid;
        address highestBidder;
        uint256 tokenId;
        address seller;
        uint256 startingBid;
    }

    constructor(address _tokenContract) {
        tokenContract = _tokenContract;
    }

    event PutChimpOnAuction(uint256 tokenId, address seller, uint256 startingBid, uint256 auctionEndTime);

    function putOnAuction(
        uint256 tokenId,
        uint256 startingBid,
        uint256 auctionEndTime
    ) public {
        require(auctionEndTime > block.timestamp + 60 * 60, "Auction needs to be at least 1h long");
        require(startingBid >= 1 ether, "Starting bid is has to be at least 1CRO");
        require(IERC721(tokenContract).ownerOf(tokenId) == _msgSender(), "only token owner can put chimp on auction");

        IERC721(tokenContract).safeTransferFrom(_msgSender(), address(this), tokenId);
        chimpsOnAuction[tokenId] = Auction(true, auctionEndTime, 0, address(0), tokenId, _msgSender(), startingBid);

        emit PutChimpOnAuction(tokenId, _msgSender(), startingBid, auctionEndTime);
    }

    event RefundBid(uint256 tokenId, uint256 amount, address recipient);
    event BidChimp(uint256 tokenId, uint256 bid, address from, uint256 auctionEndTime);

    function bidChimp(uint256 tokenId) public payable {
        Auction memory chimp = chimpsOnAuction[tokenId];
        require(chimp.auctionEndTime > block.timestamp, "Auction has ended");
        require(chimp.isOnAuction, "Chimp is not on auction");

        uint256 bid = msg.value;

        require(bid >= chimp.startingBid, "Bid is too low");
        require(bid >= ((chimp.highestBid * 105) / 100), "Bid must be at least 5% greater than the previous bid");

        uint256 newAuctionEndTime = chimp.auctionEndTime;

        // ?: if the bid is within 15min of auction end time, let the new end time be 15min after now
        if (block.timestamp + 15 * 60 >= chimp.auctionEndTime) {
            newAuctionEndTime = block.timestamp + 15 * 60;
        }

        chimpsOnAuction[tokenId] = Auction(true, newAuctionEndTime, bid, _msgSender(), tokenId, chimp.seller, chimp.startingBid);

        // ?: Refund the previous bidder who got outbid
        if ((chimp.highestBid != 0) && (chimp.highestBidder != address(0))) {
            payable(chimp.highestBidder).sendValue(chimp.highestBid);
            emit RefundBid(tokenId, chimp.highestBid, chimp.highestBidder);
        }

        emit BidChimp(tokenId, bid, _msgSender(), newAuctionEndTime);
    }

    event WinChimpAuction(uint256 tokenId, uint256 price, address winner);

    function winChimpAuction(uint256 tokenId) public {
        Auction memory chimp = chimpsOnAuction[tokenId];
        require(chimp.auctionEndTime < block.timestamp, "Auction has not yet ended");
        require(chimp.isOnAuction, "Chimp is not on auction");

        address seller = chimp.seller;
        chimpsOnAuction[tokenId] = Auction(false, 0, 0, address(0), tokenId, address(0), 0);

        (uint256 amountAfterRoyalties, uint256 royaltiesAmount) = ChimpLibrary.calculateRoyalties(chimp.highestBid, 500);
        payable(seller).sendValue(amountAfterRoyalties);

        uncollectedRoyalties += royaltiesAmount;

        IERC721(tokenContract).safeTransferFrom(address(this), chimp.highestBidder, tokenId);
        emit WinChimpAuction(tokenId, chimp.highestBid, chimp.highestBidder);
    }

    event RemoveFromAuction(uint256 tokenId, address seller);

    // ?: seller can still remove from auction after the auction ends, in the event that nobody bid for it
    function removeFromAuction(uint256 tokenId) public {
        Auction memory chimp = chimpsOnAuction[tokenId];
        require(chimp.seller == _msgSender(), "Only seller can remove chimp from auction");
        require(chimp.isOnAuction, "Chimp is not on auction");
        require(chimp.highestBid == 0, "Cannot remove chimp once someone has already bid");

        chimpsOnAuction[tokenId] = Auction(false, 0, 0, address(0), tokenId, address(0), 0);
        IERC721(tokenContract).safeTransferFrom(address(this), chimp.seller, tokenId);
        emit RemoveFromAuction(tokenId, chimp.seller);
    }

    event CollectRoyalties(uint256 amount);

    function collectRoyalties() public onlyOwner {
        uint256 amount = uncollectedRoyalties;
        require(amount > 0, "No royalties to collect");
        uncollectedRoyalties = 0; // ?: make all state changes before transferring ether

        payable(owner()).sendValue(amount);
        emit CollectRoyalties(amount);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
