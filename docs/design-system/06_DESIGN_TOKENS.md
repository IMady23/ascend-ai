# Design Tokens

This document serves as the master translation layer. It converts the conceptual rules from Colors, Typography, and Spacing into concrete, absolute tokens. **No hardcoded values should exist in the codebase outside of these tokens.**

## Why Tokens?

Tokens guarantee consistency. If we decide to make the app "softer" in the future, we change one radius token, and the entire app updates. Using arbitrary values like `rounded-[18px]` destroys this architecture and creates technical debt.

---

## 1. Border Radius Tokens

We use a rounded, friendly, but precise aesthetic. 

| Token | Value | Usage |
| :--- | :--- | :--- |
| `radius-sm` | 4px | Small interactive elements (checkboxes, tooltips). |
| `radius-md` | 8px | Standard inputs, small buttons, tags. |
| `radius-lg` | 12px | Standard cards, large buttons, dropdowns. |
| `radius-xl` | 16px | Large layout panels, hero cards, bottom sheets. |
| `radius-2xl`| 24px | Floating modals, major dashboard widgets. |
| `radius-full`| 9999px | Avatars, pills, circular icon buttons. |

---

## 2. Shadow & Elevation Tokens

Since we are a dark-mode-first app, standard gray drop-shadows do not work (they disappear into the dark background). Instead, we use "elevation" via background lightness, subtle colored glows, and dark shadow stacking.

| Token | CSS Value | Usage |
| :--- | :--- | :--- |
| `shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.4)` | Subtly elevating cards off the base background. |
| `shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.5)` | Dropdowns, sticky headers. |
| `shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.6)` | Floating action buttons, tooltips. |
| `shadow-modal` | `0 25px 50px -12px rgba(0, 0, 0, 0.7)` | Modals, centered dialogs. |
| `shadow-glow-ai` | `0 0 15px -3px rgba(6, 182, 212, 0.3)` | AI Coach active thinking state. |
| `shadow-glow-gold` | `0 0 20px -5px rgba(234, 179, 8, 0.4)` | Newly unlocked achievements. |

---

## 3. Blur & Opacity Tokens (Glassmorphism)

To maintain a Premium feel, we use glassmorphism sparingly. It adds depth without clutter.

| Token | Value | Usage |
| :--- | :--- | :--- |
| `blur-sm` | 4px | Subtle background blurs on sticky navbars. |
| `blur-md` | 12px | Standard glass cards floating over other content. |
| `blur-lg` | 24px | Heavy blur for modals overlaying the entire app. |
| `opacity-5` | 0.05 | Extremely subtle colored backgrounds (e.g. success state bg). |
| `opacity-10`| 0.10 | Hover state overlays. |
| `opacity-50`| 0.50 | Disabled states, muted icons. |

---

## 4. Animation & Easing Tokens

Motion must feel responsive (fast) but elegant (smooth). We do not use standard linear animations.

| Token | Value | Usage |
| :--- | :--- | :--- |
| `duration-fast` | 150ms | Hover states, color transitions, button presses. |
| `duration-normal`| 300ms | Dialog opens, accordion expansions, layout shifts. |
| `duration-slow` | 500ms | Page transitions, AI thinking reveals, progress rings. |
| `ease-in-out-quint` | `cubic-bezier(0.83, 0, 0.17, 1)` | Standard UI movement. Starts fast, settles smoothly. |
| `ease-out-back` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Delightful pops (badges, success checkmarks). |

---

## 5. Breakpoints

Standard mobile-first responsive breakpoints.

| Token | Value | Usage |
| :--- | :--- | :--- |
| `sm` | 640px | Large phones / small tablets. |
| `md` | 768px | Tablets (iPad portrait). Triggers sidebar vs bottom nav. |
| `lg` | 1024px | Small laptops. Expands grid columns. |
| `xl` | 1280px | Desktops. Max-width constraint for main content. |
