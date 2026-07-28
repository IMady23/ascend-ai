export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "start" | "workout" | "streak" | "chapter" | "milestone" | "record";
}

export interface PersonalRecord {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  date: string;
  icon: string;
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  intensity: 0 | 1 | 2 | 3 | 4; // 0 = no activity, 4 = max intensity
}

export interface LifetimeStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalSteps: number;
  totalDistanceKm: number;
  totalCalories: number;
  totalWaterLiters: number;
  totalProteinKg: number;
  daysActive: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null; // null if locked
  category: "fitness" | "nutrition" | "consistency" | "journey";
}

export interface ProgressPhotoPlaceholder {
  id: string;
  month: string;
  year: number;
  hasFront: boolean;
  hasSide: boolean;
  hasBack: boolean;
}
