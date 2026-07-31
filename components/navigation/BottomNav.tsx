"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { LayoutDashboard, Dumbbell, Bot, TrendingUp, Menu } from "lucide-react";
import { useUiStore } from "@/stores/ui.store";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", href: "/", icon: LayoutDashboard },
  { id: "training", label: "Workout", href: "/training", icon: Dumbbell },
  { id: "ai", label: "AI Coach", href: "/ai", icon: Bot },
  { id: "progress", label: "Progress", href: "/progress", icon: TrendingUp },
];

export function BottomNav() {
  const pathname = usePathname();
  const { setMobileDrawerOpen } = useUiStore();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-bg-surface-elevated/90 backdrop-blur-xl border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-fast ease-ui",
                isActive ? "text-[var(--color-accent,var(--color-info))]" : "text-text-secondary hover:text-text-primary"
              )}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={cn(isActive && "scale-110 transition-transform duration-normal ease-pop")} />
              <span className="text-[10px] font-medium tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* More Button to trigger the Drawer */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-text-secondary hover:text-text-primary transition-colors duration-fast ease-ui focus:outline-none"
        >
          <Menu size={24} strokeWidth={2} />
          <span className="text-[10px] font-medium tracking-tight">
            More
          </span>
        </button>
      </div>
    </div>
  );
}
