# Onboarding Data Contract

**Version**: 2.0  
**Last Updated**: 2026-08-06  
**Status**: Phase 1 Architecture

---

## Purpose

This document defines the **single source of truth** for all data collected during user onboarding and profile evolution.

Every field in this contract must have:
- A clear owner (which store/repository manages it)
- A clear consumer (which features depend on it)
- A collection strategy (when it's asked)
- Validation rules
- Privacy classification
- AI update permissions

**Golden Rule**: If a field doesn't have downstream consumers that will immediately benefit from it, don't collect it yet.

---

## Core Identity Fields

| Field | Owner | Consumer | Collection Stage | Validation | Privacy Level | Can AI Update? |
|-------|-------|----------|-----------------|------------|---------------|----------------|
| `fullName` | `UserProfile.identity` | Dashboard, Settings, AI Coach | Day 1 (Step 1) | String, 2-100 chars, no special chars | User Editable Only | ❌ No |
| `nickname` | `UserProfile.identity` | Dashboard greetings, AI Coach personalization | Day 1 (Step 1) | String, 1-50 chars, optional | User Editable Only | ❌ No |
| `dob` | `UserProfile.identity` | Age calculation → BMR/TDEE, Progress milestones | Day 1 (Step 2) | ISO date, 13-100 years old | Internal Only | ❌ No |
| `height` | `UserProfile.identity` | BMI, TDEE, Progress tracking | Day 1 (Step 2) | Number, 100-250 cm (metric) or 39-98 in (imperial) | Public to AI | ❌ No |
| `weight` | `UserProfile.identity` | BMI, TDEE, Macro calculation, Weight goal tracking | Day 1 (Step 2) | Number, 30-300 kg (metric) or 66-660 lbs (imperial) | Public to AI | ✅ Yes (from progress logs) |
| `gender` | `UserProfile.identity` | BMR calculation refinement | Discovered Naturally | Enum: male, female, other, prefer_not_to_say | Internal Only | ❌ No |

---

## Goals & Motivation

| Field | Owner | Consumer | Collection Stage | Validation | Privacy Level | Can AI Update? |
|-------|-------|----------|-----------------|------------|---------------|----------------|
| `primaryGoal` | `UserProfile.goals` | Calorie target calculation, AI recommendations, Workout intensity | Day 1 (Step 3) | Enum: lose_fat, gain_muscle, maintain, recomp | Public to AI | ✅ Yes (quarterly check-in) |
| `targetWeightKg` | `UserProfile.preferences.goals` | Weight goal countdown, Progress dashboard | Day 1 (Step 3) | Number, must differ from current weight | Public to AI | ✅ Yes (user-driven) |
| `weeklyWeightChangeGoal` | `UserProfile.preferences.goals` | Adaptive calorie adjustments | Discovered Naturally | Number, 0.25-1.0 kg/week | Public to AI | ✅ Yes |
| `whyStarted` | `UserProfile.motivation` | AI encouragement during low motivation, Weekly reviews | Day 1 (Step 4) | String, 10-500 chars | Never Surfaced Directly | ❌ No |
| `previousAttempts` | `UserProfile.motivation` | AI coaching style adaptation, Failure pattern recognition | Discovered Naturally | Number, 0-20 | Never Surfaced Directly | ✅ Yes (inferred) |
| `motivationStyle` | `UserProfile.motivation` | AI tone and recommendation style | Discovered Naturally | Enum: data_driven, encouraging, direct, story_based | Internal Only | ✅ Yes |

---

## Activity & Fitness Experience

| Field | Owner | Consumer | Collection Stage | Validation | Privacy Level | Can AI Update? |
|-------|-------|----------|-----------------|------------|---------------|----------------|
| `activity` | `UserProfile.preferences` | TDEE calculation, Daily calorie target | Day 1 (Step 5) | Enum: sedentary, light, moderate, active, athlete | Public to AI | ✅ Yes (monthly recalibration) |
| `fitnessExperience` | `UserProfile.preferences` | Workout difficulty, Exercise complexity, AI explanation depth | Day 1 (Step 5) | Enum: beginner, intermediate, advanced | Public to AI | ✅ Yes (progression tracking) |
| `workoutLocation` | `UserProfile.preferences` | Exercise equipment availability, Workout recommendations | Discovered Naturally | Enum: home, gym, outdoor, hybrid | Public to AI | ✅ Yes |
| `availableEquipment` | `UserProfile.preferences` | Exercise selection, Alternative suggestions | Discovered Naturally | Array of strings | Public to AI | ✅ Yes |
| `workoutDaysPerWeek` | `UserProfile.preferences.goals` | Mission scheduling, Recovery recommendations | Day 1 (Step 6) | Number, 1-7 | Public to AI | ✅ Yes |
| `workoutDurationMin` | `UserProfile.preferences.goals` | Mission design, Time-based recommendations | Day 1 (Step 6) | Number, 15-180 minutes | Public to AI | ✅ Yes |
| `injuries` | `UserProfile.health` | Exercise contraindications, Form tips | Discovered Naturally | Array of strings | Internal Only | ✅ Yes |

---

## Nutrition & Diet

| Field | Owner | Consumer | Collection Stage | Validation | Privacy Level | Can AI Update? |
|-------|-------|----------|-----------------|------------|---------------|----------------|
| `dietType` | `UserProfile.preferences` | Meal recommendations, Food database filtering | Day 1 (Step 7) | Enum: vegetarian, non_vegetarian, vegan, eggetarian | Public to AI | ✅ Yes (user-driven) |
| `allergies` | `UserProfile.preferences` | Meal plan generation, Food warnings | Day 1 (Step 7) | Array of strings | Internal Only | ✅ Yes (user-driven) |
| `dislikedFoods` | `UserProfile.preferences` | Meal recommendations exclusion | Discovered Naturally | Array of strings | Public to AI | ✅ Yes |
| `cuisinePreferences` | `UserProfile.preferences` | Meal plan personalization | Discovered Naturally | Array of strings | Public to AI | ✅ Yes |
| `mealFrequency` | `UserProfile.preferences` | Meal plan structure, Reminder timing | Discovered Naturally | Number, 1-7 meals/day | Public to AI | ✅ Yes (inferred from logs) |
| `cookingSkill` | `UserProfile.preferences` | Recipe complexity | Discovered Naturally | Enum: beginner, intermediate, advanced | Public to AI | ✅ Yes |
| `mealPrepTime` | `UserProfile.preferences` | Recipe recommendations | Discovered Naturally | Number, 5-120 minutes | Public to AI | ✅ Yes |

---

## Lifestyle & Schedule

| Field | Owner | Consumer | Collection Stage | Validation | Privacy Level | Can AI Update? |
|-------|-------|----------|-----------------|------------|---------------|----------------|
| `wakeTime` | `UserProfile.preferences` | Morning reminder scheduling, Fasting window calculation | Day 1 (Step 8) | Time string HH:MM | Public to AI | ✅ Yes |
| `sleepTime` | `UserProfile.preferences` | Evening reminder scheduling, Recovery recommendations | Day 1 (Step 8) | Time string HH:MM | Public to AI | ✅ Yes |
| `sleepHours` | `UserProfile.preferences.goals` | Recovery dashboard, Sleep quality tracking | Day 1 (Step 8) | Number, 4-12 hours | Public to AI | ✅ Yes (sleep log integration) |
| `workSchedule` | `UserProfile.lifestyle` | Workout timing, Meal timing | Discovered Naturally | Enum: morning_shift, evening_shift, night_shift, flexible | Public to AI | ✅ Yes |
| `stressLevel` | `UserProfile.lifestyle` | Recovery recommendations, Training volume | Discovered Naturally | Enum: low, moderate, high | Public to AI | ✅ Yes |
| `timezone` | `UserProfile` | Time-based calculations, Reminder scheduling | Auto-detected | IANA timezone string | Internal Only | ✅ Yes (auto) |

---

## Custom Goals (Advanced)

| Field | Owner | Consumer | Collection Stage | Validation | Privacy Level | Can AI Update? |
|-------|-------|----------|-----------------|------------|---------------|----------------|
| `calories` | `UserProfile.preferences.goals` | Daily calorie target override | Day 1 (Calculated) → Editable in Settings | Number, 1000-5000 kcal | Public to AI | ✅ Yes (weekly adjustment) |
| `proteinGrams` | `UserProfile.preferences.goals` | Daily protein target override | Day 1 (Calculated) → Editable in Settings | Number, 50-400g | Public to AI | ✅ Yes (body weight changes) |
| `carbsGrams` | `UserProfile.preferences.goals` | Daily carbs target override | Day 1 (Calculated) → Editable in Settings | Number, 20-600g | Public to AI | ✅ Yes |
| `fatGrams` | `UserProfile.preferences.goals` | Daily fat target override | Day 1 (Calculated) → Editable in Settings | Number, 20-200g | Public to AI | ✅ Yes |
| `waterMl` | `UserProfile.preferences.goals` | Daily hydration target | Day 1 (Default 3000ml) → Editable | Number, 1000-6000ml | Public to AI | ✅ Yes |
| `steps` | `UserProfile.preferences.goals` | Daily step target | Day 1 (Default 10000) → Editable | Number, 1000-30000 | Public to AI | ✅ Yes |

---

## Calculated Targets (Derived, Not Collected)

| Field | Owner | Consumer | Collection Stage | Validation | Privacy Level | Can AI Update? |
|-------|-------|----------|-----------------|------------|---------------|----------------|
| `tdee` | `UserProfile.targets` | Dashboard display, Analytics | Calculated on profile save | Number, auto-calculated | Public to AI | ✅ Yes (auto-recalc) |
| `bmr` | `UserProfile.targets` | Dashboard display, Analytics | Calculated on profile save | Number, auto-calculated | Public to AI | ✅ Yes (auto-recalc) |
| `bmi` | `UserProfile.targets` | Dashboard display, Health insights | Calculated on profile save | Number, auto-calculated | Public to AI | ✅ Yes (auto-recalc) |
| `dailyCalories` | `UserProfile.targets` | Daily target (before custom override) | Calculated on profile save | Number, auto-calculated | Public to AI | ✅ Yes (auto-recalc) |
| `protein` | `UserProfile.targets` | Daily target (before custom override) | Calculated on profile save | Number, auto-calculated | Public to AI | ✅ Yes (auto-recalc) |
| `carbs` | `UserProfile.targets` | Daily target (before custom override) | Calculated on profile save | Number, auto-calculated | Public to AI | ✅ Yes (auto-recalc) |
| `fat` | `UserProfile.targets` | Daily target (before custom override) | Calculated on profile save | Number, auto-calculated | Public to AI | ✅ Yes (auto-recalc) |
| `water` | `UserProfile.targets` | Daily target (before custom override) | Calculated on profile save | Number, auto-calculated | Public to AI | ✅ Yes (auto-recalc) |

---

## App Preferences (Not Health Data)

| Field | Owner | Consumer | Collection Stage | Validation | Privacy Level | Can AI Update? |
|-------|-------|----------|-----------------|------------|---------------|----------------|
| `theme` | `SettingsStore.appearance` | Global theme application | Day 1 (Step 9) | Enum: system, dark, light | User Editable Only | ❌ No |
| `units` | `SettingsStore.localization` | Display formatting | Day 1 (Step 9) | Enum: metric, imperial | User Editable Only | ❌ No |
| `timeFormat` | `SettingsStore.localization` | Time display | Day 1 (Step 9) | Enum: 12h, 24h | User Editable Only | ❌ No |
| `language` | `SettingsStore.localization` | UI language (future) | Day 1 (Default: en) | ISO language code | User Editable Only | ❌ No |

---

## Communication Preferences

| Field | Owner | Consumer | Collection Stage | Validation | Privacy Level | Can AI Update? |
|-------|-------|----------|-----------------|------------|---------------|----------------|
| `email` | Firebase Auth | Communication, Account recovery | Pre-onboarding (Auth) | Email format | User Editable Only | ❌ No |
| `emailNotifications` | `UserProfile.communication` | Email notification service | Discovered Naturally | Boolean | User Editable Only | ❌ No |
| `reminderPreferences` | `UserProfile.communication` | Reminder scheduling | Discovered Naturally | Object | User Editable Only | ❌ No |
| `marketingConsent` | `UserProfile.communication` | Marketing emails | Discovered Naturally | Boolean | User Editable Only | ❌ No |

---

## Profile Metadata

| Field | Owner | Consumer | Collection Stage | Validation | Privacy Level | Can AI Update? |
|-------|-------|----------|-----------------|------------|---------------|----------------|
| `version` | `UserProfile` | Migration logic | On profile creation | Number, current: 2 | Internal Only | ✅ Yes (auto) |
| `onboardingCompleted` | `UserProfile` | Route guards, Feature unlocking | On onboarding completion | Boolean | Internal Only | ✅ Yes (system) |
| `createdAt` | `UserProfile` | Account age, Analytics | On profile creation | ISO timestamp | Internal Only | ❌ No |
| `updatedAt` | `UserProfile` | Sync logic, Conflict resolution | On every profile update | ISO timestamp | Internal Only | ✅ Yes (auto) |

---

## Profile Evolution Fields (Phase 2+)

These fields are **designed now, implemented later**. They are intentionally marked as optional in the schema.

| Field | Owner | Consumer | Collection Stage | Validation | Privacy Level | Can AI Update? |
|-------|-------|----------|-----------------|------------|---------------|----------------|
| `coachingStyle` | `UserProfile.preferences` | AI tone adaptation | Discovered Naturally | Enum: analytical, encouraging, direct, balanced | Internal Only | ✅ Yes (behavior inference) |
| `dataPreference` | `UserProfile.preferences` | AI response detail level | Discovered Naturally | Enum: detailed, summary, minimal | Internal Only | ✅ Yes (behavior inference) |
| `explanationDepth` | `UserProfile.preferences` | AI reasoning visibility | Discovered Naturally | Enum: explain_everything, explain_when_asked, minimal | Internal Only | ✅ Yes (behavior inference) |
| `progressPhotoConsent` | `UserProfile.communication` | Progress photo feature | Discovered Naturally | Boolean | User Editable Only | ❌ No |
| `socialSharingConsent` | `UserProfile.communication` | Social features (future) | Discovered Naturally | Boolean | User Editable Only | ❌ No |

---

## Privacy Level Definitions

| Level | Definition | Usage |
|-------|-----------|--------|
| **User Editable Only** | Only the user can view and modify this field directly | Identity, preferences |
| **Public to AI** | Can be included in AI prompt context without restriction | Health data, goals, preferences |
| **Internal Only** | Used for system logic but never shown to user directly | Metadata, calculated fields |
| **Never Surfaced Directly** | Can inform AI behavior but should never be quoted verbatim | Motivation, past failures |

---

## Collection Stage Definitions

| Stage | Timing | Experience |
|-------|--------|-----------|
| **Day 1 (Step N)** | During initial onboarding flow | Guided conversational UI |
| **Discovered Naturally** | During normal app usage when context requires it | AI asks as a follow-up question |
| **Auto-detected** | System infers without asking | Timezone, behavior patterns |
| **Calculated** | Derived from other fields | TDEE, BMR, macros |

---

## Migration Strategy

### From v1 to v2

**New fields**:
- All fields marked "Discovered Naturally" or "Profile Evolution" become optional
- Existing users continue with their v1 data
- AI contextually asks for missing fields during usage
- No forced re-onboarding

**Changed fields**:
- None (v2 is purely additive)

**Migration function**:
```typescript
function migrateUserProfileV1toV2(v1: UserProfile): UserProfile {
  return {
    ...v1,
    version: 2,
    // All new fields default to undefined (optional)
    // No data loss, no forced updates
  };
}
```

---

## Validation Rules

Every field update must pass validation before:
1. Being saved to Zustand store
2. Being written to Firestore
3. Being sent to AI context

Invalid data should:
- Show immediate user feedback (UI validation)
- Block profile save
- Log validation errors to Sentry
- Never silently fail

---

## Synchronization Contract

**One Source of Truth**: Firestore `users/{userId}/profile`

**Write Path**: 
```
UI → Zustand Store → UserSync.syncLocalChanges() → Firestore
```

**Read Path**:
```
Firestore → UserSync.hydrate() → Zustand Store → UI
```

**Draft Management** (Onboarding Only):
- Draft saved to `localStorage` with key `ascend-onboarding-draft-v2`
- Draft cleared immediately after successful Firestore write
- Draft expires after 24 hours (never persists across sessions silently)

---

## Usage Example

When building a new feature that needs user data:

1. Check this contract first
2. Identify which fields you need
3. Verify those fields are marked as "Public to AI" if using AI
4. Handle `undefined` gracefully for optional fields
5. If you need a new field, add it to this contract first, then implement

**DO NOT**:
- Add fields without updating this contract
- Store derived data in Firestore (calculate it)
- Duplicate data across multiple stores
- Assume a field exists without checking

---

## Review & Updates

This contract should be reviewed:
- Before every new onboarding feature
- Before every AI context change
- After user feedback about data collection
- During quarterly architecture reviews

Last reviewed: 2026-08-06
