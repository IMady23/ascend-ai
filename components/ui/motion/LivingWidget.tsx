'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface LivingWidgetProps {
  children: React.ReactNode;
  className?: string;
  isIdle?: boolean;
  theme?: 'dark' | 'light' | 'system';
}

export function LivingWidget({ 
  children, 
  className, 
  isIdle = true, 
  theme = 'dark' 
}: LivingWidgetProps) {
  const prefersReducedMotion = useReducedMotion();

  // Gentle idle breathing
  const idleAnimation = {
    scale: [1, 1.005, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  };

  return (
    <motion.div
      className={cn("relative w-full h-full", className)}
      animate={(isIdle && !prefersReducedMotion) ? idleAnimation : { scale: 1 }}
    >
      {/* 
        Theme awareness layer. 
        In Dark mode, we inject luxury black/gold ambient light.
        In Light mode, we use clean glass reflections.
      */}
      {theme === 'dark' ? (
        <div className="absolute inset-0 z-[-1] pointer-events-none mix-blend-screen opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--color-accent-gold)_0%,_transparent_70%)]" />
      ) : (
        <div className="absolute inset-0 z-[-1] pointer-events-none mix-blend-overlay opacity-30 bg-[linear-gradient(135deg,_rgba(255,255,255,0.4)_0%,_transparent_100%)]" />
      )}
      
      {children}
    </motion.div>
  );
}
