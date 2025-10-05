import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBorderCardProps {
  children: React.ReactNode;
  className?: string;
  isAnimated: boolean;
  isOverclocked?: boolean;
  color?: string;
  animationClassName?: string;
}

export const AnimatedBorderCard = ({
  children,
  className,
  isAnimated,
  isOverclocked,
  color = '#00F0FF',
  animationClassName = 'animate-stroke-spin'
}: AnimatedBorderCardProps) => {
  if (isOverclocked) {
    return (
      <div className="relative rounded-2xl p-[2px] bg-rainbow-gradient animate-rainbow-spin">
        <div className={cn(className, "w-full h-full rounded-[14px] border-0")}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {isAnimated && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          width="100%"
          height="100%"
          fill="none"
        >
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="15"
            ry="15"
            stroke={color}
            strokeWidth="2"
            className={animationClassName}
          />
        </svg>
      )}
      {children}
    </div>
  );
};