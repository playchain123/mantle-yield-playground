import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface PerformanceChartProps {
  data: any[];
  loading?: boolean;
  hasWallet: boolean;
}

const PerformanceChart = ({ data, loading, hasWallet }: PerformanceChartProps) => {
  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-fade-in">
        <div className="h-6 w-40 bg-muted rounded animate-pulse mb-6" />
        <div className="h-72 bg-muted/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!hasWallet || data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Portfolio Performance
        </h3>
        
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            Enter a wallet address to view performance history
          </p>
        </div>
      </div>
    );
  }

  const startValue = data[0]?.value || 0;
  const endValue = data[data.length - 1]?.value || 0;
  const change = ((endValue - startValue) / startValue * 100).toFixed(2);
  const isPositive = parseFloat(change) >= 0;

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Portfolio Performance
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isPositive 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              domain={['dataMin - 1000', 'dataMax + 1000']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
