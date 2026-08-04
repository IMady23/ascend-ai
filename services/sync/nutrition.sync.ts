import { NutritionRepository } from "@/services/repositories";
import { useNutritionStore } from "@/stores/nutrition.store";

let unsubscribeMeals: (() => void) | null = null;
let unsubscribeHydration: (() => void) | null = null;
let unsubscribePlans: (() => void) | null = null;

export const NutritionSync = {
  subscribe(userId: string) {
    this.dispose();

    const currentDate = useNutritionStore.getState().currentDate;

    /**
     * WHY setMeals (merge), NOT replaceMeals:
     *
     * Firestore collection queries can fire an EMPTY snapshot on the first
     * callback while the SDK is establishing the network connection and before
     * the local cache warms up. If we used replaceMeals([]) here, that empty
     * snapshot would destroy all persisted data on every page refresh.
     *
     * setMeals is a SAFE merge:
     *   - If Firestore fires with [] (empty first snapshot):
     *       merge(existingState, []) = existingState   <-- no data loss ✅
     *   - If Firestore fires with correct data:
     *       merge(existingState, correctData) = correctData (IDs match, Firestore
     *       overwrites any stale entries)               <-- correct ✅
     *   - On fresh login (state.meals = [] after resetStoresOnLogout + clearStorage):
     *       merge([], correctData) = correctData        <-- correct ✅
     *
     * The stale-localStorage-rehydration problem (the original logout/login bug)
     * is already solved by persist.clearStorage() in reset-stores.ts. We no
     * longer need replaceMeals for that.
     */
    unsubscribeMeals = NutritionRepository.subscribeToNutritionLogs(
      userId,
      currentDate,
      (logs) => {
        useNutritionStore.getState().setMeals(logs);
      },
      (error) => console.error("Failed to sync nutrition logs:", error)
    );

    // Same reasoning applies to hydration — setHydrationLogs is safe merge
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
