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

  // Shared state
  const reconnectAttempts = ref(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = ref(2000); // Start with 2 seconds
  const connectionError = ref<string | null>(null);
  const messageQueue = ref<WebSocketMessage[]>([]);
  const activeSubscriptions = ref<string[]>([]); // Track active subscriptions
  const authCheckInProgress = ref(false);
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
      console.error("[WebSocket Messages] No authentication token available");
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

  // Initialize WebSocket connections
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

  // Handle successful Messages connection
  const handleMessagesOpen = (event: Event): void => {
    console.log("[WebSocket Messages] Connection established");
    isMessagesConnected.value = true;
    isMessagesConnecting.value = false;
    reconnectAttempts.value = 0;
    reconnectInterval.value = 2000; // Reset reconnect interval

    // Subscribe to unread counts on connection
    subscribeToUnreadCounts();

    // Send any queued messages
    if (messageQueue.value.length > 0) {
      console.log(
        `[WebSocket Messages] Sending ${messageQueue.value.length} queued messages`
      );
      messageQueue.value.forEach((message) => send(message));
      messageQueue.value = [];
    }

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

  // Handle incoming messages from Messages WebSocket
  const handleMessagesMessage = (event: MessageEvent): void => {
    try {
      const message = JSON.parse(event.data) as WebSocketMessage;
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

  // Handle errors for Messages WebSocket
  const handleMessagesError = (event: Event): void => {
    console.error("[WebSocket Messages] Error:", event);
    connectionError.value = "WebSocket Messages connection error";
    isMessagesConnecting.value = false;
  };

  // Handle errors for Presence WebSocket
  const handlePresenceError = (event: Event): void => {
    console.error("[WebSocket Presence] Error:", event);
    connectionError.value = "WebSocket Presence connection error";
    isPresenceConnecting.value = false;
  };

  // Handle connection close for Messages WebSocket
  const handleMessagesClose = (event: CloseEvent): void => {
    console.log(
      `[WebSocket Messages] Connection closed. Code: ${event.code}, Reason: ${event.reason}`
    );
    isMessagesConnected.value = false;
    isMessagesConnecting.value = false;

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
    // Attempt to reconnect for other issues
    else if (event.code !== 1000 && event.code !== 1001) {
      handleMessagesReconnect();
    }
  };

  // Handle connection close for Presence WebSocket
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
    // Attempt to reconnect for other issues
    else if (event.code !== 1000 && event.code !== 1001) {
      handlePresenceReconnect();
    }
  };

  // Handle reconnection for Messages WebSocket
  const handleMessagesReconnect = (): void => {
    // Only attempt to reconnect if authenticated and not exceeding max attempts
    if (
      !authStore.isAuthenticated ||
      reconnectAttempts.value >= maxReconnectAttempts
    ) {
      if (reconnectAttempts.value >= maxReconnectAttempts) {
        console.log("[WebSocket Messages] Max reconnection attempts reached");
        connectionError.value = "Failed to connect after multiple attempts";
        if ($toast) {
          $toast.error(
            "Failed to connect to messaging service. Please refresh the page."
          );
        }
      }
      return;
    }

    reconnectAttempts.value++;
    const delay = reconnectInterval.value * reconnectAttempts.value;
    console.log(
      `[WebSocket Messages] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.value}/${maxReconnectAttempts})`
    );

    setTimeout(() => {
      connectMessagesWebSocket();
    }, delay);
  };

  // Handle reconnection for Presence WebSocket
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

    reconnectAttempts.value++;
    const delay = reconnectInterval.value * reconnectAttempts.value;
    console.log(
      `[WebSocket Presence] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.value}/${maxReconnectAttempts})`
    );

    setTimeout(() => {
      connectPresenceWebSocket();
    }, delay);
  };

  // Send a message through Messages WebSocket
  const send = (message: WebSocketMessage): void => {
    if (!isMessagesConnected.value || !socketMessages.value) {
      // Queue message for when connection is established
      console.log(
        "[WebSocket Messages] Connection not ready, queueing message"
      );
      messageQueue.value.push(message);

      // Try to connect if not already connecting
      if (!isMessagesConnecting.value && !isMessagesConnected.value) {
        connectMessagesWebSocket();
      }
      return;
    }

    try {
      socketMessages.value.send(JSON.stringify(message));
    } catch (error) {
      console.error("[WebSocket Messages] Failed to send message:", error);
      // Add to queue to retry later
      messageQueue.value.push(message);
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

  // Disconnect both WebSockets
  const disconnect = (): void => {
    disconnectMessages();
    disconnectPresence();
  };

  // Disconnect Messages WebSocket
  const disconnectMessages = (): void => {
    if (
      socketMessages.value &&
      (isMessagesConnected.value || isMessagesConnecting.value)
    ) {
      console.log("[WebSocket Messages] Disconnecting...");
      socketMessages.value.close(1000, "User logout");
      isMessagesConnected.value = false;
      isMessagesConnecting.value = false;
    }
  };

  // Disconnect Presence WebSocket
  const disconnectPresence = (): void => {
    if (
      socketPresence.value &&
      (isPresenceConnected.value || isPresenceConnecting.value)
    ) {
      console.log("[WebSocket Presence] Disconnecting...");
      socketPresence.value.close(1000, "User logout");
      isPresenceConnected.value = false;
      isPresenceConnecting.value = false;
    }
  };

  // Clear all state
  const clear = (): void => {
    socketMessages.value = null;
    socketPresence.value = null;
    isMessagesConnected.value = false;
    isMessagesConnecting.value = false;
    isPresenceConnected.value = false;
    isPresenceConnecting.value = false;
    reconnectAttempts.value = 0;
    connectionError.value = null;
    messageQueue.value = [];
    activeSubscriptions.value = [];
  };

  // Auto-disconnect when component is unmounted
  onUnmounted(() => {
    disconnect();
  });

  // Return the public API
  return {
    // State
    isConnected: computed(
      () => isMessagesConnected.value && isPresenceConnected.value
    ),
    isConnecting: computed(
      () => isMessagesConnecting.value || isPresenceConnecting.value
    ),
    isMessagesConnected,
    isPresenceConnected,
    connectionError,

    // Actions
    connect,
    disconnect,
    clear,
    send,
    sendTypingStatus,
    subscribeToUnreadCounts,
    validateToken,
  };
});
