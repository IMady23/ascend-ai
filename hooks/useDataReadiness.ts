import { useUserStore } from "@/stores/user.store";
import { useActivityStore } from "@/stores/activity.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useProgressStore } from "@/stores/progress.store";

export type ReadinessStatus = "loading" | "empty" | "partial" | "ready" | "insufficient_history";

export interface ModuleReadiness {
  status: ReadinessStatus;
  message?: string;
}

export interface DataReadiness {
  global: ModuleReadiness;
  nutrition: ModuleReadiness;
  training: ModuleReadiness;
  progress: ModuleReadiness;
  transformation: ModuleReadiness;
  intel: ModuleReadiness;
}

export function useDataReadiness(): DataReadiness {
  const { profile, isLoading: isUserLoading } = useUserStore();
  const { activities, currentActivity } = useActivityStore() as any;
  const { meals } = useNutritionStore() as any;
  const { photos, isLoading: isProgressLoading } = useProgressStore();

  const isGlobalLoading = isUserLoading || isProgressLoading;

  if (isGlobalLoading) {
    const loadingState: ModuleReadiness = { status: "loading" };
    return {
      global: loadingState,
      nutrition: loadingState,
      training: loadingState,
      progress: loadingState,
      transformation: loadingState,
      intel: loadingState,
    };
  }

  // --- Nutrition ---
  let nutrition: ModuleReadiness = { status: "empty" };
  if (meals && meals.length > 0) {
    nutrition = { status: "ready" };
  }

  // --- Training ---
  let training: ModuleReadiness = { status: "empty" };
  if (currentActivity) {
    training = { status: "ready" };
  } else if (activities && activities.length > 0) {
    // Has past activities but no current activity
    training = { status: "empty", message: "Recovery Day" };
  }

  // --- Progress ---
  // XP and Achievements will come from activities/meals/profile.
  // For now, if no history, it's empty.
  let progress: ModuleReadiness = { status: "empty" };
  if ((activities && activities.length > 0) || (meals && meals.length > 0)) {
    progress = { status: "ready" };
  }

  // --- Transformation ---
  let transformation: ModuleReadiness = { status: "empty" };
  if ((photos && photos.length > 0) || (profile?.identity?.weight && profile.identity.weight > 0)) {
    transformation = { status: "ready" };
  }

  // --- Intel Center (Feature Unlock Policy) ---
  let intel: ModuleReadiness = { status: "insufficient_history" };
  const activityCount = activities?.length || 0;
  const mealCount = meals?.length || 0;
  
  if (activityCount >= 3 && mealCount >= 10) {
    intel = { status: "ready" };
  } else {
    intel = { 
      status: "insufficient_history", 
      message: "Learning about you... Keep logging meals and workouts to unlock personalized intelligence." 
    };
  }

  // --- Global ---
  const allReady = nutrition.status === "ready" && training.status === "ready" && transformation.status === "ready";
  const global: ModuleReadiness = { status: allReady ? "ready" : "partial" };

  return {
    global,
    nutrition,
    training,
    progress,
    transformation,
    intel,
  };
}
