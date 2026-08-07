# Ascend AI — Product Principles

**Version**: 1.0  
**Last Updated**: 2026-08-06  
**Purpose**: The philosophical foundation of Ascend AI

---

## What This Document Is

This is not a technical specification.  
This is not a feature roadmap.  
This is not a style guide.

This is the **philosophy** that guides every decision we make.

When you're designing a feature six months from now and you're unsure which direction to take, come back here. Ask:

> "Does this align with our product principles?"

If the answer is no, rethink it.

---

## Core Identity

**Ascend AI is not a fitness tracker.**

It's a personal AI health companion that learns about the user over time instead of just tracking numbers.

The difference:
- A tracker records what you tell it.
- A companion understands what you're trying to achieve and adapts to help you get there.

---

## The 12 Principles

### Principle 1: Purpose-Driven Data Collection

**The AI should never ask a question unless the answer immediately improves the user experience.**

Every question has a cost. It interrupts flow. It requires cognitive effort. It risks abandonment.

**Before adding any profile field, answer these questions:**
1. What feature does this unlock?
2. Can the feature work without it?
3. Can the system infer it safely?
4. If we don't ask now, can we ask naturally later?

**Examples**:
- ✅ Height/weight: Required for BMI, TDEE, macro calculations. Immediate benefit.
- ✅ Diet type: Required for meal recommendations. Immediate benefit.
- ❌ Favorite color: No feature uses this. Don't ask.
- ⚠️ Workout location: Useful for equipment recommendations but not essential. Ask naturally when user accesses training module, not during onboarding.

**Rule**: If you can't name the specific feature that needs this data, don't collect it yet.

---

### Principle 2: One Source of Truth

**Every piece of data has exactly one owner.**

Synchronization issues happen when data lives in multiple places and they disagree.

**Architecture rule**:
- One Zustand store owns each domain (nutrition, activity, user, etc.)
- One Firestore collection is the authoritative source
- One sync service bridges store ↔ Firestore
- Derived data is computed on-demand, never stored

**Examples**:
- ✅ User weight lives in `UserProfile.identity.weight`. Nowhere else.
- ✅ Profile DNA is computed from profile + behavior logs. Never stored.
- ❌ Don't cache "current weight" in `AnalyticsStore` — read from `UserProfile`.
- ❌ Don't store "daily calorie target" in multiple places — calculate it once.

**Rule**: If data exists in two places, one will become stale. Always choose one owner.

---

### Principle 3: Intelligent Inference

**Never ask users for information the system can infer safely.**

Users appreciate when software is smart enough to figure things out.

**Examples**:
- ✅ Timezone: Auto-detect from browser. Don't ask.
- ✅ Units preference: Auto-detect from locale. Confirm in settings.
- ✅ Preferred training time: Infer from workout log timestamps after 2 weeks.
- ✅ Workout location: Infer from equipment used in logged workouts.
- ❌ Don't ask "When do you usually work out?" during onboarding — you can learn this.

**Rule**: Observation beats interrogation. Ask only when inference would be unreliable or unsafe.

---

### Principle 4: Immediate Value

**Every onboarding question must benefit at least one existing feature.**

Don't collect data "for the future." Collect it because a feature needs it today.

**Test**:
- Write the question.
- Name the feature that uses this answer.
- Describe how the user will see the benefit.
- If you can't, remove the question.

**Examples**:
- ✅ Allergies → Meal recommendations show allergen warnings → User avoids dangerous foods
- ✅ Wake time → Reminders scheduled appropriately → User doesn't get woken up
- ❌ Favorite cuisine → No feature uses this yet → Don't ask (ask later when meal planner is built)

**Rule**: If the feature doesn't exist yet, don't ask the question yet.

---

### Principle 5: Transparent Intelligence

**The AI should explain recommendations rather than simply presenting them.**

Black-box AI feels like magic at first, then feels untrustworthy.

Users need to understand *why* the AI is suggesting something so they can trust it.

**Examples**:
- ❌ "Eat 2,100 calories today."
- ✅ "Based on your goal (lose fat) and activity level (moderate), I've set your target to 2,100 calories — a 500 kcal deficit from your TDEE of 2,600."

- ❌ "Do upper body today."
- ✅ "You last trained chest 3 days ago, and you're fully recovered. Let's hit upper body."

- ❌ "Drink more water."
- ✅ "You're at 1,500ml today — halfway to your 3,000ml goal. Try to finish another bottle before dinner."

**Rule**: Every AI recommendation must include reasoning. Not as fine print — as part of the message.

---

### Principle 6: Earned Progress

**Progress should feel earned, not manipulated.**

Gamification can motivate, but fake achievements destroy trust.

**Examples**:
- ✅ Streak counter: Real. If you miss a day, it resets. No exceptions.
- ✅ XP for completed workouts: Earned through effort.
- ❌ "You're doing amazing!" after logging one meal. (Patronizing, not earned.)
- ❌ Inflated progress bars that always show 90%+. (Manipulative.)
- ❌ Badges for trivial actions ("First login!"). (Meaningless.)

**Rule**: Celebrate real achievements. Don't dilute them with participation trophies.

---

### Principle 7: Consistency Over Perfection

**Celebrate consistency more than perfection.**

Perfect execution is intimidating. Consistency is achievable.

**Examples**:
- ✅ "7-day streak" badge is more valuable than "Perfect Macros" badge.
- ✅ Weekly review highlights: "You logged meals 6 out of 7 days" (emphasizes consistency).
- ❌ Don't punish users for hitting 95% of their protein goal. Acknowledge the effort.
- ✅ "You've trained 3 weeks in a row" > "You hit a new PR"

**Messaging**:
- When user misses a macro target slightly: "Close enough — you're staying consistent."
- When user completes 80% of workouts: "4 out of 5 sessions. That's strong consistency."
- When user has a perfect week: "Perfect week. But remember — consistency matters more than perfection."

**Rule**: The AI should feel like a supportive coach, not a perfectionist trainer.

---

### Principle 8: Value-Driven Complexity

**If a feature adds complexity without adding user value, don't build it.**

Complexity is expensive. It increases:
- Development time
- Bug surface area
- Cognitive load
- Maintenance burden

Every feature must justify its complexity with clear, measurable value.

**Before building any feature, answer**:
1. What user problem does this solve?
2. How will we measure if it's successful?
3. What's the simplest version that solves the problem?
4. Can an existing feature be extended instead?

**Examples**:
- ✅ Meal logger with AI parsing: High complexity, high value (saves user time).
- ❌ 15 different workout split templates: High complexity, low value (most users pick one).
- ✅ Progress photos with side-by-side comparison: Medium complexity, high value (visual motivation).
- ❌ Social feed with likes/comments: High complexity, uncertain value (not core to fitness).

**Rule**: Complexity is a cost. Make sure the value justifies it.

---

### Principle 9: Conversation Over Configuration

**Conversation should always feel more natural than configuration.**

People don't think in settings. They think in questions and answers.

**Examples**:
- ❌ Settings page with "Coaching Style: [Analytical | Encouraging | Direct]"
- ✅ AI asks mid-conversation: "Would you prefer detailed breakdowns, or should I keep it brief?"

- ❌ Form: "Workout days per week: [____]"
- ✅ AI asks: "How many days per week can you realistically train?"

- ❌ Dropdown: "Primary goal: [Select...]"
- ✅ AI asks: "What's your primary goal right now?" with visual cards

**Rule**: Settings are for power users. Conversation is for everyone. Default to conversation.

---

### Principle 10: Evolving Intelligence

**The AI should become smarter over time without asking users to repeat onboarding.**

The profile should grow naturally through:
- Usage patterns (when you work out, what you eat, how you recover)
- Contextual questions ("One quick question before we begin today...")
- Inferred preferences (responds to data-heavy explanations → prefers detailed coaching)

**Examples**:
- ✅ After 2 weeks of logging meals, AI infers cuisine preferences.
- ✅ After 3 workouts at 6am, AI asks: "Looks like you prefer morning training. Should I prioritize AM workout recommendations?"
- ✅ After user repeatedly clicks detailed explanations, AI starts giving more context by default.

**Anti-examples**:
- ❌ "Complete your profile!" banner after 3 months of use.
- ❌ Forcing users back to onboarding to add missing fields.
- ❌ Treating profile fields as required checkboxes instead of gradual discovery.

**Rule**: The profile evolves through natural interaction, not forced data entry.

---

### Principle 11: Respect Attention

**The user's attention is the most valuable resource. Don't waste it.**

Every notification, every popup, every prompt interrupts the user. Justify each one.

**Examples**:
- ✅ Daily reminder: "Time to log dinner" (actionable, expected).
- ❌ Random tips: "Did you know you can add custom foods?" (interruptive, low value).
- ✅ Streak warning: "You haven't logged anything today — 7-day streak at risk" (high value, time-sensitive).
- ❌ Achievement spam: "You've logged 5 meals! 🎉" (feels manipulative, dilutes real achievements).

**Notification rules**:
1. Is this actionable right now?
2. Is this time-sensitive?
3. Does the user expect this?
4. Would I want to receive this?

If the answer to all four is not "yes," don't send it.

**Rule**: Notifications should be useful, not engagement bait.

---

### Principle 12: Data Dignity

**User health data is deeply personal. Treat it with respect.**

Privacy is not just legal compliance. It's trust.

**Rules**:
1. **Never sell user data.** Not anonymized. Not aggregated. Not ever.
2. **Never share without explicit consent.** No social features that leak data.
3. **Never surface sensitive fields publicly.** Motivation, failures, injuries = private.
4. **Never weaponize data.** Don't use past failures to guilt users.
5. **Always allow deletion.** Users can delete their data completely at any time.

**Privacy levels** (from Data Contract):
- **User Editable Only**: Identity, preferences
- **Public to AI**: Health data, goals (included in AI prompts)
- **Internal Only**: Metadata, calculated fields
- **Never Surfaced Directly**: Motivation, past failures (used for context, never quoted)

**Rule**: If you're uncomfortable with your own health data being used this way, don't do it to users.

---

## How to Use These Principles

### During Feature Planning

Before building any feature, review these principles:

1. Does this align with Core Identity?
2. Which principles does this support?
3. Which principles does this violate?
4. If there's conflict, how do we resolve it?

**Example**:
- Feature idea: "Social feed where users share workouts"
- Principle alignment:
  - ❌ Violates Principle 8 (high complexity, uncertain value)
  - ❌ Violates Principle 12 (could leak sensitive data)
  - ❌ Misaligned with Core Identity (we're a companion, not a social network)
- Decision: **Don't build this.** Focus on core 1:1 AI coaching instead.

---

### During Design Reviews

When reviewing mockups or flows:

1. **Principle 1**: Does every field we're asking for have immediate value?
2. **Principle 9**: Could this settings page be a conversation instead?
3. **Principle 11**: Are we respecting the user's attention?

---

### During Code Reviews

When reviewing PRs:

1. **Principle 2**: Does this introduce duplicate state? (One source of truth)
2. **Principle 3**: Are we asking for data we could infer?
3. **Principle 10**: Is this data stored or derived? (DNA should always be derived)

---

### During Roadmap Planning

When prioritizing features:

1. **Principle 4**: Does this unlock immediate value for users?
2. **Principle 8**: Does the value justify the complexity?
3. **Principle 7**: Does this celebrate consistency or perfection?

---

## Living Document

These principles will evolve as Ascend AI grows.

**When to update**:
- When a principle is consistently ignored (it's not actually guiding decisions)
- When a principle conflicts with user feedback (theory vs. reality)
- When the product identity shifts (companion → something else)
- When new patterns emerge (e.g., principles around AI safety)

**How to update**:
1. Propose the change in writing
2. Justify why the principle needs to change
3. Show examples of how the new principle would have changed past decisions
4. Get team consensus
5. Update this document
6. Communicate the change to the team

**Version history**:
- v1.0 (2026-08-06): Initial principles established

---

## Principles in Action

### Example 1: Should we ask about injuries during onboarding?

**Analysis**:
- Principle 1: Does this improve UX immediately? Yes — safer exercise recommendations.
- Principle 4: Does a feature use this? Yes — injury-aware workout planner.
- Principle 3: Can we infer this? No — injuries must be declared.
- Principle 12: Is this sensitive data? Yes — mark as "Internal Only."

**Decision**: ✅ Ask about injuries, but make it optional and clearly explain why. Store as "Internal Only" privacy level.

---

### Example 2: Should we add a "Share on Instagram" button?

**Analysis**:
- Principle 8: Does this add value? Uncertain — not core to coaching.
- Principle 11: Does this respect attention? Neutral — it's opt-in.
- Principle 12: Does this risk data leaks? Yes — could expose progress photos publicly.
- Core Identity: Is this aligned? No — we're a companion, not a social platform.

**Decision**: ❌ Don't build this. Focus on core 1:1 experience.

---

### Example 3: Should the AI congratulate users for logging their first meal?

**Analysis**:
- Principle 6: Is this earned? Barely — logging one meal is expected, not exceptional.
- Principle 7: Should we celebrate consistency instead? Yes — celebrate after 3 consecutive days.
- Core Identity: Does this fit? Neutral — companions can celebrate, but should be authentic.

**Decision**: ⚠️ Don't congratulate for the first meal. Wait until user demonstrates consistency (e.g., "You've logged meals 3 days in a row. That's real consistency.").

---

## Final Note

These principles are your north star.

Technology will change.  
Trends will come and go.  
AI models will improve.  
User expectations will evolve.

But if these principles remain true, Ascend AI will remain cohesive.

**When in doubt, ask**:
> "Does this make Ascend AI a better companion?"

If yes, build it.  
If no, don't.

---

**Document Owner**: Product Team  
**Review Cadence**: Quarterly  
**Last Reviewed**: 2026-08-06


---

## Onboarding-Specific Principles

*Added: Phase 2B.5 — 2026-08-06*

These principles apply specifically to the onboarding experience but extend naturally to any AI-driven interaction in the app.

---

### Principle 13: Zero Dead Screens

**Every onboarding screen must contain at least one of these:**

- AI speaks (asks a question, gives context)
- AI reacts (responds to what the user just answered)
- AI remembers (references something the user told us earlier)
- AI explains (tells the user why this question matters)
- AI reassures (makes the user feel safe sharing)
- AI celebrates (acknowledges progress or completion)

**No screen should ever be:**
```
Question
↓
Options
↓
Continue
```

Every screen needs a heartbeat.

**Test**: If you removed the AI message from a screen and it still "worked," the AI message isn't doing its job. It should be load-bearing — changing how the user feels about answering the question.

---

### Principle 14: The Conversation Rule

**Every screen must satisfy all three:**

1. **Reference** something the user already told us
2. **Explain** why this question matters
3. **Lead** naturally into the next question

**Example (wrong)**:
> Enter your height.

**Example (right)**:
> Thanks, Madhav. Now I need your height so I can accurately estimate your metabolism. This is what drives your calorie target.

Same data. Completely different experience. The second version makes the user feel like the AI is building something *for them*, not filling in a spreadsheet.

---

### Principle 15: AI Presence

**The AI should feel present, not just functional.**

There is a difference between:
- An app that has AI features
- An app where the AI feels *alive*

Presence doesn't require animation excess. It requires consistency. The AI should always:
- Be visually represented (the presence orb, the coach bubble)
- React to what's happening (orb pulses faster when thinking, blooms when celebrating)
- Use the user's name when it matters
- Remember what was said

The goal is not a character or mascot. It's the feeling that something intelligent is paying attention.

**The presence orb rule**: The orb should never be the same in two different emotional states. Loading ≠ thinking ≠ celebrating ≠ idle. Each state is distinct.

---

### Principle 16: Truthful Intelligence

**Never fake AI behavior. Make real behavior feel intelligent.**

When showing a "thinking" or "analyzing" animation, every checklist item must correspond to something the system is genuinely doing or has done.

**Wrong:**
> Analyzing your profile... (generic spinner)

**Right:**
> ✓ Recording your measurements
> ✓ Estimating calorie needs  
> ✓ Preparing your nutrition plan
> ✓ Personalizing your coach

The second builds trust. The first is theater. Users have seen enough theater.

---

### Principle 17: Memory Moments

**The AI should demonstrate that it listened.**

At key transitions (especially the celebration screen and the plan review), the AI should echo back specific things the user shared — by name, by goal, by number.

**Wrong:**
> Your profile is ready.

**Right:**
> Madhav, based on everything you've shared — your goal to lose fat, your moderate activity level, and your preference for 4 training days — I've built your first plan.

This is not a feature. It is proof of intelligence. It is what separates "an onboarding flow" from "meeting your coach for the first time."

---

### Principle 18: Emotional Continuity

**Onboarding is one conversation, not a series of screens.**

The user should feel like they are progressing through a single interaction — not clicking through pages.

This means:
- The AI's opening line on Screen N should acknowledge Screen N-1
- Transitions should feel like turns in a conversation, not page loads
- The progress bar communicates forward movement, not steps remaining
- Celebrations should reference the entire journey so far, not just the final action

**Implementation rule**: Before writing the AI copy for any screen, read the previous screen's copy first. The two must flow naturally if read aloud in sequence.

---

## Updated Version History

- v1.0 (2026-08-06): Principles 1–12 established
- v1.1 (2026-08-06): Principles 13–18 added — Onboarding Conversation Framework
