import { Insight, InsightType, InsightCategory, InsightTrend } from "@/types/insights";
import { InsightRepository } from "@/services/repositories/insight.repository";
import { format, subDays, startOfWeek, subWeeks, startOfMonth } from "date-fns";

export class InsightEngine {
  
  static async generateDashboardInsights(userId: string): Promise<Insight[]> {
    const insights: Insight[] = [];
    const now = new Date();
    
    // 1. Fetch required data
    const todayStr = format(now, 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(now, 1), 'yyyy-MM-dd');
    
    const [todayStats, yesterdayStats] = await Promise.all([
      InsightRepository.getStats(userId, 'daily', todayStr),
      InsightRepository.getStats(userId, 'daily', yesterdayStr)
    ]);

    // Daily Comparisons
    if (todayStats && yesterdayStats) {
      // Steps Insight
      const stepsDiff = todayStats.metrics.steps - yesterdayStats.metrics.steps;
      if (Math.abs(stepsDiff) > 1000) {
        const trend = stepsDiff > 0 ? 'up' : 'down';
        const percent = Math.round((Math.abs(stepsDiff) / (yesterdayStats.metrics.steps || 1)) * 100);
        insights.push(this.createInsight(
          'daily_comparison',
          'activity',
          trend === 'up' ? "More active today" : "Less active today",
          trend === 'up' ? `You're ${percent}% ahead of yesterday's step count.` : `You've walked ${Math.abs(stepsDiff)} fewer steps than yesterday.`,
          trend === 'up' ? `+${percent}%` : `-${percent}%`,
          trend,
          '🚶'
        ));
      }

      // Hydration Insight
      const waterDiff = todayStats.metrics.totalWaterMl - yesterdayStats.metrics.totalWaterMl;
      if (Math.abs(waterDiff) > 500) {
        const trend = waterDiff > 0 ? 'up' : 'down';
        insights.push(this.createInsight(
          'daily_comparison',
          'hydration',
          trend === 'up' ? "Hydration improving" : "Falling behind on water",
          trend === 'up' ? `You've drank ${waterDiff}mL more than yesterday.` : `You're ${Math.abs(waterDiff)}mL behind yesterday's hydration.`,
          undefined,
          trend,
          '💧'
        ));
      }
    }

    // Weekly Averages
    const thisWeekStr = format(startOfWeek(now), 'yyyy-MM-dd');
    const lastWeekStr = format(startOfWeek(subWeeks(now, 1)), 'yyyy-MM-dd');
    
    const [thisWeekStats, lastWeekStats] = await Promise.all([
      InsightRepository.getStats(userId, 'weekly', thisWeekStr),
      InsightRepository.getStats(userId, 'weekly', lastWeekStr)
    ]);

    if (thisWeekStats && lastWeekStats) {
      const avgStepsThisWeek = Math.round(thisWeekStats.metrics.steps / (now.getDay() || 1));
      const avgStepsLastWeek = Math.round(lastWeekStats.metrics.steps / 7);
      
      const weeklyDiff = avgStepsThisWeek - avgStepsLastWeek;
      if (avgStepsLastWeek > 0 && Math.abs(weeklyDiff) > 500) {
        const trend = weeklyDiff > 0 ? 'up' : 'down';
        const percent = Math.round((Math.abs(weeklyDiff) / avgStepsLastWeek) * 100);
        insights.push(this.createInsight(
          'weekly_trend',
          'activity',
          "Weekly average",
          trend === 'up' ? `That's ${percent}% higher than last week.` : `That's ${percent}% lower than last week.`,
          `${avgStepsThisWeek} steps/day`,
          trend,
          '📈'
        ));
      }
    }

    // Streak / Consistency (from todayStats)
    if (todayStats && todayStats.metrics.streakDays >= 3) {
      insights.push(this.createInsight(
        'coach_message',
        'general',
        "Consistency",
        "You've been improving your consistency. Keep the momentum going!",
        `${todayStats.metrics.streakDays} days`,
        'up',
        '🔥'
      ));
    }

    // Fallback if no insights generated
    if (insights.length === 0) {
      insights.push(this.createInsight(
        'coach_message',
        'general',
        "Ready to Ascend",
        "Log your first meal or workout today to generate insights.",
        undefined,
        'neutral',
        '⛰️'
      ));
    }

    // Sort by priority (coach/trends first) and limit to top 3
    return insights.slice(0, 3);
  }

  static async generateContextString(userId: string): Promise<string> {
    const insights = await this.generateDashboardInsights(userId);
    if (insights.length === 0) return "No recent insights available.";
    
    return insights.map(i => `- [${i.category.toUpperCase()}] ${i.title}: ${i.description}`).join('\n');
  }

  private static createInsight(
    type: InsightType, 
    category: InsightCategory, 
    title: string, 
    description: string, 
    value?: string, 
    trend?: InsightTrend,
    icon?: string
  ): Insight {
    return {
      id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      category,
      title,
      description,
      value,
      trend,
      icon,
      timestamp: new Date().toISOString()
    };
  }
}
