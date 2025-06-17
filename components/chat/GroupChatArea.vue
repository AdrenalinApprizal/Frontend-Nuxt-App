<template>
  <div class="h-full flex bg-gray-50">
    <!-- Main chat area -->
    <div class="flex-1 flex flex-col h-full">
      <!-- Enhanced header with group info -->
      <div
        class="px-4 sm:px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between"
      >
        <div class="flex items-center min-w-0 flex-1">
          <div class="relative mr-3 flex-shrink-0">
            <div
              class="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ring-2 ring-white shadow-sm"
            >
              <img
                v-if="currentGroup?.avatar_url"
                :src="currentGroup.avatar_url"
                :alt="currentGroup?.name"
                class="h-full w-full object-cover"
              />
              <Icon
                v-else
                name="fa:users"
                class="h-5 w-5 sm:h-6 sm:w-6 text-gray-500"
              />
            </div>
            <!-- Online indicator for group activity -->
            <div
              class="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"
              v-if="memberCount > 1"
            ></div>
          </div>
          <div class="min-w-0 flex-1">
            <h2 class="font-semibold text-gray-800 text-lg truncate">
              {{ currentGroup?.name || "Loading..." }}
            </h2>
            <p class="text-xs sm:text-sm text-gray-500 truncate">
              {{ memberCount }} member{{ memberCount !== 1 ? "s" : "" }}
              <span
                v-if="
                  groupMembers.filter(
                    (m) => getMemberStatus(m.user_id) === 'online'
                  ).length > 0
                "
                class="ml-1"
              >
                ·
                {{
                  groupMembers.filter(
                    (m) => getMemberStatus(m.user_id) === "online"
                  ).length
                }}
                online
              </span>
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <div v-if="isLoading" class="mr-2">
            <div
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"
            ></div>
          </div>

          <!-- Search button -->
          <button
            @click="showSearch = true"
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200"
            title="Search in conversation"
          >
            <Icon name="fa:search" class="h-4 w-4" />
          </button>

          <!-- Group info button -->
          <button
            @click="showInfo = !showInfo"
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200"
            :class="{ 'bg-blue-50 text-blue-500': showInfo }"
            title="Group info"
          >
            <Icon name="fa:info-circle" class="h-4 w-4" />
          </button>

          <!-- More options button -->
          <button
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200"
            title="More options"
          >
            <Icon name="fa:ellipsis-v" class="h-4 w-4" />
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

      <!-- Enhanced messages container -->
      <div
        class="flex-1 overflow-auto px-4 sm:px-6 py-4 space-y-4 relative bg-gray-50"
        ref="messagesContainer"
      >
        <!-- Loading state with better UX -->
        <div
          v-if="groupsStore.isLoading"
          class="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 z-10 backdrop-blur-sm"
        >
          <div
            class="flex flex-col items-center bg-white rounded-lg p-6 shadow-lg"
          >
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"
            ></div>
            <p class="text-sm font-medium text-gray-600">Loading messages...</p>
          </div>
        </div>

        <!-- Enhanced no messages placeholder -->
        <div
          v-else-if="displayMessages.length === 0"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div v-if="isSearching" class="text-center">
            <div class="mb-4">
              <Icon
                name="fa:search"
                class="h-12 w-12 text-gray-300 mx-auto mb-3"
              />
              <p class="text-gray-500 font-medium mb-1">
                No matching messages found
              </p>
              <p class="text-sm text-gray-400">
                Try adjusting your search criteria
              </p>
            </div>
            <button
              @click="clearSearch"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Clear search
            </button>
          </div>
          <div v-else class="text-center">
            <div class="mb-4">
              <Icon
                name="fa:comments"
                class="h-12 w-12 text-gray-300 mx-auto mb-3"
              />
              <p class="text-gray-500 font-medium mb-1">No messages yet</p>
              <p class="text-sm text-gray-400">
                Start the conversation by sending a message
              </p>
            </div>
          </div>
        </div>

        <!-- Enhanced load more messages button -->
        <div
          v-if="canLoadMoreMessages && displayMessages.length > 0"
          class="text-center mb-6"
        >
          <button
            @click="loadMoreMessages"
            class="inline-flex items-center px-4 py-2 text-sm bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 shadow-sm"
            :class="{ 'opacity-50 cursor-not-allowed': isLoadingMore }"
            :disabled="isLoadingMore"
          >
            <div v-if="isLoadingMore" class="flex items-center">
              <div
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"
              ></div>
              Loading...
            </div>
            <span v-else class="flex items-center">
              <Icon name="fa:chevron-up" class="h-4 w-4 mr-2" />
              Load earlier messages
            </span>
          </button>
        </div>

        <!-- Enhanced messages list -->
        <div
          v-for="message in displayMessages"
          :key="message.id"
          class="message-wrapper"
        >
          <GroupMessageItem
            :message="{
              ...message,
              sender: message.sender || {
                id: message.sender_id || 'unknown',
                name: 'Unknown User',
                avatar: undefined,
                role: 'member' as const,
                status: 'offline' as const,
              },
              timestamp: message.timestamp || '',
              isCurrentUser: message.isCurrentUser ?? false,
            }"
            @edit-click="handleEditMessage"
            @delete-click="handleUnsendMessage"
            @retry-click="
              (messageId) => retryMessage(messageId, message.content)
            "
          />
        </div>

        <!-- End of messages indicator for auto-scroll -->
        <div ref="messagesEndRef" class="h-1"></div>
      </div>

      <!-- Enhanced message input area -->
      <div class="px-4 sm:px-6 py-4 bg-white border-t border-gray-200">
        <!-- Enhanced upload progress indicator with React-style UI -->
        <div
          v-if="isUploading && uploadProgress.length > 0"
          class="mb-3 bg-blue-50 rounded-lg p-3 border border-blue-200"
        >
          <div class="text-sm font-medium text-blue-800 mb-3 flex items-center">
            <Icon name="fa:cloud-upload" class="h-4 w-4 mr-2" />
            Uploading {{ uploadProgress.length }} file{{
              uploadProgress.length > 1 ? "s" : ""
            }}...
          </div>
          <div class="space-y-3">
            <div
              v-for="progress in uploadProgress"
              :key="progress.id"
              class="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2 flex-1 min-w-0">
                  <Icon
                    :name="
                      progress.file.type.startsWith('image/')
                        ? 'fa:image'
                        : 'fa:file'
                    "
                    class="h-4 w-4 text-gray-500 flex-shrink-0"
                  />
                  <span class="text-sm font-medium text-gray-900 truncate">{{
                    progress.file.name
                  }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-gray-500"
                    >{{ progress.progress }}%</span
                  >
                  <div class="w-4 h-4">
                    <Icon
                      v-if="progress.status === 'uploading'"
                      name="svg-spinners:270-ring"
                      class="h-4 w-4 text-blue-500"
                    />
                    <Icon
                      v-else-if="progress.status === 'success'"
                      name="fa:check-circle"
                      class="h-4 w-4 text-green-500"
                    />
                    <Icon
                      v-else-if="progress.status === 'error'"
                      name="fa:times-circle"
                      class="h-4 w-4 text-red-500"
                    />
                  </div>
                </div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${progress.progress}%` }"
                  :class="{
                    'bg-blue-500': progress.status === 'uploading',
                    'bg-green-500': progress.status === 'success',
                    'bg-red-500': progress.status === 'error',
                  }"
                ></div>
              </div>
              <div
                v-if="progress.error"
                class="text-red-600 text-xs mt-2 flex items-center"
              >
                <Icon name="fa:exclamation-triangle" class="h-3 w-3 mr-1" />
                {{ progress.error }}
              </div>
            </div>
          </div>
        </div>

        <!-- Edit message indicator -->
        <div
          v-if="editingMessageId"
          class="flex items-center justify-between mb-3 bg-blue-50 p-3 rounded-lg border border-blue-200"
        >
          <div class="flex items-center">
            <Icon name="fa:edit" class="h-4 w-4 text-blue-600 mr-2" />
            <span class="text-sm font-medium text-blue-700"
              >Editing message</span
            >
          </div>
          <button
            @click="handleCancelEdit"
            class="p-1 text-gray-600 hover:text-gray-800 rounded transition-colors"
          >
            <Icon name="lucide:x" class="h-4 w-4" />
          </button>
        </div>

        <!-- Main input container -->
        <div class="flex items-end space-x-3">
          <!-- Attachment button with enhanced menu -->
          <div class="relative">
            <button
              @click="isAttachmentMenuOpen = !isAttachmentMenuOpen"
              class="p-2.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200"
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

            <!-- Enhanced attachment menu -->
            <div
              v-if="isAttachmentMenuOpen"
              class="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 animate-fadeIn"
              style="min-width: 180px"
            >
              <button
                type="button"
                @click="handleFileUpload"
                class="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                :disabled="isSending || isUploading"
                :class="{
                  'opacity-50 cursor-not-allowed': isSending || isUploading,
                }"
              >
                <div
                  class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3"
                >
                  <Icon name="fa:file" class="h-4 w-4 text-blue-600" />
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium">Document</div>
                  <div class="text-xs text-gray-500">Share a file</div>
                </div>
                <Icon
                  v-if="isUploading"
                  name="svg-spinners:270-ring"
                  class="h-4 w-4 text-blue-500"
                />
              </button>
              <button
                type="button"
                @click="handleImageUpload"
                class="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                :disabled="isSending || isUploading"
                :class="{
                  'opacity-50 cursor-not-allowed': isSending || isUploading,
                }"
              >
                <div
                  class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3"
                >
                  <Icon name="fa:image" class="h-4 w-4 text-green-600" />
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium">Photo</div>
                  <div class="text-xs text-gray-500">Share an image</div>
                </div>
                <Icon
                  v-if="isUploading"
                  name="svg-spinners:270-ring"
                  class="h-4 w-4 text-blue-500"
                />
              </button>
            </div>
          </div>

          <!-- Hidden file inputs -->
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

          <!-- Enhanced message input -->
          <div class="flex-1 relative">
            <input
              v-model="inputMessage"
              type="text"
              :placeholder="
                editingMessageId
                  ? 'Edit your message...'
                  : 'Type your message...'
              "
              class="w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:border-blue-400 focus:bg-white text-gray-700 transition-colors duration-200"
              @keydown.enter.prevent="handleSendMessage"
              :disabled="isSending || isUploading"
            />
          </div>

          <!-- Enhanced send button -->
          <button
            @click="handleSendMessage"
            class="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
            :disabled="
              isSending ||
              isUploading ||
              (!inputMessage.trim() && !editingMessageId)
            "
            :class="{
              'opacity-50 cursor-not-allowed':
                isSending ||
                isUploading ||
                (!inputMessage.trim() && !editingMessageId),
              'shadow-lg':
                !isSending &&
                !isUploading &&
                (inputMessage.trim() || editingMessageId),
            }"
          >
            <div
              v-if="isSending"
              class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
            ></div>
            <Icon
              v-else-if="editingMessageId"
              name="fa:check"
              class="h-5 w-5"
            />
            <Icon v-else name="fa:paper-plane" class="h-5 w-5" />
          </button>
        </div>
      </div>
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
/**
 * GroupChatArea.vue - Enhanced Vue.js Group Chat Component
 *
 * UPDATED TO MATCH REACT PATTERNS:
 * ✅ Enhanced file upload with 2-step process using fileUploadHelper
 * ✅ Multiple file support with progress tracking
 * ✅ React-style optimistic UI updates
 * ✅ Improved responsive design with sm: breakpoints
 * ✅ Enhanced attachment menu with better UX
 * ✅ Modern progress indicators and loading states
 * ✅ WebSocket integration with proper message syncing
 * ✅ Better error handling and toast notifications
 * ✅ Accessibility improvements and reduced motion support
 * ✅ Enhanced styling matching React component patterns
 *
 * KEY FEATURES:
 * - Real-time messaging with WebSocket support
 * - File and image uploads with progress tracking
 * - Message editing and deletion
 * - Group member presence tracking
 * - Search functionality
 * - Responsive design for mobile and desktop
 * - Optimistic UI updates for better UX
 * - Session storage for message persistence
 * - Enhanced error handling and recovery
 */

import { ref, computed, onMounted, nextTick, watch, onUnmounted } from "vue";
import { useGroupsStore } from "~/composables/useGroups";
import { useAuthStore } from "~/composables/useAuth";
import { usePresence } from "~/composables/usePresence";
import { useNuxtApp } from "#app";
import SearchOnGroup from "./SearchOnGroup.vue";
import GroupInfoPanel from "./GroupInfoPanel.vue";
import GroupMessageItem from "./GroupMessageItem.vue"; // Add GroupMessageItem import
import { useFiles } from "~/composables/useFiles";
import { useMessagesStore } from "~/composables/useMessages";
import { useWebSocketListener } from "~/composables/useWebSocketListener";
import { eventBus } from "~/composables/useEventBus";
import {
  formatMessageTimestamp,
  extractValidDate,
  formatDateForSeparator,
} from "~/utils/timestampHelper";
import {
  uploadFileAndSendMessage,
  validateFile,
  getMediaType,
  formatFileSize,
} from "~/utils/fileUploadHelper";
import { WebSocketMessageType } from "~/composables/useWebSocket";

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

// Enhanced GroupMessage interface matching React patterns
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
    role?: "admin" | "member" | "owner"; // Enhanced with proper typing
    status?: "online" | "offline" | "away" | "busy"; // Enhanced status options
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
  // React-style enhancement properties
  reactions?: Array<{
    emoji: string;
    count: number;
    userIds: string[];
    hasReacted?: boolean;
  }>;
  mentions?: Array<{
    userId: string;
    name: string;
    startIndex: number;
    length: number;
  }>;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
  deliveryStatus?: "sending" | "sent" | "delivered" | "read" | "failed";
  editHistory?: Array<{
    content: string;
    editedAt: string;
  }>;
}

interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: "admin" | "member" | "owner"; // Enhanced with owner role
  joined_at: string;
  name: string;
  status: "online" | "offline" | "away" | "busy"; // Enhanced status options
  // API response fields
  first_name?: string;
  last_name?: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  // Enhanced properties for better UX
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
  // React-style enhancement properties
  permissions?: {
    canKick?: boolean;
    canMute?: boolean;
    canPromote?: boolean;
    canEdit?: boolean;
  };
  lastSeen?: string;
  isTyping?: boolean;
  muteUntil?: string;
  joinedVia?: "invite" | "link" | "admin";
  customTitle?: string;
}

// Enhanced GroupDetails interface matching React patterns
interface GroupDetails {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
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
  // React-style additional properties
  ownerId?: string;
  isActive?: boolean;
  settings?: {
    allowMemberInvites?: boolean;
    requireApproval?: boolean;
    muteNotifications?: boolean;
  };
  // Enhanced React-style properties for better state management
  isOnline?: boolean;
  unreadCount?: number;
  lastActivity?: string;
  permissions?: {
    canEdit?: boolean;
    canDelete?: boolean;
    canInvite?: boolean;
    canLeave?: boolean;
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
          // Add raw_timestamp for consistent sorting and date parsing
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

// Enhanced file upload handler using the fileUploadHelper utility
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []);

  if (files.length === 0) return;

  try {
    isUploading.value = true;
    isAttachmentMenuOpen.value = false;

    // Initialize progress tracking for all files
    uploadProgress.value = files.map((file) => ({
      id: `upload-${Date.now()}-${Math.random()}`,
      file,
      progress: 0,
      status: "pending" as const,
      error: null,
    }));

    // Process files sequentially to avoid overwhelming the server
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progressItem = uploadProgress.value[i];

      try {
        // Validate file before upload
        const validation = validateFile(file);
        if (!validation.valid) {
          throw new Error(validation.error || "Invalid file");
        }

        // Update status to uploading
        progressItem.status = "uploading";

        // Create optimistic message for this file
        const tempId = `temp-${Date.now()}-${i}`;
        const nowISOString = new Date().toISOString();
        const mediaType = getMediaType(file.type);

        // Convert media type to attachment type (only "image" or "file" are supported)
        const attachmentType: "image" | "file" =
          mediaType === "image" ? "image" : "file";

        const optimisticMessage: GroupMessage = {
          id: tempId,
          message_id: tempId,
          content: "",
          sender: {
            id: currentUser.value?.id || "user",
            name: currentUser.value?.name || "You",
          },
          sender_id: currentUser.value?.id || "user",
          group_id: props.groupId,
          raw_timestamp: nowISOString,
          sent_at: nowISOString,
          created_at: nowISOString,
          timestamp: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          isCurrentUser: true,
          pending: true,
          attachment: {
            type: attachmentType,
            url: attachmentType === "image" ? URL.createObjectURL(file) : "#",
            name: file.name,
            size: formatFileSize(file.size),
          },
        };

        // Add optimistic message to UI
        messages.value.push(optimisticMessage);

        // Scroll to bottom
        nextTick(() => {
          if (messagesEndRef.value) {
            messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
          }
        });

        // Upload file using the helper utility
        const result = await uploadFileAndSendMessage(
          file,
          props.groupId,
          "",
          true, // isGroup = true
          (progress: number) => {
            progressItem.progress = progress;
          }
        );

        // Update progress to success
        progressItem.status = "success";
        progressItem.progress = 100;

        // Update the optimistic message
        const tempMessageIndex = messages.value.findIndex(
          (msg) => msg.id === tempId
        );
        if (tempMessageIndex !== -1) {
          messages.value[tempMessageIndex] = {
            ...messages.value[tempMessageIndex],
            pending: false,
            attachment: {
              ...messages.value[tempMessageIndex].attachment!,
              url:
                result.fileUrl ||
                messages.value[tempMessageIndex].attachment!.url,
            },
          };
        }

        // Clean up blob URL for images
        if (
          attachmentType === "image" &&
          optimisticMessage.attachment?.url?.startsWith("blob:")
        ) {
          URL.revokeObjectURL(optimisticMessage.attachment.url);
        }
      } catch (error: any) {
        console.error("Error uploading file:", error);
        progressItem.status = "error";
        progressItem.error = error.message || "Upload failed";

        // Update the optimistic message to show error
        const tempMessageIndex = messages.value.findIndex(
          (msg) => msg.id === `temp-${Date.now()}-${i}`
        );
        if (tempMessageIndex !== -1) {
          messages.value[tempMessageIndex] = {
            ...messages.value[tempMessageIndex],
            pending: false,
            failed: true,
          };
        }

        if ($toast) {
          $toast.error(`Failed to upload ${file.name}: ${error.message}`);
        }
      }
    }

    // Refresh messages to get the real data
    await fetchGroupMessages();
    saveToSessionStorage(messages.value);

    // Show success toast for successfully uploaded files
    const successCount = uploadProgress.value.filter(
      (p) => p.status === "success"
    ).length;
    if (successCount > 0 && $toast) {
      $toast.success(
        `Successfully uploaded ${successCount} file${
          successCount > 1 ? "s" : ""
        }`
      );
    }
  } catch (error: any) {
    console.error("Error in file upload process:", error);
    if ($toast) {
      $toast.error("Failed to upload files");
    }
  } finally {
    isUploading.value = false;

    // Clear progress after a delay
    setTimeout(() => {
      uploadProgress.value = [];
    }, 3000);

    // Reset file input
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
  }
};

// Enhanced image upload handler
const handleImageChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []);

  if (files.length === 0) return;

  // Filter to only image files
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  if (imageFiles.length === 0) {
    if ($toast) {
      $toast.error("Please select valid image files");
    }
    return;
  }

  try {
    isUploading.value = true;
    isAttachmentMenuOpen.value = false;

    // Initialize progress tracking for all images
    uploadProgress.value = imageFiles.map((file) => ({
      id: `upload-${Date.now()}-${Math.random()}`,
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
        // Validate image file
        const validation = validateFile(file);
        if (!validation.valid) {
          throw new Error(validation.error || "Invalid image file");
        }

        // Update status to uploading
        progressItem.status = "uploading";

        // Create optimistic message with image preview
        const tempId = `temp-${Date.now()}-${i}`;
        const nowISOString = new Date().toISOString();
        const imageUrl = URL.createObjectURL(file);

        const optimisticMessage: GroupMessage = {
          id: tempId,
          message_id: tempId,
          content: "",
          sender: {
            id: currentUser.value?.id || "user",
            name: currentUser.value?.name || "You",
          },
          sender_id: currentUser.value?.id || "user",
          group_id: props.groupId,
          raw_timestamp: nowISOString,
          sent_at: nowISOString,
          created_at: nowISOString,
          timestamp: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          isCurrentUser: true,
          pending: true,
          attachment: {
            type: "image",
            url: imageUrl,
            name: file.name,
            size: formatFileSize(file.size),
          },
        };

        // Add optimistic message to UI
        messages.value.push(optimisticMessage);

        // Scroll to bottom
        nextTick(() => {
          if (messagesEndRef.value) {
            messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
          }
        });

        // Upload image using the helper utility
        const result = await uploadFileAndSendMessage(
          file,
          props.groupId,
          "",
          true, // isGroup = true
          (progress: number) => {
            progressItem.progress = progress;
          }
        );

        // Update progress to success
        progressItem.status = "success";
        progressItem.progress = 100;

        // Clean up the blob URL
        URL.revokeObjectURL(imageUrl);

        // Update the optimistic message
        const tempMessageIndex = messages.value.findIndex(
          (msg) => msg.id === tempId
        );
        if (tempMessageIndex !== -1) {
          messages.value[tempMessageIndex] = {
            ...messages.value[tempMessageIndex],
            pending: false,
            attachment: {
              ...messages.value[tempMessageIndex].attachment!,
              url:
                result.fileUrl ||
                messages.value[tempMessageIndex].attachment!.url,
            },
          };
        }
      } catch (error: any) {
        console.error("Error uploading image:", error);
        progressItem.status = "error";
        progressItem.error = error.message || "Upload failed";

        // Update the optimistic message to show error
        const tempMessageIndex = messages.value.findIndex(
          (msg) => msg.id === `temp-${Date.now()}-${i}`
        );
        if (tempMessageIndex !== -1) {
          messages.value[tempMessageIndex] = {
            ...messages.value[tempMessageIndex],
            pending: false,
            failed: true,
          };
        }

        if ($toast) {
          $toast.error(`Failed to upload ${file.name}: ${error.message}`);
        }
      }
    }

    // Refresh messages to get the real data
    await fetchGroupMessages();
    saveToSessionStorage(messages.value);

    // Show success toast for successfully uploaded images
    const successCount = uploadProgress.value.filter(
      (p) => p.status === "success"
    ).length;
    if (successCount > 0 && $toast) {
      $toast.success(
        `Successfully uploaded ${successCount} image${
          successCount > 1 ? "s" : ""
        }`
      );
    }
  } catch (error: any) {
    console.error("Error in image upload process:", error);
    if ($toast) {
      $toast.error("Failed to upload images");
    }
  } finally {
    isUploading.value = false;

    // Clear progress after a delay
    setTimeout(() => {
      uploadProgress.value = [];
    }, 3000);

    // Reset file input
    if (imageInputRef.value) {
      imageInputRef.value.value = "";
    }
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
/* Enhanced styles matching React patterns */

/* Smooth animations for all transitions */
* {
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Message container animations */
.message-wrapper {
  transition: all 0.2s ease-in-out;
}

.message-wrapper:hover {
  transform: translateX(4px);
}

/* Enhanced fade-in animation for attachment menu */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

/* Smooth scrollbar styles for webkit browsers */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.overflow-auto::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Enhanced focus styles */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Loading spinner enhancement */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Progress bar smooth animation */
.progress-bar {
  transition: width 0.3s ease-in-out;
}

/* Enhanced button hover effects */
.btn-hover-lift {
  transition: all 0.2s ease-in-out;
}

.btn-hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Message bubble enhancements */
.message-bubble {
  transition: all 0.2s ease-in-out;
}

.message-bubble:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Responsive design helpers */
@media (max-width: 640px) {
  .message-wrapper {
    padding-left: 8px;
    padding-right: 8px;
  }

  .message-bubble {
    font-size: 14px;
  }
}

/* Upload progress container styling */
.upload-progress-container {
  backdrop-filter: blur(4px);
}

/* Enhanced attachment menu styling */
.attachment-menu {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Loading backdrop effect */
.loading-backdrop {
  backdrop-filter: blur(4px);
}

/* Message status indicators */
.message-status {
  transition: all 0.2s ease-in-out;
}

.message-status.pending {
  opacity: 0.6;
}

.message-status.failed {
  opacity: 0.5;
}

.message-status.success {
  opacity: 1;
}

/* Enhanced group avatar with online indicator */
.group-avatar {
  position: relative;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #34d399;
  border: 2px solid white;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Enhanced input focus effects */
.enhanced-input {
  transition: all 0.2s ease-in-out;
}

.enhanced-input:focus {
  transform: scale(1.02);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Improved mobile responsiveness */
@media (max-width: 768px) {
  .chat-header {
    padding: 12px 16px;
  }

  .chat-input-container {
    padding: 12px 16px;
  }

  .messages-container {
    padding: 0 16px;
  }
}

/* Dark mode support (future enhancement) */
@media (prefers-color-scheme: dark) {
  .dark-mode-ready {
    background-color: #111827;
    color: white;
  }
}

/* Accessibility improvements */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .high-contrast {
    border: 2px solid black;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Custom typing indicator animation */
@keyframes typing {
  0%,
  60%,
  100% {
    opacity: 0.3;
  }
  30% {
    opacity: 1;
  }
}

.typing-indicator {
  font-style: italic;
  color: #6b7280;
}

.typing-dot {
  animation: typing 1.4s infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

/* Enhanced scroll behavior */
.smooth-scroll {
  scroll-behavior: smooth;
}

/* Message hover effects */
.message-item:hover .message-actions {
  opacity: 1;
  visibility: visible;
}

.message-actions {
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease-in-out;
}

/* File upload drag and drop styling */
.drag-over {
  border: 2px dashed #3b82f6;
  background-color: #eff6ff;
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

/* Loading skeleton animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}
</style>
