"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAppStatus } from '@/context/AppStatusContext'; // Import useAppStatus

// Définition de l'interface pour les props du GlobalStatusIndicator
interface GlobalStatusIndicatorProps {
  status: 'online' | 'offline' | 'warning';
  hashrate: string;
  asics: number;
  isOverclockedMajority: boolean;
}

export const GlobalStatusIndicator = ({ status, hashrate, asics, isOverclockedMajority }: GlobalStatusIndicatorProps) => {
  const { triggerStartupAnimation } = useAppStatus();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (triggerStartupAnimation) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000); // Durée de l'animation des barres
      return () => clearTimeout(timer);
    }
  }, [triggerStartupAnimation]);

  const barCount = 30; // Nombre de barres
  const radius = 60; // Rayon du cercle des barres
  const indicatorSize = 150; // Taille totale du SVG
  const centerX = indicatorSize / 2;
  const centerY = indicatorSize / 2;

  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
      case 'online':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'offline':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 m-6 p-4 bg-theme-card rounded-lg shadow-lg flex items-center space-x-4 z-50",
        triggerStartupAnimation ? "animate-startup-fade-in-scale" : ""
      )}
      style={triggerStartupAnimation ? { animationDelay: '1.5s' } : {}}
    >
      <div className="relative" style={{ width: indicatorSize, height: indicatorSize }}>
        {/* Cercle central */}
        <svg className="absolute inset-0" width={indicatorSize} height={indicatorSize} viewBox={`0 0 ${indicatorSize} ${indicatorSize}`}>
          <circle
            cx={centerX}
            cy={centerY}
            r={radius - 10}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />
          {/* Barres externes */}
          {Array.from({ length: barCount }).map((_, i) => {
            const angle = (i / barCount) * 2 * Math.PI;
            const x1 = centerX + (radius - 5) * Math.cos(angle);
            const y1 = centerY + (radius - 5) * Math.sin(angle);
            const x2 = centerX + (radius + 10) * Math.cos(angle);
            const y2 = centerY + (radius + 10) * Math.sin(angle);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#gradient-bar)"
                strokeWidth="2"
                strokeLinecap="round"
                className={cn(
                  "origin-center",
                  isAnimating ? "animate-global-indicator-bars-grow" : ""
                )}
                style={isAnimating ? { animationDelay: `${1.6 + i * 0.015}s` } : {}}
              />
            );
          })}
          {/* Dégradé pour les barres */}
          <defs>
            <linearGradient id="gradient-bar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFFF" />
              <stop offset="100%" stopColor="#FF00FF" />
            </linearGradient>
          </defs>
        </svg>
        {/* Icône de statut au centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", getStatusColor(status))}>
            {status === 'online' && <span className="text-2xl">✓</span>}
            {status === 'warning' && <span className="text-2xl">!</span>}
            {status === 'offline' && <span className="text-2xl">✗</span>}
          </div>
        </div>
      </div>

      {/* Informations de statut */}
      <div className="flex flex-col space-y-1">
        <span className="text-lg font-semibold text-theme-text-primary">Statut: <span className={getStatusColor(status)}>{status.toUpperCase()}</span></span>
        <span className="text-sm text-theme-text-secondary">Hashrate: {hashrate}</span>
        <span className="text-sm text-theme-text-secondary">ASICs actifs: {asics}</span>
        <span className="text-sm text-theme-text-secondary">Overclock: {isOverclockedMajority ? 'Majorité' : 'Non'}</span>
      </div>
    </div>
  );
};