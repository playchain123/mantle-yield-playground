import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Wallet, Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PositionCard from "@/components/positions/PositionCard";
import { Button } from "@/components/ui/button";
import { useMantleSDK } from "@/hooks/useMantleSDK";

interface Asset {
  name: string;
  symbol: string;
  balance: string;
  apr: string;
  value: string;
}

interface Position {
  protocol: string;
  protocolType: string;
  color: string;
  assets: Asset[];
}

const Positions = () => {
  const navigate = useNavigate();
  const { getUserPositions, loading } = useMantleSDK();
  const [walletAddress, setWalletAddress] = useState("");
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    const storedAddress = sessionStorage.getItem("walletAddress");
    const storedPositions = sessionStorage.getItem("userPositions");
    
    if (storedAddress) {
      setWalletAddress(storedAddress);
      
      if (storedPositions) {
        const parsed = JSON.parse(storedPositions);
        setPositions(parsed.positions || []);
      } else {
        // Fetch fresh if no cached data
        loadPositions(storedAddress);
      }
    }
  }, []);

  const loadPositions = async (address: string) => {
    const data = await getUserPositions(address);
    if (data) {
      setPositions(data.positions);
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <Helmet>
        <title>Positions Detail | Mantle SDK Playground</title>
        <meta name="description" content="Per-protocol breakdown built with the Mantle RWA & Yield SDK." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container py-8 sm:py-12">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Overview
            </Button>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Positions Detail
            </h1>
            <p className="text-muted-foreground">
              Per-protocol breakdown built with the Mantle RWA & Yield SDK.
            </p>
          </div>

          {/* Address Banner */}
          <div className="glass-card rounded-2xl p-4 sm:p-6 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Connected Wallet</p>
                  <p className="font-mono text-foreground">
                    {truncateAddress(walletAddress) || "No wallet connected"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent">
                  <Layers className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Protocols:</span>
                  <span className="font-medium text-foreground">{positions.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Position Cards */}
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                  <div className="h-8 w-48 bg-muted rounded mb-4" />
                  <div className="h-24 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : positions.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No positions found</h3>
              <p className="text-muted-foreground">
                This wallet doesn't have any active positions on supported protocols.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {positions.map((position, index) => (
                <div key={position.protocol} style={{ animationDelay: `${0.15 + index * 0.1}s` }}>
                  <PositionCard {...position} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8 mt-12">
          <div className="container text-center text-sm text-muted-foreground">
            <p>Built with the Mantle RWA & Yield Aggregator SDK</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Positions;
