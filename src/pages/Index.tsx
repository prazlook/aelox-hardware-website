import { useState, useEffect, useMemo } from 'react';
import { ASIC, ASICStatusCard } from '@/components/ASICStatusCard';
import { SummaryCard } from '@/components/SummaryCard';
import { Button } from '@/components/ui/button';
import { Activity, Thermometer, Zap, Server, Power, X } from 'lucide-react';

const MOCK_ASICS: ASIC[] = [
  { id: 'A1', name: 'Antminer S19 Pro #2', model: 'Bitmain Antminer S19 Pro', status: 'online', hashrate: 102.79, temperature: 69.17, power: 3338, fanSpeed: 85, isFanOn: true },
  { id: 'A2', name: 'Antminer S19 Pro #1', model: 'Bitmain Antminer S19 Pro', status: 'online', hashrate: 103.98, temperature: 65.26, power: 3149, fanSpeed: 71, isFanOn: true },
  { id: 'A3', name: 'Bitmain Antmin S23 Hyd 3U #1', model: 'Bitmain Antmin S23 Hyd 3U', status: 'offline', hashrate: 0, temperature: 25, power: 0, fanSpeed: 0, isFanOn: false },
];

const Index = () => {
  const [asics, setAsics] = useState<ASIC[]>(MOCK_ASICS);
  const maxTemp = 85; // Seuil de température d'alerte

  const handleTogglePower = (asicId: string) => {
    setAsics(prevAsics =>
      prevAsics.map(asic => {
        if (asic.id === asicId) {
          if (asic.status === 'online') return { ...asic, status: 'stopping' };
          if (asic.status === 'offline') return { ...asic, status: 'starting' };
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
  
  const handleStartAll = () => {
    setAsics(asics.map(asic => asic.status === 'offline' ? { ...asic, status: 'starting' } : asic));
  };

  const handleStopAll = () => {
    setAsics(asics.map(asic => asic.status === 'online' ? { ...asic, status: 'stopping' } : asic));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedAsics = asics.map(asic => {
        let newAsic = { ...asic };
        
        if (!newAsic.isFanOn) {
          newAsic.fanSpeed = 0;
        } else if (newAsic.status === 'online' && newAsic.fanSpeed < 60) {
          newAsic.fanSpeed = 75 + (Math.random() - 0.5) * 10; // Restore fan speed
        }

        switch (asic.status) {
          case 'online':
            newAsic.temperature += (Math.random() - 0.5) * 2; // Increased fluctuation
            newAsic.hashrate += (Math.random() - 0.5) * 0.5;
            if (newAsic.isFanOn) {
              newAsic.fanSpeed += (Math.random() - 0.5) * 2;
            }
            break;
          case 'starting':
            newAsic.power += 300;
            if (newAsic.power >= 3000) newAsic.status = 'online';
            break;
          case 'stopping':
            newAsic.power -= 300;
            if (newAsic.power <= 0) newAsic.status = 'offline';
            break;
          case 'offline':
            if (newAsic.temperature > 25) newAsic.temperature -= 0.5;
            break;
        }
        newAsic.power = Math.max(0, newAsic.power);
        newAsic.hashrate = asic.status === 'online' ? Math.max(0, newAsic.hashrate) : 0;
        newAsic.temperature = Math.max(25, newAsic.temperature);
        newAsic.fanSpeed = Math.max(0, Math.min(100, newAsic.fanSpeed));
        return newAsic;
      });
      setAsics(updatedAsics);
    }, 2000);
    return () => clearInterval(interval);
  }, [asics]);

  const summary = useMemo(() => {
    const onlineAsics = asics.filter(a => a.status === 'online');
    return {
      totalHashrate: asics.reduce((acc, a) => acc + a.hashrate, 0),
      avgTemp: asics.reduce((acc, a) => acc + a.temperature, 0) / asics.length,
      totalPower: asics.reduce((acc, a) => acc + a.power, 0),
      activeAsics: onlineAsics.length,
    };
  }, [asics]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Centre de Contrôle</h1>
          <p className="text-theme-text-secondary mt-1">Surveillance en temps réel de vos ASICs</p>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Hashrate Total" value={summary.totalHashrate.toFixed(2)} unit="TH/s" icon={<Activity />} iconBgColor="bg-orange-500/20" />
        <SummaryCard title="Température Moyenne" value={summary.avgTemp.toFixed(2)} unit="°C" icon={<Thermometer />} iconBgColor="bg-green-500/20" />
        <SummaryCard title="Consommation Totale" value={summary.totalPower.toFixed(0)} unit="W" icon={<Zap />} iconBgColor="bg-blue-500/20" />
        <SummaryCard title="ASICs Actifs" value={`${summary.activeAsics} / ${asics.length}`} unit="" icon={<Server />} iconBgColor="bg-cyan-500/20" />
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;