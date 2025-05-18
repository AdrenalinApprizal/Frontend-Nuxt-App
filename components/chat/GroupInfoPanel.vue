<template>
  <div class="w-80 border-l border-gray-200 bg-white overflow-y-auto h-full">
    <div class="p-4 border-b border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <div></div>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700"
        >
          <Icon name="fa:times" class="h-5 w-5" />
        </button>
      </div>

      <div class="flex flex-col items-center">
        <div
          class="h-24 w-24 rounded-full overflow-hidden bg-gray-200 mb-3 flex items-center justify-center"
        >
          <img
            v-if="groupDetails.avatar"
            :src="groupDetails.avatar"
            :alt="groupDetails.name"
            class="h-full w-full object-cover"
          />
          <Icon v-else name="fa:users" class="h-12 w-12 text-gray-400" />
        </div>
        <h2 class="text-xl text-black font-semibold">{{ groupName }}</h2>
        <p class="text-gray-500 text-sm">{{ groupDetails.description }}</p>
      </div>
    </div>

    <!-- Members Section -->
    <div class="border-b border-gray-200">
      <div
        class="p-4 flex justify-between items-center cursor-pointer"
        @click="
          expandedSection = expandedSection === 'members' ? null : 'members'
        "
      >
        <div class="flex items-center">
          <h3 class="font-medium text-black">
            Members
            <span class="text-gray-500">
              ({{ groupDetails.memberCount }})
            </span>
          </h3>
        </div>
        <div class="text-gray-500 text-sm">
          {{ expandedSection === "members" ? "▲" : "▼" }}
        </div>
      </div>

      <div v-if="expandedSection === 'members'" class="px-4 pb-4">
        <p v-if="blockedMembersCount > 0" class="text-xs text-red-500 mb-3">
          {{ blockedMembersCount }} person{{
            blockedMembersCount > 1 ? "s" : ""
          }}
          blocked
        </p>

        <button
          @click="showAddMemberPopup = true"
          class="mb-4 flex items-center text-blue-500 hover:text-blue-600 text-sm"
        >
          <div
            class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2"
          >
            <Icon name="fa:user-plus" class="h-4 w-4" />
          </div>
          Add Member
        </button>

        <div class="space-y-3">
          <div
            v-for="member in membersWithStatus"
            :key="member.id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center">
              <div class="relative mr-2">
                <div
                  class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
                >
                  <img
                    v-if="member.avatar"
                    :src="member.avatar"
                    :alt="member.name"
                    class="w-full h-full object-cover"
                  />
                  <Icon v-else name="fa:user" class="h-4 w-4 text-gray-500" />
                </div>
                <!-- Status indicator -->
                <div
                  :class="`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white ${
                    member.presenceStatus === 'online'
                      ? 'bg-green-500'
                      : member.presenceStatus === 'busy'
                      ? 'bg-red-500'
                      : member.presenceStatus === 'away'
                      ? 'bg-yellow-500'
                      : 'bg-gray-400'
                  }`"
                ></div>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-black">{{ member.name }}</span>
                <span
                  class="text-xs text-gray-500"
                  v-if="member.presenceStatus !== 'online'"
                >
                  {{ member.lastActive }}
                </span>
                <span class="text-xs text-green-500" v-else> Online </span>
                <div
                  v-if="member.isBlocked"
                  class="ml-2 text-red-500"
                  title="Blocked user"
                >
                  <Icon name="fa:ban" class="h-3 w-3" />
                </div>
              </div>
            </div>
            <div class="relative">
              <button
                class="text-gray-400 hover:text-gray-600"
                @click.stop="toggleMemberDropdown(member.id)"
              >
                <Icon name="fa:ellipsis-v" class="h-3 w-3" />
              </button>
              <div
                v-if="activeDropdown === member.id"
                ref="dropdownRef"
                class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10"
              >
                <button
                  class="flex w-full text-left px-4 py-2 text-sm hover:bg-gray-100 items-center"
                  @click="
                    member.isBlocked
                      ? handleUnblockMember(member.id)
                      : handleBlockMember(member.id)
                  "
                >
                  <template v-if="member.isBlocked">
                    <Icon name="lucide:user-minus" class="inline-block mr-2" />
                    <span class="text-green-600"> Unblock User </span>
                  </template>
                  <template v-else>
                    <Icon
                      name="fa:ban"
                      class="text-red-600 inline-block mr-2"
                    />
                    <span class="text-red-600">Block User</span>
                  </template>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Section -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-medium text-black">
          Media
          <span class="text-gray-500 text-sm">({{ groupMedia.length }})</span>
        </h3>
        <button
          @click="showMediaModal = true"
          class="text-sm text-blue-500 hover:underline"
        >
          View All
        </button>
      </div>

      <!-- Media Grid (Inline implementation) -->
      <div class="relative">
        <div
          v-if="isLoadingMedia"
          class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
        >
          <div
            class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>

        <div
          v-if="groupMedia.length === 0 && !isLoadingMedia"
          class="py-4 text-center text-gray-500"
        >
          No media files
        </div>

        <div v-else class="grid grid-cols-3 gap-2">
          <div
            v-for="(item, index) in groupMedia.slice(0, 3)"
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
          File
          <span class="text-gray-500 text-sm">({{ groupFiles.length }})</span>
        </h3>
        <button
          @click="showFilesModal = true"
          class="text-sm text-blue-500 hover:underline"
        >
          View All
        </button>
      </div>

      <!-- File List (Inline implementation) -->
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
          v-if="groupFiles.length === 0 && !isLoadingFiles"
          class="py-4 text-center text-gray-500"
        >
          No files
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="file in groupFiles.slice(0, 3)"
            :key="file.id"
            class="flex items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100"
          >
            <div class="mr-3">
              <div
                class="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center"
              >
                <Icon name="fa:file" class="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div class="flex-grow min-w-0">
              <p class="text-sm font-medium line-clamp-1">{{ file.name }}</p>
              <p class="text-xs text-gray-500">
                {{ formatFileSize(file.size) }}
              </p>
            </div>
            <div class="ml-2 flex">
              <button
                @click.stop="downloadFile(file.id)"
                class="p-1 text-gray-500 hover:text-blue-500"
                title="Download"
              >
                <Icon name="fa:download" class="h-4 w-4" />
              </button>
              <button
                @click.stop="showShareDialog(file)"
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

    <!-- Add Member Popup -->
    <div
      v-if="showAddMemberPopup"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white rounded-lg p-5 max-w-md w-full shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-black">Add Members</h2>
          <button
            @click="showAddMemberPopup = false"
            class="p-1 rounded-full hover:bg-gray-100"
          >
            <Icon name="lucide:x" class="text-gray-500" size="20" />
          </button>
        </div>

        <div class="relative mb-4">
          <Icon
            name="lucide:search"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size="18"
          />
          <input
            type="text"
            placeholder="Search friends..."
            v-model="searchQuery"
            class="w-full pl-10 pr-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div
          class="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded-lg"
        >
          <div
            v-if="filteredFriends.length === 0"
            class="p-4 text-center text-gray-500"
          >
            No friends found
          </div>
          <div
            v-else
            v-for="friend in filteredFriends"
            :key="friend.id"
            :class="`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 ${
              friend.selected ? 'bg-blue-50' : ''
            }`"
            @click="toggleFriendSelection(friend.id)"
          >
            <div class="flex items-center">
              <div
                class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex items-center justify-center"
              >
                <img
                  v-if="friend.avatar"
                  :src="friend.avatar"
                  :alt="friend.name"
                  class="h-full w-full object-cover"
                />
                <Icon v-else name="fa:user" class="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p class="font-medium text-sm text-black">{{ friend.name }}</p>
                <p class="text-gray-700 text-xs">@{{ friend.username }}</p>
              </div>
            </div>
            <div
              v-if="friend.selected"
              class="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center"
            >
              <Icon name="fa:check" class="h-3 w-3 text-white" />
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-2">
          <button
            @click="showAddMemberPopup = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleAddMembers"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            :disabled="!friends.some((friend) => friend.selected)"
          >
            Add to Group
          </button>
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
          <div v-if="isLoadingMoreMedia" class="flex justify-center py-4">
            <div
              class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
            ></div>
          </div>

          <div class="grid grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="item in groupMedia"
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
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              :disabled="isLoadingMoreMedia"
            >
              <span v-if="isLoadingMoreMedia">Loading...</span>
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

          <!-- Inline file list for modal -->
          <div class="space-y-3">
            <div
              v-for="file in groupFiles"
              :key="file.id"
              class="flex items-center bg-gray-50 p-3 rounded-md hover:bg-gray-100"
            >
              <div class="mr-3">
                <div
                  class="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center"
                >
                  <Icon name="fa:file" class="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div class="flex-grow min-w-0">
                <p class="text-sm font-medium line-clamp-1">{{ file.name }}</p>
                <p class="text-xs text-gray-500">
                  {{ formatFileSize(file.size) }}
                </p>
              </div>
              <div class="ml-2 flex">
                <button
                  @click="downloadFile(file.id)"
                  class="p-2 text-gray-500 hover:text-blue-500"
                  title="Download"
                >
                  <Icon name="fa:download" class="h-4 w-4" />
                </button>
                <button
                  @click="showShareDialog(file)"
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
            v-if="filesPagination.has_more_pages"
            class="flex justify-center mt-4"
          >
            <button
              @click="loadMoreFiles"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
              v-for="friend in friends"
              :key="friend.id"
              :class="`flex items-center justify-between p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                friend.shareSelected ? 'bg-blue-50' : ''
              }`"
              @click="toggleShareSelection(friend.id)"
            >
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex items-center justify-center"
                >
                  <img
                    v-if="friend.avatar"
                    :src="friend.avatar"
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
            :disabled="!friends.some((friend) => friend.shareSelected)"
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
              class="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <Icon name="fa:download" class="h-4 w-4 mr-2" />
              Download
            </button>

            <button
              @click="showShareDialog(selectedMedia)"
              class="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              <Icon name="fa:share-alt" class="h-4 w-4 mr-2" />
              Share
            </button>
          </div>

          <!-- Navigation arrows for multiple media items -->
          <div class="absolute inset-y-0 left-0 flex items-center">
            <button
              v-if="hasPreviousMedia"
              @click="navigateMedia('prev')"
              class="bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white"
            >
              <Icon name="fa:chevron-left" class="h-6 w-6" />
            </button>
          </div>

          <div class="absolute inset-y-0 right-0 flex items-center">
            <button
              v-if="hasNextMedia"
              @click="navigateMedia('next')"
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useFiles } from "~/composables/useFiles";
import { useNuxtApp } from "#app";
import { useGroupsStore } from "~/composables/useGroups";
import { usePresence } from "~/composables/usePresence"; // Tambahkan presence service

interface GroupMember {
  id: string;
  name: string;
  status: "online" | "offline";
  role: "admin" | "member";
  avatar?: string;
  isBlocked?: boolean;
  user_id?: string; // Added user_id property
}

interface GroupDetails {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  memberCount: number;
  members: GroupMember[];
  avatar?: string;
}

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  selected?: boolean;
  shareSelected?: boolean;
}

const props = defineProps<{
  groupName: string;
  groupDetails: GroupDetails;
}>();

defineEmits(["close"]);

const expandedSection = ref<string | null>("members");
const showAddMemberPopup = ref(false);
const searchQuery = ref("");
const activeDropdown = ref<string | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);

// Calculate blocked members count
const blockedMembersCount = computed(
  () => props.groupDetails.members.filter((member) => member.isBlocked).length
);

// Initialize file service
const {
  groupMedia,
  groupFiles,
  isLoading: isLoadingService,
  error,
  pagination,
  getGroupMedia,
  getGroupFiles,
  downloadFile: downloadFileAction,
  shareFile,
  getFileUrl,
  getThumbnailUrl,
  formatFileSize,
} = useFiles();

// Initialize useGroupsStore
const groupsStore = useGroupsStore();

// Additional state for files
const isLoadingMedia = ref(false);
const isLoadingFiles = ref(false);
const isLoadingMoreMedia = ref(false);
const isLoadingMoreFiles = ref(false);
const showMediaModal = ref(false);
const showFilesModal = ref(false);
const showShareModal = ref(false);
const showMediaPreview = ref(false);
const selectedFile = ref<any>(null);
const selectedMedia = ref<any>(null);
const currentMediaPage = ref(1);
const currentFilesPage = ref(1);
const mediaPagination = ref({
  current_page: 1,
  total_pages: 1,
  total_items: 0,
  items_per_page: 20,
  has_more_pages: false,
});
const filesPagination = ref({
  current_page: 1,
  total_pages: 1,
  total_items: 0,
  items_per_page: 20,
  has_more_pages: false,
});

const { $toast } = useNuxtApp();

// Mock friends data
const friends = ref<Friend[]>([
  {
    id: "101",
    name: "Rudi Setiawan",
    username: "rudi",
    avatar: undefined,
    selected: false,
    shareSelected: false,
  },
  {
    id: "102",
    name: "Lina Kartika",
    username: "lina",
    avatar: undefined,
    selected: false,
    shareSelected: false,
  },
  {
    id: "103",
    name: "Budi Santoso",
    username: "budi",
    avatar: undefined,
    selected: false,
    shareSelected: false,
  },
  {
    id: "104",
    name: "Ratna Dewi",
    username: "ratna",
    avatar: undefined,
    selected: false,
    shareSelected: false,
  },
  {
    id: "105",
    name: "Dimas Prasetyo",
    username: "dimas",
    avatar: undefined,
    selected: false,
    shareSelected: false,
  },
]);

// Filtered friends based on search query
const filteredFriends = computed(() => {
  return friends.value.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Media preview navigation computation
const currentMediaIndex = computed(() => {
  if (!selectedMedia.value) return -1;
  return groupMedia.findIndex(
    (item: any) => item.id === selectedMedia.value.id
  );
});

const hasPreviousMedia = computed(() => {
  return currentMediaIndex.value > 0;
});

const hasNextMedia = computed(() => {
  return currentMediaIndex.value < groupMedia.length - 1;
});

// Load media and files on mount
onMounted(async () => {
  if (props.groupDetails?.id) {
    await loadGroupMedia();
    await loadGroupFiles();
  }
  document.addEventListener("mousedown", handleClickOutside);
});

// Watch for changes in group ID to reload data
watch(
  () => props.groupDetails?.id,
  async (newId) => {
    if (newId) {
      // Reset pagination pages
      currentMediaPage.value = 1;
      currentFilesPage.value = 1;

      // Load media and files simultaneously for better performance
      await Promise.all([loadGroupMedia(), loadGroupFiles()]);
    }
  },
  { immediate: true }
);

// Create a function to refresh data that can be called after sending files in GroupChatArea
async function refreshMediaAndFiles() {
  if (props.groupDetails?.id) {
    await Promise.all([loadGroupMedia(), loadGroupFiles()]);
  }
}

// Expose the refresh function to parent components
defineExpose({
  refreshData: refreshMediaAndFiles,
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

// Toggle member dropdown menu
const toggleMemberDropdown = (memberId: string) => {
  activeDropdown.value = activeDropdown.value === memberId ? null : memberId;
};

// Handle blocking a member
const handleBlockMember = async (memberId: string) => {
  try {
    // Call the API to block the user
    await groupsStore.blockGroupUser(props.groupDetails.id, memberId);

    // Update local state
    const updatedMembers = props.groupDetails.members.map((member) =>
      member.id === memberId ? { ...member, isBlocked: true } : member
    );

    // Show success notification
    if ($toast) {
      $toast.success("User blocked successfully");
    }

    // Close the dropdown
    activeDropdown.value = null;
  } catch (error: any) {
    console.error("Error blocking user:", error);
    if ($toast) {
      $toast.error(error.message || "Failed to block user");
    }
  }
};

// Handle unblocking a member
const handleUnblockMember = async (memberId: string) => {
  try {
    // Call the API to unblock the user
    await groupsStore.unblockGroupUser(props.groupDetails.id, memberId);

    // Update local state
    const updatedMembers = props.groupDetails.members.map((member) =>
      member.id === memberId ? { ...member, isBlocked: false } : member
    );

    // Show success notification
    if ($toast) {
      $toast.success("User unblocked successfully");
    }

    // Close the dropdown
    activeDropdown.value = null;
  } catch (error: any) {
    console.error("Error unblocking user:", error);
    if ($toast) {
      $toast.error(error.message || "Failed to unblock user");
    }
  }
};

// Toggle friend selection in the Add Members popup
const toggleFriendSelection = (id: string) => {
  friends.value = friends.value.map((friend) =>
    friend.id === id ? { ...friend, selected: !friend.selected } : friend
  );
};

// Toggle friend selection in the Share dialog
const toggleShareSelection = (id: string) => {
  friends.value = friends.value.map((friend) =>
    friend.id === id
      ? { ...friend, shareSelected: !friend.shareSelected }
      : friend
  );
};

// Handle adding members to the group
const handleAddMembers = () => {
  showAddMemberPopup.value = false;
  searchQuery.value = "";

  // In a real app, this would call an API
  // For now, we'll just log and give user feedback
  console.log(
    "Members added to group:",
    friends.value.filter((f: Friend) => f.selected).map((f: Friend) => f.name)
  );

  // Reset selection state
  friends.value = friends.value.map((friend) => ({
    ...friend,
    selected: false,
  }));

  // Show success notification
  if ($toast) {
    $toast.success("Members have been invited to the group!");
  } else {
    alert("Members have been invited to the group!");
  }
};

// Handle sharing a file with selected users
const handleShareFile = async () => {
  if (!selectedFile.value) return;

  const selectedUserIds = friends.value
    .filter((friend) => friend.shareSelected)
    .map((friend) => friend.id);

  if (selectedUserIds.length === 0) return;

  try {
    await shareFileWithUsers({
      fileId: selectedFile.value.id,
      userIds: selectedUserIds,
    });

    // Reset selection state
    friends.value = friends.value.map((friend) => ({
      ...friend,
      shareSelected: false,
    }));

    closeShareDialog();
  } catch (error) {
    console.error("Error sharing file:", error);
  }
};

// Handle clicks outside of dropdown menu
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    activeDropdown.value = null;
  }
};

// Load group media files
async function loadGroupMedia() {
  try {
    if (props.groupDetails?.id) {
      isLoadingMedia.value = true;
      const response = await getGroupMedia(props.groupDetails.id, "all", 1, 8);

      // Store media pagination
      if (response?.pagination) {
        mediaPagination.value = response.pagination;
      }

      currentMediaPage.value = 1;
    }
  } catch (err) {
    console.error("Error loading group media:", err);
  } finally {
    isLoadingMedia.value = false;
  }
}

// Load more media
async function loadMoreMedia() {
  try {
    if (!props.groupDetails?.id || isLoadingMoreMedia.value) return;

    isLoadingMoreMedia.value = true;
    currentMediaPage.value++;

    const response = await getGroupMedia(
      props.groupDetails.id,
      "all",
      currentMediaPage.value,
      8
    );

    // Update media pagination
    if (response?.pagination) {
      mediaPagination.value = response.pagination;
    }
  } catch (err) {
    console.error("Error loading more group media:", err);
    if ($toast) {
      $toast.error("Failed to load more media");
    }
  } finally {
    isLoadingMoreMedia.value = false;
  }
}

// Load group files
async function loadGroupFiles() {
  try {
    if (props.groupDetails?.id) {
      isLoadingFiles.value = true;
      const response = await getGroupFiles(props.groupDetails.id, 1, 8);

      // Store files pagination
      if (response?.pagination) {
        filesPagination.value = response.pagination;
      }

      currentFilesPage.value = 1;
    }
  } catch (err) {
    console.error("Error loading group files:", err);
  } finally {
    isLoadingFiles.value = false;
  }
}

// Load more files
async function loadMoreFiles() {
  try {
    if (!props.groupDetails?.id || isLoadingMoreFiles.value) return;

    isLoadingMoreFiles.value = true;
    currentFilesPage.value++;

    const response = await getGroupFiles(
      props.groupDetails.id,
      currentFilesPage.value,
      8
    );

    // Update files pagination
    if (response?.pagination) {
      filesPagination.value = response.pagination;
    }
  } catch (err) {
    console.error("Error loading more group files:", err);
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
  friends.value = friends.value.map((friend) => ({
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
    selectedMedia.value = groupMedia[currentIndex - 1];
  } else if (direction === "next" && currentIndex < groupMedia.length - 1) {
    selectedMedia.value = groupMedia[currentIndex + 1];
  }
}

// Initialize presence service
const presence = usePresence();

// Fungsi untuk mendapatkan status anggota
function getMemberStatus(
  userId: string
): "online" | "offline" | "busy" | "away" {
  return presence.getStatus(userId) || "offline";
}

// Fungsi untuk format waktu terakhir online
function formatLastActive(userId: string): string {
  const lastActive = presence.getLastActive(userId);
  if (!lastActive) return "Tidak tersedia";

  try {
    const lastActiveDate = new Date(lastActive);
    // Basic format distance implementation
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - lastActiveDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return "Baru saja";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;

    return lastActiveDate.toLocaleDateString();
  } catch (e) {
    return "Tidak tersedia";
  }
}

// Anggota grup dengan status kehadiran
const membersWithStatus = computed(() => {
  if (!props.groupDetails || !props.groupDetails.members) return [];

  return props.groupDetails.members.map((member) => {
    // Add a non-null assertion or provide a default string value
    const userId = member.id || member.user_id || ""; // Default to empty string if both are undefined
    const status = getMemberStatus(userId);
    const lastActive = formatLastActive(userId);

    return {
      ...member,
      presenceStatus: status,
      lastActive,
    };
  });
});
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
