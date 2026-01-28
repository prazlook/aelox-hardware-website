"use client";

import React from 'react';
import { Power } from 'lucide-react';
import { useAppStatus } from '@/context/AppStatusContext';
import HoneycombButton from '@/components/HoneycombButton';
import { NeuralHexNetwork } from '@/components/NeuralHexNetwork';

const AppStoppedScreen = () => {
  const { startApp } = useAppStatus();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary p-4 overflow-hidden">
      {/* Réseau neuronal global en arrière-plan */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <NeuralHexNetwork fullScreen={true} />
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-md w-full">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            Système en Veille
          </h1>
          <p className="text-theme-text-secondary text-lg font-light tracking-widest uppercase">
            Initialisation du flux neuronale requise
          </p>
        </div>

        <div className="flex justify-center items-center py-12">
          <HoneycombButton
            onClick={startApp}
            aria-label="Démarrer l'application"
          >
            <Power className="w-8 h-8" />
            <span className="font-bold tracking-widest uppercase text-sm">Activer le Noyau</span>
          </HoneycombButton>
        </div>
      </div>

      {/* Superposition de gradient pour accentuer le centre */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,16,26,0.8)_100%)] z-5" />
    </div>
  );
};

export default AppStoppedScreen;