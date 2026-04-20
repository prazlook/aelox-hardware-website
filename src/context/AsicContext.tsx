"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ASICStatus = 'online' | 'offline' | 'booting up' | 'shutting down' | 'overclocked' | 'overheat' | 'error' | 'idle' | 'standby';

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
  comment?: string;
  isForceStopping?: boolean;
  fixedSpeed?: number;
}

interface AsicContextType {
  asics: ASIC[];
  setAsics: React.Dispatch<React.SetStateAction<ASIC[]>>;
}

const initialAsics: ASIC[] = [
  {
    id: '1',
    name: 'Bambu Lab X1C',
    model: 'X1-Carbon',
    status: 'online',
    hashrate: 500,
    temperature: 55,
    power: 350,
    fanSpeed: 80,
    isFanOn: true,
    fixedSpeed: 500,
  },
  /* 
    Template pour ajouter de nouvelles cartes à l'avenir :
    {
      id: '2',
      name: 'Nom de la machine',
      model: 'Modèle',
      status: 'offline',
      hashrate: 0,
      temperature: 25,
      power: 0,
      fanSpeed: 0,
      isFanOn: false,
      fixedSpeed: 300,
    },
  */
];

const AsicContext = createContext<AsicContextType | undefined>(undefined);

export const AsicProvider = ({ children }: { children: ReactNode }) => {
  const [asics, setAsics] = useState<ASIC[]>(initialAsics);

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