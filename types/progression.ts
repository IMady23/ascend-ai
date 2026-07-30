import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface XP {
  total: number;
  currentLevel: number;
  xpToNextLevel: number;
  xpForCurrentLevel: number;
}

export interface Streak {
  current: number;
  longest: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface Mission {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  status: 'active' | 'completed' | 'failed';
  xpReward: number;
  progress: number;
  target: number;
  createdAt: Timestamp;
  expiresAt: Timestamp;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Timestamp | null;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
}

export interface TimelineEvent {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: string;
  xpEarned: number;
  icon: string;
  timestamp: Timestamp;
  coachCommentary?: string;
}

export interface ProgressionProfile {
  id: string;
  userId: string;
  xp: XP;
  streak: Streak;
  achievements: Achievement[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const progressionProfileConverter: FirestoreDataConverter<ProgressionProfile> = {
  toFirestore(profile: ProgressionProfile): DocumentData {
    return { ...profile };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): ProgressionProfile {
    const data = snapshot.data(options);
    return data as ProgressionProfile;
  }
};

export const timelineEventConverter: FirestoreDataConverter<TimelineEvent> = {
  toFirestore(event: TimelineEvent): DocumentData {
    return { ...event };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): TimelineEvent {
    const data = snapshot.data(options);
    return data as TimelineEvent;
  }
};
