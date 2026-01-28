"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Power, Target } from 'lucide-react';
import { useAppStatus } from '@/context/AppStatusContext';
import HoneycombButton from '@/components/HoneycombButton';
import { NeuralHexNetwork } from '@/components/NeuralHexNetwork';
import { useTypewriter } from '@/hooks/useTypewriter';
import { cn } from '@/lib/utils';

type TransitionState = 'idle' | 'morphing' | 'rogue-entry' | 'fighting' | 'locking' | 'flash';

const AppStoppedScreen = () => {
  const { startApp } = useAppStatus();
  const [step, setStep] = useState<TransitionState>('idle');
  const [roguePos, setRoguePos] = useState({ x: 0, y: 0 });
  const [terminalText, setTerminalText] = useState('');
  
  const boxPos = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.3 };
  
  const textToType = "> TARGET ACQUIRED: ROGUE_NODE_01\n> ANALYZING VECTOR PATH...\n> DEPLOYING CONTAINMENT UNIT...\n> SHIELD INTERFERENCE DETECTED.\n> FORCE_LOCK INITIATED...";
  const typedText = useTypewriter(terminalText, 25);

  const handleStart = () => {
    setStep('morphing');
    
    // TIMELINE CINÉMATIQUE
    setTimeout(() => setStep('rogue-entry'), 1200); // L'hexagone rouge apparaît
    setTimeout(() => {
      setStep('fighting'); // La boîte apparaît et le combat commence
      setTerminalText(textToType);
    }, 3000);
    setTimeout(() => setStep('locking'), 7000); // Le viseur se dessine et lock
    setTimeout(() => setStep('flash'), 9500); // Éclair final
    setTimeout(() => startApp(), 10000); // Dashboard
  };

  const handleRoguePosUpdate = useCallback((pos: { x: number; y: number }) => {
    setRoguePos(pos);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary p-4 overflow-hidden relative">
      
      {/* Réseau Neural avec physique spéciale */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <NeuralHexNetwork 
          rogueActive={step !== 'idle' && step !== 'morphing'} 
          boxPos={step === 'fighting' || step === 'locking' ? boxPos : null}
          onRoguePos={handleRoguePosUpdate}
          lockingActive={step === 'locking'}
        />
      </div>

      {/* Éclair final */}
      {step === 'flash' && (
        <div className="fixed inset-0 z-50 animate-final-flash pointer-events-none" />
      )}

      {/* Viseur UI (Crosshair) */}
      {step === 'locking' && (
        <div 
          className="absolute z-40 pointer-events-none transition-all duration-75"
          style={{ left: roguePos.x, top: roguePos.y, transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative w-24 h-24 flex items-center justify-center animate-crosshair-lock">
            <svg className="w-full h-full text-red-500 animate-crosshair-draw" viewBox="0 0 100 100">
              <path d="M 10 50 L 30 50 M 70 50 L 90 50 M 50 10 L 50 30 M 50 70 L 50 90" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="5 5" />
            </svg>
            <div className="absolute text-[10px] font-mono text-red-500 top-0 right-0 bg-red-500/10 px-1">LOCKING...</div>
          </div>
        </div>
      )}

      {/* Boîte de terminal futuriste */}
      {(step === 'fighting' || step === 'locking') && (
        <div 
          className="absolute z-30 w-80 p-4 border-2 border-red-500 bg-red-950/40 backdrop-blur-md animate-box-reveal shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          style={{ left: boxPos.x, top: boxPos.y, transform: 'translate(-50%, -50%)' }}
        >
          <div className="flex items-center justify-between mb-2 border-b border-red-500/30 pb-1">
            <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">System Monitor</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
            </div>
          </div>
          <pre className="text-xs font-mono text-red-400 whitespace-pre-wrap leading-relaxed typewriter-cursor">
            {typedText}
          </pre>
        </div>
      )}

      <div className={cn(
        "text-center space-y-8 max-w-md w-full transition-opacity duration-500 relative z-10",
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