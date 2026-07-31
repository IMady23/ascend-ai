import { useSettingsStore } from "@/stores/settings.store";
import { useReminderStore } from "@/stores/reminder.store";
import { useUserStore } from "@/stores/user.store";
import { ReminderEngine } from "./reminder.engine";
import { Reminder, NotificationChannel, ReminderType } from "@/types/reminder";

export class NotificationScheduler {
  static init() {
    console.log("[NotificationScheduler] Initialized.");
    this.scheduleAll();
  }

  static scheduleAll() {
    const schedules = useSettingsStore.getState().schedules;
    const userId = useUserStore.getState().userId;
    
    if (!userId) return;

    // Convert UI schedules to Engine Reminders
    const reminders: Reminder[] = schedules.map(s => {
      // Map channels from UI to Engine schema
      const notificationChannels: NotificationChannel[] = s.channels.map(c => 
        c === "push" ? "browser" : c as NotificationChannel
      );

      // Determine type
      let type: ReminderType = "custom";
      if (s.id.includes("workout")) type = "workout";
      if (s.id.includes("breakfast") || s.id.includes("lunch") || s.id.includes("dinner")) type = "meal";
      if (s.id.includes("hydration")) type = "water";
      if (s.id.includes("evening") || s.id.includes("morning")) type = "sleep";

      return {
        id: s.id,
        userId,
        title: s.type,
        description: `Scheduled reminder for ${s.type}`,
        type,
        scheduledTime: s.time === "every_2h" ? "00:00" : s.time,
        repeatRule: s.time === "every_2h" ? "daily" : "daily", // simplified for v1
        enabled: s.enabled,
        notificationChannels,
        status: "scheduled",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    // Merge into store (preserving history/ids)
    const existing = useReminderStore.getState().reminders;
    const merged = reminders.map(r => {
      const exist = existing.find(e => e.id === r.id);
      return exist ? { ...exist, ...r, updatedAt: new Date().toISOString() } : r;
    });

    useReminderStore.getState().setReminders(merged);
    
    // Force the engine to evaluate the newly saved reminders immediately
    ReminderEngine.evaluateNext();
  }
}
