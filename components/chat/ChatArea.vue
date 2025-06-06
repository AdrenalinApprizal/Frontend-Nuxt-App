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
                    ? "Hari Ini"
                    : group.isYesterday
                    ? "Kemarin"
                    : group.date
                }}
              </span>
            </div>
          </div>

          <!-- Messages for this date -->
          <div
            v-for="message in group.messages"
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
                  <p class="break-words whitespace-pre-wrap">
                    <!-- Direct content display with fallbacks -->
                    {{ message.content || "(No message content)" }}
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
                      :class="`text-xs ${
                        message.isCurrentUser
                          ? 'text-blue-200'
                          : 'text-gray-500'
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
                    <span
                      v-if="message.isEdited && !message.isDeleted"
                      :class="`text-xs ${
                        message.isCurrentUser
                          ? 'text-blue-200'
                          : 'text-gray-500'
                      }`"
                    >
                      (edited)
                    </span>
                    <span v-if="message.isCurrentUser">
                      <Icon
                        v-if="message.read"
                        name="fa:check-double"
                        class="h-3 w-3 text-blue-200"
                        title="Read"
                      />
                      <Icon
                        v-else
                        name="fa:check"
                        class="h-3 w-3 text-blue-200"
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
                      <Icon
                        name="fa:ellipsis-v"
                        class="h-3 w-3 text-gray-500"
                      />
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
import { useWebSocketListener } from "~/composables/useWebSocketListener";
import { usePresence } from "~/composables/usePresence"; // Add presence service
import { eventBus } from "~/composables/useEventBus"; // Add event bus
import { useNuxtApp } from "#app";
import { useFiles } from "~/composables/useFiles";
import { useFriendsStore } from "~/composables/useFriends"; // Import the friends store
import { formatMessageTimestamp } from "~/utils/timestampHelper"; // Import timestamp helper

// Initialize stores and Nuxt app
const messagesStore = useMessagesStore();
const authStore = useAuthStore();
const webSocketStore = useWebSocket();
const wsListener = useWebSocketListener();
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
  fromWebSocket?: boolean; // Indicates message came from WebSocket
  receivedViaWebSocket?: boolean; // Indicates message was received via WebSocket
  sourceApi?: boolean; // Indicates message came from API
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
      await fetchPrivateMessages(); // Refresh messages
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
      await fetchPrivateMessages(); // Refresh messages
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

// Simplified send message function
const handleSendMessage = async (messageContent?: string) => {
  const content = messageContent || inputMessage.value.trim();
  if (!content) return;

  try {
    isSending.value = true;

    // Create optimistic UI message
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      isCurrentUser: true,
      pending: true,
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    // Add temp message immediately for responsive UI
    messages.value.push(tempMessage);
    inputMessage.value = "";

    // Scroll to bottom
    nextTick(() => {
      if (messagesEndRef.value) {
        messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
      }
    });

    // Send message
    if (editingMessageId.value) {
      await messagesStore.editMessage(editingMessageId.value, content);
      editingMessageId.value = null;

      // Remove temp message but don't refetch for edits to preserve isEdited flag
      messages.value = messages.value.filter(
        (msg) => msg.id !== tempMessage.id
      );
    } else {
      await messagesStore.sendMessage(props.recipientId, content);

      // Remove temp message and refresh to get real message from server
      messages.value = messages.value.filter(
        (msg) => msg.id !== tempMessage.id
      );
      await fetchPrivateMessages();
    }
  } catch (error) {
    $toast?.error("Failed to send message");

    // Mark temp message as failed
    const failedMsgIndex = messages.value.findIndex(
      (msg) => msg.content === content && msg.pending
    );
    if (failedMsgIndex !== -1) {
      messages.value[failedMsgIndex] = {
        ...messages.value[failedMsgIndex],
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

// Group messages by date for better organization
const groupedMessages = computed(() => {
  const groups: {
    [key: string]: {
      date: string;
      messages: Message[];
      isToday: boolean;
      isYesterday: boolean;
    };
  } = {};

  displayMessages.value.forEach((message) => {
    const messageDate = new Date(
      message.created_at || message.sent_at || message.timestamp
    );
    const dateKey = messageDate.toDateString();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: messageDate.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        messages: [],
        isToday: dateKey === today,
        isYesterday: dateKey === yesterday,
      };
    }

    groups[dateKey].messages.push(message);
  });

  // Convert to array and sort by date
  return Object.entries(groups)
    .map(([dateKey, group]) => ({
      dateKey,
      ...group,
    }))
    .sort(
      (a, b) => new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime()
    );
});

// Format timestamp for display - using the centralized utility
function formatTimestamp(dateString?: string): string {
  if (!dateString) return "";

  // Use the centralized function with 'time' format to show actual time (HH:MM)
  return formatMessageTimestamp({ timestamp: dateString, format: "time" });
}

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
