import { Timestamp } from "firebase/firestore";

export type AggregationPeriod = 'daily' | 'weekly' | 'monthly' | 'lifetime';

export interface ConsistencyScore {
  overall: number; // 0-100
  workout: number;
  nutrition: number;
  hydration: number;
  recovery: number;
  missions: number;
}

export interface AggregatedStats {
  id: string; // e.g., "2026-07-30", "2026-W30", "2026-07", "lifetime"
  userId: string;
  period: AggregationPeriod;
  startDate: Timestamp;
  endDate: Timestamp | null;
  
  metrics: {
    workoutsCompleted: number;
    totalVolumeKg: number;
    avgWorkoutDuration: number;
    
    mealsLogged: number;
    avgDailyProtein: number;
    avgDailyCalories: number;
    proteinGoalsMet: number;
    
    waterGoalsMet: number;
    
    missionsCompleted: number;
    xpEarned: number;
  };
  
  consistency: ConsistencyScore;
  lastUpdated: Timestamp;
}

export type InsightCategory = 'TREND' | 'PLATEAU' | 'RISK' | 'MILESTONE' | 'WEEKLY_REPORT' | 'MONTHLY_REPORT';

export interface Insight {
  id: string;
  userId: string;
  category: InsightCategory;
  title: string;
  description: string;
  explanation?: string[]; // The "Why?" bullet points
  actionableRecommendation?: {
    label: string;
    route: string;
  };
  relatedMetrics?: Record<string, any>;
  timestamp: Timestamp;
  isRead: boolean;
}
