"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/utils/cn";
import { Timing } from "@/utils/motion";

interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function RevealText({ children, className, delay = 0, duration = Timing.slow }: RevealTextProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
      animate={
        isInView 
          ? { opacity: 1, y: 0, filter: "blur(0px)" } 
          : { opacity: 0, y: 20, filter: "blur(12px)" }
      }
      transition={{ 
        duration, 
        delay, 
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  );
}
