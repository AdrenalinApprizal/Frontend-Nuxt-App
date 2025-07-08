import { ref, onUnmounted, computed } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "./useAuth";
import { useMessagesStore } from "./useMessages";
import { eventBus } from "./useEventBus";
import { useNuxtApp, useRouter } from "#app";
import {
  formatTimeString,
  extractValidDate,
  formatMessageTimestamp,
} from "~/utils/timestampHelper";

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
  _timestamp?: number;
  _retryCount?: number;
}

// Basic message structure from the server
export interface BaseMessageData {
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
  recipient?: {
    id: string;
    name: string;
    profile_picture_url?: string;
  };
}

// Extended message with additional client-side properties
export interface NewMessageData extends BaseMessageData {
  // Additional properties used in the code
  message_id?: string;
  pending?: boolean;
  sent?: boolean;
  sent_at?: string;
  raw_timestamp?: string;
  timestamp?: string;
  isCurrentUser?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  temp_id?: string;
  replacedTempMessage?: boolean;
  fromWebSocket?: boolean;
  updatedViaWebSocket?: boolean;
  recoveredFromError?: boolean;
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

  // Initialize WebSocket connections with enhanced setup and better error handling
  const connect = async (): Promise<void> => {
    // Validate authentication before connecting
    if (!authStore.isAuthenticated) {
      console.warn("[WebSocket] Not authenticated, cannot connect");
      return;
    }

    try {
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

      // Connect both WebSockets - handle if either fails
      try {
        await Promise.all([
          connectMessagesWebSocket(),
          connectPresenceWebSocket(),
        ]);

        // Start periodic health checks after successful connection
        startHealthChecks();
      } catch (wsError) {
        console.error("[WebSocket] Error during connection:", wsError);
        // If one connection fails, still try to maintain the other
        if (!isMessagesConnected.value) {
          setTimeout(() => connectMessagesWebSocket(), 1000);
        }
        if (!isPresenceConnected.value) {
          setTimeout(() => connectPresenceWebSocket(), 1500);
        }
      }
    } catch (error) {
      console.error("[WebSocket] Connection initialization error:", error);
      // Try to reconnect after a short delay
      setTimeout(() => {
        if (!isMessagesConnected.value || !isPresenceConnected.value) {
          reconnect();
        }
      }, 3000);
    }
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

    if ($toast && reconnectAttempts.value > 0) {
      // Only show toast for reconnections, not initial connections
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

    if ($toast && reconnectAttempts.value > 0) {
      // Only show toast for presence reconnections
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

      // Process message based on its type with improved type handling
      switch (message.type) {
        case WebSocketMessageType.MESSAGE:
          handleNewMessage(message.data);
          break;

        case WebSocketMessageType.TYPING:
          handleTypingNotification(message.data);
          break;

        case WebSocketMessageType.STOP_TYPING:
          // Handle stop typing with the same handler but set is_typing to false
          handleTypingNotification({
            ...message.data,
            is_typing: false,
          });
          break;

        case WebSocketMessageType.READ:
          handleMessageRead(message.data);
          break;

        case WebSocketMessageType.UNREAD_COUNT:
          handleUnreadCount(message.data);
          break;

        case WebSocketMessageType.MESSAGE_REACTION:
          eventBus.emit("message-reaction", message.data);
          break;

        case WebSocketMessageType.ERROR:
          console.error(
            "[WebSocket Messages] Error from server:",
            message.data
          );
          if ($toast) {
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

  // Handle user status changes with validation and throttling
  const handleStatusChange = (data: UserStatusData): void => {
    try {
      // Validate required fields
      if (!data.user_id) {
        console.error(
          "[WebSocket Presence] Missing user_id in status data:",
          data
        );
        return;
      }

      // Validate status value
      if (data.status !== "online" && data.status !== "offline") {
        console.warn(
          `[WebSocket Presence] Invalid status value: ${data.status}`
        );
        // Default to offline if invalid
        data.status = "offline";
      }

      // Format last_seen to be consistent if present
      let formattedLastSeen = data.last_seen;
      if (data.last_seen) {
        try {
          // Use our centralized utility to extract a valid date
          const date = extractValidDate({ raw_timestamp: data.last_seen });
          if (date && !isNaN(date.getTime())) {
            // Store as ISO string for consistency
            formattedLastSeen = date.toISOString();
          }
        } catch (e) {
          console.warn(
            "[WebSocket Presence] Invalid last_seen format:",
            data.last_seen
          );
        }
      }

      console.log(
        `[WebSocket Presence] User ${data.user_id} status changed to ${data.status}`
      );

      // Emit event for components to update UI
      const currentTimestamp = new Date().toISOString();
      eventBus.emit("user-status-changed", {
        userId: data.user_id,
        status: data.status,
        lastSeen: formattedLastSeen,
        timestamp: currentTimestamp, // ISO string for internal use
        // Add formatted timestamp for direct display in UI components
        formattedLastSeen:
          data.status === "offline" && formattedLastSeen
            ? formatTimeString(formattedLastSeen)
            : null,
      });
    } catch (error) {
      console.error(
        "[WebSocket Presence] Error processing status change:",
        error
      );
    }
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

  // Enhanced message sending with intelligent queuing, metadata and improved error handling
  const send = (message: WebSocketMessage): void => {
    try {
      // Add metadata for better synchronization
      if (message.type === WebSocketMessageType.MESSAGE) {
        // Use ISO string for consistent timestamp format
        const clientTimestamp = new Date().toISOString();
        const clientId = `client-${authStore.user?.id}-${Date.now()}`;

        // Add critical metadata for synchronization and reliable message handling
        message.data = {
          ...message.data,
          client_timestamp: clientTimestamp,
          // Store raw_timestamp consistently for our utility functions
          raw_timestamp: clientTimestamp,
          client_id: clientId,
          sender_device: "web-client",
          client_send_time: Date.now(),
        };

        // Add message ID if none exists (temp ID until server assigns one)
        if (!message.data.id) {
          message.data.id = `msg-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`;
        }
      }

      // Handle typing indicators more efficiently
      if (
        message.type === WebSocketMessageType.TYPING ||
        message.type === WebSocketMessageType.STOP_TYPING
      ) {
        // Add timestamp to typing indicators for better debouncing
        message.data = {
          ...message.data,
          timestamp: Date.now(),
        };
      }

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

      // Check WebSocket readyState before sending
      if (socketMessages.value.readyState !== WebSocket.OPEN) {
        console.warn(
          "[WebSocket Messages] Socket not in OPEN state, queueing message"
        );
        addToQueue(message);
        // Try to reconnect
        if (!isMessagesConnecting.value) {
          reconnect();
        }
        return;
      }

      // Send the message
      socketMessages.value.send(JSON.stringify(message));
      console.log("[WebSocket Messages] Message sent successfully");
      lastMessageTime.value = Date.now(); // Update for connection quality tracking
    } catch (error) {
      console.error("[WebSocket Messages] Failed to send message:", error);
      // Add to queue to retry later
      addToQueue(message);
      updateConnectionQuality("poor");
    }
  };

  // Process a new incoming message with improved duplicate detection and timestamp handling
  const handleNewMessage = (data: NewMessageData): void => {
    // Add the new message to the messages store
    if (!messagesStore.messages) {
      console.error("[WebSocket] Messages store not initialized");
      return;
    }

    try {
      // Ensure data.id exists to prevent potential issues
      if (!data.id) {
        console.warn("[WebSocket] Received message without ID:", data);
        data.id = `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      // Ensure sender_id exists
      if (!data.sender_id) {
        console.warn("[WebSocket] Received message without sender_id:", data);
        data.sender_id = data.sender?.id || "unknown-sender";
      }

      // Enhanced duplicate detection - check by ID and also similar content
      const existingMessage = messagesStore.messages.find(
        (m) => m.id === data.id || m.message_id === data.id
      );

      // Look for potential temporary message that this real message should replace
      const tempMessageIndex = messagesStore.messages.findIndex((m) => {
        // First check if this is a temp message
        const isTempMessage =
          m.id &&
          (m.id.startsWith("temp-") ||
            m.id.startsWith("msg-") ||
            m.pending === true);

        if (!isTempMessage) return false;

        // Next, check if this is from the current user
        if (m.sender_id !== authStore.user?.id) return false;

        // Check content match with normalization
        const normalizedMsgContent = (m.content || "")
          .trim()
          .replace(/\s+/g, " ");
        const normalizedNewContent = (data.content || "")
          .trim()
          .replace(/\s+/g, " ");

        // Exact content match
        if (normalizedMsgContent === normalizedNewContent) {
          return true;
        }

        // Partial content match for longer messages
        if (
          normalizedMsgContent.length > 10 &&
          normalizedNewContent.length > 10
        ) {
          // If one content contains the other, likely the same message
          if (
            normalizedMsgContent.includes(normalizedNewContent) ||
            normalizedNewContent.includes(normalizedMsgContent)
          ) {
            return true;
          }
        }

        // Check if the message was sent recently (within last 45 seconds)
        const messageTime = new Date(
          m.sent_at || m.created_at || m.raw_timestamp || new Date()
        ).getTime();
        return Date.now() - messageTime < 45000;
      });

      if (existingMessage) {
        // Update existing message with any new fields
        console.log(`[WebSocket] Updating existing message: ${data.id}`);

        // Find the index and update
        const idx = messagesStore.messages.findIndex(
          (m) => m.id === data.id || m.message_id === data.id
        );
        if (idx !== -1) {
          // Preserve some fields from the existing message if they're better
          const preservedTimestamp =
            existingMessage.raw_timestamp || existingMessage.sent_at;
          const messageTimestamp =
            preservedTimestamp ||
            data.created_at ||
            data.sent_at ||
            new Date().toISOString();

          // Use our helper functions for reliable timestamp handling
          const date = extractValidDate({
            raw_timestamp: messageTimestamp,
          });

          // Preserve existing timestamp for UI consistency when possible
          // Use formatMessageTimestamp for consistent formatting across the app
          const formattedTimestamp =
            existingMessage.timestamp ||
            formatMessageTimestamp({
              raw_timestamp: messageTimestamp,
            });

          messagesStore.messages[idx] = {
            ...messagesStore.messages[idx],
            ...data,
            // Keep important fields for consistency
            raw_timestamp: messageTimestamp,
            timestamp: formattedTimestamp,
            sent: true,
            pending: false,
            message_id: data.id, // Make sure message_id is consistent
            // Mark as updated via WebSocket
            updatedViaWebSocket: true,
          };
        }
      } else if (
        tempMessageIndex !== -1 &&
        authStore.user?.id === data.sender_id
      ) {
        // Replace temp message with real message
        console.log(`[WebSocket] Replacing temporary message with: ${data.id}`);

        // Get the original temp message
        const tempMessage = messagesStore.messages[tempMessageIndex];
        const tempId = tempMessage.id;

        // Determine best timestamp to use (prefer temp message timestamp for UI consistency)
        const messageTimestamp =
          tempMessage.raw_timestamp ||
          data.sent_at ||
          data.created_at ||
          new Date().toISOString();

        // Format timestamp for display using our helper function
        // Try to keep the existing timestamp for UI consistency or generate a new one
        const formattedTimestamp =
          tempMessage.timestamp ||
          formatMessageTimestamp({
            raw_timestamp: messageTimestamp,
          });

        // Create enhanced message with all necessary fields
        const enhancedMessage = {
          ...data,
          // Preserve the "isCurrentUser" flag to ensure consistent display
          isCurrentUser: tempMessage.isCurrentUser,
          // Store the original temp ID as a reference for better sync
          temp_id: tempId,
          sent: true,
          pending: false,
          // Ensure consistent timestamp handling
          raw_timestamp: messageTimestamp,
          timestamp: formattedTimestamp,
          message_id: data.id,
          // Flag to indicate this replaced a temp message
          replacedTempMessage: true,
        };

        // Replace the temp message
        messagesStore.messages[tempMessageIndex] = enhancedMessage;

        // Emit an event that temp message was replaced for components that need to know
        eventBus.emit("temp-message-replaced", {
          tempId,
          realId: data.id,
          content: data.content,
        });
      } else {
        // Check one more time for duplicates by content and sender
        const contentMatch = messagesStore.messages.find((m) => {
          // Don't match already deleted messages
          if (m.isDeleted) return false;

          // Match by content with normalization
          const normalizedMsgContent = (m.content || "")
            .trim()
            .replace(/\s+/g, " ");
          const normalizedNewContent = (data.content || "")
            .trim()
            .replace(/\s+/g, " ");

          // Must be from same sender
          if (m.sender_id !== data.sender_id) return false;

          // Content must match closely
          const contentMatches =
            normalizedMsgContent === normalizedNewContent ||
            (normalizedMsgContent.length > 10 &&
              normalizedNewContent.length > 10 &&
              (normalizedMsgContent.includes(normalizedNewContent) ||
                normalizedNewContent.includes(normalizedMsgContent)));

          if (!contentMatches) return false;

          // Check for messages sent within the last minute
          try {
            const msgTime = new Date(
              m.sent_at || m.created_at || m.raw_timestamp || ""
            ).getTime();
            const dataTime = new Date(
              data.sent_at || data.created_at || ""
            ).getTime();
            return (
              !isNaN(msgTime) &&
              !isNaN(dataTime) &&
              Math.abs(msgTime - dataTime) < 60000
            );
          } catch (e) {
            return false;
          }
        });

        if (contentMatch) {
          // This is likely a duplicate message from different sources, update it instead
          console.log(
            `[WebSocket] Found duplicate message by content, updating instead of adding new`
          );

          // Find the index of the matching message
          const idx = messagesStore.messages.findIndex(
            (m) => m.id === contentMatch.id
          );
          if (idx !== -1) {
            // Update with server data but preserve local formatting
            const isCurrentUser = contentMatch.isCurrentUser;
            messagesStore.messages[idx] = {
              ...contentMatch,
              ...data,
              isCurrentUser,
              message_id: data.id,
              sent: true,
              pending: false,
            };
          }
        } else {
          // Add enhanced message to ensure all necessary fields
          const messageTimestamp =
            data.sent_at || data.created_at || new Date().toISOString();
          // Use our helper function for consistent timestamp formatting
          const formattedTimestamp = formatMessageTimestamp({
            raw_timestamp: messageTimestamp,
          });

          // Create a complete message object with all required fields from both types
          const enhancedMessage = {
            ...data,
            isCurrentUser: data.sender_id === authStore.user?.id,
            sent: true,
            pending: false,
            raw_timestamp: messageTimestamp,
            message_id: data.id,
            timestamp: formattedTimestamp,
            // Add websocket flag to help identify where message came from
            fromWebSocket: true,
            // Ensure all required fields are present
            type: data.type || "text",
            read: data.read || false,
            created_at: data.created_at || new Date().toISOString(),
            updated_at: data.updated_at || new Date().toISOString(),
          };

          console.log(`[WebSocket] Adding new message: ${data.id}`);
          messagesStore.messages.push(enhancedMessage);

          // Show notification for new messages if not from the current user
          if (data.sender_id !== authStore.user?.id && $toast) {
            $toast.info(`New message from ${data.sender?.name || "User"}`);

            // Emit specific event for new message with details
            const eventTimestamp =
              data.sent_at || data.created_at || new Date().toISOString();
            eventBus.emit("new-message-received", {
              messageId: data.id,
              senderId: data.sender_id,
              senderName: data.sender?.name || "User",
              content: data.content,
              timestamp: eventTimestamp,
              formattedTimestamp: formatMessageTimestamp({
                raw_timestamp: eventTimestamp,
              }),
            });
          }
        }
      }

      // After adding/updating message, emit private-message event for components to catch
      eventBus.emit("private-message", data);
    } catch (error) {
      console.error("[WebSocket] Error processing new message:", error, data);

      // Attempt to still add the message in a simplified form to prevent lost messages
      try {
        const fallbackMessage = {
          id: data.id || `ws-fallback-${Date.now()}`,
          content: data.content || "(Message content unavailable)",
          sender_id: data.sender_id || "unknown",
          recipient_id: data.recipient_id || "unknown",
          // Required fields from NewMessageData
          type: data.type || "text",
          read: data.read || false,
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
          // Additional fields
          isCurrentUser: data.sender_id === authStore.user?.id,
          sent: true,
          pending: false,
          raw_timestamp: data.created_at || new Date().toISOString(),
          timestamp: formatMessageTimestamp({
            raw_timestamp: data.created_at || new Date().toISOString(),
          }),
          fromWebSocket: true,
          recoveredFromError: true,
        };

        // Only add if we don't already have it
        const exists = messagesStore.messages.some(
          (m) => m.id === fallbackMessage.id
        );
        if (!exists) {
          messagesStore.messages.push(fallbackMessage);
        }
      } catch (fallbackError) {
        console.error(
          "[WebSocket] Failed to add fallback message:",
          fallbackError
        );
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

  // Enhanced message queuing with persistence and duplicate prevention
  const addToQueue = (message: WebSocketMessage): void => {
    try {
      // Check for duplicates in queue first
      const isDuplicate = messageQueue.value.some((queuedMessage) => {
        // For regular messages, check content match
        if (
          message.type === WebSocketMessageType.MESSAGE &&
          queuedMessage.type === WebSocketMessageType.MESSAGE
        ) {
          const queuedContent = queuedMessage.data?.content?.trim?.();
          const newContent = message.data?.content?.trim?.();

          if (queuedContent && newContent && queuedContent === newContent) {
            // If recipient and sender match, it's a duplicate
            if (
              queuedMessage.data?.recipient_id === message.data?.recipient_id &&
              queuedMessage.data?.sender_id === message.data?.sender_id
            ) {
              return true;
            }
          }
        }

        // For typing indicators, check if it's a duplicate for the same user/recipient
        if (
          (message.type === WebSocketMessageType.TYPING ||
            message.type === WebSocketMessageType.STOP_TYPING) &&
          message.type === queuedMessage.type
        ) {
          return (
            message.data?.user_id === queuedMessage.data?.user_id &&
            message.data?.recipient_id === queuedMessage.data?.recipient_id
          );
        }

        return false;
      });

      // Don't add duplicates
      if (isDuplicate) {
        console.log("[WebSocket] Skipping duplicate queued message");
        return;
      }

      // Prevent queue overflow
      if (messageQueue.value.length >= maxQueueSize) {
        console.warn("[WebSocket] Message queue full, removing oldest message");
        messageQueue.value.shift();
      }

      // Add unique ID and metadata for tracking retries
      const messageWithId = {
        ...message,
        _queueId: `queue_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        _timestamp: Date.now(),
        _retryCount: 0, // Track retry attempts
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
    } catch (error) {
      console.error("[WebSocket] Error adding message to queue:", error);
      // Still try to add the message without metadata in case of error
      messageQueue.value.push({
        ...message,
        _timestamp: Date.now(),
      });
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

  // Process queued messages with enhanced retry logic and error handling
  const processMessageQueue = (): void => {
    if (
      !isMessagesConnected.value ||
      !socketMessages.value ||
      messageQueue.value.length === 0
    ) {
      return;
    }

    // Ensure socket is in OPEN state
    if (socketMessages.value.readyState !== WebSocket.OPEN) {
      console.warn(
        "[WebSocket] Socket not in OPEN state, delaying queue processing"
      );
      return;
    }

    const messagesToProcess = [...messageQueue.value];
    messageQueue.value = [];

    // Process messages with improved handling
    const currentTime = Date.now();
    const processPromises = messagesToProcess.map(async (message) => {
      try {
        // Check message age - drop very old messages that are no longer relevant
        const messageTime = (message as any)._timestamp || 0;
        const messageAge = currentTime - messageTime;

        // Drop typing indicators older than 10 seconds
        if (
          (message.type === WebSocketMessageType.TYPING ||
            message.type === WebSocketMessageType.STOP_TYPING) &&
          messageAge > 10000
        ) {
          console.log(
            "[WebSocket] Dropping old typing indicator:",
            message.type
          );
          return;
        }

        // Drop very old messages (>1 hour)
        if (messageAge > 3600000) {
          console.log("[WebSocket] Dropping very old queued message");
          return;
        }

        const queueId = (message as any)._queueId;
        const retryCount =
          (message as any)._retryCount ||
          messageRetryCount.value.get(queueId) ||
          0;

        if (retryCount >= maxRetries) {
          console.warn(
            "[WebSocket] Message exceeded max retries, dropping:",
            message
          );
          messageRetryCount.value.delete(queueId);

          // For chat messages, notify user that message failed to send
          if (message.type === WebSocketMessageType.MESSAGE && $toast) {
            $toast.error("Message couldn't be delivered. Please try again.");
          }
          return;
        }

        // Update retry count and add exponential backoff for retries
        if (retryCount > 0) {
          const backoffDelay = Math.min(
            1000 * Math.pow(2, retryCount - 1),
            10000
          );
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        }

        // Remove queue metadata before sending
        const cleanMessage = { ...message };
        delete (cleanMessage as any)._queueId;
        delete (cleanMessage as any)._timestamp;
        delete (cleanMessage as any)._retryCount;

        socketMessages.value!.send(JSON.stringify(cleanMessage));
        messageRetryCount.value.delete(queueId);
        console.log("[WebSocket] Successfully sent queued message");
      } catch (error) {
        console.error("[WebSocket] Failed to send queued message:", error);

        // Increment retry count
        const queueId = (message as any)._queueId;
        const currentRetryCount =
          (message as any)._retryCount ||
          messageRetryCount.value.get(queueId) ||
          0;
        message = {
          ...message,
          _retryCount: currentRetryCount + 1,
        };
        messageRetryCount.value.set(queueId, currentRetryCount + 1);

        // Re-add to queue for later retry
        addToQueue(message);
      }
    });

    // Run all message processing
    Promise.all(processPromises)
      .then(() => {
        // Update persisted queue if any messages were re-added
        if (messageQueue.value.length > 0) {
          try {
            sessionStorage.setItem(
              "ws_message_queue",
              JSON.stringify(messageQueue.value)
            );
          } catch (error) {
            console.warn(
              "[WebSocket] Failed to persist updated message queue:",
              error
            );
          }
        } else {
          // Clear persisted queue if we processed everything
          clearPersistedQueue();
        }
      })
      .catch((error) => {
        console.error("[WebSocket] Error in queue processing:", error);
      });
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

  // Enhanced connection health check with automatic recovery
  const checkConnectionHealth = (
    autoRecover: boolean = false
  ): {
    isHealthy: boolean;
    issues: string[];
    recommendations: string[];
    lastMessageAge: number;
    socketState: string;
    reconnectCount: number;
  } => {
    const issues: string[] = [];
    const recommendations: string[] = [];
    const now = Date.now();

    // Check socket state
    let socketState = "unknown";
    if (socketMessages.value) {
      switch (socketMessages.value.readyState) {
        case WebSocket.CONNECTING:
          socketState = "connecting";
          break;
        case WebSocket.OPEN:
          socketState = "open";
          break;
        case WebSocket.CLOSING:
          socketState = "closing";
          break;
        case WebSocket.CLOSED:
          socketState = "closed";
          break;
      }
    }

    // Check connections
    if (!isMessagesConnected.value) {
      issues.push("Messages WebSocket disconnected");
      recommendations.push("Try reconnecting to messaging service");
    } else if (socketMessages.value?.readyState !== WebSocket.OPEN) {
      issues.push(`Messages WebSocket in unexpected state: ${socketState}`);
      recommendations.push("WebSocket connection may be unhealthy");
    }

    if (!isPresenceConnected.value) {
      issues.push("Presence WebSocket disconnected");
      recommendations.push("Try reconnecting to presence service");
    }

    // Check heartbeat health
    if (pendingPings.value.size > 3) {
      issues.push(`Multiple pending heartbeats (${pendingPings.value.size})`);
      recommendations.push("Connection may be unstable");
    }

    // Check message queue
    if (messageQueue.value.length > 0) {
      issues.push(
        `Message queue not empty (${messageQueue.value.length} messages)`
      );
      if (messageQueue.value.length > 10) {
        recommendations.push("Messages may be delayed");
      }
    }

    // Check connection quality
    if (connectionQuality.value === "poor") {
      issues.push("Poor connection quality");
      recommendations.push("Check network connection");
    }

    // Calculate time since last activity
    const lastMessageAge = now - lastMessageTime.value;

    // Check for stale connection
    if (isMessagesConnected.value && lastMessageAge > 300000) {
      issues.push(
        `No recent message activity (${Math.round(
          lastMessageAge / 60000
        )} minutes)`
      );
      recommendations.push("Connection may be stale");

      // Auto-recover stale connections if requested
      if (autoRecover && lastMessageAge > 600000) {
        // 10 minutes
        console.warn(
          "[WebSocket Health] Connection stale, attempting recovery"
        );
        setTimeout(() => forceReconnect(), 500);
      }
    }

    // Trigger connection quality assessment
    assessConnectionQuality();

    // Automatic recovery for other issues
    if (autoRecover) {
      // If socket is closed but we think it's connected, try to reconnect
      if (
        isMessagesConnected.value &&
        socketMessages.value?.readyState === WebSocket.CLOSED
      ) {
        console.warn(
          "[WebSocket Health] Socket inconsistency detected, forcing reconnection"
        );
        setTimeout(() => forceReconnect(), 1000);
      }

      // If many pending heartbeats, recover connection
      if (pendingPings.value.size > 5) {
        console.warn(
          "[WebSocket Health] Too many pending pings, forcing reconnection"
        );
        setTimeout(() => forceReconnect(), 1500);
      }
    }

    return {
      isHealthy: issues.length === 0,
      issues,
      recommendations,
      lastMessageAge,
      socketState,
      reconnectCount: reconnectAttempts.value,
    };
  };

  // Periodic health check interval
  const healthCheckInterval = ref<NodeJS.Timeout | null>(null);

  // Setup automatic health checks
  const startHealthChecks = (): void => {
    stopHealthChecks();

    healthCheckInterval.value = setInterval(() => {
      // Only run health checks if we should be connected
      if (authStore.isAuthenticated) {
        const health = checkConnectionHealth(true); // Auto recover if needed

        if (!health.isHealthy) {
          console.warn(
            "[WebSocket Health] Connection issues detected:",
            health.issues
          );
        }

        // Process any pending messages in queue
        if (messageQueue.value.length > 0 && isMessagesConnected.value) {
          processMessageQueue();
        }
      }
    }, 60000); // Check every minute
  };

  // Stop health checks
  const stopHealthChecks = (): void => {
    if (healthCheckInterval.value) {
      clearInterval(healthCheckInterval.value);
      healthCheckInterval.value = null;
    }
  };

  // Enhanced cleanup on unmount
  onUnmounted(() => {
    console.log("[WebSocket] Component unmounting, cleaning up");
    stopHealthChecks();
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
    subscribeToChannel,

    // Health Management
    startHealthChecks,
    stopHealthChecks,

    // Utilities
    validateToken,
    checkConnectionHealth,
    updateConnectionQuality,
    assessConnectionQuality,

    // Advanced Features
    processMessageQueue,
    restoreMessageQueue,
    handleNewMessage, // Exposed for direct message processing if needed

    // Internal State (for development monitoring)
    _internal:
      process.env.NODE_ENV === "development"
        ? {
            messageQueue: computed(() => messageQueue.value),
            pendingPings: computed(() => Array.from(pendingPings.value)),
            lastHeartbeatTime: computed(() => lastHeartbeatTime.value),
            lastMessageTime: computed(() => lastMessageTime.value),
            activeSubscriptions: computed(() => activeSubscriptions.value),
            socketState: computed(() =>
              socketMessages.value ? socketMessages.value.readyState : -1
            ),
            presenceSocketState: computed(() =>
              socketPresence.value ? socketPresence.value.readyState : -1
            ),
          }
        : undefined,
  };
});
