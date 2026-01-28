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
  isRed?: boolean;
}

interface NeuralHexNetworkProps {
  redHexActive?: boolean;
  onRedHexPos?: (pos: { x: number, y: number }) => void;
  boxRect?: { left: number, top: number, width: number, height: number } | null;
}

export const NeuralHexNetwork = ({ redHexActive, onRedHexPos, boxRect }: NeuralHexNetworkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const redHexRef = useRef<Particle | null>(null);

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

      // Initialisation de l'hexagone rouge au centre
      if (redHexActive) {
        redHexRef.current = {
          x: canvas.width / 2,
          y: canvas.height / 2,
          baseX: canvas.width / 2,
          baseY: canvas.height / 2,
          size: 20,
          angle: 0,
          speed: 2.5,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          isRed: true
        };
      } else {
        redHexRef.current = null;
      }
    };

    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isRed?: boolean) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(
          x + size * Math.cos((i * Math.PI) / 3),
          y + size * Math.sin((i * Math.PI) / 3)
        );
      }
      ctx.closePath();
      if (isRed) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.fill();
      }
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const haloRadius = 150;
      const connectionLimit = 120;

      const allParticles = redHexRef.current ? [...particles, redHexRef.current] : particles;

      allParticles.forEach(p => {
        p.angle += 0.05;
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Rebond sur les bords de l'écran
        if (p.baseX < 0 || p.baseX > canvas.width) p.vx *= -1;
        if (p.baseY < 0 || p.baseY > canvas.height) p.vy *= -1;

        // Logique spécifique de rebond sur la boîte pour l'hexagone rouge
        if (p.isRed && boxRect) {
          const margin = p.size + 5;
          const left = boxRect.left - margin;
          const right = boxRect.left + boxRect.width + margin;
          const top = boxRect.top - margin;
          const bottom = boxRect.top + boxRect.height + margin;

          // Si l'hexagone est à l'intérieur de la zone d'exclusion de la boîte
          if (p.baseX > left && p.baseX < right && p.baseY > top && p.baseY < bottom) {
            // Calculer de quel côté il est le plus proche pour rebondir
            const distLeft = Math.abs(p.baseX - left);
            const distRight = Math.abs(p.baseX - right);
            const distTop = Math.abs(p.baseY - top);
            const distBottom = Math.abs(p.baseY - bottom);

            const minDist = Math.min(distLeft, distRight, distTop, distBottom);

            if (minDist === distLeft) {
              p.vx = -Math.abs(p.vx);
              p.baseX = left;
            } else if (minDist === distRight) {
              p.vx = Math.abs(p.vx);
              p.baseX = right;
            } else if (minDist === distTop) {
              p.vy = -Math.abs(p.vy);
              p.baseY = top;
            } else if (minDist === distBottom) {
              p.vy = Math.abs(p.vy);
              p.baseY = bottom;
            }
          }
        }

        p.x = p.baseX + Math.cos(p.angle) * 10;
        p.y = p.baseY + Math.sin(p.angle) * 10;

        if (p.isRed && onRedHexPos) {
          onRedHexPos({ x: p.x, y: p.y });
        }

        let opacity = 0.3;
        
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < haloRadius) opacity = 1;
        }

        if (p.isRed) {
          ctx.strokeStyle = `rgba(239, 68, 68, ${opacity})`;
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = `rgba(34, 197, 94, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
        }

        drawHexagon(ctx, p.x, p.y, p.size, p.isRed);

        // Connexions
        allParticles.forEach(p2 => {
          if (p === p2) return;
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionLimit) {
            ctx.beginPath();
            ctx.setLineDash(p.isRed || p2.isRed ? [5, 5] : []);
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            
            if (p.isRed || p2.isRed) {
              ctx.strokeStyle = `rgba(239, 68, 68, ${opacity * 0.4})`;
            } else {
              ctx.strokeStyle = `rgba(34, 197, 94, ${opacity * 0.1})`;
            }
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
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
  }, [redHexActive, onRedHexPos, boxRect]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};