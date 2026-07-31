'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  shape?: 'rect' | 'circle';
}

export function Skeleton({ className, shape = 'rect' }: SkeletonProps) {
  return (
    <motion.div
      className={cn(
        "bg-border-subtle relative overflow-hidden",
        shape === 'circle' ? "rounded-full" : "rounded-[12px]",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent skew-x-[-20deg]"
        animate={{ x: ['-200%', '200%'] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
      />
    </motion.div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("glass-panel p-6 w-full flex flex-col gap-4", className)}>
      <div className="flex items-center gap-3">
        <Skeleton shape="circle" className="w-10 h-10" />
        <Skeleton className="w-1/3 h-5" />
      </div>
      <div className="space-y-2 mt-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-[90%] h-4" />
        <Skeleton className="w-[80%] h-4" />
      </div>
    </div>
  );
}

export function SkeletonChart({ className, height = 300 }: { className?: string, height?: number }) {
  return (
    <div className={cn("glass-panel p-6 w-full flex flex-col gap-4", className)}>
      <Skeleton className="w-1/4 h-6 mb-4" />
      <div className="flex items-end gap-2" style={{ height }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="w-full rounded-t-md rounded-b-none" 
            style={{ height: `${30 + Math.random() * 70}%` }} 
          />
        ))}
      </div>
    </div>
  );
}
