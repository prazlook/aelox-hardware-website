import React from 'react';
import FuturisticButton from '@/components/FuturisticButton';

interface AppStoppedScreenProps {
  onRestart: () => void;
}

const AppStoppedScreen: React.FC<AppStoppedScreenProps> = ({ onRestart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary p-4">
      <div className="text-center space-y-6">
        <p className="text-xl text-gray-400">
          L'application est actuellement arrêtée. Veuillez la redémarrer pour continuer.
        </p>
        <FuturisticButton onClick={onRestart}>
          Redémarrer l'application
        </FuturisticButton>
      </div>
    </div>
  );
};

export default AppStoppedScreen;