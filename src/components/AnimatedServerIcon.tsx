import React from 'react';
import { cn } from '@/lib/utils';

export const AnimatedServerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={cn("animate-server-blink", props.className)}
  >
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line className="light-1" x1="6" y1="6" x2="6.01" y2="6" />
    <line className="light-2" x1="6" y1="18" x2="6.01" y2="18" />
    <line className="light-3" x1="10" y1="6" x2="10.01" y2="6" />
    <line className="light-4" x1="14" y1="6" x2="14.01" y2="6" />
    <line className="light-5" x1="10" y1="18" x2="10.01" y2="18" />
    <line className="light-6" x1="14" y1="18" x2="14.01" y2="18" />
    <line className="light-7" x1="18" y1="6" x2="18.01" y2="6" />
    <line className="light-8" x1="18" y1="18" x2="18.01" y2="18" />
  </svg>
);