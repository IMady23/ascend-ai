import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ProgressionProfile, progressionProfileConverter } from "@/types/progression";

export class ProgressionRepository {
  static async getProfile(userId: string): Promise<ProgressionProfile | null> {
    const docRef = doc(db, "users", userId, "progression", "profile").withConverter(progressionProfileConverter);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  static async setProfile(userId: string, profile: ProgressionProfile): Promise<void> {
    const docRef = doc(db, "users", userId, "progression", "profile").withConverter(progressionProfileConverter);
    await setDoc(docRef, profile, { merge: true });
  }

  static async updateProfile(userId: string, updates: Partial<ProgressionProfile>): Promise<void> {
    const docRef = doc(db, "users", userId, "progression", "profile");
    await updateDoc(docRef, updates);
  }

  static async getMissions(userId: string): Promise<any[]> {
    // Basic array storage in a 'missions' document
    const docRef = doc(db, "users", userId, "progression", "missions");
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data().list || []) : [];
  }

  static async saveMissions(userId: string, missions: any[]): Promise<void> {
    const docRef = doc(db, "users", userId, "progression", "missions");
    await setDoc(docRef, { list: missions }, { merge: true });
  }
}
