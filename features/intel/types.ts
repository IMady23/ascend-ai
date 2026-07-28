export type InsightType = "positive" | "warning" | "neutral" | "info";

export interface InsightCard {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  timestamp?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  actionText: string;
}

export interface WeeklyOverviewData {
  workoutsCompleted: number;
  workoutsTarget: number;
  avgCalories: number;
  targetCalories: number;
  avgProtein: number;
  targetProtein: number;
  avgWater: number;
  targetWater: number;
  avgSteps: number;
  targetSteps: number;
  weightChange: number; // e.g., -0.5
}

export interface WeightDataPoint {
  date: string; // ISO or short date
  weight: number;
}

export interface ActivityTrendData {
  totalWorkouts: number;
  totalMinutes: number;
  weeklyDistribution: {
    day: string;
    minutes: number;
  }[];
}

export interface NutritionTrendData {
  avgCalories: number;
  avgProtein: number;
  avgWater: number;
  consistencyScore: number;
}

export interface ConsistencyCategory {
  name: string;
  score: number;
  weight: number;
}
