"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NeuralHoneycombBackground } from "./NeuralHoneycombBackground";

interface HoneycombButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const HoneycombButton = ({ children, className, ...props }: HoneycombButtonProps) => {
  return (
    <div className="relative group p-32"> {/* Augmentation du padding pour laisser le réseau s'étendre */}
      {/* Réseau neuronal neuronal d'hexagones */}
      <NeuralHoneycombBackground />

      {/* Halo de lueur pulsant (amélioré) */}
      <div className="absolute inset-0 rounded-full bg-green-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-glow-pulse" />

      {/* Le bouton lui-même */}
      <Button
        className={cn(
          "relative z-10 px-12 py-8 text-xl bg-green-600 hover:bg-green-500 text-white rounded-full",
          "shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.7)]",
          "transition-all duration-500 ease-out transform group-hover:scale-110",
          "border border-green-400/40",
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-4 relative">
          <span className="absolute -inset-2 bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          {children}
        </span>
      </Button>
      
      {/* Décorations hexagonales fixes qui clignotent */}
      <div className="absolute top-1/4 right-1/4 w-8 h-8 opacity-0 group-hover:opacity-80 transition-all duration-1000 transform group-hover:translate-x-12 group-hover:-translate-y-12 animate-flicker">
        <HexagonIcon className="text-green-400 w-full h-full" />
      </div>
      <div className="absolute bottom-1/4 left-1/4 w-6 h-6 opacity-0 group-hover:opacity-60 transition-all duration-1000 transform group-hover:-translate-x-16 group-hover:translate-y-16 animate-flicker" style={{ animationDelay: '1s' }}>
        <HexagonIcon className="text-green-500 w-full h-full" />
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