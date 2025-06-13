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

    <!-- Contact Information -->
    <div v-if="friendDetails?.email" class="p-4 border-b border-gray-200">
      <h3 class="text-gray-700 font-medium mb-3">Contact Information</h3>
      <div class="flex items-center">
        <div
          class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3"
        >
          <Icon name="fa:envelope" class="h-4 w-4 text-blue-500" />
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">Email</p>
          <p class="text-sm text-black">{{ friendDetails.email }}</p>
        </div>
      </div>
    </div>

    <!-- Media Section -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-black font-medium">
          Media
          <span class="text-gray-500 text-sm">({{ userMedia.length }})</span>
        </h3>
        <button
          @click="showMediaModal = true"
          class="text-sm text-blue-500 hover:underline"
        >
          View All
        </button>
      </div>

      <!-- Media Grid -->
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
          v-if="userMedia.length === 0 && !isLoading"
          class="py-4 text-center text-gray-500"
        >
          No media files
        </div>

        <div v-else class="grid grid-cols-3 gap-2">
          <div
            v-for="item in userMedia.slice(0, 3)"
            :key="item.id"
            class="aspect-square bg-gray-200 rounded-md overflow-hidden cursor-pointer relative group"
            @click="openMediaPreview(item)"
          >
            <img
              :src="getThumbnailUrl(item.id)"
              alt=""
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <button
                @click.stop="downloadFile(item.id)"
                class="bg-white text-blue-500 p-2 rounded-full"
              >
                <Icon name="fa:download" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Files Section -->
    <div class="p-4">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-black font-medium">
          Files
          <span class="text-gray-500 text-sm">({{ userFiles.length }})</span>
        </h3>
        <button
          @click="showFilesModal = true"
          class="text-sm text-blue-500 hover:underline"
        >
          View All
        </button>
      </div>

      <!-- File List -->
      <div class="relative">
        <div
          v-if="isLoadingFiles"
          class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
        >
          <div
            class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>

        <div
          v-if="userFiles.length === 0 && !isLoadingFiles"
          class="py-4 text-center text-gray-500"
        >
          No files
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="file in userFiles.slice(0, 3)"
            :key="file.id"
            class="flex items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div class="mr-3">
              <div
                class="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center"
              >
                <Icon name="fa:file" class="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div class="flex-grow min-w-0">
              <p class="text-sm font-medium truncate">{{ file.name }}</p>
              <p class="text-xs text-gray-500">
                {{ formatFileSize(file.size) }}
              </p>
            </div>
            <div class="ml-2 flex">
              <button
                @click.stop="downloadFile(file.id)"
                class="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                title="Download"
              >
                <Icon name="fa:download" class="h-4 w-4" />
              </button>
              <button
                @click.stop="showShareDialog(file)"
                class="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                title="Share"
              >
                <Icon name="fa:share-alt" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Modal -->
    <div
      v-if="showMediaModal"
      class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
    >
      <div
        class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden"
      >
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="font-medium text-lg">Media Files</h3>
          <button
            @click="showMediaModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <Icon name="fa:times" class="h-5 w-5" />
          </button>
        </div>

        <div class="overflow-y-auto p-4" style="max-height: calc(90vh - 8rem)">
          <div v-if="isLoadingMore" class="flex justify-center py-4">
            <div
              class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
            ></div>
          </div>

          <div class="grid grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="item in userMedia"
              :key="item.id"
              class="aspect-square bg-gray-200 rounded-md overflow-hidden cursor-pointer relative group"
              @click="openMediaPreview(item)"
            >
              <img
                :src="getThumbnailUrl(item.id)"
                alt=""
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <button
                  @click.stop="downloadFile(item.id)"
                  class="bg-white text-blue-500 p-2 rounded-full"
                >
                  <Icon name="fa:download" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Load more button -->
          <div
            v-if="mediaPagination.has_more_pages"
            class="flex justify-center mt-4"
          >
            <button
              @click="loadMoreMedia"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              :disabled="isLoadingMore"
            >
              <span v-if="isLoadingMore">Loading...</span>
              <span v-else>Load More</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Files Modal -->
    <div
      v-if="showFilesModal"
      class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
    >
      <div
        class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden"
      >
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="font-medium text-lg">Files</h3>
          <button
            @click="showFilesModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <Icon name="fa:times" class="h-5 w-5" />
          </button>
        </div>

        <div class="overflow-y-auto p-4" style="max-height: calc(90vh - 8rem)">
          <div v-if="isLoadingMoreFiles" class="flex justify-center py-4">
            <div
              class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
            ></div>
          </div>

          <div class="space-y-3">
            <div
              v-for="file in userFiles"
              :key="file.id"
              class="flex items-center bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div class="mr-3">
                <div
                  class="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center"
                >
                  <Icon name="fa:file" class="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div class="flex-grow min-w-0">
                <p class="text-sm font-medium truncate">{{ file.name }}</p>
                <p class="text-xs text-gray-500">
                  {{ formatFileSize(file.size) }}
                </p>
              </div>
              <div class="ml-2 flex">
                <button
                  @click="downloadFile(file.id)"
                  class="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                  title="Download"
                >
                  <Icon name="fa:download" class="h-4 w-4" />
                </button>
                <button
                  @click="showShareDialog(file)"
                  class="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                  title="Share"
                >
                  <Icon name="fa:share-alt" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Load more button -->
          <div
            v-if="filesPagination.has_more_pages"
            class="flex justify-center mt-4"
          >
            <button
              @click="loadMoreFiles"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              :disabled="isLoadingMoreFiles"
            >
              <span v-if="isLoadingMoreFiles">Loading...</span>
              <span v-else>Load More</span>
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

        <div
          v-if="selectedFile"
          class="mb-4 p-3 bg-gray-50 rounded-md flex items-center"
        >
          <div class="mr-3">
            <div
              class="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center"
            >
              <Icon name="fa:file" class="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div>
            <p class="text-sm font-medium">{{ selectedFile.name }}</p>
            <p class="text-xs text-gray-500">
              {{ formatFileSize(selectedFile.size) }}
            </p>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Share with:</label>
          <div
            class="max-h-60 overflow-y-auto border border-gray-200 rounded-lg"
          >
            <div
              v-for="friend in friendsList"
              :key="friend.id"
              :class="`flex items-center justify-between p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                friend.shareSelected ? 'bg-blue-50' : ''
              }`"
              @click="toggleShareSelection(friend.id)"
            >
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex items-center justify-center"
                >
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
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            :disabled="!friendsList.some((friend) => friend.shareSelected)"
          >
            Share
          </button>
        </div>
      </div>
    </div>

    <!-- Media Preview Modal -->
    <div
      v-if="showMediaPreview"
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
    >
      <div class="relative w-full max-w-4xl">
        <button
          @click="closeMediaPreview"
          class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <Icon name="fa:times" class="h-6 w-6" />
        </button>

        <div v-if="selectedMedia" class="flex flex-col items-center">
          <img
            :src="getFileUrl(selectedMedia.id)"
            alt=""
            class="max-h-[80vh] max-w-full object-contain"
          />

          <div class="mt-4 flex justify-center space-x-4">
            <button
              @click="downloadFile(selectedMedia.id)"
              class="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center transition-colors"
            >
              <Icon name="fa:download" class="h-4 w-4 mr-2" />
              Download
            </button>

            <button
              @click="showShareDialog(selectedMedia)"
              class="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center transition-colors"
            >
              <Icon name="fa:share-alt" class="h-4 w-4 mr-2" />
              Share
            </button>
          </div>

          <!-- Navigation arrows for multiple media items -->
          <div
            v-if="hasPreviousMedia"
            class="absolute inset-y-0 left-0 flex items-center"
          >
            <button
              @click="navigateMedia('prev')"
              class="bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white transition-all"
            >
              <Icon name="fa:chevron-left" class="h-6 w-6" />
            </button>
          </div>

          <div
            v-if="hasNextMedia"
            class="absolute inset-y-0 right-0 flex items-center"
          >
            <button
              @click="navigateMedia('next')"
              class="bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white transition-all"
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
import { usePresence } from "~/composables/usePresence";
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

interface MediaItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  thumbnail_url?: string;
}

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
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

// Use the usePresence composable
const presence = usePresence();

// Use friendDetails if available, otherwise fallback to sensible defaults
const displayName = computed(() => {
  if (!props.friendDetails) return "User";

  return props.friendDetails.first_name && props.friendDetails.last_name
    ? `${props.friendDetails.first_name} ${props.friendDetails.last_name}`
    : props.friendDetails.name;
});

// Initialize file service
const {
  userMedia,
  userFiles,
  isLoading,
  error,
  pagination,
  getUserMedia,
  getUserFiles,
  downloadFile: downloadFileAction,
  shareFile,
  getFileUrl,
  getThumbnailUrl,
  formatFileSize,
} = useFiles();

// Additional state
const isLoadingFiles = ref(false);
const isLoadingMore = ref(false);
const isLoadingMoreFiles = ref(false);
const showMediaModal = ref(false);
const showFilesModal = ref(false);
const showShareModal = ref(false);
const showMediaPreview = ref(false);
const selectedFile = ref<any>(null);
const selectedMedia = ref<any>(null);
const currentMediaPage = ref(1);
const currentFilesPage = ref(1);

// Separate pagination for media and files
const mediaPagination = ref<Pagination>({
  current_page: 1,
  total_pages: 1,
  total_items: 0,
  items_per_page: 8,
  has_more_pages: false,
});

const filesPagination = ref<Pagination>({
  current_page: 1,
  total_pages: 1,
  total_items: 0,
  items_per_page: 8,
  has_more_pages: false,
});

const friendsStore = useFriendsStore();
// Create a reactive friend list state
const friendsList = ref<Friend[]>([]);

// Watch for changes in friends store and update local state
watch(
  () => friendsStore.friends,
  (newFriends) => {
    friendsList.value = newFriends.map((friend) => ({
      ...friend,
      shareSelected: false,
    }));
  },
  { immediate: true }
);

const { $toast } = useNuxtApp();

// Media preview navigation computation
const currentMediaIndex = computed(() => {
  if (!selectedMedia.value) return -1;
  return userMedia.findIndex((item) => item.id === selectedMedia.value.id);
});

const hasPreviousMedia = computed(() => {
  return currentMediaIndex.value > 0;
});

const hasNextMedia = computed(() => {
  return currentMediaIndex.value < userMedia.length - 1;
});

// Load media and files on mount
onMounted(async () => {
  if (props.friendDetails?.id) {
    await loadUserMedia();
    await loadUserFiles();
  }
});

// Watch for changes in friend details to reload data
watch(
  () => props.friendDetails?.id,
  async (newId) => {
    if (newId) {
      // Reset pages
      currentMediaPage.value = 1;
      currentFilesPage.value = 1;

      // Load media and files simultaneously
      await Promise.all([loadUserMedia(), loadUserFiles()]);
    }
  },
  { immediate: true }
);

// Create a function to reload data that can be called after sending files
async function refreshMediaAndFiles() {
  if (props.friendDetails?.id) {
    await Promise.all([loadUserMedia(), loadUserFiles()]);
  }
}

// Expose the refresh function to parent component
defineExpose({
  refreshData: refreshMediaAndFiles,
});

// Toggle friend selection in the Share dialog
const toggleShareSelection = (id: string) => {
  friendsList.value = friendsList.value.map((friend: Friend) =>
    friend.id === id
      ? { ...friend, shareSelected: !friend.shareSelected }
      : friend
  );
};

// Handle sharing a file with selected users
const handleShareFile = async () => {
  if (!selectedFile.value) return;

  const selectedUserIds = friendsList.value
    .filter((friend) => friend.shareSelected)
    .map((friend) => friend.id);

  if (selectedUserIds.length === 0) return;

  try {
    await shareFileWithUsers({
      fileId: selectedFile.value.id,
      userIds: selectedUserIds,
    });

    // Reset selection state
    friendsList.value = friendsList.value.map((friend) => ({
      ...friend,
      shareSelected: false,
    }));

    closeShareDialog();
  } catch (error) {
    console.error("Error sharing file:", error);
  }
};

// Load user media files
async function loadUserMedia() {
  try {
    if (props.friendDetails?.id) {
      const response = await getUserMedia(props.friendDetails.id, "all", 1, 8);
      currentMediaPage.value = 1;
      
      // Update media pagination
      if (response?.pagination) {
        mediaPagination.value = response.pagination;
      }
    }
  } catch (err) {
    console.error("Error loading media:", err);
    // Error is already handled in useFiles composable
  }
}

// Load more media
async function loadMoreMedia() {
  try {
    if (!props.friendDetails?.id || isLoadingMore.value) return;

    isLoadingMore.value = true;
    currentMediaPage.value++;

    const response = await getUserMedia(
      props.friendDetails.id,
      "all",
      currentMediaPage.value,
      8
    );

    // Update media pagination
    if (response?.pagination) {
      mediaPagination.value = response.pagination;
    }
  } catch (err) {
    console.error("Error loading more media:", err);
    if ($toast) {
      $toast.error("Failed to load more media");
    }
  } finally {
    isLoadingMore.value = false;
  }
}

// Load user files
async function loadUserFiles() {
  try {
    if (props.friendDetails?.id) {
      isLoadingFiles.value = true;
      const response = await getUserFiles(props.friendDetails.id, 1, 8);

      // Store files pagination separately
      if (response?.pagination) {
        filesPagination.value = response.pagination;
      }

      currentFilesPage.value = 1;
    }
  } catch (err) {
    console.error("Error loading files:", err);
  } finally {
    isLoadingFiles.value = false;
  }
}

// Load more files
async function loadMoreFiles() {
  try {
    if (!props.friendDetails?.id || isLoadingMoreFiles.value) return;

    isLoadingMoreFiles.value = true;
    currentFilesPage.value++;

    const response = await getUserFiles(
      props.friendDetails.id,
      currentFilesPage.value,
      8
    );

    // Update files pagination
    if (response?.pagination) {
      filesPagination.value = response.pagination;
    }
  } catch (err) {
    console.error("Error loading more files:", err);
    if ($toast) {
      $toast.error("Failed to load more files");
    }
  } finally {
    isLoadingMoreFiles.value = false;
  }
}

// Download file
async function downloadFile(fileId: string) {
  try {
    await downloadFileAction(fileId);
    if ($toast) {
      $toast.success("File download started");
    }
  } catch (err) {
    console.error("Error downloading file:", err);
    if ($toast) {
      $toast.error("Failed to download file");
    }
  }
}

// Show share dialog
function showShareDialog(file: any) {
  selectedFile.value = file;
  showShareModal.value = true;

  // Reset share selections
  friendsList.value = friendsList.value.map((friend) => ({
    ...friend,
    shareSelected: false,
  }));
}

// Close share dialog
function closeShareDialog() {
  showShareModal.value = false;
  selectedFile.value = null;
}

// Share file with users
async function shareFileWithUsers(data: { fileId: string; userIds: string[] }) {
  try {
    await shareFile(data.fileId, data.userIds);
    if ($toast) {
      $toast.success("File shared successfully");
    }
  } catch (err) {
    console.error("Error sharing file:", err);
    if ($toast) {
      $toast.error("Failed to share file");
    }
  }
}

// Media preview functionality
function openMediaPreview(media: any) {
  selectedMedia.value = media;
  showMediaPreview.value = true;
}

function closeMediaPreview() {
  showMediaPreview.value = false;
  selectedMedia.value = null;
}

function navigateMedia(direction: "prev" | "next") {
  const currentIndex = currentMediaIndex.value;
  if (currentIndex === -1) return;

  if (direction === "prev" && currentIndex > 0) {
    selectedMedia.value = userMedia[currentIndex - 1];
  } else if (direction === "next" && currentIndex < userMedia.length - 1) {
    selectedMedia.value = userMedia[currentIndex + 1];
  }
}
</script>

<style scoped>
/* Enable text truncation for long URLs */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2; /* Adding standard line-clamp property for compatibility */
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 1; /* Adding standard line-clamp property for compatibility */
}
</style>
