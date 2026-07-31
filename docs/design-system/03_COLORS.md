# Visual Language: Colors

Ascend AI is a **dark-mode-first** application built on the Premium Intelligence philosophy. Our color system is designed to reduce eye strain, establish clear hierarchy, and use color purely for meaning rather than decoration.

## Why this Palette?

A dark slate palette (`#0F172A` base) feels more sophisticated than absolute black (`#000000`) or generic gray (`#111111`). It provides a subtle coolness that feels technical and modern. Accents are strictly constrained to specific modules to prevent the app from feeling like a neon video game.

## Base Palette (Neutral Slate)

These tokens form the foundational architecture of every page. 

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `Background` | `#0F172A` | The absolute lowest layer. The app background. |
| `Surface` | `#1E293B` | Main layout areas (Sidebar, Modals, large sections). |
| `Elevated Surface` | `#273449` | Cards, dropdown menus, popovers. |
| `Border` | `#334155` | Dividers, card borders, input borders. |
| `Primary Text` | `#F8FAFC` | Main headings, body text, data values. |
| `Secondary Text` | `#94A3B8` | Labels, captions, empty states, disabled text. |
| `Disabled` | `#64748B` | Disabled button backgrounds, locked UI elements. |

## Semantic Colors

Used strictly to communicate state. Never use these for decoration.

| Token | Hex | Meaning |
| :--- | :--- | :--- |
| `Success` | `#22C55E` | Goals met, positive trends, successful saves. |
| `Warning` | `#F59E0B` | Approaching limits, destructive actions requiring confirmation. |
| `Danger` | `#EF4444` | Errors, failed goals, destructive actions. |
| `Info` | `#3B82F6` | Neutral information, system updates. |

## Accent Palette

Accents are mapped 1:1 with specific product modules. 

| Module | Color Name | Hex | Emotion/Reasoning |
| :--- | :--- | :--- | :--- |
| **Dashboard** | Blue | `#3B82F6` | Calm, central, reliable. |
| **Mission Control** | Indigo | `#4F46E5` | Focused, deep, commanding. |
| **Workout** | Purple | `#A855F7` | Energetic, intense, active. |
| **Nutrition** | Green | `#22C55E` | Natural, healthy, growth. |
| **AI Coach** | Cyan | `#06B6D4` | Technological, futuristic, intelligent. |
| **Hall of Progress** | Gold | `#EAB308` | Wealth, achievement, premium. |
| **Reports** | Orange | `#F97316` | Alertness, analytical, trends. |
| **Settings** | Slate | `#64748B` | Utilitarian, out of the way. |

## Accent Usage Rules

1. **Maximum one dominant accent per page**: If the user is on the Workout page, the primary buttons, active tabs, and highlights must be Purple (`#A855F7`). Do not mix Green or Blue into the primary UI of that page.
2. **Never color large backgrounds with accent colors**: Accents belong on text, icons, thin borders, and small buttons. A full-screen Purple background violates the "Calm" philosophy.
3. **Gold is Sacred**: Gold (`#EAB308`) is reserved *exclusively* for achievements, medals, milestones, and streaks. It must never be used for a generic "Submit" button.

## Interactive States

Colors must shift predictably when interacted with.
- **Hover**: Lighten the base color by 10% (e.g., in HSL, increase Lightness).
- **Pressed**: Darken the base color by 10%.
- **Focus**: A 2px solid ring using the page's current Accent color, offset by 2px from the element (using the `Background` color for the offset gap).

## Gradients and Glows

- **Gradients**: Subtle linear gradients are permitted *only* on Premium cards (like AI Insights or Achievements). They must fade from the Accent color at 15% opacity to transparent.
- **Glows**: Soft box-shadow glows are reserved exclusively for the AI Coach (Cyan) and Achievements (Gold) to signify "magic" or "reward".

## Contrast Rules

- Text must maintain a minimum contrast ratio of **4.5:1** against its background.
- If an accent color (like Cyan or Yellow) fails contrast against white text, the text *must* flip to a dark slate (`#0F172A`) for readability.
