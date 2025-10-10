import React from 'react';
import { Button } from '@/components/ui/button';
import { Power } from 'lucide-react';
import { useAppStatus } from '@/context/AppStatusContext';

const AppStoppedScreen = () => {
  const { startApp } = useAppStatus();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary p-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-red-500 animate-pulse">APPLICATION ARRÊTÉE</h1>
        <p className="text-xl text-gray-400">
          Tous les systèmes sont hors ligne.
        </p>
        <Button
          onClick={startApp}
          className="mt-8 px-8 py-4 text-lg bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <Power className="w-6 h-6 mr-3" />
          Démarrer l'Application
        </Button>
      </div>
    </div>
  );
};

export default AppStoppedScreen;