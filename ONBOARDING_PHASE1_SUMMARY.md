# Onboarding Phase 1 — Architecture Complete ✓

**Status**: Phase 1 Complete  
**Date**: 2026-08-06  
**Next Phase**: Implementation (building the actual onboarding flow)

---

## What Was Delivered

Phase 1 was purely **architectural foundation**. No user-facing features were built yet. Everything created in this phase is preparation for clean, scalable implementation.

### 1. Data Contract (`ONBOARDING_DATA_CONTRACT.md`)

**Purpose**: Single source of truth for all profile data.

**Contents**:
- 50+ profile fields with full specification
- Owner (which store owns this data)
- Consumer (which features depend on this data)
- Collection Stage (Day 1, Discovered Naturally, Auto-detected, Calculated)
- Validation rules
- Privacy Level (User Editable, Public to AI, Internal Only, Never Surfaced)
- Can AI Update? (whether the field evolves over time)
- Migration strategy (V1 → V2)
- Synchronization contract (write/read paths)

**Key insight**: Every new field must be added to this contract first, before any code is written.

---

### 2. Flow Map (`ONBOARDING_FLOW_MAP.md`)

**Purpose**: Complete user journey definition.

**Contents**:
- 11 steps (Step 0 Welcome → Step 11 Mission Control)
- For each step:
  - Purpose (why we're asking)
  - AI Message (conversational coach prompt)
  - User Interaction (how they respond)
  - Validation (what makes a valid answer)
  - Stored Field (where it goes in UserProfile)
  - Downstream Consumers (what features unlock)
  - Feature Unlocked (immediate benefit)
  - AI Follow-up (confirmation message)
- Recovery/Resume logic (24-hour draft expiration)
- Skip/Default strategy
- Progress indicator design
- Future enhancements (Phase 2+ fields)

**Key insight**: Every onboarding question has a clear downstream benefit. If we can't identify what feature uses a field, we don't ask for it.

---

### 3. Type Definitions (`types/user.ts`)

**Purpose**: Versioned, backward-compatible schema.

**Contents**:
- `UserProfileV1` (preserved for backward compatibility)
- `UserProfileV2` (current schema, additive-only changes)
- `UserProfile` (discriminated union of v1 | v2)
- New enums: `FitnessExperience`, `WorkoutLocation`, `CoachingStyle`, etc.
- Extended interfaces:
  - `UserIdentity` (added optional `gender`)
  - `UserGoals` (expanded with `targetWeightKg`, `weeklyWeightChangeGoal`)
  - `UserPreferences` (added 15+ Phase 2 discovery fields)
  - `UserMotivation` (Privacy: Never Surfaced Directly)
  - `UserHealth` (Privacy: Internal Only)
  - `UserLifestyle` (for scheduling/recovery)
- **Profile DNA** (architecture-only, Phase 2 implementation):
  - `NutritionDNA`, `TrainingDNA`, `RecoveryDNA`, `MotivationDNA`, `LifestyleDNA`
  - `ProfileDNA` (derived read model, never persisted)
  - `ProfileDNAAnalyzerInterface` (placeholder for Phase 2)
- **Context Enrichment Engine** (architecture-only, Phase 2 implementation):
  - `EnrichmentDecision` type
  - `ContextEnrichmentEngineInterface` (placeholder for Phase 2)
- Migration utilities:
  - `migrateUserProfileToV2()` — deterministic, non-destructive
  - `isProfileV2()` — type guard
  - `isOnboarded()` — completion check

**Key insight**: V1 profiles migrate cleanly to V2 with zero data loss. All new fields are optional. No breaking changes.

---

### 4. Conversational UI Primitives (`components/adl/composites/onboarding/`)

**Purpose**: Reusable building blocks for any conversational flow.

**Components built**:

1. **CoachMessage** — AI coach's message bubble (left-aligned, avatar, optional emphasis)
2. **CoachQuestion** — Wraps a coach message + interaction area
3. **ChoiceCard** + **ChoiceGroup** — Single/multi-select cards with icons, descriptions, badges
4. **WheelSelector** + **WheelSelectorGroup** — Drum-roll numeric picker (height, weight, age, etc.)
5. **TimelineSelector** — Visual time picker (12h/24h format, hour/minute selection)
6. **ProgressHeader** — Top nav with back button, step label, progress bar, step counter
7. **ThinkingAnimation** — Loading indicator with multi-stage steps (for TDEE calculation)
8. **MilestoneCard** — Achievement display with stagger animation
9. **CelebrationCard** — Hero completion moment with glow effect

**Design characteristics**:
- Mobile-first, touch-friendly
- Accessible (keyboard nav, ARIA labels, screen reader support)
- Animated with Framer Motion (smooth, purposeful transitions)
- Follows ADL design system (matches existing primitives)
- Composable (mix and match to build flows)

**Documentation**:
- `README.md` — 500+ line developer guide
- Usage examples for every component
- Best practices (validation, accessibility, animations, mobile vs desktop)
- Integration patterns with Zustand stores
- Phase 2 profile evolution notes

**Key insight**: These are UI-only components. They don't know about Zustand, Firestore, or UserProfile. The page component handles state and persistence.

---

## What Was NOT Delivered

Phase 1 intentionally excluded implementation to ensure the architecture is correct first:

❌ No actual onboarding page built  
❌ No Zustand store for onboarding draft state  
❌ No Firestore sync for profile V2  
❌ No AI prompt system for onboarding coach  
❌ No calculation logic for TDEE/BMR/macros  
❌ No migration script for existing V1 users  
❌ No ProfileDNA runtime logic  
❌ No ContextEnrichmentEngine runtime logic  

These are all **Phase 2 deliverables**.

---

## Architectural Decisions Made

### 1. Profile Versioning Strategy

**Decision**: Additive-only versioning with explicit version field.

**Rationale**:
- V1 profiles remain valid forever (no forced re-onboarding)
- V2 adds optional fields that are populated over time
- Migration is deterministic and non-destructive
- Future versions can follow the same pattern

**Alternative considered**: Implicit versioning via field presence.  
**Rejected because**: Hard to debug, no clear migration path, risky.

---

### 2. Profile DNA as Derived Read Model

**Decision**: ProfileDNA is never persisted, always computed on-demand.

**Rationale**:
- Can never become stale (no synchronization issues)
- Single source of truth remains the UserProfile
- Easy to add new DNA fields without migrations
- Computation is fast (derived from cached analytics)

**Alternative considered**: Store DNA in Firestore.  
**Rejected because**: Creates synchronization problems, exactly what we're trying to avoid.

---

### 3. Context Enrichment vs. Profile Gap Detection

**Decision**: Renamed "gap detection" to "enrichment" and made it opt-in, not automatic.

**Rationale**:
- The AI should feel conversational, not interrogatory
- Sometimes the correct decision is to NOT ask for more data
- Questions should arise naturally from context, not from a checklist
- User should never feel like they're "completing a profile again"

**Alternative considered**: Auto-detect missing fields and always ask.  
**Rejected because**: Feels like a form, not a conversation.

---

### 4. Onboarding Primitives vs. Complete Flow

**Decision**: Build reusable primitives, not a hardcoded onboarding page.

**Rationale**:
- Same primitives can be used for:
  - Initial onboarding
  - Profile evolution (discovered naturally)
  - Settings updates
  - AI Coach mid-conversation questions
- Easier to A/B test different flows
- Easier to add new steps without rewriting everything

**Alternative considered**: Build the entire onboarding as one monolithic page.  
**Rejected because**: Not reusable, hard to extend, inflexible.

---

### 5. Draft Persistence Strategy

**Decision**: localStorage with 24-hour expiration, cleared on completion.

**Rationale**:
- Allows resume across page refreshes
- Doesn't pollute Firestore with incomplete profiles
- Expires after 24 hours (avoids stale draft confusion)
- Forces fresh start if user abandons for too long

**Alternative considered**: Persist drafts to Firestore.  
**Rejected because**: Incomplete profiles in DB are messy, complicate queries, waste storage.

---

## Success Criteria (Phase 1)

✅ Data contract defines every field with clear ownership  
✅ Flow map defines every step with clear purpose  
✅ Type definitions are versioned and backward-compatible  
✅ UI primitives are reusable and follow ADL patterns  
✅ Migration strategy is deterministic and non-destructive  
✅ Profile DNA architecture prevents future synchronization issues  
✅ Documentation is comprehensive enough for any developer to implement  

---

## Next Steps (Phase 2)

### Implementation Priorities

1. **Build the onboarding page** (`app/onboarding/page.tsx`)
   - Use primitives from `components/adl/composites/onboarding/`
   - Follow flow from `ONBOARDING_FLOW_MAP.md`
   - Implement draft save/restore logic
   - Add validation per `ONBOARDING_DATA_CONTRACT.md`

2. **Create onboarding state store** (`stores/onboarding.store.ts`)
   - Manage draft state
   - Handle step navigation
   - Persist to localStorage
   - Clear on completion

3. **Build calculation logic** (`lib/calculations/targets.ts`)
   - BMR (Mifflin-St Jeor equation)
   - TDEE (activity multipliers)
   - Daily calories (goal adjustments)
   - Macro distribution (protein, carbs, fat)

4. **Implement V1→V2 migration**
   - Add migration check to AuthProvider
   - Run `migrateUserProfileToV2()` on login
   - Update Firestore with migrated profile
   - Log migration events to Sentry

5. **Update UserSync** (`services/sync/user.sync.ts`)
   - Handle UserProfileV2 schema
   - Support new optional fields
   - Ensure backward compatibility with V1

6. **Build onboarding AI coach** (separate from main AI Coach)
   - Dedicated prompt system
   - No context enrichment (profile doesn't exist yet)
   - Conversational tone, encouraging, brief
   - Tool calls: none (onboarding is synchronous)

7. **Test migration thoroughly**
   - V1 user logs in → migrates to V2
   - New user completes onboarding → V2 profile created
   - Partial onboarding → draft persists, no Firestore write
   - Abandoned draft → expires after 24h
   - All existing features still work with V2 profiles

---

## Phase 3+ (Future)

- **Profile DNA implementation** — Compute DNA on-demand, pass to AI context
- **Context Enrichment Engine** — Ask for missing fields naturally during AI conversations
- **Profile Evolution UI** — Mid-conversation profile questions
- **Onboarding A/B testing** — Test different flows, track completion rates
- **Voice input** — Conversational onboarding via speech-to-text
- **Progress photos** — Capture baseline photo during onboarding
- **Localization** — Multi-language onboarding flows

---

## Review Checklist

Before starting Phase 2, confirm:

- [ ] `ONBOARDING_DATA_CONTRACT.md` reviewed and approved
- [ ] `ONBOARDING_FLOW_MAP.md` reviewed and approved
- [ ] `types/user.ts` UserProfileV2 schema reviewed
- [ ] Migration strategy `migrateUserProfileToV2()` understood
- [ ] UI primitives tested in Storybook (or manually)
- [ ] Team understands "one source of truth" principle
- [ ] Team understands Profile DNA is derived, never persisted
- [ ] Team understands Context Enrichment is opt-in, not automatic

---

## Summary

Phase 1 delivers the **architectural foundation** for a scalable, maintainable onboarding system that:

1. **Prevents synchronization issues** (one source of truth, versioned schema, derived DNA)
2. **Scales cleanly** (additive versioning, reusable primitives, profile evolution ready)
3. **Respects the user** (contextual questions, 24h draft expiration, clear benefit per field)
4. **Integrates seamlessly** (follows existing ADL patterns, Zustand stores, Firestore repos)

Phase 2 will bring this architecture to life by implementing the actual onboarding flow using the primitives and contracts defined in Phase 1.

---

**Status**: ✅ Phase 1 Complete — Ready for Phase 2 Implementation

Last reviewed: 2026-08-06
