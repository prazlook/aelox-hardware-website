import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedHashrateIconProps extends React.SVGProps<SVGSVGElement> {
  animationDuration?: number;
}

export const AnimatedHashrateIcon = ({ animationDuration = 2, ...props }: AnimatedHashrateIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00F0FF"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={cn("animate-ecg-draw", props.className)}
    style={{ ...props.style, animationDuration: `${animationDuration}s` }}
  >
    <path d="M2 12h6l3-7 3 14 3-7h6" />
  </svg>
);