<template>
  <div
    class="w-80 h-full bg-white border-l border-gray-200 flex flex-col overflow-auto"
  >
    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
      <h3 class="font-medium text-gray-800">Group Info</h3>
      <button
        @click="$emit('close')"
        class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Icon name="fa:times" class="h-4 w-4" />
      </button>
    </div>

    <!-- Group details -->
    <div class="flex flex-col items-center p-6 border-b border-gray-200">
      <div class="mb-4">
        <div
          class="h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
        >
          <img
            v-if="group.avatar"
            :src="group.avatar"
            :alt="group.name"
            class="h-full w-full object-cover"
          />
          <Icon v-else name="fa:users" class="h-10 w-10 text-gray-400" />
        </div>
      </div>

      <h2 class="text-xl font-semibold text-gray-900">{{ group.name }}</h2>
      <p class="text-sm text-gray-500 mt-1">{{ group.memberCount }} members</p>
    </div>

    <!-- Group description -->
    <div class="p-6 border-b border-gray-200">
      <h4 class="text-sm font-medium text-gray-900 mb-2">Description</h4>
      <p class="text-sm text-gray-700">
        {{ group.description || "No description provided" }}
      </p>

      <div class="mt-4">
        <p class="text-xs text-gray-500 mb-1">Created</p>
        <p class="text-sm text-gray-800">{{ group.createdAt }}</p>
      </div>
    </div>

    <!-- Members list -->
    <div class="p-6 flex-1 overflow-auto">
      <div class="flex justify-between items-center mb-4">
        <h4 class="text-sm font-medium text-gray-900">
          Members ({{ group.members?.length || 0 }})
        </h4>
        <button
          v-if="isAdmin"
          class="text-xs text-blue-500 hover:text-blue-700"
          @click="showAddMembers = true"
        >
          Add Members
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="member in group.members"
          :key="member.id"
          class="flex items-center justify-between"
        >
          <div class="flex items-center">
            <div class="relative">
              <div
                class="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center mr-3"
              >
                <img
                  v-if="member.avatar"
                  :src="member.avatar"
                  :alt="member.name"
                  class="h-full w-full object-cover"
                />
                <Icon v-else name="fa:user" class="h-4 w-4 text-gray-400" />
              </div>
              <span
                v-if="member.status === 'online'"
                class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"
              ></span>
            </div>

            <div>
              <div class="flex items-center">
                <p class="text-sm font-medium text-gray-800">
                  {{ member.name }}
                </p>
                <span
                  v-if="member.role === 'admin'"
                  class="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded"
                >
                  Admin
                </span>
                <span
                  v-if="member.isBlocked"
                  class="ml-2 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded"
                >
                  Blocked
                </span>
              </div>
              <p class="text-xs text-gray-500">
                {{ member.status === "online" ? "Online" : "Offline" }}
              </p>
            </div>
          </div>

          <div v-if="isAdmin && !isSelf(member.id)" class="relative">
            <button
              @click="toggleMemberMenu(member.id)"
              class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <Icon name="fa:ellipsis-v" class="h-3 w-3" />
            </button>

            <div
              v-if="activeMemberMenu === member.id"
              class="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 py-1"
            >
              <button
                @click="toggleMemberRole(member)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Icon
                  :name="member.role === 'admin' ? 'fa:user' : 'fa:crown'"
                  class="h-3 w-3 mr-2"
                />
                {{ member.role === "admin" ? "Remove as admin" : "Make admin" }}
              </button>
              <button
                @click="toggleMemberBlock(member)"
                class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                :class="member.isBlocked ? 'text-green-600' : 'text-red-600'"
              >
                <Icon
                  :name="member.isBlocked ? 'fa:check' : 'fa:ban'"
                  class="h-3 w-3 mr-2"
                />
                {{ member.isBlocked ? "Unblock" : "Block" }}
              </button>
              <button
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <Icon name="fa:sign-out" class="h-3 w-3 mr-2" />
                Remove from group
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Group actions -->
    <div class="p-6 border-t border-gray-200">
      <button
        v-if="!isAdmin"
        @click="leaveGroup"
        class="w-full bg-red-50 text-red-600 p-2 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center"
      >
        <Icon name="fa:sign-out" class="h-3 w-3 mr-2" />
        Leave group
      </button>
      <button
        v-else
        @click="deleteGroup"
        class="w-full bg-red-50 text-red-600 p-2 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center"
      >
        <Icon name="fa:trash" class="h-3 w-3 mr-2" />
        Delete group
      </button>
    </div>

    <!-- Add members popup -->
    <div
      v-if="showAddMembers"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-96 max-w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium text-gray-800">Add Members</h3>
          <button
            @click="showAddMembers = false"
            class="p-1 hover:bg-gray-100 rounded-full"
          >
            <Icon name="fa:times" class="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div class="mb-4">
          <input
            v-model="searchFriend"
            type="text"
            placeholder="Search friends..."
            class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="max-h-60 overflow-auto mb-4">
          <div
            v-for="friend in filteredFriends"
            :key="friend.id"
            class="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
          >
            <div class="flex items-center">
              <div
                class="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center mr-2"
              >
                <img
                  v-if="friend.avatar"
                  :src="friend.avatar"
                  :alt="friend.name"
                  class="h-full w-full object-cover"
                />
                <Icon v-else name="fa:user" class="h-4 w-4 text-gray-400" />
              </div>
              <p class="text-sm font-medium text-black">{{ friend.name }}</p>
            </div>
            <button
              @click="selectFriend(friend)"
              class="p-1 rounded-full"
              :class="
                friend.selected
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-500'
              "
            >
              <Icon
                :name="friend.selected ? 'fa:check' : 'fa:plus'"
                class="h-3 w-3"
              />
            </button>
          </div>

          <div
            v-if="filteredFriends.length === 0"
            class="py-4 text-center text-gray-500 text-sm"
          >
            No friends found
          </div>
        </div>

        <div class="flex justify-end">
          <button
            @click="showAddMembers = false"
            class="px-4 py-2 mr-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="addSelectedMembers"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            :disabled="selectedFriends.length === 0"
            :class="{
              'opacity-50 cursor-not-allowed': selectedFriends.length === 0,
            }"
          >
            Add ({{ selectedFriends.length }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useNuxtApp } from "#app";
import { useGroupsStore } from "~/composables/useGroups";
import { useFriendsStore } from "~/composables/useFriends";
import { useAuthStore } from "~/composables/useAuth";

interface GroupMember {
  id: string;
  name: string;
  status: "online" | "offline";
  role: "admin" | "member";
  avatar?: string;
  isBlocked?: boolean;
}

interface Group {
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
  avatar?: string;
  selected?: boolean;
}

const props = defineProps<{
  group: Group;
}>();

const emit = defineEmits(["close", "update:group"]);

// State
const showAddMembers = ref(false);
const activeMemberMenu = ref<string | null>(null);
const searchFriend = ref("");

// Get current user from auth store
const authStore = useAuthStore();
const currentUserId = computed(() => authStore.user?.id || "");

// Check if current user is an admin
const isAdmin = computed(() => {
  return props.group.members.some(
    (member) => member.id === currentUserId.value && member.role === "admin"
  );
});

// Get friends from the store
const friendsStore = useFriendsStore();
const friends = computed<Friend[]>(() => {
  // Fetch friends if not already loaded
  if (friendsStore.friends.length === 0) {
    friendsStore.getFriends();
  }

  return friendsStore.friends.map((friend) => ({
    id: friend.id,
    name: friend.name || "Unknown",
    avatar: friend.profile_picture_url,
    selected: false,
  }));
});

// Filter friends that are not in the group already
const filteredFriends = computed(() => {
  const memberIds = new Set(props.group.members.map((member) => member.id));

  return friends.value
    .filter((friend) => !memberIds.has(friend.id))
    .filter((friend) =>
      friend.name.toLowerCase().includes(searchFriend.value.toLowerCase())
    );
});

// Get selected friends
const selectedFriends = computed(() => {
  return friends.value.filter((friend) => friend.selected);
});

// Make sure we load friends data
onMounted(() => {
  if (friendsStore.friends.length === 0) {
    friendsStore.getFriends();
  }
});

// Check if member is current user
const isSelf = (memberId: string) => {
  return memberId === currentUserId.value;
};

// Toggle member menu
const toggleMemberMenu = (memberId: string) => {
  activeMemberMenu.value =
    activeMemberMenu.value === memberId ? null : memberId;
};

// Toggle member role (admin/member)
const toggleMemberRole = (member: GroupMember) => {
  const updatedMembers = props.group.members.map((m) => {
    if (m.id === member.id) {
      return {
        ...m,
        role: m.role === "admin" ? "member" : "admin",
      };
    }
    return m;
  });

  emit("update:group", { ...props.group, members: updatedMembers });
  activeMemberMenu.value = null;
};

// Initialize Nuxt app to use toast notifications
const { $toast } = useNuxtApp();

// Initialize the GroupsStore
const groupsStore = useGroupsStore();

// Toggle block status for a member
const toggleMemberBlock = async (member: GroupMember) => {
  try {
    if (member.isBlocked) {
      // Call API to unblock the user
      await groupsStore.unblockGroupUser(props.group.id, member.id);
    } else {
      // Call API to block the user
      await groupsStore.blockGroupUser(props.group.id, member.id);
    }

    // Update local state
    const updatedMembers = props.group.members.map((m) => {
      if (m.id === member.id) {
        return {
          ...m,
          isBlocked: !m.isBlocked,
        };
      }
      return m;
    });

    emit("update:group", { ...props.group, members: updatedMembers });
    activeMemberMenu.value = null;

    // Show success notification
    if ($toast) {
      $toast.success(
        member.isBlocked
          ? "User unblocked successfully"
          : "User blocked successfully"
      );
    }
  } catch (error: any) {
    if ($toast) {
      $toast.error(error.message || "Failed to update block status");
    }
  }
};

// Select/deselect a friend
const selectFriend = (friend: Friend) => {
  const index = friends.value.findIndex((f) => f.id === friend.id);
  if (index !== -1) {
    friends.value[index].selected = !friend.selected;
  }
};

// Add selected friends to the group
const addSelectedMembers = () => {
  const newMembers = selectedFriends.value.map((friend) => ({
    id: friend.id,
    name: friend.name,
    avatar: friend.avatar,
    status: "offline" as const,
    role: "member" as const,
  }));

  const updatedGroup = {
    ...props.group,
    members: [...props.group.members, ...newMembers],
    memberCount: props.group.memberCount + newMembers.length,
  };

  emit("update:group", updatedGroup);

  // Reset the selected state and close the dialog
  friends.value.forEach((friend) => {
    friend.selected = false;
  });
  showAddMembers.value = false;
};

// Leave group
const leaveGroup = async () => {
  try {
    await groupsStore.leaveGroup(props.group.id);
    $toast.success("You have left the group");
    emit("close");
  } catch (error: any) {
    $toast.error(error.message || "Failed to leave the group");
  }
};

// Delete group
const deleteGroup = async () => {
  try {
    // Since groupsStore doesn't have a deleteGroup method, we'll use the API directly
    // and then update our local state
    const { $api } = useNuxtApp();
    await $api.delete(`/groups/${props.group.id}`);

    // Update local state by removing the group from the store
    groupsStore.$patch({
      groups: groupsStore.groups.filter((g) => g.id !== props.group.id),
    });

    $toast.success("Group deleted successfully");
    emit("close");
  } catch (error: any) {
    $toast.error(error.message || "Failed to delete the group");
  }
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (
    activeMemberMenu.value &&
    !event.composedPath().some((el) => {
      const element = el as HTMLElement;
      return element.classList?.contains("member-menu");
    })
  ) {
    activeMemberMenu.value = null;
  }
};

// Setup event listener
onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

// Clean up event listener
onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style scoped>
/* Animation for profile sidebar */
:deep(.slide-enter-active),
:deep(.slide-leave-active) {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

:deep(.slide-enter-from),
:deep(.slide-leave-to) {
  transform: translateX(100%);
  opacity: 0;
}
</style>
