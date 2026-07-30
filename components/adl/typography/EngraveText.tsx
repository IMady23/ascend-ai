"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Timing } from "@/utils/motion";

interface EngraveTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export function EngraveText({ children, className, delay = 0, duration = 3, ...props }: EngraveTextProps) {
  return (
    <span className={cn("relative inline-block", className)} {...props}>
      {/* 
        The engraving effect is achieved by rendering the text normally (but transparent),
        and using an animated linear-gradient mask to reveal it from left to right.
        A faint glowing edge is simulated via a drop-shadow.
      */}
      <motion.span
        className="block"
        style={{
          background: "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        initial={{
          clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)"
        }}
        animate={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
        }}
        transition={{
          duration: duration,
          ease: "easeInOut",
          delay: delay,
        }}
      >
        {children}
      </motion.span>
      
      {/* 
        This is the underlying "engraved stone" track. It provides a faint 
        illuminated edge around the letters before they are fully lit.
      */}
      <span className="absolute inset-0 block text-[var(--color-glass-border)] opacity-30 select-none pointer-events-none -z-10 blur-[1px]">
        {children}
      </span>
    </span>
  );
}
