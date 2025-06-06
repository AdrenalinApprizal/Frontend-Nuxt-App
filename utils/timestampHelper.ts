/**
 * Centralized timestamp utilities for consistent formatting across the application
 */

export interface TimestampOptions {
  timestamp?: string;
  raw_timestamp?: string | number;
  format?: 'full' | 'time' | 'date' | 'relative';
}

/**
 * Format a message timestamp for display in chat messages
 */
export function formatMessageTimestamp(options: TimestampOptions): string {
  const { timestamp, raw_timestamp, format = 'relative' } = options;
  
  try {
    // Use raw_timestamp if available, otherwise use timestamp
    const timestampToUse = raw_timestamp || timestamp;
    if (!timestampToUse) {
      return 'Unknown time';
    }

    const date = extractValidDate(timestampToUse);
    if (!date) {
      return String(timestampToUse); // Return original if parsing fails
    }

    const now = new Date();
    const messageDate = new Date(date);
    const diffInMs = now.getTime() - messageDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    switch (format) {
      case 'full':
        return messageDate.toLocaleString();
      
      case 'time':
        return messageDate.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      
      case 'date':
        return messageDate.toLocaleDateString();
      
      case 'relative':
      default:
        // Return relative time for recent messages
        if (diffInMinutes < 1) {
          return 'Just now';
        } else if (diffInMinutes < 60) {
          return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
          return `${diffInHours}h ago`;
        } else if (diffInDays < 7) {
          return `${diffInDays}d ago`;
        } else {
          return messageDate.toLocaleDateString();
        }
    }
  } catch (error) {
    console.warn('Error formatting timestamp:', error);
    return String(raw_timestamp || timestamp || 'Unknown time'); // Return original if formatting fails
  }
}

/**
 * Format a time string from a timestamp
 */
export function formatTimeString(timestamp: string | number | Date): string {
  try {
    const date = extractValidDate(timestamp);
    if (!date) {
      return 'Unknown time';
    }

    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    console.warn('Error formatting time string:', error);
    return 'Unknown time';
  }
}

/**
 * Extract a valid Date object from various timestamp formats
 */
export function extractValidDate(timestamp: string | number | Date | { raw_timestamp?: string | number }): Date | null {
  try {
    if (!timestamp) {
      return null;
    }

    // Handle objects with raw_timestamp property
    if (typeof timestamp === 'object' && timestamp !== null && !(timestamp instanceof Date)) {
      const objTimestamp = timestamp as { raw_timestamp?: string | number };
      if (objTimestamp.raw_timestamp) {
        return extractValidDate(objTimestamp.raw_timestamp);
      }
      return null;
    }

    // Handle different input types
    if (timestamp instanceof Date) {
      return isNaN(timestamp.getTime()) ? null : timestamp;
    }

    if (typeof timestamp === 'number') {
      // Handle both seconds and milliseconds timestamps
      const date = timestamp > 1e10 ? new Date(timestamp) : new Date(timestamp * 1000);
      return isNaN(date.getTime()) ? null : date;
    }

    if (typeof timestamp === 'string') {
      // Try parsing as ISO string or other common formats
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? null : date;
    }

    return null;
  } catch (error) {
    console.warn('Error extracting date from timestamp:', error);
    return null;
  }
}

/**
 * Format a date for use in message separators (e.g., "Today", "Yesterday", "March 15")
 */
export function formatDateForSeparator(timestamp: string | number | Date): string {
  try {
    const date = extractValidDate(timestamp);
    if (!date) {
      return 'Unknown Date';
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffInMs = today.getTime() - messageDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else if (diffInDays < 365) {
      return date.toLocaleDateString([], { 
        month: 'long', 
        day: 'numeric' 
      });
    } else {
      return date.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  } catch (error) {
    console.warn('Error formatting date for separator:', error);
    return 'Unknown Date';
  }
}

/**
 * Check if two timestamps are on the same day
 */
export function isSameDay(timestamp1: string | number | Date, timestamp2: string | number | Date): boolean {
  try {
    const date1 = extractValidDate(timestamp1);
    const date2 = extractValidDate(timestamp2);
    
    if (!date1 || !date2) {
      return false;
    }

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  } catch (error) {
    console.warn('Error comparing dates:', error);
    return false;
  }
}

/**
 * Get a human-readable time difference string
 */
export function getTimeDifference(timestamp: string | number | Date): string {
  try {
    const date = extractValidDate(timestamp);
    if (!date) {
      return 'Unknown time';
    }

    return formatMessageTimestamp({ timestamp: date.toISOString(), format: 'relative' });
  } catch (error) {
    console.warn('Error getting time difference:', error);
    return 'Unknown time';
  }
}
