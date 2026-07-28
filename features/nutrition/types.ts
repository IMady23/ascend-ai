import { NutritionLog } from "@/types/nutrition";

export interface MacroGoals {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  waterMl: number; // in milliliters
}

export interface InsightCard {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  message: string;
}
