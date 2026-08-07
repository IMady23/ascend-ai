import { signUpWithEmail, signInWithEmail, signOutUser, resetPassword, subscribeToAuthChanges } from "../firebase/auth.service";
import { firestore } from "../firebase/firestore.service";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import type { UserProfile, UserProfileV2 } from "@/types/user";

export class AuthRepository {
  static async signUp(email: string, password: string) {
    // 1. Create Firebase Auth User
    const user = await signUpWithEmail(email, password);

    // 2. Default Empty Profile v2 (Onboarding required)
    // All identity/preference fields are undefined until onboarding completes.
    const now = new Date().toISOString();
    const profile: UserProfileV2 = {
      version: 2,
      onboardingCompleted: false,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      createdAt: now,
      updatedAt: now,
    };

    // 3. Create Firestore Document
    const userRef = doc(firestore, "users", user.uid);
    await setDoc(userRef, {
      profile,
      email: user.email,
      _serverCreatedAt: serverTimestamp()
    });

    return { user, profile };
  }

  static async signIn(email: string, password: string) {
    const user = await signInWithEmail(email, password);
    return user;
  }

  static async signOut() {
    await signOutUser();
  }

  static async resetPassword(email: string) {
    await resetPassword(email);
  }

  static onAuthStateChanged(callback: (user: any) => void) {
    return subscribeToAuthChanges(callback);
  }
  
  static async fetchUserData(uid: string) {
    const userRef = doc(firestore, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as { profile: UserProfile };
    }
    return null;
  }
}
