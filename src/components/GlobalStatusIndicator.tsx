import React, { useState, useEffect, useMemo, useRef } from 'react';

export type StatusLevel = 'optimal' | 'eleve' | 'surcharge' | 'error' | 'offline';

interface GlobalStatusIndicatorProps {
  status: StatusLevel;
  hashrate: number;
}

const statusConfig = {
  optimal: { color: '#39FF14' }, // Neon Green
  eleve: { color: '#FFD700' }, // Gold/Yellow
  surcharge: { color: '#FF0000' }, // Red
  error: { color: '#FF0000' }, // Red
  offline: { color: '#9ca3af' }, // Gray
};

const BAR_COUNT = 90;
const PARTICLE_COUNT = 15;
const WAVEFORM_COUNT = 3;

const VIEWBOX_WIDTH = 800;
const VIEWBOX_HEIGHT = 200;
const CIRCLE_CX = VIEWBOX_WIDTH / 2;
const CIRCLE_CY = VIEWBOX_HEIGHT / 2;
const RADIUS = 70;

export const GlobalStatusIndicator = ({ status, hashrate }: GlobalStatusIndicatorProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [dynamicValues, setDynamicValues] = useState({
    barHeights: Array.from({ length: BAR_COUNT }, () => Math.random() * 5),
    waveformPointsArray: [] as string[],
    ecgPath: '',
    particles: [] as { x: number, y: number, size: number, tx: number, ty: number, delay: number }[]
  });

  const { color } = statusConfig[status];

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!svgRef.current) return;
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const svgX = (x / rect.width) * VIEWBOX_WIDTH;
      const svgY = (y / rect.height) * VIEWBOX_HEIGHT;
      setMousePosition({ x: svgX, y: svgY });
    };

    const handleMouseLeave = () => {
      setMousePosition(null);
    };

    const currentSvg = svgRef.current;
    currentSvg?.addEventListener('mousemove', handleMouseMove);
    currentSvg?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      currentSvg?.removeEventListener('mousemove', handleMouseMove);
      currentSvg?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

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
        const baseHeight = Math.random() * (10 + 40 * intensity);
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
      
      let path = `M -50 ${CIRCLE_CY}`;
      const ecgAmplitude = 2 + 15 * intensity;
      for (let i = -50; i <= VIEWBOX_WIDTH + 50; i += 4) {
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
    return dynamicValues.barHeights.map((baseHeight, i) => {
      const angleDegrees = (i / BAR_COUNT) * 360;
      let interactiveHeight = 0;

      if (mousePosition) {
        const dx = mousePosition.x - CIRCLE_CX;
        const dy = mousePosition.y - CIRCLE_CY;
        const mouseAngleDegrees = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;
        const normalizedMouseAngle = (mouseAngleDegrees + 360) % 360;

        let angleDiff = Math.abs(normalizedMouseAngle - angleDegrees);
        if (angleDiff > 180) angleDiff = 360 - angleDiff;

        const maxEffectAngle = 45;
        if (angleDiff < maxEffectAngle) {
          const proximity = 1 - (angleDiff / maxEffectAngle);
          interactiveHeight = 30 * Math.pow(proximity, 2);
        }
      }

      const totalHeight = baseHeight + interactiveHeight;

      return (
        <rect
          key={i}
          x={CIRCLE_CX - 0.75}
          y={CIRCLE_CY - RADIUS - totalHeight}
          width="1.5"
          height={totalHeight}
          transform={`rotate(${angleDegrees} ${CIRCLE_CX} ${CIRCLE_CY})`}
          fill={color}
          style={{ transition: 'height 0.1s ease-out, y 0.1s ease-out' }}
        />
      );
    });
  }, [dynamicValues.barHeights, color, mousePosition]);

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} width="100%" height="100%" className="overflow-visible" preserveAspectRatio="xMidYMid meet">
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
          strokeWidth="2"
          opacity="0.8"
          filter="url(#glow)"
          style={{ transition: 'd 0.1s linear' }}
        />
      </g>
    </svg>
  );
};