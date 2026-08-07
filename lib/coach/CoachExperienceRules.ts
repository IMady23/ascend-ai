/**
 * CoachExperienceRules — When the coach speaks, and what it says.
 *
 * This is the Silence Rule in code form (from ASCEND_COACH.md).
 *
 * Architecture:
 * - Rules are pure functions: (event, memory, context) → SpeechDecision | null
 * - A null return means the coach stays silent.
 * - The CoachCore calls these rules on every event.
 * - Rules are ordered by priority — first match wins.
 *
 * Rules live here — not in components, not in screens.
 * This ensures that copy, timing, and behavior are all in one place
 * and can be reviewed/changed without touching UI files.
 *
 * Adding new behavior:
 * 1. Add a rule function below
 * 2. Add it to EXPERIENCE_RULES array in priority order
 * 3. The coach will start using it immediately
 *
 * Never add rules for:
 * - Every screen load
 * - Trivial actions
 * - Anything that would fire more than once per minute in normal usage
 */

import type { CoachEvent, CoachContext } from "./CoachEvents";
import type { CoachMemoryKey } from "./CoachMemory";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface SpeechDecision {
  /** What the coach says */
  message: string;
  /** What state the coach enters when saying this */
  state: "speaking" | "happy" | "celebrating" | "concerned";
  /** Whether this replaces a current message or waits */
  interrupt: boolean;
  /** Optional: minimum ms before same category fires again */
  categoryGapMs?: number;
  /** Category key for deduplication tracking */
  category?: string;
}

export type ExperienceRule = (
  event: CoachEvent,
  memory: Partial<Record<CoachMemoryKey, string>>,
  context: CoachContext,
  hasCelebrated: (key: string) => boolean
) => SpeechDecision | null;

// ─────────────────────────────────────────────────────────────────────────────
// RULES
// ─────────────────────────────────────────────────────────────────────────────

/** Rule: Welcome by name when name is entered for the first time */
const ruleNameEntered: ExperienceRule = (event, memory, context, hasCelebrated) => {
  if (event.type !== "name_entered") return null;
  if (hasCelebrated("welcome_shown")) return null;

  const displayName = event.nickname || event.firstName;
  return {
    message: `Nice to meet you, ${displayName}. Let's build your plan.`,
    state: "speaking",
    interrupt: true,
    category: "welcome",
  };
};

/** Rule: Acknowledge body completion with BMI context */
const ruleBodyCompleted: ExperienceRule = (event, memory) => {
  if (event.type !== "body_completed") return null;
  return {
    message: `Got it. I'll use these to calculate your metabolism accurately.`,
    state: "speaking",
    interrupt: true,
    category: "body_acknowledged",
  };
};

/** Rule: Analyzing complete — the signature DNA moment */
const ruleAnalyzingComplete: ExperienceRule = (event, memory, context, hasCelebrated) => {
  if (event.type !== "analyzing_complete") return null;
  if (hasCelebrated("onboarding_dna_moment_shown")) return null;
  // This rule triggers the multi-step signature sequence in CoachCore
  // The message here is the FIRST line only — CoachCore handles the sequence
  return {
    message: "I understand.",
    state: "happy",
    interrupt: true,
    category: "dna_moment",
  };
};

/** Rule: Goal selected — acknowledge the specific goal */
const ruleGoalSelected: ExperienceRule = (event, memory) => {
  if (event.type !== "goal_selected") return null;

  const goalMessages: Record<string, string> = {
    lose_fat: "Perfect. I'll prioritize protein and sustainable calorie targets.",
    gain_muscle: "Perfect. I'll focus on progressive overload and enough fuel to build.",
    maintain: "Perfect. Precision at maintenance — performance without weight change.",
    recomp: "Perfect. This is ambitious, but achievable. We'll need precise macros and consistent training.",
  };

  const msg = goalMessages[event.goal];
  if (!msg) return null;

  return {
    message: msg,
    state: "speaking",
    interrupt: false,
    category: "goal_acknowledged",
  };
};

/** Rule: First workout completed */
const ruleFirstWorkout: ExperienceRule = (event, memory, context, hasCelebrated) => {
  if (event.type !== "workout_completed") return null;
  if (hasCelebrated("first_workout_completed")) return null;
  const firstName = memory.firstName ?? memory.name ?? "there";
  return {
    message: `First session done, ${firstName}. That's how it starts.`,
    state: "celebrating",
    interrupt: false,
    category: "first_workout",
  };
};

/** Rule: First meal logged */
const ruleFirstMeal: ExperienceRule = (event, memory, context, hasCelebrated) => {
  if (event.type !== "meal_logged") return null;
  if (hasCelebrated("first_meal_logged")) return null;
  return {
    message: "First meal tracked. Every log makes the plan more accurate.",
    state: "happy",
    interrupt: false,
    category: "first_meal",
  };
};

/** Rule: Streak milestones */
const ruleStreak: ExperienceRule = (event, memory, context, hasCelebrated) => {
  if (event.type !== "streak_changed") return null;

  const streakMessages: Record<number, { msg: string; key: string }> = {
    3:  { msg: "3 days in a row. Consistency is forming.", key: "first_streak_3" },
    7:  { msg: "7 days. One week of showing up.", key: "first_streak_7" },
    30: { msg: "30 days. This is no longer a habit — it's who you are.", key: "first_streak_30" },
  };

  const milestone = streakMessages[event.newStreak];
  if (!milestone) return null;
  if (hasCelebrated(milestone.key)) return null;

  return {
    message: milestone.msg,
    state: "celebrating",
    interrupt: false,
    category: `streak_${event.newStreak}`,
  };
};

/** Rule: Personal record */
const rulePersonalRecord: ExperienceRule = (event, memory) => {
  if (event.type !== "personal_record") return null;
  return {
    message: `New record on ${event.exercise}. ${event.newBest}${event.unit} — that's a best.`,
    state: "celebrating",
    interrupt: false,
    category: "personal_record",
    categoryGapMs: 60 * 1000, // 1 minute between PR celebrations
  };
};

/** Rule: Daily goal hit */
const ruleGoalHit: ExperienceRule = (event, memory, context, hasCelebrated) => {
  if (event.type !== "goal_hit") return null;

  const goalMessages: Record<string, string> = {
    protein: "Protein goal hit. Your muscles have what they need.",
    water: "Hydration goal met for today.",
    steps: "Step goal done. That adds up.",
    calories: "Calorie target reached.",
    sleep: "Sleep goal logged. Recovery matters.",
  };

  const msg = goalMessages[event.goalType];
  if (!msg) return null;

  return {
    message: msg,
    state: "happy",
    interrupt: false,
    category: `goal_hit_${event.goalType}`,
    categoryGapMs: 4 * 60 * 60 * 1000, // 4 hours between same goal celebrations
  };
};

/** Rule: Onboarding complete */
const ruleOnboardingComplete: ExperienceRule = (event, memory) => {
  if (event.type !== "onboarding_complete") return null;
  const name = event.userName.split(" ")[0] || "there";
  return {
    message: `${name}, your profile is ready. From here, I'll keep learning every day.`,
    state: "celebrating",
    interrupt: true,
    category: "onboarding_complete",
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// RULES REGISTRY — ordered by priority, first match wins
// ─────────────────────────────────────────────────────────────────────────────

export const EXPERIENCE_RULES: ExperienceRule[] = [
  // Onboarding flow (high priority — specific moments)
  ruleAnalyzingComplete,
  ruleOnboardingComplete,
  ruleNameEntered,
  ruleBodyCompleted,
  ruleGoalSelected,

  // Achievement moments
  rulePersonalRecord,
  ruleStreak,
  ruleFirstWorkout,
  ruleFirstMeal,
  ruleGoalHit,
];

// ─────────────────────────────────────────────────────────────────────────────
// EVALUATOR — called by CoachCore on every event
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluates all rules for a given event.
 * Returns the first matching SpeechDecision, or null if the coach should stay silent.
 */
export function evaluateRules(
  event: CoachEvent,
  memory: Partial<Record<CoachMemoryKey, string>>,
  context: CoachContext,
  hasCelebrated: (key: string) => boolean
): SpeechDecision | null {
  for (const rule of EXPERIENCE_RULES) {
    const decision = rule(event, memory, context, hasCelebrated);
    if (decision !== null) return decision;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SILENCE CONTEXTS — contexts where the coach never speaks automatically
// ─────────────────────────────────────────────────────────────────────────────

/**
 * In these contexts, the coach only speaks when explicitly triggered via
 * coach.say() — never from experience rules.
 */
export const ALWAYS_SILENT_CONTEXTS: CoachContext[] = [
  "ai_chat",    // The conversation IS the coach — no orb messages
  "settings",   // Configuration UI — coach adds noise
  "background", // App backgrounded — never speak
];

export function isSilentContext(context: CoachContext): boolean {
  return ALWAYS_SILENT_CONTEXTS.includes(context);
}
