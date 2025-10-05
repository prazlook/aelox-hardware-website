import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  time: string;
  hashrate: number;
  temperature: number;
  power: number;
}

interface RealTimeChartProps {
  data: ChartData[];
}

export const RealTimeChart = ({ data }: RealTimeChartProps) => {
  return (
    <Card className="bg-gray-900/50 border-gray-700 text-white backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Statistiques Globales en Temps Réel</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.5)" />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(20, 20, 20, 0.8)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="hashrate" name="Hashrate (TH/s)" stroke="#8884d8" dot={false} />
            <Line type="monotone" dataKey="temperature" name="Température (°C)" stroke="#82ca9d" dot={false} />
            <Line type="monotone" dataKey="power" name="Consommation (kW)" stroke="#ffc658" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};