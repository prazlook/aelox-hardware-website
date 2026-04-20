import { useState, useEffect, useMemo, useRef } from 'react';
import { ASICStatusCard, ASIC } from '@/components/ASICStatusCard';
import { Button } from '@/components/ui/button';
import { Power, X } from 'lucide-react';
import { useSound } from '@/context/SoundContext';
import { useAsics } from '@/context/AsicContext';
import { showError, showSuccess } from '@/utils/toast';
import { useDevOptions } from '@/context/DevOptionsContext';
import { useAppStatus } from '@/context/AppStatusContext';
import { cn } from '@/lib/utils';
import { TempStatusLevel } from '@/components/SummaryCard';

const playSound = (file: File | null) => {
  if (file) {
    const objectUrl = URL.createObjectURL(file);
    const audio = new Audio(objectUrl);
    audio.play();
    audio.onended = () => {
      URL.revokeObjectURL(objectUrl);
    };
  }
};

const ShopPage = () => {
  const { asics, setAsics } = useAsics();
  const { powerOnSoundFile, powerOffSoundFile, overheatSoundFile } = useSound();
  const { preventOverheat, preventErrors, startupDelay, shutdownDelay } = useDevOptions();
  const { triggerStartupAnimation, triggerShutdownAnimation } = useAppStatus();
  const prevAsicsRef = useRef(asics);
  const maxTemp = 85;
  const criticalTemp = 100;
  const shutdownTemp = 115;

  const handleTogglePower = (asicId: string) => {
    const asicToToggle = asics.find(a => a.id === asicId);
    if (!asicToToggle) return;

    const isRunning = asicToToggle.status === 'online' || asicToToggle.status === 'overclocked' || asicToToggle.status === 'overheat';
    if (isRunning) {
      playSound(powerOffSoundFile);
      setAsics(prevAsics =>
        prevAsics.map(asic =>
          asic.id === asicId ? { ...asic, status: 'shutting down' } : asic
        )
      );
      setTimeout(() => {
        setAsics(prevAsics =>
          prevAsics.map(asic =>
            asic.id === asicId ? { ...asic, status: 'offline', power: 0, hashrate: 0, temperature: Math.max(25, asic.temperature - 10) } : asic
          )
        );
      }, shutdownDelay * 1000);
    } else if (asicToToggle.status === 'offline') {
      playSound(powerOnSoundFile);
      setAsics(prevAsics =>
        prevAsics.map(asic =>
          asic.id === asicId ? { ...asic, status: 'booting up' } : asic
        )
      );
      setTimeout(() => {
        setAsics(prevAsics =>
          prevAsics.map(asic =>
            asic.id === asicId ? { ...asic, status: 'online', power: 3200, hashrate: 100, temperature: Math.max(25, asic.temperature + 5) } : asic));
        }, startupDelay * 1000);
    }
  };

  const handlePowerAction = (asicId: string, action: 'idle' | 'stop' | 'reboot' | 'standby' | 'force-stop' | 'start-mining') => {
    setAsics(prevAsics =>
      prevAsics.map(asic => {
        if (asic.id === asicId) {
          switch (action) {
            case 'start-mining':
              playSound(powerOnSoundFile);
              setTimeout(() => {
                setAsics(currentAsics => currentAsics.map(asicItem => asicItem.id === asicId ? { ...asicItem, status: 'online', power: 3200, hashrate: 100, temperature: Math.max(25, asicItem.temperature + 5) } : asicItem));
              }, startupDelay * 1000);
              return { ...asic, status: 'booting up' };
            case 'idle':
              return { ...asic, status: 'idle' };
            case 'standby':
              return { ...asic, status: 'standby' };
            case 'stop':
            case 'reboot':
              playSound(powerOffSoundFile);
              setTimeout(() => {
                setAsics(currentAsics => currentAsics.map(asicItem => asicItem.id === asic.id ? { ...asicItem, status: 'offline', power: 0, hashrate: 0, temperature: Math.max(25, asicItem.temperature - 10) } : asicItem));
              }, shutdownDelay * 1000);
              return { ...asic, status: 'shutting down' };
            case 'force-stop':
              showSuccess(`${asic.name} a été forcé à s'arrêter.`);
              setTimeout(() => {
                setAsics(currentAsics => currentAsics.map(asicItem => asicItem.id === asic.id ? {
                  ...asicItem,
                  status: 'offline',
                  power: 0,
                  hashrate: 0,
                  temperature: Math.max(25, asicItem.temperature - 10),
                  isForceStopping: false,
                } : asicItem));
              }, 1500);
              return { ...asic, isForceStopping: true };
            default:
              return asic;
          }
        }
        return asic;
      })
    );
  };

  const handleToggleFan = (asicId: string) => {
    setAsics(prevAsics =>
      prevAsics.map(asic =>
        asic.id === asicId ? { ...asic, isFanOn: !asic.isFanOn } : asic
      )
    );
  };

  const handleToggleOverclock = (asicId: string) => {
    setAsics(prevAsics =>
      prevAsics.map(asic => {
        if (asic.id === asicId) {
          if (asic.status === 'online') return { ...asic, status: 'overclocked' };
          if (asic.status === 'overclocked') return { ...asic, status: 'online' };
        }
        return asic;
      })
    );
  };
  
  const handleStartAll = () => {
    const willStartAny = asics.some(asic => asic.status === 'offline');
    if (willStartAny) playSound(powerOnSoundFile);
    setAsics(asics.map(asic => {
      if (asic.status === 'offline') {
        setTimeout(() => {
          setAsics(currentAsics => currentAsics.map(asicItem => asicItem.id === asic.id ? { ...asicItem, status: 'online', power: 3200, hashrate: 100, temperature: Math.max(25, asicItem.temperature + 5) } : asicItem));
        }, startupDelay * 1000);
        return { ...asic, status: 'booting up' };
      }
      return asic;
    }));
  };

  const handleStopAll = () => {
    const willStopAny = asics.some(asic => ['online', 'overclocked', 'overheat'].includes(asic.status));
    if (willStopAny) playSound(powerOffSoundFile);
    setAsics(asics.map(asic => {
      if (['online', 'overclocked', 'overheat'].includes(asic.status)) {
        setTimeout(() => {
          setAsics(currentAsics => currentAsics.map(asicItem => asicItem.id === asic.id ? { ...asicItem, status: 'offline', power: 0, hashrate: 0, temperature: Math.max(25, asicItem.temperature - 10) } : asicItem));
        }, shutdownDelay * 1000);
        return { ...asic, status: 'shutting down' };
      }
      return asic;
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedAsics = asics.map((asic, index) => {
        let newAsic = { ...asic };
        
        if (newAsic.isForceStopping) return newAsic;

        if (!preventOverheat) {
          if (newAsic.temperature >= shutdownTemp && newAsic.status !== 'offline' && newAsic.status !== 'shutting down') {
            newAsic.status = 'shutting down';
            playSound(powerOffSoundFile);
            showError(`ARRÊT D'URGENCE: ${newAsic.name} a dépassé ${shutdownTemp}°C.`);
            setTimeout(() => {
              setAsics(currentAsics => currentAsics.map(asicItem => asicItem.id === newAsic.id ? { ...asicItem, status: 'offline', power: 0, hashrate: 0, temperature: Math.max(25, asicItem.temperature - 10) } : asicItem));
            }, shutdownDelay * 1000);
          } else if (newAsic.temperature >= criticalTemp && (newAsic.status === 'online' || newAsic.status === 'overclocked')) {
            newAsic.status = 'overheat';
            showError(`${newAsic.name} est en surchauffe critique. Minage suspendu.`);
          }
        }

        if (newAsic.temperature >= maxTemp && newAsic.status === 'overclocked') {
          newAsic.status = 'online';
          showError(`Overclock désactivé sur ${newAsic.name} pour cause de surchauffe.`);
        }

        if (!preventErrors && Math.random() > 0.998 && (newAsic.status === 'online' || newAsic.status === 'overclocked')) {
          newAsic.status = 'error';
          newAsic.power = 50;
          showError(`${newAsic.name} a rencontré une erreur critique.`);
        }

        switch (newAsic.status) {
          case 'online':
          case 'overclocked':
            const tempIncrease = newAsic.status === 'overclocked' ? 0.8 : 0.5;
            const fanCooling = newAsic.isFanOn ? (newAsic.fanSpeed / 100) * 1.2 : -0.1;
            newAsic.temperature += (Math.random() - 0.5 + tempIncrease / 2 - fanCooling) * 1.5;
            
            const hashrateVariation = newAsic.status === 'overclocked' ? 1.5 : 0.5;
            newAsic.hashrate += (Math.random() - 0.5) * hashrateVariation;
            newAsic.power = newAsic.status === 'overclocked' ? 3600 + Math.random() * 100 : 3200 + Math.random() * 50;
            
            if (newAsic.isFanOn) {
              if (newAsic.temperature > maxTemp - 10) {
                newAsic.fanSpeed = Math.min(100, newAsic.fanSpeed + 5);
              } else {
                newAsic.fanSpeed = Math.max(70, newAsic.fanSpeed - 1);
              }
            } else {
              newAsic.fanSpeed = 0;
            }
            break;
          case 'overheat':
            newAsic.hashrate = 0;
            newAsic.power = Math.max(200, newAsic.power - 200);
            newAsic.isFanOn = true;
            newAsic.fanSpeed = 100;
            newAsic.temperature = Math.max(25, newAsic.temperature - 1.5);
            if (newAsic.temperature < 70) {
                newAsic.status = 'online';
                showSuccess(`${newAsic.name} a refroidi et reprend le minage.`);
            }
            break;
          case 'booting up':
            newAsic.power = Math.min(3000, newAsic.power + 300);
            break;
          case 'shutting down':
            newAsic.power = Math.max(0, newAsic.power - 300);
            newAsic.fanSpeed = Math.max(0, newAsic.fanSpeed - 15);
            break;
          case 'idle':
            newAsic.hashrate = 10 + (Math.random() - 0.5) * 2;
            newAsic.power = 500 + (Math.random() - 0.5) * 50;
            
            const idleTempTarget = 45;
            if (newAsic.temperature > idleTempTarget) {
              newAsic.temperature = Math.max(idleTempTarget, newAsic.temperature - 0.5);
            } else {
              newAsic.temperature = Math.min(idleTempTarget, newAsic.temperature + 0.5);
            }
            
            newAsic.isFanOn = true;
            newAsic.fanSpeed = 30;
            break;
          case 'standby':
            newAsic.hashrate = 0;
            newAsic.power = Math.max(50, newAsic.power - 100);
            if (newAsic.temperature > 25) newAsic.temperature -= 1;
            break;
          case 'offline':
            if (newAsic.temperature > 25) newAsic.temperature -= 0.5;
            newAsic.fanSpeed = 0;
            newAsic.isFanOn = false;
            break;
          case 'error':
            break;
        }

        if (preventOverheat) {
          if (newAsic.temperature > maxTemp - 15) {
            newAsic.temperature = Math.max(maxTemp - 20, newAsic.temperature - 1);
            newAsic.fanSpeed = Math.min(100, newAsic.fanSpeed + 10);
          }
        }

        newAsic.power = Math.max(0, newAsic.power);
        newAsic.hashrate = (newAsic.status === 'online' || newAsic.status === 'overclocked' || newAsic.status === 'idle') ? Math.max(0, newAsic.hashrate) : 0;
        newAsic.temperature = Math.max(25, newAsic.temperature);
        newAsic.fanSpeed = Math.max(0, Math.min(100, newAsic.fanSpeed));

        const oldAsic = prevAsicsRef.current[index];
        if (oldAsic && oldAsic.temperature < maxTemp && newAsic.temperature >= maxTemp && !preventOverheat) {
          playSound(overheatSoundFile);
        }

        return newAsic;
      });
      prevAsicsRef.current = asics;
      setAsics(updatedAsics);
    }, 500);
    return () => clearInterval(interval);
  }, [asics, maxTemp, overheatSoundFile, powerOffSoundFile, setAsics, preventOverheat, preventErrors, startupDelay, shutdownDelay]);

  const summary = useMemo(() => {
    const totalAsicsCount = asics.length;
    const avgTemp = totalAsicsCount > 0 ? asics.reduce((acc, a) => acc + a.temperature, 0) / totalAsicsCount : 0;

    return {
      avgTemp,
    };
  }, [asics]);

  const tempStatus: { level: TempStatusLevel; text: string; } = useMemo(() => {
    const temp = summary.avgTemp;
    if (temp > 85) return { level: 'surcharge', text: 'SURCHARGE' };
    if (temp > 70) return { level: 'eleve', text: 'ÉLEVÉ' };
    if (temp > 40) return { level: 'optimal', text: 'OPTIMAL' };
    return { level: 'faible', text: 'FAIBLE' };
  }, [summary.avgTemp]);

  const surchargeAlertTriggered = useRef(false);
  useEffect(() => {
    if (tempStatus.level === 'surcharge' && !surchargeAlertTriggered.current && !preventOverheat) {
      surchargeAlertTriggered.current = true;
      showError("ALERTE SURCHARGE ! Température moyenne critique. Arrêt d'urgence dans 10 secondes.");
      const timer = setTimeout(() => {
        handleStopAll();
        showSuccess("Arrêt d'urgence effectué pour cause de surchauffe.");
      }, 10000);
      return () => clearTimeout(timer);
    } else if (tempStatus.level !== 'surcharge') {
      surchargeAlertTriggered.current = false;
    }
  }, [tempStatus.level, handleStopAll, preventOverheat]);

  return (
    <div className="space-y-8">
      <div className="relative h-24 -mx-6 -mt-6 mb-4 flex items-center px-6">
        <div className="relative z-10 flex justify-between items-center w-full">
          <h1 className="text-3xl font-bold">Magasin</h1>
          <div className="flex space-x-3">
            <Button 
              onClick={handleStartAll} 
              className="bg-green-500/20 text-green-400 hover:bg-green-500/30"
            >
              <Power className="w-4 h-4 mr-2" />
              Démarrer Tout
            </Button>
            <Button 
              onClick={handleStopAll} 
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
            >
              <X className="w-4 h-4 mr-2" />
              Arrêter Tout
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Produits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {asics.map((asic, index) => (
            <ASICStatusCard 
              key={asic.id} 
              asic={asic} 
              maxTemp={maxTemp}
              onTogglePower={handleTogglePower}
              onToggleFan={handleToggleFan}
              onToggleOverclock={handleToggleOverclock}
              onPowerAction={handlePowerAction}
              triggerShutdownAnimation={triggerShutdownAnimation}
              triggerStartupAnimation={triggerStartupAnimation}
              startupDelay={1.2 + index * 0.1}
              shutdownDelay={1.8 + index * 0.1}
              className={""}
              style={{}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;