# Onboarding Experience Review — Phase 1.5

**Status**: Design Review (No Code)
**Date**: 2026-08-06
**Purpose**: Review the complete onboarding experience before implementation begins.

---

## Contents

1. [Screen-by-Screen Storyboard](#storyboard)
2. [AI Conversation Script](#conversation)
3. [Animation Map](#animations)
4. [UX Review](#ux-review)
5. [Mobile Review](#mobile-review)
6. [Final Verdict](#verdict)

---

---

# PART 1 — SCREEN-BY-SCREEN STORYBOARD {#storyboard}

---

## SCREEN 0 — Welcome

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│              ✦ (logo mark)              │
│                                         │
│         Welcome to Ascend AI            │
│                                         │
│    Discipline builds what motivation    │
│           only begins.                  │
│                                         │
│                                         │
│       ┌─────────────────────────┐       │
│       │       Let's Start       │       │
│       └─────────────────────────┘       │
│                                         │
│              Learn More ↓               │
│                                         │
└─────────────────────────────────────────┘
```

**Layout**: Full-screen, centered vertically
**Background**: Dark base with subtle ambient gradient (matches existing AmbientBackground)
**Expected duration**: User reads for 3–5 seconds, then taps
**Interaction**: Single primary CTA. "Learn More" opens a 3-slide feature overview sheet.
**Unlock**: Access to Step 1

---

## SCREEN 1 — Name

```
┌─────────────────────────────────────────┐
│  ←        Welcome          1/9          │
│  ▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
├─────────────────────────────────────────┤
│                                         │
│  ✦  First, let me introduce myself.     │
│     I'm Coach — your AI advisor.        │
│     I'll be with you every step.        │
│                                         │
│  ✦  What should I call you?             │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Your name                        │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Nickname (optional)              │  │
│  └───────────────────────────────────┘  │
│                                         │
│                                         │
│       ┌─────────────────────────┐       │
│       │        Continue         │       │
│       └─────────────────────────┘       │
│                                         │
└─────────────────────────────────────────┘
```

**Layout**: ProgressHeader at top, coach messages, text inputs, sticky CTA at bottom
**Coach messages**: Two bubbles, staggered entrance
**Interaction**: Text input, keyboard auto-opens
**Validation**: Full name required (2–100 chars). Continue disabled until valid.
**Nickname**: Appears after typing name. Subtle, optional.
**Unlock**: Personalized greeting throughout the app
**Expected duration**: 20–30 seconds

---

## SCREEN 2 — Physical Foundation

```
┌─────────────────────────────────────────┐
│  ←      Foundation         2/9          │
│  ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
├─────────────────────────────────────────┤
│                                         │
│  ✦  To build your plan, I need to       │
│     know your starting point.           │
│     These numbers drive everything.     │
│                                         │
│  Date of Birth                          │
│  ┌──────────┬──────────┬─────────────┐  │
│  │  Month   │   Day    │    Year     │  │
│  │  ~~~~~~  │  ~~~~~~  │  ~~~~~~~~~~  │  │
│  │ [August] │  [ 6 ]  │  [ 2000 ]  │  │
│  │  ~~~~~~  │  ~~~~~~  │  ~~~~~~~~~~  │  │
│  └──────────┴──────────┴─────────────┘  │
│                                         │
│  Height           Weight                │
│  ┌──────────┐     ┌──────────────────┐  │
│  │  ~~~~~   │     │      ~~~~~~      │  │
│  │ [ 175 ]  │     │    [ 75 kg ]     │  │
│  │  ~~~~~   │     │      ~~~~~~      │  │
│  └──────────┘     └──────────────────┘  │
│                    ○ kg   ○ lbs         │
│                                         │
│       ┌─────────────────────────┐       │
│       │        Continue         │       │
│       └─────────────────────────┘       │
└─────────────────────────────────────────┘
```

**Layout**: Wheel pickers for DOB, height, weight side by side
**Interaction**: Scroll wheels (drag or scroll), unit toggle for height/weight
**Default values**: DOB = year 2000, height = 175cm, weight = 75kg
**Validation**: Age 13–100, height 100–250cm, weight 30–300kg
**Unlock**: BMI visible on dashboard, progress baseline established
**Expected duration**: 30–45 seconds

---

## SCREEN 3 — Goal Selection

```
┌─────────────────────────────────────────┐
│  ←         Mission          3/9         │
│  ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░  │
├─────────────────────────────────────────┤
│                                         │
│  ✦  Every journey starts with a clear   │
│     destination.                        │
│     What's your primary goal?           │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  🔥  Lose Fat                      │  │
│  │      Reduce fat, preserve muscle  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  💪  Gain Muscle                   │  │
│  │      Build strength and mass      │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  ⚖️   Maintain & Improve           │  │
│  │      Keep weight, build fitness   │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  🔄  Body Recomposition  [ADVANCED]│  │
│  │      Lose fat, gain muscle        │  │
│  └───────────────────────────────────┘  │
│                                         │
│       ┌─────────────────────────┐       │
│       │        Continue         │       │
│       └─────────────────────────┘       │
└─────────────────────────────────────────┘
```

**After selection**: Target weight input slides in below the selected card
**Layout**: Stacked choice cards, single select
**Interaction**: Tap to select. Selected card gets accent border + check.
**Target weight**: Appears as inline expansion after goal selected
**Validation**: Goal required. Target weight optional (sensible default applied).
**Unlock**: Calorie target calculated, goal countdown widget on dashboard
**Expected duration**: 20–30 seconds

---

## SCREEN 4 — Motivation Anchor

```
┌─────────────────────────────────────────┐
│  ←       Motivation         4/9         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░  │
├─────────────────────────────────────────┤
│                                         │
│  ✦  One more thing —                    │
│     this one matters.                   │
│                                         │
│  ✦  Why did you decide to start?        │
│     What happens when you reach         │
│     your goal?                          │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │  Be honest. This stays between    │  │
│  │  us.                              │  │
│  │                                   │  │
│  │                              0/300│  │
│  └───────────────────────────────────┘  │
│                                         │
│                                         │
│       ┌─────────────────────────┐       │
│       │        Continue         │       │
│       └─────────────────────────┘       │
│                                         │
│              Skip for now               │
│                                         │
└─────────────────────────────────────────┘
```

**Layout**: Two coach messages, multiline textarea, "Skip for now" below CTA
**Tone**: Intimate and honest. Privacy reassurance.
**Validation**: Optional. If typed, min 10 chars.
**Skip**: Stored as undefined. AI will ask naturally later.
**Unlock**: AI coach can give deeply personal encouragement
**Expected duration**: 30–60 seconds (or 2 seconds if skipped)

---

## SCREEN 5 — Activity Context

```
┌─────────────────────────────────────────┐
│  ←         Activity         5/9         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░  │
├─────────────────────────────────────────┤
│                                         │
│  ✦  How active is your typical week?    │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  🪑  Sedentary                     │  │
│  │      Office job, little exercise  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  🚶  Lightly Active                │  │
│  │      Light exercise 1–3×/week     │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  🏃  Moderately Active   [COMMON] │  │
│  │      3–5 workouts/week            │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  ⚡  Very Active                   │  │
│  │      6–7 intense sessions/week    │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  🏅  Athlete                       │  │
│  │      Physical job or 2× daily     │  │
│  └───────────────────────────────────┘  │
│                                         │
│       ┌─────────────────────────┐       │
│       │        Continue         │       │
│       └─────────────────────────┘       │
└─────────────────────────────────────────┘
```

**After selection**: Fitness experience question slides in below
**Layout**: 5 stacked cards for activity, then 3 cards for experience
**Interaction**: Activity level first, then experience level
**Validation**: Both required
**Unlock**: TDEE calculated, workout difficulty calibrated
**Expected duration**: 15–20 seconds

---

## SCREEN 6 — Training Commitment

```
┌─────────────────────────────────────────┐
│  ←         Training         6/9         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░  │
├─────────────────────────────────────────┤
│                                         │
│  ✦  How many days can you realistically │
│     train per week?                     │
│     Consistency beats perfection.       │
│                                         │
│         Days per week                   │
│  ┌──────────────────────────────────┐   │
│  │  M   T   W   T   F   S   S       │   │
│  │  ●   ●   ●   ●   ○   ○   ○       │   │
│  │           4 days selected         │   │
│  └──────────────────────────────────┘   │
│                                         │
│         Session length                  │
│  15min ━━━━━━━━━━⬤━━━━━━━━━━ 180min    │
│              60 minutes                 │
│                                         │
│       ┌─────────────────────────┐       │
│       │        Continue         │       │
│       └─────────────────────────┘       │
└─────────────────────────────────────────┘
```

**Layout**: Visual week calendar for days, slider for duration
**Interaction**: Tap weekday circles to toggle. Drag slider for duration.
**Default**: 4 days, 60 minutes
**Validation**: 1–7 days required. 15–180 min required.
**Unlock**: Training calendar, weekly mission plan
**Expected duration**: 15–20 seconds

---

## SCREEN 7 — Nutrition

```
┌─────────────────────────────────────────┐
│  ←        Nutrition         7/9         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░  │
├─────────────────────────────────────────┤
│                                         │
│  ✦  Let's talk about what you eat.      │
│     I'll use this for meal recs         │
│     and food tracking.                  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  🍖  No Restrictions              │  │
│  │      I eat everything             │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  🌿  Vegetarian                   │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  🌱  Vegan                        │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  🥚  Eggetarian                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Any allergies?                         │
│  [Dairy] [Gluten] [Nuts] [+ Add more]   │
│                                         │
│       ┌─────────────────────────┐       │
│       │        Continue         │       │
│       └─────────────────────────┘       │
└─────────────────────────────────────────┘
```

**Layout**: Diet type cards, then allergen chips
**Allergen chips**: Toggle chips (multi-select). "Add more" opens text input.
**Validation**: Diet type required. Allergies optional.
**Unlock**: Personalized meal recommendations, allergen warnings
**Expected duration**: 15–25 seconds

---

## SCREEN 8 — Daily Rhythm

```
┌─────────────────────────────────────────┐
│  ←         Schedule         8/9         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  │
├─────────────────────────────────────────┤
│                                         │
│  ✦  When does your day start and end?   │
│     This helps me time reminders        │
│     and recommendations.               │
│                                         │
│  Wake up         Go to sleep            │
│  ┌──────────┐    ┌──────────────────┐   │
│  │  06:30   │    │     22:30        │   │
│  │  [wheel] │    │    [wheel]       │   │
│  └──────────┘    └──────────────────┘   │
│                                         │
│  Sleep goal                             │
│  4h ━━━━━━━━━━━━━━━⬤━━━━━ 12h          │
│           8 hours                       │
│                                         │
│       ┌─────────────────────────┐       │
│       │        Continue         │       │
│       └─────────────────────────┘       │
└─────────────────────────────────────────┘
```

**Layout**: Two time pickers side by side, sleep hours slider below
**Interaction**: Wheel pickers for time, slider for sleep hours
**Default**: 06:30 wake, 22:30 sleep, 8 hours
**Validation**: Valid times required. Sleep hours 4–12.
**Unlock**: Reminders scheduled at appropriate times
**Expected duration**: 15–20 seconds

---

## SCREEN 9 — App Preferences

```
┌─────────────────────────────────────────┐
│  ←       Preferences        9/9         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
├─────────────────────────────────────────┤
│                                         │
│  ✦  Almost there. Just a few            │
│     app preferences.                    │
│                                         │
│  Theme                                  │
│  ┌──────────┬──────────┬─────────────┐  │
│  │  ☀️ Light │ 🌙 Dark  │ 💻 System   │  │
│  │          │    ●     │             │  │
│  └──────────┴──────────┴─────────────┘  │
│                                         │
│  Units                                  │
│  ┌─────────────────┬───────────────┐    │
│  │  ● Metric       │  Imperial     │    │
│  │    kg, cm       │   lbs, in     │    │
│  └─────────────────┴───────────────┘    │
│                                         │
│  Time Format                            │
│  ┌─────────────────┬───────────────┐    │
│  │  ● 24-hour      │  12-hour      │    │
│  └─────────────────┴───────────────┘    │
│                                         │
│       ┌─────────────────────────┐       │
│       │       Finish Setup      │       │
│       └─────────────────────────┘       │
└─────────────────────────────────────────┘
```

**Layout**: Three segmented controls, stacked
**Interaction**: Tap to select segment. Visual preview for theme.
**Defaults**: System locale detected for units and time format. System default for theme.
**Note**: Progress bar is full on this screen (9/9)
**Unlock**: App displays correctly on first load
**Expected duration**: 10–15 seconds

---

## SCREEN 10 — Calculation

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│         Building your plan...           │
│                                         │
│              ● ● ●  (thinking)          │
│                                         │
│  ✓  Calculating BMR...                  │
│  ✓  Adjusting for activity level...     │
│  ✓  Applying goal deficit/surplus...    │
│  ✓  Distributing macros...              │
│  ◌  Finalizing your plan...             │
│                                         │
│                                         │
└─────────────────────────────────────────┘

          ↓ (2.5 seconds)

┌─────────────────────────────────────────┐
│                                         │
│  ✦  Your plan is ready, [Name].         │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Daily Targets                    │  │
│  │  Calories     2,100 kcal          │  │
│  │  Protein         158g             │  │
│  │  Carbs           220g             │  │
│  │  Fat              72g             │  │
│  │  Water         3,000 ml           │  │
│  │  Steps        10,000              │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Your Metrics                     │  │
│  │  TDEE      2,600 kcal / day       │  │
│  │  BMR       1,820 kcal / day       │  │
│  │  BMI       24.5 (Normal)          │  │
│  └───────────────────────────────────┘  │
│                                         │
│       ┌─────────────────────────┐       │
│       │   Looks Good, Let's Go  │       │
│       └─────────────────────────┘       │
│           Adjust Targets ↓              │
└─────────────────────────────────────────┘
```

**Layout**: Loading state → Plan review card
**Loading**: ThinkingAnimation with 4–5 checklist steps, staggered
**Review**: Two cards (daily targets, metrics) with animated number reveals
**Interaction**: Primary CTA to proceed. Secondary "Adjust Targets" opens settings sheet.
**Duration**: 2.5s loading, user reads for 10–20 seconds

---

## SCREEN 11 — Welcome to Mission Control

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                ✦  ✦  ✦                  │
│                                         │
│           Setup Complete.               │
│                                         │
│      Your personal AI coach            │
│           is now active.                │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  ✓  Profile created               │  │
│  │  ✓  Goals defined                 │  │
│  │  ✓  Targets calculated            │  │
│  │  ✓  AI coach initialized          │  │
│  └───────────────────────────────────┘  │
│                                         │
│       ┌─────────────────────────┐       │
│       │   Enter Mission Control │       │
│       └─────────────────────────┘       │
│                                         │
│   Auto-entering in 3... 2... 1...       │
│                                         │
└─────────────────────────────────────────┘
```

**Layout**: CelebrationCard with MilestoneCards, no ProgressHeader
**Animation**: Milestones reveal sequentially, then button appears
**Auto-redirect**: 3-second countdown, then router.push("/")
**User can skip**: "Enter Mission Control" button skips the wait
**Expected duration**: 4–6 seconds

---

---

# PART 2 — AI CONVERSATION SCRIPT {#conversation}

This is the complete conversation. Every AI sentence. Every transition. Every explanation.

---

## SCREEN 0 — Welcome

**Visual text** (not AI voice, not spoken — just visible):

> Welcome to Ascend AI
>
> Discipline builds what motivation only begins.

**Button**: Let's Start

---

## SCREEN 1 — Name

**AI Coach (First message)**:
> First, let me introduce myself.
>
> I'm Coach—your AI fitness and nutrition advisor.
> I'll be with you every step of this journey.

**AI Coach (Second message)**:
> What should I call you?

**User types name**

**AI Coach (After name entered)**:
> Great to meet you, [Name].
>
> Let's build your profile.

**Transition**: Fade to next screen

---

## SCREEN 2 — Foundation

**AI Coach**:
> To build your personalized plan, I need to understand your starting point.
>
> This isn't about judgment—it's about precision. The more accurate your numbers, the better I can calibrate your targets.

**User enters DOB, height, weight**

**AI Coach (After continue)**:
> Your BMI is [X.X]—that's a helpful baseline.
>
> Now let's talk about where you want to go.

**Transition**: Slide up to next screen

---

## SCREEN 3 — Mission

**AI Coach**:
> Every great journey starts with a clear destination.
>
> What's your primary goal right now?

**User selects goal**

**AI Coach (After goal selected, before target weight appears)**:
> [If Lose Fat]: Perfect. We'll create a sustainable deficit to help you lose fat while keeping your strength.
>
> [If Gain Muscle]: Got it. We'll fuel growth with the right surplus and training volume.
>
> [If Maintain]: Excellent. We'll dial in your performance while maintaining your current weight.
>
> [If Recomp]: Ambitious—I like it. This requires precise macros and smart training. We'll make it work.

**Target weight input appears**

**AI Coach (After target weight entered)**:
> Target: [X] kg. I'll design your plan around that.

**Transition**: Crossfade to next screen

---

## SCREEN 4 — Motivation

**AI Coach (First message)**:
> One more thing—this one matters.

**AI Coach (Second message)**:
> Why did you decide to start this journey?
>
> What happens when you reach your goal?

**User types response** (or skips)

**AI Coach (If answered)**:
> Thank you for sharing that.
>
> I'll remember it—especially on the days when motivation feels low.
>
> Let's build the plan.

**AI Coach (If skipped)**:
> No problem. We can always revisit that later.
>
> Let's build the plan.

**Transition**: Fade to next screen

---

## SCREEN 5 — Activity

**AI Coach**:
> How active is your typical week?

**User selects activity level**

**AI Coach (After activity selected)**:
> Got it. Now—how much experience do you have with structured training?

**User selects experience level**

**AI Coach (After both selected)**:
> Perfect. I'll calibrate your daily calorie target to [X] kcal based on [activity level].
>
> And I'll match workout difficulty to your [experience level].

**Transition**: Slide up to next screen

---

## SCREEN 6 — Training

**AI Coach**:
> How many days per week can you realistically train?
>
> Be honest—consistency beats perfection.

**User selects days**

**AI Coach (After days selected)**:
> And how long is a typical session?

**User adjusts slider**

**AI Coach (After duration set)**:
> Perfect. I'll design [X] workouts per week, each around [Y] minutes.
>
> That's sustainable.

**Transition**: Crossfade to next screen

---

## SCREEN 7 — Nutrition

**AI Coach**:
> Let's talk nutrition.
>
> I'll be recommending meals and tracking your food. Do you have any dietary preferences or restrictions?

**User selects diet type**

**AI Coach (After diet type selected)**:
> Any food allergies I should know about?

**User selects allergies (or "None")**

**AI Coach (After allergies confirmed)**:
> Noted. All meal recommendations will be [diet type].
>
> [If allergies]: And I'll flag any foods containing [allergies].

**Transition**: Slide up to next screen

---

## SCREEN 8 — Schedule

**AI Coach**:
> When does your day typically start and end?
>
> This helps me time reminders and recommendations.

**User sets wake time, sleep time, sleep hours**

**AI Coach (After times set)**:
> Great. I'll send reminders during your waking hours.
>
> And I'll track sleep quality in the Recovery module.

**Transition**: Crossfade to next screen

---

## SCREEN 9 — App Preferences

**AI Coach**:
> Almost there. Just a few app preferences.

**User sets theme, units, time format**

**AI Coach (After preferences set — button says "Finish Setup")**:
> Perfect. Your app is configured.

**Transition**: Fade to black → calculation screen

---

## SCREEN 10A — Calculation (Loading)

**AI Coach** (visual text, not spoken):
> Analyzing your profile...

**Checklist items appear sequentially**:
- ✓ Calculating BMR...
- ✓ Adjusting for activity level...
- ✓ Applying goal-specific targets...
- ✓ Generating macro distribution...
- ✓ Finalizing your plan...

**2.5 seconds pass**

---

## SCREEN 10B — Plan Review

**AI Coach**:
> Your plan is ready, [Name].

**Cards reveal with numbers**

**No additional speaking**. User reviews the plan.

**Button**: Looks Good, Let's Go

---

## SCREEN 11 — Celebration

**AI Coach**:
> Setup Complete.
>
> Your personal AI coach is now active.
>
> Your first mission begins today.
>
> Let's ascend.

**Milestones reveal**:
- ✓ Profile created
- ✓ Goals defined
- ✓ Targets calculated
- ✓ AI coach initialized

**3-second countdown** → auto-redirect to Mission Control

**Button**: Enter Mission Control (skips countdown)

---

## Conversation Tone Analysis

### Opening (Screens 0–1)
**Tone**: Welcoming, confident, personal
**Length**: Short sentences. No jargon.
**Purpose**: Establish trust and set expectations.

### Information Gathering (Screens 2–8)
**Tone**: Supportive, non-judgmental, practical
**Length**: Concise questions. Brief explanations.
**Purpose**: Collect data without feeling like an interrogation.

### Finalization (Screens 9–11)
**Tone**: Encouraging, celebratory, energizing
**Length**: Very brief. Mostly visual.
**Purpose**: Build excitement for what comes next.

### Word Count
- **Total AI spoken words**: ~450 words
- **Average per screen**: 40–50 words
- **Longest message**: Screen 2 (Foundation) — 32 words
- **Shortest message**: Screen 9 (Preferences) — 6 words

### Key Principles Followed
1. **Never patronizing**. Never "Good job!" for trivial inputs.
2. **Always explains why**. Every field has a clear purpose stated.
3. **Acknowledges input**. After every answer, AI confirms understanding.
4. **Conversational, not corporate**. Speaks like a coach, not a FAQ bot.
5. **Respects time**. No filler. Every sentence has a purpose.

---

---

# PART 3 — ANIMATION MAP {#animations}

Every animation, sequenced precisely. No guessing during development.

---

## Global Animation System

**Base library**: Framer Motion (already installed)
**Easing tokens** (from globals.css):
- `--ease-spring`: cubic-bezier(0.175, 0.885, 0.32, 1.15) — bouncy
- `--ease-ui`: cubic-bezier(0.4, 0, 0.2, 1) — material standard
- **New for onboarding**: `[0.16, 1, 0.3, 1]` — smooth deceleration for messages

**Duration tokens**:
- `instant`: 0ms — state changes
- `fast`: 150ms — micro interactions
- `normal`: 300ms — transitions
- `slow`: 500ms — hero moments
- `entrance`: 400ms — component arrival

---

## SCREEN 0 — Welcome

```
t=0ms    Background loads (AmbientBackground already handles this)
t=0ms    Logo mark: opacity 0 → 1, scale 0.8 → 1.0 (500ms, ease-spring)
t=150ms  Headline: opacity 0 → 1, y +16 → 0 (400ms, ease-out)
t=250ms  Tagline: opacity 0 → 1, y +12 → 0 (400ms, ease-out)
t=500ms  CTA button: opacity 0 → 1, y +8 → 0 (300ms, ease-out)
t=600ms  "Learn More": opacity 0 → 1 (300ms, ease-out)
```

---

## SCREEN TRANSITION — Forward (any screen → next)

```
Current screen: opacity 1 → 0, x 0 → -20px (250ms, ease-in)
Next screen:    opacity 0 → 1, x +20px → 0 (300ms, ease-out, delay 50ms)
ProgressHeader: bar fills proportionally (500ms, [0.16, 1, 0.3, 1])
Step label:     text crossfades via AnimatePresence (200ms)
```

## SCREEN TRANSITION — Back (any screen → previous)

```
Current screen: opacity 1 → 0, x 0 → +20px (250ms, ease-in)
Previous screen: opacity 0 → 1, x -20px → 0 (300ms, ease-out, delay 50ms)
ProgressHeader: bar shrinks proportionally (500ms, ease-out)
```

---

## COACH MESSAGE ENTRANCE

```
Avatar:   scale 0 → 1 (spring, stiffness 300, damping 20, delay = step_delay + 100ms)
Bubble:   opacity 0 → 1, y +10 → 0, scale 0.98 → 1.0 (400ms, [0.16, 1, 0.3, 1])

Second message (if same screen):
  Same as above, delay = first_message_delay + 200ms

Text inside bubble: no additional animation (avoid over-engineering)
```

---

## CHOICE CARDS

```
Group entrance: stagger each card by 50ms
Each card:
  opacity 0 → 1, y +8 → 0 (350ms, [0.16, 1, 0.3, 1])

On select (not selected → selected):
  Border color transitions (200ms, ease-out)
  Check icon: scale 0 → 1 (spring, stiffness 400, damping 15)
  Background tint: opacity 0 → 0.05 (200ms)
  Other cards: opacity 1.0 → 0.7 (200ms) — subtle de-emphasis

On deselect (selected → not selected):
  Reverse of above (150ms)
```

---

## WHEEL SELECTOR

```
On scroll/drag:
  List translates continuously with drag gesture
  Items scale subtly based on distance from center:
    center item: scale 1.0, full opacity, bold weight
    ±1 item:     scale 0.95, 70% opacity
    ±2 item:     scale 0.90, 40% opacity

On snap (release):
  Spring animation to nearest item (stiffness 300, damping 30)
  Selected item: instant weight/size update

Top/bottom fade:
  Static CSS gradient — no animation
```

---

## PROGRESS HEADER

```
Progress bar fill:
  On every step advance: width % → new % (500ms, [0.16, 1, 0.3, 1])

Back button:
  Appears:  opacity 0 → 1, x -8 → 0 (200ms)
  Hides:    opacity 1 → 0, x 0 → -8 (200ms) — only on step 1

Step label:
  Crossfade via AnimatePresence:
  Exit:   opacity 1 → 0, y 0 → +4px (200ms)
  Enter:  opacity 0 → 1, y -4px → 0 (200ms)
```

---

## TEXT INPUT (Name screen)

```
Input focus:
  Border color: transitions to accent (150ms)
  No other animation

Nickname field appearance (after name is typed):
  opacity 0 → 1, y +8 → 0 (300ms, ease-out)
  height 0 → auto: NOT animated (layout shift risk)
  Instead: opacity + translate only, use margin-top for spacing
```

---

## INLINE EXPANSION (Goal → Target Weight)

```
When goal is selected:
  Target weight section:
    opacity 0 → 1 (300ms)
    y +12 → 0 (300ms, [0.16, 1, 0.3, 1])
    Do NOT animate height — leads to janky reflow on mobile
    Use: add to DOM, animate opacity + translate
```

---

## ALLERGEN CHIPS (Screen 7)

```
Initial render: all chips visible, no entrance animation (already on screen)

On select:
  Background fills: opacity 0 → 1 (150ms)
  Check appears: scale 0 → 1 (spring)

On deselect:
  Reverse (150ms)

"Add more" chip:
  Standard interactive press feedback (scale 0.95 → 1 on release)
```

---

## SCREEN 10 — CALCULATION LOADING

```
t=0ms     ThinkingAnimation dots appear: staggered opacity/scale (stagger 150ms each)
t=200ms   Checklist item 1: opacity 0 → 1, x -8 → 0 (300ms)
t=400ms   Item 1 check: scale 0 → 1 (spring) — checkmark fills in
t=500ms   Checklist item 2: opacity 0 → 1, x -8 → 0 (300ms)
t=700ms   Item 2 check: scale 0 → 1 (spring)
t=800ms   Checklist item 3: appears
t=1000ms  Item 3 check
t=1100ms  Checklist item 4: appears
t=1300ms  Item 4 check
t=1400ms  Checklist item 5: appears
t=1600ms  Item 5 check
t=2000ms  Screen crossfades to plan review
```

## SCREEN 10 — PLAN REVIEW

```
t=0ms     Coach message: standard entrance (400ms)
t=200ms   Daily targets card: opacity 0 → 1, y +12 → 0 (400ms)
t=350ms   Metrics card: opacity 0 → 1, y +12 → 0 (400ms)
t=400ms   Numbers inside cards: CountUp animation (700ms each, easeOut)
t=700ms   Primary CTA button: opacity 0 → 1, y +8 → 0 (300ms)
t=800ms   "Adjust Targets" text link: opacity 0 → 1 (300ms)
```

---

## SCREEN 11 — CELEBRATION

```
t=0ms     Background: subtle pulse/glow (ongoing, 3s loop)
t=0ms     Icon glow: opacity 0 → 0.4 (500ms, ease-out)
t=100ms   Icon container: scale 0 → 1, rotate -180 → 0 (spring, stiffness 200, damping 15)
t=300ms   Title: opacity 0 → 1, y +12 → 0 (400ms, [0.16, 1, 0.3, 1])
t=450ms   Subtitle: opacity 0 → 1 (400ms)
t=600ms   Milestone 1: opacity 0 → 1, x -12 → 0 (400ms)
t=700ms   Milestone 1 check: scale 0 → 1 (spring)
t=750ms   Milestone 2: opacity 0 → 1, x -12 → 0
t=850ms   Milestone 2 check
t=900ms   Milestone 3: appears
t=1000ms  Milestone 3 check
t=1050ms  Milestone 4: appears
t=1150ms  Milestone 4 check
t=1300ms  Enter button: opacity 0 → 1, y +8 → 0 (400ms)
t=1500ms  Countdown text: opacity 0 → 1 (300ms)

Countdown: text updates 3... 2... 1... (1s intervals)
Auto-redirect at t=4500ms
```

---

## CONTINUE BUTTON — State Transitions

```
Disabled state:
  opacity: 0.4
  cursor: not-allowed

Enabled state (validation passes):
  opacity: 0.4 → 1.0 (200ms)
  subtle scale 0.98 → 1.0 (200ms, ease-spring)
  No bounce — transition should feel like permission, not celebration

On press:
  scale 1.0 → 0.97 (100ms)
  scale 0.97 → 1.0 (150ms)

Loading state (final submit):
  Show Spinner (already in Button component)
  opacity of children → 0, spinner fades in
```

---

## HAPTICS MAP (Mobile Only)

```
Card selected:      vibrate(10ms)  — subtle confirmation
Wheel snaps:        vibrate(5ms)   — very light tick
Continue pressed:   vibrate(15ms)  — standard
Celebration screen: vibrate([0, 100, 50, 100])  — success pattern
Goal achieved:      vibrate([0, 50, 100, 50])   — milestone pattern
```

*(Uses existing `utils/haptics.ts` — `vibrate()` already in Button component)*

---

## REDUCED MOTION

All Framer Motion animations respect `prefers-reduced-motion` automatically.

Additional overrides:
- Celebration glow pulse: `animation: none` when reduced motion
- Counting numbers: show final value immediately (no CountUp)
- Screen transitions: opacity only (no translate)
- Wheel selector: instant snap (no spring)

---

---

# PART 4 — UX REVIEW {#ux-review}

Walking through the onboarding as a real user. Critical questions answered.

---

## First Impressions

### Would I enjoy this?

**Answer**: Yes, if I value efficiency and clarity.

**Why**:
- No fake enthusiasm ("Amazing!", "Awesome!") for mundane inputs
- Every question has a clear purpose, stated upfront
- Progress is always visible (step counter, progress bar)
- No dark patterns (skip is available where appropriate)
- Feels conversational without pretending to be human

**Risk**: Users who expect gamification or heavy animation might find it "boring."

**Mitigation**: Celebration screen at the end provides that dopamine hit. The journey is calm, the arrival is exciting.

---

### Would I quit here?

#### SCREEN 1 — Name
**Quit risk**: Low (5%)
**Why**: First interaction, no commitment yet, simple input
**Mitigation**: Make keyboard input immediate and responsive

#### SCREEN 2 — Foundation
**Quit risk**: Medium (15%)
**Why**: Asking for DOB/height/weight early can feel invasive
**Friction point**: Wheel pickers unfamiliar to some users
**Mitigation**:
- AI explains "why" upfront ("these drive everything")
- Pickers are touch-friendly and obvious
- Show BMI immediately after (instant value)

#### SCREEN 3 — Goal
**Quit risk**: Low (5%)
**Why**: This is what they came for — defining their goal
**Strong moment**: User sees their vision reflected

#### SCREEN 4 — Motivation
**Quit risk**: Medium-High (20%)
**Why**: Open-ended text input = cognitive load
**Friction point**: People freeze when asked "why"
**Mitigation**:
- Skip is prominent and guilt-free
- "This stays between us" reduces vulnerability fear
- Positioned after goal (which gave excitement) to balance mood

#### SCREEN 5–6 — Activity/Training
**Quit risk**: Low (8%)
**Why**: Clear choices, no overthinking
**Smooth moment**: User feels progress

#### SCREEN 7 — Nutrition
**Quit risk**: Very Low (3%)
**Why**: Almost done, questions are lightweight

#### SCREEN 8–9 — Schedule/Preferences
**Quit risk**: Very Low (2%)
**Why**: Finish line visible

#### SCREEN 10 — Calculation
**Quit risk**: Very Low (1%)
**Why**: Already invested, waiting for payoff

---

## Question Necessity Audit

### Is every question necessary?

**Screen 1 — Name**: YES. Required for personalization throughout app.

**Screen 2 — DOB**: YES. Required for BMR calculation (age is a factor).

**Screen 2 — Height/Weight**: YES. Required for BMI, TDEE, macro calculations.

**Screen 3 — Goal**: YES. Drives calorie deficit/surplus decision.

**Screen 3 — Target Weight**: BORDERLINE. Could be deferred.
- **Keep because**: Goal countdown widget is immediate value.
- **Remove if**: We need to reduce onboarding length.

**Screen 4 — Motivation**: NO (but valuable).
- This is enrichment, not requirement.
- Already has skip option. ✓ Correct approach.

**Screen 5 — Activity Level**: YES. TDEE multiplier depends on this.

**Screen 5 — Fitness Experience**: YES. Workout difficulty must match experience.

**Screen 6 — Workout Days**: YES. Mission scheduler needs this.

**Screen 6 — Session Duration**: BORDERLINE. Could default to 60min and let user adjust in settings later.
- **Keep because**: Mission structure depends on time budget.

**Screen 7 — Diet Type**: YES. Meal recommendations are useless without this.

**Screen 7 — Allergies**: YES. Safety-critical (allergen warnings).

**Screen 8 — Wake/Sleep Times**: BORDERLINE. Primarily for reminders.
- **Keep because**: Reminders are core feature. Bad default times = annoying.

**Screen 8 — Sleep Goal**: NO (but low-friction). Could auto-calculate as 8h based on wake/sleep times.
- **Keep because**: It's a slider, takes 2 seconds, user might want 7h or 9h.

**Screen 9 — App Preferences**: YES. Units and theme matter immediately on first dashboard view.

### Could questions be combined?

**Possible combination 1**: Activity Level + Fitness Experience (same screen)
- **Current**: Two-step interaction within one screen
- **Alternative**: All 8 cards on one screen at once
- **Decision**: KEEP CURRENT. Sequential feels less overwhelming.

**Possible combination 2**: Wake Time + Sleep Time + Sleep Hours
- **Current**: All on Screen 8 (already combined)
- **Decision**: CORRECT as-is.

**Possible combination 3**: Height + Weight (eliminate DOB)
- **Current**: All three on Screen 2
- **Alternative**: Remove DOB wheel, ask age as text input
- **Decision**: KEEP CURRENT. Wheel picker is more engaging than typing age.

---

## AI Voice Analysis

### Does the AI talk too much?

**No**. Average message length: 15–30 words. Longest message: 32 words.

**Comparison to human coaches**:
- Human personal trainer (in-person): ~100 words/minute while explaining
- This onboarding: ~450 words across 10 screens = **45 words per screen**
- If each screen takes 20 seconds, that's ~135 words/minute equivalent
- **Verdict**: Matches conversational pacing.

### Does the AI talk too little?

**Risk on Screen 9** (App Preferences):
- AI says: "Almost there. Just a few app preferences."
- Then: Theme / Units / Time Format (no additional context)
- **Possible issue**: User might not understand what "units" means.
- **Fix**: Add one more sentence: "These control how the app displays data to you."

**Risk on Screen 10B** (Plan Review):
- AI says: "Your plan is ready, [Name]."
- Then shows numbers with no explanation.
- **Possible issue**: User might not know what TDEE/BMR means.
- **Fix**: Add tooltips or one-line explainers:
  - TDEE: "Total calories your body burns daily"
  - BMR: "Calories burned at rest"
  - BMI: "Body Mass Index (height/weight ratio)"

---

## Emotional Pacing

```
Welcome         →  Neutral/Curious
Screen 1        →  Engaged (personal connection)
Screen 2        →  Focused (data entry)
Screen 3        →  Excited (defining goal)
Screen 4        →  Reflective (motivation — emotional dip)
Screen 5–6      →  Steady (information flow)
Screen 7–8      →  Smooth (almost done feeling)
Screen 9        →  Relieved (last step visible)
Screen 10       →  Anticipation (waiting for plan)
Screen 11       →  Celebration (payoff)
```

**Emotional valleys**: Screen 2 (data entry), Screen 4 (open-ended text)

**Emotional peaks**: Screen 3 (goal selected), Screen 11 (completion)

**Pattern**: Dip → peak → dip → peak → sustained → celebration

**Verdict**: Natural rhythm. The Screen 4 dip (motivation) could scare some users, but the skip option prevents true frustration.

---

## Decision Fatigue Analysis

```
Screen 1:  1 decision  (name)
Screen 2:  3 decisions (DOB, height, weight)
Screen 3:  2 decisions (goal, target weight)
Screen 4:  1 decision  (write motivation or skip)
Screen 5:  2 decisions (activity, experience)
Screen 6:  2 decisions (days, duration)
Screen 7:  2 decisions (diet, allergies)
Screen 8:  3 decisions (wake, sleep, sleep hours)
Screen 9:  3 decisions (theme, units, time)

Total: 19 decisions
```

**Benchmark**: Good onboarding = 15–25 decisions. Bad onboarding = 40+.

**Verdict**: 19 decisions is acceptable. Within range.

**Mitigation already in place**:
- Most screens have 1–3 decisions (not overwhelming)
- Screens with 3 decisions are lightweight (toggles, not text)
- Screens with text input (Screen 1, 4) have only 1–2 fields

---

## Accessibility Review

### Screen Reader Experience

**Screen 0**: ✓ All text is semantic. Button has clear label.

**Screen 1–11**: ✓ All inputs have aria-labels. CoachMessage uses semantic HTML (not just divs). ProgressHeader has `role="progressbar"` with `aria-valuenow`.

**WheelSelector**: ✓ Uses `role="listbox"`, `role="option"`, `aria-selected`. Could improve: add `aria-activedescendant` for better screen reader context.

**ChoiceCard**: ✓ Uses `button` element. Has `aria-pressed` for selection state.

### Keyboard Navigation

**Current state**: All interactive elements are `<button>` or `<input>`. Tab order is DOM order (correct).

**Missing**: Focus traps in modals (if "Learn More" modal is added).

**Missing**: Escape key to dismiss modals.

**Missing**: Arrow keys for wheel selector (currently mouse/touch only).

**Fix needed**: Add keyboard controls to `WheelSelector` (Up/Down arrows to change value, Enter to confirm).

### Color Contrast

**Assumes**: Design system already meets WCAG AA (2.0 ratio for large text, 4.5:1 for small text).

**Risk**: Accent colors on white background.
- Example: `--color-accent-blue` on `--color-bg-surface` might not meet 4.5:1.
- **Fix**: Border + icon for ChoiceCard (not just background tint).

### Touch Targets

**All buttons**: `h-11` minimum (44px) = WCAG AAA compliant ✓

**ChoiceCards**: Full card is tappable, not just icon. ✓

**WheelSelector items**: `itemHeight={44}` default = compliant. ✓

---

## Summary: Would this onboarding succeed?

**Yes, with minor fixes**.

### Strengths:
1. Clear purpose for every question
2. Conversational without being fake
3. Progress always visible
4. Skip available where appropriate
5. Emotional pacing is balanced
6. Decision count is reasonable (19 total)
7. Celebration at the end provides payoff

### Weaknesses:
1. Screen 2 (DOB/height/weight) could lose some users (15% quit risk)
2. Screen 4 (motivation) is emotionally heavy (20% quit risk)
3. Wheel selector is unfamiliar interaction for some
4. Plan review screen (Screen 10B) lacks explanations for TDEE/BMR
5. Keyboard navigation for WheelSelector needs work

### Recommended Fixes (Before Implementation):
1. **Screen 2**: Add example values in placeholders ("e.g., 175 cm")
2. **Screen 4**: Consider moving to end of onboarding, or make it truly optional (don't show at all if user seems impatient)
3. **Screen 10B**: Add ? icons with tooltips for TDEE/BMR/BMI
4. **Wheel Selector**: Add keyboard controls (Up/Down arrows)
5. **All screens**: Test on 5 real users before launch

---

---

# PART 5 — MOBILE REVIEW {#mobile-review}

95% of users will experience this on a phone. Reviewed for each common viewport.

---

## Viewport Test Grid

| Device | Width | Height | Notes |
|--------|-------|--------|-------|
| iPhone SE (3rd gen) | 375px | 667px | Small, no notch |
| iPhone 14 | 390px | 844px | Standard notch |
| iPhone 14 Pro Max | 430px | 932px | Large, Dynamic Island |
| Samsung S23 | 360px | 780px | Common Android |
| Samsung S23 Ultra | 412px | 915px | Large Android |
| Fold/Flip (folded) | 320px | 747px | Minimum support |
| iPad Mini | 744px | 1133px | Tablet |
| Landscape (any) | varies | ~400px | Short viewport |

---

## 320px (Fold/Flip Minimum)

**Critical failures at 320px:**

### ProgressHeader
- Step label + counter may overlap back button
- **Fix**: Hide step label at 320px. Show only counter. (`hidden xs:block`)

### Screen 3 — Goal Cards
- ChoiceCard icon + title + description at 320px is tight
- At 320px: 4 full cards with descriptions = too long
- **Fix**: Remove description text at 320px. Show title only.

### Screen 2 — Wheel Pickers (Side by Side)
- Height + Weight wheels side by side at 320px: each wheel ~140px wide
- WheelSelector min-width needed: 100px
- **Issue**: If label text is long ("Height (cm)"), it wraps awkwardly
- **Fix**: Shorter labels. "Height" not "Height (cm)". Unit shown inside wheel.

### Screen 6 — Week Calendar
- 7 day circles at 320px: each circle ~36px wide
- **Fix**: Reduce circle size to 32px on screens < 360px

### Continue Button
- Already `fullWidth` — no issue.

### Keyboard + Content
- At 320px, keyboard takes ~50% of screen
- Coach message + input visible: tight but works
- **Critical**: Coach message must be ABOVE input (current design does this ✓)

---

## 360px (Common Android)

**Minor issues:**

### Screen 2 — Three Wheels Side By Side
- Month + Day + Year wheels at 360px: ~110px each
- Barely workable. Month wheel needs horizontal space for "September".
- **Fix**: Use abbreviated month names (Jan, Feb, Mar).

### Screen 5 — 5 Activity Cards
- 5 stacked cards with icon + title + description
- Total height at 360px with keyboard hidden: ~480px
- **Issue**: Requires scrolling to see all 5 cards + Continue button
- **Fix**: This is acceptable — scrolling is expected. Ensure Continue is NOT hidden below fold.
- **Confirm**: Make Continue button sticky at bottom (`position: sticky`, `bottom: 0`)

---

## 375px (iPhone SE, iPhone 14 base)

**This is the primary design target.**

### All screens: OK at 375px

**Screen 2** (Foundation):
- DOB: 3 wheels across = ~110px per column. Tight but functional.
- Height + Weight: two wheels on separate rows at 375px = better than side by side
- **Recommendation**: Stack height and weight vertically on 375px, side by side on 430px+

### Screen 6 — Week Calendar
- 7 circles at 375px: ~40px each with gaps. Comfortable. ✓

### Screen 7 — Allergen Chips
- 6 chips in flex-wrap at 375px: 2–3 per row. ✓

### Keyboard behavior
- iOS keyboard height: ~291px (portrait)
- At 375px with keyboard open, visible area: 375px × ~330px
- Coach message (2 lines) + input field = ~120px
- Remaining: ~210px — enough for message + input + Continue button
- **Confirm**: Test with `interactive-widget: resizes-visual` (already in viewport meta ✓)

---

## 390px (iPhone 14 standard)

**Comfortable experience at 390px.**

### Dynamic Island (iPhone 14 Pro+)
- No content behind Dynamic Island (safe area handled by viewport meta ✓)
- ProgressHeader top padding should account for status bar height
- **Fix**: Add `pt-safe` or `pt-[env(safe-area-inset-top)]` to top of onboarding layout

### Notch (older iPhones)
- Same safe area pattern ✓

---

## 414px (iPhone Plus / Max)

**Everything works comfortably.**

### Opportunity: Better layouts on 414px+
- Screen 2: Height + Weight side by side (instead of stacked)
- Screen 8: Wake + Sleep pickers side by side (already designed this way ✓)

---

## 430px (iPhone 14 Pro Max, 15 Max)

**Best experience. Full layouts visible.**

### Screen 5 — Activity Cards
- All 5 cards visible without scrolling on 430px. ✓

### Consider: Two-column ChoiceGroup for 430px
- Screen 3 (goals): 2×2 grid on 430px. Reduces scroll.
- **Risk**: Goal cards need description — grid makes them short. Text truncates.
- **Decision**: Keep stacked. Description copy is too important to truncate.

---

## Landscape Mode

**The problematic case.**

At landscape on 375px: visible height = ~280px (keyboard hidden) or ~150px (keyboard open).

### Onboarding in landscape:

**Screen 0**: Fine. Short content.

**Screen 1**: Coach message + 2 inputs + button. At 280px height: scrollable but tight.
- **Fix**: Reduce top/bottom padding in landscape. Coach message becomes one line.

**Screen 2**: 3 wheel pickers side by side + Continue. At 280px: wheels are ~160px tall.
- **visibleCount={5}** at 44px each = 220px for wheels alone.
- **Fix**: Detect landscape + reduce to `visibleCount={3}` (132px)

**Screen 5**: 5 tall stacked cards. At 280px: requires significant scrolling.
- **Fix**: This is acceptable on landscape. Scroll is fine. Make sure cards don't get cut off.

**Recommendation**: Landscape support = scroll works correctly. No landscape-specific layouts needed. Test scroll in every screen for landscape.

---

## Tablet (744px iPad Mini)

**Onboarding should use a centered panel, not full-width.**

### Design at 744px:
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│          ┌─────────────────────────────────────┐              │
│          │                                     │              │
│          │    [Onboarding panel, max-w-lg]     │              │
│          │                                     │              │
│          └─────────────────────────────────────┘              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

- Container: `max-w-lg mx-auto` (already in current implementation ✓)
- Background: Full-screen (AmbientBackground fills tablet)
- No layout changes needed — centering handles tablet gracefully

---

## Critical Mobile Decisions

### 1. Sticky Continue Button

**Decision**: Continue button must be `position: sticky` at `bottom: env(safe-area-inset-bottom, 24px)`.

**Why**: Content may be taller than viewport. User should never need to scroll to find Continue.

**Implementation**:
```tsx
// Layout structure for every onboarding step
<div className="flex flex-col min-h-[100svh]">
  <ProgressHeader />            {/* fixed top */}
  <div className="flex-1 overflow-y-auto px-4 py-6">
    {/* Coach messages + interaction */}
  </div>
  <div className="sticky bottom-0 px-4 pb-[env(safe-area-inset-bottom,24px)] pt-4 bg-gradient-to-t from-[var(--color-bg-base)] to-transparent">
    <Button fullWidth>Continue</Button>
  </div>
</div>
```

### 2. Use `100svh` not `100vh`

**Why**: On mobile, `100vh` includes the browser toolbar. `100svh` (small viewport height) accounts for it.
- Already handled by `min-h-screen` in some places but must be explicit for onboarding.

### 3. Keyboard Avoidance

**Already configured**: `interactiveWidget: "resizes-visual"` in viewport metadata ✓

**What this means**: When keyboard opens, the visual viewport shrinks. The onboarding layout must scroll correctly.

**Test**: Screen 1 (Name) with keyboard open. Confirm button visible without scrolling.

### 4. Tap Area Minimums

- All interactive elements: minimum 44×44px ✓ (buttons use `h-11`, cards are full-width)
- Day circles (Screen 6): minimum 36px. On 320px: may need to use 32px — acceptable minimum.
- Allergen chips: `py-1.5` × 2 + text = ~36px. Add `min-h-[36px]` to ensure compliance.

### 5. Scroll Performance

- Wheel pickers: use `transform: translateY()` for scrolling (not `top:`) for 60fps. Framer Motion handles this ✓
- Long choice lists: no virtualization needed (max 5 items)
- Safe: no infinite lists in onboarding

---

## Mobile Review Summary

| Screen | 320px | 360px | 375px | 390px | 414px+ | Landscape | Tablet |
|--------|-------|-------|-------|-------|--------|-----------|--------|
| 0: Welcome | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 1: Name | ⚠️ keyboard tight | ✓ | ✓ | ✓ | ✓ | ⚠️ scroll | ✓ |
| 2: Foundation | ⚠️ wheel labels | ⚠️ month abbrev | ✓ | ✓ | ✓ | ⚠️ wheel height | ✓ |
| 3: Goal | ⚠️ no descriptions | ✓ | ✓ | ✓ | ✓ | ⚠️ scroll | ✓ |
| 4: Motivation | ✓ | ✓ | ✓ | ✓ | ✓ | ⚠️ keyboard | ✓ |
| 5: Activity | ⚠️ scroll | ⚠️ scroll | ✓ scroll | ✓ | ✓ | ⚠️ scroll | ✓ |
| 6: Training | ⚠️ circles 32px | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 7: Nutrition | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 8: Schedule | ✓ | ✓ | ✓ | ✓ | ✓ | ⚠️ wheel height | ✓ |
| 9: Prefs | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 10: Calc | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 11: Celebrate | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Legend**: ✓ = Works well. ⚠️ = Works with noted fix.

### Required Fixes Before Implementation

1. **Wheel labels**: Use abbreviated month names (Jan-Dec)
2. **320px goal cards**: Hide description text at 320px
3. **320px ProgressHeader**: Hide step label, keep counter
4. **Landscape wheel height**: Reduce `visibleCount` from 5 to 3
5. **Continue button**: Sticky bottom with safe-area inset
6. **`100svh`**: Replace any `100vh` with `100svh` in onboarding layout
7. **Day circles**: Minimum 32px on 320px
8. **Allergen chips**: Minimum 36px height

---

---

# PART 6 — FINAL VERDICT {#verdict}

Is this onboarding ready for implementation?

---

## Design Quality: 9/10

**Strengths**:
- Every screen has a clear purpose
- Conversational tone feels genuine (not corporate)
- Emotional pacing has natural rhythm (dips and peaks)
- Visual hierarchy is clear (coach → interaction → CTA)
- Progress is always visible
- Celebration at end provides payoff

**Weaknesses**:
- Screen 2 (DOB/height/weight) could lose impatient users
- Screen 4 (motivation) is emotionally heavy for some
- Plan review screen lacks explanations (TDEE/BMR/BMI)

**Grade deduction**: -1 for potential quit risk at Screen 2 and 4.

---

## Conversation Quality: 10/10

**Strengths**:
- Concise (avg 30 words per message, max 32)
- Always explains "why" before asking
- Never patronizing ("Good job!" for trivial inputs)
- Respects user's time (no filler)
- Natural transitions between screens

**No weaknesses identified.**

---

## Animation Quality: 8/10

**Strengths**:
- Clear sequence defined for every transition
- Stagger timing creates natural flow (not all-at-once)
- Respects `prefers-reduced-motion`
- Haptics mapped for key moments
- Uses existing design system easing tokens

**Weaknesses**:
- Wheel selector keyboard navigation missing
- Some animation durations not tested (may need adjustment after build)

**Grade deduction**: -2 for missing keyboard controls and untested timing.

---

## Mobile Experience: 7/10

**Strengths**:
- Touch targets meet WCAG AAA (44px minimum)
- Works at 320px minimum (with fixes)
- Keyboard handled correctly (`resizes-visual`)
- Tablet layout gracefully centers

**Weaknesses**:
- Multiple layout breakpoints needed (320px, 360px, 375px, landscape)
- Wheel selector in landscape needs reduced `visibleCount`
- Some screens require scroll on small viewports (acceptable but not ideal)
- Continue button must be sticky (not yet specified in primitives)

**Grade deduction**: -3 for complexity of responsive fixes needed.

---

## Accessibility: 7/10

**Strengths**:
- Semantic HTML throughout
- ARIA labels on custom controls
- Color contrast likely meets WCAG AA (assumes design system compliance)
- Screen reader friendly

**Weaknesses**:
- Wheel selector keyboard navigation missing (critical)
- No focus trap in modals (if "Learn More" modal added)
- No Escape key handlers
- TDEE/BMR/BMI lack explanations (cognitive accessibility)

**Grade deduction**: -3 for missing keyboard controls and explanatory content.

---

## Decision Fatigue: 9/10

**Strengths**:
- 19 total decisions (within 15–25 acceptable range)
- Most screens: 1–3 decisions each
- Skip option available where appropriate
- Defaults sensible (4 days training, 60 min, 8 hours sleep)

**Weaknesses**:
- Screen 4 (motivation) could overwhelm some users
- No "back to previous question" within a screen (e.g., if user picks wrong goal)

**Grade deduction**: -1 for Screen 4 potential overwhelm.

---

## Technical Feasibility: 10/10

**Strengths**:
- All primitives already built (Phase 1)
- All data fields defined (Data Contract)
- All calculations specified (Flow Map)
- No new dependencies required
- Fits existing architecture perfectly

**No weaknesses identified.**

---

## Overall Score: 8.5/10

**Ready for implementation**: **Yes, with fixes.**

---

## Critical Path Before Implementation

### Must Fix (Blockers)

1. **Wheel selector keyboard navigation** — cannot ship without this (accessibility failure)
2. **Continue button sticky positioning** — essential on mobile
3. **`100svh` for layout height** — prevents keyboard issues
4. **Abbreviated month names** — prevents wheel overflow at 320px
5. **TDEE/BMR/BMI tooltips** — cognitive accessibility issue

### Should Fix (Not Blockers)

6. **Screen 2 quit risk mitigation** — Add more reassurance in AI message
7. **Screen 4 alternative placement** — Consider moving motivation to end
8. **320px responsive tweaks** — Hide step label, reduce goal card descriptions
9. **Landscape wheel height** — Reduce `visibleCount` to 3

### Nice to Have (Post-Launch)

10. **Animation timing polish** — Adjust after seeing real implementation
11. **Focus trap in modals** — Only needed if "Learn More" modal is built
12. **Escape key handlers** — Improves power-user experience
13. **Back button within multi-part screens** — Better error recovery

---

## Recommended Implementation Order

### Phase 1: Core Structure (Day 1)
- Build onboarding page scaffold (`app/onboarding/page.tsx`)
- Implement step navigation state machine
- Add ProgressHeader + Continue button layout
- Test responsive layout at 375px

### Phase 2: Screens 0–3 (Day 2)
- Welcome screen (no state, just visuals)
- Name input (Screen 1)
- Foundation (Screen 2) — wheel pickers
- Goal selection (Screen 3) — choice cards
- Test flow through first 3 screens

### Phase 3: Screens 4–6 (Day 3)
- Motivation (Screen 4) — textarea + skip
- Activity (Screen 5) — stacked choice cards
- Training (Screen 6) — week calendar + slider
- Test emotional pacing through middle section

### Phase 4: Screens 7–9 (Day 4)
- Nutrition (Screen 7) — diet + allergens
- Schedule (Screen 8) — time pickers + sleep
- Preferences (Screen 9) — theme/units/time
- Test full flow without calculation logic

### Phase 5: Calculation + Celebration (Day 5)
- Build TDEE/BMR/macro calculation logic
- Implement Screen 10A (loading animation)
- Implement Screen 10B (plan review)
- Implement Screen 11 (celebration + redirect)
- Test complete flow end-to-end

### Phase 6: Polish + Fixes (Day 6)
- Fix all "Must Fix" items from critical path
- Add keyboard navigation to wheel selector
- Add TDEE/BMR/BMI tooltips
- Test all viewports (320px, 375px, 414px, landscape, tablet)
- Test keyboard-only navigation

### Phase 7: Testing + Launch Prep (Day 7)
- User testing with 5 real people
- Fix issues found during testing
- Add analytics tracking (step completion rates)
- Write migration logic for existing V1 users
- Deploy to staging

---

## What Could Go Wrong

### Risk 1: Wheel picker unfamiliarity
**Symptom**: Users don't understand they can scroll the wheels.
**Mitigation**: Add subtle animation on first render (wheel bobbles slightly).
**Fallback**: Add "Scroll to select" caption below wheels.

### Risk 2: Motivation screen abandonment
**Symptom**: 20%+ quit rate at Screen 4.
**Mitigation**: Make skip button more prominent.
**Fallback**: A/B test moving motivation to end of onboarding or removing entirely.

### Risk 3: Plan review confusion
**Symptom**: Users don't understand TDEE/BMR acronyms.
**Mitigation**: Add ? tooltips (already recommended).
**Fallback**: Rename to "Total Daily Calories" and "Resting Calories."

### Risk 4: Mobile keyboard blocking content
**Symptom**: Continue button not visible with keyboard open.
**Mitigation**: Use `100svh` and sticky positioning (already recommended).
**Fallback**: Test exhaustively on iOS Safari and Android Chrome.

### Risk 5: Animation jank on low-end devices
**Symptom**: Wheel picker lag on old Android phones.
**Mitigation**: Use `will-change: transform` on draggable elements.
**Fallback**: Reduce animation complexity on devices with < 4GB RAM (use feature detection).

---

## Success Metrics (Post-Launch)

Track these to validate the design:

### Completion Rate
- **Target**: ≥85% of users who start complete the entire flow
- **Benchmark**: Industry average for fitness app onboarding = 65–75%
- **Red flag**: <75% completion (investigate quit points)

### Time to Complete
- **Target**: 3–5 minutes for average user
- **Benchmark**: Fitness app onboarding = 4–7 minutes
- **Red flag**: >7 minutes (indicates confusion or friction)

### Quit Points (Track step-by-step)
- **Acceptable**: <5% quit per step
- **Warning**: 10–15% quit at any single step
- **Critical**: >20% quit at any step (requires immediate fix)

### Post-Onboarding Activation
- **Target**: ≥70% of completed users log at least one meal or workout within 24 hours
- **Benchmark**: SaaS activation = 60–70%
- **Red flag**: <50% (indicates onboarding didn't motivate action)

### User Feedback (Post-Onboarding Survey)
- "How would you describe the onboarding experience?" (1–5 scale)
- **Target**: ≥4.2 average
- **Benchmark**: Consumer app onboarding NPS = 4.0–4.5
- **Red flag**: <3.8 average

---

## Final Recommendation

**This onboarding is ready for implementation with the critical fixes listed above.**

The design is strong. The conversation is excellent. The animations are well-planned. The mobile experience has known issues but they're all fixable.

**Estimated implementation time**: 7 days (with one developer + one QA tester).

**Estimated polish time after first launch**: 2–3 days (based on user feedback).

**Risk level**: Low. The architecture is solid. The unknowns are minor (animation timing, quit rates).

**Go/No-Go**: **GO** — with the requirement that all "Must Fix" items are completed before launch.

---

**Document Status**: ✅ Phase 1.5 Complete — Ready for Phase 2 Implementation

**Next Step**: Create implementation task list with day-by-day breakdown.

Last reviewed: 2026-08-06

