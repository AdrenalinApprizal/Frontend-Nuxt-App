import { ref } from "vue";
import { useNuxtApp } from "#app";
import { useAuthStore } from "~/composables/useAuth";

// Define types
export interface Notification {
  id: string;
  content: string;
  read: boolean;
  created_at: string;
  type: string;
  data?: Record<string, any>;
}

export interface NotificationPagination {
  current_page: number;
  total_pages: number;
  items_per_page: number;
  has_more_pages: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: NotificationPagination;
}

export interface UnreadCountResponse {
  count: number;
}

export const useNotifications = () => {
  // State
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const pagination = ref<NotificationPagination>({
    current_page: 1,
    total_pages: 1,
    items_per_page: 10,
    has_more_pages: false,
  });

  // Get Nuxt app instance
  const nuxtApp = useNuxtApp();
  const authStore = useAuthStore();

  // API endpoint
  const API_ENDPOINT = "/api/proxy/notifications";

  // Helper to get headers with auth token
  const getHeaders = () => {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (authStore.token) {
      // Use Bearer prefix by default for notifications (standard OAuth format)
      headers["Authorization"] = `Bearer ${authStore.token}`;
    }

    return headers;
  };

  // Helper to try multiple token formats
  const fetchWithTokenFormats = async (url: string, options: RequestInit) => {
    // Try with Bearer prefix first (standard OAuth format)
    try {
      // Only add Authorization header if token exists
      const headers = { ...(options.headers as Record<string, string>) };

      if (authStore.token) {
        headers.Authorization = `Bearer ${authStore.token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.ok) {
        console.log(
          "[DEBUG] Notification API request successful with 'Bearer' prefix"
        );
        return response;
      }

      console.log(
        `[DEBUG] Request failed with 'Bearer' prefix: ${response.status}`
      );
    } catch (error) {
      console.error("[DEBUG] Error with 'Bearer' prefix:", error);
    }

    // Then try with Token prefix as fallback
    try {
      const headers = { ...(options.headers as Record<string, string>) };

      if (authStore.token) {
        headers.Authorization = `Token ${authStore.token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.ok) {
        console.log(
          "[DEBUG] Notification API request successful with 'Token' prefix"
        );
        return response;
      }

      console.log(
        `[DEBUG] Request failed with 'Token' prefix: ${response.status}`
      );
    } catch (error) {
      console.error("[DEBUG] Error with 'Token' prefix:", error);
    }

    // Finally try with no prefix
    try {
      const headers = { ...(options.headers as Record<string, string>) };

      if (authStore.token) {
        headers.Authorization = authStore.token;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.ok) {
        console.log(
          "[DEBUG] Notification API request successful with no prefix"
        );
        return response;
      }

      console.log(`[DEBUG] Request failed with no prefix: ${response.status}`);
      return response; // Return the last response even if it failed
    } catch (error) {
      console.error("[DEBUG] Error with no prefix:", error);
      throw error; // Re-throw if all attempts failed
    }
  };

  /**
   * Fetch notifications with pagination
   */
  const getNotifications = async (
    offset = 0,
    limit = 20
  ): Promise<NotificationResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      // Using our helper function that tries multiple token formats
      const response = await fetchWithTokenFormats(
        `${API_ENDPOINT}?offset=${offset}&limit=${limit}`,
        {
          method: "GET",
          headers: getHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        // Handle error responses - could be JSON or text
        let errorMessage: string;
        const contentType = response.headers.get("content-type");

        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage =
              errorData.message ||
              `Error ${response.status}: ${response.statusText}`;
          } else {
            // Handle plain text error response
            const errorText = await response.text();
            errorMessage =
              errorText || `Error ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        error.value = errorMessage;
        console.error(`Error fetching notifications: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("[DEBUG] Response data from notifications API:", data);

      // More flexible response format handling
      if (data && Array.isArray(data)) {
        // Handle case where API returns an array directly
        notifications.value = data.map((notification: any) => ({
          ...notification,
          // Ensure required properties exist
          id: notification.id || notification._id || `temp-${Date.now()}`,
          content:
            notification.content || notification.message || "New notification",
          read: notification.read || false,
          created_at:
            notification.created_at ||
            notification.createdAt ||
            new Date().toISOString(),
          type: notification.type || "default",
        }));

        // Simple pagination if not provided
        pagination.value = {
          current_page: offset / limit + 1,
          total_pages: data.length > 0 ? Math.ceil(data.length / limit) : 1,
          items_per_page: limit,
          has_more_pages: data.length >= limit,
        };

        return {
          notifications: notifications.value,
          pagination: pagination.value,
        };
      }
      // Handle case where API returns object with notifications array
      else if (data && (data.notifications || data.data || data.results)) {
        const notificationsArray =
          data.notifications || data.data || data.results || [];

        notifications.value = notificationsArray.map((notification: any) => ({
          ...notification,
          // Ensure required properties exist
          id: notification.id || notification._id || `temp-${Date.now()}`,
          content:
            notification.content || notification.message || "New notification",
          read: notification.read || false,
          created_at:
            notification.created_at ||
            notification.createdAt ||
            new Date().toISOString(),
          type: notification.type || "default",
        }));

        // Use pagination if provided, or create default
        if (data.pagination) {
          pagination.value = data.pagination;
        } else if (data.meta) {
          pagination.value = {
            current_page:
              data.meta.current_page || data.meta.page || offset / limit + 1,
            total_pages: data.meta.total_pages || data.meta.pageCount || 1,
            items_per_page:
              data.meta.per_page || data.meta.itemsPerPage || limit,
            has_more_pages:
              data.meta.has_more_pages || data.meta.hasNextPage || false,
          };
        } else {
          // Default pagination
          pagination.value = {
            current_page: offset / limit + 1,
            total_pages:
              notificationsArray.length > 0
                ? Math.ceil(notificationsArray.length / limit)
                : 1,
            items_per_page: limit,
            has_more_pages: notificationsArray.length >= limit,
          };
        }

        return {
          notifications: notifications.value,
          pagination: pagination.value,
        };
      }
      // Handle empty response or other formats
      else {
        console.log("API returned empty or unexpected response format:", data);
        // Instead of throwing, just set empty notifications
        notifications.value = [];
        pagination.value = {
          current_page: offset / limit + 1,
          total_pages: 1,
          items_per_page: limit,
          has_more_pages: false,
        };

        return {
          notifications: [],
          pagination: pagination.value,
        };
      }
    } catch (err: any) {
      error.value = err.message || "Failed to fetch notifications";
      console.error("Error fetching notifications:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Load more notifications (for pagination)
   */
  const loadMoreNotifications =
    async (): Promise<NotificationResponse | null> => {
      if (!pagination.value.has_more_pages) {
        return null;
      }

      // Calculate new offset based on current items and limit
      const currentOffset =
        pagination.value.current_page * pagination.value.items_per_page;
      const limit = pagination.value.items_per_page;

      try {
        const response = await getNotifications(currentOffset, limit);

        // Append new notifications to the existing list
        if (response && response.notifications) {
          // Use previous notifications and add new ones
          notifications.value = [
            ...notifications.value,
            ...response.notifications,
          ];
        }

        return response;
      } catch (err) {
        console.error("Error loading more notifications:", err);
        throw err;
      }
    };

  /**
   * Get unread notifications count
   */
  const getUnreadCount = async (): Promise<UnreadCountResponse> => {
    // Don't set isLoading to true for unread count to prevent UI flicker
    error.value = null;

    try {
      const response = await fetchWithTokenFormats(
        `${API_ENDPOINT}/unread-count`,
        {
          method: "GET",
          headers: getHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        // Handle error responses - could be JSON or text
        let errorMessage: string;
        const contentType = response.headers.get("content-type");

        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage =
              errorData.message ||
              `Error ${response.status}: ${response.statusText}`;
          } else {
            // Handle plain text error response
            const errorText = await response.text();
            errorMessage =
              errorText || `Error ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        // For 401 errors, we'll still return a valid response with count 0
        // to prevent UI errors but log the issue
        if (response.status === 401) {
          console.warn(
            "Authentication error when fetching notification count. Using count 0."
          );
          return { count: 0 };
        }

        error.value = errorMessage;
        console.error(`Error fetching unread count: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data && typeof data.count === "number") {
        unreadCount.value = data.count;
      } else {
        console.warn("Invalid unread count response:", data);
        // Keep the previous value if response is invalid
      }

      return data;
    } catch (err: any) {
      // For errors fetching unread count, we'll use 0 as default
      // but still record the error
      error.value = err.message || "Failed to fetch unread count";
      console.error("Error fetching unread count:", err);

      // Return a valid response with count 0 to prevent UI errors
      return { count: 0 };
    }
  };

  /**
   * Mark a notification as read
   */
  const markAsRead = async (notificationId: string): Promise<any> => {
    if (!notificationId) {
      console.error("Invalid notification ID provided");
      throw new Error("Invalid notification ID");
    }

    try {
      const response = await fetchWithTokenFormats(
        `${API_ENDPOINT}/${notificationId}/read`,
        {
          method: "PATCH",
          headers: getHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Error marking notification as read: ${response.status} ${response.statusText}`,
          errorText
        );
        throw new Error(
          `Failed to mark notification as read: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Update local state
      notifications.value = notifications.value.map(
        (notification: Notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
      );

      // Update unread count
      if (unreadCount.value > 0) {
        unreadCount.value -= 1;
      }

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to mark notification as read";
      console.error("Error marking notification as read:", err);
      throw err;
    }
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async (): Promise<any> => {
    try {
      const response = await fetchWithTokenFormats(`${API_ENDPOINT}/read-all`, {
        method: "PUT",
        headers: getHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Error marking all notifications as read: ${response.status} ${response.statusText}`,
          errorText
        );
        throw new Error(
          `Failed to mark all notifications as read: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Update local state
      notifications.value = notifications.value.map(
        (notification: Notification) => ({
          ...notification,
          read: true,
        })
      );

      // Reset unread count
      unreadCount.value = 0;

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to mark all notifications as read";
      console.error("Error marking all notifications as read:", err);
      throw err;
    }
  };

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,
    pagination,

    // Actions
    getNotifications,
    loadMoreNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
  };
};
