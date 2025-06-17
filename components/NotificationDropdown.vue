<template>
  <div class="relative" ref="dropdownRef">
    <!-- Enhanced notification bell button with React-style interactions -->
    <button
      @click="toggleDropdown"
      :class="bellButtonClasses"
      :title="notificationTitle"
      :disabled="isInitializing"
    >
      <Icon name="fa:bell" :class="iconClasses" />
      <!-- Enhanced unread count badge with animations -->
      <span v-if="unreadCount > 0" :class="badgeClasses">
        {{ formatUnreadCount(unreadCount) }}
      </span>
    </button>

    <!-- Enhanced dropdown with better animations and React-style structure -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 -right-10 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      >
        <!-- Enhanced header with React-style styling -->
        <div class="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div class="flex justify-between items-center">
            <h3 class="font-semibold text-gray-900 text-sm">
              Notifications
              <span v-if="unreadCount > 0" class="text-blue-600">
                ({{ unreadCount }} unread)
              </span>
            </h3>
            <div class="flex items-center space-x-2">
              <!-- Refresh button -->
              <button
                @click="handleRefreshNotifications"
                :disabled="isRefreshing"
                class="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                title="Refresh notifications"
              >
                <Icon
                  name="lucide:refresh-cw"
                  class="h-3 w-3"
                  :class="{ 'animate-spin': isRefreshing }"
                />
              </button>
              <!-- Mark all as read button -->
              <button
                v-if="notifications.length > 0 && unreadCount > 0"
                @click="handleMarkAllAsRead"
                :disabled="isMarkingAllAsRead"
                class="text-xs text-blue-500 hover:text-blue-700 disabled:text-gray-400 transition-colors"
              >
                {{ isMarkingAllAsRead ? "Marking..." : "Mark all as read" }}
              </button>
            </div>
          </div>
        </div>

        <!-- Enhanced content area with better scrolling -->
        <div
          class="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          <!-- Enhanced loading state -->
          <div
            v-if="isLoading"
            class="flex flex-col justify-center items-center py-8"
          >
            <div
              class="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"
            ></div>
            <p class="mt-2 text-xs text-gray-500">Loading notifications...</p>
          </div>

          <!-- Enhanced empty state -->
          <div
            v-else-if="notifications.length === 0"
            class="px-4 py-8 text-center"
          >
            <Icon
              name="fa:bell-slash"
              class="h-8 w-8 text-gray-300 mx-auto mb-2"
            />
            <p class="text-sm text-gray-500">No notifications yet</p>
            <p class="text-xs text-gray-400 mt-1">
              You'll see new notifications here
            </p>
          </div>

          <!-- Enhanced notification list -->
          <div v-else class="divide-y divide-gray-100">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              :class="getNotificationItemClasses(notification)"
              @click="handleNotificationClick(notification)"
              role="button"
              tabindex="0"
              @keydown.enter="handleNotificationClick(notification)"
              @keydown.space.prevent="handleNotificationClick(notification)"
            >
              <div class="flex items-start space-x-3">
                <!-- Notification icon based on type -->
                <div class="flex-shrink-0 mt-1">
                  <div :class="getNotificationIconClasses(notification)">
                    <Icon
                      :name="getNotificationIcon(notification.type)"
                      class="h-3 w-3"
                    />
                  </div>
                </div>

                <!-- Notification content -->
                <div class="flex-1 min-w-0">
                  <!-- Title and content -->
                  <div class="flex justify-between items-start">
                    <div class="flex-1 pr-2">
                      <p
                        v-if="notification.title"
                        class="text-sm font-medium text-gray-900 line-clamp-1"
                      >
                        {{ notification.title }}
                      </p>
                      <p
                        class="text-sm text-gray-600 line-clamp-2"
                        :class="{ 'mt-1': notification.title }"
                      >
                        {{ notification.content }}
                      </p>
                    </div>

                    <!-- Unread indicator -->
                    <div
                      v-if="!notification.read"
                      class="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"
                      aria-label="Unread notification"
                    ></div>
                  </div>

                  <!-- Timestamp and metadata -->
                  <div class="flex justify-between items-center mt-2">
                    <p class="text-xs text-gray-400">
                      {{ formatTimestamp(notification.created_at) }}
                    </p>
                    <span
                      v-if="
                        notification.priority && notification.priority !== 'low'
                      "
                      :class="getPriorityClasses(notification.priority)"
                      class="text-xs px-1.5 py-0.5 rounded-full"
                    >
                      {{ notification.priority }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced load more section -->
        <div
          v-if="hasMorePages && !isLoading"
          class="px-4 py-3 border-t border-gray-100 bg-gray-50"
        >
          <button
            @click="loadMoreNotifications"
            :disabled="isLoadingMore"
            class="w-full text-sm text-blue-500 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Icon
              v-if="isLoadingMore"
              name="lucide:loader-2"
              class="h-4 w-4 animate-spin inline mr-2"
            />
            {{
              isLoadingMore
                ? "Loading more..."
                : `Load more (${remainingCount} remaining)`
            }}
          </button>
        </div>

        <!-- Enhanced error state -->
        <div
          v-if="error && !isLoading"
          class="px-4 py-3 border-t border-red-100 bg-red-50"
        >
          <div class="flex items-center space-x-2 text-red-600">
            <Icon name="lucide:alert-triangle" class="h-4 w-4" />
            <p class="text-xs">{{ error }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
  nextTick,
} from "vue";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "~/composables/useNotifications";
import type { Notification } from "~/composables/useNotifications";

// Composables and services
const { $toast } = useNuxtApp();
const notificationsStore = useNotifications();

// Component state (React-style state management)
const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const isLoadingMore = ref(false);
const isRefreshing = ref(false);
const isMarkingAllAsRead = ref(false);
const isInitializing = ref(true);
const refreshInterval = ref<NodeJS.Timeout | null>(null);

// Enhanced computed properties with React-like patterns
const notifications = computed(() => notificationsStore.notifications.value);
const unreadCount = computed(() => notificationsStore.unreadCount.value);
const isLoading = computed(() => notificationsStore.isLoading.value);
const error = computed(() => notificationsStore.error.value);
const hasMorePages = computed(
  () => notificationsStore.pagination.value.has_more_pages
);

// Enhanced styling computeds (React-style)
const bellButtonClasses = computed(() => [
  "p-2.5 rounded-full transition-all duration-200 relative focus:outline-none focus:ring-2",
  "disabled:cursor-not-allowed disabled:opacity-50",
  isInitializing.value
    ? "bg-gray-100 text-gray-400"
    : unreadCount.value > 0
    ? "bg-blue-100 text-blue-600 hover:bg-blue-200 focus:ring-blue-300 shadow-sm"
    : "bg-gray-200 text-gray-600 hover:bg-gray-300 focus:ring-gray-300",
]);

const iconClasses = computed(() => [
  "h-4 w-4 transition-transform duration-200",
  unreadCount.value > 0 ? "animate-pulse" : "",
]);

const badgeClasses = computed(() => [
  "absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center",
  "font-medium shadow-sm border-2 border-white transition-all duration-200",
  unreadCount.value > 9 ? "bg-red-500" : "bg-blue-500",
]);

const notificationTitle = computed(() => {
  if (isInitializing.value) return "Loading notifications...";
  if (unreadCount.value === 0) return "No new notifications";
  return `${unreadCount.value} unread notification${
    unreadCount.value === 1 ? "" : "s"
  }`;
});

const remainingCount = computed(() => {
  const total = notificationsStore.pagination.value.total_count;
  const current = notifications.value.length;
  return Math.max(0, total - current);
});

// Enhanced utility functions (React-style)
const formatUnreadCount = (count: number): string => {
  if (count > 99) return "99+";
  if (count > 9) return "9+";
  return count.toString();
};

const formatTimestamp = (timestamp: string): string => {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    console.warn("Error formatting timestamp:", error);
    return "Recently";
  }
};

const getNotificationIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    friend_request: "lucide:user-plus",
    group_invitation: "lucide:users",
    new_message: "lucide:message-circle",
    system: "lucide:settings",
    announcement: "lucide:megaphone",
    reminder: "lucide:clock",
    file_shared: "lucide:file-share",
    default: "lucide:bell",
  };
  return iconMap[type] || iconMap.default;
};

const getNotificationIconClasses = (notification: Notification): string => {
  const baseClasses = "h-6 w-6 rounded-full flex items-center justify-center";

  if (!notification.read) {
    const typeClasses: Record<string, string> = {
      friend_request: "bg-green-100 text-green-600",
      group_invitation: "bg-blue-100 text-blue-600",
      new_message: "bg-purple-100 text-purple-600",
      system: "bg-gray-100 text-gray-600",
      announcement: "bg-yellow-100 text-yellow-600",
      reminder: "bg-orange-100 text-orange-600",
      file_shared: "bg-indigo-100 text-indigo-600",
      default: "bg-blue-100 text-blue-600",
    };
    return `${baseClasses} ${
      typeClasses[notification.type] || typeClasses.default
    }`;
  }

  return `${baseClasses} bg-gray-100 text-gray-400`;
};

const getNotificationItemClasses = (notification: Notification): string => {
  const baseClasses =
    "px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 focus:outline-none focus:bg-gray-100";
  return notification.read
    ? baseClasses
    : `${baseClasses} bg-blue-50 border-l-4 border-blue-400`;
};

const getPriorityClasses = (priority: string): string => {
  const priorityClasses: Record<string, string> = {
    urgent: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-gray-100 text-gray-700",
  };
  return priorityClasses[priority] || priorityClasses.low;
};

// Enhanced event handlers (React-style)
const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    await nextTick();
    // Set up automatic close after 30 seconds of inactivity
    setTimeout(() => {
      if (isOpen.value) {
        isOpen.value = false;
      }
    }, 30000);
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

const handleRefreshNotifications = async () => {
  if (isRefreshing.value) return;

  isRefreshing.value = true;
  try {
    await Promise.all([
      notificationsStore.getNotifications(1, 10),
      notificationsStore.getUnreadCount(),
    ]);
    $toast?.success("Notifications refreshed");
  } catch (error: any) {
    console.error("Error refreshing notifications:", error);
    $toast?.error("Failed to refresh notifications");
  } finally {
    isRefreshing.value = false;
  }
};

const handleNotificationClick = async (notification: Notification) => {
  try {
    // Mark as read if unread
    if (!notification.read) {
      await notificationsStore.markAsRead(notification.id);
    }

    // Enhanced navigation logic (React-style)
    const navigationMap: Record<string, () => void> = {
      friend_request: () => {
        if (notification.data?.userId) {
          navigateTo("/chat/friends");
        }
      },
      group_invitation: () => {
        if (notification.data?.groupId) {
          navigateTo(`/chat/groups/${notification.data.groupId}`);
        }
      },
      new_message: () => {
        if (notification.data?.senderId) {
          navigateTo(`/chat/messages/${notification.data.senderId}`);
        } else if (notification.data?.groupId) {
          navigateTo(`/chat/groups/${notification.data.groupId}`);
        }
      },
      file_shared: () => {
        if (notification.data?.fileId) {
          // Navigate to files section or open file
          navigateTo("/files");
        }
      },
    };

    // Execute navigation if available
    const navigationHandler = navigationMap[notification.type];
    if (navigationHandler) {
      navigationHandler();
      isOpen.value = false; // Close dropdown after navigation
    } else if (notification.action_url) {
      // Fallback to action URL if provided
      navigateTo(notification.action_url);
      isOpen.value = false;
    }
  } catch (error: any) {
    console.error("Error handling notification click:", error);
    $toast?.error("Failed to process notification");
  }
};

const loadMoreNotifications = async () => {
  if (isLoadingMore.value || !hasMorePages.value) return;

  isLoadingMore.value = true;
  try {
    await notificationsStore.loadMoreNotifications();
  } catch (error: any) {
    console.error("Error loading more notifications:", error);
    $toast?.error("Failed to load more notifications");
  } finally {
    isLoadingMore.value = false;
  }
};

const handleMarkAllAsRead = async () => {
  if (isMarkingAllAsRead.value || unreadCount.value === 0) return;

  isMarkingAllAsRead.value = true;
  try {
    await notificationsStore.markAllAsRead();
    $toast?.success("All notifications marked as read");
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    $toast?.error("Failed to mark all notifications as read");
  } finally {
    isMarkingAllAsRead.value = false;
  }
};

// Enhanced initialization and cleanup (React-style lifecycle)
const initializeNotifications = async () => {
  try {
    isInitializing.value = true;

    // Fetch initial data in parallel
    await Promise.all([
      notificationsStore.getUnreadCount(),
      // Only fetch notifications if health check passes
      notificationsStore
        .checkHealth()
        .then(() => {
          return notificationsStore.getNotifications(1, 10);
        })
        .catch((err) => {
          console.warn("Notification service health check failed:", err);
          // Continue with unread count only
        }),
    ]);
  } catch (error) {
    console.error("Error initializing notifications:", error);
    // Don't show error toast on initialization failure
  } finally {
    isInitializing.value = false;
  }
};

const setupPeriodicRefresh = () => {
  // Set up periodic refresh of unread count (every 2 minutes)
  refreshInterval.value = setInterval(async () => {
    try {
      await notificationsStore.getUnreadCount();
    } catch (err) {
      console.error("Failed to update unread count:", err);
    }
  }, 120000); // 2 minutes
};

const cleanup = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
    refreshInterval.value = null;
  }
  document.removeEventListener("mousedown", handleClickOutside);
};

// Enhanced watchers (React-style effects)
watch(
  () => isOpen.value,
  async (newValue) => {
    if (newValue && !isLoading.value) {
      console.log(
        "Notification dropdown opened, fetching latest notifications..."
      );

      try {
        // Fetch fresh notifications when dropdown opens
        await notificationsStore.getNotifications(1, 10);
      } catch (err: any) {
        console.error("Failed to fetch notifications:", err);

        // Only show error toast for actual errors, not for empty results
        if (err.message && !err.message.includes("Invalid response format")) {
          $toast?.error("Failed to load latest notifications");
        }
      }
    }
  }
);

// Lifecycle hooks
onMounted(async () => {
  // Add event listener for clicks outside the dropdown
  document.addEventListener("mousedown", handleClickOutside);

  // Initialize notifications and set up periodic refresh
  await initializeNotifications();
  setupPeriodicRefresh();
});

onBeforeUnmount(cleanup);
</script>

<style scoped>
/* Enhanced text truncation for better readability */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced scrollbar styling for better UX */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Enhanced focus states for accessibility */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth transitions for all interactive elements */
* {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

/* Enhanced animation for notification badge */
@keyframes notification-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-notification-pulse {
  animation: notification-pulse 2s infinite;
}

/* Enhanced dropdown shadow */
.dropdown-shadow {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* React-style hover effects */
.notification-item {
  position: relative;
  overflow: hidden;
}

.notification-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.notification-item:hover::before {
  left: 100%;
}

/* Enhanced loading animation */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 1s linear infinite;
}

/* Dark mode support (for future enhancement) */
@media (prefers-color-scheme: dark) {
  .dark-mode {
    --bg-primary: #1f2937;
    --bg-secondary: #374151;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --border-color: #4b5563;
  }
}

/* Mobile responsive adjustments */
@media (max-width: 640px) {
  .notification-dropdown {
    width: 90vw;
    max-width: 320px;
    right: 0;
    left: auto;
    transform: translateX(-10px);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .notification-item {
    border: 1px solid #000;
  }

  .notification-item:hover {
    background-color: #f0f0f0;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
