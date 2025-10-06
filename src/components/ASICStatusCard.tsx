import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Pickaxe,
  Hourglass,
  Moon,
  Power,
  RefreshCw,
  Thermometer,
  Zap,
  Cpu,
  Fan,
  AlertTriangle,
} from "lucide-react";
import { StatusBorderAnimation } from './StatusBorderAnimation';
import { ASIC_STATUS_COLORS, ASIC_STATUS_ICONS } from '@/config/status-colors';
import { ASIC, ASICStatus } from "@/context/AsicContext";

export type PowerAction = 'reboot' | 'shutdown' | 'online' | 'idle' | 'standby';

interface ASICStatusCardProps {
  asic: ASIC;
  onPowerAction: (id: string, action: PowerAction) => void;
}

export const ASICStatusCard = ({ asic, onPowerAction }: ASICStatusCardProps) => {
  const StatusIcon = ASIC_STATUS_ICONS[asic.status] || AlertTriangle;
  const statusColor = ASIC_STATUS_COLORS[asic.status] || ASIC_STATUS_COLORS.error;

  const isWarning = asic.temperature > 85 && asic.temperature <= 95;
  const isOverheating = asic.temperature > 95;

  const cardClasses = `bg-theme-card border-2 rounded-2xl transition-all duration-300 ease-in-out relative overflow-hidden ${
    asic.status === 'offline' ? 'border-gray-700/50' : 'border-transparent'
  }`;

  const renderStat = (Icon: React.ElementType, value: string, unit: string, delay: number) => (
    <div className="flex items-center space-x-2 animate-boot-up-item" style={{ animationDelay: `${delay}ms` }}>
      <Icon className="w-5 h-5 text-theme-text-secondary" />
      <div className="flex items-baseline">
        <span className="text-lg font-semibold">{value}</span>
        <span className="text-sm text-theme-text-secondary ml-1">{unit}</span>
      </div>
    </div>
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className={cardClasses}>
          <StatusBorderAnimation status={asic.status} isWarning={isWarning} isOverheating={isOverheating} />
          <div className="relative z-10 p-5">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
              <CardTitle className="text-xl font-bold">{asic.name}</CardTitle>
              <div className="flex items-center space-x-2">
                {isOverheating && <AlertTriangle className="w-5 h-5 text-red-500 animate-ping absolute" />}
                {isOverheating && <AlertTriangle className="w-5 h-5 text-red-500" />}
                {isWarning && !isOverheating && <AlertTriangle className="w-5 h-5 text-orange-400" />}
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium`} style={{ backgroundColor: `${statusColor}20`, color: statusColor }}>
                  <StatusIcon className="w-4 h-4" />
                  <span>{asic.status.charAt(0).toUpperCase() + asic.status.slice(1)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {renderStat(Cpu, asic.hashrate.toFixed(2), "TH/s", 100)}
                {renderStat(Thermometer, `${asic.temperature.toFixed(1)}`, "°C", 200)}
                {renderStat(Zap, `${asic.power}`, "W", 300)}
                {renderStat(Fan, `${asic.fanSpeed || 0}`, "RPM", 400)}
              </div>
            </CardContent>
          </div>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48 rounded-xl p-1.5">
        <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'online')} className="flex items-center animate-slide-in-item" style={{ animationDelay: '0ms' }}>
          <Pickaxe className="mr-2 h-4 w-4" /> Extraction
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'idle')} className="flex items-center animate-slide-in-item" style={{ animationDelay: '50ms' }}>
          <Hourglass className="mr-2 h-4 w-4" /> Idle
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'standby')} className="flex items-center animate-slide-in-item" style={{ animationDelay: '100ms' }}>
          <Moon className="mr-2 h-4 w-4" /> Standby
        </ContextMenuItem>
        <ContextMenuSeparator className="my-1" />
        <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'reboot')} className="flex items-center animate-slide-in-item" style={{ animationDelay: '150ms' }}>
          <RefreshCw className="mr-2 h-4 w-4" /> Redémarrer
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => onPowerAction(asic.id, 'shutdown')} className="flex items-center text-red-400 animate-slide-in-item" style={{ animationDelay: '200ms' }}>
          <Power className="mr-2 h-4 w-4" /> Éteindre
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};