# Phase 2A Infrastructure — Audit Report

**Date**: 2026-08-06  
**Purpose**: Identify what exists, what to reuse, what to replace, what to build new

---

## Existing Onboarding

**File**: `app/onboarding/page.tsx`

**Status**: V1 implementation exists — 4 steps, basic form, inline calculation logic

**What works**:
- Draft persistence (`ascend-onboarding-draft` localStorage key)
- Settings sync (calls `updateAppearance`, `updateLocalization`)
- Target calculation logic (BMR, TDEE, macros — inline in component)
- UserSync integration
- Post-completion redirect
- Resume from draft
- Progress indicator (dots)

**What doesn't align with new design**:
- Only 4 steps (new design: 11 steps)
- No conversational UI (text inputs, dropdowns only)
- No coach messages
- No animations beyond basic motion
- Calculation logic inline (should be extracted to `lib/calculations/`)
- Creates V1 profile (not V2)
- No wheel pickers, choice cards, timeline selectors
- No milestone celebration

**Decision**: **Replace entirely**. The new design is fundamentally different. Extract calculation logic to shared utility, discard the rest.

---

## Routing & Guards

**File**: `lib/auth/post-auth-routing.ts`

**Status**: Solid. Works with existing V1 profiles.

**What works**:
- `isOnboarded()` — checks `profile?.onboardingCompleted === true`
- `needsOnboarding()` — checks if profile exists but incomplete
- `resolvePostAuthRoute()` — returns redirect or null
- Handles auth routes, onboarding route, dashboard route

**What needs update**:
- `isOnboarded()` already uses discriminated union correctly (works with V1 and V2)
- `needsOnboarding()` same — works

**Decision**: **Reuse as-is**. Already compatible with UserProfile discriminated union. No changes needed.

---

## User Sync

**File**: `services/sync/user.sync.ts`

**Status**: Solid. Clean pattern.

**What works**:
- `UserSync.start(uid)` — Firestore realtime listener
- `UserSync.syncLocalChanges(uid)` — writes profile with merge: true
- `UserSync.stopForLogout()` — cleanup

**What needs update**:
- Writes entire profile object with `{ profile }` — works for V2
- No migration logic yet (V1 → V2)

**Decision**: **Reuse as-is for now**. Migration logic will be added in Phase 2F (Integration), not 2A.

---

## Auth Provider

**File**: `components/providers/AuthProvider.tsx`

**Status**: Solid. Handles hydration, routing, splash screen.

**What works**:
- Firebase auth state listener
- Hydrates profile via `AuthRepository.fetchUserData()`
- Calls `resolvePostAuthRoute()` after hydration
- Handles logout without wiping stores on transient null
- Startup state machine

**What needs update**:
- Migration V1 → V2 should happen here (after fetchUserData, before setProfile)

**Decision**: **Reuse as-is for 2A**. Migration logic added in Phase 2F.

---

## Settings Store

**File**: `stores/settings.store.ts`

**Status**: Solid. Handles theme, units, time format.

**What works**:
- `updateAppearance({ theme })` — syncs to Firestore
- `updateLocalization({ units, timeFormat })` — syncs to Firestore
- Persists to localStorage

**What's problematic**:
- Writes to `profile.preferences.appearance` and `profile.preferences.localization`
- But `UserProfileV2.preferences` doesn't have `appearance` or `localization` fields
- This is a schema mismatch

**Decision**: **Needs alignment**. Two options:
1. Add `appearance` and `localization` to `UserPreferences` (schema change)
2. Keep settings in SettingsStore only, don't sync to Firestore profile

**Recommendation**: Option 2. Settings are UI preferences, not health data. They don't belong in UserProfile. Keep them in SettingsStore + localStorage only. Remove Firestore sync from `updateAppearance` and `updateLocalization`.

**Action for Phase 2A**: Document this. Fix in Phase 2F.

---

## Calculation Logic

**File**: `app/onboarding/page.tsx` (inline)

**Status**: Functional but not reusable.

**Logic**:
```typescript
calculateTargets(identity, goal, preferences) {
  age = derive from DOB
  bmi = weight / (height/100)^2
  bmr = Mifflin-St Jeor formula
  tdee = bmr * activity multiplier
  dailyCalories = tdee + goal adjustment
  protein = weight * 2
  fat = weight * 1
  carbs = (dailyCalories - protein*4 - fat*9) / 4
  water = 3000ml default
}
```

**Decision**: **Extract to** `lib/calculations/targets.ts`. Make it reusable. This logic will be needed in settings (when user updates goals), analytics (for historical comparison), and AI coach (for recommendations).

---

## Existing Primitives

**Files**: `components/adl/composites/onboarding/*`

**Status**: Built in Phase 1. Ready to use.

**Available**:
- CoachMessage
- CoachQuestion
- ChoiceCard, ChoiceGroup
- WheelSelector, WheelSelectorGroup
- TimelineSelector
- ProgressHeader
- ThinkingAnimation
- MilestoneCard
- CelebrationCard

**Decision**: **Use these**. They're already built and documented.

---

## Stores to Create

### Onboarding Store

**File**: `stores/onboarding.store.ts` (new)

**Purpose**: Manage onboarding state machine, draft persistence, step navigation.

**State**:
```typescript
{
  currentStep: number (0-11)
  identity: Partial<UserIdentity>
  goals: Partial<UserGoals>
  preferences: Partial<UserPreferences>
  motivation: Partial<UserMotivation>
  appConfig: { theme, units, timeFormat }
  isSubmitting: boolean
  draftTimestamp: string | null
}
```

**Actions**:
- `setStep(step)`
- `updateIdentity(data)`
- `updateGoals(data)`
- `updatePreferences(data)`
- `updateMotivation(data)`
- `updateAppConfig(data)`
- `loadDraft()` — from localStorage
- `saveDraft()` — to localStorage
- `clearDraft()`
- `reset()`

**Persistence**:
- localStorage key: `ascend-onboarding-draft-v2`
- Expires after 24 hours
- Cleared on completion

**Decision**: **Build this**. Clean separation of concerns. Onboarding state doesn't pollute UserStore.

---

## Calculation Utilities to Create

### Targets Calculator

**File**: `lib/calculations/targets.ts` (new)

**Purpose**: Calculate BMR, TDEE, BMI, macros from profile data.

**Functions**:
- `calculateAge(dob: string): number`
- `calculateBMI(weight: number, height: number): number`
- `calculateBMR(weight: number, height: number, age: number, gender?: string): number`
- `calculateTDEE(bmr: number, activityLevel: ActivityLevel): number`
- `calculateDailyCalories(tdee: number, goal: PrimaryGoal): number`
- `calculateMacros(dailyCalories: number, weight: number): { protein, carbs, fat }`
- `calculateAllTargets(identity, goal, preferences): UserTargets`

**Decision**: **Build this**. Reusable across onboarding, settings, AI coach.

---

## Files to Create in Phase 2A

1. **`stores/onboarding.store.ts`** — State machine + draft persistence
2. **`lib/calculations/targets.ts`** — Target calculation utilities (extracted from existing)
3. **`app/onboarding/page.tsx`** — New scaffold (replace existing)
4. **`app/onboarding/layout.tsx`** — Onboarding-specific layout wrapper

---

## Files to Modify in Phase 2A

None. Existing routing, sync, and auth provider work as-is.

---

## Files to Modify in Phase 2F (Later)

1. **`components/providers/AuthProvider.tsx`** — Add V1 → V2 migration after fetchUserData
2. **`stores/settings.store.ts`** — Remove Firestore sync from appearance/localization (keep localStorage only)
3. **`lib/auth/post-auth-routing.ts`** — Possibly none (already compatible)

---

## Dependencies Check

**Required packages** (all already installed):
- `zustand` ✓
- `framer-motion` ✓
- `lucide-react` ✓
- `date-fns` (for date utilities) ✓

**No new dependencies needed.**

---

## TypeScript Compatibility

**UserProfile discriminated union**:
- Existing routing uses `profile?.onboardingCompleted` — works with V1 and V2 ✓
- UserSync writes `{ profile }` — works with V1 and V2 ✓
- Type guards `isProfileV2()`, `isOnboarded()` already exist ✓

**No breaking changes expected.**

---

## Summary

### Reuse
- `lib/auth/post-auth-routing.ts` ✓
- `services/sync/user.sync.ts` ✓
- `components/providers/AuthProvider.tsx` ✓
- `stores/settings.store.ts` ✓ (with note to fix Firestore sync later)
- `components/adl/composites/onboarding/*` ✓

### Extract & Refactor
- Calculation logic from `app/onboarding/page.tsx` → `lib/calculations/targets.ts`

### Build New
- `stores/onboarding.store.ts`
- `app/onboarding/page.tsx` (complete replacement)
- `app/onboarding/layout.tsx` (new)

### Replace
- Existing `app/onboarding/page.tsx` (discard V1 implementation)

---

**Audit complete. Ready to build Phase 2A.**

