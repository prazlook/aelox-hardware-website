import { useState, useEffect, useMemo, useRef } from 'react';
import { ASICStatusCard, ASIC } from '@/components/ASICStatusCard';
import { SummaryCard, TempStatusLevel } from '@/components/SummaryCard';
import { Button } from '@/components/ui/button';
import { Thermometer, Power, X } from 'lucide-react';
import { useSound } from '@/context/SoundContext';
import { useAsics } from '@/context/AsicContext';
import { AnimatedHashrateIcon } from '@/components/AnimatedHashrateIcon';
import { AnimatedZapIcon } from '@/components/AnimatedZapIcon';
import { AnimatedServerIcon } from '@/components/AnimatedServerIcon';
import { showError, showSuccess } from '@/utils/toast';
import { GlobalStatusIndicator, StatusLevel } from '@/components/GlobalStatusIndicator';
import { useDevOptions } from '@/context/DevOptionsContext';
import { useAppStatus } from '@/context/AppStatusContext'; // Import useAppStatus
import { cn } from '@/lib/utils'; // Import cn

const playSound = (file: File | null) => {
  if (file) {
    const objectUrl = URL.createObjectURL(file);
    const audio = new Audio(objectUrl);
    audio.play();
    audio.onended = () => {
      URL.revokeObjectURL(objectUrl); // Libère la mémoire après la lecture
    };
  }
};

const Index = () => {
  const { asics, setAsics } = useAsics();
  const { powerOnSoundFile, powerOffSoundFile, overheatSoundFile } = useSound();
  const { preventOverheat, preventErrors, startupDelay, shutdownDelay } = useDevOptions();
  const { appPhase } = useAppStatus(); // Get appPhase
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
            asic.id === asicId ? { ...asic, status: 'online', power: 3200, hashrate: 100, temperature: Math.max(25, asic.temperature + 5) } : asic
          )
        );
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
                setAsics(currentAsics => currentAsics.map(a => a.id === asicId ? { ...a, status: 'online', power: 3200, hashrate: 100, temperature: Math.max(25, a.temperature + 5) } : a));
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
                setAsics(currentAsics => currentAsics.map(a => a.id === asicId ? { ...a, status: 'offline', power: 0, hashrate: 0, temperature: Math.max(25, a.temperature - 10) } : a));
              }, shutdownDelay * 1000);
              return { ...asic, status: 'shutting down' };
            case 'force-stop':
              showSuccess(`${asic.name} a été forcé à s'arrêter.`);
              setTimeout(() => {
                setAsics(currentAsics => currentAsics.map(a => a.id === asic.id ? {
                  ...a,
                  status: 'offline',
                  power: 0,
                  hashrate: 0,
                  temperature: Math.max(25, a.temperature - 10),
                  isForceStopping: false,
                } : a));
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
          setAsics(currentAsics => currentAsics.map(a => a.id === asic.id ? { ...a, status: 'online', power: 3200, hashrate: 100, temperature: Math.max(25, a.temperature + 5) } : a));
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
          setAsics(currentAsics => currentAsics.map(a => a.id === asic.id ? { ...a, status: 'offline', power: 0, hashrate: 0, temperature: Math.max(25, a.temperature - 10) } : a));
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
              setAsics(currentAsics => currentAsics.map(a => a.id === newAsic.id ? { ...a, status: 'offline', power: 0, hashrate: 0, temperature: Math.max(25, a.temperature - 10) } : a));
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
            // The actual transition to 'online' is handled by a setTimeout in handleTogglePower/handlePowerAction
            // For now, just simulate power ramp-up
            newAsic.power = Math.min(3000, newAsic.power + 300);
            break;
          case 'shutting down':
            // The actual transition to 'offline' is handled by a setTimeout in handleTogglePower/handlePowerAction
            // For now, just simulate power ramp-down
            newAsic.power = Math.max(0, newAsic.power - 300);
            newAsic.fanSpeed = Math.max(0, newAsic.fanSpeed - 15);
            break;
          case 'idle':
            newAsic.hashrate = 10 + (Math.random() - 0.5) * 2; // Low hashrate around 10 TH/s
            newAsic.power = 500 + (Math.random() - 0.5) * 50; // Low power around 500W
            
            const idleTempTarget = 45;
            if (newAsic.temperature > idleTempTarget) {
              newAsic.temperature = Math.max(idleTempTarget, newAsic.temperature - 0.5);
            } else {
              newAsic.temperature = Math.min(idleTempTarget, newAsic.temperature + 0.5);
            }
            
            newAsic.isFanOn = true;
            newAsic.fanSpeed = 30; // Low fan speed
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
    const onlineAsics = asics.filter(a => a.status === 'online' || a.status === 'overclocked');
    const totalAsicsCount = asics.length;
    const activeAsicsCount = onlineAsics.length;
    const totalHashrate = asics.reduce((acc, a) => acc + a.hashrate, 0);
    const totalPower = asics.reduce((acc, a) => acc + a.power, 0);
    const avgTemp = totalAsicsCount > 0 ? asics.reduce((acc, a) => acc + a.temperature, 0) / totalAsicsCount : 0;
    const overclockedCount = asics.filter(a => a.status === 'overclocked').length;
    const isOverclockedMajority = totalAsicsCount > 0 && (overclockedCount / totalAsicsCount) >= 0.7;

    return {
      totalHashrate,
      avgTemp,
      totalPower,
      activeAsics: activeAsicsCount,
      totalAsics: totalAsicsCount,
      isOverclockedMajority,
    };
  }, [asics]);

  const tempStatus: { level: TempStatusLevel; text: string; } = useMemo(() => {
    const temp = summary.avgTemp;
    if (temp > 85) return { level: 'surcharge', text: 'SURCHARGE' };
    if (temp > 70) return { level: 'eleve', text: 'ÉLEVÉ' };
    if (temp > 40) return { level: 'optimal', text: 'OPTIMAL' };
    return { level: 'faible', text: 'FAIBLE' };
  }, [summary.avgTemp]);

  const globalStatus: StatusLevel = useMemo(() => {
    const hasError = asics.some(a => a.status === 'error');
    const hasOverheat = asics.some(a => a.status === 'overheat');
    const allOffline = asics.every(a => a.status === 'offline');

    if (hasError) return 'error';
    if (hasOverheat || tempStatus.level === 'surcharge') return 'surcharge';
    if (tempStatus.level === 'eleve') return 'eleve';
    if (allOffline) return 'offline';
    
    return 'optimal';
  }, [asics, tempStatus.level]);

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

  // Determine if main UI elements should animate
  const triggerMainUiAnimation = appPhase === 'main_ui_loading';

  return (
    <div className="space-y-8">
      <div className="relative h-48 -mx-6 -mt-6 mb-4">
        <div className="absolute inset-0 z-0 opacity-75">
          <GlobalStatusIndicator 
            status={globalStatus} 
            hashrate={summary.totalHashrate} 
            asics={asics}
            isOverclockedMajority={summary.isOverclockedMajority}
            className={cn(triggerMainUiAnimation && "animate-startup-fade-in-from-center")} // Apply animation if main UI is loading
            style={triggerMainUiAnimation ? { animationDelay: '0.2s' } : {}}
            triggerStartupAnimation={false} // This is not the intro animation
          />
        </div>
        <div className="relative z-10 flex justify-between items-center h-full px-6">
          <h1 
            className={cn("text-3xl font-bold", triggerMainUiAnimation && "animate-startup-slide-in-left")}
            style={triggerMainUiAnimation ? { animationDelay: '0.4s' } : {}}
          >
            Centre de Contrôle
          </h1>
          <div className="flex space-x-3">
            <Button 
              onClick={handleStartAll} 
              className={cn("bg-green-500/20 text-green-400 hover:bg-green-500/30", triggerMainUiAnimation && "animate-startup-slide-in-right")}
              style={triggerMainUiAnimation ? { animationDelay: '0.5s' } : {}}
            >
              <Power className="w-4 h-4 mr-2" />
              Démarrer Tout
            </Button>
            <Button 
              onClick={handleStopAll} 
              className={cn("bg-red-500/20 text-red-400 hover:bg-red-500/30", triggerMainUiAnimation && "animate-startup-slide-in-right")}
              style={triggerMainUiAnimation ? { animationDelay: '0.6s' } : {}}
            >
              <X className="w-4 h-4 mr-2" />
              Arrêter Tout
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Hashrate Total" 
          value={summary.totalHashrate.toFixed(2)} 
          unit="TH/s" 
          icon={<AnimatedHashrateIcon className="w-8 h-8" />} 
          iconBgColor={summary.isOverclockedMajority ? "bg-[linear-gradient(120deg,_#ffb3ba,_#ffdfba,_#ffffba,_#baffc9,_#bae1ff,_#e0baff,_#ffb3ba)] bg-[length:200%_200%] animate-aurora" : "bg-gradient-to-br from-orange-500 to-orange-700"} 
          className={cn(triggerMainUiAnimation && "animate-startup-fade-in-scale")}
          style={triggerMainUiAnimation ? { animationDelay: '0.7s' } : {}}
        />
        <SummaryCard 
          title="Température Moyenne" 
          value={summary.avgTemp.toFixed(2)} 
          unit="°C" 
          icon={<Thermometer className="w-8 h-8" />} 
          iconBgColor="bg-gradient-to-br from-green-500 to-green-700"
          tempStatus={tempStatus}
          className={cn(triggerMainUiAnimation && "animate-startup-fade-in-scale")}
          style={triggerMainUiAnimation ? { animationDelay: '0.8s' } : {}}
        />
        <SummaryCard 
          title="Consommation Totale" 
          value={summary.totalPower.toFixed(0)} 
          unit="W" 
          icon={<AnimatedZapIcon className="w-8 h-8" />} 
          iconBgColor="bg-gradient-to-br from-cyan-400 to-cyan-600" 
          className={cn(triggerMainUiAnimation && "animate-startup-fade-in-scale")}
          style={triggerMainUiAnimation ? { animationDelay: '0.9s' } : {}}
        />
        <SummaryCard 
          title="ASICs Actifs" 
          value={`${summary.activeAsics} / ${summary.totalAsics}`} 
          unit="" 
          icon={<AnimatedServerIcon className="w-8 h-8" />} 
          iconBgColor="bg-gradient-to-br from-blue-500 to-blue-700" 
          className={cn(triggerMainUiAnimation && "animate-startup-fade-in-scale")}
          style={triggerMainUiAnimation ? { animationDelay: '1.0s' } : {}}
        />
      </div>

      <div>
        <h2 
          className={cn("text-2xl font-bold mb-4", triggerMainUiAnimation && "animate-startup-slide-in-left")}
          style={triggerMainUiAnimation ? { animationDelay: '1.1s' } : {}}
        >
          Vos Machines
        </h2>
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
              className={cn(triggerMainUiAnimation && "animate-startup-fade-in-scale")}
              style={triggerMainUiAnimation ? { animationDelay: `${1.2 + index * 0.1}s` } : {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;