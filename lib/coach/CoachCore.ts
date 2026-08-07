/**
 * CoachCore — The Ascend Coach state machine.
 *
 * This is the brain. It:
 * 1. Owns the coach's current state (idle, thinking, speaking, etc.)
 * 2. Owns the current message (what the coach is saying)
 * 3. Dispatches events to the CoachEventBus
 * 4. Evaluates experience rules to decide what to say
 * 5. Updates CoachMemory when relevant events fire
 * 6. Handles the signature DNA transition sequence
 *
 * Architecture rules:
 * - No React imports. This is pure state — UI reads it, doesn't own it.
 * - No Firestore. Profile data comes in via events, not direct reads.
 * - No async in state transitions — side effects go through the event bus.
 * - Screens call coach.event() or convenience wrappers. Never setState directly.
 *
 * Visual states map to CoachOrb animations (defined in components/coach/CoachOrb.tsx).
 * Text messages map to CoachBubble rendering (defined in components/coach/CoachBubble.tsx).
 */

import { create } from "zustand";
import {
  CoachEventBus,
  type CoachEvent,
  type CoachContext,
} from "./CoachEvents";
import {
  useCoachMemory,
  type CoachMemoryKey,
} from "./CoachMemory";
import {
  evaluateRules,
  isSilentContext,
  type SpeechDecision,
} from "./CoachExperienceRules";

// ─────────────────────────────────────────────────────────────────────────────
// COACH VISUAL STATE
// ─────────────────────────────────────────────────────────────────────────────

export type CoachVisualState =
  | "idle"        // Default — gentle breath, present but quiet
  | "listening"   // User is entering input — attentive
  | "thinking"    // Processing — faster pulse, no message
  | "speaking"    // Delivering a message — ripple + glow
  | "happy"       // Positive outcome — brief glow increase
  | "celebrating" // Major milestone — bloom, once
  | "concerned"   // Something needs attention — orange tint
  | "waiting"     // User hasn't acted in a while — micro-life
  | "sleeping";   // Background — very dim, very slow

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE QUEUE ITEM
// ─────────────────────────────────────────────────────────────────────────────

interface QueuedMessage {
  text: string;
  state: CoachVisualState;
  id: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DNA TRANSITION STATE
// The signature "I understand... Now I know... Let's build." sequence.
// Managed separately from the main message queue.
// ─────────────────────────────────────────────────────────────────────────────

export interface DNATransitionState {
  active: boolean;
  phase: 0 | 1 | 2 | 3; // 0=idle, 1=first line, 2=second line, 3=third line
  onComplete?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// COACH CORE STATE
// ─────────────────────────────────────────────────────────────────────────────

interface CoachCoreState {
  /** Current visual state of the coach orb */
  visualState: CoachVisualState;

  /** Current message being displayed. null = coach is silent. */
  currentMessage: string | null;

  /** Previous message — shown compressed while current fades in */
  previousMessage: string | null;

  /** Current context (where in the app the user is) */
  context: CoachContext;

  /** Whether the coach UI should be visible */
  isVisible: boolean;

  /** The DNA transition — the signature moment after Analyzing */
  dnaTransition: DNATransitionState;

  /** Micro-life timer reference (browser only) */
  _microLifeTimer: ReturnType<typeof setTimeout> | null;

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Primary entry point for all coach interactions.
   * Dispatches to CoachEventBus, evaluates rules, updates state.
   */
  event: (e: CoachEvent) => void;

  /** Convenience: say something directly (bypasses rules) */
  say: (message: string, state?: CoachVisualState) => void;

  /** Convenience: enter thinking state (no message) */
  think: () => void;

  /** Convenience: celebrate */
  celebrate: () => void;

  /** Convenience: enter silence */
  silence: () => void;

  /** Show the coach (e.g. entering onboarding) */
  show: () => void;

  /** Hide the coach (e.g. leaving onboarding, entering AI chat) */
  hide: () => void;

  /** Start the DNA transition sequence */
  startDNATransition: (onComplete: () => void) => void;

  /** Advance DNA transition to next phase */
  advanceDNAPhase: () => void;

  /** Internal: set visual state */
  _setVisualState: (state: CoachVisualState) => void;

  /** Internal: update message with previous tracking */
  _setMessage: (message: string | null) => void;

  /** Internal: schedule micro-life pulse */
  _scheduleMicroLife: () => void;

  /** Full reset (logout) */
  reset: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useCoachCore = create<CoachCoreState>((set, get) => ({
  visualState: "idle",
  currentMessage: null,
  previousMessage: null,
  context: "background",
  isVisible: false,
  dnaTransition: { active: false, phase: 0 },
  _microLifeTimer: null,

  // ── Primary event handler ─────────────────────────────────────────────────

  event: (e: CoachEvent) => {
    const { context } = get();
    const memoryStore = useCoachMemory.getState();

    // Update memory for key events before evaluating rules
    if (e.type === "name_entered") {
      memoryStore.remember("firstName", e.firstName);
      if (e.nickname) memoryStore.remember("nickname", e.nickname);
      memoryStore.remember("name", e.nickname || e.firstName);
    }
    if (e.type === "goal_selected") {
      const labels: Record<string, string> = {
        lose_fat: "Lose Fat",
        gain_muscle: "Gain Muscle",
        maintain: "Maintain & Improve",
        recomp: "Body Recomposition",
      };
      memoryStore.remember("goal", e.goal);
      memoryStore.remember("goalLabel", labels[e.goal] ?? e.goal);
    }
    if (e.type === "activity_selected") {
      memoryStore.remember("activityLevel", e.activityLevel);
      memoryStore.remember("fitnessExperience", e.fitnessExperience);
    }
    if (e.type === "motivation_entered") {
      memoryStore.remember("whyStarted", e.whyStarted);
    }
    if (e.type === "onboarding_complete") {
      memoryStore.remember("onboardingComplete", "true");
      memoryStore.markCelebrated("onboarding_dna_moment_shown");
    }
    if (e.type === "context_changed") {
      set({ context: e.context });
    }

    // Dispatch to event bus (other listeners can react)
    CoachEventBus.dispatch(e);

    // Stay silent in always-silent contexts
    if (isSilentContext(context) && e.type !== "coach_speech") return;

    // Direct speech events bypass rules
    if (e.type === "coach_speech") {
      get().say(e.message);
      return;
    }
    if (e.type === "coach_silence") {
      get().silence();
      return;
    }

    // Special case: analyzing complete triggers DNA transition
    if (e.type === "analyzing_complete") {
      // Don't call evaluateRules here — DNA transition is handled by startDNATransition
      get()._setVisualState("thinking");
      return;
    }

    // Evaluate experience rules
    const decision = evaluateRules(
      e,
      memoryStore.profile as Partial<Record<CoachMemoryKey, string>>,
      context,
      (key) => memoryStore.hasCelebrated(key as any)
    );

    if (!decision) return;

    // Check category gap (don't show same type of message too frequently)
    if (decision.category) {
      const gapMs = decision.categoryGapMs;
      if (!memoryStore.canShowCategory(decision.category, gapMs)) return;
      memoryStore.markCategoryShown(decision.category);
    }

    // Mark milestones celebrated
    if (e.type === "name_entered") memoryStore.markCelebrated("welcome_shown");
    if (e.type === "workout_completed") memoryStore.markCelebrated("first_workout_completed");
    if (e.type === "meal_logged") memoryStore.markCelebrated("first_meal_logged");
    if (e.type === "streak_changed") {
      const keys: Record<number, any> = {
        3: "first_streak_3",
        7: "first_streak_7",
        30: "first_streak_30",
      };
      const k = keys[e.newStreak];
      if (k) memoryStore.markCelebrated(k);
    }

    // Apply decision
    const targetState = decision.state as CoachVisualState;
    get()._setVisualState(targetState);
    get()._setMessage(decision.message);
  },

  // ── Convenience wrappers ─────────────────────────────────────────────────

  say: (message, state = "speaking") => {
    get()._setVisualState(state);
    get()._setMessage(message);
    get()._scheduleMicroLife();
  },

  think: () => {
    get()._setVisualState("thinking");
    get()._setMessage(null);
  },

  celebrate: () => {
    get()._setVisualState("celebrating");
  },

  silence: () => {
    get()._setVisualState("idle");
    get()._setMessage(null);
  },

  show: () => set({ isVisible: true }),
  hide: () => set({ isVisible: false }),

  // ── DNA Transition ────────────────────────────────────────────────────────

  startDNATransition: (onComplete) => {
    const memory = useCoachMemory.getState();
    memory.markCelebrated("onboarding_dna_moment_shown");

    // Phase 1: First message
    get()._setVisualState("happy");
    get()._setMessage("I understand.");
    set({ dnaTransition: { active: true, phase: 1, onComplete } });

    // Phase 2: Second message after 900ms
    const t2 = setTimeout(() => {
      if (!get().dnaTransition.active) return;
      get()._setMessage("Now I know where we're starting.");
      set((s) => ({ dnaTransition: { ...s.dnaTransition, phase: 2 } }));
    }, 900);

    // Phase 3: Third message after 1800ms
    const t3 = setTimeout(() => {
      if (!get().dnaTransition.active) return;
      get()._setMessage("Let's build something that's yours.");
      set((s) => ({ dnaTransition: { ...s.dnaTransition, phase: 3 } }));
    }, 1800);

    // Complete after 2500ms — advance to Goal screen
    const t4 = setTimeout(() => {
      if (!get().dnaTransition.active) return;
      const cb = get().dnaTransition.onComplete;
      set({ dnaTransition: { active: false, phase: 0 } });
      get()._setVisualState("speaking");
      cb?.();
    }, 2500);

    // Store timers for cleanup (if component unmounts mid-sequence)
    // We can't store timers in Zustand cleanly, so we rely on the active flag
    // to prevent stale callbacks from firing.
  },

  advanceDNAPhase: () => {
    const { dnaTransition } = get();
    if (!dnaTransition.active) return;
    const next = (dnaTransition.phase + 1) as 0 | 1 | 2 | 3;
    set({ dnaTransition: { ...dnaTransition, phase: next } });
  },

  // ── Internal helpers ─────────────────────────────────────────────────────

  _setVisualState: (state) => set({ visualState: state }),

  _setMessage: (message) => {
    set((s) => ({
      previousMessage: s.currentMessage,
      currentMessage: message,
    }));
  },

  _scheduleMicroLife: () => {
    // Clear existing timer
    const existing = get()._microLifeTimer;
    if (existing) clearTimeout(existing);

    // Schedule micro-life pulse in 15–20 seconds
    const delay = 15000 + Math.random() * 5000;
    const timer = setTimeout(() => {
      const { visualState, currentMessage } = get();
      // Only fire micro-life if coach is idle/waiting and has no message
      if (visualState === "idle" || visualState === "waiting") {
        if (!currentMessage) {
          set({ visualState: "waiting" });
          // Return to idle after the micro-pulse (handled by CoachOrb animation)
          setTimeout(() => {
            if (get().visualState === "waiting") {
              set({ visualState: "idle" });
            }
          }, 600);
        }
      }
      get()._scheduleMicroLife();
    }, delay);

    set({ _microLifeTimer: timer });
  },

  // ── Reset ─────────────────────────────────────────────────────────────────

  reset: () => {
    const timer = get()._microLifeTimer;
    if (timer) clearTimeout(timer);
    useCoachMemory.getState().reset();
    CoachEventBus.clear();
    set({
      visualState: "idle",
      currentMessage: null,
      previousMessage: null,
      context: "background",
      isVisible: false,
      dnaTransition: { active: false, phase: 0 },
      _microLifeTimer: null,
    });
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// CONVENIENCE HOOK — single import for most use cases
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useCoach — The primary hook for interacting with the coach from any component.
 *
 * Usage in screens:
 * ```typescript
 * const coach = useCoach()
 *
 * useEffect(() => {
 *   coach.event({ type: "context_changed", context: "onboarding", step: 1, label: "name" })
 *   coach.say("What should I call you?")
 * }, [])
 *
 * useEffect(() => {
 *   if (isValid) coach.event({ type: "name_entered", firstName })
 * }, [isValid, firstName])
 * ```
 */
export function useCoach() {
  return useCoachCore();
}
