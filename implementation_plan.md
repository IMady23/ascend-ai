# Phase 4 — Mission Control Redesign

**Goal**: Redesign the Mission Control page (`app/(dashboard)/page.tsx`) to be the flagship experience of Ascend AI, showcasing the Premium Application Shell and Ascend Design Language. It must feel like a focused, premium, personal command center, anchoring on the new "One Thing Today" concept, acting as a personal AI performance coach briefing.

## 1. Information Hierarchy & Layout

The layout will follow a strict top-to-bottom hierarchy using ADL Semantic Layout primitives.

### A. The Hero (3-Zone Architecture)
The Hero is no longer just a header; it's a personalized AI briefing.
*   **Left (Identity)**: "Good Morning, Madhav. Today is Day 87. You're 82% through Chapter 6." (Greeting, Chapter, Level, XP).
*   **Center (The Anchor)**: **"One Thing Today"**. Visually dominant (e.g. "🎯 Complete today's strength workout").
*   **Right (Status)**: Today's Score (0-100), Streak, Recovery, Completion, AI Status.

### B. Daily Snapshot
A dense horizontal band (`AnalyticsGrid`) displaying core metrics with subtle status colors:
*   Excellent / Good / Warning / Critical / Achieved / Missed.
*   Metrics: Calories, Workout, Water, Sleep.

### C. Intelligence Panel
*   **AI Coach**: Actionable recommendations with explicit **Confidence Levels** (e.g., 96% based on Yesterday's Workout & Recovery trend).
*   **Mission Forecast**: Predictive outcomes. "If you complete today's workout: 🔥 Streak reaches 15 days, 🏆 XP reaches Level 12".

### D. Quick Actions
Limited to 4-5 high-frequency utilities (e.g., Log Workout, Log Meal, AI Coach, Update Weight).

### E. Context & History
*   **Since Yesterday**: A micro-card summarizing net change (e.g., +0.3 kg, +8% recovery, -250 kcal).
*   **Timeline**: Grouped chronologically (Today, Yesterday, Monday) rather than a raw list.
*   **Charts**: Weekly Progress (supporting the story, not dominating).

### F. Positive Reinforcement
*   Achievements and Momentum (e.g., "14-Day Streak", "2 Personal Records This Week") to conclude the page on a high note.

## 2. Low-Fidelity Wireframe (Final Layout)

```text
─────────────────────────────────────────────────────────────
 HeroSection (3-Zones)
 [ Left: Briefing ] [ Center: One Thing Today ] [ Right: Status/Score ]
─────────────────────────────────────────────────────────────
 AnalyticsGrid (Daily Snapshot)
 [ Calories (Warning) ] [ Workout (Missed) ] [ Sleep (Excellent) ]
─────────────────────────────────────────────────────────────
 DashboardLayout (2-Column)
 
 Left: Intelligence (2/3)                 Right: Quick Actions (1/3)
 [ AI Coach (Confidence: 96%) ]           [ Log Workout ]
 [ Mission Forecast ]                     [ Log Meal ]
                                          [ Update Weight ]
─────────────────────────────────────────────────────────────
 DashboardLayout (2-Column)
 
 Left: Context (2/3)                      Right: Timeline (1/3)
 [ Since Yesterday (+0.3kg) ]             [ Today: Workout Logged ]
 [ Weekly Progress Charts ]               [ Yesterday: Goal Met ]
─────────────────────────────────────────────────────────────
 Footer: Positive Reinforcement (Achievements & Momentum)
─────────────────────────────────────────────────────────────
```

## 3. Widget Inventory (ADL Composites)

| Section | ADL Components Used | Purpose |
| :--- | :--- | :--- |
| **Hero** | `HeroSection`, `GlassCard`, `Heading`, `ProgressRing`, `Statistic` | Establish identity, core objective, and daily score. |
| **Snapshot** | `AnalyticsGrid`, `MetricCard`, `Badge` (Status Colors) | Scan health state instantly. |
| **AI Coach** | `GlassCard`, `ThinkingIndicator`, `SuggestionChip`, `Badge` | Provide confident, proactive guidance. |
| **Forecast** | `WidgetSection`, `BodyText`, `Icon` | Predict future success. |
| **Quick Actions**| `Stack`, `Button` (fullWidth, icons) | High-utility interaction. |
| **Timeline** | `InteractiveCard`, `Divider` | Chronological grouped log. |

## 4. Motion Flow & Performance
1. **Hero Reveal**: The 3-zone Hero fades in, establishing the focal point.
2. **Cascade**: Snapshot cards stagger in using `PageMotion.staggerItem`.
3. **AI Reveal**: Coach and Forecast fade in, with `ThinkingIndicator` pulsing.
4. **Context Loading**: Timeline and Charts appear last to avoid distraction.
*Performance Expectation*: 60fps rendering, utilizing `utils/motion.ts` strict typings.

## 5. Responsive Layout Strategy
- **Large Desktop**: Full 3-zone Hero, 4-column Snapshot, 2-column lower body (spacious).
- **Desktop/Laptop**: 3-zone Hero (tight), 2-column lower body.
- **Tablet/Mobile**: Single column flow. Hero zones stack (One Thing Today moves to absolute top).

## 6. The 14 Refinements (The "Flow" Implementation)
1. **Contextual Intelligence**: Every card now pulls metadata from the user's historical trend rather than static defaults.
2. **Dynamic Confidence Scoring**: AI recommendations include a small `%` indicator based on historical success data.
3. **Ghost Loading States**: Using skeleton screens that match the font and padding of actual data for zero layout shift.
4. **Haptic Feedback Mapping**: All primary buttons (`Log Workout`, `Quick Actions`) map to subtle haptic triggers.
5. **Auto-Archiving**: Old timeline entries automatically summarize into "Monthly Insights" after 7 days.
6. **Unified Search**: Pressing `Cmd+K` allows users to log metrics without navigating away from the page.
7. **Intent-Based Routing**: Clicking "Log Workout" opens the trainer with the current day's plan pre-loaded.
8. **Conditional Empty States**: If no data is present, the page suggests "15-minute onboarding" or "Quick-Start" routines.
9. **Visual Weighting**: Increased font contrast on health scores to ensure readability in sunlight.
10. **Micro-Interaction Stacking**: Success animations (achieving a goal) now trigger a small "confetti" overlay that resets on scroll.
11. **Session Persistence**: If a user leaves mid-session, a "Resume Workout" banner persists at the top of the Mission Control until the end of the day.
12. **Dark/Light Adaptive Color Shifts**: All badges use refined color palettes (Desaturated, High-Contrast) to match the selected theme.
13. **Predictive Text Entry**: Quick logs (like water or calories) now use smart defaults based on the time of day.
14. **Focus Mode Toggle**: A dedicated switch that hides secondary widgets to allow users to focus strictly on their primary daily objective.

## User Review Required
> [!IMPORTANT]
> The user has already approved these refinements. I am transitioning directly to execution.
