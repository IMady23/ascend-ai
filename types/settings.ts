import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface NotificationSettings {
  dailyReminders: boolean;
  achievements: boolean;
  aiMessages: boolean;
}

export interface AiPreferences {
  tone: "encouraging" | "strict" | "analytical" | "friendly";
  verbosity: "concise" | "detailed";
}

export interface Settings {
  id: string; // typically "default"
  theme: "light" | "dark" | "system";
  notifications: NotificationSettings;
  aiPreferences: AiPreferences;
  updatedAt: Timestamp;
}

export const settingsConverter: FirestoreDataConverter<Settings> = {
  toFirestore(settings: Settings): DocumentData {
    return { ...settings };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Settings {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as Settings;
  }
};
