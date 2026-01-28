"use client";

import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface SubDiagnosticBoxProps {
  label: string;
  className?: string;
}

export const SubDiagnosticBox = ({ label, className }: SubDiagnosticBoxProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Apparition aléatoire
    const openTimeout = setTimeout(() => setIsVisible(true), Math.random() * 5000);
    
    return () => clearTimeout(openTimeout);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsVisible(false), 1000);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "absolute z-30 p-2 bg-theme-dark/90 border border-theme-cyan/50 rounded-md shadow-lg animate-fade-in-slide-up text-[10px] font-mono w-32",
      className
    )}>
      <div className="flex justify-between mb-1 text-theme-cyan">
        <span>{label}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-theme-cyan transition-all duration-300" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};