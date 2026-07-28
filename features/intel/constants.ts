import type { 
  WeightDataPoint, 
  WeeklyOverviewData, 
  ActivityTrendData, 
  NutritionTrendData 
} from "./types";

export const MOCK_WEIGHT_HISTORY: WeightDataPoint[] = [
  { date: "Mon", weight: 92.5 },
  { date: "Tue", weight: 92.2 },
  { date: "Wed", weight: 91.8 },
  { date: "Thu", weight: 92.0 },
  { date: "Fri", weight: 91.5 },
  { date: "Sat", weight: 91.2 },
  { date: "Sun", weight: 91.0 },
];

export const MOCK_WEEKLY_OVERVIEW: WeeklyOverviewData = {
  workoutsCompleted: 4,
  workoutsTarget: 5,
  avgCalories: 1950,
  targetCalories: 2000,
  avgProtein: 145,
  targetProtein: 150,
  avgWater: 2200,
  targetWater: 2500,
  avgSteps: 8400,
  targetSteps: 10000,
  weightChange: -1.5,
};

export const MOCK_ACTIVITY_TREND: ActivityTrendData = {
  totalWorkouts: 16,
  totalMinutes: 720,
  weeklyDistribution: [
    { day: "Mon", minutes: 45 },
    { day: "Tue", minutes: 60 },
    { day: "Wed", minutes: 0 },
    { day: "Thu", minutes: 45 },
    { day: "Fri", minutes: 0 },
    { day: "Sat", minutes: 90 },
    { day: "Sun", minutes: 0 },
  ],
};

export const MOCK_NUTRITION_TREND: NutritionTrendData = {
  avgCalories: 1950,
  avgProtein: 145,
  avgWater: 2200,
  consistencyScore: 88,
};
