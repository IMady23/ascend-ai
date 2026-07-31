# Accessibility (A11y)

Accessibility is not a final checklist in Ascend AI. It is a foundational pillar of the "Premium Intelligence" philosophy. A premium tool does not exclude users based on their physical or cognitive abilities.

## Why this rigor?

Health and fitness applications are used in highly variable environments: outdoors in glaring sunlight, mid-workout with sweaty hands, or while fatigued. High contrast, large touch targets, and clear semantics benefit *everyone*, not just users with permanent disabilities.

---

## 1. Contrast & Color Blindness

- **Rule**: All text must pass WCAG AA (4.5:1 ratio) against its background. Large text (above 24px) can pass at 3:1.
- **Color Independence**: Never rely solely on color to convey state. 
  - *Bad*: A chart line turns red to indicate a failed goal.
  - *Good*: A chart line turns red AND becomes dashed, with an explicit `X` icon on the tooltip.
- **Focus States**: The focus ring must use the current Module Accent color and must have a 2px offset (using the background color) so it doesn't bleed into the element itself.

---

## 2. Keyboard Navigation & Focus Management

- **Rule**: Every interactive element (Button, Input, Tab, Chart Node) must be reachable via the `Tab` key.
- **Visible Focus**: The `outline-none` class is strictly forbidden unless immediately replaced by a custom `focus:ring` state. Hidden focus states make keyboard navigation impossible.
- **Modals & Drawers**: When a modal opens (e.g., the Meal Logger), focus MUST be trapped inside the modal. When the modal closes, focus MUST return to the button that opened it.

---

## 3. Touch Targets (Mobile)

- **Rule**: The absolute minimum touch target size for any interactive element on mobile is **44x44px** (Apple HIG standard).
- If an icon button looks visually smaller (e.g., a 24x24px close icon), it must include transparent padding (`p-2` or `p-3`) to extend the clickable area to 44px.
- *Why?* Users interacting with the app during a workout have decreased motor precision. Tiny hitboxes cause frustration.

---

## 4. Screen Readers (Semantic HTML & ARIA)

- **Semantic HTML First**: Always use `<button>` for actions and `<a>` for navigation. Do not use `<div onClick={...}>`.
- **Icon-Only Buttons**: Any button that contains only an icon MUST have an `aria-label` or visually hidden text (`sr-only`) explaining its action (e.g., `aria-label="Close meal logger"`).
- **Live Regions**: When the AI Coach generates a response, or a toast notification appears, it must be wrapped in `aria-live="polite"` so the screen reader announces it without interrupting the user.

---

## 5. Reduced Motion

- **Rule**: Respect `@media (prefers-reduced-motion: reduce)`.
- **Implementation**: In Tailwind, this means wrapping heavy animations (like scaling or bouncing) in `motion-safe:` utility classes.
- If reduced motion is requested, replace all physical movement (sliding, popping, scaling) with a simple opacity crossfade (`opacity-0` to `opacity-100`).

---

## 6. Cognitive Load (The "Calm" Principle)

- Keep layouts predictable. The Top Bar and Sidebar must never change positions.
- Provide clear error messages. Instead of "Invalid Input", say "Weight must be a positive number."
- Avoid infinite scrolling where possible. It removes a sense of completion. Use explicit pagination or "Load More" buttons for history logs.
