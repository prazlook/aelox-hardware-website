import { useAppStatus } from '@/context/AppStatusContext';
import { cn } from '@/lib/utils';

export const Header = () => {
  const { triggerStartupAnimation, triggerShutdownAnimation } = useAppStatus();

  return (
    <header className={cn(
      "bg-theme-card h-16 flex items-center justify-end px-6 fixed bottom-0 left-0 right-0 z-10", // Changé z-50 à z-10
      triggerStartupAnimation && "animate-startup-fade-in-scale",
      triggerShutdownAnimation && "animate-staggered-fade-out"
    )}
      style={triggerStartupAnimation ? { animationDelay: '0.5s' } : triggerShutdownAnimation ? { '--delay': '0.1s' } as React.CSSProperties : {}}
    >
      {/* Les badges spécifiques au minage ont été supprimés */}
      <div className="flex items-center space-x-4">
        {/* Vous pouvez ajouter ici des éléments pertinents pour un site d'entreprise, comme des liens de contact ou un menu utilisateur */}
      </div>
    </header>
  );
};