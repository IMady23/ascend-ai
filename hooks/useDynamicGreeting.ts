import { useMemo } from "react";

export function useDynamicGreeting({
  userName,
  allGoalsMet,
  dailyScore,
  currentStreak,
}: {
  userName: string;
  allGoalsMet: boolean;
  dailyScore: number;
  currentStreak: number;
}) {
  return useMemo(() => {
    const hour = new Date().getHours();
    
    let timeOfDay = "Morning";
    if (hour >= 12 && hour < 17) timeOfDay = "Afternoon";
    else if (hour >= 17) timeOfDay = "Evening";

    let subtitle = "Welcome back! Ready to crush today's goals?";
    
    if (allGoalsMet) {
      subtitle = "Incredible work today. All daily missions accomplished!";
    } else if (dailyScore > 75) {
      subtitle = "You're almost there! Let's finish strong.";
    } else if (currentStreak > 3) {
      subtitle = `You're on a ${currentStreak}-day streak! Keep the momentum going.`;
    } else if (hour >= 17 && dailyScore < 30) {
      subtitle = "Still time to make today count. What's your next move?";
    } else if (hour < 12) {
      subtitle = "Rise and grind. Let's set the tone for the day.";
    }

    return {
      title: `Good ${timeOfDay}, ${userName}`,
      subtitle,
    };
  }, [userName, allGoalsMet, dailyScore, currentStreak]);
}
