import { useReminderStore } from "@/stores/reminder.store";
import { useUserStore } from "@/stores/user.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useToastStore } from "@/stores/toast.store";
import { Reminder, NotificationChannel, AppEvent } from "@/types/reminder";
import { BrowserNotificationService } from "./browser.service";
import { Timestamp } from "firebase/firestore";
import { doc, setDoc, writeBatch, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MotivationalEngine } from "./motivational.engine";

export class ReminderEngine {
  private static timeoutId: NodeJS.Timeout | null = null;
  private static isRunning = false;
  private static currentNextReminderId: string | null = null;

  static start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    console.log("[ReminderEngine] Engine started.");

    // Handle visibility changes (e.g. laptop wakes up, tab becomes active)
    if (typeof window !== "undefined") {
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
      window.addEventListener("focus", this.handleVisibilityChange);
    }
    
    this.evaluateNext();
  }

  static stop() {
    this.isRunning = false;
    this.clearTimeout();
    
    if (typeof window !== "undefined") {
      document.removeEventListener("visibilitychange", this.handleVisibilityChange);
      window.removeEventListener("focus", this.handleVisibilityChange);
    }
    console.log("[ReminderEngine] Engine stopped.");
  }

  private static handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      console.log("[ReminderEngine] Wake-up detected. Re-evaluating reminders.");
      this.evaluateNext();
    }
  };

  private static clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.currentNextReminderId = null;
  }

  public static evaluateNext() {
    if (!this.isRunning) return;

    this.clearTimeout();

    const reminders = useReminderStore.getState().reminders.filter(r => r.enabled && r.status !== "completed");
    if (reminders.length === 0) return;

    const now = new Date();
    let nextReminder: { reminder: Reminder; triggerTime: Date } | null = null;

    for (const reminder of reminders) {
      const triggerTime = this.calculateNextTriggerTime(reminder, now);
      if (!triggerTime) continue;

      if (!nextReminder || triggerTime < nextReminder.triggerTime) {
        nextReminder = { reminder, triggerTime };
      }
    }

    if (!nextReminder) return;

    const delay = nextReminder.triggerTime.getTime() - now.getTime();
    
    // If delay is negative or very small, trigger immediately
    if (delay <= 0) {
      this.triggerReminder(nextReminder.reminder);
      return;
    }

    // Schedule the timeout
    this.currentNextReminderId = nextReminder.reminder.id;
    console.log(`[ReminderEngine] Scheduled next reminder (${nextReminder.reminder.title}) for ${nextReminder.triggerTime.toLocaleTimeString()}`);
    
    this.timeoutId = setTimeout(() => {
      this.triggerReminder(nextReminder!.reminder);
    }, delay);
  }

  private static calculateNextTriggerTime(reminder: Reminder, now: Date): Date | null {
    // For v1.0, assuming scheduledTime is in "HH:mm" format for recurring, or ISO string for "once"
    if (reminder.repeatRule === "once") {
      const scheduled = new Date(reminder.scheduledTime);
      return scheduled; // Even if in the past, return it to be processed (triggered or missed)
    }

    // Parse HH:mm
    const [hoursStr, minutesStr] = reminder.scheduledTime.split(":");
    if (!hoursStr || !minutesStr) return null;
    
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    let candidate = new Date(now);
    candidate.setHours(hours, minutes, 0, 0);

    // If time has passed today, start checking from tomorrow
    if (candidate <= now) {
      candidate.setDate(candidate.getDate() + 1);
    }

    // Loop up to 7 days to find the next valid day based on rule
    for (let i = 0; i < 7; i++) {
      const dayOfWeek = candidate.getDay();
      
      const isValid = 
        reminder.repeatRule === "daily" ||
        (reminder.repeatRule === "weekdays" && dayOfWeek >= 1 && dayOfWeek <= 5) ||
        (reminder.repeatRule === "weekly" && reminder.customDays?.includes(dayOfWeek)) ||
        (reminder.repeatRule === "custom" && reminder.customDays?.includes(dayOfWeek));

      if (isValid) {
        return candidate;
      }
      
      candidate.setDate(candidate.getDate() + 1);
    }

    return null;
  }

  private static async triggerReminder(reminder: Reminder) {
    console.log(`[ReminderEngine] Triggering reminder: ${reminder.id}`);
    
    const now = new Date();
    
    // Check delivery guard (Idempotency)
    // If it was already triggered in the last 1 minute, ignore (debounce duplicate fires)
    if (reminder.lastTriggeredAt) {
      const lastTrigger = new Date(reminder.lastTriggeredAt);
      if (now.getTime() - lastTrigger.getTime() < 60000) {
        console.warn(`[ReminderEngine] Idempotency guard blocked duplicate trigger for ${reminder.id}`);
        this.evaluateNext();
        return;
      }
    }

    // Determine if it was missed by a large margin (e.g., > 1 hour)
    // For 'once' rules:
    if (reminder.repeatRule === "once") {
      const scheduled = new Date(reminder.scheduledTime);
      if (now.getTime() - scheduled.getTime() > 60 * 60 * 1000) { // 1 hour late
        await this.updateReminderStatus(reminder.id, { status: "missed" });
        this.evaluateNext();
        return;
      }
    }
    
    // --- DELIVERY ---
    const deliveryId = crypto.randomUUID();
    let deliveredChannels: NotificationChannel[] = [];
    const userStoreState = useUserStore.getState();
    const userId = userStoreState.userId;
    const profile = userStoreState.profile;
    
    const category = MotivationalEngine.getCategoryForType(reminder.type);
    
    const messageContent = MotivationalEngine.generateMessage(category, {
      name: profile?.identity?.nickname || profile?.identity?.fullName || "Commander",
      waterRemaining: profile?.targets?.water ? profile.targets.water : undefined,
    });
    
    const notificationTitle = messageContent.title;
    const notificationBody = messageContent.body;

    // Play Audio Cue
    try {
      const { AudioEngine } = await import("@/lib/audio/AudioEngine");
      switch (reminder.type) {
        case 'water':
          AudioEngine.playWaterDrop();
          break;
        case 'meal':
          AudioEngine.playSoftNotification();
          break;
        case 'workout':
          AudioEngine.playEnergeticPulse();
          break;
        case 'sleep':
          AudioEngine.playSunriseChime();
          break;
        default:
          AudioEngine.playAttentionTone();
      }
    } catch (e) {
      console.error("[ReminderEngine] Failed to play audio:", e);
    }

    // 1. Browser Push
    if (reminder.notificationChannels.includes("browser")) {
      const success = await BrowserNotificationService.showNotification(notificationTitle, {
        body: notificationBody,
      });
      if (success) deliveredChannels.push("browser");
    }

    // 2. Email (Decoupled execution via API)
    if (reminder.notificationChannels.includes("email") && userId) {
      try {
        const { getAuth } = await import("firebase/auth");
        const auth = getAuth();
        const userEmail = auth.currentUser?.email;
        
        if (!userEmail) {
          console.warn(`[ReminderEngine] ❌ Email failed.\nReason: No authenticated user email found.`);
        } else {
          console.log(`[ReminderEngine] 📧 Sending reminder email...\nRecipient: ${userEmail}\nReminder Type: ${reminder.type}`);
          fetch("/api/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: userEmail,
              subject: notificationTitle,
              templateName: "reminder",
              templateData: {
                title: notificationTitle,
                description: notificationBody,
                type: reminder.type
              }
            })
          }).then(res => {
            if (res.ok) {
              console.log("[ReminderEngine] ✅ Email sent");
            } else {
              console.error(`[ReminderEngine] ❌ Email failed.\nReason: API returned status ${res.status}`);
            }
          }).catch(err => {
            console.error(`[ReminderEngine] ❌ Email failed.\nReason: ${err.message}`);
          });
          deliveredChannels.push("email");
        }
      } catch (e: any) {
        console.error(`[ReminderEngine] ❌ Email failed.\nReason: ${e.message}`);
      }
    }

    // 3. In-App Notification Center and Toast Popup
    if (reminder.notificationChannels.includes("in-app") && userId) {
      // 3.a. Store in Event Log (historical)
      const event: AppEvent = {
        id: crypto.randomUUID(),
        userId,
        type: "reminder_triggered",
        title: notificationTitle,
        message: notificationBody,
        createdAt: new Date().toISOString(),
        isRead: false
      };
      useReminderStore.getState().logEvent(event);

      // 3.b. Push to Notification Center store so the bell icon shows it
      const currentNotifications = useNotificationStore.getState().notifications;
      useNotificationStore.getState().setNotifications([
        {
          id: crypto.randomUUID(),
          title: notificationTitle,
          body: notificationBody,
          type: 'reminder',
          priority: 'high',
          read: false,
          link: null,
          createdAt: Timestamp.now(),
        },
        ...currentNotifications
      ]);

      // 3.c. Show an in-app Toast so the user actually sees a popup
      useToastStore.getState().addToast({
        title: notificationTitle,
        message: notificationBody,
        type: "info",
        duration: 8000
      });

      deliveredChannels.push("in-app");
    }

    // Mark as triggered and update idempotency fields
    const updates: Partial<Reminder> = {
      lastTriggeredAt: now.toISOString(),
      deliveryId,
      lastDeliveredChannel: deliveredChannels[0],
      status: reminder.repeatRule === "once" ? "completed" : "scheduled"
    };
    
    if (reminder.repeatRule === "once") {
      updates.completedAt = now.toISOString();
    }

    await this.updateReminderStatus(reminder.id, updates);
    
    // Schedule next
    this.evaluateNext();
  }

  private static async updateReminderStatus(id: string, updates: Partial<Reminder>) {
    useReminderStore.getState().updateReminder(id, updates);
    const userId = useUserStore.getState().userId;
    
    if (userId) {
      try {
        const ref = doc(db, `users/${userId}/reminders`, id);
        await setDoc(ref, updates, { merge: true });
      } catch (e) {
        console.error("Failed to sync reminder status to Firestore:", e);
      }
    }
  }
}
