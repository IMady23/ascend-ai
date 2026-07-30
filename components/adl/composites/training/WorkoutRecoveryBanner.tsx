"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, Play, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActivityStore } from "@/stores/activity.store";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Button } from "@/components/adl/primitives/Button";

export function WorkoutRecoveryBanner() {
  const router = useRouter();
  const { workoutState, currentActivity, activeExercises, elapsedTime, discardWorkout } = useActivityStore() as any;

  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Show banner if a session is in progress, paused, or resting
    const isActiveSession = ["warm_up", "in_progress", "paused", "rest_timer"].includes(workoutState);
    if (isActiveSession && currentActivity) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [workoutState, currentActivity]);

  if (!isVisible) return null;

  // Safely find the current exercise based on completion
  const uncompletedEx = activeExercises.find((ex: any) => ex.sets.some((s: any) => !s.completed));
  const currentExName = uncompletedEx ? uncompletedEx.name : (activeExercises[activeExercises.length - 1]?.name || "Workout");

  // Calculate elapsed time in minutes
  const elapsedMinutes = Math.floor(elapsedTime / 60);

  const handleResume = () => {
    router.push("/training");
  };

  const handleDiscard = () => {
    discardWorkout();
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
      >
        <GlassCard className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[var(--color-accent-orange)] shadow-lg shadow-[var(--color-accent-orange)]/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-accent-orange)]/10 flex items-center justify-center text-[var(--color-accent-orange)] flex-shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Unfinished Workout Detected</h4>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                You have an unfinished {currentActivity?.type || "Training"} session from {elapsedMinutes} minutes ago.
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {elapsedMinutes}m elapsed</span>
                <span className="flex items-center gap-1">• {currentExName}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="ghost" size="sm" onClick={handleDiscard} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 flex-1 md:flex-none">
              <X className="w-4 h-4 mr-1.5" /> Discard
            </Button>
            <Button variant="primary" size="sm" onClick={handleResume} className="bg-[var(--color-accent-orange)] hover:bg-[var(--color-accent-orange-light)] border-none flex-1 md:flex-none">
              <Play className="w-4 h-4 mr-1.5 fill-current" /> Resume
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
}
