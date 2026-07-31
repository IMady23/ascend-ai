import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";
import { NotificationPreferences } from "./communication";

export type PrimaryGoal = 'lose_fat' | 'gain_muscle' | 'maintain' | 'recomp';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
export type DietType = 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian';

export interface UserIdentity {
  fullName: string;
  nickname: string;
  dob: string;
  height: number; // cm
  weight: number; // kg
}

export interface UserPreferences {
  activity: ActivityLevel;
  wakeTime: string;
  sleepTime: string;
  stepGoal: number;
  waterGoal: number;
  workoutDays: number;
  dietType: DietType;
  allergies: string[];
}

export interface UserTargets {
  tdee: number;
  bmr: number;
  bmi: number;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export interface UserProfile {
  version: 1;
  onboardingCompleted: boolean;
  timezone?: string; // IANA Timezone string
  identity?: UserIdentity;
  goals?: { primaryGoal: PrimaryGoal };
  preferences?: UserPreferences;
  communication?: NotificationPreferences;
  targets?: UserTargets;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string; // The uid
  email: string;
  profile: UserProfile;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): DocumentData {
    return { ...user };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options);
    return data as User;
  }
};
