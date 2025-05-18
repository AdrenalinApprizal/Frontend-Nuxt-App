<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="p-2.5 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors relative"
      title="Notifications"
    >
      <Icon name="fa:bell" class="h-4 w-4" />
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ unreadCount > 9 ? "9+" : unreadCount }}
      </span>
    </button>

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
        <div v-if="isLoading" class="flex justify-center items-center py-6">
          <div
            class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"
          ></div>
        </div>
        <div
          v-else-if="notifications.length === 0"
          class="px-4 py-6 text-center text-gray-500"
        >
          No notifications
        </div>
        <div v-else>
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            :class="{ 'bg-blue-50': !notification.read }"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex justify-between">
              <div class="flex-1">
                <p class="text-sm line-clamp-2">
                  {{ notification.content }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatTimestamp(notification.created_at) }}
                </p>
              </div>
              <div
                v-if="!notification.read"
                class="h-2 w-2 bg-blue-500 rounded-full mt-1"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="hasMorePages" class="px-4 py-2 text-center border-t">
        <button
          @click="loadMoreNotifications"
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

const { $toast } = useNuxtApp();
const notificationsStore = useNotifications();
const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const isLoadingMore = ref(false);

// Computed properties to unwrap reactive refs
const notifications = computed(() => notificationsStore.notifications.value);
const unreadCount = computed(() => notificationsStore.unreadCount.value);
const isLoading = computed(() => notificationsStore.isLoading.value);
const hasMorePages = computed(
  () => notificationsStore.pagination.value.has_more_pages
);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

const formatTimestamp = (timestamp: string) => {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    console.warn("Error formatting timestamp:", error);
    return "Recently";
  }
};

// Handle notification click - marks as read and potentially navigates
const handleNotificationClick = async (notification: Notification) => {
  if (!notification.read) {
    try {
      await notificationsStore.markAsRead(notification.id);
      $toast?.success("Notification marked as read");

      // Handle navigation based on notification type
      if (notification.type === "friend_request" && notification.data?.userId) {
        navigateTo("/chat/friends");
      } else if (
        notification.type === "group_invitation" &&
        notification.data?.groupId
      ) {
        navigateTo(`/chat/groups/${notification.data.groupId}`);
      } else if (
        notification.type === "new_message" &&
        notification.data?.senderId
      ) {
        navigateTo(`/chat/messages/${notification.data.senderId}`);
      }
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      $toast?.error(error.message || "Failed to mark notification as read");
    }
  }
};

// Load more notifications
const loadMoreNotifications = async () => {
  if (isLoadingMore.value) return;

  isLoadingMore.value = true;
  try {
    await notificationsStore.loadMoreNotifications();
  } catch (error: any) {
    console.error("Error loading more notifications:", error);
    $toast?.error(error.message || "Failed to load more notifications");
  } finally {
    isLoadingMore.value = false;
  }
};

// Mark all notifications as read
const handleMarkAllAsRead = async () => {
  try {
    await notificationsStore.markAllAsRead();
    $toast?.success("All notifications marked as read");
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    $toast?.error(error.message || "Failed to mark all notifications as read");
  }
};

// Setup code for component mounting and cleanup
onMounted(() => {
  // Fetch unread count immediately
  notificationsStore.getUnreadCount().catch((err) => {
    console.error("Failed to fetch unread count:", err);
  });

  // Add event listener for clicks outside the dropdown
  document.addEventListener("mousedown", handleClickOutside);

  // Set up periodic refresh of unread count (every minute)
  const interval = setInterval(() => {
    notificationsStore.getUnreadCount().catch((err) => {
      console.error("Failed to update unread count:", err);
    });
  }, 60000);

  // Store the interval ID for cleanup
  const intervalId = interval;

  // Clean up on component unmount
  onBeforeUnmount(() => {
    clearInterval(intervalId);
    document.removeEventListener("mousedown", handleClickOutside);
  });
});

// Fetch notifications when dropdown opens
watch(
  () => isOpen.value,
  (newValue) => {
    if (newValue) {
      console.log("Notification dropdown opened, fetching notifications...");

      // Show loading state immediately
      notificationsStore.isLoading.value = true;

      notificationsStore
        .getNotifications(0, 10) // Using offset 0 instead of page 1
        .then((response) => {
          console.log("Notifications fetched successfully:", response);
        })
        .catch((err) => {
          console.error("Failed to fetch notifications:", err);

          // Only show error toast for actual errors, not for empty results
          if (
            err.message &&
            err.message !== "Invalid response format from server"
          ) {
            $toast?.error(`Error loading notifications: ${err.message}`);
          } else {
            // Handle the case where notifications might be empty but not an error
            console.warn("No notifications found or empty response format");
          }
        })
        .finally(() => {
          notificationsStore.isLoading.value = false;
        });
    }
  }
);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
