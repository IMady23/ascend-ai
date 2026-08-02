import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, query, orderBy, limit, getDoc } from "firebase/firestore";
import { RecoveryProfile, RecoverySession } from "@/types/recovery";

export class RecoveryRepository {
  
  static async saveRecoveryProfile(userId: string, profile: RecoveryProfile): Promise<void> {
    const docRef = doc(db, "users", userId, "recovery", profile.id);
    await setDoc(docRef, profile);
  }

  static async getLatestRecoveryProfile(userId: string): Promise<RecoveryProfile | null> {
    const collRef = collection(db, "users", userId, "recovery");
    const q = query(collRef, orderBy("timestamp", "desc"), limit(1));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs[0].data() as RecoveryProfile;
    }
    return null;
  }

  static async getRecoveryHistory(userId: string, days: number = 7): Promise<RecoveryProfile[]> {
    const collRef = collection(db, "users", userId, "recovery");
    const q = query(collRef, orderBy("timestamp", "desc"), limit(days));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as RecoveryProfile);
  }

  // ─── Recovery Sessions (user-logged activities) ───────────────────────────

  static async saveRecoverySession(userId: string, session: RecoverySession): Promise<void> {
    const docRef = doc(db, "users", userId, "recovery_sessions", session.id);
    await setDoc(docRef, session);
  }

  static async getRecoverySessions(userId: string, limitCount: number = 20): Promise<RecoverySession[]> {
    const collRef = collection(db, "users", userId, "recovery_sessions");
    const q = query(collRef, orderBy("timestamp", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as RecoverySession);
  }
}
