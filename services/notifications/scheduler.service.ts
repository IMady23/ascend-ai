import { useSettingsStore, ReminderSchedule, NotificationChannel } from "@/stores/settings.store";

export class NotificationScheduler {
  
  /**
   * Initializes the scheduler by hooking into the store state.
   * In a real environment, this would register background tasks, service workers,
   * or push notification delegates (APNs/FCM).
   */
  static init() {
    console.log("[NotificationScheduler] Initialized.");
    this.scheduleAll();
  }

  /**
   * Reads all active schedules and registers them.
   */
  static scheduleAll() {
    const schedules = useSettingsStore.getState().schedules;
    schedules.forEach(schedule => {
      if (schedule.enabled) {
        this.register(schedule);
      } else {
        this.unregister(schedule.id);
      }
    });
  }

  /**
   * Registers a specific schedule with the underlying delivery mechanisms.
   */
  static register(schedule: ReminderSchedule) {
    console.log(`[NotificationScheduler] Registering schedule: ${schedule.type} at ${schedule.time}`);
    
    // Abstracted routing based on channel preferences
    if (schedule.channels.includes("in-app")) {
      this.setupInAppTrigger(schedule);
    }
    if (schedule.channels.includes("push")) {
      this.setupPushTrigger(schedule);
    }
    if (schedule.channels.includes("email")) {
      this.setupEmailTrigger(schedule);
    }
  }

  /**
   * Unregisters a specific schedule.
   */
  static unregister(scheduleId: string) {
    console.log(`[NotificationScheduler] Unregistering schedule: ${scheduleId}`);
    // Clear timeouts/intervals or deregister from FCM
  }

  // --- Abstracted Delivery Mechanisms ---

  private static setupInAppTrigger(schedule: ReminderSchedule) {
    // Logic to trigger in-app toast or modal when app is open
  }

  private static setupPushTrigger(schedule: ReminderSchedule) {
    // Logic to register with Firebase Cloud Messaging (FCM) or native APNs
  }

  private static setupEmailTrigger(schedule: ReminderSchedule) {
    // Logic to sync schedule with the backend mailer service (e.g. SendGrid)
  }
}
