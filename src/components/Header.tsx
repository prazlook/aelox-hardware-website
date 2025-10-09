import { Wifi, Zap, Cloud, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStatus } from '@/context/AppStatusContext'; // Import useAppStatus
import { cn } from '@/lib/utils'; // Import cn

const Stat = ({ icon: Icon, label, value, unit, className, style }: { icon: React.ElementType, label: string, value: string, unit: string, className?: string, style?: React.CSSProperties }) => (
  <div className={cn("flex items-center space-x-2 text-sm", className)} style={style}>
    <Icon className="w-4 h-4 text-theme-cyan" />
    <span className="text-theme-text-secondary">{label}:</span>
    <span className="font-semibold">{value}</span>
    <span className="text-theme-text-secondary">{unit}</span>
  </div>
);

export const Header = () => {
  const { appPhase } = useAppStatus(); // Get appPhase
  const triggerMainUiAnimation = appPhase === 'running';

  return (
    <header className="bg-theme-card h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-6">
        <Stat 
          icon={Wifi} 
          label="Réseau" 
          value="↓ 8.5 / ↑ 2.4" 
          unit="MB/s" 
          className={cn("initial-slide-in-left", triggerMainUiAnimation && "animate-startup-slide-in-left")}
          style={triggerMainUiAnimation ? { animationDelay: '0.3s' } : {}}
        />
        <Stat 
          icon={Zap} 
          label="Réseau Électrique" 
          value="10000" 
          unit="W max" 
          className={cn("initial-slide-in-left", triggerMainUiAnimation && "animate-startup-slide-in-left")}
          style={triggerMainUiAnimation ? { animationDelay: '0.4s' } : {}}
        />
      </div>
      <div className="flex items-center space-x-4">
        <Badge 
          variant="outline" 
          className={cn("border-green-500/50 bg-green-500/10 text-green-400 initial-fade-in-scale", triggerMainUiAnimation && "animate-startup-fade-in-scale")}
          style={triggerMainUiAnimation ? { animationDelay: '0.5s' } : {}}
        >
          <Cloud className="w-4 h-4 mr-2" />
          Cloud Connecté
        </Badge>
        <Badge 
          variant="outline" 
          className={cn("border-green-500/50 bg-green-500/10 text-green-400 initial-fade-in-scale", triggerMainUiAnimation && "animate-startup-fade-in-scale")}
          style={triggerMainUiAnimation ? { animationDelay: '0.6s' } : {}}
        >
          <Layers className="w-4 h-4 mr-2" />
          Pool Actif
        </Badge>
      </div>
    </header>
  );
};