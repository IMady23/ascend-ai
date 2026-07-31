# Component Specifications

This document outlines the design requirements and states for every major UI component in Ascend AI. 

## Why Specify States?
A button is not just a rectangle with text. It is a living element that must react to the user. Failing to define hover, focus, disabled, or loading states leads to a broken, cheap-feeling product. The "Premium Intelligence" aesthetic demands that every interaction is accounted for.

---

## 1. Buttons

### Purpose
To trigger an action.

### Variants
1. **Primary**: Uses the active module's Accent color. For major actions (e.g., "Start Workout", "Log Meal").
2. **Secondary**: Uses `SurfaceElevated` background. For alternative actions (e.g., "Cancel", "Edit").
3. **Ghost**: Transparent background, text only. For low-priority actions.

### Design Specs (Primary)
- **Radius**: `radius-lg` (12px)
- **Typography**: `text-base font-medium`
- **Spacing**: `px-4 py-3`

### Required States
- **Default**: Solid accent color.
- **Hover**: Accent color + 10% lightness.
- **Pressed**: Accent color - 10% lightness + slight scale down (`scale-95`).
- **Focus**: `ring-2` offset by 2px using the Accent color.
- **Disabled**: Background `Disabled` (`#64748B`), text opacity 50%. Not clickable.
- **Loading**: Text fades out, spinner fades in center. Width remains locked to prevent layout shifting.

---

## 2. Cards

### Purpose
To group related data, forming the primary building blocks of the dashboard.

### Variants
1. **Standard Card**: Solid `SurfaceElevated` background.
2. **Glass Card**: `opacity-10` background with `blur-md`. Used exclusively for AI Insights or floating UI to convey depth.

### Design Specs
- **Radius**: `radius-xl` (16px) or `radius-2xl` (24px) for hero cards.
- **Spacing**: `p-4` or `p-6` depending on Density Mode.
- **Border**: 1px solid `Border` (`#334155`).

### Interactive States (if clickable)
- **Hover**: Background shifts slightly lighter, cursor changes to pointer.
- **Focus**: `ring-2` using current module Accent.

---

## 3. Progress Rings

### Purpose
To visualize completion percentage (e.g., Daily Score, Calories, Water).

### Design Specs
- **Track Color**: `Border` (`#334155`).
- **Fill Color**: Dynamic based on metric (e.g., Green for nutrition, Purple for workout).
- **Stroke Width**: Proportionate to size (e.g., 8px for a 120px ring).
- **Center Element**: Typically a `text-3xl` tabular number or an icon.

### Required States
- **Loading**: Ring pulses or spins subtly.
- **Success (100%+)**: The ring should trigger a 'pop' animation (`ease-out-back`), and the fill color optionally shifts to `Success` (`#22C55E`) or flashes.

---

## 4. Inputs (Text & Number)

### Purpose
Data entry (weight, calories, goals).

### Design Specs
- **Background**: `Background` (`#0F172A`) inset into a `Surface` card.
- **Border**: 1px solid `Border`.
- **Radius**: `radius-md`.
- **Typography**: `text-base` (Prevents iOS Safari from auto-zooming).

### Required States
- **Default**: Muted border.
- **Hover**: Border brightens slightly.
- **Focus**: `ring-2` with the module's Accent color. Border color matches Accent.
- **Error**: Border turns `Danger` (`#EF4444`). Shake animation on submit attempt.
- **Disabled**: `opacity-50`, `cursor-not-allowed`.

---

## 5. AI Chat / Coach Interface

### Purpose
To converse with the intelligence layer.

### Design Specs
- **User Bubble**: `SurfaceElevated` aligned right.
- **AI Bubble**: Transparent or slightly glassmorphic, aligned left.
- **Border/Glow**: AI responses occasionally feature a subtle `shadow-glow-ai` (Cyan) if they contain a major insight.

### Required States
- **Thinking (Loading)**: Do not use a generic spinner. Use a fluid, breathing, multi-dot animation or a shimmering skeleton text state to convey "computing."

---

## 6. Skeletons (Loading States)

### Purpose
To prevent layout shift while data fetches, keeping the UI calm.

### Design Specs
- **Background**: `SurfaceElevated` pulsing (`animate-pulse`).
- **Radius**: Matches the radius of the element it replaces.
- **Rule**: Never use a full-page spinner. Always use skeletons for cards and text blocks to maintain the structure of the page while loading.
