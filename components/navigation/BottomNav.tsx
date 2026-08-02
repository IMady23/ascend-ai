"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { LayoutDashboard, Dumbbell, Bot, TrendingUp, Menu } from "lucide-react";
import { useUiStore } from "@/stores/ui.store";
import { useNotificationStore } from "@/stores/notification.store";

const NAV_ITEMS = [
  { id: "dashboard", label: "Home", href: "/", icon: LayoutDashboard },
  { id: "training", label: "Workout", href: "/training", icon: Dumbbell },
  { id: "ai", label: "AI Coach", href: "/ai", icon: Bot },
  { id: "progress", label: "Progress", href: "/progress", icon: TrendingUp },
];

export function BottomNav() {
  const pathname = usePathname();
  const { setMobileDrawerOpen } = useUiStore();
  const { notifications } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] pb-[env(safe-area-inset-bottom)] px-4 mb-4 pointer-events-none">
      <div className="flex items-center justify-around h-16 px-2 bg-bg-surface-elevated/80 backdrop-blur-2xl border border-glass-border shadow-lg rounded-2xl pointer-events-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                import("@/utils/haptics").then(({ vibrate }) => vibrate(10));
              }}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 space-y-1 transition-all duration-300 ease-spring active:scale-95",
                isActive ? "text-[var(--color-accent,var(--color-info))]" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-[var(--color-accent,var(--color-info))] rounded-b-full shadow-[0_0_8px_var(--color-accent,var(--color-info))] opacity-80 transition-all duration-spring" />
              )}
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={cn(isActive && "scale-110 -translate-y-0.5 transition-all duration-300 ease-spring")} />
              <span className={cn("text-[10px] font-medium tracking-tight transition-all duration-300", isActive ? "opacity-100 translate-y-0" : "opacity-80")}>
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* More Button to trigger the Drawer */}
        <button
          onClick={() => {
            import("@/utils/haptics").then(({ vibrate }) => vibrate(10));
            setMobileDrawerOpen(true);
          }}
          className="relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 space-y-1 text-text-secondary hover:text-text-primary transition-all duration-300 ease-spring active:scale-95 focus:outline-none"
          aria-label="More options"
        >
          <div className="relative">
            <Menu size={22} strokeWidth={2} />
            {unreadCount > 0 && (
              <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-danger)] text-[9px] font-bold text-white shadow-sm ring-2 ring-bg-surface-elevated">
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight opacity-80">
            More
          </span>
        </button>
      </div>
    </div>
  );
}
