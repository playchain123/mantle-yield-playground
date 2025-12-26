import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import WalletInput from "@/components/playground/WalletInput";
import ProtocolsCard from "@/components/playground/ProtocolsCard";
import UserSummaryCard from "@/components/playground/UserSummaryCard";
import { useMantleSDK } from "@/hooks/useMantleSDK";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [totalBalance, setTotalBalance] = useState("$0");
  const [totalYield, setTotalYield] = useState("0%");
  
  const { getUserPositions } = useMantleSDK();

  const handleLoadPositions = async (address: string) => {
    setIsLoading(true);
    setWalletAddress(address);
    
    // Call SDK to get user positions
    const positions = await getUserPositions(address);
    
    if (positions && positions.positions.length > 0) {
      setHasData(true);
      setTotalBalance(positions.totalBalance);
      setTotalYield(positions.totalYield);
      
      // Store in session for positions page
      sessionStorage.setItem("walletAddress", address);
      sessionStorage.setItem("userPositions", JSON.stringify(positions));
    } else {
      setHasData(false);
      setTotalBalance("$0");
      setTotalYield("0%");
    }
    
    setIsLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Mantle RWA & Yield SDK Playground</title>
        <meta name="description" content="Test how the SDK unifies positions and yields across Mantle protocols in one simple interface." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
          
          <div className="relative container py-16 sm:py-24">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Mantle RWA & Yield
                <br />
                <span className="text-foreground">Aggregator Playground</span>
              </h1>
              <p className="text-lg sm:text-xl text-foreground max-w-2xl mx-auto">
                Test how the SDK unifies positions and yields across Mantle protocols in one simple interface.
              </p>
            </div>

            {/* Wallet Input Card */}
            <div className="max-w-xl mx-auto mb-16">
              <WalletInput 
                onLoadPositions={handleLoadPositions}
                isLoading={isLoading}
              />
            </div>

            {/* Output Cards */}
            <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <ProtocolsCard isLoading={isLoading} />
              <UserSummaryCard 
                isLoading={isLoading}
                hasData={hasData}
                totalBalance={totalBalance}
                totalYield={totalYield}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8">
          <div className="container text-center text-sm text-muted-foreground">
            <p>Built with the Mantle RWA & Yield Aggregator SDK</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
