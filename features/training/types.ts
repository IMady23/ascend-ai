import { Activity } from "@/types/activity";

export interface WorkoutCategory {
  id: string;
  name: string;
  description: string;
  iconName: string; // name of the lucide icon
}

export interface WeeklyActivityData {
  day: string; // Mon, Tue, etc.
  intensity: number; // 0-100
  hasWorkout: boolean;
}
