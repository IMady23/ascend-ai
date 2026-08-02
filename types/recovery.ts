import { Timestamp } from "firebase/firestore";

export type RecoveryState = 'Excellent' | 'Good' | 'Moderate' | 'Fatigued' | 'Overtrained';

export interface TrainingLoad {
  acuteLoad: number; // short term (e.g. 7 days)
  chronicLoad: number; // long term (e.g. 28 days)
  workloadRatio: number; // acute / chronic ratio
}

export interface RecoveryRecommendation {
  title: string;
  description: string;
  reason: string[];
  confidence: 'High' | 'Medium' | 'Low';
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
}

export interface RecoveryProfile {
  id: string;
  userId: string;
  score: number; // 0-100
  confidence: number; // 0-100
  state: RecoveryState;
  fatigueLevel: number; // 0-100
  readiness: number; // 0-100
  trainingLoad: TrainingLoad;
  trend: 'Improving' | 'Stable' | 'Declining';
  recommendations: RecoveryRecommendation[];
  timestamp: Timestamp;
}

export type RecoveryActivityType = 'sleep' | 'meditation' | 'active_recovery' | 'rest';

export interface RecoverySession {
  id: string;
  userId: string;
  type: RecoveryActivityType;
  durationMinutes: number;
  feelingBefore: number; // 1-10
  feelingAfter: number;  // 1-10
  notes?: string;
  date: string;          // YYYY-MM-DD
  timestamp: Timestamp;
}
