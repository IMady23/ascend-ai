import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export type EventType = 
  | 'WORKOUT_COMPLETED'
  | 'MEAL_LOGGED'
  | 'WATER_LOGGED'
  | 'LEVEL_UP'
  | 'STREAK_ACHIEVED'
  | 'STREAK_LOST'
  | 'MISSION_COMPLETED'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'PR_BROKEN'
  | 'WEIGHT_LOGGED'
  | 'RECOVERY_CRITICAL'
  | 'SYNC_FAILED'
  | 'PLATEAU_DETECTED'
  | 'WORKOUT_MISSED'
  | 'PROTEIN_LOW';

export interface BaseEvent {
  id: string;
  userId: string;
  type: EventType;
  timestamp: Timestamp;
  metadata: Record<string, any>;
  processed: boolean;
}

export interface WorkoutCompletedEvent extends BaseEvent {
  type: 'WORKOUT_COMPLETED';
  metadata: {
    workoutId: string;
    durationMinutes: number;
    totalVolume: number;
    prCount?: number;
  };
}

export interface MealLoggedEvent extends BaseEvent {
  type: 'MEAL_LOGGED';
  metadata: {
    mealId: string;
    calories: number;
    protein: number;
    isGoalMet?: boolean;
  };
}

export interface WaterLoggedEvent extends BaseEvent {
  type: 'WATER_LOGGED';
  metadata: {
    amountMl: number;
    totalDailyMl: number;
    isGoalMet?: boolean;
  };
}

export type AscendEvent = WorkoutCompletedEvent | MealLoggedEvent | WaterLoggedEvent | BaseEvent;
