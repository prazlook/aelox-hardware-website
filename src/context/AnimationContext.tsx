import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Particle {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startTime: number;
  duration: number;
  size: number;
  color: string;
}

interface AnimationContextType {
  triggerBurst: (startX: number, startY: number, endElement: HTMLElement) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const triggerBurst = useCallback((startX: number, startY: number, endElement: HTMLElement) => {
    const rect = endElement.getBoundingClientRect();
    const endX = rect.left + rect.width / 2;
    const endY = rect.top + rect.height / 2;
    const newParticles: Particle[] = [];
    const count = 30;
    const colors = ['#ef4444', '#f97316', '#f59e0b'];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Math.random(),
        startX: startX + (Math.random() - 0.5) * 20,
        startY: startY + (Math.random() - 0.5) * 20,
        endX: endX + (Math.random() - 0.5) * 80,
        endY: endY + (Math.random() - 0.5) * 80,
        startTime: Date.now(),
        duration: 400 + Math.random() * 200,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  return (
    <AnimationContext.Provider value={{ triggerBurst }}>
      {children}
      <ParticleContainer particles={particles} setParticles={setParticles} />
    </AnimationContext.Provider>
  );
};

const ParticleContainer = ({ particles, setParticles }: { particles: Particle[], setParticles: React.Dispatch<React.SetStateAction<Particle[]>> }) => {
  const [positions, setPositions] = useState<Record<number, { x: number, y: number, opacity: number }>>({});

  React.useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      const now = Date.now();
      const newPositions: Record<number, { x: number, y: number, opacity: number }> = {};
      let activeParticlesExist = false;

      particles.forEach(p => {
        const progress = (now - p.startTime) / p.duration;
        if (progress < 1) {
          activeParticlesExist = true;
          const easeOutProgress = 1 - Math.pow(1 - progress, 3);
          newPositions[p.id] = {
            x: p.startX + (p.endX - p.startX) * easeOutProgress,
            y: p.startY + (p.endY - p.startY) * easeOutProgress,
            opacity: 1 - progress,
          };
        }
      });

      setPositions(newPositions);

      if (activeParticlesExist) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setParticles([]);
      }
    };

    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [particles, setParticles]);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
      {Object.entries(positions).map(([id, pos]) => {
        const particle = particles.find(p => p.id === parseFloat(id));
        if (!particle) return null;
        return (
          <div
            key={id}
            className="absolute rounded-full"
            style={{
              left: pos.x,
              top: pos.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: pos.opacity,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
};