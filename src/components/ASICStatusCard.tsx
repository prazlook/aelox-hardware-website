import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Zap, Thermometer, Fan, Power, PowerOff, Eye, Activity, Cpu, AlertTriangle, Flame, Minus, ArrowUp, ArrowDown, ShieldAlert, Hourglass, Moon, RefreshCw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedHashrateIcon } from "./AnimatedHashrateIcon";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ForceStopMenuItem } from "./ForceStopMenuItem";
import { useAnimation } from '@/context/AnimationContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { StatusBorderAnimation } from './StatusBorderAnimation';
import { getLocalAIComment } from '@/lib/localAiComments';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useAppStatus } from '@/context/AppStatusContext'; // Import useAppStatus

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
  onPowerAction: (asicId: string, action: 'idle' | 'stop' | 'reboot' | 'standby' | 'force-stop' | 'start-mining', event?: React.MouseEvent) => void;
  className?: string; // Add className prop
  style?: React.CSSProperties; // Add style prop
  triggerShutdownAnimation: boolean; // New prop
  triggerStartupAnimation: boolean; // New prop
  startupDelay: number; // Base delay for this specific card
}

interface StatusBadgeProps {
  status: ASICStatus;
  triggerShutdownAnimation: boolean;
  shutdownDelay: number;
  triggerStartupAnimation: boolean;
  startupDelay: number;
}

const StatusBadge = ({ status, triggerShutdownAnimation, shutdownDelay, triggerStartupAnimation, startupDelay }: StatusBadgeProps) => {
  const statusConfig = {
    online: { label: "En Ligne", className: "bg-green-500/10 text-green-400 border-green-500/20", icon: <Activity size={12} /> },
    offline: { label: "Hors Ligne", className: "bg-gray-500/10 text-gray-400 border-gray-500/20", icon: <Minus size={12} /> },
    'booting up': { label: "Démarrage", className: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <ArrowUp size={12} className="animate-bounce" /> },
    'shutting down': { label: "Arrêt", className: "bg-orange-500/10 text-yellow-400 border-yellow-500/20", icon: <ArrowDown size={12} className="animate-bounce" /> },
    overclocked: { label: "Overclocked", className: "text-gray-800 font-semibold border-transparent bg-[linear-gradient(120deg,_#ffb3ba,_#ffdfba,_#ffffba,_#baffc9,_#bae1ff,_#e0baff,_#ffb3ba)] bg-[length:200%_200%] animate-aurora", icon: <Cpu size={12} /> },
    overheat: { label: "Surchauffe", className: "text-white border-transparent bg-gradient-to-r from-red-500 to-orange-400 animate-pulse", icon: <Flame size={12} /> },
    error: { label: "Erreur", className: "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse", icon: <AlertTriangle size={12} /> },
    idle: { label: "Inactif", className: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: <Hourglass size={12} /> },
    standby: { label: "En Veille", className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", icon: <Moon size={12} /> },
  };

  const config = statusConfig[status] || statusConfig.offline;

  return (
    <div 
      className={cn(
        "flex items-center space-x-1.5 rounded-full px-2 py-0.5 text-xs font-medium border", 
        config.className,
        triggerShutdownAnimation && "animate-fluorescent-flicker",
        triggerStartupAnimation && "animate-startup-fade-in-scale"
      )}
      style={triggerShutdownAnimation ? { animationDelay: `${shutdownDelay}s` } : triggerStartupAnimation ? { animationDelay: `${startupDelay}s` } : {}}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  className?: string;
  style?: React.CSSProperties;
  triggerShutdownAnimation: boolean;
  shutdownDelay: number;
  triggerStartupAnimation: boolean;
  startupDelay: number;
}

const StatItem = ({ icon, label, value, unit, className, style, triggerShutdownAnimation, shutdownDelay, triggerStartupAnimation, startupDelay }: StatItemProps) => (
  <div 
    className={cn("flex items-center space-x-2", className,
      triggerShutdownAnimation && "animate-fluorescent-flicker",
      triggerStartupAnimation && "animate-startup-fade-in-scale"
    )}
    style={triggerShutdownAnimation ? { animationDelay: `${shutdownDelay}s`, ...style } : triggerStartupAnimation ? { animationDelay: `${startupDelay}s`, ...style } : style}
  >
    <div className="text-theme-cyan">{icon}</div>
    <div>
      <p className="text-xs text-theme-text-secondary">{label}</p>
      <p className="text-sm font-semibold">{value} <span className="text-xs font-normal text-theme-text-secondary">{unit}</span></p>
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

export const ASICStatusCard = ({ asic, maxTemp, onTogglePower, onToggleFan, onToggleOverclock, onPowerAction, className, style, triggerShutdownAnimation, triggerStartupAnimation, startupDelay: cardBaseStartupDelay }: ASICStatusCardProps) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const { triggerBurst } = useAnimation();
  const [isOverheatAlertOpen, setIsOverheatAlertOpen] = useState(false);
  const [comment, setComment] = useState(getLocalAIComment(asic));
  const prevStatusRef = useRef<ASICStatus>();
  const typedComment = useTypewriter(comment || '', 30);
  const { triggerStartupAnimation: globalTriggerStartupAnimation } = useAppStatus(); // Get global animation trigger

  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    if (prevStatus !== asic.status) {
      setComment(getLocalAIComment(asic));
    }
    prevStatusRef.current = asic.status;
  }, [asic]);

  const isOverheating = asic.status === 'overheat';
  const isWarning = asic.temperature > maxTemp - 10 && !isOverheating;
  const tempColor = isOverheating ? 'text-red-500' : isWarning ? 'text-orange-400' : 'text-white';
  
  const isOnline = asic.status === 'online' || asic.status === 'overclocked';
  const isOffline = asic.status === 'offline';
  const isTransitioning = asic.status === 'booting up' || asic.status === 'shutting down';
  const isShuttingDown = asic.status === 'shutting down';

  const PowerIcon = isOnline ? PowerOff : Power;
  const powerIconClassName = cn({
    "text-gray-500": isTransitioning,
    "text-white": isOnline,
    "text-theme-text-secondary": !isTransitioning && !isOnline,
  });

  const contentAnimationClass = asic.isForceStopping
    ? "animate-flicker-and-fade"
    : isShuttingDown
    ? "animate-gentle-shutdown"
    : "";
  
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

  // Helper to get startup animation styles for internal elements
  const getInternalStartupDelay = (offset: number) => {
    return triggerStartupAnimation ? { animationDelay: `${cardBaseStartupDelay + offset}s` } : {};
  };

  const isIdleOrStandby = asic.status === 'idle' || asic.status === 'standby';
  const delayOffset = isIdleOrStandby ? 100 : 0;

  return (
    <>
      <div className={cn("relative h-full", className)} style={style}>
        <div
          ref={cardRef}
          className={cn(
            "relative z-0 p-4 rounded-2xl border border-transparent flex flex-col space-y-3 transition-all duration-300 bg-theme-card h-full",
            isOffline && !isTransitioning && "grayscale opacity-70" // Only grayscale if truly offline and not transitioning
          )}
        >
          {asic.isForceStopping && <ShutdownAnimation />}
          <div className="flex justify-between items-start">
            {/* Title & Model */}
            <div 
              className={cn(
                contentAnimationClass, 
                triggerStartupAnimation && "animate-startup-fade-in-scale"
              )} 
              style={getInternalStartupDelay(0.2)}
            >
              <h3 className="text-lg font-bold leading-tight">{asic.name}</h3>
              <p className="text-xs text-theme-text-secondary mt-1">{asic.model}</p>
            </div>
            <div className="flex items-center space-x-2">
              {/* CPU Button (Overclock) */}
              <div 
                className={cn(
                  contentAnimationClass, 
                  triggerStartupAnimation && "animate-startup-fade-in-scale"
                )} 
                style={getInternalStartupDelay(1.0)}
              >
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
              {/* Power Button */}
              <div 
                className={cn(
                  contentAnimationClass, 
                  triggerStartupAnimation && "animate-startup-fade-in-scale"
                )} 
                style={getInternalStartupDelay(1.1)}
              >
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
                    {isIdleOrStandby && (
                      <>
                        <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'start-mining')} className="flex items-center animate-slide-in-item" style={{ animationDelay: '0ms' }}>
                          <Activity className="mr-2 h-4 w-4" /> Extraction
                        </ContextMenuItem>
                        <ContextMenuSeparator className="my-1.5 animate-slide-in-item" style={{ animationDelay: '50ms' }} />
                      </>
                    )}
                    <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'idle')} className="flex items-center animate-slide-in-item" style={{ animationDelay: `${delayOffset}ms` }}>
                      <Hourglass className="mr-2 h-4 w-4" /> Idle
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'standby')} className="flex items-center animate-slide-in-item" style={{ animationDelay: `${delayOffset + 50}ms` }}>
                      <Moon className="mr-2 h-4 w-4" /> Standby
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'reboot')} className="flex items-center animate-slide-in-item" style={{ animationDelay: `${delayOffset + 100}ms` }}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Reboot
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'stop')} className="flex items-center animate-slide-in-item" style={{ animationDelay: `${delayOffset + 150}ms` }}>
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
              {/* Status Badge */}
              <div 
                className={cn(
                  contentAnimationClass, 
                  // Removed startup animation class here, it's now inside StatusBadge
                )} 
                style={getInternalStartupDelay(1.3)}
              >
                <StatusBadge 
                  status={asic.status} 
                  triggerShutdownAnimation={triggerShutdownAnimation} 
                  shutdownDelay={1.9} // Shutdown delay
                  triggerStartupAnimation={triggerStartupAnimation} // Pass startup prop
                  startupDelay={cardBaseStartupDelay + 1.3} // Startup delay for badge
                />
              </div>
            </div>
          </div>

          {/* Comment/Typewriter */}
          <div 
            className={cn(
              "text-center text-sm text-theme-accent border border-theme-accent/30 rounded-xl py-1.5 h-9 flex items-center justify-center overflow-hidden whitespace-nowrap", 
              contentAnimationClass, 
              triggerStartupAnimation && "animate-startup-fade-in-scale"
            )} 
            style={getInternalStartupDelay(0.4)}
          >
            <span className="typewriter-cursor">{typedComment}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
            {/* Stat Items */}
            <StatItem 
              icon={isOnline ? <AnimatedHashrateIcon width={20} height={20} /> : <Activity size={20} />} 
              label="Hashrate" 
              value={asic.hashrate.toFixed(2)} 
              unit="TH/s" 
              className={contentAnimationClass} // Shutdown animation class
              triggerShutdownAnimation={triggerShutdownAnimation}
              shutdownDelay={0.5} // Shutdown delay
              triggerStartupAnimation={triggerStartupAnimation}
              startupDelay={cardBaseStartupDelay + 0.6} // Startup delay for Hashrate
            />
            <StatItem 
              icon={<Thermometer size={20} />} 
              label="Température" 
              value={asic.temperature.toFixed(2)} 
              unit="°C" 
              className={cn(tempColor, contentAnimationClass)} // Shutdown animation class
              triggerShutdownAnimation={triggerShutdownAnimation}
              shutdownDelay={0.6} // Shutdown delay
              triggerStartupAnimation={triggerStartupAnimation}
              startupDelay={cardBaseStartupDelay + 0.7} // Startup delay for Temperature
            />
            <StatItem 
              icon={<Zap size={20} />} 
              label="Puissance" 
              value={asic.power.toFixed(0)} 
              unit="W" 
              className={contentAnimationClass} // Shutdown animation class
              triggerShutdownAnimation={triggerShutdownAnimation}
              shutdownDelay={0.7} // Shutdown delay
              triggerStartupAnimation={triggerStartupAnimation}
              startupDelay={cardBaseStartupDelay + 0.8} // Startup delay for Power
            />
            
            {/* Fan Control */}
            <div 
              className={cn(
                "flex items-center space-x-2", 
                contentAnimationClass, 
                triggerStartupAnimation && "animate-startup-fade-in-scale"
              )} 
              style={getInternalStartupDelay(0.9)}
            >
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

          {/* View Details Button */}
          <div 
            className={cn(
              contentAnimationClass, 
              triggerStartupAnimation && "animate-startup-fade-in-scale"
            )} 
            style={getInternalStartupDelay(1.2)}
          >
            <Button 
              className="w-full bg-theme-cyan text-black font-bold hover:bg-theme-cyan/90 rounded-xl"
              disabled={isOffline}
            >
              <Eye size={16} className="mr-2" />
              Voir Détails
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 z-10 pointer-events-none rounded-2xl">
          <StatusBorderAnimation
            status={asic.status}
            isWarning={isWarning}
            isOverheating={isOverheating}
            triggerStartupAnimation={triggerStartupAnimation} // Pass prop
            startupDelay={cardBaseStartupDelay + 0.0} // Border appears first
          />
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