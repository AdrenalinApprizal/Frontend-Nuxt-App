<template>
  <div
    :key="message.id"
    :class="`flex ${
      isDefinitelyCurrentUser ? 'justify-end' : 'justify-start'
    } mb-3 sm:mb-4 group message-item transition-all duration-200`"
    :data-message-id="message.id"
    :data-is-current="isDefinitelyCurrentUser ? 'true' : 'false'"
    :data-message-status="getMessageStatus"
  >
    <!-- Enhanced Avatar for other users with React-style design -->
    <div v-if="!isDefinitelyCurrentUser" class="mr-2 sm:mr-3 flex-shrink-0">
      <div
        class="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ring-2 ring-white shadow-sm transition-all duration-200 hover:ring-gray-300"
      >
        <OptimizedAvatar
          v-if="message.sender?.avatar"
          :src="message.sender.avatar"
          :alt="message.sender?.name || 'User'"
          size="sm"
          class="w-full h-full object-cover sm:hidden"
        />
        <OptimizedAvatar
          v-if="message.sender?.avatar"
          :src="message.sender.avatar"
          :alt="message.sender?.name || 'User'"
          size="md"
          class="w-full h-full object-cover hidden sm:block"
        />
        <Icon
          v-else
          name="fa:user"
          class="h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
        />
      </div>
      <!-- Online status indicator for sender -->
      <div
        v-if="senderOnlineStatus"
        class="w-3 h-3 bg-green-400 border-2 border-white rounded-full -mt-2 ml-6 sm:ml-7"
      ></div>
    </div>

    <div class="flex flex-col max-w-[85%] sm:max-w-[75%] min-w-0 flex-1">
      <!-- Enhanced Sender name with React-style responsive design -->
      <div
        v-if="!isDefinitelyCurrentUser"
        :class="`text-xs text-gray-600 mb-1 font-medium ml-1 transition-colors duration-200 hover:text-gray-800`"
      >
        {{ message.sender?.name || "Unknown User" }}
        <span v-if="message.sender?.role" class="ml-1 text-gray-400 lowercase">
          • {{ message.sender.role }}
        </span>
        <span
          v-if="message.sender?.customTitle"
          class="ml-1 text-blue-500 text-xs"
        >
          • {{ message.sender.customTitle }}
        </span>
      </div>

      <!-- Enhanced message bubble with React-style interactions and states -->
      <div
        :class="getMessageBubbleClasses"
        @click="handleMessageClick"
        :title="getMessageTitle"
        :data-testid="`message-${message.id}`"
      >
        <!-- React-style loading overlay -->
        <div
          v-if="message.pending || message.retrying"
          class="absolute inset-0 bg-black bg-opacity-10 rounded-2xl flex items-center justify-center backdrop-blur-sm"
        >
          <div class="bg-white rounded-full p-1.5 shadow-lg">
            <div
              class="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"
            ></div>
          </div>
        </div>

        <!-- Enhanced message actions dropdown with React-style positioning -->
        <div
          v-if="showMessageActions"
          class="absolute -top-2 -right-2 z-20"
          ref="dropdownRef"
        >
          <div
            class="opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-100 scale-95"
          >
            <button
              @click="toggleActions"
              class="bg-white text-gray-600 hover:text-gray-800 p-2 rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-xl"
              :aria-label="
                'Message actions for ' + (message.sender?.name || 'message')
              "
            >
              <Icon name="fa:ellipsis-v" class="h-3.5 w-3.5" />
            </button>

            <!-- Enhanced dropdown menu with React-style animations -->
            <div
              v-if="showActions"
              class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden animate-slideDown"
              @click.stop
            >
              <div class="py-2">
                <button
                  @click="handleEditClick"
                  class="w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center transition-all duration-200 group/action"
                  :disabled="actionLoading"
                >
                  <div
                    class="p-1.5 rounded-lg bg-blue-100 mr-3 group-hover/action:bg-blue-200 transition-colors"
                  >
                    <Icon
                      name="fa:pencil-alt"
                      class="h-3.5 w-3.5 text-blue-600"
                    />
                  </div>
                  <span class="font-medium">Edit message</span>
                </button>
                <button
                  @click="handleDeleteClick"
                  class="w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center transition-all duration-200 group/action"
                  :disabled="actionLoading"
                >
                  <div
                    class="p-1.5 rounded-lg bg-red-100 mr-3 group-hover/action:bg-red-200 transition-colors"
                  >
                    <Icon name="fa:trash" class="h-3.5 w-3.5 text-red-600" />
                  </div>
                  <span class="font-medium">Delete message</span>
                </button>
                <button
                  @click="handleCopyClick"
                  class="w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center transition-all duration-200 group/action"
                  :disabled="actionLoading"
                >
                  <div
                    class="p-1.5 rounded-lg bg-gray-100 mr-3 group-hover/action:bg-gray-200 transition-colors"
                  >
                    <Icon name="fa:copy" class="h-3.5 w-3.5 text-gray-600" />
                  </div>
                  <span class="font-medium">Copy text</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced attachment display with React-style components -->
        <div
          v-if="message.attachment"
          class="mb-3 rounded-lg overflow-hidden border border-gray-200"
        >
          <div v-if="message.attachment.type === 'image'" class="relative">
            <img
              :src="message.attachment.url"
              :alt="message.attachment.name"
              class="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              @click="handleAttachmentPreview(message.attachment)"
            />
            <div
              class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded"
            >
              {{ message.attachment.size }}
            </div>
          </div>
          <div v-else class="flex items-center p-3 bg-gray-50">
            <Icon
              :name="getFileIcon(message.attachment)"
              class="h-8 w-8 text-gray-600 mr-3"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ message.attachment.name }}
              </p>
              <p class="text-xs text-gray-500">{{ message.attachment.size }}</p>
            </div>
            <button
              @click="handleAttachmentDownload(message.attachment)"
              class="ml-3 p-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <Icon name="fa:download" class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Enhanced message content with React-style typography -->
        <div :class="messageContentClasses">
          <span
            v-if="message.isDeleted"
            class="italic text-gray-500 flex items-center"
          >
            <Icon name="fa:ban" class="h-3 w-3 mr-1.5 opacity-60" />
            This message was deleted
          </span>
          <span
            v-else-if="message.failed"
            class="text-red-700 flex items-center"
          >
            <Icon name="fa:exclamation-triangle" class="h-3 w-3 mr-1.5" />
            Failed to send
          </span>
          <template v-else>
            {{ message.content }}
          </template>
        </div>

        <!-- Enhanced message metadata with React-style indicators -->
        <div class="flex items-center justify-between mt-2.5 min-h-[16px]">
          <div class="flex items-center space-x-2">
            <!-- Message status badges -->
            <span
              v-if="message.isEdited && !message.isDeleted"
              class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 font-medium"
            >
              <Icon name="fa:edit" class="h-2.5 w-2.5 mr-1" />
              edited
            </span>

            <!-- Reaction indicators (React-style enhancement) -->
            <div
              v-if="message.reactions && message.reactions.length > 0"
              class="flex items-center space-x-1"
            >
              <div
                v-for="reaction in message.reactions"
                :key="reaction.emoji"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                :class="{ 'bg-blue-100 text-blue-700': reaction.hasReacted }"
              >
                <span class="mr-1">{{ reaction.emoji }}</span>
                <span class="font-medium">{{ reaction.count }}</span>
              </div>
            </div>
          </div>

          <!-- Enhanced timestamp and delivery status -->
          <div class="flex items-center space-x-1.5 text-xs">
            <span
              :class="`font-medium ${
                isDefinitelyCurrentUser ? 'text-blue-100' : 'text-gray-500'
              }`"
            >
              {{ formatTimestamp(message.timestamp) }}
            </span>

            <!-- React-style delivery status indicators -->
            <div v-if="isDefinitelyCurrentUser" class="flex items-center">
              <Icon
                v-if="message.pending"
                name="fa:clock"
                class="h-3 w-3 opacity-60 animate-pulse"
                title="Sending..."
              />
              <div
                v-else-if="message.retrying"
                class="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent opacity-60"
                title="Retrying..."
              ></div>
              <Icon
                v-else-if="message.failed"
                name="fa:exclamation-triangle"
                class="h-3 w-3 text-red-400"
                title="Failed to send"
              />
              <Icon
                v-else-if="message.read"
                name="fa:check-double"
                class="h-3 w-3 text-blue-400"
                title="Read"
              />
              <Icon
                v-else-if="message.delivered"
                name="fa:check-double"
                class="h-3 w-3 opacity-60"
                title="Delivered"
              />
              <Icon
                v-else-if="
                  !message.pending && !message.failed && !message.retrying
                "
                name="fa:check"
                class="h-3 w-3 opacity-50"
                title="Sent"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- React-style retry button for failed messages -->
      <div
        v-if="message.failed && isDefinitelyCurrentUser"
        class="mt-2 flex justify-end"
      >
        <button
          @click="handleRetryClick"
          class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          :disabled="message.retrying"
        >
          <Icon
            :name="message.retrying ? 'fa:spinner' : 'fa:redo'"
            :class="`h-3 w-3 mr-1.5 ${message.retrying ? 'animate-spin' : ''}`"
          />
          {{ message.retrying ? "Retrying..." : "Try again" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { formatMessageTimestamp } from "~/utils/timestampHelper";

// Enhanced interfaces matching React patterns
interface MessageAttachment {
  type: "image" | "file" | "video" | "audio" | "document";
  url: string;
  name: string;
  size?: string;
  thumbnail?: string; // For video/image previews
  duration?: number; // For video/audio files
  mimeType?: string; // MIME type for better handling
}

interface MessageSender {
  id: string;
  name: string;
  avatar?: string | null;
  role?: "admin" | "member" | "owner"; // React-style role property
  status?: "online" | "offline" | "away" | "busy"; // React-style status
  isVerified?: boolean; // Enhanced verification status
  customTitle?: string; // Custom titles like "Founder", "Moderator"
}

// Enhanced GroupMessage interface matching React patterns
interface GroupMessage {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: string;
  isCurrentUser: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  attachment?: MessageAttachment;
  pending?: boolean;
  failed?: boolean;
  retrying?: boolean;
  delivered?: boolean;
  read?: boolean;
  _isOptimisticMessage?: boolean;
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
  metadata?: {
    deviceInfo?: string;
    clientVersion?: string;
    edited?: boolean;
    editCount?: number;
  };
}

interface Props {
  message: GroupMessage;
}

interface Emits {
  (e: "retryClick", messageId: string): void;
  (e: "editClick", messageId: string): void;
  (e: "deleteClick", messageId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// State management
const showActions = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const actionLoading = ref(false);

// React-style computed properties for enhanced UX
const messageClasses = computed(() => {
  const baseClasses =
    "relative p-3 sm:p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md max-w-full break-words";

  if (isDefinitelyCurrentUser.value) {
    return `${baseClasses} bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-auto`;
  }

  return `${baseClasses} bg-white border border-gray-200 hover:border-gray-300`;
});

const getMessageBubbleClasses = computed(() => {
  let classes = messageClasses.value;

  // Add state-specific classes
  if (props.message.pending) {
    classes += " opacity-75 cursor-not-allowed";
  }

  if (props.message.failed) {
    classes += " border-red-300 bg-red-50";
  }

  if (props.message.isEdited) {
    classes += " border-l-4 border-l-yellow-400";
  }

  return classes;
});

const getMessageStatus = computed(() => {
  if (props.message.pending) return "pending";
  if (props.message.failed) return "failed";
  if (props.message.retrying) return "retrying";
  if (props.message.read) return "read";
  if (props.message.delivered) return "delivered";
  return "sent";
});

const getMessageTitle = computed(() => {
  const timestamp = formatTimestamp(props.message.timestamp);
  const status = getMessageStatus.value;

  let title = `Sent ${timestamp}`;

  if (props.message.isEdited) {
    title += " (edited)";
  }

  if (status !== "sent") {
    title += ` • Status: ${status}`;
  }

  return title;
});

const showMessageActions = computed(() => {
  return (
    isDefinitelyCurrentUser.value &&
    !props.message.pending &&
    !props.message.isDeleted
  );
});

const senderOnlineStatus = computed(() => {
  return props.message.sender.status === "online";
});

// CRITICAL FIX: Enhanced logic to determine if message is from current user
const isDefinitelyCurrentUser = computed(() => {
  return (
    props.message.isCurrentUser === true ||
    props.message.sender.name === "You" ||
    props.message._isOptimisticMessage === true ||
    props.message.id?.startsWith("temp-")
  );
});

// Format timestamp for display
const formatTimestamp = (timestamp: string): string => {
  if (!timestamp) return "";
  return formatMessageTimestamp({ timestamp, format: "time" });
};

// React-style event handlers
const handleMessageClick = () => {
  // Could be used for message selection or other interactions
};

const handleAttachmentPreview = (attachment: MessageAttachment) => {
  // Handle attachment preview
  console.log("Preview attachment:", attachment);
};

const handleAttachmentDownload = (attachment: MessageAttachment) => {
  // Handle attachment download
  console.log("Download attachment:", attachment);
};

const handleRetryClick = () => {
  emit("retryClick", props.message.id);
};

const handleEditClick = () => {
  emit("editClick", props.message.id);
  showActions.value = false;
};

const handleDeleteClick = () => {
  emit("deleteClick", props.message.id);
  showActions.value = false;
};

const handleCopyClick = async () => {
  try {
    actionLoading.value = true;
    await navigator.clipboard.writeText(props.message.content);
    showActions.value = false;
    // Could show a toast notification here
  } catch (error) {
    console.error("Failed to copy text:", error);
  } finally {
    actionLoading.value = false;
  }
};

// Message content classes for enhanced styling
const messageContentClasses = computed(() => {
  const baseClasses = "text-sm break-words whitespace-pre-wrap leading-relaxed";

  if (props.message.isDeleted) {
    return `${baseClasses} italic text-gray-500`;
  }

  if (props.message.failed) {
    return `${baseClasses} text-red-700`;
  }

  return baseClasses;
});

// Get file icon based on attachment type/name
const getFileIcon = (attachment: MessageAttachment): string => {
  if (attachment.type === "image") return "fa:image";

  const name = attachment.name.toLowerCase();
  const ext = name.split(".").pop() || "";

  if (["pdf"].includes(ext)) return "fa:file-pdf";
  if (["doc", "docx"].includes(ext)) return "fa:file-word";
  if (["xls", "xlsx"].includes(ext)) return "fa:file-excel";
  if (["ppt", "pptx"].includes(ext)) return "fa:file-powerpoint";
  if (["zip", "rar", "7z"].includes(ext)) return "fa:file-archive";
  if (["mp3", "wav", "ogg"].includes(ext)) return "fa:music";
  if (["mp4", "avi", "mov"].includes(ext)) return "fa:video";
  if (["txt"].includes(ext)) return "fa:file-text";

  return "fa:file";
};

// Toggle dropdown actions
const toggleActions = (e: Event) => {
  e.stopPropagation();
  showActions.value = !showActions.value;
};

// Handle click outside dropdown
const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showActions.value = false;
  }
};

// Debug info for each rendered message
console.log(
  `🟢 DETAILED: Rendering message in GroupMessageItem ID ${props.message.id}:`,
  {
    content: props.message.content,
    isCurrentUser: props.message.isCurrentUser,
    forcedIsCurrentUser: isDefinitelyCurrentUser.value,
    senderName: props.message.sender.name,
    senderId: props.message.sender.id,
    messageId: props.message.id,
    isOptimistic: props.message._isOptimisticMessage,
    isTemp: props.message.id?.startsWith("temp-"),
    allMessageProps: Object.keys(props.message),
    showActions: showActions.value,
  }
);

// Lifecycle hooks
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* React-style animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slideDown {
  animation: slideDown 0.2s ease-out;
}

/* Enhanced message interactions */
.message-item:hover .message-actions {
  opacity: 1;
  visibility: visible;
}

.message-actions {
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease-in-out;
}

/* React-style hover effects */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:scale-100 {
  transform: scale(1);
}

/* Enhanced status indicators */
.status-indicator {
  transition: all 0.2s ease-in-out;
}

/* React-style focus states */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.focus\:ring-offset-2:focus {
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px rgba(59, 130, 246, 0.5);
}
</style>
