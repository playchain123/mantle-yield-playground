# Mantle RWA & Yield Aggregator SDK

A comprehensive TypeScript SDK for aggregating Real World Assets (RWA) and yield opportunities across the Mantle Network ecosystem. Built on Lovable Cloud with full Mantle RPC integration and **real-time price oracle**.

## 🌐 Overview

The Mantle RWA & Yield SDK provides a unified interface for interacting with multiple DeFi protocols on Mantle Network, including:

- **mETH Protocol** - Liquid staking for ETH
- **cmETH** - Collateralized mETH with restaking via EigenLayer
- **Lendle** - Decentralized lending protocol
- **Aurelius Finance** - Optimized lending and borrowing
- **USD1** - RWA-backed stablecoin (US Treasury Bills)
- **Ondo Finance** - Tokenized US Treasuries (USDY)

### Key Features

- ✅ **Real On-Chain Data** - Live balance and position queries via Mantle RPC
- ✅ **Multi-Protocol Aggregation** - Unified API for 6+ DeFi protocols
- ✅ **Transaction Building** - Build unsigned deposit/withdraw transactions
- ✅ **Token Swaps** - Exchange Mantle network tokens with real-time quotes
- ✅ **Price Oracle** - Real-time token prices from CoinGecko & DeFiLlama
- ✅ **Analytics Dashboard** - Yield trends, protocol distribution, performance tracking
- ✅ **Automatic Retry** - Built-in retry mechanism for backend cold starts

## 🚀 Quick Start

### Installation

The SDK is exposed via REST API endpoints. No npm installation required.

### Base URL

```
https://swppjormvqaijozghbsb.supabase.co/functions/v1/mantle-sdk
```

### Authentication

Include the following header in all requests:

```typescript
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cHBqb3JtdnFhaWpvemdoYnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDc0MjcsImV4cCI6MjA4MTIyMzQyN30.-IkhFIhH13GES1GqMtWsjWpx9LNphedmXLCcxY21i98',
  'Content-Type': 'application/json'
}
```

## 📚 API Reference

### List Supported Protocols

Get all integrated protocols with their metadata.

```bash
GET /mantle-sdk?action=listSupportedProtocols
```

**Response:**
```json
{
  "protocols": [
    {
      "id": "meth",
      "name": "mETH Protocol",
      "type": "Liquid Staking",
      "network": "mantle-mainnet",
      "tvl": 245000000,
      "apy": 4.8,
      "color": "from-primary to-primary/60"
    }
  ],
  "network": "mantle-mainnet"
}
```

### Get Protocol Details

Get detailed information about a specific protocol including pool yields.

```bash
GET /mantle-sdk?action=getProtocolDetails&protocol=meth
```

**Response:**
```json
{
  "protocol": {
    "id": "meth",
    "name": "mETH Protocol",
    "type": "Liquid Staking",
    "apy": 4.8,
    "tvl": 245000000
  },
  "yields": [
    {
      "protocolId": "meth",
      "poolName": "mETH Staking Pool",
      "assetSymbol": "mETH",
      "apr": 4.5,
      "underlying": "ETH staked on Mantle for liquid staking rewards",
      "riskLevel": "medium"
    }
  ]
}
```

### Get User Positions

Fetch all positions for a wallet address across all protocols.

```bash
GET /mantle-sdk?action=getUserPositions&wallet=0x742d35Cc6634C0532925a3b844Bc9e7595f8bDe7
```

**Response:**
```json
{
  "positions": [
    {
      "protocol": "mETH Protocol",
      "protocolType": "Liquid Staking",
      "color": "from-primary to-primary/60",
      "assets": [
        {
          "name": "Mantle Staked ETH",
          "symbol": "mETH",
          "balance": "9.234",
          "apr": "4.8%",
          "value": "$21,976.92"
        }
      ]
    }
  ],
  "totalBalance": "$45,234.56",
  "totalYield": "5.2%",
  "protocolCount": 3
}
```

### Get Pool Yields

Get yield information for all available pools.

```bash
GET /mantle-sdk?action=getPoolYields
```

**Response:**
```json
{
  "yields": [
    {
      "protocolId": "meth",
      "protocolName": "mETH Protocol",
      "poolName": "mETH Staking Pool",
      "assetSymbol": "mETH",
      "assetAddress": "0xcDA86A272531e8640cD7F1a92c01839911B90bb0",
      "apr": 4.5,
      "underlying": "ETH staked on Mantle for liquid staking rewards",
      "riskLevel": "medium",
      "tvl": 245000000
    }
  ]
}
```

### Get Yield History

Get historical yield data for analytics.

```bash
GET /mantle-sdk?action=getYieldHistory
```

### Get Protocol Distribution

Get TVL distribution across protocols.

```bash
GET /mantle-sdk?action=getProtocolDistribution
```

### Get User Performance History

Get historical performance data for a wallet.

```bash
GET /mantle-sdk?action=getUserPerformanceHistory&wallet=0x...
```

### Build Deposit Transaction

Build a deposit transaction for a specific protocol.

```bash
POST /mantle-sdk?action=buildDepositTx
Content-Type: application/json

{
  "protocol": "meth",
  "amount": "1.0",
  "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f8bDe7"
}
```

**Response:**
```json
{
  "transaction": {
    "to": "0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f",
    "data": "0x3a4b66f1...",
    "value": "1000000000000000000",
    "chainId": 5000,
    "gasLimit": "150000",
    "type": "deposit"
  }
}
```

### Build Withdraw Transaction

Build a withdraw transaction for a specific protocol.

```bash
POST /mantle-sdk?action=buildWithdrawTx
Content-Type: application/json

{
  "protocol": "meth",
  "amount": "1.0",
  "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f8bDe7"
}
```

### Get Block Number

Get the current Mantle block number (RPC health check).

```bash
GET /mantle-sdk?action=getBlockNumber
```

**Response:**
```json
{
  "blockNumber": "12345678"
}
```

### Get Token Prices (Price Oracle)

Get real-time token prices from CoinGecko and DeFiLlama aggregated data.

```bash
GET /mantle-sdk?action=getTokenPrices
```

**Response:**
```json
{
  "prices": [
    {
      "symbol": "MNT",
      "address": "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
      "price": 0.85,
      "source": "multi-source",
      "timestamp": 1703673600000,
      "change24h": 2.34
    },
    {
      "symbol": "WETH",
      "address": "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111",
      "price": 2380.50,
      "source": "multi-source",
      "timestamp": 1703673600000,
      "change24h": -1.25
    }
  ],
  "timestamp": 1703673600000,
  "source": "multi-source-aggregator"
}
```

**Price Sources:**
- **CoinGecko** - Primary source for major tokens (MNT, WETH, mETH, USDC, USDT, USDY)
- **DeFiLlama** - Backup source with Mantle-specific token data
- **Derived** - cmETH price derived from mETH with staking premium
- **Pegged** - Stablecoins (USD1) at $1.00

### Get Swap Quote

Get a real-time swap quote with price impact calculation.

```bash
GET /mantle-sdk?action=getSwapQuote&fromSymbol=MNT&toSymbol=USDC&amount=100
```

**Response:**
```json
{
  "fromToken": {
    "symbol": "MNT",
    "address": "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
    "price": 0.85,
    "source": "multi-source",
    "timestamp": 1703673600000,
    "change24h": 2.34
  },
  "toToken": {
    "symbol": "USDC",
    "address": "0x09Bc4E0D10E52467bde4D26bC7b4F0a684B8A1e0",
    "price": 1.00,
    "source": "multi-source",
    "timestamp": 1703673600000,
    "change24h": 0.01
  },
  "fromAmount": "100",
  "toAmount": "85.00000000",
  "exchangeRate": "0.85000000",
  "priceImpact": "0.0043",
  "route": "MNT → USDC (Agni Finance)"
}
```

### Build Swap Transaction

Build a token swap transaction for Mantle tokens.

```bash
POST /mantle-sdk?action=buildSwapTx
Content-Type: application/json

{
  "fromToken": "MNT",
  "toToken": "USDC",
  "amount": "100",
  "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f8bDe7",
  "slippage": "0.5"
}
```

**Response:**
```json
{
  "transaction": {
    "to": "0x...",
    "data": "0x...",
    "value": "0",
    "chainId": 5000,
    "gasLimit": "200000",
    "type": "swap"
  },
  "quote": {
    "fromAmount": "100",
    "toAmount": "85.50",
    "priceImpact": "0.05",
    "route": ["MNT", "USDC"]
  }
}
```

## 🔧 TypeScript SDK Usage

### React Hook Integration

```typescript
import { useMantleSDK } from '@/hooks/useMantleSDK';

function MyComponent() {
  const { 
    loading, 
    error, 
    retrying,
    listSupportedProtocols,
    getUserPositions,
    getPoolYields,
    buildDepositTx 
  } = useMantleSDK();

  // List protocols
  const protocols = await listSupportedProtocols();

  // Get user positions
  const positions = await getUserPositions('0x...');

  // Build a deposit transaction
  const tx = await buildDepositTx('meth', 'mETH', '1.0');
  
  // Send with ethers/viem/wagmi
  // await wallet.sendTransaction(tx);
}
```

### Retry Mechanism

The SDK includes automatic retry logic for backend cold starts:

```typescript
const { retrying, retryCount } = useMantleSDK();

// Shows retry state during backend wake-up
if (retrying) {
  return <div>Connecting... Attempt {retryCount}/3</div>;
}
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                useMantleSDK Hook                       │  │
│  │  - Automatic retry on backend cold start               │  │
│  │  - Type-safe API calls                                 │  │
│  │  - Loading/error states                                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Edge Function (Lovable Cloud)                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               MantleRwaYieldSdk Class                  │  │
│  │  - listSupportedProtocols()                            │  │
│  │  - getUserPositions(address)                           │  │
│  │  - getPoolYields()                                     │  │
│  │  - buildDepositTx(protocol, address, amount)           │  │
│  │  - buildWithdrawTx(protocol, address, amount)          │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                               │
│  ┌───────────────────────────┼───────────────────────────┐  │
│  │              Protocol Adapters                         │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐  │  │
│  │  │  mETH   │ │ cmETH   │ │ Lendle  │ │  Aurelius   │  │  │
│  │  │ Adapter │ │ Adapter │ │ Adapter │ │   Adapter   │  │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────┘  │  │
│  │  ┌─────────┐ ┌─────────────┐                          │  │
│  │  │  USD1   │ │    Ondo     │                          │  │
│  │  │ Adapter │ │   Adapter   │                          │  │
│  │  └─────────┘ └─────────────┘                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Mantle Network (RPC)                      │
│  - Chain ID: 5000 (mainnet) / 5003 (testnet)                │
│  - RPC: https://mantle-rpc.publicnode.com                   │
│  - Real ERC-20 balance reads                                 │
│  - Transaction encoding for deposits/withdrawals            │
└─────────────────────────────────────────────────────────────┘
```

## 📜 Supported Mantle Tokens

| Token | Name | Address | Decimals |
|-------|------|---------|----------|
| MNT | Mantle | `0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8` | 18 |
| WETH | Wrapped Ether | `0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111` | 18 |
| mETH | Mantle Staked ETH | `0xcDA86A272531e8640cD7F1a92c01839911B90bb0` | 18 |
| cmETH | Collateralized mETH | `0xE6829d9a7eE3040e1276Fa75293Bde931859e8fA` | 18 |
| USDC | USD Coin | `0x09Bc4E0D10E52467bde4D26bC7b4F0a684B8A1e0` | 6 |
| USDT | Tether USD | `0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE` | 6 |
| USD1 | USD1 Stablecoin | `0xC74E9cB8df25597bD6A6bD4D5c0cA1e170Aa8af4` | 18 |
| USDY | Ondo USDY | `0x5bE26527e817998A7206475496fDE1E68957c5A6` | 18 |

## 📜 Contract Addresses (Mantle Mainnet)

| Protocol | Token | Address |
|----------|-------|---------|
| mETH | mETH | `0xcDA86A272531e8640cD7F1a92c01839911B90bb0` |
| mETH | Staking | `0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f` |
| cmETH | cmETH | `0xE6829d9a7eE3040e1276Fa75293Bde931859e8fA` |
| USDC | USDC | `0x09Bc4E0D10E52467bde4D26bC7b4F0a684B8A1e0` |
| USDT | USDT | `0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE` |
| WETH | WETH | `0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111` |
| MNT | MNT | `0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8` |

## 🔐 Environment Variables

The edge function accepts the following environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `MANTLE_RPC_URL` | `https://mantle-rpc.publicnode.com` | Mantle RPC endpoint |
| `MANTLE_NETWORK` | `mantle-mainnet` | Network selection (`mantle-mainnet` or `mantle-testnet`) |

## 🧪 Testing

### Test RPC Connection

```bash
curl "https://swppjormvqaijozghbsb.supabase.co/functions/v1/mantle-sdk?action=getBlockNumber" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cHBqb3JtdnFhaWpvemdoYnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDc0MjcsImV4cCI6MjA4MTIyMzQyN30.-IkhFIhH13GES1GqMtWsjWpx9LNphedmXLCcxY21i98"
```

### Test Protocol List

```bash
curl "https://swppjormvqaijozghbsb.supabase.co/functions/v1/mantle-sdk?action=listSupportedProtocols" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cHBqb3JtdnFhaWpvemdoYnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDc0MjcsImV4cCI6MjA4MTIyMzQyN30.-IkhFIhH13GES1GqMtWsjWpx9LNphedmXLCcxY21i98"
```

### Test User Positions (Demo Wallet)

```bash
curl "https://swppjormvqaijozghbsb.supabase.co/functions/v1/mantle-sdk?action=getUserPositions&wallet=0x742d35Cc6634C0532925a3b844Bc9e7595f8bDe7" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cHBqb3JtdnFhaWpvemdoYnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDc0MjcsImV4cCI6MjA4MTIyMzQyN30.-IkhFIhH13GES1GqMtWsjWpx9LNphedmXLCcxY21i98"
```

### Test Price Oracle

```bash
curl "https://swppjormvqaijozghbsb.supabase.co/functions/v1/mantle-sdk?action=getTokenPrices" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cHBqb3JtdnFhaWpvemdoYnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDc0MjcsImV4cCI6MjA4MTIyMzQyN30.-IkhFIhH13GES1GqMtWsjWpx9LNphedmXLCcxY21i98"
```

### Test Swap Quote

```bash
curl "https://swppjormvqaijozghbsb.supabase.co/functions/v1/mantle-sdk?action=getSwapQuote&fromSymbol=MNT&toSymbol=USDC&amount=100" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cHBqb3JtdnFhaWpvemdoYnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDc0MjcsImV4cCI6MjA4MTIyMzQyN30.-IkhFIhH13GES1GqMtWsjWpx9LNphedmXLCcxY21i98"
```

### Test Pool Yields

```bash
curl "https://swppjormvqaijozghbsb.supabase.co/functions/v1/mantle-sdk?action=getPoolYields" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cHBqb3JtdnFhaWpvemdoYnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDc0MjcsImV4cCI6MjA4MTIyMzQyN30.-IkhFIhH13GES1GqMtWsjWpx9LNphedmXLCcxY21i98"
```

### Expected Responses

| Endpoint | Expected Status | Description |
|----------|-----------------|-------------|
| `getBlockNumber` | 200 | Returns current Mantle block number |
| `listSupportedProtocols` | 200 | Returns 6 protocols (mETH, cmETH, Lendle, Aurelius, USD1, Ondo) |
| `getUserPositions` | 200 | Returns demo positions for example wallet |
| `getTokenPrices` | 200 | Returns 8 token prices with 24h change |
| `getSwapQuote` | 200 | Returns swap quote with exchange rate |
| `getPoolYields` | 200 | Returns yield data for all pools |

## 📖 References

- [Mantle Network Documentation](https://docs.mantle.xyz/network)
- [mETH Protocol Documentation](https://docs.mantle.xyz/meth)
- [Mantle RPC Endpoints](https://docs.mantle.xyz/network/developing-on-mantle/connecting-to-mantle)

## 🛠️ Development

### Project Structure

```
├── src/
│   ├── hooks/
│   │   └── useMantleSDK.ts      # React hook for SDK calls
│   ├── components/
│   │   └── playground/
│   │       ├── ProtocolsCard.tsx
│   │       └── ProtocolDetailsModal.tsx
│   └── pages/
│       ├── Index.tsx
│       ├── Positions.tsx
│       └── Analytics.tsx
└── supabase/
    └── functions/
        └── mantle-sdk/
            └── index.ts          # Edge function with SDK logic
```

### Adding a New Protocol Adapter

1. Create an adapter function following the `ProtocolAdapter` interface:

```typescript
function createNewProtocolAdapter(config: SdkConfig, client: MantleRpcClient): ProtocolAdapter {
  return {
    metadata: {
      id: 'new-protocol',
      name: 'New Protocol',
      type: 'Yield', // or 'RWA', 'Lending', 'Liquid Staking'
      network: config.network,
      tvl: 0,
      apy: 5.0,
      color: 'from-blue-500 to-blue-600',
    },
    
    async getUserPositions(userAddress) {
      // Implement position fetching
    },
    
    async getPoolYields() {
      // Return pool yield info
    },
    
    async buildDepositTx(userAddress, amount) {
      // Build deposit transaction
    },
    
    async buildWithdrawTx(userAddress, amount) {
      // Build withdrawal transaction
    },
  };
}
```

2. Add the adapter to the SDK constructor in `MantleRwaYieldSdk`:

```typescript
this.adapters = [
  // ... existing adapters
  createNewProtocolAdapter(config, this.client),
];
```

## 📄 License

MIT License - See LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

Built with ❤️ on [Mantle Network](https://mantle.xyz)
