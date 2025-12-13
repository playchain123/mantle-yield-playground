import { TrendingUp, Layers, DollarSign, Percent } from "lucide-react";

interface AnalyticsStatsProps {
  distribution: any[];
  loading?: boolean;
}

const AnalyticsStats = ({ distribution, loading }: AnalyticsStatsProps) => {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5">
            <div className="h-4 w-20 bg-muted rounded animate-pulse mb-3" />
            <div className="h-8 w-28 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const totalTVL = distribution.reduce((sum, d) => sum + d.value, 0);
  const protocolCount = distribution.length;
  const avgAPY = 5.2; // Would come from SDK in production
  const rwaPercentage = (distribution.filter(d => d.type === 'RWA').reduce((sum, d) => sum + d.value, 0) / totalTVL * 100).toFixed(1);

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(0)}M`;
    return `$${num.toLocaleString()}`;
  };

  const stats = [
    {
      label: "Total TVL",
      value: formatNumber(totalTVL),
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      label: "Protocols",
      value: protocolCount.toString(),
      icon: Layers,
      color: "text-secondary",
      bgColor: "bg-secondary/20",
    },
    {
      label: "Avg APY",
      value: `${avgAPY}%`,
      icon: Percent,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
    },
    {
      label: "RWA Share",
      value: `${rwaPercentage}%`,
      icon: TrendingUp,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card rounded-2xl p-5 hover-lift">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsStats;
