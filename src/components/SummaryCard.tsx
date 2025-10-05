import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

export const SummaryCard = ({ title, value, unit, icon, iconBgColor }: SummaryCardProps) => {
  return (
    <div className="bg-theme-card p-5 rounded-lg flex justify-between items-center">
      <div>
        <p className="text-sm text-theme-text-secondary uppercase">{title}</p>
        <p className="text-3xl font-bold mt-1">
          {value} <span className="text-xl font-medium text-theme-text-secondary">{unit}</span>
        </p>
      </div>
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBgColor)}>
        {icon}
      </div>
    </div>
  );
};