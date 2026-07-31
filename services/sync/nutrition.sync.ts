import { NutritionRepository } from "@/services/repositories";
import { useNutritionStore } from "@/stores/nutrition.store";

let unsubscribeMeals: (() => void) | null = null;
let unsubscribeHydration: (() => void) | null = null;
let unsubscribePlans: (() => void) | null = null;

export const NutritionSync = {
  subscribe(userId: string) {
    this.dispose();

    // 1. Meals
    const currentDate = useNutritionStore.getState().currentDate;

    unsubscribeMeals = NutritionRepository.subscribeToNutritionLogs(
      userId,
      currentDate,
      (logs) => {
        useNutritionStore.getState().setMeals(logs);
      },
      (error) => console.error("Failed to sync nutrition logs:", error)
    );

    // 2. Hydration
    unsubscribeHydration = NutritionRepository.subscribeToHydrationLogs(
      userId,
      currentDate,
      (logs) => {
        useNutritionStore.getState().setHydrationLogs(logs);
      },
      (error) => console.error("Failed to sync hydration logs:", error)
    );

    // 3. Meal Plans
    unsubscribePlans = NutritionRepository.subscribeToMealPlans(
      userId,
      (plans) => {
        useNutritionStore.getState().setMealPlans(plans);
      },
      (error) => console.error("Failed to sync meal plans:", error)
    );
  },

  dispose() {
    if (unsubscribeMeals) {
      unsubscribeMeals();
      unsubscribeMeals = null;
    }
    if (unsubscribeHydration) {
      unsubscribeHydration();
      unsubscribeHydration = null;
    }
    if (unsubscribePlans) {
      unsubscribePlans();
      unsubscribePlans = null;
    }
  }
};
