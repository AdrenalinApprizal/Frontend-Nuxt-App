<template>
  <div class="w-80 border-l border-gray-200 bg-white overflow-y-auto h-full flex-shrink-0">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 bg-white shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Profile</h3>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close profile"
        >
          <Icon name="fa:times" class="h-5 w-5" />
        </button>
      </div>

      <div class="flex flex-col items-center">
        <div
          class="h-24 w-24 rounded-full overflow-hidden bg-gray-200 mb-3 flex items-center justify-center ring-2 ring-gray-100"
        >
          <img
            v-if="friendDetails?.avatar || friendDetails?.profile_picture_url"
            :src="friendDetails.avatar || friendDetails.profile_picture_url"
            :alt="friendDetails.name"
            class="h-full w-full object-cover"
          />
          <Icon v-else name="fa:user" class="h-12 w-12 text-gray-400" />
        </div>
        <h2 class="text-black text-xl font-semibold text-center">
          {{ displayName }}
        </h2>
        <p class="text-gray-500 text-sm">
          @{{ friendDetails?.username || friendDetails?.name || "user" }}
        </p>
        <div class="flex items-center space-x-2 mt-2">
          <div
            :class="`w-3 h-3 rounded-full ${
              friendDetails?.status === 'online'
                ? 'bg-green-500'
                : 'bg-gray-400'
            }`"
          />
          <span class="text-sm text-gray-600 capitalize">
            {{ friendDetails?.status || "offline" }}
          </span>
        </div>
      </div>
    </div>

    <!-- Attachments Section -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-black font-medium">
          Attachments
          <span class="text-gray-500 text-sm">({{ attachments.length }})</span>
        </h3>
        <button
          @click="showAttachmentsModal = true"
          class="text-sm text-blue-500 hover:underline"
        >
          View All
        </button>
      </div>

      <!-- Attachments List -->
      <div class="relative">
        <div
          v-if="isLoading"
          class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
        >
          <div
            class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>

        <div
          v-if="attachments.length === 0 && !isLoading"
          class="py-4 text-center text-gray-500"
        >
          No attachments
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="attachment in attachments.slice(0, 5)"
            :key="attachment.file_id"
            class="flex items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            @click="openAttachmentPreview(attachment)"
          >
            <div class="mr-3">
              <div
                v-if="isImage(attachment.mime_type)"
                class="w-10 h-10 rounded-md overflow-hidden bg-gray-200"
              >
                <img
                  :src="attachment.url"
                  :alt="attachment.filename"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center"
              >
                <Icon name="fa:file" class="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div class="flex-grow min-w-0">
              <p class="text-sm font-medium truncate">
                {{ attachment.filename }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatFileSize(attachment.size) }}
              </p>
            </div>
            <div class="ml-2 flex">
              <button
                @click.stop="downloadFile(attachment)"
                class="p-1 text-gray-500 hover:text-blue-500"
                title="Download"
              >
                <Icon name="fa:download" class="h-4 w-4" />
              </button>
              <button
                @click.stop="showShareDialog(attachment)"
                class="p-1 text-gray-500 hover:text-blue-500"
                title="Share"
              >
                <Icon name="fa:share-alt" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Attachments Modal -->
    <div
      v-if="showAttachmentsModal"
      class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="font-medium text-lg">All Attachments</h3>
          <button
            @click="showAttachmentsModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <Icon name="fa:times" class="h-5 w-5" />
          </button>
        </div>

        <div
          class="overflow-y-auto p-4"
          style="max-height: calc(90vh - 8rem)"
        >
          <div v-if="isLoadingMore" class="flex justify-center py-4">
            <div
              class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
            ></div>
          </div>

          <div class="space-y-3">
            <div
              v-for="attachment in attachments"
              :key="attachment.file_id"
              class="flex items-center bg-gray-50 p-3 rounded-md hover:bg-gray-100 cursor-pointer"
              @click="openAttachmentPreview(attachment)"
            >
              <div class="mr-3">
                <div
                  v-if="isImage(attachment.mime_type)"
                  class="w-12 h-12 rounded-md overflow-hidden bg-gray-200"
                >
                  <img
                    :src="attachment.url"
                    :alt="attachment.filename"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center"
                >
                  <Icon name="fa:file" class="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div class="flex-grow min-w-0">
                <p class="text-sm font-medium truncate">
                  {{ attachment.filename }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatFileSize(attachment.size) }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ new Date(attachment.uploaded_at).toLocaleDateString() }}
                </p>
              </div>
              <div class="ml-2 flex">
                <button
                  @click.stop="downloadFile(attachment)"
                  class="p-2 text-gray-500 hover:text-blue-500"
                  title="Download"
                >
                  <Icon name="fa:download" class="h-4 w-4" />
                </button>
                <button
                  @click.stop="showShareDialog(attachment)"
                  class="p-2 text-gray-500 hover:text-blue-500"
                  title="Share"
                >
                  <Icon name="fa:share-alt" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Load more button -->
          <div
            v-if="pagination.has_more_pages"
            class="flex justify-center mt-4"
          >
            <button
              @click="loadMoreAttachments"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
              :disabled="isLoadingMore"
            >
              {{ isLoadingMore ? "Loading..." : "Load More" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Dialog -->
    <div
      v-if="showShareModal"
      class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium text-lg">Share File</h3>
          <button
            @click="closeShareDialog"
            class="text-gray-500 hover:text-gray-700"
          >
            <Icon name="fa:times" class="h-5 w-5" />
          </button>
        </div>

        <div v-if="selectedAttachment" class="mb-4 p-3 bg-gray-50 rounded-md flex items-center">
          <div class="mr-3">
            <div class="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
              <Icon name="fa:file" class="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div>
            <p class="text-sm font-medium">
              {{ selectedAttachment.filename }}
            </p>
            <p class="text-xs text-gray-500">
              {{ formatFileSize(selectedAttachment.size) }}
            </p>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">
            Share with:
          </label>
          <div class="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
            <div
              v-for="friend in friendsList"
              :key="friend.id"
              :class="`flex items-center justify-between p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                friend.shareSelected ? 'bg-blue-50' : ''
              }`"
              @click="toggleShareSelection(friend.id)"
            >
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex items-center justify-center">
                  <img
                    v-if="friend.avatar || friend.profile_picture_url"
                    :src="friend.avatar || friend.profile_picture_url"
                    :alt="friend.name"
                    class="h-full w-full object-cover"
                  />
                  <Icon v-else name="fa:user" class="h-4 w-4 text-gray-500" />
                </div>
                <span class="text-sm">{{ friend.name }}</span>
              </div>
              <div
                v-if="friend.shareSelected"
                class="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center"
              >
                <Icon name="fa:check" class="h-2 w-2 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            @click="handleShareFile"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            :disabled="!friendsList.some((friend) => friend.shareSelected)"
          >
            Share
          </button>
        </div>
      </div>
    </div>

    <!-- Attachment Preview Modal -->
    <div
      v-if="showPreview && selectedAttachment"
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
    >
      <div class="relative w-full max-w-4xl">
        <button
          @click="closeAttachmentPreview"
          class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <Icon name="fa:times" class="h-6 w-6" />
        </button>

        <div class="flex flex-col items-center">
          <img
            v-if="isImage(selectedAttachment.mime_type)"
            :src="selectedAttachment.url"
            :alt="selectedAttachment.filename"
            class="max-h-[80vh] max-w-full object-contain"
          />
          <div
            v-else
            class="bg-white rounded-lg p-8 text-center"
          >
            <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Icon name="fa:file" class="h-8 w-8 text-blue-500" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ selectedAttachment.filename }}
            </h3>
            <p class="text-sm text-gray-500 mb-4">
              {{ formatFileSize(selectedAttachment.size) }}
            </p>
            <p class="text-sm text-gray-600">
              This file type cannot be previewed
            </p>
          </div>

          <div class="mt-4 flex justify-center space-x-4">
            <button
              @click="downloadFile(selectedAttachment)"
              class="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center"
            >
              <Icon name="fa:download" class="h-4 w-4 mr-2" />
              Download
            </button>

            <button
              @click="showShareDialog(selectedAttachment)"
              class="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center"
            >
              <Icon name="fa:share-alt" class="h-4 w-4 mr-2" />
              Share
            </button>
          </div>

          <!-- Navigation arrows -->
          <div
            v-if="hasPreviousAttachment"
            class="absolute inset-y-0 left-0 flex items-center"
          >
            <button
              @click="navigateAttachment('prev')"
              class="bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white"
            >
              <Icon name="fa:chevron-left" class="h-6 w-6" />
            </button>
          </div>

          <div
            v-if="hasNextAttachment"
            class="absolute inset-y-0 right-0 flex items-center"
          >
            <button
              @click="navigateAttachment('next')"
              class="bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white"
            >
              <Icon name="fa:chevron-right" class="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useFiles } from "~/composables/useFiles";
import { useNuxtApp } from "#app";
import { useFriendsStore } from "~/composables/useFriends";

interface Friend {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  profile_picture_url?: string;
  avatar?: string;
  shareSelected?: boolean;
  status?: "online" | "offline";
  phone?: string;
  last_seen?: string;
  unread_count?: number;
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}

interface FriendDetails {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: "online" | "offline";
  avatar?: string;
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string;
  username?: string;
  avatar_url?: string;
  display_name?: string;
  full_name?: string;
}

// Updated interface to match API response from message history
interface AttachmentItem {
  file_id: string;
  filename: string;
  size: number;
  mime_type: string;
  url: string;
  uploaded_at: string;
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_more_pages: boolean;
}

const props = defineProps<{
  username?: string;
  friendDetails?: FriendDetails;
}>();

defineEmits(["close"]);

// Composables
const { downloadFile: downloadFileAction, shareFile, formatFileSize } = useFiles();
const { $toast } = useNuxtApp();
const friendsStore = useFriendsStore();

// State management - simplified to single attachments list
const attachments = ref<AttachmentItem[]>([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);

// Modal states
const showAttachmentsModal = ref(false);
const showShareModal = ref(false);
const showPreview = ref(false);

// Selection states
const selectedAttachment = ref<AttachmentItem | null>(null);
const friendsList = ref<Friend[]>([]);

// Pagination states
const currentPage = ref(1);
const pagination = ref<Pagination>({
  current_page: 1,
  total_pages: 1,
  total_items: 0,
  items_per_page: 8,
  has_more_pages: false,
});

// Computed values
const displayName = computed(() => {
  if (!props.friendDetails) return "User";

  return props.friendDetails.first_name && props.friendDetails.last_name
    ? `${props.friendDetails.first_name} ${props.friendDetails.last_name}`
    : props.friendDetails.name;
});

const currentAttachmentIndex = computed(() => {
  if (!selectedAttachment.value) return -1;
  return attachments.value.findIndex(
    (item) => item.file_id === selectedAttachment.value!.file_id
  );
});

const hasPreviousAttachment = computed(() => {
  return currentAttachmentIndex.value > 0;
});

const hasNextAttachment = computed(() => {
  return currentAttachmentIndex.value < attachments.value.length - 1;
});

// Helper function to check if attachment is an image
const isImage = (mimeType: string) => {
  return mimeType.startsWith("image/");
};

// Initialize friends list
watch(() => friendsStore.friends, (friends) => {
  if (friends) {
    friendsList.value = friends.map((friend) => ({
      ...friend,
      name: friend.name || friend.display_name || friend.full_name || 'Unknown User',
      shareSelected: false,
    }));
  }
}, { immediate: true });

// Load data when friend details change
watch(() => props.friendDetails?.id, (friendId) => {
  if (friendId) {
    currentPage.value = 1;
    loadAttachments();
  }
}, { immediate: true });

// Load user attachments from message history
const loadAttachments = async () => {
  if (!props.friendDetails?.id) return;

  try {
    isLoading.value = true;

    // Fetch message history to get attachments
    const response = await fetch(
      `/api/proxy/messages/history?type=private&target_id=${props.friendDetails.id}&limit=100`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Message history response:", data);

    // Extract messages array from response
    let messages = [];
    if (data?.data && Array.isArray(data.data)) {
      messages = data.data;
    } else if (data?.messages && Array.isArray(data.messages)) {
      messages = data.messages;
    } else if (Array.isArray(data)) {
      messages = data;
    }

    // Filter messages that have attachments
    const attachmentMessages = messages.filter(
      (msg: any) => msg.attachment_url && msg.message_type === "file"
    );

    // Convert messages to attachment format
    const attachmentData: AttachmentItem[] = attachmentMessages.map(
      (msg: any) => {
        const filename = msg.content?.replace("📎 ", "") || "Unknown File";

        // Try to determine mime type from filename extension
        let mimeType = "application/octet-stream";
        const extension = filename.split(".").pop()?.toLowerCase();
        if (extension) {
          const imageExtensions = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
            "svg",
          ];
          const documentExtensions = ["pdf", "doc", "docx", "txt"];

          if (imageExtensions.includes(extension)) {
            mimeType = `image/${extension === "jpg" ? "jpeg" : extension}`;
          } else if (documentExtensions.includes(extension)) {
            mimeType =
              extension === "pdf"
                ? "application/pdf"
                : extension === "doc"
                ? "application/msword"
                : extension === "docx"
                ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                : "text/plain";
          }
        }

        return {
          file_id: msg.message_id || msg.id,
          filename: filename,
          size: 0, // Size not available from message history
          mime_type: mimeType,
          url: msg.attachment_url,
          uploaded_at:
            msg.sent_at || msg.created_at || new Date().toISOString(),
        };
      }
    );

    attachments.value = attachmentData;
    console.log("Loaded attachments from messages:", attachmentData);

    // Set basic pagination
    pagination.value = {
      current_page: 1,
      total_pages: 1,
      total_items: attachmentData.length,
      items_per_page: attachmentData.length,
      has_more_pages: false,
    };
    currentPage.value = 1;
  } catch (error) {
    console.error("Error loading attachments from messages:", error);
    // Silently handle error
    attachments.value = []; // Set empty array as fallback
  } finally {
    isLoading.value = false;
  }
};

// Load more attachments - disabled for message history approach
const loadMoreAttachments = async () => {
  // Since we load all attachments from message history in one request,
  // this function is no longer needed but kept for UI compatibility
  console.log("Load more attachments disabled for message history approach");
};

// Download file using attachment URL
const downloadFile = async (attachment: AttachmentItem) => {
  try {
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = attachment.url;
    link.download = attachment.filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    $toast.success("File download started");
  } catch (error) {
    console.error("Error downloading file:", error);
    $toast.error("Failed to download file");
  }
};

// Show share dialog
const showShareDialog = (attachment: AttachmentItem) => {
  selectedAttachment.value = attachment;
  showShareModal.value = true;

  // Reset share selections
  friendsList.value = friendsList.value.map((friend) => ({
    ...friend,
    shareSelected: false,
  }));
};

// Close share dialog
const closeShareDialog = () => {
  showShareModal.value = false;
  selectedAttachment.value = null;
};

// Toggle friend selection in share dialog
const toggleShareSelection = (friendId: string) => {
  friendsList.value = friendsList.value.map((friend) =>
    friend.id === friendId
      ? { ...friend, shareSelected: !friend.shareSelected }
      : friend
  );
};

// Handle sharing file
const handleShareFile = async () => {
  if (!selectedAttachment.value) return;

  const selectedUserIds = friendsList.value
    .filter((friend) => friend.shareSelected)
    .map((friend) => friend.id);

  if (selectedUserIds.length === 0) return;

  try {
    await shareFile(selectedAttachment.value.file_id, selectedUserIds);
    $toast.success("File shared successfully");

    // Reset selection state
    friendsList.value = friendsList.value.map((friend) => ({
      ...friend,
      shareSelected: false,
    }));

    closeShareDialog();
  } catch (error) {
    console.error("Error sharing file:", error);
    // Silently handle error - file service might not be available
  }
};

// Attachment preview functions
const openAttachmentPreview = (attachment: AttachmentItem) => {
  selectedAttachment.value = attachment;
  showPreview.value = true;
};

const closeAttachmentPreview = () => {
  showPreview.value = false;
  selectedAttachment.value = null;
};

const navigateAttachment = (direction: "prev" | "next") => {
  const currentIndex = currentAttachmentIndex.value;
  if (currentIndex === -1) return;

  if (direction === "prev" && currentIndex > 0) {
    selectedAttachment.value = attachments.value[currentIndex - 1];
  } else if (direction === "next" && currentIndex < attachments.value.length - 1) {
    selectedAttachment.value = attachments.value[currentIndex + 1];
  }
};

// Initialize on mount
onMounted(() => {
  // Load friends for sharing functionality
  friendsStore.getFriends();
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
