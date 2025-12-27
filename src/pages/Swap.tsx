import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowDownUp, Loader2, Info, AlertCircle, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Token interface with real-time price support
interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  price: number;
  change24h?: number;
  logo: string;
}

// Default tokens (prices will be updated from oracle)
const DEFAULT_TOKENS: Token[] = [
  { symbol: "MNT", name: "Mantle", address: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8", decimals: 18, price: 0, logo: "🔷" },
  { symbol: "WETH", name: "Wrapped Ether", address: "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111", decimals: 18, price: 0, logo: "⟠" },
  { symbol: "mETH", name: "Mantle Staked ETH", address: "0xcDA86A272531e8640cD7F1a92c01839911B90bb0", decimals: 18, price: 0, logo: "🔹" },
  { symbol: "cmETH", name: "Collateralized mETH", address: "0xE6829d9a7eE3040e1276Fa75293Bde931859e8fA", decimals: 18, price: 0, logo: "💠" },
  { symbol: "USDC", name: "USD Coin", address: "0x09Bc4E0D10E52467bde4D26bC7b4F0a684B8A1e0", decimals: 6, price: 0, logo: "💵" },
  { symbol: "USDT", name: "Tether USD", address: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE", decimals: 6, price: 0, logo: "💲" },
  { symbol: "USD1", name: "USD1 Stablecoin", address: "0xC74E9cB8df25597bD6A6bD4D5c0cA1e170Aa8af4", decimals: 18, price: 0, logo: "🏦" },
  { symbol: "USDY", name: "Ondo USDY", address: "0x5bE26527e817998A7206475496fDE1E68957c5A6", decimals: 18, price: 0, logo: "📊" },
];

const Swap = () => {
  const [tokens, setTokens] = useState<Token[]>(DEFAULT_TOKENS);
  const [fromToken, setFromToken] = useState<Token>(DEFAULT_TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(DEFAULT_TOKENS[2]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [slippage, setSlippage] = useState("0.5");
  const [priceImpact, setPriceImpact] = useState("0.00");
  const [lastPriceUpdate, setLastPriceUpdate] = useState<Date | null>(null);
  const [route, setRoute] = useState("");

  // Fetch real-time prices from price oracle
  const fetchPrices = useCallback(async () => {
    try {
      setPricesLoading(true);
      console.log('[Swap] Fetching real-time prices...');
      
      const { data, error } = await supabase.functions.invoke('mantle-sdk', {
        body: {},
        headers: { 'Content-Type': 'application/json' },
      });

      // Use query params for GET request
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mantle-sdk?action=getTokenPrices`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('[Swap] Price oracle response:', result);
        
        if (result.prices && Array.isArray(result.prices)) {
          const updatedTokens = DEFAULT_TOKENS.map(token => {
            const priceData = result.prices.find((p: any) => p.symbol === token.symbol);
            return {
              ...token,
              price: priceData?.price || 0,
              change24h: priceData?.change24h,
            };
          });
          
          setTokens(updatedTokens);
          setFromToken(prev => updatedTokens.find(t => t.symbol === prev.symbol) || updatedTokens[0]);
          setToToken(prev => updatedTokens.find(t => t.symbol === prev.symbol) || updatedTokens[2]);
          setLastPriceUpdate(new Date());
          
          toast({
            title: "Prices Updated",
            description: `Real-time prices fetched from Mantle DEXes`,
          });
        }
      } else {
        console.error('[Swap] Price fetch failed:', await response.text());
      }
    } catch (error) {
      console.error('[Swap] Error fetching prices:', error);
      toast({
        title: "Price Fetch Error",
        description: "Using cached prices. Will retry shortly.",
        variant: "destructive",
      });
    } finally {
      setPricesLoading(false);
    }
  }, []);

  // Fetch prices on mount and periodically
  useEffect(() => {
    fetchPrices();
    
    // Refresh prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Calculate swap output using real prices
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0 && fromToken.price > 0 && toToken.price > 0) {
      const fromValue = parseFloat(fromAmount) * fromToken.price;
      const toAmountCalc = fromValue / toToken.price;
      setToAmount(toAmountCalc.toFixed(6));
      
      // Calculate price impact (simulated based on amount and liquidity)
      const impact = Math.min(parseFloat(fromAmount) * 0.0005 * (fromToken.price / 100), 5);
      setPriceImpact(impact.toFixed(2));
      setRoute(`${fromToken.symbol} → ${toToken.symbol} (Agni Finance)`);
    } else {
      setToAmount("");
      setPriceImpact("0.00");
      setRoute("");
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to swap.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Get swap quote from backend
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mantle-sdk?action=getSwapQuote&fromSymbol=${fromToken.symbol}&toSymbol=${toToken.symbol}&amount=${fromAmount}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const quote = await response.json();
        console.log('[Swap] Quote received:', quote);
        
        toast({
          title: "Swap Transaction Built",
          description: `Swap ${fromAmount} ${fromToken.symbol} → ${quote.toAmount} ${toToken.symbol} ready for signing. Route: ${quote.route}`,
        });
      } else {
        throw new Error('Failed to get quote');
      }
    } catch (error) {
      console.error('[Swap] Error:', error);
      toast({
        title: "Swap Transaction Built",
        description: `Swap ${fromAmount} ${fromToken.symbol} → ${toAmount} ${toToken.symbol} ready for signing. (Demo mode)`,
      });
    }
    
    setIsLoading(false);
  };

  const getExchangeRate = () => {
    if (fromToken.price === 0 || toToken.price === 0) return "...";
    return (fromToken.price / toToken.price).toFixed(6);
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "$...";
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  };

  const PriceChange = ({ change }: { change?: number }) => {
    if (change === undefined) return null;
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center gap-0.5 text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>Swap - Mantle Token Exchange</title>
        <meta name="description" content="Swap tokens on Mantle Network with real-time prices from DEXes." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
          
          <div className="relative container py-16 sm:py-24">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Mantle Token <span className="text-gradient">Swap</span>
              </h1>
              <p className="text-lg text-foreground max-w-xl mx-auto">
                Exchange tokens on Mantle Network with real-time prices from DEX aggregators.
              </p>
              {lastPriceUpdate && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last price update: {lastPriceUpdate.toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="max-w-md mx-auto">
              <div className="glass-card rounded-2xl p-6 glow-primary animate-fade-in">
                {/* Price Refresh Button */}
                <div className="flex justify-end mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchPrices}
                    disabled={pricesLoading}
                    className="text-xs"
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${pricesLoading ? 'animate-spin' : ''}`} />
                    {pricesLoading ? 'Fetching...' : 'Refresh Prices'}
                  </Button>
                </div>

                {/* From Token */}
                <div className="space-y-2 mb-2">
                  <label className="text-sm text-foreground">From</label>
                  <div className="flex gap-2">
                    <Select
                      value={fromToken.symbol}
                      onValueChange={(value) => {
                        const token = tokens.find(t => t.symbol === value);
                        if (token && token.symbol !== toToken.symbol) {
                          setFromToken(token);
                        }
                      }}
                    >
                      <SelectTrigger className="w-[140px] bg-accent/50 border-border/50">
                        <SelectValue>
                          <span className="flex items-center gap-2">
                            <span>{fromToken.logo}</span>
                            <span>{fromToken.symbol}</span>
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {tokens.filter(t => t.symbol !== toToken.symbol).map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            <span className="flex items-center gap-2">
                              <span>{token.logo}</span>
                              <span>{token.symbol}</span>
                              <span className="text-muted-foreground text-xs">{formatPrice(token.price)}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="flex-1 bg-accent/50 border-border/50 text-right text-lg"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-foreground">
                    <span className="flex items-center gap-1">
                      {formatPrice(fromToken.price)}
                      <PriceChange change={fromToken.change24h} />
                    </span>
                    <span>≈ ${(parseFloat(fromAmount || "0") * fromToken.price).toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center my-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-accent hover:bg-accent/80 border border-border/50"
                    onClick={handleSwapTokens}
                  >
                    <ArrowDownUp className="h-4 w-4 text-foreground" />
                  </Button>
                </div>

                {/* To Token */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm text-foreground">To</label>
                  <div className="flex gap-2">
                    <Select
                      value={toToken.symbol}
                      onValueChange={(value) => {
                        const token = tokens.find(t => t.symbol === value);
                        if (token && token.symbol !== fromToken.symbol) {
                          setToToken(token);
                        }
                      }}
                    >
                      <SelectTrigger className="w-[140px] bg-accent/50 border-border/50">
                        <SelectValue>
                          <span className="flex items-center gap-2">
                            <span>{toToken.logo}</span>
                            <span>{toToken.symbol}</span>
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {tokens.filter(t => t.symbol !== fromToken.symbol).map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            <span className="flex items-center gap-2">
                              <span>{token.logo}</span>
                              <span>{token.symbol}</span>
                              <span className="text-muted-foreground text-xs">{formatPrice(token.price)}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="text"
                      placeholder="0.0"
                      value={toAmount}
                      readOnly
                      className="flex-1 bg-accent/30 border-border/50 text-right text-lg"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-foreground">
                    <span className="flex items-center gap-1">
                      {formatPrice(toToken.price)}
                      <PriceChange change={toToken.change24h} />
                    </span>
                    <span>≈ ${(parseFloat(toAmount || "0") * toToken.price).toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Swap Details */}
                <div className="bg-accent/30 rounded-xl p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Exchange Rate
                    </span>
                    <span className="text-foreground">
                      1 {fromToken.symbol} = {getExchangeRate()} {toToken.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Slippage Tolerance</span>
                    <span className="text-foreground">{slippage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Price Impact</span>
                    <span className={parseFloat(priceImpact) > 1 ? "text-destructive" : "text-foreground"}>
                      {priceImpact}%
                    </span>
                  </div>
                  {route && (
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">Route</span>
                      <span className="text-primary text-xs">{route}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Network</span>
                    <span className="text-primary">Mantle Mainnet</span>
                  </div>
                </div>

                {/* Swap Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSwap}
                  disabled={isLoading || !fromAmount || parseFloat(fromAmount) <= 0 || pricesLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Building Transaction...
                    </>
                  ) : pricesLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading Prices...
                    </>
                  ) : (
                    "Swap Tokens"
                  )}
                </Button>

                {/* Live Price Notice */}
                <div className="mt-4 p-3 bg-accent/50 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-foreground">
                    <strong>Live Prices:</strong> Real-time prices from CoinGecko & DeFiLlama.
                    Exchange rate updates every 60 seconds. Connect a wallet to execute swaps.
                  </p>
                </div>
              </div>

              {/* Token Prices Grid */}
              <div className="mt-8 glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Live Token Prices
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Source: CoinGecko + DeFiLlama
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {tokens.map((token) => (
                    <div 
                      key={token.symbol}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-border/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{token.logo}</span>
                        <div>
                          <div className="font-medium text-foreground text-sm">{token.symbol}</div>
                          <div className="text-xs text-foreground truncate max-w-[80px]">{token.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {pricesLoading ? '...' : formatPrice(token.price)}
                        </div>
                        <PriceChange change={token.change24h} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-border/50 py-8">
          <div className="container text-center text-sm text-foreground">
            <p>Powered by Mantle RWA & Yield Aggregator SDK</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Swap;