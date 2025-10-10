import React from 'react';
import { cn } from '@/lib/utils';
import { Power } from 'lucide-react';

interface FuturisticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const FuturisticButton: React.FC<FuturisticButtonProps> = ({ className, ...props }) => {
  return (
    <button
      className={cn(
        "relative flex items-center justify-center w-32 h-32 rounded-full bg-transparent",
        "transition-all duration-300 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-theme-dark",
        className
      )}
      {...props}
    >
      <Power
        className="w-full h-full text-theme-cyan power-button-glow"
        strokeWidth={2}
      />
    </button>
  );
};

export default FuturisticButton;