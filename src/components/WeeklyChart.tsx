import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { WeeklyData } from '@/hooks/useStudyData';

interface WeeklyChartProps {
  data: WeeklyData[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const maxValue = Math.max(...data.map(d => d.average), 1);
  
  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--chart-primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--chart-grid))" 
            vertical={false}
          />
          <XAxis 
            dataKey="weekStart" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            dy={8}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            domain={[0, Math.ceil(maxValue + 1)]}
            tickFormatter={(value) => `${value}h`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              boxShadow: '0 4px 16px -4px hsl(150 10% 10% / 0.1)',
              padding: '12px 16px',
            }}
            labelStyle={{ 
              color: 'hsl(var(--foreground))',
              fontWeight: 500,
              marginBottom: '4px',
            }}
            formatter={(value: number) => [`${value.toFixed(2)} hrs/day`, 'Average']}
          />
          <Area
            type="monotone"
            dataKey="average"
            stroke="hsl(var(--chart-line))"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorAverage)"
            dot={{
              fill: 'hsl(var(--chart-dot))',
              strokeWidth: 2,
              stroke: 'hsl(var(--card))',
              r: 4,
            }}
            activeDot={{
              fill: 'hsl(var(--chart-dot))',
              strokeWidth: 3,
              stroke: 'hsl(var(--card))',
              r: 6,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
