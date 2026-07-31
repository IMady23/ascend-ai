import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, query, orderBy, limit, QueryDocumentSnapshot, DocumentData, getDoc, updateDoc } from "firebase/firestore";
import { AggregatedStats, Insight, AggregationPeriod } from "@/types/intelligence";

export class InsightRepository {
  
  static async saveInsight(userId: string, insight: Insight): Promise<void> {
    const docRef = doc(db, "users", userId, "insights", insight.id);
    await setDoc(docRef, insight);
  }

  static async getLatestInsights(userId: string, count: number = 10): Promise<Insight[]> {
    const collRef = collection(db, "users", userId, "insights");
    const q = query(collRef, orderBy("timestamp", "desc"), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Insight);
  }

  static async getStats(userId: string, period: AggregationPeriod, periodId: string): Promise<AggregatedStats | null> {
    const docRef = doc(db, "users", userId, `analytics_${period}`, periodId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as AggregatedStats;
    }
    return null;
  }

  static async saveStats(userId: string, stats: AggregatedStats): Promise<void> {
    const docRef = doc(db, "users", userId, `analytics_${stats.period}`, stats.id);
    await setDoc(docRef, stats);
  }

  static async updateStats(userId: string, period: AggregationPeriod, periodId: string, updates: Partial<AggregatedStats>): Promise<void> {
    const docRef = doc(db, "users", userId, `analytics_${period}`, periodId);
    await updateDoc(docRef, updates);
  }
}
