<template>
  <div
    class="p-3 bg-white rounded-md border border-gray-200 shadow-sm flex items-center gap-3"
  >
    <!-- User avatar -->
    <div
      class="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center"
    >
      <img
        v-if="userAvatar"
        :src="userAvatar"
        :alt="userName"
        class="h-full w-full object-cover"
      />
      <Icon v-else name="fa:user" class="h-5 w-5 text-gray-500" />
    </div>

    <!-- User info -->
    <div class="flex-grow">
      <h4 class="font-medium text-sm text-gray-800">{{ userName }}</h4>
      <p class="text-xs text-gray-500">Wants to be your friend</p>
    </div>

    <!-- Action buttons -->
    <div class="flex space-x-2">
      <button
        @click="$emit('reject', friendshipId)"
        class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Reject"
      >
        <Icon name="fa:times" class="h-4 w-4 text-gray-500" />
      </button>
      <button
        @click="$emit('accept', friendshipId)"
        class="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
        aria-label="Accept"
      >
        <Icon name="fa:check" class="h-4 w-4 text-white" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FriendRequestProps {
  request: any; // Using any type since it handles different response formats
}

const props = defineProps<FriendRequestProps>();

defineEmits<{
  accept: [friendshipId: string];
  reject: [friendshipId: string];
}>();

// Extract the correct ID to use for actions
const friendshipId = computed(() => {
  return props.request.friendship_id || props.request.id || "";
});

// Enhanced debug logging
console.log("[FriendRequest] ===== COMPONENT DEBUG =====");
console.log("[FriendRequest] Raw request object:", props.request);
console.log("[FriendRequest] request.friendship_id:", props.request.friendship_id);
console.log("[FriendRequest] request.id:", props.request.id);
console.log("[FriendRequest] Extracted friendshipId:", friendshipId.value);
console.log("[FriendRequest] friendshipId type:", typeof friendshipId.value);
console.log("[FriendRequest] friendshipId length:", friendshipId.value?.length);
console.log("[FriendRequest] All request keys:", Object.keys(props.request));

// Additional validation
if (!friendshipId.value) {
  console.error("[FriendRequest] WARNING: No valid friendship ID found!");
  console.error("[FriendRequest] This will cause accept/reject to fail");
}

// User data might be in different fields depending on API response format
const userData = computed(() => {
  return props.request.user || props.request.friend || props.request.sender || props.request;
});

const userName = computed(() => {
  return userData.value.name || userData.value.username || "Unknown User";
});

const userAvatar = computed(() => {
  return userData.value.avatar || userData.value.profile_picture_url || userData.value.profile_pic || null;
});
</script>