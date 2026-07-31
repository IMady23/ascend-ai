"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { Play, Pause, Square, MapPin, Activity, Mountain } from "lucide-react";
import { useActivityStore } from "@/stores/activity.store";
import { CalculatePace, CalculateCardioCalories, CalculateCardioXP } from "@/lib/calculations/metrics";
import { useUserStore } from "@/stores/user.store";

export function CardioHUD() {
  const { currentActivity, workoutState, elapsedTime, setElapsedTime, setWorkoutState, finishWorkout, distance, cardioSteps, elevation, updateCardioMetrics } = useActivityStore() as any;
  const { profile } = useUserStore();
  
  const [isActive, setIsActive] = useState(workoutState === "in_progress");
  const [inputMode, setInputMode] = useState(false);

  useEffect(() => {
    setIsActive(workoutState === "in_progress");
  }, [workoutState]);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setElapsedTime(elapsedTime + 1);
      }, 1000);
    } else if (!isActive && elapsedTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, elapsedTime, setElapsedTime]);

  const toggleTimer = () => {
    if (isActive) {
      setWorkoutState("paused");
    } else {
      setWorkoutState("in_progress");
    }
  };

  const handleStop = () => {
    setWorkoutState("paused");
    setIsActive(false);
    setInputMode(true);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m < 10 && h > 0 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const activityType = currentActivity?.type || "Walking";
  const pace = CalculatePace(elapsedTime / 60, distance);
  const calories = CalculateCardioCalories(activityType, elapsedTime / 60, profile?.identity?.weight || 70);
  const xp = CalculateCardioXP(activityType, elapsedTime / 60, distance);

  const needsDistance = ["Running", "Jogging", "Cycling"].includes(activityType);
  const needsSteps = ["Running", "Jogging", "Walking", "Trekking"].includes(activityType);
  const needsElevation = ["Cycling", "Trekking"].includes(activityType);

  const handleFinish = () => {
    let finalDistance = distance;
    if (activityType === "Walking" && cardioSteps > 0 && distance === 0) {
      finalDistance = (cardioSteps * 0.762) / 1000;
      updateCardioMetrics({ distance: finalDistance });
    }
    finishWorkout();
  };

  return (
    <GlassCard className="p-6 md:p-8 flex flex-col items-center justify-center space-y-8 bg-gradient-to-br from-[var(--color-bg-glass-active)] to-[var(--color-bg-surface)]">
      <div className="text-center">
        <Caption className="text-[var(--color-accent-orange)] tracking-widest uppercase font-bold mb-2">Live Session • {activityType}</Caption>
        <div className="font-mono text-6xl md:text-8xl font-bold tracking-tighter text-primary tabular-nums">
          {formatTime(elapsedTime)}
        </div>
        <div className="flex justify-center gap-6 mt-4 opacity-70">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-mono">{calories}</span>
            <Caption className="text-[var(--color-text-muted)]">Kcal</Caption>
          </div>
          {distance > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-mono">{distance}</span>
              <Caption className="text-[var(--color-text-muted)]">Km</Caption>
            </div>
          )}
          {pace > 0 && distance > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-mono">{pace.toFixed(1)}</span>
              <Caption className="text-[var(--color-text-muted)]">Min/Km</Caption>
            </div>
          )}
        </div>
      </div>

      {!inputMode ? (
        <div className="flex gap-4">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center p-0 ${isActive ? "bg-[var(--color-warning)] hover:bg-[var(--color-warning)]/80" : "bg-[var(--color-success)] hover:bg-[var(--color-success)]/80"} border-none`}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
          </Button>
          
          {elapsedTime > 0 && (
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleStop}
              className="w-20 h-20 rounded-full flex items-center justify-center p-0 bg-[var(--color-danger)] hover:bg-[var(--color-danger)]/80 border-none"
            >
              <Square size={28} />
            </Button>
          )}
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <Heading level="h4" className="text-center mb-4">Log Session Metrics</Heading>
          
          {needsDistance && (
            <div className="flex items-center gap-4 bg-base p-3 rounded-[var(--radius-lg)] border border-border-subtle">
              <MapPin className="text-[var(--color-accent-blue)]" />
              <input 
                type="number" 
                placeholder="Distance (km)"
                value={distance || ""}
                onChange={(e) => updateCardioMetrics({ distance: parseFloat(e.target.value) || 0 })}
                className="bg-transparent border-none outline-none flex-1 font-mono text-xl"
              />
            </div>
          )}
          
          {needsSteps && (
            <div className="flex items-center gap-4 bg-base p-3 rounded-[var(--radius-lg)] border border-border-subtle">
              <Activity className="text-[var(--color-success)]" />
              <input 
                type="number" 
                placeholder="Steps"
                value={cardioSteps || ""}
                onChange={(e) => updateCardioMetrics({ cardioSteps: parseInt(e.target.value, 10) || 0 })}
                className="bg-transparent border-none outline-none flex-1 font-mono text-xl"
              />
            </div>
          )}

          {needsElevation && (
            <div className="flex items-center gap-4 bg-base p-3 rounded-[var(--radius-lg)] border border-border-subtle">
              <Mountain className="text-[var(--color-accent-orange)]" />
              <input 
                type="number" 
                placeholder="Elevation (m)"
                value={elevation || ""}
                onChange={(e) => updateCardioMetrics({ elevation: parseInt(e.target.value, 10) || 0 })}
                className="bg-transparent border-none outline-none flex-1 font-mono text-xl"
              />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button variant="ghost" fullWidth onClick={() => { setInputMode(false); toggleTimer(); }}>Resume</Button>
            <Button variant="primary" fullWidth onClick={handleFinish} className="bg-[var(--color-success)] hover:bg-[var(--color-success)]/80 border-none">Save & Finish</Button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
