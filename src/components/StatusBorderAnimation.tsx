import { ASICStatus } from './ASICStatusCard';
import { cn } from '@/lib/utils'; // Import cn

interface StatusBorderAnimationProps {
  status: ASICStatus;
  isWarning: boolean;
  isOverheating: boolean;
  triggerStartupAnimation: boolean; // New prop
  startupDelay: number; // New prop
}

const CARD_RX = 14; // Slightly less than the card's rounding to fit inside

export const StatusBorderAnimation = ({ status, isWarning, isOverheating, triggerStartupAnimation, startupDelay }: StatusBorderAnimationProps) => {
  if (status === 'offline') return null;

  const isBusy = status === 'booting up' || status === 'shutting down';
  const isCritical = isOverheating || status === 'error';

  const onlineColor = '#00F0FF';
  const onlineMutedColor = '#00A9B7';
  const warningColor = '#F97316';
  const warningMutedColor = '#F59E0B';
  const criticalColor = '#EF4444';
  const criticalMutedColor = '#F97316';

  const borderAnimationClasses = cn(
    triggerStartupAnimation && "animate-asic-border-draw-in"
  );
  const borderAnimationStyle = triggerStartupAnimation ? { animationDelay: `${startupDelay}s` } : {};

  const renderBorder = (gradientId: string, mutedColor: string) => (
    <>
      <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" rx={CARD_RX} ry={CARD_RX} stroke={mutedColor} strokeOpacity="0.3" strokeWidth="2" />
      <rect
        x="1.5"
        y="1.5"
        width="calc(100% - 3px)"
        height="calc(100% - 3px)"
        rx={CARD_RX}
        ry={CARD_RX}
        stroke={`url(#${gradientId})`}
        strokeWidth="3"
        filter="url(#dyad-glow)"
        className={borderAnimationClasses} // Apply here
        style={borderAnimationStyle as React.CSSProperties} // Apply here, removed transformOrigin
      />
    </>
  );

  let borderContent = null;
  if (isCritical) {
    borderContent = renderBorder('dyad-critical-gradient', criticalMutedColor);
  } else if (isWarning) {
    borderContent = renderBorder('dyad-warning-gradient', warningMutedColor);
  } else if (status === 'online') {
    borderContent = renderBorder('dyad-online-gradient', onlineMutedColor);
  } else if (status === 'overclocked') {
    borderContent = <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" rx={CARD_RX} ry={CARD_RX} stroke="url(#dyad-overclock-gradient)" strokeWidth="3" className={borderAnimationClasses} style={borderAnimationStyle as React.CSSProperties} />;
  } else if (status === 'idle') {
    borderContent = <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" rx={CARD_RX} ry={CARD_RX} stroke="#A855F7" strokeWidth="3" className={cn("animate-idle-pulse", borderAnimationClasses)} filter="url(#dyad-glow)" style={borderAnimationStyle as React.CSSProperties} />;
  } else if (isBusy) {
    borderContent = <rect x="1.5" y="1.5" width="calc(100% - 3px)" height="calc(100% - 3px)" rx={CARD_RX} ry={CARD_RX} stroke="#A0AEC0" strokeWidth="2" className={cn("animate-marching-ants", borderAnimationClasses)} style={borderAnimationStyle as React.CSSProperties} />;
  } else if (status === 'standby') {
    borderContent = <rect y="calc(100% - 4px)" height="3" width="30%" fill="url(#dyad-standby-gradient)" rx="1.5" ry="1.5" className={cn("animate-standby-scan", borderAnimationClasses)} style={borderAnimationStyle as React.CSSProperties} />;
  }

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
        <linearGradient id="dyad-overclock-gradient" x1="0%" y1="0%" x2="100%" y2="0%"> {/* Horizontal gradient */}
          <stop offset="0%" stopColor="#FF0000" />   {/* Red */}
          <stop offset="14%" stopColor="#FF7F00" />   {/* Orange */}
          <stop offset="28%" stopColor="#FFFF00" />   {/* Yellow */}
          <stop offset="42%" stopColor="#00FF00" />   {/* Green */}
          <stop offset="56%" stopColor="#0000FF" />   {/* Blue */}
          <stop offset="70%" stopColor="#4B0082" />   {/* Indigo */}
          <stop offset="84%" stopColor="#8B00FF" />  {/* Violet */}
          <stop offset="100%" stopColor="#FF0000" />  {/* Red (for seamless loop) */}
          <animate attributeName="x1" from="0%" to="-100%" dur="6s" repeatCount="indefinite" />
          <animate attributeName="x2" from="100%" to="0%" dur="6s" repeatCount="indefinite" />
        </linearGradient>
        <linearGradient id="dyad-online-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={onlineColor} stopOpacity="0" />
          <stop offset="50%" stopColor={onlineColor} stopOpacity="1" />
          <stop offset="100%" stopColor={onlineColor} stopOpacity="0" />
          <animate attributeName="x1" from="-100%" to="200%" dur="3s" repeatCount="indefinite" />
          <animate attributeName="x2" from="0%" to="300%" dur="3s" repeatCount="indefinite" />
        </linearGradient>
        <linearGradient id="dyad-warning-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={warningColor} stopOpacity="0" />
          <stop offset="50%" stopColor={warningColor} stopOpacity="1" />
          <stop offset="100%" stopColor={warningColor} stopOpacity="0" />
          <animate attributeName="x1" from="-100%" to="200%" dur="3s" repeatCount="indefinite" />
          <animate attributeName="x2" from="0%" to="300%" dur="3s" repeatCount="indefinite" />
        </linearGradient>
        <linearGradient id="dyad-critical-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={criticalColor} stopOpacity="0" />
          <stop offset="50%" stopColor={criticalColor} stopOpacity="1" />
          <stop offset="100%" stopColor={criticalColor} stopOpacity="0" />
          <animate attributeName="x1" from="-100%" to="200%" dur="3s" repeatCount="indefinite" />
          <animate attributeName="x2" from="0%" to="300%" dur="3s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      {borderContent}
    </svg>
  );
};