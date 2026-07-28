import { QuickPrompt, WeeklySummaryStats } from "./types";

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: "qp-1",
    text: "How am I doing today?",
    iconName: "Activity",
  },
  {
    id: "qp-2",
    text: "What should I improve?",
    iconName: "TrendingUp",
  },
  {
    id: "qp-3",
    text: "Analyze my workout.",
    iconName: "Dumbbell",
  },
  {
    id: "qp-4",
    text: "Review my nutrition.",
    iconName: "Utensils",
  },
  {
    id: "qp-5",
    text: "Plan tomorrow.",
    iconName: "Calendar",
  }
];

export const MOCK_WEEKLY_SUMMARY: WeeklySummaryStats = {
  workoutConsistency: 85,
  nutritionConsistency: 92,
  waterIntake: 78,
  overallScore: 88,
};

export const MOCK_CHAT_MESSAGES = [
  {
    id: "msg-1",
    role: "assistant",
    content: "Welcome back. I've analyzed your recent logs. Your nutrition is dialed in, but your water intake is slightly below target. How can I help you today?",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "msg-2",
    role: "user",
    content: "Review my workout.",
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: "msg-3",
    role: "assistant",
    content: "Your latest Upper Body session showed great progressive overload on the bench press (+5kg). Keep this up, but remember to prioritize your shoulder mobility work to prevent injury.",
    timestamp: new Date(Date.now() - 1750000),
  }
];
