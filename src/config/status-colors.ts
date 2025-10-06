import { ASICStatus } from "@/components/ASICStatusCard";

export const ASIC_STATUS_COLORS: Record<ASICStatus | 'warning', string> = {
  online: '#39FF14',       // Neon Green
  overclocked: '#00F0FF',  // Cyan
  overheat: '#FF0000',     // Red
  error: '#FF0000',        // Red
  warning: '#F97316',      // Orange
  'booting up': '#3B82F6', // Blue
  'shutting down': '#F59E0B', // Amber
  idle: '#A855F7',         // Purple
  standby: '#6366F1',      // Indigo
  offline: '#4B5563',      // Cool Gray
};