import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExternalLink, Shield, TrendingUp, Coins, AlertTriangle, Info, CheckCircle } from "lucide-react";

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

interface ProtocolDetailsModalProps {
  protocol: Protocol | null;
  poolYields: PoolYield[];
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

const typeColors: Record<string, string> = {
  "RWA": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Lending": "bg-secondary/20 text-secondary border-secondary/30",
  "Liquid Staking": "bg-primary/20 text-primary border-primary/30",
  "DEX": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Yield": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

const riskColors: Record<string, string> = {
  low: "bg-emerald-500/20 text-emerald-400",
  medium: "bg-amber-500/20 text-amber-400",
  high: "bg-red-500/20 text-red-400",
};

// Real protocol data from Mantle documentation
const protocolDetails: Record<string, {
  description: string;
  website: string;
  docs: string;
  contractAddress: string;
  features: string[];
  risks: string[];
  rwaInfo?: {
    underlying: string;
    custodian?: string;
    auditStatus: string;
    regulatoryStatus: string;
  };
}> = {
  meth: {
    description: "mETH Protocol is a permissionless, vertically integrated protocol for ETH liquid staking with liquidity buffers in Aave and liquid restaking. mETH is a value-accumulating receipt token for ETH staking.",
    website: "https://www.methprotocol.xyz/",
    docs: "https://docs.mantle.xyz/meth",
    contractAddress: "0xcDA86A272531e8640cD7F1a92c01839911B90bb0",
    features: [
      "Value-accumulating receipt token for ETH staking",
      "Liquidity Buffer via Aave for faster withdrawals",
      "10% protocol fee on rewards",
      "Permissionless deposits and withdrawals",
      "4bps stake fee (risk management)"
    ],
    risks: [
      "Ethereum proof-of-stake validation penalties",
      "Smart contract risks",
      "Oracle dependency (3 of 6 quorum)",
      "Withdrawal delays up to 50 days without buffer"
    ],
    rwaInfo: undefined,
  },
  cmeth: {
    description: "cmETH is a 1:1 receipt token for mETH restaking across a portfolio of positions including EigenLayer and associated Actively Validated Services (AVS). Rewards accrue in multiple third-party assets.",
    website: "https://www.methprotocol.xyz/",
    docs: "https://docs.mantle.xyz/meth",
    contractAddress: "0xE6829d9a7eE3040e1276Fa75293Bde931859e8fA",
    features: [
      "1:1 pegged with mETH",
      "LayerZero OFT for omnichain bridging",
      "Unified receipt token for restaking positions",
      "Restaking via EigenLayer, Symbiotic, Karak",
      "~5 minute bridging between chains"
    ],
    risks: [
      "Inherits mETH risks",
      "Third-party restaking protocol risks",
      "AVS slashing penalties (if enabled)",
      "Up to 7 day withdrawal delay",
      "20% protocol fee on restaking rewards"
    ],
    rwaInfo: undefined,
  },
  lendle: {
    description: "Lendle is a decentralized lending protocol on Mantle Network, offering competitive yields on USDC deposits with efficient capital utilization.",
    website: "https://lendle.xyz/",
    docs: "https://docs.lendle.xyz/",
    contractAddress: "0x09Bc4E0D10E52467bde4D26bC7b4F0a684B8A1e0",
    features: [
      "Decentralized lending and borrowing",
      "Competitive supply APY on stablecoins",
      "Flash loan support",
      "Collateral optimization",
      "Native Mantle integration"
    ],
    risks: [
      "Smart contract risks",
      "Liquidation risks for borrowers",
      "Oracle manipulation risks",
      "Market volatility exposure"
    ],
    rwaInfo: undefined,
  },
  aurelius: {
    description: "Aurelius Finance is a lending and borrowing protocol optimized for Mantle Network, providing USDT lending with sustainable yield generation.",
    website: "https://aurelius.finance/",
    docs: "https://docs.aurelius.finance/",
    contractAddress: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
    features: [
      "Optimized for Mantle ecosystem",
      "USDT lending pools",
      "Efficient interest rate model",
      "Cross-collateral support",
      "Low gas fees on Mantle"
    ],
    risks: [
      "Smart contract risks",
      "Interest rate volatility",
      "Liquidity risks during high utilization",
      "Protocol governance risks"
    ],
    rwaInfo: undefined,
  },
  usd1: {
    description: "USD1 is a Real World Asset (RWA) stablecoin backed by tokenized short-term US Treasury bills via off-chain Special Purpose Vehicle (SPV). Part of Mantle's institutional-grade RWA infrastructure.",
    website: "https://mantle.xyz/",
    docs: "https://docs.mantle.xyz/",
    contractAddress: "0x0000000000000000000000000000000000000001",
    features: [
      "Backed by US Treasury bills",
      "Institutional-grade custody",
      "Daily yield accrual",
      "Compliant with regulatory frameworks",
      "Transparent reserve reporting"
    ],
    risks: [
      "Custodian counterparty risk",
      "Regulatory changes",
      "Interest rate risk on underlying",
      "Redemption delays possible"
    ],
    rwaInfo: {
      underlying: "Short-term US Treasury Bills",
      custodian: "Institutional-grade SPV",
      auditStatus: "Audited reserves with regular attestations",
      regulatoryStatus: "Compliant with applicable securities regulations"
    },
  },
  ondo: {
    description: "Ondo Finance provides USDY (US Dollar Yield), a tokenized note backed by short-term US Treasuries and bank demand deposits, offering institutional-grade yield exposure.",
    website: "https://ondo.finance/",
    docs: "https://docs.ondo.finance/",
    contractAddress: "0x0000000000000000000000000000000000000002",
    features: [
      "Backed by US Treasuries and bank deposits",
      "Tokenized real-world yield",
      "KYC/AML compliant structure",
      "Daily NAV updates",
      "Institutional custody solutions"
    ],
    risks: [
      "Credit risk on bank deposits",
      "Interest rate risk",
      "Regulatory risk",
      "Redemption processing time"
    ],
    rwaInfo: {
      underlying: "US Treasuries and Bank Demand Deposits",
      custodian: "Institutional custodians",
      auditStatus: "Regular third-party audits",
      regulatoryStatus: "SEC-registered offering"
    },
  },
};

const formatTVL = (value: number): string => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
};

const ProtocolDetailsModal = ({ protocol, poolYields, isOpen, onClose, loading }: ProtocolDetailsModalProps) => {
  if (!protocol) return null;

  const details = protocolDetails[protocol.id] || {
    description: "Protocol details not available.",
    website: "#",
    docs: "#",
    contractAddress: "N/A",
    features: [],
    risks: [],
  };

  const protocolPools = poolYields.filter(p => p.protocolId === protocol.id);
  const isRWA = protocol.type === "RWA";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn("w-3 h-3 rounded-full bg-gradient-to-r", protocol.color)} />
            <span className="text-foreground">{protocol.name}</span>
            <Badge variant="outline" className={cn(typeColors[protocol.type])}>
              {protocol.type}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Overview Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-accent/50 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Coins className="w-4 h-4" />
                <span className="text-xs">TVL</span>
              </div>
              <p className="text-lg font-semibold text-foreground">{formatTVL(protocol.tvl)}</p>
            </div>
            <div className="p-4 rounded-xl bg-accent/50 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">APY</span>
              </div>
              <p className="text-lg font-semibold text-primary">{protocol.apy}%</p>
            </div>
            <div className="p-4 rounded-xl bg-accent/50 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Shield className="w-4 h-4" />
                <span className="text-xs">Network</span>
              </div>
              <p className="text-lg font-semibold text-foreground">Mantle</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Description
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{details.description}</p>
          </div>

          {/* Contract Address */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Contract Address</h4>
            <code className="block p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground font-mono break-all">
              {details.contractAddress}
            </code>
          </div>

          {/* RWA Info */}
          {isRWA && details.rwaInfo && (
            <div className="space-y-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Real World Asset Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Underlying:</span>
                  <p className="text-foreground">{details.rwaInfo.underlying}</p>
                </div>
                {details.rwaInfo.custodian && (
                  <div>
                    <span className="text-muted-foreground">Custodian:</span>
                    <p className="text-foreground">{details.rwaInfo.custodian}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Audit Status:</span>
                  <p className="text-foreground">{details.rwaInfo.auditStatus}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Regulatory:</span>
                  <p className="text-foreground">{details.rwaInfo.regulatoryStatus}</p>
                </div>
              </div>
            </div>
          )}

          {/* Pool Yields */}
          {protocolPools.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Available Pools</h4>
              <div className="space-y-2">
                {protocolPools.map((pool, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-accent/50 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{pool.poolName}</span>
                      <Badge className={riskColors[pool.riskLevel]}>{pool.riskLevel} risk</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">APR: <span className="text-primary">{pool.apr}%</span></span>
                      {pool.tvl && <span className="text-muted-foreground">TVL: {formatTVL(pool.tvl)}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{pool.underlying}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {details.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Key Features
              </h4>
              <ul className="space-y-2">
                {details.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risks */}
          {details.risks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Risk Factors
              </h4>
              <ul className="space-y-2">
                {details.risks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-amber-400 mt-1">•</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            <a
              href={details.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Website
            </a>
            <a
              href={details.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-foreground hover:bg-accent/80 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Documentation
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProtocolDetailsModal;
