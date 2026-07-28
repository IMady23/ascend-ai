import { create } from "zustand";
import type { NutritionLog } from "@/types/nutrition";

interface NutritionState {
  dailyCalories: number;
  dailyProtein: number;
  dailyWaterMl: number;
  meals: NutritionLog[];
  setDailyNutrition: (calories: number, protein: number) => void;
  setDailyWater: (waterMl: number) => void;
  setMeals: (meals: NutritionLog[]) => void;
}

export const useNutritionStore = create<NutritionState>((set) => ({
  dailyCalories: 1850,
  dailyProtein: 140,
  dailyWaterMl: 2500,
  meals: [],
  setDailyNutrition: (calories, protein) =>
    set({ dailyCalories: calories, dailyProtein: protein }),
  setDailyWater: (waterMl) => set({ dailyWaterMl: waterMl }),
  setMeals: (meals) => set({ meals }),
}));
