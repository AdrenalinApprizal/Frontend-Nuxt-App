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
                v-if="recipient.avatar"
                :src="recipient.avatar"
                :alt="recipient.name"
                class="h-full w-full object-cover"
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

      <!-- Search component (using the new dedicated component) -->
      <SearchOnFriend
        :isOpen="showSearch"
        @close="showSearch = false"
        @search="handleAdvancedSearch"
      />

      <!-- Messages container with message counter -->
      <div
        class="flex-1 overflow-auto p-6 space-y-4 relative"
        ref="messagesContainer"
        @scroll="handleScroll"
      >
        <!-- Enhanced message counter with diagnostic toggle -->
        <div
          class="fixed top-20 right-4 bg-white py-1 px-3 rounded-full shadow-md border border-gray-200 flex items-center space-x-2 text-xs z-10"
        >
          <span class="font-bold text-blue-600">{{
            displayMessages.length
          }}</span>
          <span class="text-gray-500">messages</span>
          <button
            @click="manualRefresh"
            class="ml-2 p-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
            title="Refresh messages"
          >
            <Icon name="lucide:refresh-cw" class="h-3 w-3 text-blue-600" />
          </button>
        </div>
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

        <!-- No messages placeholder -->
        <div
          v-if="displayMessages.length === 0"
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
            <div class="flex flex-col max-w-[70%]">
              <div
                :class="`rounded-lg px-4 py-2 ${
                  message.isCurrentUser
                    ? message.isDeleted
                      ? 'bg-gray-200 text-gray-500 italic'
                      : message.failed
                      ? 'bg-red-100 border border-red-300 text-gray-800'
                      : 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                } min-w-[80px] ${message.failed ? 'cursor-pointer' : ''}`"
                @click="message.failed && retryFailedMessage(message)"
              >
                <!-- Debug badge - DISABLED FOR PRODUCTION -->
                <!-- 
                <div class="text-xs opacity-50 mb-1">
                  {{ message.isCurrentUser ? '➡️ ME' : '⬅️ THEM' }}
                </div>
                -->
                <p class="break-words whitespace-pre-wrap">
                  <!-- Direct content display with fallbacks -->
                  {{ message.content || "(No message content)" }}
                </p>
                <!-- Message metadata for visibility -->
                <p class="text-xs text-gray-400 mt-1">
                  {{
                    new Date(
                      message.sent_at || message.timestamp || Date.now()
                    ).toLocaleString()
                  }}
                </p>
                <p v-if="message.failed" class="text-xs text-red-500 mt-1">
                  <Icon
                    name="lucide:alert-triangle"
                    class="h-3 w-3 inline mr-1"
                  />
                  {{
                    message.errorMessage || "Failed to send - click to retry"
                  }}
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
                    {{ message.timestamp }}
                  </span>
                  <span v-if="message.isCurrentUser">
                    <Icon
                      v-if="message.read"
                      name="fa:check-double"
                      class="h-3 w-3 text-white"
                      title="Read"
                    />
                    <Icon
                      v-else
                      name="fa:check"
                      class="h-3 w-3 text-white"
                      title="Sent"
                    />
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
              :class="{ 'bg-blue-100 text-blue-600': isAttachmentMenuOpen }"
              title="Attach file"
            >
              <Icon name="lucide:paperclip" class="h-5 w-5" />
            </button>
            <div
              v-if="isAttachmentMenuOpen"
              class="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 animate-fadeIn"
              style="min-width: 150px"
            >
              <button
                @click="handleFileUpload"
                class="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 mb-2 w-full text-left px-4 py-2 rounded transition-all duration-200"
                :disabled="isSending"
              >
                <Icon name="fa:file" class="mr-2" />
                <span>File</span>
                <Icon
                  v-if="isSending"
                  name="svg-spinners:270-ring"
                  class="ml-auto h-4 w-4 text-blue-500"
                />
              </button>
              <button
                @click="handleImageUpload"
                class="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left px-4 py-2 rounded transition-all duration-200"
                :disabled="isSending"
              >
                <Icon name="fa:image" class="mr-2" />
                <span>Image</span>
                <Icon
                  v-if="isSending"
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
            @change="handleFileChange"
            :disabled="isSending"
          />
          <input
            ref="imageInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageChange"
            :disabled="isSending"
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
              editingMessageId ? 'Edit your message...' : 'Type your message...'
            "
            class="flex-1 py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-400 text-gray-700"
            @keydown.enter.prevent="
              () => !isSending && handleSendMessage(inputMessage)
            "
            @input="handleTyping"
            :disabled="isSending"
          />
          <button
            @click="handleSendMessage(inputMessage)"
            class="bg-blue-500 text-white p-3 rounded-full ml-2 hover:bg-blue-600 focus:outline-none"
            :disabled="(!inputMessage.trim() && !editingMessageId) || isSending"
          >
            <div
              v-if="isSending"
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
      </div>

      <!-- Profile sidebar component (conditionally rendered) -->
      <RecipientProfile
        v-if="showProfile"
        :recipient="recipient"
        @close="showProfile = false"
      />
    </div>

    <!-- Friend Info Panel (conditionally rendered as a side panel) -->
    <FriendInfoPanel
      v-if="showInfo"
      :username="recipient.name"
      :friendDetails="adaptRecipientToFriendDetails(recipient)"
      @close="showInfo = false"
    />

    <!-- Diagnostic Panel removed for production -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from "vue";
import SearchOnFriend from "./SearchOnFriend.vue";
import FriendInfoPanel from "./FriendInfoPanel.vue";
import RecipientProfile from "./RecipientProfile.vue";
import { useMessagesStore } from "~/composables/useMessages";
import { useAuthStore } from "~/composables/useAuth";
import { useWebSocket, WebSocketMessageType } from "~/composables/useWebSocket";
import { usePresence } from "~/composables/usePresence"; // Add presence service
import { useNuxtApp } from "#app";
import { useFiles } from "~/composables/useFiles";
import { useFriendsStore } from "~/composables/useFriends"; // Import the friends store

// Initialize stores and Nuxt app
const messagesStore = useMessagesStore();
const authStore = useAuthStore();
const webSocketStore = useWebSocket();
const friendsStore = useFriendsStore(); // Add friends store
const presence = usePresence();
const { $toast } = useNuxtApp();

// Get current user
const currentUser = computed(() => authStore.user);

// Handle file upload button click
const handleFileUpload = () => {
  if (fileInputRef.value) {
    // Show feedback that the file picker is opening
    $toast.info("Select a file to upload", { autoClose: 2000 });
    fileInputRef.value.click();
    isAttachmentMenuOpen.value = false;
  }
};

// Handle image upload button click
const handleImageUpload = () => {
  if (imageInputRef.value) {
    // Show feedback that the image picker is opening
    $toast.info("Select an image to upload", { autoClose: 2000 });
    imageInputRef.value.click();
    isAttachmentMenuOpen.value = false;
  }
};

interface Attachment {
  type: "image" | "file";
  url: string;
  name: string;
  size?: string;
}

interface Message {
  id: string;
  message_id?: string; // Explicit tracking ID
  sender_id?: string; // Track sender ID for better message management
  recipient_id?: string; // Track recipient for chat room identification
  chat_room_id?: string; // Link message to specific chat room
  conversation_id?: string; // Alternative identifier for chat room
  room_id?: string; // Another alternative identifier for chat room
  content: string;
  timestamp: string;
  raw_timestamp?: string; // Store raw timestamp for accurate sorting
  sent_at?: string; // Original sent timestamp
  created_at?: string; // Original creation timestamp
  updated_at?: string; // Last update timestamp
  type?: string; // Message type
  isCurrentUser: boolean;
  read?: boolean;
  is_read?: boolean; // Alternative property for read status
  isEdited?: boolean;
  isDeleted?: boolean;
  is_deleted?: boolean; // Alternative property for deletion status
  attachment?: Attachment;
  pending?: boolean; // Indicates message is being sent
  sent?: boolean; // Indicates message was sent successfully
  failed?: boolean; // Indicates message failed to send
  errorMessage?: string; // Error message for failed messages
  message_type?: string; // Track message type (text, image, etc.)
  // Additional fields for alternative API formats
  sender?: any; // Sender information object
  recipient?: any; // Recipient information object
  from_id?: string; // Alternative sender ID
  user_id?: string; // Alternative user ID
  author_id?: string; // Alternative author ID
  receiver_id?: string; // Alternative recipient ID
  to_id?: string; // Alternative recipient ID
  target_id?: string; // Alternative recipient ID
  participants?: string[]; // Participants in a conversation
  text?: string; // Alternative content field
  date?: string; // Alternative date field
  media_url?: string; // Media URL for attachments
  attachment_url?: string; // Alternative media URL
  file_url?: string; // Alternative file URL
  image_url?: string; // Alternative image URL
  url?: string; // Generic URL field
  file_name?: string; // File name for attachments
  attachment_name?: string; // Alternative file name
  file_size?: string; // File size information
  size?: string; // Alternative size information
  content_type?: string; // Content type information
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "online" | "offline";
  phone?: string;
  joinDate?: string;
  location?: string;
}

const props = defineProps<{
  recipientId: string;
  recipientName: string;
  chatMessages?: Message[];
}>();

// Main state
const inputMessage = ref("");
const editingMessageId = ref<string | null>(null);
const showDropdown = ref<string | null>(null);
const showProfile = ref(false);
const showSearch = ref(false);
const showInfo = ref(false);
// Diagnostic panel has been removed for production
const isAttachmentMenuOpen = ref(false);
const searchQuery = ref("");
const isSearching = ref(false);
const filteredMessages = ref<Message[]>([]);
const isTyping = ref(false);
const isLoadingMore = ref(false);
const typingTimeout = ref<NodeJS.Timeout | null>(null);
const isSending = ref(false); // <-- Add isSending state
const isLoading = ref(false); // <-- Add isLoading state for API calls

// Refs for DOM manipulation
const dropdownRef = ref<HTMLElement | null>(null);
const messagesEndRef = ref<HTMLElement | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const imageInputRef = ref<HTMLInputElement | null>(null);

// Add missing reactive state references
const wsWatcher = ref<(() => void) | null>(null);
const messageBackup = ref<Message[]>([]);

// Load messages from API
const loadMessages = async (): Promise<Message[]> => {
  try {
    isLoading.value = true;

    if (!props.recipientId) {
      return [] as Message[];
    }

    const requestParams = {
      target_id: props.recipientId,
      type: "private" as "private",
      page: 1,
      limit: 50,
    };

    const response = await messagesStore.getMessages(requestParams);

    if (response.data && response.data.length > 0) {
      const convertedMessages = response.data.map((msg: any) => {
        // Extract message ID
        const messageId =
          msg.message_id ||
          msg.id ||
          `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        // Extract message type
        const messageType =
          msg.message_type || msg.type || msg.content_type || "text";

        // Extract sender ID
        let senderId =
          msg.sender_id ||
          msg.sender?.id ||
          msg.from_id ||
          msg.user_id ||
          msg.author_id;

        if (!senderId) {
          senderId = currentUser.value?.id || "unknown";
        }

        // Extract recipient ID
        let recipientId =
          msg.recipient_id ||
          msg.receiver_id ||
          msg.recipient?.id ||
          msg.to_id ||
          msg.target_id;

        if (!recipientId) {
          if (String(senderId) === String(currentUser.value?.id)) {
            recipientId = props.recipientId;
          } else if (String(senderId) === String(props.recipientId)) {
            recipientId = currentUser.value?.id;
          } else {
            recipientId = props.recipientId;
          }
        }

        // Determine if message is from current user
        const enhancedMessage = {
          ...msg,
          sender_id: senderId,
          recipient_id: recipientId,
        };
        const isCurrentUser = isCurrentUserMessage(enhancedMessage);

        // Handle attachments
        let attachment: Attachment | undefined = undefined;
        const mediaUrl =
          msg.media_url ||
          msg.attachment_url ||
          msg.file_url ||
          msg.image_url ||
          msg.url;

        if (mediaUrl) {
          const isImage =
            messageType === "image" ||
            msg.content_type === "image" ||
            (mediaUrl &&
              /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff|avif|webp|heif)$/i.test(
                mediaUrl
              ));

          attachment = {
            type: isImage ? "image" : "file",
            url: mediaUrl,
            name:
              msg.file_name ||
              msg.attachment_name ||
              (isImage ? "Image" : "File attachment"),
            size: msg.file_size || msg.size || undefined,
          };
        }

        // Handle timestamps
        const timestampSource =
          msg.sent_at ||
          msg.created_at ||
          msg.timestamp ||
          msg.date ||
          new Date().toISOString();
        const raw_timestamp = timestampSource;
        const formattedTimestamp = new Date(timestampSource).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );

        return {
          id: messageId,
          message_id: messageId,
          content: msg.content || msg.text || msg.message || "",
          type: messageType,
          message_type: messageType,
          sender_id: senderId,
          recipient_id: recipientId,
          sent_at: msg.sent_at || msg.timestamp,
          created_at: msg.created_at,
          updated_at: msg.updated_at,
          raw_timestamp,
          timestamp: formattedTimestamp,
          isCurrentUser,
          read: msg.read || msg.is_read || false,
          isEdited:
            msg.updated_at &&
            msg.created_at &&
            new Date(msg.updated_at).getTime() >
              new Date(msg.created_at).getTime(),
          isDeleted: msg.type === "deleted" || msg.is_deleted || false,
          attachment,
          sent: true,
          sender: msg.sender,
          recipient: msg.recipient,
        } as Message;
      });

      if (convertedMessages.length > 0) {
        messages.value = convertedMessages;
        hasLoadedFromAPI.value = true;
        saveToSessionStorage(messages.value);
      }
    } else {
      // No messages found - return empty array instead of mock data
      messages.value = [];
      return [];
    }

    return messages.value;
  } catch (error) {
    $toast?.error("Failed to load messages");
    messages.value = [];
    return [];
  } finally {
    isLoading.value = false;
  }
};

// Start periodic refresh
const startPeriodicRefresh = () => {
  // Clear existing interval
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }

  // Set up new interval to refresh messages every 30 seconds
  refreshInterval.value = setInterval(async () => {
    if (!isInitializing.value && !isSending.value) {
      await loadMessages();
    }
  }, 30000);
};

// Handle clicks outside dropdown to close it
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = null;
  }
};

// WebSocket message handler
const handleWebSocketMessages = () => {
  if (!webSocketStore.isConnected) {
    return;
  }

  // Add event listener for direct messages with enhanced parsing
  eventBus.on("direct-message", (newMessage: any) => {
    // Extract all possible sender and recipient IDs with thorough checks
    const possibleSenderIds = [
      newMessage.sender_id,
      newMessage.sender?.id,
      newMessage.from_id,
      newMessage.user_id,
      newMessage.author_id,
    ].filter(Boolean);

    const possibleRecipientIds = [
      newMessage.recipient_id,
      newMessage.receiver_id,
      newMessage.recipient?.id,
      newMessage.to_id,
      newMessage.target_id,
    ].filter(Boolean);

    // Check if this message belongs to our current conversation
    const isForCurrentChat =
      possibleSenderIds.includes(props.recipientId) ||
      possibleRecipientIds.includes(props.recipientId);

    if (isForCurrentChat) {
      // Use the same message conversion logic as in loadMessages for consistency
      // Extract critical fields with fallbacks
      const messageId =
        newMessage.message_id ||
        newMessage.id ||
        `ws-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const messageType =
        newMessage.message_type ||
        newMessage.type ||
        newMessage.content_type ||
        "text";
      const messageContent =
        newMessage.content || newMessage.text || newMessage.message || "";

      // Use the most likely sender_id
      const senderId = possibleSenderIds[0] || "unknown";

      // For recipient_id: If not present, use current user as recipient for messages not sent by them
      const recipientId =
        possibleRecipientIds[0] ||
        (senderId === currentUser.value?.id
          ? props.recipientId
          : currentUser.value?.id);

      // Mark the message as from current user or not
      const isCurrentUser = isCurrentUserMessage({
        ...newMessage,
        sender_id: senderId,
      });

      // Handle attachments with improved format detection
      let attachment: Attachment | undefined = undefined;
      const mediaUrl =
        newMessage.media_url ||
        newMessage.attachment_url ||
        newMessage.file_url ||
        newMessage.image_url ||
        newMessage.url;

      if (mediaUrl) {
        const isImage =
          messageType === "image" ||
          (mediaUrl &&
            /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff|avif|webp|heif)$/i.test(
              mediaUrl
            ));

        attachment = {
          type: isImage ? "image" : "file",
          url: mediaUrl,
          name:
            newMessage.file_name ||
            newMessage.attachment_name ||
            (isImage ? "Image" : "File attachment"),
          size: newMessage.file_size || newMessage.size || undefined,
        };
      }

      // Create a complete formatted message with all necessary fields
      const formattedMessage: Message = {
        id: messageId,
        message_id: messageId,
        content: messageContent,
        type: messageType,
        message_type: messageType,
        sender_id: senderId,
        recipient_id: recipientId,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sent_at:
          newMessage.sent_at ||
          newMessage.timestamp ||
          new Date().toISOString(),
        created_at: newMessage.created_at || new Date().toISOString(),
        isCurrentUser,
        read: newMessage.read || newMessage.is_read || false,
        isDeleted:
          newMessage.type === "deleted" || newMessage.is_deleted || false,
        attachment,
        sent: true,
        // Keep original sender/recipient objects if present
        sender: newMessage.sender,
        recipient: newMessage.recipient,
      };

      // Add message if it doesn't already exist
      if (!messages.value.find((msg) => msg.id === formattedMessage.id)) {
        messages.value.push(formattedMessage);
        saveToSessionStorage(messages.value);

        // Scroll to bottom
        nextTick(() => {
          if (messagesEndRef.value) {
            messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
          }
        });

        // Show toast notification for new message (only if not from current user)
        if (!formattedMessage.isCurrentUser && $toast) {
          $toast.info(
            `New message from ${
              recipient.value.first_name || recipient.value.name || "contact"
            }`
          );
        }
      }
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

// Retry failed message
const retryFailedMessage = async (message: Message) => {
  if (!message.failed) return;

  // Mark as retrying
  const messageIndex = messages.value.findIndex((msg) => msg.id === message.id);
  if (messageIndex !== -1) {
    messages.value[messageIndex] = {
      ...messages.value[messageIndex],
      failed: false,
      pending: true,
      errorMessage: undefined,
    };
  }

  try {
    // Attempt to resend the message
    await handleSendMessage(message.content);

    // Remove the failed message on successful retry
    messages.value = messages.value.filter((msg) => msg.id !== message.id);
  } catch (error) {
    // Mark as failed again
    if (messageIndex !== -1) {
      messages.value[messageIndex] = {
        ...messages.value[messageIndex],
        failed: true,
        pending: false,
        errorMessage: "Failed to send message",
      };
    }
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

// Handle file change
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  let response: any; // Declare response outside try-catch block

  try {
    isSending.value = true;
    $toast?.info("Uploading file...", { autoClose: 2000 });

    // Upload file and send message
    response = await messagesStore.sendMessageWithMedia(
      props.recipientId,
      `📎 ${file.name}`,
      "file",
      file
    );

    if (response?.data) {
      await loadMessages(); // Refresh messages
      $toast?.success("File sent successfully");
    }
  } catch (error) {
    $toast?.error("Failed to upload file");
  } finally {
    isSending.value = false;
    target.value = ""; // Reset file input
  }
};

// Handle image change
const handleImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  let response: any; // Declare response outside try-catch block

  try {
    isSending.value = true;
    $toast?.info("Uploading image...", { autoClose: 2000 });

    // Upload image and send message
    response = await messagesStore.sendMessageWithMedia(
      props.recipientId,
      `🖼️ ${file.name}`,
      "image",
      file
    );

    if (response?.data) {
      await loadMessages(); // Refresh messages
      $toast?.success("Image sent successfully");
    }
  } catch (error) {
    $toast?.error("Failed to upload image");
  } finally {
    isSending.value = false;
    target.value = ""; // Reset file input
  }
};

// Handle send message
const handleSendMessage = async (messageContent?: string) => {
  const content = messageContent || inputMessage.value.trim();

  if (!content) return;

  try {
    isSending.value = true;

    // Create temporary message for optimistic UI
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      type: "text",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isCurrentUser: true,
      pending: true,
      sent: false,
    };

    // Add temporary message
    messages.value.push(tempMessage);
    inputMessage.value = "";

    // Scroll to bottom
    nextTick(() => {
      if (messagesEndRef.value) {
        messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
      }
    });

    // Send message via API
    if (editingMessageId.value) {
      // Edit existing message
      await messagesStore.editMessage(editingMessageId.value, content);
      editingMessageId.value = null;
    } else {
      // Send new message
      await messagesStore.sendMessage(props.recipientId, content);
    }

    // Remove temporary message and reload
    messages.value = messages.value.filter((msg) => msg.id !== tempMessage.id);
    await loadMessages();
  } catch (error) {
    $toast?.error("Failed to send message");

    // Mark message as failed
    const messageIndex = messages.value.findIndex(
      (msg) => msg.content === content && msg.pending
    );
    if (messageIndex !== -1) {
      messages.value[messageIndex] = {
        ...messages.value[messageIndex],
        pending: false,
        failed: true,
        errorMessage: "Failed to send",
      };
    }
  } finally {
    isSending.value = false;
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
  // FriendInfoPanel may have different status expectations than RecipientProfile
  // Just ensure it's a valid string value with a fallback
  const normalizedStatus = recipient.status || "offline";

  return {
    ...recipient,
    status: normalizedStatus,
    phone: recipient.phone || "Not provided",
    joinDate: recipient.joinDate || "Unknown",
    location: recipient.location || "Not specified",
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

// Track active messages
const messages = ref<Message[]>([]);

// Helper function untuk memastikan konsistensi comparison
// IMPORTANT: This function determines if a message should appear on the RIGHT side (as "ME")
// It should return TRUE only if the message was sent BY the currently logged-in user
const isCurrentUserMessage = (message: any): boolean => {
  // Ensure we have valid user data
  if (!currentUser.value?.id) {
    return false;
  }

  // Convert both IDs to strings for safe comparison and handle edge cases
  const currentUserId = String(currentUser.value.id).trim();

  // Check multiple possible sender ID fields
  let senderId = "";

  // Try different possible sender ID locations
  if (message.sender_id) {
    senderId = String(message.sender_id).trim();
  } else if (message.sender?.id) {
    senderId = String(message.sender.id).trim();
  } else if (message.from_id) {
    senderId = String(message.from_id).trim();
  } else if (message.user_id) {
    senderId = String(message.user_id).trim();
  }

  // If we still don't have a sender ID, try to determine it from other fields
  if (!senderId && message.id && message.id.startsWith("temp-")) {
    // Temporary messages are always from the current user
    return true;
  }

  return senderId === currentUserId;
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

const displayMessages = computed(() => {
  // If there are no messages, return empty array
  if (!messages.value || messages.value.length === 0) {
    return [];
  }

  // First filter messages for the current chat room
  let messagesToDisplay = messages.value.filter((msg) => {
    // ENHANCED LOGIC: Even more flexible filtering to include all messages from the conversation
    const currentUserId = currentUser.value?.id;
    const recipientId = props.recipientId;

    // Safety check - if we don't have crucial data, skip message
    if (!currentUserId || !recipientId) {
      return false;
    }

    // Convert IDs to strings for safer comparison
    const currentUserIdStr = String(currentUserId);
    const recipientIdStr = String(recipientId);

    // 1. Accept any message where either current user or recipient is involved as sender/receiver
    const isSenderCurrentUserOrRecipient =
      String(msg.sender_id) === currentUserIdStr ||
      String(msg.sender_id) === recipientIdStr;

    // 2. Accept temporary messages (they are always part of current conversation)
    const isTempMessage = msg.id && String(msg.id).startsWith("temp-");

    // 3. Special cases - Always accept these message types if present
    const isSpecialMessage =
      msg.type === "system" || msg.type === "notification";

    // ULTRA PERMISSIVE: Accept almost any message in the current context
    // We'll filter out duplicates later if needed
    // The goal now is to make sure messages show up!
    const isPartOfConversation =
      isSenderCurrentUserOrRecipient ||
      isTempMessage ||
      isSpecialMessage ||
      !msg.recipient_id; // Accept messages without recipient_id too

    return isPartOfConversation;
  });

  // Log how many messages remain after room filtering
  console.log(
    `[ChatArea] After room filtering: ${messagesToDisplay.length} messages to display`
  );

  // CRITICAL FIX: Ensure all messages have correct isCurrentUser flag
  messagesToDisplay = messagesToDisplay.map((msg) => {
    // Recalculate isCurrentUser to ensure consistency
    const correctIsCurrentUser = isCurrentUserMessage(msg);

    // If the stored value doesn't match the calculated value, fix it
    if (msg.isCurrentUser !== correctIsCurrentUser) {
      console.warn(
        `🔧 [ChatArea] Fixing isCurrentUser for message ${msg.id}: ${msg.isCurrentUser} → ${correctIsCurrentUser}`
      );
      return {
        ...msg,
        isCurrentUser: correctIsCurrentUser,
      };
    }

    return msg;
  });

  // Filter out invalid messages that might cause display issues
  messagesToDisplay = messagesToDisplay.filter((msg) => {
    // Always include deleted messages that are properly marked
    if (msg.isDeleted) return true;

    // For non-deleted messages, verify they have required content
    const hasValidContent =
      msg.content !== undefined && msg.content !== null && msg.content !== "";
    return hasValidContent;
  });

  // Override with search results when searching
  if (isSearching.value && filteredMessages.value.length > 0) {
    messagesToDisplay = filteredMessages.value;
  }

  // Sort messages by timestamp to ensure chronological order
  const sortedMessages = sortMessagesByTimestamp(messagesToDisplay);

  // Final validation to ensure all messages have correct bubble positioning
  const validatedMessages = sortedMessages.map((msg) => {
    const shouldBeCurrentUser = isCurrentUserMessage(msg);
    if (msg.isCurrentUser !== shouldBeCurrentUser) {
      return {
        ...msg,
        isCurrentUser: shouldBeCurrentUser,
      };
    }
    return msg;
  });

  return validatedMessages;
});

// Initialize WebSocket connection
const connectWebSocket = async () => {
  if (!webSocketStore.isConnected && !webSocketStore.isConnecting) {
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
    hasLoadedFromAPI.value = false;
    await loadMessages();

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
  try {
    // Make sure we have friends data
    if (!friendsStore.friends.length) {
      await friendsStore.getFriends();
    }

    // CRITICAL SEQUENCE: Connect to WebSocket before loading messages
    // Flag to track if WebSocket is properly connected
    let wsConnected = false;

    // Step 1: Check authentication and connect WebSocket FIRST
    if (authStore.isAuthenticated) {
      await connectWebSocket();
      wsConnected = webSocketStore.isConnected;
    } else {
      try {
        // Try to retrieve user info and then connect
        await authStore.getUserInfo();
        await connectWebSocket();
        wsConnected = webSocketStore.isConnected;
      } catch (error) {
        if ($toast) {
          $toast.error("Authentication error");
        }
      }
    }

    // Wait a small amount of time to ensure WebSocket has fully initialized
    // This helps prevent race conditions where WebSocket appears connected but isn't fully ready
    if (wsConnected) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Step 2: AFTER WebSocket is connected (or attempted), load messages
    await loadMessages();

    // Wait a moment to ensure all async operations complete, then verify we have messages
    await new Promise((resolve) => setTimeout(resolve, 300));

    // If for some reason we still don't have messages, try loading them again
    if (messages.value.length === 0 && !isLoading.value) {
      await loadMessages();
    }

    // Start periodic refresh to ensure sync with backend
    startPeriodicRefresh();

    // After loading, check if we have messages in the store to display
    if (messagesStore.messages && messagesStore.messages.length > 0) {
      // Convert the messages to our format
      const convertedMessages = messagesStore.messages.map((message: any) => {
        // Use helper function for consistent comparison
        const isCurrentUser = isCurrentUserMessage(message);
        let attachment: Attachment | undefined = undefined;
        if (message.media_url) {
          const isImage =
            message.type === "image" ||
            (message.media_url &&
              /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(message.media_url));
          attachment = {
            type: isImage ? "image" : "file",
            url: message.media_url,
            name: isImage ? "Image" : "File attachment",
          };
        }
        return {
          id: message.id,
          content: message.content || "",
          timestamp:
            message.sent_at || message.created_at
              ? new Date(
                  message.sent_at || message.created_at
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
          isCurrentUser,
          read: message.read || false,
          isEdited:
            new Date(message.updated_at).getTime() >
            new Date(message.created_at).getTime(),
          isDeleted: message.type === "deleted",
          attachment,
          sent: true, // Mark API messages as already sent
        } as Message;
      });
      messages.value = convertedMessages;
    } else {
      // Initialize messages if no cached messages
      if (props.recipientId) {
        await loadMessages();
      } else if (props.chatMessages && props.chatMessages.length > 0) {
        messages.value = [...props.chatMessages];
      } else {
        messages.value = defaultMessages as Message[];
      }
    }

    // Initial scroll to bottom
    nextTick(() => {
      if (messagesEndRef.value && messages.value.length > 0) {
        messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
      }
    });

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // CRITICAL FIX: Completely redesigned initialization sequence
    // Step 1: First mark initializing state to prevent any race conditions
    isInitializing.value = true;
    hasLoadedFromAPI.value = false;

    // Step 2: Connect WebSocket FIRST and wait for it to be fully established
    if (!webSocketStore.isConnected) {
      try {
        await webSocketStore.connect();
      } catch (wsError) {
        // Continue without WebSocket - we'll use API polling as fallback
      }
    }

    // Step 3: Pause briefly to ensure WebSocket is fully initialized before proceeding
    // This helps prevent race conditions in the WebSocket handler setup
    if (webSocketStore.isConnected) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Step 4: Disable any existing WebSocket message handlers to prevent interference
    if (wsWatcher.value) {
      wsWatcher.value();
      wsWatcher.value = null;
    }

    // Step 5: Only now, load messages from API
    if (!hasLoadedFromAPI.value) {
      await loadMessages();
    }

    // Save original message count after API loading
    const messageCountAfterAPI = messages.value.length;

    // Step 6: Create multiple backups of API-loaded messages
    if (messages.value.length > 0) {
      // Save in memory
      messageBackup.value = [...messages.value];

      // Save to session storage with single backup to prevent quota issues
      const conversationKey = `chat_${props.recipientId}`;
      try {
        sessionStorage.setItem(
          `api_loaded_${conversationKey}`,
          JSON.stringify(messages.value)
        );
      } catch (error) {
        // Silently handle quota exceeded errors
      }
    }

    // Step 7: Mark initialization as complete BEFORE setting up WebSocket handler
    // This is crucial to prevent the WebSocket handler from thinking we're still initializing
    isInitializing.value = false;

    // Step 8: Finally, set up the WebSocket message handler ONLY after everything else is done
    if (webSocketStore.isConnected) {
      // Track message count before WebSocket handler setup
      const messageCountBeforeWS = messages.value.length;

      // Set up WebSocket message handler with our messages already loaded
      handleWebSocketMessages();

      // Check immediately if messages were lost during setup
      const messageCountAfterWS = messages.value.length;

      // Immediately restore if WebSocket handler somehow removed messages
      if (
        messageCountAfterWS < messageCountBeforeWS &&
        messageCountBeforeWS > 0
      ) {
        console.warn(
          `⚠️ [ChatArea] IMMEDIATE RECOVERY: Lost ${
            messageCountBeforeWS - messageCountAfterWS
          } messages!`
        );

        // Restore from memory backup first (fastest)
        if (messageBackup.value.length >= messageCountBeforeWS) {
          console.log(
            `🔄 [ChatArea] Restoring ${messageBackup.value.length} messages from memory backup`
          );
          messages.value = [...messageBackup.value];
        }
        // Fall back to session storage if memory backup failed
        else {
          try {
            const conversationKey = `chat_${props.recipientId}`;
            const backupData = sessionStorage.getItem(
              `api_loaded_${conversationKey}`
            );

            // Also try to load messages directly from API as a last resort
            if (!backupData) {
              console.log(
                "🔄 [ChatArea] No backup found in session storage, loading from API"
              );
              // CRITICAL FIX: Force a direct API reload as last resort
              hasLoadedFromAPI.value = false;
              const freshMessages = await loadMessages();
              if (freshMessages && freshMessages.length > 0) {
                console.log(
                  `🔄 [ChatArea] Successfully loaded ${freshMessages.length} fresh messages from API`
                );
                messages.value = freshMessages;
              } else {
                console.warn(
                  "⚠️ [ChatArea] API reload also failed to retrieve messages"
                );
              }
            }
            // Try to restore from session storage if available
            else if (backupData) {
              const restoredMessages = JSON.parse(backupData) as Message[];
              if (restoredMessages && restoredMessages.length > 0) {
                console.log(
                  `🔄 [ChatArea] Restoring ${restoredMessages.length} messages from session backup`
                );
                messages.value = restoredMessages;
              }
            }
          } catch (error) {
            console.error(
              "❌ [ChatArea] Failed to restore messages from backup:",
              error
            );

            // LAST RESORT: Force a fresh API load
            hasLoadedFromAPI.value = false;
            loadMessages().catch((err) =>
              console.error("API reload failed:", err)
            );
          }
        }
      }
    } else {
      console.log(
        "⚠️ [ChatArea] WebSocket not connected - using fallback polling only"
      );
    }

    // Setup periodic message refresh to ensure sync with backend
    startPeriodicRefresh();

    console.log("[ChatArea] Component initialization complete");
  } catch (error) {
    console.error("Error initializing chat:", error);
    if ($toast) {
      $toast.error("Failed to initialize chat");
    }
  }
});

// State tracking flags
const isInitializing = ref(true);
const hasLoadedFromAPI = ref(false);
const sessionStorageSaveTimeout = ref<NodeJS.Timeout | null>(null);
const refreshInterval = ref<NodeJS.Timeout | null>(null);

// Session storage management constants
const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB limit (conservative)
const MAX_MESSAGES_PER_CHAT = 100; // Limit messages per chat to prevent bloat
const STORAGE_CLEANUP_THRESHOLD = 0.8; // Clean up when 80% full

// Enhanced session storage with quota management
const getStorageUsage = () => {
  try {
    let totalSize = 0;
    for (let key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        totalSize += sessionStorage.getItem(key)?.length || 0;
      }
    }
    return totalSize;
  } catch (e) {
    return 0;
  }
};

const cleanupOldConversations = () => {
  try {
    const chatKeys = Object.keys(sessionStorage).filter((key) =>
      key.startsWith("chat_")
    );

    if (chatKeys.length === 0) {
      return;
    }

    // Sort by last accessed time (if available) or remove oldest
    const keyTimestamps = chatKeys.map((key) => {
      const timestamp = sessionStorage.getItem(`${key}_timestamp`);
      return {
        key,
        timestamp: timestamp ? parseInt(timestamp) : 0,
      };
    });

    // Remove oldest conversations first (keep newest half)
    const conversationsToRemove = keyTimestamps
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, Math.floor(chatKeys.length / 2)); // Remove half of old conversations

    conversationsToRemove.forEach((item) => {
      try {
        sessionStorage.removeItem(item.key);
        sessionStorage.removeItem(`${item.key}_timestamp`);
        sessionStorage.removeItem(`api_loaded_${item.key}`); // Also remove API load flags
      } catch (e) {
        // Silent error handling in production
      }
    });
  } catch (e) {
    // Silent error handling in production
  }
};

const truncateMessages = (messagesList: Message[]) => {
  if (messagesList.length > MAX_MESSAGES_PER_CHAT) {
    // Keep the most recent messages
    return messagesList.slice(-MAX_MESSAGES_PER_CHAT);
  }
  return messagesList;
};

// Enhanced session storage with tracking and cleanup
const saveToSessionStorage = (messagesList: Message[]) => {
  console.log(
    `💾 [SessionStorage] Preparing to save ${messagesList.length} messages`
  );

  // Clear any pending save
  if (sessionStorageSaveTimeout.value) {
    clearTimeout(sessionStorageSaveTimeout.value);
  }

  // Debounce the save operation
  sessionStorageSaveTimeout.value = setTimeout(async () => {
    try {
      // Check storage usage before saving
      const currentUsage = getStorageUsage();
      const usageRatio = currentUsage / MAX_STORAGE_SIZE;

      console.log(
        `📊 [SessionStorage] Current usage: ${(usageRatio * 100).toFixed(1)}%`
      );

      // Cleanup if approaching quota
      if (usageRatio > STORAGE_CLEANUP_THRESHOLD) {
        console.log(`🧹 [SessionStorage] Approaching quota, cleaning up...`);
        cleanupOldConversations();
      }

      // Truncate messages if too many
      const messagesToSave = truncateMessages(messagesList);

      const conversationKey = `chat_${props.recipientId}`;
      const timestampKey = `${conversationKey}_timestamp`;

      // Save with compression-like approach - only save essential data
      const essentialMessages = messagesToSave.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        timestamp: msg.timestamp,
        type: msg.type,
        attachment: msg.attachment,
        isCurrentUser: msg.isCurrentUser,
      }));

      sessionStorage.setItem(
        conversationKey,
        JSON.stringify(essentialMessages)
      );
      sessionStorage.setItem(timestampKey, Date.now().toString());

      // After emergency cleanup, check if we need to restore messages
      if (messagesToSave.length < messagesList.length) {
        await restoreMissingMessages();
      }
    } catch (storageError: any) {
      console.error(
        "❌ [SessionStorage] Error saving to session storage:",
        storageError
      );

      // Handle quota exceeded error
      if (storageError.name === "QuotaExceededError") {
        console.log(
          "🚨 [SessionStorage] Quota exceeded, performing emergency cleanup"
        );
        try {
          // Emergency cleanup - remove all chat data except current
          const currentKey = `chat_${props.recipientId}`;
          Object.keys(sessionStorage).forEach((key) => {
            if (key.startsWith("chat_") && key !== currentKey) {
              sessionStorage.removeItem(key);
            }
          });

          // Try saving again with minimal data
          const minimalMessages = messagesList.slice(-20).map((msg) => ({
            id: msg.id,
            content: msg.content?.substring(0, 200) || "", // Truncate content
            sender_id: msg.sender_id,
            timestamp: msg.timestamp,
            isCurrentUser: msg.isCurrentUser,
          }));

          sessionStorage.setItem(currentKey, JSON.stringify(minimalMessages));
          console.log(
            "✅ [SessionStorage] Emergency save completed with minimal data"
          );

          // After emergency save, try to restore any lost messages
          await restoreMissingMessages();
        } catch (emergencyError) {
          console.error(
            "❌ [SessionStorage] Emergency save failed:",
            emergencyError
          );
          // Clear all session storage as last resort
          sessionStorage.clear();
          console.log(
            "🧹 [SessionStorage] Cleared all session storage as last resort"
          );
        }
      }
    }
  }, 500); // 500ms debounce
};

// After successful emergency save, try to restore any missing messages
const restoreMissingMessages = async (): Promise<void> => {
  console.log(
    "🔄 [SessionStorage] Checking for missing messages to restore..."
  );

  try {
    // First check memory backup
    if (messageBackup.value.length > messages.value.length) {
      messages.value = [...messageBackup.value];
      return;
    }

    // Check API backup
    const apiMessages = await loadMessages();
    if (
      Array.isArray(apiMessages) &&
      apiMessages.length > messages.value.length
    ) {
      messages.value = apiMessages;
      return;
    }
  } catch (error) {
    // Silent error handling in production
    if ($toast) {
      $toast.error("Error restoring messages");
    }
  }
};

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
