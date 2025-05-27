<template>
  <div class="h-full flex flex-col p-6 bg-white">
    <!-- Header with title and action buttons -->
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-xl font-bold text-gray-800">Messages</h1>
      <div class="flex items-center space-x-2">
        <button
          @click="refreshData"
          class="p-2.5 text-gray-500 hover:text-gray-700 rounded-full transition-all"
          title="Refresh Messages"
        >
          <Icon name="lucide:refresh-cw" class="h-4 w-4" />
        </button>
        <NotificationDropdown />
        <button
          @click="showNewChatPopup = true"
          class="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
          title="New Chat"
        >
          <Icon name="lucide:plus" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex mb-5 border-b border-gray-200">
      <button
        @click="activeTab = 'all'"
        :class="`py-2.5 px-5 text-sm font-medium transition-colors ${
          activeTab === 'all'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`"
      >
        All
      </button>
      <button
        @click="activeTab = 'friends'"
        :class="`py-2.5 px-5 text-sm font-medium transition-colors ${
          activeTab === 'friends'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`"
      >
        Friends
      </button>
      <button
        @click="activeTab = 'groups'"
        :class="`py-2.5 px-5 text-sm font-medium transition-colors ${
          activeTab === 'groups'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`"
      >
        Groups
      </button>
    </div>

    <!-- Search bar -->
    <div class="relative mb-5">
      <div
        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
      >
        <Icon name="lucide:search" class="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search messages"
        class="pl-11 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-sm"
      />
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        ></div>
        <p class="mt-2 text-sm text-gray-500">Loading...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center text-center">
        <Icon name="lucide:alert-triangle" class="h-8 w-8 text-red-500 mb-2" />
        <p class="text-red-500">{{ error }}</p>
        <button
          @click="refreshData"
          class="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Message list -->
    <div class="flex-1 overflow-auto">
      <div
        v-if="filteredMessages.length === 0"
        class="h-full flex flex-col items-center justify-center text-center p-6"
      >
        <Icon name="fa:envelope" class="h-12 w-12 text-gray-300 mb-3" />
        <p class="text-gray-500 font-medium">No messages yet</p>
        <p class="text-sm text-gray-400 mt-2">
          Start a conversation with friends or groups
        </p>
      </div>
      <div v-else class="space-y-3">
        <NuxtLink
          v-for="message in sortedMessages"
          :key="message.id"
          :to="`/chat/messages/${message.id}${
            message.type === 'group' ? '?type=group' : ''
          }`"
        >
          <div
            :class="`flex items-start p-4 rounded-lg transition-colors ${
              (message.type === 'friend' &&
                $route.path === `/chat/messages/${message.id}`) ||
              (message.type === 'group' &&
                $route.path === `/chat/messages/${message.id}` &&
                $route.query.type === 'group')
                ? 'bg-blue-50 border border-blue-100'
                : 'hover:bg-gray-50'
            }`"
          >
            <!-- Avatar with status -->
            <div class="relative">
              <div
                class="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0 flex items-center justify-center"
              >
                <img
                  v-if="message.sender?.avatar"
                  :src="message.sender.avatar"
                  :alt="message.sender?.first_name || 'User'"
                  class="h-full w-full object-cover"
                />
                <Icon
                  v-else-if="message.type === 'friend'"
                  name="fa:user"
                  class="h-5 w-5 text-gray-500"
                />
                <Icon v-else name="fa:users" class="h-5 w-5 text-gray-500" />
              </div>
              <div
                v-if="message.type === 'friend'"
                :class="`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  friendStatus[message.id] === 'online'
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                }`"
                @click="handleStatusClick(message.id, $event)"
              ></div>
            </div>

            <!-- Message content -->
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <h3 class="font-medium text-gray-900 truncate text-sm">
                  {{ message.sender?.first_name }}
                  {{ message.sender?.last_name }}
                </h3>
                <span class="text-xs text-gray-500 ml-1 whitespace-nowrap">
                  {{
                    message.timestamp === "Never" && message.type === "friend"
                      ? friendStatus[message.id] === "online"
                        ? "Online"
                        : "Offline"
                      : message.timestamp
                  }}
                </span>
              </div>

              <div class="flex justify-between items-start mt-1">
                <div class="flex-1">
                  <p class="text-xs text-gray-600 truncate">
                    {{ message.content }}
                  </p>
                  <!-- Unread count below message content (removed duplicate status) -->
                  <div
                    v-if="message.unreadCount && message.unreadCount > 0"
                    class="mt-1"
                  >
                    <span class="text-xs text-blue-600 font-medium">
                      • {{ message.unreadCount }} unread
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- New Chat Options Popup -->
    <div
      v-if="showNewChatPopup"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform transition-all"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">New Chat</h2>
          <button
            @click="showNewChatPopup = false"
            class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Icon name="fa:times" class="h-4 w-4" />
          </button>
        </div>

        <div class="space-y-3">
          <button
            @click="handleOption('friend')"
            class="flex items-center w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div class="p-2 bg-blue-100 rounded-full mr-3">
              <Icon name="lucide:user-plus" class="h-5 w-5 text-blue-600" />
            </div>
            <div class="text-left">
              <div class="font-medium text-black">Add a Friend</div>
              <div class="text-xs text-gray-600">Find and add new friends</div>
            </div>
          </button>

          <button
            @click="handleOption('group')"
            class="flex items-center w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div class="p-2 bg-green-100 rounded-full mr-3">
              <Icon name="lucide:users" class="h-5 w-5 text-green-600" />
            </div>
            <div class="text-left">
              <div class="font-medium text-black">Create a Group</div>
              <div class="text-xs text-gray-600">
                Start a group conversation
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Add Friend Popup -->
    <div
      v-if="showAddFriendPopup"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform transition-all"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Add a Friend</h2>
          <button
            @click="showAddFriendPopup = false"
            class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Icon name="fa:times" class="h-4 w-4" />
          </button>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <div class="flex space-x-2">
            <input
              type="text"
              v-model="friendUsername"
              placeholder="Enter username"
              class="flex-1 p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              @click="handleAddFriend"
              :disabled="!friendUsername.trim()"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div v-if="isAddingFriend" class="flex items-center">
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                ></div>
                Adding...
              </div>
              <span v-else>Add</span>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Enter your friend's username to send them a friend request
          </p>
        </div>

        <div class="flex justify-end">
          <button
            @click="showAddFriendPopup = false"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Create Group Popup -->
    <div
      v-if="showCreateGroupPopup"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform transition-all"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Create a Group</h2>
          <button
            @click="showCreateGroupPopup = false"
            class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Icon name="fa:times" class="h-4 w-4" />
          </button>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Group Name
          </label>
          <input
            type="text"
            v-model="groupName"
            placeholder="Enter group name"
            class="w-full p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="groupDescription"
            placeholder="Enter group description"
            class="w-full p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
            rows="2"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select Friends
          </label>
          <div
            class="max-h-40 text-black overflow-y-auto border border-gray-200 rounded-lg"
          >
            <div
              v-for="friend in availableFriendsForGroup"
              :key="friend.id"
              :class="`flex items-center p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                friend.selected ? 'bg-blue-50' : ''
              }`"
              @click="toggleFriendSelection(friend.id)"
            >
              <div
                class="h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex-shrink-0 flex items-center justify-center"
              >
                <img
                  v-if="friend.profile_picture_url"
                  :src="friend.profile_picture_url"
                  :alt="friend.name"
                  class="h-full w-full object-cover"
                />
                <Icon v-else name="fa:user" class="h-4 w-4 text-gray-500" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-sm text-black">{{ friend.name }}</p>
                <p class="text-gray-700 text-xs">{{ friend.email }}</p>
              </div>
              <input
                type="checkbox"
                :checked="!!friend.selected"
                class="h-4 w-4 text-blue-600"
                @click.stop
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            @click="showCreateGroupPopup = false"
            class="px-4 py-2 mr-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleCreateGroup"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            :class="{
              'opacity-50 cursor-not-allowed':
                !groupName.trim() || !selectedFriendsCount,
            }"
            :disabled="!groupName.trim() || !selectedFriendsCount"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Type imports and initial setup
import { ref, computed, onMounted, onUnmounted, watch, defineProps } from "vue";
import { formatDistanceToNow } from "date-fns";
import { useGroupsStore } from "~/composables/useGroups";
import { useFriendsStore } from "~/composables/useFriends";
import { useMessagesStore } from "~/composables/useMessages";
import { usePresence } from "~/composables/usePresence";
import { eventBus } from "~/composables/useEventBus";
import type { WatchStopHandle } from "vue";
import { useAuthStore } from "~/composables/useAuth";

// Define props
const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
});

// Get current user from auth store
const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);

// Types
type TabType = "all" | "friends" | "groups";
type MessageType = "friend" | "group";
type NewChatType = "friend" | "group";

interface Sender {
  id?: string;
  name: string;
  avatar?: string;
  first_name?: string;
  last_name?: string;
}

// Define local Message interface that extends the one from useMessages
interface Message {
  id: string;
  sender: Sender;
  recipient?: {
    id: string;
    name: string;
    profile_picture_url?: string;
  };
  sender_id?: string;
  recipient_id?: string;
  sender_name?: string;
  recipient_name?: string;
  content: string;
  timestamp: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  unreadCount?: number;
  type: MessageType;
  isCurrentUser?: boolean;
}

// Extended interface for User/Friend with additional properties we need
interface Friend {
  id: string;
  name: string;
  email: string;
  profile_picture_url?: string;
  avatar?: string;
  status?: "online" | "offline";
  phone?: string;
  location?: string;

  // Extended properties
  first_name?: string;
  last_name?: string;
  last_message?: any;
  unread_count?: number;
  selected?: boolean;
}

// Extended interface for Group
interface Group {
  id: string;
  name: string;
  avatar_url?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  member_count?: number;
  last_message?: any;
  unread_count?: number;
}

interface CreateGroupData {
  name: string;
  description?: string;
  members: string[]; // Array of user IDs
}

// Initialize stores
const groupsStore = useGroupsStore();
const friendsStore = useFriendsStore();
const messagesStore = useMessagesStore();
const presence = usePresence();
const { $toast } = useNuxtApp();

// State refs
const messages = ref<Message[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const activeTab = ref<TabType>("all");
const searchQuery = ref("");
const showNewChatPopup = ref(false);
const showAddFriendPopup = ref(false);
const showCreateGroupPopup = ref(false);
const friendUsername = ref("");
const isAddingFriend = ref(false);
const groupName = ref("");
const groupDescription = ref("");
const unsubscribeConnectionWatch = ref<WatchStopHandle | null>(null);
const friendStatusMap = ref<Record<string, string>>({});
const friendSelections = ref<Record<string, boolean>>({});

// Computed properties
const friendStatus = computed(() => friendStatusMap.value);

const filteredMessages = computed(() => {
  let filtered = messages.value;

  if (activeTab.value !== "all") {
    filtered = filtered.filter((message) => {
      if (activeTab.value === "friends") return message.type === "friend";
      if (activeTab.value === "groups") return message.type === "group";
      return true;
    });
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((message) =>
      message.sender.name.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Sort messages by most recent
const sortedMessages = computed(() => {
  return [...filteredMessages.value].sort((a, b) => {
    // First, prioritize messages with unread counts
    if (a.unreadCount && !b.unreadCount) return -1;
    if (!a.unreadCount && b.unreadCount) return 1;

    // For timestamp comparison, convert strings to dates where possible
    const dateA =
      a.timestamp === "Never" ? 0 : getDateFromTimestamp(a.timestamp);
    const dateB =
      b.timestamp === "Never" ? 0 : getDateFromTimestamp(b.timestamp);

    // Sort in descending order (newest first)
    return dateB - dateA;
  });
});

// Computed property for available friends for group creation
const availableFriendsForGroup = computed(() => {
  return friendsStore.friends.map((friend) => {
    // Cast to our Friend interface
    const typedFriend = friend as unknown as Friend;
    return {
      ...friend,
      name:
        typedFriend.name ||
        `${typedFriend.first_name || ""} ${typedFriend.last_name || ""}`.trim(),
      selected: !!friendSelections.value[friend.id],
    };
  });
});

// Count of selected friends for group creation
const selectedFriendsCount = computed(() => {
  return Object.values(friendSelections.value).filter(Boolean).length;
});

// Helper function to extract date from formatted timestamp
function getDateFromTimestamp(timestamp: string): number {
  try {
    // First try direct conversion if it's an ISO string
    if (/\d{4}-\d{2}-\d{2}T/.test(timestamp)) {
      return new Date(timestamp).getTime();
    }

    // For relative timestamps like "2 days ago", use current time minus approximate duration
    const now = new Date().getTime();

    // Process various relative time formats
    if (timestamp.includes("seconds ago")) return now - 1000;
    if (timestamp.includes("minute ago")) return now - 60 * 1000;
    if (timestamp.includes("minutes ago")) {
      const minutes = parseInt(timestamp) || 5;
      return now - minutes * 60 * 1000;
    }
    if (timestamp.includes("hour ago")) return now - 3600 * 1000;
    if (timestamp.includes("hours ago")) {
      const hours = parseInt(timestamp) || 5;
      return now - hours * 3600 * 1000;
    }
    if (timestamp.includes("day ago")) return now - 24 * 3600 * 1000;
    if (timestamp.includes("days ago")) {
      const days = parseInt(timestamp) || 3;
      return now - days * 24 * 3600 * 1000;
    }
    if (timestamp.includes("week ago")) return now - 7 * 24 * 3600 * 1000;
    if (timestamp.includes("weeks ago")) {
      const weeks = parseInt(timestamp) || 2;
      return now - weeks * 7 * 24 * 3600 * 1000;
    }
    if (timestamp.includes("month ago")) return now - 30 * 24 * 3600 * 1000;
    if (timestamp.includes("months ago")) {
      const months = parseInt(timestamp) || 3;
      return now - months * 30 * 24 * 3600 * 1000;
    }

    // Default to 0 (oldest) if we can't parse
    return 0;
  } catch (error) {
    // Silent fail and return default
    return 0;
  }
}

// Watch for changes in messages or presence
watch([messages, () => presence.userStatuses], () => {
  updateFriendStatus();
});

// Event handlers
const toggleFriendSelection = (id: string): void => {
  friendSelections.value = {
    ...friendSelections.value,
    [id]: !friendSelections.value[id],
  };
};

const handleOption = (option: NewChatType): void => {
  if (option === "friend") {
    showAddFriendPopup.value = true;
    showNewChatPopup.value = false;
    friendUsername.value = "";
  } else {
    showCreateGroupPopup.value = true;
    showNewChatPopup.value = false;
    groupName.value = "";
    groupDescription.value = "";
    // Clear all selections
    friendSelections.value = {};
  }
};

// Add friend handler
async function handleAddFriend() {
  if (!friendUsername.value.trim()) return;
  isAddingFriend.value = true;

  try {
    await friendsStore.sendFriendRequest(friendUsername.value.trim());
    $toast.success("Friend request sent successfully!");
    showAddFriendPopup.value = false;
    friendUsername.value = "";
  } catch (err: any) {
    $toast.error(err.message || "Failed to send friend request");
  } finally {
    isAddingFriend.value = false;
  }
}

// Create group handler
async function handleCreateGroup() {
  if (!groupName.value.trim() || selectedFriendsCount.value === 0) return;

  try {
    const selectedFriendIds = Object.entries(friendSelections.value)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);

    await groupsStore.createGroup({
      name: groupName.value.trim(),
      description: groupDescription.value.trim(),
      members: selectedFriendIds,
    });

    $toast.success("Group created successfully!");
    showCreateGroupPopup.value = false;
    refreshData(); // Refresh to show the new group

    // Reset form
    groupName.value = "";
    groupDescription.value = "";
    friendSelections.value = {};
  } catch (err: any) {
    $toast.error(err.message || "Failed to create group");
  }
}

// Data fetching functions
const refreshData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // First, fetch friends and groups in parallel
    await Promise.allSettled([
      friendsStore.getFriends(),
      groupsStore.getGroups(),
      fetchUnreadCounts(),
    ]);

    // For each friend, fetch message preview (optional)
    if (friendsStore.friends?.length > 0) {
      await fetchFriendMessagePreviews();
    }

    // Transform and combine the data
    const friendMessages = transformFriendsToMessages(
      friendsStore.friends || []
    );
    const groupMessages = transformGroupsToMessages(groupsStore.groups || []);

    messages.value = [...friendMessages, ...groupMessages];

    // Sort messages by last message timestamp
    sortMessagesByLatest();
  } catch (err: any) {
    error.value = err.message || "Failed to load messages";
  } finally {
    isLoading.value = false;
  }
};

// New function to fetch message previews for each friend
async function fetchFriendMessagePreviews() {
  try {
    // Get message previews for each friend (last message)
    // To avoid overwhelming the server, we'll fetch previews for 5 friends at a time
    const batchSize = 5;
    const batches = [];

    // Split friends into batches
    for (let i = 0; i < friendsStore.friends.length; i += batchSize) {
      batches.push(friendsStore.friends.slice(i, i + batchSize));
    }

    // Process each batch sequentially
    let messagePreviewsFound = 0;

    for (const batch of batches) {
      const batchPromises = batch.map(async (friend) => {
        try {
          // Cast to our Friend interface
          const typedFriend = friend as Friend;

          // Fetch the last message for this friend (limit 1)
          const response = await messagesStore.getMessages({
            target_id: typedFriend.id,
            type: "private",
            page: 1,
            limit: 1,
          });

          if (response.data && response.data.length > 0) {
            // Update the friend object with last message data
            typedFriend.last_message = response.data[0];
            messagePreviewsFound++;
          }
          return typedFriend;
        } catch (error) {
          // Silent fail and return the friend even if preview fetch fails
          return friend;
        }
      });

      // Wait for the current batch to complete before processing the next batch
      await Promise.all(batchPromises);
    }
  } catch (err) {
    // Continue without message previews if they fail
  }
}

// Sort messages by most recent
function sortMessagesByLatest() {
  messages.value.sort((a, b) => {
    // Get timestamps or use a default old date
    const timestampA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timestampB = b.timestamp ? new Date(b.timestamp).getTime() : 0;

    // Sort in descending order (newest first)
    return timestampB - timestampA;
  });
}

// New function to fetch unread message counts
async function fetchUnreadCounts() {
  try {
    const response = await messagesStore.getUnreadCount();

    // Process unread counts data if available
    if (response && response.data) {
      // Update local messages with unread counts if present
      if (response.data.friend_counts) {
        Object.entries(response.data.friend_counts).forEach(
          ([friendId, count]) => {
            const friendIndex = friendsStore.friends.findIndex(
              (friend) => friend.id === friendId
            );
            if (friendIndex >= 0) {
              // Cast to our Friend interface to allow setting unread_count
              const typedFriend = friendsStore.friends[
                friendIndex
              ] as unknown as Friend;
              typedFriend.unread_count = Number(count);
            }
          }
        );
      }

      // Update group unread counts if present
      if (response.data.group_counts) {
        Object.entries(response.data.group_counts).forEach(
          ([groupId, count]) => {
            const groupIndex = groupsStore.groups.findIndex(
              (group) => group.id === groupId
            );
            if (groupIndex >= 0) {
              // Cast to our Group interface to allow setting unread_count
              const typedGroup = groupsStore.groups[
                groupIndex
              ] as unknown as Group;
              typedGroup.unread_count = Number(count);
            }
          }
        );
      }
    }

    return response;
  } catch (err: any) {
    // Silent fail and continue
    return null;
  }
}

// Fetch friend statuses
const fetchFriendStatuses = async () => {
  // Get all friend IDs from the messages list
  const friendIds = messages.value
    .filter((message) => message.type === "friend")
    .map((message) => message.id);

  if (friendIds.length > 0) {
    try {
      // Fetch all user statuses from the presence service
      await presence.getUsersStatus(friendIds);

      // Update the statuses in our local map
      updateFriendStatus();
    } catch (error) {
      // Silent fail
    }
  }
};

// Handle WebSocket updates
const handleUnreadCountsUpdated = (
  unreadCounts: { id: string; count: number; type: MessageType }[]
) => {
  messages.value = messages.value.map((message) => {
    const update = unreadCounts.find(
      (count) => count.id === message.id && count.type === message.type
    );
    if (update) {
      return { ...message, unreadCount: update.count };
    }
    return message;
  });
};

// Update friend status when presence changes
const updateFriendStatus = () => {
  const newStatusMap: Record<string, string> = {};
  messages.value.forEach((message) => {
    if (message.type === "friend") {
      // Get status from presence service
      const status = presence.getStatus(message.id);

      // Simplify to just online/offline
      newStatusMap[message.id] = status === "online" ? "online" : "offline";
    }
  });
  friendStatusMap.value = newStatusMap;
};

// Lifecycle hooks
onMounted(async () => {
  try {
    await refreshData();
    await fetchFriendStatuses();

    // Watch for websocket connection changes
    unsubscribeConnectionWatch.value = watch(
      () => presence.isWsConnected,
      async (newValue) => {
        if (newValue) {
          await refreshData();
          await fetchFriendStatuses();
        }
      }
    );

    // Set up event listeners
    eventBus.on("direct-message", () => {
      refreshData();
    });

    eventBus.on("group-message", () => {
      refreshData();
    });

    eventBus.on("refresh-messages", () => {
      refreshData();
    });

    eventBus.on("unread-counts-updated", (data) => {
      handleUnreadCountsUpdated(data);
    });

    eventBus.on("friend-added", () => {
      refreshData();
    });
  } catch (err) {
    error.value = "Failed to initialize messages. Please try refreshing.";
  }
});

onUnmounted(() => {
  // Clean up event listeners
  eventBus.off("direct-message");
  eventBus.off("group-message");
  eventBus.off("refresh-messages");
  eventBus.off("unread-counts-updated");
  eventBus.off("friend-added");

  if (unsubscribeConnectionWatch.value) {
    unsubscribeConnectionWatch.value();
  }
});

// Utility functions
function formatTimestamp(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return dateString;
  }
}

// Transform functions
function transformGroupsToMessages(groups: any[]): Message[] {
  return groups.map((group) => {
    // Cast to our Group interface
    const typedGroup = group as Group;
    const lastMessage = typedGroup.last_message;

    let content = "No messages yet";
    let timestamp = "Never";

    if (lastMessage && lastMessage.content) {
      content = `${lastMessage.sender_name || "Someone"}: ${
        lastMessage.content
      }`;

      // Try different timestamp fields that might be in the API response
      const messageTimestamp =
        lastMessage.sent_at || lastMessage.created_at || lastMessage.timestamp;

      if (messageTimestamp) {
        timestamp = formatTimestamp(messageTimestamp);
      }
    } else if (typedGroup.created_at) {
      // Fallback to group creation time if no messages
      timestamp = formatTimestamp(typedGroup.created_at);
    }

    return {
      id: typedGroup.id,
      sender: {
        name: typedGroup.name,
        avatar: typedGroup.avatar_url,
      },
      content: content,
      timestamp: timestamp,
      unreadCount: typedGroup.unread_count || 0,
      type: "group",
    };
  });
}

function transformFriendsToMessages(friends: any[]): Message[] {
  return friends.map((friend) => {
    // Cast to our Friend interface
    const typedFriend = friend as Friend;

    // Get the full name, handling potential missing first/last name
    const firstName = typedFriend.first_name || "";
    const lastName = typedFriend.last_name || "";
    const fullName =
      `${firstName} ${lastName}`.trim() || typedFriend.name || "User";

    // Determine the message content and timestamp
    const lastMessage = typedFriend.last_message;
    const hasMessage = !!lastMessage;

    let content = "No messages yet";
    let timestamp = "Never";

    if (hasMessage && lastMessage.content) {
      content = lastMessage.content;

      // Try different timestamp fields that might be in the API response
      const messageTimestamp =
        lastMessage.sent_at || lastMessage.created_at || lastMessage.timestamp;

      if (messageTimestamp) {
        timestamp = formatTimestamp(messageTimestamp);
      }
    }

    return {
      id: typedFriend.id,
      sender: {
        name: fullName,
        avatar: typedFriend.profile_picture_url || typedFriend.avatar,
        first_name: firstName,
        last_name: lastName,
      },
      content: content,
      timestamp: timestamp,
      unreadCount: typedFriend.unread_count || 0,
      type: "friend",
    };
  });
}

// Message formatting and display logic
const formatMessage = (message: Message) => {
  if (!message) {
    return null;
  }

  try {
    // Format message for display
    return {
      id: message.id,
      content: message.content?.trim() || "",
      sender: {
        id: message.sender_id || message.sender?.id || "",
        name: message.sender_name || message.sender?.name || "Unknown",
      },
      recipientInfo: {
        id:
          message.recipient_id ||
          (message.recipient ? message.recipient.id : ""),
        name:
          message.recipient_name ||
          (message.recipient ? message.recipient.name : "Unknown"),
      },
      timestamp: message.created_at || message.timestamp,
      status: message.status || "sent",
      position: determineBubblePosition(message),
    };
  } catch (error) {
    return null;
  }
};

const determineBubblePosition = (message: Message) => {
  const currentUserId = currentUser.value?.id;

  // Get sender ID from either sender_id or sender.id
  const senderId = message.sender_id || message.sender?.id;

  // Ensure we have valid IDs
  if (!senderId || !currentUserId) {
    return "left"; // Default to left if we can't determine
  }

  return senderId === currentUserId ? "right" : "left";
};

// Update the template section
const messageClasses = (message: Message) => {
  const position = determineBubblePosition(message);
  return {
    "message-bubble": true,
    "message-right": position === "right",
    "message-left": position === "left",
    "message-pending": message.status === "pending",
    "message-error": message.status === "error",
  };
};

// Handle status click (adding missing function)
const handleStatusClick = (id: string, event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

// Message statistics computed property
const messageStats = computed(() => {
  if (!props.messages) return null;

  const stats = {
    total: props.messages.length,
    valid: 0,
    invalid: 0,
    right: 0,
    left: 0,
  };

  // Cast the messages array to the correct type
  const typedMessages = props.messages as Message[];

  typedMessages.forEach((msg) => {
    const formatted = formatMessage(msg);
    if (formatted) {
      stats.valid++;
      if (determineBubblePosition(msg) === "right") stats.right++;
      else stats.left++;
    } else {
      stats.invalid++;
    }
  });

  return stats;
});
</script>

<style scoped>
/* Add any component-specific styles here */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
