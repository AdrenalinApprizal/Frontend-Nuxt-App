<template>
  <div class="flex h-full bg-white">
    <!-- Main chat area with smooth transition -->
    <div
      class="flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out"
      :class="[
        showInfo ? 'lg:mr-80' : '',
        isLoading ? 'opacity-75' : 'opacity-100',
      ]"
    >
      <!-- Header with recipient info -->
      <div
        class="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between"
      >
        <div class="flex items-center">
          <div class="relative mr-3">
            <OptimizedAvatar
              :src="validatedRecipientAvatar"
              :alt="recipient.name || 'Contact'"
              size="lg"
              class="flex-shrink-0"
            />
            <span
              v-if="recipient.status === 'online'"
              class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"
            ></span>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">
              {{ recipient.name || "Contact" }}
            </h2>
            <p class="text-xs text-gray-500">
              {{ recipient.status === "online" ? "Online" : "Offline" }}
              <span v-if="isTyping" class="ml-2 text-blue-500">typing...</span>
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <button
            @click="showSearch = true"
            class="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200"
            title="Search in conversation"
          >
            <Icon name="fa:search" class="h-4 w-4" />
          </button>
          <button
            @click="showInfo = !showInfo"
            class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            :class="{ 'bg-blue-50 text-blue-500': showInfo }"
            title="Friend info"
          >
            <Icon name="lucide:info" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Search component -->
      <SearchOnFriend
        :isOpen="showSearch"
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
            <p class="text-sm text-gray-600 font-medium">
              {{
                recipient.name
                  ? `Loading conversation with ${recipient.name}...`
                  : "Loading messages..."
              }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Please wait while we refresh the chat
            </p>
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

        <!-- Messages list with date separators -->
        <div
          v-for="group in groupedMessages"
          :key="group.dateKey"
          class="message-group"
        >
          <!-- Date separator -->
          <div class="flex justify-center my-4">
            <div class="bg-gray-100 rounded-full px-3 py-1">
              <span class="text-xs text-gray-600 font-medium">
                {{
                  group.isToday
                    ? "Today"
                    : group.isYesterday
                    ? "Yesterday"
                    : group.date
                }}
              </span>
            </div>
          </div>

          <!-- Messages for this date using ChatAreaItem component -->
          <ChatAreaItem
            v-for="message in group.messages"
            :key="message.id"
            :message="{
              ...message,
              created_at:
                message.created_at ||
                message.timestamp ||
                new Date().toISOString(),
            }"
            :recipient="{
              id: recipient.id,
              name:
                recipient.name ||
                recipient.first_name + ' ' + recipient.last_name ||
                'Unknown User',
              avatar: recipient.avatar,
              profile_picture_url:
                recipient.profile_picture_url || recipient.avatar,
            }"
            @retry-click="retryFailedMessage"
            @edit-click="handleEditMessage"
            @delete-click="handleUnsendMessage"
          />
        </div>

        <!-- End of messages indicator for auto-scroll -->
        <div ref="messagesEndRef"></div>
      </div>

      <!-- Message input area -->
      <div class="p-4 bg-white border-t border-gray-200">
        <!-- Upload progress indicator -->
        <div v-if="isUploading && uploadProgress.length > 0" class="mb-3">
          <div class="text-sm text-gray-600 mb-2">
            Uploading {{ uploadProgress.length }} file(s)...
          </div>
          <div class="space-y-2">
            <div
              v-for="progress in uploadProgress"
              :key="progress.id"
              class="flex items-center space-x-3"
            >
              <div class="flex-1">
                <div class="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{{ progress.file.name }}</span>
                  <span>{{ progress.progress }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-300"
                    :class="{
                      'bg-blue-500': progress.status === 'uploading',
                      'bg-green-500': progress.status === 'success',
                      'bg-red-500': progress.status === 'error',
                      'bg-gray-300': progress.status === 'pending',
                    }"
                    :style="{ width: `${progress.progress}%` }"
                  ></div>
                </div>
                <div v-if="progress.error" class="text-xs text-red-500 mt-1">
                  {{ progress.error }}
                </div>
              </div>
            </div>
          </div>
        </div>

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

        <form @submit.prevent="handleFormSubmit" class="flex flex-col">
          <div class="flex items-center">
            <div class="relative">
              <button
                type="button"
                @click="handleFileUpload"
                class="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200 mr-2"
                title="Attach file"
                :disabled="isSending || isUploading"
              >
                <Icon
                  v-if="isUploading"
                  name="svg-spinners:270-ring"
                  class="h-5 w-5"
                />
                <Icon v-else name="lucide:paperclip" class="h-5 w-5" />
              </button>
              <!-- Hidden file input for all file types -->
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*,video/*,audio/*,application/*,text/*"
                class="hidden"
                multiple
                @change="handleFileChange"
                :disabled="isSending || isUploading"
              />
            </div>
            <div
              v-if="isSending"
              class="fixed top-0 left-0 right-0 bg-blue-500 h-1 z-50"
            >
              <div class="h-full bg-white animate-progress"></div>
            </div>
            <input
              v-model="inputMessage"
              type="text"
              :placeholder="
                editingMessageId
                  ? 'Edit your message...'
                  : 'Type your message...'
              "
              class="flex-1 py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-400 text-gray-700"
              @input="handleTyping"
              :disabled="isSending"
            />
            <button
              type="submit"
              class="bg-blue-500 text-white p-3 rounded-full ml-2 hover:bg-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="
                (!inputMessage.trim() && !editingMessageId) ||
                isSending ||
                isUploading
              "
            >
              <div
                v-if="isSending || isUploading"
                class="animate-spin rounded-full h-4 w-4 border-t-2 border-white"
              ></div>
              <Icon v-else name="fa:paper-plane" class="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Friend Info Panel (conditionally rendered as a side panel) -->
    <FriendInfoPanel
      v-if="showInfo"
      :username="recipient.name"
      :friendDetails="adaptRecipientToFriendDetails(recipient)"
      @close="showInfo = false"
      class="absolute lg:relative right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 z-10 lg:z-auto"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from "vue";
import SearchOnFriend from "./SearchOnFriend.vue";
import FriendInfoPanel from "./FriendInfoPanel.vue";
// import RecipientProfile from "./RecipientProfile.vue";
import ChatAreaItem from "./ChatAreaItem.vue"; // Import the new component
import { useMessagesStore } from "~/composables/useMessages";
import { useAuthStore } from "~/composables/useAuth";
import { useWebSocket, WebSocketMessageType } from "~/composables/useWebSocket";
import { useWebSocketListener } from "~/composables/useWebSocketListener";
import { usePresence } from "~/composables/usePresence";
import { eventBus } from "~/composables/useEventBus";
import { useNuxtApp } from "#app";
import { useFiles } from "~/composables/useFiles";
import { useFriendsStore } from "~/composables/useFriends";
import {
  formatMessageTimestamp,
  formatDateForSeparator,
} from "~/utils/timestampHelper";
import {
  uploadFileAndSendMessage,
  validateFile,
  getMediaType,
  formatFileSize,
  type FileUploadResult,
} from "~/utils/fileUploadHelper";

// Services and stores
const { $toast } = useNuxtApp();
const messagesStore = useMessagesStore();
const authStore = useAuthStore();
const friendsStore = useFriendsStore();
const webSocketStore = useWebSocket();
const wsListener = useWebSocketListener();
const presence = usePresence();

// Current user
const currentUser = computed(() => authStore.user);

// Props definition
interface Props {
  recipientId: string;
  recipientName?: string;
  chatMessages?: Message[];
}

const props = defineProps<Props>();

// Define Message interface
interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id?: string;
  timestamp: string;
  raw_timestamp?: string;
  sent_at?: string;
  created_at?: string;
  updated_at?: string;
  isCurrentUser: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  attachment?: any;
  pending?: boolean;
  failed?: boolean;
  sent?: boolean;
  read?: boolean;
  retrying?: boolean;
  errorMessage?: string;
  retryCount?: number;
  type?: string;
  receivedViaWebSocket?: boolean;
}

// Helper function for timestamp formatting
const formatTimestamp = (timestamp: string | null | undefined): string => {
  if (!timestamp) return "";

  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return "";
  }
};

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
const filteredMessages = ref<Message[]>([]);
const isTyping = ref(false);
const isLoadingMore = ref(false);
const typingTimeout = ref<NodeJS.Timeout | null>(null);
const isSending = ref(false);
const isLoading = ref(false);

// Enhanced file upload state - React style
interface FileProgress {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error: string | null;
}

const uploadProgress = ref<FileProgress[]>([]);
const isUploading = ref(false);
const dragActive = ref(false);

// Refs for DOM manipulation
const dropdownRef = ref<HTMLElement | null>(null);
const messagesEndRef = ref<HTMLElement | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Validate recipient avatar - similar to React implementation
const validatedRecipientAvatar = computed(() => {
  const avatarUrl =
    recipient.value.profile_picture_url || recipient.value.avatar;
  if (!avatarUrl) return null;

  // Check if it's a data URL
  if (avatarUrl.startsWith("data:")) {
    // Check size limit (most browsers support up to 2MB for data URLs)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (avatarUrl.length > maxSize) {
      console.warn(
        "[ChatArea] Avatar too large:",
        avatarUrl.length,
        "bytes, max:",
        maxSize
      );
      return null; // Fallback to default icon
    }

    // Validate data URL format
    const dataUrlRegex =
      /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/;
    if (!dataUrlRegex.test(avatarUrl)) {
      console.warn(
        "[ChatArea] Invalid data URL format:",
        avatarUrl.substring(0, 100)
      );
      return null;
    }
  }

  return avatarUrl;
});

// Messages state
const messages = ref<Message[]>([]);

// Computed property to determine which messages to display
const displayMessages = computed(() => {
  if (!messages.value || !Array.isArray(messages.value)) {
    console.warn(
      `🔍 [ChatArea] displayMessages: messages.value is not an array:`,
      messages.value
    );
    return [];
  }

  // If there's a search query active, show filtered messages
  if (isSearching.value && searchQuery.value) {
    return filteredMessages.value;
  }

  // Otherwise show all messages
  const sorted = [...messages.value].sort((a, b) => {
    const dateA = new Date(a.created_at || a.timestamp || 0).getTime();
    const dateB = new Date(b.created_at || b.timestamp || 0).getTime();
    return dateA - dateB;
  });

  console.log(
    `🔍 [ChatArea] displayMessages computed: ${sorted.length} messages`,
    sorted.slice(0, 2)
  );

  return sorted;
});

// Enhanced message grouping by date with better formatting - React style
const groupedMessages = computed(() => {
  if (!displayMessages.value || !Array.isArray(displayMessages.value))
    return [];

  const messagesByDate: Record<
    string,
    {
      dateKey: string;
      date: string;
      messages: Message[];
      isToday: boolean;
      isYesterday: boolean;
    }
  > = {};

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // Sort messages by timestamp first
  const sortedMessages = [...displayMessages.value].sort((a, b) => {
    // Use raw_timestamp for most accurate sorting, fallback to other timestamps
    const timeA = new Date(
      a.raw_timestamp || a.sent_at || a.created_at || a.timestamp || 0
    ).getTime();
    const timeB = new Date(
      b.raw_timestamp || b.sent_at || b.created_at || b.timestamp || 0
    ).getTime();
    return timeA - timeB;
  });

  sortedMessages.forEach((message) => {
    const messageDate = new Date(
      message.raw_timestamp ||
        message.sent_at ||
        message.created_at ||
        message.timestamp ||
        new Date()
    );

    // Check if date is invalid and provide fallback
    if (isNaN(messageDate.getTime())) {
      console.warn("Invalid date for message:", {
        messageId: message.id,
        content: message.content?.substring(0, 20),
        raw_timestamp: message.raw_timestamp,
        sent_at: message.sent_at,
        created_at: message.created_at,
        timestamp: message.timestamp,
      });
      messageDate.setTime(new Date().getTime()); // Set to current time as fallback
    }

    const dateKey = messageDate.toDateString();

    if (!messagesByDate[dateKey]) {
      messagesByDate[dateKey] = {
        dateKey,
        date: formatDateForSeparator(messageDate),
        messages: [],
        isToday: dateKey === today,
        isYesterday: dateKey === yesterday,
      };
    }

    // Use the message as-is since ChatAreaItem handles validation
    messagesByDate[dateKey].messages.push(message);
  });

  // Convert to array and sort by date
  return Object.values(messagesByDate).sort(
    (a, b) => new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime()
  );
});

// Enhanced retry mechanism for failed messages - React style
const retryFailedMessage = async (message: Message) => {
  if (!message.content || !props.recipientId) return;

  console.log(`[ChatArea] Retrying failed message: ${message.id}`);

  // Update message to show retrying state
  const messageIndex = messages.value.findIndex((msg) => msg.id === message.id);
  if (messageIndex !== -1) {
    messages.value[messageIndex] = {
      ...messages.value[messageIndex],
      retrying: true,
      failed: false,
      errorMessage: undefined,
    };
  }

  try {
    // Retry with enhanced WebSocket + API fallback logic
    let response: any = null;
    let messageId = message.id;

    // Try WebSocket first if connected
    if (webSocketStore.isConnected) {
      try {
        // Implement WebSocket retry logic here
        console.log("[ChatArea] Retrying via WebSocket");
        // WebSocket retry would go here
      } catch (wsError) {
        console.warn("[ChatArea] WebSocket retry failed, using API:", wsError);
        response = await messagesStore.sendMessage(
          props.recipientId,
          message.content
        );
        if (response?.data?.id) {
          messageId = response.data.id;
        }
      }
    } else {
      response = await messagesStore.sendMessage(
        props.recipientId,
        message.content
      );
      if (response?.data?.id) {
        messageId = response.data.id;
      }
    }

    // Update message to show success
    if (messageIndex !== -1) {
      messages.value[messageIndex] = {
        ...messages.value[messageIndex],
        id: messageId,
        retrying: false,
        failed: false,
        sent: true,
        errorMessage: undefined,
        retryCount: (messages.value[messageIndex].retryCount || 0) + 1,
      };
    }

    saveToSessionStorage(messages.value);
    $toast?.success("Message sent successfully!");
  } catch (error) {
    console.error("[ChatArea] Retry failed:", error);

    // Update message to show retry failure
    if (messageIndex !== -1) {
      messages.value[messageIndex] = {
        ...messages.value[messageIndex],
        retrying: false,
        failed: true,
        errorMessage: error instanceof Error ? error.message : "Retry failed",
        retryCount: (messages.value[messageIndex].retryCount || 0) + 1,
      };
    }

    $toast?.error("Retry failed. Please try again.");
  }
};

// Enhanced form submission handler for both new messages and edits - React style
const handleFormSubmit = async () => {
  // Handle edit submission
  if (editingMessageId.value) {
    await handleSubmitEdit();
    return;
  }

  // Handle new message submission
  await handleSendMessage();
};

// Enhanced edit submit handler
const handleSubmitEdit = async () => {
  if (!editingMessageId.value || !inputMessage.value.trim()) return;

  const messageContent = inputMessage.value.trim();
  const originalMessage = messages.value.find(
    (msg) => msg.id === editingMessageId.value
  );

  if (!originalMessage) return;

  try {
    isSending.value = true;

    // Update message optimistically
    const messageIndex = messages.value.findIndex(
      (msg) => msg.id === editingMessageId.value
    );
    if (messageIndex !== -1) {
      messages.value[messageIndex] = {
        ...messages.value[messageIndex],
        content: messageContent,
        isEdited: true,
        pending: true,
      };
    }

    // Call edit API
    const response = await messagesStore.editMessage(
      editingMessageId.value,
      messageContent
    );

    // Update with successful edit
    if (messageIndex !== -1) {
      messages.value[messageIndex] = {
        ...messages.value[messageIndex],
        content: messageContent,
        isEdited: true,
        pending: false,
        updated_at: new Date().toISOString(),
      };
    }

    // Save to session storage
    saveToSessionStorage(messages.value);

    // Clear edit state
    editingMessageId.value = null;
    inputMessage.value = "";

    $toast?.success("Message updated successfully");
  } catch (error) {
    console.error("[ChatArea] Error editing message:", error);

    // Revert optimistic update
    const messageIndex = messages.value.findIndex(
      (msg) => msg.id === editingMessageId.value
    );
    if (messageIndex !== -1 && originalMessage) {
      messages.value[messageIndex] = { ...originalMessage, pending: false };
    }

    $toast?.error("Failed to edit message");
  } finally {
    isSending.value = false;
  }
};

// Enhanced send message function with React-style optimistic updates
const handleSendMessage = async () => {
  const content = inputMessage.value.trim();
  if (!content || !props.recipientId) return;

  // Generate unique temp ID for optimistic update
  const tempId = `temp-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  try {
    isSending.value = true;

    // Create optimistic message for immediate UI feedback - React style
    const nowIsoString = new Date().toISOString();
    const optimisticMessage: Message = {
      id: tempId,
      sender_id: currentUser.value?.id || "",
      recipient_id: props.recipientId,
      content,
      timestamp: formatTimestamp(nowIsoString),
      raw_timestamp: nowIsoString,
      created_at: nowIsoString,
      updated_at: nowIsoString,
      isCurrentUser: true,
      pending: true,
      sent: false,
      // Add React-style message state
      type: "text",
      retryCount: 0,
    };

    // Add optimistic message immediately for instant UI feedback
    messages.value.push(optimisticMessage);

    // Clear input immediately for better UX
    inputMessage.value = "";

    // Auto-scroll to show the new message
    nextTick(() => {
      if (messagesEndRef.value) {
        messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
      }
    });

    let response: any = null;
    let messageId = tempId;
    let sendSuccess = false;

    // Enhanced sending logic with WebSocket priority and API fallback - React style
    if (webSocketStore.isConnected) {
      try {
        console.log("[ChatArea] Attempting WebSocket send...");

        // WebSocket message format
        const wsMessage = {
          type: WebSocketMessageType.MESSAGE,
          data: {
            content,
            recipient_id: props.recipientId,
            type: "private",
            temp_id: tempId,
          },
        };

        // Send via WebSocket first
        await webSocketStore.send(wsMessage);

        // For WebSocket, we'll wait for confirmation via the event system
        // The temp message will be replaced when the server confirms
        sendSuccess = true;
        console.log("[ChatArea] WebSocket send initiated");
      } catch (wsError) {
        console.warn(
          "[ChatArea] WebSocket send failed, falling back to API:",
          wsError
        );

        // Fallback to API
        response = await messagesStore.sendMessage(props.recipientId, content);
        if (response?.data?.id) {
          messageId = response.data.id;
          sendSuccess = true;
        }
      }
    } else {
      console.log("[ChatArea] WebSocket not connected, using API");
      response = await messagesStore.sendMessage(props.recipientId, content);
      if (response?.data?.id) {
        messageId = response.data.id;
        sendSuccess = true;
      }
    }

    if (sendSuccess) {
      // Update optimistic message with successful state
      const messageIndex = messages.value.findIndex((msg) => msg.id === tempId);
      if (messageIndex !== -1) {
        messages.value[messageIndex] = {
          ...optimisticMessage,
          id: messageId,
          pending: false,
          sent: true,
          failed: false,
          // Include any additional data from response
          ...(response?.data ? response.data : {}),
        };
      }

      // Save to session storage
      saveToSessionStorage(messages.value);
    } else {
      throw new Error("Send failed - no response received");
    }
  } catch (error) {
    console.error("[ChatArea] Error sending message:", error);

    // Update the optimistic message to show error state - React style
    const messageIndex = messages.value.findIndex((msg) => msg.id === tempId);
    if (messageIndex !== -1) {
      messages.value[messageIndex] = {
        ...messages.value[messageIndex],
        pending: false,
        failed: true,
        sent: false,
        errorMessage: error instanceof Error ? error.message : "Send failed",
        retryCount: 0,
      };
    }

    // Restore input message on failure for retry
    if (!inputMessage.value.trim()) {
      inputMessage.value = content;
    }

    $toast?.error("Failed to send message");
  } finally {
    isSending.value = false;
  }
};

// Helper to get appropriate emoji based on file type
const getFileEmoji = (mimeType: string): string => {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.startsWith("video/")) return "🎥";
  if (mimeType.startsWith("audio/")) return "🎵";
  if (mimeType.startsWith("application/pdf")) return "📄";
  if (mimeType.includes("document") || mimeType.includes("text/")) return "📝";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return "📊";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return "📑";
  if (mimeType.includes("zip") || mimeType.includes("compressed")) return "🗜️";
  return "📎"; // Default
};

// Enhanced unified file upload handling
const handleFileUpload = () => {
  if (fileInputRef.value) {
    $toast?.info("Select files to upload", { autoClose: 2000 });
    fileInputRef.value.click();
  }
};
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);

  if (!files.length) return;

  try {
    // Validate files using fileUploadHelper
    const invalidFiles: string[] = [];
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        invalidFiles.push(`${file.name}: ${validation.error}`);
      }
    }

    if (invalidFiles.length > 0) {
      $toast?.error(invalidFiles.join(", "));
      return;
    }

    isUploading.value = true;

    // Create upload progress tracking objects
    uploadProgress.value = files.map((file, index) => ({
      id: `file-${index}-${Date.now()}`,
      file,
      progress: 0,
      status: "pending" as const,
      error: null,
    }));

    // Process files sequentially with progress tracking
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progressItem = uploadProgress.value[i];
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

      try {
        progressItem.status = "uploading";
        progressItem.progress = 5;

        // Generate temp ID for optimistic update
        const tempId = `temp-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const nowIsoString = new Date().toISOString();

        // Create optimistic message immediately
        const optimisticMessage: Message = {
          id: tempId,
          sender_id: currentUser.value?.id || "",
          recipient_id: props.recipientId,
          content: `${getFileEmoji(file.type)} ${file.name}`,
          timestamp: formatTimestamp(nowIsoString),
          raw_timestamp: nowIsoString,
          created_at: nowIsoString,
          updated_at: nowIsoString,
          isCurrentUser: true,
          pending: true,
          sent: false,
          attachment: {
            mediaType: file.type, // Store the actual MIME type
            url: URL.createObjectURL(file),
            name: file.name,
            size: formatFileSize(file.size),
            isOptimistic: true,
          },
        };

        // Add optimistic message to UI immediately
        messages.value.push(optimisticMessage);
        saveToSessionStorage(messages.value);

        // Scroll to show the new message
        nextTick(() => {
          if (messagesEndRef.value) {
            messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
          }
        });

        // Progress increment for better user feedback
        setTimeout(() => {
          progressItem.progress = 25;
        }, 200);

        // Enhanced upload with progress tracking
        const result = await uploadFileAndSendMessage(
          file,
          props.recipientId,
          `${getFileEmoji(file.type)} ${file.name}`,
          false, // isGroup = false for private chat
          // Progress callback
          (progress: number) => {
            progressItem.progress = Math.max(30, progress); // Start at 30% min for better UX
          }
        );

        // Update the optimistic message with real data
        const messageIndex = messages.value.findIndex((m) => m.id === tempId);
        if (messageIndex !== -1) {
          messages.value[messageIndex] = {
            ...messages.value[messageIndex],
            id: result.messageId || tempId,
            pending: false,
            sent: true,
            attachment: {
              mediaType: result.fileType, // Simpan MIME type langsung
              url: result.fileUrl,
              name: result.fileName,
              size: formatFileSize(result.fileSize),
              isOptimistic: false,
            },
          };
        }

        progressItem.status = "success";
        progressItem.progress = 100;

        // Subtle notification for success
        $toast?.success(`${result.fileName} sent successfully`);

        // Listen for WebSocket confirmation - uncomment and update this when the WebSocket API supports it
        // wsListener.listenToWSEvent("message-received", (data) => {
        //   if (data.id === result.messageId) {
        //     console.log(`[ChatArea] Message received confirmation for ${result.messageId}`);
        //     // Could update read status here
        //   }
        // });
      } catch (error) {
        // Update UI to show failed message
        const failedIndex = messages.value.findIndex(
          (m) => m.content.includes(file.name) && m.pending === true
        );

        if (failedIndex !== -1) {
          messages.value[failedIndex] = {
            ...messages.value[failedIndex],
            pending: false,
            failed: true,
            errorMessage:
              error instanceof Error ? error.message : "Upload failed",
          };
        }

        progressItem.status = "error";
        progressItem.error =
          error instanceof Error ? error.message : "Upload failed";
        progressItem.progress = 100; // Complete the progress bar, but in error state

        $toast?.error(`Failed to upload ${file.name}: ${progressItem.error}`);
        console.error("[ChatArea] File upload error:", error);
      }
    }

    // Save to session storage after all uploads
    saveToSessionStorage(messages.value);
  } catch (error) {
    console.error("[ChatArea] File upload error:", error);
    $toast?.error("Failed to upload files");
  } finally {
    // Keep progress visible for a moment so users can see completion
    setTimeout(() => {
      isUploading.value = false;
      uploadProgress.value = [];
    }, 1500);

    // Reset file input immediately
    if (target) target.value = "";
  }
};

// Removed separate handleImageChange function - now all file types are handled by handleFileChange

// Handle typing indicator
const handleTyping = () => {
  // Clear existing timeout
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }

  // Set typing indicator
  isTyping.value = true;

  // Clear typing indicator after 2 seconds
  typingTimeout.value = setTimeout(() => {
    isTyping.value = false;
  }, 2000);
};

// Replace the recipient computed property with friend data
const recipient = computed(() => {
  // Get friend data from friends store
  const friend = friendsStore.friends.find((f) => f.id === props.recipientId);
  const presenceStatus = presence.getStatus(props.recipientId);

  // Normalize status to be compatible with RecipientProfile component
  // Only "online", "offline", or "busy" are allowed
  const normalizeStatus = (
    status: string | undefined
  ): "online" | "offline" | "busy" => {
    if (!status) return "offline";
    if (status === "online" || status === "offline" || status === "busy")
      return status as "online" | "offline" | "busy";
    // Map "away" to either "busy" or another allowed status
    if (status === "away") return "busy";
    return "offline"; // Default fallback
  };

  if (!friend) {
    return {
      id: props.recipientId,
      name: props.recipientName,
      first_name: "",
      last_name: "",
      status: normalizeStatus(presenceStatus),
      avatar: undefined, // Add avatar property
      email: "", // Add email property
    };
  }

  return {
    ...friend,
    status: normalizeStatus(presenceStatus),
    avatar: friend.profile_picture_url || friend.avatar, // Ensure avatar is set
  };
});

// Function to adapt Recipient type to what FriendInfoPanel expects
const adaptRecipientToFriendDetails = (recipient: any) => {
  // Ensure status is compatible with FriendInfoPanel's "online" | "offline" type
  const normalizedStatus: "online" | "offline" =
    recipient.status === "online" ? "online" : "offline";

  return {
    id: recipient.id || props.recipientId,
    name:
      recipient.name ||
      `${recipient.first_name || ""} ${recipient.last_name || ""}`.trim() ||
      "User",
    first_name: recipient.first_name || "",
    last_name: recipient.last_name || "",
    email: recipient.email || "",
    phone: recipient.phone || "",
    status: normalizedStatus,
    avatar: recipient.avatar || recipient.profile_picture_url,
    profile_picture_url: recipient.profile_picture_url || recipient.avatar,
    username: recipient.username || recipient.name,
    avatar_url:
      recipient.avatar_url || recipient.profile_picture_url || recipient.avatar,
    display_name:
      recipient.display_name ||
      `${recipient.first_name || ""} ${recipient.last_name || ""}`.trim() ||
      recipient.name,
    full_name:
      recipient.full_name ||
      `${recipient.first_name || ""} ${recipient.last_name || ""}`.trim(),
  };
};

// Default messages to use if no chatMessages provided
const defaultMessages = [
  {
    id: "1",
    content: "Hi there!",
    timestamp: "10:20 AM",
    isCurrentUser: false,
    read: true,
  },
  {
    id: "2",
    content: "Hello! How are you?",
    timestamp: "10:22 AM",
    isCurrentUser: true,
    read: true,
  },
  {
    id: "3",
    content: "I'm good, thanks for asking. How about you?",
    timestamp: "10:25 AM",
    isCurrentUser: false,
    read: true,
  },
  {
    id: "4",
    content: "I'm doing well! Just working on that project we discussed.",
    timestamp: "10:30 AM",
    isCurrentUser: true,
    read: false,
  },
];

// Missing function implementations
const handleAdvancedSearch = (query: string) => {
  searchQuery.value = query;
  isSearching.value = !!query;

  if (!query) {
    filteredMessages.value = [];
    return;
  }

  // Filter messages based on search query
  filteredMessages.value = messages.value.filter(
    (message) =>
      message.content &&
      message.content.toLowerCase().includes(query.toLowerCase())
  );

  $toast?.info(`Found ${filteredMessages.value.length} matching messages`);
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
    // Load more messages when scrolled to top
    loadMoreMessages();
  }
};

// Load more messages function
const loadMoreMessages = async () => {
  if (isLoadingMore.value) return;

  isLoadingMore.value = true;
  try {
    // Implement pagination logic here
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Placeholder
  } catch (error) {
    console.error("Failed to load more messages:", error);
  } finally {
    isLoadingMore.value = false;
  }
};

// Handle recipient avatar error
const handleRecipientAvatarError = (event: Event) => {
  console.warn("Recipient avatar failed to load");
  const img = event.target as HTMLImageElement;
  img.style.display = "none";
};

// Handle cancel edit
const handleCancelEdit = () => {
  editingMessageId.value = null;
  inputMessage.value = "";
};

// Handle edit message
const handleEditMessage = (messageId: string) => {
  const message = messages.value.find((m) => m.id === messageId);
  if (message) {
    editingMessageId.value = messageId;
    inputMessage.value = message.content;
  }
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
    saveToSessionStorage(messages.value);
    $toast?.success("Message deleted");
  } catch (error) {
    console.error("Failed to delete message:", error);
    $toast?.error("Failed to delete message");
  }
};

// WebSocket connection functions
const connectWebSocket = async () => {
  try {
    await webSocketStore.connect();
  } catch (error) {
    console.error("Failed to connect WebSocket:", error);
  }
};

const reconnectWebSocket = () => {
  webSocketStore.reconnect();
};

const getConnectionErrorMessage = () => {
  return webSocketStore.connectionError || "Connection error";
};

// Handle WebSocket messages
const handleWebSocketMessages = () => {
  eventBus.on("private-message", (data: any) => {
    if (
      data.sender_id === props.recipientId ||
      data.recipient_id === props.recipientId
    ) {
      const newMessage: Message = {
        id: data.id,
        content: data.content,
        sender_id: data.sender_id,
        recipient_id: data.recipient_id,
        timestamp: formatTimestamp(data.created_at),
        raw_timestamp: data.created_at,
        created_at: data.created_at,
        isCurrentUser: data.sender_id === currentUser.value?.id,
        read: false,
        sent: true,
        receivedViaWebSocket: true,
      };

      messages.value.push(newMessage);
      saveToSessionStorage(messages.value);

      nextTick(() => {
        if (messagesEndRef.value) {
          messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  });
};

// Fetch private messages from API
const fetchPrivateMessages = async () => {
  try {
    const response = await messagesStore.getMessages({
      target_id: props.recipientId,
      type: "private",
    });
    if (response?.data) {
      const apiMessages = response.data.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        recipient_id: msg.recipient_id,
        timestamp: formatTimestamp(msg.created_at),
        raw_timestamp: msg.created_at,
        created_at: msg.created_at,
        updated_at: msg.updated_at,
        isCurrentUser: msg.sender_id === currentUser.value?.id,
        read: msg.is_read || false,
        sent: true,
        isEdited: msg.is_edited || false,
        isDeleted: msg.is_deleted || false,
        attachment: msg.attachment || null,
      }));

      messages.value = apiMessages;
      saveToSessionStorage(messages.value);
    }
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw error;
  }
};

// Validate message bubbles positioning
const validateMessageBubbles = () => {
  messages.value.forEach((message) => {
    if (message.sender_id === currentUser.value?.id) {
      message.isCurrentUser = true;
    } else {
      message.isCurrentUser = false;
    }
  });
};

// Handle click outside dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = null;
  }
};

// Simple session storage management
const saveToSessionStorage = (messagesList: Message[]) => {
  if (!messagesList || messagesList.length === 0) {
    return; // Don't save empty arrays
  }

  try {
    const conversationKey = `chat_${props.recipientId}`;

    // Optimize storage by keeping only the essential fields
    const optimizedMessages = messagesList.map((msg) => ({
      id: msg.id,
      content: msg.content,
      sender_id: msg.sender_id,
      recipient_id: msg.recipient_id,
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
      read: msg.read,
    }));

    sessionStorage.setItem(conversationKey, JSON.stringify(optimizedMessages));

    console.log(
      `💾 [ChatArea] Saved ${optimizedMessages.length} messages to session storage for recipient ${props.recipientId}`
    );
  } catch (error) {
    console.error(
      "❌ [ChatArea] Failed to save messages to session storage:",
      error
    );

    // Try with a more aggressive optimization if the data was too large
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      try {
        // Keep only the most recent 50 messages
        const reducedMessages = messagesList.slice(-50).map((msg) => ({
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          timestamp: msg.timestamp,
          isCurrentUser: msg.isCurrentUser,
        }));

        const conversationKey = `chat_${props.recipientId}`;
        sessionStorage.setItem(
          conversationKey,
          JSON.stringify(reducedMessages)
        );

        console.log(
          "💾 [ChatArea] Saved reduced message set due to storage quota limits"
        );
      } catch (secondError) {
        console.error(
          "❌ [ChatArea] Failed to save even reduced message set:",
          secondError
        );
        // Clear this conversation's storage if we can't save anything
        try {
          sessionStorage.removeItem(`chat_${props.recipientId}`);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }
};

const loadFromSessionStorage = (): Message[] => {
  try {
    const conversationKey = `chat_${props.recipientId}`;
    const storedData = sessionStorage.getItem(conversationKey);

    if (!storedData) {
      console.log(
        `📭 [ChatArea] No stored messages found for recipient ${props.recipientId}`
      );
      return [];
    }

    const parsedMessages = JSON.parse(storedData) as Message[];

    if (!Array.isArray(parsedMessages)) {
      console.warn("⚠️ [ChatArea] Stored data is not an array, ignoring");
      return [];
    }

    console.log(
      `💾 [ChatArea] Loaded ${parsedMessages.length} messages from session storage for recipient ${props.recipientId}`
    );

    return parsedMessages;
  } catch (error) {
    console.error(
      "❌ [ChatArea] Failed to load messages from session storage:",
      error
    );
    // Clear corrupted data
    try {
      sessionStorage.removeItem(`chat_${props.recipientId}`);
    } catch (e) {
      // Ignore cleanup errors
    }
    return [];
  }
};

// Clean up blob URLs to prevent memory leaks
const cleanupBlobUrls = () => {
  messages.value.forEach((message) => {
    if (message.attachment?.isOptimistic && message.attachment?.url) {
      try {
        if (message.attachment.url.startsWith("blob:")) {
          URL.revokeObjectURL(message.attachment.url);
          console.log(`[ChatArea] Revoked blob URL for message ${message.id}`);
        }
      } catch (err) {
        console.warn("[ChatArea] Failed to revoke blob URL:", err);
      }
    }
  });
};

// Component lifecycle management with enhanced initialization
onMounted(async () => {
  console.log(
    `🚀 [ChatArea] Component mounted for recipient: ${props.recipientId}`
  );

  // Perform full initialization using the same refresh logic
  await performChatRefresh(props.recipientId);
});

// Enhanced initialization and router refresh handling
const isRouterRefreshing = ref(false);

// Listen for chat switching events from router
if (process.client) {
  const handleChatSwitched = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { newId, oldId } = customEvent.detail;
    if (newId === props.recipientId) {
      console.log(`🎯 [ChatArea] Received chat switch event for ${newId}`);
      // Force refresh of this component's state
      nextTick(() => {
        performChatRefresh(newId, oldId);
      });
    }
  };

  window.addEventListener("chat-switched", handleChatSwitched as EventListener);

  // Cleanup listener
  onUnmounted(() => {
    window.removeEventListener(
      "chat-switched",
      handleChatSwitched as EventListener
    );
  });
}

// Enhanced watch for recipient changes with router refresh functionality
watch(
  () => props.recipientId,
  async (newRecipientId, oldRecipientId) => {
    if (
      newRecipientId &&
      newRecipientId !== oldRecipientId &&
      !isRouterRefreshing.value
    ) {
      console.log(
        `🔄 [ChatArea] Recipient changed from ${oldRecipientId} to ${newRecipientId} - performing enhanced refresh`
      );

      // Set router refreshing state
      isRouterRefreshing.value = true;

      try {
        // Perform complete state cleanup and refresh with enhanced error handling
        await performChatRefresh(newRecipientId, oldRecipientId);
      } catch (error) {
        console.error("Enhanced chat refresh failed:", error);
        // Fallback: try basic initialization
        try {
          await fetchPrivateMessages();
        } catch (fallbackError) {
          console.error("Fallback refresh also failed:", fallbackError);
          $toast?.error("Failed to load chat. Please refresh the page.");
        }
      } finally {
        isRouterRefreshing.value = false;
      }
    }
  },
  { immediate: false }
);

// Enhanced chat refresh function with router-like behavior
const performChatRefresh = async (
  newRecipientId: string,
  oldRecipientId?: string
) => {
  try {
    isLoading.value = true;

    // Step 1: Complete state cleanup (similar to router refresh)
    console.log(`🧹 [ChatArea] Cleaning up state for recipient change`);

    // Clear all current state
    messages.value = [];
    filteredMessages.value = [];
    uploadProgress.value = [];
    showSearch.value = false;
    showInfo.value = false;
    showDropdown.value = null;
    editingMessageId.value = null;
    inputMessage.value = "";
    searchQuery.value = "";
    isSearching.value = false;
    isTyping.value = false;
    isUploading.value = false;
    isSending.value = false;
    dragActive.value = false;

    // Clear any pending timers
    if (typingTimeout.value) {
      clearTimeout(typingTimeout.value);
      typingTimeout.value = null;
    }

    // Clean up blob URLs from previous conversation
    cleanupBlobUrls();

    // Step 2: Clear file input state
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }

    // Step 3: Force DOM update and reset scroll position
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = 0;
    }

    // Step 4: Disconnect and reconnect WebSocket events for clean state
    eventBus.off("private-message");

    // Step 5: Small delay to ensure cleanup is complete (router refresh simulation)
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Step 6: Fresh initialization for new recipient
    console.log(
      `🚀 [ChatArea] Initializing fresh state for recipient: ${newRecipientId}`
    );

    // Initialize WebSocket connection if needed
    if (!webSocketStore.isConnected) {
      await connectWebSocket();
    }

    // Load cached messages for new recipient first (for immediate UI feedback)
    const cachedMessages = loadFromSessionStorage();
    if (cachedMessages.length > 0) {
      messages.value = cachedMessages;
      console.log(
        `📦 [ChatArea] Loaded ${cachedMessages.length} cached messages for new recipient`
      );
    }

    // Reconnect WebSocket message handlers for new conversation
    handleWebSocketMessages();

    // Fetch fresh messages from API
    try {
      await fetchPrivateMessages();
      console.log(
        `🔄 [ChatArea] Fetched fresh messages from API for recipient: ${newRecipientId}`
      );
    } catch (error) {
      console.warn(
        `⚠️ [ChatArea] Failed to fetch fresh messages for new recipient, using cached data:`,
        error
      );
      // If we have cached messages, continue with those
      if (cachedMessages.length === 0) {
        // Show user-friendly message for complete failure
        $toast?.warning(
          "Unable to load chat history. Please refresh the page."
        );
      }
    }

    // Validate message ownership for proper bubble positioning
    validateMessageBubbles();

    // Step 7: Auto-scroll to bottom with smooth animation
    await nextTick();
    if (messagesEndRef.value) {
      messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
    }

    // Step 8: Emit refresh event for parent components (similar to router refresh)
    eventBus.emit("chat-refreshed", {
      newRecipientId,
      oldRecipientId,
      timestamp: new Date().toISOString(),
    });

    console.log(
      `✅ [ChatArea] Chat refresh completed successfully for recipient: ${newRecipientId}`
    );
  } catch (error) {
    console.error(
      `❌ [ChatArea] Chat refresh failed for recipient ${newRecipientId}:`,
      error
    );
    $toast?.error("Failed to switch conversation. Please refresh the page.");
  } finally {
    isLoading.value = false;
    isRouterRefreshing.value = false;
  }
};

// Expose refresh function for external use (like manual refresh button)
const refreshChat = async () => {
  console.log(
    `🔄 [ChatArea] Manual chat refresh requested for recipient: ${props.recipientId}`
  );
  await performChatRefresh(props.recipientId);
};

// Expose functions for parent components
defineExpose({
  refreshChat,
  performChatRefresh,
  clearMessages: () => {
    messages.value = [];
    sessionStorage.removeItem(`chat_${props.recipientId}`);
  },
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
  console.log("🧹 [ChatArea] Component unmounting - cleaning up");

  // Remove event listeners
  eventBus.off("private-message");

  // Clear any pending timers
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }

  // Clean up any blob URLs that might be in use
  cleanupBlobUrls();

  console.log("✅ [ChatArea] Cleanup completed");
});

// Production mode - emergency debug functions removed
</script>

<style scoped>
/* Add any component-specific styles here */
.animate-fadeIn {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Add a subtle pulse animation for the attachment button when active */
.pulse-animation {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Style for pending uploads */
.pending-upload {
  opacity: 0.7;
  position: relative;
}

.pending-upload::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Progress bar animation */
.animate-progress {
  width: 100%;
  animation: progress 2s ease-in-out infinite;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.1)
  );
  background-size: 200% 100%;
}

@keyframes progress {
  0% {
    width: 0%;
    opacity: 0.7;
  }
  50% {
    width: 70%;
    opacity: 1;
  }
  100% {
    width: 100%;
    opacity: 0.7;
  }
}
</style>
