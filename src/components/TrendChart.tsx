import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BandwidthData } from "@/utils/dataProcessor";

interface TrendChartProps {
  data: Map<string, BandwidthData[]>;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const TrendChart = ({ data }: TrendChartProps) => {
  // Transform data for recharts
  const chartData: any[] = [];
  const allYears = new Set<number>();
  
  // Collect all years
  data.forEach(countryData => {
    countryData.forEach(d => allYears.add(d.year));
  });
  
  const sortedYears = Array.from(allYears).sort((a, b) => a - b);
  
  // Build chart data structure
  sortedYears.forEach(year => {
    const yearData: any = { year };
    data.forEach((countryData, country) => {
      const dataPoint = countryData.find(d => d.year === year);
      yearData[country] = dataPoint ? dataPoint.value : null;
    });
    chartData.push(yearData);
  });

  const countries = Array.from(data.keys());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bandwidth Trends Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="year" 
              stroke="hsl(var(--foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--foreground))"
              fontSize={12}
              label={{ value: 'Kbps per capita', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: any) => [
                typeof value === 'number' ? `${value.toFixed(2)} Kbps` : 'N/A',
                ''
              ]}
            />
            <Legend />
            {countries.map((country, idx) => (
              <Line
                key={country}
                type="monotone"
                dataKey={country}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
