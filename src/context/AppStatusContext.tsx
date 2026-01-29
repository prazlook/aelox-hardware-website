import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';

interface AppStatusContextType {
  isAppRunning: boolean;
  startApp: () => void;
  stopApp: () => void;
  triggerStartupAnimation: boolean;
  triggerShutdownAnimation: boolean; // New state for shutdown animation
}

const AppStatusContext = createContext<AppStatusContextType | undefined>(undefined);

const getLocalStorageItem = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      try {
        return JSON.parse(storedValue) as T;
      } catch (e) {
        console.error(`Error parsing localStorage key "${key}":`, e);
        return defaultValue;
      }
    }
  }
  return defaultValue;
};

export const AppStatusProvider = ({ children }: { children: ReactNode }) => {
  const [isAppRunning, setIsAppRunning] = useState<boolean>(() => getLocalStorageItem<boolean>('isAppRunning', false));
  const [triggerStartupAnimation, setTriggerStartupAnimation] = useState(false);
  const [triggerShutdownAnimation, setTriggerShutdownAnimation] = useState(false); // Initialize new state
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
    // Trigger shutdown animation
    setTriggerShutdownAnimation(true);
    if (shutdownAnimationTimeoutRef.current) {
      clearTimeout(shutdownAnimationTimeoutRef.current);
    }
    shutdownAnimationTimeoutRef.current = setTimeout(() => {
      setIsAppRunning(false);
      setTriggerShutdownAnimation(false); // Reset after animation completes
    }, 4000); // Duration of the shutdown animation (4 seconds)

    // Clear any pending startup animation trigger if app is stopped
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
      triggerShutdownAnimation, // Provide new state
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