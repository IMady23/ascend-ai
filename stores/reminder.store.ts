import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Reminder, AppEvent } from "@/types/reminder";

interface ReminderState {
  reminders: Reminder[];
  history: AppEvent[];
  
  // Actions
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  setReminders: (reminders: Reminder[]) => void;
  
  // History Actions
  logEvent: (event: AppEvent) => void;
  markEventRead: (id: string) => void;
  
  // Lifecycle
  clearState: () => void;
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set) => ({
      reminders: [],
      history: [],
      
      addReminder: (reminder) => set((state) => ({
        reminders: [...state.reminders.filter(r => r.id !== reminder.id), reminder]
      })),
      
      updateReminder: (id, updates) => set((state) => ({
        reminders: state.reminders.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r)
      })),
      
      deleteReminder: (id) => set((state) => ({
        reminders: state.reminders.filter(r => r.id !== id)
      })),
      
      setReminders: (reminders) => set({ reminders }),
      
      logEvent: (event) => set((state) => ({
        // Keep history in descending order
        history: [event, ...state.history]
      })),
      
      markEventRead: (id) => set((state) => ({
        history: state.history.map(e => e.id === id ? { ...e, isRead: true } : e)
      })),
      
      clearState: () => set({ reminders: [], history: [] })
    }),
    {
      name: "ascend-reminder-storage",
    }
  )
);
