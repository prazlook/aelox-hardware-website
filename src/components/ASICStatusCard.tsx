import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Thermometer, Fan } from "lucide-react";
import { cn } from "@/lib/utils";
import { ECGStatusIcon } from "./ECGStatusIcon";
import { AnimatedHashrateIcon } from "./AnimatedHashrateIcon";

export interface ASIC {
  id: string;
  name: string;
  hashrate: number;
  temperature: number;
  power: number;
  fanSpeed: number;
  isFanOn: boolean;
  isOnline: boolean;
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
  return (
    <Card className={cn(
      "bg-gray-900/50 border-gray-700 text-white backdrop-blur-sm transition-colors",
      isAlerting && "border-red-500/50",
      asic.isOnline && "bg-gradient-to-r from-gray-900/50 via-blue-900/20 to-gray-900/50 animate-gradient [background-size:200%_200%]"
    )}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{asic.name}</span>
          <ECGStatusIcon isOnline={asic.isOnline} isAlerting={isAlerting} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <StatItem 
          icon={<AnimatedHashrateIcon isOnline={asic.isOnline} />} 
          label="Hashrate" 
          value={asic.hashrate} 
          unit="TH/s" 
          isAlerting={isAlerting} 
        />
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