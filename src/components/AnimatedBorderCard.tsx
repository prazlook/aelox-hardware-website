import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBorderCardProps {
  children: React.ReactNode;
  className?: string;
  isAnimated: boolean;
}

export const AnimatedBorderCard = ({ children, className, isAnimated }: AnimatedBorderCardProps) => {
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
            stroke="#00F0FF"
            strokeWidth="2"
            className="animate-border-draw"
          />
        </svg>
      )}
      {children}
    </div>
  );
};