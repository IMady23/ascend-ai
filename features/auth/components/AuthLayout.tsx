"use client";

import { motion } from "framer-motion";
import { HallEnvironment } from "@/components/hall/HallEnvironment";

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  // Staggered login sequence:
  // 1. Environment stabilizes (0-1s)
  // 2. Card appears (1s)
  // 3. Logo & Text (1.5s)
  // 4. Form Fields (handled via children delay or wrapper delay) (2s)
  return (
    <div className="min-h-screen bg-[#0A0D14] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* 1. Reuse Hall Atmosphere (Stage 5 matches Portal calm aesthetic) */}
      <HallEnvironment stage={5} />

      {/* Foreground Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 flex flex-col gap-8"
      >
        <div className="flex flex-col items-center text-center">
          <motion.img 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
            src="/ascend-logo.svg" 
            alt="Ascend" 
            className="w-16 h-16 mb-6 opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
          />
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7, ease: "easeOut" }}
            className="text-2xl font-light tracking-[0.2em] text-primary uppercase mb-2"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.9, ease: "easeOut" }}
            className="text-secondary text-sm tracking-widest uppercase opacity-70"
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.1, ease: "easeOut" }}
          className="glass-premium p-8 shadow-[0_0_80px_rgba(37,99,255,0.05)]"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
