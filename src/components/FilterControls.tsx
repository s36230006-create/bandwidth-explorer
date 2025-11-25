import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Globe, Calendar } from "lucide-react";

interface FilterControlsProps {
  countries: string[];
  years: number[];
  selectedCountries: string[];
  selectedYear: number;
  minYear: number;
  maxYear: number;
  onCountryChange: (countries: string[]) => void;
  onYearChange: (year: number) => void;
}

export const FilterControls = ({
  countries,
  years,
  selectedCountries,
  selectedYear,
  minYear,
  maxYear,
  onCountryChange,
  onYearChange
}: FilterControlsProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-primary" />
            <label className="text-sm font-medium">Select Countries</label>
          </div>
          <Select
            value={selectedCountries[0] || "all"}
            onValueChange={(value) => {
              if (value === "all") {
                onCountryChange([]);
              } else {
                onCountryChange([value]);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Select Year</label>
            </div>
            <span className="text-xl font-bold text-primary">{selectedYear}</span>
          </div>
          <Slider
            value={[selectedYear]}
            onValueChange={(values) => onYearChange(values[0])}
            min={minYear}
            max={maxYear}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{minYear}</span>
            <span>{maxYear}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
