import { useState } from 'react';
import { useAsics } from '@/context/AsicContext';
import { ASICStatusCard } from '@/components/ASICStatusCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const IndexPage = () => {
  const { asics, updateAsicStatus } = useAsics();
  const [searchTerm, setSearchTerm] = useState('');

  const handlePowerAction = (id: string, action: 'shutdown' | 'reboot' | 'idle' | 'standby' | 'start') => {
    const asic = asics.find(a => a.id === id);
    if (!asic) return;

    switch (action) {
      case 'shutdown':
        updateAsicStatus(id, 'Off');
        break;
      case 'reboot':
        updateAsicStatus(id, 'Rebooting');
        setTimeout(() => updateAsicStatus(id, 'Online'), 3000);
        break;
      case 'idle':
        updateAsicStatus(id, 'Idle');
        break;
      case 'standby':
        updateAsicStatus(id, 'Standby');
        break;
      case 'start':
        updateAsicStatus(id, 'Online');
        break;
    }
  };

  const filteredAsics = asics.filter(asic =>
    asic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 text-white">
      <h1 className="text-4xl font-bold mb-2">Tableau de Bord</h1>
      <p className="text-theme-text-secondary mb-8">Vue d'ensemble de vos ASICs</p>
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher un ASIC..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-theme-card border-gray-700/50 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredAsics.map(asic => (
          <ASICStatusCard key={asic.id} asic={asic} onPowerAction={handlePowerAction} />
        ))}
      </div>
    </div>
  );
};

export default IndexPage;