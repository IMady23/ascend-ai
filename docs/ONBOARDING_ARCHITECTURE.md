# Onboarding Architecture — Ascend AI

**Status:** Blueprint v2 (pre-implementation)
**Author:** Ascend AI Engineering
**Date:** 2026-08-06
**Purpose:** Complete onboarding architecture including experience layer, data model extensions, and phased step design.

---

## 1. Vision

Onboarding is not a registration form. It is the first coaching session.

By the time the user reaches Mission Control, Ascend AI should already know them well enough to:
- Greet them by name
- Show personalized calorie and macro targets
- Give a relevant first coaching message
- Set the correct mission difficulty
- Pre-populate the AI context with real profile data

Every module — Dashboard, AI Coach, Nutrition, Workout, Recovery, Analytics, Progress, Missions — consumes the same profile that onboarding produces. Onboarding is the foundation, not a separate feature.

**Each answer must feel valuable.** After every step, the AI acknowledges what it just learned and explains how it will use that information. Users should feel coached, not registered.

---

## 2. Core Architecture Principle: Session-First, Save Once

### Avoid: step-by-step Firestore writes

```
Step 1 → Firestore
Step 2 → Firestore
Step 3 → Firestore
```

### Use: session draft, single save

```
Step 1 → Draft (memory + localStorage)
Step 2 → Draft
Step 3 → Draft
...
Finish → Validate → calculateTargets() → Single Firestore write → Dashboard
```

One transaction. All-or-nothing. No partial profiles. No sync issues.

---

## 3. Full Step Sequence (v2 — Expanded)

Steps are deliberately short. One focused question per screen.
Progress bar shows estimated minutes remaining, not just step count.

```
Step  0 — Welcome Ceremony
Step  1 — Name
Step  2 — Height           ← each physical metric gets its own interaction
Step  3 — Weight
Step  4 — Date of Birth
Step  5 — Why (Motivation / Emotional Reason)
Step  6 — Primary Goal
Step  7 — Target Weight    ← shown only if goal is lose_fat or gain_muscle
Step  8 — Milestone Preview
Step  9 — Activity Level
Step 10 — Fitness Experience
Step 11 — Workout Preference (Gym / Home / Running / Sports / Mix)
Step 12 — Target Preview   ← AI-computed, display only. User can adjust.
Step 13 — Diet Type
Step 14 — Food Culture     ← preferred cuisine
Step 15 — Allergies        ← optional
Step 16 — Wearable
Step 17 — Daily Rhythm (Wake time)
Step 18 — Daily Rhythm (Sleep time)
Step 19 — Coaching Style
Step 20 — App Preferences  ← theme, units, time format
Step 21 — Completion Ceremony
```

Estimated duration: 3–4 minutes displayed to user.
Each step shows the achievement milestone at 25%, 50%, 75%, 100%.

---

## 4. Step Details

### Step 0 — Welcome Ceremony
**Type:** Cinematic, full-screen  
**Purpose:** Set the tone. This is not a form. This is your first coaching session.  
**AI speaks first:** Introduces itself, explains what's about to happen and why each answer matters.  
**Data:** None collected  
**Progress:** 0 min remaining shown

---

### Step 1 — Name
**Type:** Single large text input  
**Fields:** `identity.fullName` (required), `identity.nickname` (optional)  
**AI Celebration:** "Nice to meet you, {nickname}. Let's build your plan together."  
**Feature Unlock Hint:** "Your name helps me personalize every coaching message."  
**Validation:** fullName non-empty

---

### Step 2 — Height
**Type:** Large vertical slider with numeric display + unit toggle (cm / ft-in)  
**Fields:** `identity.height` (required)  
**AI Celebration:** "Got it. Height is one of the inputs for your metabolism calculation."  
**Validation:** 100–250 cm

---

### Step 3 — Weight
**Type:** Large horizontal wheel picker or number input  
**Fields:** `identity.weight` (required, current weight)  
**AI Celebration:** "I now have two of three measurements. One more and I can start estimating your plan."  
**Validation:** 30–300 kg

---

### Step 4 — Date of Birth
**Type:** Segmented date picker (day / month / year)  
**Fields:** `identity.dob` (required)  
**AI Celebration:** "Your age is a key input for your Basal Metabolic Rate — I'll factor this in precisely."  
**Validation:** Must produce age 13–100  
**Achievement unlock at Step 4:** 🎉 "Physical Profile Complete — AI baseline ready."

---

### Step 5 — Why (Emotional Motivation)
**Type:** Large icon grid (single select)  
**Purpose:** Most fitness apps never ask this. It becomes the emotional anchor of the AI's coaching tone.  
**Fields:** `identity.motivationReason` (required)  
**Options:**
- ❤️ Better Health
- 💪 Better Body
- 🏃 Better Fitness
- 👮 Professional Requirement (Police / Military)
- 🏏 Sports Performance
- 🎯 Personal Confidence
- 🎓 College / Campus Life
- 💍 Life Event (Wedding / Reunion)
- 🧠 Mental Clarity
- 🔥 Just Getting Started

**AI Celebration (example for "Personal Confidence"):**
"That's a powerful reason. I'll make sure every recommendation connects back to how you want to feel — not just how you look."

**How it's used by downstream modules:**
- AI Coach uses this as the emotional framing for all coaching messages
- Mission descriptions reference the user's "why"
- Weekly review messages tie progress back to the motivation

---

### Step 6 — Primary Goal
**Type:** Large visual card selector (4 options, full-width cards with icon + description)  
**Fields:** `goals.primaryGoal`: `lose_fat | gain_muscle | maintain | recomp`  
**AI Celebration:**
- lose_fat: "Smart. Fat loss is about precision. I'll set a sustainable deficit — nothing extreme."
- gain_muscle: "Let's build. I'll configure a clean surplus and maximize your protein targets."
- maintain: "Maintaining while improving is underrated. I'll optimize your body composition."
- recomp: "Recomp takes patience and consistency. I'll be with you every step."

**Feature Unlock Hint:** "This shapes your calorie target, meal plan, and mission difficulty."

---

### Step 7 — Target Weight (Conditional)
**Type:** Number input with current weight shown as reference  
**Shown when:** `primaryGoal === 'lose_fat' || primaryGoal === 'gain_muscle'`  
**Fields:** `identity.targetWeight` (optional — if skipped, AI uses goal-based defaults)  
**Validation:** Lose fat: targetWeight must be < currentWeight. Gain: must be > currentWeight.  
**Achievement unlock at Step 7:** 🎉 "25% Complete — Goal locked in."

---

### Step 8 — Milestone Preview
**Type:** Animated journey visualization (read-only)  
**Purpose:** Build emotional investment before continuing.  
**What it shows:**

```
91 kg → 85 kg → 78 kg → 70 kg → 63 kg
```

AI says: "We'll celebrate every milestone together. Each checkpoint unlocks a new chapter in your journey."

Steps shown as glowing orbs on a progress line. Each one labelled with an estimated timeframe (e.g., "4 weeks", "8 weeks").

This is not a commitment — it's a preview to build excitement.  
**Data:** None collected  
**No back button shown here** — the moment should not be interrupted

---

### Step 9 — Activity Level
**Type:** Visual card selector with lifestyle descriptions (not just labels)  
**Fields:** `preferences.activity`: `sedentary | light | moderate | active | athlete`  
**Each option shows:** Icon + lifestyle description + example ("3–5 workouts/week")  
**AI Celebration:** "Your activity level affects your daily calorie target by up to 700 kcal. I'll calculate precisely."  
**Feature Unlock Hint:** "This is one of the biggest inputs for your nutrition plan."

---

### Step 10 — Fitness Experience
**Type:** Visual card selector  
**Fields:** `preferences.fitnessExperience`: `beginner | intermediate | advanced`  
**AI Celebration:**
- beginner: "No worries — I'll keep recommendations simple and progressive."
- intermediate: "You've built a solid base. I'll push you intelligently."
- advanced: "I'll match your level. Expect detailed, data-driven coaching."

**How it's used:** Mission difficulty, workout plan complexity, AI coaching depth

---

### Step 11 — Workout Preference
**Type:** Multi-select pill buttons (user can select multiple)  
**Fields:** `preferences.workoutPreference`: `gym | home | running | sports | mixed` (new field)  
**AI Celebration:** "I'll make sure every workout recommendation works with what you actually have access to."  
**Feature Unlock Hint:** "Your AI Workout Planner will use this to suggest relevant sessions."  
**Achievement unlock at Step 11:** 🎉 "50% Complete — Fitness profile ready. AI Workout Planner unlocked."  
**Validation:** At least one option required

---

### Step 12 — Target Preview (AI-Computed)
**Type:** Read-only display — full-screen results card  
**Purpose:** Show the user their personalized plan before continuing. Build trust.  
**What's shown:**
- Daily calorie target
- Protein / Carbs / Fat
- BMI / BMR / TDEE
- Estimated weekly deficit or surplus
- Projected timeline to target weight (if target weight was entered)

**AI speaks:** "Based on everything you've told me, here's your starting plan. These are science-backed estimates — not guesses. You can refine them any time from Settings."

**User options:** "This looks right →" or "Let me adjust →" (shows manual override inputs for calories and macros)

**Data:** No new fields collected. `targetOverrides` updated in draft if user adjusts.

---

### Step 13 — Diet Type
**Type:** Visual icon grid  
**Fields:** `preferences.dietType`: `non_vegetarian | vegetarian | vegan | eggetarian`  
**AI Celebration:** "Got it. Every meal suggestion I make will respect your dietary choice — automatically."  
**Feature Unlock Hint:** "This activates your AI Nutrition Assistant with personalized meal recommendations."

---

### Step 14 — Food Culture (Preferred Cuisine)
**Type:** Multi-select grid with flag/food icons  
**Fields:** `preferences.preferredCuisines`: string[] (new field)  
**Options:** Indian, South Indian, North Indian, Mediterranean, Chinese, Continental, Japanese, Middle Eastern, Mix / No Preference  
**AI Celebration:** "Your meal suggestions will now match your taste, not just your macros."  
**Feature Unlock Hint:** "This makes your meal plans far more practical to follow day-to-day."  
**Validation:** At least one required  
**Achievement unlock at Step 14:** 🎉 "75% Complete — Nutrition AI fully personalized."

---

### Step 15 — Allergies (Optional)
**Type:** Multi-select pill buttons  
**Fields:** `preferences.allergies`: string[]  
**Common options:** Nuts, Dairy, Gluten, Eggs, Soy, Shellfish, None  
**AI Celebration:** "I'll filter these out of every recommendation automatically — you won't need to check labels."  
**Validation:** Optional — "None" is a valid selection

---

### Step 16 — Wearable
**Type:** Single-select grid with device icons  
**Purpose:** Capture for future integration. Even if not connected now, we know the user's ecosystem.  
**Fields:** `preferences.wearable`: `apple_health | google_fit | samsung_health | garmin | fitbit | none` (new field)  
**AI says:** "Even if we don't connect it right now, I'll remember this for when the integration is ready."  
**Validation:** Required (none is a valid choice)

---

### Step 17 — Wake Time
**Type:** iOS-style scroll wheel time picker  
**Fields:** `preferences.wakeTime` (required, HH:mm)  
**AI Celebration:** "I'll schedule your morning briefing right after you wake up — when you're ready to plan your day."

---

### Step 18 — Sleep Time
**Type:** iOS-style scroll wheel time picker  
**Fields:** `preferences.sleepTime` (required, HH:mm)  
**AI Celebration:** "Your recovery scoring and sleep reminders will be timed around your schedule."  
**Validation:** Sleep window must be at least 5 hours

---

### Step 19 — Coaching Style
**Type:** Visual card selector  
**Purpose:** Personalizes the AI's tone for every future interaction  
**Fields:** `preferences.coachingStyle`: `friendly | strict | scientific | motivational | balanced` (new field)  
**Options with description:**
- 🤝 Friendly — Warm, encouraging, supportive
- ⚡ Strict — Direct, no excuses, performance-focused
- 🔬 Scientific — Data-driven, detailed explanations
- 🔥 Motivational — High-energy, challenge-oriented
- ⚖️ Balanced — Mix of all styles

**AI Celebration:** "Perfect. I'll adapt my coaching style to match how you like to be guided."  
**How it's used:** Every AI response is tone-adjusted based on this value. The same nutrition advice delivered with "Strict" tone vs "Friendly" tone sounds completely different.

---

### Step 20 — App Preferences
**Type:** Simple toggle cards  
**Purpose:** Device-level settings. NOT profile data.  
**Fields (written to `useSettingsStore`, NOT `UserProfile`):**
- Theme: System / Dark / Light
- Units: Metric / Imperial
- Time Format: 12h / 24h

**Note:** These are the ONLY fields in onboarding that do not go into `UserProfile`.

---

### Step 21 — Completion Ceremony
**Type:** Cinematic, full-screen, sequential animation  
**Purpose:** Make this moment memorable. The user just did something meaningful.

**Sequence:**

```
Analyzing your profile...        (800ms)
Building Nutrition Plan...       (800ms)
Generating Workout Program...    (800ms)
Training your AI Coach...        (800ms)
Calibrating Recovery System...   (800ms)
━━━━━━━━━━━━━━━━━━━━
Mission Ready.
Welcome, {nickname}.
```

Then Mission Control opens with a personalized first AI message already loaded.

**Actions at this step:** Run the completion pipeline (validate → calculateTargets → save → sync).

---


## 5. Achievement Milestones During Onboarding

Progress feels like progress, not form-filling. Four milestone moments:

| Milestone | Trigger | Message |
|-----------|---------|---------|
| 25% | Step 4 complete | 🎉 "Physical Profile Complete — AI baseline ready." |
| 50% | Step 11 complete | 🎉 "Fitness Profile Ready — Workout Planner unlocked." |
| 75% | Step 14 complete | 🎉 "Nutrition AI Fully Personalized." |
| 100% | Completion ceremony | 🎉 "Welcome to Ascend AI — Your Mission Begins." |

Each milestone shows a brief celebration animation (confetti, glow pulse) and displays what was just unlocked in the app.

---

## 6. Feature Unlock Timeline

After each group of steps, the AI teases what just became available. This makes every answer feel valuable.

| After step | AI says |
|------------|---------|
| Name | "I can now address you personally in every coaching message." |
| Physical baseline | "I can now estimate your baseline metabolism." |
| Motivation | "I'll frame every coaching message around your personal reason." |
| Goal | "Your calorie target, meal plan, and mission difficulty are now calibrated." |
| Activity + Experience | "Your workout recommendations are now personalized." |
| Workout preference | "Your AI Workout Planner is active." |
| Diet + Cuisine | "Your Nutrition Assistant now has everything it needs for meal suggestions." |
| Wearable | "I'll connect your device data when integration is available." |
| Daily rhythm | "Your reminders and recovery scoring are now timed to your schedule." |
| Coaching style | "Your AI Coach has adopted your preferred communication style." |

---

## 7. Progress Indicator Design

Show both step count and estimated time remaining.

```
Step 9 of 21  ·  About 2 minutes remaining
[████████████░░░░░░░░░░░░] 43%
```

The time estimate counts down step by step (pre-calculated average time per step based on question type). This makes the experience feel fast even when it's thorough.

---

## 8. Data Model Extensions

The following new fields must be added to `types/user.ts` before Phase 1 begins. All are additive — no existing fields are changed.

```typescript
// New types
export type CoachingStyle = 'friendly' | 'strict' | 'scientific' | 'motivational' | 'balanced';
export type WorkoutPreference = 'gym' | 'home' | 'running' | 'sports' | 'mixed';
export type WearableDevice = 'apple_health' | 'google_fit' | 'samsung_health' | 'garmin' | 'fitbit' | 'none';
export type MotivationReason =
  | 'better_health' | 'better_body' | 'better_fitness'
  | 'professional' | 'sports' | 'confidence'
  | 'college' | 'life_event' | 'mental_clarity' | 'getting_started';

// Extensions to UserIdentity
export interface UserIdentity {
  fullName: string;
  nickname: string;
  dob: string;
  height: number;
  weight: number;
  targetWeight?: number;          // NEW — optional, only set if goal is lose_fat/gain_muscle
  motivationReason?: MotivationReason;  // NEW
}

// Extensions to UserPreferences
export interface UserPreferences {
  activity: ActivityLevel;
  fitnessExperience: 'beginner' | 'intermediate' | 'advanced';
  wakeTime: string;
  sleepTime: string;
  dietType: DietType;
  allergies: string[];
  goals?: UserCustomGoals;
  coachingStyle?: CoachingStyle;           // NEW
  workoutPreference?: WorkoutPreference[]; // NEW — multi-select
  preferredCuisines?: string[];            // NEW — multi-select
  wearable?: WearableDevice;               // NEW
}

// Extension to UserProfile
export interface UserProfile {
  version: 1;
  onboardingCompleted: boolean;
  onboardingStep?: number;         // NEW — tracks resume position
  profileCompleteness?: number;    // NEW — 0–100, updated after each profile change
  timezone?: string;
  identity?: UserIdentity;
  goals?: { primaryGoal: PrimaryGoal };
  preferences?: UserPreferences;
  communication?: NotificationPreferences;
  targets?: UserTargets;
  createdAt: string;
  updatedAt: string;
}
```

---

## 9. Profile Completeness Score

Every profile field has a weight. The score is computed whenever `UserProfile` changes.

```
lib/calculations/profileCompleteness.ts

export function calculateProfileCompleteness(profile: UserProfile): number
```

**Weight distribution:**

| Field group | Weight |
|-------------|--------|
| identity (fullName, dob, height, weight) | 20% |
| goals.primaryGoal | 10% |
| preferences.activity + fitnessExperience | 10% |
| preferences.dietType | 10% |
| preferences.wakeTime + sleepTime | 10% |
| targets (auto-computed) | 10% |
| identity.motivationReason | 5% |
| identity.targetWeight | 5% |
| preferences.coachingStyle | 5% |
| preferences.workoutPreference | 5% |
| preferences.preferredCuisines | 5% |
| preferences.wearable | 3% |
| preferences.allergies | 2% |

A user who completes full onboarding reaches ~95%. The remaining 5% comes from connecting a wearable device or adding allergies (both optional). This gives users a reason to return to their profile after onboarding.

**Displayed in:**
- Settings → Profile page: "Profile 95% complete"
- Control Room: System health panel
- AI Coach first message if < 80%: "I notice your profile isn't fully set up yet — filling in your coaching style and workout preferences will help me personalize your plan further."

---

## 10. OnboardingDraft Schema (v2)

```typescript
// types/onboarding.ts

export interface OnboardingDraft {
  version: 2;
  userId: string;
  currentStep: number;
  completedSteps: number[];
  startedAt: string;

  // Collected data
  identity: Partial<UserIdentity>;
  primaryGoal: PrimaryGoal | null;
  preferences: Partial<UserPreferences>;

  // Manual target overrides (Step 12)
  targetOverrides?: Partial<UserTargets>;
}

export interface OnboardingContext {
  nickname: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  targetWeight: number | null;
  motivationReason: MotivationReason | null;
  primaryGoal: PrimaryGoal | null;
  activity: ActivityLevel | null;
  fitnessExperience: string | null;
  workoutPreference: WorkoutPreference[] | null;
  dietType: DietType | null;
  preferredCuisines: string[] | null;
  coachingStyle: CoachingStyle | null;
  wearable: WearableDevice | null;

  // Computed (available once Step 2–4 are complete)
  estimatedBMR: number | null;
  estimatedTDEE: number | null;
  estimatedDailyCalories: number | null;
  estimatedProtein: number | null;
  estimatedWeeksToGoal: number | null;

  // Progress
  completedSteps: number[];
  currentStep: number;
  totalSteps: number;
  estimatedMinutesRemaining: number;
  completenessPercent: number;
}
```

**Key rule:** The AI message generator may only reference fields that are non-null in the context. No invented values.

---


## 11. Completion Pipeline

```
OnboardingDraft (localStorage v2)
        │
        ▼
1. Validate all required fields present
        │
        ▼
2. calculateTargets(identity, goal, preferences)
   → lib/calculations/targets.ts
        │
        ▼
3. calculateProfileCompleteness(newProfile)
        │
        ▼
4. Build UserProfile {
     version: 1,
     onboardingCompleted: true,
     onboardingStep: 21,
     profileCompleteness: <computed>,
     identity, goals, preferences, targets
   }
        │
        ▼
5. settingsStore.updateAppearance({ theme })
   settingsStore.updateLocalization({ units, timeFormat })
        │
        ▼
6. useUserStore.setProfile(newProfile)    ← Zustand
        │
        ▼
7. UserSync.syncLocalChanges(userId)      ← Single Firestore write
        │
        ▼
8. localStorage.removeItem('ascend-onboarding-v2')
        │
        ▼
9. router.replace('/')
```

One document written. One sync path. Zero regressions possible.

---

## 12. Required vs Optional Fields

| Field | Required | Default if absent |
|-------|----------|-------------------|
| `identity.fullName` | ✅ | — |
| `identity.nickname` | ❌ | First word of fullName |
| `identity.dob` | ✅ | — |
| `identity.height` | ✅ | — |
| `identity.weight` | ✅ | — |
| `identity.targetWeight` | ❌ | Goal-based estimate |
| `identity.motivationReason` | ✅ | — |
| `goals.primaryGoal` | ✅ | — |
| `preferences.activity` | ✅ | — |
| `preferences.fitnessExperience` | ✅ | — |
| `preferences.workoutPreference` | ✅ | `['mixed']` |
| `preferences.dietType` | ✅ | — |
| `preferences.preferredCuisines` | ✅ | `['mixed']` |
| `preferences.allergies` | ❌ | `[]` |
| `preferences.wearable` | ✅ | `'none'` |
| `preferences.wakeTime` | ✅ | — |
| `preferences.sleepTime` | ✅ | — |
| `preferences.coachingStyle` | ✅ | `'balanced'` |
| `targets.*` | Auto-computed | — |

---

## 13. Downstream Module Map

| Module | Fields consumed |
|--------|----------------|
| Dashboard | targets.dailyCalories, targets.protein, targets.water, preferences.goals.steps, identity.nickname |
| AI Coach | identity (all), goals.primaryGoal, identity.motivationReason, preferences (all), targets, preferences.coachingStyle |
| Nutrition | targets.*, preferences.dietType, preferences.preferredCuisines, preferences.allergies |
| Workouts | preferences.fitnessExperience, preferences.activity, preferences.workoutPreference, preferences.goals.workoutDaysPerWeek |
| Recovery | preferences.wakeTime, preferences.sleepTime, preferences.activity, preferences.goals.sleepHours |
| Analytics | identity.weight, targets.*, identity.dob |
| Missions | preferences.fitnessExperience, goals.primaryGoal, identity.motivationReason |
| Notifications | preferences.wakeTime, preferences.sleepTime, preferences.goals.waterMl, preferences.wearable |
| Profile completeness | All fields |

---

## 14. Routing (No Changes Needed)

Existing logic in `lib/auth/post-auth-routing.ts` already handles gating:

```typescript
if (pathname === "/" && needsOnboarding(profile)) return "/onboarding";
if (pathname === "/onboarding" && isOnboarded(profile)) return "/";
```

No changes needed. `onboardingCompleted: true` still routes to Mission Control.

Resume from draft: detected on mount in the onboarding page. If a valid v2 draft exists for the current `userId`, restore fields and jump to `draft.currentStep`.

---

## 15. Cleanup on Logout

```typescript
// lib/auth/reset-stores.ts — add these lines
localStorage.removeItem('ascend-onboarding-v2');
localStorage.removeItem('ascend-onboarding-draft'); // remove legacy key too
```

---

## 16. Adding Future Steps

1. Add new type/field to `types/user.ts` (additive only)
2. Add field to `OnboardingDraft` and `OnboardingContext`
3. Insert step into sequence, update `totalSteps`
4. Update `completedSteps` achievement thresholds if needed
5. Existing onboarded users are never affected (`onboardingCompleted: true`)
6. New fields for existing users go in Settings → Profile page, not onboarding

---

## 17. Pre-Implementation Checklist

Complete all of these before any UI work begins:

- [ ] Add new types to `types/user.ts` (CoachingStyle, WorkoutPreference, WearableDevice, MotivationReason)
- [ ] Extend `UserIdentity`, `UserPreferences`, `UserProfile` with new fields
- [ ] Create `lib/calculations/targets.ts` — extract `calculateTargets()` from onboarding page
- [ ] Create `lib/calculations/profileCompleteness.ts`
- [ ] Create `types/onboarding.ts` — define `OnboardingDraft` and `OnboardingContext`
- [ ] Add `localStorage.removeItem('ascend-onboarding-v2')` and `ascend-onboarding-draft` to `resetStoresOnLogout()`
- [ ] Remove old onboarding draft logic from `app/onboarding/page.tsx`

---

## 18. Summary

| Concern | Decision |
|---------|----------|
| Draft storage | `localStorage` only (`ascend-onboarding-v2`) |
| Firestore writes | Once, on completion |
| AI context source | Draft — never Firestore mid-flow |
| Target calculation | `lib/calculations/targets.ts` (shared utility) |
| Data model changes | Additive only — no breaking changes |
| Settings vs Profile | Theme/units/timeFormat → `useSettingsStore`. Everything else → `UserProfile` |
| Sync path | `UserSync.syncLocalChanges()` → single document |
| Resume behavior | Draft restored, `currentStep` resumed |
| Step count | 21 steps (0–21 inclusive) |
| Estimated duration | 3–4 minutes |
| Profile completeness | Computed field, updated on every profile change |
| Coaching style | Part of `UserPreferences`, consumed by AI on every message |
| Milestone celebrations | At steps 4, 11, 14, 21 |
| Feature unlock hints | After each step group |
| Completion ceremony | Cinematic sequence before Mission Control |
