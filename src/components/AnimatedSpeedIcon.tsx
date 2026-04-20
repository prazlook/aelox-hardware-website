"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSpeedIconProps {
  className?: string;
  size?: number;
  isOnline?: boolean;
}

export const AnimatedSpeedIcon = ({ className, size = 20, isOnline = false }: AnimatedSpeedIconProps) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <style>{`
        @keyframes needle-swing {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(45deg); }
        }
        .animate-needle-swing {
          transform-origin: 12px 14px;
          animation: needle-swing 1.5s ease-in-out infinite;
        }
      `}</style>
      
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "transition-all duration-500",
          isOnline ? "text-theme-cyan" : "text-gray-500"
        )}
      >
        {/* Le contour de la jauge */}
        <path d="M3.34 19a10 10 0 1 1 17.32 0" />
        
        {/* La petite aiguille avec animation d'oscillation amplifiée */}
        <path 
          d="m12 14 4-4" 
          className={cn(isOnline && "animate-needle-swing")}
        />
      </svg>

      {isOnline && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full border-t-2 border-theme-cyan rounded-full animate-spin-slow opacity-30" />
        </div>
      )}
    </div>
  );
};