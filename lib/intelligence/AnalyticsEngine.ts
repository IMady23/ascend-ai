import { AscendEvent } from "@/types/events";
import { AggregatedStats, AggregationPeriod, ConsistencyScore } from "@/types/intelligence";
import { InsightRepository } from "@/services/repositories/insight.repository";
import { format, startOfWeek, startOfMonth, startOfYear } from "date-fns";

export class AnalyticsEngine {
  
  static async processEvent(event: AscendEvent) {
    if (event.processed) return;
    
    const date = new Date(event.timestamp.seconds * 1000);
    const dailyId = format(date, 'yyyy-MM-dd');
    const weeklyId = format(startOfWeek(date), 'yyyy-MM-dd');
    const monthlyId = format(startOfMonth(date), 'yyyy-MM');
    const yearlyId = format(startOfYear(date), 'yyyy');
    const lifetimeId = 'lifetime';

    await Promise.all([
      this.updateStats(event.userId, 'daily', dailyId, date, event),
      this.updateStats(event.userId, 'weekly', weeklyId, startOfWeek(date), event),
      this.updateStats(event.userId, 'monthly', monthlyId, startOfMonth(date), event),
      this.updateStats(event.userId, 'yearly', yearlyId, startOfYear(date), event),
      this.updateStats(event.userId, 'lifetime', lifetimeId, new Date(2020, 0, 1), event)
    ]);
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
        stats.metrics.totalVolumeKg += (event as any).metadata.totalVolume || 0;
        const totalDuration = (stats.metrics.avgWorkoutDuration * (stats.metrics.workoutsCompleted - 1)) + ((event as any).metadata.durationMinutes || 0);
        stats.metrics.avgWorkoutDuration = totalDuration / stats.metrics.workoutsCompleted;
        break;
      case 'MEAL_LOGGED':
        stats.metrics.mealsLogged += 1;
        stats.metrics.totalCalories += (event as any).metadata.calories || 0;
        stats.metrics.totalProtein += (event as any).metadata.protein || 0;
        
        // Recalculate averages
        stats.metrics.avgDailyCalories = stats.metrics.totalCalories / (stats.metrics.mealsLogged || 1); // rough proxy
        stats.metrics.avgDailyProtein = stats.metrics.totalProtein / (stats.metrics.mealsLogged || 1);
        
        if ((event as any).metadata.isGoalMet) {
          stats.metrics.proteinGoalsMet += 1;
        }
        break;
      case 'WATER_LOGGED':
        stats.metrics.totalWaterMl += (event as any).metadata.amountMl || 0;
        if ((event as any).metadata.isGoalMet) {
          stats.metrics.waterGoalsMet += 1;
        }
        break;
      case 'MISSION_COMPLETED':
        stats.metrics.missionsCompleted += 1;
        stats.metrics.xpEarned += (event as any).metadata.xpReward || 0;
        break;
      case 'DISTANCE_LOGGED':
        stats.metrics.distanceMeters += (event as any).metadata.distanceMeter || 0;
        break;
      case 'STEPS_UPDATED':
        stats.metrics.steps += (event as any).metadata.steps || 0;
        break;
      case 'WEIGHT_UPDATED':
        stats.metrics.weightKg = (event as any).metadata.weightKg || stats.metrics.weightKg;
        break;
      case 'STREAK_ACHIEVED':
        stats.metrics.streakDays = (event as any).metadata.streakDays || stats.metrics.streakDays;
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
        xpEarned: 0,
        weightKg: 0,
        steps: 0,
        distanceMeters: 0,
        streakDays: 0,
        totalCalories: 0,
        totalProtein: 0,
        totalWaterMl: 0
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
    let w = Math.min(100, stats.metrics.workoutsCompleted * 20); 
    let n = Math.min(100, stats.metrics.proteinGoalsMet * 15); 
    let h = Math.min(100, stats.metrics.waterGoalsMet * 15);
    let m = Math.min(100, stats.metrics.missionsCompleted * 10);
    
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
