export interface QuickPrompt {
  id: string;
  text: string;
  iconName: string;
}

export interface WeeklySummaryStats {
  workoutConsistency: number; // 0-100
  nutritionConsistency: number; // 0-100
  waterIntake: number; // 0-100
  overallScore: number;
}
