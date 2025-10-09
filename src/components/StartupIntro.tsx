import React, { useState, useEffect } from 'react';
import { GlobalStatusIndicator, StatusLevel } from './GlobalStatusCard'; // Corrected import
import { ASIC } from './ASICStatusCard';
import { cn } from '@/lib/utils';
import { useAppStatus } from '@/context/AppStatusContext';
import { Progress } from '@/components/ui/progress';

interface StartupIntroProps {
  status: StatusLevel;
  hashrate: number;
  asics: ASIC[];
  isOverclockedMajority: boolean;
}

export const StartupIntro = ({ status, hashrate, asics, isOverclockedMajority }: StartupIntroProps) => {
  const { appPhase } = useAppStatus();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (appPhase === 'intro') {
      const timer = setTimeout(() => setProgress(100), 3500); // Fill progress bar over 3.5 seconds
      return () => clearTimeout(timer);
    } else {
      setProgress(0); // Reset progress when not in intro phase
    }
  }, [appPhase]);

  return (
    <div className={cn(
      "fixed inset-0 bg-theme-dark flex flex-col items-center justify-center z-[100] transition-opacity duration-500",
      appPhase === 'main_ui_loading' && "opacity-0 pointer-events-none", // Fade out when main UI loads
      "animate-startup-fade-in-from-center" // Initial fade-in for the whole intro screen
    )}>
      <div className="w-full max-w-4xl h-full max-h-[200px] flex items-center justify-center relative">
        <GlobalStatusIndicator
          status={status}
          hashrate={hashrate}
          asics={asics}
          isOverclockedMajority={isOverclockedMajority}
          className="w-full h-full"
          style={{ animationDelay: '0.2s' }}
          triggerStartupAnimation={true} // Always trigger internal animation during intro
          isMainUiLoading={false} // Not in main UI loading phase
        />
      </div>
      <div className="absolute bottom-1/4 w-full max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold text-theme-cyan animate-startup-text-reveal" style={{ animationDelay: '0.5s' }}>
          SYSTEM INITIALIZING...
        </h2>
        <Progress value={progress} className="w-full h-2 bg-gray-700 animate-startup-progress-bar" style={{ animationDelay: '0.8s' }} />
      </div>
    </div>
  );
};