<template>
  <div class="h-full flex flex-col p-6 bg-white">
    <!-- Header with title and action buttons -->
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-xl font-bold text-gray-800">Groups</h1>
      <div class="flex items-center space-x-2">
        <div
          class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <NotificationDropdown />
        </div>
        <button
          @click="openCreateGroupModal"
          class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors shadow-sm"
          aria-label="Create Group"
        >
          <Icon name="material-symbols:add" class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Search bar -->
    <div class="relative mb-5">
      <div
        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
      >
        <Icon name="lucide:search" class="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search groups"
        class="pl-11 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-sm"
      />
    </div>

    <!-- Loading state -->
    <div
      v-if="groupsStore.isLoading"
      class="flex-1 flex items-center justify-center"
    >
      <div class="flex flex-col items-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        ></div>
        <p class="mt-2 text-sm text-gray-500">Loading...</p>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="groupsStore.error"
      class="flex-1 flex items-center justify-center"
    >
      <div class="flex flex-col items-center text-center">
        <Icon name="lucide:alert-triangle" class="h-8 w-8 text-red-500 mb-2" />
        <p class="text-red-500">{{ groupsStore.error }}</p>
        <button
          @click="refreshData"
          class="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Groups list -->
    <div v-else class="flex-1 overflow-auto">
      <div
        v-if="filteredGroups.length === 0"
        class="h-full flex flex-col items-center justify-center text-center p-6"
      >
        <Icon name="fa:users" class="h-12 w-12 text-gray-300 mb-3" />
        <p class="text-gray-500 font-medium">
          {{
            searchQuery ? `No results for "${searchQuery}"` : "No groups yet"
          }}
        </p>
        <p class="text-sm text-gray-400 mt-2">
          Create a group to start chatting
        </p>

        <button
          @click="openCreateGroupModal"
          class="mt-4 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors flex items-center"
        >
          <Icon name="lucide:users-plus" class="h-4 w-4 mr-2" />
          <span>Create Group</span>
        </button>
      </div>

      <div v-else>
        <!-- Group section header -->
        <div class="flex justify-between items-center mb-3">
          <div class="flex items-center">
            <div class="w-1 h-6 bg-blue-500 rounded-r mr-2"></div>
            <h2 class="font-semibold text-gray-800 text-sm">
              Your Groups
              <span
                class="ml-1 text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full"
              >
                {{ filteredGroups.length }}
              </span>
            </h2>
          </div>
        </div>

        <!-- Groups list items -->
        <div class="space-y-3">
          <NuxtLink
            v-for="(group, index) in filteredGroups"
            :key="group.id || index"
            :to="`/chat/messages/${group.id}?type=group`"
          >
            <div
              :class="`flex items-center p-4 rounded-lg transition-colors ${
                $route.path === `/chat/messages/${group.id}` &&
                $route.query.type === 'group'
                  ? 'bg-blue-50 border border-blue-100'
                  : 'hover:bg-gray-50 border border-transparent'
              }`"
            >
              <!-- Group avatar -->
              <div class="relative mr-3">
                <div
                  class="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200 shadow-sm"
                >
                  <img
                    v-if="group.avatar_url"
                    :src="group.avatar_url"
                    alt="Group avatar"
                    class="h-full w-full object-cover"
                  />
                  <Icon v-else name="fa:users" class="h-6 w-6 text-gray-400" />
                </div>
              </div>

              <!-- Group info -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <h3 class="font-medium text-gray-900 truncate">
                    {{ group.name || "Unnamed Group" }}
                  </h3>
                  <span class="text-xs text-gray-500 ml-1">
                    {{
                      group.last_message?.created_at
                        ? formatTimestamp(group.last_message.created_at)
                        : group.created_at
                        ? formatTimestamp(group.created_at)
                        : ""
                    }}
                  </span>
                </div>
                <div class="flex justify-between items-center mt-1">
                  <div class="flex-1 min-w-0">
                    <p
                      v-if="group.last_message?.content"
                      class="text-xs text-gray-600 truncate"
                    >
                      <span class="font-medium">{{
                        group.last_message?.sender_name || "Someone"
                      }}</span>
                      : {{ group.last_message?.content }}
                    </p>
                    <p v-else class="text-xs text-gray-500">
                      {{
                        group.description ||
                        `${group.member_count || 0} members`
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Create Group Modal -->
    <div
      v-if="showCreateGroupModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in p-4"
    >
      <div
        class="bg-white rounded-xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl transform transition-all"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Create a Group</h2>
          <button
            @click="showCreateGroupModal = false"
            class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Icon name="fa:times" class="h-4 w-4" />
          </button>
        </div>

        <div
          v-if="errors.general"
          class="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm"
        >
          {{ errors.general }}
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Group Name
          </label>
          <input
            v-model="newGroup.name"
            type="text"
            placeholder="Enter group name"
            class="w-full p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-500">
            {{ errors.name }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="newGroup.description"
            placeholder="Enter group description"
            rows="2"
            class="w-full p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Group Avatar
          </label>
          <div class="flex items-center">
            <div
              class="h-20 w-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center border border-gray-300"
            >
              <img
                v-if="avatarPreview"
                :src="avatarPreview"
                alt="Group avatar preview"
                class="h-full w-full object-cover"
              />
              <Icon
                v-else
                name="mdi:account-group"
                class="h-10 w-10 text-gray-400"
              />
            </div>
            <div class="ml-5">
              <button
                @click="handleAvatarUpload"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Upload Image
              </button>
              <p v-if="avatarPreview" class="mt-2 text-xs text-gray-500">
                <button
                  @click="clearAvatar"
                  class="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </p>
            </div>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="hidden text-black"
              @change="handleAvatarChange"
            />
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select Friends
          </label>
          <div
            v-if="friendsStore.friends.length === 0"
            class="text-sm text-gray-500 p-2"
          >
            No friends to add. Add some friends first.
          </div>
          <div v-else>
            <div class="relative mb-2">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <Icon name="lucide:search" class="h-4 w-4 text-gray-400" />
              </div>
              <input
                v-model="friendSearch"
                type="text"
                placeholder="Search friends..."
                class="w-full pl-10 p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div
              class="max-h-32 overflow-y-auto border border-gray-200 rounded-lg"
            >
              <div
                v-for="friend in filteredFriends"
                :key="friend.id"
                :class="`flex items-center p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isSelected(friend.id) ? 'bg-blue-50' : ''
                }`"
                @click="toggleFriendSelection(friend)"
              >
                <div
                  class="h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex-shrink-0 flex items-center justify-center"
                >
                  <img
                    v-if="friend.profile_picture_url"
                    :src="friend.profile_picture_url"
                    :alt="friend.name"
                    class="h-full w-full object-cover"
                  />
                  <Icon v-else name="fa:user" class="h-4 w-4 text-gray-500" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-sm text-black">
                    {{ friend.name || "Unknown" }}
                  </p>
                  <p class="text-xs text-gray-500">
                    @{{
                      friend.email
                        ? friend.email.split("@")[0]
                        : (friend.name || "user")
                            .toLowerCase()
                            .replace(/\s+/g, "_")
                    }}
                  </p>
                </div>
                <input
                  type="checkbox"
                  :checked="isSelected(friend.id)"
                  class="h-4 w-4 text-blue-600"
                  @click.stop
                />
              </div>
              <div
                v-if="filteredFriends.length === 0"
                class="p-4 text-center text-gray-500"
              >
                No friends found
              </div>
            </div>
          </div>
          <p v-if="errors.members" class="mt-1 text-sm text-red-500">
            {{ errors.members }}
          </p>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="showCreateGroupModal = false"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleCreateGroup"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            :disabled="isCreating"
          >
            <Icon
              v-if="!isCreating"
              name="lucide:users-plus"
              class="h-4 w-4 mr-2"
            />
            <div
              v-if="isCreating"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
            ></div>
            <span>{{ isCreating ? "Creating..." : "Create Group" }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { safeFormatDistanceToNow, safeFormat } from "~/utils/dateUtils";
import { type Group, useGroupsStore } from "~/composables/useGroups";
import { useFriendsStore } from "~/composables/useFriends";
import { useNuxtApp } from "#app";

// Initialize Nuxt app to access plugins like toast
const { $toast } = useNuxtApp();

// Interface for our friend objects
interface Friend {
  id: string;
  name: string;
  email?: string;
  status?: string;
  profile_picture_url?: string;
}

// Initialize stores
const groupsStore = useGroupsStore();
const friendsStore = useFriendsStore();

// Local state
const isLoading = ref(false);
const searchQuery = ref("");
const showCreateGroupModal = ref(false);
const newGroup = ref({ name: "", description: "" });
const friendSearch = ref("");
const showFriendsList = ref(false);
const selectedFriendIds = ref<string[]>([]);
const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);
const avatarInput = ref<HTMLInputElement | null>(null);
const isCreating = ref(false);
const errors = ref<{
  name?: string;
  members?: string;
  avatar?: string;
  general?: string;
}>({});

// Get filtered groups based on search query
const filteredGroups = computed(() => {
  // Ensure groups is an array and cast to Group type
  const groups = Array.isArray(groupsStore.groups)
    ? (groupsStore.groups as Group[])
    : ([] as Group[]);

  // No debugging needed for production

  if (!searchQuery.value) {
    return groups;
  }

  const query = searchQuery.value.toLowerCase();
  return groups.filter(
    (group: Group) =>
      group && group.name && group.name.toLowerCase().includes(query)
  );
});

// Get friends and filter them based on search
const filteredFriends = computed(() => {
  if (!friendSearch.value) {
    return friendsStore.friends;
  }
  const query = friendSearch.value.toLowerCase();
  return friendsStore.friends.filter(
    (friend) =>
      (friend.name && friend.name.toLowerCase().includes(query)) ||
      (friend.email && friend.email.toLowerCase().includes(query))
  );
});

// Get selected friends as objects
const selectedFriends = computed(() => {
  return friendsStore.friends.filter((friend) =>
    selectedFriendIds.value.includes(friend.id)
  );
});

// Check if a friend is selected
const isSelected = (friendId: string) => {
  return selectedFriendIds.value.includes(friendId);
};

// Format timestamp for last message
const formatTimestamp = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return safeFormat(date, "h:mm a");
    } else {
      return safeFormatDistanceToNow(date, { addSuffix: true });
    }
  } catch (error) {
    return dateString;
  }
};

// Direct API call to diagnose the groups endpoint
async function directAPICall() {
  try {
    const { $api, $toast } = useNuxtApp();
    const response = await $api.get("/groups");

    // Based on provided JSON structure, we expect groups in response.groups
    let groupsData: Group[] = [];

    if (response && typeof response === "object") {
      // Primary target based on the provided JSON structure
      if (response.groups && Array.isArray(response.groups)) {
        groupsData = response.groups as Group[];
      }
      // Fallbacks
      else if (Array.isArray(response)) {
        groupsData = response as Group[];
      } else if (response.data && Array.isArray(response.data)) {
        groupsData = response.data as Group[];
      } else {
        // Look for groups array in any property
        for (const key in response) {
          if (Array.isArray(response[key]) && response[key].length > 0) {
            if (response[key][0] && response[key][0].name !== undefined) {
              groupsData = response[key] as Group[];
              break;
            }
          }
        }
      }
    }

    // If we found groups data, set it in the store
    if (groupsData.length > 0) {
      groupsStore.groups = groupsData;

      // Remove excessive success toast - groups loading should be silent
    } else {
      if ($toast) {
        $toast.warning("No groups found");
      }
    }
  } catch (error: unknown) {
    const { $toast } = useNuxtApp();
    if ($toast) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      $toast.error("Error fetching groups: " + errorMessage);
    }
  }
}

// Refresh data function
async function refreshData() {
  try {
    isLoading.value = true;

    // Load friends and groups
    await Promise.all([friendsStore.getFriends(), groupsStore.getGroups()]);

    // If no groups found, try direct API call as a fallback
    if (!groupsStore.groups || groupsStore.groups.length === 0) {
      await directAPICall();
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    groupsStore.error = errorMessage;
  } finally {
    isLoading.value = false;
  }
}

// Init component
onMounted(async () => {
  // Get the groups data
  await refreshData();

  // Add event listeners
  document.addEventListener("click", closeOnClickOutside);
  document.addEventListener("click", closeFriendsListOnClickOutside);
});

// Toggle friend selection for the group
const toggleFriendSelection = (friend: any) => {
  const friendId = friend.id;
  const index = selectedFriendIds.value.indexOf(friendId);
  if (index === -1) {
    selectedFriendIds.value.push(friendId);
  } else {
    selectedFriendIds.value.splice(index, 1);
  }
};

// Handle avatar upload button click
const handleAvatarUpload = () => {
  if (avatarInput.value) {
    avatarInput.value.click();
  }
};

// Process avatar file change
const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    avatarFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
};

// Remove avatar
const clearAvatar = () => {
  avatarFile.value = null;
  avatarPreview.value = null;
  if (avatarInput.value) {
    avatarInput.value.value = "";
  }
};

// Validate the new group form
const validateForm = () => {
  const formErrors: {
    name?: string;
    members?: string;
    avatar?: string;
    general?: string;
  } = {};

  if (!newGroup.value.name.trim()) {
    formErrors.name = "Group name is required";
  }

  if (selectedFriendIds.value.length === 0) {
    formErrors.members = "Please select at least one member";
  }

  errors.value = formErrors;
  return Object.keys(formErrors).length === 0;
};

// Handle create group
const handleCreateGroup = async () => {
  // Validate form
  if (!validateForm()) return;

  try {
    isCreating.value = true;

    // Create new group with the groups service
    await groupsStore.createGroup({
      name: newGroup.value.name,
      description: newGroup.value.description,
      members: selectedFriendIds.value,
      avatar: avatarFile.value,
    });

    if ($toast) {
      $toast.success("Group created successfully!");
    }

    // Reset form
    newGroup.value.name = "";
    newGroup.value.description = "";
    selectedFriendIds.value = [];
    avatarFile.value = null;
    avatarPreview.value = null;
    if (avatarInput.value) {
      avatarInput.value.value = "";
    }

    // Close modal
    showCreateGroupModal.value = false;
  } catch (error: any) {
    errors.value.general =
      error.message || "Failed to create group. Please try again.";
    if ($toast) {
      $toast.error(
        errors.value.general || "Failed to create group. Please try again."
      );
    }
  } finally {
    isCreating.value = false;
  }
};

// Open create group modal
const openCreateGroupModal = () => {
  showCreateGroupModal.value = true;

  // Reset form
  newGroup.value.name = "";
  newGroup.value.description = "";
  selectedFriendIds.value = [];
  avatarFile.value = null;
  avatarPreview.value = null;
  errors.value = {};
};

// Close modal when clicking outside
const closeOnClickOutside = (event: MouseEvent) => {
  if (
    showCreateGroupModal.value &&
    !(event.target as Element).closest(".bg-white")
  ) {
    showCreateGroupModal.value = false;
  }
};

// Close friends list when clicking outside
const closeFriendsListOnClickOutside = (event: MouseEvent) => {
  if (
    showFriendsList.value &&
    !(event.target as Element).closest("input") &&
    !(event.target as Element).closest(".absolute")
  ) {
    showFriendsList.value = false;
  }
};

// Cleanup
onUnmounted(() => {
  document.removeEventListener("click", closeOnClickOutside);
  document.removeEventListener("click", closeFriendsListOnClickOutside);

  // Clean up object URLs
  if (avatarPreview.value) {
    URL.revokeObjectURL(avatarPreview.value);
  }
});
</script>
