"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface HoneycombButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const HoneycombButton = ({ children, className, ...props }: HoneycombButtonProps) => {
  return (
    <div className="relative group p-8">
      {/* Grille Honeycomb en arrière-plan */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <svg className="w-full h-full text-green-500/20" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="honeycomb" x="0" y="0" width="10" height="17.32" patternUnits="userSpaceOnUse">
            <path 
              d="M5 0 L10 2.88 L10 8.66 L5 11.54 L0 8.66 L0 2.88 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5" 
            />
          </pattern>
          <rect width="100" height="100" fill="url(#honeycomb)" />
        </svg>
        
        {/* Effet de balayage laser */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/20 to-transparent h-1/2 animate-honeycomb-scan" />
      </div>

      {/* Halo de lueur pulsant */}
      <div className="absolute inset-0 rounded-full bg-green-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-glow-pulse" />

      {/* Le bouton lui-même */}
      <Button
        className={cn(
          "relative z-10 px-10 py-6 text-xl bg-green-600 hover:bg-green-500 text-white rounded-full",
          "shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_35px_rgba(34,197,94,0.6)]",
          "transition-all duration-300 ease-out transform group-hover:scale-110",
          "border border-green-400/30",
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-3">
          {children}
        </span>
      </Button>
      
      {/* Décorations hexagonales flottantes */}
      <div className="absolute -top-2 -right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform group-hover:translate-x-2 group-hover:-translate-y-2">
        <HexagonIcon className="text-green-400 w-full h-full animate-pulse" />
      </div>
      <div className="absolute -bottom-2 -left-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform group-hover:-translate-x-2 group-hover:translate-y-2">
        <HexagonIcon className="text-green-500 w-full h-full animate-pulse" />
      </div>
    </div>
  );
};

const HexagonIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

export default HoneycombButton;