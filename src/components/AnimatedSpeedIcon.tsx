"use client";

import React from 'react';
import { Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedSpeedIconProps {
  className?: string;
  size?: number;
  isOnline?: boolean;
}

export const AnimatedSpeedIcon = ({ className, size = 20, isOnline = false }: AnimatedSpeedIconProps) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <Gauge 
        size={size} 
        className={cn(
          "transition-all duration-500",
          isOnline ? "text-theme-cyan animate-pulse" : "text-gray-500"
        )} 
      />
      {isOnline && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full border-t-2 border-theme-cyan rounded-full animate-spin-slow opacity-40" />
        </div>
      )}
    </div>
  );
};