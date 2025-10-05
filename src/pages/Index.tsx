import { useState, useEffect, useMemo } from 'react';
import { ASIC, ASICStatusCard } from '@/components/ASICStatusCard';
import { RealTimeChart } from '@/components/RealTimeChart';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import { AlertTriangle, PowerOff } from 'lucide-react';

type AlertState = 'ok' | 'alerting' | 'shutdown';

const MOCK_ASICS: ASIC[] = [
  { id: 'A1', name: 'Antminer S19 Pro', hashrate: 110, temperature: 65, power: 3250, fanSpeed: 70, isFanOn: true },
  { id: 'A2', name: 'Whatsminer M30S++', hashrate: 112, temperature: 68, power: 3472, fanSpeed: 75, isFanOn: true },
  { id: 'A3', name: 'Antminer L7', hashrate: 95, temperature: 72, power: 3425, fanSpeed: 80, isFanOn: true },
];

const Index = () => {
  const [asics, setAsics] = useState<ASIC[]>(MOCK_ASICS);
  const [chartData, setChartData] = useState<any[]>([]);
  const [maxTemp, setMaxTemp] = useState(85);
  const [shutdownDelay, setShutdownDelay] = useState(30000); // 30 seconds
  const [alertState, setAlertState] = useState<AlertState>('ok');
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const handleToggleFan = (asicId: string) => {
    setAsics(prevAsics =>
      prevAsics.map(asic => {
        if (asic.id === asicId) {
          const isFanNowOn = !asic.isFanOn;
          return {
            ...asic,
            isFanOn: isFanNowOn,
            fanSpeed: isFanNowOn ? 70 : 0, // Reset to a default speed or set to 0
          };
        }
        return asic;
      })
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (alertState === 'shutdown') return;

      const updatedAsics = asics.map(asic => {
        // When fan is off, temperature increases more rapidly
        const tempChange = asic.isFanOn
          ? (Math.random() - 0.5) * 0.4
          : (Math.random() * 0.3) + 0.2;

        const fanSpeedChange = asic.isFanOn
          ? (Math.random() - 0.5) * 2
          : 0;

        return {
          ...asic,
          hashrate: asic.hashrate + (Math.random() - 0.5) * 0.5,
          temperature: asic.temperature + tempChange,
          power: asic.isFanOn ? asic.power + (Math.random() - 0.5) * 10 : asic.power - 5, // Power consumption drops slightly if fan is off
          fanSpeed: asic.isFanOn ? Math.min(100, Math.max(20, asic.fanSpeed + fanSpeedChange)) : 0,
        };
      });
      setAsics(updatedAsics);

      setChartData(prevData => {
        const now = new Date();
        const newEntry: { [key: string]: any } = {
          time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        };
        updatedAsics.forEach(asic => {
          newEntry[`${asic.id}_hashrate`] = asic.hashrate;
        });
        return [...prevData.slice(-29), newEntry];
      });

    }, 2000);

    return () => clearInterval(interval);
  }, [asics, alertState]);

  useEffect(() => {
    const hotAsic = asics.find(a => a.temperature >= maxTemp);
    if (hotAsic && alertState === 'ok') {
      setAlertState('alerting');
      setShowAlertDialog(true);
    }
  }, [asics, maxTemp, alertState]);

  useEffect(() => {
    let shutdownTimer: NodeJS.Timeout;
    if (alertState === 'alerting') {
      shutdownTimer = setTimeout(() => {
        setAlertState('shutdown');
        setShowAlertDialog(false);
      }, shutdownDelay);
    }
    return () => clearTimeout(shutdownTimer);
  }, [alertState, shutdownDelay]);

  const handleDismissAlert = () => {
    setShowAlertDialog(false);
    setAlertState('ok');
    // Reset temperatures to a safe level to prevent immediate re-triggering
    setAsics(prevAsics =>
      prevAsics.map(asic => ({ ...asic, temperature: asic.temperature - 10 }))
    );
  };

  const averages = useMemo(() => ({
    hashrate: asics.reduce((acc, a) => acc + a.hashrate, 0),
    temperature: asics.reduce((acc, a) => acc + a.temperature, 0) / asics.length,
    power: asics.reduce((acc, a) => acc + a.power, 0),
    fanSpeed: asics.reduce((acc, a) => acc + a.fanSpeed, 0) / asics.length,
  }), [asics]);

  const backgroundClass = {
    'ok': 'bg-gray-900 from-gray-900 to-black',
    'alerting': 'bg-red-900 from-red-900 to-black animate-pulse',
    'shutdown': 'bg-black from-black to-black',
  }[alertState];

  return (
    <div className={cn("min-h-screen text-white bg-gradient-to-b p-4 sm:p-8 transition-all duration-[5000ms] ease-in-out", backgroundClass)}>
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-light tracking-wider">ASIC <span className="font-bold">COMMAND</span></h1>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="text-center">
            <p className="text-sm text-gray-400">Temp. Alerte</p>
            <p className="text-lg font-bold">{maxTemp}°C</p>
          </div>
          <Slider defaultValue={[85]} max={100} min={50} step={1} onValueChange={(v) => setMaxTemp(v[0])} className="w-32" />
          <Select onValueChange={(v) => setShutdownDelay(Number(v))} defaultValue={String(shutdownDelay)}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
              <SelectValue placeholder="Délai d'arrêt" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="15000">15 secondes</SelectItem>
              <SelectItem value="30000">30 secondes</SelectItem>
              <SelectItem value="60000">1 minute</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {alertState === 'shutdown' ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <PowerOff className="w-24 h-24 text-red-500 mb-4" />
          <h2 className="text-5xl font-bold text-red-500">ARRÊT D'URGENCE</h2>
          <p className="text-xl text-gray-400 mt-2">Les systèmes ont été mis hors tension pour cause de surchauffe non résolue.</p>
        </div>
      ) : (
        <main className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg bg-gray-900/50 border border-gray-700">
              <h3 className="text-gray-400 mb-2">Hashrate Total</h3>
              <p className="text-3xl font-bold">{averages.hashrate.toFixed(2)} <span className="text-xl">TH/s</span></p>
            </div>
            <div className="p-6 rounded-lg bg-gray-900/50 border border-gray-700">
              <h3 className="text-gray-400 mb-2">Conso. Totale</h3>
              <p className="text-3xl font-bold">{(averages.power / 1000).toFixed(2)} <span className="text-xl">kW</span></p>
            </div>
            <div className="p-6 rounded-lg bg-gray-900/50 border border-gray-700">
              <h3 className="text-gray-400 mb-2">Temp. Moyenne</h3>
              <p className="text-3xl font-bold">{averages.temperature.toFixed(2)} <span className="text-xl">°C</span></p>
            </div>
            <div className="p-6 rounded-lg bg-gray-900/50 border border-gray-700">
              <h3 className="text-gray-400 mb-2">Ventil. Moyen</h3>
              <p className="text-3xl font-bold">{averages.fanSpeed.toFixed(2)} <span className="text-xl">%</span></p>
            </div>
          </div>

          <RealTimeChart data={chartData} asics={asics} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {asics.map(asic => (
              <ASICStatusCard 
                key={asic.id} 
                asic={asic} 
                isAlerting={asic.temperature >= maxTemp} 
                maxTemp={maxTemp}
                onToggleFan={handleToggleFan}
              />
            ))}
          </div>
        </main>
      )}

      <AlertDialog open={showAlertDialog}>
        <AlertDialogContent className="bg-red-900 border-red-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-2xl">
              <AlertTriangle className="text-yellow-300" />
              <span>ALERTE SURCHAUFFE !</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-200">
              La température d'un ASIC a dépassé le seuil de {maxTemp}°C.
              Arrêt automatique des systèmes dans {shutdownDelay / 1000} secondes si aucune action n'est prise.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDismissAlert} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
              Acquitter l'alerte
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MadeWithDyad />
    </div>
  );
};

export default Index;