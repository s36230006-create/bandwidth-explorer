import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Award, Zap, AlertCircle } from "lucide-react";
import { BandwidthData } from "@/utils/dataProcessor";

interface InsightsSectionProps {
  globalAverage: number;
  yoyGrowth: number;
  topCountries: BandwidthData[];
  fastestGrowing: Array<{ country: string; growth: number }>;
  selectedYear: number;
}

export const InsightsSection = ({
  globalAverage,
  yoyGrowth,
  topCountries,
  fastestGrowing,
  selectedYear
}: InsightsSectionProps) => {
  const insights = [
    {
      icon: TrendingUp,
      title: "Global Growth Pattern",
      description: `In ${selectedYear}, the global average bandwidth per capita ${
        yoyGrowth > 0 ? 'increased' : 'decreased'
      } by ${Math.abs(yoyGrowth).toFixed(1)}% compared to the previous year. This ${
        yoyGrowth > 5 ? 'substantial' : yoyGrowth > 0 ? 'moderate' : 'concerning'
      } trend reflects ${
        yoyGrowth > 0 ? 'ongoing digital infrastructure expansion worldwide' : 'potential market challenges'
      }.`
    },
    {
      icon: Award,
      title: "Leading Countries",
      description: `${topCountries[0]?.country || 'N/A'} leads with ${
        topCountries[0]?.value.toFixed(2) || '0'
      } Kbps per capita, followed by ${topCountries[1]?.country || 'N/A'} and ${
        topCountries[2]?.country || 'N/A'
      }. These nations demonstrate advanced telecommunications infrastructure and high digital adoption rates.`
    },
    {
      icon: Zap,
      title: "Fastest Improvers",
      description: `${fastestGrowing[0]?.country || 'N/A'} showed the highest growth rate at ${
        fastestGrowing[0]?.growth.toFixed(1) || '0'
      }%, indicating significant infrastructure investments. Other notable improvers include ${
        fastestGrowing[1]?.country || 'N/A'
      } and ${fastestGrowing[2]?.country || 'N/A'
      }, suggesting a global shift toward enhanced connectivity.`
    },
    {
      icon: AlertCircle,
      title: "Notable Observations",
      description: `The gap between top performers and the global average (${globalAverage.toFixed(
        2
      )} Kbps) highlights significant disparities in digital infrastructure. Countries with ${
        topCountries[0]?.value > globalAverage * 10
          ? 'exceptional'
          : 'strong'
      } bandwidth capacity often correlate with advanced economies and tech-forward policies.`
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Insights & Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-primary/10 p-3">
                  <insight.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{insight.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
