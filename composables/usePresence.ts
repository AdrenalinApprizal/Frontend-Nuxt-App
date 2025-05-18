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
}

// Define update status request
interface StatusUpdateRequest {
  device_id: string;
  status: PresenceStatus;
}

// Path for presence service API
const PRESENCE_PATH = "/presence";

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
      const response = await $api.get(
        `${PRESENCE_PATH}/debug/token?token=${token}`
      );
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to validate token";
      console.error("Error validating token:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Update user's online/offline status (PUT method)
   */
  async function updateStatusPut(status: PresenceStatus): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Ensure device ID is generated
      const device = ensureDeviceId();

      const data: StatusUpdateRequest = {
        device_id: device,
        status: status,
      };

      const response = await $api.put(`${PRESENCE_PATH}/status`, data);

      // Update current status
      currentStatus.value = status;

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to update status";
      console.error("Error updating status:", err);
      throw err;
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

      const data: StatusUpdateRequest = {
        device_id: device,
        status: status,
      };

      const response = await $api.post(`${PRESENCE_PATH}/status`, data);

      // Update current status
      currentStatus.value = status;

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to update status";
      console.error("Error updating status:", err);
      throw err;
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

      const response = await $api.get(
        `${PRESENCE_PATH}/users?user_ids=${userIdsParam}`
      );

      // Update local cache of user statuses
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((presence: UserPresence) => {
          userStatuses.value.set(presence.user_id, presence);
        });
      }

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to get users status";
      console.error("Error getting users status:", err);
      throw err;
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
      const response = await $api.get(`${PRESENCE_PATH}/${userId}`);

      // Update local cache with the user's status
      if (response.data) {
        userStatuses.value.set(userId, response.data);
      }

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to get user status";
      console.error(`Error getting status for user ${userId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Establish WebSocket connection for real-time presence updates
   */
  function connectWebSocket(token?: string): void {
    // Close existing connection if any
    if (wsConnection.value) {
      wsConnection.value.close();
    }

    isWsConnected.value = false;

    try {
      // Get the base WebSocket URL
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host;
      let wsUrl = `${protocol}//${host}/api/proxy${PRESENCE_PATH}/ws`;

      // Add token if provided
      if (token) {
        wsUrl += `?token=${token}`;
      }

      wsConnection.value = new WebSocket(wsUrl);

      // Setup event handlers
      wsConnection.value.onopen = () => {
        console.log("[Presence WebSocket] Connected");
        isWsConnected.value = true;
      };

      wsConnection.value.onclose = () => {
        console.log("[Presence WebSocket] Disconnected");
        isWsConnected.value = false;
      };

      wsConnection.value.onerror = (err) => {
        console.error("[Presence WebSocket] Error:", err);
        error.value = "WebSocket connection error";
        isWsConnected.value = false;
      };

      wsConnection.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Handle different message types
          if (data.type === "status_update" && data.user_id && data.status) {
            // Update user status in our local cache
            userStatuses.value.set(data.user_id, {
              user_id: data.user_id,
              status: data.status,
              last_active: data.timestamp || new Date().toISOString(),
            });

            console.log(
              `[Presence WebSocket] User ${data.user_id} is now ${data.status}`
            );
          }
        } catch (err) {
          console.error("[Presence WebSocket] Failed to parse message:", err);
        }
      };
    } catch (err) {
      console.error("[Presence WebSocket] Setup error:", err);
      error.value = "Failed to setup WebSocket connection";
    }
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
    // Use the PUT method to update status when setting initial status
    return updateStatusPut(status);
  }

  /**
   * Update status when user's activity changes
   */
  function updateStatus(status: PresenceStatus): Promise<ApiResponse> {
    // Use the POST method for subsequent updates
    return updateStatusPost(status);
  }

  return {
    // State
    currentStatus,
    userStatuses,
    isLoading,
    error,
    deviceId,
    isWsConnected,

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
  };
});

// Export the store as a composable
export function usePresence() {
  return usePresenceStore();
}
