"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAVIGATION } from "@/constants/navigation";
import { useUiStore } from "@/stores/ui.store";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useUiStore();

  const desktopNav = NAVIGATION.filter((item) => item.showOnDesktop);
  const mainNav = desktopNav.filter((item) => !item.isBottomSection);
  const bottomNav = desktopNav.filter((item) => item.isBottomSection);

  const sidebarVariants = {
    open: { width: "280px" },
    closed: { width: "80px" },
  };

  return (
    <motion.aside
      initial="open"
      animate={isSidebarOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className="hidden md:flex flex-col h-screen bg-background border-r border-border shrink-0 sticky top-0 relative z-20"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {isSidebarOpen ? (
          <span className="font-bold text-xl text-primary truncate">Ascend AI</span>
        ) : (
          <span className="font-bold text-xl text-primary mx-auto">A</span>
        )}
      </div>

      <button
        onClick={() => toggleSidebar()}
        className="absolute -right-3 top-20 bg-background border border-border rounded-full p-1 z-30 text-muted-foreground hover:text-foreground transition-colors"
      >
        {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {mainNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <item.icon size={22} className="shrink-0" />
              {isSidebarOpen && (
                <div className="flex flex-col whitespace-nowrap overflow-hidden">
                  <span className="text-sm leading-tight">{item.title}</span>
                  {item.subtitle && (
                    <span className="text-xs text-muted/70 leading-tight">
                      {item.subtitle}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border space-y-2">
        {bottomNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <item.icon size={22} className="shrink-0" />
              {isSidebarOpen && (
                <span className="text-sm whitespace-nowrap overflow-hidden">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
}
