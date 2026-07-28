export interface HeaderData {
  greeting: string;
  dayNumber: number;
  currentWeight: number; // kg
  currentChapterTitle: string;
  currentChapterNumber: number;
}

export interface ProgressData {
  percentageComplete: number;
  missionsCompleted: number;
  totalMissions: number;
}

export interface Mission {
  id: string;
  title: string;
  completed: boolean;
}

export interface AiCoachData {
  message: string;
}

export interface HealthMetrics {
  weight: number;
  calories: number;
  protein: number; // grams
  water: number; // liters
  steps: number;
}

export interface ChapterProgress {
  title: string;
  percentageComplete: number;
  estimatedDaysRemaining: number;
}

export interface MissionControlData {
  header: HeaderData;
  progress: ProgressData;
  missions: Mission[];
  aiCoach: AiCoachData;
  health: HealthMetrics;
  chapter: ChapterProgress;
}
