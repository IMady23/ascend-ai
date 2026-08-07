/**
 * Onboarding Store — State machine and draft persistence for the onboarding flow.
 *
 * Architecture rules:
 * - This store owns onboarding-in-progress state ONLY.
 * - It does NOT own UserProfile — that belongs to user.store.ts.
 * - On completion, it writes to user.store.ts via UserSync. Then clears itself.
 * - Draft persists to localStorage with 24h expiration.
 * - This store is NOT persisted via Zustand middleware — we manage draft
 *   serialization manually to enforce the 24h expiry and versioning contract.
 *
 * Step index contract (matches ONBOARDING_FLOW_MAP.md v2 — Phase 2B.5):
 *   0  = Welcome
 *   1  = Name
 *   2  = About You (DOB, Gender)
 *   3  = Your Body (Height, Weight — shows live BMI)
 *   4  = Analyzing (interstitial — no user input, auto-advances)
 *   5  = Goal
 *   6  = Motivation
 *   7  = Activity
 *   8  = Training
 *   9  = Nutrition
 *   10 = Schedule
 *   11 = Preferences
 *   12 = Baseline Activity (current daily habits)
 *   13 = Calculation / Plan Review
 *   14 = Celebration
 *
 * Total steps: 15 (0-indexed, indices 0–14)
 * Trackable (shown in progress bar): Steps 1–12 = 12 steps
 * Hidden from progress bar: Step 0 (Welcome), Step 4 (Analyzing), Step 13, Step 14
 */

import { create } from "zustand";
import type {
  UserIdentity,
  UserGoals,
  UserPreferences,
  UserMotivation,
  PrimaryGoal,
  ActivityLevel,
  FitnessExperience,
  DietType,
} from "@/types/user";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const ONBOARDING_TOTAL_STEPS = 15; // Steps 0–14
export const ONBOARDING_FIRST_STEP = 0;
export const ONBOARDING_LAST_STEP = 14;

/** Steps that show the ProgressHeader (not welcome, not analyzing interstitial, not calculation, not celebration) */
export const ONBOARDING_PROGRESS_STEPS = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12];

/** Steps shown in progress bar (1-indexed for display: "1 of 12") */
export const ONBOARDING_TRACKABLE_STEPS = 12;

/** Steps that auto-advance without user input */
export const ONBOARDING_AUTO_ADVANCE_STEPS = [4]; // Analyzing interstitial

/** localStorage key for draft — versioned to avoid conflicts with V1 draft, includes userId */
const DRAFT_KEY_PREFIX = "ascend-onboarding-draft-v2";

/** Draft expires after 24 hours. Stale drafts are cleared silently. */
const DRAFT_EXPIRY_MS = 24 * 60 * 60 * 1000;

function getDraftKey(userId?: string): string {
  return userId ? `${DRAFT_KEY_PREFIX}-${userId}` : DRAFT_KEY_PREFIX;
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP LABELS (for ProgressHeader)
// ─────────────────────────────────────────────────────────────────────────────

export const STEP_LABELS: Record<number, string> = {
  1: "Name",
  2: "About You",
  3: "Your Body",
  5: "Mission",
  6: "Motivation",
  7: "Activity",
  8: "Training",
  9: "Nutrition",
  10: "Schedule",
  11: "Preferences",
  12: "Current Habits",
};

// ─────────────────────────────────────────────────────────────────────────────
// ONBOARDING DATA SHAPE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The collected data from all onboarding steps.
 * All fields are partial — steps are optional and can be resumed.
 */
export interface OnboardingData {
  // Step 1: Name
  fullName: string;
  nickname: string;

  // Step 2: About You
  dob: string;       // YYYY-MM-DD
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | '';

  // Step 3: Your Body
  height: number;    // cm
  weight: number;    // kg

  // Step 5: Goal (was Step 3)
  primaryGoal: PrimaryGoal;
  targetWeightKg: number | null;

  // Step 6: Motivation (was Step 4 — optional, user can skip)
  whyStarted: string;

  // Step 7: Activity (was Step 5)
  activityLevel: ActivityLevel;
  fitnessExperience: FitnessExperience;

  // Step 8: Training (was Step 6)
  workoutDaysPerWeek: number;
  workoutDurationMin: number;

  // Step 9: Nutrition (was Step 7)
  dietType: DietType;
  allergies: string[];

  // Step 10: Schedule (was Step 8)
  wakeTime: string;   // HH:MM
  sleepTime: string;  // HH:MM
  sleepHours: number;

  // Step 11: App Preferences (was Step 9)
  theme: "light" | "dark" | "system";
  units: "metric" | "imperial";
  timeFormat: "12h" | "24h";

  // Step 11.5: Baseline Activity (current daily habits)
  baselineSteps: number;          // current daily steps
  baselineWaterMl: number;        // current daily water intake (ml)
  baselineCalorieIntake: number;  // current daily calorie intake
  baselineCalorieBurn: number;    // current daily calorie burn from activity
}

/**
 * Default values for all onboarding fields.
 * These are the sensible defaults shown on first visit.
 */
export const ONBOARDING_DEFAULTS: OnboardingData = {
  fullName: "",
  nickname: "",
  dob: "2000-01-01",
  gender: "",
  height: 175,
  weight: 75,
  primaryGoal: "lose_fat",
  targetWeightKg: null,
  whyStarted: "",
  activityLevel: "moderate",
  fitnessExperience: "intermediate",
  workoutDaysPerWeek: 4,
  workoutDurationMin: 60,
  dietType: "non_vegetarian",
  allergies: [],
  wakeTime: "06:30",
  sleepTime: "22:30",
  sleepHours: 8,
  theme: "system",
  units: "metric",
  timeFormat: "24h",
  baselineSteps: 5000,
  baselineWaterMl: 2000,
  baselineCalorieIntake: 2000,
  baselineCalorieBurn: 300,
};

// ─────────────────────────────────────────────────────────────────────────────
// DRAFT SHAPE (what gets persisted to localStorage)
// ─────────────────────────────────────────────────────────────────────────────

interface OnboardingDraft {
  version: 2;
  timestamp: number; // Date.now() — used for 24h expiry check
  currentStep: number;
  data: OnboardingData;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

interface OnboardingState {
  /** Current active step (0–11) */
  currentStep: number;

  /** All collected onboarding data */
  data: OnboardingData;

  /** Whether the completion async operation is running */
  isSubmitting: boolean;

  /** Whether the store has been initialized from draft/defaults */
  isInitialized: boolean;

  // ── Navigation ──────────────────────────────────────────────────────────

  goToStep: (step: number) => void;
  goNext: () => void;
  goBack: () => void;

  // ── Data updates (one per domain to stay granular) ───────────────────────

  updateName: (fullName: string, nickname?: string) => void;
  updateAboutYou: (dob: string, gender: OnboardingData["gender"]) => void;
  updateBody: (height: number, weight: number) => void;
  /** @deprecated Use updateAboutYou + updateBody instead. Kept for migration compatibility. */
  updateFoundation: (dob: string, height: number, weight: number) => void;
  updateGoal: (primaryGoal: PrimaryGoal, targetWeightKg?: number | null) => void;
  updateMotivation: (whyStarted: string) => void;
  updateActivity: (activityLevel: ActivityLevel, fitnessExperience: FitnessExperience) => void;
  updateTraining: (workoutDaysPerWeek: number, workoutDurationMin: number) => void;
  updateNutrition: (dietType: DietType, allergies: string[]) => void;
  updateSchedule: (wakeTime: string, sleepTime: string, sleepHours: number) => void;
  updateAppConfig: (
    theme: OnboardingData["theme"],
    units: OnboardingData["units"],
    timeFormat: OnboardingData["timeFormat"]
  ) => void;
  updateBaselineActivity: (
    steps: number,
    waterMl: number,
    calorieIntake: number,
    calorieBurn: number
  ) => void;

  // ── Lifecycle ────────────────────────────────────────────────────────────

  /** Load draft from localStorage. Returns true if valid draft was found. */
  loadDraft: (userId?: string) => boolean;

  /** Save current state to localStorage draft. Called after every data update. */
  saveDraft: (userId?: string) => void;

  /** Clear draft from localStorage and reset store to defaults. */
  clearDraft: (userId?: string) => void;

  /** Mark completion in progress (blocks double-submit) */
  setSubmitting: (value: boolean) => void;

  /** Full reset to defaults (called on logout or new session) */
  reset: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// DRAFT UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function readDraftFromStorage(userId?: string): OnboardingDraft | null {
  if (typeof window === "undefined") return null;

  const key = getDraftKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as OnboardingDraft;

    // Validate version
    if (parsed.version !== 2) {
      localStorage.removeItem(key);
      return null;
    }

    // Enforce 24h expiry
    if (Date.now() - parsed.timestamp > DRAFT_EXPIRY_MS) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed;
  } catch {
    // Malformed draft — clear it
    localStorage.removeItem(key);
    return null;
  }
}

function writeDraftToStorage(draft: OnboardingDraft, userId?: string): void {
  if (typeof window === "undefined") return;
  const key = getDraftKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // Storage full or unavailable — fail silently, don't crash onboarding
  }
}

function clearDraftFromStorage(userId?: string): void {
  if (typeof window === "undefined") return;
  const key = getDraftKey(userId);
  try {
    localStorage.removeItem(key);
    // Also clear the V1 draft key if it exists — clean migration
    localStorage.removeItem("ascend-onboarding-draft");
    // Also clear the V1 completion flag
    localStorage.removeItem("ascend-onboarding-completed");
  } catch {
    // Fail silently
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: ONBOARDING_FIRST_STEP,
  data: { ...ONBOARDING_DEFAULTS },
  isSubmitting: false,
  isInitialized: false,

  // ── Navigation ──────────────────────────────────────────────────────────

  goToStep: (step, userId?: string) => {
    const clamped = Math.max(ONBOARDING_FIRST_STEP, Math.min(ONBOARDING_LAST_STEP, step));
    set({ currentStep: clamped });
    get().saveDraft(userId);
  },

  goNext: (userId?: string) => {
    const { currentStep } = get();
    if (currentStep < ONBOARDING_LAST_STEP) {
      set({ currentStep: currentStep + 1 });
      get().saveDraft(userId);
    }
  },

  goBack: (userId?: string) => {
    const { currentStep } = get();
    if (currentStep > ONBOARDING_FIRST_STEP) {
      set({ currentStep: currentStep - 1 });
      get().saveDraft(userId);
    }
  },

  // ── Data updates ─────────────────────────────────────────────────────────

  updateName: (fullName, nickname = "", userId?: string) => {
    set((state) => ({ data: { ...state.data, fullName, nickname } }));
    get().saveDraft(userId);
  },

  updateAboutYou: (dob, gender, userId?: string) => {
    set((state) => ({ data: { ...state.data, dob, gender } }));
    get().saveDraft(userId);
  },

  updateBody: (height, weight, userId?: string) => {
    set((state) => ({ data: { ...state.data, height, weight } }));
    get().saveDraft(userId);
  },

  updateFoundation: (dob, height, weight, userId?: string) => {
    set((state) => ({ data: { ...state.data, dob, height, weight } }));
    get().saveDraft(userId);
  },

  updateGoal: (primaryGoal, targetWeightKg = null, userId?: string) => {
    set((state) => ({ data: { ...state.data, primaryGoal, targetWeightKg } }));
    get().saveDraft(userId);
  },

  updateMotivation: (whyStarted, userId?: string) => {
    set((state) => ({ data: { ...state.data, whyStarted } }));
    get().saveDraft(userId);
  },

  updateActivity: (activityLevel, fitnessExperience, userId?: string) => {
    set((state) => ({ data: { ...state.data, activityLevel, fitnessExperience } }));
    get().saveDraft(userId);
  },

  updateTraining: (workoutDaysPerWeek, workoutDurationMin, userId?: string) => {
    set((state) => ({ data: { ...state.data, workoutDaysPerWeek, workoutDurationMin } }));
    get().saveDraft(userId);
  },

  updateNutrition: (dietType, allergies, userId?: string) => {
    set((state) => ({ data: { ...state.data, dietType, allergies } }));
    get().saveDraft(userId);
  },

  updateSchedule: (wakeTime, sleepTime, sleepHours, userId?: string) => {
    set((state) => ({ data: { ...state.data, wakeTime, sleepTime, sleepHours } }));
    get().saveDraft(userId);
  },

  updateAppConfig: (theme, units, timeFormat, userId?: string) => {
    set((state) => ({ data: { ...state.data, theme, units, timeFormat } }));
    get().saveDraft(userId);
  },

  updateBaselineActivity: (steps, waterMl, calorieIntake, calorieBurn, userId?: string) => {
    set((state) => ({
      data: {
        ...state.data,
        baselineSteps: steps,
        baselineWaterMl: waterMl,
        baselineCalorieIntake: calorieIntake,
        baselineCalorieBurn: calorieBurn,
      },
    }));
    get().saveDraft(userId);
  },

  // ── Lifecycle ────────────────────────────────────────────────────────────

  loadDraft: (userId) => {
    const draft = readDraftFromStorage(userId);

    if (draft) {
      set({
        currentStep: draft.currentStep,
        data: { ...ONBOARDING_DEFAULTS, ...draft.data },
        isInitialized: true,
      });
      return true;
    }

    // No valid draft — initialize with defaults, auto-detect locale preferences
    const detectedDefaults = detectLocaleDefaults();
    set({
      currentStep: ONBOARDING_FIRST_STEP,
      data: { ...ONBOARDING_DEFAULTS, ...detectedDefaults },
      isInitialized: true,
    });
    return false;
  },

  saveDraft: (userId) => {
    const { currentStep, data } = get();
    writeDraftToStorage({
      version: 2,
      timestamp: Date.now(),
      currentStep,
      data,
    }, userId);
  },

  clearDraft: (userId) => {
    clearDraftFromStorage(userId);
    set({
      currentStep: ONBOARDING_FIRST_STEP,
      data: { ...ONBOARDING_DEFAULTS },
      isSubmitting: false,
    });
  },

  setSubmitting: (value) => set({ isSubmitting: value }),

  reset: (userId?: string) => {
    clearDraftFromStorage(userId);
    set({
      currentStep: ONBOARDING_FIRST_STEP,
      data: { ...ONBOARDING_DEFAULTS },
      isSubmitting: false,
      isInitialized: false,
    });
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// LOCALE DETECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Attempts to detect sensible defaults from the browser's locale.
 * Returns partial OnboardingData — only the fields we can safely infer.
 * Never asks the user for information the system can detect.
 */
function detectLocaleDefaults(): Partial<OnboardingData> {
  if (typeof window === "undefined") return {};

  const defaults: Partial<OnboardingData> = {};

  try {
    // Units: infer from locale (US → imperial, everyone else → metric)
    const locale = navigator.language || "en-US";
    const imperialLocales = ["en-US", "en-LR", "en-MM"];
    defaults.units = imperialLocales.some((l) => locale.startsWith(l.split("-")[0]) && locale === l)
      ? "imperial"
      : "metric";

    // Time format: infer from locale formatting
    const sampleTime = new Intl.DateTimeFormat(locale, { hour: "numeric" }).format(new Date());
    defaults.timeFormat = /AM|PM/i.test(sampleTime) ? "12h" : "24h";
  } catch {
    // Locale detection failed — stick with hardcoded defaults
  }

  return defaults;
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if the given step has enough valid data to proceed.
 * Used to enable/disable the Continue button on each step.
 */
export function canProceedFromStep(step: number, data: OnboardingData): boolean {
  switch (step) {
    case 0:  // Welcome — always can proceed
      return true;
    case 1:  // Name
      return data.fullName.trim().length >= 2;
    case 2:  // About You
      return data.dob.length === 10; // gender is optional
    case 3:  // Your Body
      return (
        data.height >= 100 && data.height <= 250 &&
        data.weight >= 30 && data.weight <= 300
      );
    case 4:  // Analyzing — auto-advances, always true
      return true;
    case 5:  // Goal
      return !!data.primaryGoal;
    case 6:  // Motivation — always can proceed (skip is valid)
      return true;
    case 7:  // Activity
      return !!data.activityLevel && !!data.fitnessExperience;
    case 8:  // Training
      return (
        data.workoutDaysPerWeek >= 1 &&
        data.workoutDaysPerWeek <= 7 &&
        data.workoutDurationMin >= 15 &&
        data.workoutDurationMin <= 180
      );
    case 9:  // Nutrition
      return !!data.dietType;
    case 10: // Schedule
      return (
        /^\d{2}:\d{2}$/.test(data.wakeTime) &&
        /^\d{2}:\d{2}$/.test(data.sleepTime) &&
        data.sleepHours >= 4 &&
        data.sleepHours <= 12
      );
    case 11: // Preferences — always valid (all have defaults)
      return true;
    default:
      return true;
  }
}

/**
 * Returns the progress bar position for steps 1–11 (excluding step 4 = Analyzing).
 * Returns null for Welcome (0), Analyzing (4), Calculation (12), Celebration (13).
 */
export function getProgressPosition(step: number): { current: number; total: number } | null {
  // Map real step number to progress bar position
  // Steps 1-3 = positions 1-3, step 4 is hidden, steps 5-11 = positions 4-10
  if (step === 0 || step === 4 || step >= 12) return null;
  const position = step < 4 ? step : step - 1; // skip step 4 in the count
  return { current: position, total: ONBOARDING_TRACKABLE_STEPS };
}
