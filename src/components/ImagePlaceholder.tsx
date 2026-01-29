"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { Cpu } from 'lucide-react';

interface ImagePlaceholderProps {
  className?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Cpu 
        className={cn("w-10 h-10 text-primary", className)} 
        aria-label="Aelox Hardware Logo"
      />
    </div>
  );
};

export default ImagePlaceholder;