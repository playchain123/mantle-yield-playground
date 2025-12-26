import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useMantleSDK } from "@/hooks/useMantleSDK";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import ProtocolDetailsModal from "./ProtocolDetailsModal";

interface Protocol {
  id: string;
  name: string;
  type: string;
  tvl: number;
  apy: number;
  color: string;
}

interface PoolYield {
  protocolId: string;
  protocolName: string;
  poolName: string;
  assetSymbol: string;
  assetAddress: string;
  apr: number;
  underlying: string;
  riskLevel: string;
  tvl?: number;
}

const typeColors: Record<string, string> = {
  "RWA": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Lending": "bg-secondary/20 text-secondary border-secondary/30",
  "Liquid Staking": "bg-primary/20 text-primary border-primary/30",
  "DEX": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Yield": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

interface ProtocolsCardProps {
  isLoading?: boolean;
}

const ProtocolsCard = ({ isLoading: externalLoading }: ProtocolsCardProps) => {
  const { listSupportedProtocols, getPoolYields, loading: sdkLoading, retrying, retryCount, error } = useMantleSDK();
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [poolYields, setPoolYields] = useState<PoolYield[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async () => {
    const [protocolData, yieldsData] = await Promise.all([
      listSupportedProtocols(),
      getPoolYields()
    ]);
    setProtocols(protocolData);
    setPoolYields(yieldsData);
    setHasLoaded(true);
  };

  useEffect(() => {
    loadData();
  }, [listSupportedProtocols, getPoolYields]);

  const handleProtocolClick = (protocol: Protocol) => {
    setSelectedProtocol(protocol);
    setModalOpen(true);
  };

  const isLoading = externalLoading || (sdkLoading && !hasLoaded);

  // Retrying state
  if (retrying) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Supported Protocols
        </h3>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="relative">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <RefreshCw className="w-4 h-4 text-primary absolute -right-1 -bottom-1 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-medium">Connecting to backend...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Retry attempt {retryCount}/3
            </p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i <= retryCount ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Supported Protocols
        </h3>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
          <div className="text-center">
            <p className="text-foreground font-medium">Connection Failed</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="h-6 w-40 bg-muted rounded animate-pulse mb-6" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Supported Protocols
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {protocols.map((protocol) => (
            <div
              key={protocol.id}
              onClick={() => handleProtocolClick(protocol)}
              className="group relative p-4 rounded-xl border border-border/30 hover:border-primary/30 transition-all duration-300 hover-lift cursor-pointer"
            >
              <div className={cn(
                "absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity",
                protocol.color
              )} />
              
              <div className="relative space-y-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full bg-gradient-to-r",
                    protocol.color
                  )} />
                  <span className="font-medium text-foreground">{protocol.name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "inline-flex px-2 py-0.5 text-xs font-medium rounded-full border",
                    typeColors[protocol.type]
                  )}>
                    {protocol.type}
                  </span>
                  <span className="text-xs text-primary font-medium">{protocol.apy}% APY</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProtocolDetailsModal
        protocol={selectedProtocol}
        poolYields={poolYields}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ProtocolsCard;
