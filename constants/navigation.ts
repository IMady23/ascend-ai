import {
  Home,
  Compass,
  Dumbbell,
  Apple,
  Bot,
  BrainCircuit,
  Trophy,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  icon: LucideIcon;
  showOnMobile: boolean;
  showOnDesktop: boolean;
  isBottomSection?: boolean;
}

export const NAVIGATION: NavItem[] = [
  {
    id: "mission-control",
    title: "Mission Control",
    subtitle: "Your daily hub",
    href: "/",
    icon: Home,
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    id: "transformation",
    title: "Transformation",
    subtitle: "Your journey",
    href: "/transformation",
    icon: Compass,
    showOnMobile: false,
    showOnDesktop: true,
  },
  {
    id: "training-center",
    title: "Training Center",
    subtitle: "Workouts & Programs",
    href: "/training",
    icon: Dumbbell,
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    id: "nutrition-lab",
    title: "Nutrition Lab",
    subtitle: "Meals & Macros",
    href: "/nutrition",
    icon: Apple,
    showOnMobile: false,
    showOnDesktop: true,
  },
  {
    id: "ai-command",
    title: "AI Command",
    subtitle: "Your personal coach",
    href: "/ai",
    icon: Bot,
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    id: "intel-center",
    title: "Intel Center",
    subtitle: "Analytics & Logs",
    href: "/intel",
    icon: BrainCircuit,
    showOnMobile: false,
    showOnDesktop: true,
  },
  {
    id: "hall-of-progress",
    title: "Hall of Progress",
    subtitle: "Achievements",
    href: "/progress",
    icon: Trophy,
    showOnMobile: false,
    showOnDesktop: true,
  },
  {
    id: "control-room",
    title: "Control Room",
    subtitle: "Settings",
    href: "/settings",
    icon: Settings,
    showOnMobile: false, // Usually accessible via profile on mobile
    showOnDesktop: true,
    isBottomSection: true,
  },
];
