<template>
  <div class="flex h-full bg-white">
    <!-- Main chat area with smooth transition -->
    <div
      class="flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out"
      :class="[
        showInfo ? 'lg:mr-80' : '',
        isLoading ? 'opacity-75' : 'opacity-100'
      ]"
    >
      <!-- Header with group info -->
      <div
        class="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between"
      >
        <div class="flex items-center">
          <div class="relative mr-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm"
            >
              <img
                v-if="currentGroup?.avatar_url"
                :src="currentGroup.avatar_url"
                :alt="currentGroup?.name"
                class="w-full h-full object-cover rounded-full"
              />
              <Icon
                v-else
                name="fa:users"
                class="text-white text-base"
              />
            </div>
            <span
              v-if="memberCount > 1"
              class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"
            ></span>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">
              {{ currentGroup?.name || "Loading..." }}
            </h2>
            <p class="text-xs text-gray-500">
              {{ memberCount }} member{{ memberCount !== 1 ? "s" : "" }}
              <span
                v-if="onlineMembersCount > 0"
                class="ml-2"
              >
                <span class="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                {{ onlineMembersCount }} online
              </span>
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <button
            @click="showSearch = true"
            class="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200"
            title="Search in group"
          >
            <Icon name="fa:search" class="h-4 w-4" />
          </button>
          <button
            @click="showInfo = !showInfo"
            class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            :class="{ 'bg-blue-50 text-blue-500': showInfo }"
            title="Group info"
          >
            <Icon name="lucide:info" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Search component -->
      <SearchOnGroup
        :isOpen="showSearch"
        :groupMembers="groupMembers as any"
        @close="showSearch = false"
        @search="handleAdvancedSearch"
      />

      <!-- Messages container -->
      <div
        class="flex-1 overflow-auto p-6 space-y-4 relative"
        ref="messagesContainer"
        @scroll="handleScroll"
      >
        <!-- Loading indicator for older messages -->
        <div v-if="isLoadingMore" class="text-center py-2">
          <span class="inline-flex items-center">
            <Icon
              name="svg-spinners:270-ring"
              class="h-4 w-4 mr-2 text-blue-500"
            />
            Loading older messages...
          </span>
        </div>

        <!-- Loading state with conversation switching indicator -->
        <div
          v-if="isLoading"
          class="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 z-20"
        >
          <div class="flex flex-col items-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"
            ></div>
            <p class="text-sm text-gray-600 font-medium">{{ currentGroup?.name ? `Loading conversation with ${currentGroup.name}...` : 'Loading messages...' }}</p>
            <p class="text-xs text-gray-500 mt-1">Please wait while we refresh the chat</p>
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
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="fa:users" class="h-8 w-8 text-gray-400" />
            </div>
            <p class="text-lg font-medium mb-2">No messages yet</p>
            <p>Start the conversation by sending a message to this group!</p>
          </div>
        </div>

        <!-- Messages with date separators -->
        <div v-for="group in groupedMessages" :key="group.dateKey" class="message-group">
          <!-- Date separator -->
          <div class="flex justify-center my-4">
            <div class="bg-gray-100 rounded-full px-3 py-1">
              <span class="text-xs text-gray-600 font-medium">
                {{ group.isToday ? "Today" : group.isYesterday ? "Yesterday" : group.date }}
              </span>
            </div>
          </div>

          <!-- Message items -->
          <div v-for="message in group.messages" :key="message.id">
            <GroupMessageItem
              :message="message"
              @edit-click="handleEditMessage"
              @delete-click="handleUnsendMessage"
              @retry-click="(messageId) => retryMessage(messageId, message.content)"
            />
          </div>
        </div>

        <!-- End of messages indicator -->
        <div ref="messagesEndRef" class="h-1"></div>
      </div>

      <!-- Message input area -->
      <div class="p-4 bg-white border-t border-gray-200">
        <!-- Edit mode indicator -->
        <div
          v-if="editingMessageId"
          class="flex items-center mb-2 bg-blue-50 p-2 rounded-lg"
        >
          <Icon name="fa:edit" class="h-4 w-4 text-blue-600 mr-2" />
          <span class="text-sm text-blue-700 flex-1">Editing message</span>
          <button
            @click="handleCancelEdit"
            class="text-gray-600 hover:text-gray-800 p-1 rounded transition-colors"
          >
            <Icon name="fa:times" class="h-4 w-4" />
          </button>
        </div>

        <!-- Upload progress indicator -->
        <div
          v-if="isUploading && uploadProgress.length > 0"
          class="mb-2 bg-blue-50 border border-blue-200 rounded-md p-2"
        >
          <div class="flex items-center">
            <div
              class="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent mr-2"
            />
            <span class="text-xs text-blue-600">
              Uploading... {{ Math.round(uploadProgress.reduce((sum, p) => sum + p.progress, 0) / uploadProgress.length) }}%
            </span>
          </div>
          <div class="w-full bg-blue-200 rounded-full h-1 mt-1">
            <div
              class="bg-blue-500 h-1 rounded-full transition-all duration-300"
              :style="{
                width: `${Math.round(uploadProgress.reduce((sum, p) => sum + p.progress, 0) / uploadProgress.length)}%`,
              }"
            />
          </div>
        </div>

        <!-- Main input form -->
        <form @submit.prevent="handleFormSubmit" class="flex items-center space-x-3">
          <!-- Hidden file inputs -->
          <input
            ref="fileInputRef"
            type="file"
            class="hidden"
            multiple
            @change="handleFileChange"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
          />

          <!-- Attachment button -->
          <div class="relative">
            <button
              type="button"
              @click="isAttachmentMenuOpen = !isAttachmentMenuOpen"
              class="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Attach files"
            >
              <Icon name="lucide:paperclip" class="h-5 w-5" />
            </button>

            <!-- Attachment dropdown menu -->
            <div
              v-if="isAttachmentMenuOpen"
              class="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[160px]"
            >
              <button
                type="button"
                @click="handleFileUpload"
                class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <Icon name="lucide:file" class="h-4 w-4 mr-2" />
                Upload Files
              </button>
              <button
                type="button"
                @click="handleImageUpload"
                class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <Icon name="lucide:image" class="h-4 w-4 mr-2" />
                Upload Images
              </button>
            </div>
          </div>

          <!-- Message input field -->
          <div class="flex-1 relative">
            <input
              v-model="inputMessage"
              type="text"
              placeholder="Type a message..."
              class="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @keydown.enter.prevent="handleFormSubmit"
              @input="handleTyping"
              :disabled="isSending"
            />
          </div>

          <!-- Send button -->
          <button
            type="submit"
            :disabled="isSending || !inputMessage.trim()"
            class="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div v-if="isSending" class="flex items-center">
              <div
                class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"
              ></div>
            </div>
            <Icon v-else name="lucide:send" class="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>

    <!-- Group Info Panel -->
    <GroupInfoPanel
      v-if="showInfo"
      :groupName="currentGroup?.name || 'Loading...'"
      :groupDetails="currentGroupForProfile"
      @close="showInfo = false"
      class="absolute lg:relative right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 z-10 lg:z-auto"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from "vue";
import SearchOnGroup from "./SearchOnGroup.vue";
import GroupInfoPanel from "./GroupInfoPanel.vue";
import GroupMessageItem from "./GroupMessageItem.vue";
import { useGroupsStore } from "~/composables/useGroups";
import { useAuthStore } from "~/composables/useAuth";
import { usePresence } from "~/composables/usePresence";
import { useMessagesStore } from "~/composables/useMessages";
import { useWebSocketListener } from "~/composables/useWebSocketListener";
import { eventBus } from "~/composables/useEventBus";
import { useNuxtApp } from "#app";
import { useFiles } from "~/composables/useFiles";

// Initialize Nuxt app to access plugins like toast
const { $toast } = useNuxtApp();

// Initialize services
const presence = usePresence();
const wsListener = useWebSocketListener();

// Component props
const props = defineProps<{
  groupId: string;
  groupName: string;
  groupMessages?: GroupMessage[];
}>();

// Store access
const groupsStore = useGroupsStore();
const authStore = useAuthStore();
const messagesStore = useMessagesStore();

// Type definitions for this component
interface Attachment {
  type: "image" | "file";
  url: string;
  name: string;
  size?: string;
}

interface GroupMessage {
  id: string;
  message_id?: string;
  temp_id?: string;
  content: string;
  type?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
    role?: "admin" | "member" | "owner";
    status?: "online" | "offline" | "away" | "busy";
  };
  sender_id?: string;
  group_id?: string;
  created_at?: string;
  updated_at?: string;
  sent_at?: string;
  timestamp?: string;
  raw_timestamp?: string;
  isCurrentUser?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  attachment?: Attachment;
  pending?: boolean;
  failed?: boolean;
  retrying?: boolean;
  delivered?: boolean;
}

interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: "admin" | "member" | "owner";
  joined_at: string;
  name: string;
  status: "online" | "offline" | "away" | "busy";
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
  extracted_name?: string;
  display_name?: string;
}

interface FileProgress {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error: string | null;
}

// Main state
const inputMessage = ref("");
const editingMessageId = ref<string | null>(null);
const showDropdown = ref<string | null>(null);
const showSearch = ref(false);
const showInfo = ref(false);
const isAttachmentMenuOpen = ref(false);
const searchQuery = ref("");
const isSearching = ref(false);
const filteredMessages = ref<GroupMessage[]>([]);
const isLoading = ref(false);
const isSending = ref(false);
const isLoadingMore = ref(false);
const uploadProgress = ref<FileProgress[]>([]);
const isUploading = ref(false);

// Refs for DOM manipulation
const messagesEndRef = ref<HTMLElement | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Track active messages
const messages = ref<GroupMessage[]>([]);

// Get current user
const currentUser = computed(() => authStore.user);

// Group data from store
const currentGroup = computed(() => groupsStore.currentGroup);
const groupMembers = computed(() => {
  return groupsStore.groupMembers.map((member) => {
    let displayName = member.extracted_name || member.display_name || "Unknown User";
    const memberStatus = getMemberStatus(member.user_id);
    return {
      ...member,
      name: displayName,
      status: memberStatus
    } as GroupMember;
  });
});

// Get member count for header display
const memberCount = computed(() => groupMembers.value.length);

// Get online members count
const onlineMembersCount = computed(() => {
  return groupMembers.value.filter((member) => getMemberStatus(member.user_id) === "online").length;
});

// Get store messages
const storeMessages = computed(() => groupsStore.groupMessages);

// Get group member status (online/offline) via Presence service
const getMemberStatus = (userId: string): "online" | "offline" => {
  // For now, return offline as default - TODO: implement proper presence check
  try {
    const userStatuses = presence.userStatuses;
    if (userStatuses && userStatuses.has(userId)) {
      const status = userStatuses.get(userId)?.status;
      return status === 'online' ? 'online' : 'offline';
    }
  } catch (error) {
    console.warn('Error getting member status:', error);
  }
  return 'offline';
};

// Helper function to check if a message is from the current user
const isCurrentUserMessage = (message: GroupMessage): boolean => {
  return (
    message.sender_id === currentUser.value?.id ||
    message.sender?.id === currentUser.value?.id
  );
};

// Enhanced Group profile computed for InfoPanel compatibility
const currentGroupForProfile = computed(() => {
  if (!currentGroup.value) return null;
  return {
    ...currentGroup.value,
    memberCount: memberCount.value,
    members: groupMembers.value,
  } as any; // Use 'as any' to bypass strict typing for now
});

// Check if we can load more messages
const canLoadMoreMessages = computed(() => {
  return groupsStore.messagesPagination.has_more_pages;
});

// Helper functions for date formatting
const formatDateForSeparator = (date: Date): string => {
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString();
  const dateString = date.toDateString();

  if (dateString === today) {
    return "Today";
  } else if (dateString === yesterday) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

// Helper function to get date key for grouping
const getDateKey = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toDateString();
  } catch (error) {
    return new Date().toDateString();
  }
};

// Group messages by date for display
const groupedMessages = computed(() => {
  if (isSearching.value && filteredMessages.value.length > 0) {
    return groupByDate(filteredMessages.value);
  }
  return groupByDate(messages.value);
});

// Helper function to group messages by date
const groupByDate = (messagesList: GroupMessage[]) => {
  const grouped = messagesList.reduce((acc, message) => {
    const timestamp = message.sent_at || message.created_at || "";
    const dateKey = getDateKey(timestamp);

    if (!acc[dateKey]) {
      acc[dateKey] = {
        dateKey,
        date: formatDateForSeparator(new Date(timestamp)),
        isToday: dateKey === new Date().toDateString(),
        isYesterday: dateKey === new Date(Date.now() - 86400000).toDateString(),
        messages: [],
      };
    }

    acc[dateKey].messages.push(message);
    return acc;
  }, {} as Record<string, any>);

  return Object.values(grouped).sort((a: any, b: any) => {
    return new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime();
  });
};

// Display messages for backward compatibility
const displayMessages = computed(() => {
  return groupedMessages.value.flatMap((group) => group.messages);
});

// Function implementations

// Handle advanced search
const handleAdvancedSearch = (query: string) => {
  searchQuery.value = query;
  isSearching.value = !!query;

  if (!query) {
    filteredMessages.value = [];
    return;
  }

  filteredMessages.value = messages.value.filter((message) =>
    message.content.toLowerCase().includes(query.toLowerCase())
  );

  if ($toast) {
    $toast.info(`Found ${filteredMessages.value.length} matching messages`);
  }
};

// Function to clear search results
const clearSearch = () => {
  searchQuery.value = "";
  isSearching.value = false;
  filteredMessages.value = [];
};

// Handle scroll events for loading more messages
const handleScroll = (event: Event) => {
  const container = event.target as HTMLElement;
  if (container.scrollTop === 0 && !isLoadingMore.value) {
    loadMoreMessages();
  }
};

// Handle file upload
const handleFileUpload = () => {
  isAttachmentMenuOpen.value = false;
  fileInputRef.value?.click();
};

// Handle image upload (same as file upload for now)
const handleImageUpload = () => {
  isAttachmentMenuOpen.value = false;
  fileInputRef.value?.click();
};

// Handle file change
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const files = Array.from(input.files);
  console.log("Files selected:", files);
  // TODO: Implement file upload logic
};

// Handle typing indicator
const handleTyping = () => {
  // TODO: Implement typing indicator logic
};

// Handle form submission
const handleFormSubmit = async () => {
  if (!inputMessage.value.trim() || isSending.value) return;

  if (editingMessageId.value) {
    await handleEditMessage(editingMessageId.value);
  } else {
    await handleSendMessage(inputMessage.value.trim());
  }
};

// Handle sending a message
const handleSendMessage = async (content: string) => {
  if (!content.trim()) return;

  try {
    isSending.value = true;
    
    // Create temporary message for optimistic UI
    const tempMessage: GroupMessage = {
      id: `temp-${Date.now()}`,
      content,
      sender_id: currentUser.value?.id || "",
      group_id: props.groupId,
      created_at: new Date().toISOString(),
      isCurrentUser: true,
      pending: true,
    };

    // Add to local messages immediately
    messages.value.push(tempMessage);
    
    // Scroll to bottom
    nextTick(() => {
      if (messagesEndRef.value) {
        messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
      }
    });

    // Send to API
    await groupsStore.sendGroupMessage(props.groupId, content);
    
    // Clear input
    inputMessage.value = "";
    
    if ($toast) {
      $toast.success("Message sent");
    }
  } catch (error) {
    console.error("Failed to send message:", error);
    
    // Remove the temp message on error
    const tempIndex = messages.value.findIndex(m => m.id.startsWith('temp-'));
    if (tempIndex !== -1) {
      messages.value.splice(tempIndex, 1);
    }
    
    if ($toast) {
      $toast.error("Failed to send message");
    }
  } finally {
    isSending.value = false;
  }
};

// Handle edit message
const handleEditMessage = (messageId: string) => {
  const message = messages.value.find((m) => m.id === messageId);
  if (message) {
    editingMessageId.value = messageId;
    inputMessage.value = message.content;
  }
};

// Handle cancel edit
const handleCancelEdit = () => {
  editingMessageId.value = null;
  inputMessage.value = "";
};

// Handle unsend message
const handleUnsendMessage = async (messageId: string) => {
  try {
    await messagesStore.deleteMessage(messageId);
    const messageIndex = messages.value.findIndex((m) => m.id === messageId);
    if (messageIndex !== -1) {
      messages.value[messageIndex].isDeleted = true;
      messages.value[messageIndex].content = "This message was deleted";
    }
    if ($toast) {
      $toast.success("Message deleted");
    }
  } catch (error) {
    console.error("Failed to delete message:", error);
    if ($toast) {
      $toast.error("Failed to delete message");
    }
  }
};

// Retry message
const retryMessage = async (messageId: string, content: string) => {
  console.log("Retrying message:", messageId, content);
  // TODO: Implement retry logic
};

// Load more messages
const loadMoreMessages = async () => {
  if (isLoadingMore.value || !canLoadMoreMessages.value) return;

  try {
    isLoadingMore.value = true;
    const nextPage = groupsStore.messagesPagination.current_page + 1;
    await groupsStore.getGroupMessages(props.groupId, nextPage);
  } catch (error) {
    console.error("Failed to load more messages:", error);
    if ($toast) {
      $toast.error("Failed to load more messages");
    }
  } finally {
    isLoadingMore.value = false;
  }
};

// Enhanced router refresh functionality for groups
const isRouterRefreshing = ref(false);

// Enhanced chat refresh function with router-like behavior for groups
const performGroupChatRefresh = async (newGroupId: string, oldGroupId?: string) => {
  try {
    isLoading.value = true;
    
    console.log(`🧹 [GroupChatArea] Cleaning up state for group change from ${oldGroupId} to ${newGroupId}`);
    
    // Clear all current state
    messages.value = [];
    filteredMessages.value = [];
    uploadProgress.value = [];
    showSearch.value = false;
    showInfo.value = false;
    editingMessageId.value = null;
    inputMessage.value = "";
    searchQuery.value = "";
    isSearching.value = false;
    isUploading.value = false;
    isSending.value = false;
    
    // Clear file input state
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
    
    // Force DOM update and reset scroll position
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = 0;
    }
    
    // Small delay to ensure cleanup is complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log(`🚀 [GroupChatArea] Initializing fresh state for group: ${newGroupId}`);
    
    // Fetch fresh group data and messages
    try {
      await Promise.all([
        groupsStore.getGroupDetails(newGroupId),
        groupsStore.getGroupMessages(newGroupId)
      ]);
      console.log(`🔄 [GroupChatArea] Fetched fresh data for group: ${newGroupId}`);
    } catch (error) {
      console.warn(`⚠️ [GroupChatArea] Failed to fetch fresh data for new group:`, error);
      if ($toast) {
        $toast.warning("Unable to load group chat history. Please refresh the page.");
      }
    }
    
    // Auto-scroll to bottom
    await nextTick();
    if (messagesEndRef.value) {
      messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
    }
    
    // Emit refresh event
    eventBus.emit("chat-refreshed", { 
      newRecipientId: newGroupId, 
      oldRecipientId: oldGroupId,
      timestamp: new Date().toISOString()
    });
    
    console.log(`✅ [GroupChatArea] Group chat refresh completed successfully for: ${newGroupId}`);
    
  } catch (error) {
    console.error(`❌ [GroupChatArea] Group chat refresh failed for ${newGroupId}:`, error);
    if ($toast) {
      $toast.error("Failed to switch group conversation. Please refresh the page.");
    }
  } finally {
    isLoading.value = false;
    isRouterRefreshing.value = false;
  }
};

// Watch for group ID changes with router refresh functionality
watch(
  () => props.groupId,
  async (newGroupId, oldGroupId) => {
    if (newGroupId && newGroupId !== oldGroupId && !isRouterRefreshing.value) {
      console.log(`🔄 [GroupChatArea] Group changed from ${oldGroupId} to ${newGroupId} - performing full refresh`);
      
      isRouterRefreshing.value = true;
      
      try {
        await performGroupChatRefresh(newGroupId, oldGroupId);
      } catch (error) {
        console.error("[GroupChatArea] Failed to refresh group chat:", error);
        if ($toast) {
          $toast.error("Failed to switch group conversation. Please try again.");
        }
      }
    }
  },
  { immediate: false }
);

// Listen for group chat switching events from router
if (process.client) {
  const handleGroupChatSwitched = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { newId, oldId } = customEvent.detail;
    if (newId === props.groupId) {
      console.log(`🎯 [GroupChatArea] Received group chat switch event for ${newId}`);
      nextTick(() => {
        performGroupChatRefresh(newId, oldId);
      });
    }
  };

  window.addEventListener('chat-switched', handleGroupChatSwitched as EventListener);

  onUnmounted(() => {
    window.removeEventListener('chat-switched', handleGroupChatSwitched as EventListener);
  });
}

// Watch for store messages changes
watch(storeMessages, () => {
  if (storeMessages.value && storeMessages.value.length > 0) {
    messages.value = storeMessages.value.map((message) => ({
      ...message,
      isCurrentUser: isCurrentUserMessage(message),
    }));
  }
});

// Component lifecycle
onMounted(async () => {
  console.log(`🚀 [GroupChatArea] Component mounted for group: ${props.groupId}`);
  
  // Perform full initialization using the same refresh logic
  await performGroupChatRefresh(props.groupId);
});

// Auto-scroll to bottom when new messages arrive (but not during initial load)
watch(
  () => messages.value.length,
  async (newLength, oldLength) => {
    if (newLength > oldLength && !isLoading.value) {
      await nextTick();
      if (messagesEndRef.value) {
        messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
);

// Cleanup when component is unmounted
onUnmounted(() => {
  console.log("🧹 [GroupChatArea] Component unmounting - cleaning up");

  // Remove event listeners
  eventBus.off("group-message");

  console.log("✅ [GroupChatArea] Cleanup completed");
});

// Expose refresh and clear functions for parent components
defineExpose({
  performGroupChatRefresh,
  clearMessages: () => {
    messages.value = [];
  }
});
</script>

<style scoped>
/* Add any component-specific styles here */
.animate-fadeIn {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ensure smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Enhanced button states */
.btn-primary {
  background-color: #3b82f6;
  color: white;
  transition: all 0.2s ease-in-out;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
