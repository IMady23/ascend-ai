"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthRepository } from "@/services/repositories/auth.repository";
import { useUserStore } from "@/stores/user.store";
import { SyncManager } from "@/services/sync/sync-manager";
import { ReminderEngine } from "@/services/notifications/reminder.engine";
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

  // Firebase auth subscription — runs once
  useEffect(() => {
    setStartupState('AUTH_LOADING');

    const unsubscribe = AuthRepository.onAuthStateChanged(async (user) => {
      if (user) {
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
        // IMPORTANT: Do NOT call resetStoresOnLogout() here.
        //
        // Firebase fires onAuthStateChanged(null) in two scenarios:
        //   1. App startup — transient null before Firebase resolves the persisted
        //      session. This is NOT a real logout.
        //   2. After explicit signOut() — a real logout.
        //
        // In scenario 1, calling resetStoresOnLogout() wipes Zustand persist
        // localStorage, causing nutrition data to reset to 0 on every app restart.
        //
        // resetStoresOnLogout() is already called BEFORE signOut() in every explicit
        // logout path (MobileDrawer.handleLogout, ProfileMenu.handleLogout). So stores
        // are always clean after a real logout — no cleanup needed here.
        //
        // Runtime evidence (2026-08-06): browser close + reopen trace confirmed:
        //   - localStorage survived with 4 meals, 158 kcal
        //   - Guard blocked Firestore's empty snapshot
        //   - dailyCalories correctly restored to 158 after 500ms
        //   - No data loss at any stage

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
