import React from 'react';
import { cn } from '@/lib/utils';

export const AnimatedHashrateIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
  >
    <path d="M2 12h6l3-7 3 14 3-7h6" />
  </svg>
);