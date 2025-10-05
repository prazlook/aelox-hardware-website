import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Thermometer, Fan, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ASIC {
  id: string;
  name: string;
  hashrate: number;
  temperature: number;
  power: number;
  fanSpeed: number;
  isFanOn: boolean;
}

interface ASICStatusCardProps {
  asic: ASIC;
  isAlerting: boolean;
  maxTemp: number;
  onToggleFan: (asicId: string) => void;
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

export const ASICStatusCard = ({ asic, isAlerting, maxTemp, onToggleFan }: ASICStatusCardProps) => {

  const getStatusColor = (temperature: number, max: number) => {
    const percentage = temperature / max;
    if (percentage >= 1) return "bg-red-500";
    if (percentage > 0.95) return "bg-orange-500";
    if (percentage > 0.9) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card className={cn("bg-gray-900/50 border-gray-700 text-white backdrop-blur-sm", isAlerting && "border-red-500/50")}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{asic.name}</span>
          <div className={cn("w-3 h-3 rounded-full animate-pulse", getStatusColor(asic.temperature, maxTemp))}></div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <StatItem icon={<Cpu size={20} />} label="Hashrate" value={asic.hashrate} unit="TH/s" isAlerting={isAlerting} />
        <StatItem icon={<Zap size={20} />} label="Consommation" value={asic.power} unit="W" isAlerting={isAlerting} />
        <StatItem icon={<Thermometer size={20} />} label="Température" value={asic.temperature} unit="°C" isAlerting={isAlerting} />
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onToggleFan(asic.id)}
            className={cn(
              "rounded-full p-2 bg-gray-700 transition-colors hover:bg-gray-600",
              isAlerting && "bg-red-900/50 hover:bg-red-800/50",
              !asic.isFanOn && "bg-gray-800"
            )}
            aria-label={asic.isFanOn ? "Éteindre le ventilateur" : "Allumer le ventilateur"}
          >
            <Fan
              size={20}
              className={cn(
                "transition-colors",
                asic.isFanOn ? "animate-spin" : "text-gray-500"
              )}
              style={{ animationDuration: asic.isFanOn ? `${2000 / (asic.fanSpeed / 50 + 1)}ms` : '0ms' }}
            />
          </button>
          <div>
            <p className="text-sm text-gray-400">Ventilateur</p>
            <p className="text-lg font-bold">{asic.fanSpeed.toFixed(0)} <span className="text-sm font-normal">%</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};