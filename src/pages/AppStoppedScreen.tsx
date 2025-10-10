import React from 'react';
import FuturisticButton from '@/components/FuturisticButton';

interface AppStoppedScreenProps {
  onRestart: () => void;
}

const AppStoppedScreen: React.FC<AppStoppedScreenProps> = ({ onRestart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary p-4">
      <div className="text-center space-y-6">
        {/* Le texte descriptif a été supprimé pour un affichage plus épuré */}
        <FuturisticButton onClick={onRestart} />
      </div>
    </div>
  );
};

export default AppStoppedScreen;