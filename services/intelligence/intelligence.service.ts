import { Insight } from "@/types/intelligence";
import { format, subDays } from "date-fns";
import { useActivityStore } from "@/stores/activity.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useRecoveryStore } from "@/stores/recovery.store";

export type TrendCategory = "workout" | "nutrition" | "recovery" | "body" | "performance";
export type TimeFilter = 7 | 14 | 30 | 180 | 365;

export type IntelligenceStage = "NO_DATA" | "LIMITED_DATA" | "SUFFICIENT_DATA";
export type IntelligenceLevel = "Initializing" | "Learning" | "Analyzing" | "Optimized";

export interface ActiveInsightData extends Insight {
  trainingLoadAnalysis?: string;
  recoveryAnalysis?: string;
  nutritionAnalysis?: string;
  sleepAnalysis?: string;
  confidenceScore?: number;
  recommendedActions?: string[];
}

export interface ConsistencyBreakdown {
  currentScore: number;
  previousScore: number;
  trend30Day: "up" | "down" | "stable";
  biggestPositive: string;
  biggestNegative: string;
  howToImprove: string;
  breakdown: {
    training: number;
    nutrition: number;
    recovery: number;
    hydration: number;
  };
}

export interface ChartDataPoint {
  date: string;
  label: string; // "Mon", "Tue", "Jan"
  [key: string]: any;
}

export interface SufficiencyState {
  stage: IntelligenceStage;
  level: IntelligenceLevel;
  counts: {
    workouts: number;
    meals: number;
    hydration: number;
    recovery: number;
  };
  targets: {
    workouts: number;
    meals: number;
    hydration: number;
    recovery: number;
  };
}

export class IntelligenceService {
  /**
   * Evaluates the real data logged by the user to determine the intelligence stage.
   */
  static getSufficiencyState(): SufficiencyState {
    const activityState = useActivityStore.getState();
    const nutritionState = useNutritionStore.getState();
    const recoveryState = useRecoveryStore.getState();

    const counts = {
      workouts: activityState.activities?.length || 0,
      meals: nutritionState.meals?.length || 0,
      hydration: nutritionState.hydrationLogs?.length || 0,
      recovery: (recoveryState as any).dailyLogs?.length || 0, // Fallback if recovery logs are handled differently
    };

    const targets = {
      workouts: 1,
      meals: 5,
      hydration: 3,
      recovery: 3
    };

    // Determine Stage
    let stage: IntelligenceStage = "NO_DATA";
    let level: IntelligenceLevel = "Initializing";

    const hasSomeData = counts.workouts > 0 || counts.meals > 0 || counts.hydration > 0 || counts.recovery > 0;
    const meetsLimitedThreshold = counts.workouts >= 1 && counts.meals >= 5 && counts.hydration >= 3 && counts.recovery >= 3;
    const meetsSufficientThreshold = counts.workouts >= 5 && counts.meals >= 15;

    if (meetsSufficientThreshold) {
      stage = "SUFFICIENT_DATA";
      level = "Optimized";
    } else if (meetsLimitedThreshold) {
      stage = "LIMITED_DATA";
      level = "Learning";
    } else if (hasSomeData) {
      stage = "NO_DATA"; // Still gathering the baseline unlock
      level = "Initializing";
    } else {
      stage = "NO_DATA";
      level = "Initializing";
    }

    return { stage, level, counts, targets };
  }

  static async fetchChartData(category: TrendCategory, days: TimeFilter, stage: IntelligenceStage): Promise<ChartDataPoint[]> {
    if (stage === "NO_DATA") return [];
    const { AnalyticsService } = await import('@/services/analytics/AnalyticsService');
    const cache = AnalyticsService.getCache();
    
    const today = new Date();
    
    if (days === 180 || days === 365) {
      const months = days === 180 ? 6 : 12;
      const dataMap = new Map<string, ChartDataPoint>();
      
      for (let i = months - 1; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = format(d, "yyyy-MM");
        dataMap.set(monthKey, {
          date: monthKey,
          label: format(d, "MMM"),
          volume: 0, duration: 0, protein: 0, calories: 0, carbs: 0, fat: 0, sleep: 0, score: 0, count: 0
        });
      }
      
      if (category === "workout") {
         const cutoff = new Date(today.getFullYear(), today.getMonth() - months + 1, 1).toISOString();
         cache.activities.forEach(a => {
           const d = (a.date as any).toDate ? (a.date as any).toDate() : new Date(a.date as any);
           if (d.toISOString() >= cutoff) {
             const key = format(d, "yyyy-MM");
             if (dataMap.has(key)) {
               const p = dataMap.get(key)!;
               p.volume += (a.metrics?.totalVolume || 0);
               p.duration += (a.durationMinutes || 0);
             }
           }
         });
      } else if (category === "nutrition") {
         const cutoff = new Date(today.getFullYear(), today.getMonth() - months + 1, 1).toISOString().split('T')[0];
         cache.nutritionLogs.forEach(m => {
           if (m.date >= cutoff) {
             const key = m.date.substring(0, 7);
             if (dataMap.has(key)) {
               const p = dataMap.get(key)!;
               p.protein += (m.protein || 0);
               p.calories += (m.calories || 0);
               p.carbs += (m.carbs || 0);
               p.fat += (m.fat || 0);
             }
           }
         });
      } else if (category === "recovery") {
         const cutoff = new Date(today.getFullYear(), today.getMonth() - months + 1, 1).toISOString().split('T')[0];
         cache.dailyLogs.forEach(dLog => {
           if (dLog.date >= cutoff) {
             const key = dLog.date.substring(0, 7);
             if (dataMap.has(key)) {
               const p = dataMap.get(key)!;
               p.sleep += (dLog.sleepHours || 0);
               p.score += ((dLog.energy || 0) * 20);
               p.count += 1;
             }
           }
         });
         dataMap.forEach(p => {
           if (p.count > 0) {
             p.sleep = Number((p.sleep / p.count).toFixed(1));
             p.score = Math.round(p.score / p.count);
           }
         });
      }
      return Array.from(dataMap.values());
    }

    const data: ChartDataPoint[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = subDays(today, i);
      const dateStr = format(d, "yyyy-MM-dd");
      const point: ChartDataPoint = {
        date: dateStr,
        label: format(d, days > 7 ? "MMM d" : "EEE"),
      };

      if (category === "workout") {
        const dayActivities = cache.activities.filter(a => a.date.toDate().toISOString().startsWith(dateStr));
        point.volume = dayActivities.reduce((acc, a) => acc + ((a.metrics?.totalVolume as number) || 0), 0);
        point.duration = dayActivities.reduce((acc, a) => acc + (a.durationMinutes || 0), 0);
      } else if (category === "nutrition") {
        const dayMeals = cache.nutritionLogs.filter(m => m.date.startsWith(dateStr));
        point.protein = dayMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
        point.calories = dayMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
        point.carbs = dayMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);
        point.fat = dayMeals.reduce((acc, m) => acc + (m.fat || 0), 0);
      } else if (category === "recovery") {
        const dailyLogs = cache.dailyLogs.filter(dLog => dLog.date.startsWith(dateStr));
        point.sleep = dailyLogs.reduce((acc, dLog) => acc + (dLog.sleepHours || 0), 0);
        point.score = dailyLogs.reduce((acc, dLog) => acc + (dLog.energy || 0), 0) * 20; // 1-5 scale mapped to 0-100
      }
      
      data.push(point);
    }
    
    return data;
  }

  static async fetchConsistencyScore(days: TimeFilter, stage: IntelligenceStage): Promise<ConsistencyBreakdown | null> {
    if (stage === "NO_DATA" || stage === "LIMITED_DATA") return null;
    
    const { AnalyticsService } = await import('@/services/analytics/AnalyticsService');
    const { useUserStore } = await import('@/stores/user.store');
    const profile = useUserStore.getState().profile;
    const goals = AnalyticsService.getGoalCompletion(days as any, profile);

    const currentScore = Math.round((goals.workouts + goals.protein + goals.sleep + goals.water) / 4);

    return {
      currentScore,
      previousScore: currentScore - 2, // simplified trend
      trend30Day: "up",
      biggestPositive: goals.workouts >= 80 ? "Consistent Training" : "Nutrition Targets",
      biggestNegative: goals.sleep < 70 ? "Sleep Duration" : "Hydration",
      howToImprove: goals.sleep < 70 ? "Prioritize getting to bed 30 minutes earlier to improve your overall recovery." : "Drink more water during your workouts to hit your hydration goals.",
      breakdown: {
        training: goals.workouts,
        nutrition: goals.protein,
        recovery: goals.sleep,
        hydration: goals.water
      }
    };
  }

  static async fetchActiveInsight(stage: IntelligenceStage, days: TimeFilter = 30): Promise<ActiveInsightData | null> {
    if (stage === "NO_DATA") return null;

    if (stage === "LIMITED_DATA") {
      return {
        id: "ai-early",
        title: "Preliminary Trend",
        description: "More data is needed before making reliable recommendations. Please keep logging.",
        category: "TREND",
        date: new Date().toISOString(),
        isRead: false,
        priority: "info",
        confidenceScore: 28,
      } as any;
    }

    const { AnalyticsService } = await import('@/services/analytics/AnalyticsService');
    const { useUserStore } = await import('@/stores/user.store');
    const profile = useUserStore.getState().profile;
    const summary = AnalyticsService.getAISummary(days as any, profile);
    const cache = AnalyticsService.getCache();
    const workoutsCompleted = cache.activities.filter((a: any) => new Date((a.date as any).toDate ? (a.date as any).toDate() : (a.date as any)) >= subDays(new Date(), days)).length;
    const avgProtein = Math.round(summary.performance.protein);

    return {
      id: "ai-1",
      title: "Coach Recommendation",
      description: summary.recommendation,
      category: "TRAINING",
      date: new Date().toISOString(),
      isRead: false,
      priority: "success",
      trainingLoadAnalysis: `You completed ${workoutsCompleted} workouts in the last ${days} days.`,
      recoveryAnalysis: `Your longest streak is ${summary.longestStreak} days. Keep it up!`,
      nutritionAnalysis: `You averaged ${avgProtein}g of protein daily.`,
      sleepAnalysis: "Sleep data being gathered.",
      confidenceScore: 92,
      recommendedActions: [
        "Follow the active coach recommendation.",
        "Ensure hydration stays above 2.5L"
      ],
      explanation: [
        `Workouts: ${workoutsCompleted}`,
        `Streak: ${summary.currentStreak} Days`,
        `Avg Protein: ${avgProtein}g`
      ]
    } as any;
  }

  static async fetchHistoricalInsights(days: TimeFilter, stage: IntelligenceStage): Promise<ActiveInsightData[]> {
    if (stage === "NO_DATA" || stage === "LIMITED_DATA") return [];

    return [
      {
        id: "hist-1",
        title: "Data Synchronized",
        description: "Your past logs have been successfully aggregated into your Analytics Profile.",
        category: "RECOVERY",
        date: subDays(new Date(), 1).toISOString(),
        isRead: true,
        priority: "success",
        confidenceScore: 85
      } as any,
    ];
  }

  static buildAIContext(
    category: TrendCategory, 
    timeframe: TimeFilter, 
    insight: ActiveInsightData | null, 
    consistency: ConsistencyBreakdown | null,
    stage: IntelligenceStage
  ) {
    if (stage === "NO_DATA" || stage === "LIMITED_DATA") {
      return `[System Context Injection]
User is exploring the Intelligence Center but has limited data.
Current Stage: ${stage}.
Advise them to continue logging workouts, nutrition, and recovery.`;
    }

    return `[System Context Injection]
User is exploring the Intelligence Center.
Current View: ${category} trends over the last ${timeframe} days.
Active Insight: ${insight?.title} (${insight?.confidenceScore}% confidence).
Consistency Score: ${consistency?.currentScore}% (Training: ${consistency?.breakdown.training}%, Nutrition: ${consistency?.breakdown.nutrition}%, Recovery: ${consistency?.breakdown.recovery}%).
Biggest roadblock: ${consistency?.biggestNegative}.
Action: The user explicitly clicked 'Ask Coach About This Insight'. Be prepared to explain the active insight or answer questions about their trends.`;
  }
}
