// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MantleRWAAggregator
 * @notice Unified smart contract for Mantle RWA & Yield SDK
 * @dev Provides ABI for multi-protocol aggregation across Mantle Network
 */
contract MantleRWAAggregator {
    
    // ============================================
    // STRUCTS
    // ============================================
    
    struct ProtocolBalance {
        address protocol;
        string protocolName;
        uint256 balance;
        uint256 valueUSD;
    }
    
    struct Position {
        address protocol;
        string protocolName;
        address token;
        uint256 deposited;
        uint256 borrowed;
        uint256 collateral;
        uint256 yield;
        uint256 apy;
    }
    
    struct SwapQuote {
        address fromToken;
        address toToken;
        uint256 amountIn;
        uint256 amountOut;
        uint256 priceImpact;
        address[] path;
        uint256 deadline;
    }
    
    struct Transaction {
        address target;
        uint256 value;
        bytes data;
        uint256 gasLimit;
    }
    
    // ============================================
    // EVENTS
    // ============================================
    
    event Deposit(address indexed user, address indexed protocol, address token, uint256 amount);
    event Withdraw(address indexed user, address indexed protocol, address token, uint256 amount);
    event Swap(address indexed user, address fromToken, address toToken, uint256 amountIn, uint256 amountOut);
    event PositionUpdated(address indexed user, address indexed protocol, uint256 newBalance);
    
    // ============================================
    // STATE VARIABLES
    // ============================================
    
    mapping(string => address) public protocols;
    mapping(address => bool) public supportedTokens;
    address public owner;
    
    // ============================================
    // MODIFIERS
    // ============================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    constructor() {
        owner = msg.sender;
    }
    
    // ============================================
    // PROTOCOL MANAGEMENT
    // ============================================
    
    /**
     * @notice Register a protocol address
     * @param name Protocol identifier (e.g., "mETH", "Lendle", "USD1")
     * @param protocolAddress The protocol's contract address
     */
    function registerProtocol(string memory name, address protocolAddress) external onlyOwner {
        protocols[name] = protocolAddress;
    }
    
    /**
     * @notice Add supported token
     * @param token Token address to whitelist
     */
    function addSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = true;
    }
    
    // ============================================
    // BALANCE & POSITION QUERIES (Real On-Chain Data)
    // ============================================
    
    /**
     * @notice Get user's balance across a specific protocol
     * @param user User address
     * @param protocol Protocol identifier
     * @return balance User's balance in the protocol
     */
    function getProtocolBalance(address user, string memory protocol) external view returns (uint256 balance) {
        address protocolAddress = protocols[protocol];
        require(protocolAddress != address(0), "Protocol not registered");
        
        // This would call the actual protocol contract
        // Implementation depends on each protocol's interface
        return 0; // Placeholder
    }
    
    /**
     * @notice Get all balances for a user across all protocols
     * @param user User address
     * @return balances Array of protocol balances
     */
    function getAllBalances(address user) external view returns (ProtocolBalance[] memory balances) {
        balances = new ProtocolBalance[](6);
        // Implementation would iterate through all registered protocols
        return balances;
    }
    
    /**
     * @notice Get detailed position information for a user in a protocol
     * @param user User address
     * @param protocol Protocol identifier
     * @return position Position details including deposits, borrows, collateral, and yield
     */
    function getPosition(address user, string memory protocol) external view returns (Position memory position) {
        address protocolAddress = protocols[protocol];
        require(protocolAddress != address(0), "Protocol not registered");
        
        position.protocol = protocolAddress;
        position.protocolName = protocol;
        // Implementation would query the specific protocol
        return position;
    }
    
    /**
     * @notice Get all positions for a user across all protocols
     * @param user User address
     * @return positions Array of all user positions
     */
    function getAllPositions(address user) external view returns (Position[] memory positions) {
        positions = new Position[](6);
        // Implementation would aggregate positions from all protocols
        return positions;
    }
    
    // ============================================
    // TRANSACTION BUILDING
    // ============================================
    
    /**
     * @notice Build unsigned deposit transaction
     * @param protocol Protocol identifier
     * @param token Token to deposit
     * @param amount Amount to deposit
     * @return transaction Unsigned transaction data
     */
    function buildDepositTransaction(
        string memory protocol,
        address token,
        uint256 amount
    ) external view returns (Transaction memory transaction) {
        address protocolAddress = protocols[protocol];
        require(protocolAddress != address(0), "Protocol not registered");
        require(supportedTokens[token], "Token not supported");
        
        transaction.target = protocolAddress;
        transaction.value = 0;
        // Encode deposit call based on protocol
        transaction.data = abi.encodeWithSignature("deposit(address,uint256)", token, amount);
        transaction.gasLimit = 300000;
        
        return transaction;
    }
    
    /**
     * @notice Build unsigned withdraw transaction
     * @param protocol Protocol identifier
     * @param token Token to withdraw
     * @param amount Amount to withdraw
     * @return transaction Unsigned transaction data
     */
    function buildWithdrawTransaction(
        string memory protocol,
        address token,
        uint256 amount
    ) external view returns (Transaction memory transaction) {
        address protocolAddress = protocols[protocol];
        require(protocolAddress != address(0), "Protocol not registered");
        
        transaction.target = protocolAddress;
        transaction.value = 0;
        transaction.data = abi.encodeWithSignature("withdraw(address,uint256)", token, amount);
        transaction.gasLimit = 350000;
        
        return transaction;
    }
    
    /**
     * @notice Build unsigned stake transaction for mETH
     * @param amount ETH amount to stake
     * @return transaction Unsigned transaction data
     */
    function buildStakeTransaction(uint256 amount) external view returns (Transaction memory transaction) {
        address protocolAddress = protocols["mETH"];
        require(protocolAddress != address(0), "mETH protocol not registered");
        
        transaction.target = protocolAddress;
        transaction.value = amount;
        transaction.data = abi.encodeWithSignature("stake()");
        transaction.gasLimit = 250000;
        
        return transaction;
    }
    
    /**
     * @notice Build unsigned borrow transaction for lending protocols
     * @param protocol Protocol identifier (Lendle or Aurelius)
     * @param token Token to borrow
     * @param amount Amount to borrow
     * @return transaction Unsigned transaction data
     */
    function buildBorrowTransaction(
        string memory protocol,
        address token,
        uint256 amount
    ) external view returns (Transaction memory transaction) {
        address protocolAddress = protocols[protocol];
        require(protocolAddress != address(0), "Protocol not registered");
        
        transaction.target = protocolAddress;
        transaction.value = 0;
        transaction.data = abi.encodeWithSignature("borrow(address,uint256)", token, amount);
        transaction.gasLimit = 400000;
        
        return transaction;
    }
    
    // ============================================
    // TOKEN SWAPS
    // ============================================
    
    /**
     * @notice Get real-time swap quote
     * @param fromToken Source token address
     * @param toToken Destination token address
     * @param amountIn Amount of source token
     * @return quote Swap quote with price and route
     */
    function getSwapQuote(
        address fromToken,
        address toToken,
        uint256 amountIn
    ) external view returns (SwapQuote memory quote) {
        require(supportedTokens[fromToken] && supportedTokens[toToken], "Token not supported");
        
        quote.fromToken = fromToken;
        quote.toToken = toToken;
        quote.amountIn = amountIn;
        // Would integrate with DEX or oracle for real quote
        quote.deadline = block.timestamp + 300; // 5 minutes
        
        return quote;
    }
    
    /**
     * @notice Build unsigned swap transaction
     * @param fromToken Source token address
     * @param toToken Destination token address
     * @param amountIn Amount of source token
     * @param minAmountOut Minimum acceptable output amount
     * @param deadline Transaction deadline
     * @return transaction Unsigned transaction data
     */
    function buildSwapTransaction(
        address fromToken,
        address toToken,
        uint256 amountIn,
        uint256 minAmountOut,
        uint256 deadline
    ) external view returns (Transaction memory transaction) {
        require(supportedTokens[fromToken] && supportedTokens[toToken], "Token not supported");
        
        // Would target the appropriate DEX router on Mantle
        transaction.target = address(0); // DEX router address
        transaction.value = 0;
        transaction.data = abi.encodeWithSignature(
            "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
            amountIn,
            minAmountOut,
            new address[](0), // path would be calculated
            msg.sender,
            deadline
        );
        transaction.gasLimit = 300000;
        
        return transaction;
    }
    
    /**
     * @notice Execute a swap (when SDK has signing capability)
     * @param fromToken Source token address
     * @param toToken Destination token address
     * @param amountIn Amount of source token
     * @param minAmountOut Minimum acceptable output amount
     */
    function executeSwap(
        address fromToken,
        address toToken,
        uint256 amountIn,
        uint256 minAmountOut
    ) external returns (uint256 amountOut) {
        require(supportedTokens[fromToken] && supportedTokens[toToken], "Token not supported");
        
        // Implementation would handle the actual swap
        emit Swap(msg.sender, fromToken, toToken, amountIn, amountOut);
        
        return amountOut;
    }
    
    // ============================================
    // YIELD AGGREGATION
    // ============================================
    
    /**
     * @notice Get current APY for a protocol
     * @param protocol Protocol identifier
     * @param token Token address
     * @return apy Annual percentage yield (in basis points, e.g., 500 = 5%)
     */
    function getProtocolAPY(string memory protocol, address token) external view returns (uint256 apy) {
        address protocolAddress = protocols[protocol];
        require(protocolAddress != address(0), "Protocol not registered");
        
        // Would query protocol's current APY
        return 0; // Placeholder
    }
    
    /**
     * @notice Get best yield opportunity across all protocols
     * @param token Token address
     * @return bestProtocol Protocol with highest yield
     * @return apy Best available APY
     */
    function getBestYield(address token) external view returns (string memory bestProtocol, uint256 apy) {
        // Implementation would compare APYs across all protocols
        return ("", 0);
    }
    
    // ============================================
    // RWA-SPECIFIC FUNCTIONS
    // ============================================
    
    /**
     * @notice Get USD1 backing information
     * @return treasuryValue Total US Treasury Bills backing USD1
     * @return collateralRatio Current collateralization ratio
     */
    function getUSD1Info() external view returns (uint256 treasuryValue, uint256 collateralRatio) {
        address usd1Protocol = protocols["USD1"];
        require(usd1Protocol != address(0), "USD1 not registered");
        
        // Would query USD1 contract for RWA backing data
        return (0, 0);
    }
    
    /**
     * @notice Get Ondo USDY information
     * @return navPerToken Net Asset Value per token
     * @return totalSupply Total USDY supply
     */
    function getUSDYInfo() external view returns (uint256 navPerToken, uint256 totalSupply) {
        address ondoProtocol = protocols["Ondo"];
        require(ondoProtocol != address(0), "Ondo not registered");
        
        // Would query Ondo contract for Treasury-backed token data
        return (0, 0);
    }
    
    // ============================================
    // UTILITIES
    // ============================================
    
    /**
     * @notice Get token price from oracle
     * @param token Token address
     * @return price Token price in USD (with 8 decimals)
     */
    function getTokenPrice(address token) external view returns (uint256 price) {
        require(supportedTokens[token], "Token not supported");
        // Would integrate with Mantle price oracle
        return 0;
    }
    
    /**
     * @notice Check if protocol is registered
     * @param protocol Protocol identifier
     * @return isRegistered True if protocol is registered
     */
    function isProtocolRegistered(string memory protocol) external view returns (bool isRegistered) {
        return protocols[protocol] != address(0);
    }
    
    /**
     * @notice Get all registered protocols
     * @return protocolList Array of protocol identifiers
     */
    function getRegisteredProtocols() external pure returns (string[] memory protocolList) {
        protocolList = new string[](6);
        protocolList[0] = "mETH";
        protocolList[1] = "cmETH";
        protocolList[2] = "Lendle";
        protocolList[3] = "Aurelius";
        protocolList[4] = "USD1";
        protocolList[5] = "Ondo";
        return protocolList;
    }
}
