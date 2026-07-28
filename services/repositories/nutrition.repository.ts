import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { NutritionLog, nutritionLogConverter } from "@/types/nutrition";
import { handleFirestoreError } from "./error-handler";

export const NutritionRepository = {
  getCollectionRef(userId: string) {
    return collection(firestore, `users/${userId}/nutrition_logs`).withConverter(nutritionLogConverter);
  },

  async getNutritionLogs(userId: string): Promise<NutritionLog[]> {
    try {
      const q = query(this.getCollectionRef(userId), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      handleFirestoreError(error, `fetching nutrition logs for user ${userId}`);
    }
  },

  subscribeToNutritionLogs(userId: string, onUpdate: (logs: NutritionLog[]) => void, onError: (error: Error) => void): () => void {
    const q = query(this.getCollectionRef(userId), orderBy("date", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        onUpdate(snapshot.docs.map((doc) => doc.data()));
      },
      (error) => {
        onError(error);
      }
    );
  },

  async createNutritionLog(userId: string, log: NutritionLog): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), log.id);
      await setDoc(docRef, log);
    } catch (error) {
      handleFirestoreError(error, `creating nutrition log ${log.id} for user ${userId}`);
    }
  },

  async updateNutritionLog(userId: string, logId: string, data: Partial<NutritionLog>): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), logId);
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, `updating nutrition log ${logId} for user ${userId}`);
    }
  },

  async deleteNutritionLog(userId: string, logId: string): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), logId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, `deleting nutrition log ${logId} for user ${userId}`);
    }
  },
};
