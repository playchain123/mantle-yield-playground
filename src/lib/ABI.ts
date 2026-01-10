const ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "protocol",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "protocol",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newBalance",
        type: "uint256",
      },
    ],
    name: "PositionUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    name: "Swap",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "protocol",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "addSupportedToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "protocol",
        type: "string",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "buildBorrowTransaction",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
        ],
        internalType: "struct MantleRWAAggregator.Transaction",
        name: "transaction",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "protocol",
        type: "string",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "buildDepositTransaction",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
        ],
        internalType: "struct MantleRWAAggregator.Transaction",
        name: "transaction",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "buildStakeTransaction",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
        ],
        internalType: "struct MantleRWAAggregator.Transaction",
        name: "transaction",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minAmountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "buildSwapTransaction",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
        ],
        internalType: "struct MantleRWAAggregator.Transaction",
        name: "transaction",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "protocol",
        type: "string",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "buildWithdrawTransaction",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
        ],
        internalType: "struct MantleRWAAggregator.Transaction",
        name: "transaction",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minAmountOut",
        type: "uint256",
      },
    ],
    name: "executeSwap",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getAllBalances",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "protocol",
            type: "address",
          },
          {
            internalType: "string",
            name: "protocolName",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "valueUSD",
            type: "uint256",
          },
        ],
        internalType: "struct MantleRWAAggregator.ProtocolBalance[]",
        name: "balances",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getAllPositions",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "protocol",
            type: "address",
          },
          {
            internalType: "string",
            name: "protocolName",
            type: "string",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deposited",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "borrowed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "yield",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "apy",
            type: "uint256",
          },
        ],
        internalType: "struct MantleRWAAggregator.Position[]",
        name: "positions",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getBestYield",
    outputs: [
      {
        internalType: "string",
        name: "bestProtocol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "apy",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "string",
        name: "protocol",
        type: "string",
      },
    ],
    name: "getPosition",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "protocol",
            type: "address",
          },
          {
            internalType: "string",
            name: "protocolName",
            type: "string",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deposited",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "borrowed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "yield",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "apy",
            type: "uint256",
          },
        ],
        internalType: "struct MantleRWAAggregator.Position",
        name: "position",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "protocol",
        type: "string",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getProtocolAPY",
    outputs: [
      {
        internalType: "uint256",
        name: "apy",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "string",
        name: "protocol",
        type: "string",
      },
    ],
    name: "getProtocolBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRegisteredProtocols",
    outputs: [
      {
        internalType: "string[]",
        name: "protocolList",
        type: "string[]",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    name: "getSwapQuote",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "fromToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "toToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOut",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "priceImpact",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "path",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
        ],
        internalType: "struct MantleRWAAggregator.SwapQuote",
        name: "quote",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getTokenPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUSD1Info",
    outputs: [
      {
        internalType: "uint256",
        name: "treasuryValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "collateralRatio",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUSDYInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "navPerToken",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalSupply",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "protocol",
        type: "string",
      },
    ],
    name: "isProtocolRegistered",
    outputs: [
      {
        internalType: "bool",
        name: "isRegistered",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "protocols",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "address",
        name: "protocolAddress",
        type: "address",
      },
    ],
    name: "registerProtocol",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "supportedTokens",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];