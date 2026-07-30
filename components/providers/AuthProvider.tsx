"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthRepository } from "@/services/repositories/auth.repository";
import { useUserStore } from "@/stores/user.store";
import { SyncManager } from "@/services/sync/sync-manager";
import { resetStoresOnLogout } from "@/lib/auth/reset-stores";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import type { UserProfile } from "@/types/user";
import { AUTH_ROUTES, ONBOARDING_ROUTE, resolvePostAuthRoute } from "@/lib/auth/post-auth-routing";

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

        setStartupState('READY');

        const redirect = resolvePostAuthRoute(pathnameRef.current, hydratedProfile);
        if (redirect) {
          router.replace(redirect);
        }
        setStartupState('ROUTED');

      } else {
        resetStoresOnLogout();
        setAuthStatus(false, true, false);
        SyncManager.stopSync();

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
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
            <Rocket size={32} className="text-purple-400 relative z-10" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter mb-2">Initializing Ascend AI</h1>
          <p className="text-zinc-500 text-sm font-medium animate-pulse">
            Loading your command center...
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
