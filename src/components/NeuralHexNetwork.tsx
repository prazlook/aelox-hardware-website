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
  phaseIn?: number;
}

export interface NeuralHexNetworkProps {
  redHexActive?: boolean;
  terminalBoxPos?: { x: number; y: number };
  onRedHexPos?: (pos: { x: number; y: number }) => void;
}

export const NeuralHexNetwork = ({ redHexActive, terminalBoxPos, onRedHexPos }: NeuralHexNetworkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const redHexRef = useRef<Particle | null>(null);
  const shieldRef = useRef({ opacity: 0, timestamp: 0 });

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

      redHexRef.current = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        baseX: canvas.width / 2,
        baseY: canvas.height / 2,
        size: 8,
        angle: 0,
        speed: 3,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        isRed: true,
        phaseIn: 0
      };
    };

    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, options: { fill?: string, stroke?: string, lineWidth?: number } = {}) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(
          x + size * Math.cos((i * Math.PI) / 3),
          y + size * Math.sin((i * Math.PI) / 3)
        );
      }
      ctx.closePath();
      if (options.fill) {
        ctx.fillStyle = options.fill;
        ctx.fill();
      }
      if (options.stroke) {
        ctx.strokeStyle = options.stroke;
        ctx.lineWidth = options.lineWidth || 1;
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const connectionLimit = 80;
      const redHex = redHexRef.current;

      if (redHexActive && redHex) {
        if (redHex.phaseIn! < 1) redHex.phaseIn! += 0.01;
        redHex.baseX += redHex.vx;
        redHex.baseY += redHex.vy;
        if (redHex.baseX < 50 || redHex.baseX > canvas.width - 50) redHex.vx *= -1;
        if (redHex.baseY < 50 || redHex.baseY > canvas.height - 50) redHex.vy *= -1;

        if (terminalBoxPos) {
          const dx = terminalBoxPos.x - redHex.baseX;
          const dy = terminalBoxPos.y - redHex.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            redHex.vx = -redHex.vx * 1.2;
            redHex.vy = -redHex.vy * 1.2;
            shieldRef.current = { opacity: 1, timestamp: Date.now() };
          }
        }

        redHex.x = redHex.baseX + Math.sin(Date.now() / 200) * 10;
        redHex.y = redHex.baseY + Math.cos(Date.now() / 200) * 10;
        if (onRedHexPos) onRedHexPos({ x: redHex.x, y: redHex.y });
      }

      particles.forEach(p => {
        p.angle += 0.05;
        p.baseX += p.vx;
        p.baseY += p.vy;
        if (p.baseX < 0 || p.baseX > canvas.width) p.vx *= -1;
        if (p.baseY < 0 || p.baseY > canvas.height) p.vy *= -1;
        p.x = p.baseX + Math.cos(p.angle) * 10;
        p.y = p.baseY + Math.sin(p.angle) * 10;

        particles.forEach(p2 => {
          if (p === p2) return;
          const dist = Math.sqrt(Math.pow(p2.x - p.x, 2) + Math.pow(p2.y - p.y, 2));
          if (dist < connectionLimit) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(34, 197, 94, 0.15)`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        if (redHexActive && redHex && redHex.phaseIn! > 0.5) {
          const dist = Math.sqrt(Math.pow(redHex.x - p.x, 2) + Math.pow(redHex.y - p.y, 2));
          if (dist < connectionLimit + 20) {
            ctx.beginPath();
            ctx.setLineDash([2, 3]);
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(redHex.x, redHex.y);
            ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 * redHex.phaseIn!})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
        drawHexagon(ctx, p.x, p.y, p.size, { stroke: `rgba(34, 197, 94, 0.6)` });
      });

      if (redHexActive && redHex) {
        const glitch = Math.random() > 0.9 ? (Math.random() - 0.5) * 10 : 0;
        drawHexagon(ctx, redHex.x + glitch, redHex.y, redHex.size, { 
          stroke: `rgba(239, 68, 68, ${redHex.phaseIn})`,
          lineWidth: 2 
        });
      }

      if (shieldRef.current.opacity > 0 && terminalBoxPos) {
        const elapsed = Date.now() - shieldRef.current.timestamp;
        shieldRef.current.opacity = Math.max(0, 1 - elapsed / 500);
        drawHexagon(ctx, terminalBoxPos.x, terminalBoxPos.y, 160, { 
          stroke: `rgba(239, 68, 68, ${shieldRef.current.opacity})`,
          lineWidth: 2
        });
        drawHexagon(ctx, terminalBoxPos.x, terminalBoxPos.y, 160, { 
          fill: `rgba(239, 68, 68, ${shieldRef.current.opacity * 0.1})`
        });
      }

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
  }, [redHexActive, terminalBoxPos, onRedHexPos]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};