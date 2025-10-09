import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Asic } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Hourglass, Power, PowerOff, ServerOff, Wrench, Thermometer, Zap, Cpu, AlertTriangle } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface ASICStatusCardProps {
  asic: Asic;
  onPowerAction: (id: string, action: 'shutdown' | 'reboot' | 'idle' | 'standby' | 'start') => void;
}

const statusConfig = {
  Online: { label: "En Ligne", color: "bg-green-500/20 text-green-400 border-green-500/30", iconColor: "text-green-400", pulseColor: "bg-green-500" },
  Idle: { label: "Inactif", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", iconColor: "text-yellow-400", pulseColor: "bg-yellow-500" },
  Standby: { label: "En Veille", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", iconColor: "text-blue-400", pulseColor: "bg-blue-500" },
  Rebooting: { label: "Redémarrage", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", iconColor: "text-purple-400", pulseColor: "bg-purple-500" },
  Error: { label: "Erreur", color: "bg-red-500/20 text-red-400 border-red-500/30", iconColor: "text-red-400", pulseColor: "bg-red-500" },
  Off: { label: "Éteint", color: "bg-gray-500/20 text-gray-400 border-gray-500/30", iconColor: "text-gray-400", pulseColor: "bg-gray-500" },
};

export const ASICStatusCard = ({ asic, onPowerAction }: ASICStatusCardProps) => {
  const config = statusConfig[asic.status] || statusConfig.Off;

  return (
    <Card className={cn("bg-theme-card border-gray-700/50 transition-all duration-300 hover:border-gray-600/80 hover:shadow-lg hover:shadow-black/20", {
      'opacity-50': asic.status === 'Off'
    })}>
      <ContextMenu>
        <ContextMenuTrigger>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{asic.name}</CardTitle>
            <Badge className={cn("text-xs", config.color)}>
              <span className={cn("relative flex h-2 w-2 mr-2", { 'animate-pulse': asic.status === 'Online' || asic.status === 'Rebooting' })}>
                <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75", config.pulseColor, { 'animate-ping': asic.status === 'Online' || asic.status === 'Rebooting' })}></span>
                <span className={cn("relative inline-flex rounded-full h-2 w-2", config.pulseColor)}></span>
              </span>
              {config.label}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{asic.hashrate.toFixed(2)} TH/s</div>
            <p className="text-xs text-muted-foreground">
              Modèle: {asic.model}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
              <div className="flex items-center">
                <Thermometer className="h-4 w-4 mr-1.5 text-orange-400" />
                <span>{asic.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1.5 text-yellow-400" />
                <span>{asic.power}W</span>
              </div>
              <div className="flex items-center">
                <Cpu className="h-4 w-4 mr-1.5 text-blue-400" />
                <span>{asic.fanSpeed}%</span>
              </div>
            </div>
            {asic.status === 'Error' && (
              <div className="mt-4 flex items-center text-red-400 text-xs">
                <AlertTriangle className="h-4 w-4 mr-1.5" />
                <span>{asic.error || "Erreur inconnue"}</span>
              </div>
            )}
          </CardContent>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48 rounded-xl p-1.5">
          {asic.status === 'Online' && (
            <>
              <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'idle')} className="flex items-center animate-slide-in-item" style={{ animationDelay: '0ms' }}>
                <Hourglass className="mr-2 h-4 w-4" /> Idle
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'standby')} className="flex items-center animate-slide-in-item" style={{ animationDelay: '50ms' }}>
                <ServerOff className="mr-2 h-4 w-4" /> Standby
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'reboot')} className="flex items-center animate-slide-in-item" style={{ animationDelay: '100ms' }}>
                <Wrench className="mr-2 h-4 w-4" /> Reboot
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'shutdown')} className="flex items-center text-red-400 animate-slide-in-item" style={{ animationDelay: '150ms' }}>
                <PowerOff className="mr-2 h-4 w-4" /> Shutdown
              </ContextMenuItem>
            </>
          )}
          {(asic.status === 'Idle' || asic.status === 'Standby') && (
            <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'start')} className="flex items-center animate-slide-in-item text-green-400" style={{ animationDelay: '0ms' }}>
              <Power className="mr-2 h-4 w-4" /> Extraction
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </Card>
  );
};