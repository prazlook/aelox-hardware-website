"use client";

import React from 'react';
import { cn } from "@/lib/utils";

export const CircuitEffect = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <div className={cn(
      "absolute inset-0 pointer-events-none z-[-1] transition-opacity duration-300",
      isHovered ? "opacity-100" : "opacity-0"
    )}>
      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] overflow-visible">
        <defs>
          <filter id="glow-circuit" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Terminaisons gauches */}
        <g className={cn("transition-all duration-500", isHovered ? "translate-x-0" : "translate-x-10")}>
          <path 
            d="M 220,200 L 150,200 L 120,150 L 50,150" 
            stroke="#00F0FF" strokeWidth="1" fill="none"
            className={cn("animate-circuit-draw", !isHovered && "opacity-0")}
            filter="url(#glow-circuit)"
          />
          <path 
            d="M 220,220 L 140,220 L 100,280 L 30,280" 
            stroke="#00F0FF" strokeWidth="1" fill="none"
            className={cn("animate-circuit-draw", !isHovered && "opacity-0")}
            style={{ animationDelay: '0.1s' }}
            filter="url(#glow-circuit)"
          />
          <circle cx="50" cy="150" r="3" fill="#00F0FF" className={cn("animate-fade-in", !isHovered && "opacity-0")} style={{ animationDelay: '0.5s' }} />
          <circle cx="30" cy="280" r="3" fill="#00F0FF" className={cn("animate-fade-in", !isHovered && "opacity-0")} style={{ animationDelay: '0.6s' }} />
        </g>

        {/* Terminaisons droites avec hexagones */}
        <g className={cn("transition-all duration-500", isHovered ? "translate-x-0" : "-translate-x-10")}>
          <path 
            d="M 380,200 L 450,200 L 480,140 L 550,140" 
            stroke="#00F0FF" strokeWidth="1" fill="none"
            className={cn("animate-circuit-draw", !isHovered && "opacity-0")}
            style={{ animationDelay: '0.2s' }}
            filter="url(#glow-circuit)"
          />
          <path 
            d="M 380,220 L 460,220 L 500,300 L 570,300" 
            stroke="#00F0FF" strokeWidth="1" fill="none"
            className={cn("animate-circuit-draw", !isHovered && "opacity-0")}
            style={{ animationDelay: '0.3s' }}
            filter="url(#glow-circuit)"
          />
          
          {/* Hexagones au bout des lignes */}
          <g transform="translate(550, 140) scale(0.8)" className={cn("animate-fade-in", !isHovered && "opacity-0")} style={{ animationDelay: '0.7s' }}>
            <path d="M 10,0 L 5,8.66 L -5,8.66 L -10,0 L -5,-8.66 L 5,-8.66 Z" fill="none" stroke="#00F0FF" strokeWidth="1" />
          </g>
          <g transform="translate(570, 300) scale(1.2)" className={cn("animate-fade-in", !isHovered && "opacity-0")} style={{ animationDelay: '0.8s' }}>
            <path d="M 10,0 L 5,8.66 L -5,8.66 L -10,0 L -5,-8.66 L 5,-8.66 Z" fill="none" stroke="#00F0FF" strokeWidth="1" />
          </g>
        </g>
      </svg>
    </div>
  );
};