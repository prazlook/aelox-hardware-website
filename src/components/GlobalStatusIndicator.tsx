import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ASIC } from './ASICStatusCard';
import { ASIC_STATUS_COLORS } from '@/config/status-colors';
import { cn } from '@/lib/utils';
import { useAppStatus } from '@/context/AppStatusContext'; // Import useAppStatus

export type StatusLevel = 'optimal' | 'eleve' | 'surcharge' | 'error' | 'offline';

interface GlobalStatusIndicatorProps {
  status: StatusLevel;
  hashrate: number;
  asics: ASIC[];
  isOverclockedMajority: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const statusConfig = {
  optimal: { color: '#39FF14' }, // Neon Green
  eleve: { color: '#FFD700' }, // Gold/Yellow
  surcharge: { color: '#FF0000' }, // Red
  error: { color: '#FF0000' }, // Red
  offline: { color: '#9ca3af' }, // Gray
};

const BAR_COUNT = 100;
const PARTICLE_COUNT = 20;
const WAVEFORM_COUNT = 4;
const SPOKE_COUNT = 6;

const VIEWBOX_WIDTH = 800;
const VIEWBOX_HEIGHT = 200;
const CIRCLE_CX = VIEWBOX_WIDTH / 2;
const CIRCLE_CY = VIEWBOX_HEIGHT / 2;
const RADIUS = 70;

export const GlobalStatusIndicator = ({ status, hashrate, asics, isOverclockedMajority, className, style }: GlobalStatusIndicatorProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [rotation, setRotation] = useState(0);
  const { triggerStartupAnimation } = useAppStatus();

  const [dynamicValues, setDynamicValues] = useState({
    barHeights: Array.from({ length: BAR_COUNT }, () => Math.random() * 5),
    waveformPointsArray: [] as string[],
    ecgPath: '',
    particles: [] as { x: number, y: number, size: number, tx: number, ty: number, delay: number }[],
    orbRadius: 0,
    orbOpacity: 0,
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
        tx: (Math.random() - 0.5) * 120,
        ty: (Math.random() - 0.5) * 120,
        delay: Math.random() * -10,
      }))
    }));
  }, []);

  useEffect(() => {
    if (status === 'offline') {
      return;
    }

    const animationInterval = isOverclockedMajority ? 60 : 120;

    const intervalId = setInterval(() => {
      setDynamicValues(prev => {
        const intensity = Math.min(hashrate / 120, 1.2);
        setRotation(prevRot => (prevRot + (isOverclockedMajority ? 1.5 : 0.5)) % 360);

        const newBarHeights = Array.from({ length: BAR_COUNT }, () => {
          const baseHeight = Math.random() * (15 + 50 * intensity);
          return Math.random() > 0.92 ? baseHeight * 3 : baseHeight;
        });

        const newWaveformPointsArray = [];
        for (let j = 0; j < WAVEFORM_COUNT; j++) {
          const waveformRadius = RADIUS * (0.3 + j * 0.2);
          const waveformAmplitude = (3 + 8 * intensity) / (j + 1);
          const points = Array.from({ length: 50 }, (_, i) => {
            const angle = (i / 49) * Math.PI * 2;
            const r = waveformRadius + (Math.random() - 0.5) * waveformAmplitude;
            const x = CIRCLE_CX + Math.cos(angle) * r;
            const y = CIRCLE_CY + Math.sin(angle) * r;
            return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
          }).join(' ') + ' Z';
          newWaveformPointsArray.push(points);
        }
        
        let path = `M -200 ${CIRCLE_CY}`;
        const ecgBaseAmplitude = 5 + 25 * intensity; // Base amplitude for non-flat modes
        const segmentMinLength = 80; // Minimum length of a segment
        const segmentMaxLength = 250; // Maximum length of a segment
        let currentX = -200;
        let lastY = CIRCLE_CY; // To ensure smooth transitions between segments

        while (currentX < VIEWBOX_WIDTH + 200) {
          const segmentLength = segmentMinLength + Math.random() * (segmentMaxLength - segmentMinLength);
          const segmentEndX = Math.min(currentX + segmentLength, VIEWBOX_WIDTH + 200);

          const rand = Math.random();
          let segmentMode: 'flat' | 'low' | 'high';
          if (rand < 0.3) segmentMode = 'flat'; // 30% flat
          else if (rand < 0.8) segmentMode = 'low'; // 50% low
          else segmentMode = 'high'; // 20% high

          // Start the segment from the last point to ensure continuity
          path += ` L ${currentX} ${lastY.toFixed(2)}`;

          for (let x = currentX + 4; x <= segmentEndX; x += 4) {
            let yVariation = 0;
            switch (segmentMode) {
              case 'flat':
                yVariation = (Math.random() - 0.5) * 1; // Very small noise for flat
                break;
              case 'low':
                // Peaks mostly upwards (negative yVariation)
                yVariation = -(Math.random() * ecgBaseAmplitude * 0.5);
                if (Math.random() > 0.95) yVariation -= Math.random() * ecgBaseAmplitude * 0.5; // Occasional larger upward spike
                // Add a small chance for a slight dip downwards to break monotony
                if (Math.random() > 0.98) yVariation += Math.random() * ecgBaseAmplitude * 0.1;
                break;
              case 'high':
                // Peaks mostly upwards (negative yVariation) with higher amplitude
                yVariation = -(Math.random() * ecgBaseAmplitude * 1.5);
                if (Math.random() > 0.8) yVariation -= Math.random() * ecgBaseAmplitude * 1.0; // More frequent larger upward spikes
                // Add a small chance for a slight dip downwards
                if (Math.random() > 0.95) yVariation += Math.random() * ecgBaseAmplitude * 0.2;
                break;
            }
            lastY = CIRCLE_CY + yVariation;
            path += ` L ${x} ${lastY.toFixed(2)}`;
          }
          currentX = segmentEndX;
        }

        const time = Date.now() / (isOverclockedMajority ? 300 : 500);
        const newOrbRadius = 15 + (Math.sin(time) * 5 + 5) * intensity;
        const newOrbOpacity = 0.4 + (Math.sin(time * 0.7) * 0.2 + 0.2) * intensity;

        return {
          ...prev,
          barHeights: newBarHeights,
          waveformPointsArray: newWaveformPointsArray,
          ecgPath: path,
          orbRadius: newOrbRadius,
          orbOpacity: newOrbOpacity,
        };
      });
    }, animationInterval);

    return () => clearInterval(intervalId);
  }, [hashrate, status, isOverclockedMajority]);

  const bars = useMemo(() => {
    const asicCount = asics.length;
    if (asicCount === 0) return [];

    return dynamicValues.barHeights.map((baseHeight, i) => {
      const angleDegrees = (i / BAR_COUNT) * 360;
      
      const asicIndex = i % asicCount;
      const asicStatus = asics[asicIndex]?.status || 'offline';
      let barColor = isOverclockedMajority ? `hsl(${(angleDegrees + Date.now() / 20) % 360}, 100%, 70%)` : ASIC_STATUS_COLORS[asicStatus];
      let totalHeight = baseHeight;

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
          totalHeight += 40 * Math.pow(proximity, 2);
          if (isOverclockedMajority) {
            barColor = `hsl(${(angleDegrees + Date.now() / 20) % 360}, 100%, ${70 + 20 * proximity}%)`;
          } else {
            barColor = color; // Use the main status color for highlighting
          }
        }
      }

      return (
        <rect
          key={i}
          x={CIRCLE_CX - 0.75}
          y={CIRCLE_CY - RADIUS - totalHeight}
          width="1.5"
          height={totalHeight}
          transform={`rotate(${angleDegrees} ${CIRCLE_CX} ${CIRCLE_CY})`}
          fill={barColor}
          style={{ transition: 'height 0.07s ease-out, y 0.07s ease-out, fill 0.1s linear', animationDelay: triggerStartupAnimation ? `${1.6 + i * 0.015}s` : '0s' }}
          className={cn(triggerStartupAnimation && "animate-global-indicator-bars-grow")}
        />
      );
    });
  }, [dynamicValues.barHeights, asics, mousePosition, isOverclockedMajority, color, triggerStartupAnimation]);

  const strokeColor = isOverclockedMajority ? "url(#overclock-gradient)" : "currentColor";

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} width="100%" height="100%" className={cn("overflow-visible", className)} style={style} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="overclock-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffb3ba" />
          <stop offset="20%" stopColor="#ffdfba" />
          <stop offset="40%" stopColor="#ffffba" />
          <stop offset="60%" stopColor="#baffc9" />
          <stop offset="80%" stopColor="#bae1ff" />
          <stop offset="100%" stopColor="#e0baff" />
          <animate attributeName="x1" from="-100%" to="100%" dur="8s" repeatCount="indefinite" />
          <animate attributeName="x2" from="0%" to="200%" dur="8s" repeatCount="indefinite" />
        </linearGradient>
        <radialGradient id="orb-gradient">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="70%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      <g 
        style={{ transition: 'color 0.5s ease, filter 0.3s ease-out' }} 
        color={color} 
        opacity={status === 'offline' ? 0.5 : 1}
        filter={mousePosition ? 'brightness(1.3)' : 'brightness(1)'}
      >
        {/* Particles - appear first */}
        <g className={cn(triggerStartupAnimation && "animate-global-indicator-fade-in")} style={triggerStartupAnimation ? { animationDelay: '0.1s' } : {}}>
          {status !== 'offline' && dynamicValues.particles.map((p, i) => (
            <rect
              key={i}
              x={p.x}
              y={p.y}
              width={p.size}
              height={p.size}
              fill={strokeColor}
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

        {/* Orb - appears second */}
        <circle
          cx={CIRCLE_CX}
          cy={CIRCLE_CY}
          r={dynamicValues.orbRadius}
          fill="url(#orb-gradient)"
          opacity={dynamicValues.orbOpacity}
          style={{ transition: 'r 0.1s ease-out, opacity 0.1s ease-out', animationDelay: triggerStartupAnimation ? '0.3s' : '0s' }}
          className={cn(triggerStartupAnimation && "animate-global-indicator-fade-in")}
        />

        {/* Waveforms (ronds internes à externes) - appear third */}
        {dynamicValues.waveformPointsArray.map((points, i) => (
            <path
                key={i}
                d={points}
                fill="none"
                stroke={strokeColor}
                strokeWidth={i === 0 ? "2" : i === 1 ? "1" : "0.5"}
                opacity={1 - i * 0.25}
                filter={i === 0 ? "url(#glow)" : "none"}
                style={{ transition: 'd 0.07s ease-out, stroke 0.3s linear', animationDelay: triggerStartupAnimation ? `${0.5 + i * 0.1}s` : '0s' }}
                className={cn(triggerStartupAnimation && "animate-global-indicator-waveform-draw")}
            />
        ))}
        
        {/* Spokes (traits externes qui se développent en cercle) - appear fourth */}
        <g style={{ transition: 'transform 0.1s linear' }}>
          {Array.from({ length: SPOKE_COUNT }).map((_, i) => (
            <line
              key={i}
              x1={CIRCLE_CX}
              y1={CIRCLE_CY}
              x2={CIRCLE_CX}
              y2={CIRCLE_CY - RADIUS * 1.5}
              stroke={strokeColor}
              strokeWidth="1"
              opacity="0.3"
              transform={`rotate(${(360 / SPOKE_COUNT) * i} ${CIRCLE_CX} ${CIRCLE_CY})`}
              style={{ 
                '--final-rotation': `${(360 / SPOKE_COUNT) * i}deg`,
                animationDelay: triggerStartupAnimation ? `${1.0 + i * 0.05}s` : '0s'
              } as React.CSSProperties}
            />
          ))}
        </g>

        {/* Bars (petits traits externes) - appear fifth */}
        <g opacity="0.6">{bars}</g> {/* Bars already have their own animation class */}

        {/* ECG Path (ligne horizontale) - appears last */}
        <path
          d={dynamicValues.ecgPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          filter="url(#glow)"
          style={{ transition: 'd 0.07s linear, stroke 0.3s linear', animationDelay: triggerStartupAnimation ? '2.0s' : '0s' }}
          className={cn(status === 'offline' ? 'ecg-line ecg-line-off' : 'ecg-line ecg-line-on', triggerStartupAnimation && "animate-global-indicator-ecg-center-expand")}
        />
      </g>
    </svg>
  );
};