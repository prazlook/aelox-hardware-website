import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  iconBgColor: string;
  tempStatus?: { level: string; text: string };
  isGlobalOverclock?: boolean;
}

export const SummaryCard = ({ title, value, unit, icon, iconBgColor, tempStatus, isGlobalOverclock = false }: SummaryCardProps) => {
  const isHashrateCard = title === "Hashrate Total";
  const applyOverclockStyle = isHashrateCard && isGlobalOverclock;

  const goldBgClass = "bg-[linear-gradient(120deg,_#FDE047,_#F59E0B,_#D97706,_#F59E0B,_#FDE047)] bg-[length:200%_200%] animate-aurora";
  const goldTextClass = "bg-clip-text text-transparent bg-[linear-gradient(120deg,_#FDE047,_#FBBF24,_#FDE047)]";

  return (
    <div className="bg-theme-card p-4 rounded-2xl flex justify-between items-center border border-transparent transition-all duration-300">
      <div>
        <p className="text-sm text-theme-text-secondary">{title}</p>
        <div className="flex items-baseline space-x-1.5 mt-1">
          <span className={cn(
            "text-3xl font-bold",
            tempStatus?.level === 'surcharge' && 'text-red-500 animate-pulse',
            tempStatus?.level === 'eleve' && 'text-orange-400',
            applyOverclockStyle && [goldTextClass, "animate-pulse-fast"]
          )}>
            {value}
          </span>
          <span className="text-sm text-theme-text-secondary">{unit}</span>
        </div>
        {tempStatus && (
          <div className="mt-2">
            <span className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              {
                'bg-red-500/20 text-red-400': tempStatus.level === 'surcharge',
                'bg-orange-500/20 text-orange-400': tempStatus.level === 'eleve',
                'bg-green-500/20 text-green-400': tempStatus.level === 'optimal',
                'bg-blue-500/20 text-blue-400': tempStatus.level === 'faible',
              }
            )}>
              {tempStatus.text}
            </span>
          </div>
        )}
      </div>
      <div className={cn(
        "w-14 h-14 rounded-xl flex items-center justify-center text-white shrink-0",
        applyOverclockStyle ? goldBgClass : iconBgColor
      )}>
        {icon}
      </div>
    </div>
  );
};