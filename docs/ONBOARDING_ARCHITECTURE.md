# Onboarding Architecture — Ascend AI

**Status:** Blueprint (pre-implementation)  
**Author:** Ascend AI Engineering  
**Date:** 2026-08-06  
**Purpose:** Define the complete onboarding architecture before any Phase 1 UI is built.

---

## 1. Vision

Onboarding is not a registration form. It is the first coaching session.

By the time the user reaches Mission Control, Ascend AI should already know them well enough to:
- Greet them by name
- Show their personalized calorie and macro targets
- Give a relevant first coaching message
- Set the correct mission difficulty
- Pre-populate the AI context with real profile data

Every module in the application — Dashboard, AI Coach, Nutrition, Workout Planning, Recovery, Analytics, Progress, Mission System — consumes the same profile that onboarding produces. Onboarding is not a separate feature. It is the foundation.

---

## 2. Core Architecture Principle: Session-First, Save Once

### The wrong pattern (avoid)

```
Step 1 → Firestore write
Step 2 → Firestore write
Step 3 → Firestore write
...
Finish → Done
```

Problems: multiple partial writes, stale state on back navigation, poor offline support, harder validation, more Firestore cost.

### The correct pattern

```
Step 1 → Session draft (memory + localStorage)
Step 2 → Session draft
Step 3 → Session draft
...
Finish → Validate → calculateTargets() → Single Firestore write → Sync → Dashboard
```

**One transaction. All-or-nothing. No partial profiles.**

The session draft exists only to survive accidental page refreshes or tab closes. It is never the source of truth for the rest of the application. Firestore is the source of truth. The draft is discarded after a successful save.

---

## 3. Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    ONBOARDING SESSION                    │
│                                                          │
│  OnboardingDraft (in-memory + localStorage v2)          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  identity: UserIdentity                         │    │
│  │  primaryGoal: PrimaryGoal                       │    │
│  │  preferences: UserPreferences                   │    │
│  │  currentStep: number                            │    │
│  │  completedSteps: number[]                       │    │
│  │  startedAt: string                              │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  OnboardingContext (in-memory only — AI reads this)     │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Derived from draft on every step completion   │    │
│  │  Used by AI response generator                 │    │
│  │  Never written to Firestore directly           │    │
│  └─────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────┘
                            │ On Finish
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     COMPLETION PIPELINE                  │
│                                                          │
│  1. Validate draft (all required fields present)        │
│  2. calculateTargets(identity, goal, preferences)       │
│  3. Build UserProfile object                            │
│  4. setProfile(newProfile) — update Zustand store       │
│  5. UserSync.syncLocalChanges(userId) — single write    │
│  6. localStorage.removeItem('ascend-onboarding-v2')     │
│  7. router.replace('/')                                 │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    DOWNSTREAM CONSUMERS                  │
│                                                          │
│  All read from useUserStore().profile — same source     │
│                                                          │
│  Dashboard     → profile.targets.dailyCalories          │
│  AI Coach      → profile.identity + goals + targets     │
│  Nutrition     → profile.targets (protein, carbs, fat)  │
│  Workout       → profile.preferences.activity +         │
│                  fitnessExperience + workoutDaysPerWeek  │
│  Recovery      → profile.preferences.sleepTime +        │
│                  wakeTime + activity                     │
│  Analytics     → profile.targets (baseline comparisons) │
│  Progress      → profile.identity.weight (start weight) │
│  Missions      → profile.preferences.fitnessExperience  │
│  Smart Notifs  → profile.preferences.wakeTime +         │
│                  sleepTime + waterMl goal                │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Onboarding Steps

Each step corresponds to a single focused question or small group of closely related questions. No step should overwhelm the user.

### Step 0 — Welcome
**Type:** Cinematic / Motivational  
**Purpose:** Set the tone. This is Ascend AI, not a form.  
**AI Message:** Introduce the coach. Explain what is about to happen.  
**Data collected:** None  
**Validation:** None required

### Step 1 — Name & Nickname
**Type:** Conversational input  
**Purpose:** Personalize every future interaction  
**Fields:**
- `identity.fullName` (required)
- `identity.nickname` (optional — defaults to first name)

**AI Celebration:** "Nice to meet you, {nickname}. Let's build your plan."  
**Validation:** `fullName` must be non-empty

### Step 2 — Physical Baseline
**Type:** Interactive sliders / number inputs  
**Purpose:** Establish the foundation for TDEE and BMI calculations  
**Fields:**
- `identity.height` (required, cm or inches depending on units setting)
- `identity.weight` (required, kg or lbs)
- `identity.dob` (required — used for age in BMR calculation)

**AI Celebration:** After all three entered — "I now have enough to estimate your baseline metabolism. Keep going."  
**Validation:** Height 100–250 cm, weight 30–300 kg, dob must produce age 13–100

### Step 3 — Primary Goal
**Type:** Large visual selector (not a dropdown)  
**Purpose:** Single most important personalization signal  
**Fields:**
- `goals.primaryGoal`: `lose_fat | gain_muscle | maintain | recomp`

**AI Celebration:**
- lose_fat: "Smart choice. Fat loss is a precision game — we'll set you up for a sustainable deficit."
- gain_muscle: "Let's build. I'll set a clean surplus and optimize your protein targets."
- maintain: "Maintaining while improving fitness is underrated. We'll maximize your body composition."
- recomp: "Recomp is the advanced path. It takes patience — your AI Coach will help you stay consistent."

**Validation:** One option must be selected

### Step 4 — Activity Level & Experience
**Type:** Visual card selector  
**Purpose:** Refine TDEE multiplier and workout recommendations  
**Fields:**
- `preferences.activity`: `sedentary | light | moderate | active | athlete`
- `preferences.fitnessExperience`: `beginner | intermediate | advanced`

**AI Celebration:** "Got it. Your activity level directly affects how many calories you need — I'll factor this in."  
**Validation:** Both required

### Step 5 — Target Preview (AI-Generated Summary)
**Type:** Read-only — AI presents calculated targets  
**Purpose:** Build trust. Show the user their plan before they confirm it.  
**Computed at this step (from draft, not Firestore):**
- TDEE
- Daily calorie target
- Protein / Carbs / Fat targets
- BMI / BMR

**AI Message:** "Based on what you've told me, here's your starting plan. You can adjust these targets anytime."  
**Data collected:** None (display only)  
**Validation:** User must tap "This looks right" or "Adjust targets" before proceeding  
**Note:** If user adjusts, show manual override inputs for calories and macros. Store overrides in draft. Still only one Firestore write at the end.

### Step 6 — Dietary Preferences
**Type:** Toggle/pill selector  
**Purpose:** Personalize nutrition recommendations and AI meal suggestions  
**Fields:**
- `preferences.dietType`: `non_vegetarian | vegetarian | vegan | eggetarian`
- `preferences.allergies`: string[] (optional, multi-select common allergens)

**AI Celebration:** "Perfect. I'll make sure every meal suggestion respects your preferences."  
**Validation:** `dietType` required. Allergies optional.

### Step 7 — Daily Rhythm
**Type:** Time picker  
**Purpose:** Power smart notifications, recovery scoring, and coaching timing  
**Fields:**
- `preferences.wakeTime` (required, HH:mm)
- `preferences.sleepTime` (required, HH:mm)

**AI Celebration:** "I'll time your coaching and reminders around your schedule — not the other way around."  
**Validation:** Both required. Sleep window must be at least 4 hours.

### Step 8 — App Preferences (Optional)
**Type:** Simple toggles  
**Purpose:** Device-level settings. Not profile data.  
**Fields (go to `useSettingsStore`, NOT `UserProfile`):**
- `appearance.theme`: `system | dark | light`
- `localization.units`: `metric | imperial`
- `localization.timeFormat`: `12h | 24h`

**Note:** These are the only fields that do NOT go into `UserProfile`. They are device preferences stored in `useSettingsStore` with its own Zustand persist key.  
**Validation:** Optional — defaults are already set

### Step 9 — Completion Ceremony
**Type:** Cinematic / Celebratory  
**Purpose:** Reinforce that something meaningful just happened  
**Content:**
- Personalized greeting by nickname
- Summary of key targets (calories, protein, water, steps)
- "Your AI Coach is ready" message
- 3-second countdown to Mission Control

**Data collected:** None  
**Actions at this step:** Run the completion pipeline (see Section 3)

---

## 5. Onboarding Session Draft

### Storage key
```
ascend-onboarding-v2
```

The `v2` suffix prevents old drafts (from the previous form-based onboarding) from being incorrectly loaded into the new conversational flow.

### Schema
```typescript
interface OnboardingDraft {
  version: 2;
  userId: string;           // Tied to the current authenticated user
  currentStep: number;
  completedSteps: number[];
  startedAt: string;        // ISO timestamp — for analytics
  
  // Collected data — mirrors UserProfile fields exactly
  identity: Partial<UserIdentity>;
  primaryGoal: PrimaryGoal | null;
  preferences: Partial<UserPreferences>;
  
  // Manual target overrides (Step 5)
  targetOverrides?: Partial<UserTargets>;
}
```

### Rules
- Draft is stored in `localStorage` only — never in Firestore
- Draft is tied to `userId` — if a different user logs in, the draft is discarded
- Draft is versioned — stale v1 drafts are silently ignored and removed
- Draft is removed immediately after successful completion
- Draft is removed on logout (via `resetStoresOnLogout`)

### Resume behavior
If a user returns to `/onboarding` with a valid draft in localStorage:
- Restore all collected fields
- Resume from `currentStep`
- Show a brief "Welcome back — let's continue where you left off" message
- Do not restart from Step 0

---

## 6. Onboarding Context (AI Reads This)

The AI coach needs context to generate personalized celebration messages and explanations. It must never read from Firestore during onboarding (the profile doesn't exist yet). It reads from the draft.

```typescript
interface OnboardingContext {
  // What we know so far
  nickname: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  primaryGoal: PrimaryGoal | null;
  activity: ActivityLevel | null;
  fitnessExperience: string | null;
  dietType: DietType | null;
  
  // Computed estimates (available after Step 2 is complete)
  estimatedBMR: number | null;
  estimatedTDEE: number | null;
  estimatedDailyCalories: number | null;
  estimatedProtein: number | null;
  
  // Progress
  completedSteps: number[];
  currentStep: number;
}
```

This context is built by `buildOnboardingContext(draft)` — a pure function that takes the current draft state and returns the context object. The AI message generator receives this context and produces step-appropriate, personalized text.

**Key rule:** The AI message generator must only reference fields that are non-null in the context. It must never invent values. If `estimatedDailyCalories` is null (because Step 2 isn't done yet), the AI cannot mention calorie targets.

---

## 7. `calculateTargets()` — Moved to Shared Utility

**Current location:** Embedded in `app/onboarding/page.tsx`  
**New location:** `lib/calculations/targets.ts`

This function must be extracted before Phase 1 implementation begins. Reason: both the onboarding flow and the AI coach need to call it. As long as it lives in the page component, the AI cannot reuse it.

```typescript
// lib/calculations/targets.ts
export function calculateTargets(
  identity: UserIdentity,
  goal: PrimaryGoal,
  preferences: UserPreferences
): UserTargets

export function estimateTargetsFromPartial(
  identity: Partial<UserIdentity>,
  goal: PrimaryGoal | null,
  preferences: Partial<UserPreferences>
): Partial<UserTargets>  // Used by onboarding context during mid-flow estimates
```

---

## 8. Required and Optional Fields

| Field | Required | Used by |
|-------|----------|---------|
| `identity.fullName` | ✅ | AI Coach greeting, all personalization |
| `identity.nickname` | ❌ | AI Coach greeting (falls back to first name) |
| `identity.dob` | ✅ | BMR calculation (age) |
| `identity.height` | ✅ | BMI, BMR |
| `identity.weight` | ✅ | BMR, protein targets, start weight tracking |
| `goals.primaryGoal` | ✅ | Calorie deficit/surplus, AI coaching tone, missions |
| `preferences.activity` | ✅ | TDEE multiplier |
| `preferences.fitnessExperience` | ✅ | Mission difficulty, workout recommendations |
| `preferences.dietType` | ✅ | Nutrition AI, meal suggestions |
| `preferences.allergies` | ❌ | Nutrition AI (filtered suggestions) |
| `preferences.wakeTime` | ✅ | Smart notifications, recovery scoring |
| `preferences.sleepTime` | ✅ | Smart notifications, sleep goal |
| `preferences.goals.waterMl` | ❌ | Defaults to 3000ml |
| `preferences.goals.steps` | ❌ | Defaults to 10000 |
| `preferences.goals.workoutDaysPerWeek` | ❌ | Defaults to 4 |
| `targets.*` | Auto-computed | All modules |

---

## 9. Sync Path

```
OnboardingDraft (localStorage)
        │
        │ On completion
        ▼
calculateTargets() → UserTargets
        │
        ▼
Build UserProfile { version: 1, onboardingCompleted: true, identity, goals, preferences, targets }
        │
        ▼
useUserStore.setProfile(newProfile)     ← Zustand in-memory state
        │
        ▼
UserSync.syncLocalChanges(userId)       ← Single Firestore write: users/{uid}.profile
        │
        ▼
UserSync.start(userId) listener picks up the write
        │
        ▼
useUserStore.setProfile() called again (idempotent — same data)
        │
        ▼
All downstream consumers automatically update via Zustand subscriptions
```

No other collections are written. No other stores are touched. One document. One path.

---

## 10. Routing Integration

The existing routing logic in `lib/auth/post-auth-routing.ts` already handles onboarding gating:

```typescript
// Already in place — no changes needed
if (AUTH_ROUTES.includes(pathname)) {
  return isOnboarded(profile) ? "/" : ONBOARDING_ROUTE;
}
if (pathname === "/" && needsOnboarding(profile)) {
  return ONBOARDING_ROUTE;
}
```

`onboardingCompleted: false` sends new users to `/onboarding`.  
`onboardingCompleted: true` sends returning users to `/`.  
This does not change in Phase 1.

The only addition needed: if a user abandons mid-onboarding and returns, they should resume from their last step (using the draft), not restart from Step 0.

---

## 11. Adding Future Onboarding Steps

When future versions expand onboarding (e.g., "Connect wearable", "Upload progress photo", "Set weekly targets"), the process is:

1. Add the new field to `UserProfile` / `UserPreferences` / `UserTargets` in `types/user.ts`
2. Add the field to `OnboardingDraft` schema
3. Add the new step to the step sequence (insert or append)
4. Update the `completedSteps` tracking
5. The draft version does NOT need to change unless the schema is breaking
6. Existing users (already onboarded) are unaffected — `onboardingCompleted: true` means they never see the flow again
7. If new fields should also be collected from existing users, add them to the settings/profile page instead — do not re-trigger the full onboarding flow

**Never re-run onboarding for already-onboarded users.** Add profile expansion flows to the settings page.

---

## 12. What Downstream Modules Expect

Every module reads from `useUserStore().profile`. After onboarding completes, these are the fields each module depends on:

**Dashboard**
- `profile.identity.nickname` — greeting
- `profile.targets.dailyCalories` — calorie widget goal
- `profile.targets.protein` — protein widget goal
- `profile.targets.water` — hydration widget goal
- `profile.preferences.goals.steps` — steps widget goal

**AI Coach**
- `profile.identity` — name, age (from dob), weight
- `profile.goals.primaryGoal` — coaching tone and recommendations
- `profile.preferences` — diet type, activity, sleep schedule
- `profile.targets` — what to reference when discussing progress

**Nutrition**
- `profile.targets.dailyCalories` — daily calorie goal
- `profile.targets.protein` — protein goal
- `profile.targets.carbs` — carbs goal
- `profile.targets.fat` — fat goal
- `profile.preferences.dietType` — meal filter
- `profile.preferences.allergies` — exclusion list

**Training / Workouts**
- `profile.preferences.fitnessExperience` — difficulty level
- `profile.preferences.activity` — volume recommendations
- `profile.preferences.goals.workoutDaysPerWeek` — weekly plan

**Recovery**
- `profile.preferences.wakeTime` / `sleepTime` — sleep window calculation
- `profile.preferences.goals.sleepHours` — sleep target
- `profile.preferences.activity` — recovery load estimation

**Analytics / Progress**
- `profile.identity.weight` — start weight baseline
- `profile.targets` — goal comparison baselines
- `profile.identity.dob` — age-adjusted benchmarks

**Mission System**
- `profile.preferences.fitnessExperience` — mission difficulty tier
- `profile.goals.primaryGoal` — mission category weighting

**Smart Notifications**
- `profile.preferences.wakeTime` — morning briefing time
- `profile.preferences.sleepTime` — sleep reminder time
- `profile.preferences.goals.waterMl` — hydration reminder frequency

---

## 13. Cleanup on Logout

When a user logs out, `resetStoresOnLogout()` must also remove any onboarding draft:

```typescript
// In lib/auth/reset-stores.ts — add this line
localStorage.removeItem('ascend-onboarding-v2');
```

This prevents a logged-out user's draft from pre-filling a different user's onboarding on the same device.

---

## 14. Analytics Events (Future)

Once the onboarding is live, these events should be tracked for funnel analysis:

| Event | Trigger |
|-------|---------|
| `onboarding_started` | Step 0 viewed |
| `onboarding_step_completed` | Each step completed, with `{ step: number }` |
| `onboarding_abandoned` | User leaves before completion (detected on return) |
| `onboarding_resumed` | User returns with a valid draft |
| `onboarding_completed` | Completion pipeline succeeds |

These feed directly into understanding where users drop off and which steps cause friction.

---

## 15. Pre-Implementation Checklist

Before writing any onboarding UI, complete these prerequisites:

- [ ] Extract `calculateTargets()` to `lib/calculations/targets.ts`
- [ ] Add `estimateTargetsFromPartial()` alongside it
- [ ] Add `onboardingStep: number` field to `UserProfile` (optional, additive)
- [ ] Add `localStorage.removeItem('ascend-onboarding-v2')` to `resetStoresOnLogout()`
- [ ] Define `OnboardingDraft` and `OnboardingContext` TypeScript interfaces in `types/onboarding.ts`
- [ ] Remove old draft key `ascend-onboarding-draft` cleanup logic (replaced by v2)

Only after these five items are done should Phase 1 UI work begin.

---

## Summary

| Concern | Decision |
|---------|----------|
| Where draft lives | `localStorage` only (`ascend-onboarding-v2`) |
| When Firestore is written | Once, on completion |
| AI context source | Draft (not Firestore) |
| Target calculation | `lib/calculations/targets.ts` (shared utility) |
| Data model changes | Additive only — existing `UserProfile` shape preserved |
| Downstream consumers | All read `useUserStore().profile` — zero new data paths |
| Resume behavior | Restore from draft, resume from `currentStep` |
| Settings vs Profile | Theme/units/timeFormat → `useSettingsStore`. Everything else → `UserProfile` |
| Sync path | `UserSync.syncLocalChanges()` → single `users/{uid}` document write |
| Future expansion | Add fields to existing types, add steps to sequence, existing users unaffected |
