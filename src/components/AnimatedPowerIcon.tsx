"use client";

import React from 'react';
import { Zap } from 'lucide-react';
import { cn } from "@/lib/utils";

interface AnimatedPowerIconProps {
  size?: number;
  isOnline?: boolean;
}

export const AnimatedPowerIcon = ({ size = 20, isOnline = false }: AnimatedPowerIconProps) => {
  return (
    <div className="relative flex items-center justify-center">
      <Zap 
        size={size} 
        className={cn(
          "transition-all duration-500 z-10",
          isOnline 
            ? "text-theme-cyan fill-theme-cyan/20 animate-[pulse_2s_ease-in-out_infinite]" 
            : "text-gray-500"
        )} 
      />
      {isOnline && (
        <>
          <div className="absolute inset-0 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40">
            <Zap size={size} className="text-theme-cyan" />
          </div>
          <div className="absolute -inset-1 border border-theme-cyan/30 rounded-full animate-[spin_4s_linear_infinite] border-t-transparent border-l-transparent" />
        </>
      )}
    </div>
  );
};