/**
 * Date utilities plugin for Nuxt
 * Ensures date formatting functions are available without external dependencies
 */

export default defineNuxtPlugin(() => {
  // Global date formatting utilities that don't depend on external packages
  const dateUtils = {
    formatDistanceToNow: (
      date: Date | string,
      options?: { addSuffix?: boolean }
    ): string => {
      try {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        const now = new Date();
        const diffMs = now.getTime() - dateObj.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        const suffix = options?.addSuffix ? " ago" : "";

        if (diffSec < 60)
          return `${diffSec} second${diffSec !== 1 ? "s" : ""}${suffix}`;
        if (diffMin < 60)
          return `${diffMin} minute${diffMin !== 1 ? "s" : ""}${suffix}`;
        if (diffHour < 24)
          return `${diffHour} hour${diffHour !== 1 ? "s" : ""}${suffix}`;
        if (diffDay < 7)
          return `${diffDay} day${diffDay !== 1 ? "s" : ""}${suffix}`;

        return dateObj.toLocaleDateString() + suffix;
      } catch (error) {
        console.error("Date formatting error:", error);
        return "Recently";
      }
    },

    format: (date: Date | string, formatStr: string): string => {
      try {
        const dateObj = typeof date === "string" ? new Date(date) : date;

        switch (formatStr) {
          case "h:mm a":
            return dateObj.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
          case "MMM d":
            return dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          case "yyyy-MM-dd":
            return dateObj.toISOString().split("T")[0];
          case "MM/dd/yyyy":
            return dateObj.toLocaleDateString("en-US");
          default:
            return dateObj.toLocaleString();
        }
      } catch (error) {
        console.error("Date formatting error:", error);
        return new Date(date).toLocaleDateString();
      }
    },

    isToday: (date: Date | string): boolean => {
      try {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        const today = new Date();
        return dateObj.toDateString() === today.toDateString();
      } catch {
        return false;
      }
    },

    isThisWeek: (date: Date | string): boolean => {
      try {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        const now = new Date();
        const daysDiff = Math.floor(
          (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysDiff >= 0 && daysDiff < 7;
      } catch {
        return false;
      }
    },
  };

  // Make utilities available globally
  return {
    provide: {
      dateUtils,
    },
  };
});
