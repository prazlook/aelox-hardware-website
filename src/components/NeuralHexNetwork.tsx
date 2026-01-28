"use client";

import React, { useEffect, useRef } from 'react';

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
}

export const NeuralHexNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

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
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 7000);
      
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 6 + 2,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 2 + 1, // Vitesse augmentée
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2
        });
      }
    };

    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(
          x + size * Math.cos((i * Math.PI) / 3),
          y + size * Math.sin((i * Math.PI) / 3)
        );
      }
      ctx.closePath();
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const haloRadius = 150;
      const maxTotalDistance = 600;
      const minSize = 2;
      const maxSize = 8;
      const connectionLimit = 110;

      particles.forEach(p => {
        // Mouvement plus dynamique et rapide
        p.angle += 0.05;
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Rebond sur les bords
        if (p.baseX < 0 || p.baseX > canvas.width) p.vx *= -1;
        if (p.baseY < 0 || p.baseY > canvas.height) p.vy *= -1;

        const currentX = p.baseX + Math.cos(p.angle) * 10;
        const currentY = p.baseY + Math.sin(p.angle) * 10;
        p.x = currentX;
        p.y = currentY;

        let opacity = 0;
        
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - currentX;
          const dy = mouseRef.current.y - currentY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < haloRadius) {
            opacity = 1;
          } else {
            const sizeFactor = (maxSize - p.size) / (maxSize - minSize);
            const availableRange = maxTotalDistance - haloRadius;
            const minPersistence = availableRange / 2;
            const maxPersistence = availableRange;
            
            const allowedPersistenceDistance = minPersistence + (sizeFactor * (maxPersistence - minPersistence));
            const limit = haloRadius + allowedPersistenceDistance;

            if (distance < limit) {
              opacity = 1 - (distance - haloRadius) / (limit - haloRadius);
            }
          }
        }

        if (opacity > 0) {
          ctx.strokeStyle = `rgba(34, 197, 94, ${opacity * 0.6})`;
          ctx.lineWidth = 1.5;
          drawHexagon(ctx, currentX, currentY, p.size);

          // Connexions dynamiques
          particles.forEach(p2 => {
            if (p === p2) return;
            const dx = p2.x - currentX;
            const dy = p2.y - currentY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < connectionLimit) {
              // Effet d'éclair blanc : si la connexion approche de la limite de rupture
              const isDying = dist > connectionLimit * 0.85;
              
              ctx.beginPath();
              ctx.moveTo(currentX, currentY);
              ctx.lineTo(p2.x, p2.y);
              
              if (isDying) {
                // Flash blanc
                const flashIntensity = (dist - connectionLimit * 0.85) / (connectionLimit * 0.15);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * flashIntensity})`;
                ctx.lineWidth = 2;
              } else {
                ctx.strokeStyle = `rgba(34, 197, 94, ${opacity * 0.2})`;
                ctx.lineWidth = 1;
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
};