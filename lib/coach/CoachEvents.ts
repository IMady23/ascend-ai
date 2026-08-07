/**
 * CoachEvents — All event types the coach system understands.
 *
 * Design principles:
 * - Events use `context_changed` not `screen_entered` — because eventually
 *   the coach operates across contexts (onboarding, nutrition, training, chat)
 *   not just screens.
 * - Every event carries enough data for all listeners to act without querying state.
 * - Events are immutable records — dispatched once, processed by all subscribers.
 *
 * Listeners:
 * - CoachCore (state machine — decides what state to enter)
 * - CoachMemory (records experience milestones)
 * - CoachExperienceRules (decides whether/what to say)
 * - Future: CoachAnalytics, CoachVoice, CoachAI
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT TYPES
// The coach understands these contexts. Each behaves differently.
// ─────────────────────────────────────────────────────────────────────────────

export type CoachContext =
  | "onboarding"
  | "dashboard"
  | "nutrition"
  | "training"
  | "recovery"
  | "progress"
  | "ai_chat"
  | "settings"
  | "background"; // app is open but unfocused

// ─────────────────────────────────────────────────────────────────────────────
// EVENT DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Context changed — user moved to a new area of the app */
export interface ContextChangedEvent {
  type: "context_changed";
  context: CoachContext;
  /** For onboarding: which step number */
  step?: number;
  /** Optional sub-context label (e.g. "name", "goal", "body") */
  label?: string;
}

/** User entered their name */
export interface NameEnteredEvent {
  type: "name_entered";
  firstName: string;
  nickname?: string;
}

/** User completed date of birth + gender */
export interface AboutYouCompletedEvent {
  type: "about_you_completed";
  dob: string;
  age: number;
  gender?: string;
}

/** User completed height + weight entry */
export interface BodyCompletedEvent {
  type: "body_completed";
  heightCm: number;
  weightKg: number;
  bmi: number;
}

/** Analyzing interstitial completed all calculations */
export interface AnalyzingCompleteEvent {
  type: "analyzing_complete";
  bmr: number;
  tdee: number;
  bmi: number;
}

/** User selected their primary goal */
export interface GoalSelectedEvent {
  type: "goal_selected";
  goal: "lose_fat" | "gain_muscle" | "maintain" | "recomp";
  targetWeightKg?: number;
}

/** User selected activity level + fitness experience */
export interface ActivitySelectedEvent {
  type: "activity_selected";
  activityLevel: string;
  fitnessExperience: string;
}

/** User entered motivation (whyStarted) */
export interface MotivationEnteredEvent {
  type: "motivation_entered";
  whyStarted: string;
}

/** User completed onboarding */
export interface OnboardingCompleteEvent {
  type: "onboarding_complete";
  userName: string;
  goal: string;
}

/** A meal was logged */
export interface MealLoggedEvent {
  type: "meal_logged";
  calories: number;
  isGoalMet: boolean;
  mealType: string;
}

/** A workout was completed */
export interface WorkoutCompletedEvent {
  type: "workout_completed";
  durationMinutes: number;
  xpEarned: number;
}

/** User hit a daily goal */
export interface GoalHitEvent {
  type: "goal_hit";
  goalType: "calories" | "protein" | "steps" | "water" | "sleep";
  value: number;
}

/** User's streak changed */
export interface StreakChangedEvent {
  type: "streak_changed";
  previousStreak: number;
  newStreak: number;
  isNewRecord: boolean;
}

/** A personal record was broken */
export interface PersonalRecordEvent {
  type: "personal_record";
  exercise: string;
  previousBest: number;
  newBest: number;
  unit: string;
}

/** User explicitly requested coach advice */
export interface CoachRequestedEvent {
  type: "coach_requested";
  context: CoachContext;
  query?: string;
}

/** Speech event — coach says something */
export interface CoachSpeechEvent {
  type: "coach_speech";
  message: string;
  /** If true, replaces current message. If false, queues after current. */
  interrupt?: boolean;
}

/** Coach should enter silence */
export interface CoachSilenceEvent {
  type: "coach_silence";
}

// ─────────────────────────────────────────────────────────────────────────────
// UNION TYPE — all possible events
// ─────────────────────────────────────────────────────────────────────────────

export type CoachEvent =
  | ContextChangedEvent
  | NameEnteredEvent
  | AboutYouCompletedEvent
  | BodyCompletedEvent
  | AnalyzingCompleteEvent
  | GoalSelectedEvent
  | ActivitySelectedEvent
  | MotivationEnteredEvent
  | OnboardingCompleteEvent
  | MealLoggedEvent
  | WorkoutCompletedEvent
  | GoalHitEvent
  | StreakChangedEvent
  | PersonalRecordEvent
  | CoachRequestedEvent
  | CoachSpeechEvent
  | CoachSilenceEvent;

export type CoachEventType = CoachEvent["type"];

// ─────────────────────────────────────────────────────────────────────────────
// EVENT LISTENER
// ─────────────────────────────────────────────────────────────────────────────

export type CoachEventListener = (event: CoachEvent) => void;

// ─────────────────────────────────────────────────────────────────────────────
// EVENT BUS (lightweight, synchronous, no external deps)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CoachEventBus — Synchronous pub/sub for coach events.
 *
 * Why not use the existing EventBus (lib/events/EventBus)?
 * The existing EventBus is for Firestore-level domain events (meal logged, water logged).
 * This bus is for coach UI/behavior coordination — a different layer, different concern.
 * They should never be mixed.
 */
class CoachEventBusClass {
  private listeners: Map<CoachEventType | "*", Set<CoachEventListener>> = new Map();

  /**
   * Subscribe to a specific event type or all events ("*").
   * Returns an unsubscribe function.
   */
  on(type: CoachEventType | "*", listener: CoachEventListener): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);

    return () => {
      this.listeners.get(type)?.delete(listener);
    };
  }

  /**
   * Dispatch an event to all registered listeners.
   * Processes synchronously — listeners should not perform async work directly.
   */
  dispatch(event: CoachEvent): void {
    // Specific listeners
    this.listeners.get(event.type)?.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error(`[CoachEventBus] Listener error for "${event.type}":`, err);
      }
    });

    // Wildcard listeners
    this.listeners.get("*")?.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error(`[CoachEventBus] Wildcard listener error:`, err);
      }
    });
  }

  /** Remove all listeners. Call on logout/reset. */
  clear(): void {
    this.listeners.clear();
  }
}

export const CoachEventBus = new CoachEventBusClass();
