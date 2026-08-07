/**
 * CoachMemory — Experience memory for the Ascend Coach.
 *
 * This is NOT database memory (that's UserProfile + Firestore).
 * This is UI/experience memory — what the coach has already said or shown,
 * so it never repeats itself.
 *
 * Two categories:
 * 1. Profile memory — what the user told the coach (name, goal, etc.)
 *    Used to personalize messages without querying stores.
 *
 * 2. Experience memory — what the coach has done
 *    - What messages were shown (prevents repetition)
 *    - What milestones were celebrated (prevents duplicate celebrations)
 *    - When things were last shown (enforces recency gaps)
 *
 * Storage: sessionStorage only (intentionally ephemeral).
 * Profile memory persists in the coach store (Zustand).
 * Experience memory resets each session — the coach should greet
 * returning users naturally, not robotically remember every interaction.
 */

import { create } from "zustand";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

/** Keys the coach can remember about the user */
export type CoachMemoryKey =
  | "name"
  | "firstName"
  | "nickname"
  | "goal"
  | "goalLabel"
  | "bodyCalculated"
  | "onboardingComplete"
  | "activityLevel"
  | "fitnessExperience"
  | "whyStarted"; // Motivation — first-class for future retrieval

/** Keys for experience milestones — prevents duplicate celebrations */
export type ExperienceMilestoneKey =
  | "first_workout_completed"
  | "first_meal_logged"
  | "first_streak_3"
  | "first_streak_7"
  | "first_streak_30"
  | "first_goal_hit"
  | "first_personal_record"
  | "onboarding_dna_moment_shown"
  | "welcome_shown";

interface CoachMemoryState {
  // ── Profile memory (persists in store) ───────────────────────────────────
  profile: Partial<Record<CoachMemoryKey, string>>;

  // ── Experience memory (ephemeral, resets per session) ────────────────────
  /** Messages that have been shown — tracks by content hash to avoid repeats */
  shownMessages: Set<string>;

  /** Milestones that have been celebrated this session */
  shownMilestones: Set<ExperienceMilestoneKey>;

  /** Timestamps of last shown per message category */
  lastShown: Partial<Record<string, number>>;

  // ── Actions ──────────────────────────────────────────────────────────────
  remember: (key: CoachMemoryKey, value: string) => void;
  recall: (key: CoachMemoryKey) => string | undefined;

  /** Returns true if this message was already shown this session */
  hasShown: (messageHash: string) => boolean;
  markShown: (messageHash: string) => void;

  /** Returns true if this milestone was already celebrated */
  hasCelebrated: (milestone: ExperienceMilestoneKey) => boolean;
  markCelebrated: (milestone: ExperienceMilestoneKey) => void;

  /**
   * Returns true if enough time has passed since last showing this category.
   * Prevents the coach from saying the same TYPE of thing too frequently.
   */
  canShowCategory: (category: string, minGapMs?: number) => boolean;
  markCategoryShown: (category: string) => void;

  /** Full reset — call on logout */
  reset: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// SIMPLE HASH for message deduplication
// ─────────────────────────────────────────────────────────────────────────────

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return String(hash);
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT GAPS — minimum time between showing categories of messages
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_CATEGORY_GAP_MS = 5 * 60 * 1000; // 5 minutes

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useCoachMemory = create<CoachMemoryState>((set, get) => ({
  profile: {},
  shownMessages: new Set(),
  shownMilestones: new Set(),
  lastShown: {},

  remember: (key, value) => {
    set((state) => ({
      profile: { ...state.profile, [key]: value },
    }));
  },

  recall: (key) => {
    return get().profile[key];
  },

  hasShown: (messageHash) => {
    return get().shownMessages.has(simpleHash(messageHash));
  },

  markShown: (messageHash) => {
    set((state) => {
      const next = new Set(state.shownMessages);
      next.add(simpleHash(messageHash));
      return { shownMessages: next };
    });
  },

  hasCelebrated: (milestone) => {
    return get().shownMilestones.has(milestone);
  },

  markCelebrated: (milestone) => {
    set((state) => {
      const next = new Set(state.shownMilestones);
      next.add(milestone);
      return { shownMilestones: next };
    });
  },

  canShowCategory: (category, minGapMs = DEFAULT_CATEGORY_GAP_MS) => {
    const last = get().lastShown[category];
    if (!last) return true;
    return Date.now() - last >= minGapMs;
  },

  markCategoryShown: (category) => {
    set((state) => ({
      lastShown: { ...state.lastShown, [category]: Date.now() },
    }));
  },

  reset: () => {
    set({
      profile: {},
      shownMessages: new Set(),
      shownMilestones: new Set(),
      lastShown: {},
    });
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// CONVENIENCE HELPER — personalize a message template using memory
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Replaces {firstName}, {goal}, etc. in a template with remembered values.
 *
 * Example:
 *   personalize("Nice work, {firstName}.", memory) → "Nice work, Alex."
 */
export function personalize(
  template: string,
  memory: Partial<Record<CoachMemoryKey, string>>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return memory[key as CoachMemoryKey] ?? match;
  });
}
