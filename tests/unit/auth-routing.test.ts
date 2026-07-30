import { resolvePostAuthRoute, isOnboarded, needsOnboarding } from "../../lib/auth/post-auth-routing";
import type { UserProfile } from "../../types/user";

describe("auth routing helpers", () => {
  const onboardedProfile: UserProfile = {
    version: 1,
    onboardingCompleted: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  const incompleteProfile: UserProfile = {
    version: 1,
    onboardingCompleted: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  it("keeps authenticated users on the dashboard when onboarding is complete", () => {
    expect(isOnboarded(onboardedProfile)).toBe(true);
    expect(needsOnboarding(onboardedProfile)).toBe(false);
    expect(resolvePostAuthRoute("/login", onboardedProfile)).toBe("/");
    expect(resolvePostAuthRoute("/", onboardedProfile)).toBeNull();
  });

  it("routes incomplete profiles to onboarding instead of the dashboard", () => {
    expect(isOnboarded(incompleteProfile)).toBe(false);
    expect(needsOnboarding(incompleteProfile)).toBe(true);
    expect(resolvePostAuthRoute("/", incompleteProfile)).toBe("/onboarding");
    expect(resolvePostAuthRoute("/login", incompleteProfile)).toBe("/onboarding");
  });
});
