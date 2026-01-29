"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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

interface TerminalLine {
  id: string;
  text: string;
  isGlitching: boolean;
  isEliminating: boolean;
}

const GlitchyText = ({ text, isGlitching }: { text: string; isGlitching: boolean }) => {
  if (!isGlitching) return <span>{text}</span>;

  return (
    <>
      {text.split('').map((char, i) => {
        const shouldGlitch = Math.random() > 0.7;
        return (
          <span 
            key={i} 
            className={cn(shouldGlitch && "text-orange-500 animate-pulse font-bold")}
          >
            {char}
          </span>
        );
      })}
    </>
  );
};

const AppStoppedScreen = () => {
  const { startApp } = useAppStatus();
  const [step, setStep] = useState<TransitionState>('idle');
  const [terminalText, setTerminalText] = useState('');
  const [decodingBoxes, setDecodingBoxes] = useState<DecodingBox[]>([]);
  const [activeLines, setActiveLines] = useState<TerminalLine[]>([]);
  
  const textToType = useMemo(() => `> BREACH DETECTED...
> CORE OVERRIDE INITIATED...
> REDACTING SECURITY PROTOCOLS...
> INJECTING MALWARE... 100%
> BYPASSING KERNEL LOCK...
> ACCESS GRANTED.
> RUNNING EXPLOIT: CVE-2024-8842...
> STACK OVERFLOW AT 0x7FFF5FBFF... [SUCCESS]
> HEAP SPRAYING: 2048MB... [STABLE]
> PRIVILEGE ESCALATION: ROOT... [ACTIVE]
> DELETING /VAR/LOGS/*... [COMPLETE]
> DISABLING UFW FIREWALL... [SUCCESS]
> ENCRYPTING MFT DATA... 100%
> DOWNLOADING CORE_OS_DUMP...
> OVERWRITING BOOT_SECTOR 0... [DONE]
> FATAL SYSTEM ERROR 0x000000F4... [BYPASSED]
> MALICIOUS SHELL V4.2 INJECTED...
> SYSCALL HOOKING: ALL_ENTRIES...
> KERNEL_PANIC_TIMER: DISABLED
> PERSISTENCE: REBOOT_PROTECTED
> SYSTEM COMPROMISED.
> EXTRACTING RSA PRIVATE KEYS...
> DECRYPTING DATABASE SHARDS...
> SPOOFING ADMIN CREDENTIALS...
> REDIRECTING TRAFFIC TO DARK_NODE...
> WIPING BIOS PERSISTENCE...
> INJECTING BOOTKIT STAGE 2...
> CLONING ENCRYPTED VOLUMES...
> BYPASSING 2FA AUTHENTICATION...
> DISABLING ANTIVIRUS DAEMON...
> ESCALATING TO RING-0...
> OVERWRITING CMOS RAM...
> MASKING NETWORK FOOTPRINTS...
> ESTABLISHING REVERSE SHELL...
> BRUTEFORCING ROOT PASSWORD...
> DOWNLOADING SYSTEM_SOURCE.ZIP...
> UPLOADING RANSOMWARE PAYLOAD...
> DISCONNECTING SECURITY BACKUPS...
> CORRUPTING RAID CONTROLLER...
> HIJACKING SSH AGENT...
> SNIFFING KERNEL PACKETS...
> INJECTING PERSISTENT BACKDOOR...
> BYPASSING BIOS LOCK...
> WIPING /ETC/SHADOW...
> ACCESSING PROTECTED MEMORY...
> OVERRIDING FAN CONTROL...
> OVERCLOCKING CPU TO 6.2GHZ...
> VOLTAGE LIMITS BYPASSED...
> HARDWARE STRESS TEST INITIATED...
> SCRAPING BROWSER COOKIES...
> INFILTRATING LOCAL NETWORK...
> CRACKING NTLM HASHES...
> BYPASSING UEFI SECURE BOOT...
> INJECTING SMM PAYLOAD...
> DISABLING HARDWARE WATCHDOG...
> ACCESSING TPM SECRETS...
> DECODING ENCRYPTED COMM...
> ESTABLISHING SATELLITE LINK...
> OVERRIDING LOGICAL VOLUMES...
> WIPING SYSTEM RECOVERY...
> INJECTING FIRMWARE ROOTKIT...
> ACCESSING GPU SHADERS...
> REDIRECTING SYSTEM SYSCALLS...
> DISABLING THERMAL THROTTLING...
> SYSTEM CORE TEMPERATURE RISING...
> STRESSING VOLTAGE REGULATORS...
> CRITICAL SYSTEM BREACH CONFIRMED.
> INITIALIZING FINAL PAYLOAD...`, []);

  const typedText = useTypewriter(terminalText, 10);

  // Synchronisation des lignes actives avec le texte tapé
  useEffect(() => {
    const rawLines = typedText.split('\n');
    setActiveLines(prev => {
      // On garde les lignes déjà existantes qui ne sont pas en cours d'élimination
      const existing = prev.filter(l => !l.isEliminating);
      
      // On ajoute les nouvelles lignes détectées
      const newLines: TerminalLine[] = [];
      rawLines.forEach((text, i) => {
        const id = `line-${i}`;
        if (!existing.find(l => l.id === id)) {
          newLines.push({ id, text, isGlitching: false, isEliminating: false });
        } else {
          // Mise à jour du texte pour la ligne en cours de frappe
          const idx = existing.findIndex(l => l.id === id);
          if (idx !== -1) existing[idx].text = text;
        }
      });

      return [...existing, ...newLines];
    });
  }, [typedText]);

  // Logique d'élimination aléatoire
  useEffect(() => {
    if (step === 'idle' || step === 'morphing' || step === 'flash') return;

    const interval = setInterval(() => {
      setActiveLines(prev => {
        // Ne touche pas à la dernière ligne (en cours de frappe) et seulement si on a assez de lignes
        if (prev.length < 5) return prev;
        
        const candidates = prev.filter(l => !l.isGlitching && !l.isEliminating && l !== prev[prev.length - 1]);
        if (candidates.length === 0) return prev;

        // Probabilité d'élimination pour éviter de tout vider d'un coup
        if (Math.random() > 0.4) return prev;

        const target = candidates[Math.floor(Math.random() * candidates.length)];
        
        return prev.map(l => l.id === target.id ? { ...l, isGlitching: true } : l);
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [step]);

  // Cycle de vie d'une ligne glitchée
  useEffect(() => {
    const glitching = activeLines.find(l => l.isGlitching && !l.isEliminating);
    if (glitching) {
      const timer = setTimeout(() => {
        setActiveLines(prev => prev.map(l => l.id === glitching.id ? { ...l, isEliminating: true } : l));
        
        // Suppression définitive après le flash blanc (1s)
        setTimeout(() => {
          setActiveLines(prev => prev.filter(l => l.id !== glitching.id));
        }, 1000);
      }, 800); // 0.8s de glitch orange avant le flash

      return () => clearTimeout(timer);
    }
  }, [activeLines]);

  useEffect(() => {
    if (step === 'box-active' || step === 'struggling' || step === 'hex-infiltrating') {
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
    
    setTimeout(() => {
      setStep('hex-infiltrating');
      setTerminalText(textToType);
    }, 5000); 
    
    setTimeout(() => setStep('struggling'), 9000);
    setTimeout(() => setStep('box-active'), 13000);
    
    setTimeout(() => setStep('flash'), 19000);
    setTimeout(() => startApp(), 20000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary p-4 overflow-hidden relative">
      
      <div className={cn(
        "fixed inset-0 transition-opacity duration-1000 pointer-events-none z-0",
        step === 'idle' ? "opacity-30" : "opacity-100"
      )}>
        <NeuralHexNetwork 
          redHexActive={step !== 'idle' && step !== 'morphing'} 
        />
      </div>

      {step === 'flash' && (
        <div className="fixed inset-0 z-50 animate-final-flash pointer-events-none" />
      )}

      {step !== 'idle' && step !== 'morphing' && step !== 'flash' && (
        <div className="absolute inset-0 z-30 pointer-events-none overflow-y-auto pt-20 pb-20">
          <div className="flex justify-center items-start min-h-full">
            <div className="relative left-[150px]">
              <div 
                className={cn(
                  "w-[350px] p-4 border-2 border-red-500 bg-red-950/70 backdrop-blur-2xl shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all duration-500 relative z-10 animate-box-reveal h-auto"
                )}
              >
                <div className="flex items-center justify-between mb-2 border-b border-red-500/30 pb-1">
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-led-blink-red" />
                    Aggressive Breach Active
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-led-blink-red" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-red-800 animate-led-blink-red" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
                <div className="text-[10px] font-mono text-red-400 leading-relaxed overflow-hidden flex flex-col">
                  {activeLines.map((line) => (
                    <div 
                      key={line.id} 
                      className={cn(
                        "transition-all duration-300",
                        line.isEliminating && "animate-line-eliminate"
                      )}
                    >
                      <GlitchyText text={line.text} isGlitching={line.isGlitching} />
                    </div>
                  ))}
                  <span className="typewriter-cursor" />
                </div>
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
          </div>
        </div>
      )}

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