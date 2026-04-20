"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AppStatusContextType {
  isAppRunning: boolean;
  startApp: () => void;
  stopApp: () => void;
  triggerStartupAnimation: boolean;
  triggerShutdownAnimation: boolean;
}

const AppStatusContext = createContext<AppStatusContextType | undefined>(undefined);

export const AppStatusProvider = ({ children }: { children: ReactNode }) => {
  // L'application est maintenant active par défaut
  const [isAppRunning, setIsAppRunning] = useState<boolean>(true);
  const [triggerStartupAnimation, setTriggerStartupAnimation] = useState(false);
  const [triggerShutdownAnimation, setTriggerShutdownAnimation] = useState(false);

  const startApp = () => {
    setIsAppRunning(true);
  };

  const stopApp = () => {
    // On garde la possibilité d'arrêter si besoin, mais sans la séquence de transition forcée au début
    setTriggerShutdownAnimation(true);
    setTimeout(() => {
      setIsAppRunning(false);
      setTriggerShutdownAnimation(false);
    }, 1000); 
  };

  return (
    <AppStatusContext.Provider value={{
      isAppRunning,
      startApp,
      stopApp,
      triggerStartupAnimation,
      triggerShutdownAnimation,
    }}>
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