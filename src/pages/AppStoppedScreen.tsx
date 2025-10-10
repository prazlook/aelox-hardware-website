import { useAppStatus } from '@/context/AppStatusContext';
import { Power } from 'lucide-react'; // Import de l'icône Power

export const AppStoppedScreen = () => {
  const { startApp } = useAppStatus();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme-dark text-theme-text-primary p-4">
      <div
        className="relative w-[400px] h-[400px] rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 group
                   bg-[url('/images/futuristic-power-button.jpg')] bg-cover bg-center
                   hover:scale-105 hover:animate-pulse-glow"
        onClick={startApp}
      >
        <Power className="w-24 h-24 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};