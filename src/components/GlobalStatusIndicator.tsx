import React from 'react';
import { cn } from '@/lib/utils';
import { ASIC } from './ASICStatusCard';

export type StatusLevel = 'optimal' | 'eleve' | 'surcharge' | 'error' | 'offline';

interface GlobalStatusIndicatorProps {
  status: StatusLevel;
  hashrate: number;
  asics: ASIC[];
  isOverclockedMajority: boolean;
}

const Beam = ({ top, left, duration, delay, isOverdrive }: { top: string, left: string, duration: string, delay: string, isOverdrive: boolean }) => (
  <div
    className={cn(
      "absolute w-1 h-full animate-beam",
      isOverdrive
        ? "bg-[linear-gradient(120deg,_#ffb3ba,_#ffdfba,_#ffffba,_#baffc9,_#bae1ff,_#e0baff,_#ffb3ba)] bg-[length:200%_200%] animate-aurora"
        : "bg-cyan-400/50"
    )}
    style={{ top, left, animationDuration: duration, animationDelay: delay }}
  />
);

const GridLines = () => (
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.white/0.03)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.white/0.03)_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
  </div>
);

const Noise = () => (
  <svg className="absolute inset-0 w-full h-full z-0 opacity-20" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

export const GlobalStatusIndicator = ({ status, hashrate, asics, isOverclockedMajority }: GlobalStatusIndicatorProps) => {
  const isOverdrive = isOverclockedMajority;

  const statusConfig = {
    optimal: { bg: 'bg-green-500/10', text: 'text-green-400', glow: 'shadow-green-500/20' },
    eleve: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
    surcharge: { 
      bg: isOverdrive ? 'bg-[linear-gradient(110deg,#fcd34d_0%,#fbbf24_25%,#f59e0b_50%,#fbbf24_75%,#fcd34d_100%)] bg-[length:200%_100%] animate-aurora' : 'bg-orange-500/10', 
      text: isOverdrive ? 'text-yellow-200 font-bold' : 'text-orange-400', 
      glow: isOverdrive ? 'shadow-amber-500/40' : 'shadow-orange-500/20' 
    },
    error: { bg: 'bg-red-500/10', text: 'text-red-400', glow: 'shadow-red-500/20' },
    offline: { bg: 'bg-gray-500/10', text: 'text-gray-400', glow: 'shadow-gray-500/20' },
  };

  const config = statusConfig[status];

  const beams = [
    { top: '0', left: '10%', duration: '5s', delay: '0s' },
    { top: '0', left: '30%', duration: '6s', delay: '1s' },
    { top: '0', left: '50%', duration: '4s', delay: '2s' },
    { top: '0', left: '70%', duration: '5.5s', delay: '0.5s' },
    { top: '0', left: '90%', duration: '4.5s', delay: '1.5s' },
  ];

  return (
    <div className={cn("relative w-full h-full overflow-hidden", config.bg)}>
      <GridLines />
      <Noise />
      <div className={cn("absolute inset-0 z-10", `shadow-[inset_0_0_100px_50px_rgba(0,0,0,0.9)]`, config.glow)} />
      
      <div className="absolute inset-0 z-20 pointer-events-none">
        {beams.map((beam, i) => <Beam key={i} {...beam} isOverdrive={isOverdrive} />)}
      </div>

      <div className="relative z-30 flex flex-col items-center justify-center h-full text-center p-4">
        <h2 className={cn("text-lg font-semibold uppercase tracking-widest", config.text)}>
          {isOverdrive && status === 'surcharge' ? 'SURCHARGE OVERDRIVE' : `État: ${status}`}
        </h2>
        <p className="text-5xl font-bold mt-2 text-white drop-shadow-lg">
          {hashrate.toFixed(2)} <span className="text-3xl font-normal text-gray-300">TH/s</span>
        </p>
      </div>
    </div>
  );
};