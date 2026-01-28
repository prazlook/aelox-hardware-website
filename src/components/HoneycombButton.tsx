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
    <div className="relative group p-32"> {/* Zone p-32 pour une extension massive */}
      {/* Réseau neuronal d'hexagones en arrière-plan étendu */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <NeuralHexNetwork />
      </div>

      {/* Grille Honeycomb statique légère en arrière-plan */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden scale-110">
        <svg className="w-full h-full text-green-500/10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="honeycomb-bg" x="0" y="0" width="10" height="17.32" patternUnits="userSpaceOnUse">
            <path 
              d="M5 0 L10 2.88 L10 8.66 L5 11.54 L0 8.66 L0 2.88 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.1" 
            />
          </pattern>
          <rect width="100" height="100" fill="url(#honeycomb-bg)" />
        </svg>
      </div>

      {/* Halo de lueur central plus large */}
      <div className="absolute inset-0 rounded-full bg-green-500/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-glow-pulse" />

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
      
      {/* Décorations hexagonales flottantes décalées */}
      <div className="absolute top-10 right-10 w-16 h-16 opacity-0 group-hover:opacity-40 transition-all duration-1000 delay-150 transform group-hover:translate-x-8 group-hover:-translate-y-8">
        <HexagonIcon className="text-green-400 w-full h-full animate-pulse" />
      </div>
      <div className="absolute bottom-10 left-10 w-14 h-14 opacity-0 group-hover:opacity-40 transition-all duration-1000 delay-300 transform group-hover:-translate-x-8 group-hover:translate-y-8">
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