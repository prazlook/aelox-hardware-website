import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Thermometer, Fan, Power, Eye, ActivitySquare, Minus, CheckCircle, AlertTriangle } from "lucide-react";
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
}

interface ASICStatusCardProps {
  asic: ASIC;
  maxTemp: number;
  onTogglePower: (asicId: string) => void;
}

const STATUS_CONFIG: Record<ASICStatus, { label: string; color: string; icon: React.ReactNode }> = {
  online: { label: 'Online', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <CheckCircle size={12} /> },
  offline: { label: 'Offline', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: <Power size={12} /> },
  starting: { label: 'Starting', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: <Minus size={12} /> },
  stopping: { label: 'Stopping', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: <Minus size={12} /> },
  analyzing: { label: 'Analyzing', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: <Minus size={12} /> },
  alert: { label: 'Alert', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <AlertTriangle size={12} /> },
};

const StatusBadge = ({ status }: { status: ASICStatus }) => {
  const config = STATUS_CONFIG[status];
  return (
    <div className={cn("flex items-center space-x-1.5 rounded-full border px-2 py-0.5 text-xs font-medium", config.color)}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

const getStatusMessage = (status: ASICStatus) => {
  switch (status) {
    case 'online': return 'Fonctionnement optimal';
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
    <div className="text-gray-400">{icon}</div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className={cn("text-sm font-semibold", className)}>{value} <span className="text-xs font-normal text-gray-400">{unit}</span></p>
    </div>
  </div>
);

export const ASICStatusCard = ({ asic, maxTemp, onTogglePower }: ASICStatusCardProps) => {
  const isAlerting = asic.temperature >= maxTemp;
  const currentStatus = isAlerting ? 'alert' : asic.status;
  const tempColor = isAlerting ? 'text-red-500' : asic.temperature > maxTemp - 10 ? 'text-orange-400' : 'text-white';

  return (
    <Card className="bg-gray-800/50 border-gray-700 text-white backdrop-blur-sm p-4 flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold leading-tight">{asic.name}</h3>
          <p className="text-xs text-gray-400">{asic.model}</p>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={currentStatus} />
          <Button
            size="icon"
            variant="outline"
            className="w-8 h-8 rounded-full bg-gray-700/50 border-gray-600 hover:bg-gray-700"
            onClick={() => onTogglePower(asic.id)}
            disabled={asic.status === 'starting' || asic.status === 'stopping'}
          >
            <Power size={16} />
          </Button>
        </div>
      </div>

      <div className="text-center text-sm text-blue-300 border border-blue-500/30 bg-blue-900/20 rounded-md py-1.5">
        {getStatusMessage(currentStatus)}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <StatItem icon={<ActivitySquare size={20} />} label="Hashrate" value={asic.hashrate.toFixed(2)} unit="TH/s" />
        <StatItem icon={<Thermometer size={20} />} label="Température" value={asic.temperature.toFixed(2)} unit="°C" className={tempColor} />
        <StatItem icon={<Zap size={20} />} label="Puissance" value={asic.power.toFixed(0)} unit="W" />
        <StatItem icon={<Fan size={20} />} label="Ventilateur" value={asic.fanSpeed.toFixed(0)} unit="%" />
      </div>

      <Button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold hover:opacity-90">
        <Eye size={16} className="mr-2" />
        Voir Détails
      </Button>
    </Card>
  );
};