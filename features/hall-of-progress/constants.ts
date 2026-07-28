import type { TimelineEvent, PersonalRecord, Milestone, CalendarDay, LifetimeStats } from "./types";

export const MOCK_TIMELINE: TimelineEvent[] = [
  { id: "t1", date: "2023-11-01", title: "Journey Started", description: "Committed to the Ascend AI protocol.", type: "start" },
  { id: "t2", date: "2023-11-02", title: "First Workout", description: "Completed 'The Awakening' baseline test.", type: "workout" },
  { id: "t3", date: "2023-11-08", title: "First 7-Day Streak", description: "Logged nutrition and activity for 7 consecutive days.", type: "streak" },
  { id: "t4", date: "2023-12-01", title: "Chapter 1 Completed", description: "Mastered the fundamentals.", type: "chapter" },
  { id: "t5", date: "2024-01-15", title: "Weight Goal Met", description: "Dropped below 85kg for the first time.", type: "milestone" },
  { id: "t6", date: "2024-03-10", title: "Most Workouts in a Week", description: "Hit 6 intense sessions in 7 days.", type: "record" },
].reverse() as TimelineEvent[];

export const MOCK_RECORDS: PersonalRecord[] = [
  { id: "r1", title: "Longest Streak", value: 34, unit: "days", date: "2024-02-14", icon: "flame" },
  { id: "r2", title: "Highest Daily Steps", value: 24500, date: "2024-01-22", icon: "footprints" },
  { id: "r3", title: "Highest Calories Burned", value: 1250, unit: "kcal", date: "2024-03-01", icon: "activity" },
  { id: "r4", title: "Most Workouts/Week", value: 6, date: "2024-03-10", icon: "dumbbell" },
  { id: "r5", title: "Nutrition Consistency", value: 21, unit: "days", date: "2023-12-25", icon: "leaf" },
  { id: "r6", title: "Hydration Streak", value: 45, unit: "days", date: "2024-04-05", icon: "droplets" },
];

export const MOCK_MILESTONES: Milestone[] = [
  { id: "m1", title: "First Step", description: "Complete your first workout.", icon: "play", unlockedAt: "2023-11-02", category: "journey" },
  { id: "m2", title: "Consistency King", description: "Hit a 30-day streak.", icon: "crown", unlockedAt: "2024-02-10", category: "consistency" },
  { id: "m3", title: "Iron Sharpens Iron", description: "Complete 50 workouts.", icon: "dumbbell", unlockedAt: "2024-04-20", category: "fitness" },
  { id: "m4", title: "Hydration Master", description: "Hit water goals for 14 straight days.", icon: "droplets", unlockedAt: "2023-12-15", category: "nutrition" },
  { id: "m5", title: "Century Club", description: "Complete 100 workouts.", icon: "zap", unlockedAt: null, category: "fitness" },
  { id: "m6", title: "Nutrition Elite", description: "Hit all macros perfectly for 30 days.", icon: "leaf", unlockedAt: null, category: "nutrition" },
];

export const MOCK_LIFETIME_STATS: LifetimeStats = {
  totalWorkouts: 84,
  totalMinutes: 3780,
  totalSteps: 1250000,
  totalDistanceKm: 950,
  totalCalories: 42000,
  totalWaterLiters: 420,
  totalProteinKg: 14.5,
  daysActive: 165,
};

// Generate a random heatmap for the last ~90 days
export const generateMockCalendar = (): CalendarDay[] => {
  const days: CalendarDay[] = [];
  const today = new Date();
  
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // Random intensity between 0 and 4, weighted towards 1-3
    const rand = Math.random();
    let intensity: 0 | 1 | 2 | 3 | 4 = 0;
    if (rand > 0.8) intensity = 4;
    else if (rand > 0.5) intensity = 3;
    else if (rand > 0.3) intensity = 2;
    else if (rand > 0.1) intensity = 1;
    
    days.push({
      date: d.toISOString().split("T")[0],
      intensity,
    });
  }
  return days;
};
