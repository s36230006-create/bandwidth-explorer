import { useState, useEffect } from "react";
import { Activity, TrendingUp, Users, Globe } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { FilterControls } from "@/components/FilterControls";
import { TrendChart } from "@/components/TrendChart";
import { TopCountriesChart } from "@/components/TopCountriesChart";
import { InsightsSection } from "@/components/InsightsSection";
import { WorldMap } from "@/components/WorldMap";
import {
  parseCSVData,
  getTopCountries,
  getTrendData,
  calculateGlobalAverage,
  calculateYoYGrowth,
  getFastestGrowing,
  ProcessedData,
  BandwidthData
} from "@/utils/dataProcessor";

const Index = () => {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2020);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/src/data/bandwidth-data.csv');
        const csvText = await response.text();
        const data = parseCSVData(csvText);
        setProcessedData(data);
        setSelectedYear(data.maxYear);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !processedData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading bandwidth data...</p>
        </div>
      </div>
    );
  }

  const yearData = processedData.allData.filter(d => d.year === selectedYear);
  const topCountries = getTopCountries(processedData.allData, selectedYear);
  const globalAverage = calculateGlobalAverage(processedData.allData, selectedYear);
  const yoyGrowth = calculateYoYGrowth(processedData.allData, selectedYear);
  const fastestGrowing = getFastestGrowing(processedData.allData, selectedYear);

  // Prepare trend data - show top 5 countries or selected countries
  const trendCountries = selectedCountries.length > 0 
    ? selectedCountries 
    : topCountries.slice(0, 5).map(d => d.country);
  const trendData = getTrendData(processedData.allData, trendCountries);

  const handleCountryClick = (country: string) => {
    setSelectedCountries([country]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            International Bandwidth Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Global bandwidth per capita analysis and trends
          </p>
        </div>

        {/* Filters */}
        <FilterControls
          countries={processedData.countries}
          years={processedData.years}
          selectedCountries={selectedCountries}
          selectedYear={selectedYear}
          minYear={processedData.minYear}
          maxYear={processedData.maxYear}
          onCountryChange={setSelectedCountries}
          onYearChange={setSelectedYear}
        />

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Global Average"
            value={`${globalAverage.toFixed(2)} Kbps`}
            subtitle={`${selectedYear} data`}
            icon={Globe}
          />
          <KPICard
            title="Year-over-Year Growth"
            value={`${yoyGrowth >= 0 ? '+' : ''}${yoyGrowth.toFixed(1)}%`}
            subtitle={`vs ${selectedYear - 1}`}
            icon={TrendingUp}
            trend={yoyGrowth > 0 ? "up" : yoyGrowth < 0 ? "down" : "neutral"}
          />
          <KPICard
            title="Top Performer"
            value={topCountries[0]?.country || 'N/A'}
            subtitle={`${topCountries[0]?.value.toFixed(2) || '0'} Kbps`}
            icon={Activity}
            trend="up"
          />
          <KPICard
            title="Countries Tracked"
            value={yearData.length}
            subtitle={`in ${selectedYear}`}
            icon={Users}
          />
        </div>

        {/* World Map */}
        <WorldMap
          data={yearData}
          year={selectedYear}
          onCountryClick={handleCountryClick}
        />

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TrendChart data={trendData} />
          <TopCountriesChart 
            data={topCountries}
            onCountryClick={handleCountryClick}
          />
        </div>

        {/* Insights */}
        <InsightsSection
          globalAverage={globalAverage}
          yoyGrowth={yoyGrowth}
          topCountries={topCountries}
          fastestGrowing={fastestGrowing}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
};

export default Index;
