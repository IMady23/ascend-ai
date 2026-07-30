# Ascend Design Language (ADL) - Component Inventory

This is the central ledger of all ADL components. It tracks their maturity, API consistency, accessibility, and usage across the Ascend OS.

## 1. Primitives

### `Button`
*   **Purpose:** Standard interactive trigger.
*   **Variants:** `primary`, `secondary`, `ghost`, `destructive`, `icon`.
*   **States:** `loading`, `disabled`, `hover`, `focus`, `active`.
*   **Accessibility:** Keyboard focus rings, ARIA labels for icons.
*   **Status:** Stable (v1.0.0)

### `Badge`
*   **Purpose:** Status and categorization labels.
*   **Variants:** `default`, `outline`, `success`, `warning`, `info`, `error`.
*   **States:** `default`.
*   **Accessibility:** Color-independent contrast.
*   **Status:** Stable (v1.0.0)

### `Avatar`
*   **Purpose:** User identity representation.
*   **Variants:** `default`.
*   **States:** `loading` (skeleton), `empty` (initials), `error` (fallback icon).
*   **Accessibility:** `alt` text required.
*   **Status:** Stable (v1.0.0)

### `Typography` (`Heading`, `Subheading`, `BodyText`, `Caption`)
*   **Purpose:** Hierarchical text display.
*   **Variants:** `h1`-`h4`, `lg`-`xs`.
*   **States:** N/A
*   **Accessibility:** Semantic HTML tags (`<h1>`, `<p>`).
*   **Status:** Stable (v1.0.0)

### `Divider`
*   **Purpose:** Visual separation of content.
*   **Variants:** `horizontal`, `vertical`.
*   **States:** N/A
*   **Accessibility:** `role="separator"`.
*   **Status:** Stable (v1.0.0)


## 2. Layout Components

### `PageContainer`
*   **Purpose:** Top-level max-width and padding wrapper.
*   **Status:** Stable (v1.0.0)

### `DashboardLayout`
*   **Purpose:** Standard grid arrangement for OS modules.
*   **Status:** Stable (v1.0.0)

### `HeroSection`
*   **Purpose:** Prominent header area for modules.
*   **Status:** Stable (v1.0.0)

### `WidgetSection`
*   **Purpose:** Sectional container for cards.
*   **Status:** Stable (v1.0.0)


## 3. Composite Components

### `GlassCard`
*   **Purpose:** Universal elevated container.
*   **Variants:** `default`, `interactive`, `compact`, `hero`.
*   **States:** `loading` (skeleton overlay), `empty`, `error`.
*   **Accessibility:** Reduced motion on hover effects.
*   **Status:** Stable (v1.0.0)

*(Note: Domain-specific composites like `MetricCard`, `ProgressRing`, `WorkspaceProfileCard`, etc. inherit from `GlassCard` and follow the same slot-based composition rules).*
