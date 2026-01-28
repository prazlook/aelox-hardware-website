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
    <div className="relative group p-48">
      {/* Styles d'animation personnalisés */}
      <style>{`
        @keyframes orbit-90 {
          0%, 20% { transform: rotate(0deg); }
          40%, 100% { transform: rotate(90deg); }
        }
        @keyframes self-spin {
          0%, 50% { transform: rotate(0deg); }
          70%, 100% { transform: rotate(360deg); }
        }
        .animate-orbit-custom {
          animation: orbit-90 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-spin-custom {
          animation: self-spin 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Réseau neuronal d'hexagones étendu à toute la page */}
      <div className="fixed inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-0">
        <NeuralHexNetwork />
      </div>

      {/* Halo multi-couches */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] rounded-full bg-green-500/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-glow-pulse" />
        <div className="absolute w-[150px] h-[150px] rounded-full bg-green-500/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Conteneur d'animation orbitale pour les deux hexagones */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="relative w-[350px] h-[350px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 animate-orbit-custom">
          {/* Hexagone 1 (Top Right) */}
          <div className="absolute top-0 right-0 w-16 h-16 animate-spin-custom">
            <HexagonIcon className="text-green-400 w-full h-full" />
          </div>
          {/* Hexagone 2 (Bottom Left) */}
          <div className="absolute bottom-0 left-0 w-14 h-14 animate-spin-custom">
            <HexagonIcon className="text-green-500 w-full h-full" />
          </div>
        </div>
      </div>

      {/* Le bouton central */}
      <div className="relative flex justify-center items-center">
        <Button
          className={cn(
            "relative z-10 px-14 py-9 text-2xl bg-green-600 hover:bg-green-500 text-white rounded-full",
            "shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:shadow-[0_0_60_rgba(34,197,94,0.8)]",
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
    </div>
  );
};

const HexagonIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

export default HoneycombButton;