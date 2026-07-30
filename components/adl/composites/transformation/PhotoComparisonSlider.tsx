"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";
import { Camera, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Caption } from "@/components/adl/typography";

export interface PhotoComparisonSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function PhotoComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className
}: PhotoComparisonSliderProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sliderPosition = useMotionValue(50); // percentage 0-100

  const handleDrag = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent, info: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = info.point.x - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    sliderPosition.set(percentage);
  };

  const clipPathLeft = useTransform(sliderPosition, (val) => `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`);
  const clipPathRight = useTransform(sliderPosition, (val) => `polygon(${val}% 0, 100% 0, 100% 100%, ${val}% 100%)`);
  
  if (!beforeImage || !afterImage) {
    return (
      <div className={cn("w-full aspect-[3/4] md:aspect-video rounded-[var(--radius-xl)] bg-[var(--color-bg-surface)] border border-dashed border-[var(--color-glass-border)] flex flex-col items-center justify-center text-[var(--color-text-muted)] hover:border-[var(--color-accent-indigo)] hover:text-[var(--color-accent-indigo)] transition-colors cursor-pointer group", className)}>
        <Camera size={48} className="mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        <span className="font-semibold">Log First Transformation Photo</span>
        <Caption className="mt-2 text-center max-w-xs">Your future self will thank you for documenting day one.</Caption>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full aspect-[3/4] md:aspect-video rounded-[var(--radius-xl)] overflow-hidden select-none touch-none", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Before Image (Left) */}
      <motion.div 
        className="absolute inset-0 bg-[var(--color-bg-surface)]"
        style={{ clipPath: clipPathLeft }}
      >
        <img src={beforeImage} alt={beforeLabel} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <Caption className="text-white font-semibold tracking-wider uppercase text-[10px]">{beforeLabel}</Caption>
        </div>
      </motion.div>

      {/* After Image (Right) */}
      <motion.div 
        className="absolute inset-0 bg-[var(--color-bg-surface)]"
        style={{ clipPath: clipPathRight }}
      >
        <img src={afterImage} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <Caption className="text-white font-semibold tracking-wider uppercase text-[10px]">{afterLabel}</Caption>
        </div>
      </motion.div>

      {/* Drag Handle */}
      <motion.div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center z-10"
        style={{ left: useTransform(sliderPosition, (val) => `${val}%`), x: "-50%" }}
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0}
        dragMomentum={false}
        onDrag={handleDrag}
      >
        <div className="w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center text-black">
          <ChevronLeft size={16} className="-mr-1" />
          <ChevronRight size={16} className="-ml-1" />
        </div>
      </motion.div>

      {/* Expand Button */}
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors z-20"
      >
        <Maximize2 size={18} />
      </motion.button>
    </div>
  );
}
