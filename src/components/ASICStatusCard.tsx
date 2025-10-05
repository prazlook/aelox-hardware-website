import { Button } from "@/components/ui/button";
import { Zap, Thermometer, Fan, Power, Eye, Activity, PlusCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ASICStatus = 'online' | 'offline' | 'starting' | 'stopping' | 'analyzing' | 'alert';

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
}

interface ASICStatusCardProps {
  asic: ASIC;
  maxTemp: number;
  onTogglePower: (asicId: string) => void;
  onToggleFan: (asicId: string) => void;
}

const StatusBadge = ({ status }: { status: ASICStatus }) => {
  const isOnline = status === 'online';
  return (
    <div className={cn(
      "flex items-center space-x-1.5 rounded-full px-2 py-0.5 text-xs font-medium border",
      isOnline 
        ? "bg-green-500/10 text-green-400 border-green-500/20" 
        : "bg-gray-500/10 text-gray-400 border-gray-500/20"
    )}>
      {isOnline ? <PlusCircle size={12} /> : <XCircle size={12} />}
      <span>{status}</span>
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

export const ASICStatusCard = ({ asic, maxTemp, onTogglePower, onToggleFan }: ASICStatusCardProps) => {
  const isAlerting = asic.temperature >= maxTemp;
  const isWarning = asic.temperature > maxTemp - 10;
  const currentStatus = isAlerting ? 'alert' : asic.status;
  const tempColor = isAlerting ? 'text-red-500' : isWarning ? 'text-orange-400' : 'text-white';

  return (
    <div className={cn(
      "bg-theme-card p-4 rounded-lg border flex flex-col space-y-3 transition-colors",
      isWarning ? "border-orange-500" : "border-theme-accent/30"
    )}>
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
            className="w-8 h-8 rounded-full text-theme-text-secondary hover:bg-theme-accent/20 hover:text-theme-accent"
            onClick={() => onTogglePower(asic.id)}
            disabled={asic.status === 'starting' || asic.status === 'stopping'}
          >
            <Power size={16} />
          </Button>
        </div>
      </div>

      <div className="text-center text-sm text-theme-accent border border-theme-accent/30 rounded-md py-1.5">
        {getStatusMessage(currentStatus)}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
        <StatItem icon={<Activity size={20} />} label="Hashrate" value={asic.hashrate.toFixed(2)} unit="TH/s" />
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

      <Button className="w-full bg-theme-cyan text-black font-bold hover:bg-theme-cyan/90">
        <Eye size={16} className="mr-2" />
        Voir Détails
      </Button>
    </div>
  );
};