import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { addAudioFile, getAudioFile, deleteAudioFile } from '@/lib/indexedDb';

interface SoundContextType {
  overheatSoundFile: File | null;
  setOverheatSoundFile: (file: File | null) => void;
  powerOnSoundFile: File | null;
  setPowerOnSoundFile: (file: File | null) => void;
  powerOffSoundFile: File | null;
  setPowerOffSoundFile: (file: File | null) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const getSoundFileNameFromLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [overheatSoundFile, setOverheatSoundFileState] = useState<File | null>(null);
  const [powerOnSoundFile, setPowerOnSoundFileState] = useState<File | null>(null);
  const [powerOffSoundFile, setPowerOffSoundFileState] = useState<File | null>(null);

  // Function to handle setting a sound file, including IndexedDB operations
  const setSoundFile = useCallback(async (
    file: File | null,
    currentFile: File | null,
    setFileState: (file: File | null) => void,
    localStorageKey: string
  ) => {
    if (file) {
      await addAudioFile(file);
      localStorage.setItem(localStorageKey, file.name);
      setFileState(file);
    } else {
      if (currentFile) {
        await deleteAudioFile(currentFile.name);
      }
      localStorage.removeItem(localStorageKey);
      setFileState(null);
    }
  }, []);

  // Initial load from localStorage and IndexedDB
  useEffect(() => {
    const loadSounds = async () => {
      const overheatName = getSoundFileNameFromLocalStorage('sound_overheatFileName');
      if (overheatName) {
        const file = await getAudioFile(overheatName);
        setOverheatSoundFileState(file);
      }

      const powerOnName = getSoundFileNameFromLocalStorage('sound_powerOnFileName');
      if (powerOnName) {
        const file = await getAudioFile(powerOnName);
        setPowerOnSoundFileState(file);
      }

      const powerOffName = getSoundFileNameFromLocalStorage('sound_powerOffFileName');
      if (powerOffName) {
        const file = await getAudioFile(powerOffName);
        setPowerOffSoundFileState(file);
      }
    };
    loadSounds();
  }, []);

  return (
    <SoundContext.Provider value={{
      overheatSoundFile,
      setOverheatSoundFile: (file) => setSoundFile(file, overheatSoundFile, setOverheatSoundFileState, 'sound_overheatFileName'),
      powerOnSoundFile,
      setPowerOnSoundFile: (file) => setSoundFile(file, powerOnSoundFile, setPowerOnSoundFileState, 'sound_powerOnFileName'),
      powerOffSoundFile,
      setPowerOffSoundFile: (file) => setSoundFile(file, powerOffSoundFile, setPowerOffSoundFileState, 'sound_powerOffFileName')
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