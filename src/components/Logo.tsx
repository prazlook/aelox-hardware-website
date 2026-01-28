import React from 'react';
import { cn } from '@/lib/utils';
import logoImage from '@/assets/aelox-logo.png';

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <img
      src={logoImage}
      alt="Aelox Hardware Logo"
      className={cn("h-10 w-auto", className)}
      {...props}
    />
  );
};