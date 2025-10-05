import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Thermometer, Wind, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ASIC {
  id: string;
  name: string;
  hashrate: number;
  temperature: number;
  power: number;
  fanSpeed: number;
}

interface ASICStatusCardProps {
  asic: ASIC;
  isAlerting: boolean;
}

const StatItem = ({ icon, label, value, unit, isAlerting }: { icon: React.ReactNode, label: string, value: number, unit: string, isAlerting: boolean }) => (
  <div className="flex items-center space-x-3">
    <div className={cn("rounded-full p-2 bg-gray-700", isAlerting && "bg-red-900/50")}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg font-bold">{value.toFixed(2)} <span className="text-sm font-normal">{unit}</span></p>
    </div>
  </div>
);

export const ASICStatusCard = ({ asic, isAlerting }: ASICStatusCardProps) => {
  const tempColor = asic.temperature > 75 ? "text-orange-400" : asic.temperature > 85 ? "text-red-500" : "text-green-400";

  return (
    <Card className={cn("bg-gray-900/50 border-gray-700 text-white backdrop-blur-sm", isAlerting && "border-red-500/50")}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{asic.name}</span>
          <div className={cn("w-3 h-3 rounded-full bg-green-500 animate-pulse", isAlerting && "bg-red-500")}></div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <StatItem icon={<Cpu size={20} />} label="Hashrate" value={asic.hashrate} unit="TH/s" isAlerting={isAlerting} />
        <StatItem icon={<Zap size={20} />} label="Consommation" value={asic.power} unit="W" isAlerting={isAlerting} />
        <StatItem icon={<Thermometer size={20} />} label="Température" value={asic.temperature} unit="°C" isAlerting={isAlerting} />
        <StatItem icon={<Wind size={20} />} label="Ventilateur" value={asic.fanSpeed} unit="%" isAlerting={isAlerting} />
      </CardContent>
    </Card>
  );
};