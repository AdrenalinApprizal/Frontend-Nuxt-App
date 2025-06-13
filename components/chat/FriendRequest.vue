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
  // Priority order: friendship_id > id > fallback
  return props.request.friendship_id || props.request.id || "";
});

// Enhanced debug logging with better structure
const debugInfo = computed(() => {
  const info = {
    rawRequest: props.request,
    extractedId: friendshipId.value,
    idSource: props.request.friendship_id ? 'friendship_id' : props.request.id ? 'id' : 'none',
    availableKeys: Object.keys(props.request || {}),
    hasValidId: !!friendshipId.value
  };
  
  console.log("[FriendRequest] Debug Info:", info);
  
  if (!info.hasValidId) {
    console.error("[FriendRequest] ❌ NO VALID ID FOUND - Accept/Reject will fail!");
    console.error("[FriendRequest] Available request data:", props.request);
  }
  
  return info;
});

// User data with better fallback handling
const userData = computed(() => {
  // Try multiple possible locations for user data
  const possibleUserData = 
    props.request.user || 
    props.request.sender || 
    props.request.friend || 
    props.request.from_user ||
    props.request;
    
  console.log("[FriendRequest] User data source:", possibleUserData);
  return possibleUserData;
});

const userName = computed(() => {
  // Try to get full name from first_name + last_name first
  if (userData.value?.first_name && userData.value?.last_name) {
    const fullName = `${userData.value.first_name} ${userData.value.last_name}`;
    console.log("[FriendRequest] Using first_name + last_name:", fullName);
    return fullName;
  }
  
  // Try just first_name if last_name is not available
  if (userData.value?.first_name) {
    console.log("[FriendRequest] Using first_name only:", userData.value.first_name);
    return userData.value.first_name;
  }
  
  // Fallback to other name fields
  const name = userData.value?.full_name ||
               userData.value?.name || 
               userData.value?.username || 
               userData.value?.display_name ||
               "Unknown User";
  
  console.log("[FriendRequest] Resolved user name:", name);
  return name;
});

const userAvatar = computed(() => {
  // Prioritize profile_picture_url from your API
  const avatar = userData.value?.profile_picture_url || 
                userData.value?.avatar_url ||
                userData.value?.avatar || 
                userData.value?.profile_pic ||
                userData.value?.profile_image ||
                null;
                
  console.log("[FriendRequest] Resolved user avatar:", avatar);
  console.log("[FriendRequest] Avatar field check:", {
    profile_picture_url: userData.value?.profile_picture_url,
    avatar_url: userData.value?.avatar_url,
    avatar: userData.value?.avatar,
    final_avatar: avatar
  });
  return avatar;
});

// Trigger debug info computation on mount
onMounted(() => {
  debugInfo.value; // This will trigger the computed property and logging
});

// Add reactive debugging to track changes
watch(() => props.request, (newRequest) => {
  console.log("[FriendRequest] 🔄 Request prop changed:", newRequest);
  debugInfo.value; // Re-trigger debug computation
}, { deep: true, immediate: true });
</script>