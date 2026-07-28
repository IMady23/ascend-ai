import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AIConfig {
  coachingStyle: "military" | "supportive" | "analytical" | "balanced";
  motivationStyle: "aggressive" | "gentle" | "logical";
  insightFrequency: "high" | "medium" | "low";
  weeklyReview: boolean;
  dailyBriefing: boolean;
}

export interface NotificationConfig {
  morningReminder: boolean;
  workoutReminder: boolean;
  waterReminder: boolean;
  mealReminder: boolean;
  sleepReminder: boolean;
  weeklyReview: boolean;
}

export interface AppearanceConfig {
  theme: "dark" | "light" | "system";
  accentColor: "purple" | "emerald" | "amber" | "rose" | "blue";
  compactLayout: boolean;
  animationLevel: "high" | "reduced" | "none";
  sidebarCollapsed: boolean;
}

export interface MissionConfig {
  dailyMissionCount: number;
  workoutDays: number;
  waterGoalMl: number;
  proteinGoalG: number;
  sleepGoalHours: number;
  stepGoal: number;
}

interface SettingsState {
  ai: AIConfig;
  notifications: NotificationConfig;
  appearance: AppearanceConfig;
  mission: MissionConfig;
  updateAi: (config: Partial<AIConfig>) => void;
  updateNotifications: (config: Partial<NotificationConfig>) => void;
  updateAppearance: (config: Partial<AppearanceConfig>) => void;
  updateMission: (config: Partial<MissionConfig>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ai: {
        coachingStyle: "analytical",
        motivationStyle: "logical",
        insightFrequency: "medium",
        weeklyReview: true,
        dailyBriefing: true,
      },
      notifications: {
        morningReminder: true,
        workoutReminder: true,
        waterReminder: false,
        mealReminder: false,
        sleepReminder: true,
        weeklyReview: true,
      },
      appearance: {
        theme: "dark",
        accentColor: "purple",
        compactLayout: false,
        animationLevel: "high",
        sidebarCollapsed: false,
      },
      mission: {
        dailyMissionCount: 3,
        workoutDays: 5,
        waterGoalMl: 2500,
        proteinGoalG: 150,
        sleepGoalHours: 8,
        stepGoal: 10000,
      },
      updateAi: (config) =>
        set((state) => ({ ai: { ...state.ai, ...config } })),
      updateNotifications: (config) =>
        set((state) => ({ notifications: { ...state.notifications, ...config } })),
      updateAppearance: (config) =>
        set((state) => ({ appearance: { ...state.appearance, ...config } })),
      updateMission: (config) =>
        set((state) => ({ mission: { ...state.mission, ...config } })),
    }),
    {
      name: "ascend-settings-storage",
    }
  )
);
