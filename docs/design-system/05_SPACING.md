# Visual Language: Spacing

Ascend AI uses a strict **8-point grid system**. This ensures vertical and horizontal rhythm, mathematical consistency, and removes arbitrary decision-making from the design process.

## Why an 8-Point Grid?

Screens scale perfectly in multiples of 8 (e.g., 1024, 1920). Base-8 math ensures crisp rendering on all displays. More importantly, it dramatically reduces the number of spacing variables. Instead of choosing between 15px, 16px, or 18px, the system demands 16px. This enforced constraint creates the calm, orderly aesthetic of Premium Intelligence.

## The Spacing Scale

Every margin, padding, gap, and height MUST use a value from this scale. 
*Note: Half-steps (4px) are permitted only for extremely tight micro-adjustments.*

| Token (Tailwind) | Value (px) | Value (rem) | Primary Usage |
| :--- | :--- | :--- | :--- |
| `space-1` | 4px | 0.25rem | Micro-spacing (icon to text gap, tight list items). |
| `space-2` | 8px | 0.5rem | Small gaps (between sibling elements like badges). |
| `space-3` | 12px | 0.75rem | Internal padding for small inputs or buttons. |
| `space-4` | 16px | 1rem | **Base Unit**. Standard padding for cards and sections. |
| `space-6` | 24px | 1.5rem | Outer padding for large cards, space between form groups. |
| `space-8` | 32px | 2rem | Gaps between major sections on mobile. |
| `space-12` | 48px | 3rem | Gaps between major sections on desktop. |
| `space-16` | 64px | 4rem | Bottom padding for safe areas (mobile tab bars). |
| `space-24` | 96px | 6rem | Massive hero section spacing. |

## Containers & Layouts

We constrain maximum widths to prevent the UI from stretching endlessly on ultrawide monitors, which destroys the "Calm" aesthetic.

- **Page Max Width**: `max-w-7xl` (1280px). Pages center align once they exceed this width.
- **Reading Width**: `max-w-prose` (approx 65ch). Used for AI Coach responses and long documentation.
- **Form Width**: `max-w-md` (448px). Used for login, signup, and settings forms.

## Density Modes

We adapt our spacing based on the component's context.

1. **Comfortable Density (Default)**
   - Used for the Dashboard, AI Coach, and Reports.
   - Requires `space-4` or `space-6` padding.
   - *Why?* To give data room to breathe when the user is casually reviewing it.

2. **Compact Density**
   - Used for active Workouts, tabular data, and dense settings.
   - Requires `space-2` or `space-3` padding.
   - *Why?* When the user is actively exercising or hunting for a setting, they need maximum information on screen without scrolling.

## Responsive Spacing Rules

- **Mobile First**: Default to tighter spacing (`space-4` padding, `space-6` section gaps).
- **Desktop Breakpoint (`md:`)**: Scale up spacing to utilize the screen real estate (`space-6` padding, `space-12` section gaps).
- Never use fixed height containers. Rely on padding and min-heights to allow content to flow naturally.
