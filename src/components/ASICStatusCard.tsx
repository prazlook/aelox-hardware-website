import { cn } from "@/lib/utils";
import { useAsics } from "@/context/AsicContext";
import { getAnimationStyles, getBootAnimationStyles } from "@/lib/animationUtils";

const ASICStatusCard = () => {
  const { asics, isBootingUp } = useAsics();
  const asic = asics[0];

  if (!asic) {
    return null;
  }

  const { status } = asic;
  const message = status.message || "No status message";

  const truncatedMessage = message.length > 50 ? message.substring(0, 47) + '...' : message;

  const contentAnimationClass = 'animate-fade-in-up';

  return (
    <div className="bg-theme-card rounded-xl shadow-lg p-4 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg text-theme-text-primary">ASIC Status</h3>
          <div className={cn("w-3 h-3 rounded-full", status.isOnline ? 'bg-green-500' : 'bg-red-500')}></div>
        </div>
        <div className={cn("text-center text-sm text-theme-accent border border-theme-accent/30 rounded-xl py-1.5 h-9 flex items-center justify-center", contentAnimationClass, { 'animate-boot-up-item': isBootingUp })} style={isBootingUp ? getBootAnimationStyles(0.5) : getAnimationStyles(0.5)}>
          {truncatedMessage}
        </div>
      </div>
    </div>
  );
};

export default ASICStatusCard;