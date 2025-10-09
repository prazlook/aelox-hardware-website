import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';

type AppPhase = 'stopped' | 'intro' | 'main_ui_loading' | 'running';

interface AppStatusContextType {
  appPhase: AppPhase;
  startApp: () => void;
  stopApp: () => void;
}

const AppStatusContext = createContext<AppStatusContextType | undefined>(undefined);

const INTRO_DURATION = 4000; // Duration for the full-screen GlobalStatusIndicator animation + text + progress
const MAIN_UI_LOADING_DURATION = 1000; // Duration for the staggered main UI elements animation

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
  const [appPhase, setAppPhase] = useState<AppPhase>(() => {
    const isRunning = getLocalStorageItem<boolean>('isAppRunning', true); // Use old key for initial load
    return isRunning ? 'running' : 'stopped';
  });
  const introTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mainUiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Keep old localStorage key for compatibility, but manage phase internally
    localStorage.setItem('isAppRunning', JSON.stringify(appPhase === 'running' || appPhase === 'main_ui_loading' || appPhase === 'intro'));
  }, [appPhase]);

  const startApp = () => {
    setAppPhase('intro');

    // Clear any existing timeouts
    if (introTimeoutRef.current) clearTimeout(introTimeoutRef.current);
    if (mainUiTimeoutRef.current) clearTimeout(mainUiTimeoutRef.current);

    // Transition from intro to main_ui_loading
    introTimeoutRef.current = setTimeout(() => {
      setAppPhase('main_ui_loading');
      // Transition from main_ui_loading to running
      mainUiTimeoutRef.current = setTimeout(() => {
        setAppPhase('running');
      }, MAIN_UI_LOADING_DURATION);
    }, INTRO_DURATION);
  };

  const stopApp = () => {
    setAppPhase('stopped');
    if (introTimeoutRef.current) clearTimeout(introTimeoutRef.current);
    if (mainUiTimeoutRef.current) clearTimeout(mainUiTimeoutRef.current);
    introTimeoutRef.current = null;
    mainUiTimeoutRef.current = null;
  };

  return (
    <AppStatusContext.Provider value={{
      appPhase,
      startApp,
      stopApp,
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