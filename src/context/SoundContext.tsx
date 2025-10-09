import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface SoundContextType {
  overheatSoundFile: File | null;
  setOverheatSoundFile: (file: File | null) => void;
  powerOnSoundFile: File | null;
  setPowerOnSoundFile: (file: File | null) => void;
  powerOffSoundFile: File | null;
  setPowerOffSoundFile: (file: File | null) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const getSoundFileName = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [overheatSoundFile, setOverheatSoundFile] = useState<File | null>(null);
  const [powerOnSoundFile, setPowerOnSoundFile] = useState<File | null>(null);
  const [powerOffSoundFile, setPowerOffSoundFile] = useState<File | null>(null);

  // Load file names from localStorage on initial mount
  useEffect(() => {
    const storedOverheatName = getSoundFileName('sound_overheatFileName');
    if (storedOverheatName) {
      // We can't recreate the File object, but we can set a dummy one for display
      setOverheatSoundFile(new File([], storedOverheatName, { type: 'audio/mpeg' }));
    }
    const storedPowerOnName = getSoundFileName('sound_powerOnFileName');
    if (storedPowerOnName) {
      setPowerOnSoundFile(new File([], storedPowerOnName, { type: 'audio/mpeg' }));
    }
    const storedPowerOffName = getSoundFileName('sound_powerOffFileName');
    if (storedPowerOffName) {
      setPowerOffSoundFile(new File([], storedPowerOffName, { type: 'audio/mpeg' }));
    }
  }, []);

  // Save file names to localStorage when files change
  useEffect(() => {
    if (overheatSoundFile) {
      localStorage.setItem('sound_overheatFileName', overheatSoundFile.name);
    } else {
      localStorage.removeItem('sound_overheatFileName');
    }
  }, [overheatSoundFile]);

  useEffect(() => {
    if (powerOnSoundFile) {
      localStorage.setItem('sound_powerOnFileName', powerOnSoundFile.name);
    } else {
      localStorage.removeItem('sound_powerOnFileName');
    }
  }, [powerOnSoundFile]);

  useEffect(() => {
    if (powerOffSoundFile) {
      localStorage.setItem('sound_powerOffFileName', powerOffSoundFile.name);
    } else {
      localStorage.removeItem('sound_powerOffFileName');
    }
  }, [powerOffSoundFile]);

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