import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <img
      src="/aelox-logo.png"
      alt="Aelox Hardware Logo"
      className={cn("h-10 w-auto", className)}
      {...props}
    />
  );
};