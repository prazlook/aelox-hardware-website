"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  angle: number;
  speed: number;
  vx: number;
  vy: number;
  isRed?: boolean;
}

export interface NeuralHexNetworkRef {
  getRedHexPos: () => { x: number; y: number } | null;
}

export const NeuralHexNetwork = forwardRef<NeuralHexNetworkRef, { isTransitioning?: boolean }>(({ isTransitioning }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const redHexRef = useRef<Particle | null>(null);

  useImperativeHandle(ref, () => ({
    getRedHexPos: () => redHexRef.current ? { x: redHexRef.current.x, y: redHexRef.current.y } : null
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 4000);
      
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 11 + 1,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5
        });
      }

      // Création de l'intrus rouge si en transition
      if (isTransitioning) {
        const redP: Particle = {
          x: canvas.width / 2,
          y: canvas.height / 2,
          baseX: canvas.width / 2,
          baseY: canvas.height / 2,
          size: 10,
          angle: 0,
          speed: 4,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          isRed: true
        };
        particles.push(redP);
        redHexRef.current = redP;
      }
    };

    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isDotted = false) => {
      ctx.beginPath();
      if (isDotted) ctx.setLineDash([2, 2]);
      else ctx.setLineDash([]);
      
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(
          x + size * Math.cos((i * Math.PI) / 3),
          y + size * Math.sin((i * Math.PI) / 3)
        );
      }
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const haloRadius = 150;
      const connectionLimit = 80;

      particles.forEach(p => {
        p.angle += 0.05;
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Rebond et mouvement erratique pour le rouge
        if (p.isRed) {
          if (Math.random() > 0.98) {
            p.vx = (Math.random() - 0.5) * 12;
            p.vy = (Math.random() - 0.5) * 12;
          }
        }

        if (p.baseX < 0 || p.baseX > canvas.width) p.vx *= -1;
        if (p.baseY < 0 || p.baseY > canvas.height) p.vy *= -1;

        p.x = p.baseX + Math.cos(p.angle) * 10;
        p.y = p.baseY + Math.sin(p.angle) * 10;

        let opacity = 0;
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (p.isRed) {
          opacity = 1; // Le rouge est toujours visible
        } else if (mouseRef.current.active && distToMouse < 400) {
          opacity = 1 - (distToMouse / 400);
        } else if (isTransitioning) {
          // Visibilité accrue pendant la transition
          opacity = 0.3;
        }

        if (opacity > 0) {
          ctx.strokeStyle = p.isRed 
            ? `rgba(239, 68, 68, ${opacity})` 
            : `rgba(34, 197, 94, ${opacity * 0.6})`;
          
          ctx.lineWidth = p.isRed ? 2 : Math.max(0.5, p.size / 4);
          drawHexagon(ctx, p.x, p.y, p.size, p.isRed);

          // Interaction : le rouge "repousse" les verts
          if (p.isRed) {
            particles.forEach(p2 => {
              if (p2 === p) return;
              const dx = p2.x - p.x;
              const dy = p2.y - p.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 100) {
                p2.vx += dx * 0.01;
                p2.vy += dy * 0.01;
              }
            });
          }

          particles.forEach(p2 => {
            if (p === p2) return;
            const dx = p2.x - p.x;
            const dy = p2.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < connectionLimit) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              
              if (p.isRed || p2.isRed) {
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = `rgba(239, 68, 68, ${opacity * 0.8})`;
              } else {
                ctx.setLineDash([]);
                ctx.strokeStyle = `rgba(34, 197, 94, ${opacity * 0.15})`;
              }
              ctx.stroke();
            }
          });
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTransitioning]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
});

NeuralHexNetwork.displayName = "NeuralHexNetwork";