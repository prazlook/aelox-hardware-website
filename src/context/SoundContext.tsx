import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { showError } from '@/utils/toast';

interface SoundContextType {
  overheatSoundFile: File | null;
  setOverheatSoundFile: (file: File | null) => void;
  powerOnSoundFile: File | null;
  setPowerOnSoundFile: (file: File | null) => void;
  powerOffSoundFile: File | null;
  setPowerOffSoundFile: (file: File | null) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const MAX_AUDIO_SIZE_MB = 2; // Max 2MB for localStorage
const MAX_AUDIO_SIZE_BYTES = MAX_AUDIO_SIZE_MB * 1024 * 1024;

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_AUDIO_SIZE_BYTES) {
      reject(new Error(`La taille du fichier dépasse la limite de ${MAX_AUDIO_SIZE_MB} Mo pour la persistance.`));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Helper to create a File-like object from Base64 (for display and playback)
const base64ToFileLike = (base64: string, name: string, type: string): File => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: type });
  return new File([blob], name, { type: type, lastModified: Date.now() });
};


export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [overheatSoundFile, setOverheatSoundFileState] = useState<File | null>(null);
  const [powerOnSoundFile, setPowerOnSoundFileState] = useState<File | null>(null);
  const [powerOffSoundFile, setPowerOffSoundFileState] = useState<File | null>(null);

  // Generic setter for sound files
  const setSoundFile = useCallback(async (key: string, file: File | null, setState: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        localStorage.setItem(`${key}_name`, file.name);
        localStorage.setItem(`${key}_type`, file.type);
        localStorage.setItem(`${key}_data`, base64);
        setState(file); // Set the actual File object for immediate use
      } catch (error: any) {
        showError(error.message || "Erreur lors de la sauvegarde du fichier audio.");
        localStorage.removeItem(`${key}_name`);
        localStorage.removeItem(`${key}_type`);
        localStorage.removeItem(`${key}_data`);
        setState(null);
      }
    } else {
      localStorage.removeItem(`${key}_name`);
      localStorage.removeItem(`${key}_type`);
      localStorage.removeItem(`${key}_data`);
      setState(null);
    }
  }, []);

  // Custom setters using the generic one
  const setOverheatSoundFile = useCallback((file: File | null) => setSoundFile('sound_overheat', file, setOverheatSoundFileState), [setSoundFile]);
  const setPowerOnSoundFile = useCallback((file: File | null) => setSoundFile('sound_powerOn', file, setPowerOnSoundFileState), [setSoundFile]);
  const setPowerOffSoundFile = useCallback((file: File | null) => setSoundFile('sound_powerOff', file, setPowerOffSoundFileState), [setSoundFile]);


  // Load files from localStorage on initial mount
  useEffect(() => {
    const loadSound = (key: string, setState: React.Dispatch<React.SetStateAction<File | null>>) => {
      const name = localStorage.getItem(`${key}_name`);
      const type = localStorage.getItem(`${key}_type`);
      const data = localStorage.getItem(`${key}_data`);
      if (name && type && data) {
        try {
          setState(base64ToFileLike(data, name, type));
        } catch (e) {
          console.error(`Error loading sound for key "${key}":`, e);
          localStorage.removeItem(`${key}_name`);
          localStorage.removeItem(`${key}_type`);
          localStorage.removeItem(`${key}_data`);
        }
      }
    };

    loadSound('sound_overheat', setOverheatSoundFileState);
    loadSound('sound_powerOn', setPowerOnSoundFileState);
    loadSound('sound_powerOff', setPowerOffSoundFileState);
  }, [setOverheatSoundFileState, setPowerOnSoundFileState, setPowerOffSoundFileState]); // Added setters to dependencies

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