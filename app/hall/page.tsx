"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, m as motion, LazyMotion, domAnimation } from "framer-motion";
import { HallProgress } from "@/components/hall/HallProgress";
import { HallEnvironment } from "@/components/hall/HallEnvironment";
import { HallAudio } from "@/components/hall/HallAudio";
import { EntranceScene, DecisionRoom, MindRoom, DisciplineRoom, FutureRoom, FinalPortal } from "@/components/hall/Scenes";
import { useRouter } from "next/navigation";

const TOTAL_STAGES = 3;
const STAGE_LABELS = ["Entrance", "The Decision", "Ascension"];

export default function HallOfAscensionPage() {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  
  // Auto advance from entrance
  useEffect(() => {
    if (stage === 0) {
      const t = setTimeout(() => setStage(1), 3000);
      return () => clearTimeout(t);
    }
  }, [stage]);
  
  const handleNext = useCallback(() => {
    if (stage >= 2) return;
    setStage((prev) => Math.min(prev + 1, TOTAL_STAGES - 1));
  }, [stage]);
  
  const handlePrev = useCallback(() => {
    if (stage <= 1) return;
    setStage((prev) => Math.max(prev - 1, 1));
  }, [stage]);
  
  useEffect(() => {
    // Scroll to navigate chapters
    const handleWheel = (e: WheelEvent) => {
      
      if (e.deltaY > 50) {
        handleNext();
      } else if (e.deltaY < -50) {
        handlePrev();
      }
    };
    
    // Click to navigate (except on buttons)
    const handleClick = (e: MouseEvent) => {
      if (stage >= 2) return;
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() !== "button" && !target.closest("button")) {
        handleNext();
      }
    };
    
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("click", handleClick);
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("click", handleClick);
    };
  }, [handleNext, handlePrev, stage]);
  
  const handleBeginJourney = () => {
    router.push("/login");
  };
  
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-base">
      {/* Generative Environmental Audio */}
      <HallAudio stage={stage} />

      {/* Dynamic Background, Particles, and Parallax */}
      <HallEnvironment stage={stage} />

      {/* Global Progressive Future Self Silhouette */}
      <motion.div
        className="absolute inset-0 flex justify-center items-center pointer-events-none z-0"
        animate={{
          opacity: stage < 1 ? 0 : stage === 1 ? 0.3 : stage === 2 ? 0.8 : 0,
          filter: stage < 1 ? "blur(20px)" : stage === 1 ? "blur(10px)" : stage === 2 ? "blur(2px)" : "blur(20px)",
          scale: stage === 2 ? 1.05 : 1
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <div 
          className="w-[200px] h-[600px] bg-[#FFFFFF] rounded-[100px]"
          style={{
            boxShadow: stage >= 2 ? "0 0 100px 20px rgba(255,255,255,0.8)" : "none",
            background: "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))"
          }}
        />
      </motion.div>
      
      {/* Cinematic Camera Wrapper */}
      <LazyMotion features={domAnimation}>
        <motion.div 
          className="absolute inset-0 w-full h-full flex items-center justify-center transform-gpu"
          style={{ perspective: "1000px" }}
          animate={{
            scale: stage === 6 ? 1.5 : 1,
            opacity: stage === 6 ? 0 : 1
          }}
          transition={{ duration: 1.5, ease: "easeIn" }}
        >
          <AnimatePresence mode="wait">
            {stage === 0 && <EntranceScene key="0" />}
            {stage === 1 && <DecisionRoom key="1" />}
            {(stage === 2 || stage === 3) && <FinalPortal key="2" onBeginJourney={handleBeginJourney} />}
          </AnimatePresence>
        </motion.div>
      </LazyMotion>
      
      {/* Progress Indicators (hide on final transition) */}
      <AnimatePresence>
        {stage < 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HallProgress currentStage={stage} totalStages={TOTAL_STAGES} labels={STAGE_LABELS} />
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
