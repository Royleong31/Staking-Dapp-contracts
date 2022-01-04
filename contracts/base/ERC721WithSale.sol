// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../utils/ChimpLibrary.sol";

contract ERC721WithSale is ERC721Enumerable, Ownable {
    using Address for address payable;
    using Strings for uint256; // ?: allows .toString() to be used on uint
    struct Sale {
        bool isForSale;
        uint256 tokenId;
        address seller;
        uint256 price;
    }

    mapping(uint256 => Sale) public chimpsForSale;
    uint256 public maxSupply;
    uint256 public volume;
    uint256 public royaltiesBips;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _royaltiesBips,
        uint256 _maxSupply
    ) ERC721(_name, _symbol) {
        maxSupply = _maxSupply;
        royaltiesBips = _royaltiesBips;

        require(royaltiesBips < 2500, "Royalties cannot exceed 25%");
    }

    modifier onlyTradableChimp(address from, uint256 tokenId) {
        require(_exists(tokenId), "Token ID does not exist");
        require(ownerOf(tokenId) == from, "Token ID does not belong to user");
        _;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);
        chimpsForSale[tokenId] = Sale(false, tokenId, address(0), 0);
    }

    event PutChimpForSale(uint256 tokenId, uint256 price, address from);

    function putChimpForSale(uint256 tokenId, uint256 price)
        public
        onlyTradableChimp(_msgSender(), tokenId)
    {
        require(price > 0, "Price cannot be 0");

        chimpsForSale[tokenId] = Sale(true, tokenId, _msgSender(), price);
        emit PutChimpForSale(tokenId, price, _msgSender());
    }

    event ChimpNoLongerForSale(uint256 tokenId, address from);

    function chimpNoLongerForSale(uint256 tokenId)
        public
        onlyTradableChimp(_msgSender(), tokenId)
    {
        // ?: instead of modifying the object's isForSale state, just reassign a new object
        chimpsForSale[tokenId] = Sale(false, tokenId, address(0), 0);
        emit ChimpNoLongerForSale(tokenId, _msgSender());
    }

    event ChimpBought(
        uint256 tokenId,
        uint256 value,
        uint256 sellerRevenue,
        uint256 royalties,
        address seller,
        address buyer
    );

    function buyChimp(uint256 tokenId) public payable {
        require(_exists(tokenId), "Chimp tokenId does not exist");
        Sale memory offer = chimpsForSale[tokenId];
        require(offer.isForSale, "Chimp is not for sale");
        require(msg.value == offer.price, "Incorrect amount");
        require(offer.seller == ownerOf(tokenId), "Wrong token owner"); // ?: not possible, but just in case

        address seller = offer.seller;
        _safeTransfer(seller, _msgSender(), tokenId, "");

        // !: IMPT to make all state changes before sending ether
        // ?: from dec 2019, call in combination with re-entrancy guards is preferred over send and transfer
        (uint256 amountAfterRoyalties, uint256 royaltiesAmount) = ChimpLibrary
            .calculateRoyalties(msg.value, royaltiesBips);

        volume += msg.value;

        payable(seller).sendValue(amountAfterRoyalties);
        payable(owner()).sendValue(royaltiesAmount);

        // (bool success1, ) = seller.call{value: amountAfterRoyalties}("");
        // require(success1, "Sending ether to seller failed");

        // (bool success2, ) = owner().call{value: royaltiesAmount}("");
        // require(success2, "Sending ether to owner failed");

        emit ChimpBought(
            tokenId,
            msg.value,
            amountAfterRoyalties,
            royaltiesAmount,
            seller,
            _msgSender()
        );
    }

    // ?: using named return values allows you to access the names in frontend, because the names are added in output part of ABI
    function getOnSaleTokenIds(uint256 start, uint256 end)
        public
        view
        returns (
            uint256[] memory tokenIds,
            address[] memory sellers,
            uint256[] memory prices
        )
    {
        uint256 max = end < maxSupply ? end : maxSupply;
        uint256 numOfTokensOnSale = 0;

        // ?: Need to use this method to first get the length for the 3 arrays below because .push() is not supported for memory arrays
        for (uint256 i = start; i < max; i++) {
            if (chimpsForSale[i].isForSale) numOfTokensOnSale++;
        }

        tokenIds = new uint256[](numOfTokensOnSale);
        sellers = new address[](numOfTokensOnSale);
        prices = new uint256[](numOfTokensOnSale);

        uint256 counter = 0;
        for (uint256 i = start; i < max; i++) {
            Sale memory chimp = chimpsForSale[i];

            if (chimp.isForSale) {
                tokenIds[counter] = i;
                sellers[counter] = chimp.seller;
                prices[counter] = chimp.price;
            }

            counter++;
        }

        return (tokenIds, sellers, prices);
    }
}
