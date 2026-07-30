# Authentication Recovery Bugfix Design

## Overview

The authentication recovery bug causes returning users to be incorrectly redirected to onboarding screens after application restart. This occurs due to race conditions between profile loading and routing decisions. The fix strategy involves three main changes: preventing profile clearing during rehydration, improving routing logic to handle loading states, and ensuring proper synchronization between authentication and profile hydration.

## Glossary

- **Bug_Condition (C)**: The condition where `SyncManager.startSync()` clears profile state during rehydration, causing `needsOnboarding()` to incorrectly return true for null profiles
- **Property (P)**: The desired behavior where returning authenticated users are directed to Mission Control ("/") rather than onboarding
- **Preservation**: Existing behaviors for new users, logout flows, and proper onboarding logic that must remain unchanged
- **SyncManager**: The service in `services/sync/sync-manager.ts` that manages real-time Firestore subscriptions
- **UserSync**: The service in `services/sync/user.sync.ts` that handles user profile synchronization and clearing
- **needsOnboarding()**: The function in `lib/auth/post-auth-routing.ts` that determines if a user needs onboarding
- **resolvePostAuthRoute()**: The routing decision function that determines where to redirect authenticated users

## Bug Details

### Bug Condition

The bug manifests when a returning authenticated user restarts the application. The `SyncManager.startSync()` function calls `stopSync()` during rehydration due to a race condition, which triggers `UserSync.stop()` to clear the profile state. With a null profile, `needsOnboarding()` returns true, causing the system to incorrectly redirect to "/onboarding" instead of Mission Control.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type AuthRecoveryEvent
  OUTPUT: boolean
  
  RETURN input.eventType = "APP_RESTART"
         AND input.userState = "AUTHENTICATED_RETURNING"
         AND profileHydrated(input) = false
         AND syncManagerIsSyncing(input) = true
         AND needsOnboarding(null) = true
         AND redirectTarget(null) = "/onboarding"
END FUNCTION
```

### Examples

- **Example 1**: User closes app, reopens it, sees onboarding screens instead of dashboard
  - Expected: Redirect to "/" (Mission Control)
  - Actual: Redirect to "/onboarding"
  
- **Example 2**: User refreshes browser while authenticated, gets shown onboarding flow
  - Expected: Stay on current page or return to dashboard
  - Actual: Redirect to "/onboarding"
  
- **Example 3**: User switches tabs and returns to app after some time
  - Expected: Return to previous state/dashboard
  - Actual: Redirect to "/onboarding"

- **Edge Case**: New user creating account for first time
  - Expected: Show onboarding flow
  - Actual: Should continue to show onboarding flow (preserved behavior)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- New users with no profile in Firestore must continue to be shown onboarding screens
- Users who log out and log back in must continue to be redirected appropriately
- Users completing onboarding for the first time must continue to be redirected to Mission Control
- Authentication failures/timeouts must continue to redirect to login screen
- Actual logout (UserSync.stop()) must continue to clear profile state
- Users with onboardingCompleted=false must continue to be shown onboarding

**Scope:**
All inputs that do NOT involve application restart with an authenticated returning user should be completely unaffected by this fix. This includes:
- New user account creation flows
- Explicit logout/login cycles  
- Authentication error scenarios
- Profile updates during active sessions
- Navigation while already authenticated

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Race Condition in SyncManager.startSync()**: The function checks `if (this.isSyncing) this.stopSync()` and calls `UserSync.stop()` which clears profile state, but this happens during rehydration when we should preserve the profile.

2. **Insufficient Loading State Handling**: `needsOnboarding()` returns `true` for `null` profiles, but during the loading window between authentication and profile hydration, `null` is a valid temporary state that shouldn't trigger onboarding.

3. **Premature Routing Decisions**: `resolvePostAuthRoute()` makes routing decisions before profile hydration completes, using the temporarily null profile.

4. **Lack of Synchronization Between Auth and Profile**: The AuthProvider's `onAuthStateChanged` callback doesn't properly coordinate between authentication state and profile hydration state.

## Correctness Properties

Property 1: Bug Condition - Returning Users Redirect to Dashboard

_For any_ authentication recovery scenario where a returning authenticated user restarts the application, the fixed system SHALL redirect to Mission Control ("/") rather than onboarding screens, ensuring that profile state is preserved during rehydration and routing decisions wait for complete profile hydration.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

Property 2: Preservation - New Users and Logout Flows Unchanged

_For any_ input that is NOT an application restart with a returning authenticated user (new users, logout/login cycles, authentication errors), the fixed system SHALL produce exactly the same behavior as the original system, preserving all existing functionality for non-recovery scenarios.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File 1**: `services/sync/sync-manager.ts`

**Function**: `startSync(userId: string)`

**Specific Changes**:
1. **Add Same-User Check**: Modify the condition to only call `stopSync()` if switching to a different user, not during rehydration for the same user
2. **Add Rehydration Mode**: Add a parameter or internal flag to distinguish between rehydration and actual user switch

**File 2**: `services/sync/user.sync.ts`

**Function**: `stop()`

**Specific Changes**:
1. **Separate Stop Modes**: Split into `stopForLogout()` and `stopForCleanup()` methods
2. **Preserve Profile on Cleanup**: The cleanup mode should only dispose listeners without clearing profile

**File 3**: `lib/auth/post-auth-routing.ts`

**Function**: `needsOnboarding(profile: UserProfile | null | undefined)`

**Specific Changes**:
1. **Handle Loading State**: Return `null` or special "loading" value instead of `true` for null profiles
2. **Update Callers**: Modify `resolvePostAuthRoute()` to handle the loading state

**File 4**: `components/providers/AuthProvider.tsx`

**Function**: `onAuthStateChanged` callback

**Specific Changes**:
1. **Improve State Coordination**: Better synchronize between authentication ready and profile hydrated states
2. **Delay Routing Decisions**: Only call `resolvePostAuthRoute()` after both auth and profile are ready
3. **Add Loading States**: Implement proper loading states to prevent premature routing

**File 5**: `lib/auth/post-auth-routing.ts`

**Function**: `resolvePostAuthRoute(pathname: string, profile: UserProfile | null | undefined)`

**Specific Changes**:
1. **Add Loading State Logic**: Handle the case where profile is still loading/undefined
2. **Return null for Loading**: When profile is undefined/null during loading, return null to indicate no redirect yet

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate application restart with authenticated returning users and assert that they are redirected to Mission Control, not onboarding. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **Returning User Restart Test**: Simulate app restart with authenticated returning user (will fail on unfixed code)
2. **Profile Hydration Race Test**: Test routing decision timing relative to profile hydration (will fail on unfixed code)
3. **Same User Rehydration Test**: Test SyncManager behavior when same user rehydrates (will fail on unfixed code)
4. **New User Creation Test**: Test that new users still see onboarding (should pass on unfixed code)

**Expected Counterexamples**:
- Returning users incorrectly redirected to "/onboarding"
- `SyncManager.startSync()` calling `stopSync()` during rehydration
- `needsOnboarding(null)` returning `true` during loading window
- Routing decisions made before profile hydration completes

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := handleAuthRecovery_fixed(input)
  ASSERT redirectTarget(result) = "/"
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT handleAuthRecovery_original(input) = handleAuthRecovery_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for new users, logout flows, and error scenarios, then write property-based tests capturing that behavior.

**Test Cases**:
1. **New User Preservation**: Observe that new users see onboarding on unfixed code, then verify this continues after fix
2. **Logout Flow Preservation**: Observe logout behavior on unfixed code, then verify this continues after fix
3. **Authentication Error Preservation**: Observe error handling on unfixed code, then verify this continues after fix
4. **Onboarding Completion Preservation**: Observe that completing onboarding redirects to dashboard on unfixed code, then verify this continues after fix

### Unit Tests

- Test `SyncManager.startSync()` behavior for same user vs different user
- Test `UserSync.stop()` vs `UserSync.disposeListener()` separation
- Test `needsOnboarding()` with null, undefined, and valid profiles
- Test `resolvePostAuthRoute()` with loading states
- Test AuthProvider state coordination and timing

### Property-Based Tests

- Generate random authentication states and verify correct routing
- Generate random profile states and verify `needsOnboarding()` behavior
- Generate random timing scenarios for profile hydration races
- Test that all non-recovery scenarios continue to work across many random inputs

### Integration Tests

- Test full authentication recovery flow with app restart
- Test user switching flows (logout/login, multiple users)
- Test error recovery scenarios (network issues, Firestore errors)
- Test visual feedback during loading states (splash screen behavior)