import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ASICStatusCard, ASIC, ASICStatus } from "@/components/ASICStatusCard";
import { Header } from "@/components/Header";
import { ECGBackground } from "@/components/ECGBackground";
import { ParticleSystem, ParticleSystemRef } from '@/components/ParticleSystem';

const initialAsics: ASIC[] = [
  { id: 'asic-1', name: 'Antminer S19j Pro', model: 'S19j Pro', status: 'online', hashrate: 104.5, temperature: 68, power: 3050, fanSpeed: 80, isFanOn: true },
  { id: 'asic-2', name: 'Whatsminer M30S++', model: 'M30S++', status: 'online', hashrate: 112.1, temperature: 72, power: 3472, fanSpeed: 85, isFanOn: true },
  { id: 'asic-3', name: 'Canaan AvalonMiner 1246', model: '1246', status: 'offline', hashrate: 0, temperature: 25, power: 0, fanSpeed: 0, isFanOn: false },
  { id: 'asic-4', name: 'Antminer S19 XP', model: 'S19 XP', status: 'online', hashrate: 140.0, temperature: 75, power: 3010, fanSpeed: 90, isFanOn: true },
  { id: 'asic-5', name: 'Whatsminer M50', model: 'M50', status: 'error', hashrate: 118.0, temperature: 88, power: 3306, fanSpeed: 100, isFanOn: true },
  { id: 'asic-6', name: 'Antminer L7', model: 'L7', status: 'booting up', hashrate: 10, temperature: 30, power: 500, fanSpeed: 20, isFanOn: true },
];

const MAX_TEMP = 85;

export default function Index() {
  const [asics, setAsics] = useState<ASIC[]>(initialAsics);
  const particleSystemRef = useRef<ParticleSystemRef>(null);
  const asicCardRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const [glowTriggers, setGlowTriggers] = useState<Record<string, number>>({});

  const handleTogglePower = (asicId: string) => {
    setAsics(prevAsics => prevAsics.map(asic => {
      if (asic.id === asicId) {
        const isTurningOn = asic.status === 'offline';
        return { ...asic, status: isTurningOn ? 'booting up' : 'shutting down' };
      }
      return asic;
    }));
  };

  const handleToggleFan = (asicId: string) => {
    setAsics(prevAsics => prevAsics.map(asic =>
      asic.id === asicId ? { ...asic, isFanOn: !asic.isFanOn } : asic
    ));
  };

  const handleToggleOverclock = (asicId: string) => {
    setAsics(prevAsics => prevAsics.map(asic => {
      if (asic.id === asicId) {
        if (asic.status === 'overclocked') {
          return { ...asic, status: 'online', hashrate: asic.hashrate / 1.2, power: asic.power / 1.15 };
        } else if (asic.status === 'online') {
          return { ...asic, status: 'overclocked', hashrate: asic.hashrate * 1.2, power: asic.power * 1.15 };
        }
      }
      return asic;
    }));
  };

  const handlePowerAction = (asicId: string, action: 'idle' | 'stop' | 'reboot' | 'standby' | 'force-stop') => {
    setAsics(prevAsics => prevAsics.map(asic => {
      if (asic.id === asicId) {
        switch (action) {
          case 'idle': return { ...asic, status: 'idle' };
          case 'standby': return { ...asic, status: 'standby' };
          case 'stop': return { ...asic, status: 'shutting down' };
          case 'reboot': return { ...asic, status: 'shutting down' };
          case 'force-stop': return { ...asic, status: 'offline', isForceStopping: true };
          default: return asic;
        }
      }
      return asic;
    }));
  };

  const handleStartAll = () => {
    setAsics(prevAsics => prevAsics.map(asic => asic.status === 'offline' ? { ...asic, status: 'booting up' } : asic));
  };

  const handleStopAll = () => {
    setAsics(prevAsics => prevAsics.map(asic => (asic.status !== 'offline' && asic.status !== 'shutting down') ? { ...asic, status: 'shutting down' } : asic));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAsics(prevAsics => prevAsics.map(asic => {
        let newStatus: ASICStatus = asic.status;
        let newTemp = asic.temperature;
        let newHashrate = asic.hashrate;

        if (asic.status === 'booting up') {
          newTemp += 5;
          if (newTemp >= 65) {
            newStatus = 'online';
            newTemp = 65;
          }
        } else if (asic.status === 'shutting down') {
          newTemp -= 5;
          if (newTemp <= 30) {
            newStatus = 'offline';
            newTemp = 25;
          }
        } else if (asic.status === 'online' || asic.status === 'overclocked') {
          newTemp += (Math.random() - 0.5) * 2;
          newHashrate += (Math.random() - 0.5) * 0.5;
          if (newTemp > MAX_TEMP) newStatus = 'overheat';
        } else if (asic.status === 'overheat') {
          newTemp += 0.5;
        }

        if (asic.isForceStopping) {
          return { ...asic, status: 'offline', temperature: 25, hashrate: 0, power: 0, isForceStopping: false };
        }

        return { ...asic, status: newStatus, temperature: Math.max(25, Math.min(100, newTemp)), hashrate: Math.max(0, newHashrate) };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const overclockedCount = asics.filter(a => a.status === 'overclocked').length;
  const overclockPercentage = asics.length > 0 ? (overclockedCount / asics.length) * 100 : 0;
  const isOverclockThresholdMet = overclockPercentage > 70;

  const handleEcgPeak = useCallback(() => {
    const overclockedAsics = asics.filter(a => a.status === 'overclocked');
    if (overclockedAsics.length === 0) return;

    const targetAsic = overclockedAsics[Math.floor(Math.random() * overclockedAsics.length)];
    const targetElement = asicCardRefs.current.get(targetAsic.id);

    if (targetElement && particleSystemRef.current) {
      const rect = targetElement.getBoundingClientRect();
      const startX = window.innerWidth * 0.25;
      const startY = 120;
      const endX = rect.left + rect.width / 2;
      const endY = rect.top + rect.height / 2;
      particleSystemRef.current.createParticle(startX, startY, endX, endY, targetAsic.id);
    }
  }, [asics]);

  const handleParticleLand = useCallback((asicId: string) => {
    setGlowTriggers(prev => ({ ...prev, [asicId]: Date.now() }));
  }, []);

  return (
    <div className="min-h-screen bg-theme-background text-white font-sans">
      <ParticleSystem ref={particleSystemRef} onParticleLand={handleParticleLand} />
      <Header />
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Centre de Contrôle</h1>
          <div className="flex space-x-3">
            <Button onClick={handleStartAll} className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
              Démarrer Tout
            </Button>
            <Button onClick={handleStopAll} className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
              Arrêter Tout
            </Button>
          </div>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="absolute inset-x-0 top-[-100px] h-[250px] z-0">
            <ECGBackground onPeak={isOverclockThresholdMet ? handleEcgPeak : undefined} />
          </div>
          {asics.map(asic => (
            <div key={asic.id} ref={el => asicCardRefs.current.set(asic.id, el)} className="relative z-10">
              <ASICStatusCard
                asic={asic}
                maxTemp={MAX_TEMP}
                onTogglePower={handleTogglePower}
                onToggleFan={handleToggleFan}
                onToggleOverclock={handleToggleOverclock}
                onPowerAction={handlePowerAction}
                triggerGlow={glowTriggers[asic.id]}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}