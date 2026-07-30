/**
 * Task 1 — Bug Condition Exploration Test
 *
 * Property 1: Bug Condition — Authentication Recovery Race Condition
 *
 * CRITICAL: This test MUST FAIL on unfixed code.
 * Failure confirms the bug exists and documents the counterexample.
 * DO NOT fix the code or test when it fails — that is the expected outcome.
 *
 * Goal: Surface counterexamples proving that the routing layer incorrectly
 * redirects returning authenticated users to "/onboarding" instead of "/".
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

import {
  resolvePostAuthRoute,
  needsOnboarding,
  isOnboarded,
} from "../../lib/auth/post-auth-routing";
import type { UserProfile } from "../../types/user";

// ---------------------------------------------------------------------------
// Helpers — represent different profile states during app startup
// ---------------------------------------------------------------------------

/** Profile that exists in Firestore for a fully onboarded returning user */
const returningUserProfile: UserProfile = {
  version: 1,
  onboardingCompleted: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

/**
 * null — represents profile state during the race condition window:
 *   - AuthProvider fetches profile but Firestore returns no profile field
 *   - OR SyncManager.stopSync() calls UserSync.stop() which calls setProfile(null)
 *     before routing decisions are made
 */
const profileDuringRaceCondition: UserProfile | null = null;

// ---------------------------------------------------------------------------
// Bug Condition Exploration Tests
// ---------------------------------------------------------------------------

describe("Bug Condition — Authentication Recovery Race (Task 1)", () => {
  /**
   * COUNTEREXAMPLE 1:
   * The core routing bug: needsOnboarding(null) returns true.
   * During app restart, profile is null in the race condition window.
   * This causes the routing system to treat the returning user as a new user.
   *
   * EXPECTED TO FAIL on unfixed code — documents the bug.
   */
  it("COUNTEREXAMPLE: needsOnboarding(null) should return false during loading, not true", () => {
    // During the loading/race window, null means "not yet loaded", not "new user"
    // On unfixed code this FAILS because needsOnboarding(null) === true
    expect(needsOnboarding(profileDuringRaceCondition)).toBe(false);
  });

  /**
   * COUNTEREXAMPLE 2:
   * resolvePostAuthRoute with null profile (race condition window) from "/" should NOT redirect.
   * A returning user at the dashboard root during startup must not be bounced to onboarding.
   *
   * EXPECTED TO FAIL on unfixed code — documents the redirect counterexample.
   */
  it("COUNTEREXAMPLE: returning user at '/' with null profile during loading should not redirect to /onboarding", () => {
    // Simulates: AuthProvider calls resolvePostAuthRoute before profile hydration completes
    // On unfixed code this FAILS because result === "/onboarding"
    const result = resolvePostAuthRoute("/", profileDuringRaceCondition);
    expect(result).not.toBe("/onboarding");
  });

  /**
   * COUNTEREXAMPLE 3:
   * resolvePostAuthRoute with null profile from a protected/dashboard route must not redirect.
   * During rehydration, routing decisions should be deferred, not acted on.
   *
   * EXPECTED TO FAIL on unfixed code.
   */
  it("COUNTEREXAMPLE: null profile during loading from dashboard routes should return null (defer routing)", () => {
    // null return means "no redirect yet — wait for profile to load"
    const result = resolvePostAuthRoute("/", profileDuringRaceCondition);
    expect(result).toBeNull();
  });

  /**
   * COUNTEREXAMPLE 4:
   * Full app-restart flow — returning user should go to Mission Control, not onboarding.
   * Simulates what AuthProvider does: calls resolvePostAuthRoute with the hydrated profile.
   * When profile hydration fails (returns null), the redirect must NOT be "/onboarding".
   *
   * EXPECTED TO FAIL on unfixed code.
   */
  it("COUNTEREXAMPLE: app restart flow — returning authenticated user with null profile must resolve to '/', not '/onboarding'", () => {
    // Step 1: AuthProvider starts, profile not yet loaded (null)
    const routeDuringLoading = resolvePostAuthRoute("/", profileDuringRaceCondition);

    // On unfixed code this FAILS — routeDuringLoading === "/onboarding"
    // A returning user must not be sent to onboarding just because profile is momentarily null
    expect(routeDuringLoading).not.toBe("/onboarding");
  });

  /**
   * POSITIVE CONTROL — should PASS on both unfixed and fixed code.
   * Verifies the test setup is correct: a fully hydrated returning user is routed to "/".
   */
  it("CONTROL: returning user with hydrated onboarded profile at /login routes to '/'", () => {
    expect(isOnboarded(returningUserProfile)).toBe(true);
    expect(resolvePostAuthRoute("/login", returningUserProfile)).toBe("/");
  });

  /**
   * Documents the exact counterexample output for root cause analysis.
   * Records what the unfixed code actually does.
   */
  it("DOCUMENTATION: records actual unfixed behavior for root cause analysis", () => {
    const actualNeedsOnboarding = needsOnboarding(profileDuringRaceCondition);
    const actualRoute = resolvePostAuthRoute("/", profileDuringRaceCondition);

    // Document the bug — these console.logs will appear in test output
    console.log("[BUG COUNTEREXAMPLE] needsOnboarding(null) =", actualNeedsOnboarding);
    console.log("[BUG COUNTEREXAMPLE] resolvePostAuthRoute('/', null) =", actualRoute);
    console.log("[ROOT CAUSE] null profile treated as new user needing onboarding");
    console.log("[ROOT CAUSE] needsOnboarding() has no loading-state guard: `if (!profile) return true`");

    // These assertions document the FIX (what the fixed code does).
    expect(actualNeedsOnboarding).toBe(false);  // FIXED: is false during loading
    expect(actualRoute).toBeNull();             // FIXED: is null for returning user during loading
  });
});
