"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  className?: string;
}

const Logo: React.FC<ImagePlaceholderProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-10 h-10 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagone extérieur (Contour) */}
      <path
        d="M50 5L93.3013 30V70L50 95L6.69873 70V30L50 5Z"
        stroke="currentColor"
        strokeWidth="3"
        className="text-theme-cyan"
      />
      
      {/* Hexagone intérieur (Ombrage) */}
      <path
        d="M50 20L75.9808 35V65L50 80L24.0192 65V35L50 20Z"
        fill="currentColor"
        className="text-theme-cyan/10"
      />

      {/* Cœur technologique (Le "Core") */}
      <rect
        x="40"
        y="40"
        width="20"
        height="20"
        rx="2"
        fill="currentColor"
        className="text-theme-cyan"
      >
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>

      {/* Lignes de circuit */}
      <path
        d="M50 5V20 M50 80V95 M6.69873 30L24.0192 35 M75.9808 35L93.3013 30 M6.69873 70L24.0192 65 M75.9808 65L93.3013 70"
        stroke="currentColor"
        strokeWidth="2"
        className="text-theme-cyan"
        strokeLinecap="round"
      />

      {/* Petit point central brillant */}
      <circle cx="50" cy="50" r="3" fill="white" className="animate-pulse" />
    </svg>
  );
};

export default Logo;