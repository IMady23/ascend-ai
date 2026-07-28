import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Activity, activityConverter } from "@/types/activity";
import { handleFirestoreError } from "./error-handler";

export const ActivityRepository = {
  getCollectionRef(userId: string) {
    return collection(firestore, `users/${userId}/activities`).withConverter(activityConverter);
  },

  async getActivities(userId: string): Promise<Activity[]> {
    try {
      const q = query(this.getCollectionRef(userId), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      handleFirestoreError(error, `fetching activities for user ${userId}`);
    }
  },

  subscribeToActivities(userId: string, onUpdate: (activities: Activity[]) => void, onError: (error: Error) => void): () => void {
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

  async createActivity(userId: string, activity: Activity): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), activity.id);
      await setDoc(docRef, activity);
    } catch (error) {
      handleFirestoreError(error, `creating activity ${activity.id} for user ${userId}`);
    }
  },

  async updateActivity(userId: string, activityId: string, data: Partial<Activity>): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), activityId);
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, `updating activity ${activityId} for user ${userId}`);
    }
  },

  async deleteActivity(userId: string, activityId: string): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), activityId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, `deleting activity ${activityId} for user ${userId}`);
    }
  },
};
