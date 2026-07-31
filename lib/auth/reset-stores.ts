import { useUserStore } from "@/stores/user.store";
import { useAiStore } from "@/stores/ai.store";
import { useActivityStore } from "@/stores/activity.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useWorkspaceStore } from "@/stores/workspace.store";
import { useProgressionStore } from "@/stores/progression.store";
import { useAnalyticsStore } from "@/stores/analytics.store";
import { useSettingsStore } from "@/stores/settings.store";

/**
 * Clears all user-scoped local state on logout.
 * Persisted stores are reset to defaults so the next session starts clean.
 */
export function resetStoresOnLogout() {
  useUserStore.getState().clearUser();

  useWorkspaceStore.getState().reset();
  
  if ((useProgressionStore.getState() as any).reset) {
     (useProgressionStore.getState() as any).reset();
  }

  useAnalyticsStore.setState({
    timeRange: 7,
    hasData: false,
    stepTrend: null,
    hydrationTrend: null,
    overviewStats: null,
    workoutSplit: null,
    nutritionSplit: null,
    goalCompletion: null,
    weightTrend: null,
    consistency: null,
    personalRecords: null,
    trendCards: null,
    aiSummary: null,
    isLoading: false,
    error: null,
  });

  useAiStore.setState({
    conversations: [],
    activeConversationId: null,
    isLoading: false,
    insightsCache: {},
  });

  useActivityStore.setState({
    activities: [],
    currentActivity: null,
    workoutState: "not_started",
    startTime: null,
    elapsedTime: 0,
    notes: "",
    activeExercises: [],
    dailySteps: 0,
  });

  useNutritionStore.setState({
    currentDate: new Date().toISOString().split("T")[0],
    dailyCalories: 0,
    dailyProtein: 0,
    dailyWaterMl: 0,
    meals: [],
    hydrationLogs: [],
    mealPlans: [],
    favoriteFoods: [],
    recentFoods: [],
  });
}
