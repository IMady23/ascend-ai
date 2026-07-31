# Visual Language: Motion

Motion in Ascend AI is functional, not decorative. It serves to guide the user's eye, provide immediate feedback, and mask loading times. If an animation does not serve one of these three purposes, it must be removed.

## Why this Philosophy?

Excessive, bouncy, or slow animations destroy the feeling of a "Premium" tool. Fast, crisp, and predictable animations build trust. When motion *is* used heavily (e.g., celebrating an achievement), its contrast against the otherwise calm UI makes it deeply impactful.

---

## 1. The Timing System

We restrict animation durations to three strict variables.

| Token | Duration | Usage | Emotion |
| :--- | :--- | :--- | :--- |
| `duration-fast` | `150ms` | Hover states, focus rings, toggles. | Snappy, immediate, responsive. |
| `duration-normal`| `300ms` | Modals opening, dropdowns expanding. | Smooth, clear, intentional. |
| `duration-slow` | `500ms` | Page transitions, chart drawing, AI thinking. | Deliberate, magical, narrative. |

---

## 2. Easing Curves

Linear animations look robotic. All animations must use easing curves to simulate real-world physics.

| Token | Curve | Usage |
| :--- | :--- | :--- |
| `ease-ui` | `cubic-bezier(0.83, 0, 0.17, 1)` | (Standard UI). Starts fast, settles smoothly into place. |
| `ease-pop` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | (Back/Overshoot). Used exclusively for gamification pops (achievements, success checks). |

---

## 3. Interaction Motion

### Hover & Tap
- **Hover**: Subtle background color shift or border glow (`150ms ease-ui`). 
- **Tap/Press**: Elements must instantly shrink (`scale-95`) to mimic physical compression. The return to normal size happens at `150ms ease-ui`.

### Loading States
- Never use a static spinner.
- **Skeletons**: Must use a subtle left-to-right shimmer or a soft pulse to indicate active fetching, not a frozen app.
- **AI Thinking**: Instead of dots, use a fluid opacity wave over the skeleton text, resembling a machine actively computing.

### Success & Errors
- **Success**: A crisp checkmark that draws itself (`300ms ease-ui`), followed by a subtle scale 'pop' (`300ms ease-pop`).
- **Error**: A fast horizontal shake (`translateX` back and forth 3 times over `300ms`).

---

## 4. Layout & Page Transitions

### Page Transitions
- Fade in `opacity-0` to `opacity-100` over `300ms`.
- Combine with a very subtle slide up (`translateY(10px)` to `0`) so the new page feels like it is rising into place.

### Dialogs & Bottom Sheets
- **Modals**: Fade in and scale up slightly (`scale-95` to `scale-100`).
- **Bottom Sheets (Mobile)**: Slide up from the bottom edge (`translateY(100%)` to `0`).

---

## 5. Reduced Motion Policy

Accessibility is non-negotiable. If the user's OS is set to `prefers-reduced-motion`, we must respect it.
- **Rule**: Replace all slides, scales, and bounces with a simple `150ms` opacity crossfade.
- *Why?* Complex motion can trigger vestibular disorders (dizziness/nausea). A premium app does not cause its users physical discomfort.
