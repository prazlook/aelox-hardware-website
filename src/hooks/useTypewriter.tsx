import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 20) => { // Vitesse par défaut plus rapide
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (text) {
      let i = 0;
      setDisplayedText('');
      setIsTypingComplete(false);
      const intervalId = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(intervalId);
          setIsTypingComplete(true);
        }
      }, speed);

      return () => clearInterval(intervalId);
    } else {
      setDisplayedText('');
      setIsTypingComplete(true);
    }
  }, [text, speed]);

  return { displayedText, isTypingComplete };
};