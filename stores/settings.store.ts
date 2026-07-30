import { create } from "zustand";
import { persist } from "zustand/middleware";
export type NotificationChannel = "in-app" | "push" | "email";

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
}

interface SettingsState {
  notifications: NotificationSettings;
  schedules: ReminderSchedule[];
  updateNotificationSetting: (key: keyof NotificationSettings, value: boolean) => void;
  updateSchedule: (schedule: ReminderSchedule) => void;
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
      updateSchedule: (schedule) => 
        set((state) => ({
          schedules: state.schedules.map(s => s.id === schedule.id ? schedule : s)
        })),
      reset: () => set({ notifications: defaultNotifications }),
    }),
    {
      name: "ascend-settings-storage",
    }
  )
);
