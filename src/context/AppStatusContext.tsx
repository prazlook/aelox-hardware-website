import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AppStatusContextType {
  isAppRunning: boolean;
  startApp: () => void;
  stopApp: () => void;
}

const AppStatusContext = createContext<AppStatusContextType | undefined>(undefined);

export const AppStatusProvider = ({ children }: { children: ReactNode }) => {
  const [isAppRunning, setIsAppRunning] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const storedStatus = localStorage.getItem('isAppRunning');
      return storedStatus ? JSON.parse(storedStatus) : true; // Default to running
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('isAppRunning', JSON.stringify(isAppRunning));
  }, [isAppRunning]);

  const startApp = () => setIsAppRunning(true);
  const stopApp = () => setIsAppRunning(false);

  return (
    <AppStatusContext.Provider value={{ isAppRunning, startApp, stopApp }}>
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