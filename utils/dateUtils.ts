/**
 * Date utilities wrapper that provides reliable date formatting without external dependencies
 * This is a production-safe fallback that doesn't rely on date-fns loading correctly
 */

/**
 * Format distance to now without external dependencies
 */
export const safeFormatDistanceToNow = (date: Date | string, options?: { addSuffix?: boolean }): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    const suffix = options?.addSuffix ? ' ago' : '';
    
    if (diffSec < 60) return `${diffSec} second${diffSec !== 1 ? 's' : ''}${suffix}`;
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''}${suffix}`;
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''}${suffix}`;
    if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''}${suffix}`;
    
    return dateObj.toLocaleDateString() + suffix;
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Recently';
  }
};

/**
 * Format date without external dependencies
 */
export const safeFormat = (date: Date | string, formatStr: string): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    switch (formatStr) {
      case 'h:mm a':
        return dateObj.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
      case 'MMM d':
        return dateObj.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      case 'yyyy-MM-dd':
        return dateObj.toISOString().split('T')[0];
      case 'MM/dd/yyyy':
        return dateObj.toLocaleDateString('en-US');
      default:
        return dateObj.toLocaleString();
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    return new Date(date).toLocaleDateString();
  }
};

/**
 * Simple timestamp formatter that doesn't require external dependencies
 */
export const simpleFormatTimestamp = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if it's today
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      // Check if it's this week
      const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff < 7) {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
    }
  } catch (error) {
    console.error('Simple date formatting error:', error);
    return 'Recently';
  }
};
