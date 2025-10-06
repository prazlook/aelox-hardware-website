import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Zap, Thermometer, Fan, Power, PowerOff, Eye, Activity, Cpu, AlertTriangle, Flame, Minus, ArrowUp, ArrowDown, ShieldAlert, Hourglass, Moon, RefreshCw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedHashrateIcon } from "./AnimatedHashrateIcon";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ForceStopMenuItem } from "./ForceStopMenuItem";
import { useAnimation } from '@/context/AnimationContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { StatusBorderAnimation } from './StatusBorderAnimation';

export type ASICStatus = 'online' | 'offline' | 'booting up' | 'shutting down' | 'overclocked' | 'overheat' | 'error' | 'idle' | 'standby';

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
  comment?: string;
  isForceStopping?: boolean;
}

interface ASICStatusCardProps {
  asic: ASIC;
  maxTemp: number;
  onTogglePower: (asicId: string) => void;
  onToggleFan: (asicId: string) => void;
  onToggleOverclock: (asicId: string) => void;
  onPowerAction: (asicId: string, action: 'idle' | 'stop' | 'reboot' | 'standby' | 'force-stop', event?: React.MouseEvent) => void;
}

const StatusBadge = ({ status }: { status: ASICStatus }) => {
  const statusConfig = {
    online: { label: "En Ligne", className: "bg-green-500/10 text-green-400 border-green-500/20", icon: <Activity size={12} /> },
    offline: { label: "Hors Ligne", className: "bg-gray-500/10 text-gray-400 border-gray-500/20", icon: <Minus size={12} /> },
    'booting up': { label: "Démarrage", className: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <ArrowUp size={12} className="animate-bounce" /> },
    'shutting down': { label: "Arrêt", className: "bg-orange-500/10 text-yellow-400 border-yellow-500/20", icon: <ArrowDown size={12} className="animate-bounce" /> },
    overclocked: { label: "Overclocked", className: "text-white border-transparent bg-[linear-gradient(120deg,_#ec4899,_#ef4444,_#f97316,_#f59e0b,_#10b981,_#06b6d4,_#6366f1)] bg-[length:200%_200%] animate-aurora", icon: <Cpu size={12} /> },
    overheat: { label: "Surchauffe", className: "text-white border-transparent bg-gradient-to-r from-red-500 to-orange-400 animate-pulse", icon: <Flame size={12} /> },
    error: { label: "Erreur", className: "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse", icon: <AlertTriangle size={12} /> },
    idle: { label: "Inactif", className: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: <Hourglass size={12} /> },
    standby: { label: "En Veille", className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", icon: <Moon size={12} /> },
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
    case 'booting up': return 'Démarrage en cours...';
    case 'shutting down': return 'Arrêt en cours...';
    case 'overclocked': return 'Performance maximale activée';
    case 'overheat': return 'Surchauffe, refroidissement en cours';
    case 'error': return 'Erreur système critique';
    case 'idle': return 'En attente de commandes';
    case 'standby': return 'Mode basse consommation';
    default: return 'Statut inconnu';
  }
};

const StatItem = ({ icon, label, value, unit, className, style }: { icon: React.ReactNode, label: string, value: string, unit: string, className?: string, style?: React.CSSProperties }) => (
  <div className="flex items-center space-x-2" style={style}>
    <div className={cn("text-theme-cyan", className)}>{icon}</div>
    <div>
      <p className={cn("text-xs text-theme-text-secondary", className)}>{label}</p>
      <p className={cn("text-sm font-semibold", className)}>{value} <span className="text-xs font-normal text-theme-text-secondary">{unit}</span></p>
    </div>
  </div>
);

const ShutdownAnimation = () => (
  <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl">
    <svg width="100%" height="100%" viewBox="0 0 200 150" preserveAspectRatio="none" className="absolute inset-0">
      <defs>
        <linearGradient id="shutdown-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <path
        d="M -10 75 Q 20 120, 50 75 T 110 75 T 170 75 T 210 75"
        stroke="url(#shutdown-grad)"
        strokeWidth="2"
        fill="none"
        className="animate-shutdown-wave"
        filter="url(#glow)"
      />
    </svg>
  </div>
);

export const ASICStatusCard = ({ asic, maxTemp, onTogglePower, onToggleFan, onToggleOverclock, onPowerAction }: ASICStatusCardProps) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const { triggerBurst } = useAnimation();
  const [isOverheatAlertOpen, setIsOverheatAlertOpen] = useState(false);

  const isOverheating = asic.status === 'overheat';
  const isWarning = asic.temperature > maxTemp - 10 && !isOverheating;
  const tempColor = isOverheating ? 'text-red-500' : isWarning ? 'text-orange-400' : 'text-white';
  
  const isOnline = asic.status === 'online' || asic.status === 'overclocked';
  const isOffline = asic.status === 'offline';
  const isTransitioning = asic.status === 'booting up' || asic.status === 'shutting down';

  const message = (isOnline && asic.comment) 
    ? asic.comment 
    : getStatusMessage(asic.status);

  const truncatedMessage = message.length > 26 ? message.substring(0, 23) + '...' : message;

  const PowerIcon = isOnline ? PowerOff : Power;
  const powerIconClassName = cn({
    "text-gray-500": isTransitioning,
    "text-white": isOnline,
    "text-theme-text-secondary": !isTransitioning && !isOnline,
  });

  const fadeOutClass = asic.isForceStopping ? "animate-flicker-and-fade" : "";
  const fanIsSpinning = asic.isFanOn && !isOffline;

  const handleForceStop = (e: React.MouseEvent) => {
    if (cardRef.current) {
      triggerBurst(e.clientX, e.clientY, cardRef.current);
      onPowerAction(asic.id, 'force-stop');
    }
  };

  const handlePowerClick = () => {
    if (asic.status === 'overheat') {
      setIsOverheatAlertOpen(true);
    } else {
      onTogglePower(asic.id);
    }
  };

  return (
    <>
      <div className="relative h-full">
        <StatusBorderAnimation
          status={asic.status}
          isWarning={isWarning}
          isOverheating={isOverheating}
        />
        <div ref={cardRef} className={cn(
          "relative p-4 rounded-2xl border border-transparent flex flex-col space-y-3 transition-all duration-300 bg-theme-card h-full",
          isOffline && "grayscale opacity-70"
        )}>
          {asic.isForceStopping && <ShutdownAnimation />}
          <div className="flex justify-between items-start">
            <div className={fadeOutClass} style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-bold leading-tight">{asic.name}</h3>
              <p className="text-xs text-theme-text-secondary mt-1">{asic.model}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={fadeOutClass} style={{ animationDelay: '0.2s' }}>
                <StatusBadge status={asic.status} />
              </div>
              <div className={fadeOutClass} style={{ animationDelay: '0.3s' }}>
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "w-8 h-8 rounded-full hover:bg-theme-accent/20",
                    asic.status === 'overclocked' ? "text-theme-cyan hover:text-theme-cyan" : "text-theme-text-secondary hover:text-white"
                  )}
                  onClick={() => onToggleOverclock(asic.id)}
                  disabled={!(asic.status === 'online' || asic.status === 'overclocked')}
                >
                  <Cpu size={16} />
                </Button>
              </div>
              <div className={fadeOutClass} style={{ animationDelay: '0.4s' }}>
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 rounded-full hover:bg-theme-accent/20 hover:text-theme-accent"
                      onClick={handlePowerClick}
                      disabled={isTransitioning}
                    >
                      <PowerIcon size={16} className={powerIconClassName} />
                    </Button>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48 rounded-xl p-1.5">
                    <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'idle')} className="flex items-center animate-slide-in-item" style={{ animationDelay: '0ms' }}>
                      <Hourglass className="mr-2 h-4 w-4" /> Idle
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'standby')} className="flex items-center animate-slide-in-item" style={{ animationDelay: '50ms' }}>
                      <Moon className="mr-2 h-4 w-4" /> Standby
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'reboot')} className="flex items-center animate-slide-in-item" style={{ animationDelay: '100ms' }}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Reboot
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'stop')} className="flex items-center animate-slide-in-item" style={{ animationDelay: '150ms' }}>
                      <XCircle className="mr-2 h-4 w-4" /> Arrêt
                    </ContextMenuItem>
                    {asic.status === 'error' && (
                      <>
                        <ContextMenuSeparator className="my-1.5 animate-slide-in-item" style={{ animationDelay: '500ms' }} />
                        <ForceStopMenuItem
                          onSelect={(e) => handleForceStop(e as unknown as React.MouseEvent)}
                          style={{ animationDelay: '700ms' }}
                        >
                          <ShieldAlert className="mr-2 h-4 w-4" />
                          Force Stop
                        </ForceStopMenuItem>
                      </>
                    )}
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            </div>
          </div>

          <div className={cn("text-center text-sm text-theme-accent border border-theme-accent/30 rounded-lg py-1.5", fadeOutClass)} style={{ animationDelay: '0.5s' }}>
            {truncatedMessage}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
            <StatItem 
              icon={isOnline ? <AnimatedHashrateIcon width={20} height={20} /> : <Activity size={20} />} 
              label="Hashrate" 
              value={asic.hashrate.toFixed(2)} 
              unit="TH/s" 
              className={fadeOutClass}
              style={{ animationDelay: '0.6s' }}
            />
            <StatItem icon={<Thermometer size={20} />} label="Température" value={asic.temperature.toFixed(2)} unit="°C" className={cn(tempColor, fadeOutClass)} style={{ animationDelay: '0.7s' }} />
            <StatItem icon={<Zap size={20} />} label="Puissance" value={asic.power.toFixed(0)} unit="W" className={fadeOutClass} style={{ animationDelay: '0.8s' }} />
            
            <div className={cn("flex items-center space-x-2", fadeOutClass)} style={{ animationDelay: '0.9s' }}>
              <button
                onClick={() => onToggleFan(asic.id)}
                className="p-1 rounded-full text-theme-cyan hover:bg-theme-accent/20"
                aria-label={asic.isFanOn ? "Éteindre le ventilateur" : "Allumer le ventilateur"}
                disabled={isOffline}
              >
                <Fan
                  size={20}
                  className={cn(
                    "transition-colors",
                    fanIsSpinning ? "animate-spin" : "text-gray-500"
                  )}
                  style={{ animationDuration: fanIsSpinning ? '1s' : '0ms' }}
                />
              </button>
              <div>
                <p className="text-xs text-theme-text-secondary">Ventilateur</p>
                <p className="text-sm font-semibold">{asic.fanSpeed.toFixed(0)} <span className="text-xs font-normal text-theme-text-secondary">%</span></p>
              </div>
            </div>
          </div>

          <div className={fadeOutClass} style={{ animationDelay: '1s' }}>
            <Button 
              className="w-full bg-theme-cyan text-black font-bold hover:bg-theme-cyan/90 rounded-xl"
              disabled={isOffline}
            >
              <Eye size={16} className="mr-2" />
              Voir Détails
            </Button>
          </div>
        </div>
      </div>
      <AlertDialog open={isOverheatAlertOpen} onOpenChange={setIsOverheatAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Arrêt en Surchauffe</AlertDialogTitle>
            <AlertDialogDescription>
              Ne préférez-vous pas passer en Idle pour ralentir le rythme ou Standby pour refroidir? Risque de choc thermique et déterioration de matériel!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-between gap-2">
            <div className="flex gap-2 flex-wrap">
              <Button variant="secondary" onClick={() => { onPowerAction(asic.id, 'idle'); setIsOverheatAlertOpen(false); }}>
                Passer en Idle
              </Button>
              <Button onClick={() => { onPowerAction(asic.id, 'standby'); setIsOverheatAlertOpen(false); }}>
                Passer en Veille
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="destructive" onClick={() => onTogglePower(asic.id)}>
                  Forcer l'Arrêt
                </Button>
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};