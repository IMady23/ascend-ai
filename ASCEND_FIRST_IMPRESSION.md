# Ascend First Impression

**The North Star for User Experience**

This document answers four questions that define every feature, every animation, and every word the coach says.

---

## 1. What should the user feel after the first 30 seconds?

**Not:** "I entered my name."

**Instead:** "This app is actually interested in me."

### How we achieve this:

- Coach introduces itself **before** asking questions
- The first question is **personal** ("What should I call you?"), not transactional ("Enter your full name")
- The orb **listens** when you type — visual feedback that input matters
- Coach **remembers and uses** your name immediately ("Nice to meet you, Alex")
- No generic welcome screen — the conversation starts instantly

### Test:

If a user pauses after 30 seconds and thinks "this feels different," we succeeded.

---

## 2. What should the user feel after Screen 12?

**Not:** "I received my calories."

**Instead:** "This plan wasn't generated for everyone. It was built for me."

### How we achieve this:

- Coach **tells a story** before showing numbers
- Numbers appear **after** the coach proves it listened:
  - "✓ Identity learned"
  - "✓ Body understood"
  - "✓ Lifestyle mapped"
  - "✓ Mission defined"
- Every number has **context** in plain language
- Copy references **user's specific goal** (lose fat / gain muscle / maintain / recomp)
- If motivation was entered, coach **references it** subtly

### Test:

If a user screenshots Screen 12 to show a friend "look at this personalized plan," we succeeded.

---

## 3. What should the user feel after opening the dashboard?

**Not:** "Dashboard loaded."

**Instead:** "My coach is waiting for me."

### How we achieve this:

- Coach orb is **already present** when dashboard loads (no loading spinner)
- First message is **contextual** to time of day and user state
- Dashboard shows **their plan**, not a generic template
- Widgets reference **their data** (training days, protein target, sleep goal)
- The coach **remembers** the conversation from onboarding

### Test:

If a user opens the app the next morning and thinks "it's still here, ready to help," we succeeded.

---

## 4. Three emotions Ascend should always create

Every feature, message, and interaction should strengthen at least one of these:

### 1. **Confidence**

The user should feel capable, not inadequate.

**Examples:**
- "That's a great starting point. We can always adjust it later."
- "3 days in a row. Consistency is forming."
- "New record on bench press. 135 lbs — that's a best."

**Anti-patterns:**
- Shaming ("You missed 3 workouts this week")
- Comparisons ("Most users train 5 days")
- Pressure ("You should eat more protein")

---

### 2. **Curiosity**

The user should want to see what happens next.

**Examples:**
- "I've learned a lot about you already." *(What did it learn?)*
- "I'll remember that." *(When will it reference this?)*
- "Every workout helps me understand you better." *(How will it adapt?)*

**Anti-patterns:**
- Predictable patterns (same message every time)
- Obvious automation ("Daily reminder: log your meals!")
- No surprises (app feels static after week 1)

---

### 3. **Progress**

The user should feel they're moving forward, even on hard days.

**Examples:**
- "Streaks reset. Progress doesn't. Let's start again."
- "You were 200 calories over today. Was it planned or did something come up?"
- "You lifted less today, but you showed up. That counts."

**Anti-patterns:**
- Binary thinking (success vs. failure)
- Ignoring context (missed workout = bad, always)
- No acknowledgment of effort without results

---

### Decision Filter

Before shipping any feature, ask:

> **"Does this increase confidence, curiosity, or progress?"**

If the answer is no, rethink it.

---

## The Coach Confidence Score

**(Internal only — never shown to users)**

The coach should know what it knows.

This changes behavior from prescriptive to collaborative.

### How it works:

The coach tracks **confidence level** for each data category:

| Category | Confidence | Status |
|----------|-----------|--------|
| Name | 100% | ✓ Learned in onboarding |
| Height | 100% | ✓ Learned in onboarding |
| Weight | 100% | ✓ Learned in onboarding |
| Goal | 100% | ✓ Learned in onboarding |
| Training frequency | 80% | ✓ Set in onboarding, observed once |
| Recovery habit | 45% | ⚠ 3 days of data |
| Nutrition habit | 30% | ⚠ 2 meals logged |
| Sleep pattern | 15% | ⚠ 1 night logged |
| Stress triggers | 0% | ✗ No data yet |

### Why this matters:

**Low confidence (0–40%):**

❌ Don't say: "Sleep more."  
✅ Say instead: "I don't know enough about your sleep yet. Can I ask one quick question?"

**Medium confidence (40–70%):**

❌ Don't say: "You should train 5 days."  
✅ Say instead: "I've noticed you train 4 days most weeks. Would adding one more day help, or would it feel like too much?"

**High confidence (70–100%):**

✅ "You usually train Monday, Wednesday, Friday, Saturday. Should I schedule your next mission on Monday?"

### The rule:

> **Never make definitive recommendations with low confidence.**

The coach should **ask questions** when uncertain, not guess.

---

## Profile DNA (Expanded)

DNA is not just what the user **tells** us.

It's what we **learn** over time.

### Explicit Data (User-Provided)

- Name
- Body measurements
- Goal
- Training commitment
- Nutrition preferences
- Schedule

### Implicit Data (Derived Over Time)

**Decision Style**
- Prefers structure vs. flexibility
- Responds to data vs. encouragement
- Plans ahead vs. adapts in moment

**Lifestyle Rhythm**
- Morning person vs. night person
- Consistent schedule vs. variable
- Home workouts vs. gym preference

**Learning Style**
- Wants detailed explanations vs. quick tips
- Responds to video vs. text
- Prefers coaching vs. autonomy

**Consistency Pattern**
- Streak keeper vs. ebb-and-flow
- All-or-nothing vs. gradual progress
- Responds to accountability vs. intrinsic motivation

**Confidence Level**
- Training confidence (beginner / intermediate / advanced behavior, not stated level)
- Nutrition confidence (needs guidance / self-directed)
- Recovery awareness (tracks actively / needs prompting)

### Why this matters:

Two users with the same goal can need **completely different coaching.**

Example:

**User A:**
- Decision Style: Structure-oriented
- Learning Style: Wants detailed explanations
- Consistency: Streak keeper

**Coach approach:** Provide structured plans, detailed reasoning, celebrate streaks.

**User B:**
- Decision Style: Flexibility-oriented
- Learning Style: Quick tips only
- Consistency: Ebb-and-flow

**Coach approach:** Offer options, keep messages concise, acknowledge effort over streaks.

---

## The Golden Rule of Screen 12

> **Don't let Screen 12 become a calculator. It should feel like trust earned before numbers revealed.**

### The Sequence:

```
1. I've learned enough to build your starting plan.
   (Acknowledgment)

2. Here's what I understand:
   ✓ Your goal
   ✓ Your routine
   ✓ Your lifestyle
   ✓ Your motivation
   (Proof of listening)

3. Now I'm putting everything together...
   (Working, thinking)

4. [Numbers appear with context]
   (Results with explanations)
```

**Notice:** The numbers arrive **after** trust has been built.

Not before.

---

## Screen 13 is NOT a Celebration

Internally: `Step13` or `WelcomeScreen`

For users: **Welcome to Ascend**

### What NOT to say:

❌ "Congratulations!"  
❌ "Setup Complete!"  
❌ "You did it!" 🎉  
❌ "All done!"

### What to say instead:

✅ "Your coach is ready."  
✅ "Your journey starts today."  
✅ "Every choice you make helps me understand you better."

### Why:

Celebration implies **ending.**

We want users to feel they're **beginning** something.

The relationship starts now.

---

## The Most Important Design Rule

**(Pin this internally forever)**

> **Ascend should never feel impressed by its own AI.**  
> **It should make the user feel understood.**

### What this means in practice:

❌ "Our AI analyzed 10,000 data points to calculate your plan."  
✅ "Here's your plan."

❌ "Powered by advanced machine learning algorithms."  
✅ "I learn from every workout you log."

❌ "State-of-the-art personalization technology."  
✅ "The more I know about you, the better I can help."

### The test:

If the copy talks about **the AI**, rewrite it to talk about **the user.**

---

## Architecture Lockdown

**Status: Approved. Freeze documentation.**

From this point forward:

✅ **Focus on:**
- Implementation
- Real-device testing
- Animation polish
- Accessibility (screen readers, reduced motion, keyboard nav)
- Performance (animation frame rates, load times)
- Edge cases (offline, errors, slow connections)

❌ **Avoid:**
- New planning documents (unless fundamental issue discovered)
- Speculative design (future features belong in backlog)
- Over-engineering (ship Phase 2D first, iterate later)

### The rule:

> **Any future refinements should be driven by hands-on testing, not speculation.**

---

## Success Criteria

Phase 2D is done when:

- [ ] Screen 12 feels like understanding (not calculation)
- [ ] Screen 13 feels like beginning (not ending)
- [ ] Numbers have context (not just values)
- [ ] Animations tell a story (not just decoration)
- [ ] Copy matches conversation guidelines
- [ ] All emotional checkpoints pass (from ONBOARDING_ENDING_EXPERIENCE.md)
- [ ] Works flawlessly on mobile (primary device)
- [ ] Accessibility guidelines met (WCAG 2.1 AA)
- [ ] No performance issues (60fps animations)
- [ ] Real user testing validates emotional impact

---

## Final Thought

If implemented with the same care put into this architecture, Ascend's onboarding has the potential to become one of the defining experiences of the product.

Not because of flashy AI.

But because users feel **understood** from the first 30 seconds.

That's what they'll remember.

That's what they'll tell their friends about.

That's what builds a relationship.

---

**Document Version:** 1.0 (Final)  
**Status:** North Star — Reference for all future decisions  
**Last Updated:** Pre-Phase 2D Implementation  
**Owned By:** Product Team

**Freeze Date:** This document is now locked. Changes require product lead approval.
