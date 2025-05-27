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
            <p class="text-xs text-gray-500">
              {{ groupMembers.length }} members
            </p>
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
                      formatTimestamp(
                        message.timestamp ||
                          message.sent_at ||
                          message.created_at
                      )
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
import { usePresence } from "~/composables/usePresence"; // Tambahkan presence service
import { useNuxtApp } from "#app";
import SearchOnGroup from "./SearchOnGroup.vue";
import GroupInfoPanel from "./GroupInfoPanel.vue";
import { useFiles } from "~/composables/useFiles";
import { useMessagesStore } from "~/composables/useMessages";

// Initialize presence service
const presence = usePresence();

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
  sent_at?: string; // Add sent_at field for proper timestamp handling
  timestamp?: string;
  isCurrentUser?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  attachment?: Attachment;
  pending?: boolean; // Added for optimistic UI updates
  failed?: boolean; // Added for error handling
  retrying?: boolean; // Added for retry status
}

interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: "admin" | "member";
  joined_at: string;
  name: string;
  status: "online" | "offline";
  user?: {
    id: string;
    name: string;
    email: string;
    profile_picture_url?: string;
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
  return groupsStore.groupMembers.map((member) => ({
    ...member,
    name: member.user?.name || "Unknown User",
    status: "offline" as "online" | "offline",
    avatar: member.user?.profile_picture_url,
  }));
});
const storeMessages = computed(() => groupsStore.groupMessages);

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

  return {
    id: currentGroup.value.id || "",
    name: currentGroup.value.name || "",
    description: currentGroup.value.description || "No description available",
    createdAt: currentGroup.value.created_at || "",
    memberCount: currentGroup.value.member_count || 0,
    members: groupMembers.value.map((member) => ({
      id: member.user_id,
      name: member.user?.name || "Unknown",
      status: "online" as "online" | "offline",
      role: member.role,
      avatar: member.user?.profile_picture_url,
      isBlocked: false,
      user_id: member.user_id,
      group_id: member.group_id,
      joined_at: member.joined_at,
    })),
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
  // Use prop messages if available, otherwise fetch from API
  if (props.groupMessages && props.groupMessages.length > 0) {
    messages.value = props.groupMessages;
  } else {
    // Fetch group data
    await loadGroupData();
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
    const isCurrentUser =
      message.sender_id === userId || message.sender?.id === userId;
    return {
      ...message,
      isCurrentUser,
    };
  });
}

// Fetch group messages from the API
async function fetchGroupMessages(page = 1, limit = 20) {
  try {
    // Use the groupsStore to fetch messages for consistency
    const data = await groupsStore.getGroupMessages(props.groupId, page, limit);

    // Process the messages
    const userId = currentUser.value?.id;
    const processedMessages = (data.data || []).map((message: any) => ({
      ...message,
      isCurrentUser:
        message.sender_id === userId || message.sender?.id === userId,
    }));

    // If first page, replace messages; otherwise append
    if (page === 1) {
      messages.value = processedMessages;
    } else {
      // For pagination, append older messages
      messages.value = [...processedMessages, ...messages.value];
    }

    // Update pagination info if available
    if (data.pagination) {
      groupsStore.messagesPagination = data.pagination;
    }

    return data;
  } catch (error) {
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

// Format timestamp for display
function formatTimestamp(dateString?: string): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return format(date, "h:mm a");
    } else {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  } catch (error) {
    return dateString;
  }
}

// Computed property to get messages to display (all or filtered)
const displayMessages = computed(() => {
  if (!isSearching.value) return messages.value;

  // Filter by both search query and selected members (if any)
  return filteredMessages.value.filter((message) => {
    if (selectedMembers.value.length === 0) return true;
    return selectedMembers.value.includes(message.sender?.id || "");
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

      // Create temporary optimistic UI message
      const tempId = `temp-${Date.now()}`;
      const newMessage: GroupMessage = {
        id: tempId,
        content: "",
        sender: {
          id: currentUser.value?.id || "user",
          name: currentUser.value?.name || "You",
        },
        timestamp: new Date().toISOString(),
        isCurrentUser: true,
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

      const response = await fetch(`/api/proxy/messages/media`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Refresh messages from the server
      await fetchGroupMessages();

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

      // Optimistic UI message
      const tempId = `temp-${Date.now()}`;
      const newMessage: GroupMessage = {
        id: tempId,
        content: "",
        sender: {
          id: currentUser.value?.id || "user",
          name: currentUser.value?.name || "You",
        },
        timestamp: new Date().toISOString(),
        isCurrentUser: true,
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

      const response = await fetch(`/api/proxy/messages/media`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Refresh messages from the server
      await fetchGroupMessages();

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

// Send a new message
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

  try {
    isSending.value = true;

    // Create temporary message with unique ID
    const tempMessage = {
      id: tempId,
      content: messageContent,
      sender: {
        id: currentUser.value?.id || "user",
        name: currentUser.value?.name || "You",
      },
      timestamp: new Date().toISOString(),
      isCurrentUser: true,
      pending: true,
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
    await groupsStore.sendGroupMessage(props.groupId, messageContent);

    // Remove temporary message and fetch fresh messages
    messages.value = messages.value.filter((msg) => msg.id !== tempId);

    await groupsStore.getGroupMessages(props.groupId);

    if ($toast) {
      $toast.success("Message sent successfully");
    }
  } catch (error) {
    if ($toast) {
      $toast.error("Failed to send message");
    }

    // Update UI to show message failed
    messages.value = messages.value.map((msg) => {
      if (msg.id === tempId) {
        return { ...msg, pending: false, failed: true };
      }
      return msg;
    });
  } finally {
    isSending.value = false;
  }
};

// Function to retry sending a failed message
const retryMessage = async (tempId: string, content: string) => {
  try {
    isSending.value = true;

    // Update UI to show retrying
    messages.value = messages.value.map((msg) => {
      if (msg.id === tempId) {
        return {
          ...msg,
          pending: true,
          failed: false,
          retrying: true,
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
function getMemberStatus(
  memberId: string
): "online" | "offline" | "busy" | "away" {
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

// Enhanced group members with presence status
const groupMembersWithStatus = computed(() => {
  return groupMembers.value.map((member) => ({
    ...member,
    name: member.user?.name || "Unknown User",
    status: getMemberStatus(member.user_id),
    lastSeen: formatLastSeen(member.user_id),
    avatar: member.user?.profile_picture_url,
  }));
});

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
    // Send delete request to API
    const response = await fetch(
      `/api/proxy/groups/${props.groupId}/messages/${messageId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Update local state
    messages.value = messages.value.map((message) => {
      if (message.id === messageId) {
        return {
          ...message,
          content: "This message was unsent",
          isDeleted: true,
        };
      }
      return message;
    });

    showDropdown.value = null;
  } catch (error) {
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
