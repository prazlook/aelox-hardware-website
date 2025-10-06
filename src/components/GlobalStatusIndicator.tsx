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

const BAR_COUNT = 90;
const PARTICLE_COUNT = 15;
const WAVEFORM_COUNT = 3;

const VIEWBOX_WIDTH = 800;
const VIEWBOX_HEIGHT = 150;
const CIRCLE_CX = VIEWBOX_WIDTH / 2;
const CIRCLE_CY = VIEWBOX_HEIGHT / 2;
const RADIUS = 50;

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
        x: Math.random() * VIEWBOX_WIDTH,
        y: Math.random() * VIEWBOX_HEIGHT,
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

      const newBarHeights = Array.from({ length: BAR_COUNT }, () => {
        const baseHeight = Math.random() * (5 + 30 * intensity);
        return Math.random() > 0.95 ? baseHeight * 2.5 : baseHeight;
      });

      const newWaveformPointsArray = [];
      for (let j = 0; j < WAVEFORM_COUNT; j++) {
        const waveformRadius = RADIUS * (0.4 + j * 0.2);
        const waveformAmplitude = (2 + 6 * intensity) / (j + 1);
        const points = Array.from({ length: 40 }, (_, i) => {
          const angle = (i / 39) * Math.PI * 2;
          const r = waveformRadius + (Math.random() - 0.5) * waveformAmplitude;
          const x = CIRCLE_CX + Math.cos(angle) * r;
          const y = CIRCLE_CY + Math.sin(angle) * r;
          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
        }).join(' ') + ' Z';
        newWaveformPointsArray.push(points);
      }
      
      let path = `M -5 ${CIRCLE_CY}`;
      const ecgAmplitude = 1 + 10 * intensity;
      for (let i = -5; i <= VIEWBOX_WIDTH + 5; i += 4) {
        let y = CIRCLE_CY;
        if (Math.random() > 0.97) {
            y += (Math.random() - 0.5) * ecgAmplitude * 3;
        } else {
            y += (Math.random() - 0.5) * ecgAmplitude * 0.4;
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
          x={CIRCLE_CX - 0.25}
          y={CIRCLE_CY - RADIUS - height}
          width="0.5"
          height={height}
          transform={`rotate(${angle} ${CIRCLE_CX} ${CIRCLE_CY})`}
          fill={color}
          style={{ transition: 'height 0.1s ease-out' }}
        />
      );
    });
  }, [dynamicValues.barHeights, color]);

  return (
    <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} width="100%" height="100%" className="overflow-visible" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
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
                strokeWidth={i === WAVEFORM_COUNT - 1 ? "1.5" : "0.75"}
                opacity={1 - i * 0.2}
                filter={i === WAVEFORM_COUNT - 1 ? "url(#glow)" : "none"}
                style={{ transition: 'd 0.1s ease-out' }}
            />
        ))}
        
        <path
          d={dynamicValues.ecgPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.8"
          filter="url(#glow)"
          style={{ transition: 'd 0.1s linear' }}
        />
      </g>
    </svg>
  );
};