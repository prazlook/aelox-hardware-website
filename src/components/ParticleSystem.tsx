import React, { useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInterval } from 'usehooks-ts';

interface Particle {
  id: number;
  x: number;
  y: number;
  endX: number;
  endY: number;
  payload: any;
}

interface ParticleSystemProps {
  onParticleLand: (payload: any) => void;
}

export interface ParticleSystemRef {
  createParticle: (startX: number, startY: number, endX: number, endY: number, payload: any) => void;
}

const Particle = ({ particle, onRest }: { particle: Particle, onRest: () => void }) => {
  const props = useSpring({
    from: { x: particle.x, y: particle.y, opacity: 1, scale: 0.5 },
    to: { x: particle.endX, y: particle.endY, opacity: 0, scale: 1 },
    config: { tension: 40, friction: 20 },
    onRest,
  });

  return (
    <animated.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,255,1) 0%, rgba(0,128,255,0.5) 100%)',
        boxShadow: '0 0 8px rgba(0,255,255,0.8)',
        willChange: 'transform, opacity',
        transform: props.x.to((x, i) => `translate3d(${x}px, ${props.y.get()}px, 0) scale(${props.scale.get()})`),
        opacity: props.opacity,
        zIndex: 100,
      }}
    />
  );
};

export const ParticleSystem = forwardRef<ParticleSystemRef, ParticleSystemProps>(({ onParticleLand }, ref) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useImperativeHandle(ref, () => ({
    createParticle: (startX, startY, endX, endY, payload) => {
      setParticles(prev => [
        ...prev,
        { id: Date.now() + Math.random(), x: startX, y: startY, endX, endY, payload },
      ]);
    },
  }));

  const removeParticle = useCallback((id: number, payload: any) => {
    onParticleLand(payload);
    setParticles(prev => prev.filter(p => p.id !== id));
  }, [onParticleLand]);

  return (
    <div className="pointer-events-none">
      {particles.map(p => (
        <Particle key={p.id} particle={p} onRest={() => removeParticle(p.id, p.payload)} />
      ))}
    </div>
  );
});

ParticleSystem.displayName = 'ParticleSystem';