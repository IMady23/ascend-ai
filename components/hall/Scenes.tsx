"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { HallMotion, Timing } from "@/utils/motion";
import { EngraveText } from "@/components/adl/typography/EngraveText";
import { Button } from "@/components/adl/primitives/Button";

// Shared Scene Wrapper
function SceneContainer({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      variants={HallMotion.room}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`absolute inset-0 flex items-center justify-center p-8 text-center ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 0. Entrance
// ----------------------------------------------------------------------
export function EntranceScene() {
  return (
    <SceneContainer>
      <div className="max-w-2xl z-10">
        <motion.div
          initial={{ scale: 0.95, filter: "blur(20px)", opacity: 0 }}
          animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-24 h-24 mx-auto mb-8 opacity-80 relative"
        >
          <Image src="/ascend-logo.svg" alt="Ascend Logo" fill className="object-contain" priority />
        </motion.div>
        <h1 className="text-4xl md:text-5xl tracking-[0.2em] font-light text-primary uppercase mb-4">
          <EngraveText duration={2}>The Hall of Ascension</EngraveText>
        </h1>
        <p className="text-secondary tracking-widest text-sm uppercase mt-8 opacity-50">
          <EngraveText delay={1} duration={1.5}>Scroll or Click to Walk</EngraveText>
        </p>
      </div>
    </SceneContainer>
  );
}

// ----------------------------------------------------------------------
// 1. Decision Room
// ----------------------------------------------------------------------
export function DecisionRoom() {
  return (
    <SceneContainer>
      <div className="hall-wall p-12 md:p-24 max-w-4xl rounded-sm border-l-4 border-l-[var(--color-accent-blue)] z-10 shadow-[0_0_40px_rgba(59,130,246,0.02)]">
        <h2 className="text-3xl md:text-5xl font-light leading-tight tracking-wide text-primary text-left">
          <EngraveText duration={3}>Discipline builds what motivation only begins.</EngraveText>
        </h2>
        <div className="mt-8 flex items-center gap-4 opacity-70">
          <div className="w-8 h-[1px] bg-[var(--color-accent-gold)]" />
          <span className="text-xs uppercase tracking-widest text-[var(--color-accent-gold)] font-medium">Ascend AI Principle</span>
        </div>
      </div>
    </SceneContainer>
  );
}

// ----------------------------------------------------------------------
// 2. Mind Room
// ----------------------------------------------------------------------
export function MindRoom() {
  return (
    <SceneContainer>
      <div className="w-full max-w-5xl relative h-[60vh] flex items-center justify-center perspective-[1000px] z-10">
        <motion.div className="absolute top-1/4 left-10 text-xl font-light text-secondary italic opacity-40"
          animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <EngraveText delay={0.2}>"One decision can rewrite an entire lifetime."</EngraveText>
        </motion.div>
        
        <div className="hall-wall p-12 max-w-2xl rounded-sm z-10 border-b-4 border-b-[var(--color-accent-emerald)] shadow-[0_0_40px_rgba(16,185,129,0.02)]">
          <h2 className="text-3xl md:text-4xl font-light leading-tight tracking-wide text-primary text-center">
            <EngraveText duration={2.5}>The strongest version of you is still under construction.</EngraveText>
          </h2>
        </div>

        <motion.div className="absolute bottom-1/4 right-10 text-xl font-light text-secondary italic opacity-40"
          animate={{ y: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
          <EngraveText delay={0.5}>"Progress is earned quietly before it's admired publicly."</EngraveText>
        </motion.div>
      </div>
    </SceneContainer>
  );
}

// ----------------------------------------------------------------------
// 3. Discipline Room
// ----------------------------------------------------------------------
export function DisciplineRoom() {
  return (
    <SceneContainer>
      <div className="max-w-5xl w-full z-10">
        <h3 className="text-secondary tracking-widest uppercase mb-16 opacity-70 text-sm">
          <EngraveText duration={1.5}>The Path of Consistency</EngraveText>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: "🏆", label: "First Victory" },
            { icon: "🔥", label: "Relentless" },
            { icon: "⚡", label: "Unbreakable" },
            { icon: "⛰️", label: "Ascension" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.15 + 0.5, duration: Timing.slow }}
              className="hall-wall aspect-square rounded-full flex flex-col items-center justify-center p-8 gap-4 border-border-subtle bg-base/40"
            >
              <span className="text-4xl md:text-5xl opacity-80">{item.icon}</span>
              <span className="text-xs tracking-widest uppercase text-[var(--color-text-muted)]">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </SceneContainer>
  );
}

// ----------------------------------------------------------------------
// 4. Future Room
// ----------------------------------------------------------------------
export function FutureRoom() {
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    // 2 second delay to show the quote after the silhouette is visible
    const timer = setTimeout(() => setShowQuote(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SceneContainer>
      <div className="flex flex-col items-center justify-center relative w-full h-[60vh] z-10">
        <AnimatePresence>
          {showQuote && (
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-4xl font-light tracking-[0.1em] text-primary"
            >
              <EngraveText duration={2}>Your strongest self is waiting.</EngraveText>
            </motion.h2>
          )}
        </AnimatePresence>
      </div>
    </SceneContainer>
  );
}

// ----------------------------------------------------------------------
// 5. Final Portal
// ----------------------------------------------------------------------
interface FinalPortalProps {
  onBeginJourney: () => void;
}

export function FinalPortal({ onBeginJourney }: FinalPortalProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Staggered text sequence (Only starts when scene is active)
    const t1 = setTimeout(() => setStep(1), 500); // EVERY TRANSFORMATION
    const t2 = setTimeout(() => setStep(2), 2000); // begins with
    const t3 = setTimeout(() => setStep(3), 3000); // ONE DECISION.
    const t4 = setTimeout(() => setStep(4), 4500); // Button

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const handleDoorOpen = () => {
    onBeginJourney(); // Immediately trigger the white transition overlay
  };

  return (
    <SceneContainer>
      
      {/* Floor Reflections of Past Quotes */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-[30vh] pointer-events-none z-0 overflow-hidden flex flex-col items-center justify-start gap-4 opacity-10"
        style={{ transform: "perspective(500px) rotateX(60deg) scale(2)", transformOrigin: "bottom center" }}
        transition={{ duration: 1.5 }}
      >
        <span className="text-2xl font-light italic text-primary blur-[2px]">Discipline builds what motivation only begins.</span>
        <span className="text-xl font-light italic text-primary blur-[3px]">The strongest version of you is still under construction.</span>
      </motion.div>

      <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-xl">
        <div className="w-full flex flex-col items-center gap-12">
          
          <div className="text-center flex flex-col gap-6 min-h-[150px]">
            <AnimatePresence>
              {step >= 1 && (
                <motion.h1 
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-lg md:text-2xl tracking-[0.3em] font-light text-primary uppercase"
                >
                  <EngraveText duration={1.5}>EVERY TRANSFORMATION</EngraveText>
                </motion.h1>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step >= 2 && (
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-secondary tracking-widest text-sm uppercase opacity-70"
                >
                  begins with
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step >= 3 && (
                <motion.h1 
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-lg md:text-2xl tracking-[0.3em] font-bold text-primary uppercase"
                >
                  <EngraveText duration={1.5}>ONE DECISION.</EngraveText>
                </motion.h1>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step >= 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-4">
                  <Button 
                    size="lg" 
                    variant="primary" 
                    onClick={handleDoorOpen}
                    className="shadow-glow-ai px-12 tracking-wider border border-border-subtle bg-surface-elevated text-text-primary hover:bg-surface transition-all"
                  >
                    Begin Your Journey →
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SceneContainer>
  );
}
