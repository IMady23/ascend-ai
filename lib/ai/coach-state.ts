export type CoachConfidenceLevel = "High" | "Medium" | "Low";

export interface CoachState {
  greeting: string;
  subtitle: string;
  prompt: string;
  confidence: CoachConfidenceLevel;
  insight: {
    title: string;
    body: string;
    actions: Array<{ label: string; hint: string }>;
  };
  timelineItems: Array<{ title: string; detail: string }>;
}

export function determineConfidenceLevel(input: {
  workoutCount: number;
  mealCount: number;
  hasActiveMealPlan: boolean;
}): CoachConfidenceLevel {
  const hasHistory = input.workoutCount + input.mealCount >= 8;
  if (hasHistory || input.hasActiveMealPlan) {
    return "High";
  }

  if (input.workoutCount >= 2 || input.mealCount >= 3) {
    return "Medium";
  }

  return "Low";
}

export function buildCoachState(input: {
  profile?: any; // Accepting UserProfile loosely to avoid strict dependency loop if not needed
  workoutCount: number;
  mealCount: number;
  hasActiveMealPlan: boolean;
  completedWorkoutToday: boolean;
}): CoachState {
  const userName = input.profile?.identity?.nickname || input.profile?.identity?.fullName?.split(" ")[0] || "there";
  const confidence = determineConfidenceLevel({
    workoutCount: input.workoutCount,
    mealCount: input.mealCount,
    hasActiveMealPlan: input.hasActiveMealPlan,
  });

  if (input.completedWorkoutToday) {
    return {
      greeting: `Nice work today 💪`,
      subtitle: `You crushed it, ${userName}. Let's talk about how you're feeling and what comes next.`,
      prompt: "How's your energy right now?",
      confidence,
      insight: {
        title: "What's Next",
        body: "Recovery matters as much as the workout. Let's make sure you're set up for tomorrow.",
        actions: [
          { label: "Tell me how you feel", hint: "Energy, soreness, fatigue" },
          { label: "Log recovery notes", hint: "Sleep, mood, readiness" },
        ],
      },
      timelineItems: [],
    };
  }

  if (input.workoutCount === 0 && input.mealCount === 0) {
    return {
      greeting: `Hey, ${userName} 👋`,
      subtitle: "Let's start building your routine. Pick one thing today.",
      prompt: "What sounds good to you?",
      confidence: "Low",
      insight: {
        title: "First Steps",
        body: "One workout or one logged meal is enough. I'll learn from there.",
        actions: [
          { label: "Start a workout", hint: "Pick an exercise" },
          { label: "Log what you ate", hint: "Breakfast, lunch, snack..." },
          { label: "Build a simple plan", hint: "Meals or training week" },
        ],
      },
      timelineItems: [],
    };
  }

  return {
    greeting: `Welcome back, ${userName}`,
    subtitle: "I'm tracking your data so I can give you better guidance.",
    prompt: "What's on your mind today?",
    confidence,
    insight: {
      title: "Quick Actions",
      body: "Whatever matters most to you right now.",
      actions: [
        { label: "Start a workout", hint: "Training" },
        { label: "Log a meal", hint: "Nutrition" },
        { label: "Ask me anything", hint: "Fitness questions" },
      ],
    },
    timelineItems: [],
  };
}

export function buildFallbackCoachResponse(
  contextSnapshot: any,
  userMessage: string
): { summary: string; followUpQuestion: string; confidence: number } {
  const userName = contextSnapshot.profile?.identity?.nickname || contextSnapshot.profile?.identity?.fullName?.split(" ")[0] || "there";
  const hasWorkouts = (contextSnapshot.training?.totalWorkouts || 0) > 0;
  const hasMeals = (contextSnapshot.nutrition?.caloriesConsumed || 0) > 0;

  let summary = "";
  if (!hasWorkouts && !hasMeals) {
    summary = `Hey ${userName}, I think you're asking the right questions. Let's start simple—what matters most to you right now? A solid workout, tracking your meals, or building a plan? Once you log a few things, I'll have real data to work with and can give you more personalized guidance. For now, I'm here to help you pick the first step.`;
  } else if (userMessage?.toLowerCase().includes("energy") || userMessage?.toLowerCase().includes("tired")) {
    summary = `I hear you, ${userName}. Energy and recovery are huge. The best thing you can do right now is listen to your body—if you're running on empty, it's worth adjusting today's plan. Maybe a lighter workout, making sure you're eating enough, and getting solid sleep tonight. This stuff compounds, and even small wins matter. What would feel doable for you today?`;
  } else {
    summary = `${userName}, based on what you've been doing, I'd focus on whatever's been working. You've got ${contextSnapshot.training?.totalWorkouts || 0} workouts and some nutrition data building up, so I'm getting a clearer picture. Let's keep the momentum going—what's next for you?`;
  }

  const followUpQuestion = userMessage?.toLowerCase().includes("energy")
    ? "Would a lighter recovery session or just focusing on nutrition and sleep feel better today?"
    : "What's your priority right now—training, nutrition, or just checking in?";

  return {
    summary,
    followUpQuestion,
    confidence: 0.7,
  };
}
