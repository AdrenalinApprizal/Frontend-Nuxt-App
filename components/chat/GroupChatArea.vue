<template>
  <div class="h-full flex bg-gray-50">
    <!-- Main chat area -->
    <div class="flex-1 flex flex-col h-full">
      <!-- Header with group info -->
      <div
        class="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between"
      >
        <div class="flex items-center">
          <div class="relative mr-3">
            <div
              class="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center"
            >
              <img
                v-if="currentGroup?.avatar_url"
                :src="currentGroup.avatar_url"
                :alt="currentGroup?.name"
                class="h-full w-full object-cover"
              />
              <Icon v-else name="fa:users" class="h-6 w-6 text-gray-500" />
            </div>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">
              {{ currentGroup?.name || "Loading..." }}
            </h2>
            <p class="text-xs text-gray-500">{{ memberCount }} members</p>
          </div>
        </div>

        <div class="flex items-center">
          <div v-if="isLoading" class="mr-3">
            <div
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"
            ></div>
          </div>
          <button
            @click="showSearch = true"
            class="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200 mr-2"
            title="Search in conversation"
          >
            <Icon name="fa:search" class="h-4 w-4" />
          </button>
          <button
            @click="showInfo = !showInfo"
            class="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200 mr-2"
            :class="{ 'text-blue-500': showInfo }"
            title="Group info"
          >
            <Icon name="fa:info-circle" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Search component (using the new dedicated component) -->
      <SearchOnGroup
        :isOpen="showSearch"
        :groupMembers="groupMembers"
        @close="showSearch = false"
        @search="handleAdvancedSearch"
      />

      <!-- Messages container -->
      <div
        class="flex-1 overflow-auto p-6 space-y-4 relative"
        ref="messagesContainer"
      >
        <!-- Loading state -->
        <div
          v-if="groupsStore.isLoading"
          class="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80 z-10"
        >
          <div class="flex flex-col items-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
            ></div>
            <p class="mt-2 text-sm text-gray-500">Loading messages...</p>
          </div>
        </div>

        <!-- No messages placeholder -->
        <div
          v-else-if="displayMessages.length === 0"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div v-if="isSearching" class="text-center text-gray-500">
            <p class="mb-1">No matching messages found</p>
            <button @click="clearSearch" class="text-blue-500 hover:underline">
              Clear search
            </button>
          </div>
          <div v-else class="text-center text-gray-500">
            <p class="mb-1">No messages yet</p>
            <p class="text-sm">Start the conversation by sending a message</p>
          </div>
        </div>

        <!-- Load more messages button -->
        <div
          v-if="canLoadMoreMessages && displayMessages.length > 0"
          class="text-center mb-4"
        >
          <button
            @click="loadMoreMessages"
            class="px-4 py-2 text-sm bg-gray-100 text-blue-600 rounded-lg hover:bg-gray-200 transition-colors"
            :class="{ 'opacity-50 cursor-not-allowed': isLoadingMore }"
            :disabled="isLoadingMore"
          >
            <div v-if="isLoadingMore" class="flex items-center justify-center">
              <div
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"
              ></div>
              Loading...
            </div>
            <span v-else>Load earlier messages</span>
          </button>
        </div>

        <!-- Messages list -->
        <div
          v-for="message in displayMessages"
          :key="message.id"
          class="message"
        >
          <div
            :class="`flex ${
              message.isCurrentUser ? 'justify-end' : 'justify-start'
            } mb-4`"
          >
            <div v-if="!message.isCurrentUser" class="mr-2">
              <div
                class="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center"
              >
                <img
                  v-if="message.sender?.avatar"
                  :src="message.sender.avatar"
                  :alt="message.sender?.name"
                  class="h-full w-full object-cover"
                />
                <Icon v-else name="fa:user" class="h-5 w-5 text-gray-500" />
              </div>
            </div>
            <div class="flex flex-col max-w-[70%]">
              <!-- Sender name for group messages -->
              <div
                v-if="!message.isCurrentUser"
                class="text-xs text-gray-600 mb-1 ml-1"
              >
                {{ message.sender?.name }}
              </div>
              <div
                v-if="message.isCurrentUser"
                class="text-xs text-gray-600 mb-1 self-end"
              >
                You
              </div>

              <div
                :class="`rounded-lg px-4 py-2 ${
                  message.isCurrentUser
                    ? message.isDeleted
                      ? 'bg-gray-200 text-gray-500 italic'
                      : 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`"
              >
                <p class="break-words whitespace-pre-wrap">
                  {{ message.content }}
                </p>
                <div v-if="message.attachment" class="mt-2">
                  <img
                    v-if="message.attachment.type === 'image'"
                    :src="message.attachment.url"
                    :alt="message.attachment.name"
                    class="max-w-full rounded"
                  />
                  <a
                    v-else
                    :href="message.attachment.url"
                    :download="message.attachment.name"
                    class="text-blue-500 hover:underline"
                  >
                    {{ message.attachment.name }} ({{
                      message.attachment.size
                    }})
                  </a>
                </div>
                <div class="flex items-center justify-end space-x-1 mt-1">
                  <span
                    v-if="message.isEdited && !message.isDeleted"
                    :class="`text-xs ${
                      message.isCurrentUser ? 'text-white' : 'text-gray-600'
                    }`"
                  >
                    (edited)
                  </span>
                  <span
                    :class="`text-xs ${
                      message.isCurrentUser ? 'text-white' : 'text-gray-600'
                    }`"
                  >
                    {{
                      message.timestamp ||
                      formatTimestamp(message.sent_at || message.created_at)
                    }}
                  </span>
                </div>

                <!-- Message dropdown actions -->
                <div
                  v-if="message.isCurrentUser && !message.isDeleted"
                  class="relative"
                >
                  <button
                    @click="toggleDropdown(message.id)"
                    class="absolute top-0 right-0 -mt-1 -mr-8 p-1 rounded-full hover:bg-gray-200"
                    aria-label="Message options"
                  >
                    <Icon name="fa:ellipsis-v" class="h-3 w-3 text-gray-500" />
                  </button>

                  <div
                    v-if="showDropdown === message.id"
                    ref="dropdownRef"
                    class="absolute right-0 mt-1 mr-8 bg-white rounded-md shadow-lg z-10 w-36 py-1"
                  >
                    <button
                      @click="handleEditMessage(message.id)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Icon name="lucide:edit-2" class="h-4 w-4 mr-2" /> Edit
                    </button>
                    <button
                      @click="handleUnsendMessage(message.id)"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <Icon name="lucide:trash" class="h-4 w-4 mr-2" /> Unsend
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- End of messages indicator for auto-scroll -->
        <div ref="messagesEndRef"></div>
      </div>

      <!-- Message input area -->
      <div class="p-4 bg-white border-t border-gray-200">
        <div
          v-if="editingMessageId"
          class="flex items-center mb-2 bg-blue-50 p-2 rounded"
        >
          <span class="text-sm text-blue-700 flex-1"> Editing message </span>
          <button
            @click="handleCancelEdit"
            class="text-gray-600 hover:text-gray-800"
          >
            <Icon name="lucide:x" class="h-4 w-4" />
          </button>
        </div>
        <div class="flex items-center">
          <div class="relative">
            <button
              @click="isAttachmentMenuOpen = !isAttachmentMenuOpen"
              class="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200 mr-2"
              title="Attach file"
            >
              <Icon name="lucide:paperclip" class="h-5 w-5" />
            </button>
            <div
              v-if="isAttachmentMenuOpen"
              class="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10"
            >
              <button
                @click="handleFileUpload"
                class="flex items-center text-gray-700 hover:text-blue-500 mb-2 w-full text-left px-4 py-2"
              >
                <Icon name="fa:file" class="mr-2" /> File
              </button>
              <button
                @click="handleImageUpload"
                class="flex items-center text-gray-700 hover:text-blue-500 w-full text-left px-4 py-2"
              >
                <Icon name="fa:image" class="mr-2" /> Image
              </button>
            </div>
          </div>
          <input
            ref="fileInputRef"
            type="file"
            class="hidden"
            @change="handleFileChange"
          />
          <input
            ref="imageInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageChange"
          />
          <input
            v-model="inputMessage"
            type="text"
            :placeholder="
              editingMessageId ? 'Edit your message...' : 'Type your message...'
            "
            class="flex-1 py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-400 text-gray-700"
            @keydown.enter.prevent="handleSendMessage"
          />
          <button
            @click="handleSendMessage"
            class="bg-blue-500 text-white p-3 rounded-full ml-2 hover:bg-blue-600 focus:outline-none"
            :disabled="isSending || (!inputMessage.trim() && !editingMessageId)"
            :class="{
              'opacity-50 cursor-not-allowed':
                isSending || (!inputMessage.trim() && !editingMessageId),
            }"
          >
            <div
              v-if="isSending"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
            ></div>
            <Icon v-else name="fa:paper-plane" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Group profile sidebar component (conditionally rendered) -->
      <GroupProfile
        v-if="showProfile"
        :group="currentGroupForProfile"
        @close="showProfile = false"
        @update:group="updateGroup"
      />
    </div>

    <!-- Group Info Panel (conditionally rendered as a side panel) -->
    <GroupInfoPanel
      v-if="showInfo"
      :groupName="currentGroup?.name || 'Loading...'"
      :groupDetails="currentGroupForProfile"
      @close="showInfo = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from "vue";
import { useGroupsStore } from "~/composables/useGroups";
import { useAuthStore } from "~/composables/useAuth";
import { usePresence } from "~/composables/usePresence";
import { useNuxtApp } from "#app";
import SearchOnGroup from "./SearchOnGroup.vue";
import GroupInfoPanel from "./GroupInfoPanel.vue";
import { useFiles } from "~/composables/useFiles";
import { useMessagesStore } from "~/composables/useMessages";
import { useWebSocketListener } from "~/composables/useWebSocketListener";
import { eventBus } from "~/composables/useEventBus";
import {
  formatMessageTimestamp,
  extractValidDate,
  formatDateForSeparator,
} from "~/utils/timestampHelper";

// Initialize presence service and WebSocket listener
const presence = usePresence();
const wsListener = useWebSocketListener();

// For date formatting functions
const formatDistanceToNow = (date: Date, options: { addSuffix: boolean }) => {
  // Basic implementation of formatDistanceToNow for TypeScript compatibility
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return options.addSuffix ? "just now" : "0 minutes";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return options.addSuffix
      ? `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
      : `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return options.addSuffix
      ? `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
      : `${diffInHours} hour${diffInHours > 1 ? "s" : ""}`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return options.addSuffix
      ? `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
      : `${diffInDays} day${diffInDays > 1 ? "s" : ""}`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  return options.addSuffix
    ? `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`
    : `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""}`;
};

const format = (date: Date, formatStr: string) => {
  // Basic implementation of format function for TypeScript compatibility
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  if (formatStr === "h:mm a") {
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  }

  return date.toLocaleString();
};

// Initialize Nuxt app to access plugins like toast
const { $toast } = useNuxtApp();

interface Attachment {
  type: "image" | "file";
  url: string;
  name: string;
  size?: string;
}

interface GroupMessage {
  id: string;
  message_id?: string; // Explicit tracking ID for better synchronization
  temp_id?: string; // Track temporary message ID for syncing with real messages
  content: string;
  type?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  sender_id?: string;
  group_id?: string;
  created_at?: string;
  updated_at?: string;
  sent_at?: string; // Sent timestamp for proper handling
  timestamp?: string; // Formatted timestamp for display
  raw_timestamp?: string; // ISO timestamp string for accurate sorting
  isCurrentUser?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  attachment?: Attachment;
  pending?: boolean; // For optimistic UI updates
  failed?: boolean; // For error handling
  retrying?: boolean; // For retry status
  updatedViaWebSocket?: boolean; // Track messages updated via WebSocket
  replacedTempMessage?: boolean; // Track if a temp message was replaced
  fromWebSocket?: boolean; // Track messages received via WebSocket
  receivedViaWebSocket?: boolean; // Track messages received via WebSocket
  sourceApi?: boolean; // Track messages from API
}

interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: "admin" | "member";
  joined_at: string;
  name: string;
  status: "online" | "offline";
  // API response fields
  first_name?: string;
  last_name?: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  is_owner?: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    profile_picture_url?: string;
    first_name?: string;
    last_name?: string;
  };
  avatar?: string;
  isBlocked?: boolean;
}

// Define Group interface for type safety
interface GroupDetails {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  memberCount: number;
  members: GroupMember[];
  avatar?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  member_count?: number;
  last_message?: {
    content: string;
    sender_name: string;
    created_at: string;
  };
}

const props = defineProps<{
  groupId: string;
  groupName: string;
  groupMessages?: GroupMessage[];
}>();

// Store access
const groupsStore = useGroupsStore();
const authStore = useAuthStore();
const messagesStore = useMessagesStore();

// Main state
const inputMessage = ref("");
const editingMessageId = ref<string | null>(null);
const showDropdown = ref<string | null>(null);
const showProfile = ref(false);
const showSearch = ref(false);
const showInfo = ref(false);
const isAttachmentMenuOpen = ref(false);
const searchQuery = ref("");
const isSearching = ref(false);
const filteredMessages = ref<GroupMessage[]>([]);
const selectedMembers = ref<string[]>([]);
const isLoading = ref(false);
const isSending = ref(false);
const isLoadingMore = ref(false);

// Add state for controlling API fetch behavior
const lastFetchTime = ref(0);
const recentWebSocketActivity = ref(false);
const FETCH_DEBOUNCE_TIME = 5000; // 5 seconds

// Refs for DOM manipulation
const dropdownRef = ref<HTMLElement | null>(null);
const messagesEndRef = ref<HTMLElement | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const imageInputRef = ref<HTMLInputElement | null>(null);

// Track active messages
const messages = ref<GroupMessage[]>([]);

// Get current user
const currentUser = computed(() => authStore.user);

// Group data from store
const currentGroup = computed(() => groupsStore.currentGroup);
const groupMembers = computed(() => {
  return groupsStore.groupMembers.map((member) => {
    // Use the processed name from useGroups extractMemberName function
    let displayName =
      member.extracted_name || member.display_name || "Unknown User";

    console.log(
      `📊 [GroupChatArea] Member ${member.id} processed name: "${displayName}"`,
      {
        extracted_name: member.extracted_name,
        display_name: member.display_name,
        first_name: member.first_name,
        last_name: member.last_name,
        user: member.user,
      }
    );

    return {
      ...member,
      name: displayName,
      status: "offline" as "online" | "offline",
      avatar: member.avatar_url || member.user?.profile_picture_url,
    };
  });
});
const storeMessages = computed(() => groupsStore.groupMessages);

// Computed property for member count that prioritizes actual members array
const memberCount = computed(() => {
  // Prioritize the actual members array length over the API member_count
  // since the members array is more reliable and up-to-date
  const actualMembersCount = groupMembers.value.length;
  const apiMemberCount = currentGroup.value?.member_count || 0;

  // Use the actual members count if it's greater than 0, otherwise fall back to API count
  return actualMembersCount > 0 ? actualMembersCount : apiMemberCount;
});

// Format group data for the profile component
const currentGroupForProfile = computed<GroupDetails>(() => {
  if (!currentGroup.value) {
    return {
      id: "",
      name: "",
      description: "No description available",
      createdAt: "",
      memberCount: 0,
      members: [],
    };
  }

  console.log(`📊 [GroupChatArea] Formatting group profile data:`, {
    groupMembersLength: groupMembers.value.length,
    groupMembers: groupMembers.value,
    currentGroup: currentGroup.value,
  });

  // Map members based on the API response structure
  const mappedMembers: GroupMember[] = groupMembers.value.map((member) => {
    // Handle both old structure (member.user) and new structure (direct member properties)

    // Construct full name from first_name and last_name if available
    let displayName = "Unknown User";

    // Priority order for name construction:
    // 1. first_name + last_name (from member or member.user)
    // 2. full_name (from member or member.user)
    // 3. username
    // 4. fallback to "Unknown User"

    const firstName = member.first_name || member.user?.first_name;
    const lastName = member.last_name || member.user?.last_name;

    if (firstName && lastName) {
      displayName = `${firstName} ${lastName}`.trim();
    } else if (firstName) {
      displayName = firstName;
    } else if (member.full_name) {
      displayName = member.full_name;
    } else if (member.user?.name) {
      displayName = member.user.name;
    } else if (member.username) {
      displayName = member.username;
    }

    const memberData: GroupMember = {
      id: member.id || member.user_id,
      name: displayName,
      status: "online" as const,
      role: member.is_owner ? ("admin" as const) : ("member" as const),
      avatar: member.avatar_url || member.user?.profile_picture_url,
      isBlocked: false,
      user_id: member.id || member.user_id,
      group_id: currentGroup.value?.id || "",
      joined_at: member.joined_at || "",
      // Include API response fields
      first_name: member.first_name || member.user?.first_name,
      last_name: member.last_name || member.user?.last_name,
      full_name: member.full_name,
      username: member.username,
      avatar_url: member.avatar_url,
      is_owner: member.is_owner,
      user: member.user,
    };

    console.log(`📊 [GroupChatArea] Mapped member:`, {
      original: member,
      mapped: memberData,
      constructedName: displayName,
    });

    return memberData;
  });

  return {
    id: currentGroup.value.id || "",
    name: currentGroup.value.name || "",
    description: currentGroup.value.description || "No description available",
    createdAt: currentGroup.value.created_at || "",
    memberCount: memberCount.value,
    members: mappedMembers,
    avatar: currentGroup.value.avatar_url,
    avatar_url: currentGroup.value.avatar_url,
    created_at: currentGroup.value.created_at,
    updated_at: currentGroup.value.updated_at,
    member_count: currentGroup.value.member_count,
    last_message: currentGroup.value.last_message,
  };
});

// Check if we can load more messages
const canLoadMoreMessages = computed(() => {
  return groupsStore.messagesPagination.has_more_pages;
});

// Initialize component when mounted
onMounted(async () => {
  // Try to load from session storage first
  const storedMessages = loadFromSessionStorage();
  if (storedMessages.length > 0) {
    console.log(
      `🔄 [GroupChatArea] Loaded ${storedMessages.length} messages from session storage`
    );
    messages.value = storedMessages;
  }

  // Use prop messages if available, otherwise fetch from API
  if (props.groupMessages && props.groupMessages.length > 0) {
    messages.value = props.groupMessages;
    // Save prop messages to session storage
    saveToSessionStorage(messages.value);
  } else {
    // If no stored messages or prop messages, fetch group data
    if (messages.value.length === 0) {
      await loadGroupData();
    }
  }

  // Fix any message bubble positioning issues
  const fixedCount = validateMessageBubbles();
  if (fixedCount > 0) {
    console.log(
      `🔧 [GroupChatArea] Fixed ${fixedCount} message bubble positions`
    );
  }

  // Initial scroll to bottom
  nextTick(() => {
    if (messagesEndRef.value) {
      messagesEndRef.value.scrollIntoView();
    }
  });

  // Add event listener
  document.addEventListener("mousedown", handleClickOutside);

  // Initialize presence tracking for members
  if (authStore.isAuthenticated && authStore.token) {
    if (!presence.isWsConnected) {
      presence.connectWebSocket(authStore.token);
    }

    // Set initial user status
    presence.setInitialStatus("online");

    // Update group members status
    updateMembersStatus();
  }

  // Subscribe to WebSocket events for real-time message updates
  wsListener.listenToWSEvent("group-message", (message: any) => {
    // Ignore messages that are not for this group
    if (message.group_id !== props.groupId) return;

    // Set flag to indicate recent WebSocket activity
    recentWebSocketActivity.value = true;

    // Clear the flag after debounce time
    setTimeout(() => {
      recentWebSocketActivity.value = false;
    }, FETCH_DEBOUNCE_TIME);

    // Enhanced debugging for WebSocket messages
    console.log("📩 [GroupChatArea] Message received via WebSocket:", {
      id: message.id || message.message_id,
      sender_id: message.sender_id,
      content:
        message.content?.substring(0, 30) +
        (message.content?.length > 30 ? "..." : ""),
      fields: Object.keys(message),
    });

    // Find the index of the existing message with either id or message_id
    const messageId = message.id || message.message_id;
    const existingMessageIndex = messages.value.findIndex(
      (msg) => msg.id === messageId || msg.message_id === messageId
    );

    // Process the incoming message with proper field normalization
    const timestampForDisplay = message.sent_at || message.created_at;
    let formattedTimestamp = "";

    if (timestampForDisplay) {
      try {
        const date = new Date(timestampForDisplay);
        if (!isNaN(date.getTime())) {
          formattedTimestamp = date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        }
      } catch (e) {
        console.warn("Error formatting WebSocket message timestamp:", e);
      }
    }

    const processedMessage = {
      ...message,
      // Ensure consistent ID field
      id: messageId,
      message_id: messageId,
      // Normalize sender information
      sender: message.sender || {
        id: message.sender_id,
        name: message.sender_name || "Unknown User",
      },
      // Ensure timestamps are consistent
      sent_at: message.sent_at || message.created_at,
      created_at: message.created_at || message.sent_at,
      raw_timestamp: message.sent_at || message.created_at,
      // Add properly formatted timestamp for display
      timestamp: formattedTimestamp,
      // Mark ownership
      isCurrentUser: isCurrentUserMessage(message),
      // Mark as received via WebSocket
      receivedViaWebSocket: true,
    };

    if (existingMessageIndex !== -1) {
      // Update the existing message
      console.log(`✅ [GroupChatArea] Updating existing message ${messageId}`);
      messages.value[existingMessageIndex] = {
        ...messages.value[existingMessageIndex],
        ...processedMessage,
      };
    } else {
      // New message, add to the list
      console.log(`✅ [GroupChatArea] Adding new message ${messageId}`);
      messages.value.push(processedMessage);
    }

    // Save to session storage after receiving WebSocket message
    saveToSessionStorage(messages.value);

    // Scroll to bottom on new message
    nextTick(() => {
      if (messagesEndRef.value) {
        messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Listen for message updates via the generic refresh-messages event
  wsListener.listenToWSEvent("refresh-messages", () => {
    // Reload messages from the API when notified
    console.log(
      "🔄 [GroupChatArea] Received refresh-messages event, fetching latest messages"
    );
    // Remember scroll position before refresh
    const scrollPosition = messagesContainer.value?.scrollTop;

    fetchGroupMessages().then(() => {
      // After fetching messages, validate message bubbles to ensure correct positioning
      const fixedCount = validateMessageBubbles();
      if (fixedCount > 0) {
        console.log(
          `🛠️ [GroupChatArea] Fixed ${fixedCount} message bubble positions`
        );
      }

      // Save refreshed messages to session storage
      saveToSessionStorage(messages.value);

      // Restore scroll position if user was not at bottom
      if (scrollPosition && messagesContainer.value) {
        messagesContainer.value.scrollTop = scrollPosition;
      }
    });
  });

  // Listen for direct temp message replacement events
  wsListener.listenToWSEvent("temp-message-replaced", (data) => {
    console.log(`🔄 [GroupChatArea] Received temp-message-replaced event:`, {
      tempId: data.tempId,
      realId: data.realId,
      contentPreview:
        data.content?.substring(0, 30) +
        (data.content?.length > 30 ? "..." : ""),
    });

    // Find temporary message and replace it with the real one
    const tempIndex = messages.value.findIndex(
      (msg) => msg.id === data.tempId || msg.temp_id === data.tempId
    );

    if (tempIndex !== -1) {
      // Update the message in place with proper field normalization
      messages.value[tempIndex] = {
        ...messages.value[tempIndex],
        // Update IDs
        id: data.realId,
        message_id: data.realId,
        temp_id: data.tempId,
        // Update content if provided
        content: data.content || messages.value[tempIndex].content,
        // Update status flags
        pending: false,
        failed: false,
        retrying: false,
        // Add tracking flags
        replacedTempMessage: true,
        updatedViaWebSocket: true,
        // Keep existing timestamp fields (don't try to access them from data object)
        sent_at: messages.value[tempIndex].sent_at,
        created_at: messages.value[tempIndex].created_at,
        raw_timestamp: messages.value[tempIndex].raw_timestamp,
      };

      // Save to session storage after temp message replacement
      saveToSessionStorage(messages.value);

      console.log(
        `✅ [GroupChatArea] Replaced temp message ${data.tempId} with ${data.realId}`
      );
    } else {
      console.log(
        `⚠️ [GroupChatArea] Could not find temp message with ID ${data.tempId} to replace`
      );
      // If we couldn't find the temp message, we might need to refresh to get the latest state
      fetchGroupMessages();
    }
  });
});

// Load group data
async function loadGroupData() {
  isLoading.value = true;
  try {
    // Fetch group details, members and messages
    await Promise.all([
      groupsStore.getGroupDetails(props.groupId),
      groupsStore.getGroupMembers(props.groupId),
      fetchGroupMessages(),
    ]);

    // No need to call processMessages here as it will be triggered by the storeMessages watcher
    // This prevents duplicate processing
  } catch (error) {
    if ($toast) {
      $toast.error("Failed to load group data");
    }
  } finally {
    isLoading.value = false;
  }
}

// Process messages to mark current user's messages
function processMessages() {
  const userId = currentUser.value?.id;

  if (!storeMessages.value || storeMessages.value.length === 0) {
    return;
  }

  messages.value = storeMessages.value.map((message) => {
    const isCurrentUser = isCurrentUserMessage(message);
    return {
      ...message,
      isCurrentUser,
    };
  });
}

// Enhanced determination of message ownership with better ID handling
const isCurrentUserMessage = (message: any): boolean => {
  const currentUserId = currentUser.value?.id;
  if (!currentUserId) return false;

  // Extract sender ID with fallbacks for different API structures
  const senderId =
    message.sender_id ||
    message.sender?.id ||
    message.from_id ||
    message.user_id;

  // Handle temp messages that don't have sender_id yet
  if (!senderId) {
    // Check temp messages (always from current user)
    if (
      message.id &&
      (message.id.startsWith("temp-") ||
        message.id.startsWith("msg-") ||
        message.id.startsWith("ws-"))
    ) {
      return true;
    }

    // For non-temp messages where we can't determine sender_id,
    // check if message has isCurrentUser explicitly set
    if (typeof message.isCurrentUser === "boolean") {
      return message.isCurrentUser;
    }
  }

  // Final check - if we have a sender ID, compare with current user
  return senderId === currentUserId;
};

// Function to save messages to session storage with optimization for group chats
const saveToSessionStorage = (messagesToSave: GroupMessage[]) => {
  if (!messagesToSave || messagesToSave.length === 0) {
    return; // Don't save empty arrays
  }

  try {
    const conversationKey = `group_chat_${props.groupId}`;

    // Optimize storage by keeping only the essential fields
    const optimizedMessages = messagesToSave.map((msg) => ({
      id: msg.id,
      message_id: msg.message_id,
      temp_id: msg.temp_id,
      content: msg.content,
      type: msg.type,
      sender_id: msg.sender_id,
      group_id: msg.group_id,
      timestamp: msg.timestamp,
      raw_timestamp: msg.raw_timestamp,
      sent_at: msg.sent_at,
      created_at: msg.created_at,
      updated_at: msg.updated_at,
      isCurrentUser: msg.isCurrentUser,
      isEdited: msg.isEdited,
      isDeleted: msg.isDeleted,
      attachment: msg.attachment,
      pending: msg.pending,
      failed: msg.failed,
      // Retain minimal sender info
      sender: msg.sender
        ? {
            id: msg.sender.id,
            name: msg.sender.name,
            avatar: msg.sender.avatar,
          }
        : undefined,
    }));

    sessionStorage.setItem(conversationKey, JSON.stringify(optimizedMessages));

    console.log(
      `💾 [GroupChatArea] Saved ${optimizedMessages.length} messages to session storage for group ${props.groupId}`
    );
  } catch (error) {
    console.error(
      "❌ [GroupChatArea] Failed to save messages to session storage:",
      error
    );

    // Try with a more aggressive optimization if the data was too large
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      try {
        // Keep only the most recent 50 messages
        const reducedMessages = messagesToSave.slice(-50).map((msg) => ({
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          timestamp: msg.timestamp,
          isCurrentUser: msg.isCurrentUser,
          type: msg.type,
          group_id: msg.group_id,
        }));

        const conversationKey = `group_chat_${props.groupId}_reduced`;
        sessionStorage.setItem(
          conversationKey,
          JSON.stringify(reducedMessages)
        );

        console.log(
          `💾 [GroupChatArea] Saved ${reducedMessages.length} reduced messages to session storage`
        );
      } catch (secondError) {
        console.error(
          "❌ [GroupChatArea] Failed to save even reduced messages:",
          secondError
        );
      }
    }
  }
};

// Function to load messages from session storage
const loadFromSessionStorage = (): GroupMessage[] => {
  try {
    const conversationKey = `group_chat_${props.groupId}`;
    const sessionData = sessionStorage.getItem(conversationKey);

    if (sessionData) {
      const sessionMessages = JSON.parse(sessionData);
      console.log(
        `📁 [GroupChatArea] Found ${sessionMessages.length} messages in session storage for group ${props.groupId}`
      );
      return sessionMessages;
    }

    // Try to load reduced messages as fallback
    const reducedKey = `group_chat_${props.groupId}_reduced`;
    const reducedData = sessionStorage.getItem(reducedKey);
    if (reducedData) {
      const reducedMessages = JSON.parse(reducedData);
      console.log(
        `📁 [GroupChatArea] Found ${reducedMessages.length} reduced messages in session storage`
      );
      return reducedMessages;
    }
  } catch (error) {
    console.error(
      "❌ [GroupChatArea] Error loading from session storage:",
      error
    );
  }

  return [];
};

// Helper function to validate and fix message bubble positioning
const validateMessageBubbles = (): number => {
  let fixedCount = 0;

  messages.value = messages.value.map((msg) => {
    const correctIsCurrentUser = isCurrentUserMessage(msg);

    if (msg.isCurrentUser !== correctIsCurrentUser) {
      fixedCount++;
      return {
        ...msg,
        isCurrentUser: correctIsCurrentUser,
      };
    }

    return msg;
  });

  return fixedCount;
};

// Fetch group messages from the API with enhanced error handling and field normalization
async function fetchGroupMessages(page = 1, limit = 20) {
  const startTime = performance.now();
  console.log(
    `🔄 [GroupChatArea] Fetching messages for group ${props.groupId}, page ${page}`
  );

  // Prevent frequent API calls when WebSocket is active
  if (page === 1 && recentWebSocketActivity.value) {
    const timeSinceLastFetch = Date.now() - lastFetchTime.value;
    if (timeSinceLastFetch < FETCH_DEBOUNCE_TIME) {
      console.log(
        `⏸️ [GroupChatArea] Skipping API fetch due to recent WebSocket activity (${timeSinceLastFetch}ms ago)`
      );
      return { data: [] }; // Return empty result to prevent errors
    }
  }

  // Update fetch time
  lastFetchTime.value = Date.now();

  try {
    // Use the groupsStore to fetch messages for consistency
    const data = await groupsStore.getGroupMessages(props.groupId, page, limit);

    // Debug the response structure
    if (data?.data && data.data.length > 0) {
      console.log("📩 [GroupChatArea] API Message Format:", {
        firstMsgId: data.data[0].id || data.data[0].message_id,
        messageCount: data.data.length,
        fields: Object.keys(data.data[0]),
      });
    } else {
      console.log("📩 [GroupChatArea] No messages returned from API");
    }

    // Process the messages with enhanced field mapping and proper name resolution
    const userId = currentUser.value?.id;
    const processedMessages = (data.data || []).map((message: any) => {
      try {
        // Ensure we have the correct ID field (API returns message_id)
        const id = message.id || message.message_id;

        // Get sender ID from message
        const senderId = message.sender_id || message.sender?.id;

        // Find the actual member information to get proper name
        let senderName = "Unknown User";
        if (senderId) {
          // Look up sender in group members
          const member = groupMembers.value.find(
            (m) => m.user_id === senderId || m.id === senderId
          );

          if (member) {
            senderName = member.name; // This is already processed by extractMemberName
            console.log(
              `📝 [GroupChatArea] Found member name for ${senderId}: "${senderName}"`
            );
          } else {
            // If not found in members, try to extract from message.sender
            if (message.sender?.name) {
              senderName = message.sender.name;
            } else if (message.sender_name) {
              senderName = message.sender_name;
            } else if (senderId === userId) {
              // If it's current user, use their name
              senderName = currentUser.value?.name || "You";
            }
            console.log(
              `⚠️ [GroupChatArea] Member not found for ${senderId}, using fallback: "${senderName}"`
            );
          }
        }

        // Construct proper sender info
        const senderInfo = {
          id: senderId,
          name: senderName,
          avatar: message.sender?.avatar,
        };

        // Extract timestamps with fallbacks
        const sentAt = message.sent_at || message.created_at;
        const createdAt = message.created_at || message.sent_at;

        // Format display timestamp consistently
        const timestampForDisplay = sentAt || createdAt;
        let formattedTimestamp = "";

        if (timestampForDisplay) {
          try {
            const date = new Date(timestampForDisplay);
            if (!isNaN(date.getTime())) {
              formattedTimestamp = date.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });
            }
          } catch (e) {
            console.warn("Error formatting timestamp:", e);
          }
        }

        const processedMessage = {
          ...message,
          // Ensure ID field consistency
          id: id,
          message_id: id, // Set message_id for consistency
          // Normalize sender info with proper name
          sender: senderInfo,
          // Mark messages from current user
          isCurrentUser: senderId === userId,
          // Add consistent timestamp fields
          sent_at: sentAt,
          created_at: createdAt,
          // Add raw_timestamp for consistent sorting
          raw_timestamp: sentAt || createdAt,
          // Add properly formatted timestamp for display
          timestamp: formattedTimestamp,
          // Source tracking for debugging
          sourceApi: true,
        };

        console.log(`📩 [GroupChatArea] Processed message:`, {
          id: processedMessage.id,
          senderId,
          senderName,
          isCurrentUser: processedMessage.isCurrentUser,
          content: processedMessage.content?.substring(0, 30),
        });

        return processedMessage;
      } catch (err) {
        // Individual message processing error handling
        console.error("⚠️ [GroupChatArea] Error processing message:", err);
        // Return a minimal valid message to prevent UI errors
        return {
          id: message.id || message.message_id || `error-${Date.now()}`,
          content: message.content || "Error displaying message",
          sender: {
            id: message.sender_id || "unknown",
            name: "Unknown User",
          },
          isCurrentUser: false,
          hasProcessingError: true,
        };
      }
    });

    // If first page, merge messages intelligently instead of replacing
    if (page === 1) {
      console.log(
        `[GroupChatArea] Merging ${processedMessages.length} API messages with ${messages.value.length} existing messages`
      );

      // Store current messages that might be from WebSocket
      const currentMessages = [...messages.value];

      // Create a map of existing message IDs for quick lookup
      const existingMessageIds = new Set(
        currentMessages.map((msg) => msg.id || msg.message_id).filter(Boolean)
      );

      // Filter out API messages that already exist to prevent duplicates
      const newApiMessages = processedMessages.filter((apiMsg: any) => {
        const apiMsgId = apiMsg.id || apiMsg.message_id;
        return !existingMessageIds.has(apiMsgId);
      });

      console.log(
        `[GroupChatArea] Filtered ${processedMessages.length} API messages to ${
          newApiMessages.length
        } new messages (${
          processedMessages.length - newApiMessages.length
        } duplicates removed)`
      );

      // Find WebSocket messages that aren't in API response (these might be very recent)
      const recentWebSocketMessages = currentMessages.filter((currentMsg) => {
        // Keep messages that are:
        // 1. Temporary/pending messages (always preserve these)
        // 2. Messages marked as from WebSocket that aren't in API response
        // 3. Messages sent in the last 30 seconds that might not be in API yet

        if (currentMsg.pending || currentMsg.id?.startsWith("temp-")) {
          console.log(
            `[GroupChatArea] Preserving pending/temp message: ${currentMsg.id}`
          );
          return true;
        }

        if (currentMsg.fromWebSocket || currentMsg.receivedViaWebSocket) {
          const currentMsgId = currentMsg.id || currentMsg.message_id;
          const isInApiResponse = processedMessages.some(
            (apiMsg: any) => (apiMsg.id || apiMsg.message_id) === currentMsgId
          );

          if (!isInApiResponse) {
            // Check if message is very recent (last 30 seconds)
            const timestamp =
              currentMsg.raw_timestamp ||
              currentMsg.sent_at ||
              currentMsg.created_at;
            if (timestamp) {
              const msgTime = new Date(timestamp);
              const timeDiff = Date.now() - msgTime.getTime();
              if (timeDiff < 30000) {
                console.log(
                  `[GroupChatArea] Preserving recent WebSocket message: ${currentMsgId} (${timeDiff}ms ago)`
                );
                return true;
              }
            }
          }
        }

        return false;
      });

      // Combine API messages with recent WebSocket messages
      // Use newApiMessages (filtered) instead of processedMessages to prevent duplicates
      const mergedMessages = [...newApiMessages, ...recentWebSocketMessages];

      // Remove any potential duplicates that might have slipped through
      const uniqueMessages = mergedMessages.filter((msg, index, arr) => {
        const msgId = msg.id || msg.message_id;
        // Keep only the first occurrence of each unique message ID
        return arr.findIndex((m) => (m.id || m.message_id) === msgId) === index;
      });

      // Sort by timestamp to maintain chronological order
      uniqueMessages.sort((a, b) => {
        const timeA = new Date(
          a.raw_timestamp || a.sent_at || a.created_at || 0
        ).getTime();
        const timeB = new Date(
          b.raw_timestamp || b.sent_at || b.created_at || 0
        ).getTime();
        return timeA - timeB;
      });

      console.log(
        `[GroupChatArea] Merged result: ${newApiMessages.length} new API + ${recentWebSocketMessages.length} WebSocket = ${uniqueMessages.length} unique total messages`
      );

      messages.value = uniqueMessages;
    } else {
      // For pagination, append older messages
      console.log(
        `[GroupChatArea] Adding ${processedMessages.length} older messages to existing ${messages.value.length}`
      );
      messages.value = [...processedMessages, ...messages.value];
    }

    // Update pagination info if available
    if (data.pagination) {
      groupsStore.messagesPagination = data.pagination;
    }

    // Validate message bubbles to ensure correct positioning
    const fixedCount = validateMessageBubbles();
    if (fixedCount > 0) {
      console.log(
        `🛠️ [GroupChatArea] Fixed ${fixedCount} message bubble positions`
      );
    }

    const endTime = performance.now();
    console.log(
      `✅ [GroupChatArea] Fetched ${processedMessages.length} messages in ${(
        endTime - startTime
      ).toFixed(2)}ms`
    );

    // Save fetched messages to session storage
    saveToSessionStorage(messages.value);

    return data;
  } catch (error: any) {
    console.error(`❌ [GroupChatArea] Error fetching messages:`, error);
    if ($toast) {
      $toast.error("Failed to load messages");
    }
    throw error;
  }
}

// Load more messages (older messages)
async function loadMoreMessages() {
  if (isLoadingMore.value || !canLoadMoreMessages.value) return;

  try {
    isLoadingMore.value = true;
    const nextPage = groupsStore.messagesPagination.current_page + 1;
    await fetchGroupMessages(nextPage);
  } catch (error) {
    if ($toast) {
      $toast.error("Failed to load more messages");
    }
  } finally {
    isLoadingMore.value = false;
  }
}

// Only watch for group ID changes to prevent infinite loop
watch(
  () => props.groupId,
  async (newGroupId) => {
    if (newGroupId) {
      await loadGroupData();

      // Scroll to bottom when group changes
      nextTick(() => {
        if (messagesEndRef.value) {
          messagesEndRef.value.scrollIntoView();
        }
      });
    }
  },
  { immediate: true }
);

// Separate watch for store messages to update UI without triggering fetch
watch(storeMessages, () => {
  // Only sync messages from store without fetching again
  processMessages();

  // Scroll to bottom for new messages
  nextTick(() => {
    if (messagesEndRef.value && messages.value.length > 0) {
      messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Format timestamp for display - using the centralized utility
function formatTimestamp(dateString?: string): string {
  if (!dateString) return "";

  // Use the centralized function with 'time' format for consistent HH.MM display
  return formatMessageTimestamp({ timestamp: dateString, format: "time" });
}

// Computed property to get messages to display (all or filtered)
const displayMessages = computed(() => {
  // Ensure messages array is valid before processing
  if (!messages.value || !Array.isArray(messages.value)) {
    console.warn("⚠️ [GroupChatArea] Invalid messages array:", messages.value);
    return [];
  }

  let messagesToDisplay = messages.value;

  // Apply search filtering if active
  if (isSearching.value) {
    messagesToDisplay = filteredMessages.value.filter((message) => {
      if (selectedMembers.value.length === 0) return true;
      return selectedMembers.value.includes(message.sender?.id || "");
    });
  }

  // Handle potential invalid message objects
  messagesToDisplay = messagesToDisplay.filter((msg) => {
    // Filter out any invalid message objects
    if (!msg || typeof msg !== "object") {
      console.warn("⚠️ [GroupChatArea] Filtered out invalid message:", msg);
      return false;
    }
    return true;
  });

  // Enhanced sorting with more reliable timestamp handling
  return messagesToDisplay.sort((a, b) => {
    // Helper function with improved timestamp extraction and parsing
    const getTimestamp = (msg: GroupMessage): number => {
      try {
        // Priority order: raw_timestamp > sent_at > created_at > timestamp (if ISO format)

        // Try raw_timestamp first (our most consistent field)
        if (msg.raw_timestamp && typeof msg.raw_timestamp === "string") {
          const rawDate = new Date(msg.raw_timestamp);
          if (!isNaN(rawDate.getTime())) {
            return rawDate.getTime();
          }
        }

        // Try sent_at next
        if (msg.sent_at) {
          const sentDate = new Date(msg.sent_at);
          if (!isNaN(sentDate.getTime())) {
            return sentDate.getTime();
          }
        }

        // Try created_at next
        if (msg.created_at) {
          const createdDate = new Date(msg.created_at);
          if (!isNaN(createdDate.getTime())) {
            return createdDate.getTime();
          }
        }

        // For temp messages, extract timestamp from ID if possible
        if (msg.id?.startsWith("temp-")) {
          const parts = msg.id.split("-");
          if (parts.length > 1) {
            const possibleTs = parseInt(parts[1]);
            if (!isNaN(possibleTs)) return possibleTs;
          }
        }

        // Last resort: try to parse the timestamp field
        if (
          msg.timestamp &&
          typeof msg.timestamp === "string" &&
          msg.timestamp.includes("T")
        ) {
          const timestampDate = new Date(msg.timestamp);
          if (!isNaN(timestampDate.getTime())) {
            return timestampDate.getTime();
          }
        }

        // If all else fails, return current time (better than returning 0)
        // This puts messages without timestamps at the end
        return Date.now();
      } catch (e) {
        console.warn("⚠️ [GroupChatArea] Error parsing message timestamp:", e);
        return Date.now(); // Return current time as fallback
      }
    };

    try {
      const timestampA = getTimestamp(a);
      const timestampB = getTimestamp(b);

      // Sort chronologically: oldest first, newest last
      return timestampA - timestampB;
    } catch (e) {
      console.error("❌ [GroupChatArea] Error sorting messages:", e);
      return 0; // Return 0 to keep original order in case of error
    }
  });
});

// Update group data (from group profile component)
const updateGroup = async (updatedGroup: any) => {
  try {
    await groupsStore.updateGroup(props.groupId, {
      name: updatedGroup.name,
      avatar: updatedGroup.avatar,
    });
  } catch (error) {
    if ($toast) {
      $toast.error("Failed to update group");
    }
  }
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
};

// Handle file upload
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    try {
      isSending.value = true;

      // Create temporary optimistic UI message with enhanced fields
      const tempId = `temp-${Date.now()}`;
      const nowISOString = new Date().toISOString();

      const newMessage: GroupMessage = {
        id: tempId,
        message_id: tempId, // Add message_id for better synchronization
        content: "",
        sender: {
          id: currentUser.value?.id || "user",
          name: currentUser.value?.name || "You",
        },
        sender_id: currentUser.value?.id || "user",
        group_id: props.groupId,
        // Store ISO string in raw_timestamp for accurate time tracking
        raw_timestamp: nowISOString,
        // Store ISO strings for consistent timestamp handling
        sent_at: nowISOString,
        created_at: nowISOString,
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        isCurrentUser: true,
        pending: true, // Mark as pending
        attachment: {
          type: "file",
          url: "#", // Placeholder URL
          name: file.name,
          size: formatFileSize(file.size),
        },
      };

      // Add to messages for optimistic UI
      messages.value.push(newMessage);

      // Langsung menggunakan endpoint API /messages/media
      const formData = new FormData();
      formData.append("file", file);
      formData.append("media_type", file.type);
      formData.append("related_to", props.groupId);

      const response = await fetch(`/messages/media`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Find and update the temp message status
      const tempMessageIndex = messages.value.findIndex(
        (msg) => msg.id === tempId
      );
      if (tempMessageIndex !== -1) {
        // Mark as no longer pending
        messages.value[tempMessageIndex] = {
          ...messages.value[tempMessageIndex],
          pending: false,
        };
      }

      // Refresh messages from the server to get the real file URL
      await fetchGroupMessages();

      // Save to session storage after file upload
      saveToSessionStorage(messages.value);

      isAttachmentMenuOpen.value = false;

      // Reset file input
      if (fileInputRef.value) {
        fileInputRef.value.value = "";
      }
    } catch (error) {
      if ($toast) {
        $toast.error("Failed to send file. Please try again.");
      }
    } finally {
      isSending.value = false;
    }

    // Scroll to bottom
    nextTick(() => {
      if (messagesEndRef.value) {
        messagesEndRef.value.scrollIntoView();
      }
    });
  }
};

// Handle image upload
const handleImageChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    try {
      isSending.value = true;

      // Create local preview URL
      const imageUrl = URL.createObjectURL(file);

      // Optimistic UI message with enhanced fields for synchronization
      const tempId = `temp-${Date.now()}`;
      const nowISOString = new Date().toISOString();

      const newMessage: GroupMessage = {
        id: tempId,
        message_id: tempId, // Add message_id for better synchronization
        content: "",
        sender: {
          id: currentUser.value?.id || "user",
          name: currentUser.value?.name || "You",
        },
        sender_id: currentUser.value?.id || "user",
        group_id: props.groupId,
        // Store ISO string in raw_timestamp for accurate time tracking
        raw_timestamp: nowISOString,
        // Store ISO strings for consistent timestamp handling
        sent_at: nowISOString,
        created_at: nowISOString,
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        isCurrentUser: true,
        pending: true, // Mark as pending
        attachment: {
          type: "image",
          url: imageUrl,
          name: file.name,
          size: formatFileSize(file.size),
        },
      };

      // Add to messages for optimistic UI
      messages.value.push(newMessage);

      // Langsung menggunakan endpoint API /messages/media
      const formData = new FormData();
      formData.append("file", file);
      formData.append("media_type", file.type);
      formData.append("related_to", props.groupId);

      const response = await fetch(`/messages/media`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Clean up the blob URL to prevent memory leaks
      URL.revokeObjectURL(imageUrl);

      // Find and update the temporary message instead of removing it
      const tempMessageIndex = messages.value.findIndex(
        (msg) => msg.id === tempId
      );

      if (tempMessageIndex !== -1) {
        // Mark as sent successfully
        messages.value[tempMessageIndex] = {
          ...messages.value[tempMessageIndex],
          pending: false,
        };
      }

      // Refresh messages from the server
      await fetchGroupMessages();

      // Save to session storage after image upload
      saveToSessionStorage(messages.value);

      isAttachmentMenuOpen.value = false;

      // Reset file input
      if (imageInputRef.value) {
        imageInputRef.value.value = "";
      }
    } catch (error) {
      if ($toast) {
        $toast.error("Failed to send image. Please try again.");
      }
    } finally {
      isSending.value = false;
    }

    // Scroll to bottom
    nextTick(() => {
      if (messagesEndRef.value) {
        messagesEndRef.value.scrollIntoView();
      }
    });
  }
};

// Send a new message or edit existing message
const handleSendMessage = async (messageContentOrEvent?: string | Event) => {
  // Handle both direct string calls and event-based calls
  let messageContent: string;

  if (typeof messageContentOrEvent === "string") {
    messageContent = messageContentOrEvent;
  } else {
    // Event-based call, use the input value
    messageContent = inputMessage.value;
  }

  if (!messageContent.trim() || !props.groupId) {
    return;
  }

  const tempId = `temp-${Date.now()}`; // Define tempId at the top of the function
  let apiResponse: any = null;

  try {
    isSending.value = true;

    // Check if we're editing a message or sending a new one
    if (editingMessageId.value) {
      // We're editing an existing message
      console.log(`[GroupChatArea] Editing message ${editingMessageId.value}`);

      // Send the edit request using the messagesStore for consistency
      apiResponse = await messagesStore.editMessage(
        editingMessageId.value,
        messageContent
      );

      console.log(`[GroupChatArea] Edit API response:`, apiResponse);

      // Update the local message directly to ensure immediate UI update
      const messageIndex = messages.value.findIndex(
        (m) =>
          m.id === editingMessageId.value ||
          m.message_id === editingMessageId.value
      );

      if (messageIndex !== -1) {
        console.log(
          `[GroupChatArea] Updating local message at index ${messageIndex}`
        );
        messages.value[messageIndex] = {
          ...messages.value[messageIndex],
          content: messageContent,
          updated_at: new Date().toISOString(),
          isEdited: true,
        };
        console.log(
          `[GroupChatArea] Updated message:`,
          messages.value[messageIndex]
        );
      } else {
        console.warn(
          `[GroupChatArea] Could not find message to update with ID: ${editingMessageId.value}`
        );
      }

      // Clear editing state and input
      editingMessageId.value = null;
      inputMessage.value = "";

      // Save to session storage after editing message
      saveToSessionStorage(messages.value);

      if ($toast) {
        $toast.success("Message updated successfully");
      }

      // Force re-render by triggering reactivity
      nextTick(() => {
        console.log(
          `[GroupChatArea] Messages after edit:`,
          messages.value.map((m) => ({
            id: m.id,
            content: m.content?.substring(0, 50),
            isEdited: m.isEdited,
          }))
        );
      });

      return; // Exit early as we've handled the edit case
    }

    // If we're here, we're sending a new message
    // Create temporary message with consistent timestamp handling
    const now = new Date();
    const nowISOString = now.toISOString();

    const tempMessage = {
      id: tempId,
      content: messageContent,
      sender: {
        id: currentUser.value?.id || "user",
        name: currentUser.value?.name || "You",
      },
      // Store ISO string in raw_timestamp for accurate time tracking
      raw_timestamp: nowISOString,
      // Store ISO strings for consistent timestamp handling
      sent_at: nowISOString,
      created_at: nowISOString,
      // Format the display timestamp consistently
      timestamp: now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      isCurrentUser: true,
      pending: true,
      sender_id: currentUser.value?.id || "user",
      group_id: props.groupId,
    };

    // Add temporary message to the UI
    messages.value = [...messages.value, tempMessage];

    // Clear input early for better UX
    inputMessage.value = "";

    // Scroll to bottom immediately
    nextTick(() => {
      if (messagesEndRef.value) {
        messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
      }
    });

    // Send actual message
    apiResponse = await groupsStore.sendGroupMessage(
      props.groupId,
      messageContent
    );

    console.log("🚀 [GroupChatArea] Message sent, API response:", apiResponse);

    // Find temp message instead of removing it - replace it with API response
    const tempMessageIndex = messages.value.findIndex(
      (msg) => msg.id === tempId
    );

    // If we have API response data, update the temp message directly
    if (apiResponse?.data && tempMessageIndex !== -1) {
      // IMPORTANT: Prioritize API timestamps for consistency between all users
      const apiTimestamp =
        apiResponse.data.sent_at ||
        apiResponse.data.created_at ||
        new Date().toISOString();

      // Parse the timestamp for display formatting
      const apiDate = new Date(apiTimestamp);

      // Format the timestamp consistently
      const formattedTime = apiDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      if (process.dev) {
        console.log("📅 [GroupChat API Timestamp]", {
          original: {
            sent_at: apiResponse.data.sent_at,
            created_at: apiResponse.data.created_at,
            timestamp: apiResponse.data.timestamp,
          },
          used: apiTimestamp,
          formatted: formattedTime,
        });
      }

      const messageId =
        apiResponse.data.id ||
        apiResponse.data.message_id ||
        `msg-${Date.now()}`;

      // Update the temporary message with real data while preserving important fields
      messages.value[tempMessageIndex] = {
        ...messages.value[tempMessageIndex], // Keep existing fields
        id: messageId,
        message_id: messageId, // For better synchronization
        temp_id: tempId, // Store original temp ID for potential WebSocket sync
        content: apiResponse.data.content || messageContent,
        type: apiResponse.data.type || "text",
        sender_id: apiResponse.data.sender_id,
        group_id: apiResponse.data.group_id || props.groupId,
        // Store the original API timestamps as ISO strings
        sent_at: apiResponse.data.sent_at || apiTimestamp,
        created_at: apiResponse.data.created_at || apiTimestamp,
        updated_at: apiResponse.data.updated_at,
        // Store raw timestamp for consistent sorting and date parsing
        raw_timestamp: apiTimestamp,
        // Store formatted timestamp for display
        timestamp: formattedTime,
        isCurrentUser: true, // Confirm it's from current user
        pending: false, // No longer pending
        sender: apiResponse.data.sender || {
          id: currentUser.value?.id || "user",
          name: currentUser.value?.name || "You",
        },
      };
    }

    // Save to session storage after sending message
    saveToSessionStorage(messages.value);
  } catch (error) {
    console.error("[GroupChatArea] Error sending message:", error);

    // Update the temp message to show error state
    const tempMessageIndex = messages.value.findIndex(
      (msg) => msg.id === tempId
    );
    if (tempMessageIndex !== -1) {
      messages.value[tempMessageIndex] = {
        ...messages.value[tempMessageIndex],
        pending: false,
        // The Message type might not have these properties, so we'll just update what we know exists
        content: "⚠️ Failed to send: " + messageContent,
      };
    }

    if ($toast) {
      $toast.error("Failed to send message");
    }
  } finally {
    isSending.value = false;
  }
};

// Function to retry sending a failed message
const retryMessage = async (tempId: string, content: string) => {
  try {
    isSending.value = true;

    // Update UI to show retrying with correct user ownership
    messages.value = messages.value.map((msg) => {
      if (msg.id === tempId) {
        return {
          ...msg,
          pending: true,
          failed: false,
          retrying: true,
          isCurrentUser: isCurrentUserMessage(msg), // Ensure correct user ownership
        };
      }
      return msg;
    });

    // Try to send again using the store
    await groupsStore.sendGroupMessage(props.groupId, content);

    // Update UI on success
    messages.value = messages.value.map((msg) => {
      if (msg.id === tempId) {
        return {
          ...msg,
          pending: false,
          failed: false,
          retrying: false,
        };
      }
      return msg;
    });

    // Refresh from server to get actual message
    await fetchGroupMessages();

    // Save to session storage after retrying message
    saveToSessionStorage(messages.value);

    if ($toast) {
      $toast.success("Message sent successfully");
    }
  } catch (error) {
    // Mark as failed again
    messages.value = messages.value.map((msg) => {
      if (msg.id === tempId) {
        return {
          ...msg,
          pending: false,
          failed: true,
          retrying: false,
        };
      }
      return msg;
    });

    if ($toast) {
      $toast.error("Failed to send message again");
    }
  } finally {
    isSending.value = false;
  }
};

// Track member presence status
function updateMembersStatus() {
  if (groupMembers.value.length > 0) {
    // Extract all user IDs from the group members
    const userIds = groupMembers.value.map((member) => member.user_id);

    // Get status for all members in one go
    presence.getUsersStatus(userIds);
  }
}

// Get status for a specific member
function getMemberStatus(memberId: string): "online" | "offline" {
  return presence.getStatus(memberId) || "offline";
}

// Format last seen time
function formatLastSeen(memberId: string): string {
  const lastActive = presence.getLastActive(memberId);
  if (!lastActive) return "Not available";

  const lastActiveDate = new Date(lastActive);
  return formatDistanceToNow(lastActiveDate, { addSuffix: true });
}

// Watch for changes in group members to update their status
watch(
  () => groupMembers.value,
  (newMembers) => {
    if (newMembers.length > 0 && presence.isWsConnected) {
      updateMembersStatus();
    }
  },
  { deep: true }
);

// Debug watcher for messages to track isEdited changes
watch(
  () => messages.value,
  (newMessages, oldMessages) => {
    const editedMessages = newMessages.filter((m) => m.isEdited);
    if (editedMessages.length > 0) {
      console.log(
        `[DEBUG] Messages with isEdited=true:`,
        editedMessages.map((m) => ({
          id: m.id,
          content: m.content?.substring(0, 30),
          isEdited: m.isEdited,
          updated_at: m.updated_at,
        }))
      );
    }
  },
  { deep: true }
);

// Add missing functions

// Handle outside click for dropdown menu
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = null;
  }
};

// Toggle message action dropdown
const toggleDropdown = (messageId: string) => {
  showDropdown.value = showDropdown.value === messageId ? null : messageId;
};

// Handle edit message flow
const handleEditMessage = (messageId: string) => {
  const message = messages.value.find((m) => m.id === messageId);
  if (message) {
    editingMessageId.value = messageId;
    inputMessage.value = message.content;
    showDropdown.value = null;

    // Focus on input
    nextTick(() => {
      const inputElement = document.querySelector("input.flex-1");
      if (inputElement instanceof HTMLInputElement) {
        inputElement.focus();
      }
    });
  }
};

// Handle cancel edit
const handleCancelEdit = () => {
  editingMessageId.value = null;
  inputMessage.value = "";
};

// Handle unsend message (delete)
const handleUnsendMessage = async (messageId: string) => {
  try {
    console.log(
      `[GroupChatArea] Attempting to delete message id: ${messageId}`
    );

    // Log the message object for debugging
    const messageToDelete = messages.value.find((msg) => msg.id === messageId);
    console.log(`[GroupChatArea] Message to delete:`, messageToDelete);

    // Check for key fields needed for deletion
    const hasValidId =
      messageId && typeof messageId === "string" && messageId.length > 0;
    console.log(`[GroupChatArea] Message has valid ID: ${hasValidId}`);

    if (!hasValidId) {
      throw new Error("Invalid message ID for deletion");
    }

    // Check if this is a temporary message that hasn't been sent to server
    const isTempMessage = messageId.startsWith("temp-");
    const realMessageId =
      isTempMessage && messageToDelete && messageToDelete.message_id
        ? messageToDelete.message_id
        : messageId;

    console.log(
      `[GroupChatArea] Using message ID for deletion: ${realMessageId} (${
        isTempMessage ? "temp message" : "regular message"
      })`
    );

    // Explicitly indicate this is a group message deletion
    const isGroupMessage = true;

    // Use the messages store to ensure proper API routing
    const response = await messagesStore.deleteMessage(
      realMessageId,
      isGroupMessage
    );

    console.log(`[GroupChatArea] Delete response:`, response);

    if (!response) {
      throw new Error("Failed to delete message");
    }

    // Update local state with consistent message ownership
    messages.value = messages.value.map((message) => {
      if (
        message.id === messageId ||
        (message.message_id && message.message_id === realMessageId)
      ) {
        return {
          ...message,
          content: "This message was unsent",
          isDeleted: true,
          isCurrentUser: isCurrentUserMessage(message), // Ensure correct user ownership
        };
      }
      return message;
    });

    if ($toast) {
      $toast.success("Message unsent successfully");
    }

    // Save to session storage after deleting message
    saveToSessionStorage(messages.value);

    showDropdown.value = null;
  } catch (error) {
    console.error(`[GroupChatArea] Error deleting message:`, error);
    if ($toast) {
      $toast.error("Failed to unsend message");
    }
  }
};

// Handle search clear
const clearSearch = () => {
  searchQuery.value = "";
  isSearching.value = false;
  filteredMessages.value = [];
  selectedMembers.value = [];
};

// Handle advanced search
const handleAdvancedSearch = (query: string, memberIds: string[] = []) => {
  if (!query.trim() && memberIds.length === 0) {
    clearSearch();
    return;
  }

  isSearching.value = true;
  searchQuery.value = query;
  selectedMembers.value = memberIds;

  // Filter messages by content and/or sender
  filteredMessages.value = messages.value.filter((message) => {
    const contentMatch =
      !query.trim() ||
      message.content.toLowerCase().includes(query.toLowerCase());

    const memberMatch =
      memberIds.length === 0 || memberIds.includes(message.sender?.id || "");

    return contentMatch && memberMatch;
  });
};

// Handle file upload button click
const handleFileUpload = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
    isAttachmentMenuOpen.value = false;
  }
};

// Handle image upload button click
const handleImageUpload = () => {
  if (imageInputRef.value) {
    imageInputRef.value.click();
    isAttachmentMenuOpen.value = false;
  }
};

// Add cleanup when component unmounts
onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);

  // Clean up all WebSocket listeners to prevent memory leaks
  wsListener.cleanupListeners();
  console.log("🧹 [GroupChatArea] Cleaned up WebSocket listeners");
});
</script>

<style scoped>
/* Add any component-specific styles here */

/* Example: Custom style for the message bubble */
.message {
  transition: background-color 0.3s ease;
}

/* Change background color on hover for message bubble */
.message:hover {
  background-color: #f1f1f1;
}

/* Style for the typing indicator */
.typing-indicator {
  font-style: italic;
  color: #888;
}

/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #aaa;
}

::-webkit-scrollbar-track {
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>
