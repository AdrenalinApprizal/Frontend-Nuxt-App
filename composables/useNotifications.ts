import { ref } from "vue";
import { useNuxtApp } from "#app";
import { useAuthStore } from "~/composables/useAuth";

// Define types (enhanced to match React implementation)
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  content: string;
  related_to?: string;
  read: boolean;
  created_at: string;
  data?: Record<string, any>;
  title?: string;
  message?: string;
  action_url?: string;
  category?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  metadata?: Record<string, any>;
}

export interface NotificationPagination {
  current_page: number;
  total_pages: number;
  total_count: number;
  items_per_page: number;
  has_more_pages: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: NotificationPagination;
  success?: boolean;
  message?: string;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  total_count: number;
  page: number;
  limit: number;
  success?: boolean;
}

export interface UnreadCountResponse {
  count: number;
  success?: boolean;
}

export interface NotificationFilters {
  type?: string;
  read?: boolean;
  priority?: string;
  category?: string;
  date_from?: string;
  date_to?: string;
}

export interface NotificationOptions {
  filters?: NotificationFilters;
  sort?: "created_at" | "updated_at" | "priority";
  order?: "asc" | "desc";
}

export const useNotifications = () => {
  // State (enhanced to match React)
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const loading = ref<boolean>(false); // Alias for React compatibility
  const error = ref<string | null>(null);
  const pagination = ref<NotificationPagination>({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    items_per_page: 10,
    has_more_pages: false,
  });

  // Get Nuxt app instance
  const nuxtApp = useNuxtApp();
  const authStore = useAuthStore();

  // API endpoint - ensure it ends without a trailing slash
  const API_ENDPOINT = "/api/proxy/notifications";

  // Helper function for API calls (matching React implementation)
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const defaultOptions: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      };

      // Add authorization header if session has access_token
      if (authStore.token) {
        defaultOptions.headers = {
          ...defaultOptions.headers,
          Authorization: `Bearer ${authStore.token}`,
        };
      }

      // Merge default options with provided options
      const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
        },
      };

      // Fix path construction - ensure we don't get double slashes
      let url;
      if (endpoint.startsWith("http")) {
        url = endpoint;
      } else {
        // Handle endpoint paths correctly, ensuring proper slash handling
        const endpointPath = endpoint.startsWith("/")
          ? endpoint.slice(1)
          : endpoint;
        url = `${API_ENDPOINT}/${endpointPath}`.replace(/\/+/g, "/");
      }

      console.log(`[Notification API] Calling: ${url}`);

      const response = await fetch(url, mergedOptions);

      // Handle different response formats
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage: string;

        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage =
              errorData.message ||
              `Error ${response.status}: ${response.statusText}`;
          } else {
            const errorText = await response.text();
            errorMessage =
              errorText || `Error ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return await response.json();
      }

      return await response.text();
    } catch (err: any) {
      console.error(`API call failed for ${endpoint}:`, err);
      throw err;
    }
  };

  /**
   * Get notifications with pagination (enhanced to match React implementation)
   */
  const getNotifications = async (
    page: number = 1,
    limit: number = 20
  ): Promise<NotificationResponse> => {
    isLoading.value = true;
    loading.value = true; // Update both for compatibility
    error.value = null;

    try {
      const offset = (page - 1) * limit;
      const data = await apiCall(`?offset=${offset}&limit=${limit}`, {
        method: "GET",
      });

      console.log("[DEBUG] Response data from notifications API:", data);

      // Handle different response formats
      let notificationsData: Notification[] = [];
      let paginationData: NotificationPagination = {
        current_page: page,
        total_pages: 1,
        total_count: 0,
        items_per_page: limit,
        has_more_pages: false,
      };

      if (data && Array.isArray(data)) {
        // Handle case where API returns an array directly
        notificationsData = data.map((notification: any) => ({
          ...notification,
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

        paginationData = {
          current_page: page,
          total_pages: data.length > 0 ? Math.ceil(data.length / limit) : 1,
          total_count: data.length,
          items_per_page: limit,
          has_more_pages: data.length >= limit,
        };
      }
      // Handle case where API returns object with notifications array
      else if (data && (data.notifications || data.data || data.results)) {
        const notificationsArray =
          data.notifications || data.data || data.results || [];

        notificationsData = notificationsArray.map((notification: any) => ({
          ...notification,
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
          paginationData = data.pagination;
        } else if (data.meta) {
          paginationData = {
            current_page: data.meta.current_page || data.meta.page || page,
            total_pages: data.meta.total_pages || data.meta.pageCount || 1,
            total_count:
              data.meta.total_count ||
              data.meta.totalCount ||
              notificationsArray.length,
            items_per_page:
              data.meta.per_page || data.meta.itemsPerPage || limit,
            has_more_pages:
              data.meta.has_more_pages || data.meta.hasNextPage || false,
          };
        } else {
          // Default pagination
          paginationData = {
            current_page: page,
            total_pages:
              notificationsArray.length > 0
                ? Math.ceil(notificationsArray.length / limit)
                : 1,
            total_count: notificationsArray.length,
            items_per_page: limit,
            has_more_pages: notificationsArray.length >= limit,
          };
        }
      }

      // Update state
      notifications.value = notificationsData;
      pagination.value = paginationData;

      return {
        notifications: notificationsData,
        pagination: paginationData,
      };
    } catch (err: any) {
      error.value = `Failed to get notifications: ${err.message}`;
      console.error("Error fetching notifications:", err);
      throw err;
    } finally {
      isLoading.value = false;
      loading.value = false; // Update both for compatibility
    }
  };

  /**
   * Load more notifications (for pagination) - Enhanced to match React
   */
  const loadMoreNotifications =
    async (): Promise<NotificationResponse | null> => {
      if (!pagination.value.has_more_pages) {
        return null;
      }

      try {
        const nextPage = pagination.value.current_page + 1;
        const response = await getNotifications(
          nextPage,
          pagination.value.items_per_page
        );

        // Append new notifications to existing ones (React pattern)
        if (response && response.notifications) {
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
   * Get unread notifications count (Enhanced to match React)
   */
  const getUnreadCount = async (): Promise<UnreadCountResponse> => {
    // Don't set isLoading to true for unread count to prevent UI flicker
    error.value = null;

    try {
      console.log("[Notifications] Fetching unread count...");
      const response = await apiCall("/unread-count", {
        method: "GET",
      });

      console.log("[DEBUG] Unread count response:", response);

      // Handle various response formats (matching React implementation)
      if (response && typeof response.count === "number") {
        unreadCount.value = response.count;
        return response;
      } else if (response && typeof response === "object") {
        // Try to find a count property with a different name
        const possibleCountProps = ["count", "unread_count", "total", "unread"];
        for (const prop of possibleCountProps) {
          if (typeof response[prop] === "number") {
            console.log(`[Notifications] Found count in property: ${prop}`);
            const count = response[prop];
            unreadCount.value = count;
            return { count };
          }
        }

        console.warn(
          "[Notifications] Invalid unread count response:",
          response
        );
        // Keep the previous value if response is invalid
        return { count: unreadCount.value };
      } else if (typeof response === "number") {
        // Handle case where API returns just the number
        unreadCount.value = response;
        return { count: response };
      } else {
        console.warn("[Notifications] Unexpected response format:", response);
        return { count: unreadCount.value };
      }
    } catch (err: any) {
      // For errors fetching unread count, we'll use 0 as default but still record the error
      error.value = `Failed to get unread notification count: ${err.message}`;
      console.error("[Notifications] Error fetching unread count:", err);

      // Return a valid response with count 0 to prevent UI errors
      return { count: 0 };
    }
  };

  /**
   * Mark a notification as read (Enhanced to match React)
   */
  const markAsRead = async (notificationId: string): Promise<any> => {
    if (!notificationId) {
      console.error("Invalid notification ID provided");
      throw new Error("Invalid notification ID");
    }

    isLoading.value = true;
    loading.value = true;
    error.value = null;

    try {
      const response = await apiCall(`/${notificationId}/read`, {
        method: "PUT",
        body: JSON.stringify({}),
      });

      // Update local state (React pattern)
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

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to mark notification as read";
      console.error("Error marking notification as read:", err);
      throw err;
    } finally {
      isLoading.value = false;
      loading.value = false;
    }
  };

  /**
   * Mark all notifications as read (Enhanced to match React)
   */
  const markAllAsRead = async (): Promise<any> => {
    isLoading.value = true;
    loading.value = true;
    error.value = null;

    try {
      const response = await apiCall("/read-all", {
        method: "PUT",
        body: JSON.stringify({}),
      });

      // Update local state (React pattern)
      notifications.value = notifications.value.map(
        (notification: Notification) => ({
          ...notification,
          read: true,
        })
      );

      // Reset unread count
      unreadCount.value = 0;

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to mark all notifications as read";
      console.error("Error marking all notifications as read:", err);
      throw err;
    } finally {
      isLoading.value = false;
      loading.value = false;
    }
  };

  /**
   * Check the notification service health (New from React implementation)
   */
  const checkHealth = async () => {
    isLoading.value = true;
    loading.value = true;
    error.value = null;

    try {
      const response = await apiCall("/health", {
        method: "GET",
      });

      return response;
    } catch (err: any) {
      error.value = `Failed to check notification service health: ${err.message}`;
      console.error("Error checking notification service health:", err);
      throw err;
    } finally {
      isLoading.value = false;
      loading.value = false;
    }
  };

  return {
    // State (matching React implementation)
    notifications,
    unreadCount,
    isLoading,
    loading, // Alias for React compatibility
    error,
    pagination,

    // Actions (matching React implementation)
    getNotifications,
    loadMoreNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    checkHealth,
  };
};
