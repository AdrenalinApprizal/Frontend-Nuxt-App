import { ref, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";
import { eventBus } from "./useEventBus";
import type { EventTypes } from "./useEventBus";

/**
 * Hook to safely subscribe to WebSocket events
 * Automatically cleans up listeners when component unmounts
 */
export function useWebSocketListener() {
  const activeListeners = ref<
    { event: keyof EventTypes | "*"; callback: Function }[]
  >([]);

  /**
   * Listen for WebSocket events with automatic cleanup
   *
   * @param eventName The event to listen for
   * @param callback The function to call when the event is emitted
   */
  function listenToWSEvent<K extends keyof EventTypes>(
    eventName: K,
    callback: (data: EventTypes[K]) => void
  ) {
    // Save reference to callback
    activeListeners.value.push({ event: eventName, callback });

    // Subscribe to event
    eventBus.on(eventName, callback);

    console.log(
      `[WebSocketListener] Registered listener for event: ${eventName}`
    );
  }

  /**
   * Listen for new messages with debounced message grouping
   *
   * @param callback The function to call when a new message is received
   * @param options Configuration options
   */
  function listenToNewMessages(
    callback: (message: any) => void,
    options: {
      debounceMs?: number;
      groupSimilar?: boolean;
    } = {}
  ) {
    const debounceMs = options.debounceMs || 250;
    const groupSimilar = options.groupSimilar !== false; // Default to true

    // Track recent messages to prevent duplicates
    const recentMessageIds = new Set<string>();
    const messageQueue: any[] = [];
    let debounceTimer: NodeJS.Timeout | null = null;

    // Process queued messages with optional grouping
    const processQueue = () => {
      if (messageQueue.length === 0) return;

      if (groupSimilar && messageQueue.length > 1) {
        // Process all messages at once if they are similar
        callback(messageQueue);
        messageQueue.length = 0;
      } else {
        // Process one message at a time
        const message = messageQueue.shift();
        if (message) callback(message);
      }

      // Continue processing if more messages exist
      if (messageQueue.length > 0) {
        debounceTimer = setTimeout(processQueue, debounceMs);
      } else {
        debounceTimer = null;
      }
    };

    // Create message handler with deduplication
    const directMessageHandler = (message: EventTypes["private-message"]) => {
      // Skip duplicate messages within short timeframe
      if (message.id && recentMessageIds.has(message.id)) {
        return;
      }

      // Add message ID to recent set with automatic cleanup
      if (message.id) {
        recentMessageIds.add(message.id);
        setTimeout(() => recentMessageIds.delete(message.id), 10000);
      }

      // Queue message for processing
      messageQueue.push(message);

      // Start/reset debounce timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(processQueue, debounceMs);
    };

    const newMessageHandler = (message: EventTypes["new-message-received"]) => {
      // Queue message for processing
      messageQueue.push(message);

      // Start/reset debounce timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(processQueue, debounceMs);
    };

    const tempMessageHandler = (
      message: EventTypes["temp-message-replaced"]
    ) => {
      // Queue message for processing
      messageQueue.push(message);

      // Start/reset debounce timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(processQueue, debounceMs);
    };

    // Listen for various message events
    listenToWSEvent("private-message", directMessageHandler);
    listenToWSEvent("new-message-received", newMessageHandler);
    listenToWSEvent("temp-message-replaced", tempMessageHandler);
  }

  /**
   * Clean up all listeners
   */
  function cleanupListeners() {
    activeListeners.value.forEach(({ event, callback }) => {
      eventBus.off(event as keyof EventTypes, callback as any);
    });

    activeListeners.value = [];
    console.log("[WebSocketListener] Cleaned up all listeners");
  }

  // Auto-cleanup when component unmounts
  onUnmounted(cleanupListeners);

  return {
    listenToWSEvent,
    listenToNewMessages,
    cleanupListeners,
    activeListenersCount: () => activeListeners.value.length,
  };
}
