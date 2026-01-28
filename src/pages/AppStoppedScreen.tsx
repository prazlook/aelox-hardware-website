import React from 'react';
import { Power } from 'lucide-react';
import { useAppStatus } from '@/context/AppStatusContext';
import HoneycombButton from '@/components/HoneycombButton';

const AppStoppedScreen = () => {
  const { startApp } = useAppStatus();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary p-4 overflow-hidden">
      <div className="text-center space-y-8 max-w-md w-full">
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            Système en Veille
          </h1>
          <p className="text-theme-text-secondary text-lg">
            Appuyez pour initialiser le déploiement
          </p>
        </div>

        <div className="flex justify-center items-center py-10">
          <HoneycombButton
            onClick={startApp}
            aria-label="Démarrer l'application"
          >
            <Power className="w-8 h-8" />
            <span className="font-bold tracking-widest uppercase text-sm">Initialiser</span>
          </HoneycombButton>
        </div>
      </div>
    </div>
  );
};

export default AppStoppedScreen;