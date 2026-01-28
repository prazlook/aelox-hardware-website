"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  className?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium",
        className
      )}
      aria-label="Image Placeholder"
    >
      IMG
    </div>
  );
};

export default ImagePlaceholder;