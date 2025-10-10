"use client";

import React from 'react';
import { useAppStatus } from '@/context/AppStatusContext';
import AnimatedPowerButton from '@/components/AnimatedPowerButton'; // Import du nouveau composant

export const AppStoppedScreen = () => {
  const { startApplication } = useAppStatus();

  const handleStartApplication = () => {
    startApplication();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary p-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-red-500 animate-pulse">APPLICATION ARRÊTÉE</h1>
        <p className="text-xl text-gray-400">
          Tous les systèmes sont hors ligne.
        </p>
        <div className="mt-8">
          <AnimatedPowerButton onClick={handleStartApplication} />
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Cliquez sur le bouton pour démarrer l'application.
        </p>
      </div>
    </div>
  );
};