import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import YieldTrendsChart from "@/components/analytics/YieldTrendsChart";
import ProtocolDistributionChart from "@/components/analytics/ProtocolDistributionChart";
import PerformanceChart from "@/components/analytics/PerformanceChart";
import AnalyticsStats from "@/components/analytics/AnalyticsStats";
import { useMantleSDK } from "@/hooks/useMantleSDK";

const Analytics = () => {
  const navigate = useNavigate();
  const { getYieldHistory, getProtocolDistribution, getUserPerformanceHistory, loading } = useMantleSDK();
  
  const [yieldHistory, setYieldHistory] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const storedAddress = sessionStorage.getItem("walletAddress");
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
    
    loadAnalyticsData(storedAddress || "");
  }, []);

  const loadAnalyticsData = async (wallet: string) => {
    const [yieldData, distData] = await Promise.all([
      getYieldHistory(),
      getProtocolDistribution(),
    ]);
    
    setYieldHistory(yieldData);
    setDistribution(distData);

    if (wallet) {
      const perfData = await getUserPerformanceHistory(wallet);
      setPerformance(perfData);
    }
  };

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard | Mantle SDK Playground</title>
        <meta name="description" content="View yield trends, protocol distribution, and historical performance across Mantle protocols." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
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
              Analytics <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Real-time insights powered by the Mantle RWA & Yield SDK
            </p>
          </div>

          {/* Stats Overview */}
          <AnalyticsStats distribution={distribution} loading={loading} />

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            {/* Yield Trends */}
            <div className="lg:col-span-2">
              <YieldTrendsChart data={yieldHistory} loading={loading} />
            </div>

            {/* Protocol Distribution */}
            <ProtocolDistributionChart data={distribution} loading={loading} />

            {/* Performance History */}
            <PerformanceChart 
              data={performance} 
              loading={loading} 
              hasWallet={!!walletAddress}
            />
          </div>
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

export default Analytics;
