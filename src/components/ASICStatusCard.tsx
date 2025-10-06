import { Button } from "@/components/ui/button";
import { Zap, Thermometer, Fan, Power, Eye, Activity, PlusCircle, XCircle, PowerOff, Cpu, AlertTriangle, PauseCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedHashrateIcon } from "./AnimatedHashrateIcon";
import { AnimatedBorderCard } from "./AnimatedBorderCard";

export type ASICStatus = 'online' | 'offline' | 'starting' | 'stopping' | 'analyzing' | 'alert' | 'idle';

export interface ASIC {
  id: string;
  name: string;
  model: string;
  status: ASICStatus;
  hashrate: number;
  temperature: number;
  power: number;
  fanSpeed: number;
  isFanOn: boolean;
  isOverclocked: boolean;
  comment?: string;
}

interface ASICStatusCardProps {
  asic: ASIC;
  maxTemp: number;
  onTogglePower: (asicId: string) => void;
  onToggleFan: (asicId: string) => void;
  onToggleOverclock: (asicId: string) => void;
}

const StatusBadge = ({ status }: { status: ASICStatus }) => {
  const statusConfig = {
    online: { label: "En Ligne", className: "bg-green-500/10 text-green-400 border-green-500/20", icon: <PlusCircle size={12} /> },
    offline: { label: "Hors Ligne", className: "bg-gray-500/10 text-gray-400 border-gray-500/20", icon: <XCircle size={12} /> },
    starting: { label: "Démarrage", className: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <Loader2 size={12} className="animate-spin" /> },
    stopping: { label: "Arrêt", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: <Loader2 size={12} className="animate-spin" /> },
    idle: { label: "En Pause", className: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: <PauseCircle size={12} /> },
    alert: { label: "ALERTE", className: "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse", icon: <AlertTriangle size={12} /> },
    analyzing: { label: "Analyse", className: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: <Activity size={12} /> },
  };

  const config = statusConfig[status] || statusConfig.offline;

  return (
    <div className={cn("flex items-center space-x-1.5 rounded-full px-2 py-0.5 text-xs font-medium border", config.className)}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

const getStatusMessage = (status: ASICStatus) => {
  switch (status) {
    case 'online': return 'Analyse en cours...';
    case 'offline': return 'Machine hors ligne';
    case 'starting': return 'Démarrage en cours...';
    case 'stopping': return 'Arrêt en cours...';
    case 'analyzing': return 'Analyse en cours...';
    case 'alert': return 'Surchauffe détectée !';
    case 'idle': return 'Surchauffe, minage en pause';
    default: return 'Statut inconnu';
  }
};

const StatItem = ({ icon, label, value, unit, className }: { icon: React.ReactNode, label: string, value: string, unit: string, className?: string }) => (
  <div className="flex items-center space-x-2">
    <div className="text-theme-cyan">{icon}</div>
    <div>
      <p className="text-xs text-theme-text-secondary">{label}</p>
      <p className={cn("text-sm font-semibold", className)}>{value} <span className="text-xs font-normal text-theme-text-secondary">{unit}</span></p>
    </div>
  </div>
);

export const ASICStatusCard = ({ asic, maxTemp, onTogglePower, onToggleFan, onToggleOverclock }: ASICStatusCardProps) => {
  const isAlerting = asic.temperature >= maxTemp;
  const isWarning = asic.temperature > maxTemp - 10;
  const currentStatus = isAlerting ? 'alert' : asic.status;
  const tempColor = isAlerting ? 'text-red-500' : isWarning ? 'text-orange-400' : 'text-white';
  
  const isOnline = asic.status === 'online';
  const isOffline = asic.status === 'offline';
  const isTransitioning = asic.status === 'starting' || asic.status === 'stopping';

  const message = (currentStatus === 'online' || currentStatus === 'analyzing') && asic.comment 
    ? asic.comment 
    : getStatusMessage(currentStatus);

  const truncatedMessage = message.length > 26 ? message.substring(0, 23) + '...' : message;

  let animationColor = isWarning ? "#EF4444" : "#00F0FF";
  let animationClassName = "animate-stroke-spin";

  if (isTransitioning) {
    animationColor = "#A0AEC0";
    animationClassName = "animate-marching-ants";
  }

  const PowerIcon = isOffline ? PowerOff : Power;
  const powerIconClassName = cn({
    "text-gray-500": isOffline || isTransitioning,
    "text-white animate-pulse": isOnline,
    "text-theme-text-secondary": !isOffline && !isTransitioning && !isOnline,
  });

  const isOverclockedAndOnline = asic.isOverclocked && isOnline;

  const cardContent = (
    <>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold leading-tight">{asic.name}</h3>
          <p className="text-xs text-theme-text-secondary mt-1">{asic.model}</p>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={currentStatus} />
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "w-8 h-8 rounded-full hover:bg-theme-accent/20",
              asic.isOverclocked ? "text-theme-cyan hover:text-theme-cyan" : "text-theme-text-secondary hover:text-white"
            )}
            onClick={() => onToggleOverclock(asic.id)}
            disabled={!isOnline}
          >
            <Cpu size={16} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 rounded-full hover:bg-theme-accent/20 hover:text-theme-accent"
            onClick={() => onTogglePower(asic.id)}
            disabled={isTransitioning}
          >
            <PowerIcon size={16} className={powerIconClassName} />
          </Button>
        </div>
      </div>

      <div className="text-center text-sm text-theme-accent border border-theme-accent/30 rounded-lg py-1.5">
        {truncatedMessage}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
        <StatItem 
          icon={isOnline ? <AnimatedHashrateIcon width={20} height={20} /> : <Activity size={20} />} 
          label="Hashrate" 
          value={asic.hashrate.toFixed(2)} 
          unit="TH/s" 
        />
        <StatItem icon={<Thermometer size={20} />} label="Température" value={asic.temperature.toFixed(2)} unit="°C" className={tempColor} />
        <StatItem icon={<Zap size={20} />} label="Puissance" value={asic.power.toFixed(0)} unit="W" />
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleFan(asic.id)}
            className="p-1 rounded-full text-theme-cyan hover:bg-theme-accent/20"
            aria-label={asic.isFanOn ? "Éteindre le ventilateur" : "Allumer le ventilateur"}
          >
            <Fan
              size={20}
              className={cn(
                "transition-colors",
                asic.isFanOn ? "animate-spin" : "text-gray-500"
              )}
              style={{ animationDuration: asic.isFanOn ? '1s' : '0ms' }}
            />
          </button>
          <div>
            <p className="text-xs text-theme-text-secondary">Ventilateur</p>
            <p className="text-sm font-semibold">{asic.fanSpeed.toFixed(0)} <span className="text-xs font-normal text-theme-text-secondary">%</span></p>
          </div>
        </div>
      </div>

      <Button className="w-full bg-theme-cyan text-black font-bold hover:bg-theme-cyan/90 rounded-xl">
        <Eye size={16} className="mr-2" />
        Voir Détails
      </Button>
    </>
  );

  if (isOverclockedAndOnline) {
    return (
      <div className="relative rounded-2xl p-0.5 bg-[linear-gradient(120deg,_#10b981,_#06b6d4,_#6366f1,_#ec4899,_#ef4444,_#f97316,_#f59e0b,_#10b981)] bg-[length:200%_200%] animate-aurora">
        <div className="p-4 rounded-[15px] flex flex-col space-y-3 bg-theme-card h-full">
          {cardContent}
        </div>
      </div>
    );
  }

  return (
    <AnimatedBorderCard
      isAnimated={isOnline || isTransitioning}
      color={animationColor}
      animationClassName={animationClassName}
    >
      <div className={cn(
        "p-4 rounded-2xl border flex flex-col space-y-3 transition-colors bg-theme-card h-full",
        isWarning ? "border-orange-500" : "border-theme-accent/30",
      )}>
        {cardContent}
      </div>
    </AnimatedBorderCard>
  );
};