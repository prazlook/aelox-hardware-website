import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';

interface AppStatusContextType {
  isAppRunning: boolean;
  startApp: () => void;
  stopApp: () => void;
  triggerStartupAnimation: boolean; // New state to trigger animation
}

const AppStatusContext = createContext<AppStatusContextType | undefined>(undefined);

const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
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
  const [isAppRunning, setIsAppRunning] = useState<boolean>(() => getLocalStorageItem('isAppRunning', true));
  const [triggerStartupAnimation, setTriggerStartupAnimation] = useState(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    localStorage.setItem('isAppRunning', JSON.stringify(isAppRunning));
  }, [isAppRunning]);

  const startApp = () => {
    setIsAppRunning(true);
    // Trigger animation only if it's not already running
    if (!triggerStartupAnimation) {
      setTriggerStartupAnimation(true);
      // Reset trigger after a duration longer than the longest animation delay
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationTimeoutRef.current = setTimeout(() => {
        setTriggerStartupAnimation(false);
      }, 4000); // Reduced duration to match new faster animations
    }
  };

  const stopApp = () => {
    setIsAppRunning(false);
    // Clear any pending animation trigger if app is stopped
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    setTriggerStartupAnimation(false); // Ensure animation is not triggered on next start unless explicitly called
  };

  return (
    <AppStatusContext.Provider value={{
      isAppRunning,
      startApp,
      stopApp,
      triggerStartupAnimation,
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