import { create } from "zustand";
import type { Activity } from "@/types/activity";

interface ActivityState {
  activities: Activity[];
  currentActivity: Activity | null;
  dailySteps: number;
  setActivities: (activities: Activity[]) => void;
  setCurrentActivity: (activity: Activity | null) => void;
  setDailySteps: (steps: number) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  currentActivity: null,
  dailySteps: 6420,
  setActivities: (activities) => set({ activities }),
  setCurrentActivity: (activity) => set({ currentActivity: activity }),
  setDailySteps: (steps) => set({ dailySteps: steps }),
}));
