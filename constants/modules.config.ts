import { Activity, Dumbbell, Apple, BrainCircuit, LineChart, Trophy, Settings } from "lucide-react";

export type ModuleConfig = {
  id: string;
  label: string;
  icon: React.ElementType;
  route: string;
  accentColor: string;
  navigationGroup: string;
};

export const MODULE_CONFIG: ModuleConfig[] = [
  {
    id: "mission-control",
    label: "Mission Control",
    icon: Activity,
    route: "/",
    accentColor: "var(--color-accent-blue)",
    navigationGroup: "Performance",
  },
  {
    id: "training",
    label: "Training",
    icon: Dumbbell,
    route: "/training",
    accentColor: "var(--color-accent-orange)",
    navigationGroup: "Performance",
  },
  {
    id: "nutrition",
    label: "Nutrition",
    icon: Apple,
    route: "/nutrition",
    accentColor: "var(--color-accent-green)",
    navigationGroup: "Performance",
  },
  {
    id: "transformation",
    label: "Transformation",
    icon: Trophy,
    route: "/transformation",
    accentColor: "var(--color-accent-purple)",
    navigationGroup: "Growth",
  },
  {
    id: "progress",
    label: "Hall of Progress",
    icon: LineChart,
    route: "/progress",
    accentColor: "var(--color-accent-gold)",
    navigationGroup: "Growth",
  },
  {
    id: "ai-command",
    label: "AI Command",
    icon: BrainCircuit,
    route: "/ai",
    accentColor: "var(--color-accent-indigo)",
    navigationGroup: "Intelligence",
  },
  {
    id: "intel",
    label: "Intel Center",
    icon: LineChart, // Use appropriate icon
    route: "/intel",
    accentColor: "var(--color-accent-cyan)",
    navigationGroup: "Intelligence",
  },
  {
    id: "control-room",
    label: "Control Room",
    icon: Settings,
    route: "/settings",
    accentColor: "var(--color-accent-slate)",
    navigationGroup: "System",
  },
];
