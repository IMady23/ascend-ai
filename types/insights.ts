export type InsightType = 
  | 'daily_comparison' 
  | 'weekly_trend' 
  | 'monthly_trend'
  | 'personal_record' 
  | 'habit' 
  | 'forecast' 
  | 'coach_message';

export type InsightCategory = 
  | 'activity' 
  | 'nutrition' 
  | 'hydration' 
  | 'workout' 
  | 'general';

export type InsightTrend = 'up' | 'down' | 'neutral';

export interface Insight {
  id: string;
  type: InsightType;
  category: InsightCategory;
  title: string;          // e.g. "Hydration improving"
  description: string;    // e.g. "You're 600 mL ahead of your usual hydration."
  value?: string;         // e.g. "+14%"
  trend?: InsightTrend;
  icon?: string;          // emoji or icon key
  timestamp: string;      // ISO string
}
