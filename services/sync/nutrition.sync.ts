import { NutritionRepository } from "@/services/repositories";
import { useNutritionStore } from "@/stores/nutrition.store";
import { NutritionLog } from "@/types/nutrition";

let unsubscribe: (() => void) | null = null;

export const NutritionSync = {
  subscribe(userId: string) {
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = NutritionRepository.subscribeToNutritionLogs(
      userId,
      (logs: NutritionLog[]) => {
        // Aggregate daily nutrition from logs
        let calories = 0;
        let protein = 0;
        logs.forEach(log => {
          calories += log.calories;
          protein += log.protein;
        });
        
        useNutritionStore.getState().setDailyNutrition(calories, protein);
      },
      (error) => {
        console.error("Failed to sync nutrition logs:", error);
      }
    );
  },

  dispose() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  },

  async addWater(userId: string, amountMl: number) {
    const currentWater = useNutritionStore.getState().dailyWaterMl;
    useNutritionStore.getState().setDailyWater(currentWater + amountMl);
    
    // Logic to create water log in Firestore would go here
  }
};
