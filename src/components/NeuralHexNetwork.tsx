"use client";

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRotation: number;
  isDying: boolean;
  deathProgress: number; // 0 to 1
  opacity: number;
}

interface Connection {
  p1: number;
  p2: number;
  life: number; // 0 to 1
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

    const createParticle = (cx: number, cy: number, fullScreen = false): Particle => {
      const angle = Math.random() * Math.PI * 2;
      // Plus dense au centre, mais certains apparaissent partout
      const dist = fullScreen 
        ? Math.random() * Math.max(canvas.width, canvas.height) 
        : Math.random() * 100;
      
      const size = Math.random() * 8 + 2; // Tailles variées
      return {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: size,
        rotation: Math.random() * Math.PI,
        vRotation: (Math.random() - 0.5) * 0.03,
        isDying: false,
        deathProgress: 0,
        opacity: 0
      };
    };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      // On augmente le nombre de particules pour l'écran complet
      particles.current = Array.from({ length: 150 }, () => createParticle(cx, cy, true));
    };

    const drawHex = (x: number, y: number, size: number, rotation: number, color: string, opacity: number, glow = false) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = rotation + (i * Math.PI) / 3;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      
      if (glow) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
      }
      
      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const haloRadius = 180; // Zone fluide stable

      particles.current.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRotation;

        const distFromCenter = Math.hypot(p.x - cx, p.y - cy);

        // Transition vers la mort hors du halo
        if (distFromCenter > haloRadius && !p.isDying) {
          p.isDying = true;
        }

        if (p.isDying) {
          // Plus ils sont gros, plus ils meurent vite (accélération basée sur size)
          const deathSpeed = 0.01 + (p.size / 15) * 0.08;
          p.deathProgress += deathSpeed;
          
          if (p.deathProgress >= 1) {
            particles.current[index] = createParticle(cx, cy);
            return;
          }

          // Effet de flash blanc
          const flashOpacity = Math.sin(p.deathProgress * Math.PI);
          const currentSize = p.size * (1 + p.deathProgress * 0.5);
          drawHex(p.x, p.y, currentSize, p.rotation, 'white', flashOpacity, true);
        } else {
          // Opacité fluide basée sur la distance au centre (halo flou)
          p.opacity = Math.min(0.6, 1 - distFromCenter / (haloRadius * 1.5));
          drawHex(p.x, p.y, p.size, p.rotation, '#22c55e', p.opacity);
        }
      });

      // Connexions neuronales dynamiques
      if (Math.random() > 0.85) {
        const p1 = Math.floor(Math.random() * particles.current.length);
        const p2 = Math.floor(Math.random() * particles.current.length);
        if (p1 !== p2 && !particles.current[p1].isDying && !particles.current[p2].isDying) {
          const dist = Math.hypot(particles.current[p1].x - particles.current[p2].x, particles.current[p1].y - particles.current[p2].y);
          if (dist < 150) {
            connections.current.push({ p1, p2, life: 1, status: 'scintillating' });
          }
        }
      }

      connections.current = connections.current.filter(c => {
        const p1 = particles.current[c.p1];
        const p2 = particles.current[c.p2];
        if (!p1 || !p2 || p1.isDying || p2.isDying) return false;

        c.life -= 0.008;
        if (c.life > 0.7) c.status = 'scintillating';
        else if (c.life > 0.2) c.status = 'graying';
        else c.status = 'dying';

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (c.status === 'scintillating') {
          ctx.setLineDash([3, 6]);
          ctx.lineDashOffset = Date.now() / 30;
          ctx.strokeStyle = `rgba(34, 197, 94, ${Math.random() * 0.7})`;
        } else if (c.status === 'graying') {
          ctx.setLineDash([]);
          ctx.strokeStyle = `rgba(100, 116, 139, ${c.life * 0.6})`;
        } else {
          ctx.setLineDash([]);
          ctx.strokeStyle = `rgba(255, 255, 255, ${c.life * 5})`;
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

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" />;
};