import { doc, getDoc, setDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { handleFirestoreError } from "./error-handler";

export interface UserReport {
  id: string; // e.g. "daily-2023-10-15"
  userId: string;
  type: 'daily' | 'weekly' | 'monthly';
  period: string; // date string or week string
  generatedAt: any; // Timestamp
  analytics: any; // e.g. avg calories, total workouts, etc
  gamification: any; // e.g. total xp earned, level ups, achievements unlocked
  read: boolean;
}

const COLLECTION_USERS = "users";
const COLLECTION_REPORTS = "reports";

export const ReportsRepository = {
  async saveReport(userId: string, report: UserReport): Promise<void> {
    try {
      const docRef = doc(firestore, COLLECTION_USERS, userId, COLLECTION_REPORTS, report.id);
      await setDoc(docRef, report);
    } catch (error) {
      handleFirestoreError(error, `saving report ${report.id} for user ${userId}`);
    }
  },

  async getReports(userId: string): Promise<UserReport[]> {
    try {
      const q = query(collection(firestore, COLLECTION_USERS, userId, COLLECTION_REPORTS), orderBy("generatedAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as UserReport);
    } catch (error) {
      handleFirestoreError(error, `fetching reports for user ${userId}`);
      return [];
    }
  }
};
