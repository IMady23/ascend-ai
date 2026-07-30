import { AscendEvent } from "@/types/events";
import { AggregatedStats, AggregationPeriod, ConsistencyScore } from "@/types/intelligence";
import { InsightRepository } from "@/services/repositories/insight.repository";
import { Timestamp } from "firebase/firestore";
import { format, startOfWeek, startOfMonth } from "date-fns";

export class StatsAggregator {
  
  static async processEvent(event: AscendEvent) {
    const date = new Date(event.timestamp.seconds * 1000);
    const dailyId = format(date, 'yyyy-MM-dd');
    const weeklyId = format(startOfWeek(date), 'yyyy-MM-dd');
    const monthlyId = format(startOfMonth(date), 'yyyy-MM');
    const lifetimeId = 'lifetime';

    await this.updateStats(event.userId, 'daily', dailyId, date, event);
    await this.updateStats(event.userId, 'weekly', weeklyId, startOfWeek(date), event);
    await this.updateStats(event.userId, 'monthly', monthlyId, startOfMonth(date), event);
    await this.updateStats(event.userId, 'lifetime', lifetimeId, new Date(2020, 0, 1), event);
  }

  private static async updateStats(userId: string, period: AggregationPeriod, periodId: string, startDate: Date, event: AscendEvent) {
    let stats = await InsightRepository.getStats(userId, period, periodId);
    
    if (!stats) {
      stats = this.createEmptyStats(userId, period, periodId, startDate);
    }

    // Apply event
    switch (event.type) {
      case 'WORKOUT_COMPLETED':
        stats.metrics.workoutsCompleted += 1;
        stats.metrics.totalVolumeKg += event.metadata.totalVolume || 0;
        // recalculate avg duration
        const totalDuration = (stats.metrics.avgWorkoutDuration * (stats.metrics.workoutsCompleted - 1)) + (event.metadata.durationMinutes || 0);
        stats.metrics.avgWorkoutDuration = totalDuration / stats.metrics.workoutsCompleted;
        break;
      case 'MEAL_LOGGED':
        stats.metrics.mealsLogged += 1;
        if (event.metadata.isGoalMet) {
          stats.metrics.proteinGoalsMet += 1;
        }
        break;
      case 'WATER_LOGGED':
        if (event.metadata.isGoalMet) {
          stats.metrics.waterGoalsMet += 1;
        }
        break;
      case 'MISSION_COMPLETED':
        stats.metrics.missionsCompleted += 1;
        stats.metrics.xpEarned += event.metadata.xpReward || 0;
        break;
    }

    // Recalculate consistency score
    stats.consistency = this.calculateConsistency(stats);
    stats.lastUpdated = { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any;

    await InsightRepository.saveStats(userId, stats);
  }

  private static createEmptyStats(userId: string, period: AggregationPeriod, periodId: string, startDate: Date): AggregatedStats {
    return {
      id: periodId,
      userId,
      period,
      startDate: { seconds: Math.floor(startDate.getTime() / 1000), nanoseconds: 0 } as any,
      endDate: null,
      metrics: {
        workoutsCompleted: 0,
        totalVolumeKg: 0,
        avgWorkoutDuration: 0,
        mealsLogged: 0,
        avgDailyProtein: 0,
        avgDailyCalories: 0,
        proteinGoalsMet: 0,
        waterGoalsMet: 0,
        missionsCompleted: 0,
        xpEarned: 0
      },
      consistency: {
        overall: 0,
        workout: 0,
        nutrition: 0,
        hydration: 0,
        recovery: 0,
        missions: 0
      },
      lastUpdated: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any
    };
  }

  private static calculateConsistency(stats: AggregatedStats): ConsistencyScore {
    // Highly simplified placeholder logic for demonstration.
    // In a real app, this compares against the user's specific goals for the period.
    let w = Math.min(100, stats.metrics.workoutsCompleted * 20); // assume 5/week is 100%
    let n = Math.min(100, stats.metrics.proteinGoalsMet * 15); // assume 7/week is 100%
    let h = Math.min(100, stats.metrics.waterGoalsMet * 15);
    let m = Math.min(100, stats.metrics.missionsCompleted * 10);
    
    // Recovery could be based on sleep data or rest days between workouts
    let r = 85; 

    const overall = (w * 0.4) + (n * 0.3) + (h * 0.1) + (r * 0.1) + (m * 0.1);

    return {
      overall: Math.round(overall),
      workout: Math.round(w),
      nutrition: Math.round(n),
      hydration: Math.round(h),
      recovery: Math.round(r),
      missions: Math.round(m)
    };
  }
}
