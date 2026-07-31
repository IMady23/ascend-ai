import { NutritionLog } from "@/types/nutrition";
import { UserProfile } from "@/types/user";

export interface GoalProgress {
  calories: { consumed: number; target: number; remaining: number; percentage: number };
  protein: { consumed: number; target: number; remaining: number; percentage: number };
  carbs: { consumed: number; target: number; remaining: number; percentage: number };
  fat: { consumed: number; target: number; remaining: number; percentage: number };
  water: { consumed: number; target: number; remaining: number; percentage: number };
}

export class NutritionCoach {
  /**
   * Generates a structured breakdown of current daily consumption vs. targets.
   * Eliminates duplicate calculation logic across UI components.
   */
  static generateGoalProgress(
    dailyCalories: number,
    dailyProtein: number,
    dailyWaterMl: number,
    meals: NutritionLog[],
    profile: UserProfile | null
  ): GoalProgress {
    // Determine targets
    const targetCalories = profile?.targets?.dailyCalories || profile?.preferences?.goals?.calories || 2000;
    const targetProtein = profile?.targets?.protein || profile?.preferences?.goals?.proteinGrams || 150;
    const targetCarbs = profile?.targets?.carbs || profile?.preferences?.goals?.carbsGrams || 250;
    const targetFat = profile?.targets?.fat || profile?.preferences?.goals?.fatGrams || 70;
    const targetWater = profile?.targets?.water || profile?.preferences?.goals?.waterMl || 3000;

    // Sum macros from meals
    const consumedCarbs = meals.reduce((acc, m) => acc + (m.carbs || 0), 0);
    const consumedFat = meals.reduce((acc, m) => acc + (m.fat || 0), 0);
    const consumedWaterLiters = dailyWaterMl / 1000;
    const targetWaterLiters = targetWater / 1000;

    return {
      calories: {
        consumed: Math.round(dailyCalories),
        target: targetCalories,
        remaining: Math.max(0, targetCalories - Math.round(dailyCalories)),
        percentage: Math.min(100, Math.round((dailyCalories / targetCalories) * 100))
      },
      protein: {
        consumed: Math.round(dailyProtein),
        target: targetProtein,
        remaining: Math.max(0, targetProtein - Math.round(dailyProtein)),
        percentage: Math.min(100, Math.round((dailyProtein / targetProtein) * 100))
      },
      carbs: {
        consumed: Math.round(consumedCarbs),
        target: targetCarbs,
        remaining: Math.max(0, targetCarbs - Math.round(consumedCarbs)),
        percentage: Math.min(100, Math.round((consumedCarbs / targetCarbs) * 100))
      },
      fat: {
        consumed: Math.round(consumedFat),
        target: targetFat,
        remaining: Math.max(0, targetFat - Math.round(consumedFat)),
        percentage: Math.min(100, Math.round((consumedFat / targetFat) * 100))
      },
      water: {
        consumed: Number(consumedWaterLiters.toFixed(1)),
        target: Number(targetWaterLiters.toFixed(1)),
        remaining: Number(Math.max(0, targetWaterLiters - consumedWaterLiters).toFixed(1)),
        percentage: Math.min(100, Math.round((consumedWaterLiters / targetWaterLiters) * 100))
      }
    };
  }

  /**
   * Analyzes a single meal to provide instant, constructive AI-like feedback.
   */
  static generateMealAnalysis(meal: NutritionLog, progress: GoalProgress): string {
    const isHighProtein = meal.protein >= 30;
    const isHighCalorie = meal.calories >= (progress.calories.target * 0.4); // >40% of daily calories
    const isHighCarb = meal.carbs >= (progress.carbs.target * 0.4);
    const isHighFat = meal.fat >= (progress.fat.target * 0.4);

    let feedback = [];

    if (isHighProtein) {
      feedback.push("Excellent protein content.");
      feedback.push("This contributes well toward today's goal.");
    } else if (meal.protein < 15 && meal.calories > 300) {
      feedback.push("Protein is a bit low for a meal of this size.");
      feedback.push("Consider pairing with a lean protein source.");
    }

    if (isHighCalorie) {
      feedback.push("This is a substantial, calorie-dense meal.");
    }

    if (!isHighProtein && !isHighCalorie && !isHighCarb && !isHighFat) {
      feedback.push("A light, balanced addition to your day.");
    }

    if (progress.calories.percentage > 90 && !isHighCalorie) {
      feedback.push("You're nearing your daily calorie limit—great job tracking everything.");
    }

    return feedback.join(" ");
  }

  /**
   * Generates a context-aware daily insight string (e.g. for Morning/Evening briefings).
   */
  static generateDailyInsights(progress: GoalProgress): string {
    let insights = [];
    
    // Calorie insight
    if (progress.calories.percentage < 50) {
      insights.push(`You've consumed ${progress.calories.consumed} of your ${progress.calories.target} calorie goal (${progress.calories.percentage}%). You still have room for around ${progress.calories.remaining} calories.`);
    } else if (progress.calories.percentage <= 100) {
      insights.push(`You're ${progress.calories.percentage}% of the way to your calorie goal with ${progress.calories.remaining} left.`);
    } else {
      insights.push(`You're slightly over your calorie goal today (${progress.calories.consumed} / ${progress.calories.target}).`);
    }

    // Protein insight
    if (progress.protein.percentage < 100) {
      insights.push(`Protein is below target (${progress.protein.consumed}g / ${progress.protein.target}g), consider a protein-rich meal.`);
    } else {
      insights.push(`Great job hitting your protein target of ${progress.protein.target}g!`);
    }

    // Hydration insight
    if (progress.water.percentage < 80) {
      insights.push(`Hydration is behind schedule (${progress.water.consumed}L / ${progress.water.target}L). Drink up!`);
    }

    return insights.join(" ");
  }

  /**
   * Evaluates the last 7 days of logs to detect patterns and generate a smart recommendation.
   */
  static generateSmartRecommendations(last7DaysLogs: { date: string; calories: number; protein: number; waterMl: number }[], profile: UserProfile | null): string {
    if (last7DaysLogs.length < 3) {
      return "Log more meals and hydration over the next few days to unlock personalized, pattern-based insights.";
    }

    const targetProtein = profile?.targets?.protein || profile?.preferences?.goals?.proteinGrams || 150;
    const targetWater = profile?.targets?.water || profile?.preferences?.goals?.waterMl || 3000;

    let lowProteinDays = 0;
    let lowWaterDays = 0;

    last7DaysLogs.forEach(day => {
      if (day.protein < targetProtein * 0.9) lowProteinDays++;
      if (day.waterMl < targetWater * 0.8) lowWaterDays++;
    });

    const lowProteinRatio = lowProteinDays / last7DaysLogs.length;
    const lowWaterRatio = lowWaterDays / last7DaysLogs.length;

    if (lowProteinRatio > 0.6) {
      return `Pattern spotted: Your protein intake was below target on ${lowProteinDays} of the last ${last7DaysLogs.length} days. Try meal prepping a lean protein source (like chicken, tofu, or Greek yogurt) to make it easier to hit your goal.`;
    }

    if (lowWaterRatio > 0.6) {
      return `Pattern spotted: You missed your hydration goal ${lowWaterDays} times this week. Try keeping a full water bottle at your desk and drinking a glass as soon as you wake up.`;
    }

    return "You've been incredibly consistent with your nutrition targets this week. Keep up the excellent work!";
  }
}
