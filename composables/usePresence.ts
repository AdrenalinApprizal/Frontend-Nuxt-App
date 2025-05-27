import { defineStore } from "pinia";
import { ref } from "vue";
import { useNuxtApp } from "#app";

// Define user presence status type
type PresenceStatus = "online" | "offline" | "busy" | "away";

// Define UserPresence interface
interface UserPresence {
  user_id: string;
  status: PresenceStatus;
  last_active: string; // ISO date string
}

// Define API response interface
interface ApiResponse {
  message?: string;
  data?: any;
  status?: number;
  statusText?: string;
  error?: boolean;
}

// Define update status request
interface StatusUpdateRequest {
  device_id: string;
  status: PresenceStatus;
}

// Define WebSocket message types
interface WebSocketStatusUpdate {
  type: "status_update";
  user_id: string;
  status: PresenceStatus;
  last_active: string;
}

interface WebSocketPresenceSync {
  type: "presence_sync";
  statuses: UserPresence[];
}

type WebSocketMessage = WebSocketStatusUpdate | WebSocketPresenceSync;

// Path for presence service API - using proxy to avoid CORS issues
const PRESENCE_PATH = "/presence"; // Remove /api/proxy prefix as it's handled by $api

// Define the store
export const usePresenceStore = defineStore("presence", () => {
  // State
  const userStatuses = ref<Map<string, UserPresence>>(new Map());
  const currentStatus = ref<PresenceStatus>("online");
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const deviceId = ref<string>("");
  const wsConnection = ref<WebSocket | null>(null);
  const isWsConnected = ref(false);
  const isActive = ref(true); // Add missing isActive state variable

  // Get Nuxt app instance for access to API
  const nuxtApp = useNuxtApp();
  const { $api } = nuxtApp;

  // Generate a device ID if not already set
  function ensureDeviceId() {
    if (!deviceId.value) {
      // Generate a simple device ID based on browser/user agent and current time
      const userAgent =
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown";
      deviceId.value = `web-${userAgent
        .substring(0, 10)
        .replace(/[^a-zA-Z0-9]/g, "")}-${Date.now()}`;
    }
    return deviceId.value;
  }

  /**
   * Validate a JWT token (debug purposes only)
   */
  async function validateToken(token: string): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      console.log(`[Presence] Validating token directly with presence service`);
      const response = await $api.get(
        `${PRESENCE_PATH}/debug/token?token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to validate token";
      console.error("[Presence] Error validating token:", err);
      return {
        error: true,
        message: err.message || "Failed to validate token",
        status: err.status || 500,
        statusText: err.statusText || "Internal Server Error",
      };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Update user's online/offline status (POST method for initial status)
   */
  async function updateStatusPut(status: PresenceStatus): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Ensure device ID is generated
      const device = ensureDeviceId();

      const requestBody: StatusUpdateRequest = {
        device_id: device,
        status: status,
      };

      // Debug logging for request details
      console.log(
        `[Presence] Setting initial status to ${status} with device ID ${device}`
      );
      console.log(`[Presence] Request URL: ${PRESENCE_PATH}/status`);
      console.log(`[Presence] Request body:`, requestBody);

      // Using POST for initial status update with detailed logging
      const response = await $api.post(`${PRESENCE_PATH}/status`, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // Only update current status if the request was successful
      if (!response?.error) {
        currentStatus.value = status;
      }

      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to update status";
      error.value = errorMsg;
      console.error("[Presence] Error updating initial status:", err);
      return {
        error: true,
        message: errorMsg,
        status: err.status || 500,
        statusText: err.statusText || "Internal Server Error",
      };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Update user's online/offline status (POST method)
   */
  async function updateStatusPost(
    status: PresenceStatus
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Ensure device ID is generated
      const device = ensureDeviceId();

      const requestBody: StatusUpdateRequest = {
        device_id: device,
        status: status,
      };

      // Debug logging for request details
      console.log(
        `[Presence] Updating subsequent status to ${status} with device ID ${device}`
      );
      console.log(`[Presence] Request URL: ${PRESENCE_PATH}/status`);
      console.log(`[Presence] Request body:`, requestBody);

      // Make the API call with detailed options
      const response = await $api.post(`${PRESENCE_PATH}/status`, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // Log response and update local state only on success
      console.log(`[Presence] Status update response:`, response);

      if (!response?.error) {
        currentStatus.value = status;
      } else {
        console.warn(`[Presence] Status update failed:`, response.error);
      }

      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to update status";
      error.value = errorMsg;
      console.error("[Presence] Error updating status:", err);
      return {
        error: true,
        message: errorMsg,
        status: err.status || 500,
        statusText: err.statusText || "Internal Server Error",
      };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get user presence status for multiple users
   */
  async function getUsersStatus(userIds: string[]): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Convert array to comma-separated string
      const userIdsParam = userIds.join(",");

      console.log(`[Presence] Getting status for users: ${userIdsParam}`);
      console.log(
        `[Presence] Request URL: ${PRESENCE_PATH}/users?user_ids=${userIdsParam}`
      );

      const response = await $api.get(
        `${PRESENCE_PATH}/users?user_ids=${userIdsParam}`,
        {
          credentials: "include",
        }
      );

      // Update local cache of user statuses
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((presence: UserPresence) => {
          userStatuses.value.set(presence.user_id, presence);
        });
      }

      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to get users status";
      error.value = errorMsg;
      console.error("[Presence] Error getting users status:", err);
      return {
        error: true,
        message: errorMsg,
        status: err.status || 500,
        statusText: err.statusText || "Internal Server Error",
      };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get presence status for a specific user
   */
  async function getUserStatus(userId: string): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      console.log(`[Presence] Getting status for user: ${userId}`);
      console.log(`[Presence] Request URL: ${PRESENCE_PATH}/${userId}`);

      const response = await $api.get(`${PRESENCE_PATH}/${userId}`);

      // Update local cache with the user's status
      if (response.data) {
        userStatuses.value.set(userId, response.data);
      }

      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to get user status";
      error.value = errorMsg;
      console.error(`[Presence] Error getting status for user ${userId}:`, err);
      return {
        error: true,
        message: errorMsg,
        status: err.status || 500,
        statusText: err.statusText || "Internal Server Error",
      };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Establish WebSocket connection for real-time presence updates
   */
  // Connect to WebSocket with retry logic
  async function connectWebSocket(
    token: string,
    maxRetries = 3
  ): Promise<void> {
    if (wsConnection.value?.readyState === WebSocket.OPEN) {
      console.log("[Presence] WebSocket already connected");
      return;
    }

    let retries = 0;
    const connect = (): void => {
      try {
        console.log("[Presence] Attempting WebSocket connection...");
        // Use the proxy path for WebSocket connection
        // If we're in development mode, try both localhost and the dynamic hostname
        let wsUrl;

        // Determine if we're running in development mode
        const isDev =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";

        if (isDev) {
          // In development, try to use the same hostname as the current page
          const protocol =
            window.location.protocol === "https:" ? "wss:" : "ws:";
          const host = window.location.host; // This includes hostname:port
          wsUrl = `${protocol}//${host}/api/proxy/presence/ws?token=${token}`;
          console.log("[Presence] Using proxied WebSocket URL:", wsUrl);
        } else {
          wsUrl = `ws://localhost:8085/presence/ws?token=${token}`;
          console.log("[Presence] Using direct WebSocket URL:", wsUrl);
        }

        // Log presence connection attempt
        console.log("[Presence] Attempting WebSocket connection to:", wsUrl);

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log("[Presence] WebSocket connected successfully");
          isWsConnected.value = true;
          isActive.value = true; // Set presence as active when connection is established
          wsConnection.value = ws;
        };

        ws.onclose = (event) => {
          console.log(
            "[Presence] WebSocket connection closed:",
            event.code,
            event.reason
          );
          isWsConnected.value = false;
          wsConnection.value = null;

          // Attempt to reconnect if not max retries
          if (retries < maxRetries) {
            retries++;
            console.log(
              `[Presence] Attempting reconnect ${retries}/${maxRetries}...`
            );
            setTimeout(connect, 2000 * retries); // Exponential backoff
          } else {
            console.log(
              "[Presence] Max reconnection attempts reached - giving up"
            );
            // Set presence as inactive but don't block the app functionality
            isActive.value = false;
          }
        };

        ws.onerror = (event) => {
          console.error("[Presence] WebSocket error:", event);
          error.value = "Failed to connect to presence service";
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as WebSocketMessage;
            handleWebSocketMessage(data);
          } catch (err) {
            console.error("[Presence] Error handling WebSocket message:", err);
          }
        };
      } catch (err) {
        console.error("[Presence] Error creating WebSocket connection:", err);
        if (retries < maxRetries) {
          retries++;
          setTimeout(connect, 2000 * retries);
        }
      }
    };

    connect();
  }

  // Handle incoming WebSocket messages
  function handleWebSocketMessage(data: WebSocketMessage): void {
    if (data.type === "status_update") {
      updateUserStatus(data.user_id, data.status, data.last_active);
    } else if (data.type === "presence_sync") {
      data.statuses.forEach((status) => {
        updateUserStatus(status.user_id, status.status, status.last_active);
      });
    }
  }

  // Update a user's status in the local state
  function updateUserStatus(
    userId: string,
    status: PresenceStatus,
    lastActive: string
  ): void {
    userStatuses.value.set(userId, {
      user_id: userId,
      status,
      last_active: lastActive,
    });
  }

  /**
   * Disconnect WebSocket
   */
  function disconnectWebSocket(): void {
    if (wsConnection.value) {
      wsConnection.value.close();
      wsConnection.value = null;
    }
    isWsConnected.value = false;
    isActive.value = false; // Set as inactive when disconnected
  }

  /**
   * Helper function to get a user's status from the store
   */
  function getStatus(userId: string): PresenceStatus {
    return userStatuses.value.get(userId)?.status || "offline";
  }

  /**
   * Helper function to get a user's last active time from the store
   */
  function getLastActive(userId: string): string | null {
    return userStatuses.value.get(userId)?.last_active || null;
  }

  /**
   * Set initial status when app loads
   */
  function setInitialStatus(
    status: PresenceStatus = "online"
  ): Promise<ApiResponse> {
    // Use the updateStatusPut function which now uses POST internally
    return updateStatusPut(status);
  }

  /**
   * Update status when user's activity changes
   */
  function updateStatus(status: PresenceStatus): Promise<ApiResponse> {
    // Use the POST method for subsequent updates
    return updateStatusPost(status);
  }

  /**
   * Check if presence service is active and functioning
   */
  function checkActive(): boolean {
    return isActive.value && isWsConnected.value;
  }

  return {
    // State
    currentStatus,
    userStatuses,
    isLoading,
    error,
    deviceId,
    isWsConnected,
    isActive, // Export the isActive state

    // Methods
    validateToken,
    updateStatusPut,
    updateStatusPost,
    getUsersStatus,
    getUserStatus,
    connectWebSocket,
    disconnectWebSocket,
    getStatus,
    getLastActive,
    setInitialStatus,
    updateStatus,
    checkActive,
  };
});

// Export the store as a composable
export function usePresence() {
  return usePresenceStore();
}
