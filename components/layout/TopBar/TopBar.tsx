"use client";

import { usePathname } from "next/navigation";
import { NAVIGATION } from "@/constants/navigation";
import { Bell, User } from "lucide-react";

export function TopBar() {
  const pathname = usePathname();
  const currentNav = NAVIGATION.find((nav) => nav.href === pathname);

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-foreground leading-tight">
          {currentNav?.title || "Ascend AI"}
        </h1>
        {currentNav?.subtitle && (
          <span className="text-xs text-muted-foreground leading-tight">
            {currentNav.subtitle}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Placeholder for Transformation Compass */}
        <div className="hidden sm:flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border">
          <span className="text-xs font-medium text-foreground">Phase 1</span>
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-primary rounded-full" />
          </div>
        </div>

        <button className="relative text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-secondary/50">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-background" />
        </button>

        <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-border overflow-hidden">
          <User size={16} className="text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
