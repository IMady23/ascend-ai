"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * WheelSelector — A scrollable drum-roll picker for numeric or discrete values
 *
 * Used for:
 * - Date of birth (day, month, year)
 * - Height
 * - Weight
 * - Sleep hours
 * - Workout days per week
 *
 * Example usage:
 * ```tsx
 * <WheelSelector
 *   items={Array.from({ length: 100 }, (_, i) => ({ value: i + 1, label: `${i + 1} kg` }))}
 *   selected={weight}
 *   onSelect={setWeight}
 *   visibleCount={5}
 * />
 * ```
 */

export interface WheelItem {
  value: string | number;
  label: string;
}

export interface WheelSelectorProps {
  items: WheelItem[];
  selected: string | number;
  onSelect: (value: string | number) => void;
  /** How many items are visible at once (must be odd for center alignment) */
  visibleCount?: 3 | 5 | 7;
  /** Height of each item in pixels */
  itemHeight?: number;
  /** Accent color for the selected item */
  accentColor?: string;
  className?: string;
  "aria-label"?: string;
}

export function WheelSelector({
  items,
  selected,
  onSelect,
  visibleCount = 5,
  itemHeight = 44,
  accentColor = "var(--color-accent-blue)",
  className,
  "aria-label": ariaLabel,
}: WheelSelectorProps) {
  const containerHeight = visibleCount * itemHeight;
  const centerOffset = Math.floor(visibleCount / 2) * itemHeight;

  const selectedIndex = items.findIndex((item) => item.value === selected);
  const currentIndex = selectedIndex === -1 ? 0 : selectedIndex;

  const y = useMotionValue(-currentIndex * itemHeight + centerOffset);
  const isDragging = React.useRef(false);

  // Snap to selected index whenever `selected` prop changes externally
  React.useEffect(() => {
    const targetY = -currentIndex * itemHeight + centerOffset;
    animate(y, targetY, { type: "spring", stiffness: 300, damping: 30 });
  }, [currentIndex, itemHeight, centerOffset, y]);

  const snapToIndex = React.useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
      const targetY = -clampedIndex * itemHeight + centerOffset;
      animate(y, targetY, { type: "spring", stiffness: 300, damping: 30 });
      onSelect(items[clampedIndex].value);
    },
    [items, itemHeight, centerOffset, y, onSelect]
  );

  const handleDragEnd = () => {
    const currentY = y.get();
    const rawIndex = (-currentY + centerOffset) / itemHeight;
    const snappedIndex = Math.round(rawIndex);
    snapToIndex(snappedIndex);
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? 1 : -1;
    const currentY = y.get();
    const rawIndex = (-currentY + centerOffset) / itemHeight;
    snapToIndex(Math.round(rawIndex) + delta);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden select-none",
        className
      )}
      style={{ height: containerHeight, touchAction: 'none' }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      role="listbox"
      aria-label={ariaLabel}
    >
      {/* Top fade */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10"
        style={{
          height: centerOffset,
          background: `linear-gradient(to bottom, var(--color-bg-surface), transparent)`,
        }}
      />

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: centerOffset,
          background: `linear-gradient(to top, var(--color-bg-surface), transparent)`,
        }}
      />

      {/* Selection highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 rounded-lg border border-[var(--highlight-accent)]/20"
        style={{
          top: centerOffset,
          height: itemHeight,
          background: `color-mix(in srgb, ${accentColor} 8%, transparent)`,
          "--highlight-accent": accentColor,
        } as React.CSSProperties}
      />

      {/* Draggable list */}
      <motion.div
        drag="y"
        dragMomentum={false}
        style={{ y }}
        onDragEnd={handleDragEnd}
        onDragStart={() => { isDragging.current = true; }}
        dragConstraints={{
          top: -((items.length - 1) * itemHeight) + centerOffset,
          bottom: centerOffset,
        }}
        className="absolute inset-x-0"
      >
        {items.map((item, index) => {
          const isSelected = item.value === selected;
          return (
            <div
              key={item.value}
              role="option"
              aria-selected={isSelected}
              style={{ height: itemHeight }}
              className={cn(
                "flex items-center justify-center text-sm font-medium transition-colors cursor-pointer",
                isSelected
                  ? "text-[var(--color-text-primary)] font-semibold"
                  : "text-[var(--color-text-disabled)]"
              )}
              onClick={() => !isDragging.current && snapToIndex(index)}
            >
              {item.label}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WheelSelectorGroup — side-by-side wheels (e.g., height: ft + in)
// ─────────────────────────────────────────────────────────────────────────────

export interface WheelColumn {
  items: WheelItem[];
  selected: string | number;
  onSelect: (value: string | number) => void;
  label?: string;
  "aria-label"?: string;
}

export interface WheelSelectorGroupProps {
  columns: WheelColumn[];
  visibleCount?: 3 | 5 | 7;
  itemHeight?: number;
  accentColor?: string;
  className?: string;
}

export function WheelSelectorGroup({
  columns,
  visibleCount = 5,
  itemHeight = 44,
  accentColor = "var(--color-accent-blue)",
  className,
}: WheelSelectorGroupProps) {
  return (
    <div
      className={cn(
        "flex items-end gap-1 bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] p-3",
        className
      )}
    >
      {columns.map((col, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          {col.label && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-disabled)] mb-1">
              {col.label}
            </span>
          )}
          <WheelSelector
            items={col.items}
            selected={col.selected}
            onSelect={col.onSelect}
            visibleCount={visibleCount}
            itemHeight={itemHeight}
            accentColor={accentColor}
            aria-label={col["aria-label"]}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
}
