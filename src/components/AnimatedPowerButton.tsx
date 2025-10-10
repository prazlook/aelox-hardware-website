"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Power } from 'lucide-react';
import { cn } from '@/lib/utils';

const AnimatedPowerButton = ({ onClick }: { onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const size = 200; // Taille globale du SVG
  const centerX = size / 2;
  const centerY = size / 2;
  const circleRadius = 40; // Rayon du cercle central du bouton

  // Données des chemins de circuit simplifiés (approximant l'image)
  const circuitPathsData = [
    // Arcs principaux autour du cercle central
    `M${centerX + circleRadius * Math.cos(Math.PI / 4)} ${centerY - circleRadius * Math.sin(Math.PI / 4)} 
     C${centerX + 60} ${centerY - 60}, ${centerX + 80} ${centerY - 40}, ${centerX + 70} ${centerY - 10}`,
    `M${centerX + circleRadius * Math.cos(-Math.PI / 4)} ${centerY - circleRadius * Math.sin(-Math.PI / 4)} 
     C${centerX + 60} ${centerY + 60}, ${centerX + 80} ${centerY + 40}, ${centerX + 70} ${centerY + 10}`,
    `M${centerX - circleRadius * Math.cos(Math.PI / 4)} ${centerY - circleRadius * Math.sin(Math.PI / 4)} 
     C${centerX - 60} ${centerY - 60}, ${centerX - 80} ${centerY - 40}, ${centerX - 70} ${centerY - 10}`,
    `M${centerX - circleRadius * Math.cos(-Math.PI / 4)} ${centerY - circleRadius * Math.sin(-Math.PI / 4)} 
     C${centerX - 60} ${centerY + 60}, ${centerX - 80} ${centerY + 40}, ${centerX - 70} ${centerY + 10}`,
     // Petits segments supplémentaires pour plus de détails
     `M${centerX + 50} ${centerY - 70} L${centerX + 60} ${centerY - 80} L${centerX + 70} ${centerY - 70}`,
     `M${centerX - 50} ${centerY - 70} L${centerX - 60} ${centerY - 80} L${centerX - 70} ${centerY - 70}`,
     `M${centerX + 50} ${centerY + 70} L${centerX + 60} ${centerY + 80} L${centerX + 70} ${centerY + 70}`,
     `M${centerX - 50} ${centerY + 70} L${centerX - 60} ${centerY + 80} L${centerX - 70} ${centerY + 70}`,
  ];

  // Calcule la longueur de chaque chemin SVG pour l'animation stroke-dashoffset
  useEffect(() => {
    pathRefs.current.forEach((pathElement) => {
      if (pathElement) {
        const length = pathElement.getTotalLength();
        pathElement.style.setProperty('--path-length', `${length}px`);
      }
    });
  }, [circuitPathsData]);

  // Fonction pour créer les points d'un hexagone
  const createHexagonPoints = (cx: number, cy: number, r: number) => {
    let points = "";
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * i;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points += `${x},${y} `;
    }
    return points.trim();
  };

  const hexagonSize = 10;
  const hexagons = [
    { cx: centerX - 80, cy: centerY - 30, r: hexagonSize, color: 'text-theme-cyan' },
    { cx: centerX - 90, cy: centerY + 10, r: hexagonSize, color: 'text-theme-cyan' },
    { cx: centerX - 70, cy: centerY + 50, r: hexagonSize, color: 'text-theme-cyan' },
    { cx: centerX + 80, cy: centerY - 30, r: hexagonSize, color: 'text-theme-magenta' },
    { cx: centerX + 90, cy: centerY + 10, r: hexagonSize, color: 'text-theme-magenta' },
    { cx: centerX + 70, cy: centerY + 50, r: hexagonSize, color: 'text-theme-magenta' },
    { cx: centerX - 100, cy: centerY - 60, r: hexagonSize * 0.8, color: 'text-theme-cyan' },
    { cx: centerX + 100, cy: centerY - 60, r: hexagonSize * 0.8, color: 'text-theme-magenta' },
    { cx: centerX - 100, cy: centerY + 60, r: hexagonSize * 0.8, color: 'text-theme-cyan' },
    { cx: centerX + 100, cy: centerY + 60, r: hexagonSize * 0.8, color: 'text-theme-magenta' },
  ];

  return (
    <button
      className="relative flex items-center justify-center transition-all duration-300 ease-in-out group focus:outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ width: size, height: size }}
    >
      {/* Hexagones en arrière-plan */}
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {hexagons.map((hex, index) => (
          <polygon
            key={index}
            points={createHexagonPoints(hex.cx, hex.cy, hex.r)}
            className={cn(
              `fill-current transition-opacity duration-300 ease-in-out`,
              hex.color,
              isHovered ? 'opacity-50' : 'opacity-0'
            )}
            style={{ transitionDelay: `${index * 0.03}s` }} // Apparition échelonnée
          />
        ))}
      </svg>

      {/* Lignes de circuit imprimé */}
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="gradient-circuit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFFF" /> {/* Cyan */}
            <stop offset="100%" stopColor="#FF00FF" /> {/* Magenta */}
          </linearGradient>
        </defs>
        {circuitPathsData.map((d, index) => (
          <path
            key={index}
            ref={(el) => (pathRefs.current[index] = el)}
            d={d}
            fill="none"
            stroke="url(#gradient-circuit)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 'var(--path-length)',
              strokeDashoffset: isHovered ? '0' : 'var(--path-length)',
              transition: `stroke-dashoffset 0.5s ease-out ${index * 0.05}s`, // Dessin échelonné
            }}
          />
        ))}
      </svg>

      {/* Bouton d'alimentation central */}
      <div
        className={cn(
          `relative rounded-full flex items-center justify-center 
          bg-gradient-to-br from-theme-cyan to-theme-magenta 
          shadow-lg transition-all duration-300 ease-in-out`,
          isHovered ? 'scale-105 shadow-cyan-500/50' : 'scale-100 shadow-none'
        )}
        style={{ width: circleRadius * 2, height: circleRadius * 2 }}
      >
        <Power className="w-12 h-12 text-white" />
      </div>
    </button>
  );
};

export default AnimatedPowerButton;