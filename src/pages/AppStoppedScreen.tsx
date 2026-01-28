"use client";

import React, { useState, useCallback } from 'react';
import { Power } from 'lucide-react';
import { useAppStatus } from '@/context/AppStatusContext';
import HoneycombButton from '@/components/HoneycombButton';
import { NeuralHexNetwork } from '@/components/NeuralHexNetwork';
import { useTypewriter } from '@/hooks/useTypewriter';
import { cn } from '@/lib/utils';

type TransitionState = 'idle' | 'morphing' | 'hex-infiltrating' | 'struggling' | 'box-active' | 'flash' | 'complete';

const AppStoppedScreen = () => {
  const { startApp } = useAppStatus();
  const [step, setStep] = useState<TransitionState>('idle');
  const [redHexPos, setRedHexPos] = useState({ x: 0, y: 0 });
  const [terminalText, setTerminalText] = useState('');
  
  const textToType = "> BREACH DETECTED...\n> CORE OVERRIDE INITIATED...\n> REDACTING SECURITY PROTOCOLS...\n> INFILTRATION: 100%\n> ACCESS GRANTED.";
  const typedText = useTypewriter(terminalText, 30);

  const handleRedHexPos = useCallback((pos: { x: number, y: number }) => {
    setRedHexPos(pos);
  }, []);

  const handleStart = () => {
    setStep('morphing');
    
    // Début de l'infiltration (l'hexagone rouge apparaît dans le network)
    setTimeout(() => setStep('hex-infiltrating'), 1000);
    
    // Phase de lutte (jitter intense)
    setTimeout(() => setStep('struggling'), 3000);
    
    // La boîte apparaît et se connecte par une ligne solide
    setTimeout(() => {
      setStep('box-active');
      setTerminalText(textToType);
    }, 5000);
    
    // Flash final plus long
    setTimeout(() => setStep('flash'), 8500);
    setTimeout(() => startApp(), 9500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary p-4 overflow-hidden relative">
      
      {/* Network Neural avec l'hexagone rouge "intrus" */}
      <div className={cn(
        "fixed inset-0 transition-opacity duration-1000 pointer-events-none z-0",
        step === 'idle' ? "opacity-0" : "opacity-100"
      )}>
        <NeuralHexNetwork 
          redHexActive={step !== 'idle' && step !== 'morphing'} 
          onRedHexPos={handleRedHexPos}
        />
      </div>

      {/* L'éclair blanc final */}
      {step === 'flash' && (
        <div className="fixed inset-0 z-50 animate-final-flash pointer-events-none" />
      )}

      {/* Éléments de transition (Boîte et Ligne) */}
      {(step === 'box-active' || step === 'struggling') && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg className="w-full h-full" viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}>
            {/* Ligne solide entre l'hexagone rouge mobile et la boîte fixe */}
            <path
              d={`M ${redHexPos.x} ${redHexPos.y} L ${window.innerWidth / 2 + 200} ${redHexPos.y} L ${window.innerWidth / 2 + 200} ${window.innerHeight / 2 - 100}`}
              stroke="#ef4444"
              strokeWidth="2"
              fill="none"
              className={cn("animate-red-line-draw", step === 'struggling' && "animate-struggle")}
              filter="drop-shadow(0 0 10px red)"
            />
          </svg>

          {/* Boîte de terminal rouge en "lutte" */}
          <div 
            className={cn(
              "absolute top-[20%] left-[calc(50%+150px)] w-80 p-4 border-2 border-red-500 bg-red-950/60 backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.4)]",
              step === 'struggling' ? "animate-struggle" : "animate-box-reveal"
            )}
          >
            <div className="flex items-center justify-between mb-2 border-b border-red-500/30 pb-1">
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">Infiltration Engine</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
              </div>
            </div>
            <pre className="text-xs font-mono text-red-400 whitespace-pre-wrap leading-relaxed typewriter-cursor">
              {step === 'box-active' ? typedText : "> ERROR: ATTEMPTING HANDSHAKE..."}
            </pre>
          </div>
        </div>
      )}

      {/* UI Initiale */}
      <div className={cn(
        "text-center space-y-8 max-w-md w-full transition-opacity duration-500 z-10",
        step !== 'idle' && "opacity-0 pointer-events-none"
      )}>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            Aelox Core
          </h1>
          <p className="text-theme-text-secondary text-lg">
            Initialisez la séquence de déploiement
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center py-10 relative z-10">
        <HoneycombButton
          onClick={handleStart}
          isClicked={step !== 'idle'}
          aria-label="Démarrer l'application"
        >
          <Power className="w-8 h-8" />
          <span className="font-bold tracking-widest uppercase text-sm">Initialiser</span>
        </HoneycombButton>
      </div>
    </div>
  );
};

export default AppStoppedScreen;