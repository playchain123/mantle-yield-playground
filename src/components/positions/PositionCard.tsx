import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import TransactionModal from "./TransactionModal";
import { cn } from "@/lib/utils";

interface Asset {
  name: string;
  symbol: string;
  balance: string;
  apr: string;
  value: string;
}

interface PositionCardProps {
  protocol: string;
  protocolType: string;
  assets: Asset[];
  color: string;
}

const PositionCard = ({ protocol, protocolType, assets, color }: PositionCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"deposit" | "withdraw">("deposit");
  const [selectedAsset, setSelectedAsset] = useState("");

  const openModal = (type: "deposit" | "withdraw", asset: string) => {
    setModalType(type);
    setSelectedAsset(asset);
    setModalOpen(true);
  };

  const typeColors: Record<string, string> = {
    "RWA": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "Lending": "bg-secondary/20 text-secondary border-secondary/30",
    "Liquid Staking": "bg-primary/20 text-primary border-primary/30",
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-6 hover-lift animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg font-bold text-primary-foreground",
              color
            )}>
              {protocol.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{protocol}</h3>
              <span className={cn(
                "inline-flex px-2 py-0.5 text-xs font-medium rounded-full border",
                typeColors[protocolType] || typeColors["Lending"]
              )}>
                {protocolType}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {assets.map((asset, index) => (
            <div 
              key={index}
              className="p-4 rounded-xl bg-accent/30 border border-border/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{asset.name}</span>
                    <span className="text-sm text-muted-foreground">({asset.symbol})</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Balance: <span className="text-foreground font-medium">{asset.balance}</span>
                    </span>
                    <span className="text-muted-foreground">
                      ≈ <span className="text-foreground">{asset.value}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">{asset.apr} APR</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal("deposit", asset.symbol)}
                    className="flex-1 sm:flex-none"
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                    Build Deposit Tx
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal("withdraw", asset.symbol)}
                    className="flex-1 sm:flex-none"
                  >
                    <ArrowUpFromLine className="h-4 w-4" />
                    Build Withdraw Tx
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        protocol={protocol}
        asset={selectedAsset}
      />
    </>
  );
};

export default PositionCard;
