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
     * resetStoresOnLogout is ONLY called from explicit logout handlers
     * (MobileDrawer, ProfileMenu) — never from onAuthStateChanged. This prevents
     * the transient null Firebase fires on app startup from wiping localStorage.
     */
    unsubscribeMeals = NutritionRepository.subscribeToNutritionLogs(
      userId,
      currentDate,
      (logs) => {
        const state = useNutritionStore.getState();
        const todaysMeals = state.meals.filter((m) => m.date === currentDate);
        // Guard: skip empty Firestore snapshot if localStorage already has today's meals.
        // Firestore fires an empty result before the network response when there is no
        // local IndexedDB cache. Without this guard, that empty snapshot would wipe
        // dailyCalories to 0 on every app restart.
        if (logs.length === 0 && todaysMeals.length > 0) return;
        state.setMeals(logs);
      },
      (error) => console.error("Failed to sync nutrition logs:", error)
    );

    // Same guard applies to hydration
    unsubscribeHydration = NutritionRepository.subscribeToHydrationLogs(
      userId,
      currentDate,
      (logs) => {
        // Guard: if Firestore fires its first empty snapshot but the store already has
        // locally-persisted hydration logs for TODAY, skip the update.
        const state = useNutritionStore.getState();
        const todaysLogs = state.hydrationLogs.filter((l) => l.date === currentDate);
        if (logs.length === 0 && todaysLogs.length > 0) return;
        state.setHydrationLogs(logs);
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
