<template>
  <div class="h-full flex flex-col p-6 bg-white">
    <!-- Header with title and action buttons -->
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-xl font-bold text-gray-800">Messages</h1>
      <div class="flex items-center space-x-2">
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
    <div v-else class="flex-1 overflow-auto">
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
          :to="`/chat/messages/${encodeURIComponent(message.sender.name)}${
            message.type === 'group' ? '?type=group' : ''
          }`"
        >
          <div
            :class="`flex items-start p-4 rounded-lg transition-colors ${
              (message.type === 'friend' &&
                $route.path ===
                  `/chat/messages/${encodeURIComponent(
                    message.sender.name
                  )}`) ||
              (message.type === 'group' &&
                $route.path ===
                  `/chat/messages/${encodeURIComponent(message.sender.name)}` &&
                $route.query.type === 'group')
                ? 'bg-blue-50 border border-blue-100'
                : 'hover:bg-gray-50'
            }`"
          >
            <!-- Avatar with online status -->
            <div class="relative">
              <div
                class="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0 flex items-center justify-center"
              >
                <img
                  v-if="message.sender.avatar"
                  :src="message.sender.avatar"
                  :alt="message.sender.name"
                  class="h-full w-full object-cover"
                />
                <Icon
                  v-else-if="message.type === 'friend'"
                  name="fa:user"
                  class="h-5 w-5 text-gray-500"
                />
                <Icon v-else name="fa:users" class="h-5 w-5 text-gray-500" />
              </div>
              <!-- Status indicator (only for friends) -->
              <div
                v-if="message.type === 'friend'"
                :class="`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  getFriendStatus(message.id) === 'online'
                    ? 'bg-green-500'
                    : getFriendStatus(message.id) === 'busy'
                    ? 'bg-red-500'
                    : getFriendStatus(message.id) === 'away'
                    ? 'bg-yellow-500'
                    : 'bg-gray-400'
                }`"
              ></div>
            </div>

            <div class="flex-1 min-w-0">
              <!-- Top row with name and timestamp -->
              <div class="flex justify-between items-start">
                <h3 class="font-medium text-gray-900 truncate text-sm">
                  {{ message.sender.name }}
                </h3>
                <span class="text-xs text-gray-500 ml-1 whitespace-nowrap">
                  {{ message.timestamp }}
                </span>
              </div>

              <!-- Second row with message and badge -->
              <div class="flex justify-between items-start mt-1">
                <p class="text-xs text-gray-600 truncate flex-1">
                  {{ message.content }}
                </p>
                <div
                  v-if="message.unreadCount && message.unreadCount > 0"
                  class="ml-2 h-5 w-5 min-w-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0"
                >
                  {{ message.unreadCount }}
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useGroupsStore } from "~/composables/useGroups";
import { useFriendsStore } from "~/composables/useFriends";
import { useMessagesStore } from "~/composables/useMessages";
import { useWebSocket } from "~/composables/useWebSocket";
import { usePresence } from "~/composables/usePresence"; // Tambahkan presence service
import { eventBus } from "~/composables/useEventBus";
import { formatDistanceToNow } from "date-fns";
import debounce from "lodash/debounce";

// Initialize presence service
const presence = usePresence();

type MessageType = "friend" | "group";

// Interface for message
interface Message {
  id: string;
  sender: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  unreadCount?: number;
  type: MessageType; // Add type to distinguish between friend and group messages
}

// Interface for unread counts from WebSocket or API
interface UnreadCountInfo {
  user_id?: string;
  group_id?: string;
  count: number;
}

// Define the type for watch function return
type WatchStopHandle = () => void;

const route = useRoute();
const { $toast } = useNuxtApp();

// Initialize stores
const groupsStore = useGroupsStore();
const friendsStore = useFriendsStore();
const messagesStore = useMessagesStore();
const webSocketStore = useWebSocket();

let unsubscribeConnectionWatch: WatchStopHandle | null = null;

// Local state
const activeTab = ref<"all" | "friends" | "groups">("all");
const showNewChatPopup = ref(false);
const showAddFriendPopup = ref(false);
const showCreateGroupPopup = ref(false);
const friendUsername = ref("");
const groupName = ref("");
const groupDescription = ref("");
const searchQuery = ref("");
const isLoading = ref(false);
const error = ref<string | null>(null);
const friendSearchQuery = ref("");
const isSearchingFriends = ref(false);
const friendSearchResults = ref<any[]>([]);
const isAddingFriend = ref(false); // Tambahkan status loading untuk add friend

// Combined messages list - we'll convert both friends and groups into this format
const messages = ref<Message[]>([]);

// Helper method to format timestamps
const formatTimestamp = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return dateString;
  }
};

// Transform group data to message format
const transformGroupsToMessages = (groups: any[]): Message[] => {
  return groups.map((group) => {
    const lastMessage = group.last_message;
    return {
      id: group.id,
      sender: {
        name: group.name,
        avatar: group.avatar_url,
      },
      content: lastMessage
        ? `${lastMessage.sender_name}: ${lastMessage.content}`
        : "No messages yet",
      timestamp: lastMessage
        ? formatTimestamp(lastMessage.created_at)
        : formatTimestamp(group.created_at || new Date().toISOString()),
      unreadCount: 0, // We'll need to implement this when backend provides unread counts
      type: "group",
    };
  });
};

// Transform friends data to message format
const transformFriendsToMessages = (friends: any[]): Message[] => {
  return friends.map((friend) => {
    // In a real app, you'd get the last message for each friend
    // This is just a placeholder until you implement that
    return {
      id: friend.id,
      sender: {
        name: friend.name,
        avatar: friend.profile_picture_url,
      },
      content: "Click to start chatting", // This would come from the last message in a real app
      timestamp: formatTimestamp(new Date().toISOString()), // This would be the last message timestamp
      unreadCount: 0, // This would be the actual unread count
      type: "friend",
    };
  });
};

// Filter messages based on active tab
const filteredMessages = computed(() => {
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    return messages.value.filter(
      (message) =>
        message.sender.name.toLowerCase().includes(query) ||
        message.content.toLowerCase().includes(query)
    );
  }

  if (activeTab.value === "all") return messages.value;
  return messages.value.filter((message) => {
    return message.type === activeTab.value.slice(0, -1); // removes the 's' from 'friends' or 'groups'
  });
});

// Sort messages from newest to oldest
const sortedMessages = computed(() => {
  return [...filteredMessages.value].sort((a, b) => {
    // Convert relative timestamps to approximate numeric values for sorting
    // This is a simplified approach - in a real app you'd want something more robust
    const aTime = a.timestamp.includes("ago")
      ? 1
      : a.timestamp.includes("minute")
      ? 2
      : a.timestamp.includes("hour")
      ? 3
      : a.timestamp.includes("day")
      ? 4
      : a.timestamp.includes("week")
      ? 5
      : 6;

    const bTime = b.timestamp.includes("ago")
      ? 1
      : b.timestamp.includes("minute")
      ? 2
      : b.timestamp.includes("hour")
      ? 3
      : b.timestamp.includes("day")
      ? 4
      : b.timestamp.includes("week")
      ? 5
      : 6;

    return aTime - bTime;
  });
});

// For the group creation form, get available friends with selected status
const availableFriendsForGroup = computed(() => {
  return friendsStore.friends.map((friend) => ({
    ...friend,
    selected: false,
  }));
});

const selectedFriendsCount = computed(() => {
  return availableFriendsForGroup.value.filter((friend) => friend.selected)
    .length;
});

const toggleFriendSelection = (id: string) => {
  const index = availableFriendsForGroup.value.findIndex(
    (friend) => friend.id === id
  );
  if (index !== -1) {
    availableFriendsForGroup.value[index].selected =
      !availableFriendsForGroup.value[index].selected;
  }
};

const handleAddFriend = async () => {
  try {
    // Menggunakan fungsi addFriendByUsername yang telah diperbaiki
    // alih-alih sendFriendRequest
    isAddingFriend.value = true; // Set loading state
    await friendsStore.addFriendByUsername(friendUsername.value);
    $toast.success(`Friend request sent to: ${friendUsername.value}`);
    
    // Refresh permintaan pertemanan untuk menampilkan permintaan yang baru dikirim
    await friendsStore.getPendingRequests();
    console.log('[MessagesList] Refreshed pending requests after adding friend');
    
    friendUsername.value = "";
    showAddFriendPopup.value = false;
  } catch (err: any) {
    $toast.error(err.message || "Failed to send friend request");
  } finally {
    isAddingFriend.value = false; // Reset loading state
  }
};

const handleCreateGroup = async () => {
  try {
    const selectedFriendIds = availableFriendsForGroup.value
      .filter((friend) => friend.selected)
      .map((friend) => friend.id);

    await groupsStore.createGroup({
      name: groupName.value,
      description: groupDescription.value,
      members: selectedFriendIds,
    });

    $toast.success(`Group "${groupName.value}" created successfully!`);

    // Reset form data
    groupName.value = "";
    groupDescription.value = "";
    availableFriendsForGroup.value.forEach(
      (friend) => (friend.selected = false)
    );

    // Close popup and refresh data
    showCreateGroupPopup.value = false;
    await refreshData();
  } catch (err: any) {
    $toast.error(err.message || "Failed to create group");
  }
};

// Function to open the appropriate popup based on selection
const handleOption = (option: "friend" | "group") => {
  showNewChatPopup.value = false;
  if (option === "friend") {
    showAddFriendPopup.value = true;
  } else {
    showCreateGroupPopup.value = true;
  }
};

// Load data on component mount
onMounted(async () => {
  await refreshData();

  // Initial fetch of unread counts
  await fetchUnreadCounts();

  // Listen for real-time unread count updates via WebSocket
  eventBus.on("unread-counts-updated", handleUnreadCountsUpdated);

  // Make sure we're connected to WebSocket
  if (!webSocketStore.isConnected && !webSocketStore.isConnecting) {
    webSocketStore.connect();
  }

  // Subscribe to unread counts
  if (webSocketStore.isConnected) {
    webSocketStore.subscribeToUnreadCounts();
  }

  // Watch for WebSocket connection to subscribe when connected
  unsubscribeConnectionWatch = watch(
    () => webSocketStore.isConnected,
    (isConnected) => {
      if (isConnected) {
        webSocketStore.subscribeToUnreadCounts();
      }
    }
  );
});

// Listen for WebSocket messages and update UI accordingly
const handleUnreadCountsUpdated = (unreadCounts: UnreadCountInfo[]) => {
  console.log("Received real-time unread counts update:", unreadCounts);

  // Update message items with unread counts
  messages.value = messages.value.map((message) => {
    // Check if this conversation has unread messages
    const conversationId = message.id;
    const conversationType = message.type;

    // Find matching unread count in the update
    const unreadInfo = unreadCounts.find(
      (item) =>
        (conversationType === "friend" && item.user_id === conversationId) ||
        (conversationType === "group" && item.group_id === conversationId)
    );

    if (unreadInfo) {
      return {
        ...message,
        unreadCount: unreadInfo.count,
      };
    }

    return message;
  });
};

// Cleanup on component unmount
onUnmounted(() => {
  // Remove event listeners
  eventBus.off("unread-counts-updated", handleUnreadCountsUpdated);

  // Clean up watch if it exists
  if (unsubscribeConnectionWatch) {
    unsubscribeConnectionWatch();
  }
});

// Function to refresh both friends and groups data
async function refreshData() {
  isLoading.value = true;
  error.value = null;

  try {
    // Load data in parallel
    const [groupsResponse, friendsResponse] = await Promise.all([
      groupsStore.getGroups(),
      friendsStore.getFriends(),
    ]);

    // Transform and combine the data
    const groupMessages = transformGroupsToMessages(groupsStore.groups);
    const friendMessages = transformFriendsToMessages(friendsStore.friends);

    // Update our messages list
    messages.value = [...groupMessages, ...friendMessages];
  } catch (err: any) {
    error.value = err.message || "Failed to load messages";
    console.error("Error loading messages data:", err);
  } finally {
    isLoading.value = false;
  }
}

// Get unread counts from server
async function fetchUnreadCounts() {
  try {
    const response = await messagesStore.getUnreadCount();

    if (response.data) {
      // Update message items with unread counts
      messages.value = messages.value.map((message) => {
        // Check if this conversation has unread messages
        const conversationId = message.id;
        const conversationType = message.type;

        // Find matching unread count in the response
        const unreadInfo = response.data.find(
          (item: UnreadCountInfo) =>
            (conversationType === "friend" &&
              item.user_id === conversationId) ||
            (conversationType === "group" && item.group_id === conversationId)
        );

        if (unreadInfo) {
          return {
            ...message,
            unreadCount: unreadInfo.count,
          };
        }

        return message;
      });
    }
  } catch (error) {
    console.error("Error fetching unread counts:", error);
  }
}

// Watch for changes in friendSearchQuery and debounce the search
const debounceFriendSearch = debounce(async () => {
  if (!friendSearchQuery.value.trim()) {
    friendSearchResults.value = [];
    isSearchingFriends.value = false;
    return;
  }

  isSearchingFriends.value = true;

  try {
    const results = await friendsStore.searchFriends(friendSearchQuery.value);
    friendSearchResults.value = results;
  } catch (err: any) {
    $toast.error(err.message || "Failed to search for friends");
  } finally {
    isSearchingFriends.value = false;
  }
}, 300);

// Send friend request by user ID
const sendFriendRequest = async (userId: string) => {
  try {
    const user = friendSearchResults.value.find((u) => u.id === userId);

    // If we can't find the user in search results, this shouldn't happen but just in case
    if (!user) {
      $toast.error("User not found");
      return;
    }

    await friendsStore.sendFriendRequest(userId);
    $toast.success("Friend request sent!");
  } catch (err: any) {
    $toast.error(err.message || "Failed to send friend request");
  }
};

// Get friend status from presence service
const getFriendStatus = (friendId: string) => {
  const status = presence.getStatus(friendId);
  // Handle all possible status values
  if (status === "online") return "online";
  if (status === "busy") return "busy";
  if (status === "away") return "away";
  return "offline"; // Default fallback
};
</script>
