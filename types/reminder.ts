export type NotificationChannel = "in-app" | "browser" | "email";
export type ReminderType = "workout" | "meal" | "water" | "sleep" | "custom";
export type ReminderStatus = "created" | "scheduled" | "triggered" | "completed" | "missed";
export type RepeatRule = "once" | "daily" | "weekdays" | "weekly" | "custom";

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: ReminderType;
  scheduledTime: string; // ISO string or HH:mm format depending on recurrance
  repeatRule: RepeatRule;
  customDays?: number[]; // 0=Sun, 1=Mon, etc. if repeatRule="custom"
  enabled: boolean;
  
  // Deliverability
  notificationChannels: NotificationChannel[];
  
  // State
  status: ReminderStatus;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Idempotency / Guards
  lastTriggeredAt?: string;
  lastDeliveredChannel?: NotificationChannel;
  deliveryId?: string; // UUID for the latest exact trigger event
  completedAt?: string;
}

// Extensible events for Notification Center
export type AppEventType = 
  | "reminder_triggered"
  | "goal_completed"
  | "workout_completed"
  | "achievement_unlocked"
  | "weekly_report"
  | "ai_insight";

export interface AppEvent {
  id: string;
  userId: string;
  type: AppEventType;
  title: string;
  message: string;
  metadata?: any;
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
}
