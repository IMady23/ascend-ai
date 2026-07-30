import { PromptBuilder } from "../../services/ai/prompt.builder";

describe("PromptBuilder coaching behavior", () => {
  it("produces a coach-style prompt with personalized guidance and follow-up question instructions", () => {
    const prompt = PromptBuilder.build({
      profile: {
        nickname: "Maya",
        primaryGoal: "gain_muscle",
        name: "Maya Chen",
      },
      coachingScenario: "returning",
      coachingMode: "general",
      training: { status: "available" },
      nutrition: { status: "partial" },
    });

    expect(prompt).toContain("You are Ascend AI — a personal fitness coach");
    expect(prompt).toContain("Act as a personal coach, not an FAQ bot");
    expect(prompt).toContain("Ask clarifying questions when intent or data is incomplete");
    expect(prompt).toContain("Always end with exactly ONE follow-up question");
    expect(prompt).toContain("Maya");
    expect(prompt).toContain("gain_muscle");
  });

  it("creates a fallback coaching response that feels personal and action-oriented", () => {
    const response = PromptBuilder.buildFallbackCoachResponse(
      {
        profile: {
          nickname: "Maya",
          name: "Maya Chen",
          primaryGoal: "gain_muscle",
        },
        training: { status: "available", totalWorkouts: 3, workoutState: "not_started" },
        nutrition: { status: "partial", caloriesRemaining: 320, proteinRemaining: 45 },
      },
      "I want to improve my energy"
    );

    expect(response.summary).toContain("Maya");
    expect(response.summary).toContain("gain muscle");
    expect(response.followUpQuestion).toMatch(/energy|training|nutrition|today/i);
    expect(response.recommendations.length).toBeGreaterThan(0);
  });
});
