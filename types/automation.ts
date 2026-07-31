export interface NotificationPreferences {
  workoutReminder: boolean;
  mealReminder: boolean;
  waterReminder: boolean;
  achievementNotifications: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  quietHours: {
    start: string; // e.g. '22:00'
    end: string;   // e.g. '07:00'
  };
}

export interface UserPreferences {
  userId: string;
  timezone: string; // IANA timezone e.g. 'Asia/Kolkata'
  notifications: NotificationPreferences;
}
