"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAVIGATION } from "@/constants/navigation";
import { Plus } from "lucide-react";

export function BottomNavigation() {
  const pathname = usePathname();
  const mobileNav = NAVIGATION.filter((item) => item.showOnMobile);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around px-2 pb-safe z-20">
      {mobileNav.slice(0, 2).map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute top-0 w-8 h-1 bg-primary rounded-b-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.title}</span>
          </Link>
        );
      })}

      <div className="flex items-center justify-center w-full h-full">
        <button
          className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg transform -translate-y-4 hover:scale-105 transition-transform"
          aria-label="Add entry"
        >
          <Plus size={24} />
        </button>
      </div>

      {mobileNav.slice(2, 4).map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute top-0 w-8 h-1 bg-primary rounded-b-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
