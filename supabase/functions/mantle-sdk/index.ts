import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simulated SDK data - In production, this would connect to the actual Mantle SDK
const supportedProtocols = [
  { id: "meth", name: "mETH Protocol", type: "Liquid Staking", tvl: 245000000, apy: 4.8, color: "from-primary to-primary/60" },
  { id: "cmeth", name: "cmETH", type: "Liquid Staking", tvl: 89000000, apy: 5.2, color: "from-primary to-secondary" },
  { id: "lendle", name: "Lendle", type: "Lending", tvl: 156000000, apy: 6.2, color: "from-secondary to-secondary/60" },
  { id: "aurelius", name: "Aurelius", type: "Lending", tvl: 78000000, apy: 5.8, color: "from-amber-500 to-amber-600" },
  { id: "usd1", name: "USD1", type: "RWA", tvl: 312000000, apy: 5.2, color: "from-emerald-500 to-emerald-600" },
  { id: "ondo", name: "Ondo Finance", type: "RWA", tvl: 198000000, apy: 4.5, color: "from-blue-500 to-blue-600" },
];

// Historical yield data for charts
const generateYieldHistory = () => {
  const days = 30;
  const data = [];
  const protocols = ['mETH', 'Lendle', 'USD1', 'Aurelius'];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const entry: Record<string, any> = {
      date: date.toISOString().split('T')[0],
    };
    
    protocols.forEach((protocol, index) => {
      const baseApy = [4.8, 6.2, 5.2, 5.8][index];
      const variation = (Math.sin(i * 0.3 + index) * 0.5) + (Math.random() * 0.3 - 0.15);
      entry[protocol] = parseFloat((baseApy + variation).toFixed(2));
    });
    
    data.push(entry);
  }
  
  return data;
};

// Protocol distribution data
const getProtocolDistribution = () => {
  return supportedProtocols.map(p => ({
    name: p.name,
    value: p.tvl,
    type: p.type,
  }));
};

// User positions based on wallet
const getUserPositions = (walletAddress: string) => {
  // Simulate different data based on address
  const hash = walletAddress.toLowerCase().split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const hasPositions = Math.abs(hash) % 100 > 20; // 80% chance of having positions
  
  if (!hasPositions) {
    return {
      positions: [],
      totalBalance: "0",
      totalYield: "0",
      protocolCount: 0,
    };
  }

  const positions = [
    {
      protocol: "mETH Protocol",
      protocolType: "Liquid Staking",
      color: "from-primary to-primary/60",
      assets: [
        {
          name: "Mantle Staked ETH",
          symbol: "mETH",
          balance: (5.234 + (Math.abs(hash) % 10)).toFixed(3),
          apr: "4.8%",
          value: `$${(12456.78 + (Math.abs(hash) % 5000)).toFixed(2)}`
        }
      ]
    },
    {
      protocol: "Lendle",
      protocolType: "Lending",
      color: "from-secondary to-secondary/60",
      assets: [
        {
          name: "USD Coin",
          symbol: "USDC",
          balance: (5000 + (Math.abs(hash) % 3000)).toFixed(2),
          apr: "6.2%",
          value: `$${(5000 + (Math.abs(hash) % 3000)).toFixed(2)}`
        },
        {
          name: "Wrapped ETH",
          symbol: "WETH",
          balance: (1.5 + (Math.abs(hash) % 5) * 0.1).toFixed(2),
          apr: "3.1%",
          value: `$${(3567.89 + (Math.abs(hash) % 2000)).toFixed(2)}`
        }
      ]
    },
    {
      protocol: "USD1",
      protocolType: "RWA",
      color: "from-emerald-500 to-emerald-600",
      assets: [
        {
          name: "USD1 – RWA Stablecoin",
          symbol: "USD1",
          balance: (3543.22 + (Math.abs(hash) % 2000)).toFixed(2),
          apr: "5.2%",
          value: `$${(3543.22 + (Math.abs(hash) % 2000)).toFixed(2)}`
        }
      ]
    }
  ];

  const totalBalance = positions.reduce((sum, p) => 
    sum + p.assets.reduce((aSum, a) => 
      aSum + parseFloat(a.value.replace(/[$,]/g, '')), 0
    ), 0
  );

  const avgYield = 5.4 + (Math.abs(hash) % 30) / 10;

  return {
    positions,
    totalBalance: `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    totalYield: `${avgYield.toFixed(1)}%`,
    protocolCount: positions.length,
  };
};

// Performance history for user
const getUserPerformanceHistory = (walletAddress: string) => {
  const days = 30;
  const data = [];
  const hash = walletAddress.toLowerCase().split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  let baseValue = 20000 + (Math.abs(hash) % 10000);
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const dailyChange = (Math.sin(i * 0.2) * 200) + (Math.random() * 100 - 50);
    baseValue += dailyChange;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(baseValue.toFixed(2)),
      earnings: parseFloat((dailyChange > 0 ? dailyChange * 0.1 : 0).toFixed(2)),
    });
  }
  
  return data;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const walletAddress = url.searchParams.get('wallet');

    console.log(`SDK API called with action: ${action}, wallet: ${walletAddress}`);

    let responseData;

    switch (action) {
      case 'listSupportedProtocols':
        responseData = { protocols: supportedProtocols };
        break;
      
      case 'getYieldHistory':
        responseData = { history: generateYieldHistory() };
        break;
      
      case 'getProtocolDistribution':
        responseData = { distribution: getProtocolDistribution() };
        break;
      
      case 'getUserPositions':
        if (!walletAddress) {
          throw new Error('Wallet address is required');
        }
        responseData = getUserPositions(walletAddress);
        break;
      
      case 'getUserPerformanceHistory':
        if (!walletAddress) {
          throw new Error('Wallet address is required');
        }
        responseData = { history: getUserPerformanceHistory(walletAddress) };
        break;
      
      case 'buildDepositTx':
        const depositBody = await req.json();
        responseData = {
          transaction: {
            to: depositBody.protocol || "0x1234...5678",
            data: "0x095ea7b3000000000000000000000000...",
            value: "0",
            gasLimit: "150000",
            chainId: 5000,
            type: "deposit"
          }
        };
        break;
      
      case 'buildWithdrawTx':
        const withdrawBody = await req.json();
        responseData = {
          transaction: {
            to: withdrawBody.protocol || "0x1234...5678",
            data: "0x2e1a7d4d000000000000000000000000...",
            value: "0",
            gasLimit: "180000",
            chainId: 5000,
            type: "withdraw"
          }
        };
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log(`SDK response for ${action}:`, JSON.stringify(responseData).slice(0, 200));

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in mantle-sdk function:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
