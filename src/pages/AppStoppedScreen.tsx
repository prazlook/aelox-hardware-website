"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Power } from 'lucide-react';
import { useAppStatus } from '@/context/AppStatusContext';
import HoneycombButton, { HexagonIcon } from '@/components/HoneycombButton';
import { NeuralHexNetwork } from '@/components/NeuralHexNetwork';
import { useTypewriter } from '@/hooks/useTypewriter';
import { cn } from '@/lib/utils';

type TransitionState = 'idle' | 'morphing' | 'fighting' | 'locking' | 'flash';

const AppStoppedScreen = () => {
  const { startApp } = useAppStatus();
  const [step, setStep] = useState<TransitionState>('idle');
  const [redHexPos, setRedHexPos] = useState({ x: 0, y: 0 });
  const [terminalBoxPos, setTerminalBoxPos] = useState({ x: 0, y: 0 });
  const [terminalText, setTerminalText] = useState('');
  
  const boxRef = useRef<HTMLDivElement>(null);
  
  const textToType = "> PROTOCOL BREACH DETECTED...\n> AGENT_RED IDENTIFIED.\n> ATTEMPTING CONTAINMENT...\n> REPELLING HOSTILE NODE...\n> TARGET ACQUIRED.\n> LOCKING DOWN SYSTEM.";
  const typedText = useTypewriter(terminalText, 20);

  // Update terminal box position for the network physics
  useEffect(() => {
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      setTerminalBoxPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    }
  }, [step]);

  const handleStart = () => {
    setStep('morphing');
    
    // Début de la séquence longue
    setTimeout(() => {
      setStep('fighting');
      setTerminalText(textToType);
    }, 1500);

    // Phase de verrouillage (viseur)
    setTimeout(() => {
      setStep('locking');
    }, 7000);

    // Flash final
    setTimeout(() => {
      setStep('flash');
    }, 9500);

    // Lancement de l'app
    setTimeout(() => {
      startApp();
    }, 10000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary p-4 overflow-hidden relative">
      
      {/* Réseau de fond réactif */}
      <div className={cn(
        "fixed inset-0 transition-opacity duration-1000 z-0",
        step === 'idle' ? "opacity-0" : "opacity-100"
      )}>
        <NeuralHexNetwork 
          redHexActive={step !== 'idle' && step !== 'morphing'} 
          terminalBoxPos={terminalBoxPos}
          onRedHexPos={setRedHexPos}
        />
      </div>

      {/* L'éclair blanc final */}
      {step === 'flash' && (
        <div className="fixed inset-0 z-50 animate-final-flash pointer-events-none" />
      )}

      {/* Viseur de verrouillage */}
      {step === 'locking' && (
        <div 
          className="absolute z-40 pointer-events-none transition-all duration-300 ease-out animate-target-lock"
          style={{ 
            left: redHexPos.x, 
            top: redHexPos.y, 
            transform: 'translate(-50%, -50%)' 
          }}
        >
          <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-red-500 animate-target-bracket-in" style={{ '--tx': '-40px', '--ty': '-40px' } as any} />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-red-500 animate-target-bracket-in" style={{ '--tx': '40px', '--ty': '-40px' } as any} />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-red-500 animate-target-bracket-in" style={{ '--tx': '-40px', '--ty': '40px' } as any} />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-red-500 animate-target-bracket-in" style={{ '--tx': '40px', '--ty': '40px' } as any} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-red-500 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Séquence de combat visuelle */}
      {(step === 'fighting' || step === 'locking') && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg className="w-full h-full" viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}>
            {/* Ligne de connexion dynamique qui suit l'hexagone rouge */}
            <path
              d={`M ${redHexPos.x} ${redHexPos.y} L ${terminalBoxPos.x - 160} ${terminalBoxPos.y}`}
              stroke="#ef4444"
              strokeWidth="2"
              fill="none"
              className="animate-red-line-draw"
              filter="drop-shadow(0 0 5px red)"
            />
          </svg>

          {/* Boîte de terminal */}
          <div 
            ref={boxRef}
            className="absolute top-1/2 left-[70%] -translate-y-1/2 w-80 p-4 border-2 border-red-500 bg-red-950/40 backdrop-blur-md animate-box-reveal shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          >
            <div className="flex items-center justify-between mb-2 border-b border-red-500/30 pb-1">
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">Breach Monitor v2.0</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
              </div>
            </div>
            <pre className="text-xs font-mono text-red-400 whitespace-pre-wrap leading-relaxed typewriter-cursor">
              {typedText}
            </pre>
          </div>
        </div>
      )}

      <div className={cn(
        "text-center space-y-8 max-w-md w-full transition-opacity duration-500",
        step !== 'idle' && "opacity-0 pointer-events-none"
      )}>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            Aelox Core
          </h1>
          <p className="text-theme-text-secondary text-lg">
            Initialisation du protocole de sécurité
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