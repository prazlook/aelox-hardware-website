"use client";

import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface TerminalLineItemProps {
  text: string;
  isGlitching: boolean;
  isRemoving: boolean;
  onComplete?: () => void;
}

const TerminalLineItem = ({ text, isGlitching, isRemoving, onComplete }: TerminalLineItemProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    const speed = 20; // Vitesse d'écriture rapide
    
    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) {
        clearInterval(intervalId);
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return (
    <div 
      className={cn(
        "transition-all duration-300 min-h-[1.2em]",
        isGlitching && "animate-glitch-orange",
        isRemoving && "animate-futuristic-exit",
        isTyping && "typewriter-cursor"
      )}
    >
      {displayedText}
    </div>
  );
};

export default TerminalLineItem;