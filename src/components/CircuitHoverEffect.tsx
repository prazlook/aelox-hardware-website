"use client";

import React from 'react';
import { Hexagon } from 'lucide-react';

const CircuitHoverEffect = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {/* Top Left Termination */}
      <div className="absolute -top-10 -left-10 w-16 h-16 transition-transform duration-500 transform -translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
        <svg className="w-full h-full text-theme-cyan/60" viewBox="0 0 100 100">
          <path 
            d="M 100 100 L 60 60 L 20 60" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeDasharray="100"
            className="group-hover:animate-draw-border"
          />
          <circle cx="20" cy="60" r="3" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>

      {/* Top Right Hexagon */}
      <div className="absolute -top-12 -right-8 transition-all duration-700 delay-75 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
        <Hexagon className="text-theme-cyan w-6 h-6 fill-theme-cyan/20 animate-spin-slow" />
      </div>

      {/* Bottom Right Termination */}
      <div className="absolute -bottom-10 -right-12 w-20 h-20 transition-transform duration-500 delay-100 transform translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
        <svg className="w-full h-full text-theme-cyan/60" viewBox="0 0 100 100">
          <path 
            d="M 0 0 L 40 40 L 80 40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeDasharray="100"
            className="group-hover:animate-draw-border"
          />
          <circle cx="80" cy="40" r="3" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>

      {/* Bottom Left Small Hexagons */}
      <div className="absolute -bottom-8 -left-6 flex gap-1 transition-all duration-500 delay-150 transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
        <Hexagon className="text-theme-cyan w-3 h-3 fill-theme-cyan/40" />
        <Hexagon className="text-theme-cyan w-4 h-4 fill-theme-cyan/20 animate-pulse" />
      </div>

      {/* Vertical Side Trace */}
      <div className="absolute top-1/2 -right-6 h-12 w-4 transition-all duration-500 delay-200 opacity-0 group-hover:opacity-100">
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-theme-cyan to-transparent" />
      </div>
    </div>
  );
};

export default CircuitHoverEffect;