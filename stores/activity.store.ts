import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Activity } from "@/types/activity";
import { ReliabilityManager } from "@/lib/reliability/ReliabilityManager";
import { RELIABILITY_PROFILES } from "@/lib/reliability/types";
import { ActivityRepository } from "@/services/repositories";
import { useUserStore } from "@/stores/user.store";
import { DailyLogRepository } from "@/services/repositories/daily-log.repository";
import { eventBus } from "@/lib/events/EventBus";

export type WorkoutState = "not_started" | "warm_up" | "in_progress" | "paused" | "rest_timer" | "exercise_transition" | "completed" | "saved";

interface ActivityState {
  activities: Activity[];
  currentActivity: Activity | null;
  workoutState: WorkoutState;
  startTime: number | null;
  elapsedTime: number;
  notes: string;
  activeExercises: any[];
  dailySteps: number;
  
  setActivities: (activities: Activity[]) => void;
  setCurrentActivity: (activity: Activity | null) => void;
  setActiveExercises: (exercises: any[]) => void;
  setDailySteps: (steps: number) => Promise<void>;
  
  startWarmup: () => void;
  startExercise: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  updateNotes: (notes: string) => void;
  setWorkoutState: (state: WorkoutState) => void;
  setElapsedTime: (time: number) => void;
  discardWorkout: () => void;
  updateExerciseSet: (exerciseId: string, setId: string, updates: any) => void;
  finishWorkout: () => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: [],
      currentActivity: null,
      workoutState: "not_started",
      startTime: null,
      elapsedTime: 0,
      notes: "",
      activeExercises: [],
      dailySteps: 0,
      
      setActivities: (activities) => set({ activities }),
      setCurrentActivity: (activity) => set({ currentActivity: activity }),
      setActiveExercises: (exercises) => set({ activeExercises: exercises }),
      setDailySteps: async (steps) => {
        set({ dailySteps: steps });
        const userId = useUserStore.getState().userId;
        if (userId) {
          const dateStr = new Date().toISOString().split("T")[0];
          ReliabilityManager.execute(
            'Firestore',
            'updateDailySteps',
            RELIABILITY_PROFILES.DATABASE_WRITE,
            `steps-${userId}-${dateStr}`,
            () => DailyLogRepository.updateDailyLog(userId, dateStr, { steps }),
            'retry'
          ).catch(console.error);

          eventBus.dispatch({
            id: crypto.randomUUID(),
            userId,
            type: 'DISTANCE_LOGGED',
            timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
            metadata: { 
              source: 'steps',
              distanceMeter: steps * 0.762 
            },
            processed: false
          });
        }
      },
      
      startWarmup: () => set({ workoutState: "warm_up", startTime: Date.now() }),
      startExercise: () => set({ workoutState: "in_progress" }),
      pauseWorkout: () => set({ workoutState: "paused" }),
      resumeWorkout: () => set({ workoutState: "in_progress" }),
      updateNotes: (notes) => set({ notes }),
      setWorkoutState: (state) => set({ workoutState: state }),
      setElapsedTime: (time) => set({ elapsedTime: time }),
      
      discardWorkout: () => set({ 
        currentActivity: null, 
        workoutState: "not_started",
        startTime: null,
        elapsedTime: 0,
        notes: "",
        activeExercises: []
      }),
  updateExerciseSet: (exerciseId, setId, updates) => set((state) => {
    const newExercises = state.activeExercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      return {
        ...ex,
        sets: ex.sets.map((s: any) => s.id === setId ? { ...s, ...updates } : s)
      };
    });
    return { activeExercises: newExercises };
  }),
      finishWorkout: () => set((state) => {
        if (!state.currentActivity) return state;
        
        // Move current activity to history
        const completedActivity = { 
          ...state.currentActivity,
          id: state.currentActivity.id || crypto.randomUUID(),
          metrics: {
            ...state.currentActivity.metrics,
            exercises: state.activeExercises,
            elapsedTime: state.elapsedTime,
            notes: state.notes
          }
        };
        
        // Fire & Forget reliable sync to Firestore
        const userId = useUserStore.getState().userId;
        if (userId) {
          ReliabilityManager.execute(
            'Firestore',
            'createActivity',
            RELIABILITY_PROFILES.DATABASE_WRITE,
            crypto.randomUUID(),
            () => ActivityRepository.createActivity(userId, completedActivity as Activity),
            'retry'
          ).catch(console.error);

          eventBus.dispatch({
            id: crypto.randomUUID(),
            userId,
            type: 'WORKOUT_COMPLETED',
            timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
            metadata: { 
              workoutId: completedActivity.id,
              durationMinutes: state.elapsedTime / 60,
              totalVolume: 0 
            },
            processed: false
          });
        }
        
        return {
          activities: [completedActivity, ...state.activities],
          currentActivity: null,
          workoutState: "completed",
          startTime: null,
          elapsedTime: 0,
          notes: "",
          activeExercises: []
        };
      })
    }),
    {
      name: "ascend-activity-storage",
      partialize: (state) => ({
        currentActivity: state.currentActivity,
        workoutState: state.workoutState,
        startTime: state.startTime,
        elapsedTime: state.elapsedTime,
        notes: state.notes,
        activeExercises: state.activeExercises,
        dailySteps: state.dailySteps,
      })
    }
  )
);
