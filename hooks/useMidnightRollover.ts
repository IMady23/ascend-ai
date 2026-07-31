import { useEffect } from "react";
import { ResetEngine } from "@/lib/automation/ResetEngine";
import { useUserStore } from "@/stores/user.store";

export function useMidnightRollover() {
  const isInitialized = useUserStore((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) return;

    let timeoutId: NodeJS.Timeout;

    const scheduleNextMidnight = () => {
      const userStore = useUserStore.getState();
      const timezone = userStore.profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      
      const now = new Date();
      // Calculate the current time in the user's timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      });

      const parts = formatter.formatToParts(now);
      const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
      
      const localYear = getPart('year');
      const localMonth = getPart('month') - 1; // 0-indexed
      const localDay = getPart('day');
      const localHour = getPart('hour');
      const localMinute = getPart('minute');
      const localSecond = getPart('second');

      // Create a Date object for the current local time
      const currentLocalTime = new Date(localYear, localMonth, localDay, localHour, localMinute, localSecond);
      
      // Calculate next midnight in local time
      const nextMidnightLocal = new Date(localYear, localMonth, localDay + 1, 0, 0, 0);
      
      // The time until next midnight in milliseconds
      let msUntilMidnight = nextMidnightLocal.getTime() - currentLocalTime.getTime();
      
      // Safety bound: if negative or zero, schedule for 1 minute just to be safe
      if (msUntilMidnight <= 0) {
        msUntilMidnight = 60000;
      }

      timeoutId = setTimeout(() => {
        // Run the reset
        ResetEngine.checkAndReset().catch(console.error);
        
        // Schedule the next one
        scheduleNextMidnight();
      }, msUntilMidnight);
    };

    // Run a check immediately on mount just in case we crossed midnight while offline/suspended
    ResetEngine.checkAndReset().catch(console.error);
    
    // Start the cycle
    scheduleNextMidnight();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isInitialized]);
}
