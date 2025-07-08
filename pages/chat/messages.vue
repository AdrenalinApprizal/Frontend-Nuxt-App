<template>
  <div class="h-screen flex">
    <!-- Messages List -->
    <div class="w-80 border-r border-gray-200">
      <MessagesList />
    </div>

    <!-- Content area that shows chat or welcome screen -->
    <div class="flex-1 flex">
      <template v-if="$route.params.id">
        <!-- This renders the actual [id].vue page content -->
        <NuxtPage class="flex-1" />
      </template>
      <template v-else>
        <!-- Placeholder content when no chat is selected -->
        <div
          class="flex-1 bg-gray-50 flex flex-col items-center justify-center"
        >
          <div class="text-center max-w-md">
            <img
              src="/images/voxtalogo.png"
              alt="Logo"
              class="w-24 h-24 mx-auto mb-6 rounded-full"
            />
            <h2 class="text-2xl font-semibold text-gray-800 mb-2">
              Welcome to Chat
            </h2>
            <p class="text-gray-600">
              Select a conversation from the list or start a new one to begin
              messaging.
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/composables/useAuth";
import { useNotifications } from "@/composables/useNotifications";
import { useFriendsStore } from "@/composables/useFriends";
import { useGroupsStore } from "@/composables/useGroups";
import { useWebSocket } from "@/composables/useWebSocket";
import { usePresence } from "@/composables/usePresence";
import { eventBus } from "@/composables/useEventBus";
import MessagesList from "@/components/chat/MessagesList.vue";

// Apply the auth middleware to protect this route
definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const route = useRoute();
const { $toast } = useNuxtApp();

// Initialize stores and composables
const authStore = useAuthStore();
const notifications = useNotifications();
const friendsStore = useFriendsStore();
const groupsStore = useGroupsStore();
const webSocket = useWebSocket();
const presence = usePresence();

// State management
const isAuthChecked = ref(false);
const isAutoRefreshEnabled = ref(true);
const refreshInterval = ref<NodeJS.Timeout | null>(null);
const lastRefreshTime = ref<Date>(new Date());
const refreshCount = ref(0);

// Auto-refresh configuration
const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds
const MAX_REFRESH_ATTEMPTS = 10; // Maximum refresh attempts before slowing down
const SLOW_REFRESH_INTERVAL = 60000; // 1 minute for slower refresh

// Auto-refresh function
const performAutoRefresh = async () => {
  if (!isAutoRefreshEnabled.value || !authStore.isAuthenticated) {
    return;
  }

  try {
    lastRefreshTime.value = new Date();
    refreshCount.value++;

    // Refresh data in parallel for better performance
    const refreshPromises = [
      // Refresh friends list
      friendsStore.getFriends().catch((error: any) => {}),

      // Refresh groups list
      groupsStore.getGroups().catch((error: any) => {}),

      // Refresh notifications count
      notifications.getUnreadCount().catch((error: any) => {}),
    ];

    await Promise.allSettled(refreshPromises);

    // Remove excessive success indicators - auto-refresh should be silent
  } catch (error: any) {
    // Show error notification less frequently
    if (refreshCount.value % 3 === 0) {
      $toast.error("Failed to refresh data");
    }
  }
};

// Start auto-refresh functionality
const startAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }

  // Determine refresh interval based on refresh count
  const interval =
    refreshCount.value >= MAX_REFRESH_ATTEMPTS
      ? SLOW_REFRESH_INTERVAL
      : AUTO_REFRESH_INTERVAL;

  refreshInterval.value = setInterval(performAutoRefresh, interval);
  isAutoRefreshEnabled.value = true;
};

// Stop auto-refresh functionality
const stopAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
    refreshInterval.value = null;
  }
  isAutoRefreshEnabled.value = false;
};

// Toggle auto-refresh (for manual control)
const toggleAutoRefresh = () => {
  if (isAutoRefreshEnabled.value) {
    stopAutoRefresh();
  } else {
    startAutoRefresh();
  }
};

// Manual refresh function
const manualRefresh = async () => {
  await performAutoRefresh();
};

// Handle visibility change (pause auto-refresh when tab is not visible)
const handleVisibilityChange = () => {
  if (document.visibilityState === "hidden") {
    stopAutoRefresh();
  } else if (
    document.visibilityState === "visible" &&
    authStore.isAuthenticated
  ) {
    // Perform immediate refresh when tab becomes visible
    performAutoRefresh();
    startAutoRefresh();
  }
};

// Handle WebSocket connection changes
const handleWebSocketConnection = () => {
  if (webSocket.isConnected) {
    startAutoRefresh();
  } else {
    stopAutoRefresh();
  }
};

// Check if this is a fresh login (from route query or sessionStorage)
const checkForFreshLogin = () => {
  const isFromLogin =
    route.query.fromLogin === "true" ||
    sessionStorage.getItem("freshLogin") === "true";

  const shouldForceRefresh = route.query.refresh === "true";

  if (isFromLogin || shouldForceRefresh) {
    // Clear the fresh login indicators
    sessionStorage.removeItem("freshLogin");

    // Force a complete component refresh to ensure fresh state (similar to router.refresh)
    if (process.client) {
      // Trigger window resize to refresh layout
      window.dispatchEvent(new Event("resize"));

      // Clear all component caches (similar to router.refresh behavior)
      if (shouldForceRefresh) {
        console.log("[Router-Refresh] Executing complete app state refresh...");

        // Clear any cached data
        sessionStorage.clear();

        // Reset fresh login flag after clearing
        sessionStorage.setItem("freshLogin", "true");
        sessionStorage.setItem("loginTimestamp", Date.now().toString());

        // Force refresh all reactive stores immediately
        Promise.all([
          authStore.getUserInfo(),
          friendsStore.getFriends(),
          groupsStore.getGroups(),
          notifications.getUnreadCount(),
        ])
          .then(() => {
            console.log("[Router-Refresh] All stores refreshed successfully");
          })
          .catch((error) => {
            console.error("[Router-Refresh] Error refreshing stores:", error);
          });
      } else {
        // Standard fresh login handling
        nextTick(() => {
          // Refresh friends store
          friendsStore.getFriends().catch(console.warn);

          // Refresh groups store
          groupsStore.getGroups().catch(console.warn);

          // Refresh notifications
          notifications.getUnreadCount().catch(console.warn);
        });
      }
    }

    // Perform immediate refresh on fresh login
    setTimeout(performAutoRefresh, shouldForceRefresh ? 500 : 1000); // Faster refresh for forced refresh
    return true;
  }
  return false;
};

// Listen for custom login refresh events
const handleLoginRefresh = (event: CustomEvent) => {
  console.log(
    "[Login-Refresh] Custom login refresh event received:",
    event.detail
  );

  // Force refresh all stores and data
  if (process.client) {
    Promise.all([
      authStore.getUserInfo(),
      friendsStore.getFriends(),
      groupsStore.getGroups(),
      notifications.getUnreadCount(),
    ])
      .then(() => {
        console.log("[Login-Refresh] All stores refreshed successfully");
      })
      .catch((error) => {
        console.error("[Login-Refresh] Error refreshing stores:", error);
      });

    // Trigger auto-refresh
    performAutoRefresh();
  }
};

// Handle chat refresh events from ChatArea component
const handleChatRefresh = (event: any) => {
  console.log("[Messages] Chat refresh event received:", event);

  // Trigger a refresh of message lists to ensure they're in sync
  if (event?.newRecipientId || event?.detail?.newRecipientId) {
    // Refresh message list to update last message timestamps, etc.
    performAutoRefresh();
  }
};

// Listen for route changes to trigger refresh
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId && oldId !== undefined) {
      console.log(
        `🔄 [Messages] Route changed from ${oldId} to ${newId} - refreshing data`
      );
      // Small delay to allow the new component to mount
      setTimeout(() => {
        performAutoRefresh();
      }, 200);
    }
  },
  { immediate: false }
);

// Handle auth state changes (similar to router.refresh effect)
const handleAuthStateChanged = (event: CustomEvent) => {
  console.log("[Auth-State-Changed] Auth state change detected:", event.detail);

  if (event.detail?.authenticated && process.client) {
    console.log(
      "[Auth-State-Changed] User authenticated, performing comprehensive refresh..."
    );

    // Force complete refresh of all data (similar to router.refresh)
    Promise.all([
      authStore.getUserInfo(),
      friendsStore.getFriends(),
      groupsStore.getGroups(),
      notifications.getUnreadCount(),
    ])
      .then(() => {
        console.log("[Auth-State-Changed] Complete app refresh successful");

        // Clear any router refresh parameters
        if (window.location.search.includes("refresh=true")) {
          const newUrl = window.location.pathname + "?fromLogin=true";
          window.history.replaceState({}, "", newUrl);
        }

        // Start auto-refresh
        if (!isAutoRefreshEnabled.value) {
          startAutoRefresh();
        }
      })
      .catch((error) => {
        console.error("[Auth-State-Changed] Error during app refresh:", error);
      });
  }
};

// Enhanced auth check with auto-refresh initialization
onMounted(async () => {
  try {
    // First check if we have a token in the store
    if (!authStore.token) {
      // If no token in the store, wait briefly to see if it gets loaded from cookies
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Final check for authentication after possible cookie loading
    if (!authStore.isAuthenticated && !authStore.token) {
      console.log("Not authenticated, redirecting to login");
      router.push("/auth/login");
      return;
    }

    console.log("User is authenticated, initializing chat page");

    // User is authenticated, make sure we have the latest user info
    if (!authStore.user) {
      try {
        await authStore.getUserInfo();
      } catch (error) {
        console.warn("Could not retrieve user info:", error);
      }
    }

    // Check for fresh login and perform initial setup
    const isFreshLogin = checkForFreshLogin();

    // Initialize auto-refresh functionality
    await nextTick(); // Wait for components to mount

    // Start auto-refresh if WebSocket is connected or after a short delay
    if (webSocket.isConnected) {
      startAutoRefresh();
    } else {
      // Wait a bit for WebSocket to connect, then start auto-refresh
      setTimeout(() => {
        if (authStore.isAuthenticated) {
          startAutoRefresh();
        }
      }, 2000);
    }

    // Set up event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Add event listener for login refresh
    if (process.client) {
      window.addEventListener(
        "login-refresh",
        handleLoginRefresh as EventListener
      );

      // Add event listener for auth state changes (similar to router.refresh trigger)
      window.addEventListener(
        "auth-state-changed",
        handleAuthStateChanged as EventListener
      );

      // Add event listener for chat refresh events from ChatArea component
      eventBus.on("chat-refreshed", handleChatRefresh);
    }

    // Watch WebSocket connection status
    watch(() => webSocket.isConnected, handleWebSocketConnection);

    // Expose refresh functions globally for debugging
    if (process.dev) {
      (window as any).chatRefresh = {
        manual: manualRefresh,
        toggle: toggleAutoRefresh,
        start: startAutoRefresh,
        stop: stopAutoRefresh,
        status: () => ({
          enabled: isAutoRefreshEnabled.value,
          count: refreshCount.value,
          lastRefresh: lastRefreshTime.value,
        }),
      };
    }
  } catch (error) {
    console.error("Error during auth check and auto-refresh setup:", error);
  } finally {
    isAuthChecked.value = true;
  }
});

// Cleanup on unmount
onUnmounted(() => {
  stopAutoRefresh();
  document.removeEventListener("visibilitychange", handleVisibilityChange);

  // Clean up custom event listeners
  if (process.client) {
    window.removeEventListener(
      "login-refresh",
      handleLoginRefresh as EventListener
    );
    window.removeEventListener(
      "auth-state-changed",
      handleAuthStateChanged as EventListener
    );

    // Clean up chat refresh event listener
    eventBus.off("chat-refreshed", handleChatRefresh);
  }

  // Clean up global debug functions
  if (process.dev && (window as any).chatRefresh) {
    delete (window as any).chatRefresh;
  }
});

// Provide refresh functionality to child components
provide("autoRefresh", {
  refresh: performAutoRefresh,
  toggle: toggleAutoRefresh,
  isEnabled: readonly(isAutoRefreshEnabled),
  lastRefresh: readonly(lastRefreshTime),
  refreshCount: readonly(refreshCount),
});
</script>
