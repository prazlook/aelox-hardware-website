import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';

interface AppStatusContextType {
  isAppRunning: boolean;
  startApp: () => void;
  stopApp: () => void;
  triggerStartupAnimation: boolean;
  triggerShutdownAnimation: boolean;
}

const AppStatusContext = createContext<AppStatusContextType | undefined>(undefined);

const getLocalStorageItem = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem('isAppRunning');
    if (storedValue !== null) {
      try {
        return JSON.parse(storedValue) as T;
      } catch (e) {
        return defaultValue;
      }
    }
  }
  return defaultValue;
};

export const AppStatusProvider = ({ children }: { children: ReactNode }) => {
  // Changé par défaut à false pour voir les hexagones au démarrage
  const [isAppRunning, setIsAppRunning] = useState<boolean>(() => getLocalStorageItem<boolean>('isAppRunning', false));
  const [triggerStartupAnimation, setTriggerStartupAnimation] = useState(false);
  const [triggerShutdownAnimation, setTriggerShutdownAnimation] = useState(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shutdownAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    localStorage.setItem('isAppRunning', JSON.stringify(isAppRunning));
  }, [isAppRunning]);

  const startApp = () => {
    setIsAppRunning(true);
    if (!triggerStartupAnimation) {
      setTriggerStartupAnimation(true);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationTimeoutRef.current = setTimeout(() => {
        setTriggerStartupAnimation(false);
      }, 3500);
    }
  };

  const stopApp = () => {
    setTriggerShutdownAnimation(true);
    if (shutdownAnimationTimeoutRef.current) {
      clearTimeout(shutdownAnimationTimeoutRef.current);
    }
    shutdownAnimationTimeoutRef.current = setTimeout(() => {
      setIsAppRunning(false);
      setTriggerShutdownAnimation(false);
    }, 4000);

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    setTriggerStartupAnimation(false);
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