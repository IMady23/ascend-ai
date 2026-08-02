"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { NavigationMotion } from "@/utils/motion";

interface SidebarItemProps {
  id: string;
  label: string;
  icon: React.ElementType;
  route: string;
  accentColor: string;
  isSidebarOpen: boolean;
}

export function SidebarItem({ id, label, icon: Icon, route, accentColor, isSidebarOpen }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === route || (route !== "/" && pathname.startsWith(route));

  return (
    <Link
      href={route}
      className={cn(
        "group relative flex items-center h-11 px-3 rounded-md transition-colors duration-fast ease-ui outline-none",
        isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-elevated"
      )}
    >
      {/* Active Indicator Background */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute inset-0 rounded-md bg-bg-surface-elevated glass-highlight border border-border -z-10"
          initial={false}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      
      {/* Accent Glow for Active Item */}
      {isActive && (
        <div 
          className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full"
          style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
        />
      )}

      {/* Icon */}
      <Icon 
        size={20} 
        className={cn(
          "shrink-0 z-10 transition-transform duration-normal ease-ui", 
          isActive ? "ml-3" : "ml-1 group-hover:scale-110",
          !isSidebarOpen && isActive && "ml-0 mx-auto"
        )} 
        style={isActive ? { color: accentColor } : {}}
      />
      
      {/* Label */}
      {isSidebarOpen && (
        <span className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden z-10">
          {label}
        </span>
      )}
    </Link>
  );
}
