import React from 'react';
import { ContextMenuItem } from "@/components/ui/context-menu";
import { cn } from '@/lib/utils';

interface ForceStopMenuItemProps extends React.ComponentPropsWithoutRef<typeof ContextMenuItem> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ForceStopMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuItem>,
  ForceStopMenuItemProps
>(({ children, className, style, ...props }, ref) => {
  return (
    <ContextMenuItem
      ref={ref}
      {...props}
      asChild
      className={cn("relative !p-0 focus:!bg-transparent focus:!text-white group", className)}
      style={style}
    >
      <div className="relative w-full h-full overflow-hidden rounded-md">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          width="100%"
          height="100%"
          fill="none"
        >
          <defs>
            <linearGradient id="force-stop-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="5"
            ry="5"
            stroke="url(#force-stop-gradient)"
            strokeWidth="2"
            className="animate-draw-border animate-ecg-on-hover"
          />
        </svg>
        <div className="flex items-center px-2 py-1.5 animate-flicker-in">
          {children}
        </div>
      </div>
    </ContextMenuItem>
  );
});

ForceStopMenuItem.displayName = 'ForceStopMenuItem';