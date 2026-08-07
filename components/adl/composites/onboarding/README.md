# Onboarding Primitives — Developer Guide

**Status**: Phase 1 Complete  
**Version**: 1.0.0  
**Last Updated**: 2026-08-06

---

## Overview

These components are **reusable primitives** for building conversational onboarding flows, profile evolution prompts, and AI-driven interactions. They follow the ADL (Ascend Design Library) design system and integrate seamlessly with the existing Ascend AI architecture.

**They are not a complete onboarding flow.** They are the building blocks for creating one.

---

## Design Philosophy

Every component in this directory follows these principles:

1. **Conversational First**: Feels like talking to a coach, not filling a form
2. **Progressive Disclosure**: Show one thing at a time, never overwhelm
3. **Mobile-First**: Optimized for touch, scales beautifully to desktop
4. **Accessible**: Keyboard navigation, screen reader support, ARIA labels
5. **Animated**: Smooth, purposeful transitions that guide attention
6. **Composable**: Mix and match primitives to build any flow

---

## Components

### 1. CoachMessage

**Purpose**: Display the AI coach's conversational messages.

**When to use**: Any time the AI needs to ask a question, give feedback, or provide context.

**Example**:
```tsx
<CoachMessage emphasized>
  First, let me introduce myself properly.
  I'm Coach—your AI fitness and nutrition advisor.
</CoachMessage>
```

**Props**:
- `showAvatar` (default: `true`) — Show coach icon
- `emphasized` (default: `false`) — Highlight as important
- `delay` (default: `0`) — Stagger animation entrance

**Design notes**:
- Left-aligned with avatar (coach speaks from the left)
- Use `emphasized` for key questions or important context
- Stack multiple messages with increasing `delay` for conversation flow

---

### 2. CoachQuestion

**Purpose**: Pair a coach message with an interaction area.

**When to use**: Every onboarding step. It wraps the question and the user's response input.

**Example**:
```tsx
<CoachQuestion
  message="What's your primary goal right now?"
  caption="This drives your entire plan."
>
  <ChoiceGroup layout="stack">
    <ChoiceCard ... />
    <ChoiceCard ... />
  </ChoiceGroup>
</CoachQuestion>
```

**Props**:
- `message` — The coach's question
- `caption` (optional) — Secondary context
- `children` — The interaction component (cards, input, slider, etc.)
- `emphasized` — Pass through to CoachMessage
- `delay` — Pass through to CoachMessage

---

### 3. ChoiceCard

**Purpose**: A selectable card for single or multi-choice questions.

**When to use**: Any time the user picks from a set of predefined options.

**Example**:
```tsx
<ChoiceCard
  value="lose_fat"
  selected={goal === 'lose_fat'}
  onSelect={(v) => setGoal(v)}
  icon={<Flame size={20} />}
  title="Lose Fat"
  description="Reduce body fat while preserving muscle"
  badge="Recommended"
  accentColor="var(--color-accent-orange)"
/>
```

**Props**:
- `value` — The value this card represents
- `selected` — Whether this card is currently selected
- `onSelect` — Called when clicked
- `icon` (optional) — Icon rendered at the top
- `title` — Primary label
- `description` (optional) — Supporting text
- `badge` (optional) — Tag (e.g., "Recommended")
- `multiSelect` (default: `false`) — Allow multiple selections
- `disabled` (default: `false`)
- `accentColor` (default: `"var(--color-accent-blue)"`)

**Pair with ChoiceGroup**:
```tsx
<ChoiceGroup layout="stack"> {/* or "grid" */}
  <ChoiceCard ... />
  <ChoiceCard ... />
</ChoiceGroup>
```

**Design notes**:
- Single select: radio button indicator
- Multi select: checkbox indicator
- Use `badge` sparingly (recommended option, pro feature)

---

### 4. WheelSelector

**Purpose**: A scrollable drum-roll picker for numeric or discrete values.

**When to use**: Height, weight, age, workout days per week, sleep hours, etc.

**Example**:
```tsx
<WheelSelector
  items={Array.from({ length: 150 }, (_, i) => ({
    value: i + 30,
    label: `${i + 30} kg`,
  }))}
  selected={weight}
  onSelect={setWeight}
  visibleCount={5}
  aria-label="Select your weight"
/>
```

**Props**:
- `items` — Array of `{ value, label }`
- `selected` — Currently selected value
- `onSelect` — Called when user scrolls/taps
- `visibleCount` (default: `5`) — How many items visible at once (must be odd)
- `itemHeight` (default: `44`) — Height per item in pixels
- `accentColor` (default: `"var(--color-accent-blue)"`)
- `aria-label` — Accessibility label

**Multi-column version** (for height: ft + in):
```tsx
<WheelSelectorGroup
  columns={[
    {
      items: feetItems,
      selected: feet,
      onSelect: setFeet,
      label: "Feet",
      "aria-label": "Select feet",
    },
    {
      items: inchItems,
      selected: inches,
      onSelect: setInches,
      label: "Inches",
      "aria-label": "Select inches",
    },
  ]}
  visibleCount={5}
/>
```

**Design notes**:
- Touch-friendly: draggable, scrollable, tappable
- Mouse-friendly: wheel scroll supported
- Snaps to closest value on release
- Fades top/bottom edges for focus

---

### 5. TimelineSelector

**Purpose**: A visual time picker with hour/minute selection.

**When to use**: Wake time, sleep time, workout preferred time, meal timing.

**Example**:
```tsx
<TimelineSelector
  value="06:30"
  onChange={(time) => setWakeTime(time)}
  format="12h"
  label="Wake Time"
  accentColor="var(--color-accent-gold)"
/>
```

**Props**:
- `value` — Time in HH:MM format (24h)
- `onChange` — Called with new time string
- `format` (default: `"24h"`) — Display format: `"12h"` or `"24h"`
- `label` (optional) — Label above selector
- `minHour` (default: `0`) — Restrict hour range
- `maxHour` (default: `23`) — Restrict hour range
- `accentColor` (default: `"var(--color-accent-blue)"`)

**Design notes**:
- Large, tappable hour/minute buttons
- Visual display shows formatted time
- Minutes snap to 15-minute intervals (0, 15, 30, 45)
- Supports 12h (AM/PM) and 24h formats

---

### 6. ProgressHeader

**Purpose**: Top navigation and progress indicator for multi-step flows.

**When to use**: Every step in the onboarding flow (except welcome and celebration screens).

**Example**:
```tsx
<ProgressHeader
  currentStep={3}
  totalSteps={9}
  label="Mission Definition"
  onBack={() => setStep(s => s - 1)}
  canGoBack={step > 1}
  accentColor="var(--color-accent-blue)"
/>
```

**Props**:
- `currentStep` — Current step number (1-indexed)
- `totalSteps` — Total steps in the flow
- `label` (optional) — Step name (e.g., "Identity", "Goals")
- `onBack` (optional) — Called when back button is clicked
- `canGoBack` (default: `true`) — Show back button
- `accentColor` (default: `"var(--color-accent-blue)"`)

**Design notes**:
- Displays: Back button | Step label | Step counter
- Animated progress bar fills proportionally
- Back button animates in/out based on `canGoBack`

---

### 7. ThinkingAnimation

**Purpose**: Visual indicator for AI processing or async operations.

**When to use**: TDEE calculation, AI responses, profile sync, any loading state.

**Example**:
```tsx
<ThinkingAnimation
  steps={[
    { label: "Calculating BMR...", completed: true },
    { label: "Adjusting for activity level...", completed: true },
    { label: "Generating macro distribution...", completed: false },
  ]}
  accentColor="var(--color-accent-blue)"
/>
```

**Props**:
- `steps` (optional) — Array of `{ label, completed }` for multi-stage loading
- `message` (default: `"Analyzing your profile..."`) — Fallback message if no steps
- `accentColor` (default: `"var(--color-accent-blue)"`)

**Design notes**:
- Animated dots (thinking indicator)
- If `steps` provided: show checklist with spinners/checks
- Each step animates in with stagger
- Use during calculations, AI requests, or any async operation

---

### 8. MilestoneCard

**Purpose**: Display a completed milestone or feature unlock.

**When to use**: Onboarding completion screen, AI follow-ups, weekly achievements.

**Example**:
```tsx
<MilestoneCard
  title="Profile Created"
  description="All your targets have been calculated"
  icon={<User size={18} />}
  achieved
  delay={0.1}
  accentColor="var(--color-success)"
/>
```

**Props**:
- `title` — Milestone name
- `description` (optional) — Supporting text
- `icon` (optional) — Custom icon (defaults to checkmark)
- `achieved` (default: `true`) — Show check indicator
- `delay` (default: `0`) — Stagger entrance animation
- `accentColor` (default: `"var(--color-success)"`)

**Design notes**:
- Use in lists with increasing `delay` for staggered reveal
- Icon background matches `accentColor`
- Compact design for stacking multiple milestones

---

### 9. CelebrationCard

**Purpose**: Big moment celebration for major completions.

**When to use**: Onboarding complete, first workout done, major goal achieved.

**Example**:
```tsx
<CelebrationCard
  title="Setup Complete"
  subtitle="Your personal AI coach is now active."
  icon={<Sparkles size={48} />}
  accentColor="var(--color-accent-gold)"
>
  <div className="space-y-3 mt-6">
    <MilestoneCard title="Profile created" delay={0} />
    <MilestoneCard title="Goals defined" delay={0.1} />
    <MilestoneCard title="AI coach initialized" delay={0.2} />
  </div>
</CelebrationCard>
```

**Props**:
- `title` — Main heading
- `subtitle` (optional) — Supporting text
- `icon` (optional) — Hero icon (defaults to Sparkles)
- `accentColor` (default: `"var(--color-accent-gold)"`)
- `children` (optional) — Content below (milestones, buttons, etc.)

**Design notes**:
- Hero moment — center-aligned, large icon, glowing effect
- Use sparingly (only for major completions)
- Pass MilestoneCards as children for completion checklists

---

## Building an Onboarding Flow

### Step-by-step guide

1. **Create the page component** (e.g., `app/onboarding/page.tsx`)

2. **Set up state**:
```tsx
const [step, setStep] = useState(1);
const [data, setData] = useState({
  fullName: "",
  height: 175,
  weight: 75,
  goal: "lose_fat",
  // ... all fields from ONBOARDING_DATA_CONTRACT.md
});
```

3. **Render ProgressHeader** (except on welcome/celebration):
```tsx
{step > 1 && step < 10 && (
  <ProgressHeader
    currentStep={step - 1}
    totalSteps={9}
    onBack={() => setStep(s => s - 1)}
    canGoBack={step > 2}
  />
)}
```

4. **Render step content**:
```tsx
{step === 2 && (
  <CoachQuestion message="What should I call you?">
    <input
      type="text"
      value={data.fullName}
      onChange={(e) => setData({ ...data, fullName: e.target.value })}
      className="w-full px-4 py-3 rounded-lg border ..."
    />
  </CoachQuestion>
)}
```

5. **Add navigation buttons**:
```tsx
<Button
  onClick={() => setStep(s => s + 1)}
  disabled={!data.fullName}
  fullWidth
>
  Continue
</Button>
```

6. **Handle completion**:
```tsx
{step === 11 && (
  <CelebrationCard
    title="Setup Complete"
    subtitle="Your plan is ready."
  >
    <Button onClick={() => router.push("/")} fullWidth>
      Enter Mission Control
    </Button>
  </CelebrationCard>
)}
```

---

## Best Practices

### Validation
- Validate on blur, not on every keystroke (less intrusive)
- Show validation errors below the input, not in a modal
- Disable "Continue" button until validation passes
- Use red border + error text for invalid state

### Accessibility
- Every interactive element has `aria-label`
- Keyboard navigation works (Tab, Enter, Escape)
- Focus management (auto-focus inputs when step loads)
- Screen reader announces progress ("Step 3 of 9")

### Animations
- Stagger related elements with increasing `delay`
- Use `initial={{ opacity: 0, y: 10 }}` for subtle entrance
- Exit animations only when necessary (avoid jarring transitions)
- Respect `prefers-reduced-motion` (Framer Motion does this automatically)

### Mobile vs Desktop
- All components are mobile-first (touch-friendly sizes)
- Desktop gets larger text, more spacing, wider layouts
- Use `md:` breakpoint for tablet+ adjustments
- Test on real devices, not just browser DevTools

### State Management
- Draft save after every completed step
- Draft expires after 24 hours (don't persist stale onboarding state)
- On resume, validate the draft before restoring
- Clear draft immediately after successful completion

### Error Handling
- Network failure: show retry button, don't lose user's data
- Validation failure: inline errors, not blocking modals
- Calculation failure: graceful fallback, allow manual input
- Never show raw error messages to users

---

## Integration with Existing Architecture

### Store Integration
These primitives are **UI-only**. They don't know about Zustand, Firestore, or UserProfile.

**Correct pattern**:
```tsx
// ✅ Page component handles state and persistence
const { profile, setProfile } = useUserStore();
const [goal, setGoal] = useState(profile?.goals?.primaryGoal ?? 'lose_fat');

// UI primitive only handles selection
<ChoiceCard
  value="lose_fat"
  selected={goal === 'lose_fat'}
  onSelect={(v) => setGoal(v)}
  title="Lose Fat"
/>

// Page component persists on Continue
<Button onClick={() => {
  setProfile({ ...profile, goals: { primaryGoal: goal } });
  setStep(s => s + 1);
}}>
  Continue
</Button>
```

**Incorrect pattern**:
```tsx
// ❌ Don't put store logic inside primitives
<ChoiceCard
  onSelect={(v) => {
    useUserStore.getState().setProfile({ ... }); // NO
  }}
/>
```

### Data Contract
Reference `ONBOARDING_DATA_CONTRACT.md` for:
- Which fields to collect
- Where to store them (`UserProfile.identity`, `UserProfile.goals`, etc.)
- Validation rules
- Privacy levels

### Flow Map
Reference `ONBOARDING_FLOW_MAP.md` for:
- Step order
- AI messages (conversational copy)
- Downstream consumers (what features use this data)
- Feature unlocks (what becomes available after this step)

---

## Phase 2: Profile Evolution

These primitives are designed to support **contextual profile enrichment** (asking users for missing fields during normal app usage).

**Example**: User asks about sleep optimization, but `sleepTime` is undefined.

**Current behavior**:
```tsx
// AI Coach generates response with missing context
```

**Phase 2 behavior**:
```tsx
// AI Coach detects gap and asks naturally
<CoachMessage>
  I can help with that. Before I suggest a plan,
  what time do you usually go to bed?
</CoachMessage>

<TimelineSelector
  value={sleepTime ?? "22:30"}
  onChange={(time) => {
    updateProfile({ sleepTime: time });
    continueConversation();
  }}
  format="12h"
/>
```

This requires:
1. `ContextEnrichmentEngine` (Phase 2 implementation)
2. AI prompt strategy that weaves questions into conversation
3. Profile update mechanism mid-conversation

The primitives are ready. The engine is not yet built.

---

## Future Enhancements

Ideas for Phase 3+:

- **VoiceInput** — Voice-to-text for conversational onboarding
- **ImageUpload** — Progress photo capture during onboarding
- **SkipWithReason** — "Why are you skipping?" for analytics
- **DynamicSuggestions** — AI-generated default values based on partial profile
- **A/B Test Variants** — Multiple UX flows with analytics tracking
- **Localization** — Multi-language support

---

## Questions?

For implementation guidance, reference:
- `ONBOARDING_DATA_CONTRACT.md` — What to collect and where to store it
- `ONBOARDING_FLOW_MAP.md` — Step-by-step UX flow
- `types/user.ts` — UserProfileV2 schema and migration utilities

For design system patterns, reference:
- `components/adl/primitives/` — Base UI components
- `components/adl/composites/cards/Cards.tsx` — Card patterns
- `app/globals.css` — Design tokens and theme variables

Last updated: 2026-08-06
