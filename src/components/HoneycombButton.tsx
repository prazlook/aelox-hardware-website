"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface Link {
  id: string;
  from: number;
  to: number;
  status: 'connecting' | 'active' | 'dying';
  createdAt: number;
}

const NeuralBackground = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const requestRef = useRef<number>();

  // Initialisation des nœuds
  useEffect(() => {
    const newNodeCount = 25;
    const initialNodes = Array.from({ length: newNodeCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 15 + 10,
    }));
    setNodes(initialNodes);
  }, []);

  const animate = (time: number) => {
    setNodes(prevNodes => 
      prevNodes.map(node => {
        let nx = node.x + node.vx;
        let ny = node.y + node.vy;

        // Rebondissement sur les bords
        if (nx < 0 || nx > 100) node.vx *= -1;
        if (ny < 0 || ny > 100) node.vy *= -1;

        return { ...node, x: nx, y: ny };
      })
    );

    setLinks(prevLinks => {
      const now = Date.now();
      // Filtrer les liens morts (après le flash blanc)
      const nextLinks = prevLinks.filter(link => {
        if (link.status === 'dying' && now - link.createdAt > 3000) return false;
        return true;
      });

      // Mettre à jour les statuts
      return nextLinks.map(link => {
        const age = now - link.createdAt;
        if (link.status === 'connecting' && age > 800) return { ...link, status: 'active' };
        if (link.status === 'active' && age > 2500) return { ...link, status: 'dying' };
        return link;
      });
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  // Gestion de la création des liens
  useEffect(() => {
    const interval = setInterval(() => {
      setLinks(prev => {
        if (prev.length > 40) return prev; // Limite de liens

        const fromIdx = Math.floor(Math.random() * nodes.length);
        const toIdx = Math.floor(Math.random() * nodes.length);
        
        if (fromIdx === toIdx) return prev;

        const from = nodes[fromIdx];
        const to = nodes[toIdx];
        const dist = Math.hypot(from.x - to.x, from.y - to.y);

        if (dist < 30) {
          const id = `${from.id}-${to.id}-${Date.now()}`;
          return [...prev, { id, from: fromIdx, to: toIdx, status: 'connecting', createdAt: Date.now() }];
        }
        return prev;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [nodes]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <filter id="white-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Liens du réseau */}
      {links.map(link => {
        const from = nodes[link.from];
        const to = nodes[link.to];
        if (!from || !to) return null;

        return (
          <line
            key={link.id}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            className={cn(
              "transition-all duration-500",
              link.status === 'connecting' && "animate-neural-flicker [stroke-dasharray:2]",
              link.status === 'active' && "stroke-slate-500/40 stroke-[0.5]",
              link.status === 'dying' && "animate-neural-death"
            )}
            style={{ 
              filter: link.status === 'dying' ? 'url(#white-glow)' : 'none'
            }}
          />
        );
      })}

      {/* Hexagones flottants */}
      {nodes.map(node => (
        <path
          key={node.id}
          d="M2.5 0 L5 1.44 L5 4.33 L2.5 5.77 L0 4.33 L0 1.44 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.2"
          className="text-green-500/30 transition-transform duration-100"
          style={{
            transform: `translate(${node.x}px, ${node.y}px) scale(${node.size / 20})`,
          }}
        />
      ))}
    </svg>
  );
};

interface HoneycombButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const HoneycombButton = ({ children, className, ...props }: HoneycombButtonProps) => {
  return (
    <div className="relative group p-12">
      {/* Réseau Neural Honeycomb */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <NeuralBackground />
        
        {/* Balayage Laser */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/10 to-transparent h-1/2 animate-honeycomb-scan" />
      </div>

      {/* Halo de lueur pulsant */}
      <div className="absolute inset-0 rounded-full bg-green-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-glow-pulse" />

      {/* Le bouton central */}
      <Button
        className={cn(
          "relative z-10 px-12 py-8 text-xl bg-green-600/90 hover:bg-green-500 text-white rounded-full",
          "shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)]",
          "transition-all duration-500 ease-out transform group-hover:scale-110",
          "border border-green-400/40 backdrop-blur-sm",
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-4 relative">
          {children}
        </span>
      </Button>
    </div>
  );
};

export default HoneycombButton;