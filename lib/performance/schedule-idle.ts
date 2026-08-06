/** Run work when the browser is idle — keeps first paint fast. */
export function scheduleIdleWork(callback: () => void, timeoutMs = 3000): () => void {
  if (typeof window === "undefined") {
    callback();
    return () => {};
  }

  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: timeoutMs });
    return () => window.cancelIdleCallback(id);
  }

  const id = window.setTimeout(callback, 250);
  return () => window.clearTimeout(id);
}
