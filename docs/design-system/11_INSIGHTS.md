# Product Intelligence: Insights

The Insight Engine is what elevates Ascend AI from a "dumb tracker" to a "smart coach." This document defines the business logic and structure of the Insights that the UI and AI components consume.

## Why this Architecture?

If the Dashboard calculates "Steps compared to yesterday" and the AI Coach calculates it separately, they will eventually drift and provide conflicting data. The Insight Engine acts as the single source of truth, outputting standardized `Insight` objects.

---

## 1. Insight Object Structure

Every generated insight must conform to this specification:

```typescript
{
  id: string;
  type: 'daily_comparison' | 'weekly_trend' | 'personal_record' | 'habit' | 'forecast' | 'coach_message';
  category: 'activity' | 'nutrition' | 'hydration' | 'workout' | 'general';
  title: string;          // Short, punchy (e.g., "Hydration improving")
  description: string;    // Human-readable sentence
  value?: string;         // Metric (e.g., "+14%")
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;          // Emoji or icon key
  timestamp: string;
}
```

---

## 2. Core Insight Categories

### Daily Comparisons
- **Purpose**: To provide immediate, day-to-day context.
- **Trigger**: The user opens the app, and current stats are compared to the previous day (or the daily average).
- **Data Required**: Today's `AggregatedStats` vs. Yesterday's `AggregatedStats`.
- **Example**: `💧 "You're 600 mL behind your usual hydration by this time of day."`
- **Priority**: High. Rendered immediately on the Dashboard.

### Weekly & Monthly Trends
- **Purpose**: To smooth out daily anomalies and show macro progress.
- **Trigger**: Generated every Sunday (Weekly) or 1st of the month (Monthly).
- **Data Required**: Current period `AggregatedStats` vs. Previous period.
- **Example**: `📈 "Your average this week: 8,420 steps/day. That's 12% higher than last week."`
- **Priority**: Medium. Rendered in the Reports tab and Weekly Summary Notifications.

### Goal Forecasting
- **Purpose**: To prevent failure before it happens by warning the user early in the day.
- **Trigger**: Mid-day (e.g., 2:00 PM) if the user's velocity is too low to hit their target.
- **Data Required**: Current time, Current Metric, Target Metric.
- **Example**: `🏃 "At your current pace, you'll finish around 7,200 steps (below your 10,000 goal). A 20-minute walk will fix this."`
- **Priority**: High (time-sensitive). Sent as a Push Notification and highlighted by the AI Coach.

### Habit Detection
- **Purpose**: To make the user feel truly understood by the machine.
- **Trigger**: Evaluated weekly over a rolling 30-day window.
- **Data Required**: The last 30 `DailyLog` entries.
- **Example**: `🧠 "Mondays are consistently your strongest workout day. Keep protecting that routine."`
- **Priority**: Low. Placed in the Progress tab or mentioned casually by the AI Coach.

### Personal Records (Milestones)
- **Purpose**: Gamification and extreme motivation.
- **Trigger**: When a metric exceeds the all-time high in `lifetimeStats`.
- **Data Required**: Current event vs. `lifetimeStats`.
- **Example**: `🏆 "New Personal Best! Most workouts completed in a single week (5)."`
- **Priority**: Very High. Rendered with Gold accents, Confetti animations, and saved to the Hall of Progress.

---

## 3. Presentation Rules

1. **Keep it Human**: Insights must read like a coach speaking to an athlete. Avoid robotic strings like "Steps: +14%." Use "You're 14% more active today."
2. **Actionable when Negative**: If an insight is negative (e.g., missing a protein goal), it must be accompanied by an actionable remedy (e.g., "A protein shake will get you back on track"). Never just deliver bad news.
3. **Limit the Noise**: Never show more than 3 insights on the Dashboard at once. Prioritize time-sensitive Forecasts, then Daily Comparisons, then Habits.
