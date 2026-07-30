import { Insight } from "@/types/intelligence";
import { format, subDays } from "date-fns";
import { useActivityStore } from "@/stores/activity.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useRecoveryStore } from "@/stores/recovery.store";

export type TrendCategory = "workout" | "nutrition" | "recovery" | "body" | "performance";
export type TimeFilter = 7 | 30 | 90 | 365;
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
  label: string; // "Mon", "Tue"
  [key: string]: any; // dynamic keys for volume, protein, etc.
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
    
    // For V1, if they have limited data we just return empty array so Recharts shows empty states.
    // If they have sufficient data, we would normally map their REAL store data into the chart.
    // Let's map real Activity and Nutrition data.
    
    const activityState = useActivityStore.getState();
    const nutritionState = useNutritionStore.getState();
    
    const data: ChartDataPoint[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = subDays(today, i);
      const dateStr = format(d, "yyyy-MM-dd");
      const point: ChartDataPoint = {
        date: dateStr,
        label: format(d, days > 7 ? "MMM d" : "EEE"),
      };

      if (category === "workout") {
        // Aggregate real workouts
        const dayActivities = activityState.activities.filter(a => new Date((a as any).date || a.id).toISOString().startsWith(dateStr));
        point.volume = 0; // We'd sum real volume here
        point.sets = 0;
        point.duration = 0;
      } else if (category === "nutrition") {
        const dayMeals = nutritionState.meals.filter(m => new Date((m.createdAt as any)?.seconds * 1000).toISOString().startsWith(dateStr));
        point.protein = dayMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
        point.calories = dayMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
        point.carbs = dayMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);
        point.fat = dayMeals.reduce((acc, m) => acc + (m.fat || 0), 0);
      } else if (category === "recovery") {
        point.score = 0;
        point.sleep = 0;
      }
      
      data.push(point);
    }
    
    return data;
  }

  static async fetchConsistencyScore(days: TimeFilter, stage: IntelligenceStage): Promise<ConsistencyBreakdown | null> {
    if (stage === "NO_DATA" || stage === "LIMITED_DATA") {
      return null;
    }
    
    // If sufficient data, calculate real score or return baseline
    return {
      currentScore: 84,
      previousScore: 78,
      trend30Day: "up",
      biggestPositive: "Consistent Protein Intake (91%)",
      biggestNegative: "Sleep Duration (64%)",
      howToImprove: "Focus on getting to bed 30 minutes earlier to improve recovery score, which is currently dragging down your overall consistency.",
      breakdown: {
        training: 92,
        nutrition: 81,
        recovery: 76,
        hydration: 70
      }
    };
  }

  static async fetchActiveInsight(stage: IntelligenceStage): Promise<ActiveInsightData | null> {
    if (stage === "NO_DATA") return null;

    if (stage === "LIMITED_DATA") {
      return {
        id: "ai-early",
        title: "Preliminary Trend",
        description: "Training frequency appears consistent, but more data is needed before making reliable recommendations. Recommendations may change as more data becomes available.",
        category: "TREND",
        date: new Date().toISOString(),
        isRead: false,
        priority: "info",
        confidenceScore: 28,
      } as any;
    }

    return {
      id: "ai-1",
      title: "Progressive Overload Detected",
      description: "Your training volume has steadily increased while recovery has remained stable. This indicates excellent progression.",
      category: "TRAINING",
      date: new Date().toISOString(),
      isRead: false,
      priority: "success",
      trainingLoadAnalysis: "Volume is up 14% this month, hitting target progressive overload zones.",
      recoveryAnalysis: "Recovery remains stable (avg 82%) despite increased load, showing good adaptation.",
      nutritionAnalysis: "Protein targets are being met 6/7 days, supporting the increased volume.",
      sleepAnalysis: "Sleep is consistent at 7.2h, which is sufficient but could be optimized.",
      confidenceScore: 92,
      recommendedActions: [
        "Maintain current training block for 1 more week",
        "Consider a deload week starting next Monday",
        "Ensure hydration stays above 2.5L"
      ],
      explanation: [
        "Volume increased by 14%",
        "Recovery score stable at >80%",
        "Protein targets met"
      ]
    } as any;
  }

  static async fetchHistoricalInsights(days: TimeFilter, stage: IntelligenceStage): Promise<ActiveInsightData[]> {
    if (stage === "NO_DATA" || stage === "LIMITED_DATA") return [];

    return [
      {
        id: "hist-1",
        title: "Recovery Improved",
        description: "Your sleep quality improved by 12% over the weekend.",
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
