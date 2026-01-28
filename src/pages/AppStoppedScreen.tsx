"use client";

import React, { useState, useEffect } from 'react';
import { Power } from 'lucide-react';
import { useAppStatus } from '@/context/AppStatusContext';
import HoneycombButton, { HexagonIcon } from '@/components/HoneycombButton';
import { useTypewriter } from '@/hooks/useTypewriter';
import { cn } from '@/lib/utils';

type TransitionState = 'idle' | 'morphing' | 'hex-line' | 'box-typing' | 'flash' | 'complete';

const AppStoppedScreen = () => {
  const { startApp } = useAppStatus();
  const [step, setStep] = useState<TransitionState>('idle');
  const [terminalText, setTerminalText] = useState('');
  
  const textToType = "> INITIALIZING CORE SYSTEMS...\n> LOADING NEURAL NETWORK...\n> CONNECTING TO ASIC NODES...\n> SECURITY HANDSHAKE: OK.\n> SYSTEM READY.";
  const typedText = useTypewriter(terminalText, 25);

  const handleStart = () => {
    setStep('morphing');
    
    // Séquence temporelle
    setTimeout(() => setStep('hex-line'), 1000);
    setTimeout(() => {
      setStep('box-typing');
      setTerminalText(textToType);
    }, 2000);
    setTimeout(() => setStep('flash'), 4500);
    setTimeout(() => startApp(), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary p-4 overflow-hidden relative">
      
      {/* L'éclair blanc final */}
      {step === 'flash' && (
        <div className="fixed inset-0 z-50 animate-final-flash pointer-events-none" />
      )}

      {/* Séquence de transition SVG */}
      {step !== 'idle' && step !== 'morphing' && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <svg className="w-full h-full max-w-4xl max-h-[600px]" viewBox="0 0 800 600">
            {/* Hexagone rouge au centre (là où était le bouton) */}
            <g className={cn("animate-red-hex-appear", step === 'flash' && "opacity-0")}>
              <foreignObject x="360" y="260" width="80" height="80">
                <div className={cn("w-full h-full text-red-500", step === 'box-typing' && "animate-hex-red-orange")}>
                  <HexagonIcon className="w-full h-full fill-red-500/20" />
                </div>
              </foreignObject>
            </g>

            {/* Ligne de connexion rouge */}
            {(step === 'hex-line' || step === 'box-typing') && (
              <path
                d="M 440 300 L 550 300 L 550 200"
                stroke="#ef4444"
                strokeWidth="2"
                fill="none"
                className="animate-red-line-draw"
                filter="drop-shadow(0 0 5px red)"
              />
            )}
          </svg>

          {/* Boîte de terminal rouge futuriste */}
          {step === 'box-typing' && (
            <div className="absolute top-[120px] left-[550px] w-80 p-4 border-2 border-red-500 bg-red-950/40 backdrop-blur-md animate-box-reveal shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <div className="flex items-center justify-between mb-2 border-b border-red-500/30 pb-1">
                <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">System Monitor</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
                </div>
              </div>
              <pre className="text-xs font-mono text-red-400 whitespace-pre-wrap leading-relaxed typewriter-cursor">
                {typedText}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className={cn(
        "text-center space-y-8 max-w-md w-full transition-opacity duration-500",
        step !== 'idle' && "opacity-0 pointer-events-none"
      )}>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            Système en Veille
          </h1>
          <p className="text-theme-text-secondary text-lg">
            Appuyez pour initialiser le déploiement
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center py-10 relative">
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