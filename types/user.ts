import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface UserProfile {
  age?: number;
  height?: number; // cm
  weight?: number; // kg
  gender?: string;
}

export interface UserGoals {
  targetWeight?: number;
  weeklyWorkouts?: number;
}

export interface UserStats {
  totalWorkouts: number;
  totalChaptersCompleted: number;
  currentStreak: number;
}

export interface User {
  id: string; // The uid
  email: string;
  displayName: string | null;
  photoURL: string | null;
  profile: UserProfile;
  goals: UserGoals;
  currentChapterId: string | null;
  currentStats: UserStats;
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
