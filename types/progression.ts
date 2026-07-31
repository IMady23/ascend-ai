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
  type: 'walking' | 'running' | 'jogging' | 'cycling' | 'dance' | 'trekking' | 'daily' | 'weekly';
  status: 'idle' | 'started' | 'paused' | 'resumed' | 'completed' | 'archived';
  xpReward: number;
  progress: number;
  target: number;
  distanceMeter?: number;
  durationSeconds?: number;
  caloriesBurned?: number;
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
  sourceEvent?: string;
  rewardXP?: number;
}

export interface LifetimeStatistics {
  totalWorkouts: number;
  totalDistanceMeters: number;
  totalCaloriesBurned: number;
  totalDurationSeconds: number;
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
  lifetimeStats?: LifetimeStatistics;
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
