"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  className?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ className }) => {
  return (
    <img
      src="/mainicon.png"
      alt="Aelox Hardware Logo"
      className={cn(
        "w-10 h-10 object-contain", // Use object-contain to ensure the image fits without cropping
        className
      )}
    />
  );
};

export default ImagePlaceholder;