# Bugfix Requirements Document

## Introduction

The authentication recovery bug causes returning users to be incorrectly redirected to onboarding screens instead of their Mission Control (dashboard) after application restart. This occurs due to a race condition where:
1. SyncManager.startSync() calls stopSync() during rehydration, which clears profile state
2. Routing logic incorrectly interprets null profiles as new users needing onboarding
3. The needsOnboarding() function returns true for null profiles during the race condition window

## Bug Analysis

### Current Behavior (Defect)

[What currently happens when the bug is triggered]

1.1 WHEN SyncManager.startSync() is called with isSyncing = true THEN the system calls UserSync.stop() which clears profile state
1.2 WHEN needsOnboarding() receives a null profile THEN the system incorrectly returns true
1.3 WHEN profile hydration happens asynchronously via onSnapshot THEN the system makes routing decisions before profile is loaded
1.4 WHEN resolvePostAuthRoute() executes with null profile during startup THEN the system redirects to "/onboarding" instead of waiting
1.5 WHEN the application restarts with an authenticated user THEN the system incorrectly shows onboarding screens to already-onboarded users

### Expected Behavior (Correct)

[What should happen instead]

2.1 WHEN SyncManager.startSync() is called with isSyncing = true THEN the system SHALL NOT clear profile state during rehydration
2.2 WHEN needsOnboarding() receives a null profile during loading THEN the system SHALL return false (or handle as loading state)
2.3 WHEN profile hydration happens asynchronously THEN the system SHALL wait for profile to load before making routing decisions
2.4 WHEN resolvePostAuthRoute() executes during startup THEN the system SHALL only redirect after profile is fully hydrated
2.5 WHEN the application restarts with an authenticated user THEN the system SHALL redirect to Mission Control ("/") for onboarded users

### Unchanged Behavior (Regression Prevention)

[Existing behavior that must be preserved]

3.1 WHEN a truly new user (no profile in Firestore) creates an account THEN the system SHALL CONTINUE TO show onboarding screens
3.2 WHEN a user logs out and logs back in THEN the system SHALL CONTINUE TO redirect to Mission Control if already onboarded
3.3 WHEN a user completes onboarding for the first time THEN the system SHALL CONTINUE TO redirect to Mission Control
3.4 WHEN authentication fails or times out THEN the system SHALL CONTINUE TO redirect to login screen
3.5 WHEN UserSync.stop() is called on actual logout THEN the system SHALL CONTINUE TO clear profile state
3.6 WHEN needsOnboarding() receives a profile with onboardingCompleted = false THEN the system SHALL CONTINUE TO return true