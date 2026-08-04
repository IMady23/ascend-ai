"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthRepository } from "@/services/repositories/auth.repository";
import { useUserStore } from "@/stores/user.store";
import { SyncManager } from "@/services/sync/sync-manager";
import { resetStoresOnLogout } from "@/lib/auth/reset-stores";
import { ReminderEngine } from "@/services/notifications/reminder.engine";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import type { UserProfile } from "@/types/user";
import { AUTH_ROUTES, resolvePostAuthRoute } from "@/lib/auth/post-auth-routing";

type StartupState = 'INITIALIZING' | 'AUTH_LOADING' | 'PROFILE_LOADING' | 'READY' | 'ROUTED';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setAuthStatus, setUserId, setProfile, isInitialized, isAuthenticated } = useUserStore();
  const [startupState, setStartupState] = useState<StartupState>('INITIALIZING');
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  // Tracks whether we've received at least one confirmed auth state from Firebase.
  // Firebase fires null on page load before resolving the persisted session from
  // IndexedDB. Without this guard, that transient null triggers resetStoresOnLogout(),
  // which wipes localStorage (nutrition/activity stores), causing calories and water
  // to reset to 0 on every refresh even though the user is authenticated.
  const authResolvedRef = useRef(false);

  // Firebase auth subscription — runs once
  useEffect(() => {
    setStartupState('AUTH_LOADING');

    // Wait for Firebase to resolve the persisted auth session before subscribing
    // to state changes. authStateReady() resolves once the initial auth state is
    // known, preventing us from acting on the transient null that Firebase emits
    // during its IndexedDB read on page load.
    auth.authStateReady().then(() => {
      authResolvedRef.current = true;
    });

    const unsubscribe = AuthRepository.onAuthStateChanged(async (user) => {
      if (user) {
        authResolvedRef.current = true;
        setStartupState('PROFILE_LOADING');
        setUserId(user.uid);

        let hydratedProfile: UserProfile | null = null;
        try {
          const userData = await AuthRepository.fetchUserData(user.uid);
          if (userData?.profile) {
            hydratedProfile = userData.profile;
            setProfile(userData.profile);
          }
        } catch (error) {
          console.error("Failed to hydrate user data:", error);
        }

        setAuthStatus(true, true, false);
        SyncManager.startSync(user.uid);
        ReminderEngine.start();

        setStartupState('READY');

        const redirect = resolvePostAuthRoute(pathnameRef.current, hydratedProfile);
        if (redirect) {
          router.replace(redirect);
        }
        setStartupState('ROUTED');

      } else {
        // Only run logout cleanup once Firebase has confirmed the auth state.
        // On page refresh, Firebase emits null before reading the persisted session
        // from IndexedDB. Acting on that null would wipe stores and localStorage,
        // causing all nutrition/activity data to reset to 0 on every refresh.
        if (!authResolvedRef.current) {
          console.log("[AuthProvider] Skipping logout cleanup — auth not yet resolved (transient null)");
          return;
        }

        resetStoresOnLogout();
        setAuthStatus(false, true, false);
        SyncManager.stopSync();
        ReminderEngine.stop();

        setStartupState('READY');

        if (!AUTH_ROUTES.includes(pathnameRef.current)) {
          router.replace("/login");
        }
        setStartupState('ROUTED');
      }
    });

    return () => unsubscribe();
  }, [router, setAuthStatus, setProfile, setUserId]);

  // Redirect when navigating while already authenticated
  useEffect(() => {
    if (startupState !== 'READY' && startupState !== 'ROUTED') return;
    if (!isAuthenticated) return;

    const { profile } = useUserStore.getState();
    const redirect = resolvePostAuthRoute(pathname, profile);
    if (redirect) {
      router.replace(redirect);
    }
  }, [pathname, startupState, isAuthenticated, router]);

  const showSplash = !isInitialized || startupState === 'INITIALIZING' || startupState === 'AUTH_LOADING' || startupState === 'PROFILE_LOADING';

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base text-primary">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border-subtle flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
            <Rocket size={32} className="text-purple-400 relative z-10" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter mb-2">Initializing Ascend AI</h1>
          <p className="text-secondary text-sm font-medium animate-pulse">
            Loading your command center...
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
