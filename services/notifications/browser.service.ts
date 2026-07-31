export class BrowserNotificationService {
  private static permissionDeniedPermanently = false;

  static async requestPermission(): Promise<boolean> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false; // Not supported
    }

    if (this.permissionDeniedPermanently) {
      return false; // Fail silently, don't ask again
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      this.permissionDeniedPermanently = true;
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        this.permissionDeniedPermanently = true;
        return false;
      }
      return permission === "granted";
    } catch (e) {
      console.error("Failed to request notification permission:", e);
      return false;
    }
  }

  static async showNotification(title: string, options?: NotificationOptions): Promise<boolean> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return false; // Fail silently to in-app

    try {
      // If service worker is supported and ready, use it to show notification
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration) {
          await registration.showNotification(title, {
            ...options,
            icon: "/apple-touch-icon.png",
            badge: "/apple-touch-icon.png"
          });
          return true;
        }
      }

      // Fallback to standard Notification API
      const notification = new Notification(title, {
        ...options,
        icon: "/apple-touch-icon.png",
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return true;
    } catch (e) {
      console.error("Failed to show browser notification:", e);
      return false;
    }
  }
}
