"use client";

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  rotation: number;
  vRotation: number;
  life: number;
  isDying: boolean;
  flashOpacity: number;
  lineWidth: number; // Nouvelle propriété pour varier l'épaisseur
}

interface Connection {
  p1: number;
  p2: number;
  life: number;
  status: 'scintillating' | 'graying' | 'dying';
}

interface NeuralHexNetworkProps {
  fullScreen?: boolean;
}

export const NeuralHexNetwork = ({ fullScreen = false }: NeuralHexNetworkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const connections = useRef<Connection[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const createParticle = (centerX: number, centerY: number, forceInside = false): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const maxDist = fullScreen ? Math.max(canvas.width, canvas.height) * 0.5 : 150;
      const dist = forceInside ? Math.random() * (maxDist * 0.6) : Math.random() * maxDist;
      
      // Taille beaucoup plus variée : de 2 à 15 pixels
      const size = Math.random() * (fullScreen ? 12 : 10) + 2;
      
      return {
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * (fullScreen ? 0.3 : 0.6),
        vy: (Math.random() - 0.5) * (fullScreen ? 0.3 : 0.6),
        size: size,
        baseSize: size,
        rotation: Math.random() * Math.PI,
        vRotation: (Math.random() - 0.5) * 0.012,
        life: 1,
        isDying: false,
        flashOpacity: 0,
        // Épaisseur proportionnelle à la taille pour des traits plus prononcés
        lineWidth: Math.max(1, size / 4)
      };
    };

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      const count = fullScreen ? 80 : 50; // Un peu moins pour éviter la surcharge visuelle avec les traits épais
      particles.current = Array.from({ length: count }, () => createParticle(cx, cy, true));
    };

    const drawHex = (x: number, y: number, size: number, rotation: number, color: string, opacity: number, lineWidth: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = rotation + (i * Math.PI) / 3;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = color.replace('opacity', opacity.toString());
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      const maxHaloRadius = fullScreen 
        ? Math.max(canvas.width, canvas.height) * 0.45 
        : Math.min(canvas.width, canvas.height) * 0.4;

      particles.current.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRotation;

        const dist = Math.hypot(p.x - cx, p.y - cy);
        
        if (dist > maxHaloRadius && !p.isDying) {
          p.isDying = true;
        }

        if (p.isDying) {
          p.life -= 0.035;
          p.flashOpacity = p.life > 0.5 ? (1 - p.life) * 2 : p.life * 2;
          p.size = p.baseSize * (1 + (1 - p.life) * 1.8);
        }

        if (p.life <= 0) {
          particles.current[index] = createParticle(cx, cy, true);
          return;
        }

        const baseOpacity = fullScreen ? 0.35 : 0.65;
        const opacity = p.isDying 
          ? p.life * 0.5 
          : Math.max(0, (1 - dist / maxHaloRadius)) * baseOpacity;
        
        const color = p.isDying ? `rgba(255, 255, 255, opacity)` : `rgba(34, 197, 94, opacity)`;
        
        // On dessine l'hexagone avec son épaisseur spécifique
        drawHex(p.x, p.y, p.size, p.rotation, color, opacity, p.lineWidth);

        if (p.isDying) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = "white";
          drawHex(p.x, p.y, p.size, p.rotation, `rgba(255, 255, 255, ${p.flashOpacity})`, p.flashOpacity, p.lineWidth * 1.5);
          ctx.shadowBlur = 0;
        }
      });

      // Connections
      if (Math.random() > (fullScreen ? 0.94 : 0.91)) {
        const p1 = Math.floor(Math.random() * particles.current.length);
        const p2 = Math.floor(Math.random() * particles.current.length);
        const dist = Math.hypot(particles.current[p1].x - particles.current[p2].x, particles.current[p1].y - particles.current[p2].y);
        
        const maxConnDist = fullScreen ? 250 : 180;
        if (dist < maxConnDist && p1 !== p2 && !particles.current[p1].isDying && !particles.current[p2].isDying) {
          connections.current.push({ p1, p2, life: 1, status: 'scintillating' });
        }
      }

      connections.current = connections.current.filter(c => {
        const p1 = particles.current[c.p1];
        const p2 = particles.current[c.p2];
        if (!p1 || !p2 || p1.isDying || p2.isDying) return false;

        c.life -= 0.005;
        if (c.life > 0.75) c.status = 'scintillating';
        else if (c.life > 0.25) c.status = 'graying';
        else c.status = 'dying';

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (c.status === 'scintillating') {
          ctx.setLineDash([4, 8]);
          ctx.lineDashOffset = Date.now() / 35;
          ctx.strokeStyle = `rgba(34, 197, 94, ${Math.random() * (fullScreen ? 0.45 : 0.75)})`;
          ctx.lineWidth = 1.2;
        } else if (c.status === 'graying') {
          ctx.setLineDash([]);
          ctx.strokeStyle = `rgba(100, 116, 139, ${c.life * (fullScreen ? 0.35 : 0.65)})`;
          ctx.lineWidth = 1;
        } else {
          ctx.setLineDash([]);
          ctx.strokeStyle = `rgba(255, 255, 255, ${c.life * 5})`;
          ctx.lineWidth = 2;
        }

        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.setLineDash([]);

        return c.life > 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [fullScreen]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};