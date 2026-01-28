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
      
      particles.current = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 4,
        rotation: Math.random() * Math.PI,
        vRotation: (Math.random() - 0.5) * 0.02
      }));
    };

    const drawHex = (x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = rotation + (i * Math.PI) / 3;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(34, 197, 94, ${opacity * 0.5})`;
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles
      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRotation;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        drawHex(p.x, p.y, p.size, p.rotation, 0.4);
      });

      // Manage connections
      // 1. Create new connections
      if (Math.random() > 0.95) {
        const p1 = Math.floor(Math.random() * particles.current.length);
        const p2 = Math.floor(Math.random() * particles.current.length);
        const dist = Math.hypot(particles.current[p1].x - particles.current[p2].x, particles.current[p1].y - particles.current[p2].y);
        
        if (dist < 120 && p1 !== p2) {
          connections.current.push({ p1, p2, life: 1, status: 'scintillating' });
        }
      }

      // 2. Draw and update connections
      connections.current = connections.current.filter(c => {
        const p1 = particles.current[c.p1];
        const p2 = particles.current[c.p2];
        if (!p1 || !p2) return false;

        c.life -= 0.005;

        if (c.life > 0.7) c.status = 'scintillating';
        else if (c.life > 0.2) c.status = 'graying';
        else c.status = 'dying';

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (c.status === 'scintillating') {
          ctx.setLineDash([2, 4]);
          ctx.lineDashOffset = Date.now() / 50;
          ctx.strokeStyle = `rgba(34, 197, 94, ${Math.random() * 0.8})`;
        } else if (c.status === 'graying') {
          ctx.setLineDash([]);
          ctx.strokeStyle = `rgba(100, 116, 139, ${c.life})`;
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
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};