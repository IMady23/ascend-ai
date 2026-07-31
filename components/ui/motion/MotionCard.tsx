'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

interface MotionCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  interactive?: boolean;
}

export function MotionCard({ 
  children, 
  className, 
  glowColor = 'var(--color-accent-gold)', 
  interactive = true,
  ...props 
}: MotionCardProps) {
  return (
    <motion.div
      className={cn(
        "glass-panel relative overflow-hidden transition-colors",
        interactive && "cursor-pointer",
        className
      )}
      whileHover={interactive ? {
        y: -4,
        scale: 1.01,
      } : {}}
      whileTap={interactive ? {
        scale: 0.98,
      } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      {...props}
    >
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
