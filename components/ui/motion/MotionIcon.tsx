'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

interface MotionIconProps extends HTMLMotionProps<"div"> {
  icon: React.ElementType;
  size?: number;
  color?: string;
  className?: string;
}

export function MotionIcon({ 
  icon: Icon,
  size = 24,
  color,
  className,
  ...props
}: MotionIconProps) {
  return (
    <motion.div
      className={cn("inline-flex items-center justify-center", className)}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ color }}
      {...props}
    >
      <Icon size={size} strokeWidth={2} />
    </motion.div>
  );
}
