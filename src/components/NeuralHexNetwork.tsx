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

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      particles.current = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 5 + 3,
        rotation: Math.random() * Math.PI,
        vRotation: (Math.random() - 0.5) * 0.02,
        isDying: false,
        deathProgress: 0
      }));
    };

    const drawHex = (x: number, y: number, size: number, rotation: number, opacity: number, color: string, glow: boolean = false) => {
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
      } else {
        ctx.shadowBlur = 0;
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
      const survivalRadius = Math.min(canvas.width, canvas.height) * 0.35;

      // Update and draw particles
      particles.current = particles.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRotation;

        const dist = Math.hypot(p.x - cx, p.y - cy);

        // Déclencher la mort si trop loin du centre
        if (dist > survivalRadius && !p.isDying) {
          p.isDying = true;
        }

        if (p.isDying) {
          p.deathProgress += 0.04;
          // Flash blanc éclatant
          const flashOpacity = Math.sin(p.deathProgress * Math.PI);
          drawHex(p.x, p.y, p.size * (1 + p.deathProgress), p.rotation, flashOpacity, 'white', true);
          return p.deathProgress < 1;
        }

        drawHex(p.x, p.y, p.size, p.rotation, 0.4, '#22c55e');
        return true;
      });

      // Remplacer les particules mortes
      while (particles.current.length < 100) {
        particles.current.push({
          x: cx + (Math.random() - 0.5) * survivalRadius * 1.5,
          y: cy + (Math.random() - 0.5) * survivalRadius * 1.5,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 5 + 3,
          rotation: Math.random() * Math.PI,
          vRotation: (Math.random() - 0.5) * 0.02,
          isDying: false,
          deathProgress: 0
        });
      }

      // Connections
      if (Math.random() > 0.9) {
        const p1 = Math.floor(Math.random() * particles.current.length);
        const p2 = Math.floor(Math.random() * particles.current.length);
        if (!particles.current[p1].isDying && !particles.current[p2].isDying) {
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

        c.life -= 0.006;
        if (c.life > 0.7) c.status = 'scintillating';
        else if (c.life > 0.2) c.status = 'graying';
        else c.status = 'dying';

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (c.status === 'scintillating') {
          ctx.setLineDash([3, 6]);
          ctx.lineDashOffset = Date.now() / 30;
          ctx.strokeStyle = `rgba(34, 197, 94, ${Math.random() * 0.8})`;
        } else if (c.status === 'graying') {
          ctx.setLineDash([]);
          ctx.strokeStyle = `rgba(100, 116, 139, ${c.life})`;
        } else {
          ctx.setLineDash([]);
          ctx.strokeStyle = `rgba(255, 255, 255, ${c.life * 8})`;
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
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};