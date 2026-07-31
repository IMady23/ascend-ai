# Visual Language: Typography

Ascend AI relies on a **single font family** to maintain a cohesive, utilitarian, and premium aesthetic. We create visual hierarchy entirely through size, weight, spacing, and contrast—never by mixing font families.

## Why Inter?

We use **Inter**. 

*Why?* Inter was explicitly designed for computer screens. It features excellent x-heights for readability at small sizes (crucial for dense dashboards), perfectly monospaced tabular numerals (critical for aligning calories, weights, and times), and a neutral but modern personality that perfectly aligns with our "Premium Intelligence" philosophy.

We deliberately avoid decorative heading fonts (like Cal Sans or Clash Display) because they can make a data-heavy application feel inconsistent and overly stylized.

## The Typography Scale

All sizing follows a mathematical scale to ensure perfect rhythm. (Base size: 16px = 1rem).

| Token | Size | Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `text-xs` | 12px (0.75rem) | 16px | Regular / Medium | Captions, tooltips, tertiary labels. |
| `text-sm` | 14px (0.875rem)| 20px | Regular / Medium | Secondary text, data table rows, timestamps. |
| `text-base` | 16px (1rem) | 24px | Regular | Standard body copy, primary buttons, input fields. |
| `text-lg` | 18px (1.125rem)| 28px | Medium / Semibold | Card titles, modal headers, AI Coach responses. |
| `text-xl` | 20px (1.25rem) | 28px | Semibold | Section titles, sub-headers. |
| `text-2xl` | 24px (1.5rem) | 32px | Semibold | Page titles (H2). |
| `text-3xl` | 30px (1.875rem)| 36px | Bold | Major metrics, large dashboard greetings (H1). |
| `text-4xl` | 36px (2.25rem) | 40px | Bold | Hero metrics, massive achievement numbers. |
| `text-5xl+`| 48px+ | 1.1 | Bold / ExtraBold | Reserved for empty states or massive visual hooks. |

## Weight Usage

We restrict font weights to reduce file size and maintain consistency.
- **Regular (400)**: Standard body text and descriptions.
- **Medium (500)**: Buttons, table headers, labels.
- **Semibold (600)**: Section titles, card headers, emphasized data.
- **Bold (700)**: Page headers, massive hero metrics.
- *(Do not use Thin, Light, or Black weights).*

## Readability Rules

1. **Line Length (Measure)**: Body text (like AI Coach advice or long descriptions) must never exceed **70 characters** per line. Wide text blocks cause eye fatigue. Constrain text width using max-width containers (`max-w-prose`).
2. **Tabular Nums**: Any text displaying changing numbers (timers, calorie counters, weight charts) MUST use the CSS property `font-variant-numeric: tabular-nums;` to prevent layout shifting as numbers change.
3. **Contrast**: Do not use `Secondary Text` (`#94A3B8`) for critical data or long reading blocks. It is strictly for supportive context.
4. **Letter Spacing (Tracking)**: 
   - `text-xs` should have slight positive tracking (`tracking-wide` or `0.025em`) to improve legibility.
   - `text-3xl` and above should have slight negative tracking (`tracking-tight` or `-0.02em`) to make large headings look cohesive.
