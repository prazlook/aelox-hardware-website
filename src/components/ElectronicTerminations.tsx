"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface TerminatingHexProps {
  className?: string;
  delay?: string;
  angle: number;
  distance: number;
}

const TerminatingHex = ({ className, delay, angle, distance }: TerminatingHexProps) => {
  // Calcul de la position finale basée sur l'angle et la distance
  const radian = (angle * Math.PI) / 180;
  const tx = Math.cos(radian) * distance;
  const ty = Math.sin(radian) * distance;

  return (
    <div 
      className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500",
        className
      )}
      style={{ 
        transitionDelay: delay,
        transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`,
      }}
    >
      <div className="group-hover:scale-100 transition-transform duration-500 transform-gpu" style={{ transitionDelay: delay }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-theme-cyan/60 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      </div>
    </div>
  );
};

export const ElectronicTerminations = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Lignes de circuit animées */}
      <svg className="absolute inset-[-100px] w-[calc(100%+200px)] h-[calc(100%+200px)]" viewBox="0 0 400 300" fill="none">
        <defs>
          <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 240, 255, 0)" />
            <stop offset="50%" stopColor="rgba(0, 240, 255, 0.5)" />
            <stop offset="100%" stopColor="rgba(0, 240, 255, 0)" />
          </linearGradient>
        </defs>
        
        {/* Groupe de lignes qui s'affichent au survol */}
        <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Haut Gauche */}
          <path d="M150,120 L120,90 L80,90" stroke="url(#circuit-grad)" strokeWidth="1" className="animate-circuit-draw" />
          {/* Haut Droite */}
          <path d="M250,120 L280,90 L320,90" stroke="url(#circuit-grad)" strokeWidth="1" className="animate-circuit-draw" style={{ animationDelay: '0.1s' }} />
          {/* Bas Gauche */}
          <path d="M150,180 L120,210 L80,210" stroke="url(#circuit-grad)" strokeWidth="1" className="animate-circuit-draw" style={{ animationDelay: '0.2s' }} />
          {/* Bas Droite */}
          <path d="M250,180 L280,210 L320,210" stroke="url(#circuit-grad)" strokeWidth="1" className="animate-circuit-draw" style={{ animationDelay: '0.3s' }} />
        </g>
      </svg>

      {/* Hexagones aux extrémités */}
      <TerminatingHex angle={210} distance={160} delay="0.4s" />
      <TerminatingHex angle={150} distance={160} delay="0.5s" />
      <TerminatingHex angle={30} distance={160} delay="0.6s" />
      <TerminatingHex angle={330} distance={160} delay="0.7s" />
    </div>
  );
};