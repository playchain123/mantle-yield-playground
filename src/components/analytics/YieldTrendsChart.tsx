import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface YieldTrendsChartProps {
  data: any[];
  loading?: boolean;
}

const YieldTrendsChart = ({ data, loading }: YieldTrendsChartProps) => {
  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-fade-in">
        <div className="h-6 w-40 bg-muted rounded animate-pulse mb-6" />
        <div className="h-80 bg-muted/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Yield Trends (30 Days)
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
              tickFormatter={(value) => `${value}%`}
              domain={['dataMin - 0.5', 'dataMax + 0.5']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Line 
              type="monotone" 
              dataKey="mETH" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
            <Line 
              type="monotone" 
              dataKey="Lendle" 
              stroke="hsl(var(--secondary))" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: 'hsl(var(--secondary))' }}
            />
            <Line 
              type="monotone" 
              dataKey="USD1" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#10b981' }}
            />
            <Line 
              type="monotone" 
              dataKey="Aurelius" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default YieldTrendsChart;
