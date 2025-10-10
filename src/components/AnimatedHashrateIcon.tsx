import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedHashrateIconProps extends React.SVGProps<SVGSVGElement> {
  isOverclockedMajority?: boolean;
}

export const AnimatedHashrateIcon = ({ className, isOverclockedMajority, ...props }: AnimatedHashrateIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isOverclockedMajority ? "url(#overclock-hashrate-gradient)" : "#00F0FF"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={cn("animate-hashrate-glitch", className)}
  >
    <defs>
      {isOverclockedMajority && (
        <linearGradient id="overclock-hashrate-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffb3ba" />
          <stop offset="20%" stopColor="#ffdfba" />
          <stop offset="40%" stopColor="#ffffba" />
          <stop offset="60%" stopColor="#baffc9" />
          <stop offset="80%" stopColor="#bae1ff" />
          <stop offset="100%" stopColor="#e0baff" />
          <animate attributeName="x1" from="-100%" to="100%" dur="8s" repeatCount="indefinite" />
          <animate attributeName="x2" from="0%" to="200%" dur="8s" repeatCount="indefinite" />
        </linearGradient>
      )}
    </defs>
    <path d="M2 12h6l3-7 3 14 3-7h6" />
  </svg>
);