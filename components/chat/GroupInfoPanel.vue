<template>
  <div class="w-80 h-full border-l border-gray-200 bg-white overflow-y-auto shadow-lg">
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
            v-if="groupDetails.avatar_url"
            :src="groupDetails.avatar_url"
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
        <!-- Blocked members warning -->
        <div
          v-if="blockedMembersCount > 0"
          class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <div class="flex items-center text-red-700">
            <Icon name="fa:ban" class="h-4 w-4 mr-2" />
            <span class="text-sm font-medium">
              {{ blockedMembersCount }} member{{
                blockedMembersCount > 1 ? "s" : ""
              }}
              blocked
            </span>
          </div>
          <p class="text-xs text-red-600 mt-1">
            Blocked members cannot send or receive messages in this group
          </p>
        </div>

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
            :class="`flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
              member.isBlocked
                ? 'bg-red-50 border border-red-200'
                : 'hover:bg-gray-50'
            }`"
          >
            <div class="flex items-center">
              <div class="relative mr-3">
                <div
                  :class="`w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${
                    member.isBlocked ? 'opacity-60 grayscale' : ''
                  }`"
                >
                  <img
                    v-if="member.avatar"
                    :src="member.avatar"
                    :alt="member.name"
                    class="w-full h-full object-cover"
                  />
                  <Icon v-else name="fa:user" class="h-4 w-4 text-gray-500" />
                </div>

                <!-- Blocked indicator overlay -->
                <div
                  v-if="member.isBlocked"
                  class="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-20 rounded-full"
                >
                  <Icon name="fa:ban" class="h-3 w-3 text-red-600" />
                </div>

                <!-- Status indicator - only show if not blocked -->
                <div
                  v-if="!member.isBlocked"
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
                <div class="flex items-center gap-2">
                  <span
                    :class="`text-sm font-medium ${
                      member.isBlocked
                        ? 'text-gray-500 line-through'
                        : 'text-black'
                    }`"
                  >
                    {{ member.name }}
                  </span>
                  <span
                    v-if="member.isBlocked"
                    class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium"
                  >
                    Blocked
                  </span>
                </div>

                <div v-if="!member.isBlocked">
                  <span
                    v-if="member.presenceStatus === 'online'"
                    class="text-xs text-green-500 font-medium"
                  >
                    Online
                  </span>
                  <span v-else class="text-xs text-gray-500">
                    {{ member.lastActive }}
                  </span>
                </div>

                <span
                  v-if="member.isBlocked"
                  class="text-xs text-red-500"
                >
                  User blocked • Cannot receive messages
                </span>
              </div>
            </div>
            <div class="relative">
              <button
                :class="`p-1 rounded-full transition-colors ${
                  member.isBlocked
                    ? 'text-red-400 hover:text-red-600 hover:bg-red-100'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`"
                @click.stop="toggleMemberDropdown(member.id)"
              >
                <Icon name="fa:ellipsis-v" class="h-3 w-3" />
              </button>

              <div
                v-if="activeDropdown === member.id"
                ref="dropdownRef"
                class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden"
              >
                <button
                  :class="`flex w-full text-left px-4 py-3 text-sm items-center transition-colors ${
                    member.isBlocked
                      ? 'hover:bg-green-50 text-green-700'
                      : 'hover:bg-red-50 text-red-700'
                  }`"
                  @click="
                    member.isBlocked
                      ? handleUnblockMember(member.id)
                      : handleBlockMember(member.id)
                  "
                  :disabled="isLoading"
                >
                  <Icon
                    v-if="member.isBlocked"
                    name="fa:check"
                    class="mr-3 h-4 w-4 text-green-600"
                  />
                  <Icon
                    v-else
                    name="fa:ban"
                    class="mr-3 h-4 w-4 text-red-600"
                  />
                  <div class="flex flex-col">
                    <span
                      :class="`font-medium ${
                        member.isBlocked ? 'text-green-700' : 'text-red-700'
                      }`"
                    >
                      {{ member.isBlocked ? "Unblock User" : "Block User" }}
                    </span>
                    <span
                      :class="`text-xs ${
                        member.isBlocked ? 'text-green-600' : 'text-red-600'
                      }`"
                    >
                      {{
                        member.isBlocked
                          ? "Allow messages again"
                          : "Stop receiving messages"
                      }}
                    </span>
                  </div>

                  <div v-if="isLoading" class="ml-auto">
                    <div
                      class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50"
                    ></div>
                  </div>
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
          v-if="hasNoMedia && !isLoadingMedia"
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
          v-if="hasNoFiles && !isLoadingFiles"
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
            :disabled="!friends.some((friend: Member) => friend.selected)"
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
              v-for="item in groupMediaRef"
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
            :disabled="!friends.some((friend: Member) => friend.shareSelected)"
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
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useFiles } from "~/composables/useFiles";
import { useGroupsStore } from "~/composables/useGroups";
import { useAuthStore } from "~/composables/useAuth";
import { usePresence } from "~/composables/usePresence";
import { useNuxtApp } from "#app";

type PresenceStatus = "online" | "offline";

interface Member {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  username?: string;
  // Processed name fields from extractMemberName function
  extracted_name?: string;
  display_name?: string;
  status: PresenceStatus;
  role: "admin" | "member";
  avatar?: string;
  avatar_url?: string;
  profile_picture_url?: string;
  isBlocked?: boolean;
  user_id: string;
  email?: string;
  selected?: boolean;
  shareSelected?: boolean;
  is_owner?: boolean;
  joined_at?: string;
}

interface GroupDetails {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  avatar?: string;
  avatar_url?: string;
  members: Member[];
}

interface MediaItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  shared_with?: string[];
  conversation_id?: string;
  message_id?: string;
}

interface FileItem {
  id: string;
  name: string;
  size: number;
  url: string;
  shared_with?: string[];
}

interface PaginationResponse {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_more_pages: boolean;
}

// Props and emits
const props = defineProps<{
  groupDetails: GroupDetails;
}>();

const emit = defineEmits(["update:group", "close"]);

// Services
const { $toast } = useNuxtApp();
const presence = usePresence();
const groupsStore = useGroupsStore();
const authStore = useAuthStore();
const {
  getGroupMedia,
  getGroupFiles,
  downloadFile: downloadFileAction,
  shareFile,
  formatFileSize,
} = useFiles();

// State management
const expandedSection = ref<string | null>(null);
const showAddMemberPopup = ref(false);
const showMediaModal = ref(false);
const showFilesModal = ref(false);
const showShareModal = ref(false);
const showMediaPreview = ref(false);
const searchQuery = ref("");
const dropdownRef = ref<HTMLElement | null>(null);
const activeDropdown = ref<string | null>(null);
const selectedFile = ref<FileItem | null>(null);
const selectedMedia = ref<MediaItem | null>(null);
const currentMediaPage = ref(1);
const currentFilesPage = ref(1);
const friends = ref<Member[]>([]);
const groupMedia = ref<MediaItem[]>([]);
const groupFiles = ref<FileItem[]>([]);

// Loading states
const isLoadingMedia = ref(false);
const isLoadingMoreMedia = ref(false);
const isLoadingFiles = ref(false);
const isLoadingMoreFiles = ref(false);

// Pagination states
const mediaPagination = ref<PaginationResponse>({
  current_page: 1,
  total_pages: 1,
  total_items: 0,
  items_per_page: 20,
  has_more_pages: false,
});

const filesPagination = ref<PaginationResponse>({
  current_page: 1,
  total_pages: 1,
  total_items: 0,
  items_per_page: 20,
  has_more_pages: false,
});

// Computed properties
const groupName = computed(() => props.groupDetails.name);
const isLoading = computed(() => groupsStore.isLoading);

// Make sure the refs are properly typed
const filesPaginationRef = computed(() => filesPagination.value);
const groupMediaRef = computed(() => groupMedia.value);

const isAdmin = computed(() => {
  return props.groupDetails.members.some(
    (member) => member.id === authStore.user?.id && member.role === "admin"
  );
});

// Add missing computed properties
const hasNoMedia = computed(() => groupMedia.value.length === 0);
const hasNoFiles = computed(() => groupFiles.value.length === 0);

// Filter friends for adding members (excluding current group members)
const filteredFriends = computed(() => {
  if (!searchQuery.value) return friends.value;
  
  return friends.value.filter((friend: Member) =>
    friend.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    friend.username?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Media navigation computed properties
const currentMediaIndex = computed(() => {
  if (!selectedMedia.value || !groupMedia.value?.length) return -1;
  return groupMedia.value.findIndex((item) => item.id === selectedMedia.value?.id);
});

const hasPreviousMedia = computed(() => currentMediaIndex.value > 0);
const hasNextMedia = computed(() => currentMediaIndex.value < groupMedia.value.length - 1);

// Enhanced thumbnail and file URL functions
const getThumbnailUrl = (fileId: string): string => {
  const media = groupMedia.value.find((item) => item.id === fileId);
  return media?.thumbnail_url || media?.url || "https://via.placeholder.com/150";
};

const getFileUrl = (fileId: string): string => {
  const media = groupMedia.value.find((item) => item.id === fileId);
  return media?.url || "#";
};

// Member management functions
async function handleAddMembers(): Promise<void> {
  try {
    const selectedMemberIds = friends.value
      .filter((friend: Member) => friend.selected)
      .map((friend: Member) => friend.user_id);

    if (selectedMemberIds.length === 0) return;

    await groupsStore.addGroupMembers(props.groupDetails.id, selectedMemberIds);

    // Reset selection and close popup
    friends.value.forEach((friend: Member) => {
      friend.selected = false;
    });
    showAddMemberPopup.value = false;

    // Show success message
    $toast.success("Members added to group successfully");

    // Emit event to update group details
    emit("update:group");
  } catch (err) {
    handleError(err, "Failed to add members to group");
  }
}

// File management functions
async function downloadFile(fileId: string): Promise<void> {
  try {
    await downloadFileAction(fileId);
  } catch (err) {
    handleError(err, "Failed to download file");
  }
}

function showShareDialog(file: FileItem): void {
  selectedFile.value = file;
  showShareModal.value = true;
}

function closeShareDialog(): void {
  showShareModal.value = false;
  selectedFile.value = null;
}

async function handleShareFile(): Promise<void> {
  if (!selectedFile.value) return;

  const selectedUserIds = friends.value
    .filter((friend) => friend.shareSelected)
    .map((friend) => friend.id);

  if (selectedUserIds.length === 0) return;

  try {
    await shareFile(selectedFile.value.id, selectedUserIds);
    if ($toast) {
      $toast.success("File shared successfully");
    }
    closeShareDialog();
  } catch (err) {
    handleError(err, "Failed to share file");
  }
}

// Media preview functions
function openMediaPreview(media: MediaItem): void {
  selectedMedia.value = media;
  showMediaPreview.value = true;
}

function closeMediaPreview(): void {
  showMediaPreview.value = false;
  selectedMedia.value = null;
}

function navigateMedia(direction: "prev" | "next"): void {
  if (!selectedMedia.value || !groupMedia.value?.length) return;

  if (direction === "prev" && hasPreviousMedia.value) {
    selectedMedia.value = groupMedia.value[currentMediaIndex.value - 1];
  } else if (direction === "next" && hasNextMedia.value) {
    selectedMedia.value = groupMedia.value[currentMediaIndex.value + 1];
  }
}

// Member management functions
function toggleMemberDropdown(memberId: string): void {
  activeDropdown.value = activeDropdown.value === memberId ? null : memberId;
}

function toggleFriendSelection(friendId: string): void {
  const friend: Member | undefined = friends.value.find(
    (f: Member) => f.id === friendId
  );
  if (friend) {
    friend.selected = !friend.selected;
  }
}

function toggleShareSelection(friendId: string): void {
  const friend: Member | undefined = friends.value.find(
    (f: Member) => f.id === friendId
  );
  if (friend) {
    friend.shareSelected = !friend.shareSelected;
  }
}

async function handleBlockMember(memberId: string): Promise<void> {
  try {
    await groupsStore.blockGroupUser(props.groupDetails.id, memberId);
    $toast.success("User blocked successfully");
    activeDropdown.value = null;
  } catch (error: any) {
    console.error("Error blocking user:", error);
    $toast.error(error.message || "Failed to block user");
  }
}

async function handleUnblockMember(memberId: string): Promise<void> {
  try {
    await groupsStore.unblockGroupUser(props.groupDetails.id, memberId);
    $toast.success("User unblocked successfully");
    activeDropdown.value = null;
  } catch (error: any) {
    console.error("Error unblocking user:", error);
    $toast.error(error.message || "Failed to unblock user");
  }
}

// Add missing interface definitions and improve type safety
interface BlockedUser {
  user_id: string;
  blocked_at: string;
}

// Add blocked users state and computed property
const blockedUsers = computed(() => groupsStore.blockedUsers || []);

// Enhanced members with blocking status
const membersWithBlockingStatus = computed(() => {
  return props.groupDetails.members.map((member) => {
    const userId = member.id || member.user_id || "";
    const blockedUser = blockedUsers.value.find((user: any) => {
      return user.user_id === userId || 
             user.user_id === member.id || 
             user.user_id === member.user_id;
    });

    const isBlocked = !!blockedUser;
    const presenceStatus = presence.getStatus(member.user_id || member.id) as "online" | "offline" | "busy" | "away";
    
    return {
      ...member,
      isBlocked,
      blockedAt: blockedUser ? (blockedUser as any).blocked_at || (blockedUser as any).created_at || undefined : undefined,
      presenceStatus,
      lastActive: formatLastActive(
        presence.getLastActive(member.user_id || member.id)
      ),
      avatar: member.avatar || member.avatar_url || member.profile_picture_url,
      role: member.is_owner ? "admin" : member.role || "member",
    };
  });
});

// Update the existing membersWithStatus to use the enhanced version
const membersWithStatus = computed(() => {
  console.log(`📊 [GroupInfoPanel] Processing members with blocking status:`, {
    groupDetails: props.groupDetails,
    membersLength: props.groupDetails.members?.length || 0,
    blockedUsersCount: blockedUsers.value.length,
  });

  return membersWithBlockingStatus.value.map((member) => {
    // Use the processed name from useGroups extractMemberName function
    let displayName =
      member.extracted_name || member.display_name || 
      member.name || member.full_name || 
      `${member.first_name || ''} ${member.last_name || ''}`.trim() ||
      member.username || "Unknown User";

    return {
      ...member,
      name: displayName,
    };
  });
});

// Add enhanced blocked members count that uses actual API data
const blockedMembersCount = computed(() => {
  return membersWithStatus.value.filter((member) => member.isBlocked).length;
});

// Enhanced last active formatting function
function formatLastActive(lastActiveTimestamp: string | null): string {
  if (!lastActiveTimestamp) return "Not available";

  try {
    const lastActiveDate = new Date(lastActiveTimestamp);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - lastActiveDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return "Just now";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hr ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    return lastActiveDate.toLocaleDateString();
  } catch (error) {
    return "Not available";
  }
}

// Data loading functions
async function loadGroupMedia(): Promise<void> {
  if (!props.groupDetails?.id) return;
  
  isLoadingMedia.value = true;
  try {
    const response = await getGroupMedia(props.groupDetails.id, "all", currentMediaPage.value, 20);
    
    if (response) {
      groupMedia.value = response.data || [];
      mediaPagination.value = response.pagination || mediaPagination.value;
    }
  } catch (err) {
    handleError(err, "Failed to load group media");
  } finally {
    isLoadingMedia.value = false;
  }
}

async function loadGroupFiles(): Promise<void> {
  if (!props.groupDetails?.id) return;
  
  isLoadingFiles.value = true;
  try {
    const response = await getGroupFiles(props.groupDetails.id, currentFilesPage.value, 20);
    
    if (response) {
      groupFiles.value = response.data || [];
      filesPagination.value = response.pagination || filesPagination.value;
    }
  } catch (err) {
    handleError(err, "Failed to load group files");
  } finally {
    isLoadingFiles.value = false;
  }
}

async function loadMoreMedia(): Promise<void> {
  if (!mediaPagination.value.has_more_pages || isLoadingMoreMedia.value) return;
  
  isLoadingMoreMedia.value = true;
  try {
    currentMediaPage.value += 1;
    const response = await getGroupMedia(props.groupDetails.id, "all", currentMediaPage.value, 20);
    
    if (response?.data) {
      groupMedia.value.push(...response.data);
      mediaPagination.value = response.pagination || mediaPagination.value;
    }
  } catch (err) {
    handleError(err, "Failed to load more media");
  } finally {
    isLoadingMoreMedia.value = false;
  }
}

async function loadMoreFiles(): Promise<void> {
  if (!filesPagination.value.has_more_pages || isLoadingMoreFiles.value) return;
  
  isLoadingMoreFiles.value = true;
  try {
    currentFilesPage.value += 1;
    const response = await getGroupFiles(props.groupDetails.id, currentFilesPage.value, 20);
    
    if (response?.data) {
      groupFiles.value.push(...response.data);
      filesPagination.value = response.pagination || filesPagination.value;
    }
  } catch (err) {
    handleError(err, "Failed to load more files");
  } finally {
    isLoadingMoreFiles.value = false;
  }
}

// Add function to load blocked users when component initializes
async function loadBlockedUsers(): Promise<void> {
  try {
    if (props.groupDetails?.id) {
      await groupsStore.getGroupBlocks(props.groupDetails.id);
    }
  } catch (err) {
    console.error("Failed to load blocked users:", err);
  }
}

// Add function to load friends for adding members
async function loadFriends(): Promise<void> {
  try {
    // This should load friends from your friends store
    // You'll need to implement this based on your friends composable
    console.log("Loading friends for group member addition...");
    // friends.value = await friendsStore.getFriends();
  } catch (err) {
    console.error("Failed to load friends:", err);
  }
}

// Error handling utility
function handleError(error: any, defaultMessage: string): void {
  console.error(defaultMessage, error);
  const message = error?.message || defaultMessage;
  if ($toast) {
    $toast.error(message);
  }
}

// Handle clicks outside dropdown to close it
function handleClickOutside(event: MouseEvent): void {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    activeDropdown.value = null;
  }
}

// Lifecycle hooks
onMounted(() => {
  if (props.groupDetails?.id) {
    loadGroupMedia();
    loadGroupFiles();
    loadBlockedUsers();
    loadFriends();
  }
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

// Watchers
watch(
  () => props.groupDetails?.id,
  async (newId) => {
    if (newId) {
      currentMediaPage.value = 1;
      currentFilesPage.value = 1;
      await Promise.all([loadGroupMedia(), loadGroupFiles()]);
    }
  },
  { immediate: true }
);
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
