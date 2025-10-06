import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 50): [string, boolean] => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (text) {
      setIsTypingComplete(false);
      let i = 0;
      setDisplayedText('');
      const intervalId = setInterval(() => {
        setDisplayedText(text.substring(0, i));
        i++;
        if (i > text.length) {
          clearInterval(intervalId);
          setIsTypingComplete(true);
        }
      }, speed);

      return () => {
        clearInterval(intervalId);
        setIsTypingComplete(false);
      };
    } else {
      setDisplayedText('');
      setIsTypingComplete(true);
    }
  }, [text, speed]);

  return [displayedText, isTypingComplete];
};