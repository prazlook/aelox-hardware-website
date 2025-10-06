import { cn } from "@/lib/utils";

interface VerticalGaugeProps {
  value: number;
  maxValue: number;
  color: string;
  unit: string;
}

export const VerticalGauge = ({ value, maxValue, color, unit }: VerticalGaugeProps) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="flex flex-col items-center space-y-2 flex-shrink-0">
      <p className="text-xs text-theme-text-secondary">Actuel</p>
      <div className="w-8 h-40 bg-black/20 rounded-full flex flex-col-reverse overflow-hidden border border-gray-700/50">
        <div
          className="w-full rounded-full transition-all duration-500 ease-out"
          style={{ height: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <div className="text-center">
        <p className="font-bold">{value.toFixed(0)}</p>
        <p className="text-xs text-theme-text-secondary">{unit}</p>
      </div>
    </div>
  );
};