<template>
  <div class="h-full flex flex-col p-6 bg-white">
    <!-- Header with title and action buttons -->
    <div class="mb-6 flex justify-between items-center">
      <div class="flex items-center">
        <h1 class="text-xl font-bold text-gray-800">Messages</h1>
        <button
          @click="refreshData"
          :disabled="isRefreshing"
          class="ml-2 p-1.5 text-gray-400 hover:text-blue-500 rounded-full focus:outline-none transition-colors"
          title="Refresh Messages"
        >
          <Icon
            name="lucide:refresh-cw"
            class="h-4 w-4"
            :class="{ 'animate-spin': isRefreshing }"
          />
        </button>
        <!-- Auto-refresh indicator -->
        <div
          v-if="autoRefreshEnabled"
          class="ml-2 flex items-center text-xs text-green-600"
          :title="`Auto-refresh enabled. Last refresh: ${lastRefreshTime}`"
        >
          <div
            class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"
          ></div>
          <span class="hidden sm:inline">Auto</span>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <!-- Auto-refresh toggle button -->
        <button
          @click="toggleAutoRefresh"
          :class="`p-1.5 rounded-full focus:outline-none transition-colors ${
            autoRefreshEnabled
              ? 'text-green-500 hover:text-green-600'
              : 'text-gray-400 hover:text-gray-500'
          }`"
          :title="
            autoRefreshEnabled ? 'Disable Auto-refresh' : 'Enable Auto-refresh'
          "
        >
          <Icon
            :name="
              autoRefreshEnabled ? 'lucide:refresh-cw' : 'lucide:pause-circle'
            "
            class="h-4 w-4"
          />
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
    <div v-else class="flex-1 overflow-auto">
      <!-- Empty state -->
      <div
        v-if="filteredMessages.length === 0"
        class="h-full flex flex-col items-center justify-center text-center p-6"
      >
        <Icon name="fa:envelope" class="h-12 w-12 text-gray-300 mb-3" />
        <p class="text-gray-500 font-medium">No conversations yet</p>
        <p class="text-sm text-gray-400 mt-2">
          Start chatting with friends or groups to see them here
        </p>
      </div>

      <!-- Messages list -->
      <div v-else class="space-y-3">
        <NuxtLink
          v-for="message in sortedMessages"
          :key="message.id"
          :to="buildMessageUrl(message)"
        >
          <div
            :class="`flex items-start p-4 rounded-lg transition-colors ${
              isCurrentlyActive(message)
                ? 'bg-blue-50 border border-blue-100'
                : 'hover:bg-gray-50'
            }`"
          >
            <!-- Avatar with status -->
            <div class="relative">
              <OptimizedAvatar
                :src="message.sender?.profile_picture_url"
                :alt="message.sender?.name || 'User'"
                size="md"
                class="mr-3 flex-shrink-0"
                :fallback-icon="
                  message.type === 'friend' ? 'fa:user' : 'fa:users'
                "
              />
              <!-- Status indicator (only for friends) -->
              <div
                v-if="message.type === 'friend'"
                :class="`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  getUserStatus(message.id) === 'online'
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                }`"
              ></div>
            </div>

            <!-- Message content -->
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <h3 class="font-medium text-gray-900 truncate text-sm">
                  {{ message.sender?.name }}
                </h3>
                <span class="text-xs text-gray-500 ml-1 whitespace-nowrap">
                  {{ message.timestamp }}
                </span>
              </div>

              <div class="flex justify-between items-start mt-1">
                <div class="flex-1 relative">
                  <!-- Show typing indicator when active -->
                  <p
                    v-if="message.isTyping"
                    class="text-xs text-blue-500 truncate flex items-center"
                  >
                    <span class="mr-1">Typing</span>
                    <span class="flex">
                      <Icon
                        name="fa:circle"
                        class="animate-pulse h-1 w-1 mx-0.5"
                      />
                      <Icon
                        name="fa:circle"
                        class="animate-pulse h-1 w-1 mx-0.5"
                        style="animation-delay: 100ms"
                      />
                      <Icon
                        name="fa:circle"
                        class="animate-pulse h-1 w-1 mx-0.5"
                        style="animation-delay: 200ms"
                      />
                    </span>
                  </p>
                  <p v-else class="text-xs text-gray-600 truncate">
                    {{ formatMessageContent(message) }}
                  </p>
                </div>

                <!-- Unread count badge -->
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
      <div class="bg-white rounded-lg shadow-lg p-6 w-96 max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Start New Chat</h3>
          <button
            @click="showNewChatPopup = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <Icon name="fa:times" class="h-5 w-5" />
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
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Username</label
          >
          <input
            type="text"
            v-model="friendUsername"
            placeholder="Enter username"
            class="w-full p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div class="flex justify-end">
          <button
            @click="showAddFriendPopup = false"
            class="px-4 py-2 mr-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleAddFriend"
            :disabled="!friendUsername.trim() || isAddingFriend"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
          >
            <div v-if="isAddingFriend" class="flex items-center">
              <div
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
              ></div>
              Adding...
            </div>
            <span v-else>Add Friend</span>
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
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Group Name</label
          >
          <input
            type="text"
            v-model="groupName"
            placeholder="Enter group name"
            class="w-full p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Description</label
          >
          <textarea
            v-model="groupDescription"
            placeholder="Enter group description"
            class="w-full p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
            rows="2"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Select Friends</label
          >
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
              <OptimizedAvatar
                :src="friend.profile_picture_url"
                :alt="friend.name"
                size="sm"
                class="mr-2 flex-shrink-0"
                fallback-icon="fa:user"
              />
              <div class="flex-1">
                <p class="font-medium text-sm text-black">{{ friend.name }}</p>
                <p class="text-gray-700 text-xs">@{{ friend.username }}</p>
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
            :disabled="!groupName.trim() || !selectedFriendsCount"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useGroupsStore } from "~/composables/useGroups";
import { useFriendsStore } from "~/composables/useFriends";
import { useMessagesStore } from "~/composables/useMessages";
import { usePresence } from "~/composables/usePresence";
import { useWebSocket } from "~/composables/useWebSocket";
import { eventBus } from "~/composables/useEventBus";
import type { WatchStopHandle } from "vue";
import { useAuthStore } from "~/composables/useAuth";
import { formatMessageTimestamp } from "~/utils/timestampHelper";

// Get current user from auth store
const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);
const route = useRoute();
const { $toast } = useNuxtApp();

// Types
type TabType = "all" | "friends" | "groups";
type MessageType = "friend" | "group";
type NewChatType = "friend" | "group";
type UserStatus = "online" | "offline";
type ReadStatus = "read" | "delivered" | "sent" | "unread";

interface Sender {
  id?: string;
  name: string;
  avatar?: string;
  profile_picture_url?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  status?: UserStatus;
}

// Enhanced Message interface matching React implementation
interface Message {
  id: string;
  sender: Sender;
  recipient?: {
    id: string;
    name: string;
    profile_picture_url?: string;
  };
  content: string;
  timestamp: string;
  formattedTime?: string;
  readStatus?: ReadStatus;
  unreadCount?: number;
  type: MessageType;
  lastActivity?: string;
  isTyping?: boolean;
  hasMessages?: boolean;
  memberCount?: number; // For groups
}

// Enhanced Friend interface
interface Friend {
  id: string;
  name: string;
  username: string;
  email?: string;
  profile_picture_url?: string;
  avatar?: string;
  status?: UserStatus;
  first_name?: string;
  last_name?: string;
  last_message?: any;
  unread_count?: number;
  selected?: boolean;
  last_active?: string;
  full_name?: string;
  display_name?: string;
}

// Enhanced Group interface
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

// Initialize stores and composables
const groupsStore = useGroupsStore();
const friendsStore = useFriendsStore();
const messagesStore = useMessagesStore();
const presence = usePresence();
const webSocket = useWebSocket();

// State refs
const messages = ref<Message[]>([]);
const friends = ref<Friend[]>([]);
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
const isRefreshing = ref(false);
const isTyping = ref<Record<string, boolean>>({});
const friendSelections = ref<Record<string, boolean>>({});
const unsubscribeConnectionWatch = ref<WatchStopHandle | null>(null);

// Auto-refresh state
const autoRefreshEnabled = ref(false);
const lastRefreshTime = ref("");
const autoRefreshInterval = ref<NodeJS.Timeout | null>(null);
const refreshAttempts = ref(0);
const maxRefreshAttempts = ref(50);
const isTabVisible = ref(true);

// Computed properties
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
    filtered = filtered.filter((message) => {
      const nameMatch = message.sender.name.toLowerCase().includes(query);
      const contentMatch = message.content.toLowerCase().includes(query);
      return nameMatch || contentMatch;
    });
  }

  return filtered;
});

// Sort messages with React-like logic - prioritize by messages with content, then by activity
const sortedMessages = computed(() => {
  return [...filteredMessages.value].sort((a, b) => {
    // First, prioritize messages with unread counts
    if (a.unreadCount && !b.unreadCount) return -1;
    if (!a.unreadCount && b.unreadCount) return 1;

    // Then prioritize by whether they have messages
    const aHasMessages = a.hasMessages ? 1 : 0;
    const bHasMessages = b.hasMessages ? 1 : 0;

    if (aHasMessages !== bHasMessages) {
      return bHasMessages - aHasMessages; // Those with messages first
    }

    // Finally sort by last activity time (most recent first)
    const aTime = new Date(a.lastActivity || a.timestamp || "").getTime();
    const bTime = new Date(b.lastActivity || b.timestamp || "").getTime();
    return bTime - aTime;
  });
});

// Computed property for available friends for group creation
const availableFriendsForGroup = computed(() => {
  return friendsStore.friends.map((friend) => {
    const typedFriend = friend as unknown as Friend;
    return {
      ...friend,
      name: buildFriendName(typedFriend),
      selected: !!friendSelections.value[friend.id],
    };
  });
});

// Count of selected friends for group creation
const selectedFriendsCount = computed(() => {
  return Object.values(friendSelections.value).filter(Boolean).length;
});

// Helper function to build friend display name
const buildFriendName = (friend: Friend): string => {
  if (friend.first_name && friend.last_name) {
    return `${friend.first_name} ${friend.last_name}`;
  } else if (friend.full_name) {
    return friend.full_name;
  } else if (friend.display_name) {
    return friend.display_name;
  } else if (friend.name) {
    return friend.name;
  } else if (friend.username) {
    return friend.username;
  } else {
    return "User";
  }
};

// Helper function to format timestamps using centralized helper
const formatTimestamp = (timestamp: string | undefined): string => {
  if (!timestamp) return "Never";
  return formatMessageTimestamp({ timestamp, format: "relative" });
};

// Function to get last message for a conversation (matching React implementation)
const getLastMessageForConversation = async (
  conversationId: string,
  type: "friend" | "group"
) => {
  try {
    if (type === "group") {
      const response = await groupsStore.getGroupMessages(conversationId, 1, 1);
      if (response && response.data && response.data.length > 0) {
        return response.data[0];
      }
    } else {
      const response = await messagesStore.getMessages({
        target_id: conversationId,
        type: "private",
        limit: 1,
        page: 1,
      });
      if (response && response.data && response.data.length > 0) {
        return response.data[0];
      }
    }
    return null;
  } catch (error) {
    console.error(
      `[MessagesList] Failed to get last message for ${type} ${conversationId}:`,
      error
    );
    return null;
  }
};

// Enhanced data transformation functions matching React implementation
const transformGroupsToMessages = async (groups: any[]): Promise<Message[]> => {
  const validGroups = await Promise.all(
    groups
      .filter((group) => group && group.id)
      .map(async (group) => {
        let lastMessage = group.last_message || {};

        console.log(
          `[MessagesList] Group ${group.name || group.id} last_message:`,
          lastMessage
        );

        // If no last_message from group data, try to fetch from messages API
        if (!lastMessage || !Object.keys(lastMessage).length) {
          lastMessage = await getLastMessageForConversation(group.id, "group");
        }

        let messageContent = "";
        let hasMessage = false;

        if (lastMessage && typeof lastMessage === "object") {
          messageContent =
            lastMessage.content ||
            lastMessage.message_content ||
            lastMessage.text ||
            lastMessage.message ||
            "";

          hasMessage = !!(messageContent && messageContent.trim() !== "");
        }

        const lastActivity =
          lastMessage?.sent_at ||
          lastMessage?.created_at ||
          group.updated_at ||
          group.created_at ||
          new Date().toISOString();

        let content;
        if (hasMessage) {
          content = lastMessage.sender_name
            ? `${lastMessage.sender_name}: ${messageContent}`
            : messageContent;
        } else {
          content = "No messages yet";
        }

        return {
          id: group.id,
          sender: {
            name: group.name || "Unnamed Group",
            profile_picture_url:
              group.avatar_url || group.profile_picture_url || null,
            id: group.id,
          },
          content: content,
          timestamp: hasMessage
            ? formatTimestamp(lastMessage.sent_at || lastMessage.created_at)
            : "",
          formattedTime: formatTimestamp(lastActivity),
          readStatus:
            group.unread_count && group.unread_count > 0
              ? ("unread" as ReadStatus)
              : ("read" as ReadStatus),
          unreadCount:
            group.unread_count && group.unread_count > 0
              ? group.unread_count
              : undefined,
          type: "group" as MessageType,
          lastActivity,
          isTyping: false,
          hasMessages: hasMessage,
          memberCount: group.member_count,
        } as Message;
      })
  );

  return validGroups.sort((a, b) => {
    const aHasMessages = a.hasMessages ? 1 : 0;
    const bHasMessages = b.hasMessages ? 1 : 0;

    if (aHasMessages !== bHasMessages) {
      return bHasMessages - aHasMessages;
    }

    const aTime = new Date(a.lastActivity || "").getTime();
    const bTime = new Date(b.lastActivity || "").getTime();
    return bTime - aTime;
  });
};

const transformFriendsToMessages = async (
  friends: any[]
): Promise<Message[]> => {
  const friendMessages = await Promise.all(
    friends.map(async (friend) => {
      const userId = friend.id;
      const friendStatus = presence.getStatus(userId);
      let lastMessage = friend.last_message;

      console.log(
        `[MessagesList] Friend ${
          friend.username || friend.name || friend.id
        } last_message:`,
        lastMessage
      );

      if (!lastMessage || !Object.keys(lastMessage).length) {
        lastMessage = await getLastMessageForConversation(friend.id, "friend");
      }

      let messageContent = "";
      let hasMessage = false;

      if (lastMessage && typeof lastMessage === "object") {
        messageContent =
          lastMessage.content ||
          lastMessage.message_content ||
          lastMessage.text ||
          lastMessage.message ||
          "";

        hasMessage = !!(messageContent && messageContent.trim() !== "");
      }

      const lastActivity =
        friend.last_active ||
        lastMessage?.sent_at ||
        lastMessage?.created_at ||
        friend.created_at ||
        new Date().toISOString();

      const displayName = buildFriendName(friend);

      return {
        id: friend.id,
        sender: {
          name: displayName,
          profile_picture_url: friend.profile_picture_url || null,
          id: friend.id,
          status:
            friendStatus === "online"
              ? ("online" as UserStatus)
              : ("offline" as UserStatus),
        },
        content: hasMessage ? messageContent : "No messages yet",
        timestamp: hasMessage
          ? formatTimestamp(lastMessage.sent_at || lastMessage.created_at)
          : friendStatus === "online"
          ? "Online"
          : "Offline",
        formattedTime: formatTimestamp(lastActivity),
        readStatus:
          friend.unread_count && friend.unread_count > 0
            ? ("unread" as ReadStatus)
            : ("read" as ReadStatus),
        unreadCount:
          friend.unread_count && friend.unread_count > 0
            ? friend.unread_count
            : undefined,
        type: "friend" as MessageType,
        lastActivity,
        isTyping: isTyping.value[userId] || false,
        hasMessages: hasMessage,
      };
    })
  );

  return friendMessages.sort((a, b) => {
    const aHasMessages = a.hasMessages ? 1 : 0;
    const bHasMessages = b.hasMessages ? 1 : 0;

    if (aHasMessages !== bHasMessages) {
      return bHasMessages - aHasMessages;
    }

    const aTime = new Date(a.lastActivity).getTime();
    const bTime = new Date(b.lastActivity).getTime();
    return bTime - aTime;
  });
};

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
    friendSelections.value = {};
  }
};

// Add friend handler
const handleAddFriend = async () => {
  if (!friendUsername.value.trim()) {
    $toast.error("Please enter a username");
    return;
  }

  isAddingFriend.value = true;
  try {
    await friendsStore.sendFriendRequest(friendUsername.value.trim());
    $toast.success(`Friend request sent to ${friendUsername.value}`);
    showAddFriendPopup.value = false;
    friendUsername.value = "";
  } catch (err: any) {
    $toast.error(err.message || "Failed to send friend request");
  } finally {
    isAddingFriend.value = false;
  }
};

// Create group handler
const handleCreateGroup = async () => {
  if (!groupName.value.trim()) {
    $toast.error("Please enter a group name");
    return;
  }

  const selectedFriendIds = Object.entries(friendSelections.value)
    .filter(([_, selected]) => selected)
    .map(([id]) => id);

  if (selectedFriendIds.length === 0) {
    $toast.error("Please select at least one friend");
    return;
  }

  try {
    await groupsStore.createGroup({
      name: groupName.value.trim(),
      description: groupDescription.value.trim(),
      members: selectedFriendIds,
    });

    $toast.success(`Group "${groupName.value}" created successfully!`);
    showCreateGroupPopup.value = false;

    // Reset form
    groupName.value = "";
    groupDescription.value = "";
    friendSelections.value = {};

    // Refresh data to show the new group
    await refreshData();
  } catch (err: any) {
    $toast.error(err.message || "Failed to create group");
  }
};

// Auto-refresh functionality
const toggleAutoRefresh = () => {
  autoRefreshEnabled.value = !autoRefreshEnabled.value;

  if (autoRefreshEnabled.value) {
    startAutoRefresh();
    $toast.success("Auto-refresh enabled");
  } else {
    stopAutoRefresh();
    $toast.info("Auto-refresh disabled");
  }
};

const startAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value);
  }

  const intervalTime =
    refreshAttempts.value >= maxRefreshAttempts.value ? 60000 : 30000; // 30s or 60s

  autoRefreshInterval.value = setInterval(() => {
    if (isTabVisible.value && autoRefreshEnabled.value) {
      performAutoRefresh();
    }
  }, intervalTime);
};

const stopAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value);
    autoRefreshInterval.value = null;
  }
};

const performAutoRefresh = async () => {
  if (isRefreshing.value) return;

  try {
    refreshAttempts.value++;
    await refreshData();
    lastRefreshTime.value = new Date().toLocaleTimeString();

    // Restart interval if we hit max attempts (switch to slower interval)
    if (
      refreshAttempts.value >= maxRefreshAttempts.value &&
      autoRefreshEnabled.value
    ) {
      startAutoRefresh();
    }
  } catch (error) {
    console.error("[MessagesList] Auto-refresh failed:", error);

    // Stop auto-refresh on repeated failures
    if (refreshAttempts.value >= maxRefreshAttempts.value * 2) {
      stopAutoRefresh();
      autoRefreshEnabled.value = false;
      $toast.error("Auto-refresh stopped due to repeated failures");
    }
  }
};

const handleVisibilityChange = () => {
  isTabVisible.value = !document.hidden;

  if (isTabVisible.value && autoRefreshEnabled.value) {
    // Refresh immediately when tab becomes visible
    performAutoRefresh();
  }
};

// Initialize auto-refresh on fresh login
const initializeAutoRefreshOnLogin = () => {
  try {
    const freshLogin = sessionStorage.getItem("freshLogin");
    if (freshLogin === "true") {
      // Clear the flag
      sessionStorage.removeItem("freshLogin");

      // Enable auto-refresh
      autoRefreshEnabled.value = true;
      startAutoRefresh();
      lastRefreshTime.value = new Date().toLocaleTimeString();

      $toast.success("Auto-refresh enabled after login");
    }
  } catch (error) {
    console.error("[MessagesList] Failed to initialize auto-refresh:", error);
  }
};

// Enhanced refresh data function
const refreshData = async () => {
  const isInitialLoad = !messages.value.length;

  if (isInitialLoad) {
    isLoading.value = true;
  } else {
    isRefreshing.value = true;
  }

  error.value = null;

  try {
    // Fetch friends and groups in parallel
    await Promise.all([friendsStore.getFriends(), groupsStore.getGroups()]);

    // Transform and combine the data
    const friendMessages = await transformFriendsToMessages(
      friendsStore.friends || []
    );
    const groupMessages = await transformGroupsToMessages(
      groupsStore.groups || []
    );

    messages.value = [...friendMessages, ...groupMessages];

    console.log("[MessagesList] Data refresh completed", {
      friendMessages: friendMessages.length,
      groupMessages: groupMessages.length,
      total: messages.value.length,
    });
  } catch (err: any) {
    error.value = err.message || "Failed to load conversations";
    console.error("Error loading conversations data:", err);
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
};

// Helper function to get user status
const getUserStatus = (userId: string): UserStatus => {
  return presence.getStatus(userId) === "online" ? "online" : "offline";
};

// Helper function to check if message is currently active
const isCurrentlyActive = (message: Message): boolean => {
  const currentPath = route.path;
  const expectedPath = `/chat/messages/${message.id}`;

  if (message.type === "group") {
    return currentPath === expectedPath && route.query.type === "group";
  } else {
    return currentPath === expectedPath && route.query.type !== "group";
  }
};

// Helper function to build message URL
const buildMessageUrl = (message: Message): string => {
  const baseUrl = `/chat/messages/${message.id}`;

  if (message.type === "group") {
    return `${baseUrl}?type=group&name=${encodeURIComponent(
      message.sender.name
    )}`;
  } else {
    return `${baseUrl}?name=${encodeURIComponent(message.sender.name)}`;
  }
};

// Helper function to format message content for display
const formatMessageContent = (message: Message): string => {
  if (!message.content || message.content.trim() === "") {
    return message.type === "friend"
      ? "No messages yet"
      : "No messages in this group";
  }

  return message.content;
};

// WebSocket handling for real-time updates (matching React implementation)
const handleWebSocketUpdates = () => {
  if (webSocket.isConnected) {
    // Handle presence updates
    watch(
      () => presence.userStatuses,
      () => {
        // Update typing indicators and statuses
        messages.value = messages.value.map((message) => {
          if (message.type === "friend") {
            const status = getUserStatus(message.id);
            return {
              ...message,
              sender: {
                ...message.sender,
                status,
              },
              isTyping: isTyping.value[message.id] || false,
            };
          }
          return message;
        });
      }
    );

    // Subscribe to new message events
    eventBus.on("private-message", () => {
      refreshData();
    });

    eventBus.on("group-message", () => {
      refreshData();
    });

    eventBus.on("refresh-messages", () => {
      refreshData();
    });
  }
};

// Lifecycle hooks
onMounted(async () => {
  try {
    await refreshData();
    handleWebSocketUpdates();

    // Initialize auto-refresh on fresh login
    initializeAutoRefreshOnLogin();

    // Add visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Watch for websocket connection changes
    unsubscribeConnectionWatch.value = watch(
      () => webSocket.isConnected,
      async (newValue) => {
        if (newValue) {
          await refreshData();
          handleWebSocketUpdates();
        }
      }
    );
  } catch (err) {
    error.value = "Failed to initialize messages. Please try refreshing.";
  }
});

onUnmounted(() => {
  // Clean up event listeners
  eventBus.off("private-message");
  eventBus.off("group-message");
  eventBus.off("refresh-messages");

  // Clean up auto-refresh
  stopAutoRefresh();
  document.removeEventListener("visibilitychange", handleVisibilityChange);

  if (unsubscribeConnectionWatch.value) {
    unsubscribeConnectionWatch.value();
  }
});

// Watch for friend and group store updates (React-like effect)
watch(
  () => friendsStore.friends,
  async (newFriends) => {
    if (newFriends && Array.isArray(newFriends)) {
      const friendMessages = await transformFriendsToMessages(newFriends);
      messages.value = [
        ...messages.value.filter((msg) => msg.type !== "friend"),
        ...friendMessages,
      ];
    }
  },
  { immediate: true }
);

watch(
  () => groupsStore.groups,
  async (newGroups) => {
    if (newGroups && Array.isArray(newGroups)) {
      const groupMessages = await transformGroupsToMessages(newGroups);
      messages.value = [
        ...messages.value.filter((msg) => msg.type !== "group"),
        ...groupMessages,
      ];
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* Add any component-specific styles here */
.animate-delay-100 {
  animation-delay: 100ms;
}

.animate-delay-200 {
  animation-delay: 200ms;
}
</style>
