export interface BandwidthData {
  country: string;
  countryCode: string;
  year: number;
  value: number;
}

export interface ProcessedData {
  allData: BandwidthData[];
  countries: string[];
  years: number[];
  minYear: number;
  maxYear: number;
}

export const parseCSVData = (csvText: string): ProcessedData => {
  const lines = csvText.split('\n').slice(1); // Skip header
  const dataMap = new Map<string, BandwidthData[]>();
  
  const allData: BandwidthData[] = [];
  const yearsSet = new Set<number>();
  const countriesMap = new Map<string, string>();
  
  lines.forEach(line => {
    if (!line.trim()) return;
    
    const values = line.split(',');
    if (values.length < 24) return;
    
    const countryCode = values[5]?.trim();
    const country = values[6]?.trim();
    const year = parseInt(values[23]?.trim());
    const value = parseFloat(values[24]?.trim());
    
    if (countryCode && country && !isNaN(year) && !isNaN(value) && value > 0) {
      const dataPoint: BandwidthData = {
        country,
        countryCode,
        year,
        value
      };
      
      allData.push(dataPoint);
      yearsSet.add(year);
      countriesMap.set(countryCode, country);
    }
  });
  
  const years = Array.from(yearsSet).sort((a, b) => a - b);
  const countries = Array.from(countriesMap.values()).sort();
  
  return {
    allData,
    countries,
    years,
    minYear: years[0] || 2000,
    maxYear: years[years.length - 1] || 2023
  };
};

export const filterData = (
  data: BandwidthData[],
  selectedCountries: string[],
  selectedYear: number
): BandwidthData[] => {
  return data.filter(d => {
    const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(d.country);
    const yearMatch = d.year === selectedYear;
    return countryMatch && yearMatch;
  });
};

export const getTopCountries = (data: BandwidthData[], year: number, limit: number = 10): BandwidthData[] => {
  return data
    .filter(d => d.year === year)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};

export const getTrendData = (data: BandwidthData[], countries: string[]): Map<string, BandwidthData[]> => {
  const trendMap = new Map<string, BandwidthData[]>();
  
  countries.forEach(country => {
    const countryData = data
      .filter(d => d.country === country)
      .sort((a, b) => a.year - b.year);
    
    if (countryData.length > 0) {
      trendMap.set(country, countryData);
    }
  });
  
  return trendMap;
};

export const calculateGlobalAverage = (data: BandwidthData[], year: number): number => {
  const yearData = data.filter(d => d.year === year);
  if (yearData.length === 0) return 0;
  
  const sum = yearData.reduce((acc, d) => acc + d.value, 0);
  return sum / yearData.length;
};

export const calculateYoYGrowth = (data: BandwidthData[], year: number): number => {
  const currentAvg = calculateGlobalAverage(data, year);
  const previousAvg = calculateGlobalAverage(data, year - 1);
  
  if (previousAvg === 0) return 0;
  return ((currentAvg - previousAvg) / previousAvg) * 100;
};

export const getFastestGrowing = (data: BandwidthData[], year: number, limit: number = 5): Array<{country: string, growth: number}> => {
  const currentYear = data.filter(d => d.year === year);
  const previousYear = data.filter(d => d.year === year - 1);
  
  const growthMap = new Map<string, number>();
  
  currentYear.forEach(current => {
    const previous = previousYear.find(p => p.country === current.country);
    if (previous && previous.value > 0) {
      const growth = ((current.value - previous.value) / previous.value) * 100;
      growthMap.set(current.country, growth);
    }
  });
  
  return Array.from(growthMap.entries())
    .map(([country, growth]) => ({ country, growth }))
    .sort((a, b) => b.growth - a.growth)
    .slice(0, limit);
};
