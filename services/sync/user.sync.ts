import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/firestore.service";
import { useUserStore } from "@/stores/user.store";
import type { User } from "@/types/user";

export class UserSync {
  private static unsubscribe: (() => void) | null = null;
  private static currentUserUid: string | null = null;

  static start(uid: string) {
    if (this.currentUserUid === uid && this.unsubscribe) return;
    this.disposeListener();
    this.currentUserUid = uid;

    const userRef = doc(firestore, "users", uid);
    this.unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        useUserStore.getState().setProfile(data.profile);
      }
    });
  }

  /** Tear down the Firestore listener without clearing user state. */
  private static disposeListener() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  /** Full teardown on logout — clears listener and profile. */
  static stopForLogout() {
    this.disposeListener();
    this.currentUserUid = null;
    useUserStore.getState().setProfile(null);
  }

  static async syncLocalChanges(uid: string) {
    const { profile } = useUserStore.getState();
    const userRef = doc(firestore, "users", uid);
    
    // Only update specific fields to avoid overwriting backend-driven data
    await setDoc(userRef, { profile }, { merge: true });
  }
}
