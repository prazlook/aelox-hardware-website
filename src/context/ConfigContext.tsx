import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface ConfigContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isAiEnabled: boolean;
  setIsAiEnabled: (enabled: boolean) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKey] = useState<string | null>(() => {
    return localStorage.getItem('geminiApiKey') || import.meta.env.VITE_GEMINI_API_KEY || null;
  });
  const [isAiEnabled, setIsAiEnabled] = useState<boolean>(() => {
    return localStorage.getItem('isAiEnabled') === 'true';
  });

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('geminiApiKey', apiKey);
    } else {
      localStorage.removeItem('geminiApiKey');
    }
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('isAiEnabled', String(isAiEnabled));
  }, [isAiEnabled]);

  return (
    <ConfigContext.Provider value={{ apiKey, setApiKey, isAiEnabled, setIsAiEnabled }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};