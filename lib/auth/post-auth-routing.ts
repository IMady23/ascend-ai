import type { UserProfile } from "@/types/user";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];
const ONBOARDING_ROUTE = "/onboarding";

export function isOnboarded(profile: UserProfile | null | undefined): boolean {
  return profile?.onboardingCompleted === true;
}

export function needsOnboarding(profile: UserProfile | null | undefined): boolean {
  if (!profile) return false; // loading state
  return profile.onboardingCompleted === false;
}

export function resolvePostAuthRoute(pathname: string, profile: UserProfile | null | undefined): string | null {
  if (!profile) return null; // Wait for hydration before routing

  if (AUTH_ROUTES.includes(pathname)) {
    return isOnboarded(profile) ? "/" : ONBOARDING_ROUTE;
  }

  if (pathname === ONBOARDING_ROUTE && isOnboarded(profile)) {
    return "/";
  }

  if (pathname === "/" && needsOnboarding(profile)) {
    return ONBOARDING_ROUTE;
  }

  return null;
}

export { AUTH_ROUTES, ONBOARDING_ROUTE };
