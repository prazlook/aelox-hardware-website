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
  life: number; // 1 to 0
  isDying: boolean;
  flashOpacity: number;
}

interface Connection {
  p1: number;
  p2: number;
  life: number;
  status: 'scintillating' | 'graying' | 'dying';
}

export const NeuralHexNetwork = () => {
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
      const dist = forceInside ? Math.random() * 100 : Math.random() * 150;
      const size = Math.random() * 4 + 3;
      return {
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: size,
        baseSize: size,
        rotation: Math.random() * Math.PI,
        vRotation: (Math.random() - 0.5) * 0.02,
        life: 1,
        isDying: false,
        flashOpacity: 0
      };
    };

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      particles.current = Array.from({ length: 60 }, () => createParticle(cx, cy, true));
    };

    const drawHex = (x: number, y: number, size: number, rotation: number, color: string, opacity: number) => {
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
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxHaloRadius = Math.min(canvas.width, canvas.height) * 0.4;

      // Update particles
      particles.current.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRotation;

        const dist = Math.hypot(p.x - cx, p.y - cy);
        
        // Seuil de sortie du halo fluide
        if (dist > maxHaloRadius && !p.isDying) {
          p.isDying = true;
        }

        if (p.isDying) {
          p.life -= 0.05; // Meurt rapidement
          p.flashOpacity = p.life > 0.5 ? (1 - p.life) * 2 : p.life * 2;
          p.size = p.baseSize * (1 + (1 - p.life) * 2); // Expansion lors du flash
        }

        if (p.life <= 0) {
          // Respawn au centre
          particles.current[index] = createParticle(cx, cy, true);
          return;
        }

        const opacity = p.isDying ? p.life * 0.5 : Math.max(0, 1 - dist / maxHaloRadius) * 0.6;
        const color = p.isDying ? `rgba(255, 255, 255, opacity)` : `rgba(34, 197, 94, opacity)`;
        
        drawHex(p.x, p.y, p.size, p.rotation, color, opacity);

        // Dessiner le flash blanc par-dessus si mourant
        if (p.isDying) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = "white";
          drawHex(p.x, p.y, p.size, p.rotation, `rgba(255, 255, 255, ${p.flashOpacity})`, p.flashOpacity);
          ctx.shadowBlur = 0;
        }
      });

      // Manage connections
      if (Math.random() > 0.90) {
        const p1 = Math.floor(Math.random() * particles.current.length);
        const p2 = Math.floor(Math.random() * particles.current.length);
        const dist = Math.hypot(particles.current[p1].x - particles.current[p2].x, particles.current[p1].y - particles.current[p2].y);
        
        if (dist < 150 && p1 !== p2 && !particles.current[p1].isDying && !particles.current[p2].isDying) {
          connections.current.push({ p1, p2, life: 1, status: 'scintillating' });
        }
      }

      connections.current = connections.current.filter(c => {
        const p1 = particles.current[c.p1];
        const p2 = particles.current[c.p2];
        if (!p1 || !p2 || p1.isDying || p2.isDying) return false;

        c.life -= 0.006;
        if (c.life > 0.75) c.status = 'scintillating';
        else if (c.life > 0.25) c.status = 'graying';
        else c.status = 'dying';

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (c.status === 'scintillating') {
          ctx.setLineDash([4, 4]);
          ctx.lineDashOffset = Date.now() / 30;
          ctx.strokeStyle = `rgba(34, 197, 94, ${Math.random() * 0.8})`;
        } else if (c.status === 'graying') {
          ctx.setLineDash([]);
          ctx.strokeStyle = `rgba(100, 116, 139, ${c.life * 0.7})`;
        } else {
          ctx.setLineDash([]);
          ctx.strokeStyle = `rgba(255, 255, 255, ${c.life * 4})`;
          ctx.lineWidth = 1.5;
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
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};