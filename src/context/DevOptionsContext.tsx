import { createContext, useState, useContext, ReactNode } from 'react';

interface DevOptionsContextType {
  preventOverheat: boolean;
  setPreventOverheat: (prevent: boolean) => void;
  preventErrors: boolean;
  setPreventErrors: (prevent: boolean) => void;
}

const DevOptionsContext = createContext<DevOptionsContextType | undefined>(undefined);

export const DevOptionsProvider = ({ children }: { children: ReactNode }) => {
  const [preventOverheat, setPreventOverheat] = useState<boolean>(false);
  const [preventErrors, setPreventErrors] = useState<boolean>(false);

  return (
    <DevOptionsContext.Provider value={{
      preventOverheat,
      setPreventOverheat,
      preventErrors,
      setPreventErrors,
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