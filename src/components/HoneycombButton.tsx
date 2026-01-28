"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NeuralHexNetwork } from "./NeuralHexNetwork";

interface HoneycombButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const HoneycombButton = ({ children, className, ...props }: HoneycombButtonProps) => {
  return (
    <div className="relative group">
      {/* Réseau neuronal d'hexagones plein écran au survol */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <NeuralHexNetwork />
      </div>

      {/* Halo multi-couches pour un dégradé très flou et fluide */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] rounded-full bg-green-500/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-glow-pulse" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-green-500/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Le bouton central */}
      <div className="relative flex justify-center items-center">
        <Button
          className={cn(
            "relative z-10 px-14 py-9 text-2xl bg-green-600 hover:bg-green-500 text-white rounded-full",
            "shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:shadow-[0_0_60px_rgba(34,197,94,0.8)]",
            "transition-all duration-500 ease-out transform group-hover:scale-110",
            "border border-green-400/40",
            className
          )}
          {...props}
        >
          <span className="flex items-center gap-4">
            {children}
          </span>
        </Button>
      </div>
      
      {/* Décorations hexagonales flottantes thématiques */}
      <div className="absolute -top-12 -right-12 w-16 h-16 opacity-0 group-hover:opacity-40 transition-all duration-1000 delay-150 transform group-hover:translate-x-8 group-hover:-translate-y-8">
        <HexagonIcon className="text-green-400 w-full h-full animate-pulse" />
      </div>
      <div className="absolute -bottom-12 -left-12 w-14 h-14 opacity-0 group-hover:opacity-40 transition-all duration-1000 delay-300 transform group-hover:-translate-x-8 group-hover:translate-y-8">
        <HexagonIcon className="text-green-500 w-full h-full animate-pulse" />
      </div>
    </div>
  );
};

const HexagonIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

export default HoneycombButton;