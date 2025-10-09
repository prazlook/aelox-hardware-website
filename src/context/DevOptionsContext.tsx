import { createContext, useState, useContext, ReactNode } from 'react';

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

export const DevOptionsProvider = ({ children }: { children: ReactNode }) => {
  const [preventOverheat, setPreventOverheat] = useState<boolean>(false);
  const [preventErrors, setPreventErrors] = useState<boolean>(false);
  const [startupDelay, setStartupDelay] = useState<number>(3); // Default 3 seconds
  const [shutdownDelay, setShutdownDelay] = useState<number>(2); // Default 2 seconds

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