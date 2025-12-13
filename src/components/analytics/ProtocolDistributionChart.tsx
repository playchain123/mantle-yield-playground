import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ProtocolDistributionChartProps {
  data: any[];
  loading?: boolean;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  '#10b981',
  '#3b82f6',
  '#f59e0b',
  '#ec4899',
];

const formatTVL = (value: number) => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(0)}M`;
  }
  return `$${value.toLocaleString()}`;
};

const ProtocolDistributionChart = ({ data, loading }: ProtocolDistributionChartProps) => {
  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-fade-in">
        <div className="h-6 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="h-80 bg-muted/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  const totalTVL = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Protocol Distribution
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Total TVL: {formatTVL(totalTVL)}
      </p>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number, name: string) => [formatTVL(value), name]}
            />
            <Legend 
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Type breakdown */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {['RWA', 'Lending', 'Liquid Staking'].map((type) => {
          const typeTotal = data.filter(d => d.type === type).reduce((sum, d) => sum + d.value, 0);
          const percentage = totalTVL > 0 ? ((typeTotal / totalTVL) * 100).toFixed(1) : 0;
          return (
            <div key={type} className="p-3 rounded-lg bg-accent/50 text-center">
              <p className="text-xs text-muted-foreground">{type}</p>
              <p className="text-sm font-medium text-foreground">{percentage}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProtocolDistributionChart;
