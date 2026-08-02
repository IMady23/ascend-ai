export function vibrate(pattern: number | number[] = 10) {
  if (typeof window !== "undefined" && navigator && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore vibration errors
    }
  }
}
