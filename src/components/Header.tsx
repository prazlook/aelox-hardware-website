import { Wifi, Zap, Cloud, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Stat = ({ icon: Icon, label, value, unit }: { icon: React.ElementType, label: string, value: string, unit: string }) => (
  <div className="flex items-center space-x-2 text-sm">
    <Icon className="w-4 h-4 text-theme-cyan" />
    <span className="text-theme-text-secondary">{label}:</span>
    <span className="font-semibold">{value}</span>
    <span className="text-theme-text-secondary">{unit}</span>
  </div>
);

export const Header = () => {
  return (
    <header className="bg-theme-card h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-6">
        <Stat icon={Wifi} label="Réseau" value="↓ 8.5 / ↑ 2.4" unit="MB/s" />
        <Stat icon={Zap} label="Réseau Électrique" value="10000" unit="W max" />
      </div>
      <div className="flex items-center space-x-4">
        <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400">
          <Cloud className="w-4 h-4 mr-2" />
          Cloud Connecté
        </Badge>
        <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400">
          <Layers className="w-4 h-4 mr-2" />
          Pool Actif
        </Badge>
      </div>
    </header>
  );
};