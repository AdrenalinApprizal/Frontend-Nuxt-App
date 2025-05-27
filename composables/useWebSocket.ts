import { ref, onUnmounted, computed } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "./useAuth";
import { useMessagesStore } from "./useMessages";
import { eventBus } from "./useEventBus";
import { useNuxtApp, useRouter } from "#app";

// Message types that can be sent/received via WebSocket
export enum WebSocketMessageType {
  MESSAGE = "message",
  TYPING = "typing",
  STOP_TYPING = "stop_typing", // Add missing STOP_TYPING enum value
  STATUS = "status",
  READ = "read",
  UNREAD_COUNT = "unread_count", // Add new type for unread message count
  MESSAGE_REACTION = "message_reaction", // Support for message reactions
  ERROR = "error",
}

// Message interfaces
export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: any;
}

export interface NewMessageData {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  type: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  media_url?: string;
  sender?: {
    id: string;
    name: string;
    profile_picture_url?: string;
  };
}

export interface UserStatusData {
  user_id: string;
  status: "online" | "offline";
  last_seen?: string;
}

export interface TypingData {
  user_id: string;
  recipient_id: string;
  is_typing: boolean;
}

export const useWebSocket = defineStore("websocket", () => {
  // State variables for Messages WebSocket
  const socketMessages = ref<WebSocket | null>(null);
  const isMessagesConnected = ref(false);
  const isMessagesConnecting = ref(false);

  // State variables for Presence WebSocket
  const socketPresence = ref<WebSocket | null>(null);
  const isPresenceConnected = ref(false);
  const isPresenceConnecting = ref(false);

  // Enhanced connection state management
  const reconnectAttempts = ref(0);
  const maxReconnectAttempts = 8; // Increased for better resilience
  const baseReconnectInterval = 1000; // Base interval for exponential backoff
  const maxReconnectInterval = 30000; // Maximum 30 seconds between attempts
  const connectionError = ref<string | null>(null);
  const messageQueue = ref<WebSocketMessage[]>([]);
  const activeSubscriptions = ref<string[]>([]);
  const authCheckInProgress = ref(false);

  // Heartbeat mechanism
  const heartbeatInterval = ref<NodeJS.Timeout | null>(null);
  const heartbeatPeriod = 30000; // 30 seconds
  const lastHeartbeatTime = ref<number>(0);
  const pendingPings = ref<Set<string>>(new Set());

  // Connection quality tracking
  const connectionQuality = ref<"excellent" | "good" | "poor" | "disconnected">(
    "disconnected"
  );
  const lastMessageTime = ref<number>(0);
  const networkChangeHandler = ref<(() => void) | null>(null);

  // Advanced message queuing
  const maxQueueSize = 50;
  const messageRetryCount = ref<Map<string, number>>(new Map());
  const maxRetries = 3;
  const router = useRouter();

  // Get auth and messages stores
  const authStore = useAuthStore();
  const messagesStore = useMessagesStore();

  // Get nuxt app instance for toast notifications
  const nuxtApp = useNuxtApp();
  const { $toast } = nuxtApp;

  // Configure WebSocket URLs
  const getMessagesWebSocketUrl = (): string => {
    // Connect directly to backend WebSocket server instead of using the proxy
    // Direct connection will preserve WebSocket headers properly
    const wsBaseUrl =
      process.env.NODE_ENV === "production"
        ? "wss://your-production-url.com" // Ganti dengan URL production yang sesuai
        : "ws://localhost:8082";

    // Ensure we have a valid token before connecting
    const token = authStore.token;
    if (!token) {
      throw new Error("No authentication token available");
    }

    // Connect directly to messages WebSocket endpoint
    return `${wsBaseUrl}/api/messages/ws?token=${token}`;
  };

  const getPresenceWebSocketUrl = (): string => {
    // Connect directly to backend WebSocket server instead of using the proxy
    // Direct connection will preserve WebSocket headers properly
    const wsBaseUrl =
      process.env.NODE_ENV === "production"
        ? "wss://your-production-url.com" // Ganti dengan URL production yang sesuai
        : "ws://localhost:8085";

    // Ensure we have a valid token before connecting
    const token = authStore.token;
    if (!token) {
      console.error("[WebSocket Presence] No authentication token available");
      throw new Error("No authentication token available");
    }

    // Connect directly to presence WebSocket endpoint
    return `${wsBaseUrl}/api/presence/ws?token=${token}`;
  };

  // Validate token before connecting
  const validateToken = async (): Promise<boolean> => {
    if (authCheckInProgress.value) return false;

    try {
      authCheckInProgress.value = true;

      // If no token or not authenticated, we need to refresh
      if (!authStore.token || !authStore.isAuthenticated) {
        console.log("[WebSocket] No valid token, attempting to refresh auth");

        try {
          // Try to get user info which will refresh token if needed
          await authStore.getUserInfo();
          return !!authStore.token;
        } catch (error) {
          console.error("[WebSocket] Failed to refresh authentication:", error);
          handleAuthFailure();
          return false;
        }
      }

      return true;
    } finally {
      authCheckInProgress.value = false;
    }
  };

  // Initialize WebSocket connections with enhanced setup
  const connect = async (): Promise<void> => {
    // Validate authentication before connecting
    if (!authStore.isAuthenticated) {
      console.warn("[WebSocket] Not authenticated, cannot connect");
      return;
    }

    // Validate token first
    const isTokenValid = await validateToken();
    if (!isTokenValid) {
      console.warn("[WebSocket] Invalid token, cannot connect");
      return;
    }

    // Setup network change detection
    setupNetworkChangeDetection();

    // Restore any persisted message queue
    restoreMessageQueue();

    // Connect both WebSockets
    await Promise.all([connectMessagesWebSocket(), connectPresenceWebSocket()]);
  };

  // Initialize Messages WebSocket connection
  const connectMessagesWebSocket = async (): Promise<void> => {
    // Don't try to connect if already connecting or connected
    if (isMessagesConnecting.value || isMessagesConnected.value) {
      return;
    }

    try {
      isMessagesConnecting.value = true;
      connectionError.value = null;

      const wsUrl = getMessagesWebSocketUrl();
      console.log(`[WebSocket Messages] Connecting to ${wsUrl}`);

      socketMessages.value = new WebSocket(wsUrl);

      // Set timeout to fail fast if connection hangs
      const timeoutId = setTimeout(() => {
        if (isMessagesConnecting.value && socketMessages.value) {
          console.warn("[WebSocket Messages] Connection timeout");
          socketMessages.value.close(4000, "Connection timeout");
          connectionError.value = "Connection timeout";
          isMessagesConnecting.value = false;
        }
      }, 10000); // 10 second timeout

      // Handle WebSocket events
      socketMessages.value.onopen = (event: Event) => {
        clearTimeout(timeoutId);
        handleMessagesOpen(event);
      };
      socketMessages.value.onmessage = handleMessagesMessage;
      socketMessages.value.onerror = handleMessagesError;
      socketMessages.value.onclose = handleMessagesClose;
    } catch (error: any) {
      console.error("[WebSocket Messages] Connection error:", error);
      connectionError.value =
        error.message || "Failed to connect to Messages WebSocket server";

      if (
        error.message?.includes("authentication") ||
        error.message?.includes("token") ||
        error.message?.includes("No authentication token available")
      ) {
        handleAuthFailure();
      } else {
        handleMessagesReconnect();
      }
    }
  };

  // Initialize Presence WebSocket connection
  const connectPresenceWebSocket = async (): Promise<void> => {
    // Don't try to connect if already connecting or connected
    if (isPresenceConnecting.value || isPresenceConnected.value) {
      return;
    }

    try {
      isPresenceConnecting.value = true;
      connectionError.value = null;

      const wsUrl = getPresenceWebSocketUrl();
      console.log(`[WebSocket Presence] Connecting to ${wsUrl}`);

      socketPresence.value = new WebSocket(wsUrl);

      // Set timeout to fail fast if connection hangs
      const timeoutId = setTimeout(() => {
        if (isPresenceConnecting.value && socketPresence.value) {
          console.warn("[WebSocket Presence] Connection timeout");
          socketPresence.value.close(4000, "Connection timeout");
          connectionError.value = "Connection timeout";
          isPresenceConnecting.value = false;
        }
      }, 10000); // 10 second timeout

      // Handle WebSocket events
      socketPresence.value.onopen = (event: Event) => {
        clearTimeout(timeoutId);
        handlePresenceOpen(event);
      };
      socketPresence.value.onmessage = handlePresenceMessage;
      socketPresence.value.onerror = handlePresenceError;
      socketPresence.value.onclose = handlePresenceClose;
    } catch (error: any) {
      console.error("[WebSocket Presence] Connection error:", error);
      connectionError.value =
        error.message || "Failed to connect to Presence WebSocket server";

      if (
        error.message?.includes("authentication") ||
        error.message?.includes("token") ||
        error.message?.includes("No authentication token available")
      ) {
        handleAuthFailure();
      } else {
        handlePresenceReconnect();
      }
    }
  };

  // Handle successful Messages connection with enhanced features
  const handleMessagesOpen = (event: Event): void => {
    console.log("[WebSocket Messages] Connection established");
    isMessagesConnected.value = true;
    isMessagesConnecting.value = false;
    reconnectAttempts.value = 0;
    lastHeartbeatTime.value = Date.now();
    lastMessageTime.value = Date.now();
    updateConnectionQuality("excellent");

    // Subscribe to unread counts on connection
    subscribeToUnreadCounts();

    // Start heartbeat mechanism
    startHeartbeat();

    // Process any queued messages
    processMessageQueue();

    if ($toast) {
      $toast.success("Connected to messaging service");
    }
  };

  // Handle successful Presence connection
  const handlePresenceOpen = (event: Event): void => {
    console.log("[WebSocket Presence] Connection established");
    isPresenceConnected.value = true;
    isPresenceConnecting.value = false;

    // Try to resubscribe to any previous channels
    if (activeSubscriptions.value.length > 0) {
      activeSubscriptions.value.forEach((channel) => {
        subscribeToChannel(channel);
      });
    }

    if ($toast) {
      $toast.success("Connected to presence service");
    }
  };

  // Subscribe to unread message counts
  const subscribeToUnreadCounts = (): void => {
    if (!isMessagesConnected.value || !socketMessages.value) return;

    const unreadSubscription = {
      action: "subscribe",
      channel: "unread_counts",
    };

    try {
      socketMessages.value.send(JSON.stringify(unreadSubscription));
      console.log("[WebSocket Messages] Subscribed to unread counts");
    } catch (error) {
      console.error(
        "[WebSocket Messages] Error subscribing to unread counts:",
        error
      );
    }
  };

  // Subscribe to a specific channel
  const subscribeToChannel = (channel: string): void => {
    if (!isPresenceConnected.value || !socketPresence.value) return;

    // Don't subscribe if already subscribed
    if (activeSubscriptions.value.includes(channel)) return;

    const subscription = {
      action: "subscribe",
      channel: channel,
    };

    try {
      socketPresence.value.send(JSON.stringify(subscription));
      console.log(`[WebSocket Presence] Subscribed to channel: ${channel}`);

      // Add to active subscriptions
      if (!activeSubscriptions.value.includes(channel)) {
        activeSubscriptions.value.push(channel);
      }
    } catch (error) {
      console.error(
        `[WebSocket Presence] Error subscribing to channel ${channel}:`,
        error
      );
    }
  };

  // Enhanced message handling with heartbeat support
  const handleMessagesMessage = (event: MessageEvent): void => {
    try {
      const message = JSON.parse(event.data) as WebSocketMessage;
      lastMessageTime.value = Date.now();

      // Update connection quality based on message activity
      assessConnectionQuality();

      // Handle heartbeat responses
      if ((message.type as any) === "pong" && message.data?.id) {
        const pingId = message.data.id;
        if (pendingPings.value.has(pingId)) {
          pendingPings.value.delete(pingId);
          lastHeartbeatTime.value = Date.now();

          // Calculate latency for quality assessment
          const latency = Date.now() - message.data.timestamp;
          if (latency < 100) {
            updateConnectionQuality("excellent");
          } else if (latency < 500) {
            updateConnectionQuality("good");
          } else {
            updateConnectionQuality("poor");
          }
        }
        return;
      }

      console.log("[WebSocket Messages] Received message:", message);

      // Process message based on its type
      switch (message.type) {
        case WebSocketMessageType.MESSAGE:
          handleNewMessage(message.data);
          break;

        case WebSocketMessageType.TYPING:
          handleTypingNotification(message.data);
          break;

        case WebSocketMessageType.UNREAD_COUNT:
          handleUnreadCount(message.data);
          break;

        case WebSocketMessageType.ERROR:
          console.error(
            "[WebSocket Messages] Error from server:",
            message.data
          );
          if ($toast) {
            $toast.error(message.data.message || "Error from messaging server");
          }
          break;

        default:
          console.log(
            "[WebSocket Messages] Unhandled message type:",
            message.type
          );
      }
    } catch (error) {
      console.error("[WebSocket Messages] Failed to parse message:", error);
      updateConnectionQuality("poor");
    }
  };

  // Handle incoming messages from Presence WebSocket
  const handlePresenceMessage = (event: MessageEvent): void => {
    try {
      const message = JSON.parse(event.data) as WebSocketMessage;
      console.log("[WebSocket Presence] Received message:", message);

      // Process message based on its type
      switch (message.type) {
        case WebSocketMessageType.STATUS:
          handleStatusChange(message.data);
          break;

        case WebSocketMessageType.ERROR:
          console.error(
            "[WebSocket Presence] Error from server:",
            message.data
          );
          if ($toast) {
            $toast.error(message.data.message || "Error from presence server");
          }
          break;

        default:
          console.log(
            "[WebSocket Presence] Unhandled message type:",
            message.type
          );
      }
    } catch (error) {
      console.error("[WebSocket Presence] Failed to parse message:", error);
    }
  };

  // Handle unread message count updates from WebSocket
  const handleUnreadCount = (data: any): void => {
    if (!data.unreadCounts) return;

    // Emit event with unread counts
    eventBus.emit("unread-counts-updated", data.unreadCounts);
  };

  // Handle typing notifications
  const handleTypingNotification = (data: TypingData): void => {
    console.log(
      `[WebSocket] User ${data.user_id} is ${
        data.is_typing ? "typing" : "not typing"
      } to ${data.recipient_id}`
    );

    // Emit event for components to react to typing status
    eventBus.emit("typing-status-changed", {
      userId: data.user_id,
      recipientId: data.recipient_id,
      isTyping: data.is_typing,
    });
  };

  // Handle user status changes
  const handleStatusChange = (data: UserStatusData): void => {
    console.log(
      `[WebSocket Presence] User ${data.user_id} status changed to ${data.status}`
    );

    // Emit event for components to update UI
    eventBus.emit("user-status-changed", {
      userId: data.user_id,
      status: data.status,
      lastSeen: data.last_seen,
    });
  };

  // Handle authentication failure
  const handleAuthFailure = async (): Promise<void> => {
    console.warn("[WebSocket] Authentication failure detected");

    // Clean up WebSocket resources
    disconnect();
    clear();

    // Attempt to refresh the token once
    try {
      await authStore.getUserInfo();

      // If successful, try to reconnect
      if (authStore.isAuthenticated && authStore.token) {
        console.log("[WebSocket] Authentication refreshed, reconnecting");
        setTimeout(() => connect(), 1000);
        return;
      }
    } catch (error) {
      console.error("[WebSocket] Failed to refresh authentication:", error);
    }

    // If we're here, authentication refresh failed
    // Call the auth error handler to clean up and redirect user
    if (authStore.handleAuthError) {
      authStore.handleAuthError();
    } else {
      // Fallback if handleAuthError is not available
      authStore.logout();

      // Optional: Redirect to login page
      if (process.client) {
        router.push("/auth/login");
      }

      if ($toast) {
        $toast.error("Authentication failed. Please log in again.");
      }
    }
  };

  // Enhanced error handling for Messages WebSocket
  const handleMessagesError = (event: Event): void => {
    console.error("[WebSocket Messages] Error:", event);
    connectionError.value = "WebSocket Messages connection error";
    isMessagesConnecting.value = false;
    updateConnectionQuality("poor");

    // Stop heartbeat on error
    stopHeartbeat();
  };

  // Enhanced error handling for Presence WebSocket
  const handlePresenceError = (event: Event): void => {
    console.error("[WebSocket Presence] Error:", event);
    connectionError.value = "WebSocket Presence connection error";
    isPresenceConnecting.value = false;
  };

  // Enhanced connection close handling for Messages WebSocket
  const handleMessagesClose = (event: CloseEvent): void => {
    console.log(
      `[WebSocket Messages] Connection closed. Code: ${event.code}, Reason: ${event.reason}`
    );
    isMessagesConnected.value = false;
    isMessagesConnecting.value = false;
    updateConnectionQuality("disconnected");

    // Stop heartbeat mechanism
    stopHeartbeat();

    // Check for authentication errors based on close code
    if (
      event.code === 1008 ||
      (event.code >= 4000 && event.code <= 4099) ||
      event.reason?.toLowerCase().includes("auth") ||
      event.reason?.toLowerCase().includes("token")
    ) {
      // Likely authentication issue
      handleAuthFailure();
    }
    // Attempt to reconnect for other issues (but not for clean closes)
    else if (event.code !== 1000 && event.code !== 1001) {
      handleMessagesReconnect();
    }
  };

  // Enhanced connection close handling for Presence WebSocket
  const handlePresenceClose = (event: CloseEvent): void => {
    console.log(
      `[WebSocket Presence] Connection closed. Code: ${event.code}, Reason: ${event.reason}`
    );
    isPresenceConnected.value = false;
    isPresenceConnecting.value = false;

    // Check for authentication errors based on close code
    if (
      event.code === 1008 ||
      (event.code >= 4000 && event.code <= 4099) ||
      event.reason?.toLowerCase().includes("auth") ||
      event.reason?.toLowerCase().includes("token")
    ) {
      // Likely authentication issue
      handleAuthFailure();
    }
    // Attempt to reconnect for other issues (but not for clean closes)
    else if (event.code !== 1000 && event.code !== 1001) {
      handlePresenceReconnect();
    }
  };

  // Enhanced reconnection for Messages WebSocket with exponential backoff
  const handleMessagesReconnect = (): void => {
    // Only attempt to reconnect if authenticated and not exceeding max attempts
    if (
      !authStore.isAuthenticated ||
      reconnectAttempts.value >= maxReconnectAttempts
    ) {
      if (reconnectAttempts.value >= maxReconnectAttempts) {
        console.log("[WebSocket Messages] Max reconnection attempts reached");
        connectionError.value = "Failed to connect after multiple attempts";
        updateConnectionQuality("disconnected");
        if ($toast) {
          $toast.error(
            "Failed to connect to messaging service. Please refresh the page."
          );
        }
      }
      return;
    }

    // Don't reconnect if already trying to connect
    if (isMessagesConnecting.value) {
      return;
    }

    const delay = getReconnectDelay(reconnectAttempts.value);
    reconnectAttempts.value++;

    console.log(
      `[WebSocket Messages] Reconnecting in ${Math.round(delay)}ms (attempt ${
        reconnectAttempts.value
      }/${maxReconnectAttempts})`
    );

    setTimeout(() => {
      // Check if we're still disconnected before attempting reconnect
      if (!isMessagesConnected.value && !isMessagesConnecting.value) {
        connectMessagesWebSocket();
      }
    }, delay);
  };

  // Enhanced reconnection for Presence WebSocket with exponential backoff
  const handlePresenceReconnect = (): void => {
    // Only attempt to reconnect if authenticated and not exceeding max attempts
    if (
      !authStore.isAuthenticated ||
      reconnectAttempts.value >= maxReconnectAttempts
    ) {
      if (reconnectAttempts.value >= maxReconnectAttempts) {
        console.log("[WebSocket Presence] Max reconnection attempts reached");
        connectionError.value = "Failed to connect after multiple attempts";
        if ($toast) {
          $toast.error(
            "Failed to connect to presence service. Please refresh the page."
          );
        }
      }
      return;
    }

    // Don't reconnect if already trying to connect
    if (isPresenceConnecting.value) {
      return;
    }

    const delay = getReconnectDelay(reconnectAttempts.value);
    reconnectAttempts.value++;

    console.log(
      `[WebSocket Presence] Reconnecting in ${Math.round(delay)}ms (attempt ${
        reconnectAttempts.value
      }/${maxReconnectAttempts})`
    );

    setTimeout(() => {
      // Check if we're still disconnected before attempting reconnect
      if (!isPresenceConnected.value && !isPresenceConnecting.value) {
        connectPresenceWebSocket();
      }
    }, delay);
  };

  // Enhanced message sending with intelligent queuing
  const send = (message: WebSocketMessage): void => {
    if (!isMessagesConnected.value || !socketMessages.value) {
      // Queue message for when connection is established
      console.log(
        "[WebSocket Messages] Connection not ready, queueing message"
      );
      addToQueue(message);

      // Try to connect if not already connecting
      if (!isMessagesConnecting.value && !isMessagesConnected.value) {
        connectMessagesWebSocket();
      }
      return;
    }

    try {
      socketMessages.value.send(JSON.stringify(message));
      console.log("[WebSocket Messages] Message sent successfully");
    } catch (error) {
      console.error("[WebSocket Messages] Failed to send message:", error);
      // Add to queue to retry later
      addToQueue(message);
      updateConnectionQuality("poor");
    }
  };

  // Process a new incoming message
  const handleNewMessage = (data: NewMessageData): void => {
    // Add the new message to the messages store
    if (messagesStore.messages) {
      // Check if message already exists to avoid duplicates
      const existingMessage = messagesStore.messages.find(
        (m) => m.id === data.id
      );
      if (!existingMessage) {
        messagesStore.messages.push(data);

        // Show notification for new messages if not from the current user
        if (data.sender_id !== authStore.user?.id && $toast) {
          $toast.info(`New message from ${data.sender?.name || "User"}`);
        }
      }
    }
  };

  // Process message read status update
  const handleMessageRead = (data: { message_ids: string[] }): void => {
    // Update read status for these messages
    if (messagesStore.messages && data.message_ids) {
      messagesStore.messages = messagesStore.messages.map((message) => {
        if (data.message_ids.includes(message.id)) {
          return { ...message, read: true };
        }
        return message;
      });
    }
  };

  // Send typing indicator
  const sendTypingStatus = (recipientId: string, isTyping: boolean): void => {
    if (!authStore.user) return;

    send({
      type: isTyping
        ? WebSocketMessageType.TYPING
        : WebSocketMessageType.STOP_TYPING,
      data: {
        user_id: authStore.user.id,
        recipient_id: recipientId,
        is_typing: isTyping,
      },
    });
  };

  // Enhanced disconnect with proper cleanup
  const disconnect = (): void => {
    console.log("[WebSocket] Initiating graceful disconnect");

    // Stop all background processes
    stopHeartbeat();
    cleanupNetworkChangeDetection();

    // Disconnect both WebSockets
    disconnectMessages();
    disconnectPresence();

    // Clear persisted data
    clearPersistedQueue();
  };

  // Enhanced Messages WebSocket disconnect
  const disconnectMessages = (): void => {
    if (
      socketMessages.value &&
      (isMessagesConnected.value || isMessagesConnecting.value)
    ) {
      console.log("[WebSocket Messages] Disconnecting...");

      // Attempt graceful close
      try {
        if (socketMessages.value.readyState === WebSocket.OPEN) {
          socketMessages.value.close(1000, "User disconnect");
        }
      } catch (error) {
        console.warn("[WebSocket Messages] Error during disconnect:", error);
      }

      isMessagesConnected.value = false;
      isMessagesConnecting.value = false;
      updateConnectionQuality("disconnected");
    }
  };

  // Enhanced Presence WebSocket disconnect
  const disconnectPresence = (): void => {
    if (
      socketPresence.value &&
      (isPresenceConnected.value || isPresenceConnecting.value)
    ) {
      console.log("[WebSocket Presence] Disconnecting...");

      // Attempt graceful close
      try {
        if (socketPresence.value.readyState === WebSocket.OPEN) {
          socketPresence.value.close(1000, "User disconnect");
        }
      } catch (error) {
        console.warn("[WebSocket Presence] Error during disconnect:", error);
      }

      isPresenceConnected.value = false;
      isPresenceConnecting.value = false;
    }
  };

  // Enhanced state clearing with comprehensive cleanup
  const clear = (): void => {
    console.log("[WebSocket] Clearing all state");

    // Stop background processes
    stopHeartbeat();
    cleanupNetworkChangeDetection();

    // Clear WebSocket references
    socketMessages.value = null;
    socketPresence.value = null;

    // Reset connection states
    isMessagesConnected.value = false;
    isMessagesConnecting.value = false;
    isPresenceConnected.value = false;
    isPresenceConnecting.value = false;

    // Reset connection management
    reconnectAttempts.value = 0;
    connectionError.value = null;
    updateConnectionQuality("disconnected");

    // Clear queues and tracking
    messageQueue.value = [];
    activeSubscriptions.value = [];
    messageRetryCount.value.clear();
    pendingPings.value.clear();

    // Clear persisted data
    clearPersistedQueue();

    // Reset timestamps
    lastHeartbeatTime.value = 0;
    lastMessageTime.value = 0;
  };

  // Auto-disconnect when component is unmounted
  onUnmounted(() => {
    disconnect();
  });

  // Enhanced exponential backoff calculation
  const getReconnectDelay = (attempt: number): number => {
    const exponentialDelay = Math.min(
      baseReconnectInterval * Math.pow(2, attempt),
      maxReconnectInterval
    );
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.3 * exponentialDelay;
    return exponentialDelay + jitter;
  };

  // Network change detection
  const setupNetworkChangeDetection = (): void => {
    if (typeof window !== "undefined" && "navigator" in window) {
      networkChangeHandler.value = () => {
        if (navigator.onLine) {
          console.log(
            "[WebSocket] Network back online, attempting reconnection"
          );
          if (!isMessagesConnected.value || !isPresenceConnected.value) {
            setTimeout(() => connect(), 1000);
          }
        } else {
          console.log("[WebSocket] Network went offline");
          connectionQuality.value = "disconnected";
        }
      };

      window.addEventListener("online", networkChangeHandler.value);
      window.addEventListener("offline", networkChangeHandler.value);
    }
  };

  // Cleanup network change detection
  const cleanupNetworkChangeDetection = (): void => {
    if (networkChangeHandler.value && typeof window !== "undefined") {
      window.removeEventListener("online", networkChangeHandler.value);
      window.removeEventListener("offline", networkChangeHandler.value);
      networkChangeHandler.value = null;
    }
  };

  // Heartbeat mechanism
  const startHeartbeat = (): void => {
    stopHeartbeat();

    heartbeatInterval.value = setInterval(() => {
      if (isMessagesConnected.value && socketMessages.value) {
        const pingId = `ping_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const pingMessage = {
          type: "ping" as any,
          data: { id: pingId, timestamp: Date.now() },
        };

        try {
          socketMessages.value.send(JSON.stringify(pingMessage));
          pendingPings.value.add(pingId);

          // Clean up old pings after timeout
          setTimeout(() => {
            if (pendingPings.value.has(pingId)) {
              pendingPings.value.delete(pingId);
              console.warn("[WebSocket] Ping timeout detected");
              updateConnectionQuality("poor");
            }
          }, 10000); // 10 second ping timeout
        } catch (error) {
          console.error("[WebSocket] Failed to send heartbeat:", error);
          updateConnectionQuality("poor");
        }
      }
    }, heartbeatPeriod);
  };

  const stopHeartbeat = (): void => {
    if (heartbeatInterval.value) {
      clearInterval(heartbeatInterval.value);
      heartbeatInterval.value = null;
    }
    pendingPings.value.clear();
  };

  // Connection quality assessment
  const updateConnectionQuality = (
    quality: typeof connectionQuality.value
  ): void => {
    if (connectionQuality.value !== quality) {
      connectionQuality.value = quality;
      eventBus.emit("connection-quality-changed", quality);
      console.log(`[WebSocket] Connection quality changed to: ${quality}`);
    }
  };

  const assessConnectionQuality = (): void => {
    if (!isMessagesConnected.value) {
      updateConnectionQuality("disconnected");
      return;
    }

    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime.value;
    const timeSinceLastHeartbeat = now - lastHeartbeatTime.value;

    if (timeSinceLastMessage > 120000 || timeSinceLastHeartbeat > 120000) {
      updateConnectionQuality("poor");
    } else if (timeSinceLastMessage > 60000 || timeSinceLastHeartbeat > 60000) {
      updateConnectionQuality("good");
    } else {
      updateConnectionQuality("excellent");
    }
  };

  // Enhanced message queuing with persistence
  const addToQueue = (message: WebSocketMessage): void => {
    // Prevent queue overflow
    if (messageQueue.value.length >= maxQueueSize) {
      console.warn("[WebSocket] Message queue full, removing oldest message");
      messageQueue.value.shift();
    }

    // Add unique ID for tracking retries
    const messageWithId = {
      ...message,
      _queueId: `queue_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      _timestamp: Date.now(),
    };

    messageQueue.value.push(messageWithId);

    // Persist to sessionStorage for recovery after page refresh
    try {
      sessionStorage.setItem(
        "ws_message_queue",
        JSON.stringify(messageQueue.value)
      );
    } catch (error) {
      console.warn("[WebSocket] Failed to persist message queue:", error);
    }
  };

  // Restore message queue from persistence
  const restoreMessageQueue = (): void => {
    try {
      const savedQueue = sessionStorage.getItem("ws_message_queue");
      if (savedQueue) {
        const parsedQueue = JSON.parse(savedQueue);
        // Only restore messages from the last 5 minutes
        const fiveMinutesAgo = Date.now() - 300000;
        messageQueue.value = parsedQueue.filter(
          (msg: any) => msg._timestamp && msg._timestamp > fiveMinutesAgo
        );
        console.log(
          `[WebSocket] Restored ${messageQueue.value.length} messages from queue`
        );
      }
    } catch (error) {
      console.warn("[WebSocket] Failed to restore message queue:", error);
      messageQueue.value = [];
    }
  };

  // Clear persisted queue
  const clearPersistedQueue = (): void => {
    try {
      sessionStorage.removeItem("ws_message_queue");
    } catch (error) {
      console.warn("[WebSocket] Failed to clear persisted queue:", error);
    }
  };

  // Process queued messages with retry logic
  const processMessageQueue = (): void => {
    if (
      !isMessagesConnected.value ||
      !socketMessages.value ||
      messageQueue.value.length === 0
    ) {
      return;
    }

    const messagesToProcess = [...messageQueue.value];
    messageQueue.value = [];

    messagesToProcess.forEach((message) => {
      const queueId = (message as any)._queueId;
      const retryCount = messageRetryCount.value.get(queueId) || 0;

      if (retryCount >= maxRetries) {
        console.warn(
          "[WebSocket] Message exceeded max retries, dropping:",
          message
        );
        messageRetryCount.value.delete(queueId);
        return;
      }

      try {
        // Remove queue metadata before sending
        const cleanMessage = { ...message };
        delete (cleanMessage as any)._queueId;
        delete (cleanMessage as any)._timestamp;

        socketMessages.value!.send(JSON.stringify(cleanMessage));
        messageRetryCount.value.delete(queueId);
        console.log("[WebSocket] Successfully sent queued message");
      } catch (error) {
        console.error("[WebSocket] Failed to send queued message:", error);
        messageRetryCount.value.set(queueId, retryCount + 1);
        addToQueue(message);
      }
    });

    // Update persisted queue
    clearPersistedQueue();
  };

  // Manual reconnection trigger
  const reconnect = async (): Promise<void> => {
    console.log("[WebSocket] Manual reconnection triggered");

    // Clear current state
    disconnect();

    // Wait a moment before reconnecting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Reset reconnection attempts for fresh start
    reconnectAttempts.value = 0;
    connectionError.value = null;

    // Attempt connection
    await connect();
  };

  // Force reconnection (for emergency situations)
  const forceReconnect = async (): Promise<void> => {
    console.log("[WebSocket] Force reconnection triggered");

    // More aggressive cleanup
    clear();

    // Wait longer before reconnecting
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Attempt connection
    await connect();
  };

  // Connection health check
  const checkConnectionHealth = (): {
    isHealthy: boolean;
    issues: string[];
    recommendations: string[];
  } => {
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (!isMessagesConnected.value) {
      issues.push("Messages WebSocket disconnected");
      recommendations.push("Try reconnecting to messaging service");
    }

    if (!isPresenceConnected.value) {
      issues.push("Presence WebSocket disconnected");
      recommendations.push("Try reconnecting to presence service");
    }

    if (pendingPings.value.size > 3) {
      issues.push("Multiple pending heartbeats");
      recommendations.push("Connection may be unstable");
    }

    if (messageQueue.value.length > 10) {
      issues.push("Large message queue");
      recommendations.push("Messages may be delayed");
    }

    if (connectionQuality.value === "poor") {
      issues.push("Poor connection quality");
      recommendations.push("Check network connection");
    }

    const now = Date.now();
    if (isMessagesConnected.value && now - lastMessageTime.value > 300000) {
      issues.push("No recent message activity");
      recommendations.push("Connection may be stale");
    }

    return {
      isHealthy: issues.length === 0,
      issues,
      recommendations,
    };
  };

  // Enhanced cleanup on unmount
  onUnmounted(() => {
    console.log("[WebSocket] Component unmounting, cleaning up");
    disconnect();
    clear();
  });

  // Return the enhanced public API
  return {
    // Connection State
    isConnected: computed(
      () => isMessagesConnected.value && isPresenceConnected.value
    ),
    isConnecting: computed(
      () => isMessagesConnecting.value || isPresenceConnecting.value
    ),
    isMessagesConnected: computed(() => isMessagesConnected.value),
    isPresenceConnected: computed(() => isPresenceConnected.value),
    connectionError: computed(() => connectionError.value),
    connectionQuality: computed(() => connectionQuality.value),

    // Queue Management
    queueLength: computed(() => messageQueue.value.length),
    hasQueuedMessages: computed(() => messageQueue.value.length > 0),

    // Connection Health
    reconnectAttempts: computed(() => reconnectAttempts.value),
    maxReconnectAttempts: computed(() => maxReconnectAttempts),

    // Core Actions
    connect,
    disconnect,
    reconnect,
    forceReconnect,
    clear,
    send,
    sendTypingStatus,

    // Subscription Management
    subscribeToUnreadCounts,

    // Utilities
    validateToken,
    checkConnectionHealth,

    // Advanced Features
    processMessageQueue,
    restoreMessageQueue,

    // Internal State (for development monitoring)
    _internal:
      process.env.NODE_ENV === "development"
        ? {
            messageQueue: computed(() => messageQueue.value),
            pendingPings: computed(() => Array.from(pendingPings.value)),
            lastHeartbeatTime: computed(() => lastHeartbeatTime.value),
            lastMessageTime: computed(() => lastMessageTime.value),
            activeSubscriptions: computed(() => activeSubscriptions.value),
          }
        : undefined,
  };
});
