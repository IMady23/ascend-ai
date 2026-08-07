import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";
import { NotificationPreferences } from "./communication";

// ─────────────────────────────────────────────────────────────────────────────
// ENUMS & UNION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type PrimaryGoal = 'lose_fat' | 'gain_muscle' | 'maintain' | 'recomp';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
export type DietType = 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian';
export type FitnessExperience = 'beginner' | 'intermediate' | 'advanced';
export type WorkoutLocation = 'home' | 'gym' | 'outdoor' | 'hybrid';
export type WorkSchedule = 'morning_shift' | 'evening_shift' | 'night_shift' | 'flexible';
export type StressLevel = 'low' | 'moderate' | 'high';
export type CoachingStyle = 'analytical' | 'encouraging' | 'direct' | 'balanced';
export type DataPreference = 'detailed' | 'summary' | 'minimal';
export type ExplanationDepth = 'explain_everything' | 'explain_when_asked' | 'minimal';
export type MotivationStyle = 'data_driven' | 'encouraging' | 'direct' | 'story_based';
export type CookingSkill = 'beginner' | 'intermediate' | 'advanced';
export type ProfileVersion = 1 | 2;

// ─────────────────────────────────────────────────────────────────────────────
// IDENTITY
// ─────────────────────────────────────────────────────────────────────────────

export interface UserIdentity {
  fullName: string;
  nickname: string;
  dob: string;       // ISO date string: YYYY-MM-DD
  height: number;    // cm
  weight: number;    // kg

  // v2: Optional — discovered naturally or via profile evolution
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

// ─────────────────────────────────────────────────────────────────────────────
// GOALS
// ─────────────────────────────────────────────────────────────────────────────

export interface UserGoals {
  primaryGoal: PrimaryGoal;

  // v2: Optional target weight for goal countdown widget
  targetWeightKg?: number;

  // v2: Optional desired weekly change rate (used for adaptive calorie adjustments)
  weeklyWeightChangeGoal?: number; // kg per week, 0.25–1.0
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM GOALS (user-editable overrides for calculated targets)
// ─────────────────────────────────────────────────────────────────────────────

export interface UserCustomGoals {
  steps: number;
  waterMl: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  sleepHours: number;
  workoutDurationMin: number;
  workoutDaysPerWeek: number;

  // v2: Optional weight target mirrored from UserGoals for convenience
  weightKg?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// PREFERENCES
// ─────────────────────────────────────────────────────────────────────────────

export interface UserPreferences {
  // Day 1 fields (collected during onboarding)
  activity: ActivityLevel;
  fitnessExperience: FitnessExperience;
  wakeTime: string;   // HH:MM
  sleepTime: string;  // HH:MM
  dietType: DietType;
  allergies: string[];
  goals?: UserCustomGoals;

  // v2: Discovered naturally — never asked during initial onboarding
  workoutLocation?: WorkoutLocation;
  availableEquipment?: string[];
  dislikedFoods?: string[];
  cuisinePreferences?: string[];
  mealFrequency?: number;     // meals per day
  cookingSkill?: CookingSkill;
  mealPrepTime?: number;      // minutes
  workSchedule?: WorkSchedule;
  stressLevel?: StressLevel;
  injuries?: string[];

  // v2: AI coaching behavior preferences (inferred over time, never forced)
  coachingStyle?: CoachingStyle;
  dataPreference?: DataPreference;
  explanationDepth?: ExplanationDepth;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOTIVATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Privacy Level: Never Surfaced Directly
 * These fields inform AI behavior but are never quoted verbatim to the user.
 * They are only ever provided to AI as coaching context, not as displayed data.
 */
export interface UserMotivation {
  // Day 1 onboarding (optional — user can skip)
  whyStarted?: string;

  // v2: Discovered naturally
  previousAttempts?: number;
  motivationStyle?: MotivationStyle;
}

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Privacy Level: Internal Only
 * Never sent to AI without user consent. Used for safe exercise recommendations.
 */
export interface UserHealth {
  // v2: Discovered naturally via Context Enrichment Engine
  injuries?: string[];
  medicalConditions?: string[];
  progressPhotoConsent?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// LIFESTYLE
// ─────────────────────────────────────────────────────────────────────────────

export interface UserLifestyle {
  // v2: Discovered naturally
  workSchedule?: WorkSchedule;
  stressLevel?: StressLevel;
  socialSharingConsent?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// CALCULATED TARGETS (derived from profile — never ask the user for these)
// ─────────────────────────────────────────────────────────────────────────────

export interface UserTargets {
  tdee: number;
  bmr: number;
  bmi: number;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// USER PROFILE (Versioned)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * UserProfileV1 — The original profile schema.
 * Preserved for backward compatibility and migration purposes.
 * Do not extend this interface. Use UserProfileV2 for new fields.
 */
export interface UserProfileV1 {
  version: 1;
  onboardingCompleted: boolean;
  timezone?: string;
  identity?: UserIdentity;
  goals?: { primaryGoal: PrimaryGoal };
  preferences?: UserPreferences;
  communication?: NotificationPreferences;
  targets?: UserTargets;
  createdAt: string;
  updatedAt: string;
}

/**
 * UserProfileV2 — The current profile schema.
 *
 * Design rules:
 * - All new fields are optional (additive only, no breaking changes)
 * - V1 profiles are valid V2 profiles with undefined new fields
 * - No V1 data is lost during migration
 * - The migration function `migrateUserProfileToV2` handles the upgrade
 */
export interface UserProfileV2 {
  version: 2;
  onboardingCompleted: boolean;
  timezone?: string;

  // Core identity (same as v1 but with optional gender field added)
  identity?: UserIdentity;

  // Expanded goals (v1 had inline primaryGoal, v2 has typed UserGoals)
  goals?: UserGoals;

  // Expanded preferences (v2 adds lifestyle, coaching, and discovery fields)
  preferences?: UserPreferences;

  // v2: Motivation context — used by AI Coach, never displayed to user
  motivation?: UserMotivation;

  // v2: Health data — used for safe exercise recommendations
  health?: UserHealth;

  // v2: Lifestyle context — used for scheduling and recovery recommendations
  lifestyle?: UserLifestyle;

  // Communication preferences (unchanged from v1)
  communication?: NotificationPreferences;

  // Calculated targets (unchanged from v1)
  targets?: UserTargets;

  createdAt: string;
  updatedAt: string;
}

/**
 * UserProfile — the canonical type used throughout the application.
 *
 * This is a discriminated union. Components should check `profile.version`
 * when branching on version-specific fields, or use the migration utility
 * to always work with V2.
 */
export type UserProfile = UserProfileV1 | UserProfileV2;

// ─────────────────────────────────────────────────────────────────────────────
// MIGRATION UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Migrates any UserProfile to V2.
 *
 * Rules:
 * - Deterministic: same input always produces same output
 * - Non-destructive: no V1 data is lost
 * - Logged: migration is recorded in updatedAt
 * - V2 profiles pass through unchanged
 */
export function migrateUserProfileToV2(profile: UserProfile): UserProfileV2 {
  if (profile.version === 2) {
    return profile;
  }

  // V1 → V2: expand inline goal object to typed UserGoals
  const v1Goals = profile.goals as { primaryGoal?: PrimaryGoal } | undefined;

  return {
    version: 2,
    onboardingCompleted: profile.onboardingCompleted,
    timezone: profile.timezone,
    identity: profile.identity,
    goals: v1Goals?.primaryGoal ? { primaryGoal: v1Goals.primaryGoal } : undefined,
    preferences: profile.preferences,
    communication: profile.communication,
    targets: profile.targets,
    // v2 new fields — all undefined for migrated V1 profiles
    // They will be populated via Context Enrichment Engine over time
    motivation: undefined,
    health: undefined,
    lifestyle: undefined,
    createdAt: profile.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Type guard: narrows UserProfile to UserProfileV2.
 * Use this when accessing v2-only fields.
 */
export function isProfileV2(profile: UserProfile): profile is UserProfileV2 {
  return profile.version === 2;
}

/**
 * Type guard: checks if a profile has completed onboarding.
 * @deprecated Import from `@/lib/auth/post-auth-routing` instead.
 * This re-export exists only for backward compatibility during migration.
 */
export { isOnboarded } from "@/lib/auth/post-auth-routing";

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE DNA — Architecture Only, Phase 2 Implementation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ProfileDNA is a DERIVED READ MODEL.
 *
 * Architectural rules (non-negotiable):
 * - Never stored in Firestore
 * - Never persisted in any store
 * - Never synchronized
 * - Always computed on-demand from profile + behavior + progress
 * - Can never become stale because it has no persistent state
 *
 * Phase 1: Interfaces defined here — no runtime computation yet.
 * Phase 2: Implement `ProfileDNAAnalyzer` in `lib/intelligence/ProfileDNAAnalyzer.ts`
 *
 * Usage (Phase 2+):
 *   const dna = ProfileDNAAnalyzer.compute(profile, behaviorLog, progressLog);
 *   aiContext.dna = dna; // Enriches AI prompt context
 */

export interface NutritionDNA {
  /**
   * Whether the user engages with detailed macro breakdowns.
   * Derived from: frequency of macro detail views, custom goal edits.
   */
  prefersMacroDetail: boolean;

  /**
   * Whether the user consistently follows meal plans when generated.
   * Derived from: meal plan generation count vs. log adherence.
   */
  followsMealPlans: boolean;

  /**
   * Whether the user prefers simple meals (few ingredients, short prep).
   * Derived from: logged food complexity, meal plan preferences.
   */
  prefersSimpleMeals: boolean;

  /**
   * How well the user hits their calorie target on average.
   * Derived from: 30-day rolling average of calorie adherence.
   * Range: 0.0–1.0 (1.0 = always hits target)
   */
  calorieAdherenceScore: number;

  /**
   * How well the user hits their protein target on average.
   * Range: 0.0–1.0
   */
  proteinAdherenceScore: number;
}

export interface TrainingDNA {
  /**
   * Whether the user prefers structured programs over flexible workouts.
   * Derived from: mission completion rate, exercise log patterns.
   */
  prefersStructure: boolean;

  /**
   * Whether XP, badges, and streaks increase user engagement.
   * Derived from: correlation between gamification events and session frequency.
   */
  respondsToGamification: boolean;

  /**
   * Whether the user performs better after rest days.
   * Derived from: workout quality metrics after rest vs. consecutive training.
   */
  benefitsFromRest: boolean;

  /**
   * Average workout completion rate.
   * Derived from: started missions vs. finished missions.
   * Range: 0.0–1.0
   */
  completionRate: number;

  /**
   * Preferred time of day for training.
   * Derived from: workout log timestamps.
   */
  preferredTrainingTime: 'morning' | 'afternoon' | 'evening' | 'variable';
}

export interface RecoveryDNA {
  /**
   * Whether the user's performance correlates with sleep duration.
   * Derived from: sleep logs vs. workout quality.
   */
  sleepSensitive: boolean;

  /**
   * Whether the user actively uses the recovery module.
   * Derived from: recovery log frequency.
   */
  prioritizesRecovery: boolean;

  /**
   * Average sleep duration from logs.
   * Derived from: sleep tracking data.
   */
  averageSleepHours: number;
}

export interface MotivationDNA {
  /**
   * The AI coaching tone that resonates most with this user.
   * Derived from: session engagement patterns, response to different tones.
   * Phase 1: Inferred from UserProfile.motivation.motivationStyle
   * Phase 2: Learned from AI conversation engagement
   */
  coachingStyle: CoachingStyle;

  /**
   * Whether the user prefers detailed data with explanations.
   * Derived from: engagement with detailed AI responses vs. brief summaries.
   */
  respondsToData: boolean;

  /**
   * Whether the user engages more with personal story framing.
   * Derived from: conversation history patterns.
   */
  respondsToStories: boolean;

  /**
   * Consistency trend — improving, stable, or declining.
   * Derived from: 30-day rolling activity consistency.
   */
  consistencyTrend: 'improving' | 'stable' | 'declining';

  /**
   * Risk of disengagement based on recent activity.
   * Used to trigger proactive check-ins.
   * Range: 0.0–1.0 (1.0 = high risk)
   */
  disengagementRisk: number;
}

export interface LifestyleDNA {
  /**
   * Whether the user's schedule is consistent or variable.
   * Derived from: workout and meal log timestamp patterns.
   */
  hasConsistentSchedule: boolean;

  /**
   * Whether the user is more active on weekdays or weekends.
   * Derived from: activity log day-of-week distribution.
   */
  weekdayBias: 'weekday' | 'weekend' | 'balanced';

  /**
   * Approximate daily active hours.
   * Derived from: step count timing, workout timing.
   */
  activeTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'variable';
}

/**
 * The complete Profile DNA.
 * Computed on-demand, never persisted.
 * Passed to AI context to personalize tone, content, and recommendations.
 */
export interface ProfileDNA {
  userId: string;
  computedAt: string; // ISO timestamp — for cache invalidation only

  nutrition: NutritionDNA;
  training: TrainingDNA;
  recovery: RecoveryDNA;
  motivation: MotivationDNA;
  lifestyle: LifestyleDNA;
}

/**
 * Placeholder type for the Phase 2 ProfileDNAAnalyzer.
 * Defined here so consumers can import and type-check against it
 * before the implementation exists.
 *
 * Phase 2 implementation: `lib/intelligence/ProfileDNAAnalyzer.ts`
 */
export interface ProfileDNAAnalyzerInterface {
  /**
   * Computes a ProfileDNA from available data sources.
   * All inputs are optional — the analyzer degrades gracefully
   * when behavior or progress data is not yet available.
   */
  compute(
    profile: UserProfileV2,
    options?: {
      behaviorLog?: unknown;  // Phase 2: typed when implemented
      progressLog?: unknown;  // Phase 2: typed when implemented
      analyticsCache?: unknown; // Phase 2: typed when implemented
    }
  ): ProfileDNA;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT ENRICHMENT ENGINE — Architecture Only, Phase 2 Implementation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The Context Enrichment Engine decides whether to ask the user
 * for additional profile information during AI conversations.
 *
 * Its job is NOT "find missing fields". Its job is:
 * 1. Do I already know enough to answer well?
 * 2. Would one additional answer significantly improve this response?
 * 3. Is this the right moment to ask?
 *
 * Sometimes the correct answer is: ask nothing, just respond.
 *
 * Phase 1: Interface defined here.
 * Phase 2: Implement in `lib/intelligence/ContextEnrichmentEngine.ts`
 */

export type EnrichmentDecision =
  | { shouldAsk: false }
  | {
      shouldAsk: true;
      field: keyof UserProfileV2 | string; // which profile field to collect
      question: string;                     // the natural language question to ask
      reason: string;                       // internal reasoning (not shown to user)
      priority: 'high' | 'medium' | 'low'; // high = ask now, low = defer
    };

export interface ContextEnrichmentEngineInterface {
  /**
   * Evaluates the current AI conversation context and decides
   * whether asking one profile question would meaningfully improve the response.
   *
   * @param profile - Current user profile (may have undefined fields)
   * @param conversationContext - What the user just asked / current topic
   * @param recentlyAsked - Fields asked in the last N interactions (avoid repetition)
   * @returns A decision: ask nothing, or ask exactly one question
   */
  evaluate(
    profile: UserProfileV2,
    conversationContext: string,
    recentlyAsked?: string[]
  ): EnrichmentDecision;
}

// ─────────────────────────────────────────────────────────────────────────────
// USER ENTITY
// ─────────────────────────────────────────────────────────────────────────────

export interface User {
  id: string;    // Firebase Auth UID
  email: string;
  profile: UserProfile;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// FIRESTORE CONVERTER
// ─────────────────────────────────────────────────────────────────────────────

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): DocumentData {
    return { ...user };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options);
    return data as User;
  }
};
