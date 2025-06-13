<template>
  <div
    :class="`flex ${
      message.isCurrentUser ? 'justify-end' : 'justify-start'
    } mb-4`"
    :data-message-id="message.id"
    :data-sender-id="message.sender_id"
    :data-recipient-id="message.recipient_id || message.receiver_id"
    :data-is-current-user="message.isCurrentUser"
    :data-positioning="message.isCurrentUser ? 'right' : 'left'"
  >
    <!-- Avatar for other users -->
    <div v-if="!message.isCurrentUser" class="mr-2">
      <div
        class="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center"
      >
        <img
          v-if="validatedAvatar"
          :src="validatedAvatar"
          :alt="senderName"
          class="h-full w-full object-cover"
          @error="handleAvatarError"
        />
        <Icon v-else name="fa:user" class="h-5 w-5 text-gray-500" />
      </div>
    </div>

    <div class="flex flex-col max-w-[70%]">
      <!-- Sender name -->
      <div
        :class="`text-xs text-gray-600 mb-1 ${
          message.isCurrentUser ? 'self-end' : 'ml-1'
        }`"
      >
        {{ senderName }}
      </div>

      <!-- Message bubble -->
      <div
        :class="`rounded-lg px-4 py-2 relative group ${getBubbleClasses()}`"
        @click="message.failed ? handleRetryClick() : undefined"
        :title="
          message.failed ? 'Click to retry sending this message' : undefined
        "
      >
        <!-- Message actions dropdown for current user's messages -->
        <div
          v-if="showActionsButton"
          class="absolute top-0 right-0 -mt-1 -mr-1"
          ref="dropdownRef"
        >
          <button
            @click="toggleActions"
            class="text-gray-600 hover:text-gray-800 p-1 rounded-full focus:outline-none opacity-70 hover:opacity-100 transition-opacity"
          >
            <Icon name="fa:ellipsis-v" class="h-3 w-3" />
          </button>

          <!-- Dropdown menu -->
          <div
            v-if="showActions"
            class="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-50 border border-gray-200"
          >
            <div class="py-1">
              <button
                @click="handleEditClick"
                class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Icon name="lucide:edit-2" class="mr-2" /> Edit
              </button>
              <button
                @click="handleDeleteClick"
                class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Icon name="lucide:trash" class="mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Status indicators -->
        <div
          v-if="message.pending"
          class="absolute top-0 right-0 -mt-1 -mr-1"
        >
          <div
            class="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"
          ></div>
        </div>

        <div
          v-if="message.retrying"
          class="absolute top-0 right-0 -mt-1 -mr-1"
        >
          <div class="animate-pulse rounded-full h-3 w-3 bg-yellow-500"></div>
        </div>

        <!-- Attachment display -->
        <div v-if="message.attachment" class="mb-2">
          <img
            v-if="message.attachment.type === 'image'"
            :src="message.attachment.url"
            :alt="message.attachment.name"
            class="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
            @click="openImagePreview"
            @error="handleImageError"
          />
          <a
            v-else
            :href="message.attachment.url"
            :download="message.attachment.name"
            class="text-blue-500 hover:underline flex items-center space-x-2 transition-colors"
            @click.stop
          >
            <Icon name="fa:file" class="text-gray-600" />
            <span class="text-sm ml-1">
              {{ message.attachment.name }}
              <span v-if="message.attachment.size">
                ({{ message.attachment.size }})
              </span>
            </span>
          </a>
        </div>

        <!-- Message content -->
        <div>
          <p class="text-sm break-words whitespace-pre-wrap">
            {{
              message.isDeleted
                ? "This message was deleted"
                : message.content || "(No message content)"
            }}
          </p>

          <!-- Error message for failed messages -->
          <p
            v-if="message.failed && message.errorMessage"
            class="text-xs text-red-300 mt-1 italic"
          >
            {{ message.errorMessage }}
          </p>
        </div>

        <!-- Timestamp and status indicators -->
        <div class="flex items-center justify-end space-x-1 mt-1">
          <span
            v-if="message.isEdited && !message.isDeleted"
            class="text-xs opacity-75"
          >
            (edited)
          </span>

          <span
            v-if="message.failed"
            class="text-xs text-red-600 font-medium"
          >
            Failed
            <span v-if="message.retryCount && message.retryCount > 0">
              ({{ message.retryCount }})
            </span>
          </span>

          <span class="text-xs opacity-75">
            {{ formattedTimestamp }}
          </span>

          <!-- Status icons for current user messages -->
          <div v-if="message.isCurrentUser" class="ml-1">
            <Icon
              v-if="message.pending"
              name="fa:clock"
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
              v-else-if="!message.pending && !message.failed && !message.retrying && message.delivered"
              name="fa:check"
              class="h-3 w-3 opacity-75"
            />
            <Icon
              v-else-if="!message.pending && !message.failed && !message.retrying && message.read"
              name="fa:check"
              class="h-3 w-3 opacity-75 text-blue-300"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { formatMessageTimestamp } from "~/utils/timestampHelper";

// Define props interface
interface ChatAreaItemProps {
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
    attachment?: {
      type: "image" | "file";
      url: string;
      name: string;
      size?: string;
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
}

// Define props
const props = defineProps<ChatAreaItemProps>();

// Define emits
const emit = defineEmits<{
  retryClick: [message: any];
  editClick: [messageId: string];
  deleteClick: [messageId: string];
}>();

// Local state for dropdown
const showActions = ref(false);
const dropdownRef = ref<HTMLDivElement | null>(null);

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
    const dataUrlRegex = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/;
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

// Methods
const getBubbleClasses = () => {
  const baseClasses = "min-w-[80px]";
  
  if (props.message.isCurrentUser) {
    if (props.message.isDeleted) {
      return `${baseClasses} bg-gray-200 text-gray-500 italic`;
    } else if (props.message.failed) {
      return `${baseClasses} bg-red-100 text-red-800 border border-red-300 cursor-pointer hover:bg-red-200`;
    } else {
      return `${baseClasses} bg-blue-500 text-white`;
    }
  } else {
    return `${baseClasses} bg-white border border-gray-200 text-gray-800`;
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

const openImagePreview = (e: Event) => {
  e.stopPropagation();
  if (props.message.attachment?.url) {
    window.open(props.message.attachment.url, "_blank");
  }
};

const handleAvatarError = (e: Event) => {
  console.warn("[ChatAreaItem] Avatar failed to load");
  // The v-else will handle showing the fallback icon
};

const handleImageError = (e: Event) => {
  console.error("Image failed to load:", props.message.attachment?.url);
  (e.currentTarget as HTMLElement).style.display = "none";
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
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
/* Add any component-specific styles here */
.message:hover {
  background-color: #f1f1f1;
}
</style>