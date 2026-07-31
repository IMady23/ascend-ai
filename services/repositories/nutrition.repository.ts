import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { NutritionLog, HydrationLog, MealPlan, nutritionLogConverter, hydrationLogConverter, mealPlanConverter } from "@/types/nutrition";
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

  subscribeToNutritionLogs(userId: string, currentDate: string, onUpdate: (logs: NutritionLog[]) => void, onError: (error: Error) => void): () => void {
    const q = query(
      this.getCollectionRef(userId), 
      where("date", "==", currentDate)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const logs = snapshot.docs.map((doc) => doc.data());
        // Sort descending by createdAt since we removed orderBy
        logs.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });
        onUpdate(logs);
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

  // Hydration
  getHydrationCollectionRef(userId: string) {
    return collection(firestore, `users/${userId}/hydration_logs`).withConverter(hydrationLogConverter);
  },

  async logWater(userId: string, log: HydrationLog): Promise<void> {
    try {
      const docRef = doc(this.getHydrationCollectionRef(userId), log.id);
      await setDoc(docRef, log);
    } catch (error) {
      handleFirestoreError(error, `creating hydration log ${log.id} for user ${userId}`);
    }
  },

  async getHydrationLogs(userId: string): Promise<HydrationLog[]> {
    try {
      const q = query(this.getHydrationCollectionRef(userId), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      handleFirestoreError(error, `fetching hydration logs for user ${userId}`);
      return [];
    }
  },

  subscribeToHydrationLogs(userId: string, currentDate: string, onUpdate: (logs: HydrationLog[]) => void, onError: (error: Error) => void): () => void {
    const q = query(
      this.getHydrationCollectionRef(userId), 
      where("date", "==", currentDate)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const logs = snapshot.docs.map((doc) => doc.data());
        // Sort descending by timestamp since we removed orderBy
        logs.sort((a, b) => {
          const aTime = a.timestamp?.seconds || 0;
          const bTime = b.timestamp?.seconds || 0;
          return bTime - aTime;
        });
        onUpdate(logs);
      },
      (error) => onError(error)
    );
  },

  // Meal Plans
  getMealPlanCollectionRef(userId: string) {
    return collection(firestore, `users/${userId}/meal_plans`).withConverter(mealPlanConverter);
  },

  async getMealPlans(userId: string): Promise<MealPlan[]> {
    try {
      const q = query(this.getMealPlanCollectionRef(userId), orderBy("updatedAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      handleFirestoreError(error, `fetching meal plans for user ${userId}`);
      return [];
    }
  },

  subscribeToMealPlans(userId: string, onUpdate: (plans: MealPlan[]) => void, onError: (error: Error) => void): () => void {
    const q = query(this.getMealPlanCollectionRef(userId), orderBy("updatedAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        onUpdate(snapshot.docs.map((doc) => doc.data()));
      },
      (error) => onError(error)
    );
  },

  async saveMealPlan(userId: string, plan: MealPlan): Promise<void> {
    try {
      const docRef = doc(this.getMealPlanCollectionRef(userId), plan.id);
      await setDoc(docRef, plan);
    } catch (error) {
      handleFirestoreError(error, `saving meal plan ${plan.id} for user ${userId}`);
    }
  },

  async updateMealPlan(userId: string, planId: string, data: Partial<MealPlan>): Promise<void> {
    try {
      const docRef = doc(this.getMealPlanCollectionRef(userId), planId);
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, `updating meal plan ${planId} for user ${userId}`);
    }
  }
};
