import { cn } from "@/lib/utils";

interface AnimatedHashrateIconProps {
  isOnline: boolean;
  className?: string;
  animationDuration: string;
}

export const AnimatedHashrateIcon = ({ isOnline, className, animationDuration }: AnimatedHashrateIconProps) => {
  const color = isOnline ? "stroke-current" : "stroke-gray-500";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-5 h-5", className)}
    >
      <path
        d="M2 12 H6 L9 4 L15 20 L18 12 H22"
        className={cn(
          color,
          isOnline && "animate-hashrate"
        )}
        style={{ animationDuration: isOnline ? animationDuration : '0s' }}
      />
    </svg>
  );
};