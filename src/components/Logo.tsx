import React from 'react';
import { cn } from '@/lib/utils';
import logoImage from '@/assets/Gemini_Generated_Image_6t21s96t21s96t21-removebg-preview (1) (1).png';

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