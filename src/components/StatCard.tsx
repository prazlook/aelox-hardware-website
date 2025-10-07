import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { VerticalGauge } from './VerticalGauge';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const timeRanges = ["30s", "1min", "5min", "10min"];

interface StatCardProps {
  title: string;
  gaugeValue: number;
  gaugeMaxValue: number;
  gaugeUnit: string;
  gaugeColor: string;
  history: { time: string; [key: string]: any }[];
  dataKey: string;
}

export const StatCard = ({ title, gaugeValue, gaugeMaxValue, gaugeUnit, gaugeColor, history, dataKey }: StatCardProps) => {
  const [timeRange, setTimeRange] = useState("1min");

  const handleTimeChange = (value: string) => {
    if (value) {
      setTimeRange(value);
    }
  };

  const displayedHistory = useMemo(() => {
    const pointsToShow: { [key: string]: number } = {
      "30s": 60,    // 30s * 2 points/sec
      "1min": 120,   // 60s * 2 points/sec
      "5min": 600,   // 300s * 2 points/sec
      "10min": 1200, // 600s * 2 points/sec
    };
    const numPoints = pointsToShow[timeRange] || history.length;
    return history.slice(-numPoints);
  }, [history, timeRange]);

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
        </div>
        <div className="flex items-center justify-between">
          <div className="w-full h-48 mr-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayedHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gaugeColor} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={gaugeColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 20, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#A0AEC0' }}
                  itemStyle={{ color: gaugeColor, fontWeight: 'bold' }}
                  formatter={(value: number) => [`${value.toFixed(2)} ${gaugeUnit}`, null]}
                  labelFormatter={(label) => `Heure: ${label}`}
                />
                <XAxis dataKey="time" stroke="#A0AEC0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#A0AEC0" fontSize={12} tickLine={false} axisLine={false} width={40} domain={['dataMin - 10', 'dataMax + 10']} />
                <Area type="monotone" dataKey={dataKey} stroke={gaugeColor} strokeWidth={2} fillOpacity={1} fill={`url(#color-${dataKey})`} />
              </AreaChart>
            </ResponsiveContainer>
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