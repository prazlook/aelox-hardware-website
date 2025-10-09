import React, { useMemo, useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ASIC } from './ASICStatusCard';

export type StatusLevel = 'optimal' | 'eleve' | 'surcharge' | 'error' | 'offline';

interface GlobalStatusIndicatorProps {
  status: StatusLevel;
  hashrate: number;
  asics: ASIC[];
  isOverclockedMajority: boolean;
}

const statusConfig = {
  optimal: { gradient: { start: '#22c55e', end: '#16a34a' }, glow: 'shadow-[0_0_30px_5px_rgba(34,197,94,0.4)]' },
  eleve: { gradient: { start: '#f97316', end: '#ea580c' }, glow: 'shadow-[0_0_30px_5px_rgba(249,115,22,0.4)]' },
  surcharge: { gradient: { start: '#ef4444', end: '#dc2626' }, glow: 'shadow-[0_0_40px_10px_rgba(239,68,68,0.5)] animate-pulse' },
  error: { gradient: { start: '#eab308', end: '#ca8a04' }, glow: 'shadow-[0_0_40px_10px_rgba(234,179,8,0.5)] animate-pulse' },
  offline: { gradient: { start: '#6b7280', end: '#4b5563' }, glow: 'shadow-[0_0_20px_5px_rgba(107,114,128,0.3)]' },
};

export const GlobalStatusIndicator = ({ status, hashrate, asics, isOverclockedMajority }: GlobalStatusIndicatorProps) => {
  const gradientColors = statusConfig[status].gradient;
  const glowClass = statusConfig[status].glow;
  const svgRef = useRef<SVGSVGElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  const pathData = useMemo(() => {
    const width = 400;
    const height = 150;
    const baseHeight = height / 2;
    const maxAmplitude = height / 2 - 10;

    const normalizedHashrate = Math.min(hashrate / 1000, 1);
    const amplitude = maxAmplitude * normalizedHashrate;
    
    const points = asics.map((asic, index) => {
      const x = (width / (asics.length + 1)) * (index + 1);
      
      let yVariation = 0;
      if (asic.status === 'online' || asic.status === 'overclocked') {
        yVariation = (Math.sin(Date.now() / 200 + index) * amplitude) / 4;
      } else if (asic.status === 'booting up' || asic.status === 'shutting down') {
        yVariation = (Math.random() - 0.5) * 5;
      }
      
      const y = baseHeight + yVariation;
      return `L ${x.toFixed(2)} ${y.toFixed(2)}`;
    });

    return `M 0 75 ${points.join(' ')} L 400 75`;
  }, [hashrate, asics]);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [pathData]);

  const animationDuration = 2;
  const animationDelay = 0.2;

  return (
    <div className="w-full h-full relative overflow-hidden bg-theme-bg">
      <div className={cn("absolute inset-0 transition-shadow duration-1000", glowClass)} />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-theme-bg via-transparent to-transparent" />
      <div className="w-full h-full flex items-center justify-center">
        <svg ref={svgRef} width="100%" height="150" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientColors.start} />
              <stop offset="100%" stopColor={gradientColors.end} />
            </linearGradient>
            <linearGradient id="rainbow-gradient">
              <stop offset="0" stopColor="#ff0000" />
              <stop offset="0.15" stopColor="#ff7f00" />
              <stop offset="0.3" stopColor="#ffff00" />
              <stop offset="0.45" stopColor="#00ff00" />
              <stop offset="0.6" stopColor="#0000ff" />
              <stop offset="0.75" stopColor="#4b0082" />
              <stop offset="0.9" stopColor="#9400d3" />
              <stop offset="1" stopColor="#ff0000" />
              <animate attributeName="x1" from="-100%" to="100%" dur="4s" repeatCount="indefinite" />
              <animate attributeName="x2" from="0%" to="200%" dur="4s" repeatCount="indefinite" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            ref={pathRef}
            d={pathData}
            stroke={isOverclockedMajority ? "url(#rainbow-gradient)" : "url(#line-gradient)"}
            strokeWidth="2"
            fill="none"
            className="transition-all duration-1000 ease-in-out"
            filter="url(#glow)"
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset: pathLength,
              animation: `draw-line ${animationDuration}s ease-out forwards ${animationDelay}s`,
            }}
          />
        </svg>
      </div>
    </div>
  );
};