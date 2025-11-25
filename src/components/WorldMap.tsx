import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BandwidthData } from "@/utils/dataProcessor";
import { useEffect, useRef } from "react";

interface WorldMapProps {
  data: BandwidthData[];
  year: number;
  onCountryClick?: (country: string) => void;
}

export const WorldMap = ({ data, year, onCountryClick }: WorldMapProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Calculate color intensity based on value
  const getColorForValue = (value: number, maxValue: number) => {
    const intensity = Math.min(value / maxValue, 1);
    const hue = 217; // Blue hue from our color scheme
    const saturation = 91;
    const lightness = 95 - intensity * 35; // From light to darker
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Bandwidth Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[400px] overflow-y-auto">
          {data
            .sort((a, b) => b.value - a.value)
            .map((item) => (
              <div
                key={item.countryCode}
                className="p-3 rounded-lg border border-border hover:border-primary transition-all cursor-pointer"
                style={{
                  backgroundColor: getColorForValue(item.value, maxValue)
                }}
                onClick={() => onCountryClick && onCountryClick(item.country)}
              >
                <div className="text-xs font-semibold mb-1 truncate" title={item.country}>
                  {item.country}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.value.toFixed(2)} Kbps
                </div>
              </div>
            ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Lower</span>
          <div className="flex gap-1">
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity) => (
              <div
                key={intensity}
                className="w-8 h-4 rounded"
                style={{
                  backgroundColor: getColorForValue(intensity * maxValue, maxValue)
                }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Higher</span>
        </div>
      </CardContent>
    </Card>
  );
};
