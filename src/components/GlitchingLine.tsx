"use client";

import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface GlitchingLineProps {
  text: string;
  isGlitching?: boolean;
  onDeleted: () => void;
}

export const GlitchingLine = ({ text, isGlitching, onDeleted }: GlitchingLineProps) => {
  const [phase, setPhase] = useState<'normal' | 'glitching' | 'flashing'>('normal');

  useEffect(() => {
    if (isGlitching && phase === 'normal') {
      setPhase('glitching');
      
      // Phase de clignotement orange/vert (1.5s)
      const flashTimer = setTimeout(() => {
        setPhase('flashing');
      }, 1500);

      // Phase finale de volatilisation (0.5s après le flash)
      const deleteTimer = setTimeout(() => {
        onDeleted();
      }, 2000);

      return () => {
        clearTimeout(flashTimer);
        clearTimeout(deleteTimer);
      };
    }
  }, [isGlitching, phase, onDeleted]);

  if (phase === 'flashing') {
    return (
      <div className="h-4 bg-white animate-final-flash my-0.5 rounded-sm" />
    );
  }

  return (
    <div className={cn(
      "text-[10px] font-mono leading-relaxed transition-colors duration-300 whitespace-pre-wrap",
      phase === 'glitching' ? "text-orange-500" : "text-red-400"
    )}>
      {text.split('').map((char, i) => {
        if (phase === 'glitching' && Math.random() > 0.7) {
          return (
            <span 
              key={i} 
              className="animate-hex-red-orange"
              style={{ animationDelay: `${Math.random()}s` }}
            >
              {char}
            </span>
          );
        }
        return <span key={i}>{char}</span>;
      })}
    </div>
  );
};