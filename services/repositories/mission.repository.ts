import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { handleFirestoreError } from "./error-handler";

export interface Mission {
  id: string;
  title: string;
  completed: boolean;
}

export const MissionRepository = {
  getCollectionRef(userId: string) {
    return collection(firestore, `users/${userId}/missions`);
  },

  async getMissions(userId: string): Promise<Mission[]> {
    try {
      const q = query(this.getCollectionRef(userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          completed: data.completed,
        } as Mission;
      });
    } catch (error) {
      handleFirestoreError(error, `fetching missions for user ${userId}`);
    }
  },

  subscribeToMissions(userId: string, onUpdate: (missions: Mission[]) => void, onError: (error: Error) => void): () => void {
    const q = query(this.getCollectionRef(userId));
    return onSnapshot(
      q,
      (snapshot) => {
        onUpdate(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title,
              completed: data.completed,
            } as Mission;
          })
        );
      },
      (error) => {
        onError(error);
      }
    );
  },

  async createMission(userId: string, mission: Mission): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), mission.id);
      await setDoc(docRef, { title: mission.title, completed: mission.completed });
    } catch (error) {
      handleFirestoreError(error, `creating mission ${mission.id} for user ${userId}`);
    }
  },

  async updateMission(userId: string, missionId: string, data: Partial<Mission>): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), missionId);
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, `updating mission ${missionId} for user ${userId}`);
    }
  },

  async deleteMission(userId: string, missionId: string): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), missionId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, `deleting mission ${missionId} for user ${userId}`);
    }
  },
};
