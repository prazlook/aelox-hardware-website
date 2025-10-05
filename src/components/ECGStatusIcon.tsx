import { cn } from "@/lib/utils";

interface ECGStatusIconProps {
  isOnline: boolean;
  isAlerting: boolean;
}

export const ECGStatusIcon = ({ isOnline, isAlerting }: ECGStatusIconProps) => {
  const color = isAlerting ? "stroke-red-500" : "stroke-green-500";

  return (
    <div className="w-8 h-4">
      {isOnline ? (
        <svg viewBox="0 0 32 16" className="w-full h-full">
          <path
            d="M0 8 H5 L7 4 L9 12 L11 6 L13 10 H18 L20 6 L22 11 L24 8 H32"
            fill="none"
            strokeWidth="1.5"
            className={cn("animate-ecg", color)}
          />
        </svg>
      ) : (
        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
      )}
    </div>
  );
};