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
}

export const NeuralHexNetwork = ({ redHexActive, onRedHexPos }: NeuralHexNetworkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const redHexRef = useRef<Particle | null>(null);
  
  // Utilisation de refs pour les props afin que la boucle d'animation
  // puisse y accéder sans avoir besoin de redémarrer l'effet.
  const redHexActiveRef = useRef(redHexActive);
  const onRedHexPosRef = useRef(onRedHexPos);

  useEffect(() => {
    redHexActiveRef.current = redHexActive;
    onRedHexPosRef.current = onRedHexPos;
  }, [redHexActive, onRedHexPos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const initParticles = () => {
      if (particlesRef.current.length > 0) return; // Ne pas réinitialiser si déjà présents

      const numberOfParticles = Math.floor((window.innerWidth * window.innerHeight) / 4000);
      const newParticles: Particle[] = [];
      
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        newParticles.push({
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
      particlesRef.current = newParticles;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // On ne réinitialise pas les particules au resize pour éviter les sauts, 
      // on laisse juste le canvas s'adapter.
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

      // Gestion de l'hexagone rouge via la Ref persistante
      if (redHexActiveRef.current && !redHexRef.current) {
        redHexRef.current = {
          x: canvas.width / 2,
          y: canvas.height / 2,
          baseX: canvas.width / 2,
          baseY: canvas.height / 2,
          size: 20,
          angle: 0,
          speed: 2,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          isRed: true
        };
      } else if (!redHexActiveRef.current) {
        redHexRef.current = null;
      }

      const allParticles = redHexRef.current ? [...particlesRef.current, redHexRef.current] : particlesRef.current;

      allParticles.forEach(p => {
        p.angle += 0.05;
        p.baseX += p.vx;
        p.baseY += p.vy;

        if (p.baseX < 0) p.baseX = canvas.width;
        if (p.baseX > canvas.width) p.baseX = 0;
        if (p.baseY < 0) p.baseY = canvas.height;
        if (p.baseY > canvas.height) p.baseY = 0;

        p.x = p.baseX + Math.cos(p.angle) * 10;
        p.y = p.baseY + Math.sin(p.angle) * 10;

        if (p.isRed && onRedHexPosRef.current) {
          onRedHexPosRef.current({ x: p.x, y: p.y });
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
    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // L'effet ne s'exécute qu'une seule fois au montage

  return <canvas ref={canvasRef} className="w-full h-full" />;
};