"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface CyberHoverEffectProps {
  active: boolean;
}

export const CyberHoverEffect = ({ active }: CyberHoverEffectProps) => {
  return (
    <div className={cn(
      "absolute inset-0 pointer-events-none transition-opacity duration-500",
      active ? "opacity-100" : "opacity-0"
    )}>
      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] overflow-visible">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Circuits et Terminaisons */}
        <g className="stroke-theme-cyan/40 fill-none" filter="url(#glow)">
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <g key={i} transform={`rotate(${angle}, 300, 300)`} className={cn(active && "animate-circuit-flow")}>
              <path 
                d="M 300 240 L 300 180 L 330 150 L 330 100" 
                className="stroke-2"
                style={{ strokeDasharray: 200, strokeDashoffset: active ? 0 : 200, transition: 'stroke-dashoffset 0.6s ease-out' }}
              />
              <circle 
                cx="330" cy="100" r="3" 
                className={cn("fill-theme-cyan", active ? "scale-100" : "scale-0")}
                style={{ transition: 'transform 0.3s ease-out 0.5s' }}
              />
              
              {/* Hexagones connectés aux terminaisons */}
              <path 
                d="M 330 100 L 350 80" 
                className="stroke-1 opacity-50"
                style={{ strokeDasharray: 50, strokeDashoffset: active ? 0 : 50, transition: 'stroke-dashoffset 0.4s ease-out 0.6s' }}
              />
              <g transform="translate(350, 60) scale(0.8)">
                <polygon 
                  points="20,0 37,10 37,30 20,40 3,30 3,10" 
                  className={cn("fill-theme-cyan/10 stroke-theme-cyan/40", active ? "opacity-100" : "opacity-0")}
                  style={{ transition: 'opacity 0.4s ease-out 0.8s' }}
                />
              </g>
            </g>
          ))}
        </g>

        {/* Cercles orbitaux */}
        <circle 
          cx="300" cy="300" r="140" 
          className={cn("stroke-theme-cyan/20 fill-none stroke-[1px] border-dashed", active && "animate-spin-slow")}
          strokeDasharray="10 20"
        />
        <circle 
          cx="300" cy="300" r="180" 
          className={cn("stroke-theme-cyan/10 fill-none stroke-[0.5px]", active && "animate-reverse-spin-slow")}
          strokeDasharray="5 15"
        />
      </svg>
    </div>
  );
};