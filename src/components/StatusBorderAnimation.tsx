import { ASICStatus } from './ASICStatusCard';

interface StatusBorderAnimationProps {
  status: ASICStatus;
  isWarning: boolean;
  isOverheating: boolean;
}

const CARD_RX = 15;

export const StatusBorderAnimation = ({ status, isWarning, isOverheating }: StatusBorderAnimationProps) => {
  const isBusy = status === 'booting up' || status === 'shutting down';
  const isActive = status === 'online'; // Overclocked is handled separately
  const isAlert = status === 'error' || isOverheating || isWarning;

  if (status === 'offline') return null;

  if (status === 'overclocked') {
    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        width="100%"
        height="100%"
        fill="none"
      >
        <defs>
          <linearGradient id="overclock-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="20%" stopColor="#06b6d4" />
            <stop offset="40%" stopColor="#6366f1" />
            <stop offset="60%" stopColor="#ef4444" />
            <stop offset="80%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#f59e0b" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 0.5 0.5"
              to="360 0.5 0.5"
              dur="4s"
              repeatCount="indefinite"
            />
          </linearGradient>
          <filter id="overclock-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          </filter>
        </defs>
        <rect
          x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
          rx={CARD_RX} ry={CARD_RX}
          stroke="url(#overclock-gradient)"
          strokeWidth="3"
          className="opacity-50"
          filter="url(#overclock-glow)"
        />
        <rect
          x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
          rx={CARD_RX} ry={CARD_RX}
          stroke="url(#overclock-gradient)"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      width="100%"
      height="100%"
      fill="none"
    >
      <defs>
        <filter id="idle-halo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
        <linearGradient id="standby-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0" />
          <stop offset="50%" stopColor="#A855F7" stopOpacity="1" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Idle: Purple glowing segment */}
      {status === 'idle' && (
        <rect
          x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
          rx={CARD_RX} ry={CARD_RX}
          stroke="#A855F7"
          strokeWidth="2"
          className="animate-idle-pulse"
          filter="url(#idle-halo)"
        />
      )}

      {/* Standby: Bottom line scan */}
      {status === 'standby' && (
        <rect
          y="calc(100% - 3px)"
          height="2"
          width="25%"
          fill="url(#standby-gradient)"
          rx="1"
          ry="1"
          className="animate-standby-scan"
        />
      )}

      {/* Active and Alert states */}
      {(isActive || isAlert) && (
        <>
          <rect
            x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
            rx={CARD_RX} ry={CARD_RX}
            stroke={isAlert ? (isOverheating || status === 'error' ? '#EF4444' : '#F97316') : '#00F0FF'}
            strokeWidth="2"
            className="animate-stroke-spin-1"
          />
          <rect
            x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
            rx={CARD_RX} ry={CARD_RX}
            stroke={isAlert ? (isOverheating || status === 'error' ? '#F97316' : '#F59E0B') : '#00A9B7'}
            strokeWidth="2"
            className="animate-stroke-spin-2"
          />
        </>
      )}

      {/* Busy: Marching ants */}
      {isBusy && (
        <rect
          x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
          rx={CARD_RX} ry={CARD_RX}
          stroke="#A0AEC0"
          strokeWidth="2"
          className="animate-marching-ants"
        />
      )}
    </svg>
  );
};