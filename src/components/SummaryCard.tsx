import React from 'react';
import { cn } from '@/lib/utils';
import { useAppStatus } from '@/context/AppStatusContext';
import { AnimatedHashrateIcon } from './AnimatedHashrateIcon'; // Import AnimatedHashrateIcon

export type TempStatusLevel = 'faible' | 'optimal' | 'eleve' | 'surcharge';

interface SummaryCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  iconColorClass: string; // Changed from iconBgColor to iconColorClass
  tempStatus?: { level: TempStatusLevel; text: string };
  className?: string;
  style?: React.CSSProperties;
  isOverclockedMajority?: boolean; // New prop
}

export const SummaryCard = ({ title, value, unit, icon, iconColorClass, tempStatus, className, style, isOverclockedMajority }: SummaryCardProps) => {
  const { triggerStartupAnimation, triggerShutdownAnimation } = useAppStatus();

  const tempStatusClasses: Record<TempStatusLevel, string> = {
    faible: "text-blue-400",
    optimal: "text-green-400",
    eleve: "text-orange-400",
    surcharge: "text-red-500 animate-pulse",
  };

  // Conditionally render AnimatedHashrateIcon with its specific prop
  const renderIcon = () => {
    if (title === "Hashrate Total" && React.isValidElement(icon) && icon.type === AnimatedHashrateIcon) {
      return React.cloneElement(icon as React.ReactElement<any>, { isOverclockedMajority });
    }
    return icon;
  };

  return (
    <div 
      className={cn(
        "relative bg-theme-card rounded-2xl p-4 flex items-center justify-between border border-theme-border-muted",
        className,
        triggerShutdownAnimation && "animate-staggered-fade-out",
        triggerStartupAnimation && "animate-startup-fade-in-scale"
      )}
      style={style}
    >
      <div>
        <p className="text-sm text-theme-text-secondary">{title}</p>
        <p className={cn("text-2xl font-bold mt-1", tempStatus ? tempStatusClasses[tempStatus.level] : "text-white")}>
          {value} <span className="text-base font-normal text-theme-text-secondary">{unit}</span>
        </p>
      </div>
      <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-theme-card border border-theme-accent/30", iconColorClass)}>
        {renderIcon()}
      </div>
    </div>
  );
};