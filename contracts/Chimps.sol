// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import "./base/ERC721WithSale.sol";

contract Chimps is ERC721WithSale {
    using Strings for uint256;
    using Address for address payable;

    uint256 public mintPrice;
    uint256 public saleStartTimestamp;
    uint256 public chimpsRemainingToAssign;
    string public baseURIValue;

    mapping(uint256 => uint256) private assignOrders;

    constructor(
        uint256 _mintPrice,
        string memory _baseURIValue,
        uint256 _saleStartTimestamp,
        uint256 _royaltiesBips,
        uint256 _maxSupply
    ) ERC721WithSale("CuteChimps", "CHIMP", _royaltiesBips, _maxSupply) {
        mintPrice = _mintPrice;
        saleStartTimestamp = _saleStartTimestamp;
        chimpsRemainingToAssign = _maxSupply;
        baseURIValue = _baseURIValue;
    }

    function updateBaseURIValue(string memory _baseURIValue) public onlyOwner {
        baseURIValue = _baseURIValue;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURIValue;
    }

    event UpdateMintPrice(uint256 newMintPrice);

    function updateMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
        emit UpdateMintPrice(_mintPrice);
    }

    function updateSaleStartTimestamp(uint256 _saleStartTimestamp) public onlyOwner {
        saleStartTimestamp = _saleStartTimestamp;
    }

    function _random() internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp +
                            block.difficulty +
                            block.gaslimit +
                            block.number +
                            ((uint256(keccak256(abi.encodePacked(block.coinbase)))) / block.timestamp) +
                            ((uint256(keccak256(abi.encodePacked(_msgSender())))) / block.timestamp)
                    )
                )
            ); // no need to use % chimpsRemainingToAssign as it is done in _mintChimp anyway
    }

    function _fillAssignOrder(uint256 orderA, uint256 orderB) internal returns (uint256) {
        uint256 temp = orderA;
        if (assignOrders[orderA] > 0) {
            temp = assignOrders[orderA];
        }

        assignOrders[orderA] = orderB;

        if (assignOrders[orderB] > 0) {
            assignOrders[orderA] = assignOrders[orderB];
        }

        assignOrders[orderB] = temp;
        return assignOrders[orderA];
    }

    function getMintPrice(uint256 number) public view returns (uint256) {
        return number * mintPrice;
    }

    function adminMintChimp(uint256 number, address recipient) public onlyOwner {
        require(block.timestamp < saleStartTimestamp, "Sale has already started");
        _mintChimp(number, recipient, false);
    }

    function mintChimp(uint256 number) public payable {
        require(block.timestamp >= saleStartTimestamp, "Sale has not yet started");
        require(number <= 10, "Can only mint a maximum of 10 chimps");
        require(msg.value == getMintPrice(number), "Incorrect payment amount");
        // ?: requires for number>0 and within total supply are checked in _mintChimp

        _mintChimp(number, _msgSender(), true);
    }

    // ?: use this event to pass data to frontend. return values of non pure or view functions cannot be passed to frontend
    event ChimpsMinted(uint256[] tokenIds, address buyer);

    function _mintChimp(
        uint256 number,
        address recipient,
        bool random
    ) private {
        // ?: ensure that the totalSupply will not be reached even after the new chimps are minted
        require(totalSupply() < maxSupply, "All chimps have already been minted");
        require(number > 0, "Cannot mint 0 chimps");
        require(((number + totalSupply()) <= maxSupply), "Exceeds max supply of chimps");

        uint256[] memory tokenIdsBought = new uint256[](number);

        for (uint256 i = 0; i < number; i++) {
            uint256 randIndex = (random ? _random() : totalSupply()) % chimpsRemainingToAssign;
            chimpsRemainingToAssign--;
            uint256 chimpIndex = _fillAssignOrder(chimpsRemainingToAssign, randIndex);

            _safeMint(recipient, chimpIndex);
            tokenIdsBought[i] = chimpIndex;
        }

        // ?: transfer the ETH to the owner
        payable(owner()).sendValue(msg.value);
        emit ChimpsMinted(tokenIdsBought, recipient); // ?: this event is used by frontend to get the nft IDs minted
    }

    // ?: overriden functions do not need to call super
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Chimp does not exist");
        return string(abi.encodePacked(_baseURI(), tokenId.toString(), ".json"));
    }
}
