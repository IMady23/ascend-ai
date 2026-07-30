import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export type NotificationPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW' | 'SILENT';

export type CommunicationType = 'NOTIFICATION' | 'MORNING_BRIEFING' | 'EVENING_BRIEFING' | 'WEEKLY_REVIEW' | 'AI_INSIGHT' | 'ACHIEVEMENT';

export interface ActionTarget {
  label: string;
  route: string;
}

export interface CommunicationItem {
  id: string;
  userId: string;
  type: CommunicationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  icon?: string;
  isRead: boolean;
  timestamp: Timestamp;
  action?: ActionTarget;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  workoutReminders: boolean;
  mealReminders: boolean;
  waterReminders: boolean;
  achievementAlerts: boolean;
  dailyBriefing: boolean;
  weeklyReport: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "07:00"
    timezone: string;
  };
}

export const communicationItemConverter: FirestoreDataConverter<CommunicationItem> = {
  toFirestore(item: CommunicationItem): DocumentData {
    return { ...item };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): CommunicationItem {
    const data = snapshot.data(options);
    return data as CommunicationItem;
  }
};
