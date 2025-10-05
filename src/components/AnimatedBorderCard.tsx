import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBorderCardProps {
  children: React.ReactNode;
  className?: string;
  isAnimated: boolean;
  color?: string;
}

export const AnimatedBorderCard = ({ children, className, isAnimated, color = '#00F0FF' }: AnimatedBorderCardProps) => {
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
            className="animate-stroke-spin"
          />
        </svg>
      )}
      {children}
    </div>
  );
};