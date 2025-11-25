import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BandwidthData } from "@/utils/dataProcessor";

interface TopCountriesChartProps {
  data: BandwidthData[];
  onCountryClick?: (country: string) => void;
}

export const TopCountriesChart = ({ data, onCountryClick }: TopCountriesChartProps) => {
  const chartData = data.map(d => ({
    country: d.country.length > 15 ? d.country.substring(0, 15) + '...' : d.country,
    fullCountry: d.country,
    value: d.value
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Countries by Bandwidth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={chartData}
            layout="vertical"
            margin={{ left: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              stroke="hsl(var(--foreground))"
              fontSize={12}
              label={{ value: 'Kbps per capita', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="category"
              dataKey="country" 
              stroke="hsl(var(--foreground))"
              fontSize={12}
              width={90}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: any, name: any, props: any) => [
                `${value.toFixed(2)} Kbps`,
                props.payload.fullCountry
              ]}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))"
              radius={[0, 8, 8, 0]}
              cursor="pointer"
              onClick={(data: any) => {
                if (onCountryClick) {
                  onCountryClick(data.fullCountry);
                }
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
