"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AppStatusContextType {
  isAppRunning: boolean;
  startApplication: () => void; // Ajout de cette ligne
  stopApplication: () => void;
  triggerStartupAnimation: boolean;
  setTriggerStartupAnimation: (value: boolean) => void;
}

const AppStatusContext = createContext<AppStatusContextType | undefined>(undefined);

export const AppStatusProvider = ({ children }: { children: ReactNode }) => {
  const [isAppRunning, setIsAppRunning] = useState(false);
  const [triggerStartupAnimation, setTriggerStartupAnimation] = useState(false);

  const startApplication = () => {
    setIsAppRunning(true);
    setTriggerStartupAnimation(true); // Déclenche l'animation au démarrage
    // Réinitialise l'animation après un court délai pour permettre de la re-déclencher
    setTimeout(() => setTriggerStartupAnimation(false), 2000); 
  };

  const stopApplication = () => {
    setIsAppRunning(false);
  };

  return (
    <AppStatusContext.Provider value={{ isAppRunning, startApplication, stopApplication, triggerStartupAnimation, setTriggerStartupAnimation }}>
      {children}
    </AppStatusContext.Provider>
  );
};

export const useAppStatus = () => {
  const context = useContext(AppStatusContext);
  if (context === undefined) {
    throw new Error('useAppStatus must be used within an AppStatusProvider');
  }
  return context;
};