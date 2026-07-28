import { create } from "zustand";
import type { Notification } from "@/types/notification";

interface NotificationState {
  notifications: Notification[];
  reminderActive: boolean;
  setNotifications: (notifications: Notification[]) => void;
  setReminderActive: (active: boolean) => void;
  markAsRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  reminderActive: false,
  setNotifications: (notifications) => set({ notifications }),
  setReminderActive: (active) => set({ reminderActive: active }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
}));
