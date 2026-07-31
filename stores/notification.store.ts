import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Notification } from "@/types/notification";
import { AudioEngine } from "@/lib/audio/AudioEngine";

interface AudioPreferences {
  masterVolume: number;
  quietHours: { start: string; end: string; enabled: boolean };
  categories: {
    workout: boolean;
    water: boolean;
    meal: boolean;
    sleep: boolean;
    morning: boolean;
    achievement: boolean;
    ai: boolean;
    report: boolean;
  };
}

interface NotificationState {
  notifications: Notification[];
  reminderActive: boolean;
  preferences: AudioPreferences;
  setNotifications: (notifications: Notification[]) => void;
  setReminderActive: (active: boolean) => void;
  markAsRead: (id: string) => void;
  updatePreferences: (updates: Partial<AudioPreferences>) => void;
  updateCategory: (category: keyof AudioPreferences['categories'], enabled: boolean) => void;
  clearHistory: () => void;
  markAllRead: () => void;
  togglePin: (id: string) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      reminderActive: false,
      preferences: {
        masterVolume: 1.0,
        quietHours: { start: "22:00", end: "07:00", enabled: false },
        categories: {
          workout: true,
          water: true,
          meal: true,
          sleep: true,
          morning: true,
          achievement: true,
          ai: true,
          report: true,
        },
      },
      setNotifications: (notifications) => set({ notifications }),
      setReminderActive: (active) => set({ reminderActive: active }),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      togglePin: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, pinned: !n.pinned } : n
          ),
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearHistory: () => set((state) => ({ 
        // Only clear unpinned notifications
        notifications: state.notifications.filter((n) => n.pinned)
      })),
      updatePreferences: (updates) => {
        set((state) => {
          const newPrefs = { ...state.preferences, ...updates };
          AudioEngine.setVolume('master', newPrefs.masterVolume);
          AudioEngine.setQuietHours(newPrefs.quietHours.enabled);
          // In a real app, this would also trigger a Firestore sync 
          // e.g. PreferencesRepository.update(newPrefs)
          return { preferences: newPrefs };
        });
      },
      updateCategory: (category, enabled) => {
        set((state) => {
          const newPrefs = {
            ...state.preferences,
            categories: { ...state.preferences.categories, [category]: enabled },
          };
          return { preferences: newPrefs };
        });
      },
    }),
    {
      name: "ascend-notification-preferences",
      partialize: (state) => ({ preferences: state.preferences }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          AudioEngine.setVolume('master', state.preferences.masterVolume);
          AudioEngine.setQuietHours(state.preferences.quietHours.enabled);
        }
      }
    }
  )
);
