<template>
  <div
    class="w-80 h-full border-l border-gray-200 bg-white overflow-y-auto shadow-lg"
  >
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

                <span v-if="member.isBlocked" class="text-xs text-red-500">
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

    <!-- Attachments Section (Unified Media & Files) -->
    <div class="border-b border-gray-200">
      <div
        class="p-4 flex justify-between items-center cursor-pointer"
        @click="
          expandedSection =
            expandedSection === 'attachments' ? null : 'attachments'
        "
      >
        <div class="flex items-center">
          <h3 class="font-medium text-black">
            Attachments
            <span class="text-gray-500"> ({{ attachments.length }}) </span>
          </h3>
        </div>
        <div class="text-gray-500 text-sm">
          {{ expandedSection === "attachments" ? "▲" : "▼" }}
        </div>
      </div>

      <div v-if="expandedSection === 'attachments'" class="px-4 pb-4">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <div
            class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>

        <!-- No attachments state -->
        <div
          v-else-if="attachments.length === 0"
          class="py-8 text-center text-gray-500"
        >
          <Icon
            name="fa:paperclip"
            class="h-8 w-8 mx-auto mb-2 text-gray-300"
          />
          <p>No attachments found</p>
        </div>

        <!-- Attachments Grid -->
        <div v-else class="space-y-3">
          <div
            v-for="attachment in displayedAttachments"
            :key="attachment.file_id"
            class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            @click="openAttachmentPreview(attachment)"
          >
            <!-- Attachment Icon/Thumbnail -->
            <div
              class="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 mr-3"
            >
              <img
                v-if="isImage(attachment.mime_type)"
                :src="attachment.url"
                :alt="attachment.filename"
                class="w-full h-full object-cover"
                @error="(e) => { const target = e.target as HTMLImageElement; if (target) target.style.display = 'none'; }"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <Icon
                  :name="getFileIcon(attachment.mime_type)"
                  class="h-5 w-5 text-gray-500"
                />
              </div>
            </div>

            <!-- Attachment Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ attachment.filename }}
              </p>
              <div class="flex items-center space-x-2 text-xs text-gray-500">
                <span>{{ formatFileSize(attachment.size) }}</span>
                <span>•</span>
                <span>{{ formatDate(attachment.uploaded_at) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-1">
              <button
                @click.stop="downloadAttachment(attachment)"
                class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="Download"
              >
                <Icon name="fa:download" class="h-4 w-4" />
              </button>
              <button
                @click.stop="shareAttachment(attachment)"
                class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="Share"
              >
                <Icon name="fa:share-alt" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Load More Button -->
          <div v-if="hasMoreAttachments" class="text-center pt-2">
            <button
              @click="showAttachmentsModal = true"
              class="px-4 py-2 text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              View All ({{ attachments.length }})
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Attachments Modal -->
    <div
      v-if="showAttachmentsModal"
      class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
    >
      <div
        class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="font-medium text-lg">All Attachments</h3>
          <button
            @click="showAttachmentsModal = false"
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="attachment in attachments"
              :key="attachment.file_id"
              class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              @click="openAttachmentPreview(attachment)"
            >
              <!-- Same attachment item structure -->
              <div
                class="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 mr-3"
              >
                <img
                  v-if="isImage(attachment.mime_type)"
                  :src="attachment.url"
                  :alt="attachment.filename"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <Icon
                    :name="getFileIcon(attachment.mime_type)"
                    class="h-5 w-5 text-gray-500"
                  />
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ attachment.filename }}
                </p>
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{{ formatFileSize(attachment.size) }}</span>
                  <span>•</span>
                  <span>{{ formatDate(attachment.uploaded_at) }}</span>
                </div>
              </div>

              <div class="flex items-center space-x-1">
                <button
                  @click.stop="downloadAttachment(attachment)"
                  class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Download"
                >
                  <Icon name="fa:download" class="h-4 w-4" />
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

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Share with:</label>
          <div
            class="max-h-60 overflow-y-auto border border-gray-200 rounded-lg"
          >
            <div
              v-for="friend in friendsList"
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
            :disabled="!friendsList.some((friend) => friend.shareSelected)"
          >
            Share
          </button>
        </div>
      </div>
    </div>

    <!-- Attachment Preview Modal -->
    <div
      v-if="showPreview"
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
    >
      <div class="relative w-full max-w-4xl">
        <button
          @click="closeAttachmentPreview"
          class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <Icon name="fa:times" class="h-6 w-6" />
        </button>

        <div v-if="selectedAttachment" class="flex flex-col items-center">
          <img
            v-if="isImage(selectedAttachment.mime_type)"
            :src="selectedAttachment.url"
            :alt="selectedAttachment.filename"
            class="max-h-[80vh] max-w-full object-contain"
          />
          <div v-else class="bg-white rounded-lg p-8 text-center">
            <Icon
              :name="getFileIcon(selectedAttachment.mime_type)"
              class="h-16 w-16 mx-auto mb-4 text-gray-400"
            />
            <p class="text-lg font-medium text-gray-900 mb-2">
              {{ selectedAttachment.filename }}
            </p>
            <p class="text-gray-500 mb-4">
              {{ formatFileSize(selectedAttachment.size) }}
            </p>
            <button
              @click="downloadAttachment(selectedAttachment)"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Icon name="fa:download" class="h-4 w-4 mr-2" />
              Download
            </button>
          </div>

          <!-- Navigation arrows for multiple attachments -->
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, onUnmounted } from "vue";
import { useFiles } from "~/composables/useFiles";
import { useGroupsStore } from "~/composables/useGroups";
import { useAuthStore } from "~/composables/useAuth";
import { usePresence } from "~/composables/usePresence";
import { useFriendsStore } from "~/composables/useFriends";
import { useNuxtApp } from "#app";

// Enhanced interfaces matching React patterns and presence types
type PresenceStatus = "online" | "offline" | "away" | "busy";

interface Member {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  username?: string;
  extracted_name?: string;
  display_name?: string;
  status: PresenceStatus;
  role: "admin" | "member" | "owner"; // Enhanced with owner role
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
  presenceStatus?: PresenceStatus; // Updated to use PresenceStatus
  lastActive?: string;
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
  memberCount: number;
  avatar?: string;
  avatar_url?: string;
  members: Member[];
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

// Unified attachments interface matching FriendInfoPanel
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
const friendsStore = useFriendsStore();
const {
  downloadFile: downloadFileAction,
  shareFile,
  formatFileSize,
} = useFiles();

// State management - unified attachments from message history
const expandedSection = ref<string | null>(null);
const showAddMemberPopup = ref(false);
const showAttachmentsModal = ref(false);
const showShareModal = ref(false);
const showPreview = ref(false);
const searchQuery = ref("");
const dropdownRef = ref<HTMLElement | null>(null);
const activeDropdown = ref<string | null>(null);

// State for unified attachments
const attachments = ref<AttachmentItem[]>([]);
const selectedAttachment = ref<AttachmentItem | null>(null);
const isLoading = ref(false);
const isLoadingMore = ref(false);

// Pagination for attachments
const currentPage = ref(1);
const pagination = ref<Pagination>({
  current_page: 1,
  total_pages: 1,
  total_items: 0,
  items_per_page: 8,
  has_more_pages: false,
});

const friends = ref<Member[]>([]);
const friendsList = ref<Member[]>([]);

// Computed values
const groupName = computed(() => props.groupDetails.name);

const displayedAttachments = computed(() => {
  return attachments.value.slice(0, 6);
});

const hasMoreAttachments = computed(() => {
  return attachments.value.length > 6;
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

// Filter friends for adding members
const filteredFriends = computed(() => {
  if (!searchQuery.value) return friends.value;

  return friends.value.filter(
    (friend) =>
      friend.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      friend.username?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Enhanced members with blocking status
const blockedUsers = computed(() => groupsStore.blockedUsers || []);

const membersWithStatus = computed(() => {
  return props.groupDetails.members.map((member) => {
    const userId = member.id || member.user_id || "";
    const blockedUser = blockedUsers.value.find((user: any) => {
      return (
        user.user_id === userId ||
        user.user_id === member.id ||
        user.user_id === member.user_id
      );
    });

    const isBlocked = !!blockedUser;
    const presenceStatus = presence.getStatus(
      member.user_id || member.id
    ) as PresenceStatus;

    let displayName =
      member.extracted_name ||
      member.display_name ||
      member.name ||
      member.full_name ||
      `${member.first_name || ""} ${member.last_name || ""}`.trim() ||
      member.username ||
      "Unknown User";

    return {
      ...member,
      name: displayName,
      isBlocked,
      presenceStatus,
      lastActive: formatLastActive(
        presence.getLastActive(member.user_id || member.id)
      ),
      avatar: member.avatar || member.avatar_url || member.profile_picture_url,
      role: member.is_owner ? "owner" : member.role || "member",
      // React-style enhancement properties
      permissions: {
        canKick: !member.is_owner && !isBlocked,
        canMute: !member.is_owner && !isBlocked,
        canPromote: !member.is_owner && !isBlocked,
        canEdit: member.is_owner,
      },
      lastSeen: presence.getLastActive(member.user_id || member.id),
      isTyping: false, // Could be enhanced with real typing indicators
      muteUntil: undefined, // Could be enhanced with mute functionality
      joinedVia: "invite" as const, // Default value, could be from API
      customTitle: member.is_owner ? "Owner" : undefined,
    };
  });
});

const blockedMembersCount = computed(() => {
  return membersWithStatus.value.filter((member) => member.isBlocked).length;
});

// Helper functions
const isImage = (mimeType: string) => {
  return mimeType.startsWith("image/");
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return "fa:image";
  if (mimeType.startsWith("video/")) return "fa:video";
  if (mimeType.startsWith("audio/")) return "fa:music";
  if (mimeType.includes("pdf")) return "fa:file-pdf";
  if (mimeType.includes("word")) return "fa:file-word";
  if (mimeType.includes("excel") || mimeType.includes("sheet"))
    return "fa:file-excel";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation"))
    return "fa:file-powerpoint";
  if (mimeType.includes("zip") || mimeType.includes("archive"))
    return "fa:file-archive";
  return "fa:file";
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch {
    return "Unknown date";
  }
};

const formatLastActive = (lastActiveTimestamp: string | null): string => {
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
};

// Initialize friends list
watch(
  () => friendsStore.friends,
  (friends) => {
    if (friends) {
      friendsList.value = friends.map((friend) => ({
        ...friend,
        name:
          friend.name ||
          friend.display_name ||
          friend.full_name ||
          "Unknown User",
        role: "member" as const,
        user_id: friend.id,
        status: (friend.status || "offline") as PresenceStatus,
        shareSelected: false,
      }));
    }
  },
  { immediate: true }
);

// Load group attachments from message history
const loadAttachments = async () => {
  if (!props.groupDetails?.id) return;

  try {
    isLoading.value = true;

    const response = await fetch(
      `/api/proxy/messages/history?type=group&target_id=${props.groupDetails.id}&limit=100`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Extract messages array from response
    let messages = [];
    if (data?.data && Array.isArray(data.data)) {
      messages = data.data;
    } else if (data?.messages && Array.isArray(data.messages)) {
      messages = data.messages;
    } else if (Array.isArray(data)) {
      messages = data;
    }

    // Extract attachments from messages
    const extractedAttachments: AttachmentItem[] = [];

    messages.forEach((message: any) => {
      if (message.attachment || message.attachments) {
        const attachment = message.attachment || message.attachments;

        if (attachment.url && attachment.filename) {
          extractedAttachments.push({
            file_id: attachment.file_id || attachment.id || message.id,
            filename: attachment.filename || attachment.name || "Unknown File",
            size: attachment.size || 0,
            mime_type:
              attachment.mime_type ||
              attachment.type ||
              "application/octet-stream",
            url: attachment.url,
            uploaded_at:
              attachment.uploaded_at ||
              message.created_at ||
              new Date().toISOString(),
          });
        }
      }
    });

    // Sort by upload date (newest first)
    extractedAttachments.sort(
      (a, b) =>
        new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
    );

    attachments.value = extractedAttachments;

    // Update pagination
    pagination.value = {
      current_page: 1,
      total_pages: Math.ceil(extractedAttachments.length / 8),
      total_items: extractedAttachments.length,
      items_per_page: 8,
      has_more_pages: extractedAttachments.length > 8,
    };
  } catch (error) {
    console.error("Error loading attachments:", error);
    // Silently handle error
  } finally {
    isLoading.value = false;
  }
};

const loadMoreAttachments = async () => {
  // Implement pagination if needed
  // For now, we load all attachments at once
};

// Attachment functions
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
  } else if (
    direction === "next" &&
    currentIndex < attachments.value.length - 1
  ) {
    selectedAttachment.value = attachments.value[currentIndex + 1];
  }
};

const downloadAttachment = async (attachment: AttachmentItem) => {
  try {
    // Create a temporary anchor element to download the file
    const link = document.createElement("a");
    link.href = attachment.url;
    link.download = attachment.filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading file:", error);
    $toast.error("Failed to download file");
  }
};

const shareAttachment = (attachment: AttachmentItem) => {
  selectedAttachment.value = attachment;
  showShareModal.value = true;
};

// Share functions
const closeShareDialog = () => {
  showShareModal.value = false;
  selectedAttachment.value = null;

  // Reset selection state
  friendsList.value = friendsList.value.map((friend) => ({
    ...friend,
    shareSelected: false,
  }));
};

const toggleShareSelection = (friendId: string) => {
  friendsList.value = friendsList.value.map((friend) =>
    friend.id === friendId
      ? { ...friend, shareSelected: !friend.shareSelected }
      : friend
  );
};

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

// Member management functions
const toggleMemberDropdown = (memberId: string) => {
  activeDropdown.value = activeDropdown.value === memberId ? null : memberId;
};

const toggleFriendSelection = (friendId: string) => {
  const friend = friends.value.find((f) => f.id === friendId);
  if (friend) {
    friend.selected = !friend.selected;
  }
};

const handleAddMembers = async () => {
  try {
    const selectedMemberIds = friends.value
      .filter((friend) => friend.selected)
      .map((friend) => friend.user_id);

    if (selectedMemberIds.length === 0) return;

    await groupsStore.addGroupMembers(props.groupDetails.id, selectedMemberIds);

    // Reset selection and close popup
    friends.value.forEach((friend) => {
      friend.selected = false;
    });
    showAddMemberPopup.value = false;

    $toast.success("Members added to group successfully");
    emit("update:group");
  } catch (error: any) {
    console.error("Error adding members:", error);
    $toast.error(error.message || "Failed to add members to group");
  }
};

const handleBlockMember = async (memberId: string) => {
  try {
    await groupsStore.blockGroupUser(props.groupDetails.id, memberId);
    $toast.success("User blocked successfully");
    activeDropdown.value = null;
  } catch (error: any) {
    console.error("Error blocking user:", error);
    $toast.error(error.message || "Failed to block user");
  }
};

const handleUnblockMember = async (memberId: string) => {
  try {
    await groupsStore.unblockGroupUser(props.groupDetails.id, memberId);
    $toast.success("User unblocked successfully");
    activeDropdown.value = null;
  } catch (error: any) {
    console.error("Error unblocking user:", error);
    $toast.error(error.message || "Failed to unblock user");
  }
};

const loadBlockedUsers = async () => {
  try {
    if (props.groupDetails?.id) {
      await groupsStore.getGroupBlocks(props.groupDetails.id);
    }
  } catch (err) {
    console.error("Failed to load blocked users:", err);
  }
};

const loadFriends = async () => {
  try {
    await friendsStore.getFriends();
    friends.value = friendsStore.friends.map((friend) => ({
      ...friend,
      role: "member" as const,
      user_id: friend.id,
      status: (friend.status || "offline") as PresenceStatus,
      selected: false,
      // React-style enhancement properties
      permissions: {
        canKick: false,
        canMute: false,
        canPromote: false,
        canEdit: false,
      },
      lastSeen: friend.last_seen || undefined,
      isTyping: false,
      muteUntil: undefined,
      joinedVia: "invite" as const,
      customTitle: undefined,
    }));
  } catch (err) {
    console.error("Failed to load friends:", err);
  }
};

// Handle clicks outside dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    activeDropdown.value = null;
  }
};

// Load data when group details change
watch(
  () => props.groupDetails?.id,
  (groupId) => {
    if (groupId) {
      currentPage.value = 1;
      loadAttachments();
      loadBlockedUsers();
    }
  },
  { immediate: true }
);

// Initialize on mount
onMounted(() => {
  loadFriends();
  friendsStore.getFriends();
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 1;
}
</style>
