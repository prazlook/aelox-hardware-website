import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { VerticalGauge } from './VerticalGauge';

const timeRanges = ["30s", "1min", "5min", "10min", "1h"];
const dayRanges = ["Journée"];

interface StatCardProps {
  title: string;
  gaugeValue: number;
  gaugeMaxValue: number;
  gaugeUnit: string;
  gaugeColor: string;
}

export const StatCard = ({ title, gaugeValue, gaugeMaxValue, gaugeUnit, gaugeColor }: StatCardProps) => {
  const [timeRange, setTimeRange] = useState("5min");

  const handleTimeChange = (value: string) => {
    if (value) {
      setTimeRange(value);
    }
  };

  return (
    <Card className="bg-theme-card border-gray-700/50 p-4">
      <CardHeader className="p-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex flex-wrap gap-2 mb-6">
          <ToggleGroup type="single" value={timeRange} onValueChange={handleTimeChange}>
            {timeRanges.map((range) => (
              <ToggleGroupItem 
                key={range} 
                value={range} 
                aria-label={`Select ${range}`}
                className="data-[state=on]:bg-blue-600 data-[state=on]:text-white hover:bg-gray-700/50"
              >
                {range}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ToggleGroup type="single" value={timeRange} onValueChange={handleTimeChange}>
            {dayRanges.map((range) => (
              <ToggleGroupItem 
                key={range} 
                value={range} 
                aria-label={`Select ${range}`}
                className="data-[state=on]:bg-blue-600 data-[state=on]:text-white hover:bg-gray-700/50"
              >
                {range}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-full h-48 border-2 border-dashed border-gray-700/50 rounded-lg mr-8 flex items-center justify-center">
            <p className="text-gray-600 text-sm">Graphique à venir</p>
          </div>
          <VerticalGauge
            value={gaugeValue}
            maxValue={gaugeMaxValue}
            color={gaugeColor}
            unit={gaugeUnit}
          />
        </div>
      </CardContent>
    </Card>
  );
};