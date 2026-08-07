# Onboarding Flow Map

**Version**: 2.0  
**Last Updated**: 2026-08-06  
**Status**: Phase 1 Architecture

---

## Purpose

This document defines the **complete user journey** through Ascend AI onboarding.

Every step specifies:
- **Purpose**: Why we're asking this
- **AI Message**: What the coach says (conversational tone)
- **User Interaction**: How the user responds
- **Validation**: What makes a valid answer
- **Stored Field**: Where the data goes (references `ONBOARDING_DATA_CONTRACT.md`)
- **Downstream Consumers**: What features use this data
- **Feature Unlocked**: What becomes available after this step

---

## Design Principles

1. **Conversation First**: Every step should feel like talking to a coach, not filling a form
2. **Progressive Disclosure**: Don't show all options at once - guide the user
3. **Immediate Value**: After every answer, explain what it unlocks
4. **Recovery**: User can pause and resume at any point
5. **No Dead Ends**: Every step has a sensible default or skip option
6. **Respect Time**: Minimum viable onboarding - defer non-essential questions

---

## Flow Overview

```
Welcome
  ↓
Step 1: First Impression (Name)
  ↓
Step 2: Physical Foundation (Height, Weight, DOB)
  ↓
Step 3: Mission Definition (Primary Goal, Target Weight)
  ↓
Step 4: Motivation Anchor (Why Starting)
  ↓
Step 5: Activity Context (Activity Level, Fitness Experience)
  ↓
Step 6: Training Commitment (Workout Days, Duration)
  ↓
Step 7: Nutrition Foundation (Diet Type, Allergies)
  ↓
Step 8: Daily Rhythm (Wake Time, Sleep Time)
  ↓
Step 9: App Preferences (Theme, Units)
  ↓
Calculation & Review
  ↓
Welcome to Mission Control
```

---

## Step 0: Welcome Screen

### Purpose
Set expectations and create excitement for the journey ahead.

### AI Message
```
"Welcome to Ascend AI.

I'm your personal health coach.

Over the next few minutes, I'll get to know you—
your goals, your lifestyle, your challenges.

By the end, I'll have a complete personalized plan ready for you.

No generic advice. No cookie-cutter programs.
Just a strategy built specifically for you.

Ready to begin?"
```

### User Interaction
- **Type**: Single primary button
- **Action**: "Let's Start"
- **Secondary**: "Learn More" (opens feature overview modal)

### Validation
None (informational only)

### Stored Field
None

### Downstream Consumers
None

### Feature Unlocked
Access to Step 1

---

## Step 1: First Impression

### Purpose
Establish personal connection and collect name for personalized greetings throughout the app.

### AI Message
```
"First, let me introduce myself properly.

I'm Coach—your AI fitness and nutrition advisor.

I'll be with you every step of this journey.
Celebrating wins, adjusting plans, answering questions.

What should I call you?"
```

### User Interaction
- **Type**: Text input (conversational bubble)
- **Field**: Full name
- **Placeholder**: "Your name"
- **Secondary Field** (appears after name entered): "Prefer a nickname? (optional)"

### Validation
- Full name: 2-100 characters, letters and spaces only
- Nickname: 1-50 characters (optional)

### Stored Field
- `UserProfile.identity.fullName`
- `UserProfile.identity.nickname` (optional)

### Downstream Consumers
- Dashboard (personalized greeting: "Welcome back, [Name]")
- AI Coach (addressing user by name)
- Settings (profile display)

### Feature Unlocked
Personalized experience throughout app

### AI Follow-up
```
"Great to meet you, [Name].

Let's build your profile."
```

---

## Step 2: Physical Foundation

### Purpose
Collect essential biometric data for TDEE, BMR, and BMI calculations. Foundation for all nutrition and progress tracking.

### AI Message
```
"To create your personalized plan, I need to understand your starting point.

This isn't about judgment—it's about precision.

The more accurate your numbers, the better I can calibrate your targets."
```

### User Interaction
- **Type**: Multi-part form (displayed as conversational cards)

**Part A: Date of Birth**
- Wheel picker (month, day, year)
- Age range: 13-100 years old

**Part B: Height**
- Dual input (feet/inches or cm based on user's system locale)
- Slider alternative for quick input

**Part C: Current Weight**
- Dual input (lbs or kg based on user's system locale)
- Decimal precision allowed

### Validation
- DOB: Valid date, age 13-100
- Height: 100-250 cm (39-98 inches)
- Weight: 30-300 kg (66-660 lbs)

### Stored Field
- `UserProfile.identity.dob`
- `UserProfile.identity.height`
- `UserProfile.identity.weight`

### Downstream Consumers
- TDEE/BMR calculation engine
- BMI calculation
- Progress tracking (weight over time)
- Macro targets (protein based on body weight)
- AI recommendations (caloric adjustments)

### Feature Unlocked
- Dashboard displays current BMI
- Progress module baseline established

### AI Follow-up
```
"Your BMI is [X.X]—that's a helpful baseline.

Now let's talk about where you want to go."
```

---

## Step 3: Mission Definition

### Purpose
Define the user's primary fitness goal. This drives calorie calculation, macro distribution, and AI coaching strategy.

### AI Message
```
"Every great journey starts with a clear destination.

What's your primary goal right now?"
```

### User Interaction
- **Type**: Card selection (4 large, visually distinct cards)

**Options**:
1. **Lose Fat** 
   - Icon: Flame
   - Description: "Reduce body fat while preserving muscle"
   - Calorie adjustment: -500 kcal from TDEE
   
2. **Gain Muscle** 
   - Icon: Dumbbell
   - Description: "Build strength and increase muscle mass"
   - Calorie adjustment: +300 kcal from TDEE
   
3. **Maintain & Improve**
   - Icon: Target
   - Description: "Maintain weight, improve fitness and health"
   - Calorie adjustment: TDEE (no deficit/surplus)
   
4. **Body Recomposition**
   - Icon: Refresh
   - Description: "Lose fat and gain muscle simultaneously"
   - Calorie adjustment: -100 kcal from TDEE

### Follow-up Question (appears after goal selected)
```
"What's your target weight?"
```

- **Type**: Number input with unit toggle (kg/lbs)
- **Range**: Must be different from current weight by at least 2 kg/5 lbs
- **Smart default**: Suggests realistic target based on goal
  - Lose fat: -10% of current weight
  - Gain muscle: +5% of current weight
  - Maintain: Current weight (greyed out/optional)
  - Recomp: Current weight (greyed out/optional)

### Validation
- Goal: One of 4 enum values
- Target weight: Number within reasonable range (current ± 50kg)

### Stored Field
- `UserProfile.goals.primaryGoal`
- `UserProfile.preferences.goals.targetWeightKg`

### Downstream Consumers
- Calorie calculation (deficit/surplus applied)
- Dashboard (goal countdown widget)
- Progress tracking (weight goal line on charts)
- AI coaching (encouragement tailored to goal)
- Workout planner (volume/intensity adjusted)

### Feature Unlocked
- Daily calorie target calculated
- Goal countdown widget appears on dashboard

### AI Follow-up
```
"Perfect. [Lose fat / Gain muscle / Maintain / Recomp] with a target of [X] kg.

I'll design your plan around that."
```

---

## Step 4: Motivation Anchor

### Purpose
Understand the user's deeper motivation. Never displayed directly to user, but informs AI coaching during challenging moments.

### AI Message
```
"One more thing—this one's important.

Why did you decide to start this journey?

What happens when you reach your goal?"
```

### User Interaction
- **Type**: Multi-line text input (conversational style)
- **Placeholder**: "Be honest. This is just between us."
- **Character limit**: 10-500 characters
- **Optional**: "Skip this for now" button

### Validation
- If provided: 10-500 characters
- If skipped: Stores empty string, can be asked naturally later

### Stored Field
- `UserProfile.motivation.whyStarted`

### Downstream Consumers
- AI Coach (pulls this during moments of low motivation)
- Weekly review emails (reminds user of their "why")
- Never shown on dashboard or to other users

### Feature Unlocked
- AI can give deeply personalized encouragement
- Weekly review emails reference user's motivation

### AI Follow-up (if answered)
```
"Thank you for sharing that.

I'll remember it—especially on the days when motivation feels low.

Let's build the plan."
```

### AI Follow-up (if skipped)
```
"No problem. We can always revisit that later.

Let's build the plan."
```

---

## Step 5: Activity Context

### Purpose
Determine activity level for TDEE calculation and fitness experience for workout complexity.

### AI Message
```
"Now let's talk about your current activity.

How would you describe your typical week?"
```

### User Interaction
- **Type**: Card selection (5 cards, vertically stacked)

**Activity Level Options**:
1. **Sedentary** — "Office job, minimal exercise"
2. **Lightly Active** — "Light exercise 1-3 days/week"
3. **Moderately Active** — "Moderate exercise 3-5 days/week"
4. **Very Active** — "Intense exercise 6-7 days/week"
5. **Athlete** — "Physical job or training twice daily"

### Follow-up Question
```
"And how much experience do you have with structured fitness training?"
```

**Fitness Experience Options** (3 cards):
1. **Beginner** — "New to working out or returning after a long break"
2. **Intermediate** — "Consistent training for 6+ months"
3. **Advanced** — "Years of experience, know my way around"

### Validation
- Activity: One of 5 enum values
- Experience: One of 3 enum values

### Stored Field
- `UserProfile.preferences.activity`
- `UserProfile.preferences.fitnessExperience`

### Downstream Consumers
- TDEE calculation (activity multiplier applied)
- Workout difficulty (exercise complexity adjusted)
- AI explanations (depth of technical detail)
- Mission planner (volume and intensity)

### Feature Unlocked
- TDEE calculated
- AI knows whether to explain basic concepts or assume knowledge

### AI Follow-up
```
"Got it. I'll calibrate your daily calorie target to [X] kcal based on [activity level].

And I'll match workout difficulty to your [experience level]."
```

---

## Step 6: Training Commitment

### Purpose
Understand workout frequency and session length for mission planning and scheduling.

### AI Message
```
"How many days per week can you realistically train?

Be honest—consistency beats perfection."
```

### User Interaction
- **Type**: Number selector (visual week calendar)
- **Range**: 1-7 days
- **Default**: 4 days (pre-selected)

### Follow-up Question
```
"And how long is a typical session?"
```

- **Type**: Slider with time markers
- **Range**: 15-180 minutes
- **Markers**: 15, 30, 45, 60, 75, 90, 120, 180
- **Default**: 60 minutes

### Validation
- Workout days: 1-7
- Duration: 15-180 minutes

### Stored Field
- `UserProfile.preferences.goals.workoutDaysPerWeek`
- `UserProfile.preferences.goals.workoutDurationMin`

### Downstream Consumers
- Mission scheduler (weekly plan generation)
- Recovery recommendations (rest day prompts)
- AI coaching (realistic expectations)
- Calendar view (auto-populate workout slots)

### Feature Unlocked
- Training calendar appears on dashboard
- Mission planner generates appropriate weekly split

### AI Follow-up
```
"Perfect. I'll design [X] workouts per week, each around [Y] minutes.

That's sustainable."
```

---

## Step 7: Nutrition Foundation

### Purpose
Collect dietary restrictions for meal recommendations and allergen warnings.

### AI Message
```
"Let's talk nutrition.

I'll be recommending meals and tracking your food.

Do you have any dietary preferences or restrictions?"
```

### User Interaction
- **Type**: Card selection

**Diet Type** (4 options):
1. **No Restrictions** — "I eat everything"
2. **Vegetarian** — "No meat or fish"
3. **Vegan** — "No animal products"
4. **Eggetarian** — "Eggs and dairy, no meat"

### Follow-up Question
```
"Any food allergies I should know about?"
```

- **Type**: Multi-select chips + text input for custom
- **Common options**: Dairy, Gluten, Nuts, Soy, Shellfish, Eggs
- **Custom input**: "Add another"
- **Optional**: "None" button

### Validation
- Diet type: One of 4 enum values
- Allergies: Array (can be empty)

### Stored Field
- `UserProfile.preferences.dietType`
- `UserProfile.preferences.allergies`

### Downstream Consumers
- Meal plan generator (excludes incompatible foods)
- Food logger (allergen warnings)
- AI recommendations (recipe suggestions)
- Nutrition AI (meal ideas)

### Feature Unlocked
- Meal recommendations are personalized
- Food warnings appear for allergens

### AI Follow-up
```
"Noted. All meal recommendations will be [diet type].

[If allergies]: And I'll flag any foods containing [allergies]."
```

---

## Step 8: Daily Rhythm

### Purpose
Understand user's daily schedule for reminder timing and fasting window calculation.

### AI Message
```
"When does your day typically start and end?

This helps me time reminders and recommendations."
```

### User Interaction
- **Type**: Time picker (dual wheels)

**Wake Time**:
- 12-hour or 24-hour format (based on user preference in Step 9)
- Default: 06:30

**Sleep Time**:
- 12-hour or 24-hour format
- Default: 22:30

### Follow-up Question
```
"And how much sleep do you aim for each night?"
```

- **Type**: Slider
- **Range**: 4-12 hours
- **Default**: 8 hours

### Validation
- Wake time: Valid time format
- Sleep time: Valid time format (can be before wake time for night shift workers)
- Sleep hours: 4-12

### Stored Field
- `UserProfile.preferences.wakeTime`
- `UserProfile.preferences.sleepTime`
- `UserProfile.preferences.goals.sleepHours`

### Downstream Consumers
- Reminder scheduler (notifications timed appropriately)
- Fasting window calculation (if intermittent fasting enabled later)
- Recovery module (sleep tracking)
- AI coaching (circadian rhythm suggestions)

### Feature Unlocked
- Reminders scheduled at appropriate times
- Morning vs evening workout recommendations

### AI Follow-up
```
"Great. I'll send reminders during your waking hours.

And I'll track sleep quality in the Recovery module."
```

---

## Step 9: App Preferences

### Purpose
Set non-health preferences for UI/UX experience.

### AI Message
```
"Last step—just a few app preferences."
```

### User Interaction
- **Type**: Three-part preference selector

**Theme**:
- 3 options: Light, Dark, System Default
- Visual preview of each

**Units**:
- 2 options: Metric (kg, cm), Imperial (lbs, in)
- Auto-detected from system locale as default

**Time Format**:
- 2 options: 12-hour (AM/PM), 24-hour
- Auto-detected from system locale as default

### Validation
- Theme: One of 3 enum values
- Units: One of 2 enum values
- Time format: One of 2 enum values

### Stored Field
- `SettingsStore.appearance.theme`
- `SettingsStore.localization.units`
- `SettingsStore.localization.timeFormat`

### Downstream Consumers
- Global theme provider
- All weight/height displays
- All time displays
- Export/report formatting

### Feature Unlocked
- App displays in preferred units and theme
- Consistent formatting across all modules

### AI Follow-up
```
"Perfect. Your app is configured."
```

---

## Step 10: Calculation & Review

### Purpose
Calculate all derived targets (TDEE, BMR, macros) and present them to the user for review.

### AI Message
```
"Analyzing your profile..."
```

### User Interaction
- **Type**: Loading state (2-3 seconds with animated progress)
- Displays calculation steps:
  1. "Calculating BMR..." ✓
  2. "Adjusting for activity level..." ✓
  3. "Applying goal-specific targets..." ✓
  4. "Generating macro distribution..." ✓

### Calculation Logic
```
BMR (Mifflin-St Jeor):
  Men: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
  Women: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161

TDEE:
  BMR × activity_multiplier
  (sedentary=1.2, light=1.375, moderate=1.55, active=1.725, athlete=1.9)

Daily Calories:
  TDEE + goal_adjustment
  (lose_fat=-500, gain_muscle=+300, maintain=0, recomp=-100)

Protein:
  2g per kg body weight (adjustable in settings)

Fat:
  1g per kg body weight (adjustable in settings)

Carbs:
  Remaining calories after protein and fat
  (protein_cals + fat_cals = X, carbs = (daily_cals - X) / 4)
```

### Review Screen
```
"Here's your personalized plan:

Daily Targets:
  Calories: [X] kcal
  Protein: [X]g
  Carbs: [X]g
  Fat: [X]g
  Water: 3000ml
  Steps: 10,000

Your Metrics:
  TDEE: [X] kcal
  BMR: [X] kcal
  BMI: [X.X]

Workout Plan:
  [X] days per week
  [Y] minutes per session
  Difficulty: [experience level]
```

### User Interaction
- **Type**: Two buttons
- Primary: "Looks Good, Let's Start"
- Secondary: "Adjust Targets" (opens settings modal for custom goals)

### Validation
All calculations must be positive numbers

### Stored Field
- `UserProfile.targets.*` (all calculated fields)
- `UserProfile.preferences.goals.*` (if customized)

### Downstream Consumers
- Dashboard (displays all targets)
- Nutrition module (tracks against targets)
- Training module (mission difficulty)
- Progress module (goal tracking)
- AI Coach (references in recommendations)

### Feature Unlocked
- Complete access to all app features
- Dashboard fully populated with targets

### AI Follow-up
```
"Your plan is ready.

Welcome to Ascend AI."
```

---

## Step 11: Welcome to Mission Control

### Purpose
Celebrate completion and transition to the main app with excitement.

### AI Message
```
"Setup Complete.

Your personal AI coach is now active.

Your first mission begins today.

Let's ascend."
```

### User Interaction
- **Type**: Celebration screen
- Visual: Animated checkmarks
- Summary:
  - ✓ Profile created
  - ✓ Goals defined
  - ✓ Targets calculated
  - ✓ AI coach initialized
- Primary button: "Enter Mission Control"
- Auto-redirects after 3 seconds

### Validation
None (completion state)

### Stored Field
- `UserProfile.onboardingCompleted = true`
- `UserProfile.updatedAt = now()`

### Downstream Consumers
- Route guard (unlocks all protected routes)
- Dashboard (shows welcome message on first visit)
- Mission system (generates first mission)

### Feature Unlocked
- Full app access
- First mission appears on dashboard
- All modules available

### AI Follow-up
None (transitions to main app)

---

## Recovery & Resume

### Draft Persistence
- Draft saved to `localStorage` key: `ascend-onboarding-draft-v2`
- Saved after every completed step
- Includes: `{ step, data, timestamp }`
- Expires after 24 hours

### Resume Logic
```
If draft exists and timestamp < 24h:
  → Resume from last completed step
  → Show: "Welcome back! Let's pick up where you left off."

If draft exists and timestamp > 24h:
  → Clear draft
  → Start from Step 1
  → Show: "Your draft expired. Let's start fresh."

If no draft:
  → Start from Step 1
```

### Interrupt Handling
- User can close browser at any point
- Progress saved automatically
- No "Are you sure?" prompts
- Clean resume experience

---

## Skip & Default Strategy

### When a step is skipped:
1. Store `undefined` for that field
2. AI notes the gap
3. Continue to next step
4. Ask naturally during app usage later

### Default values:
- Water: 3000ml
- Steps: 10,000
- Sleep: 8 hours
- Workout days: 4
- Workout duration: 60 minutes
- Theme: System default
- Units: System locale
- Time format: System locale

---

## Progress Indicator

### Visual
- Step counter: "2 of 9"
- Progress bar: Fills proportionally
- Never shows time estimate (avoid pressure)

### Step Labels (optional, shown in progress bar)
```
1. Welcome
2. Identity
3. Foundation
4. Goals
5. Motivation
6. Activity
7. Training
8. Nutrition
9. Schedule
10. Preferences
11. Review
```

---

## Success Criteria

After onboarding completion:

✅ User has complete, valid profile  
✅ All targets calculated  
✅ First mission generated  
✅ Dashboard fully populated  
✅ AI Coach has sufficient context  
✅ User feels excited, not exhausted  
✅ No synchronization issues  
✅ Draft cleared from localStorage  

---

## Future Enhancements (Phase 2+)

These questions will be **discovered naturally** rather than during Day 1 onboarding:

- Workout location (home/gym)
- Available equipment
- Cuisine preferences
- Cooking skill level
- Meal prep time
- Work schedule
- Stress level
- Injuries/limitations
- Coaching style preference
- Data verbosity preference

---

## Review & Updates

This flow should be reviewed:
- After user testing feedback
- When new features require profile data
- During quarterly UX reviews
- When drop-off rates exceed 15% at any step

Last reviewed: 2026-08-06
