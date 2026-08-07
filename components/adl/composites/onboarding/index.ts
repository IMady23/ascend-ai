/**
 * Onboarding Primitives — Reusable conversational UI components
 *
 * These primitives are designed to build any multi-step conversational flow.
 * They follow the ADL (Ascend Design Library) patterns and integrate
 * seamlessly with the existing design system.
 *
 * Usage:
 * Import these components to build onboarding flows, profile evolution prompts,
 * or any AI-driven conversational interactions.
 *
 * Design principles:
 * - Conversational (feels like talking to a coach, not filling a form)
 * - Progressive (reveal one thing at a time)
 * - Responsive (mobile-first, desktop-optimized)
 * - Accessible (keyboard navigation, screen reader support)
 * - Animated (smooth, purposeful transitions)
 */

export { CoachMessage } from "./CoachMessage";
export type { CoachMessageProps } from "./CoachMessage";

export { AIPresenceOrb, OrbedCoachMessage } from "./AIPresenceOrb";
export type { AIPresenceOrbProps, OrbedCoachMessageProps, OrbState } from "./AIPresenceOrb";

export { CoachQuestion } from "./CoachQuestion";
export type { CoachQuestionProps } from "./CoachQuestion";

export { ChoiceCard, ChoiceGroup } from "./ChoiceCard";
export type { ChoiceCardProps, ChoiceGroupProps } from "./ChoiceCard";

export { WheelSelector, WheelSelectorGroup } from "./WheelSelector";
export type {
  WheelSelectorProps,
  WheelSelectorGroupProps,
  WheelItem,
  WheelColumn,
} from "./WheelSelector";

export { TimelineSelector } from "./TimelineSelector";
export type { TimelineSelectorProps } from "./TimelineSelector";

export { ProgressHeader } from "./ProgressHeader";
export type { ProgressHeaderProps } from "./ProgressHeader";

export { ThinkingAnimation } from "./ThinkingAnimation";
export type { ThinkingAnimationProps, ThinkingStep } from "./ThinkingAnimation";

export { MilestoneCard } from "./MilestoneCard";
export type { MilestoneCardProps } from "./MilestoneCard";

export { CelebrationCard } from "./CelebrationCard";
export type { CelebrationCardProps } from "./CelebrationCard";
