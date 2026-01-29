"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Power } from 'lucide-react';
import { useAppStatus } from '@/context/AppStatusContext';
import HoneycombButton from '@/components/HoneycombButton';
import { NeuralHexNetwork } from '@/components/NeuralHexNetwork';
import { useTypewriter } from '@/hooks/useTypewriter';
import { cn } from '@/lib/utils';

type TransitionState = 'idle' | 'morphing' | 'hex-infiltrating' | 'struggling' | 'box-active' | 'flash' | 'complete';

interface DecodingBox {
  id: number;
  x: number;
  y: number;
  content: string;
}

const AppStoppedScreen = () => {
  const { startApp } = useAppStatus();
  const [step, setStep] = useState<TransitionState>('idle');
  const [redHexPos, setRedHexPos] = useState({ x: 0, y: 0 });
  const [terminalText, setTerminalText] = useState('');
  const [decodingBoxes, setDecodingBoxes] = useState<DecodingBox[]>([]);
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 });
  
  const boxRef = useRef<HTMLDivElement>(null);
  const textToType = "> BREACH DETECTED...\n> CORE OVERRIDE INITIATED...\n> REDACTING SECURITY PROTOCOLS...\n> INJECTING MALWARE... 100%\n> BYPASSING KERNEL LOCK...\n> ACCESS GRANTED.";
  const typedText = useTypewriter(terminalText, 30);

  const handleRedHexPos = useCallback((pos: { x: number, y: number }) => {
    setRedHexPos(pos);
  }, []);

  useEffect(() => {
    if (step === 'struggling' || step === 'box-active') {
      const updateAnchor = () => {
        if (boxRef.current) {
          const rect = boxRef.current.getBoundingClientRect();
          setAnchorPos({ x: rect.left, y: rect.top });
        }
        requestAnimationFrame(updateAnchor);
      };
      const animId = requestAnimationFrame(updateAnchor);
      return () => cancelAnimationFrame(animId);
    }
  }, [step]);

  useEffect(() => {
    if (step === 'struggling' || step === 'box-active') {
      const interval = setInterval(() => {
        const id = Math.random();
        const newBox: DecodingBox = {
          id,
          x: (Math.random() - 0.5) * 400,
          y: (Math.random() - 0.5) * 300,
          content: `0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}`
        };
        setDecodingBoxes(prev => [...prev, newBox]);
        
        setTimeout(() => {
          setDecodingBoxes(prev => prev.filter(b => b.id !== id));
        }, 1000);
      }, 300);

      return () => clearInterval(interval);
    }
  }, [step]);

  const handleStart = () => {
    setStep('morphing');
    
    // Séquence temporelle raccourcie
    setTimeout(() => setStep('hex-infiltrating'), 1000);
    setTimeout(() => setStep('struggling'), 3000);
    
    setTimeout(() => {
      setStep('box-active');
      setTerminalText(textToType);
    }, 10000); // Déclenchement du terminal après 10s au lieu de 25s
    
    setTimeout(() => setStep('flash'), 18000); // Flash à 18s au lieu de 45s
    setTimeout(() => startApp(), 19000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary p-4 overflow-hidden relative">
      
      <div className={cn(
        "fixed inset-0 transition-opacity duration-1000 pointer-events-none z-0",
        step === 'idle' ? "opacity-0" : "opacity-100"
      )}>
        <NeuralHexNetwork 
          redHexActive={step !== 'idle' && step !== 'morphing'} 
          onRedHexPos={handleRedHexPos}
        />
      </div>

      {step === 'flash' && (
        <div className="fixed inset-0 z-50 animate-final-flash pointer-events-none" />
      )}

      {(step === 'box-active' || step === 'struggling') && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg className="w-full h-full" viewBox={`0 0 ${typeof window !== 'undefined' ? window.innerWidth : 1920} ${typeof window !== 'undefined' ? window.innerHeight : 1080}`}>
            <path
              d={`M ${redHexPos.x} ${redHexPos.y} L ${anchorPos.x} ${anchorPos.y}`}
              stroke="#ef4444"
              strokeWidth="2"
              fill="none"
              className="animate-red-line-draw"
              filter="drop-shadow(0 0 15px red)"
            />
          </svg>

          <div className="absolute top-[20%] left-[calc(50%+150px)]">
            <div 
              ref={boxRef}
              className={cn(
                "w-80 p-4 border-2 border-red-500 bg-red-950/70 backdrop-blur-2xl shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all duration-500 relative z-10",
                step === 'box-active' ? "animate-box-reveal" : ""
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
            </div>

            {decodingBoxes.map(box => (
              <div
                key={box.id}
                className="absolute w-20 p-1 border border-red-500 bg-red-900/80 text-[8px] font-mono text-red-200 animate-decoding flex items-center justify-center backdrop-blur-sm shadow-lg z-20"
                style={{
                  left: box.x,
                  top: box.y,
                }}
              >
                {box.content}
              </div>
            ))}
          </div>

          {step === 'struggling' && (
            <div className="absolute top-[50%] left-[calc(50%+150px)] w-80 mt-4 text-[10px] text-red-500 animate-pulse font-bold text-center">
              SYSTEM UNDER ATTACK
            </div>
          )}
        </div>
      )}

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