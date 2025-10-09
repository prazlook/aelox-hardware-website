import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface DevOptionsContextType {
  preventOverheat: boolean;
  setPreventOverheat: (prevent: boolean) => void;
  preventErrors: boolean;
  setPreventErrors: (prevent: boolean) => void;
  startupDelay: number;
  setStartupDelay: (delay: number) => void;
  shutdownDelay: number;
  setShutdownDelay: (delay: number) => void;
}

const DevOptionsContext = createContext<DevOptionsContextType | undefined>(undefined);

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

export const DevOptionsProvider = ({ children }: { children: ReactNode }) => {
  const [preventOverheat, setPreventOverheat] = useState<boolean>(() => getLocalStorageItem('devOptions_preventOverheat', false));
  const [preventErrors, setPreventErrors] = useState<boolean>(() => getLocalStorageItem('devOptions_preventErrors', false));
  const [startupDelay, setStartupDelay] = useState<number>(() => getLocalStorageItem('devOptions_startupDelay', 3));
  const [shutdownDelay, setShutdownDelay] = useState<number>(() => getLocalStorageItem('devOptions_shutdownDelay', 2));

  useEffect(() => {
    localStorage.setItem('devOptions_preventOverheat', JSON.stringify(preventOverheat));
  }, [preventOverheat]);

  useEffect(() => {
    localStorage.setItem('devOptions_preventErrors', JSON.stringify(preventErrors));
  }, [preventErrors]);

  useEffect(() => {
    localStorage.setItem('devOptions_startupDelay', JSON.stringify(startupDelay));
  }, [startupDelay]);

  useEffect(() => {
    localStorage.setItem('devOptions_shutdownDelay', JSON.stringify(shutdownDelay));
  }, [shutdownDelay]);

  return (
    <DevOptionsContext.Provider value={{
      preventOverheat,
      setPreventOverheat,
      preventErrors,
      setPreventErrors,
      startupDelay,
      setStartupDelay,
      shutdownDelay,
      setShutdownDelay,
    }}>
      {children}
    </DevOptionsContext.Provider>
  );
};

export const useDevOptions = () => {
  const context = useContext(DevOptionsContext);
  if (context === undefined) {
    throw new Error('useDevOptions must be used within a DevOptionsProvider');
  }
  return context;
};