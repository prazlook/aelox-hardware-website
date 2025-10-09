import { cn } from "@/lib/utils";

type TempStatusLevel = 'optimal' | 'faible' | 'eleve' | 'surcharge';

interface SummaryCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  iconBgColor: string;
  tempStatus?: {
    level: TempStatusLevel;
    text: string;
  };
  className?: string; // Add className prop
  style?: React.CSSProperties; // Add style prop
}

const statusStyles: Record<TempStatusLevel, string> = {
  faible: 'bg-blue-500 text-blue-200',
  optimal: 'bg-green-500 text-green-200',
  eleve: 'bg-orange-500 text-orange-200',
  surcharge: 'bg-red-500 text-red-200',
};

export const SummaryCard = ({ title, value, unit, icon, iconBgColor, tempStatus, className, style }: SummaryCardProps) => {
  return (
    <div className={cn("bg-theme-card p-5 rounded-2xl flex justify-between items-center relative overflow-hidden", className)} style={style}>
      <div className={cn("absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-10", iconBgColor)} />
      
      <div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-theme-text-secondary uppercase tracking-wider">{title}</p>
          {tempStatus && (
            <div className="flex items-center space-x-1.5">
              <span className={cn("w-2 h-2 rounded-full", statusStyles[tempStatus.level])} />
              <span className={cn("text-xs font-medium", statusStyles[tempStatus.level].replace('bg-', 'text-'))}>{tempStatus.text}</span>
            </div>
          )}
        </div>
        <p className="text-3xl font-bold mt-1">
          {value} <span className="text-xl font-medium text-theme-text-secondary">{unit}</span>
        </p>
      </div>
      <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-white shrink-0", iconBgColor)}>
        {icon}
      </div>
    </div>
  );
};