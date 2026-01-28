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
  isRogue?: boolean;
}

interface NeuralHexNetworkProps {
  rogueActive?: boolean;
  boxPos?: { x: number; y: number } | null;
  onRoguePos?: (pos: { x: number; y: number }) => void;
  lockingActive?: boolean;
}

export const NeuralHexNetwork = ({ rogueActive, boxPos, onRoguePos, lockingActive }: NeuralHexNetworkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 4000);
      const newParticles = [];
      
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        newParticles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 11 + 1,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          isRogue: i === 0 // Le premier est désigné comme renégat potentiel
        });
      }
      particlesRef.current = newParticles;
    };

    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isRogue?: boolean) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(
          x + size * Math.cos((i * Math.PI) / 3),
          y + size * Math.sin((i * Math.PI) / 3)
        );
      }
      ctx.closePath();
      if (isRogue && rogueActive) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
      } else {
        ctx.lineWidth = Math.max(0.5, size / 4);
      }
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const connectionLimit = 80;
      const shieldRadius = 180;

      particlesRef.current.forEach(p => {
        p.angle += 0.05;
        
        // Physique spécifique du renégat
        if (p.isRogue && rogueActive) {
          if (lockingActive) {
            // Ralentit quand verrouillé
            p.vx *= 0.95;
            p.vy *= 0.95;
          } else {
            // Mouvement erratique mais attiré par le réseau
            p.vx += (Math.random() - 0.5) * 0.5;
            p.vy += (Math.random() - 0.5) * 0.5;
            
            // Répulsion de la boîte (bouclier)
            if (boxPos) {
              const dx = p.x - boxPos.x;
              const dy = p.y - boxPos.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < shieldRadius) {
                const force = (shieldRadius - dist) / shieldRadius;
                p.vx += (dx / dist) * force * 15;
                p.vy += (dy / dist) * force * 15;
                
                // Dessiner l'effet de bouclier
                ctx.save();
                ctx.strokeStyle = `rgba(239, 68, 68, ${force})`;
                ctx.lineWidth = 2;
                drawHexagon(ctx, boxPos.x, boxPos.y, shieldRadius, false);
                ctx.restore();
              }
            }
          }
          
          if (onRoguePos) onRoguePos({ x: p.x, y: p.y });
        }

        p.baseX += p.vx;
        p.baseY += p.vy;

        // Limites du canvas
        if (p.baseX < 0 || p.baseX > canvas.width) p.vx *= -1;
        if (p.baseY < 0 || p.baseY > canvas.height) p.vy *= -1;

        p.x = p.baseX + Math.cos(p.angle) * 10;
        p.y = p.baseY + Math.sin(p.angle) * 10;

        let opacity = mouseRef.current.active ? 0 : 0.4;
        
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 300) opacity = 1 - distance / 300;
        }

        if (p.isRogue && rogueActive) opacity = 1;

        if (opacity > 0) {
          ctx.strokeStyle = p.isRogue && rogueActive ? `rgba(239, 68, 68, ${opacity})` : `rgba(34, 197, 94, ${opacity * 0.6})`;
          drawHexagon(ctx, p.x, p.y, p.size, p.isRogue && rogueActive);

          // Connexions
          particlesRef.current.forEach(p2 => {
            if (p === p2) return;
            const dx = p2.x - p.x;
            const dy = p2.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < connectionLimit) {
              ctx.beginPath();
              ctx.save();
              
              if (p.isRogue && rogueActive) {
                ctx.setLineDash([4, 4]); // Pointillés pour le renégat
                ctx.strokeStyle = `rgba(239, 68, 68, ${opacity * 0.4})`;
              } else {
                ctx.strokeStyle = `rgba(34, 197, 94, ${opacity * 0.15})`;
              }
              
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
              ctx.restore();
            }
          });

          // Ligne solide vers la boîte si c'est le renégat
          if (p.isRogue && rogueActive && boxPos) {
            ctx.beginPath();
            ctx.save();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(boxPos.x, boxPos.y);
            ctx.stroke();
            ctx.restore();
          }
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
  }, [rogueActive, boxPos, lockingActive]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};