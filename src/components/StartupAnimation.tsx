import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

interface StartupAnimationProps {
  onAnimationComplete: () => void;
}

const StartupAnimation = ({ onAnimationComplete }: StartupAnimationProps) => {
  const [phase, setPhase] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const fullText = "SYSTEM INITIALIZING...";
  const fullText2 = "LOADING MODULES...";
  const fullText3 = "SYSTEM READY.";

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    const animationDuration = 15000; // Total animation duration in ms

    // Phase 0: Initial black screen (brief)
    timers.push(setTimeout(() => setPhase(1), 500));

    // Phase 1: Grid lines appear
    timers.push(setTimeout(() => setPhase(2), 1500));

    // Phase 2: Central core forms
    timers.push(setTimeout(() => setPhase(3), 4000));

    // Phase 3: Typewriter text 1
    timers.push(setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(fullText.substring(0, i));
        i++;
        if (i > fullText.length) clearInterval(interval);
      }, 70);
      return () => clearInterval(interval);
    }, 5000));

    // Phase 4: Data flow lines
    timers.push(setTimeout(() => setPhase(4), 7000));

    // Phase 5: Typewriter text 2
    timers.push(setTimeout(() => {
      setDisplayedText(''); // Clear previous text
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(fullText2.substring(0, i));
        i++;
        if (i > fullText2.length) clearInterval(interval);
      }, 70);
      return () => clearInterval(interval);
    }, 9000));

    // Phase 6: Final system ready text and logo reveal
    timers.push(setTimeout(() => setPhase(5), 11000));
    timers.push(setTimeout(() => {
      setDisplayedText(''); // Clear previous text
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(fullText3.substring(0, i));
        i++;
        if (i > fullText3.length) clearInterval(interval);
      }, 70);
      return () => clearInterval(interval);
    }, 12000));


    // End of animation
    timers.push(setTimeout(onAnimationComplete, animationDuration));

    return () => timers.forEach(clearTimeout);
  }, [onAnimationComplete, fullText, fullText2, fullText3]);

  return (
    <div className="fixed inset-0 bg-theme-dark flex items-center justify-center z-[9999] overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
        {/* Background Grid Lines */}
        <g className={cn("transition-opacity duration-1000", phase >= 1 ? "opacity-100" : "opacity-0")}>
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={`h-line-${i}`}
              x1="0" y1={i * 30} x2="1000" y2={i * 30}
              stroke="#00F0FF" strokeOpacity="0.05" strokeWidth="0.5"
              className="animate-draw-line" style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
          {Array.from({ length: 34 }).map((_, i) => (
            <line
              key={`v-line-${i}`}
              x1={i * 30} y1="0" x2={i * 30} y2="600"
              stroke="#00F0FF" strokeOpacity="0.05" strokeWidth="0.5"
              className="animate-draw-line" style={{ animationDelay: `${i * 0.05 + 0.5}s` }}
            />
          ))}
        </g>

        {/* Central Core / Orb */}
        <g className={cn("transition-opacity duration-1000", phase >= 2 ? "opacity-100" : "opacity-0")}>
          <circle
            cx="500" cy="300" r="0" fill="none" stroke="#00F0FF" strokeWidth="2"
            className={cn("animate-core-expand", phase >= 2 && "animate-core-pulse")}
            style={{ animationDelay: '1s' }}
          >
            <animate attributeName="r" from="0" to="100" dur="2s" fill="freeze" />
          </circle>
          <circle
            cx="500" cy="300" r="0" fill="#00F0FF" opacity="0.1"
            className="animate-core-expand" style={{ animationDelay: '1.5s' }}
          >
            <animate attributeName="r" from="0" to="120" dur="2s" fill="freeze" />
          </circle>
        </g>

        {/* Data Flow Lines */}
        <g className={cn("transition-opacity duration-1000", phase >= 4 ? "opacity-100" : "opacity-0")}>
          {Array.from({ length: 10 }).map((_, i) => (
            <path
              key={`data-flow-${i}`}
              d={`M500,300 Q${500 + Math.cos(i * Math.PI / 5) * 150},${300 + Math.sin(i * Math.PI / 5) * 150} ${Math.random() * 1000},${Math.random() * 600}`}
              fill="none"
              stroke="#00F0FF"
              strokeWidth="1"
              strokeOpacity="0.3"
              className="animate-data-flow"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </g>

        {/* Final Logo Reveal */}
        <g className={cn("transition-opacity duration-1000", phase >= 5 ? "opacity-100" : "opacity-0")}>
          <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-theme-cyan animate-logo-reveal" />
        </g>
      </svg>

      {/* Text Display */}
      <div className="absolute text-center text-white text-2xl font-mono tracking-widest">
        <p className="animate-typewriter-startup">{displayedText}</p>
      </div>
    </div>
  );
};

export default StartupAnimation;