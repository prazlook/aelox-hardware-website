import { useState, useEffect, useMemo, useRef } from 'react';
import { ASICStatusCard } from '@/components/ASICStatusCard';
import { type ASIC } from '@/context/AsicContext';
import { Button } from '@/components/ui/button';
import { Power, X } from 'lucide-react';
import { useSound } from '@/context/SoundContext';
import { useAsics } from '@/context/AsicContext';
import { showError, showSuccess } from '@/utils/toast';
import { useDevOptions } from '@/context/DevOptionsContext';
import { useAppStatus } from '@/context/AppStatusContext';
import { cn } from '@/lib/utils';

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
  const { powerOnSoundFile, powerOffSoundFile } = useSound();
  const { preventErrors, startupDelay, shutdownDelay } = useDevOptions();
  const { triggerStartupAnimation, triggerShutdownAnimation } = useAppStatus();
  const maxTemp = 500;

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
            asic.id === asicId ? { ...asic, status: 'offline', power: 0, hashrate: 0, temperature: 25 } : asic
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
            asic.id === asicId ? { 
              ...asic, 
              status: 'online', 
              power: asic.fixedPower ?? 3200, 
              hashrate: asic.fixedSpeed ?? 100, 
              temperature: asic.fixedTemperature ?? 260 
            } : asic));
        }, startupDelay * 1000);
    }
  };

  const handleStartAll = () => {
    const offlineAsics = asics.filter(a => a.status === 'offline');
    if (offlineAsics.length === 0) return;

    playSound(powerOnSoundFile);
    setAsics(prev => prev.map(asic => {
      if (asic.status === 'offline') {
        setTimeout(() => {
          setAsics(current => current.map(a => a.id === asic.id ? {
            ...a,
            status: 'online',
            power: a.fixedPower ?? 3200,
            hashrate: a.fixedSpeed ?? 100,
            temperature: a.fixedTemperature ?? 260
          } : a));
        }, startupDelay * 1000);
        return { ...asic, status: 'booting up' };
      }
      return asic;
    }));
  };

  const handleStopAll = () => {
    const runningAsics = asics.filter(a => ['online', 'overclocked', 'overheat', 'idle', 'standby'].includes(a.status));
    if (runningAsics.length === 0) return;

    playSound(powerOffSoundFile);
    setAsics(prev => prev.map(asic => {
      if (['online', 'overclocked', 'overheat', 'idle', 'standby'].includes(asic.status)) {
        setTimeout(() => {
          setAsics(current => current.map(a => a.id === asic.id ? {
            ...a,
            status: 'offline',
            power: 0,
            hashrate: 0,
            temperature: 25
          } : a));
        }, shutdownDelay * 1000);
        return { ...asic, status: 'shutting down' };
      }
      return asic;
    }));
  };

  const handlePowerAction = (asicId: string, action: 'idle' | 'stop' | 'reboot' | 'standby' | 'force-stop' | 'start-mining') => {
    setAsics(prevAsics =>
      prevAsics.map(asic => {
        if (asic.id === asicId) {
          switch (action) {
            case 'start-mining':
              playSound(powerOnSoundFile);
              setTimeout(() => {
                setAsics(currentAsics => currentAsics.map(asicItem => asicItem.id === asicId ? { 
                  ...asicItem, 
                  status: 'online', 
                  power: asicItem.fixedPower ?? 3200, 
                  hashrate: asicItem.fixedSpeed ?? 100, 
                  temperature: asicItem.fixedTemperature ?? 260 
                } : asicItem));
              }, startupDelay * 1000);
              return { ...asic, status: 'booting up' };
            case 'idle':
              return { ...asic, status: 'idle', temperature: asic.fixedTemperature ?? 200, hashrate: asic.fixedSpeed ?? 10, power: asic.fixedPower ?? 500 };
            case 'standby':
              return { ...asic, status: 'standby', temperature: asic.fixedTemperature ?? 100, hashrate: 0, power: asic.fixedPower ?? 50 };
            case 'stop':
            case 'reboot':
              playSound(powerOffSoundFile);
              setTimeout(() => {
                setAsics(currentAsics => currentAsics.map(asicItem => asicItem.id === asic.id ? { ...asicItem, status: 'offline', power: 0, hashrate: 0, temperature: 25 } : asicItem));
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
                  temperature: 25,
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
          if (asic.status === 'online') return { ...asic, status: 'overclocked', temperature: asic.fixedTemperature ? asic.fixedTemperature + 40 : 300 };
          if (asic.status === 'overclocked') return { ...asic, status: 'online', temperature: asic.fixedTemperature ?? 260 };
        }
        return asic;
      })
    );
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAsics(currentAsics => currentAsics.map((asic) => {
        let newAsic = { ...asic };
        if (newAsic.isForceStopping) return newAsic;

        if (!preventErrors && Math.random() > 0.999 && (newAsic.status === 'online' || newAsic.status === 'overclocked')) {
          newAsic.status = 'error';
          newAsic.power = 50;
          showError(`${newAsic.name} a rencontré une erreur critique.`);
        }

        switch (newAsic.status) {
          case 'online':
          case 'overclocked':
            if (newAsic.fixedTemperature !== undefined) {
              newAsic.temperature = newAsic.fixedTemperature;
            } else {
              newAsic.temperature += (Math.random() - 0.5) * 0.2;
            }

            if (newAsic.fixedSpeed !== undefined) {
              newAsic.hashrate = newAsic.fixedSpeed;
            } else {
              const hashrateVariation = newAsic.status === 'overclocked' ? 1.5 : 0.5;
              newAsic.hashrate += (Math.random() - 0.5) * hashrateVariation;
            }

            if (newAsic.fixedPower !== undefined) {
              newAsic.power = newAsic.fixedPower;
            } else {
              newAsic.power = newAsic.status === 'overclocked' ? 3600 + Math.random() * 100 : 3200 + Math.random() * 50;
            }

            if (newAsic.fixedFanSpeed !== undefined) {
              newAsic.fanSpeed = newAsic.fixedFanSpeed;
            }
            break;
          case 'overheat':
            if (newAsic.fixedTemperature !== undefined) {
               newAsic.temperature = newAsic.fixedTemperature;
            } else {
               newAsic.temperature = Math.max(260, newAsic.temperature - 0.5);
            }
            break;
          case 'idle':
            if (newAsic.fixedSpeed !== undefined) newAsic.hashrate = newAsic.fixedSpeed;
            if (newAsic.fixedPower !== undefined) newAsic.power = newAsic.fixedPower;
            break;
          case 'offline':
            newAsic.temperature = Math.max(25, newAsic.temperature - 1);
            newAsic.fanSpeed = 0;
            newAsic.isFanOn = false;
            break;
        }

        return newAsic;
      }));
    }, 500);
    return () => clearInterval(interval);
  }, [preventErrors, setAsics]);

  return (
    <div className="space-y-8">
      <div className="relative h-24 -mx-6 -mt-6 mb-4 flex items-center px-6">
        <div className="relative z-10 flex justify-between items-center w-full">
          <h1 className="text-3xl font-bold">Magasin</h1>
          <div className="flex space-x-3">
            <Button onClick={handleStartAll} className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
              <Power className="w-4 h-4 mr-2" /> Démarrer Tout
            </Button>
            <Button onClick={handleStopAll} className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
              <X className="w-4 h-4 mr-2" /> Arrêter Tout
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;