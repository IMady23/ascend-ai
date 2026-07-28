import { Chapter } from "@/types/chapter";
import { Achievement } from "@/types/achievement";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  progress: number; // 0 to 100
  status: "locked" | "active" | "completed";
}

export interface TransformationStats {
  chaptersCompleted: number;
  currentStreak: number;
  totalMissions: number;
  totalScore: number;
}
