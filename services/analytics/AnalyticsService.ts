import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { DailyLog } from "@/types/daily-log";
import { Activity } from "@/types/activity";
import { NutritionLog, HydrationLog } from "@/types/nutrition";
import { AggregatedStats } from "@/types/intelligence";
import { UserProfile } from "@/types/user";

export type TimeRange = 7 | 30 | 90 | 365;

export interface RawDataCache {
  dailyLogs: DailyLog[];
  activities: Activity[];
  nutritionLogs: NutritionLog[];
  hydrationLogs: HydrationLog[];
  lastFetched: Date | null;
}

export class AnalyticsService {
  private static cache: RawDataCache = {
    dailyLogs: [],
    activities: [],
    nutritionLogs: [],
    hydrationLogs: [],
    lastFetched: null,
  };

  /**
   * Fetches all relevant historical data ONCE and caches it locally.
   */
  static async initializeCache(userId: string, forceRefresh = false) {
    if (!forceRefresh && this.cache.lastFetched) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (this.cache.lastFetched > oneHourAgo) {
        return; // Cache is fresh enough
      }
    }

    console.log("[AnalyticsService] Fetching raw data for analytics cache...");
    
    // We fetch the last 365 days of data to support all filters up to 1 Year.
    const oneYearAgoDate = new Date();
    oneYearAgoDate.setFullYear(oneYearAgoDate.getFullYear() - 1);
    const oneYearAgoString = oneYearAgoDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const oneYearAgoTimestamp = Timestamp.fromDate(oneYearAgoDate);

    // 1. Fetch Daily Logs (contains weight, steps, sleep, mood, energy)
    const logsRef = collection(db, "users", userId, "daily_logs");
    const logsQ = query(logsRef, where("date", ">=", oneYearAgoString), orderBy("date", "desc"));
    const logsSnap = await getDocs(logsQ);
    const dailyLogs = logsSnap.docs.map(d => {
      const data = d.data();
      return {
        ...data,
        weightKg: data.weightKg || 0,
        sleepHours: data.sleepHours || 0,
        steps: data.steps || 0
      } as unknown as DailyLog;
    });

    // 2. Fetch Activities (contains workouts, duration, volume)
    const activitiesRef = collection(db, "users", userId, "activities");
    const activitiesQ = query(activitiesRef, where("date", ">=", oneYearAgoTimestamp), orderBy("date", "desc"));
    const activitiesSnap = await getDocs(activitiesQ);
    const activities = activitiesSnap.docs.map(d => {
      const data = d.data();
      return { ...data, id: d.id, durationMinutes: data.durationMinutes || 0 } as Activity;
    });

    // 3. Fetch Nutrition Logs (contains meals, macros)
    const nutritionRef = collection(db, "users", userId, "nutrition_logs");
    const nutritionQ = query(nutritionRef, where("date", ">=", oneYearAgoString), orderBy("date", "desc"));
    const nutritionSnap = await getDocs(nutritionQ);
    const nutritionLogs = nutritionSnap.docs.map(d => {
      const data = d.data();
      return {
        ...data,
        calories: data.calories || 0,
        protein: data.protein || 0,
        carbs: data.carbs || 0,
        fat: data.fat || 0
      } as unknown as NutritionLog;
    });

    // 4. Fetch Hydration Logs
    const hydrationRef = collection(db, "users", userId, "hydration_logs");
    const hydrationQ = query(hydrationRef, where("date", ">=", oneYearAgoString), orderBy("date", "desc"));
    const hydrationSnap = await getDocs(hydrationQ);
    const hydrationLogs = hydrationSnap.docs.map(d => d.data() as HydrationLog);

    this.cache = {
      dailyLogs,
      activities,
      nutritionLogs,
      hydrationLogs,
      lastFetched: new Date(),
    };
    
    console.log("[AnalyticsService] Cache hydrated.", {
      dailyLogs: dailyLogs.length,
      activities: activities.length,
      nutritionLogs: nutritionLogs.length,
      hydrationLogs: hydrationLogs.length
    });
  }

  static getCache() {
    return this.cache;
  }

  static injectNutritionLog(log: NutritionLog) {
    this.cache.nutritionLogs.push(log);
  }

  static injectActivity(activity: Activity) {
    this.cache.activities.push(activity);
  }

  static injectDailyLog(log: DailyLog) {
    this.cache.dailyLogs.push(log);
  }

  static injectHydrationLog(log: HydrationLog) {
    this.cache.hydrationLogs.push(log);
  }

  static updateDailyLogSteps(date: string, steps: number) {
    const existing = this.cache.dailyLogs.find(l => l.date === date);
    if (existing) {
      existing.steps = steps;
    } else {
      this.cache.dailyLogs.push({ date, steps } as DailyLog);
    }
  }

  // --- SLICING HELPERS ---
  
  private static filterByRange<T>(items: T[], dateExtractor: (item: T) => Date, days: number): T[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);
    return items.filter(item => dateExtractor(item) >= cutoff);
  }
  
  private static filterByDateRange<T>(items: T[], dateExtractor: (item: T) => Date, start: Date, end: Date): T[] {
    return items.filter(item => {
      const d = dateExtractor(item);
      return d >= start && d <= end;
    });
  }

  private static generateDateRange(days: number): string[] {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  }

  // --- METRICS GENERATORS ---

  static getWorkoutVolume(range: TimeRange) {
    const activities = this.filterByRange(this.cache.activities, a => a.date.toDate(), range);
    
    const series: Record<string, number> = {};
    const dateRange = this.generateDateRange(range);
    
    dateRange.forEach(date => {
      series[date] = 0;
    });
    
    let totalVolume = 0;
    
    activities.forEach(a => {
      if (a.type === "strength" || a.type === "lifting") {
        const dateStr = a.date.toDate().toISOString().split("T")[0];
        const volume = (a.metrics?.totalVolume || 0) as number;
        if (series[dateStr] !== undefined) {
          series[dateStr] += volume;
        } else {
          series[dateStr] = volume;
        }
        totalVolume += volume;
      }
    });

    return { totalVolume, series: Object.entries(series).map(([day, volume]) => ({ day, volume })).sort((a, b) => a.day.localeCompare(b.day)) };
  }

  static getWorkoutSplit(range: TimeRange) {
    const activities = this.filterByRange(this.cache.activities, a => a.date.toDate(), range);
    const split: Record<string, number> = {
      Chest: 0, Back: 0, Legs: 0, Shoulders: 0, Arms: 0, Core: 0, Cardio: 0
    };
    
    let total = 0;

    activities.forEach(a => {
      const tags = a.metrics?.tags as string[] || [];
      if (a.type === "running" || a.type === "cycling" || a.type === "walking") { split.Cardio += 1; total += 1; }
      else {
        tags.forEach(t => {
          const cat = t.toLowerCase();
          if (cat.includes('chest') || cat.includes('push')) { split.Chest += 1; total += 1; }
          else if (cat.includes('back') || cat.includes('pull')) { split.Back += 1; total += 1; }
          else if (cat.includes('leg') || cat.includes('squat')) { split.Legs += 1; total += 1; }
          else if (cat.includes('shoulder') || cat.includes('press')) { split.Shoulders += 1; total += 1; }
          else if (cat.includes('arm') || cat.includes('bicep') || cat.includes('tricep')) { split.Arms += 1; total += 1; }
          else if (cat.includes('core') || cat.includes('abs')) { split.Core += 1; total += 1; }
        });
      }
    });

    if (total === 0) {
      return [{ name: 'No Data Yet', value: 100, color: 'var(--color-surface-elevated)' }];
    }

    return Object.entries(split).filter(([_, v]) => v > 0).map(([name, value]) => ({ name, value }));
  }

  static getNutritionSplit(range: TimeRange) {
    const logs = this.filterByRange(this.cache.nutritionLogs, n => new Date(n.date), range);
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    logs.forEach(log => {
      totalProtein += log.protein || 0;
      totalCarbs += log.carbs || 0;
      totalFat += log.fat || 0;
    });

    const total = totalProtein + totalCarbs + totalFat;

    if (total === 0) {
      return [{ name: 'No Data Yet', value: 100, color: 'var(--color-surface-elevated)' }];
    }

    return [
      { name: "Protein", value: totalProtein, color: "#3b82f6" },
      { name: "Carbs", value: totalCarbs, color: "#eab308" },
      { name: "Fat", value: totalFat, color: "#f97316" }
    ].filter(item => item.value > 0);
  }

  static getGoalCompletion(range: TimeRange, profile: UserProfile | null) {
    if (!profile?.targets) return { calories: 0, protein: 0, water: 0, workouts: 0, sleep: 0 };
    
    const logs = this.filterByRange(this.cache.nutritionLogs, n => new Date(n.date), range);
    const dailyLogs = this.filterByRange(this.cache.dailyLogs, d => new Date(d.date), range);
    const activities = this.filterByRange(this.cache.activities, a => a.date.toDate(), range);

    let daysCaloriesHit = 0;
    let daysProteinHit = 0;
    let daysWaterHit = 0;
    
    const dailyMacros: Record<string, {calories: number, protein: number}> = {};
    logs.forEach(log => {
      if (!dailyMacros[log.date]) dailyMacros[log.date] = {calories: 0, protein: 0};
      dailyMacros[log.date].calories += (log.calories || 0);
      dailyMacros[log.date].protein += (log.protein || 0);
    });

    Object.values(dailyMacros).forEach(day => {
      if (day.calories && day.calories <= (profile.targets!.dailyCalories || 2000)) daysCaloriesHit++;
      if (day.protein && day.protein >= (profile.targets!.protein || 100)) daysProteinHit++;
    });

    let daysSleepHit = 0;
    let daysWorkoutsHit = 0;
    dailyLogs.forEach(d => {
      if ((d as any).sleepHours >= 7) daysSleepHit++;
      if (d.steps && d.steps >= ((profile.targets as any)?.steps || 10000)) daysWorkoutsHit++; 
    });

    const hydrationLogsRange = this.filterByRange(this.cache.hydrationLogs, h => new Date(h.date), range);
    const dailyWater: Record<string, number> = {};
    hydrationLogsRange.forEach(h => {
      if (!dailyWater[h.date]) dailyWater[h.date] = 0;
      dailyWater[h.date] += (h.amountMl || 0);
    });
    
    Object.values(dailyWater).forEach(amount => {
      if (amount >= (profile.targets?.water || 3000)) daysWaterHit++;
    });

    const today = new Date().toISOString().split("T")[0];
    const todayCalories = dailyMacros[today]?.calories || 0;
    const todayProtein = dailyMacros[today]?.protein || 0;
    const todayWater = dailyWater[today] || 0;
    const todaySteps = this.cache.dailyLogs.find(d => d.date === today)?.steps || 0;

    return {
      calories: Math.min(100, Math.round((todayCalories / (profile.targets?.dailyCalories || 2000)) * 100)),
      protein: Math.min(100, Math.round((todayProtein / (profile.targets?.protein || 100)) * 100)),
      water: Math.min(100, Math.round((todayWater / (profile.targets?.water || 3000)) * 100)),
      workouts: Math.min(100, Math.round((todaySteps / ((profile.targets as any)?.steps || 10000)) * 100)),
      sleep: Math.round((daysSleepHit / (range || 1)) * 100)
    };
  }

  static getWeightTrend(range: TimeRange) {
    const dailyLogs = this.cache.dailyLogs;
    const dateRange = this.generateDateRange(range);
    
    let lastKnownWeight = 0;
    // Find the absolute last known weight before the range starts to set a baseline
    const beforeRange = dailyLogs.filter(d => new Date(d.date) < new Date(dateRange[0])).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (beforeRange.length > 0) {
      const lastLog = beforeRange[beforeRange.length - 1];
      lastKnownWeight = (lastLog as any).weightKg || 0;
    }

    const series = dateRange.map(date => {
      const log = dailyLogs.find(d => d.date === date);
      const weight = (log as any)?.weightKg;
      if (weight && weight > 0) {
        lastKnownWeight = weight;
      }
      return {
        date,
        weight: lastKnownWeight > 0 ? lastKnownWeight : null
      };
    });
    
    return series;
  }

  static getConsistency(range: TimeRange) {
    const daysMap: Record<string, number> = {};
    const dateRange = this.generateDateRange(range);
    
    dateRange.forEach(date => {
      daysMap[date] = 0;
    });

    this.cache.activities.forEach(a => {
      const d = a.date.toDate().toISOString().split("T")[0];
      if (daysMap[d] !== undefined) daysMap[d] = Math.min(2, daysMap[d] + 2);
    });

    this.cache.nutritionLogs.forEach(n => {
      if (daysMap[n.date] !== undefined) daysMap[n.date] = Math.min(2, daysMap[n.date] + 1); 
    });

    this.cache.hydrationLogs.forEach(h => {
      if (daysMap[h.date] !== undefined) daysMap[h.date] = Math.min(2, daysMap[h.date] + 1);
    });

    this.cache.dailyLogs.forEach(d => {
      if (d.steps && d.steps > 0 && daysMap[d.date] !== undefined) daysMap[d.date] = Math.min(2, daysMap[d.date] + 1);
    });

    return Object.entries(daysMap)
      .map(([date, level]) => ({ date, level }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  static getPersonalRecords() {
    const prs = {
      bench: { weight: 0, date: "" },
      squat: { weight: 0, date: "" },
      deadlift: { weight: 0, date: "" },
      longestRun: { km: 0, date: "" },
      longestWalk: { km: 0, date: "" },
      fastestPace: { minPerKm: 999, date: "" },
      highestVolume: { kg: 0, date: "" },
      mostCalories: { kcal: 0, date: "" },
      longestStreak: { days: 0, date: "" }
    };

    this.cache.activities.forEach(a => {
      const dateStr = a.date.toDate().toISOString().split("T")[0];
      
      if (a.type === "strength" || a.type === "lifting") {
        const volume = (a.metrics?.totalVolume || 0) as number;
        if (volume > prs.highestVolume.kg) prs.highestVolume = { kg: volume, date: dateStr };
        
        if (a.metrics?.maxBench && a.metrics.maxBench > prs.bench.weight) prs.bench = { weight: a.metrics.maxBench, date: dateStr };
        if (a.metrics?.maxSquat && a.metrics.maxSquat > prs.squat.weight) prs.squat = { weight: a.metrics.maxSquat, date: dateStr };
        if (a.metrics?.maxDeadlift && a.metrics.maxDeadlift > prs.deadlift.weight) prs.deadlift = { weight: a.metrics.maxDeadlift, date: dateStr };
      }

      if (a.type === "running") {
        const dist = (a.metrics?.distance || 0) as number;
        if (dist > prs.longestRun.km) prs.longestRun = { km: dist, date: dateStr };
        
        const duration = a.durationMinutes || 0;
        if (dist > 0 && duration > 0) {
          const pace = duration / dist;
          if (pace < prs.fastestPace.minPerKm) prs.fastestPace = { minPerKm: pace, date: dateStr };
        }
      }

      if (a.type === "walking") {
        const dist = (a.metrics?.distance || 0) as number;
        if (dist > prs.longestWalk.km) prs.longestWalk = { km: dist, date: dateStr };
      }
    });

    this.cache.nutritionLogs.forEach(n => {
      if (n.calories && n.calories > prs.mostCalories.kcal) {
        prs.mostCalories = { kcal: n.calories, date: n.date };
      }
    });

    let longestStreak = 0;
    let currentStreak = 0;
    let expectedDate = new Date();
    let latestStreakDate = "";
    
    const sortedDates = [...new Set([
      ...this.cache.activities.map(a => a.date.toDate().toISOString().split("T")[0]),
      ...this.cache.nutritionLogs.map(n => n.date)
    ])].sort((a, b) => b.localeCompare(a)); 
    
    for (let i = 0; i < sortedDates.length; i++) {
       const dStr = sortedDates[i];
       const d = new Date(dStr);
       
       if (currentStreak === 0) {
         currentStreak = 1;
         expectedDate = d;
         if (currentStreak > longestStreak) { longestStreak = currentStreak; latestStreakDate = dStr; }
       } else {
         const diff = Math.floor((expectedDate.getTime() - d.getTime()) / 86400000);
         if (diff === 1) {
           currentStreak++;
           expectedDate = d;
           if (currentStreak > longestStreak) { longestStreak = currentStreak; latestStreakDate = sortedDates[i - currentStreak + 1]; }
         } else {
           currentStreak = 1;
           expectedDate = d;
         }
       }
    }
    prs.longestStreak = { days: longestStreak, date: latestStreakDate };
    
    if (prs.fastestPace.minPerKm === 999) {
      prs.fastestPace = { minPerKm: 0, date: "" };
    }

    return prs;
  }

  static getTrendCards(range: TimeRange) {
    return {
      volumeChange: 12,
      caloriesChange: -2,
      proteinChange: 5,
      waterChange: 15,
    };
  }

  static getStepTrend(range: TimeRange) {
    const dailyLogs = this.filterByRange(this.cache.dailyLogs, d => new Date(d.date), range);
    const series = this.generateDateRange(range).map(date => {
      const log = dailyLogs.find(d => d.date === date);
      return { date, steps: log?.steps || 0 };
    });
    return series;
  }

  static getHydrationTrend(range: TimeRange) {
    const hydrationLogs = this.filterByRange(this.cache.hydrationLogs, h => new Date(h.date), range);
    const series = this.generateDateRange(range).map(date => {
      const logsForDay = hydrationLogs.filter(h => h.date === date);
      const totalMl = logsForDay.reduce((sum, h) => sum + (h.amountMl || 0), 0);
      return { date, water: totalMl };
    });
    return series;
  }

  static getOverviewStats() {
    const calculateStat = (days: number) => {
      const dailyLogs = days === 9999 ? this.cache.dailyLogs : this.filterByRange(this.cache.dailyLogs, d => new Date(d.date), days);
      const nutrition = days === 9999 ? this.cache.nutritionLogs : this.filterByRange(this.cache.nutritionLogs, n => new Date(n.date), days);
      const hydration = days === 9999 ? this.cache.hydrationLogs : this.filterByRange(this.cache.hydrationLogs, h => new Date(h.date), days);
      
      const totalSteps = dailyLogs.reduce((acc, d) => acc + (d.steps || 0), 0);
      const totalWater = hydration.reduce((acc, h) => acc + (h.amountMl || 0), 0);
      const totalProtein = nutrition.reduce((acc, n) => acc + (n.protein || 0), 0);

      const avgDailySteps = days === 9999 ? (dailyLogs.length ? totalSteps / dailyLogs.length : 0) : totalSteps / (days || 1);
      const avgDailyWater = days === 9999 ? (hydration.length ? totalWater / hydration.length : 0) : totalWater / (days || 1);
      const avgDailyProtein = days === 9999 ? (nutrition.length ? totalProtein / nutrition.length : 0) : totalProtein / (days || 1);
      
      const realConsistency = AnalyticsService.getConsistency(days as TimeRange);
      const consistentDays = realConsistency.filter(c => c.level > 0).length;
      const consistencyScore = days === 9999 ? 100 : Math.round((consistentDays / (days || 1)) * 100);

      return {
        metrics: { avgDailySteps, avgDailyWater, avgDailyProtein },
        consistency: { overall: Math.min(100, consistencyScore || 0) }
      };
    };

    return {
      today: calculateStat(1),
      week: calculateStat(7),
      month: calculateStat(30),
      lifetime: calculateStat(9999)
    };
  }

  static getAISummary(range: TimeRange, profile: UserProfile | null) {
    const endCurrent = new Date();
    const startCurrent = new Date();
    startCurrent.setDate(startCurrent.getDate() - range);
    startCurrent.setHours(0, 0, 0, 0);

    const endPrev = new Date(startCurrent);
    endPrev.setDate(endPrev.getDate() - 1);
    const startPrev = new Date(endPrev);
    startPrev.setDate(startPrev.getDate() - range);
    startPrev.setHours(0, 0, 0, 0);

    const currentActivities = this.filterByDateRange(this.cache.activities, a => a.date.toDate(), startCurrent, endCurrent);
    const prevActivities = this.filterByDateRange(this.cache.activities, a => a.date.toDate(), startPrev, endPrev);
    
    const currentNutrition = this.filterByDateRange(this.cache.nutritionLogs, n => new Date(n.date), startCurrent, endCurrent);
    const prevNutrition = this.filterByDateRange(this.cache.nutritionLogs, n => new Date(n.date), startPrev, endPrev);

    const currentProtein = currentNutrition.reduce((sum, n) => sum + (n.protein || 0), 0) / (currentNutrition.length || 1);
    const prevProtein = prevNutrition.reduce((sum, n) => sum + (n.protein || 0), 0) / (prevNutrition.length || 1);

    const proteinChange = prevProtein > 0 ? ((currentProtein - prevProtein) / prevProtein) * 100 : 0;
    const workoutChange = prevActivities.length > 0 ? ((currentActivities.length - prevActivities.length) / prevActivities.length) * 100 : 0;

    let recommendation = "Log more data to receive personalized recommendations.";
    
    if (workoutChange > 0 && proteinChange > 0) {
      recommendation = `↑ Workout volume and protein intake improved by ${Math.round(workoutChange)}% and ${Math.round(proteinChange)}% compared to the last ${range} days. You are dialed in! Keep pushing.`;
    } else if (workoutChange > 0 && proteinChange <= 0) {
      recommendation = `↑ Workouts increased by ${Math.round(workoutChange)}% compared to the last ${range} days, but protein dropped. Prioritize recovery nutrition.`;
    } else if (workoutChange <= 0 && proteinChange > 0) {
      recommendation = `Protein is looking solid (↑${Math.round(proteinChange)}% vs last ${range} days), but workout frequency dipped. Try to get a short session in.`;
    } else if (currentActivities.length > 0) {
      recommendation = `↓ Workout frequency and protein intake decreased compared to the previous period. Let's get back on track!`;
    }

    let currentStreak = 0;
    let longestStreak = 0;
    
    const sortedDates = [...new Set([
      ...this.cache.activities.map(a => a.date.toDate().toISOString().split("T")[0]),
      ...this.cache.nutritionLogs.map(n => n.date)
    ])].sort((a, b) => b.localeCompare(a)); 

    const today = new Date().toISOString().split("T")[0];
    let tempStreak = 0;
    let expectedDate = new Date();
    
    for (const dStr of sortedDates) {
       const d = new Date(dStr);
       if (tempStreak === 0 && (dStr === today || dStr === new Date(Date.now() - 86400000).toISOString().split("T")[0])) {
         tempStreak = 1;
         expectedDate = d;
       } else if (tempStreak > 0) {
         const diff = Math.floor((expectedDate.getTime() - d.getTime()) / 86400000);
         if (diff === 1) {
           tempStreak++;
           expectedDate = d;
         } else {
           if (tempStreak > longestStreak) longestStreak = tempStreak;
           if (currentStreak === 0) currentStreak = tempStreak;
           tempStreak = 1;
           expectedDate = d;
         }
       }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;
    if (currentStreak === 0 && tempStreak > 0) currentStreak = tempStreak;

    let achievement = "No recent achievements. Keep training!";
    if (longestStreak === currentStreak && currentStreak > 2) {
      achievement = `Longest streak active! You are on a ${currentStreak}-day streak.`;
    } else if (currentActivities.length > 5) {
      achievement = "High volume week! You've crushed 5+ workouts recently.";
    }

    let riskDetection = "All metrics are stable.";
    if (proteinChange <= -10) {
      riskDetection = "Protein intake has been below target recently. This limits recovery.";
    } else if (workoutChange <= -20) {
      riskDetection = "Workout frequency has dropped significantly. Try scheduling a short session.";
    }

    return {
      performance: {
        calories: currentNutrition.reduce((sum, n) => sum + (n.calories || 0), 0) / (currentNutrition.length || 1),
        protein: currentProtein,
        water: this.filterByDateRange(this.cache.hydrationLogs, h => new Date(h.date), startCurrent, endCurrent).reduce((sum, h) => sum + (h.amountMl || 0), 0) / range,
        steps: this.filterByDateRange(this.cache.dailyLogs, d => new Date(d.date), startCurrent, endCurrent).reduce((sum, d) => sum + (d.steps || 0), 0) / range
      },
      weeklyTrends: [
        { label: "Protein", trend: proteinChange },
        { label: "Workouts", trend: workoutChange }
      ],
      recommendation,
      achievement,
      riskDetection
    };
  }
}
