import { useNavigate } from "react-router-dom";
import { TrendingUp, Wallet, ArrowRight, Layers, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserSummaryCardProps {
  isLoading?: boolean;
  hasData: boolean;
  totalBalance: string;
  totalYield: string;
}

const UserSummaryCard = ({ isLoading, hasData, totalBalance, totalYield }: UserSummaryCardProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="h-6 w-32 bg-muted rounded animate-pulse mb-6" />
        <div className="space-y-6">
          <div className="h-16 bg-muted rounded-xl animate-pulse" />
          <div className="h-16 bg-muted rounded-xl animate-pulse" />
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <h3 className="text-lg font-semibold text-foreground mb-6">
          User Summary
        </h3>
        
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <Layers className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            No active positions found for this address yet.
          </p>
          <p className="text-muted-foreground/60 text-xs mt-1">
            Enter a wallet address to view positions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 glow-secondary animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <h3 className="text-lg font-semibold text-foreground mb-6">
        User Summary
      </h3>
      
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-accent/50 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Balance</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalBalance}</p>
        </div>

        <div className="p-4 rounded-xl bg-accent/50 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-secondary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Estimated Yield</span>
          </div>
          <p className="text-3xl font-bold text-gradient">{totalYield}</p>
        </div>

        <p className="text-xs text-muted-foreground text-center py-2">
          Across all integrated Mantle protocols
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="default" 
            className="group"
            onClick={() => navigate("/positions")}
          >
            Positions
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="glass" 
            className="group"
            onClick={() => navigate("/analytics")}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserSummaryCard;
