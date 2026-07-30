"use client";

import React from "react";
import { motion } from "framer-motion";
import { Timing } from "@/utils/motion";

export function AmbientLighting({ currentStage }: { currentStage: number }) {
  // As the user progresses, the blue lights turn off to isolate the doorway.
  // Stage 5 is the final portal.
  const isFinalStage = currentStage >= 5;
  const isTransitioning = currentStage > 5;
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0A0D14]">
      {/* Base Floor Reflection */}
      <div 
        className="absolute bottom-0 w-full h-1/2"
        style={{
          background: "linear-gradient(to top, rgba(37,99,255,0.08), transparent)",
          opacity: isFinalStage ? 0 : 1,
          transition: "opacity 2s ease-in-out",
        }}
      />
      
      {/* Side Edge Lights (Simulating the futuristic corridor) */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-32 will-change-transform"
        style={{
          background: "linear-gradient(to right, rgba(37,99,255,0.08), transparent)",
        }}
        animate={{
          opacity: isFinalStage ? 0 : [0.6, 0.8, 0.6],
        }}
        transition={{
          opacity: isFinalStage ? { duration: 1.5 } : { repeat: Infinity, duration: 4, ease: "easeInOut" },
        }}
      />
      
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-32 will-change-transform"
        style={{
          background: "linear-gradient(to left, rgba(16,185,129,0.04), transparent)",
        }}
        animate={{
          opacity: isFinalStage ? 0 : [0.4, 0.6, 0.4],
        }}
        transition={{
          opacity: isFinalStage ? { duration: 1.5 } : { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 },
        }}
      />
      
      {/* Volumetric center light that guides the way */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 60%)",
        }}
        animate={{
          opacity: isTransitioning ? 0 : (isFinalStage ? 1 : 0.5),
          scale: isFinalStage ? 1.5 : [1, 1.05, 1],
        }}
        transition={{
          duration: isFinalStage ? 2 : 4,
          repeat: isFinalStage ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
