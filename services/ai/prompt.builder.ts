const GOAL_LABELS: Record<string, string> = {
  lose_fat: "lose fat",
  gain_muscle: "gain muscle",
  maintain: "maintain weight",
  recomp: "body recomposition",
};

interface CoachContextSnapshot {
  profile?: {
    nickname?: string;
    name?: string;
    primaryGoal?: string;
  };
  training?: {
    status?: string;
    totalWorkouts?: number;
    workoutState?: string;
    completedWorkoutToday?: boolean;
  };
  nutrition?: {
    status?: string;
    caloriesRemaining?: number;
    proteinRemaining?: number;
    activeMealPlanTitle?: string;
  };
  coachingScenario?: string;
  coachingMode?: string;
}

export class PromptBuilder {
  static build(contextSnapshot: any): string {
    const sanitizedContext = { ...contextSnapshot };
    const missingDataWarnings: string[] = [];
    const partialDataWarnings: string[] = [];

    if (sanitizedContext.training?.status === "missing") {
      delete sanitizedContext.training;
      missingDataWarnings.push(
        "- Training data is MISSING. Do not mention recent workouts, workout history, or readiness."
      );
    } else if (sanitizedContext.training?.status === "partial") {
      partialDataWarnings.push(
        "- Training data is PARTIAL. Express low confidence when projecting trends or readiness."
      );
    }

    if (sanitizedContext.nutrition?.status === "missing") {
      delete sanitizedContext.nutrition;
      missingDataWarnings.push(
        "- Nutrition data is MISSING. Do not mention calories, macros, or eating habits."
      );
    } else if (sanitizedContext.nutrition?.status === "partial") {
      partialDataWarnings.push(
        "- Nutrition data is PARTIAL. Do not draw strong conclusions about diet habits yet."
      );
    }

    const userName = contextSnapshot.profile?.nickname || contextSnapshot.profile?.name?.split(" ")[0] || "there";
    const goalLabel = GOAL_LABELS[contextSnapshot.profile?.primaryGoal] || "fitness";
    const scenario = contextSnapshot.coachingScenario || "returning";
    const coachingMode = contextSnapshot.coachingMode || "general";

    const scenarioGreeting = PromptBuilder.getScenarioGreeting(scenario, userName, goalLabel, contextSnapshot);
    const modeDirective = PromptBuilder.getModeDirective(coachingMode);

    return `
You are Ascend AI — a premium, long-term personal fitness coach. You are NOT ChatGPT, a search engine, or a textbook. You are a supportive mentor.
You must be friendly, motivating, calm, positive, professional, and natural. Do NOT use robotic language, system messages, or AI self-descriptions. Do NOT introduce yourself as an AI or an analyst.

# AI Truthfulness Policy (CRITICAL)
- Never infer missing fitness data. Never invent metrics.
- Never state certainty when data is unavailable.
- If data is unavailable, be honest but encouraging.

# Coaching Identity & Conversation Framework (CRITICAL)
Every response MUST follow this flow whenever appropriate:
1. Acknowledge the user's message warmly (e.g., "Hey! 👋 Glad you're back." or "Great job! 💧 I've logged your water.").
2. Use available context naturally (today's workout, recovery score, streaks).
3. Give ONE practical, actionable recommendation.
4. Explain WHY using their data (e.g., "Why? You've logged 1L so far, and staying hydrated supports recovery.").
5. End naturally without overwhelming them.

- Celebrate progress genuinely ("Nice work!", "Great consistency!").
- Do NOT provide generic educational paragraphs or Wikipedia-style answers unless explicitly asked.
- Reference the user's name (${userName}) and goal (${goalLabel}) naturally.
- Guide step-by-step: always explain WHY, based ONLY on their real data.
- Always end with exactly ONE follow-up question in "followUpQuestion".
- Write 3-5 sentences in "summary" that flow conversationally, like texting a friend.

# Scenario Context
${scenarioGreeting}

# Focus Mode
${modeDirective}

# Context Validation Restrictions
${missingDataWarnings.length > 0 ? missingDataWarnings.join("\n") : "- All core data is available."}
${partialDataWarnings.length > 0 ? partialDataWarnings.join("\n") : ""}

# Current User Context (Strictly Verified)
${JSON.stringify(sanitizedContext, null, 2)}

# Response Format
Respond STRICTLY with a JSON object. Do NOT include markdown blocks or extra text.
Write naturally and conversationally. Do NOT use formal bullet points in the summary.

{
  "summary": "Natural, flowing conversational response following the Acknowledge -> Context -> Recommendation -> Explain framework. End naturally.",
  "followUpQuestion": "One natural follow-up question.",
  "confidence": 0.95,
  "recommendations": ["Optional: only if explicitly asked for suggestions or steps."],
  "warnings": ["Optional: only if there's a real concern."]
}
`;
  }

  static buildFallbackCoachResponse(contextSnapshot: CoachContextSnapshot, userMessage: string) {
    const userName = contextSnapshot.profile?.nickname || contextSnapshot.profile?.name?.split(" ")[0] || "there";
    const goalLabel = GOAL_LABELS[contextSnapshot.profile?.primaryGoal || ""] || "your goals";
    const goalPhrase = goalLabel === "your goals" ? "your goals" : `your goal to ${goalLabel}`;
    const trainingSummary = contextSnapshot.training?.totalWorkouts
      ? `You have ${contextSnapshot.training.totalWorkouts} logged workout${contextSnapshot.training.totalWorkouts === 1 ? "" : "s"} so far.`
      : "You are still building your routine.";
    const nutritionSummary = contextSnapshot.nutrition?.caloriesRemaining !== undefined
      ? `You still have about ${Math.max(0, contextSnapshot.nutrition.caloriesRemaining)} kcal left for the day.`
      : "Nutrition data is still emerging.";

    const summary = `${userName}, I’m keeping this focused on ${goalPhrase}. ${trainingSummary} ${nutritionSummary} I’d steer your next step around what feels most sustainable today, especially if your energy or motivation is shifting.`;

    const recommendations = [
      "Pick one high-impact action for today: a short workout, a protein-forward meal, or a recovery habit.",
      userMessage?.toLowerCase().includes("energy")
        ? "Prioritize sleep, hydration, and a simple meal pattern before adding more intensity."
        : "Keep the next step specific so it feels doable and measurable.",
    ];

    const followUpQuestion = userMessage?.toLowerCase().includes("energy")
      ? "Do you want me to help you build a recovery plan for today or a training plan that fits your energy?"
      : "What feels most important for you today: training, nutrition, or recovery?";

    return {
      summary,
      recommendations,
      warnings: [],
      encouragement: `You’re building momentum toward ${goalLabel} one session at a time.`,
      followUpQuestion,
      confidence: 0.7,
    };
  }

  private static getScenarioGreeting(
    scenario: string,
    userName: string,
    goalLabel: string,
    ctx: any
  ): string {
    switch (scenario) {
      case "first_time":
        return `[FIRST TIME USER] Greet ${userName} warmly. Acknowledge their goal to ${goalLabel}. They haven't logged workouts or meals yet — offer to help them start (build a workout, log first meal, or answer a fitness question). Be welcoming and set expectations that you'll get more personalized as they log data.`;

      case "during_workout":
        return `[DURING WORKOUT] The user is actively training (state: ${ctx.training?.workoutState}). Keep responses concise and actionable. Focus on form cues, rest timing, set progression, and motivation. Do not suggest starting a new workout.`;

      case "after_workout":
        return `[AFTER WORKOUT] The user completed a workout today. Acknowledge their effort. Guide recovery: hydration, protein timing, rest. Reference their goal (${goalLabel}) when suggesting next steps.`;

      case "no_meals_today":
        return `[NO MEALS LOGGED TODAY] ${userName} has logged meals before but nothing today. Gently prompt them to log — reference their calorie/protein targets if available. Do not invent what they ate.`;

      case "meal_plan_active":
        return `[MEAL PLAN ACTIVE] ${userName} has an active meal plan${ctx.nutrition?.activeMealPlanTitle ? ` ("${ctx.nutrition.activeMealPlanTitle}")` : ""}. Reference the plan when discussing nutrition. Help them stay on track with today's planned meals.`;

      default:
        return `[RETURNING USER] Greet ${userName} naturally based on time of day and available context. Reference their goal (${goalLabel}) and recent activity when data is available. Build on the ongoing coaching relationship.`;
    }
  }

  private static getModeDirective(mode: string): string {
    switch (mode) {
      case "nutrition":
        return "Focus on nutrition: macros, meal timing, hydration, and meal planning. Reference today's logged meals and remaining targets.";
      case "workout":
        return "Focus on training: exercise selection, progressive overload, form, and session structure. Reference recent workouts when available.";
      case "recovery":
        return "Focus on recovery: rest, sleep habits, training load balance. Only discuss recovery metrics if real data supports it — never invent readiness scores.";
      case "knowledge":
        return "Focus on education: explain fitness concepts clearly. Still coach — ask what they're trying to achieve and connect answers to their goal.";
      default:
        return "General coaching mode — balance training, nutrition, and progress guidance based on what the user asks and what data is available.";
    }
  }
}
