# Ascend AI - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2026-07-31

### Added
- **Milestone 5: Automation & Intelligence Engine**
  - Configurable `NotificationPreferences` tracking user timezone, quiet hours, and notification toggles.
  - Rules-based `RulesEngine` to evaluate when to dispatch notifications (cooldowns, quiet hours).
  - Idempotent `ResetEngine` handling daily metric zeroing (hydration, meals, steps) via a `DAY_RESET` event while preserving long-term stats.
  - `ReportsEngine` generating Daily, Weekly, and Monthly performance reports natively stored in Firebase.
  - Hybrid AI Coaching strategy generating Morning Motivation and Evening Reflection upon user login, cached per day.
  - Vercel Cron compatible endpoint `/api/cron/daily` for triggering resets, utilizing `resend` for email integrations.
  - Re-designed Dashboard incorporating a Notification Center, Latest Report links, and an Active Reminder card.

## [0.4.0] - 2026-07-31

### Added
- **Milestone 4: Analytics Engine**
  - Centralized `AnalyticsEngine` processing all events into Daily, Weekly, Monthly, Yearly, and Lifetime aggregated stats.
  - Interactive full-width `ProgressCharts` using Recharts on the Progress Hub.
  - Dedicated `WeightTracker` allowing manual weight updates emitting `WEIGHT_UPDATED` events.
  - Dashboard UI updated to display dynamic sparklines, Weekly Completion, and Current Streak from the Analytics Store.
  - Real-time `analytics.store.ts` bound to Firestore `users/{userId}/analytics/{period}/` collections.
  - AI Context now receives summarized analytics metrics (e.g. average calories, consistency score).

## [0.3.0] - 2026-07-30 Initial Private Beta

### Added
- Complete Authentication flow (Signup, Login, Forgot Password) using Firebase.
- Initial Apple-inspired, premium responsive Dashboard UI with fluid animations.
- Interactive Workout and Nutrition layouts.
- Real-time Hall of Ascension and premium progress views.
- AI Coach modal integrated with OpenRouter APIs.
- Complete responsive adaptation for Mobile, Tablet, and Desktop displays (Milestone 11).
- Production hardening including Progressive Web App (PWA) manifest, service worker, global error boundaries, and dynamic component loading (Milestone 12).
- Event-Driven Gamification Engine (Milestone 3) with configurable XP rewards, real-time Leveling, centralized Achievement system, and active Missions (Walking, Running, Cycling, etc.).
- Lifetime gamification statistics and AI-aware progression context integration.

### Fixed
- Fixed AI Coach Context (BUG-001): Implemented the Context Builder pipeline. AI now reads live data (Profile, Dashboard, Meals, Workouts) before responding instead of using fallbacks.
- Fixed AI Preferences (BUG-006): Integrated the Firebase AI Memory system so that User Preferences explicitly alter the AI's prompt generation and tone.
- Fixed Step Count Persistence (BUG-003): Steps now persist across navigation and save to Firebase Daily Logs.
- Fixed Dashboard Data Binding (BUG-002, BUG-010): Dashboard now reads live calories, protein, and water from Firebase instead of hardcoded placeholders.
- Fixed Daily Score calculation to dynamically aggregate progress across Steps, Water, Protein, and Calories.
