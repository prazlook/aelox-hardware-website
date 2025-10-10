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
  const { triggerStartupAnimation, triggerShutdownAnimation } = useAppStatus(); // Get animation trigger

  return (
    <header className={cn(
      "bg-theme-card h-16 flex items-center justify-between px-6 fixed bottom-0 left-0 right-0 z-50",
      triggerStartupAnimation && "animate-startup-fade-in-scale",
      triggerShutdownAnimation && "animate-staggered-fade-out"
    )}
      style={triggerStartupAnimation ? { animationDelay: '0.5s' } : triggerShutdownAnimation ? { '--delay': '0.1s' } as React.CSSProperties : {}}
    >
      {/* Les mentions "Réseau" et "Réseau Électrique" ont été retirées */}
      <div className="flex items-center space-x-6">
        {/* Les Stat components ont été supprimés */}
      </div>
      <div className="flex items-center space-x-4">
        <Badge 
          variant="outline" 
          className={cn(
            "border-green-500/50 bg-green-500/10 text-green-400",
            triggerStartupAnimation && "animate-startup-fade-in-scale",
            triggerShutdownAnimation && "animate-staggered-fade-out"
          )}
          style={triggerStartupAnimation ? { animationDelay: '0.5s' } : triggerShutdownAnimation ? { '--delay': '0.3s' } as React.CSSProperties : {}}
        >
          <Cloud className="w-4 h-4 mr-2" />
          Cloud Connecté
        </Badge>
        <Badge 
          variant="outline" 
          className={cn(
            "border-green-500/50 bg-green-500/10 text-green-400",
            triggerStartupAnimation && "animate-startup-fade-in-scale",
            triggerShutdownAnimation && "animate-staggered-fade-out"
          )}
          style={triggerStartupAnimation ? { animationDelay: '0.6s' } : triggerShutdownAnimation ? { '--delay': '0.5s' } as React.CSSProperties : {}}
        >
          <Layers className="w-4 h-4 mr-2" />
          Pool Actif
        </Badge>
      </div>
    </header>
  );
};