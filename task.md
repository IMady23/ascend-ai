# Milestone: Sprint 1 - Real Auth, Onboarding & User Profile

## Phase 1: Authentication & State Machine
- `[x]` Issue 1: Firebase Configuration & SDK Integration
- `[x]` Issue 2: Splash Screen (Auth State Resolver)
- `[x]` Issue 3: Login & Registration Pages (Validation, Validation Errors)
- `[ ]` Issue 4: Forgot Password Flow
- `[x]` Issue 5: AuthenticationManager Session Persistence

## Phase 2: Onboarding & User Profile
- `[x]` Issue 6: UserProfile Repository (v1 Schema, Persistence via DB adapter)
- `[x]` Issue 7: Onboarding Flow UI (Personal, Goal, Activity, Daily, Nutrition)
- `[x]` Issue 8: Automatic Calculation Engine (TDEE, BMR, BMI, Macros, Water)
- `[x]` Issue 9: Welcome Experience Interstitial Screen

## Phase 3: Dashboard & AI Initialization
- `[x]` Issue 10: AI Initialization Logic (Memory, Goal, Nutrition, Workout Engines)
- `[x]` Issue 11: Dashboard Initialization (Empty States, Real Metrics)
- `[x]` Issue 12: AI Greeting generation via Orchestrator

## Phase 4, 5, 6: Analytics & Progress Engine
- `[x]` Create stores/analytics.store.ts using Zustand
- `[x]` Create components/analytics/WeightTracker.tsx
- `[x]` Create components/analytics/ProgressCharts.tsx
- `[x]` Create components/analytics/SummaryCards.tsx
- `[x]` Update app/(dashboard)/page.tsx to use analytics.store.ts
- `[x]` Update app/(dashboard)/progress/page.tsx with Analytics engine components

# Milestone 5: Automation Engine

## Phase 2: Notification Rules Engine
- `[x]` Create lib/automation/RulesEngine.ts
- `[x]` Refactor lib/progression/NotificationEngine.ts to use RulesEngine

## Phase 3: Resets & Scheduler Logic
- `[x]` Create lib/automation/ResetEngine.ts to idempotently reset daily metrics

## Phase 4: Reports Engine
- `[x]` Create lib/automation/ReportsEngine.ts
- `[x]` Create services/repositories/reports.repository.ts

## Phase 7: Dashboard UI Integration
- `[x]` Update Dashboard UI to display Today's AI Coach, Latest Report, Active Reminder, Current Streak, and Active Mission
- `[x]` Create NotificationCenter.tsx dropdown in TopBar

# Milestone 6: Testing & Migrations

## Phase 7: Testing
- `[x]` Install Vitest, React Testing Library, and Playwright.
- `[x]` Set up basic test configuration for Vitest and Playwright.
- `[x]` Write at least one unit test for `AnalyticsEngine.ts` and `RulesEngine.ts`.
- `[x]` Run an `npm audit` and fix vulnerabilities if possible.

## Phase 8: Migrations
- `[x]` Create `docs/migrations/001_initial_schema.md` and subsequent markdown files to document the evolution of the schema as requested.

# Milestone 6: Performance & Accessibility

## Phase 1: Performance
- `[x]` Audit progress page and use next/dynamic to lazy load heavy charts
- `[x]` Ensure next/image is used optimally

## Phase 6: Accessibility
- `[x]` Audit main UI components (Dashboard, Navigation) for proper ARIA labels, focus management, and contrast ratios

# Milestone 6: Deployment & Security

## Phase 2: Rate Limiting
- `[x]` Install @upstash/ratelimit and @upstash/redis
- `[x]` Create middleware.ts
- `[x]` Implement rate limiting for API endpoints
- `[x]` Cron endpoints bypass rate limiting and validate CRON_SECRET

## Phase 4: Firestore Rules
- `[x]` Create firestore.rules
- `[x]` Users can read/write their own data
- `[x]` Protected fields (XP, Achievements, Reports, Analytics, Level)

## Phase 5: Error Handling
- `[x]` Create app/not-found.tsx, app/error.tsx, and app/global-error.tsx
- `[x]` Ensure graceful API failures

# Final Readiness (v1.0)

## Phase 1: Progression Synchronization
- `[x]` Update TopBar.tsx with real level
- `[x]` Update ProfileMenu.tsx with real XP and Level
- `[x]` Add XPBar to ProfileMenu.tsx
- `[x]` Update ProgressHero.tsx with real streak and XP

## Phase 2: Dashboard Cards Standardization
- `[x]` Standardize MetricCard to have min-h-[140px], strict paddings, and consistent typography
- `[x]` Update Dashboard overview section to use min-h-[140px] for even grid display

## Phase 3: Cardio Engine Core
- `[x]` Create lib/calculations/metrics.ts
- `[x]` Update activity store for cardio state
- `[x]` Create CardioHUD.tsx
- `[x]` Update training page for cardio flow

## Phase 4: Post-Workout Summary
- `[x]` Create SessionSummary.tsx
- `[x]` Integrate SessionSummary into training page

## Phase 5: AI Nutrition Engine
- `[x]` LogMealTool: requiresConfirmation and bypass client store on server
- `[x]` Update api/ai/route.ts for execution of confirmed tool calls
- `[x]` Create MealConfirmationWidget.tsx
- `[x]` Update nutrition/page.tsx to render widget and handle confirmation flow

## Phase 2: Email System
- `[x]` Install nodemailer
- `[x]` Create mail.service.ts
- `[x]` Create email API route
- `[x]` Create email templates
