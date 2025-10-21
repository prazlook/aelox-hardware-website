import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ASIC } from './ASICStatusCard';
import { ASIC_STATUS_COLORS } from '@/config/status-colors';
import { cn } from '@/lib/utils';
import { useAppStatus } from '@/context/AppStatusContext';

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
const WAVEFORM_COUNT = 4;

const VIEWBOX_WIDTH = 800;
const VIEWBOX_HEIGHT = 200;
const CIRCLE_CX = VIEWBOX_WIDTH / 2;
const CIRCLE_CY = VIEWBOX_HEIGHT / 2;
const RADIUS = 70;

// New interfaces for dynamic elements
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  initialAngle: number;
  speed: number;
  opacity: number;
  life: number; // 0 to 1, 1 is full life, 0 is dead
}

interface Ray {
  id: number;
  angle: number; // in degrees
  currentLength: number;
  maxLength: number;
  opacity: number;
  life: number; // 0 to 1
  color: string;
}

export const GlobalStatusIndicator = ({ status, hashrate, asics, isOverclockedMajority, className, style }: GlobalStatusIndicatorProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const { triggerStartupAnimation } = useAppStatus();

  const [dynamicElements, setDynamicElements] = useState<{
    barHeights: number[];
    waveformPointsArray: string[];
    ecgPath: string;
    particles: Particle[];
    rays: Ray[]; // New state for rays
    orbRadius: number;
    orbOpacity: number;
  }>({
    barHeights: Array.from({ length: BAR_COUNT }, () => Math.random() * 5),
    waveformPointsArray: [],
    ecgPath: '',
    particles: [],
    rays: [],
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
    if (status === 'offline') {
      setDynamicElements(prev => ({
        ...prev,
        particles: [],
        rays: [],
        orbRadius: 0,
        orbOpacity: 0,
        waveformPointsArray: [],
        ecgPath: '',
      }));
      return;
    }

    const animationInterval = 40; // 25 frames per second

    const intervalId = setInterval(() => {
      setDynamicElements(prev => {
        const intensity = Math.min(hashrate / 120, 1.2);

        // 1. Update Bars
        const newBarHeights = Array.from({ length: BAR_COUNT }, () => {
          const baseHeight = Math.random() * (15 + 50 * intensity);
          return Math.random() > 0.92 ? baseHeight * 3 : baseHeight;
        });

        // 2. Update Waveforms
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
        
        // 3. Update ECG Path
        let path = `M -200 ${CIRCLE_CY}`;
        const ecgAmplitude = 5 + 25 * intensity;
        for (let i = -200; i <= VIEWBOX_WIDTH + 200; i += 4) {
          let y = CIRCLE_CY;
          if (Math.random() > 0.96) {
              y += (Math.random() - 0.5) * ecgAmplitude * 3.5;
          } else {
              y += (Math.random() - 0.5) * ecgAmplitude * 0.5;
          }
          path += ` L ${i} ${y.toFixed(2)}`;
        }

        // 4. Update Orb
        const time = Date.now() / (isOverclockedMajority ? 200 : 300); // Faster pulse
        const newOrbRadius = 15 + (Math.sin(time) * 8 + 8) * intensity; // Larger pulse
        const newOrbOpacity = 0.5 + (Math.sin(time * 0.7) * 0.3 + 0.3) * intensity; // More opaque pulse

        // 5. Update Particles
        const updatedParticles = prev.particles
          .map(p => {
            if (p.life <= 0) return null;
            const newX = CIRCLE_CX + Math.cos(p.initialAngle) * (p.speed * (1 - p.life));
            const newY = CIRCLE_CY + Math.sin(p.initialAngle) * (p.speed * (1 - p.life));
            return {
              ...p,
              x: newX,
              y: newY,
              opacity: p.life,
              life: p.life - 0.02 // Fade out speed
            };
          })
          .filter(Boolean) as Particle[];

        if (Math.random() < 0.5) { // Spawn new particle more frequently
          const angle = Math.random() * Math.PI * 2;
          updatedParticles.push({
            id: Date.now() + Math.random(),
            x: CIRCLE_CX,
            y: CIRCLE_CY,
            size: Math.random() * 1.5 + 0.5,
            color: isOverclockedMajority ? `hsl(${(angle * 180 / Math.PI + Date.now() / 20) % 360}, 100%, 70%)` : color,
            initialAngle: angle,
            speed: Math.random() * 50 + 30,
            opacity: 1,
            life: 1,
          });
        }

        // 6. Update Rays (replacing Spokes)
        const updatedRays = prev.rays
          .map(r => {
            if (r.life <= 0) return null;
            return {
              ...r,
              currentLength: Math.min(r.maxLength, r.currentLength + 5), // Grow speed
              opacity: r.life,
              life: r.life - 0.03 // Fade out speed
            };
          })
          .filter(Boolean) as Ray[];

        if (Math.random() < 0.2) { // Spawn new ray periodically
          updatedRays.push({
            id: Date.now() + Math.random(),
            angle: Math.random() * 360,
            currentLength: 0,
            maxLength: RADIUS * (1.5 + Math.random() * 0.5),
            opacity: 1,
            life: 1,
            color: isOverclockedMajority ? `hsl(${(Math.random() * 360 + Date.now() / 20) % 360}, 100%, 70%)` : color,
          });
        }

        return {
          barHeights: newBarHeights,
          waveformPointsArray: newWaveformPointsArray,
          ecgPath: path,
          particles: updatedParticles,
          rays: updatedRays,
          orbRadius: newOrbRadius,
          orbOpacity: newOrbOpacity,
        };
      });
    }, animationInterval);

    return () => clearInterval(intervalId);
  }, [hashrate, status, isOverclockedMajority, color]);

  const bars = useMemo(() => {
    const asicCount = asics.length;
    if (asicCount === 0) return [];

    return dynamicElements.barHeights.map((baseHeight, i) => {
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
  }, [dynamicElements.barHeights, asics, mousePosition, isOverclockedMajority, color, triggerStartupAnimation]);

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
        {/* Particles */}
        <g className={cn(triggerStartupAnimation && "animate-global-indicator-fade-in")} style={triggerStartupAnimation ? { animationDelay: '0.1s' } : {}}>
          {status !== 'offline' && dynamicElements.particles.map((p) => (
            <rect
              key={p.id}
              x={p.x}
              y={p.y}
              width={p.size}
              height={p.size}
              fill={p.color}
              opacity={p.opacity * 0.7}
              transform={`translate(-${p.size / 2}, -${p.size / 2})`} // Center the particle
            />
          ))}
        </g>

        {/* Orb */}
        <circle
          cx={CIRCLE_CX}
          cy={CIRCLE_CY}
          r={dynamicElements.orbRadius}
          fill="url(#orb-gradient)"
          opacity={dynamicElements.orbOpacity}
          style={{ transition: 'r 0.1s ease-out, opacity 0.1s ease-out', animationDelay: triggerStartupAnimation ? '0.3s' : '0s' }}
          className={cn(triggerStartupAnimation && "animate-global-indicator-fade-in")}
        />

        {/* Waveforms (ronds internes à externes) */}
        {dynamicElements.waveformPointsArray.map((points, i) => (
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
        
        {/* Rays (replacing Spokes) */}
        <g className={cn(triggerStartupAnimation && "animate-global-indicator-fade-in")} style={triggerStartupAnimation ? { animationDelay: '1.0s' } : {}}>
          {dynamicElements.rays.map(ray => (
            <line
              key={ray.id}
              x1={CIRCLE_CX}
              y1={CIRCLE_CY}
              x2={CIRCLE_CX + Math.cos(ray.angle * Math.PI / 180) * ray.currentLength}
              y2={CIRCLE_CY + Math.sin(ray.angle * Math.PI / 180) * ray.currentLength}
              stroke={ray.color}
              strokeWidth="1.5"
              opacity={ray.opacity * 0.6}
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Bars (petits traits externes) */}
        <g opacity="0.6">{bars}</g>

        {/* ECG Path (ligne horizontale) */}
        <path
          d={dynamicElements.ecgPath}
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