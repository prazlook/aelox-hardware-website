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
const PARTICLE_COUNT = 10;
const WAVEFORM_COUNT = 3;

export const GlobalStatusIndicator = ({ status, hashrate }: GlobalStatusIndicatorProps) => {
  const [dynamicValues, setDynamicValues] = useState({
    barHeights: [] as number[],
    waveformPointsArray: [] as string[],
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
        size: Math.random() * 1.5 + 0.5,
        tx: (Math.random() - 0.5) * 100,
        ty: (Math.random() - 0.5) * 100,
        delay: Math.random() * -8,
      }))
    }));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const intensity = Math.min(hashrate / 150, 1);

      const newBarHeights = Array.from({ length: BAR_COUNT }, () => 
        Math.random() * (3 + 12 * intensity)
      );

      const newWaveformPointsArray = [];
      for (let j = 0; j < WAVEFORM_COUNT; j++) {
        const waveformRadius = RADIUS * (0.4 + j * 0.2);
        const waveformAmplitude = (2 + 6 * intensity) / (j + 1);
        const points = Array.from({ length: 40 }, (_, i) => {
          const angle = (i / 39) * Math.PI * 2;
          const r = waveformRadius + (Math.random() - 0.5) * waveformAmplitude;
          const x = 50 + Math.cos(angle) * r;
          const y = 50 + Math.sin(angle) * r;
          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
        }).join(' ') + ' Z';
        newWaveformPointsArray.push(points);
      }
      
      let path = 'M -5 50';
      const ecgAmplitude = 1 + 10 * intensity;
      for (let i = -5; i <= 105; i += 2) {
        let y = 50;
        if (i % 20 > 10 && i % 20 < 14) {
            y += (Math.random() - 0.5) * ecgAmplitude * (1 - Math.abs(12 - (i%20)) / 2);
        } else {
            y += (Math.random() - 0.5) * ecgAmplitude * 0.2;
        }
        path += ` L ${i} ${y.toFixed(2)}`;
      }

      setDynamicValues(prev => ({
        ...prev,
        barHeights: newBarHeights,
        waveformPointsArray: newWaveformPointsArray,
        ecgPath: path,
      }));
    }, 150);

    return () => clearInterval(intervalId);
  }, [hashrate]);

  const bars = useMemo(() => {
    return dynamicValues.barHeights.map((height, i) => {
      const angle = (i / BAR_COUNT) * 360;
      return (
        <rect
          key={i}
          x="49.8"
          y={50 - RADIUS - height}
          width="0.4"
          height={height}
          transform={`rotate(${angle} 50 50)`}
          fill={color}
          style={{ transition: 'height 0.1s ease-out' }}
        />
      );
    });
  }, [dynamicValues.barHeights, color]);

  return (
    <svg viewBox="0 0 100 100" width="48" height="48" className="overflow-visible">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <g style={{ transition: 'color 0.5s ease' }} color={color}>
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
              opacity="0.7"
            />
          ))}
        </g>

        <g opacity="0.6">{bars}</g>

        {dynamicValues.waveformPointsArray.map((points, i) => (
            <path
                key={i}
                d={points}
                fill="none"
                stroke="currentColor"
                strokeWidth={i === WAVEFORM_COUNT - 1 ? "1" : "0.5"}
                opacity={1 - i * 0.2}
                filter={i === WAVEFORM_COUNT - 1 ? "url(#glow)" : "none"}
                style={{ transition: 'd 0.1s ease-out' }}
            />
        ))}
        
        <path
          d={dynamicValues.ecgPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.8"
          filter="url(#glow)"
          style={{ transition: 'd 0.1s linear' }}
        />
      </g>
    </svg>
  );
};