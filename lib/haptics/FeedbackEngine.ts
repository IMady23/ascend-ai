// lib/haptics/FeedbackEngine.ts
export class FeedbackEngine {
  static supported() {
    return typeof window !== 'undefined' && 'vibrate' in navigator;
  }

  static lightTap() {
    if (this.supported()) {
      navigator.vibrate(10);
    }
  }

  static successImpact() {
    if (this.supported()) {
      navigator.vibrate([10, 50, 20]);
    }
  }

  static heavyImpact() {
    if (this.supported()) {
      navigator.vibrate(40);
    }
  }

  static celebrationPulse() {
    if (this.supported()) {
      navigator.vibrate([30, 40, 30, 40, 50]);
    }
  }
}
