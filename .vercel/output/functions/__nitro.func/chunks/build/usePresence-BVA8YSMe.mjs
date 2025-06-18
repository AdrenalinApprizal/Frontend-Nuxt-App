import { p as pinia_prodExports, v as vueExports, a as useNuxtApp } from './server.mjs';

const PRESENCE_PATH = "/presence";
const usePresenceStore = pinia_prodExports.defineStore("presence", () => {
  const userStatuses = vueExports.ref(/* @__PURE__ */ new Map());
  const currentStatus = vueExports.ref("online");
  const isLoading = vueExports.ref(false);
  const error = vueExports.ref(null);
  const deviceId = vueExports.ref("");
  const wsConnection = vueExports.ref(null);
  const isWsConnected = vueExports.ref(false);
  const isActive = vueExports.ref(true);
  const nuxtApp = useNuxtApp();
  const { $api } = nuxtApp;
  function ensureDeviceId() {
    if (!deviceId.value) {
      const userAgent = "unknown";
      deviceId.value = `web-${userAgent.substring(0, 10).replace(/[^a-zA-Z0-9]/g, "")}-${Date.now()}`;
    }
    return deviceId.value;
  }
  async function validateToken(token) {
    isLoading.value = true;
    error.value = null;
    try {
      console.log(`[Presence] Validating token directly with presence service`);
      const response = await $api.get(
        `${PRESENCE_PATH}/debug/token?token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: "include"
        }
      );
      return response;
    } catch (err) {
      error.value = err.message || "Failed to validate token";
      console.error("[Presence] Error validating token:", err);
      return {
        error: true,
        message: err.message || "Failed to validate token",
        status: err.status || 500,
        statusText: err.statusText || "Internal Server Error"
      };
    } finally {
      isLoading.value = false;
    }
  }
  async function updateStatusPut(status) {
    isLoading.value = true;
    error.value = null;
    try {
      const device = ensureDeviceId();
      const requestBody = {
        device_id: device,
        status
      };
      console.log(
        `[Presence] Setting initial status to ${status} with device ID ${device}`
      );
      console.log(`[Presence] Request URL: ${PRESENCE_PATH}/status`);
      console.log(`[Presence] Request body:`, requestBody);
      const response = await $api.post(`${PRESENCE_PATH}/status`, requestBody, {
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (!(response == null ? void 0 : response.error)) {
        currentStatus.value = status;
      }
      return response;
    } catch (err) {
      const errorMsg = err.message || "Failed to update status";
      error.value = errorMsg;
      console.error("[Presence] Error updating initial status:", err);
      return {
        error: true,
        message: errorMsg,
        status: err.status || 500,
        statusText: err.statusText || "Internal Server Error"
      };
    } finally {
      isLoading.value = false;
    }
  }
  async function updateStatusPost(status) {
    isLoading.value = true;
    error.value = null;
    try {
      const device = ensureDeviceId();
      const requestBody = {
        device_id: device,
        status
      };
      console.log(
        `[Presence] Updating subsequent status to ${status} with device ID ${device}`
      );
      console.log(`[Presence] Request URL: ${PRESENCE_PATH}/status`);
      console.log(`[Presence] Request body:`, requestBody);
      const response = await $api.post(`${PRESENCE_PATH}/status`, requestBody, {
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      console.log(`[Presence] Status update response:`, response);
      if (!(response == null ? void 0 : response.error)) {
        currentStatus.value = status;
      } else {
        console.warn(`[Presence] Status update failed:`, response.error);
      }
      return response;
    } catch (err) {
      const errorMsg = err.message || "Failed to update status";
      error.value = errorMsg;
      console.error("[Presence] Error updating status:", err);
      return {
        error: true,
        message: errorMsg,
        status: err.status || 500,
        statusText: err.statusText || "Internal Server Error"
      };
    } finally {
      isLoading.value = false;
    }
  }
  async function getUsersStatus(userIds) {
    isLoading.value = true;
    error.value = null;
    try {
      if (!userIds || userIds.length === 0) {
        console.log(`[Presence] No user IDs provided, skipping request`);
        return { data: [] };
      }
      console.log(
        `[Presence] Getting status for ${userIds.length} users: ${userIds.join(
          ", "
        )}`
      );
      const baseRequestUrl = `${PRESENCE_PATH}/users`;
      let requestUrl;
      let response;
      if (userIds.length > 1) {
        const idsString = userIds.map((id) => encodeURIComponent(id)).join(",");
        console.log(
          `[Presence] Multiple user IDs (${userIds.length}), encoded as: ${idsString}`
        );
        requestUrl = `${baseRequestUrl}?user_ids=${idsString}`;
      } else {
        const params = new URLSearchParams();
        params.append("user_ids", userIds[0]);
        requestUrl = `${baseRequestUrl}?${params.toString()}`;
      }
      console.log(`[Presence] Final request URL: ${requestUrl}`);
      response = await $api.get(requestUrl, {
        credentials: "include"
      });
      console.log(
        `[Presence] Got status response for ${userIds.length} users:`,
        response
      );
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((presence) => {
          userStatuses.value.set(presence.user_id, presence);
        });
      }
      return response;
    } catch (err) {
      const errorMsg = err.message || "Failed to get users status";
      error.value = errorMsg;
      console.error("[Presence] Error getting users status:", err);
      console.error("[Presence] Error context:", {
        userIds,
        endpoint: PRESENCE_PATH,
        apiInstance: !!$api
      });
      return {
        error: true,
        message: errorMsg,
        status: err.status || 500,
        statusText: err.statusText || "Internal Server Error"
      };
    } finally {
      isLoading.value = false;
    }
  }
  async function getUserStatus(userId) {
    isLoading.value = true;
    error.value = null;
    try {
      console.log(`[Presence] Getting status for user: ${userId}`);
      console.log(`[Presence] Request URL: ${PRESENCE_PATH}/${userId}`);
      const response = await $api.get(`${PRESENCE_PATH}/${userId}`);
      if (response.data) {
        userStatuses.value.set(userId, response.data);
      }
      return response;
    } catch (err) {
      const errorMsg = err.message || "Failed to get user status";
      error.value = errorMsg;
      console.error(`[Presence] Error getting status for user ${userId}:`, err);
      return {
        error: true,
        message: errorMsg,
        status: err.status || 500,
        statusText: err.statusText || "Internal Server Error"
      };
    } finally {
      isLoading.value = false;
    }
  }
  async function connectWebSocket(token, maxRetries = 3) {
    var _a;
    if (((_a = wsConnection.value) == null ? void 0 : _a.readyState) === WebSocket.OPEN) {
      console.log("[Presence] WebSocket already connected");
      return;
    }
    let retries = 0;
    const connect = () => {
      try {
        console.log("[Presence] Attempting WebSocket connection...");
        const wsUrl = `ws://localhost:8085/api/presence/ws?token=${token}`;
        console.log("[Presence] Using direct WebSocket URL:", wsUrl);
        console.log("[Presence] Attempting WebSocket connection to:", wsUrl);
        const ws = new WebSocket(wsUrl);
        ws.onopen = () => {
          console.log("[Presence] WebSocket connected successfully");
          isWsConnected.value = true;
          isActive.value = true;
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
          if (retries < maxRetries) {
            retries++;
            console.log(
              `[Presence] Attempting reconnect ${retries}/${maxRetries}...`
            );
            setTimeout(connect, 2e3 * retries);
          } else {
            console.log(
              "[Presence] Max reconnection attempts reached - giving up"
            );
            isActive.value = false;
          }
        };
        ws.onerror = (event) => {
          console.error("[Presence] WebSocket error:", event);
          error.value = "Failed to connect to presence service";
        };
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
          } catch (err) {
            console.error("[Presence] Error handling WebSocket message:", err);
          }
        };
      } catch (err) {
        console.error("[Presence] Error creating WebSocket connection:", err);
        if (retries < maxRetries) {
          retries++;
          setTimeout(connect, 2e3 * retries);
        }
      }
    };
    connect();
  }
  function handleWebSocketMessage(data) {
    if (data.type === "status_update") {
      updateUserStatus(data.user_id, data.status, data.last_active);
    } else if (data.type === "presence_sync") {
      data.statuses.forEach((status) => {
        updateUserStatus(status.user_id, status.status, status.last_active);
      });
    }
  }
  function updateUserStatus(userId, status, lastActive) {
    userStatuses.value.set(userId, {
      user_id: userId,
      status,
      last_active: lastActive
    });
  }
  function disconnectWebSocket() {
    if (wsConnection.value) {
      wsConnection.value.close();
      wsConnection.value = null;
    }
    isWsConnected.value = false;
    isActive.value = false;
  }
  function getStatus(userId) {
    var _a;
    return ((_a = userStatuses.value.get(userId)) == null ? void 0 : _a.status) || "offline";
  }
  function getLastActive(userId) {
    var _a;
    return ((_a = userStatuses.value.get(userId)) == null ? void 0 : _a.last_active) || null;
  }
  function setInitialStatus(status = "online") {
    return updateStatusPut(status);
  }
  function updateStatus(status) {
    return updateStatusPost(status);
  }
  function checkActive() {
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
    isActive,
    // Export the isActive state
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
    checkActive
  };
});
function usePresence() {
  return usePresenceStore();
}

export { usePresence as u };
//# sourceMappingURL=usePresence-BVA8YSMe.mjs.map
