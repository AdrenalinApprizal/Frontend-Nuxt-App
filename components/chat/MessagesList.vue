<template>
  <div class="h-full flex flex-col p-6 bg-white">
    <!-- Header with title and notification button -->
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-xl font-bold text-gray-800">Messages</h1>
      <NotificationDropdown />
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
const isTyping = ref<Record<string, boolean>>({});
const friendSelections = ref<Record<string, boolean>>({});
const unsubscribeConnectionWatch = ref<WatchStopHandle | null>(null);

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

    // For messages with same message status, sort by timestamp priority like React
    const getTimePriority = (timestamp: string) => {
      if (!timestamp) return 10;
      if (timestamp.includes("now") || timestamp.includes("Just now")) return 1;
      if (timestamp.includes("minute")) return 2;
      if (timestamp.includes("hour")) return 3;
      if (timestamp.includes("day")) return 4;
      if (timestamp.includes("week")) return 5;
      if (timestamp === "Online") return 6;
      if (timestamp === "Offline") return 7;
      return 8;
    };

    // Use timestamp priority for sorting
    const aPriority = getTimePriority(a.timestamp);
    const bPriority = getTimePriority(b.timestamp);

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
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
    console.log(
      `[MessagesList] Fetching last message for ${type} ${conversationId}`
    );

    if (type === "group") {
      // For groups, use the group messages API
      const response = await groupsStore.getGroupMessages(conversationId, 1, 1);
      console.log(
        `[MessagesList] Group messages response for ${conversationId}:`,
        response
      );

      // Handle different response structures
      let messagesArray = null;
      if (response && Array.isArray(response)) {
        messagesArray = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        messagesArray = response.data;
      } else if (
        response &&
        (response as any).messages &&
        Array.isArray((response as any).messages)
      ) {
        messagesArray = (response as any).messages;
      }

      if (messagesArray && messagesArray.length > 0) {
        const lastMessage = messagesArray[0];
        console.log(
          `[MessagesList] Found last message for group ${conversationId}:`,
          lastMessage
        );
        return lastMessage;
      }
    } else {
      // For friends, use the unified messages API with correct type
      const response = await messagesStore.getMessages({
        target_id: conversationId,
        type: "private",
        limit: 1,
        page: 1,
      });
      console.log(
        `[MessagesList] Friend messages response for ${conversationId}:`,
        response
      );

      // Handle different response structures
      let messagesArray = null;
      if (response && Array.isArray(response)) {
        messagesArray = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        messagesArray = response.data;
      } else if (
        response &&
        (response as any).messages &&
        Array.isArray((response as any).messages)
      ) {
        messagesArray = (response as any).messages;
      }

      if (messagesArray && messagesArray.length > 0) {
        const lastMessage = messagesArray[0];
        console.log(
          `[MessagesList] Found last message for friend ${conversationId}:`,
          lastMessage
        );
        return lastMessage;
      } else {
        // Try alternative methods if main method failed
        console.log(
          `[MessagesList] Main method failed for friend ${conversationId}, trying alternatives...`
        );
        const altResult = await tryAlternativeMessageFetch(
          conversationId,
          type
        );
        if (altResult) {
          console.log(
            `[MessagesList] Alternative method succeeded for friend ${conversationId}:`,
            altResult
          );
          return altResult;
        }
      }
    }

    console.log(
      `[MessagesList] No messages found for ${type} ${conversationId}`
    );
    return null;
  } catch (error) {
    console.error(
      `[MessagesList] Failed to get last message for ${type} ${conversationId}:`,
      error
    );

    // Try alternative methods on error
    if (type === "friend") {
      console.log(
        `[MessagesList] Trying alternatives after error for friend ${conversationId}...`
      );
      const altResult = await tryAlternativeMessageFetch(conversationId, type);
      if (altResult) {
        console.log(
          `[MessagesList] Alternative method succeeded after error for friend ${conversationId}:`,
          altResult
        );
        return altResult;
      }
    }

    return null;
  }
};

// Helper function to try alternative methods for getting messages
const tryAlternativeMessageFetch = async (
  conversationId: string,
  type: "friend" | "group"
) => {
  try {
    console.log(
      `[MessagesList] Trying alternative fetch for ${type} ${conversationId}`
    );

    if (type === "friend") {
      // Try different API endpoints or parameters
      const alternatives = [
        // Try with group type (sometimes friend messages are returned as group type)
        () =>
          messagesStore.getMessages({
            target_id: conversationId,
            type: "group",
            limit: 1,
            page: 1,
          }),
        // Try with different page
        () =>
          messagesStore.getMessages({
            target_id: conversationId,
            type: "private",
            limit: 5,
            page: 1,
          }),
      ];

      for (const [index, altMethod] of alternatives.entries()) {
        try {
          console.log(
            `[MessagesList] Trying alternative ${
              index + 1
            } for friend ${conversationId}`
          );
          const response = await altMethod();

          if (
            response &&
            ((response.data && response.data.length > 0) ||
              (Array.isArray(response) && response.length > 0))
          ) {
            const messagesArray = Array.isArray(response)
              ? response
              : response.data;
            console.log(
              `[MessagesList] Alternative ${
                index + 1
              } succeeded for friend ${conversationId}:`,
              messagesArray[0]
            );
            return messagesArray[0];
          }
        } catch (altError) {
          console.log(
            `[MessagesList] Alternative ${
              index + 1
            } failed for friend ${conversationId}:`,
            altError
          );
        }
      }
    }

    console.log(
      `[MessagesList] All alternatives failed for ${type} ${conversationId}`
    );
    return null;
  } catch (error) {
    console.error(
      `[MessagesList] Alternative fetch failed for ${type} ${conversationId}:`,
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
          `[MessagesList] Group ${
            group.name || group.id
          } initial last_message:`,
          lastMessage
        );

        // If no last_message from group data, try to fetch from messages API
        if (!lastMessage || !Object.keys(lastMessage).length) {
          console.log(
            `[MessagesList] No last_message for group ${
              group.name || group.id
            }, fetching from API...`
          );
          lastMessage = await getLastMessageForConversation(group.id, "group");
        }

        let messageContent = "";
        let hasMessage = false;

        if (lastMessage && typeof lastMessage === "object") {
          // Try multiple possible content fields for groups
          messageContent =
            lastMessage.content ||
            lastMessage.message_content ||
            lastMessage.text ||
            lastMessage.message ||
            lastMessage.body ||
            "";

          // Also check if the content is actually a string and not empty
          if (typeof messageContent === "string") {
            messageContent = messageContent.trim();
            hasMessage = messageContent.length > 0;
          }

          console.log(
            `[MessagesList] Group ${
              group.name || group.id
            } - Content: "${messageContent}", HasMessage: ${hasMessage}, LastMessage fields:`,
            {
              content: lastMessage.content,
              message_content: lastMessage.message_content,
              text: lastMessage.text,
              message: lastMessage.message,
              body: lastMessage.body,
              sender_name: lastMessage.sender_name,
              all_keys: Object.keys(lastMessage),
            }
          );
        } else {
          console.log(
            `[MessagesList] Group ${
              group.name || group.id
            } - No valid lastMessage object`
          );
        }

        const lastActivity =
          lastMessage?.sent_at ||
          lastMessage?.created_at ||
          group.updated_at ||
          group.created_at ||
          new Date().toISOString();

        // Format content properly with sender name if it's a group message
        let content;
        if (hasMessage) {
          // Include sender name in the preview if available
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
        } initial last_message:`,
        lastMessage
      );

      // If no last_message from friend data, try to fetch from messages API
      if (!lastMessage || !Object.keys(lastMessage).length) {
        console.log(
          `[MessagesList] No last_message for friend ${
            friend.username || friend.name || friend.id
          }, fetching from API...`
        );
        lastMessage = await getLastMessageForConversation(friend.id, "friend");
      }

      let messageContent = "";
      let hasMessage = false;

      if (lastMessage && typeof lastMessage === "object") {
        // Try multiple possible content fields for friends
        messageContent =
          lastMessage.content ||
          lastMessage.message_content ||
          lastMessage.text ||
          lastMessage.message ||
          lastMessage.body ||
          "";

        // Also check if the content is actually a string and not empty
        if (typeof messageContent === "string") {
          messageContent = messageContent.trim();
          hasMessage = messageContent.length > 0;
        }

        console.log(
          `[MessagesList] Friend ${
            friend.username || friend.name || friend.id
          } - Content: "${messageContent}", HasMessage: ${hasMessage}, LastMessage fields:`,
          {
            content: lastMessage.content,
            message_content: lastMessage.message_content,
            text: lastMessage.text,
            message: lastMessage.message,
            body: lastMessage.body,
            all_keys: Object.keys(lastMessage),
          }
        );
      } else {
        console.log(
          `[MessagesList] Friend ${
            friend.username || friend.name || friend.id
          } - No valid lastMessage object`
        );
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

// Handle login refresh events
const handleLoginRefresh = async (event: Event) => {
  console.log("[MessagesList] Login refresh event received, refreshing data...");
  await refreshData();
};

// Handle auth state change events  
const handleAuthStateChanged = async (event: Event) => {
  console.log("[MessagesList] Auth state changed, refreshing data...");
  const customEvent = event as CustomEvent;
  if (customEvent.detail?.authenticated) {
    await refreshData();
  }
};

// Enhanced refresh data function
const refreshData = async () => {
  const isInitialLoad = !messages.value.length;

  if (isInitialLoad) {
    isLoading.value = true;
  }

  error.value = null;

  try {
    console.log("[MessagesList] Starting data refresh...");

    // Fetch friends and groups in parallel
    await Promise.all([friendsStore.getFriends(), groupsStore.getGroups()]);

    console.log("[MessagesList] Friends and groups fetched:", {
      friends: friendsStore.friends?.length || 0,
      groups: groupsStore.groups?.length || 0,
    });

    // Only log detailed sample data in development or when needed for debugging
    if (
      process.dev &&
      friendsStore.friends &&
      friendsStore.friends.length > 0
    ) {
      console.log("[MessagesList] Sample friend data:", {
        first_friend: friendsStore.friends[0],
        friend_keys: Object.keys(friendsStore.friends[0] || {}),
        has_last_message: !!(friendsStore.friends[0] as any)?.last_message,
        last_message_content: (friendsStore.friends[0] as any)?.last_message,
      });
    }

    if (process.dev && groupsStore.groups && groupsStore.groups.length > 0) {
      console.log("[MessagesList] Sample group data:", {
        first_group: groupsStore.groups[0],
        group_keys: Object.keys(groupsStore.groups[0] || {}),
        has_last_message: !!(groupsStore.groups[0] as any)?.last_message,
        last_message_content: (groupsStore.groups[0] as any)?.last_message,
      });
    }

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
      messagesWithContent: messages.value.filter((m) => m.hasMessages).length,
      sampleMessages: messages.value.slice(0, 3).map((m) => ({
        name: m.sender.name,
        content: m.content,
        hasMessages: m.hasMessages,
        type: m.type,
      })),
    });
  } catch (err: any) {
    error.value = err.message || "Failed to load conversations";
    console.error("Error loading conversations data:", err);
  } finally {
    isLoading.value = false;
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

  // If the message already contains sender info (for groups), return as is
  if (message.type === "group" && message.content.includes(":")) {
    return message.content;
  }

  // For individual messages, just return the content
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

    // Listen for login refresh events
    if (process.client) {
      window.addEventListener('login-refresh', handleLoginRefresh);
      window.addEventListener('auth-state-changed', handleAuthStateChanged);
    }

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

  if (process.client) {
    window.removeEventListener('login-refresh', handleLoginRefresh);
    window.removeEventListener('auth-state-changed', handleAuthStateChanged);
  }

  if (unsubscribeConnectionWatch.value) {
    unsubscribeConnectionWatch.value();
  }
});

// Watch for friend and group store updates (React-like effect)
watch(
  () => friendsStore.friends,
  async (newFriends) => {
    if (newFriends && Array.isArray(newFriends)) {
      // Reduced logging - only log count
      console.log("[MessagesList] Friends store updated:", newFriends.length);
      const friendMessages = await transformFriendsToMessages(newFriends);
      messages.value = [
        ...messages.value.filter((msg) => msg.type !== "friend"),
        ...friendMessages,
      ];
    }
  },
  { immediate: false, deep: true }
);

watch(
  () => groupsStore.groups,
  async (newGroups) => {
    if (newGroups && Array.isArray(newGroups)) {
      // Reduced logging - only log count
      console.log("[MessagesList] Groups store updated:", newGroups.length);
      const groupMessages = await transformGroupsToMessages(newGroups);
      messages.value = [
        ...messages.value.filter((msg) => msg.type !== "group"),
        ...groupMessages,
      ];
    }
  },
  { immediate: false, deep: true }
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
