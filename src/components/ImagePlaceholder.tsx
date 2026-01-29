"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  className?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
      >
        {/* Hexagone de fond */}
        <path
          d="M50 5L89 27.5V72.5L50 95L11 72.5V27.5L50 5Z"
          stroke="#00F0FF"
          strokeWidth="2"
          className="animate-pulse"
        />
        
        {/* Lettre 'A' stylisée en circuit/hardware */}
        <path
          d="M35 75L50 25L65 75"
          stroke="#00F0FF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40 60H60"
          stroke="#00F0FF"
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Points de jonction type circuit */}
        <circle cx="35" cy="75" r="3" fill="#00F0FF" />
        <circle cx="65" cy="75" r="3" fill="#00F0FF" />
        <circle cx="50" cy="25" r="3" fill="#00F0FF" />
        
        {/* Lignes de données décoratives */}
        <path
          d="M15 40H25"
          stroke="#00F0FF"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M75 60H85"
          stroke="#00F0FF"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    </div>
  );
};

export default ImagePlaceholder;