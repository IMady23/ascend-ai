import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface AICoachingCache {
  date: string; // YYYY-MM-DD
  morningMotivation?: string;
  eveningReflection?: string;
}

export class AICoachingEngine {
  static async getMorningMotivation(userId: string, currentDateStr: string): Promise<string | null> {
    const docRef = doc(db, "users", userId, "ai", "coaching_cache");
    const snap = await getDoc(docRef);
    
    if (snap.exists()) {
      const data = snap.data() as AICoachingCache;
      if (data.date === currentDateStr && data.morningMotivation) {
        return data.morningMotivation;
      }
    }

    // Call actual AI service to generate it
    // For now, return a placeholder so the UI engineer can build it.
    const mockMotivation = "Good morning! Let's crush those goals today.";
    
    // Save to cache
    await setDoc(docRef, { 
      date: currentDateStr, 
      morningMotivation: mockMotivation 
    }, { merge: true });

    return mockMotivation;
  }

  static async getEveningReflection(userId: string, currentDateStr: string): Promise<string | null> {
    const docRef = doc(db, "users", userId, "ai", "coaching_cache");
    const snap = await getDoc(docRef);
    
    if (snap.exists()) {
      const data = snap.data() as AICoachingCache;
      if (data.date === currentDateStr && data.eveningReflection) {
        return data.eveningReflection;
      }
    }

    // Call actual AI service to generate it
    const mockReflection = "Great job today! You hit 2 out of 3 targets.";
    
    // Save to cache
    await setDoc(docRef, { 
      date: currentDateStr, 
      eveningReflection: mockReflection 
    }, { merge: true });

    return mockReflection;
  }
}
