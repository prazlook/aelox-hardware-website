"use client";

import React, { useEffect, useRef, useState } from 'react';

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
  repelZone?: { x: number, y: number, width: number, height: number };
}

export const NeuralHexNetwork = ({ redHexActive, onRedHexPos, repelZone }: NeuralHexNetworkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const redHexRef = useRef<Particle | null>(null);
  const [shieldFlash, setShieldFlash] = useState<{ x: number, y: number, opacity: number } | null>(null);

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

      if (redHexActive) {
        redHexRef.current = {
          x: canvas.width / 2,
          y: canvas.height / 2,
          baseX: canvas.width / 2,
          baseY: canvas.height / 2,
          size: 20,
          angle: 0,
          speed: 3,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          isRed: true
        };
      } else {
        redHexRef.current = null;
      }
    };

    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isRed?: boolean, opacity?: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(
          x + size * Math.cos((i * Math.PI) / 3),
          y + size * Math.sin((i * Math.PI) / 3)
        );
      }
      ctx.closePath();
      if (isRed) {
        ctx.fillStyle = `rgba(239, 68, 68, ${opacity || 0.15})`;
        ctx.fill();
      }
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const connectionLimit = 120;
      const allParticles = redHexRef.current ? [...particles, redHexRef.current] : particles;

      allParticles.forEach(p => {
        p.angle += 0.05;
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Rebondir sur les bords de l'écran
        if (p.baseX < 0 || p.baseX > canvas.width) p.vx *= -1;
        if (p.baseY < 0 || p.baseY > canvas.height) p.vy *= -1;

        // Logique de répulsion pour l'hexagone rouge par rapport à la zone (la boîte)
        if (p.isRed && repelZone) {
          const buffer = 80; // Distance de sécurité du bouclier
          const centerX = repelZone.x + repelZone.width / 2;
          const centerY = repelZone.y + repelZone.height / 2;
          
          const dx = p.baseX - centerX;
          const dy = p.baseY - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = Math.max(repelZone.width, repelZone.height) / 2 + buffer;

          if (distance < minDistance) {
            // Rebondir
            const angle = Math.atan2(dy, dx);
            p.vx = Math.cos(angle) * 6;
            p.vy = Math.sin(angle) * 6;
            p.baseX = centerX + Math.cos(angle) * (minDistance + 5);
            p.baseY = centerY + Math.sin(angle) * (minDistance + 5);
            
            // Déclencher flash du bouclier
            setShieldFlash({ x: centerX, y: centerY, opacity: 1 });
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
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) opacity = 1;
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

      // Dessiner le bouclier si actif
      setShieldFlash(prev => {
        if (!prev) return null;
        if (prev.opacity <= 0.05) return null;
        
        ctx.save();
        ctx.strokeStyle = `rgba(0, 240, 255, ${prev.opacity})`;
        ctx.lineWidth = 3;
        const shieldSize = Math.max(repelZone?.width || 0, repelZone?.height || 0) / 2 + 40;
        drawHexagon(ctx, prev.x, prev.y, shieldSize, false);
        ctx.restore();
        
        return { ...prev, opacity: prev.opacity * 0.9 };
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
  }, [redHexActive, onRedHexPos, repelZone]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};