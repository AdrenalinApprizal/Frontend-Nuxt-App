<template>
  <div
    :class="`flex ${
      message.isCurrentUser ? 'justify-end' : 'justify-start'
    } mb-3 sm:mb-4 hover:bg-gray-50 hover:bg-opacity-50 px-2 py-1 rounded-lg transition-colors duration-150`"
    :data-message-id="message.id"
    :data-sender-id="message.sender_id"
    :data-recipient-id="message.recipient_id || message.receiver_id"
    :data-is-current-user="message.isCurrentUser"
    :data-positioning="message.isCurrentUser ? 'right' : 'left'"
  >
    <!-- Avatar for other users -->
    <div v-if="!message.isCurrentUser" class="mr-2 flex-shrink-0">
      <OptimizedAvatar
        :src="validatedAvatar"
        :alt="senderName"
        size="md"
        class="transition-all duration-200 hover:scale-105"
      />
    </div>

    <!-- Message content wrapper -->
    <div class="flex flex-col max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
      <!-- Sender name for group chats -->
      <div
        v-if="!message.isCurrentUser && (showSenderName || isGroupChat)"
        class="text-xs text-gray-600 mb-1 px-1"
      >
        {{ senderName }}
      </div>

      <!-- Message bubble wrapper -->
      <div
        :class="bubbleClasses"
        @click="message.failed ? handleRetryClick() : undefined"
        :title="
          message.failed ? 'Click to retry sending this message' : undefined
        "
      >
        <!-- Message actions dropdown for current user's messages -->
        <div
          v-if="showActionsButton"
          class="absolute top-2 right-2"
          ref="dropdownRef"
        >
          <button
            @click="toggleActions"
            class="text-white hover:text-blue-200 p-1.5 rounded-full focus:outline-none opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black bg-opacity-20 hover:bg-opacity-40 hover:scale-110 touch-manipulation"
          >
            <Icon name="lucide:more-vertical" class="h-3 w-3" />
          </button>

          <!-- Dropdown menu -->
          <div
            v-if="showActions"
            class="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200"
          >
            <div class="py-1">
              <button
                @click="handleEditClick"
                class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center transition-colors duration-150"
              >
                <Icon name="lucide:edit-2" class="mr-2 h-3 w-3" />
                Edit
              </button>
              <button
                @click="handleDeleteClick"
                class="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center transition-colors duration-150"
              >
                <Icon name="lucide:trash-2" class="mr-2 h-3 w-3" />
                Unsend
              </button>
            </div>
          </div>
        </div>

        <!-- Status indicators -->
        <div
          v-if="message.pending || message.retrying"
          class="absolute top-0 right-0 -mt-1 -mr-1"
        >
          <div
            v-if="message.pending"
            class="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"
          ></div>
          <div
            v-else-if="message.retrying"
            class="animate-pulse rounded-full h-3 w-3 bg-yellow-500"
          ></div>
        </div>

        <!-- Attachment display - with auto detection -->
        <div v-if="message.attachment" class="mb-1">
          <!-- Image attachment with retry functionality -->
          <div v-if="attachmentType === 'image'" class="relative">
            <ImageWithRetry
              :src="message.attachment.url"
              :alt="message.attachment.name"
              :messageId="message.id"
              class="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity max-h-48"
              @click="openImagePreview"
            />
          </div>

          <!-- Video attachment -->
          <div v-else-if="attachmentType === 'video'" class="relative">
            <video
              :src="message.attachment.url"
              controls
              class="max-w-full h-auto rounded-lg max-h-64"
              @error="handleMediaError"
            ></video>
          </div>

          <!-- Audio attachment -->
          <div
            v-else-if="attachmentType === 'audio'"
            class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div class="flex-shrink-0">
              <Icon name="lucide:music" class="h-5 w-5 text-blue-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ message.attachment.name }}
              </p>
              <audio
                controls
                class="w-full mt-1 h-8"
                :src="message.attachment.url"
                @error="handleMediaError"
              ></audio>
            </div>
          </div>

          <!-- Generic file attachment -->
          <div v-else>
            <button
              @click="
                handleDownloadFile(
                  $event,
                  message.attachment.url,
                  message.attachment.name
                )
              "
              :disabled="isDownloading"
              class="text-blue-500 hover:underline flex items-center space-x-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              :title="`Download ${message.attachment.name}`"
            >
              <div
                v-if="isDownloading"
                class="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"
              />
              <Icon v-else name="lucide:file" class="text-gray-500 h-3 w-3" />
              <span class="text-xs truncate max-w-32">
                {{ message.attachment.name }}
              </span>
              <Icon
                v-if="!isDownloading"
                name="lucide:download"
                class="h-2.5 w-2.5 text-gray-400"
              />
            </button>
          </div>
        </div>

        <!-- Message content -->
        <div v-if="message.content || message.isDeleted">
          <p
            class="text-sm break-words whitespace-pre-wrap leading-relaxed"
            :class="{
              'italic text-gray-500': message.isDeleted,
              'text-white': message.isCurrentUser && !message.isDeleted,
              'text-gray-800': !message.isCurrentUser && !message.isDeleted,
            }"
          >
            {{
              message.isDeleted
                ? "This message was deleted"
                : message.content || ""
            }}
          </p>
        </div>

        <!-- Error message for failed messages -->
        <div
          v-if="message.failed && message.errorMessage"
          class="mt-1 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600"
        >
          <Icon name="lucide:alert-triangle" class="h-3 w-3 inline mr-1" />
          {{ message.errorMessage }}
        </div>

        <!-- Timestamp and status indicators -->
        <div
          class="flex items-center justify-end space-x-1 mt-1 text-xs"
          :class="{
            'text-white text-opacity-75': message.isCurrentUser,
            'text-gray-500': !message.isCurrentUser,
          }"
        >
          <div class="flex items-center space-x-1">
            <span
              v-if="message.isEdited && !message.isDeleted"
              class="italic opacity-75"
            >
              (edited)
            </span>
            <span v-if="message.failed" class="text-red-300 font-medium">
              Failed
              <span v-if="message.retryCount && message.retryCount > 0">
                ({{ message.retryCount }})
              </span>
            </span>
          </div>

          <div class="flex items-center space-x-1">
            <span class="opacity-75">{{ formattedTimestamp }}</span>

            <!-- Status icons for current user messages -->
            <div
              v-if="message.isCurrentUser && !message.isDeleted"
              class="flex items-center ml-1"
            >
              <Icon
                v-if="message.pending"
                name="lucide:clock"
                class="h-3 w-3 opacity-75"
              />
              <div
                v-else-if="message.retrying"
                class="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent opacity-75"
              ></div>
              <Icon
                v-else-if="message.failed"
                name="lucide:alert-triangle"
                class="h-3 w-3 text-red-300"
              />
              <Icon
                v-else-if="message.read"
                name="lucide:check-check"
                class="h-3 w-3 text-blue-300"
              />
              <Icon
                v-else-if="message.delivered"
                name="lucide:check"
                class="h-3 w-3 opacity-75"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { formatMessageTimestamp } from "~/utils/timestampHelper";
import { formatFileSize } from "~/utils/fileUploadHelper";
import { useFiles } from "~/composables/useFiles";
import ImageWithRetry from "./ImageWithRetry.vue";

// Define props interface
interface ChatAreaItemProps {
  showSenderName?: boolean; // New prop for explicitly controlling sender name visibility
  message: {
    id: string;
    message_id?: string;
    sender_id?: string;
    recipient_id?: string;
    receiver_id?: string;
    chat_room_id?: string;
    conversation_id?: string;
    room_id?: string;
    content: string;
    timestamp?: string;
    raw_timestamp?: string;
    sent_at?: string;
    created_at: string;
    updated_at?: string;
    type?: string;
    isCurrentUser: boolean;
    read?: boolean;
    is_read?: boolean;
    isEdited?: boolean;
    isDeleted?: boolean;
    is_deleted?: boolean;
    pending?: boolean;
    failed?: boolean;
    retrying?: boolean;
    delivered?: boolean;
    isGroupMessage?: boolean;
    attachment?: {
      type?: "image" | "file" | "video" | "audio"; // Match React interface but keep flexibility
      url: string;
      name: string;
      size?: string;
      isOptimistic?: boolean;
      mediaType?: string; // Additional field for detailed media type
    };
    sender?: {
      id: string;
      name: string;
      avatar_url?: string | null;
    };
    errorMessage?: string;
    retryCount?: number;
    fromWebSocket?: boolean;
    receivedViaWebSocket?: boolean;
    sourceApi?: boolean;
    recipient?: any;
    sent?: boolean;
    message_type?: string;
  };
  recipient: {
    id: string;
    name: string;
    avatar?: string;
    profile_picture_url?: string;
  };
  showAvatar?: boolean;
  isGrouped?: boolean;
}

// Define props
const props = withDefaults(defineProps<ChatAreaItemProps>(), {
  showAvatar: true,
  isGrouped: false,
  showSenderName: false, // Default is false, parent can set to true for group chats
});

// Flag to determine if the message is in a group chat context
const isGroupChat = computed(() => {
  // Check for group-related properties that indicate this is a group message
  return (
    props.message.isGroupMessage === true ||
    !!props.message.sender ||
    !!props.message.chat_room_id ||
    !!props.message.room_id ||
    !!props.message.conversation_id
  );
});

// Define emits
const emit = defineEmits<{
  retryClick: [message: any];
  editClick: [messageId: string];
  deleteClick: [messageId: string];
}>();

// Composables
const { downloadFile } = useFiles();
const { $toast } = useNuxtApp();

// Local state for dropdown and downloading
const showActions = ref(false);
const isDownloading = ref(false);
const dropdownRef = ref<HTMLDivElement | null>(null);
// Debug logging for message positioning
console.log("[ChatAreaItem] Rendering message:", {
  messageId: props.message.id,
  content: props.message.content?.substring(0, 20),
  isCurrentUser: props.message.isCurrentUser,
  sender_id: props.message.sender_id,
  positioning: props.message.isCurrentUser ? "right" : "left",
});

// Computed properties
const senderName = computed(() => {
  return props.message.isCurrentUser
    ? "You"
    : props.message.sender?.name || props.recipient.name || "Unknown";
});

const senderAvatar = computed(() => {
  if (props.message.isCurrentUser) return null;
  return (
    props.message.sender?.avatar_url ||
    props.recipient.profile_picture_url ||
    props.recipient.avatar
  );
});

// Validate and potentially fix avatar URL
const validatedAvatar = computed(() => {
  const avatarUrl = senderAvatar.value;
  if (!avatarUrl) return null;

  // Check if it's a data URL
  if (avatarUrl.startsWith("data:")) {
    // Check size limit (most browsers support up to 2MB for data URLs)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (avatarUrl.length > maxSize) {
      console.warn(
        "[ChatAreaItem] Avatar too large:",
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
        "[ChatAreaItem] Invalid data URL format:",
        avatarUrl.substring(0, 100)
      );
      return null;
    }
  }

  return avatarUrl;
});

// Debug logging for avatar
if (!props.message.isCurrentUser) {
  console.log("[ChatAreaItem] Avatar debug for message:", {
    messageId: props.message.id,
    senderName: senderName.value,
    senderAvatar: validatedAvatar.value
      ? validatedAvatar.value.substring(0, 50) + "..."
      : null,
    avatarLength: validatedAvatar.value?.length || 0,
    isDataUrl: validatedAvatar.value?.startsWith("data:") || false,
    isBase64: validatedAvatar.value?.includes("base64") || false,
    messageData: {
      sender: props.message.sender,
      senderAvatarUrl: props.message.sender?.avatar_url,
    },
    recipientData: {
      profile_picture_url: props.recipient.profile_picture_url
        ? props.recipient.profile_picture_url.substring(0, 50) + "..."
        : null,
      avatar: props.recipient.avatar
        ? props.recipient.avatar.substring(0, 50) + "..."
        : null,
    },
  });
}

const showActionsButton = computed(() => {
  return (
    props.message.isCurrentUser &&
    !props.message.isDeleted &&
    !props.message.pending &&
    !props.message.failed &&
    !props.message.retrying
  );
});

const formattedTimestamp = computed(() => {
  return (
    formatMessageTimestamp({
      timestamp: props.message.timestamp,
      raw_timestamp: props.message.raw_timestamp,
      created_at: props.message.created_at,
      sent_at: props.message.sent_at,
      format: "time",
    }) || "No Time"
  );
});

// Determine attachment type automatically
const attachmentType = computed(() => {
  if (!props.message.attachment?.url) return null;

  // Check if the type is explicitly set
  if (props.message.attachment.type) return props.message.attachment.type;

  // Check if mediaType is set
  if (props.message.attachment.mediaType) {
    if (props.message.attachment.mediaType.startsWith("image/")) return "image";
    if (props.message.attachment.mediaType.startsWith("video/")) return "video";
    if (props.message.attachment.mediaType.startsWith("audio/")) return "audio";
    return "file";
  }

  // Detect from extension
  const url = props.message.attachment.url;
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
    ".svg",
  ];
  const audioExtensions = [".mp3", ".wav", ".ogg", ".m4a"];
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi"];

  if (imageExtensions.some((ext) => url.toLowerCase().endsWith(ext)))
    return "image";
  if (audioExtensions.some((ext) => url.toLowerCase().endsWith(ext)))
    return "audio";
  if (videoExtensions.some((ext) => url.toLowerCase().endsWith(ext)))
    return "video";

  return "file";
});

const bubbleClasses = computed(() => {
  const baseClasses =
    "rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 relative group shadow-sm transition-all duration-200 hover:shadow-md";

  return `${baseClasses} ${getBubbleClasses()}`;
});

// Methods
const getBubbleClasses = () => {
  if (props.message.isCurrentUser) {
    if (props.message.isDeleted) {
      return "bg-gray-200 text-gray-500 italic";
    } else if (props.message.failed) {
      return "bg-red-100 text-red-800 border border-red-300 cursor-pointer hover:bg-red-200";
    } else {
      return "bg-blue-500 text-white hover:bg-blue-600";
    }
  } else {
    return "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50";
  }
};

const toggleActions = (e: Event) => {
  e.stopPropagation();
  showActions.value = !showActions.value;
};

const handleEditClick = () => {
  showActions.value = false;
  emit("editClick", props.message.id);
};

const handleDeleteClick = () => {
  showActions.value = false;
  emit("deleteClick", props.message.id);
};

const handleRetryClick = () => {
  emit("retryClick", props.message);
};

// Enhanced file download with retry for expired URLs
const handleDownloadFile = async (
  e: Event,
  fileUrl: string,
  fileName: string
) => {
  e.preventDefault();
  e.stopPropagation();

  // Extract file ID from URL
  let fileId = "";
  if (fileUrl.includes("/api/proxy/files/")) {
    const urlParts = fileUrl.split("/");
    fileId = urlParts[urlParts.length - 1];
  } else {
    $toast?.error("Invalid file URL");
    return;
  }

  try {
    isDownloading.value = true;
    await downloadFile(fileId);
    $toast?.success(`Downloading ${fileName}...`);
  } catch (error) {
    console.error("Download failed:", error);

    // Check if URL might be expired and try to refresh
    const isExpiredUrl =
      fileUrl.includes("X-Amz-Expires") || fileUrl.includes("X-Amz-Date");

    if (isExpiredUrl) {
      try {
        // Try to get fresh URL from message data
        const response = await $fetch(`/api/proxy/message/${props.message.id}`);
        if (response && response.attachment && response.attachment.url) {
          // Extract new file ID and retry download
          const newFileUrl = response.attachment.url;
          if (newFileUrl.includes("/api/proxy/files/")) {
            const newUrlParts = newFileUrl.split("/");
            const newFileId = newUrlParts[newUrlParts.length - 1];
            await downloadFile(newFileId);
            $toast?.success(`Downloading ${fileName}...`);
            return;
          }
        }
      } catch (refreshError) {
        console.error("Failed to refresh URL:", refreshError);
      }
    }

    $toast?.error("Failed to download file. URL mungkin sudah kadaluarsa.");
  } finally {
    isDownloading.value = false;
  }
};

const openMediaPreview = (e: Event) => {
  e.stopPropagation();

  // Skip preview if message is still pending
  if (props.message.pending) {
    $toast?.info("Media is still uploading...");
    return;
  }

  // Don't open preview for optimistic media that aren't yet uploaded
  if (props.message.attachment?.isOptimistic) {
    $toast?.info("Media is being processed...");
    return;
  }

  if (props.message.attachment?.url) {
    // Check if it's a local blob URL (shouldn't be opened in a new tab)
    if (props.message.attachment.url.startsWith("blob:")) {
      $toast?.info("Preview will be available after upload completes");
      return;
    }

    // Open in new tab for preview
    window.open(props.message.attachment.url, "_blank");
  }
};

// Alias for backward compatibility
const openImagePreview = openMediaPreview;

const handleImageError = (e: Event) => {
  console.error("Image failed to load:", props.message.attachment?.url);
  (e.currentTarget as HTMLElement).style.display = "none";
};

// Handler for media errors (video/audio)
const handleMediaError = (e: Event) => {
  console.error("Media failed to load:", props.message.attachment?.url);

  // Replace with a message instead of hiding
  const mediaElement = e.currentTarget as HTMLElement;
  const errorMsg = document.createElement("div");
  errorMsg.className = "text-xs text-red-500 p-2";
  errorMsg.textContent = "Failed to load media file";

  // Replace the media element with the error message
  if (mediaElement.parentNode) {
    mediaElement.parentNode.replaceChild(errorMsg, mediaElement);
  }
};

// Get appropriate icon based on file extension
const getFileIcon = (filename: string): string => {
  if (!filename) return "lucide:file";

  const extension = filename.split(".").pop()?.toLowerCase() || "";

  // Document types
  if (["pdf"].includes(extension)) return "lucide:file-text";
  if (["doc", "docx", "rtf"].includes(extension)) return "lucide:file-text";
  if (["xls", "xlsx", "csv"].includes(extension))
    return "lucide:file-spreadsheet";
  if (["ppt", "pptx"].includes(extension)) return "lucide:file-presentation";

  // Image types (fallback for images not rendered as images)
  if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extension))
    return "lucide:image";

  // Archive types
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension))
    return "lucide:folder-archive";

  // Code types
  if (
    [
      "js",
      "ts",
      "py",
      "java",
      "html",
      "css",
      "jsx",
      "tsx",
      "php",
      "rb",
    ].includes(extension)
  )
    return "lucide:code";

  // Default
  return "lucide:file";
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showActions.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style scoped>
/* Enhanced hover effects */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Smooth animations */
.animate-in {
  animation-name: animate-in;
  animation-duration: 0.15s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-fill-mode: both;
}

.slide-in-from-top-2 {
  --tw-enter-translate-y: -0.5rem;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translate3d(0, var(--tw-enter-translate-y, 0), 0)
      scale3d(
        var(--tw-enter-scale, 1),
        var(--tw-enter-scale, 1),
        var(--tw-enter-scale, 1)
      )
      rotate(var(--tw-enter-rotate, 0));
  }
}

/* File attachment hover effects */
.file-attachment:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Message bubble improvements */
.message-bubble {
  backdrop-filter: blur(10px);
}

/* Loading spinner improvements */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Improved text selection */
.message-content {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

/* Better focus styles */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth transitions for all interactive elements */
button {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive improvements */
@media (max-width: 640px) {
  .message-bubble {
    max-width: calc(100vw - 4rem);
  }
}
</style>
