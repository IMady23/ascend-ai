# Data Visualization: Charts

Ascend AI is a data-heavy application. Charts must quickly and clearly communicate progress, trends, and history without overwhelming the user with visual noise.

## Why these rules?

Generic charts often feature heavy grid lines, bright conflicting colors, and massive legends that distract from the actual data. Our charts follow the principles of Edward Tufte: maximize the data-to-ink ratio. If a pixel isn't communicating data, delete it.

---

## 1. Chart Types & Usage

| Type | Purpose | Module Example |
| :--- | :--- | :--- |
| **Line Chart** | Continuous trends over time. | Weight history, daily step trends. |
| **Area Chart** | Volume accumulation over time. | Total workout volume, cumulative calories. |
| **Bar Chart** | Discrete comparisons (days of week). | Daily protein intake, steps per day. |
| **Progress Ring** | Percentage to a fixed goal. | Daily score, macro targets. |

---

## 2. Visual Rules

### Grid & Axes
- **No vertical grid lines**. They clutter the X-axis.
- **Horizontal grid lines**: Must be extremely faint (`Border` color, `opacity-30`, dashed or dotted).
- **Axis Labels**: Must use `Secondary Text` (`#94A3B8`) at `text-xs`. 
- **Zero Line**: The baseline (Y=0) should be a solid 1px line using `Border` (`#334155`).

### Data Lines (The "Ink")
- **Thickness**: 2px or 3px stroke for line charts to ensure visibility against the dark background.
- **Color**: Line charts must use the current Module's Accent Color (e.g., Orange for Reports, Purple for Workouts).
- **Dots/Nodes**: Hide data points by default. Only show the node (`radius-full` filled with the Accent color) when the user hovers over that specific X-axis intersection.

### Comparison Charts
When comparing two metrics (e.g., This Week vs. Last Week):
- **Primary Metric**: Current Module Accent color, solid line.
- **Secondary (Historical) Metric**: `Disabled` color (`#64748B`), dashed line, lower opacity.
- *Why?* This immediately tells the user which data is "now" and which is "then" without requiring them to study a legend.

---

## 3. Interactive Elements

### Tooltips
- Must snap to the nearest data point on hover.
- **Design**: A small `Glass Card` (`SurfaceElevated`, `blur-md`, `shadow-md`) with a strict pointer (arrow) indicating the exact node.
- **Typography**: Tabular numerals. The primary value must be `text-base font-semibold Primary Text`. The date/label must be `text-xs Secondary Text`.

### Insight Overlays
If the AI detects an anomaly (e.g., "Highest volume day!"), we render a small `Glass Card` floating directly on the chart, connected by a faint vertical dashed line to the peak node.

---

## 4. Animation

- **On Load**: Charts should "draw" themselves. Lines grow from left to right (`duration-slow ease-ui`). Bars rise from the baseline.
- **On Update**: If the data changes (e.g., filtering from Weekly to Monthly), the lines must morph smoothly into the new shape, not snap instantly.

---

## 5. Accessibility

- **Color Reliance**: Never rely purely on color to differentiate two lines. Use patterns (solid vs. dashed).
- **Screen Readers**: Every chart component (`<svg>` or `<canvas>`) must have an `aria-label` describing the overall trend (e.g., "Bar chart showing daily steps for this week, averaging 8,000 steps per day"). Data must also be accessible via a hidden HTML table for screen readers.
