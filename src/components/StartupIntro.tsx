import React from 'react';
import { GlobalStatusIndicator, StatusLevel } from './GlobalStatusIndicator';
import { ASIC } from './ASICStatusCard';
import { cn } from '@/lib/utils';

interface StartupIntroProps {
  status: StatusLevel;
  hashrate: number;
  asics: ASIC[];
  isOverclockedMajority: boolean;
}

export const StartupIntro = ({ status, hashrate, asics, isOverclockedMajority }: StartupIntroProps) => {
  return (
    <div className={cn(
      "fixed inset-0 bg-theme-dark flex items-center justify-center z-[100] transition-opacity duration-500",
      "animate-startup-fade-in-from-center" // Apply initial fade-in to the container
    )}>
      <div className="w-full max-w-4xl h-full max-h-[200px] flex items-center justify-center">
        <GlobalStatusIndicator
          status={status}
          hashrate={hashrate}
          asics={asics}
          isOverclockedMajority={isOverclockedMajority}
          className="w-full h-full"
          style={{ animationDelay: '0.2s' }} // Delay the indicator animation slightly
          triggerStartupAnimation={true} // Explicitly trigger its internal startup animation
        />
      </div>
    </div>
  );
};