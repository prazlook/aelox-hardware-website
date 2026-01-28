"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Power } from 'lucide-react';
import { useAppStatus } from '@/context/AppStatusContext';
import HoneycombButton, { HexagonIcon } from '@/components/HoneycombButton';
import { NeuralHexNetwork, NeuralHexNetworkRef } from '@/components/NeuralHexNetwork';
import { useTypewriter } from '@/hooks/useTypewriter';
import { cn } from '@/lib/utils';

type TransitionState = 'idle' | 'morphing' | 'searching' | 'locating' | 'battling' | 'locking' | 'flash' | 'complete';

const AppStoppedScreen = () => {
  const { startApp } = useAppStatus();
  const [step, setStep] = useState<TransitionState>('idle');
  const [terminalText, setTerminalText] = useState('');
  const [redHexPos, setRedHexPos] = useState<{ x: number; y: number } | null>(null);
  const networkRef = useRef<NeuralHexNetworkRef>(null);
  
  const textToType = "> TARGET ACQUIRED: HEX_NODE_X09\n> ESTABLISHING SYNC...\n> WARNING: ANOMALY DETECTED\n> ATTEMPTING FORCE OVERRIDE...\n> LOCKING COORDINATES...";
  const typedText = useTypewriter(terminalText, 25);

  // Mise à jour de la position de l'hexagone rouge en temps réel
  useEffect(() => {
    let frame: number;
    const updatePos = () => {
      if (networkRef.current && (step === 'locating' || step === 'battling' || step === 'locking')) {
        const pos = networkRef.current.getRedHexPos();
        if (pos) setRedHexPos(pos);
      }
      frame = requestAnimationFrame(updatePos);
    };
    frame = requestAnimationFrame(updatePos);
    return () => cancelAnimationFrame(frame);
  }, [step]);

  const handleStart = () => {
    setStep('morphing');
    
    // Nouvelle séquence allongée et cinématique
    setTimeout(() => setStep('searching'), 1500);
    setTimeout(() => {
      setStep('locating');
      setTerminalText(textToType);
    }, 3000);
    setTimeout(() => setStep('battling'), 5000);
    setTimeout(() => setStep('locking'), 8000);
    setTimeout(() => setStep('flash'), 10500);
    setTimeout(() => startApp(), 11000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary p-4 overflow-hidden relative">
      
      {/* Réseau neuronal en fond, activé si transition */}
      <div className="fixed inset-0 z-0">
        <NeuralHexNetwork 
          ref={networkRef} 
          isTransitioning={step !== 'idle'} 
        />
      </div>

      {/* L'éclair blanc final */}
      {step === 'flash' && (
        <div className="fixed inset-0 z-50 animate-final-flash pointer-events-none" />
      )}

      {/* Interface de combat dynamique (SVG Overlay) */}
      {(step === 'locating' || step === 'battling' || step === 'locking') && redHexPos && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg className="w-full h-full">
            {/* Ligne de connexion dynamique qui suit l'hexagone */}
            <path
              d={`M 550 200 L 550 300 L ${redHexPos.x} ${redHexPos.y}`}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="4,4"
              fill="none"
              className={cn(step === 'battling' ? "animate-pulse" : "")}
              filter="drop-shadow(0 0 10px red)"
            />

            {/* Viseur (Reticle) - Apparaît au moment du Lock */}
            {step === 'locking' && (
              <g transform={`translate(${redHexPos.x - 40}, ${redHexPos.y - 40})`}>
                <circle cx="40" cy="40" r="30" stroke="#ef4444" strokeWidth="1" fill="none" strokeDasharray="5,5" className="animate-spin" />
                <path d="M 0 40 L 20 40 M 60 40 L 80 40 M 40 0 L 40 20 M 40 60 L 40 80" stroke="#ef4444" strokeWidth="2" />
                <rect x="0" y="0" width="80" height="80" stroke="#ef4444" strokeWidth="2" fill="none" className="animate-reticle-draw animate-reticle-lock" />
                <text x="45" y="-10" fill="#ef4444" className="text-[10px] font-mono font-bold">LOCK_ON</text>
              </g>
            )}
          </svg>

          {/* Boîte de terminal rouge (Position fixe par rapport à la ligne) */}
          <div className="absolute top-[120px] left-[550px] w-80 p-4 border-2 border-red-500 bg-red-950/60 backdrop-blur-md animate-box-reveal shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <div className="flex items-center justify-between mb-2 border-b border-red-500/30 pb-1">
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">Neural Override</span>
              <div className="flex gap-1">
                <div className={cn("w-1.5 h-1.5 rounded-full", step === 'battling' ? "bg-white animate-pulse" : "bg-red-500")} />
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
              </div>
            </div>
            <pre className="text-xs font-mono text-red-400 whitespace-pre-wrap leading-relaxed typewriter-cursor">
              {typedText}
            </pre>
            {step === 'locking' && (
              <div className="mt-4 bg-red-500 text-black text-[10px] font-bold py-1 text-center animate-pulse">
                SYNC_COMPLETE: 100%
              </div>
            )}
          </div>
        </div>
      )}

      <div className={cn(
        "text-center space-y-8 max-w-md w-full transition-opacity duration-1000 z-10",
        step !== 'idle' && "opacity-0 pointer-events-none"
      )}>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            Système en Veille
          </h1>
          <p className="text-theme-text-secondary text-lg">
            Initialiser le déploiement neuronal
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
          <span className="font-bold tracking-widest uppercase text-sm">Déployer</span>
        </HoneycombButton>
      </div>
    </div>
  );
};

export default AppStoppedScreen;