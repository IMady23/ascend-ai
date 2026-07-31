import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RecoveryProfile, RecoveryState, RecoveryRecommendation } from "@/types/recovery";
import { RecoveryRepository } from "@/services/repositories/recovery.repository";
import { useUserStore } from "@/stores/user.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useActivityStore } from "@/stores/activity.store";
import { eventBus } from "@/lib/events/EventBus";

export interface ExplanationPoint {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  text: string;
}

export interface MuscleRecovery {
  chest: number;
  back: number;
  legs: number;
  shoulders: number;
  arms: number;
}

interface EnhancedRecoveryState {
  currentProfile: RecoveryProfile | null;
  history: RecoveryProfile[];
  muscleRecovery: MuscleRecovery;
  explanation: ExplanationPoint[];
  isLoading: boolean;

  fetchRecovery: () => Promise<void>;
  calculateRecoveryScore: () => void;
}

export const useRecoveryStore = create<EnhancedRecoveryState>()(
  persist(
    (set, get) => ({
      currentProfile: null,
      history: [],
      muscleRecovery: {
        chest: 100,
        back: 100,
        legs: 100,
        shoulders: 100,
        arms: 100
      },
      explanation: [],
      isLoading: false,

      fetchRecovery: async () => {
        const userId = useUserStore.getState().userId;
        if (!userId) {
          // If no user, just calculate local state
          get().calculateRecoveryScore();
          return;
        }

        set({ isLoading: true });
        
        try {
          const [current, history] = await Promise.all([
            RecoveryRepository.getLatestRecoveryProfile(userId).catch(() => null),
            RecoveryRepository.getRecoveryHistory(userId, 7).catch(() => [])
          ]);

          if (current) {
            set({
              currentProfile: current,
              history: history || [],
              isLoading: false
            });
            // Still calculate the local transparent score on top of the fetched profile
            get().calculateRecoveryScore();
          } else {
            // First time, calculate and save
            get().calculateRecoveryScore();
            set({ isLoading: false });
          }
        } catch (error) {
          console.error(error);
          set({ isLoading: false });
          get().calculateRecoveryScore();
        }
      },

      calculateRecoveryScore: () => {
        // Transparent, Explainable AI logic
        const nutritionStore = useNutritionStore.getState();
        const activityStore = useActivityStore.getState();
        const userStore = useUserStore.getState();

        const targetWater = (userStore.profile?.preferences?.goals?.waterMl || userStore.profile?.targets?.water || 3000) / 1000;
        const targetProtein = userStore.profile?.preferences?.goals?.proteinGrams || userStore.profile?.targets?.protein || 150;
        const targetCalories = userStore.profile?.preferences?.goals?.calories || userStore.profile?.targets?.dailyCalories || 2500;

        let baseScore = 100;
        let explanations: ExplanationPoint[] = [];
        let recommendations: RecoveryRecommendation[] = [];

        // 1. Hydration Factor (20%)
        const waterProgress = targetWater > 0 ? nutritionStore.dailyWaterMl / (targetWater * 1000) : 0;
        if (waterProgress < 0.5) {
          baseScore -= 15;
          explanations.push({ factor: "Hydration", impact: "negative", text: `Severely under-hydrated (${(waterProgress*100).toFixed(0)}%). Blood volume and nutrient delivery are impaired.` });
          recommendations.push({ title: "Hydrate Immediately", description: "Drink 500ml of water right now to kickstart recovery.", reason: ["Low water intake"], confidence: "High", priority: "CRITICAL" });
        } else if (waterProgress < 0.8) {
          baseScore -= 5;
          explanations.push({ factor: "Hydration", impact: "negative", text: `Slightly under daily water target. Muscles may feel tighter.` });
        } else {
          explanations.push({ factor: "Hydration", impact: "positive", text: `Hydration target met! Cellular recovery is optimal.` });
        }

        // 2. Protein Factor (20%)
        const proteinProgress = targetProtein > 0 ? nutritionStore.dailyProtein / targetProtein : 0;
        if (proteinProgress < 0.6) {
          baseScore -= 10;
          explanations.push({ factor: "Protein", impact: "negative", text: `Protein intake is too low for muscle synthesis.` });
          recommendations.push({ title: "Increase Protein", description: "Consume a high-protein meal to prevent muscle breakdown.", reason: ["Low protein intake"], confidence: "High", priority: "HIGH" });
        } else if (proteinProgress >= 1.0) {
          explanations.push({ factor: "Protein", impact: "positive", text: `Protein target crushed! Muscle synthesis is fully fueled.` });
        } else {
          explanations.push({ factor: "Protein", impact: "neutral", text: `Moderate protein intake. Try to hit your target before bed.` });
        }

        // 3. Calorie Factor (10%)
        const calorieProgress = targetCalories > 0 ? nutritionStore.dailyCalories / targetCalories : 0;
        if (calorieProgress < 0.5) {
          baseScore -= 5;
          explanations.push({ factor: "Energy", impact: "negative", text: `High caloric deficit. Systemic recovery will be slower.` });
        } else {
          explanations.push({ factor: "Energy", impact: "positive", text: `Adequate energy available for recovery processes.` });
        }

        // 4. Activity Fatigue (50%)
        let recentVolume = 0;
        const recentActivities = activityStore.activities.slice(0, 3);
        recentActivities.forEach(act => {
          if (act.metrics?.totalVolume) {
            recentVolume += act.metrics.totalVolume;
          } else if (act.type === "cardio" || act.type === "running" || act.type === "cycling") {
            recentVolume += (act.durationMinutes * 100); // rough cardio fatigue proxy
          }
        });

        if (recentVolume > 20000) {
          baseScore -= 30;
          explanations.push({ factor: "Training Load", impact: "negative", text: `Extremely high recent training volume. CNS fatigue is likely.` });
          recommendations.push({ title: "Active Recovery", description: "Your central nervous system needs a break. Stick to light walks.", reason: ["High volume accumulation"], confidence: "High", priority: "CRITICAL" });
        } else if (recentVolume > 10000) {
          baseScore -= 15;
          explanations.push({ factor: "Training Load", impact: "negative", text: `Moderate accumulation of fatigue from recent workouts.` });
        } else if (recentVolume > 0) {
          explanations.push({ factor: "Training Load", impact: "positive", text: `Training load is well balanced with your recovery capacity.` });
        } else {
          explanations.push({ factor: "Training Load", impact: "neutral", text: `You are fully rested. Prime time for a hard session.` });
        }

        // Determine State
        const finalScore = Math.max(0, Math.min(100, baseScore));
        let state: RecoveryState = "Excellent";
        if (finalScore < 40) state = "Overtrained";
        else if (finalScore < 60) state = "Fatigued";
        else if (finalScore < 80) state = "Moderate";
        else if (finalScore < 95) state = "Good";

        // Mock Muscle Recovery calculation based on recent volume (for V1.0 completeness)
        // A true implementation would parse exercise `targetMuscles` from history.
        let muscleRecovery = { chest: 100, back: 100, legs: 100, shoulders: 100, arms: 100 };
        if (recentActivities.length > 0) {
            const lastWorkout = (recentActivities[0].type || "").toLowerCase();
            if (lastWorkout.includes('upper') || lastWorkout.includes('push')) {
                muscleRecovery.chest = 45;
                muscleRecovery.shoulders = 55;
                muscleRecovery.arms = 60;
                explanations.push({ factor: "Muscle Fatigue", impact: "negative", text: `Chest and shoulders are fatigued from your last session.` });
            } else if (lastWorkout.includes('lower') || lastWorkout.includes('leg')) {
                muscleRecovery.legs = 30;
                explanations.push({ factor: "Muscle Fatigue", impact: "negative", text: `Legs are severely fatigued. Avoid heavy lower body lifts.` });
            } else if (lastWorkout.includes('pull') || lastWorkout.includes('back')) {
                muscleRecovery.back = 40;
                muscleRecovery.arms = 50;
                explanations.push({ factor: "Muscle Fatigue", impact: "negative", text: `Back and biceps are recovering.` });
            }
        }

        const profile: RecoveryProfile = {
          id: get().currentProfile?.id || crypto.randomUUID(),
          userId: userStore.userId || "anonymous",
          score: finalScore,
          confidence: 85,
          state,
          fatigueLevel: 100 - finalScore,
          readiness: finalScore,
          trainingLoad: {
            acuteLoad: recentVolume,
            chronicLoad: recentVolume * 0.8,
            workloadRatio: 1.2
          },
          trend: "Stable",
          recommendations,
          timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any
        };

        set({
          currentProfile: profile,
          explanation: explanations,
          muscleRecovery
        });

        // Dispatch event for cross-module sync
        if (userStore.userId) {
          eventBus.dispatch({
            id: crypto.randomUUID(),
            userId: userStore.userId,
            type: 'RECOVERY_UPDATED' as any,
            timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
            metadata: { score: finalScore, state },
            processed: false
          });
        }
      }
    }),
    {
      name: "ascend-recovery-storage",
      partialize: (state) => ({
        currentProfile: state.currentProfile,
        history: state.history,
        muscleRecovery: state.muscleRecovery,
        explanation: state.explanation
      })
    }
  )
);
