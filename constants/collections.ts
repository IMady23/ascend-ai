export const COLLECTIONS = {
  USERS: "users",
  SETTINGS: "settings",
  CHAPTERS: "chapters",
  DAILY_LOGS: "daily_logs",
  ACTIVITIES: "activities",
  NUTRITION_LOGS: "nutrition_logs",
  WATER_LOGS: "water_logs",
  JOURNAL_ENTRIES: "journal_entries",
  PROGRESS_PHOTOS: "progress_photos",
  ACHIEVEMENTS: "achievements",
  STREAKS: "streaks",
  NOTIFICATIONS: "notifications",
  AI_CONVERSATIONS: "ai_conversations",
  MESSAGES: "messages",
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
