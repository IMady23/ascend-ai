import { create } from 'zustand';

export type NotificationCategory = 'workout' | 'hydration' | 'meal' | 'achievement' | 'system';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  read: boolean;
  timestamp: number;
  autoDismiss?: boolean;
}

interface NotificationStore {
  notifications: AppNotification[];
  settings: {
    master: boolean;
    quietHours: boolean;
    weekendMode: boolean;
    volume: number;
    categories: Record<NotificationCategory, boolean>;
  };
  addNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  updateSettings: (settings: Partial<NotificationStore['settings']>) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  settings: {
    master: true,
    quietHours: false,
    weekendMode: false,
    volume: 80,
    categories: {
      workout: true,
      hydration: true,
      meal: true,
      achievement: true,
      system: true
    }
  },
  addNotification: (n) => {
    const { settings } = get();
    if (!settings.master || !settings.categories[n.category]) return;

    const newNotification: AppNotification = {
      ...n,
      id: Math.random().toString(36).substring(2, 9),
      read: false,
      timestamp: Date.now(),
      autoDismiss: n.autoDismiss ?? true
    };

    set(state => ({
      notifications: [newNotification, ...state.notifications]
    }));
  },
  markAsRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  clearAll: () => set({ notifications: [] }),
  updateSettings: (newSettings) => set(state => ({
    settings: { ...state.settings, ...newSettings }
  }))
}));
