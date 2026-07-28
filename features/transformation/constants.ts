import { Milestone } from "./types";

export const MOCK_MILESTONES: Milestone[] = [
  {
    id: "m1",
    title: "Foundation Established",
    description: "Complete your first 7 days of consistent logging.",
    progress: 100,
    status: "completed",
  },
  {
    id: "m2",
    title: "Habit Builder",
    description: "Maintain a 21-day streak.",
    progress: 60,
    status: "active",
  },
  {
    id: "m3",
    title: "Ascension Phase I",
    description: "Complete the first transformation chapter.",
    progress: 0,
    status: "locked",
  }
];

export const MOCK_ACHIEVEMENTS = [
  {
    id: "a1",
    title: "First Step",
    description: "Logged your first activity.",
    type: "badge",
    unlockedAt: new Date(),
    metadata: {},
  },
  {
    id: "a2",
    title: "Iron Will",
    description: "Completed 10 workouts.",
    type: "badge",
    unlockedAt: new Date(),
    metadata: {},
  }
];
