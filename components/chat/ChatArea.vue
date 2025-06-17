<template>
  <div class="h-full flex bg-gray-50">
    <!-- Main chat area -->
    <div class="flex-1 flex flex-col h-full">
      <!-- Header with recipient info -->
      <div
        class="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between"
      >
        <div class="flex items-center">
          <div class="relative mr-3">
            <div
              class="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center"
            >
              <img
                v-if="validatedRecipientAvatar"
                :src="validatedRecipientAvatar"
                :alt="recipient.name"
                class="h-full w-full object-cover"
                @error="handleRecipientAvatarError"
              />
              <Icon v-else name="fa:user" class="h-6 w-6 text-gray-500" />
            </div>
            <span
              v-if="recipient.status === 'online'"
              class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"
            ></span>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">
              {{ recipient.first_name }} {{ recipient.last_name }}
            </h2>
            <p class="text-xs text-gray-500">
              {{ recipient.status === "online" ? "Online" : "Offline" }}
              <span v-if="isTyping" class="ml-2 text-blue-500">typing...</span>
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <button
            @click="showSearch = true"
            class="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200 mr-2"
            title="Search in conversation"
          >
            <Icon name="fa:search" class="h-4 w-4" />
          </button>
          <button
            @click="showInfo = !showInfo"
            class="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200"
            :class="{ 'text-blue-500': showInfo }"
            title="View info"
          >
            <Icon name="fa:info-circle" class="h-4 w-4" />
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

        <!-- Loading state -->
        <div
          v-if="isLoading"
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
                @click="isAttachmentMenuOpen = !isAttachmentMenuOpen"
                class="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200 mr-2"
                :class="{ 'bg-blue-100 text-blue-600': isAttachmentMenuOpen }"
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
              <div
                v-if="isAttachmentMenuOpen"
                class="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 animate-fadeIn"
                style="min-width: 150px"
              >
                <button
                  type="button"
                  @click="handleFileUpload"
                  class="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 mb-2 w-full text-left px-4 py-2 rounded transition-all duration-200"
                  :disabled="isSending || isUploading"
                >
                  <Icon name="fa:file" class="mr-2" />
                  <span>File</span>
                  <Icon
                    v-if="isUploading"
                    name="svg-spinners:270-ring"
                    class="ml-auto h-4 w-4 text-blue-500"
                  />
                </button>
                <button
                  type="button"
                  @click="handleImageUpload"
                  class="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left px-4 py-2 rounded transition-all duration-200"
                  :disabled="isSending || isUploading"
                >
                  <Icon name="fa:image" class="mr-2" />
                  <span>Image</span>
                  <Icon
                    v-if="isUploading"
                    name="svg-spinners:270-ring"
                    class="ml-auto h-4 w-4 text-blue-500"
                  />
                </button>
              </div>
            </div>
            <input
              ref="fileInputRef"
              type="file"
              class="hidden"
              multiple
              @change="handleFileChange"
              :disabled="isSending || isUploading"
            />
            <input
              ref="imageInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              multiple
              @change="handleImageChange"
              :disabled="isSending || isUploading"
            />
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

          <!-- WebSocket connection indicator -->
          <div class="mt-1 flex justify-end">
            <span
              v-if="webSocketStore.isConnected"
              class="text-xs text-green-500 flex items-center"
              title="Connected to real-time messaging"
            >
              <span
                class="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"
              ></span>
              Live
            </span>
            <span
              v-else-if="webSocketStore.isConnecting"
              class="text-xs text-yellow-500 flex items-center"
              title="Connecting to real-time messaging"
            >
              <span
                class="inline-block h-2 w-2 rounded-full bg-yellow-500 mr-1 animate-pulse"
              ></span>
              Connecting...
            </span>
            <span
              v-else
              class="text-xs text-red-500 flex items-center cursor-pointer"
              title="Click to reconnect"
              @click="reconnectWebSocket"
            >
              <span
                class="inline-block h-2 w-2 rounded-full bg-red-500 mr-1"
              ></span>
              Offline (Click to reconnect)
            </span>
            <span
              v-if="webSocketStore.connectionError"
              class="text-xs text-red-500 ml-2"
              :title="webSocketStore.connectionError"
            >
              {{ getConnectionErrorMessage() }}
            </span>
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
const imageInputRef = ref<HTMLInputElement | null>(null);

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

// Handle recipient avatar error
const handleRecipientAvatarError = () => {
  console.warn("[ChatArea] Recipient avatar failed to load");
};

// Simplified fetch function - no complex merging logic
async function fetchPrivateMessages(page = 1, limit = 20) {
  console.log(
    `📡 [ChatArea] Fetching messages for chat with ${props.recipientId}`
  );

  try {
    const response = await messagesStore.getMessages({
      target_id: props.recipientId,
      type: "private",
      page,
      limit,
    });

    // The getMessages function returns the messages array directly, not in a data property
    if (response && Array.isArray(response) && response.length > 0) {
      console.log(
        `📩 [ChatArea] Received ${response.length} messages from API`
      );

      // Simple message processing - normalize essential fields
      const processedMessages = response.map((message: any) => {
        const isCurrentUserMsg = isCurrentUserMessage(message);
        console.log(`🔍 [ChatArea] Processing message:`, {
          id: message.id,
          sender_id: message.sender_id,
          recipient_id: message.recipient_id,
          currentUserId: currentUser.value?.id,
          isCurrentUser: isCurrentUserMsg,
          content: message.content?.substring(0, 30),
        });

        return {
          ...message,
          id: message.id || message.message_id,
          isCurrentUser: isCurrentUserMsg,
          timestamp: formatTimestamp(
            message.timestamp || message.sent_at || message.created_at
          ),
          raw_timestamp: message.sent_at || message.created_at,
        };
      });

      // Simple replacement - no complex merging
      if (page === 1) {
        messages.value = processedMessages;
      } else {
        messages.value = [...processedMessages, ...messages.value];
      }

      // Validate and fix message bubble positioning after loading
      const fixedCount = validateMessageBubbles();
      if (fixedCount > 0) {
        console.log(
          `🛠️ [ChatArea] Fixed ${fixedCount} message bubble positions after fetch`
        );
      }

      // Save to storage
      saveToSessionStorage(messages.value);

      console.log(
        `✅ [ChatArea] Messages loaded: ${messages.value.length} total`
      );
    } else {
      console.log(
        `📭 [ChatArea] No messages returned from API - response:`,
        response
      );
      // Set empty array if no messages
      if (page === 1) {
        messages.value = [];
      }
    }

    return response;
  } catch (error: any) {
    console.error(`❌ [ChatArea] Error fetching messages:`, error);
    if ($toast) {
      $toast.error("Failed to load messages");
    }
    throw error;
  }
}

// Handle clicks outside dropdown to close it
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = null;
  }
};

// Simplified WebSocket message handling
const handleWebSocketMessages = () => {
  if (!webSocketStore.isConnected) {
    return;
  }

  // Listen for new private messages via WebSocket
  eventBus.on("private-message", (newMessage: any) => {
    // Check if message is for current conversation
    const isForCurrentChat =
      (newMessage.sender_id === props.recipientId &&
        newMessage.recipient_id === currentUser.value?.id) ||
      (newMessage.sender_id === currentUser.value?.id &&
        newMessage.recipient_id === props.recipientId);

    if (isForCurrentChat) {
      console.log(`📩 [ChatArea] New WebSocket message received`);

      const messageId = newMessage.id || `ws-${Date.now()}`;

      // Check if message already exists
      const existingIndex = messages.value.findIndex(
        (msg) => msg.id === messageId
      );

      if (existingIndex === -1) {
        // Add new message
        const formattedMessage = {
          ...newMessage,
          id: messageId,
          isCurrentUser: isCurrentUserMessage(newMessage),
          timestamp: formatTimestamp(
            newMessage.timestamp ||
              newMessage.sent_at ||
              newMessage.created_at ||
              new Date().toISOString()
          ),
          receivedViaWebSocket: true,
        };

        messages.value.push(formattedMessage);

        // Validate bubble positioning after adding WebSocket message
        const fixedCount = validateMessageBubbles();
        if (fixedCount > 0) {
          console.log(
            `🛠️ [ChatArea] Fixed ${fixedCount} message bubble positions after WebSocket message`
          );
        }

        saveToSessionStorage(messages.value);

        // Scroll to bottom
        nextTick(() => {
          if (messagesEndRef.value) {
            messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
          }
        });

        // Show notification for messages from others
        if (!formattedMessage.isCurrentUser && $toast) {
          $toast.info(`New message from ${recipient.value.name || "contact"}`);
        }
      }
    }
  });

  // Handle temp message replacements
  wsListener.listenToWSEvent("temp-message-replaced", (data) => {
    const tempIndex = messages.value.findIndex((msg) => msg.id === data.tempId);

    if (tempIndex !== -1) {
      messages.value[tempIndex] = {
        ...messages.value[tempIndex],
        id: data.realId,
        pending: false,
        failed: false,
      };

      saveToSessionStorage(messages.value);
      console.log(
        `✅ [ChatArea] Replaced temp message ${data.tempId} with ${data.realId}`
      );
    }
  });
};

// Handle advanced search
const handleAdvancedSearch = (query: string) => {
  searchQuery.value = query;
  if (query.trim()) {
    filteredMessages.value = messages.value.filter((msg) =>
      msg.content.toLowerCase().includes(query.toLowerCase())
    );
  } else {
    filteredMessages.value = [];
  }
};

// Clear search
const clearSearch = () => {
  searchQuery.value = "";
  filteredMessages.value = [];
  showSearch.value = false;
};

// Handle scroll for loading more messages
const handleScroll = (event: Event) => {
  const container = event.target as HTMLElement;
  if (container.scrollTop === 0 && !isLoadingMore.value) {
    // Load more messages when scrolled to top
    loadMoreMessages();
  }
};

// Load more messages (pagination)
const loadMoreMessages = async () => {
  try {
    isLoadingMore.value = true;

    // Implementation for loading older messages would go here
    // For now, we'll skip this as it requires backend pagination support
  } catch (error) {
    // Error handled silently - could add toast notification in the future
  } finally {
    isLoadingMore.value = false;
  }
};

// Toggle dropdown menu
const toggleDropdown = (messageId: string) => {
  showDropdown.value = showDropdown.value === messageId ? null : messageId;
};

// Handle edit message
const handleEditMessage = (messageId: string) => {
  const message = messages.value.find((msg) => msg.id === messageId);
  if (message) {
    editingMessageId.value = messageId;
    inputMessage.value = message.content;
    showDropdown.value = null;

    // Focus on input
    nextTick(() => {
      const inputElement = document.querySelector(
        "input.flex-1"
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    });
  }
};

// Handle unsend message
const handleUnsendMessage = async (messageId: string) => {
  try {
    const response = await messagesStore.deleteMessage(messageId);
    if (response.message) {
      // Update local state
      const messageIndex = messages.value.findIndex(
        (msg) => msg.id === messageId
      );
      if (messageIndex !== -1) {
        messages.value[messageIndex] = {
          ...messages.value[messageIndex],
          isDeleted: true,
          content: "This message was deleted",
        };
      }

      $toast?.success("Message deleted successfully");
      showDropdown.value = null;
      saveToSessionStorage(messages.value);
    }
  } catch (error) {
    $toast?.error("Failed to delete message");
  }
};

// Handle cancel edit
const handleCancelEdit = () => {
  editingMessageId.value = null;
  inputMessage.value = "";
};

// Enhanced file upload handling with fileUploadHelper - React style
const handleFileUpload = () => {
  if (fileInputRef.value) {
    $toast?.info("Select a file to upload", { autoClose: 2000 });
    fileInputRef.value.click();
    isAttachmentMenuOpen.value = false;
  }
};

const handleImageUpload = () => {
  if (imageInputRef.value) {
    $toast?.info("Select an image to upload", { autoClose: 2000 });
    imageInputRef.value.click();
    isAttachmentMenuOpen.value = false;
  }
};

// Enhanced file change handler with validation and progress tracking
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

      try {
        progressItem.status = "uploading";
        progressItem.progress = 0;

        // Enhanced upload with progress tracking
        const result = await uploadFileAndSendMessage(
          file,
          props.recipientId,
          `📎 ${file.name}`,
          false, // isGroup = false for private chat
          // Progress callback
          (progress: number) => {
            progressItem.progress = progress;
          }
        );

        // Create optimistic message for successful upload
        const tempId = `temp-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const nowIsoString = new Date().toISOString();

        const fileMessage: Message = {
          id: result.messageId || tempId,
          sender_id: currentUser.value?.id || "",
          recipient_id: props.recipientId,
          content: `📎 ${result.fileName}`,
          timestamp: formatTimestamp(nowIsoString),
          raw_timestamp: nowIsoString,
          created_at: nowIsoString,
          updated_at: nowIsoString,
          isCurrentUser: true,
          pending: false,
          sent: true,
          attachment: {
            type: getMediaType(result.fileType) === "image" ? "image" : "file",
            url: result.fileUrl,
            name: result.fileName,
            size: formatFileSize(result.fileSize),
          },
        };

        messages.value.push(fileMessage);
        progressItem.status = "success";
        progressItem.progress = 100;
        $toast?.success(`${result.fileName} uploaded successfully`);
      } catch (error) {
        progressItem.status = "error";
        progressItem.error =
          error instanceof Error ? error.message : "Upload failed";
        $toast?.error(`Failed to upload ${file.name}: ${progressItem.error}`);
      }
    }

    // Save to session storage and scroll to bottom
    saveToSessionStorage(messages.value);
    nextTick(() => {
      if (messagesEndRef.value) {
        messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
      }
    });
  } catch (error) {
    console.error("[ChatArea] File upload error:", error);
    $toast?.error("Failed to upload files");
  } finally {
    isUploading.value = false;
    uploadProgress.value = [];
    target.value = ""; // Reset file input
  }
};

// Enhanced image change handler
const handleImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);

  if (!files.length) return;

  // Filter for images only
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));
  if (!imageFiles.length) {
    $toast?.error("Please select valid image files");
    return;
  }

  try {
    // Use the same enhanced upload logic as files
    isUploading.value = true;
    uploadProgress.value = imageFiles.map((file, index) => ({
      id: `image-${index}-${Date.now()}`,
      file,
      progress: 0,
      status: "pending" as const,
      error: null,
    }));

    // Process images sequentially
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const progressItem = uploadProgress.value[i];

      try {
        progressItem.status = "uploading";
        progressItem.progress = 0;

        const result = await uploadFileAndSendMessage(
          file,
          props.recipientId,
          `🖼️ ${file.name}`,
          false, // isGroup = false for private chat
          // Progress callback
          (progress: number) => {
            progressItem.progress = progress;
          }
        );

        const tempId = `temp-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const nowIsoString = new Date().toISOString();

        const imageMessage: Message = {
          id: result.messageId || tempId,
          sender_id: currentUser.value?.id || "",
          recipient_id: props.recipientId,
          content: `🖼️ ${result.fileName}`,
          timestamp: formatTimestamp(nowIsoString),
          raw_timestamp: nowIsoString,
          created_at: nowIsoString,
          updated_at: nowIsoString,
          isCurrentUser: true,
          pending: false,
          sent: true,
          attachment: {
            type: "image",
            url: result.fileUrl,
            name: result.fileName,
            size: formatFileSize(result.fileSize),
          },
        };

        messages.value.push(imageMessage);
        progressItem.status = "success";
        progressItem.progress = 100;
        $toast?.success(`${result.fileName} uploaded successfully`);
      } catch (error) {
        progressItem.status = "error";
        progressItem.error =
          error instanceof Error ? error.message : "Upload failed";
        $toast?.error(`Failed to upload ${file.name}: ${progressItem.error}`);
      }
    }

    saveToSessionStorage(messages.value);
    nextTick(() => {
      if (messagesEndRef.value) {
        messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
      }
    });
  } catch (error) {
    console.error("[ChatArea] Image upload error:", error);
    $toast?.error("Failed to upload images");
  } finally {
    isUploading.value = false;
    uploadProgress.value = [];
    target.value = "";
  }
};

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

// Track active messages - simplified state management
const messages = ref<Message[]>([]);

// Improved helper to determine if message is from current user
const isCurrentUserMessage = (message: any): boolean => {
  if (!currentUser.value?.id) return false;

  const currentUserId = String(currentUser.value.id);

  // Temp messages are always from current user
  if (message.id?.startsWith("temp-")) return true;

  // Check multiple possible sender ID fields
  const senderId = String(
    message.sender_id ||
      message.sender?.id ||
      message.from_id ||
      message.user_id ||
      message.author_id ||
      ""
  );

  // Primary check: If sender is current user, then message IS from current user
  if (senderId === currentUserId) return true;

  // Secondary check: If sender is NOT current user, then message is NOT from current user
  if (senderId && senderId !== currentUserId) return false;

  console.log(`🔍 [ChatArea] Message bubble positioning:`, {
    messageId: message.id,
    currentUserId,
    senderId,
    recipientId: props.recipientId,
    isCurrentUser: senderId === currentUserId,
  });

  return false; // Default to false if we can't determine
};

// Simple validation to ensure correct message bubble positioning
const validateMessageBubbles = (): number => {
  let fixedCount = 0;
  messages.value.forEach((msg, index) => {
    const correctIsCurrentUser = isCurrentUserMessage(msg);
    if (msg.isCurrentUser !== correctIsCurrentUser) {
      messages.value[index].isCurrentUser = correctIsCurrentUser;
      fixedCount++;
    }
  });
  return fixedCount;
};

/**
 * Sort messages by timestamp to ensure proper chronological order
 * Uses raw_timestamp when available for more precise sorting
 */
const sortMessagesByTimestamp = (msgs: Message[]) => {
  return [...msgs].sort((a, b) => {
    // Use raw_timestamp for sorting if available
    if (a.raw_timestamp && b.raw_timestamp) {
      return (
        new Date(a.raw_timestamp).getTime() -
        new Date(b.raw_timestamp).getTime()
      );
    }

    // Fall back to regular timestamp parsing
    const aTime = new Date(a.timestamp).getTime();
    const bTime = new Date(b.timestamp).getTime();

    // If timestamps are equal (unlikely but possible), sort by ID
    if (aTime === bTime) {
      return a.id.localeCompare(b.id);
    }

    return aTime - bTime;
  });
};

// Simplified displayed messages - no complex filtering that could hide messages
const displayMessages = computed(() => {
  if (!messages.value || !Array.isArray(messages.value)) {
    console.log(
      `🔍 [ChatArea] displayMessages: messages.value is not an array:`,
      messages.value
    );
    return [];
  }

  let messagesToDisplay = messages.value;

  // Apply search filtering if active
  if (isSearching.value && filteredMessages.value.length > 0) {
    messagesToDisplay = filteredMessages.value;
  }

  // Simple sort by timestamp - oldest first
  const sorted = messagesToDisplay.sort((a, b) => {
    const timeA = new Date(
      a.created_at || a.sent_at || a.timestamp || 0
    ).getTime();
    const timeB = new Date(
      b.created_at || b.sent_at || b.timestamp || 0
    ).getTime();
    return timeA - timeB;
  });

  console.log(
    `🔍 [ChatArea] displayMessages computed: ${sorted.length} messages`,
    {
      rawMessages: messages.value.length,
      isSearching: isSearching.value,
      firstMessage: sorted[0]
        ? {
            id: sorted[0].id,
            content: sorted[0].content?.substring(0, 50),
            isCurrentUser: sorted[0].isCurrentUser,
            sender_id: sorted[0].sender_id,
          }
        : null,
    }
  );

  return sorted;
});

// Simplified WebSocket connection handling
const connectWebSocket = async () => {
  if (webSocketStore.isConnected || webSocketStore.isConnecting) return;

  try {
    // First make sure we have valid auth
    const valid = await webSocketStore.validateToken();
    if (valid) {
      await webSocketStore.connect();
    } else {
      if ($toast) {
        $toast.warning("Connection issue - authenticating...");
      }
    }
  } catch (error) {
    if ($toast) {
      $toast.error("Failed to connect to messaging service");
    }
  }
};

// Add new function to reconnect with visual feedback
const reconnectWebSocket = async () => {
  try {
    if ($toast) {
      $toast.info("Attempting to reconnect...");
    }

    // First verify authentication
    if (!authStore.isAuthenticated) {
      try {
        await authStore.getUserInfo();
      } catch (error) {
        console.error("Failed to refresh authentication:", error);
        if ($toast) {
          $toast.error("Authentication failed. Redirecting to login...");
        }
        // Use the auth error handler to redirect to login
        if (authStore.handleAuthError) {
          authStore.handleAuthError();
        }
        return;
      }
    }

    // Disconnect first to clear any existing connection
    webSocketStore.disconnect();
    webSocketStore.clear();

    // Then try to reconnect
    await connectWebSocket();
  } catch (error) {
    console.error("Error reconnecting:", error);
    if ($toast) {
      $toast.error("Reconnection failed. Please refresh the page.");
    }
  }
};

// Add helper function to format connection errors
const getConnectionErrorMessage = () => {
  if (!webSocketStore.connectionError) return "";

  const error = webSocketStore.connectionError.toLowerCase();
  if (error.includes("authentication") || error.includes("token")) {
    return "Auth error";
  } else if (error.includes("timeout")) {
    return "Connection timeout";
  } else {
    return "Connection error";
  }
};

// Manual refresh function to force reload messages from API
const manualRefresh = async () => {
  try {
    $toast?.info("Refreshing messages...");

    // Clear existing messages to ensure we get a fresh load
    messages.value = [];

    // Force reload from API
    await fetchPrivateMessages();

    // Show toast with message count
    if (messages.value.length > 0) {
      $toast?.success(`Loaded ${messages.value.length} messages`);
    } else {
      $toast?.warning("No messages found");
    }

    // Scroll to bottom after refresh
    nextTick(() => {
      if (messagesEndRef.value) {
        messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
      }
    });
  } catch (error) {
    $toast?.error("Failed to refresh messages");
  }
};

// Add watch for WebSocket errors
watch(
  () => webSocketStore.connectionError,
  (error) => {
    // Silent error handling - errors are displayed in the UI already
  }
);

// Added ref to track if component is already initialized
const isComponentInitialized = ref(false);

// Initialize with WebSocket connection first, then load messages
// Set production mode - diagnostics are now fully disabled

onMounted(async () => {
  console.log(
    `🚀 [ChatArea] Component mounted for recipientId: ${props.recipientId}`
  );

  // Simple message loading priority: props -> session storage -> API
  if (props.chatMessages && props.chatMessages.length > 0) {
    console.log(
      `📨 [ChatArea] Using prop messages (${props.chatMessages.length})`
    );
    messages.value = props.chatMessages;
  } else {
    const storedMessages = loadFromSessionStorage();
    if (storedMessages.length > 0) {
      console.log(
        `💾 [ChatArea] Using stored messages (${storedMessages.length})`
      );
      messages.value = storedMessages;
    } else {
      console.log(`📡 [ChatArea] Fetching messages from API`);
      isLoading.value = true;
      try {
        await fetchPrivateMessages();
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        isLoading.value = false;
      }
    }
  }

  // Fix message bubble positioning
  validateMessageBubbles();

  // Initial scroll to bottom
  nextTick(() => {
    if (messagesEndRef.value) {
      messagesEndRef.value.scrollIntoView();
    }
  });

  // Set up event listeners
  document.addEventListener("mousedown", handleClickOutside);

  // Connect WebSocket for real-time updates
  await connectWebSocket();
  handleWebSocketMessages();

  console.log(
    `✅ [ChatArea] Initialization complete with ${messages.value.length} messages`
  );
});

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

// Cleanup when component is unmounted
onUnmounted(() => {
  console.log("🧹 [ChatArea] Component unmounting - cleaning up");

  // Remove event listeners
  eventBus.off("private-message");

  // Clear any pending timers
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }

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
