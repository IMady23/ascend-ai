import { MacroGoals, InsightCard } from "./types";

export const MOCK_MACRO_GOALS: MacroGoals = {
  calories: 2400,
  protein: 160,
  carbs: 250,
  fat: 80,
  waterMl: 3500,
};

export const MOCK_INSIGHTS: InsightCard[] = [
  {
    id: "insight-1",
    type: "info",
    title: "Protein Pacing",
    message: "You're on track to hit your protein goal. Try to get 30g in your next meal to maximize muscle protein synthesis.",
  },
  {
    id: "insight-2",
    type: "warning",
    title: "Hydration Alert",
    message: "You've only drank 1L of water today. Drink a glass now to stay hydrated.",
  },
  {
    id: "insight-3",
    type: "success",
    title: "Balanced Micros",
    message: "Your last meal was highly nutrient-dense. Great job incorporating leafy greens.",
  }
];

export const MOCK_MEALS = [
  {
    id: "m-1",
    mealType: "breakfast",
    calories: 450,
    protein: 35,
    carbs: 40,
    fat: 15,
    date: { toMillis: () => Date.now() - 14400000 },
    createdAt: { toMillis: () => Date.now() }
  },
  {
    id: "m-2",
    mealType: "lunch",
    calories: 650,
    protein: 45,
    carbs: 60,
    fat: 22,
    date: { toMillis: () => Date.now() - 7200000 },
    createdAt: { toMillis: () => Date.now() }
  }
];
