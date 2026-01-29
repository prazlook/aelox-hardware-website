"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Power, LayoutDashboard } from 'lucide-react';
import { useAppStatus } from '@/context/AppStatusContext';
import HoneycombButton from '@/components/HoneycombButton';
import { NeuralHexNetwork } from '@/components/NeuralHexNetwork';
import { useTypewriter } from '@/hooks/useTypewriter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

type TransitionState = 'idle' | 'morphing' | 'hex-infiltrating' | 'struggling' | 'box-active' | 'flash' | 'complete';

interface DecodingBox {
  id: number;
  x: number;
  y: number;
  content: string;
}

const HomePage = () => {
  const { startApp, isAppRunning } = useAppStatus();
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
    setTimeout(() => setStep('hex-infiltrating'), 1000);
    setTimeout(() => setStep('struggling'), 3000);
    setTimeout(() => {
      setStep('box-active');
      setTerminalText(textToType);
    }, 6000);
    setTimeout(() => setStep('flash'), 12000);
    setTimeout(() => {
      startApp();
      setStep('complete');
    }, 13000);
  };

  // Si l'application est déjà lancée, on affiche une version simplifiée de l'accueil
  if (isAppRunning && step !== 'complete' && step !== 'flash') {
    return (
      <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center p-4">
        <div className="fixed inset-0 opacity-20 pointer-events-none">
          <NeuralHexNetwork />
        </div>
        <h1 className="text-5xl font-bold tracking-tighter text-white mb-6">
          Aelox <span className="text-theme-cyan">Core</span>
        </h1>
        <p className="text-lg text-theme-text-secondary max-w-md mb-10">
          Le système est opérationnel. Accédez aux modules de contrôle via le tableau de bord.
        </p>
        <Button asChild size="lg" className="bg-theme-cyan text-black hover:bg-theme-cyan/90 rounded-xl px-8 py-6 text-lg">
          <Link to="/dashboard">
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Tableau de Bord
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary overflow-hidden z-[100]">
      <div className={cn(
        "absolute inset-0 transition-opacity duration-1000 pointer-events-none",
        step === 'idle' ? "opacity-0" : "opacity-100"
      )}>
        <NeuralHexNetwork 
          redHexActive={step !== 'idle' && step !== 'morphing'} 
          onRedHexPos={handleRedHexPos}
        />
      </div>

      {step === 'flash' && (
        <div className="fixed inset-0 z-[200] animate-final-flash pointer-events-none" />
      )}

      {(step === 'box-active' || step === 'struggling') && (
        <div className="absolute inset-0 z-[110] pointer-events-none">
          <svg className="w-full h-full">
            <path
              d={`M ${redHexPos.x} ${redHexPos.y} L ${anchorPos.x} ${anchorPos.y}`}
              stroke="#ef4444"
              strokeWidth="2"
              fill="none"
              className="animate-red-line-draw"
              filter="drop-shadow(0 0 15px red)"
            />
          </svg>

          <div className="absolute top-[20%] left-[calc(50%+100px)]">
            <div 
              ref={boxRef}
              className={cn(
                "w-72 p-4 border-2 border-red-500 bg-red-950/70 backdrop-blur-2xl shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all duration-500",
                step === 'box-active' ? "animate-box-reveal" : ""
              )}
            >
              <div className="flex items-center justify-between mb-2 border-b border-red-500/30 pb-1">
                <span className="text-[10px] font-mono text-red-400 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Core Breach
                </span>
              </div>
              <pre className="text-[11px] font-mono text-red-400 whitespace-pre-wrap leading-relaxed min-h-[100px]">
                {step === 'box-active' ? typedText : "> ERROR: SECURITY BUFFER...\n> RETRYING..."}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className={cn(
        "text-center space-y-6 max-w-md w-full transition-all duration-500 z-[120]",
        step !== 'idle' && "opacity-0 scale-95 pointer-events-none"
      )}>
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            Aelox Core
          </h1>
          <p className="text-theme-text-secondary text-lg">
            Initialisez la séquence de déploiement
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center py-10 relative z-[120]">
        <HoneycombButton
          onClick={handleStart}
          isClicked={step !== 'idle'}
          aria-label="Initialiser le Core"
        >
          <Power className="w-8 h-8" />
          <span className="font-bold tracking-widest uppercase text-sm">Initialiser</span>
        </HoneycombButton>
      </div>
    </div>
  );
};

export default HomePage;