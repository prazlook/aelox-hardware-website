"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import mainIcon from '/mainicon.png';

interface ImagePlaceholderProps {
  className?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ className }) => {
  return (
    <img
      src={mainIcon}
      alt="Aelox Hardware Logo"
      className={cn(
        "w-10 h-10 object-contain",
        className
      )}
    />
  );
};

export default ImagePlaceholder;