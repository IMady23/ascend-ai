import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { DailyLog, dailyLogConverter } from "@/types/daily-log";
import { handleFirestoreError } from "./error-handler";

const COLLECTION_USERS = "users";
const COLLECTION_DAILY_LOGS = "daily_logs";

export const DailyLogRepository = {
  getCollectionRef(userId: string) {
    return doc(firestore, COLLECTION_USERS, userId);
  },

  async getDailyLog(userId: string, dateStr: string): Promise<DailyLog | null> {
    try {
      const docRef = doc(firestore, COLLECTION_USERS, userId, COLLECTION_DAILY_LOGS, dateStr).withConverter(dailyLogConverter);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
      handleFirestoreError(error, `fetching daily log ${dateStr} for user ${userId}`);
      return null;
    }
  },

  async updateDailyLog(userId: string, dateStr: string, data: Partial<DailyLog>): Promise<void> {
    try {
      const docRef = doc(firestore, COLLECTION_USERS, userId, COLLECTION_DAILY_LOGS, dateStr).withConverter(dailyLogConverter);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        await updateDoc(docRef, data);
      } else {
        const newLog: DailyLog = {
          id: dateStr,
          date: dateStr,
          mood: 3,
          energy: 3,
          sleepHours: 0,
          steps: 0,
          notes: "",
          createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
          updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
          ...data,
        };
        await setDoc(docRef, newLog);
      }
    } catch (error) {
      handleFirestoreError(error, `updating daily log ${dateStr} for user ${userId}`);
    }
  },
};
