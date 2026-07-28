import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { User, userConverter } from "@/types/user";
import { handleFirestoreError } from "./error-handler";

const COLLECTION_USERS = "users";

export const UserRepository = {
  /**
   * Fetches a user by their ID.
   */
  async getUser(userId: string): Promise<User | null> {
    try {
      const docRef = doc(firestore, COLLECTION_USERS, userId).withConverter(userConverter);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
      handleFirestoreError(error, `fetching user ${userId}`);
    }
  },

  /**
   * Subscribes to user document changes.
   */
  subscribeToUser(userId: string, onUpdate: (user: User | null) => void, onError: (error: Error) => void): () => void {
    const docRef = doc(firestore, COLLECTION_USERS, userId).withConverter(userConverter);
    return onSnapshot(
      docRef,
      (snapshot) => {
        onUpdate(snapshot.exists() ? snapshot.data() : null);
      },
      (error) => {
        onError(error);
      }
    );
  },

  /**
   * Creates a new user document.
   */
  async createUser(user: User): Promise<void> {
    try {
      const docRef = doc(firestore, COLLECTION_USERS, user.id).withConverter(userConverter);
      await setDoc(docRef, user);
    } catch (error) {
      handleFirestoreError(error, `creating user ${user.id}`);
    }
  },

  /**
   * Updates an existing user document.
   */
  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    try {
      const docRef = doc(firestore, COLLECTION_USERS, userId).withConverter(userConverter);
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, `updating user ${userId}`);
    }
  },
};
