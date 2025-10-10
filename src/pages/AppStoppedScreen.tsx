"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PowerButton from '@/components/PowerButton'; // Revert to using the alias
import { useAppStatus } from '@/context/AppStatusContext';

const AppStoppedScreen: React.FC = () => {
  const navigate = useNavigate();
  const { startApp } = useAppStatus();

  const handleStartApplication = () => {
    console.log('Starting application...');
    startApp();
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4
                 bg-black text-theme-text-primary
                 relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(0,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,0,255,0.1) 0%, transparent 50%)',
      }}
    >
      <div className="relative z-10 text-center space-y-8">
        {/* Le titre "APPLICATION ARRÊTÉE" a été supprimé */}
        <p className="text-xl text-gray-400">
          Tous les systèmes sont hors ligne. Veuillez démarrer l'application.
        </p>

        <PowerButton onClick={handleStartApplication} />
      </div>
    </div>
  );
};

export default AppStoppedScreen;