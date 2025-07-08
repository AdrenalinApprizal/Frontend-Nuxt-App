<template>
  <div class="relative" ref="dropdownRef">
    <!-- Notification bell button -->
    <button
      @click="toggleDropdown"
      class="flex items-center justify-center w-10 h-10 rounded-full text-white bg-gray-700 hover:bg-gray-600 transition-colors relative"
      aria-label="Notifications"
    >
      <Icon name="fa:bell" class="text-lg" />
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
      >
        {{ unreadCount > 9 ? "9+" : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute z-10 mt-2 -right-10 w-80 bg-white rounded-md shadow-lg py-1 text-gray-800"
    >
      <div class="px-4 py-2 border-b flex justify-between items-center">
        <h3 class="font-semibold">Notifications</h3>
        <button
          v-if="notifications.length > 0"
          @click="handleMarkAllAsRead"
          class="text-xs text-blue-500 hover:text-blue-700"
        >
          Mark all as read
        </button>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center items-center py-6">
          <div
            class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"
          ></div>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="notifications.length === 0"
          class="px-4 py-6 text-center text-gray-500"
        >
          No notifications
        </div>

        <!-- Notifications list -->
        <div
          v-else
          v-for="notification in notifications"
          :key="notification.id"
          :class="`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
            !notification.read ? 'bg-blue-50' : ''
          }`"
          @click="handleNotificationClick(notification)"
        >
          <div class="flex justify-between">
            <div class="flex-1">
              <p class="text-sm line-clamp-2 font-medium">
                {{ getNotificationDisplayContent(notification) }}
                <!-- Show loading indicator for username fetch -->
                <span
                  v-if="
                    notification.data?.sender_id &&
                    loadingUsers.has(notification.data.sender_id)
                  "
                  class="inline-block ml-2"
                >
                  <div
                    class="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent inline-block"
                  ></div>
                </span>
              </p>
              <!-- Show notification title if different from content -->
              <p
                v-if="
                  notification.title &&
                  notification.title !== notification.content
                "
                class="text-xs text-gray-600 mt-1"
              >
                {{ notification.title }}
              </p>

              <!-- Show sender info if available -->
              <p
                v-if="
                  notification.data?.sender_id &&
                  (notification.data?.sender_username ||
                    userCache[notification.data.sender_id])
                "
                class="text-xs text-green-600 mt-1"
              >
                From:
                {{
                  notification.data?.sender_username ||
                  userCache[notification.data.sender_id]
                }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatTimestamp(notification.created_at) }}
              </p>
            </div>
            <div
              v-if="!notification.read"
              class="h-2 w-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"
            ></div>
          </div>
        </div>
      </div>

      <div v-if="hasMorePages" class="px-4 py-2 text-center border-t">
        <button
          @click="handleLoadMore"
          class="text-sm text-blue-500 hover:text-blue-700"
          :disabled="isLoadingMore"
        >
          {{ isLoadingMore ? "Loading..." : "Load more" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "~/composables/useNotifications";
import type { Notification } from "~/composables/useNotifications";

// Composables and services
const { $toast } = useNuxtApp();
const notificationsStore = useNotifications();

// User Cache interface
interface UserCache {
  [userId: string]: string; // userId -> username mapping
}

// Component state (React-style state management)
const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const isLoadingMore = ref(false);
const userCache = ref<UserCache>({}); // Cache untuk username
const loadingUsers = ref<Set<string>>(new Set()); // Track loading users

// Enhanced computed properties with React-like patterns
const notifications = computed(() => notificationsStore.notifications.value);
const unreadCount = computed(() => notificationsStore.unreadCount.value);
const isLoading = computed(() => notificationsStore.isLoading.value);
const error = computed(() => notificationsStore.error.value);
const hasMorePages = computed(
  () => notificationsStore.pagination.value.has_more_pages
);

// Format timestamp
const formatTimestamp = (timestamp: string): string => {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch {
    return "Recently";
  }
};

// Helper function to extract username from notification content
const extractUsernameFromBody = (content: string): string | null => {
  // Backend format: "New message from {username}" or "New group message from {username}"
  const match = content.match(/New (?:group )?message from (.+)$/i);
  return match ? match[1] : null;
};

// Function to fetch username from user ID
const fetchUsername = async (userId: string): Promise<string> => {
  // Check cache first
  if (userCache.value[userId]) {
    return userCache.value[userId];
  }

  // Check if already loading this user
  if (loadingUsers.value.has(userId)) {
    return `user-${userId.substring(0, 8)}...`; // Temporary display while loading
  }

  try {
    loadingUsers.value = new Set(loadingUsers.value).add(userId);

    // Call API to get user details
    const response = await $fetch(`/api/proxy/users/${userId}`);

    // Extract username from various possible fields
    const username =
      response.username ||
      response.name ||
      response.display_name ||
      `${response.first_name || ""} ${response.last_name || ""}`.trim() ||
      response.email?.split("@")[0] ||
      `User-${userId.substring(0, 8)}`;

    // Cache the result
    userCache.value = {
      ...userCache.value,
      [userId]: username,
    };

    return username;
  } catch (error) {
    // Cache a fallback username to avoid repeated failed requests
    const fallbackUsername = `User-${userId.substring(0, 8)}`;
    userCache.value = {
      ...userCache.value,
      [userId]: fallbackUsername,
    };

    return fallbackUsername;
  } finally {
    const newSet = new Set(loadingUsers.value);
    newSet.delete(userId);
    loadingUsers.value = newSet;
  }
};

// Helper function to get display content for notification
const getNotificationDisplayContent = (notification: Notification): string => {
  ({
    id: notification.id,
    type: notification.type,
    content: notification.content,
    title: notification.title,
    data: notification.data,
  });

  // Prioritize content from backend if available (contains username)
  if (notification.content) {
    return notification.content;
  }

  // Generate content based on type and data with username resolution
  if (notification.type === "message" && notification.data?.sender_id) {
    const senderId = notification.data.sender_id;

    // PRIORITY 1: Check if sender_username is available in data object
    if (notification.data.sender_username) {
      const usernameContent = `New message from ${notification.data.sender_username}`;
      return usernameContent;
    }

    // PRIORITY 2: Check if we have username in cache
    if (userCache.value[senderId]) {
      const cachedContent = `New message from ${userCache.value[senderId]}`;
      return cachedContent;
    }

    // PRIORITY 3: If loading, show loading state
    if (loadingUsers.value.has(senderId)) {
      return `New message from user (loading...)`;
    }

    // PRIORITY 4: Show user ID as fallback (this will trigger username fetch)
    const fallbackContent = `New message from user ${senderId.substring(
      0,
      8
    )}...`;

    // Trigger username fetch in background (don't await to avoid blocking UI)
    fetchUsername(senderId).then((username) => {
      // This will trigger a re-render when username is cached
    });

    return fallbackContent;
  }

  return "New notification";
};

// Enhanced event handlers (React-style)
const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

// Handle notification click - marks as read and potentially navigates
const handleNotificationClick = async (notification: Notification) => {
  if (!notification.read) {
    try {
      await notificationsStore.markAsRead(notification.id);
      $toast?.success("Notification marked as read");

      // Handle navigation based on notification type
      if (
        notification.type === "friend_request" &&
        (notification.data?.userId || notification.data?.sender_id)
      ) {
        // Navigate to friends page
        navigateTo("/chat/friends");
      } else if (
        notification.type === "group_invitation" &&
        notification.data?.groupId
      ) {
        navigateTo(`/chat/groups/${notification.data.groupId}`);
      } else if (
        (notification.type === "message" ||
          notification.type === "new_message") &&
        (notification.data?.senderId || notification.data?.sender_id)
      ) {
        // Use sender_id from backend or fallback to senderId
        const senderId =
          notification.data.sender_id || notification.data.senderId;
        if (notification.data?.groupId) {
          // Group message - navigate to group chat
          navigateTo(`/chat/groups/${notification.data.groupId}`);
        } else {
          // Direct message - navigate to private chat
          navigateTo(`/chat/messages/${senderId}`);
        }
      }
    } catch (error: any) {
      error("Error marking notification as read:", error);
      $toast?.error(error.message || "Failed to mark notification as read");
    }
  }
};

// Mark all as read handler
const handleMarkAllAsRead = async () => {
  try {
    await notificationsStore.markAllAsRead();
    $toast?.success("All notifications marked as read");
  } catch (error: any) {
    $toast?.error(error.message || "Failed to mark all notifications as read");
  }
};

// Load more notifications
const handleLoadMore = async () => {
  if (isLoadingMore.value) return;

  isLoadingMore.value = true;
  try {
    await notificationsStore.loadMoreNotifications();
  } catch (error: any) {
    $toast?.error(error.message || "Failed to load more notifications");
  } finally {
    isLoadingMore.value = false;
  }
};

// Auto-fetch usernames for notifications that have sender_id but no content or sender_username
watch(
  [notifications, userCache, loadingUsers],
  () => {
    const notificationsNeedingUsernames = notifications.value.filter(
      (notification) =>
        !notification.content &&
        notification.data?.sender_id &&
        !notification.data?.sender_username && // Don't fetch if sender_username is already available
        !userCache.value[notification.data.sender_id] &&
        !loadingUsers.value.has(notification.data.sender_id)
    );

    if (notificationsNeedingUsernames.length > 0) {
      // Batch fetch usernames
      notificationsNeedingUsernames.forEach((notification) => {
        if (notification.data?.sender_id) {
          fetchUsername(notification.data.sender_id).catch((err) => {});
        }
      });
    }
  },
  { deep: true }
);

// Load notifications when dropdown opens
watch(isOpen, async (newValue) => {
  if (newValue) {
    try {
      await notificationsStore.getNotifications(1, 10);
    } catch (err: any) {
      // Only show error toast for actual errors, not for empty results
      if (
        err.message &&
        err.message !== "Invalid response format from server"
      ) {
        $toast?.error(`Error loading notifications: ${err.message}`);
      } else {
        // Handle the case where notifications might be empty but not an error
      }
    }
  }
});

// Lifecycle hooks
onMounted(async () => {
  // Add event listener for clicks outside the dropdown
  document.addEventListener("mousedown", handleClickOutside);

  // Load data when component mounts
  try {
    await notificationsStore.getUnreadCount();
  } catch (err) {}

  // Set up periodic refresh of unread count
  const interval = setInterval(() => {
    notificationsStore.getUnreadCount().catch((err) => {});
  }, 60000); // Refresh every minute

  onBeforeUnmount(() => {
    clearInterval(interval);
    document.removeEventListener("mousedown", handleClickOutside);
  });
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style scoped>
/* Enhanced text truncation for better readability */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
