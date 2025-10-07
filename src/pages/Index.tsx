import { useState, useEffect, useMemo, useRef } from 'react';
import { ASICStatusCard, ASIC } from '@/components/ASICStatusCard';
import { SummaryCard } from '@/components/SummaryCard';
import { Button } from '@/components/ui/button';
import { Thermometer, Power, X } from 'lucide-react';
import { useSound } from '@/context/SoundContext';
import { useAsics } from '@/context/AsicContext';
import { AnimatedHashrateIcon } from '@/components/AnimatedHashrateIcon';
import { AnimatedZapIcon } from '@/components/AnimatedZapIcon';
import { AnimatedServerIcon } from '@/components/AnimatedServerIcon';
import { showError, showSuccess } from '@/utils/toast';
import { GlobalStatusIndicator, StatusLevel } from '@/components/GlobalStatusIndicator';

const playSound = (file: File | null) => {
  if (file) {
    const audio = new Audio(URL.ObjectURL(file));
    audio.play();
  }
};

const Index = () => {
  const { asics, setAsics } = useAsics();
  const { powerOnSoundFile, powerOffSoundFile, overheatSoundFile } = useSound();
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
    } else if (asicToToggle.status === 'offline') {
      playSound(powerOnSoundFile);
    }

    setAsics(prevAsics =>
      prevAsics.map(asic => {
        if (asic.id === asicId) {
          if (isRunning) return { ...asic, status: 'shutting down' };
          if (asic.status === 'offline') return { ...asic, status: 'booting up' };
        }
        return asic;
      })
    );
  };

  const handlePowerAction = (asicId: string, action: 'idle' | 'stop' | 'reboot' | 'standby' | 'force-stop') => {
    setAsics(prevAsics =>
      prevAsics.map(asic => {
        if (asic.id === asicId) {
          switch (action) {
            case 'idle':
              return { ...asic, status: 'idle' };
            case 'standby':
              return { ...asic, status: 'standby' };
            case 'stop':
            case 'reboot':
              return { ...asic, status: 'shutting down' };
            case 'force-stop':
              showSuccess(`${asic.name} a été forcé à s'arrêter.`);
              setTimeout(() => {
                setAsics(currentAsics => currentAsics.map(a => a.id === asicId ? {
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
    setAsics(asics.map(asic => asic.status === 'offline' ? { ...asic, status: 'booting up' } : asic));
  };

  const handleStopAll = () => {
    const willStopAny = asics.some(asic => ['online', 'overclocked', 'overheat'].includes(asic.status));
    if (willStopAny) playSound(powerOffSoundFile);
    setAsics(asics.map(asic => ['online', 'overclocked', 'overheat'].includes(asic.status) ? { ...asic, status: 'shutting down' } : asic));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedAsics = asics.map((asic, index) => {
        let newAsic = { ...asic };
        
        if (newAsic.isForceStopping) return newAsic;

        if (newAsic.temperature >= shutdownTemp && newAsic.status !== 'offline' && newAsic.status !== 'shutting down') {
          newAsic.status = 'shutting down';
          playSound(powerOffSoundFile);
          showError(`ARRÊT D'URGENCE: ${newAsic.name} a dépassé ${shutdownTemp}°C.`);
        } else if (newAsic.temperature >= criticalTemp && (newAsic.status === 'online' || newAsic.status === 'overclocked')) {
          newAsic.status = 'overheat';
          showError(`${newAsic.name} est en surchauffe critique. Minage suspendu.`);
        }

        if (newAsic.temperature >= maxTemp && newAsic.status === 'overclocked') {
          newAsic.status = 'online';
          showError(`Overclock désactivé sur ${newAsic.name} pour cause de surchauffe.`);
        }

        if (Math.random() > 0.998 && (newAsic.status === 'online' || newAsic.status === 'overclocked')) {
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
            newAsic.power += 300;
            if (newAsic.power >= 3000) newAsic.status = 'online';
            break;
          case 'shutting down':
            newAsic.power -= 300;
            newAsic.fanSpeed = Math.max(0, newAsic.fanSpeed - 15);
            if (newAsic.power <= 0) newAsic.status = 'offline';
            break;
          case 'idle':
            newAsic.hashrate = 0;
            newAsic.power = Math.max(150, newAsic.power - 100);
            if (newAsic.temperature > 35) newAsic.temperature -= 0.5;
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
            // Stays in error state
            break;
        }
        newAsic.power = Math.max(0, newAsic.power);
        newAsic.hashrate = (newAsic.status === 'online' || newAsic.status === 'overclocked') ? Math.max(0, newAsic.hashrate) : 0;
        newAsic.temperature = Math.max(25, newAsic.temperature);
        newAsic.fanSpeed = Math.max(0, Math.min(100, newAsic.fanSpeed));

        const oldAsic = prevAsicsRef.current[index];
        if (oldAsic && oldAsic.temperature < maxTemp && newAsic.temperature >= maxTemp) {
          playSound(overheatSoundFile);
        }

        return newAsic;
      });
      prevAsicsRef.current = asics;
      setAsics(updatedAsics);
    }, 500);
    return () => clearInterval(interval);
  }, [asics, maxTemp, overheatSoundFile, powerOffSoundFile, setAsics]);

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

  const tempStatus = useMemo(() => {
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
    if (tempStatus.level === 'surcharge' && !surchargeAlertTriggered.current) {
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
  }, [tempStatus.level, handleStopAll]);

  return (
    <div className="space-y-8">
      <div className="relative h-48 -mx-6 -mt-6 mb-4">
        <div className="absolute inset-0 z-0 opacity-75">
          <GlobalStatusIndicator 
            status={globalStatus} 
            hashrate={summary.totalHashrate} 
            asics={asics}
            isOverclockedMajority={summary.isOverclockedMajority}
          />
        </div>
        <div className="relative z-10 flex justify-between items-center h-full px-6">
          <h1 className="text-3xl font-bold">Centre de Contrôle</h1>
          <div className="flex space-x-3">
            <Button onClick={handleStartAll} className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
              <Power className="w-4 h-4 mr-2" />
              Démarrer Tout
            </Button>
            <Button onClick={handleStopAll} className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
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
          iconBgColor="bg-gradient-to-br from-orange-500 to-orange-700" 
        />
        <SummaryCard 
          title="Température Moyenne" 
          value={summary.avgTemp.toFixed(2)} 
          unit="°C" 
          icon={<Thermometer className="w-8 h-8" />} 
          iconBgColor="bg-gradient-to-br from-green-500 to-green-700"
          tempStatus={tempStatus}
        />
        <SummaryCard 
          title="Consommation Totale" 
          value={summary.totalPower.toFixed(0)} 
          unit="W" 
          icon={<AnimatedZapIcon className="w-8 h-8" />} 
          iconBgColor="bg-gradient-to-br from-cyan-400 to-cyan-600" 
        />
        <SummaryCard 
          title="ASICs Actifs" 
          value={`${summary.activeAsics} / ${summary.totalAsics}`} 
          unit="" 
          icon={<AnimatedServerIcon className="w-8 h-8" />} 
          iconBgColor="bg-gradient-to-br from-blue-500 to-blue-700" 
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Vos Machines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {asics.map(asic => (
            <ASICStatusCard 
              key={asic.id} 
              asic={asic} 
              maxTemp={maxTemp}
              onTogglePower={handleTogglePower}
              onToggleFan={handleToggleFan}
              onToggleOverclock={handleToggleOverclock}
              onPowerAction={handlePowerAction}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;