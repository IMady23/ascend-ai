import { useEffect, useRef, useCallback, RefObject } from "react";

interface ScrollIntoViewOptions {
  /** Only scrolls if the element is outside the viewport. Default: true */
  onlyIfNeeded?: boolean;
  /** Scroll alignment. Default: "nearest" */
  alignment?: "start" | "center" | "end" | "nearest";
  /** Extra offset in px to account for sticky headers / safe-area bars. Default: 0 */
  offset?: number;
  /** If true, focus the first focusable input inside the element after scrolling. Default: false */
  focusFirstInput?: boolean;
  /** Delay in ms before focusing (allows scroll animation to settle). Default: 350 */
  focusDelay?: number;
}

/**
 * useScrollIntoViewIfNeeded
 *
 * Scrolls a referenced element into view only when it is partially or
 * completely outside the visible viewport. Supports configurable alignment,
 * safe-area offsets, and optional post-scroll input focusing.
 *
 * Do NOT use `focusFirstInput: true` on bottom-sheet forms on mobile —
 * it triggers the keyboard immediately which causes layout shifts.
 * Reserve it for search fields or explicit text-entry contexts only.
 */
export function useScrollIntoViewIfNeeded<T extends HTMLElement = HTMLDivElement>(
  active: boolean,
  options: ScrollIntoViewOptions = {}
): RefObject<T | null> {
  const {
    onlyIfNeeded = true,
    alignment = "nearest",
    offset = 0,
    focusFirstInput = false,
    focusDelay = 350,
  } = options;

  const ref = useRef<T>(null);

  const scroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    if (onlyIfNeeded) {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isAboveViewport = rect.top < offset;
      const isBelowViewport = rect.bottom > viewportHeight - offset;

      if (!isAboveViewport && !isBelowViewport) {
        // Element is fully visible — no scroll needed
        return;
      }
    }

    // Map alignment to scrollIntoViewOptions block value
    const blockMap: Record<string, ScrollLogicalPosition> = {
      start: "start",
      center: "center",
      end: "end",
      nearest: "nearest",
    };

    el.scrollIntoView({
      behavior: "smooth",
      block: blockMap[alignment] ?? "nearest",
      inline: "nearest",
    });

    // If offset is set and alignment is 'start', nudge the scroll position
    // to account for sticky headers / safe areas
    if (offset > 0 && (alignment === "start" || alignment === "nearest")) {
      setTimeout(() => {
        window.scrollBy({ top: -offset, behavior: "smooth" });
      }, 100);
    }

    // Optionally focus first logical input — only for search/explicit text-entry
    if (focusFirstInput) {
      setTimeout(() => {
        const input = el.querySelector<HTMLElement>(
          'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), [role="textbox"]'
        );
        input?.focus({ preventScroll: true });
      }, focusDelay);
    }
  }, [onlyIfNeeded, alignment, offset, focusFirstInput, focusDelay]);

  useEffect(() => {
    if (active) {
      // Small delay to let the DOM mount before measuring
      const timer = setTimeout(scroll, 50);
      return () => clearTimeout(timer);
    }
  }, [active, scroll]);

  return ref;
}
