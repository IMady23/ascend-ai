import { beforeEach, describe, expect, it, vi } from "vitest";
import { useNutritionStore } from "../../stores/nutrition.store";

vi.mock("@/lib/firebase", () => ({
  db: {},
  auth: {},
  firestore: {},
  storage: {},
}));

vi.mock("@/stores/user.store", () => ({
  useUserStore: {
    getState: () => ({
      userId: "user-1",
      profile: { targets: { water: 3000 } },
    }),
  },
}));

describe("nutrition store hydration state", () => {
  beforeEach(() => {
    useNutritionStore.setState({
      currentDate: "2026-08-04",
      dailyCalories: 0,
      dailyProtein: 0,
      dailySugar: 0,
      dailyWaterMl: 0,
      meals: [],
      hydrationLogs: [],
      mealPlans: [],
      favoriteFoods: [],
      recentFoods: [],
      customFoods: [],
    });
  });

  it("stores a water total for the current date", () => {
    useNutritionStore.getState().setDailyWater(750);

    const state = useNutritionStore.getState();
    expect(state.dailyWaterMl).toBe(750);
    expect(state.hydrationLogs).toHaveLength(1);
    expect(state.hydrationLogs[0].date).toBe("2026-08-04");
    expect(state.hydrationLogs[0].amountMl).toBe(750);
  });
});
