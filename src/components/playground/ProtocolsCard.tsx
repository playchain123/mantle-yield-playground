import { cn } from "@/lib/utils";

interface Protocol {
  id: string;
  name: string;
  type: "RWA" | "Lending" | "Liquid Staking" | "DEX" | "Yield";
  color: string;
}

const protocols: Protocol[] = [
  { id: "meth", name: "mETH", type: "Liquid Staking", color: "from-primary to-primary/60" },
  { id: "cmeth", name: "cmETH", type: "Liquid Staking", color: "from-primary to-secondary" },
  { id: "lendle", name: "Lendle", type: "Lending", color: "from-secondary to-secondary/60" },
  { id: "aurelius", name: "Aurelius", type: "Lending", color: "from-amber-500 to-amber-600" },
  { id: "usd1", name: "USD1", type: "RWA", color: "from-emerald-500 to-emerald-600" },
  { id: "ondo", name: "Ondo", type: "RWA", color: "from-blue-500 to-blue-600" },
];

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

const ProtocolsCard = ({ isLoading }: ProtocolsCardProps) => {
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
    <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Supported Protocols
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {protocols.map((protocol) => (
          <div
            key={protocol.id}
            className="group relative p-4 rounded-xl bg-accent/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift cursor-pointer"
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
              
              <span className={cn(
                "inline-flex px-2 py-0.5 text-xs font-medium rounded-full border",
                typeColors[protocol.type]
              )}>
                {protocol.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProtocolsCard;
