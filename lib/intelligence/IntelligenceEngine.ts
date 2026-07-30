import { InsightRepository } from "@/services/repositories/insight.repository";
import { AggregatedStats, Insight, InsightCategory } from "@/types/intelligence";
import { useUserStore } from "@/stores/user.store";
import { format, startOfWeek, startOfMonth } from "date-fns";

export class IntelligenceEngine {
  
  static async evaluateInsights(userId: string) {
    const today = new Date();
    const weeklyId = format(startOfWeek(today), 'yyyy-MM-dd');
    const monthlyId = format(startOfMonth(today), 'yyyy-MM');
    const lifetimeId = 'lifetime';

    const [weeklyStats, monthlyStats, lifetimeStats] = await Promise.all([
      InsightRepository.getStats(userId, 'weekly', weeklyId),
      InsightRepository.getStats(userId, 'monthly', monthlyId),
      InsightRepository.getStats(userId, 'lifetime', lifetimeId)
    ]);

    if (!weeklyStats || !monthlyStats || !lifetimeStats) return;

    const newInsights: Insight[] = [];

    // Milestone Analyzer
    if (lifetimeStats.metrics.workoutsCompleted === 100) {
      newInsights.push(this.createInsight(userId, 'MILESTONE', 'Century Club!', 'You just completed your 100th workout!', ['This represents incredible long-term dedication.', 'Most people give up before 30 workouts.']));
    }

    // Trend & Plateau Analyzer
    if (weeklyStats.metrics.workoutsCompleted > 0 && weeklyStats.metrics.totalVolumeKg < (weeklyStats.metrics.workoutsCompleted * 1000)) {
       // example arbitrary plateau check
       // in reality, compare against PREVIOUS week's stats
    }

    // Risk Detector
    if (weeklyStats.consistency.hydration < 40) {
      newInsights.push(this.createInsight(userId, 'RISK', 'Hydration Warning', 'Your water intake is very low this week.', ['Poor hydration impacts muscle recovery.', 'It can lead to premature fatigue during workouts.']));
    }

    // Save newly detected insights
    for (const insight of newInsights) {
      await InsightRepository.saveInsight(userId, insight);
    }
  }

  private static createInsight(userId: string, category: InsightCategory, title: string, description: string, explanation: string[]): Insight {
    return {
      id: crypto.randomUUID(),
      userId,
      category,
      title,
      description,
      explanation,
      isRead: false,
      timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any
    };
  }
}
