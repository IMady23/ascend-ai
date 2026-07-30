import { buildCoachState, determineConfidenceLevel } from "../../lib/ai/coach-state";

describe("coach state helpers", () => {
  it("uses a low-confidence state for users with no history", () => {
    const state = buildCoachState({
      profile: { nickname: "Madhav", name: "Madhav Patel" },
      workoutCount: 0,
      mealCount: 0,
      hasActiveMealPlan: false,
      completedWorkoutToday: false,
    });

    expect(state.greeting).toContain("Madhav");
    expect(state.confidence).toBe("Low");
    expect(state.insight.actions[0].label).toMatch(/workout|meal|fitness/i);
  });

  it("promotes confidence to high when workouts and meals are well established", () => {
    expect(determineConfidenceLevel({ workoutCount: 6, mealCount: 8, hasActiveMealPlan: true })).toBe("High");
  });
});
