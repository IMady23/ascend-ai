'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

interface MotionButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function MotionButton({ 
  children, 
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  ...props 
}: MotionButtonProps) {
  
  const baseStyles = "relative overflow-hidden font-semibold transition-colors flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded-[12px]",
    md: "px-4 py-2 text-base rounded-[16px]",
    lg: "px-6 py-3 text-lg rounded-[16px]"
  };
  
  const variantStyles = {
    primary: "bg-text-primary text-bg-base hover:bg-text-primary/90 focus-visible:ring-text-primary",
    secondary: "bg-bg-surface-elevated text-text-primary hover:bg-border-subtle focus-visible:ring-border",
    ghost: "bg-transparent text-text-primary hover:bg-bg-surface-elevated focus-visible:ring-border",
    glass: "glass-panel hover:bg-bg-glass-standard focus-visible:ring-glass-border"
  };

  return (
    <motion.button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      ) : children}
    </motion.button>
  );
}
