"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NeuralHexNetwork } from "./NeuralHexNetwork";

interface HoneycombButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isClicked?: boolean;
}

const HoneycombButton = ({ children, className, isClicked, ...props }: HoneycombButtonProps) => {
  return (
    <div className="relative group p-48">
      {/* Réseau neuronal d'hexagones - visible par défaut à 30% d'opacité */}
      <div className={cn(
        "fixed inset-0 opacity-30 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-0",
        isClicked && "opacity-100"
      )}>
        <NeuralHexNetwork />
      </div>

      {/* Halo multi-couches - visible par défaut */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={cn(
          "w-[300px] h-[300px] rounded-full bg-green-500/5 blur-[120px] group-hover:opacity-100 transition-opacity duration-1000 animate-glow-pulse",
          isClicked && "opacity-0"
        )} />
      </div>

      {/* Le bouton central */}
      <div className="relative flex justify-center items-center">
        <Button
          className={cn(
            "relative z-10 px-14 py-9 text-2xl bg-green-600 hover:bg-green-500 text-white rounded-full",
            "shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:shadow-[0_0_60px_rgba(34,197,94,0.8)]",
            "transition-all duration-500 ease-out transform",
            !isClicked && "group-hover:scale-110",
            "border border-green-400/40",
            isClicked && "animate-button-morph-hex",
            className
          )}
          {...props}
        >
          <span className={cn("flex items-center gap-4 transition-opacity", isClicked && "opacity-0")}>
            {children}
          </span>
        </Button>
      </div>
      
      {/* Hexagones orbitaux - SEULS éléments invisibles sans survol */}
      <div className={cn(
        "absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        isClicked && "opacity-0"
      )}>
        <div className="absolute inset-0 animate-hexagon-orbital">
          <div className="absolute top-24 right-24 w-16 h-16 animate-hexagon-spin-flash">
            <HexagonIcon className="text-green-400 w-full h-full" />
          </div>
        </div>
        <div className="absolute inset-0 animate-hexagon-orbital" style={{ transform: 'rotate(180deg)' }}>
          <div className="absolute bottom-24 left-24 w-14 h-14 animate-hexagon-spin-flash">
            <HexagonIcon className="text-green-500 w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const HexagonIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

export default HoneycombButton;