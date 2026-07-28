import { WorkoutCategory, WeeklyActivityData } from "./types";

export const WORKOUT_CATEGORIES: WorkoutCategory[] = [
  {
    id: "cat-strength",
    name: "Strength",
    description: "Build muscle and power.",
    iconName: "Dumbbell"
  },
  {
    id: "cat-cardio",
    name: "Cardio",
    description: "Endurance and heart health.",
    iconName: "HeartPulse"
  },
  {
    id: "cat-walking",
    name: "Walking",
    description: "Low intensity steady state.",
    iconName: "Footprints"
  },
  {
    id: "cat-mobility",
    name: "Mobility",
    description: "Flexibility and joint health.",
    iconName: "Activity"
  },
  {
    id: "cat-recovery",
    name: "Recovery",
    description: "Active rest and stretching.",
    iconName: "RefreshCcw"
  }
];

export const MOCK_WEEKLY_ACTIVITY: WeeklyActivityData[] = [
  { day: "Mon", intensity: 80, hasWorkout: true },
  { day: "Tue", intensity: 40, hasWorkout: true },
  { day: "Wed", intensity: 0, hasWorkout: false },
  { day: "Thu", intensity: 60, hasWorkout: true },
  { day: "Fri", intensity: 90, hasWorkout: true },
  { day: "Sat", intensity: 0, hasWorkout: false },
  { day: "Sun", intensity: 30, hasWorkout: false },
];
