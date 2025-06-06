<template>
  <div
    class="w-80 h-full bg-white border-l border-gray-200 flex flex-col overflow-auto"
  >
    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
      <h3 class="font-medium text-gray-800">Profile</h3>
      <button
        @click="$emit('close')"
        class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Icon name="fa:times" class="h-4 w-4" />
      </button>
    </div>

    <!-- Profile details -->
    <div class="flex flex-col items-center p-6 border-b border-gray-200">
      <div class="relative mb-4">
        <div
          class="h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
        >
          <img
            v-if="recipient.avatar || recipient.profile_picture_url"
            :src="recipient.avatar || recipient.profile_picture_url"
            :alt="recipient.name"
            class="h-full w-full object-cover"
          />
          <Icon v-else name="fa:user" class="h-10 w-10 text-gray-400" />
        </div>
        <span
          v-if="recipient.status === 'online'"
          class="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"
        ></span>
      </div>

      <h2 class="text-xl font-semibold text-gray-900">{{ recipient.name }}</h2>
      <p class="text-sm text-gray-500 mt-1">
        {{ recipient.status === "online" ? "Online" : "Offline" }}
      </p>
    </div>

    <!-- Contact information -->
    <div class="p-6 border-b border-gray-200">
      <h4 class="text-sm font-medium text-gray-900 mb-4">
        Contact Information
      </h4>

      <div class="mb-4">
        <p class="text-xs text-gray-500 mb-1">Email</p>
        <p class="text-sm text-gray-800 flex items-center">
          <Icon name="fa:envelope" class="h-3 w-3 mr-2 text-gray-400" />
          {{ recipient.email }}
        </p>
      </div>

      <div v-if="recipient.phone" class="mb-4">
        <p class="text-xs text-gray-500 mb-1">Phone</p>
        <p class="text-sm text-gray-800 flex items-center">
          <Icon name="fa:phone" class="h-3 w-3 mr-2 text-gray-400" />
          {{ recipient.phone }}
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="p-6">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Actions</h4>

      <!-- Friend action buttons based on relationship status -->
      <div v-if="!isFriend && !hasPendingRequest" class="mb-2">
        <button
          @click="handleSendFriendRequest"
          :disabled="friendsStore.isLoading"
          class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <Icon name="fa:user-plus" class="h-3 w-3 mr-2" />
          Add as friend
          <span v-if="friendsStore.isLoading" class="ml-2">
            <Icon name="fa:circle-o-notch" class="h-3 w-3 animate-spin" />
          </span>
        </button>
      </div>

      <div v-else-if="hasPendingRequest" class="mb-2">
        <button
          disabled
          class="w-full bg-gray-200 text-gray-600 p-2 rounded-md flex items-center justify-center cursor-not-allowed"
        >
          <Icon name="fa:clock-o" class="h-3 w-3 mr-2" />
          Friend request pending
        </button>
      </div>

      <div v-else-if="isFriend" class="mb-2">
        <button
          @click="handleRemoveFriend"
          :disabled="friendsStore.isLoading"
          class="w-full bg-red-50 text-red-600 p-2 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center"
        >
          <Icon name="fa:user-times" class="h-3 w-3 mr-2" />
          Remove friend
          <span v-if="friendsStore.isLoading" class="ml-2">
            <Icon name="fa:circle-o-notch" class="h-3 w-3 animate-spin" />
          </span>
        </button>
      </div>

      <!-- Block/Unblock User Action -->
      <div class="mb-2">
        <button
          v-if="!isBlocked"
          @click="handleBlockUser"
          :disabled="friendsStore.isLoading"
          class="w-full bg-gray-50 text-gray-600 p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
        >
          <Icon name="fa:ban" class="h-3 w-3 mr-2" />
          Block user
          <span v-if="friendsStore.isLoading" class="ml-2">
            <Icon name="fa:circle-o-notch" class="h-3 w-3 animate-spin" />
          </span>
        </button>

        <button
          v-else
          @click="handleUnblockUser"
          :disabled="friendsStore.isLoading"
          class="w-full bg-green-50 text-green-600 p-2 rounded-md hover:bg-green-100 transition-colors flex items-center justify-center"
        >
          <Icon name="fa:check" class="h-3 w-3 mr-2" />
          Unblock user
          <span v-if="friendsStore.isLoading" class="ml-2">
            <Icon name="fa:circle-o-notch" class="h-3 w-3 animate-spin" />
          </span>
        </button>
      </div>

      <button
        class="w-full bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-100 transition-colors mb-2 flex items-center justify-center"
      >
        <Icon name="fa:star" class="h-3 w-3 mr-2" />
        Add to favorites
      </button>
    </div>

    <!-- Media, Links, and Docs (Optional) -->
    <div class="p-6 border-t border-gray-200 mt-auto">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Shared Media</h4>

      <div class="grid grid-cols-3 gap-2">
        <div
          v-for="i in 3"
          :key="i"
          class="h-16 w-full bg-gray-100 rounded-md flex items-center justify-center text-gray-400"
        >
          <Icon name="fa:image" class="h-6 w-6" />
        </div>
      </div>

      <div class="mt-3 text-center">
        <button class="text-xs text-blue-500 hover:underline">
          View all shared files
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFriendsStore } from "~/composables/useFriends";
import { useNuxtApp } from "#app";

interface Recipient {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profile_picture_url?: string;
  status: "online" | "offline" | "busy";
  phone?: string;
}

const props = defineProps<{
  recipient: Recipient;
}>();

// Use the toast plugin via useNuxtApp
const { $toast } = useNuxtApp();
const friendsStore = useFriendsStore();

defineEmits(["close"]);

// Check if user is already a friend
const isFriend = computed(() => {
  return friendsStore.friends.some(
    (friend) => friend.id === props.recipient.id
  );
});

// Check if there's a pending friend request
const hasPendingRequest = computed(() => {
  return friendsStore.pendingRequests.some(
    (request) =>
      (request.sender_id === props.recipient.id ||
        request.recipient_id === props.recipient.id) &&
      request.status === "pending"
  );
});

// Check if user is blocked
const isBlocked = computed(() => {
  return friendsStore.blockedUsers.some(
    (user) => user.id === props.recipient.id
  );
});

// Handle sending friend request
async function handleSendFriendRequest() {
  try {
    await friendsStore.sendFriendRequest(props.recipient.id);
    $toast.success("Friend request sent successfully!");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send friend request";
    $toast.error(errorMessage);
  }
}

// Handle removing friend
async function handleRemoveFriend() {
  try {
    await friendsStore.removeFriend(props.recipient.id);
    $toast.success("Friend removed successfully");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to remove friend";
    $toast.error(errorMessage);
  }
}

// Handle blocking user
async function handleBlockUser() {
  try {
    await friendsStore.blockUser(props.recipient.id);
    $toast.success("User blocked successfully");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to block user";
    $toast.error(errorMessage);
  }
}

// Handle unblocking user
async function handleUnblockUser() {
  try {
    await friendsStore.unblockUser(props.recipient.id);
    $toast.success("User unblocked successfully");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to unblock user";
    $toast.error(errorMessage);
  }
}

// Ensure we have the latest data
onMounted(async () => {
  try {
    await Promise.all([
      friendsStore.getFriends(),
      friendsStore.getPendingRequests(),
      friendsStore.getBlockedUsers(),
    ]);
  } catch (error) {
    console.error("Error loading friend data:", error);
  }
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
