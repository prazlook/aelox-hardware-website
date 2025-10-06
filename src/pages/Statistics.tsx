import { useMemo } from 'react';
import { useAsics } from '@/context/AsicContext';
import { StatCard } from '@/components/StatCard';

const StatisticsPage = () => {
  const { asics } = useAsics();

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
        />
        <StatCard 
          title="Température Moyenne"
          gaugeValue={summary.avgTemp}
          gaugeMaxValue={120}
          gaugeUnit="°C"
          gaugeColor="#f59e0b"
        />
        <StatCard 
          title="Consommation Totale"
          gaugeValue={summary.totalPower}
          gaugeMaxValue={12000}
          gaugeUnit="W"
          gaugeColor="#ef4444"
        />
      </div>
    </div>
  );
};

export default StatisticsPage;