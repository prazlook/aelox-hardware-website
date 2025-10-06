import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 50) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (text) {
      let i = 0;
      setDisplayedText('');
      const intervalId = setInterval(() => {
        setDisplayedText(text.substring(0, i));
        i++;
        if (i > text.length) {
          clearInterval(intervalId);
        }
      }, speed);

      return () => clearInterval(intervalId);
    }
  }, [text, speed]);

  return displayedText;
};