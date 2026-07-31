# Ascend AI Reminder & Notification System

This document outlines the architecture, data flow, and limitations of the Ascend AI Reminder System implemented in Phase 2.

## Architecture

The system is decoupled into three primary layers to ensure scalability and reliability:
1. **State & Storage (`stores/reminder.store.ts`)**: Zustand acts as the local source of truth, persisting to `localStorage` while syncing with Firebase (`users/{uid}/reminders`).
2. **Evaluation Engine (`services/notifications/reminder.engine.ts`)**: An event-driven singleton that evaluates schedules, calculates the precise time until the next trigger, and maintains strict idempotency.
3. **Delivery Mechanisms**: 
   - Browser Push: Handled via `BrowserNotificationService`.
   - In-App: Handled via `useReminderStore().logEvent`.
   - Email: Handled securely server-side via `app/api/email/route.ts` and `mail.service.ts`.

## Data Flow & Lifecycle

1. **Created**: A user configures a schedule via the UI. The `NotificationScheduler` maps this to a `Reminder` object and saves it to the store.
2. **Scheduled**: The `ReminderEngine` evaluates all reminders and sets a single `setTimeout` for the *most imminent* reminder.
3. **Triggered**: When the timer fires, the engine generates a dynamic, personalized message via `MotivationalEngine`.
4. **Delivered**: The engine iterates over the user's selected `notificationChannels` (Browser, Email, In-App) and executes them.
5. **Completed**: The reminder's `lastTriggeredAt` is updated, a `deliveryId` is logged, and the history is updated. The engine then calls `evaluateNext()` to schedule the next upcoming reminder.

## Firestore Schema

Stored at: `users/{uid}/reminders/{reminderId}`

```typescript
interface Reminder {
  id: string;
  userId: string;
  type: ReminderType;
  title: string;
  description: string;
  scheduledTime: string; // HH:mm format
  repeatRule: 'once' | 'daily' | 'weekdays' | 'weekly' | 'custom';
  enabled: boolean;
  notificationChannels: NotificationChannel[]; // ['browser', 'email', 'in-app']
  
  // Execution tracking
  status: 'scheduled' | 'completed' | 'missed';
  lastTriggeredAt?: string; // ISO timestamp
  deliveryId?: string; // UUID of last execution
  
  createdAt: string;
  updatedAt: string;
}
```
*Note: Updates use merge semantics to prevent overwriting unrelated fields during sync.*

## Duplicate Prevention (Idempotency)

The system enforces strict duplicate protection:
1. **`lastTriggeredAt` Guard**: Before a reminder triggers, the engine checks if `Date.now() - lastTriggeredAt < 60000`. If so, it aborts to prevent double-firing due to rapid re-renders or manual refreshes.
2. **`deliveryId`**: Every execution generates a unique `deliveryId` which is logged in the history, ensuring an exact audit trail of executions.

## Multi-User Isolation

To prevent User A from receiving User B's reminders:
- `ReminderEngine.start()` is only called upon successful authentication.
- `ReminderEngine.stop()` is explicitly called on logout (`AuthProvider.tsx`). This completely clears the active `setTimeout` and deregisters all event listeners (wake/focus).
- `resetStoresOnLogout()` purges the `useReminderStore` so no state leaks.

## Retry Strategy

- **Email**: The NodeMailer implementation (`mail.service.ts`) features a bounded 3-retry strategy for failed SMTP dispatches.
- **Offline Recovery**: If the application regains connection or focus (`visibilitychange` hook) after a scheduled time has passed, the engine recalculates. If a 'daily' reminder was missed by > 1 hour, it marks it as `missed` instead of spamming the user late at night.

---

## 🚨 Known Limitations

**Reminder scheduling currently depends on the client application being active.**

If the browser is completely closed, reminder evaluation pauses. The application cannot wake up a closed browser to trigger a `setTimeout`. Therefore, email reminders will not send if the user does not have Ascend AI open in a background tab.

**Future Server Scheduler Migration**

The reminder architecture has intentionally been separated from delivery so it can later be migrated to Cloud Functions, Cloud Scheduler, or another server-side scheduler without changing the data model. 
To migrate:
1. Move `ReminderEngine.evaluateNext()` to a 1-minute server-side Cron job.
2. Replace local state checks with Firebase Admin SDK queries.
3. The delivery logic (Email API, FCM for Push) remains identical.
