import { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

export type ASICStatus = 'online' | 'offline' | 'booting up' | 'shutting down' | 'error' | 'standby' | 'idle' | 'overclocked' | 'overheat';

export interface ASIC {
  id: string;
  name: string;
  model: string;
  status: ASICStatus;
  hashrate: number;
  temperature: number;
  power: number;
  fanSpeed: number;
  isFanOn: boolean;
  comment: string;
  isForceStopping?: boolean;
}

const MOCK_ASICS: ASIC[] = [
  { id: 'A1', name: 'Antminer S19 Pro #2', model: 'Bitmain Antminer S19 Pro', status: 'online', hashrate: 102.79, temperature: 69.17, power: 3338, fanSpeed: 85, isFanOn: true, comment: "Pool principal - Performance stable" },
  { id: 'A2', name: 'Antminer S19 Pro #1', model: 'Bitmain Antminer S19 Pro', status: 'online', hashrate: 103.98, temperature: 65.26, power: 3149, fanSpeed: 71, isFanOn: true, comment: "Pool secondaire - RAS" },
  { id: 'A3', name: 'Bitmain Antmin S23 Hyd 3U #1', model: 'Bitmain Antmin S23 Hyd 3U', status: 'offline', hashrate: 0, temperature: 25, power: 0, fanSpeed: 0, isFanOn: false, comment: "Maintenance prévue" },
];

interface AsicContextType {
  asics: ASIC[];
  setAsics: Dispatch<SetStateAction<ASIC[]>>;
}

const AsicContext = createContext<AsicContextType | undefined>(undefined);

export const AsicProvider = ({ children }: { children: ReactNode }) => {
  const [asics, setAsics] = useState<ASIC[]>(MOCK_ASICS);

  return (
    <AsicContext.Provider value={{ asics, setAsics }}>
      {children}
    </AsicContext.Provider>
  );
};

export const useAsics = () => {
  const context = useContext(AsicContext);
  if (context === undefined) {
    throw new Error('useAsics must be used within an AsicProvider');
  }
  return context;
};