/**
 * Ascend Coach — Single import point
 *
 * Usage:
 *   import { useCoach, CoachEventBus } from "@/lib/coach"
 *   import type { CoachEvent, CoachContext } from "@/lib/coach"
 */

// Primary hook — use this in screens and components
export { useCoach, useCoachCore } from "./CoachCore";
export type { CoachVisualState, DNATransitionState } from "./CoachCore";

// Event system
export { CoachEventBus } from "./CoachEvents";
export type {
  CoachEvent,
  CoachContext,
  CoachEventType,
  CoachEventListener,
  ContextChangedEvent,
  NameEnteredEvent,
  GoalSelectedEvent,
  AnalyzingCompleteEvent,
  OnboardingCompleteEvent,
  MealLoggedEvent,
  WorkoutCompletedEvent,
  StreakChangedEvent,
  PersonalRecordEvent,
  GoalHitEvent,
} from "./CoachEvents";

// Memory
export { useCoachMemory, personalize } from "./CoachMemory";
export type { CoachMemoryKey, ExperienceMilestoneKey } from "./CoachMemory";

// Experience rules (for testing and extension)
export { evaluateRules, isSilentContext, EXPERIENCE_RULES, ALWAYS_SILENT_CONTEXTS } from "./CoachExperienceRules";
export type { SpeechDecision, ExperienceRule } from "./CoachExperienceRules";
