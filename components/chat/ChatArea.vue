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
            <h2 class="font-semibold text-gray-800">{{ recipient.name }}</h2>
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
                      : 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                } min-w-[80px]`"
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
            @input="handleTyping"
          />
          <button
            @click="handleSendMessage"
            class="bg-blue-500 text-white p-3 rounded-full ml-2 hover:bg-blue-600 focus:outline-none"
            :disabled="!inputMessage.trim() && !editingMessageId"
          >
            <Icon name="fa:paper-plane" class="h-4 w-4" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from "vue";
import SearchOnFriend from "./SearchOnFriend.vue";
import FriendInfoPanel from "./FriendInfoPanel.vue";
import { useMessagesStore } from "~/composables/useMessages";
import { useAuthStore } from "~/composables/useAuth";
import { useWebSocket, WebSocketMessageType } from "~/composables/useWebSocket";
import { usePresence } from "~/composables/usePresence"; // Add presence service
import { useNuxtApp } from "#app";
import { useFiles } from "~/composables/useFiles";

// Initialize stores and Nuxt app
const messagesStore = useMessagesStore();
const authStore = useAuthStore();
const webSocketStore = useWebSocket();
const presence = usePresence(); // Add presence instance
const { $toast } = useNuxtApp();

// API base URL
const API_BASE_URL = "http://localhost:8082";

// Get current user
const currentUser = computed(() => authStore.user);

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

interface Attachment {
  type: "image" | "file";
  url: string;
  name: string;
  size?: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  read?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  attachment?: Attachment;
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
const isAttachmentMenuOpen = ref(false);
const searchQuery = ref("");
const isSearching = ref(false);
const filteredMessages = ref<Message[]>([]);
const isTyping = ref(false);
const isLoadingMore = ref(false);
const typingTimeout = ref<NodeJS.Timeout | null>(null);

// Refs for DOM manipulation
const dropdownRef = ref<HTMLElement | null>(null);
const messagesEndRef = ref<HTMLElement | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const imageInputRef = ref<HTMLInputElement | null>(null);

// Replace the recipient computed property to use real presence status
const recipient = computed(() => {
  // Get real presence status from the presence service
  const status = presence.getStatus(props.recipientId);
  const lastActive = presence.getLastActive(props.recipientId);

  return {
    id: props.recipientId,
    name: props.recipientName,
    email: `${props.recipientName
      .toLowerCase()
      .replace(/\s/g, ".")}@example.com`,
    status: status || "offline",
    lastActive,
    phone: "+1 234 567 8900",
    joinDate: "January 2023",
    location: "New York, USA",
  } as Recipient;
});

// Function to adapt Recipient type to what FriendInfoPanel expects
const adaptRecipientToFriendDetails = (recipient: Recipient) => {
  return {
    ...recipient,
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

// Initialize WebSocket connection
const connectWebSocket = async () => {
  if (!webSocketStore.isConnected && !webSocketStore.isConnecting) {
    try {
      // First make sure we have valid auth
      const valid = await webSocketStore.validateToken();
      if (valid) {
        await webSocketStore.connect();
      } else {
        console.warn("Cannot connect WebSocket - token validation failed");
        if ($toast) {
          $toast.warning("Connection issue - authenticating...");
        }
      }
    } catch (error) {
      console.error("WebSocket connection error:", error);
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

// Add watch for WebSocket errors to show toast
watch(
  () => webSocketStore.connectionError,
  (error) => {
    if (error) {
      console.warn("WebSocket connection error:", error);
    }
  }
);

// Initialize messages and connect WebSocket when component is mounted
onMounted(async () => {
  try {
    if (props.recipientId) {
      await loadMessages();
    } else if (props.chatMessages && props.chatMessages.length > 0) {
      messages.value = [...props.chatMessages];
    } else {
      messages.value = [...defaultMessages];
    }

    // Initial scroll to bottom
    nextTick(() => {
      if (messagesEndRef.value) {
        messagesEndRef.value.scrollIntoView();
      }
    });

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Check authentication status before connecting WebSocket
    if (authStore.isAuthenticated) {
      await connectWebSocket();
    } else {
      try {
        // Try to retrieve user info and then connect
        await authStore.getUserInfo();
        await connectWebSocket();
      } catch (error) {
        console.error("Auth check failed:", error);
        if ($toast) {
          $toast.error("Authentication error");
        }
      }
    }
  } catch (error) {
    console.error("Error initializing chat:", error);
    if ($toast) {
      $toast.error("Failed to initialize chat");
    }
  }
});

// Handle WebSocket message reception
const handleWebSocketMessages = () => {
  watch(
    () => messagesStore.messages,
    (newMessages) => {
      if (!newMessages || newMessages.length === 0) return;

      // Convert any new messages to our message format
      const existingIds = messages.value.map((m) => m.id);
      const newItems = newMessages
        .filter((m) => !existingIds.includes(m.id))
        .map((message) => {
          const isCurrentUser = message.sender_id === currentUser.value?.id;

          // Handle attachment type conversion
          let attachment: Attachment | undefined = undefined;
          if (message.media_url) {
            attachment = {
              type: message.type === "image" ? "image" : "file",
              url: message.media_url,
              name: message.type === "image" ? "Image" : "File",
              size: "Unknown size", // We don't have this information from WebSocket
            };
          }

          return {
            id: message.id,
            content: message.content,
            timestamp: new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isCurrentUser,
            read: message.read,
            isEdited:
              new Date(message.updated_at).getTime() >
              new Date(message.created_at).getTime(),
            attachment,
          };
        });

      if (newItems.length > 0) {
        // Add new messages to our messages array
        messages.value = [...messages.value, ...newItems];

        // Scroll to bottom with new messages
        nextTick(() => {
          if (messagesEndRef.value) {
            messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
          }
        });
      }
    }
  );
};

// Watch for typing indicators from WebSocket
watch(
  () => webSocketStore.isConnected,
  (isConnected) => {
    if (isConnected) {
      // Once connected, we can handle incoming messages
      handleWebSocketMessages();
    }
  }
);

// Load messages from the API
async function loadMessages() {
  try {
    await messagesStore.getMessages(props.recipientId);

    // Convert API messages to the component's message format
    messages.value = messagesStore.messages.map((message) => {
      const isCurrentUser = message.sender_id === currentUser.value?.id;

      // Handle attachment type conversion properly
      let attachment: Attachment | undefined = undefined;
      if (message.media_url) {
        attachment = {
          type: message.type === "image" ? "image" : "file", // Ensure type is strictly 'image' or 'file'
          url: message.media_url,
          name: message.type === "image" ? "Image" : "File",
        };
      }

      return {
        id: message.id,
        content: message.content,
        timestamp: new Date(message.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isCurrentUser,
        read: message.read,
        isEdited:
          new Date(message.updated_at).getTime() >
          new Date(message.created_at).getTime(),
        attachment,
      };
    });
  } catch (error) {
    console.error(
      `Error fetching messages for user ${props.recipientId}:`,
      error
    );
    if ($toast) {
      $toast.error("Failed to load messages");
    }
  }
}

// Computed property to get messages to display (all or filtered)
const displayMessages = computed(() => {
  return isSearching.value ? filteredMessages.value : messages.value;
});

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
};

// Handle typing indicator
const handleTyping = () => {
  // Clear previous timeout
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }

  // Send typing indicator via WebSocket
  if (webSocketStore.isConnected && props.recipientId && authStore.user) {
    webSocketStore.sendTypingStatus(props.recipientId, true);

    // Set timeout to send stop typing after 2 seconds of inactivity
    typingTimeout.value = setTimeout(() => {
      if (webSocketStore.isConnected && props.recipientId && authStore.user) {
        webSocketStore.sendTypingStatus(props.recipientId, false);
      }
    }, 2000);
  }
};

// Handle scroll for infinite loading
const handleScroll = () => {
  if (!messagesContainer.value) return;

  const { scrollTop } = messagesContainer.value;

  // If user scrolls to the top, load more messages
  if (
    scrollTop < 50 &&
    !isLoadingMore.value &&
    messagesStore.messagesPagination.has_more_pages
  ) {
    loadMoreMessages();
  }
};

// Handle file upload
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    try {
      // Create temporary UI message
      const tempId = `temp-${Date.now()}`;
      const newMessage: Message = {
        id: tempId,
        content: "",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isCurrentUser: true,
        attachment: {
          type: "file",
          url: "#", // Placeholder
          name: file.name,
          size: formatFileSize(file.size),
        },
      };

      messages.value.push(newMessage);

      // Langsung menggunakan endpoint API /messages/media
      const formData = new FormData();
      formData.append("media", file);
      formData.append("recipient_id", props.recipientId);
      formData.append("content", "File attachment");

      const response = await fetch(`${API_BASE_URL}/api/messages/media`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Reload messages to get the confirmed message
      await loadMessages();

      isAttachmentMenuOpen.value = false;

      // Reset file input
      if (fileInputRef.value) {
        fileInputRef.value.value = "";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      if ($toast) {
        $toast.error("Failed to upload file");
      }
    }
  }
};

// Handle image upload
const handleImageChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    try {
      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);

      // Create temporary UI message
      const tempId = `temp-${Date.now()}`;
      const newMessage: Message = {
        id: tempId,
        content: "",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isCurrentUser: true,
        attachment: {
          type: "image",
          url: imageUrl,
          name: file.name,
          size: formatFileSize(file.size),
        },
      };

      messages.value.push(newMessage);

      // Langsung menggunakan endpoint API /messages/media
      const formData = new FormData();
      formData.append("media", file);
      formData.append("recipient_id", props.recipientId);
      formData.append("content", "Image attachment");
      // Menambahkan parameter type untuk memberitahu server bahwa ini adalah gambar
      formData.append("type", "image");

      const response = await fetch(`${API_BASE_URL}/api/messages/media`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Reload messages
      await loadMessages();

      isAttachmentMenuOpen.value = false;

      // Reset file input
      if (imageInputRef.value) {
        imageInputRef.value.value = "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      if ($toast) {
        $toast.error("Failed to upload image");
      }
    }
  }
};

// Handle send message with optimistic updates and retry capability
const handleSendMessage = async () => {
  if (!inputMessage.value.trim() && !editingMessageId.value) return;

  if (editingMessageId.value) {
    try {
      // Edit existing message via API
      await messagesStore.editMessage(
        editingMessageId.value,
        inputMessage.value
      );

      // Update the message in our local state
      messages.value = messages.value.map((message) => {
        if (message.id === editingMessageId.value) {
          return {
            ...message,
            content: inputMessage.value,
            isEdited: true,
          };
        }
        return message;
      });

      editingMessageId.value = null;
    } catch (error) {
      console.error("Error editing message:", error);
      if ($toast) {
        $toast.error("Failed to edit message");
      }
    }
  } else {
    try {
      // Generate a temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`;
      const messageContent = inputMessage.value;

      // Optimistic update - add message to UI immediately
      const newMessage = {
        id: tempId,
        content: messageContent,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isCurrentUser: true,
        pending: true, // Flag to indicate this message is pending server confirmation
      };

      messages.value.push(newMessage);

      // Clear input early for better UX
      inputMessage.value = "";

      // Scroll to bottom immediately for better UX
      nextTick(() => {
        if (messagesEndRef.value) {
          messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
        }
      });

      // Send message via API
      const sendMessagePromise = messagesStore.sendMessage(
        props.recipientId,
        messageContent
      );

      // Track pending message with a timeout for retry
      const messageState = {
        tempId,
        content: messageContent,
        attempt: 1,
        maxAttempts: 3,
        sendPromise: sendMessagePromise,
      };

      try {
        // Await the API call
        await messageState.sendPromise;

        // Remove pending flag on success
        messages.value = messages.value.map((msg) => {
          if (msg.id === tempId) {
            return {
              ...msg,
              pending: false,
            };
          }
          return msg;
        });

        // Send stop typing indicator
        if (webSocketStore.isConnected && props.recipientId) {
          webSocketStore.sendTypingStatus(props.recipientId, false);
        }
      } catch (sendError) {
        console.error("Error sending message:", sendError);

        // Mark message as failed
        messages.value = messages.value.map((msg) => {
          if (msg.id === tempId) {
            return {
              ...msg,
              pending: false,
              failed: true,
            };
          }
          return msg;
        });

        // Add retry button
        if ($toast) {
          $toast.error("Failed to send message. Click here to retry.", {
            onClick: () => retryMessage(tempId, messageContent),
          });
        }
      }
    } catch (error) {
      console.error("Error in message sending flow:", error);
      if ($toast) {
        $toast.error("Failed to process message");
      }
    }
  }
};

// Function to retry sending a failed message
const retryMessage = async (tempId: string, content: string): Promise<void> => {
  try {
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

    // Try to send again
    await messagesStore.sendMessage(props.recipientId, content);

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

    if ($toast) {
      $toast.success("Message sent successfully");
    }
  } catch (error) {
    console.error("Error retrying message:", error);

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
  }
};

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
    await messagesStore.deleteMessage(messageId);

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
    console.error("Error deleting message:", error);
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
};

// Handle advanced search
const handleAdvancedSearch = (query: string) => {
  if (!query.trim()) {
    clearSearch();
    return;
  }

  isSearching.value = true;
  searchQuery.value = query;
  filteredMessages.value = messages.value.filter((message) =>
    message.content.toLowerCase().includes(query.toLowerCase())
  );
};

// Load more messages (older messages)
const loadMoreMessages = async () => {
  if (!props.recipientId) return;

  try {
    isLoadingMore.value = true;
    const response = await messagesStore.loadMoreMessages(props.recipientId);

    // Check if we got a valid response with data
    if (
      response &&
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      // Convert and add new messages
      const newMessages = response.data.map((message: any) => {
        const isCurrentUser = message.sender_id === currentUser.value?.id;

        // Handle attachment type conversion
        let attachment: Attachment | undefined = undefined;
        if (message.media_url) {
          attachment = {
            type: message.type === "image" ? "image" : "file",
            url: message.media_url,
            name: message.type === "image" ? "Image" : "File",
            size: "Unknown size", // We don't have this information from WebSocket
          };
        }

        return {
          id: message.id,
          content: message.content,
          timestamp: new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isCurrentUser,
          read: message.read,
          isEdited:
            new Date(message.updated_at).getTime() >
            new Date(message.created_at).getTime(),
          attachment,
        };
      });

      // Prepend new messages to the existing list
      messages.value = [...newMessages, ...messages.value];
    }
  } catch (error) {
    console.error("Error loading more messages:", error);
    if ($toast) {
      $toast.error("Failed to load more messages");
    }
  } finally {
    isLoadingMore.value = false;
  }
};

// Sync presence status on component mount and recipient change
watch(
  () => props.recipientId,
  async (newRecipientId, oldRecipientId) => {
    if (newRecipientId) {
      // Fetch user's presence status directly without subscription
      // (karena method subscribe tidak tersedia)
      try {
        await presence.getUserStatus(newRecipientId);

        // Get updated status setelah fetch
        const status = presence.getStatus(newRecipientId);
        const lastActive = presence.getLastActive(newRecipientId);

        // Tidak bisa langsung mengubah recipient.value karena computed
        // Kita cukup mengandalkan reactive getStatus method
      } catch (error) {
        console.error(
          `Error fetching presence status for ${newRecipientId}:`,
          error
        );
      }
    }
  }
);

// Cleanup on component unmount
onUnmounted(() => {
  // Hapus handler presence, tidak perlu unsubscribe
  // karena metode unsubscribe tidak tersedia
});
</script>

<style scoped>
.message {
  transition: background-color 0.3s;
}

.message:hover {
  background-color: #f7f9fc;
}
</style>
