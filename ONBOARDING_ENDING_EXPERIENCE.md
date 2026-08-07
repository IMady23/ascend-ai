# Onboarding Ending Experience

**Phase 2D: Screens 12 & 13**

This document defines the emotional ending of the Ascend AI onboarding. Users will remember this more than any other part of the flow.

---

## Guiding Principle

> Users should never feel they have "finished filling forms." They should feel they have just met a coach who finally understands where they are today and where they want to go. The onboarding ends not with completion, but with the beginning of a personalized journey.

**— Product Principle #19: Every Beginning Should Feel Earned**

---

## Screen 12 — "Here's What I Learned About You"

### Purpose

This is NOT a calculation screen.

This is the moment the coach proves it was listening.

The user should feel:
- **Understood** — "It actually remembers everything I said."
- **Curious** — "What did it figure out?"
- **Confident** — "This isn't generic advice."

### Visual State

- Coach orb: **thinking** state (faster pulse, no message)
- Background: Subtle gradient shift toward the user's goal color
- Animation: Staggered reveals, not dump-everything-at-once

### Narrative Structure

The coach tells a story in 3 acts:

#### Act 1: Acknowledgment (2–3 seconds)

```
Coach (thinking state, orb pulsing):

I've learned a lot about you already.
```

Pause.

Then checklist appears with staggered animation (150ms between each):

```
✓ Identity learned
✓ Body understood  
✓ Lifestyle mapped
✓ Mission defined
```

Each checkmark fades in with a subtle scale animation.

---

#### Act 2: Synthesis (3–4 seconds)

Coach orb transitions to **speaking** state.

```
Coach:

Now I'm building your first plan...
```

Thinking animation appears (the existing subtle pulse/ripple from Step 4, reused for consistency).

This pause is **crucial** — it shows the coach is working, not just displaying pre-calculated numbers.

---

#### Act 3: The Plan (5–6 seconds)

Numbers animate in one by one with staggered timing:

1. **Daily Calories** (appears first)
2. **Protein Target** (300ms delay)
3. **Training Days** (300ms delay)
4. **Recovery Focus** (300ms delay)
5. **Primary Goal** (300ms delay, highlighted)

Each number uses `CountUp` animation (existing component) with these design decisions:

**Layout:**
```
┌─────────────────────────────────────┐
│  Daily Calories                     │
│  2,400 kcal                         │
│  Enough to fuel your goal without   │
│  unnecessary restriction.           │
└─────────────────────────────────────┘
```

Every number has:
- **Label** (what it is)
- **Value** (the number, CountUp animated)
- **Context** (why it matters, in plain language)

---

### Exact Copy

#### For "Lose Fat" Goal

```
Daily Calories
2,150 kcal
A sustainable deficit. You'll lose fat while protecting muscle.

Protein Target
165g per day
High protein keeps you full and preserves muscle during fat loss.

Training Days
4 days per week
Enough stimulus to progress. Enough rest to recover.

Recovery Focus
Sleep & hydration
Your body transforms when you rest, not when you train.

Primary Goal
Lose Fat
We'll prioritize protein, calorie precision, and progressive training.
```

#### For "Gain Muscle" Goal

```
Daily Calories
2,850 kcal
A controlled surplus. Enough fuel to build without excess fat gain.

Protein Target
180g per day
Muscle needs protein. This target supports steady growth.

Training Days
5 days per week
Volume drives muscle growth. We'll structure progressive overload.

Recovery Focus
Sleep & nutrition timing
Muscle is built during recovery. Rest is non-negotiable.

Primary Goal
Gain Muscle
We'll focus on progressive overload, calorie surplus, and recovery.
```

#### For "Maintain" Goal

```
Daily Calories
2,450 kcal
Precision at maintenance. Your weight stays stable while performance improves.

Protein Target
155g per day
Supports muscle retention and overall health.

Training Days
4 days per week
Consistency without burnout. Performance over volume.

Recovery Focus
Consistency & adaptability
Maintenance is about sustainable habits, not perfection.

Primary Goal
Maintain & Improve
We'll focus on performance, health markers, and lifestyle balance.
```

#### For "Recomp" Goal

```
Daily Calories
2,400 kcal
At or slightly below maintenance. Precision is everything here.

Protein Target
175g per day
The highest protein target. Recomp demands it.

Training Days
5 days per week
High training volume + precise nutrition = simultaneous muscle gain and fat loss.

Recovery Focus
Sleep & stress management
Recomp is ambitious. Recovery determines success.

Primary Goal
Body Recomposition
The hardest goal. We'll need precise macros and consistent training.
```

---

### CTA

At the bottom, after all numbers animate in:

```
[Continue to Dashboard]
```

Simple. Direct. No celebration yet — that's Screen 13's job.

---

### Animation Timing Summary

| Event | Timing | Duration |
|-------|--------|----------|
| "I've learned a lot..." | 0ms | 2000ms (visible) |
| Checklist item 1 | 2000ms | 150ms (fade in) |
| Checklist item 2 | 2150ms | 150ms |
| Checklist item 3 | 2300ms | 150ms |
| Checklist item 4 | 2450ms | 150ms |
| "Now I'm building..." | 2800ms | 1500ms (visible) |
| Thinking animation | 2800ms | 1500ms (pulse) |
| Daily Calories | 4300ms | 600ms (CountUp) |
| Protein Target | 4600ms | 600ms |
| Training Days | 4900ms | 600ms |
| Recovery Focus | 5200ms | 600ms |
| Primary Goal | 5500ms | 600ms |
| CTA appears | 6100ms | 300ms (fade in) |

**Total sequence: ~6.5 seconds**

User can tap "Continue" anytime after numbers appear — they're not forced to watch the full animation.

---

### Technical Notes

- Use existing `CountUp` component from analytics widgets
- Use existing thinking animation from Step 4 (ThinkingAnimation component)
- Coach orb state managed via `useCoach()` — no local coach UI
- All copy strings should be stored in a `PLAN_COPY` constant object, keyed by goal type
- Numbers calculated via existing `calculateAllTargets()` function
- Recovery focus is static text (not calculated) — different per goal

---

## Screen 13 — "Welcome to Ascend"

### Purpose

This is NOT a "Setup Complete" screen.

This is the moment users realize they're entering a **relationship**, not finishing a **wizard**.

The user should feel:
- **Excited** — "I want to see what happens next."
- **Confident** — "This coach actually gets me."
- **Understood** — "This isn't just another fitness app."

### Visual State

- Coach orb: **celebrating** state (joyful pulse, slightly faster)
- Background: Full-screen gradient, goal color accent
- Animation: DNA card appears with the signature message

### Layout

Full-screen card, centered, with breathing room:

```
┌───────────────────────────────────────────┐
│                                           │
│           [Coach Orb — celebrating]       │
│                                           │
│      Your Ascend Profile is ready.        │
│                                           │
│  ─────────────────────────────────────── │
│                                           │
│  From today, every workout, every meal,   │
│  and every recovery check-in will help    │
│  me understand you better.                │
│                                           │
│  This is only the beginning.              │
│                                           │
│  ─────────────────────────────────────── │
│                                           │
│         [Begin Your Journey]              │
│                                           │
└───────────────────────────────────────────┘
```

### Exact Copy

```
Your Ascend Profile is ready.

From today, every workout, every meal, and every recovery check-in will help me understand you better.

This is only the beginning.
```

**CTA:** `Begin Your Journey`

---

### Animation Sequence

| Event | Timing | Duration |
|-------|--------|----------|
| Card fades in | 0ms | 400ms |
| Line 1 appears | 400ms | 600ms |
| Divider animates | 1000ms | 300ms |
| Line 2 appears | 1300ms | 1200ms (reads slower) |
| Line 3 appears | 2500ms | 600ms |
| Divider animates | 3100ms | 300ms |
| CTA appears | 3400ms | 400ms |

**Total sequence: ~4 seconds**

User can tap "Begin Your Journey" anytime after CTA appears.

---

### Auto-Redirect

After **5 seconds** of inactivity (user hasn't tapped CTA), auto-redirect to dashboard with a smooth fade transition.

This prevents users from getting stuck on the celebration screen.

---

### Technical Notes

- Coach orb managed via `useCoach()` — fires `onboarding_complete` event
- `onboarding_complete` event handled in `page.tsx` completion flow
- Card uses `motion.div` with staggered children animations
- CTA triggers `router.replace("/")` — no back button to onboarding
- Auto-redirect uses `setTimeout` with cleanup on unmount
- Background gradient uses goal color from `data.primaryGoal`

---

## Copy Variations by Context

### If user entered motivation (whyStarted)

Add one extra line to Screen 13:

```
Your Ascend Profile is ready.

You told me you wanted to [summarize whyStarted in 3–5 words].

From today, every workout, every meal, and every recovery check-in will help me understand you better.

This is only the beginning.
```

Example:

User typed: "I want to feel confident in my body again and have energy to play with my kids."

Coach says: "You told me you wanted to feel confident and energized for your kids."

This proves the coach was listening.

---

## Principle Enforcement

### Rule 1: Never show a number without explaining why it matters

✅ Every number card has:
- Label
- Value
- Plain-language explanation

❌ Never just:
```
Calories: 2400
```

---

### Rule 2: Every animation must tell the story of understanding

✅ The sequence is:
1. Coach acknowledges listening
2. Coach shows it learned key facts
3. Coach builds the plan
4. Coach explains the plan
5. Coach welcomes user to the journey

❌ Never just dump numbers on screen.

---

### Rule 3: The final button must feel like opening a door

✅ "Begin Your Journey"

❌ Not:
- "Finish"
- "Done"
- "Continue"
- "Get Started"
- "Let's Go"

"Begin Your Journey" reinforces:
- This is a **journey** (long-term)
- It's **your** journey (personalized)
- We're **beginning** together (relationship)

---

## Emotional Checkpoints

Before shipping, verify each checkpoint passes:

### Screen 12

- [ ] User feels the coach was actually listening
- [ ] User understands why each number matters
- [ ] User feels confident the plan is personalized
- [ ] User is curious to see the dashboard
- [ ] No anxiety about permanence (copy includes "we'll adjust")

### Screen 13

- [ ] User feels understood
- [ ] User feels excited (not just relieved)
- [ ] User sees this as a beginning (not an ending)
- [ ] User remembers the coach's personality
- [ ] If motivation was entered, user sees it referenced

---

## Anti-Patterns to Avoid

| ❌ Don't Do This | ✅ Do This Instead |
|-----------------|-------------------|
| "Setup Complete" | "Your Ascend Profile is ready" |
| Dump all numbers at once | Stagger with 300ms delays |
| Show numbers without context | Every number has plain-language explanation |
| Generic celebration (🎉) | Personalized DNA message |
| "Finish" button | "Begin Your Journey" |
| Auto-redirect immediately | Give user 5 seconds to read |
| Make it feel like an ending | Make it feel like a beginning |

---

## Future Enhancement Ideas

(Not for Phase 2D — document for later)

### Screen 12 Enhancements

- **Profile photo upload**: Optional, appears next to "Identity learned" checkbox
- **Goal countdown**: If target weight set, show "X kg to go"
- **Training calendar preview**: Mini week view showing selected days highlighted
- **Nutrition preview**: Sample meal suggestion based on diet type

### Screen 13 Enhancements

- **Personalized coach avatar**: Generated based on user's vibe (future)
- **First mission preview**: "Your first mission: Complete 3 workouts this week"
- **Community teaser**: "Join 10,000+ people ascending"
- **Referral prompt**: "Know someone who'd benefit? Invite them."

---

## Testing Checklist

Before marking Phase 2D complete:

### Functional Testing

- [ ] All numbers calculate correctly for each goal type
- [ ] CountUp animation works for all number formats
- [ ] Thinking animation shows during "building plan" pause
- [ ] Coach orb states transition correctly (thinking → speaking → celebrating)
- [ ] Auto-redirect works after 5 seconds
- [ ] CTA navigates to dashboard correctly
- [ ] No back button after completion
- [ ] Works on mobile (portrait + landscape)
- [ ] Works on tablet
- [ ] Works on desktop

### Copy Testing

- [ ] Copy matches ASCEND_CONVERSATION_GUIDELINES.md tone
- [ ] Every number has context explanation
- [ ] Motivation reference works when whyStarted is present
- [ ] No typos or grammar errors
- [ ] Copy scales correctly on small screens

### Animation Testing

- [ ] Timing feels natural (not too fast, not too slow)
- [ ] Stagger delays feel intentional
- [ ] CountUp doesn't glitch or skip numbers
- [ ] Reduced motion respected (prefers-reduced-motion)
- [ ] Animations don't cause layout shift

### Emotional Testing

- [ ] Screen 12 feels like understanding (not calculation)
- [ ] Screen 13 feels like beginning (not ending)
- [ ] User wants to see dashboard (not close the app)
- [ ] Coach personality is consistent throughout
- [ ] Tone matches rest of onboarding

---

## Success Metrics

(For product analytics — not blocking Phase 2D)

Track:
- **Time spent on Screen 12**: Should average 6–8 seconds (full animation + read time)
- **Time spent on Screen 13**: Should average 4–6 seconds
- **Auto-redirect rate**: How many users hit the 5-second timeout
- **CTA tap rate**: How many manually tap "Begin Your Journey"
- **Dashboard bounce rate**: Do users explore or immediately close after onboarding
- **Onboarding completion rate**: % who reach Screen 13 after starting

---

**Document Version:** 1.0  
**Last Updated:** Pre-Phase 2D Planning  
**Owned By:** Product + AI Experience Team  
**Status:** Ready for Implementation
