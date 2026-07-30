import { signUpWithEmail, signInWithEmail, signOutUser, resetPassword, subscribeToAuthChanges } from "../firebase/auth.service";
import { firestore } from "../firebase/firestore.service";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import type { UserProfile } from "@/types/user";

export class AuthRepository {
  static async signUp(email: string, password: string) {
    // 1. Create Firebase Auth User
    const user = await signUpWithEmail(email, password);
    
    // 2. Default Empty Profile (Onboarding required)
    const profile: UserProfile = {
      version: 1,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
