<template>
  <div
    :key="message.id"
    class="flex mb-3 sm:mb-4"
    :class="isDefinitelyCurrentUser ? 'justify-end' : 'justify-start'"
    :data-message-id="message.id"
    :data-is-current="isDefinitelyCurrentUser ? 'true' : 'false'"
  >
    <!-- Avatar for other users -->
    <div v-if="!isDefinitelyCurrentUser" class="mr-2 sm:mr-3">
      <div
        class="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center"
      >
        <img
          v-if="message.sender?.avatar_url"
          :src="message.sender.avatar_url"
          :alt="message.sender?.name || 'User'"
          class="h-full w-full object-cover"
          @error="handleAvatarError"
        />
        <Icon
          v-else
          name="fa:user"
          class="h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
        />
      </div>
    </div>

    <div class="flex flex-col max-w-[85%] sm:max-w-[75%] lg:max-w-[70%]">
      <!-- Sender name -->
      <div
        class="text-xs sm:text-sm text-gray-600 mb-1"
        :class="isDefinitelyCurrentUser ? 'self-end' : 'ml-1'"
      >
        {{
          isDefinitelyCurrentUser
            ? "You"
            : message.sender?.name || "Unknown User"
        }}
      </div>

      <!-- Message bubble -->
      <div
        class="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 relative group shadow-sm transition-all duration-200"
        :class="getBubbleClasses"
        @click="handleBubbleClick"
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
            class="text-white hover:text-blue-200 p-1.5 rounded-full focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-20 hover:bg-opacity-40 touch-manipulation"
          >
            <Icon name="fa:ellipsis-v" class="h-3 w-3" />
          </button>

          <!-- Dropdown menu -->
          <div
            v-if="showActions"
            class="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div class="py-1">
              <button
                @click="handleEditClick"
                class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
              >
                <Icon name="fa:pencil" class="mr-2 text-xs" /> Edit
              </button>
              <button
                @click="handleDeleteClick"
                class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
              >
                <Icon name="fa:trash" class="mr-2 text-xs" /> Unsend
              </button>
            </div>
          </div>
        </div>

        <!-- Status indicators -->
        <div
          v-if="message.pending"
          class="absolute top-1 right-1 sm:top-0 sm:right-0 sm:-mt-1 sm:-mr-1"
        >
          <div
            class="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-blue-500 border-t-transparent"
          ></div>
        </div>

        <div
          v-if="message.retrying"
          class="absolute top-1 right-1 sm:top-0 sm:right-0 sm:-mt-1 sm:-mr-1"
        >
          <div
            class="animate-pulse rounded-full h-3 w-3 sm:h-4 sm:w-4 bg-yellow-500"
          ></div>
        </div>

        <!-- Attachment display -->
        <div v-if="message.attachment" class="mb-1">
          <ImageWithRetry
            v-if="message.attachment.type === 'image'"
            :src="message.attachment.url"
            :alt="message.attachment.name"
            :message-id="message.id"
            class="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity max-h-48 sm:max-h-56"
            @click="handleImageClick"
          />
          <button
            v-else
            @click="handleFileDownload"
            :disabled="isDownloading"
            class="text-blue-500 hover:underline flex items-center space-x-1 transition-colors p-1.5 bg-gray-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-xs"
            :title="`Download ${message.attachment.name}`"
          >
            <div
              v-if="isDownloading"
              class="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"
            />
            <Icon v-else name="fa:file" class="text-gray-500 text-xs h-3 w-3" />
            <span class="text-xs truncate max-w-28 sm:max-w-32">
              {{ message.attachment.name }}
            </span>
            <Icon
              v-if="!isDownloading"
              name="fa:download"
              class="text-gray-400 text-xs h-2.5 w-2.5"
            />
          </button>
        </div>

        <!-- Message content -->
        <p
          class="text-sm sm:text-base break-words whitespace-pre-wrap leading-relaxed"
        >
          {{ message.isDeleted ? "This message was deleted" : message.content }}
        </p>

        <!-- Timestamp and status indicators -->
        <div class="flex items-center justify-end space-x-1 mt-1 sm:mt-2">
          <span
            v-if="message.isEdited && !message.isDeleted"
            class="text-xs opacity-75"
            >(edited)</span
          >
          <span v-if="message.failed" class="text-xs text-red-600 font-medium"
            >Failed</span
          >

          <span class="text-xs opacity-75">
            {{ formatTimestamp(message.timestamp) }}
          </span>

          <!-- Status icons for current user messages -->
          <div v-if="isDefinitelyCurrentUser" class="ml-1">
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
              name="fa:exclamation-triangle"
              class="h-3 w-3 text-red-300"
            />
            <Icon
              v-else-if="
                !message.pending &&
                !message.failed &&
                !message.retrying &&
                message.delivered
              "
              name="fa:check"
              class="h-3 w-3 opacity-75"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useNuxtApp } from "#app";
import { formatMessageTimestamp } from "~/utils/timestampHelper";
import { useFiles } from "~/composables/useFiles";
import ImageWithRetry from "./ImageWithRetry.vue";

// Interface for message props
interface MessageItemProps {
  message: {
    id: string;
    content: string;
    sender?: {
      id: string;
      name: string;
      avatar_url?: string | null;
    };
    timestamp: string;
    isCurrentUser: boolean;
    isEdited?: boolean;
    isDeleted?: boolean;
    attachment?: {
      type: "image" | "file";
      url: string;
      name: string;
      size?: string;
    };
    pending?: boolean;
    failed?: boolean;
    retrying?: boolean;
    delivered?: boolean;
    _isOptimisticMessage?: boolean;
  };
}

// Props and emits
const props = defineProps<MessageItemProps>();

const emit = defineEmits<{
  editClick: [messageId: string];
  deleteClick: [messageId: string];
  retryClick: [messageId: string];
}>();

// Composables
const { $toast } = useNuxtApp();
const { downloadFile } = useFiles();

// State
const showActions = ref(false);
const isDownloading = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// Enhanced logic to determine if message is from current user
const isDefinitelyCurrentUser = computed(() => {
  return (
    props.message.isCurrentUser === true ||
    props.message.sender?.name === "You" ||
    props.message._isOptimisticMessage === true ||
    props.message.id?.startsWith("temp-")
  );
});

// Show actions button condition
const showActionsButton = computed(() => {
  return (
    isDefinitelyCurrentUser.value &&
    !props.message.isDeleted &&
    !props.message.pending &&
    !props.message.failed &&
    !props.message.retrying
  );
});

// Bubble classes based on message state
const getBubbleClasses = computed(() => {
  if (props.message.isDeleted) {
    return "bg-gray-200 text-gray-500 italic";
  }

  if (isDefinitelyCurrentUser.value) {
    if (props.message.failed) {
      return "bg-red-100 text-red-800 border border-red-300 cursor-pointer hover:bg-red-200";
    }
    return "bg-blue-500 text-white";
  }

  return "bg-white border border-gray-200 text-gray-800 hover:shadow-md";
});

// Event handlers
const handleBubbleClick = () => {
  if (props.message.failed) {
    emit("retryClick", props.message.id);
  }
};

const toggleActions = (e: MouseEvent) => {
  e.stopPropagation();
  showActions.value = !showActions.value;
};

const handleEditClick = () => {
  emit("editClick", props.message.id);
  showActions.value = false;
};

const handleDeleteClick = async () => {
  // Show confirmation
  const shouldDelete = await showDeleteConfirmation();
  if (!shouldDelete) return;

  emit("deleteClick", props.message.id);
  showActions.value = false;
};

const handleFileDownload = async (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (!props.message.attachment) return;

  const { url, name } = props.message.attachment;

  // Extract file ID from URL
  let fileId = "";
  if (url.includes("/api/proxy/files/")) {
    const urlParts = url.split("/");
    fileId = urlParts[urlParts.length - 1];
  } else {
    if ($toast) {
      $toast.error("Invalid file URL");
    }
    return;
  }

  try {
    isDownloading.value = true;
    await downloadFile(fileId);
    // Remove success toast - downloading is already obvious to user
  } catch (error) {
    // Check if URL might be expired and try to refresh
    const isExpiredUrl =
      url.includes("X-Amz-Expires") || url.includes("X-Amz-Date");

    if (isExpiredUrl) {
      try {
        // Try to get fresh URL from message data
        const response = await fetch(`/api/proxy/message/${props.message.id}`);
        if (response.ok) {
          const messageData = await response.json();
          if (messageData.attachment && messageData.attachment.url) {
            // Extract new file ID and retry download
            const newFileUrl = messageData.attachment.url;
            if (newFileUrl.includes("/api/proxy/files/")) {
              const newUrlParts = newFileUrl.split("/");
              const newFileId = newUrlParts[newUrlParts.length - 1];
              await downloadFile(newFileId);
              // Remove success toast - downloading is already obvious to user
              return;
            }
          }
        }
      } catch (refreshError) {
        console.error("Failed to refresh URL:", refreshError);
      }
    }

    if ($toast) {
      $toast.error("Failed to download file. URL might be expired.");
    }
  } finally {
    isDownloading.value = false;
  }
};

const handleImageClick = (e: MouseEvent) => {
  e.stopPropagation();
  if (props.message.attachment?.url) {
    window.open(props.message.attachment.url, "_blank");
  }
};

const handleAvatarError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.style.display = "none";
  // Show fallback icon
  const nextElement = target.nextElementSibling as HTMLElement;
  if (nextElement) {
    nextElement.classList.remove("hidden");
  }
};

// Show delete confirmation using confirm dialog
const showDeleteConfirmation = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const result = confirm(
      "Are you sure you want to delete this message? This action cannot be undone."
    );
    resolve(result);
  });
};

// Format timestamp for display
const formatTimestamp = (dateString?: string): string => {
  if (!dateString) return "No Time";

  return (
    formatMessageTimestamp({
      timestamp: dateString,
      raw_timestamp: dateString,
      created_at: dateString,
      sent_at: dateString,
      format: "time",
    }) || "No Time"
  );
};

// Handle clicking outside to close dropdown
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
/* Enhanced transitions and hover effects */
.message-wrapper {
  transition: all 0.2s ease-in-out;
}

.message-wrapper:hover {
  transform: translateX(4px);
}

/* Smooth opacity transitions for action buttons */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
