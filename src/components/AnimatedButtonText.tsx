import React, { useEffect, useState } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';
import { cn } from '@/lib/utils';

interface AnimatedButtonTextProps {
  children: string; // Le texte à taper
  startTypingDelay: number; // Le délai avant que la saisie ne commence
  typingSpeed?: number; // Vitesse de l'effet machine à écrire
}

export const AnimatedButtonText = ({ children, startTypingDelay, typingSpeed = 20 }: AnimatedButtonTextProps) => {
  const [shouldStartTyping, setShouldStartTyping] = useState(false);
  const { displayedText, isTypingComplete } = useTypewriter(shouldStartTyping ? children : '', typingSpeed);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorAnimationFinished, setCursorAnimationFinished] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShouldStartTyping(true);
      setShowCursor(true); // Afficher le curseur lorsque la saisie commence
    }, startTypingDelay * 1000);

    return () => clearTimeout(timeoutId);
  }, [startTypingDelay]);

  useEffect(() => {
    if (isTypingComplete && showCursor && !cursorAnimationFinished) {
      // Une fois la saisie terminée, le curseur doit clignoter 3 fois et disparaître.
      // La durée de l'animation 'button-text-cursor-blink' est de 1.2s.
      const cursorDisappearTimeout = setTimeout(() => {
        setCursorAnimationFinished(true);
      }, 1200); 

      return () => clearTimeout(cursorDisappearTimeout);
    }
  }, [isTypingComplete, showCursor, cursorAnimationFinished]);

  return (
    <span className="relative inline-flex items-center h-full">
      {displayedText}
      {showCursor && !cursorAnimationFinished && (
        <span
          className={cn(
            "inline-block w-3 h-full bg-white ml-1 relative top-[1px]", // Curseur vertical large
            isTypingComplete ? "animate-button-text-cursor-blink" : "animate-blink-infinite"
          )}
        />
      )}
    </span>
  );
};