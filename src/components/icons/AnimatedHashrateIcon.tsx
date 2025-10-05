import { cn } from "@/lib/utils";

export function AnimatedHashrateIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-zap-trace", className)}
    >
      <polygon
        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
        fill="#66d9ff"
        stroke="#66d9ff"
      />
    </svg>
  );
}