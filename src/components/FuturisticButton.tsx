import React from 'react';
import { cn } from '@/lib/utils';

interface FuturisticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const FuturisticButton: React.FC<FuturisticButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        "relative group overflow-hidden px-8 py-3 text-lg font-semibold text-white bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg shadow-lg",
        "transition-all duration-300 ease-in-out",
        "hover:from-blue-700 hover:to-purple-800 hover:shadow-xl",
        className
      )}
      {...props}
    >
      {/* Ligne du haut */}
      <span className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent group-hover:w-full transition-all duration-300 ease-out"></span>
      {/* Ligne de droite */}
      <span className="absolute top-0 right-0 h-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-300 to-transparent group-hover:h-full transition-all duration-300 ease-out delay-150"></span>
      {/* Ligne du bas */}
      <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-gradient-to-l from-transparent via-cyan-300 to-transparent group-hover:w-full transition-all duration-300 ease-out delay-300"></span>
      {/* Ligne de gauche */}
      <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-gradient-to-t from-transparent via-cyan-300 to-transparent group-hover:h-full transition-all duration-300 ease-out delay-[450ms]"></span>

      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default FuturisticButton;