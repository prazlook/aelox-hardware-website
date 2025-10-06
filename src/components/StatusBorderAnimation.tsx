import { ASICStatus } from './ASICStatusCard';

interface StatusBorderAnimationProps {
  status: ASICStatus;
  isWarning: boolean;
  isOverheating: boolean;
}

const CARD_RX = 14; // Slightly less than the card's rounding to fit inside

export const StatusBorderAnimation = ({ status, isWarning, isOverheating }: StatusBorderAnimationProps) => {
  if (status === 'offline') return null;

  const isBusy = status === 'booting up' || status === 'shutting down';
  const isActive = status === 'online';
  const isAlert = status === 'error' || isOverheating || isWarning;

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      width="100%"
      height="100%"
      fill="none"
    >
      <defs>
        <filter id="dyad-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        </filter>
        <linearGradient id="dyad-standby-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="50%" stopColor="#A78BFA" stopOpacity="1" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="dyad-overclock-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
      </defs>

      {status === 'overclocked' && (
        <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" rx={CARD_RX} ry={CARD_RX} stroke="url(#dyad-overclock-gradient)" strokeWidth="3" />
      )}

      {status === 'idle' && (
        <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" rx={CARD_RX} ry={CARD_RX} stroke="#A855F7" strokeWidth="3" className="animate-idle-pulse" filter="url(#dyad-glow)" />
      )}

      {(isActive || isAlert) && (
        <>
          <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" rx={CARD_RX} ry={CARD_RX} stroke={isAlert ? (isOverheating || status === 'error' ? '#EF4444' : '#F97316') : '#00F0FF'} strokeWidth="3" className="animate-stroke-spin-1" filter="url(#dyad-glow)" />
          <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" rx={CARD_RX} ry={CARD_RX} stroke={isAlert ? (isOverheating || status === 'error' ? '#F97316' : '#F59E0B') : '#00A9B7'} strokeWidth="2" className="animate-stroke-spin-2" />
        </>
      )}

      {isBusy && (
        <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" rx={CARD_RX} ry={CARD_RX} stroke="#A0AEC0" strokeWidth="2" className="animate-marching-ants" />
      )}

      {status === 'standby' && (
        <rect y="calc(100% - 4px)" height="3" width="30%" fill="url(#dyad-standby-gradient)" rx="1.5" ry="1.5" className="animate-standby-scan" />
      )}
    </svg>
  );
};