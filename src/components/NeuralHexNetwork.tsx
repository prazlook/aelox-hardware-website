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
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 8000);
      
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 6 + 2, // Taille entre 2 et 8
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.2
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

      particles.forEach(p => {
        // Animation de flottement doux
        p.angle += 0.01;
        const currentX = p.baseX + Math.cos(p.angle) * 5;
        const currentY = p.baseY + Math.sin(p.angle) * 5;

        let opacity = 0;
        
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - currentX;
          const dy = mouseRef.current.y - currentY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < haloRadius) {
            opacity = 1;
          } else {
            // Logique de persistance demandée :
            // Plus il est petit, plus il persiste longtemps.
            // La durée (distance) va de la moitié de la distance restante à la distance totale.
            const sizeFactor = (maxSize - p.size) / (maxSize - minSize); // 1 pour le plus petit, 0 pour le plus grand
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
          ctx.strokeStyle = `rgba(34, 197, 94, ${opacity * 0.4})`;
          ctx.lineWidth = 1;
          drawHexagon(ctx, currentX, currentY, p.size);

          // Lignes de connexion "neuronales" proches
          particles.forEach(p2 => {
            const dx = p2.x - currentX;
            const dy = p2.y - currentY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(currentX, currentY);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(34, 197, 94, ${opacity * 0.1})`;
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

    const handleMouseEnter = () => { mouseRef.current.active = true; };
    const handleMouseLeave = () => { mouseRef.current.active = false; };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
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