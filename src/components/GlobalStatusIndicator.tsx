import React, { useState, useEffect, useMemo } from 'react';

type StatusLevel = 'optimal' | 'faible' | 'eleve' | 'surcharge';

interface GlobalStatusIndicatorProps {
  status: StatusLevel;
  hashrate: number;
}

const statusConfig = {
  faible: { color: '#3b82f6' },
  optimal: { color: '#00F0FF' },
  eleve: { color: '#f97316' },
  surcharge: { color: '#ef4444' },
};

const BAR_COUNT = 72;
const RADIUS = 40;
const PARTICLE_COUNT = 5;

export const GlobalStatusIndicator = ({ status, hashrate }: GlobalStatusIndicatorProps) => {
  const [dynamicValues, setDynamicValues] = useState({
    barHeights: [] as number[],
    waveformPoints: '',
    ecgPath: '',
    particles: [] as { x: number, y: number, size: number, tx: number, ty: number, delay: number }[]
  });

  const { color } = statusConfig[status];

  useEffect(() => {
    setDynamicValues(prev => ({
      ...prev,
      particles: Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        tx: (Math.random() - 0.5) * 80,
        ty: (Math.random() - 0.5) * 80,
        delay: Math.random() * -6,
      }))
    }));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const intensity = Math.min(hashrate / 150, 1);

      const newBarHeights = Array.from({ length: BAR_COUNT }, () => 
        Math.random() * (5 + 15 * intensity)
      );

      const waveformRadius = RADIUS * 0.6;
      const waveformAmplitude = 3 + 10 * intensity;
      const points = Array.from({ length: 40 }, (_, i) => {
        const angle = (i / 39) * Math.PI * 2;
        const r = waveformRadius + (Math.random() - 0.5) * waveformAmplitude;
        const x = 50 + Math.cos(angle) * r;
        const y = 50 + Math.sin(angle) * r;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      }).join(' ') + ' Z';
      
      let path = 'M -5 50';
      const ecgAmplitude = 2 + 8 * intensity;
      for (let i = -5; i <= 105; i += 4) {
        let y = 50 + (Math.random() - 0.5) * ecgAmplitude;
        if (Math.random() > 0.95) {
          y += (Math.random() - 0.5) * ecgAmplitude * 2;
        }
        path += ` L ${i} ${y.toFixed(2)}`;
      }

      setDynamicValues(prev => ({
        ...prev,
        barHeights: newBarHeights,
        waveformPoints: points,
        ecgPath: path,
      }));
    }, 200);

    return () => clearInterval(intervalId);
  }, [hashrate]);

  const bars = useMemo(() => {
    return dynamicValues.barHeights.map((height, i) => {
      const angle = (i / BAR_COUNT) * 360;
      return (
        <rect
          key={i}
          x="49.75"
          y={50 - RADIUS - height}
          width="0.5"
          height={height}
          transform={`rotate(${angle} 50 50)`}
          fill={color}
          style={{ transition: 'height 0.15s ease-out' }}
        />
      );
    });
  }, [dynamicValues.barHeights, color]);

  return (
    <svg viewBox="0 0 100 100" width="48" height="48" className="overflow-visible">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <g style={{ transition: 'color 0.5s ease' }} color={color}>
        <path
          d={dynamicValues.ecgPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
          style={{ transition: 'd 0.15s linear' }}
        />

        <g>
          {dynamicValues.particles.map((p, i) => (
            <rect
              key={i}
              x={p.x}
              y={p.y}
              width={p.size}
              height={p.size}
              fill="currentColor"
              className="animate-float-particle"
              style={{
                '--tx': `${p.tx}px`,
                '--ty': `${p.ty}px`,
                animationDelay: `${p.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </g>

        <g opacity="0.7">{bars}</g>

        <path
          d={dynamicValues.waveformPoints}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          filter="url(#glow)"
          style={{ transition: 'd 0.15s ease-out' }}
        />
        
        <circle cx="50" cy="50" r={RADIUS * 0.4} fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      </g>
    </svg>
  );
};