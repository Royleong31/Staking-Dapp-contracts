// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/* DESCRIPTION
- Users can deposit approved tokens into the contract, such as fake BTC/ETH/DAI ERC20 tokens into the contract
- owner can issue staking rewards to be paid for in wei. 1 wei for each usd value of the tokens staked 
- users can stake and unstake at any time
*/

contract Staking is Ownable {
    using Address for address payable;

    // TODO: IERC20 => balance. balance of each token so that TVL can be calculated in frontend
    mapping(IERC20 => mapping(address => uint256)) public stakingBalances; // ?: token to user to balance
    mapping(address => uint256) public uniqueTokensStaked; // ?: user address => num of unique tokens
    mapping(IERC20 => address) public tokenPriceFeed; // ?: if a token addresses with price feeds are allowed tokens
    address[] public stakers; // ?: each staker needs to have at least 1 token staked. pop() address from array once a user unstakes all of his tokens
    IERC20[] public allowedTokens;

    // constructor() {}

    function numberOfStakers() public view returns (uint256) {
        return stakers.length;
    }

    function numberOfAllowedTokens() public view returns (uint256) {
        return allowedTokens.length;
    }

    function isTokenAllowed(IERC20 _tokenAddress) public view returns (bool) {
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            if (_tokenAddress == allowedTokens[i]) return true;
        }
        return false;
    }

    modifier tokenIsAllowed(IERC20 _tokenAddress) {
        require(isTokenAllowed(_tokenAddress), "Token is not allowed");
        _;
    }

    function getStakerIndex(address _client) public view returns (int256) {
        for (uint256 i = 0; i < stakers.length; i++) {
            if (stakers[i] == _client) return int256(i); // ?: return the index if _client is a staker
        }

        return -1; // ?: return -1 if _client is not a staker
    }

    event StakeTokens(IERC20 tokenAddress, address staker);
    // !: approval needs to be done before this function is called
    function stakeTokens(IERC20 _tokenAddress, uint256 _amount) public tokenIsAllowed(_tokenAddress) {
        require(_amount > 0, "Staking amount must be greater than 0");
        // ?: allowance check is done in the transferFrom function
        IERC20(_tokenAddress).transferFrom(_msgSender(), address(this), _amount);

        // ?: if msg.sender is not already a staker, add him to stakers[] and set uniqueTokensStaked to 1 since it's his first token
        if (getStakerIndex(_msgSender()) == -1) {
            stakers.push(_msgSender());
        }

        // ?: if you have no _tokenAddress staked, increase uniqueTokensStaked by 1.
        if (stakingBalances[_tokenAddress][_msgSender()] == 0) {
            uniqueTokensStaked[_msgSender()] += 1;
        }

        stakingBalances[_tokenAddress][_msgSender()] += _amount;
        emit StakeTokens(_tokenAddress, _msgSender());
    }

    event UnstakeTokens(IERC20 tokenAddress, address unstaker);
    function unstakeTokens(IERC20 _tokenAddress, uint256 _amount) public tokenIsAllowed(_tokenAddress) {
        require(_amount > 0, "Staking amount must be greater than 0");
        require(stakingBalances[_tokenAddress][_msgSender()] >= _amount, "Staked balance is lower than unstaking amount");

        stakingBalances[_tokenAddress][_msgSender()] -= _amount;

        // ?: if this user no longer has any of this token staked, decrease uniqueTokensStaked
        if (stakingBalances[_tokenAddress][_msgSender()] == 0) {
            uniqueTokensStaked[_msgSender()] -= 1;
        }

        // ?: if the user has no more unique tokens after unstaking this one, remove him from the stakers[]
        int256 stakerIndex = getStakerIndex(_msgSender());
        if (uniqueTokensStaked[_msgSender()] == 0 && (stakerIndex != -1)) {
            stakers[uint256(stakerIndex)] = stakers[stakers.length - 1];
            stakers.pop();
        }

        IERC20(_tokenAddress).transfer(_msgSender(), _amount);
        emit UnstakeTokens(_tokenAddress, _msgSender());
    }

    function addAllowedToken(IERC20 _tokenAddress, address _oracleAddress) public onlyOwner {
        if (!isTokenAllowed(_tokenAddress)) {
            allowedTokens.push(_tokenAddress);
        }
        tokenPriceFeed[_tokenAddress] = _oracleAddress;
    }

    function getTokenValue(IERC20 _tokenAddress)
        public
        view
        tokenIsAllowed(_tokenAddress)
        returns (int256 price, uint8 decimals)
    {
        address priceFeedAddress = tokenPriceFeed[_tokenAddress];
        AggregatorV3Interface oracle = AggregatorV3Interface(priceFeedAddress);

        (, price, , , ) = oracle.latestRoundData();
        decimals = oracle.decimals();
    }

    function getUserSingleTokenUSDValue(address _user, address _tokenAddress)
        public
        view
        tokenIsAllowed(IERC20(_tokenAddress))
        returns (uint256)
    {
        uint256 userTokenBalance = stakingBalances[IERC20(_tokenAddress)][_user];
        if (userTokenBalance == 0) return 0;

        uint8 tokenDecimals = ERC20(_tokenAddress).decimals();

        (int256 price, uint8 decimals) = getTokenValue(IERC20(_tokenAddress));
        // ?: userTokenBalance has 18 decimals, so divide it by 10**18.
        // ?: price from the oracle has <decimals> number of decimals, so divide by 10**decimals
        return (uint256(price) * userTokenBalance) / (10**decimals) / (10**tokenDecimals);
    }

    function getUserTotalUSDValue(address _user) public view returns (uint256) {
        if (uniqueTokensStaked[_user] == 0) return 0; // ?: if no tokens staked, value=0

        uint256 totalUSDValue = 0;
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            totalUSDValue += getUserSingleTokenUSDValue(_user, address(allowedTokens[i]));
        }

        return totalUSDValue;
    }

    // TODO: get TVL

    // ?: in wei, since the reward is 1 wei for $1 of staked token USD value
    function totalStakingRewards() public view returns (uint256) {
        uint256 total = 0;

        for (uint256 i = 0; i < stakers.length; i++) {
            total += getUserTotalUSDValue(stakers[i]);
        }

        return total;
    }

    // !: extremely gas inefficient way to issue tokens
    function issueTokens() public onlyOwner {
        require(address(this).balance >= totalStakingRewards(), "Contract has insufficient ETH for token issuance");

        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 userTotalUSDValue = getUserTotalUSDValue(recipient);

            payable(recipient).sendValue(userTotalUSDValue); // ?: 1 wei for each USD that their tokens are worth
        }
    }

    event Received(address, uint256);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function contractEthBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // ?: return all eth back to the owner
    function rug() public onlyOwner {
        payable(owner()).sendValue(address(this).balance);
    }
}
