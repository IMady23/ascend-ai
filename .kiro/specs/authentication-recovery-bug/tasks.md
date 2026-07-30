# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Authentication Recovery Race Condition
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For this deterministic bug, scope the property to concrete failing cases - app restart with authenticated returning users
  - Test that returning authenticated users are redirected to Mission Control ("/") after app restart
  - The test assertions should match the Expected Behavior Properties from design
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause (e.g., "User redirected to /onboarding instead of /")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Recovery Authentication Flows
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs:
    - New users see onboarding screens
    - Logout/login cycles redirect appropriately
    - Authentication errors redirect to login
    - Onboarding completion redirects to dashboard
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 3. Fix for authentication recovery bug

  - [ ] 3.1 Implement SyncManager.startSync() same-user rehydration protection
    - Add same-user check before calling stopSync() during rehydration
    - Modify condition to only call stopSync() if switching to different user
    - _Bug_Condition: isBugCondition(input) where input.eventType = "APP_RESTART" AND input.userState = "AUTHENTICATED_RETURNING"_
    - _Expected_Behavior: SyncManager SHALL NOT clear profile state during rehydration for same user (Requirement 2.1)_
    - _Preservation: SyncManager SHALL continue to clear state on actual logout (Requirement 3.5)_
    - _Requirements: 2.1, 3.5_

  - [ ] 3.2 Implement UserSync separate stop modes
    - Split UserSync.stop() into stopForLogout() and disposeListener() methods
    - stopForLogout() clears profile state (preserve existing behavior)
    - disposeListener() only disposes listeners without clearing profile
    - _Bug_Condition: isBugCondition(input) where UserSync.stop() called during rehydration_
    - _Expected_Behavior: Profile state preserved during rehydration cleanup (Requirement 2.1)_
    - _Preservation: Actual logout continues to clear profile state (Requirement 3.5)_
    - _Requirements: 2.1, 3.5_

  - [ ] 3.3 Implement needsOnboarding() loading state handling
    - Return null or special "loading" value instead of true for null profiles during loading
    - Update needsOnboarding() to distinguish between new users and loading states
    - _Bug_Condition: isBugCondition(input) where needsOnboarding(null) returns true during loading window_
    - _Expected_Behavior: needsOnboarding() SHALL handle null profiles as loading state (Requirement 2.2)_
    - _Preservation: New users with no profile continue to trigger onboarding (Requirement 3.1)_
    - _Requirements: 2.2, 3.1_

  - [ ] 3.4 Implement resolvePostAuthRoute() loading state logic
    - Add logic to handle profile loading/undefined state
    - Return null when profile is undefined/null during loading to indicate no redirect yet
    - _Bug_Condition: isBugCondition(input) where routing decisions made before profile hydration_
    - _Expected_Behavior: resolvePostAuthRoute() SHALL wait for profile hydration (Requirement 2.3, 2.4)_
    - _Preservation: Existing routing logic continues to work for fully hydrated profiles_
    - _Requirements: 2.3, 2.4_

  - [ ] 3.5 Implement AuthProvider state coordination improvements
    - Improve synchronization between authentication ready and profile hydrated states
    - Delay resolvePostAuthRoute() calls until both auth and profile are ready
    - Add proper loading states to prevent premature routing
    - _Bug_Condition: isBugCondition(input) where premature routing decisions_
    - _Expected_Behavior: AuthProvider SHALL coordinate auth and profile states (Requirement 2.3)_
    - _Preservation: All authentication flows continue to work correctly_
    - _Requirements: 2.3, 2.4, 2.5_

  - [ ] 3.6 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Authentication Recovery Fixed
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: Expected Behavior Properties 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 3.7 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Recovery Authentication Flows
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
