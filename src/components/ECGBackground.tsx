import React from 'react';

interface ECGBackgroundProps {
  onPeak?: () => void;
}

export const ECGBackground = ({ onPeak }: ECGBackgroundProps) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id="ecg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M -10 75 Q 20 10, 50 75 T 110 75 T 170 75 T 210 75"
          stroke="url(#ecg-grad)"
          strokeWidth="2"
          fill="none"
          className="animate-ecg-wave"
          filter="url(#glow)"
          onAnimationIteration={onPeak}
        />
      </svg>
    </div>
  );
};