import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { ProgressMotion } from "@/utils/motion";

// ----------------------------------------------------------------------
// ProgressBar
// ----------------------------------------------------------------------

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  color?: string; // e.g. var(--color-primary)
  showLabel?: boolean;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  color = "var(--color-primary)", 
  showLabel = false, 
  className,
  ...props 
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-secondary font-mono">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-surface overflow-hidden border border-border-subtle">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}
          variants={ProgressMotion.fill}
          initial="initial"
          animate="animate"
          custom={percentage}
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// ProgressRing
// ----------------------------------------------------------------------

export interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  icon?: React.ReactNode;
}

export function ProgressRing({
  value,
  max = 100,
  size = 64,
  strokeWidth = 6,
  color = "var(--color-primary)",
  icon,
  className,
  ...props
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div 
      className={cn("relative flex items-center justify-center", className)} 
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size} className="-rotate-90 transform">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-bg-surface)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Foreground Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.1 }}
          strokeDasharray={circumference}
        />
      </svg>
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-primary">
        {icon ? icon : (
          <span className="font-mono text-sm font-bold tracking-tighter">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    </div>
  );
}
