import { create } from "zustand";
import { persist } from "zustand/middleware";
export type NotificationChannel = "in-app" | "push" | "email";

export interface AIConfig {
  coachingStyle: "analytical" | "military" | "supportive" | "balanced" | string;
  motivationStyle: "logical" | "aggressive" | "gentle" | string;
  insightFrequency: "high" | "medium" | "low" | string;
  dailyBriefing: boolean;
  weeklyReview: boolean;
}

export interface AppearanceConfig {
  theme: "light" | "dark" | "system" | string;
  accentColor: string;
  compactLayout: boolean;
  sidebarCollapsed: boolean;
}

export interface MissionConfig {
  dailyMissionCount: number;
  workoutDays: number;
  [key: string]: number;
}

export interface NotificationConfig {
  morningReminder?: boolean;
  workoutReminder?: boolean;
  waterReminder?: boolean;
  mealReminder?: boolean;
  sleepReminder?: boolean;
  weeklyReview?: boolean;
  [key: string]: boolean | undefined;
}

export interface ReminderSchedule {
  id: string;
  enabled: boolean;
  type: string; // e.g., "Morning Briefing", "Workout"
  time: string; // e.g., "07:00" (24hr format) or "every_2h"
  days: string[]; // e.g., ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  channels: NotificationChannel[];
  lastTriggered?: string;
  nextTrigger?: string;
}

export interface NotificationSettings {
  workoutReminders: boolean;
  mealReminders: boolean;
  waterReminders: boolean;
  weeklyReports: boolean;
  achievementAlerts: boolean;
  pushNotifications: boolean;
  quietHours: boolean;
  emailWeeklySummary: boolean;
  emailMonthlyReport: boolean;
  emailCoachInsights: boolean;
  emailMarketing: boolean;
  emailSecurity: boolean;
  aiMorningBriefing: boolean;
  aiEveningReflection: boolean;
  aiRecoveryAlerts: boolean;
  aiMissionReminders: boolean;
  aiStreakWarnings: boolean;
  smartAdaptiveWorkout: boolean;
  smartPlateauAlerts: boolean;
  smartProteinGoal: boolean;
  [key: string]: boolean;
}

interface SettingsState {
  notifications: NotificationSettings;
  schedules: ReminderSchedule[];
  ai: AIConfig;
  appearance: AppearanceConfig;
  mission: MissionConfig;
  updateNotificationSetting: (key: keyof NotificationSettings, value: boolean) => void;
  updateNotifications: (config: Partial<NotificationConfig>) => void;
  updateSchedule: (schedule: ReminderSchedule) => void;
  updateAi: (config: Partial<AIConfig>) => void;
  updateAppearance: (config: Partial<AppearanceConfig>) => void;
  updateMission: (config: Partial<MissionConfig>) => void;
  reset: () => void;
}

const defaultNotifications: NotificationSettings = {
  workoutReminders: true,
  mealReminders: true,
  waterReminders: true,
  weeklyReports: true,
  achievementAlerts: true,
  pushNotifications: true,
  quietHours: false,
  emailWeeklySummary: true,
  emailMonthlyReport: false,
  emailCoachInsights: true,
  emailMarketing: false,
  emailSecurity: true,
  aiMorningBriefing: true,
  aiEveningReflection: true,
  aiRecoveryAlerts: true,
  aiMissionReminders: true,
  aiStreakWarnings: true,
  smartAdaptiveWorkout: true,
  smartPlateauAlerts: true,
  smartProteinGoal: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: defaultNotifications,
      ai: {
        coachingStyle: "balanced",
        motivationStyle: "logical",
        insightFrequency: "medium",
        dailyBriefing: true,
        weeklyReview: true,
      },
      appearance: {
        theme: "system",
        accentColor: "blue",
        compactLayout: false,
        sidebarCollapsed: false,
      },
      mission: {
        dailyMissionCount: 3,
        workoutDays: 5,
      },
      schedules: [
        { id: "morning", enabled: true, type: "Morning Briefing", time: "07:00", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], channels: ["in-app", "push"] },
        { id: "workout", enabled: true, type: "Workout Reminder", time: "17:30", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], channels: ["in-app", "push"] },
        { id: "breakfast", enabled: false, type: "Breakfast Reminder", time: "08:00", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], channels: ["in-app"] },
        { id: "lunch", enabled: false, type: "Lunch Reminder", time: "13:00", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], channels: ["in-app"] },
        { id: "dinner", enabled: false, type: "Dinner Reminder", time: "19:00", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], channels: ["in-app"] },
        { id: "hydration", enabled: true, type: "Hydration Check", time: "every_2h", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], channels: ["in-app"] },
        { id: "evening", enabled: true, type: "Evening Reflection", time: "21:30", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], channels: ["in-app"] },
        { id: "weekly", enabled: true, type: "Weekly Progress Report", time: "20:00", days: ["sun"], channels: ["email", "in-app"] },
      ],
      updateNotificationSetting: (key, value) => 
        set((state) => ({
          notifications: {
            ...state.notifications,
            [key]: value
          }
        })),
      updateNotifications: (config) => 
        set((state) => ({
          notifications: { ...state.notifications, ...config } as any
        })),
      updateSchedule: (schedule) => 
        set((state) => ({
          schedules: state.schedules.map(s => s.id === schedule.id ? schedule : s)
        })),
      updateAi: (config) => 
        set((state) => ({
          ai: { ...state.ai, ...config }
        })),
      updateAppearance: (config) => 
        set((state) => ({
          appearance: { ...state.appearance, ...config }
        })),
      updateMission: (config) => 
        set((state) => ({
          mission: { ...state.mission, ...config } as any
        })),
      reset: () => set({ notifications: defaultNotifications }),
    }),
    {
      name: "ascend-settings-storage",
    }
  )
);
