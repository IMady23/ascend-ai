/**
 * Target Calculations — Reusable utilities for TDEE, BMR, BMI, and macro targets.
 *
 * Extracted from the V1 onboarding page. Now the single source of truth for
 * all nutritional target calculations across the application.
 *
 * Consumers:
 * - Onboarding (initial target setup)
 * - Settings / CustomGoalsPanel (when user manually recalculates)
 * - AI Coach (for recommendation context)
 * - Analytics (for historical comparison)
 *
 * Formula: Mifflin-St Jeor (industry standard for BMR)
 *
 * DO NOT duplicate this logic elsewhere. Import from here.
 */

import type {
  ActivityLevel,
  PrimaryGoal,
  UserIdentity,
  UserPreferences,
  UserTargets,
} from "@/types/user";

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY MULTIPLIERS
// ─────────────────────────────────────────────────────────────────────────────

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

// ─────────────────────────────────────────────────────────────────────────────
// GOAL ADJUSTMENTS (daily kcal delta from TDEE)
// ─────────────────────────────────────────────────────────────────────────────

export const GOAL_CALORIE_ADJUSTMENTS: Record<PrimaryGoal, number> = {
  lose_fat: -500,
  gain_muscle: +300,
  maintain: 0,
  recomp: -100,
};

// ─────────────────────────────────────────────────────────────────────────────
// INDIVIDUAL CALCULATORS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Derives age in whole years from a date-of-birth string.
 * @param dob ISO date string (YYYY-MM-DD)
 */
export function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return Math.max(0, age);
}

/**
 * Calculates Body Mass Index.
 * @param weightKg Weight in kilograms
 * @param heightCm Height in centimetres
 * @returns BMI rounded to one decimal place
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Calculates Basal Metabolic Rate using the Mifflin-St Jeor equation.
 *
 * The equation differs slightly by sex. When gender is unknown we use the
 * male formula (the more conservative estimate), which avoids under-eating
 * risk more than over-eating risk.
 *
 * @param weightKg  Weight in kilograms
 * @param heightCm  Height in centimetres
 * @param age       Age in whole years
 * @param gender    Optional — 'male' | 'female'. Defaults to male equation.
 * @returns BMR in kcal/day, rounded to nearest integer
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender?: string
): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 0;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  // Male: +5, Female: -161
  const sexAdjustment = gender === "female" ? -161 : 5;
  return Math.round(base + sexAdjustment);
}

/**
 * Calculates Total Daily Energy Expenditure.
 * @param bmr           Basal Metabolic Rate in kcal/day
 * @param activityLevel User's activity level
 * @returns TDEE in kcal/day, rounded to nearest integer
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  if (bmr <= 0) return 0;
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/**
 * Applies a goal-specific calorie adjustment to TDEE.
 * @param tdee  Total Daily Energy Expenditure
 * @param goal  Primary fitness goal
 * @returns Target daily calories, rounded to nearest integer
 */
export function calculateDailyCalories(tdee: number, goal: PrimaryGoal): number {
  if (tdee <= 0) return 0;
  return Math.round(tdee + GOAL_CALORIE_ADJUSTMENTS[goal]);
}

/**
 * Calculates macro targets from daily calories and body weight.
 *
 * Strategy:
 * - Protein: 2g per kg body weight (sufficient for muscle preservation/growth)
 * - Fat: 1g per kg body weight (minimum for hormone function)
 * - Carbs: Remaining calories after protein and fat are allocated
 *
 * @param dailyCalories Total daily calorie target
 * @param weightKg      Body weight in kilograms
 * @returns Protein, carbs, fat in grams, all rounded to nearest integer
 */
export function calculateMacros(
  dailyCalories: number,
  weightKg: number
): { protein: number; carbs: number; fat: number } {
  if (dailyCalories <= 0 || weightKg <= 0) {
    return { protein: 0, carbs: 0, fat: 0 };
  }

  const protein = Math.round(weightKg * 2);   // 4 kcal/g
  const fat = Math.round(weightKg * 1);       // 9 kcal/g

  const proteinCals = protein * 4;
  const fatCals = fat * 9;
  const carbCals = dailyCalories - proteinCals - fatCals;
  const carbs = Math.max(0, Math.round(carbCals / 4));

  return { protein, carbs, fat };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSITE CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculates the full set of UserTargets from identity, goal, and preferences.
 *
 * This is the single function that onboarding, settings, and the AI coach
 * should call. Never reimplement this logic elsewhere.
 *
 * @param identity    UserIdentity (fullName, dob, height, weight, gender?)
 * @param goal        PrimaryGoal (lose_fat | gain_muscle | maintain | recomp)
 * @param preferences UserPreferences (activity level, goals.waterMl)
 * @returns UserTargets — all calculated fields ready for profile storage
 */
export function calculateAllTargets(
  identity: Pick<UserIdentity, "dob" | "height" | "weight"> & { gender?: string },
  goal: PrimaryGoal,
  preferences: Pick<UserPreferences, "activity"> & {
    goals?: { waterMl?: number };
  }
): UserTargets {
  const age = calculateAge(identity.dob);
  const bmi = calculateBMI(identity.weight, identity.height);
  const bmr = calculateBMR(identity.weight, identity.height, age, identity.gender);
  const tdee = calculateTDEE(bmr, preferences.activity);
  const dailyCalories = calculateDailyCalories(tdee, goal);
  const { protein, carbs, fat } = calculateMacros(dailyCalories, identity.weight);
  const water = preferences.goals?.waterMl ?? 3000;

  return {
    tdee,
    bmr,
    bmi,
    dailyCalories,
    protein,
    carbs,
    fat,
    water,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DISPLAY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a human-readable BMI category label.
 * @param bmi Calculated BMI value
 */
export function getBMICategory(bmi: number): string {
  if (bmi <= 0) return "—";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

/**
 * Returns a human-readable goal label.
 * @param goal PrimaryGoal enum value
 */
export function getGoalLabel(goal: PrimaryGoal): string {
  const labels: Record<PrimaryGoal, string> = {
    lose_fat: "Lose Fat",
    gain_muscle: "Gain Muscle",
    maintain: "Maintain & Improve",
    recomp: "Body Recomposition",
  };
  return labels[goal] ?? goal;
}
