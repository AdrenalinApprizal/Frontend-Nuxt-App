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
    console.log(`[Auto-Refresh] Performing refresh #${refreshCount.value + 1}`);
    lastRefreshTime.value = new Date();
    refreshCount.value++;

    // Refresh data in parallel for better performance
    const refreshPromises = [
      // Refresh friends list
      friendsStore.getFriends().catch((error: any) => {
        console.warn("[Auto-Refresh] Failed to refresh friends:", error);
      }),

      // Refresh groups list
      groupsStore.getGroups().catch((error: any) => {
        console.warn("[Auto-Refresh] Failed to refresh groups:", error);
      }),

      // Refresh notifications count
      notifications.getUnreadCount().catch((error: any) => {
        console.warn("[Auto-Refresh] Failed to refresh notifications:", error);
      }),
    ];

    await Promise.allSettled(refreshPromises);

    console.log(`[Auto-Refresh] Completed refresh #${refreshCount.value}`);

    // Show subtle success indicator (optional)
    if (refreshCount.value % 5 === 0) {
      // Every 5th refresh
      $toast.success("Data refreshed");
    }
  } catch (error: any) {
    console.error("[Auto-Refresh] Error during auto-refresh:", error);

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

  console.log(`[Auto-Refresh] Started with ${interval}ms interval`);
};

// Stop auto-refresh functionality
const stopAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
    refreshInterval.value = null;
  }
  isAutoRefreshEnabled.value = false;
  console.log("[Auto-Refresh] Stopped");
};

// Toggle auto-refresh (for manual control)
const toggleAutoRefresh = () => {
  if (isAutoRefreshEnabled.value) {
    stopAutoRefresh();
    $toast.info("Auto-refresh disabled");
  } else {
    startAutoRefresh();
    $toast.success("Auto-refresh enabled");
  }
};

// Manual refresh function
const manualRefresh = async () => {
  $toast.info("Refreshing data...");
  await performAutoRefresh();
  $toast.success("Data refreshed successfully");
};

// Handle visibility change (pause auto-refresh when tab is not visible)
const handleVisibilityChange = () => {
  if (document.visibilityState === "hidden") {
    console.log("[Auto-Refresh] Tab hidden, stopping auto-refresh");
    stopAutoRefresh();
  } else if (
    document.visibilityState === "visible" &&
    authStore.isAuthenticated
  ) {
    console.log("[Auto-Refresh] Tab visible, resuming auto-refresh");
    // Perform immediate refresh when tab becomes visible
    performAutoRefresh();
    startAutoRefresh();
  }
};

// Handle WebSocket connection changes
const handleWebSocketConnection = () => {
  if (webSocket.isConnected) {
    console.log("[Auto-Refresh] WebSocket connected, starting auto-refresh");
    startAutoRefresh();
  } else {
    console.log("[Auto-Refresh] WebSocket disconnected, stopping auto-refresh");
    stopAutoRefresh();
  }
};

// Check if this is a fresh login (from route query or sessionStorage)
const checkForFreshLogin = () => {
  const isFromLogin =
    route.query.fromLogin === "true" ||
    sessionStorage.getItem("freshLogin") === "true";

  if (isFromLogin) {
    console.log(
      "[Auto-Refresh] Fresh login detected, performing initial refresh"
    );
    // Clear the fresh login indicators
    sessionStorage.removeItem("freshLogin");
    // Perform immediate refresh on fresh login
    setTimeout(performAutoRefresh, 1000); // Small delay to let components mount
    return true;
  }
  return false;
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

    if (isFreshLogin) {
      $toast.success("Welcome! Loading your messages...");
    }

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
    $toast.error("Failed to initialize chat page");
  } finally {
    isAuthChecked.value = true;
  }
});

// Cleanup on unmount
onUnmounted(() => {
  stopAutoRefresh();
  document.removeEventListener("visibilitychange", handleVisibilityChange);

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
