import { useMemo, useState, useEffect } from 'react';
import { useAsics } from '@/context/AsicContext';
import { StatCard } from '@/components/StatCard';

interface HistoryData {
  time: string;
  hashrate: number;
  temperature: number;
  power: number;
}

const StatisticsPage = () => {
  const { asics } = useAsics();
  const [history, setHistory] = useState<HistoryData[]>([]);

  useEffect(() => {
    const now = new Date();
    const time = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const totalHashrate = asics.reduce((acc, a) => acc + a.hashrate, 0);
    const totalPower = asics.reduce((acc, a) => acc + a.power, 0);
    const avgTemp = asics.length > 0 ? asics.reduce((acc, a) => acc + a.temperature, 0) / asics.length : 0;

    const newHistoryEntry: HistoryData = {
      time,
      hashrate: totalHashrate,
      temperature: avgTemp,
      power: totalPower,
    };

    setHistory(prevHistory => {
      const updatedHistory = [...prevHistory, newHistoryEntry];
      if (updatedHistory.length > 30) {
        return updatedHistory.slice(updatedHistory.length - 30);
      }
      return updatedHistory;
    });
  }, [asics]);

  const summary = useMemo(() => {
    const totalAsicsCount = asics.length > 0 ? asics.length : 1;
    const totalHashrate = asics.reduce((acc, a) => acc + a.hashrate, 0);
    const totalPower = asics.reduce((acc, a) => acc + a.power, 0);
    const avgTemp = asics.reduce((acc, a) => acc + a.temperature, 0) / totalAsicsCount;

    return {
      totalHashrate,
      avgTemp,
      totalPower,
    };
  }, [asics]);

  return (
    <div className="p-4 sm:p-8 text-white">
      <h1 className="text-4xl font-bold mb-2">Statistiques</h1>
      <p className="text-theme-text-secondary mb-8">Analyse détaillée des performances</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Hashrate Total"
          gaugeValue={summary.totalHashrate}
          gaugeMaxValue={400}
          gaugeUnit="TH/s"
          gaugeColor="#f97316"
          history={history}
          dataKey="hashrate"
        />
        <StatCard 
          title="Température Moyenne"
          gaugeValue={summary.avgTemp}
          gaugeMaxValue={120}
          gaugeUnit="°C"
          gaugeColor="#f59e0b"
          history={history}
          dataKey="temperature"
        />
        <StatCard 
          title="Consommation Totale"
          gaugeValue={summary.totalPower}
          gaugeMaxValue={12000}
          gaugeUnit="W"
          gaugeColor="#ef4444"
          history={history}
          dataKey="power"
        />
      </div>
    </div>
  );
};

export default StatisticsPage;