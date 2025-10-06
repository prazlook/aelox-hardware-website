import { useAsics } from '@/context/AsicContext';
import { AsicCard } from '@/components/AsicCard';
import { Button } from '@/components/ui/button';
import { Power, PowerOff, PlusCircle, Trash2, Settings, BarChart2 } from 'lucide-react';
import { AddAsicDialog } from '@/components/AddAsicDialog';
import { useState } from 'react';
import { BackgroundAnimation } from '@/components/BackgroundAnimation';
import { Link } from 'react-router-dom';

const IndexPage = () => {
  const { asics, addAsic, removeAsic, toggleAsic, startAll, stopAll, removeAllAsics } = useAsics();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleStartAll = () => {
    startAll();
  };

  const handleStopAll = () => {
    stopAll();
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BackgroundAnimation />
      </div>
      <main className="relative z-10 p-4 sm:p-8">
        <div className="relative z-10 flex justify-between items-center h-full px-6">
          <h1 className="text-3xl font-bold">Centre de Contrôle</h1>
          <div className="flex space-x-3">
            <Button onClick={handleStartAll} className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
              <Power className="w-4 h-4 mr-2" />
              Démarrer Tout
            </Button>
            <Button onClick={handleStopAll} className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
              <PowerOff className="w-4 h-4 mr-2" />
              Arrêter Tout
            </Button>
            <Link to="/statistics">
              <Button className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                <BarChart2 className="w-4 h-4 mr-2" />
                Statistiques
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {asics.map((asic) => (
            <AsicCard
              key={asic.id}
              asic={asic}
              onToggle={() => toggleAsic(asic.id)}
              onRemove={() => removeAsic(asic.id)}
            />
          ))}
          <div
            className="border-2 border-dashed border-gray-700/50 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-800/20 hover:border-gray-600 transition-colors cursor-pointer min-h-[280px]"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="w-10 h-10 mb-2" />
            <span>Ajouter un ASIC</span>
          </div>
        </div>

        {asics.length > 0 && (
          <div className="mt-8 flex justify-end space-x-4">
            <Button variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300">
              <Settings className="w-4 h-4 mr-2" />
              Gérer la configuration
            </Button>
            <Button variant="destructive" onClick={removeAllAsics}>
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer tout
            </Button>
          </div>
        )}
      </main>
      <AddAsicDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddAsic={addAsic} />
    </div>
  );
};

export default IndexPage;