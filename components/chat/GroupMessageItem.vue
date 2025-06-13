<template>
  <div
    :key="message.id"
    :class="`flex ${
      isDefinitelyCurrentUser ? 'justify-end' : 'justify-start'
    } mb-4`"
    :data-message-id="message.id"
    :data-is-current="isDefinitelyCurrentUser ? 'true' : 'false'"
  >
    <!-- Avatar for other users -->
    <div v-if="!isDefinitelyCurrentUser" class="mr-2">
      <div
        class="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center"
      >
        <OptimizedAvatar
          v-if="message.sender?.avatar"
          :src="message.sender.avatar"
          :alt="message.sender?.name || 'User'"
          size="md"
        />
        <Icon v-else name="fa:user" class="h-5 w-5 text-gray-500" />
      </div>
    </div>

    <div class="flex flex-col max-w-[70%]">
      <!-- Sender name with enhanced styling -->
      <div
        :class="`text-xs text-gray-600 mb-1 ${
          isDefinitelyCurrentUser ? 'self-end' : 'ml-1'
        }`"
      >
        {{ isDefinitelyCurrentUser ? "You" : message.sender?.name }}
      </div>

      <!-- Message bubble with enhanced interactions -->
      <div
        :class="`rounded-lg px-4 py-2 relative group ${
          isDefinitelyCurrentUser
            ? message.isDeleted
              ? 'bg-gray-200 text-gray-500 italic'
              : message.failed
              ? 'bg-red-100 text-red-800 border border-red-300 cursor-pointer hover:bg-red-200'
              : 'bg-blue-500 text-white'
            : 'bg-white border border-gray-200 text-gray-800'
        }`"
        @click="
          message.failed && onRetryClick
            ? onRetryClick(message.id)
            : undefined
        "
        :title="
          message.failed ? 'Click to retry sending this message' : undefined
        "
      >
        <!-- Message actions dropdown for current user's messages -->
        <div
          v-if="
            isDefinitelyCurrentUser &&
            !message.isDeleted &&
            !message.pending &&
            !message.failed &&
            !message.retrying
          "
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
                <Icon name="fa:pencil-alt" class="mr-2" /> Edit
              </button>
              <button
                @click="handleDeleteClick"
                class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Icon name="fa:trash" class="mr-2" /> Unsend
              </button>
            </div>
          </div>
        </div>

        <!-- Status indicators -->
        <div v-if="message.pending" class="absolute top-0 right-0 -mt-1 -mr-1">
          <div
            class="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"
          ></div>
        </div>

        <div v-if="message.retrying" class="absolute top-0 right-0 -mt-1 -mr-1">
          <div class="animate-pulse rounded-full h-3 w-3 bg-yellow-500"></div>
        </div>

        <!-- Attachment display -->
        <div v-if="message.attachment" class="mb-2">
          <img
            v-if="message.attachment.type === 'image'"
            :src="message.attachment.url"
            :alt="message.attachment.name"
            class="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
            @click="openImageModal"
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
        <p class="text-sm break-words whitespace-pre-wrap">
          {{
            message.isDeleted ? "This message was deleted" : message.content
          }}
        </p>

        <!-- Timestamp and status indicators -->
        <div class="flex items-center justify-end space-x-1 mt-1">
          <span v-if="message.isEdited && !message.isDeleted" class="text-xs opacity-75">
            (edited)
          </span>

          <span v-if="message.failed" class="text-xs text-red-600 font-medium">
            Failed
          </span>

          <span class="text-xs opacity-75">
            {{ formatTimestamp(message.timestamp) }}
          </span>

          <!-- Enhanced status icons for current user messages -->
          <div v-if="isDefinitelyCurrentUser" class="ml-1">
            <Icon
              v-if="message.pending"
              name="fa:clock"
              class="h-3 w-3 opacity-75"
            />
            <div
              v-if="message.retrying"
              class="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent opacity-75"
            ></div>
            <Icon
              v-if="message.failed"
              name="fa:exclamation-triangle"
              class="h-3 w-3 text-red-300"
            />
            <Icon
              v-if="
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
import { formatMessageTimestamp } from "~/utils/timestampHelper";

interface MessageAttachment {
  type: "image" | "file";
  url: string;
  name: string;
  size?: string;
}

interface MessageSender {
  id: string;
  name: string;
  avatar?: string | null;
}

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
  _isOptimisticMessage?: boolean;
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

// State for showing/hiding message actions menu
const showActions = ref(false);

// Ref for dropdown to handle outside clicks
const dropdownRef = ref<HTMLElement | null>(null);

// CRITICAL FIX: Enhanced logic to determine if message is from current user
const isDefinitelyCurrentUser = computed(() => {
  return (
    props.message.isCurrentUser === true ||
    props.message.sender.name === "You" ||
    props.message._isOptimisticMessage === true ||
    props.message.id?.startsWith("temp-")
  );
});

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

// Format timestamp for display
const formatTimestamp = (timestamp: string): string => {
  if (!timestamp) return "";
  return formatMessageTimestamp({ timestamp, format: "time" });
};

// Handle edit button click
const handleEditClick = () => {
  emit("editClick", props.message.id);
  showActions.value = false;
};

// Handle delete button click with confirmation
const handleDeleteClick = async () => {
  const { $toast } = useNuxtApp();
  
  // Show confirmation using a simple confirm for now
  // You could implement a more sophisticated modal here
  const shouldDelete = confirm(
    "Are you sure you want to delete this message? This action cannot be undone."
  );

  if (!shouldDelete) return;

  emit("deleteClick", props.message.id);
  showActions.value = false;
};

// Toggle actions menu
const toggleActions = (e: Event) => {
  e.stopPropagation();
  showActions.value = !showActions.value;
};

// Handle image modal opening
const openImageModal = (e: Event) => {
  e.stopPropagation();
  if (props.message.attachment?.url) {
    window.open(props.message.attachment.url, "_blank");
  }
};

// Handle image loading errors
const handleImageError = (e: Event) => {
  console.error(
    "Image failed to load:",
    props.message.attachment?.url
  );
  const target = e.target as HTMLImageElement;
  target.style.display = "none";
};

// Handle clicking outside to close dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    showActions.value = false;
  }
};

// Retry click handler
const onRetryClick = (messageId: string) => {
  emit("retryClick", messageId);
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
/* Custom styles for message animations and interactions */
.group:hover .opacity-0 {
  opacity: 0.7;
}

.group:hover .opacity-0:hover {
  opacity: 1;
}

/* Ensure proper image sizing */
img {
  max-width: 100%;
  height: auto;
}

/* Smooth transitions for all interactive elements */
.transition-opacity {
  transition: opacity 0.2s ease-in-out;
}

.transition-colors {
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
}
</style>