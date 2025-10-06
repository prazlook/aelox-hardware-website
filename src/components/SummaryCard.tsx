import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  iconBgColor: string;
  tempStatus?: {
    level: string;
    text: string;
  };
}

const tempStatusClasses = {
  surcharge: 'text-red-400',
  eleve: 'text-orange-400',
  optimal: 'text-green-400',
  faible: 'text-blue-400',
};

export const SummaryCard = ({ title, value, unit, icon, iconBgColor, tempStatus }: SummaryCardProps) => {
  const valueColor = tempStatus ? tempStatusClasses[tempStatus.level as keyof typeof tempStatusClasses] : '';

  return (
    <div className="bg-theme-card p-5 rounded-2xl flex justify-between items-center relative overflow-hidden">
      <div className={cn("absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-10 animate-pulse-halo", iconBgColor)} />
      
      <div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          {tempStatus && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${valueColor} bg-opacity-20 bg-current`}>
              {tempStatus.text}
            </span>
          )}
        </div>
        <p className={cn("text-3xl font-bold", valueColor)}>
          {value} <span className="text-xl text-muted-foreground">{unit}</span>
        </p>
      </div>
      <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-white", iconBgColor)}>
        {icon}
      </div>
    </div>
  );
};