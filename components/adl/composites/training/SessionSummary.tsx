"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, Flame, MapPin, Activity, CheckCircle2 } from "lucide-react";
import { Heading, Caption, BodyText } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { useActivityStore } from "@/stores/activity.store";
import { useUserStore } from "@/stores/user.store";
import { CalculateCardioCalories, CalculateCardioXP, CalculatePace } from "@/lib/calculations/metrics";

export function SessionSummary() {
  const { currentActivity, elapsedTime, distance, cardioSteps, elevation, activeExercises, setWorkoutState } = useActivityStore() as any;
  const { profile } = useUserStore();

  const isCardio = currentActivity?.category === "cardio" || ["Walking", "Running", "Jogging", "Cycling", "Trekking", "Dancing"].includes(currentActivity?.type || "");
  const activityType = currentActivity?.type || "Workout";
  
  let calories = currentActivity?.calories || 0;
  let xp = currentActivity?.xp || 0;
  
  // Use final distance (which was derived from steps if walking)
  const finalDistance = distance || (activityType === "Walking" ? (cardioSteps * 0.762) / 1000 : 0);
  
  if (isCardio) {
    calories = CalculateCardioCalories(activityType, elapsedTime / 60, profile?.identity?.weight || 70);
    xp = CalculateCardioXP(finalDistance, elapsedTime / 60, elevation);
  } else {
    // Strength XP estimation
    const totalSets = activeExercises.reduce((acc: number, ex: any) => acc + ex.sets.length, 0);
    const completedSets = activeExercises.reduce((acc: number, ex: any) => acc + ex.sets.filter((s: any) => s.completed).length, 0);
    xp = totalSets > 0 ? Math.floor((completedSets / totalSets) * 1200) : 0;
  }

  const fatBurn = Math.round((calories * 0.5) / 9); // Estimated fat oxidation for moderate intensity
  const pace = CalculatePace(elapsedTime / 60, finalDistance);
  const avgSpeed = finalDistance > 0 && elapsedTime > 0 ? (finalDistance / (elapsedTime / 3600)).toFixed(1) : "0";

  // Mock goal logic
  const goalCompletion = Math.min(Math.round(((cardioSteps || 0) / 8000) * 100), 100) || Math.min(Math.round(((elapsedTime / 60) / (currentActivity?.durationMinutes || 30)) * 100), 100);

  const dismissCelebration = () => {
    setWorkoutState("not_started");
  };

  const formatTime = (seconds: number) => Math.ceil(seconds / 60);

  return (
    <div className="fixed inset-0 z-50 bg-base/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-orange)]/10 via-transparent to-[var(--color-accent-gold)]/10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
        className="relative z-10 w-full max-w-md bg-[var(--color-bg-glass-active)] border border-border-subtle rounded-[var(--radius-2xl)] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-[var(--color-accent-orange)]/20 to-transparent p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-accent-gold)] to-[var(--color-accent-orange)] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(var(--color-accent-gold-rgb),0.5)]">
            <CheckCircle2 size={32} className="text-primary" />
          </div>
          <Heading level="h2" className="text-2xl font-bold">{activityType} Completed</Heading>
        </div>

        {/* Metrics Grid */}
        <div className="p-6 pt-0 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col border-b border-border-subtle pb-3">
              <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">Time</Caption>
              <span className="font-mono text-xl">{formatTime(elapsedTime)} <span className="text-sm font-sans text-[var(--color-text-muted)]">min</span></span>
            </div>
            
            {isCardio && cardioSteps > 0 && (
              <div className="flex flex-col border-b border-border-subtle pb-3">
                <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">Steps</Caption>
                <span className="font-mono text-xl">{cardioSteps.toLocaleString()}</span>
              </div>
            )}
            
            {isCardio && finalDistance > 0 && (
              <div className="flex flex-col border-b border-border-subtle pb-3">
                <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">Distance</Caption>
                <span className="font-mono text-xl">{finalDistance.toFixed(2)} <span className="text-sm font-sans text-[var(--color-text-muted)]">km</span></span>
              </div>
            )}
            
            <div className="flex flex-col border-b border-border-subtle pb-3">
              <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">Calories</Caption>
              <span className="font-mono text-xl">{calories} <span className="text-sm font-sans text-[var(--color-text-muted)]">kcal</span></span>
            </div>

            {isCardio && (
              <div className="flex flex-col border-b border-border-subtle pb-3">
                <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">Fat Burn (Est.)</Caption>
                <span className="font-mono text-xl text-[var(--color-accent-pink)]">{fatBurn} <span className="text-sm font-sans text-[var(--color-text-muted)]">g</span></span>
              </div>
            )}

            <div className="flex flex-col border-b border-border-subtle pb-3">
              <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">XP Earned</Caption>
              <span className="font-mono text-xl text-[var(--color-accent-gold)]">+{xp}</span>
            </div>

            {isCardio && finalDistance > 0 && (
              <div className="flex flex-col border-b border-border-subtle pb-3">
                <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">Avg Speed</Caption>
                <span className="font-mono text-xl">{avgSpeed} <span className="text-sm font-sans text-[var(--color-text-muted)]">km/h</span></span>
              </div>
            )}

            <div className="flex flex-col border-b border-border-subtle pb-3">
              <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">Daily Goal</Caption>
              <span className="font-mono text-xl text-[var(--color-success)]">{goalCompletion}%</span>
            </div>
          </div>
          
          {/* AI Insight */}
          <div className="mt-4 p-4 rounded-[var(--radius-lg)] bg-[var(--color-accent-indigo)]/5 border border-[var(--color-accent-indigo)]/20 relative">
             <div className="absolute top-0 right-0 p-2 opacity-20"><Flame size={40} className="text-[var(--color-accent-indigo)]" /></div>
             <Caption className="text-[var(--color-accent-indigo)] font-semibold uppercase tracking-wider mb-2">AI Insight</Caption>
             <BodyText size="sm" className="text-primary leading-relaxed">
               "Nice work! You're nearly halfway to your daily goal. Consistent low-intensity sessions like this are excellent for improving mitochondrial efficiency without central fatigue."
             </BodyText>
          </div>

          <div className="pt-4">
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth 
              onClick={dismissCelebration}
              className="bg-base text-primary hover:bg-surface border border-border-subtle"
            >
              Done
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
