"use client";

import React from 'react';
import { Power } from 'lucide-react';

interface PowerButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const PowerButton: React.FC<PowerButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative w-40 h-40 rounded-full flex items-center justify-center
                 bg-black border-2 border-transparent
                 transition-all duration-300 ease-in-out
                 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-75
                 group
                 shadow-[0_0_20px_rgba(0,255,255,0.5),_0_0_40px_rgba(128,0,128,0.5)]
                 hover:shadow-[0_0_30px_rgba(0,255,255,0.7),_0_0_60px_rgba(128,0,128,0.7)]"
    >
      <Power
        className="relative z-10 w-20 h-20
                   text-blue-300
                   drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]
                   group-hover:text-blue-100 group-hover:scale-110
                   group-hover:drop-shadow-[0_0_15px_rgba(0,255,255,1)]
                   transition-all duration-300 ease-in-out"
      />
      <div className="absolute inset-0 rounded-full
                      bg-gradient-to-br from-blue-500/30 to-purple-600/30
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300 ease-in-out"></div>
    </button>
  );
};

export default PowerButton;