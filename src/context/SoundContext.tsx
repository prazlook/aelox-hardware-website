import { createContext, useState, useContext, ReactNode } from 'react';

interface SoundContextType {
  overheatSoundFile: File | null;
  setOverheatSoundFile: (file: File | null) => void;
  powerOnSoundFile: File | null;
  setPowerOnSoundFile: (file: File | null) => void;
  powerOffSoundFile: File | null;
  setPowerOffSoundFile: (file: File | null) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [overheatSoundFile, setOverheatSoundFile] = useState<File | null>(null);
  const [powerOnSoundFile, setPowerOnSoundFile] = useState<File | null>(null);
  const [powerOffSoundFile, setPowerOffSoundFile] = useState<File | null>(null);

  return (
    <SoundContext.Provider value={{
      overheatSoundFile,
      setOverheatSoundFile,
      powerOnSoundFile,
      setPowerOnSoundFile,
      powerOffSoundFile,
      setPowerOffSoundFile
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};