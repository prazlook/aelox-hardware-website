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
  
  // Texte plus long pour accompagner la durée étendue
  const textToType = "> BREACH DETECTED...\n> CORE OVERRIDE INITIATED...\n> REDACTING SECURITY PROTOCOLS...\n> INJECTING MALWARE... 45%\n> INJECTING MALWARE... 82%\n> INJECTING MALWARE... 100%\n> BYPASSING KERNEL LOCK...\n> INFILTRATION: 100%\n> ACCESS GRANTED.";
  const typedText = useTypewriter(terminalText, 40);

  const handleRedHexPos = useCallback((pos: { x: number, y: number }) => {
    setRedHexPos(pos);
  }, []);

  const handleStart = () => {
    setStep('morphing');
    
    // Séquence temporelle étirée pour un combat plus long
    setTimeout(() => setStep('hex-infiltrating'), 1500);
    
    // Début du combat (struggling) - dure 10 secondes
    setTimeout(() => setStep('struggling'), 4000);
    
    // Apparition du terminal après le combat acharné
    setTimeout(() => {
      setStep('box-active');
      setTerminalText(textToType);
    }, 14000);
    
    // Finalisation
    setTimeout(() => setStep('flash'), 21000);
    setTimeout(() => startApp(), 22500);
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
            {/* Ligne directe entre l'hexagone rouge mobile et le coin de la boîte de dialogue */}
            <path
              d={`M ${redHexPos.x} ${redHexPos.y} L ${window.innerWidth / 2 + 150} ${window.innerHeight * 0.2 + 50}`}
              stroke="#ef4444"
              strokeWidth="2"
              fill="none"
              className={cn("animate-red-line-draw", step === 'struggling' && "animate-struggle")}
              filter="drop-shadow(0 0 15px red)"
            />
          </svg>

          {/* Boîte de terminal rouge en "lutte" */}
          <div 
            className={cn(
              "absolute top-[20%] left-[calc(50%+150px)] w-80 p-4 border-2 border-red-500 bg-red-950/70 backdrop-blur-2xl shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all duration-500",
              step === 'struggling' ? "animate-struggle" : "animate-box-reveal"
            )}
          >
            <div className="flex items-center justify-between mb-2 border-b border-red-500/30 pb-1">
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Aggressive Breach
              </span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                <div className="w-1.5 h-1.5 rounded-full bg-red-800" />
              </div>
            </div>
            <pre className="text-[11px] font-mono text-red-400 whitespace-pre-wrap leading-relaxed typewriter-cursor min-h-[120px]">
              {step === 'box-active' ? typedText : "> ERROR: SECURITY BUFFER RESISTING...\n> RETRYING EXPLOIT..."}
            </pre>
            {step === 'struggling' && (
              <div className="mt-2 text-[10px] text-red-500 animate-pulse font-bold text-center">
                SYSTEM UNDER ATTACK
              </div>
            )}
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