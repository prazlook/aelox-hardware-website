"use client";

import React, { useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface Connection {
  p1: number;
  p2: number;
  life: number; // 0 to 1
  state: 'flicker' | 'solid' | 'flash';
}

export const NeuralHoneycombBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const points: Point[] = [];
    const connections: Connection[] = [];
    const pointCount = 45;
    const connectionDist = 120;

    // Init points
    for (let i = 0; i < pointCount; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 2
      });
    }

    const drawHexagon = (x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.beginPath();
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update points
      points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        drawHexagon(p.x, p.y, p.size, "#22c55e", 0.3);
      });

      // Manage connections logic
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            // Find or create connection
            let conn = connections.find(c => (c.p1 === i && c.p2 === j) || (c.p1 === j && c.p2 === i));
            
            if (!conn) {
              connections.push({ p1: i, p2: j, life: 0, state: 'flicker' });
            } else {
              conn.life += 0.005;
              if (conn.life < 0.3) conn.state = 'flicker';
              else if (conn.life < 0.8) conn.state = 'solid';
              else conn.state = 'flash';
            }
          }
        }
      }

      // Draw connections
      for (let i = connections.length - 1; i >= 0; i--) {
        const c = connections[i];
        const p1 = points[c.p1];
        const p2 = points[c.p2];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > connectionDist || c.life >= 1) {
          connections.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (c.state === 'flicker') {
          ctx.setLineDash([2, 4]);
          ctx.strokeStyle = `rgba(34, 197, 94, ${Math.random() > 0.5 ? 0.6 : 0.2})`;
          ctx.lineWidth = 0.5;
        } else if (c.state === 'solid') {
          ctx.setLineDash([]);
          ctx.strokeStyle = 'rgba(156, 163, 175, 0.4)'; // Gray
          ctx.lineWidth = 1;
        } else if (c.state === 'flash') {
          ctx.setLineDash([]);
          const alpha = 1 - (c.life - 0.8) / 0.2;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`; // White flash
          ctx.lineWidth = 2;
        }

        ctx.stroke();
        ctx.setLineDash([]);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
    />
  );
};