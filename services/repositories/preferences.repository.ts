import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserPreferences } from "@/types/automation";

export class PreferencesRepository {
  static async getPreferences(userId: string): Promise<UserPreferences> {
    const docRef = doc(db, "users", userId, "settings", "preferences");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as UserPreferences;
    }
    // Default preferences
    return {
      userId,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      notifications: {
        workoutReminder: true,
        mealReminder: true,
        waterReminder: true,
        achievementNotifications: true,
        weeklyReport: true,
        monthlyReport: true,
        pushEnabled: false,
        emailEnabled: false,
        quietHours: {
          start: '22:00',
          end: '07:00'
        }
      }
    };
  }

  static async savePreferences(userId: string, preferences: UserPreferences): Promise<void> {
    const docRef = doc(db, "users", userId, "settings", "preferences");
    await setDoc(docRef, preferences, { merge: true });
  }

  static async updatePreferences(userId: string, updates: Partial<UserPreferences>): Promise<void> {
    const docRef = doc(db, "users", userId, "settings", "preferences");
    await updateDoc(docRef, updates);
  }
}
