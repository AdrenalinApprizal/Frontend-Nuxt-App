<template>
  <div class="h-full flex flex-col p-6 bg-white">
    <!-- Header with title and action buttons -->
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-xl font-bold text-gray-800">Friends</h1>
      <div class="flex items-center space-x-2">
        <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <NotificationDropdown />
        </div>
        <button
          @click="showAddFriendPopup = true"
          class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors shadow-sm"
          aria-label="Add Friend"
        >
          <Icon name="lucide:user-plus" class="h-5 w-5" />
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
        placeholder="Search friends"
        class="pl-11 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-sm"
      />
      <div
        v-if="isSearchingFriends"
        class="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        <div
          class="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"
        ></div>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-if="friendsStore.isLoading"
      class="flex-1 flex flex-col items-center justify-center"
    >
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
      ></div>
      <p class="mt-2 text-sm text-gray-500">Loading friends...</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="friendsStore.error"
      class="flex-1 flex items-center justify-center"
    >
      <div class="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
        <p class="text-red-500 font-medium">{{ friendsStore.error }}</p>
        <button
          class="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm transition-colors"
          @click="refreshData"
        >
          Retry
        </button>
      </div>
    </div>

    <template v-else>
      <!-- Friend Requests Section - Collapsible -->
      <div
        v-if="incomingRequests.length > 0"
        class="mb-6 bg-blue-50 rounded-lg overflow-hidden border border-blue-100"
      >
        <div
          class="flex justify-between items-center p-3 cursor-pointer bg-blue-100 hover:bg-blue-200 transition-colors"
          @click="requestsHidden = !requestsHidden"
        >
          <h2 class="font-medium text-blue-800 text-sm flex items-center">
            <Icon name="fa:user-plus" class="mr-2 h-3.5 w-3.5" />
            Friend Requests
            <span
              class="ml-2 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full"
            >
              {{ incomingRequests.length }}
            </span>
          </h2>
          <button class="text-blue-700 hover:text-blue-900 p-1">
            <Icon
              :name="requestsHidden ? 'lucide:chevron-down' : 'lucide:chevron-up'"
              class="h-4 w-4"
            />
          </button>
        </div>

        <div v-if="!requestsHidden" class="p-3 space-y-2 bg-blue-50">
          <FriendRequest
            v-for="request in incomingRequests"
            :key="request.friendship_id || request.id || `request-${Math.random()}`"
            :request="request"
            @accept="handleAcceptRequest"
            @reject="handleRejectRequest"
          />
        </div>
      </div>

      <!-- Friends List Section -->
      <div class="flex-1 overflow-auto">
        <h2 class="font-medium text-gray-500 text-xs uppercase tracking-wider mb-3">
          {{ onlineFriendsCount > 0 ? "Online" : "All" }} Friends
          <span v-if="sortedFriends.length > 0" class="ml-2 text-gray-400">
            ({{ sortedFriends.length }})
          </span>
        </h2>

        <div
          v-if="sortedFriends.length === 0"
          class="h-64 flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-lg border border-gray-100"
        >
          <Icon name="fa:user" class="h-12 w-12 text-gray-300 mb-3" />
          <p class="text-gray-500 font-medium">
            {{
              searchQuery
                ? `No results for "${searchQuery}"`
                : "No friends yet"
            }}
          </p>
          <p class="text-sm text-gray-400 mt-2">
            Add friends to start chatting
          </p>
          <button
            @click="showAddFriendPopup = true"
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center text-sm"
          >
            <Icon name="lucide:user-plus" class="mr-2 h-3.5 w-3.5" />
            Add Friend
          </button>
        </div>

        <div v-else class="space-y-2.5">
          <div
            v-for="friend in sortedFriends"
            :key="friend.id"
            @click="handleFriendSelect(friend.id)"
            :class="`flex items-center p-3 rounded-xl transition-all cursor-pointer ${
              $route.path === `/chat/messages/${friend.id}`
                ? 'bg-blue-50 border border-blue-200 shadow-sm'
                : 'hover:bg-gray-50 border border-transparent'
            }`"
          >
            <!-- Friend avatar with status indicator -->
            <div class="relative mr-3">
              <div
                class="h-11 w-11 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center"
              >
                <img
                  v-if="friend.profile_picture_url || friend.avatar"
                  :src="friend.profile_picture_url || friend.avatar"
                  :alt="friend.name"
                  class="h-full w-full object-cover"
                  @error="handleImageError"
                />
                <Icon v-else name="fa:user" class="h-5 w-5 text-gray-500" />
              </div>

              <!-- Status indicator - only show for online users -->
              <div
                v-if="getFriendStatus(friend.id) === 'online'"
                class="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white"
              ></div>
            </div>

            <!-- Friend info -->
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center">
                <h3 class="font-semibold text-gray-900 truncate">
                  {{ getFriendDisplayName(friend) }}
                </h3>
                <span class="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {{
                    friend.last_active
                      ? formatLastActive(friend.last_active)
                      : formatLastActive(getLastActive(friend.id))
                  }}
                </span>
              </div>

              <div class="flex items-center mt-0.5">
                <!-- Status text -->
                <p class="text-xs text-gray-500 truncate flex-1">
                  {{
                    getFriendStatus(friend.id) === "online"
                      ? "Active now"
                      : friend.username
                      ? `@${friend.username}`
                      : friend.email || "offline"
                  }}
                </p>

                <!-- Unread count badge -->
                <span
                  v-if="friend.unread_count && friend.unread_count > 0"
                  class="inline-flex items-center justify-center px-2 py-0.5 ml-2 text-xs font-medium leading-none text-white bg-red-500 rounded-full"
                >
                  {{ friend.unread_count }}
                </span>

                <!-- Message icon for current chat -->
                <Icon
                  v-if="$route.path === `/chat/messages/${friend.id}`"
                  name="lucide:message-square"
                  class="text-blue-500 ml-1 h-3.5 w-3.5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Add Friend Popup - Enhanced styling -->
    <div
      v-if="showAddFriendPopup"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        class="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all"
      >
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            <Icon name="fa:user-plus" class="mr-2 h-5 w-5 text-blue-500" />
            Add a Friend
          </h2>
          <button
            type="button"
            @click="closeAddFriendPopup"
            class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <Icon name="fa:times" class="h-4 w-4" />
          </button>
        </div>

        <p class="text-sm text-gray-600 mb-4">
          You can add a friend with their username. It's case sensitive!
        </p>

        <form @submit.prevent="handleAddFriendByUsername" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="addByUsername"
                placeholder="Enter friend's username"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-10"
                :disabled="isAddingByUsername"
              />
              <div
                class="absolute left-3 top-1/2 transform -translate-y-1/2"
              >
                <Icon name="fa:user" class="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              @click="closeAddFriendPopup"
              class="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center"
              :disabled="!addByUsername.trim() || isAddingByUsername"
            >
              <div
                v-if="isAddingByUsername"
                class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"
              ></div>
              <Icon
                v-else
                name="lucide:user-plus"
                class="mr-2 h-4 w-4"
              />
              {{ isAddingByUsername ? "Sending..." : "Send Request" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFriendsStore } from "~/composables/useFriends";
import { usePresence } from "~/composables/usePresence";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/composables/useAuth";
import FriendRequest from "~/components/chat/FriendRequest.vue";

const route = useRoute();
const { $toast } = useNuxtApp();
const friendsStore = useFriendsStore();
const presence = usePresence(); // Add presence composable
const config = useRuntimeConfig();
const authStore = useAuthStore();

const searchQuery = ref("");
const showAddFriendPopup = ref(false);
const requestsHidden = ref(false);
const searchUserQuery = ref("");
const searchResults = ref<any[]>([]);
const isSearching = ref(false);
const isLoadingMore = ref(false);
const addByUsername = ref("");
const isAddingByUsername = ref(false);
let searchTimer: NodeJS.Timeout;

// On component mount, fetch friends and pending requests
onMounted(async () => {
  console.log("[FriendsList] Component mounted, fetching data...");

  try {
    // Get friends data first
    await friendsStore.getFriends();
    console.log("[FriendsList] Friends data fetched");

    // Then explicitly fetch pending requests
    const requestsResponse = await friendsStore.getPendingRequests();
    console.log(
      `[FriendsList] Pending requests fetched: ${friendsStore.pendingRequests.length} found`
    );

    // Make sure pending requests section is visible if there are requests
    if (friendsStore.pendingRequests.length > 0) {
      requestsHidden.value = false;
      console.log("[FriendsList] Showing pending requests section");
    }

    // Update friends status
    if (friendsStore.friends.length > 0) {
      updateFriendsStatus();
    }
  } catch (err) {
    console.error("[FriendsList] Error during initial data fetch:", err);
  }

  // Connect to presence WebSocket if user is authenticated
  if (authStore.isAuthenticated && authStore.token) {
    presence.connectWebSocket(authStore.token);
    await presence.setInitialStatus("online");
  }
});

// Disconnect WebSocket on component unmount
onUnmounted(() => {
  // Don't disconnect here since other components might need the connection
  // Just update the status to offline when navigating away from this component
  if (presence.isWsConnected) {
    presence.updateStatus("offline");
  }
});

// Watch for changes in friends list to update status
watch(
  () => friendsStore.friends,
  (newFriends) => {
    if (newFriends.length > 0) {
      updateFriendsStatus();
    }
  },
  { deep: true }
);

// Function to update all friends status
async function updateFriendsStatus() {
  try {
    const userIds = friendsStore.friends.map((friend) => friend.id);
    if (userIds.length > 0) {
      await presence.getUsersStatus(userIds);
    }
  } catch (err) {
    console.error("Error fetching friends' presence status:", err);
  }
}

// Refresh data function
async function refreshData() {
  try {
    await Promise.all([
      friendsStore.getFriends(),
      friendsStore.getPendingRequests(),
    ]);

    // After getting friends, update their presence status
    if (friendsStore.friends.length > 0) {
      updateFriendsStatus();
    }

    // Show pending requests section if there are any
    if (friendsStore.pendingRequests.length > 0) {
      requestsHidden.value = false;
    }
  } catch (err) {
    console.error("Error loading friends data:", err);
  }
}

// Derived friends list from the store
const friends = computed(() => friendsStore.friends);
const pendingRequests = computed(() => friendsStore.pendingRequests);

// Handler for accepting friend request
const handleAcceptRequest = async (requestId: string) => {
  try {
    const result = await friendsStore.acceptFriendRequest(requestId);
    $toast.success(result.message);
  } catch (err: any) {
    $toast.error(err.message || "Failed to accept friend request");
  }
};

// Handler for rejecting friend request
const handleRejectRequest = async (requestId: string) => {
  try {
    const result = await friendsStore.rejectFriendRequest(requestId);
    $toast.success(result.message);
  } catch (err: any) {
    $toast.error(err.message || "Failed to reject friend request");
  }
};

// Debounced search function
function debounceSearchUsers() {
  clearTimeout(searchTimer);
  if (!searchUserQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  searchTimer = setTimeout(async () => {
    try {
      searchResults.value = await friendsStore.searchUsers(
        searchUserQuery.value
      );
    } catch (err) {
      console.error("Error searching users:", err);
      $toast.error("Failed to search users");
    } finally {
      isSearching.value = false;
    }
  }, 300);
}

// Send friend request function
async function sendFriendRequest(userId: string) {
  try {
    const user = searchResults.value.find((u) => u.id === userId);

    // If we can't find the user in search results, this shouldn't happen but just in case
    if (!user) {
      $toast.error("User not found");
      return;
    }

    const result = await friendsStore.sendFriendRequest(userId);
    $toast.success("Friend request sent!");

    // Remove the user from searchResults
    searchResults.value = searchResults.value.filter(
      (user) => user.id !== userId
    );

    if (searchResults.value.length === 0) {
      closeAddFriendPopup();
    }
  } catch (err: any) {
    $toast.error(err.message || "Failed to send friend request");
  }
}

// Load more search results function
async function loadMoreResults() {
  try {
    isLoadingMore.value = true;
    const moreResults = await friendsStore.loadMoreSearchResults();
    searchResults.value = [...searchResults.value, ...moreResults];
  } catch (err) {
    console.error("Error loading more search results:", err);
    $toast.error("Failed to load more results");
  } finally {
    isLoadingMore.value = false;
  }
}

// Handle add friend by username
async function handleAddFriendByUsername() {
  if (!addByUsername.value.trim()) return;

  isAddingByUsername.value = true;
  try {
    const result = await friendsStore.addFriendByUsername(
      addByUsername.value.trim()
    );
    $toast.success(result.message);

    // Refresh permintaan pertemanan yang tertunda
    await friendsStore.getPendingRequests();
    console.log("[FriendsList] Refreshed pending requests after adding friend");
    console.log(
      "[FriendsList] Current pending requests:",
      friendsStore.pendingRequests
    );

    // Set requestsHidden to false to memastikan bagian permintaan pertemanan terlihat
    if (friendsStore.pendingRequests.length > 0) {
      requestsHidden.value = false;
    }

    // Clear the input field
    addByUsername.value = "";
  } catch (err: any) {
    $toast.error(err.message || "Failed to send friend request");
  } finally {
    isAddingByUsername.value = false;
  }
}

// Close add friend popup and reset state
function closeAddFriendPopup() {
  showAddFriendPopup.value = false;
  searchUserQuery.value = "";
  searchResults.value = [];
  addByUsername.value = "";
}

// Filter friends based on search query
const filteredFriends = computed(() => {
  // If no search query, return all friends
  if (!searchQuery.value.trim()) {
    return friends.value;
  }

  // Otherwise, return the filtered results
  return friends.value.filter((friend) => {
    const friendName = getFriendDisplayName(friend);
    return friendName.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// Add debounced search function for friends
let friendSearchTimer: NodeJS.Timeout;
const isSearchingFriends = ref(false);
const searchedFriends = ref<any[]>([]);

function searchFriendsDebounced() {
  clearTimeout(friendSearchTimer);

  // If search query is empty, just use the regular friends list
  if (!searchQuery.value.trim()) {
    searchedFriends.value = []; // Clear search results
    return;
  }

  isSearchingFriends.value = true;
  friendSearchTimer = setTimeout(async () => {
    try {
      // Use the new searchFriends function with the API endpoint
      const results = await friendsStore.searchFriends(searchQuery.value);
      searchedFriends.value = results;
    } catch (err) {
      console.error("Error searching friends:", err);
      // Fallback to client-side filtering on error
      searchedFriends.value = [];
    } finally {
      isSearchingFriends.value = false;
    }
  }, 300);
}

// Watch for changes in the search query to trigger API search
watch(
  () => searchQuery.value,
  (newVal) => {
    if (newVal.trim()) {
      searchFriendsDebounced();
    } else {
      searchedFriends.value = []; // Clear search results when query is empty
    }
  }
);

// Use either API search results or filtered friends
const displayedFriends = computed(() => {
  // If we have API search results, use those
  if (searchedFriends.value.length > 0) {
    return searchedFriends.value;
  }

  // Otherwise, use the client-side filtered list
  return filteredFriends.value;
});

// Get friend presence status
function getFriendStatus(friendId: string): "online" | "offline" {
  return presence.getStatus(friendId);
}

// Get last active time
function getLastActive(friendId: string): string | null {
  return presence.getLastActive(friendId);
}

// Format last active time
function formatLastActive(timestamp: string | null): string {
  if (!timestamp) return "Offline";

  const lastActive = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - lastActive.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

// Sort friends alphabetically (A-Z), but with online friends first
const sortedFriends = computed(() => {
  return [...displayedFriends.value].sort((a, b) => {
    // Get presence status
    const statusA = getFriendStatus(a.id);
    const statusB = getFriendStatus(b.id);

    // Online users first
    if (statusA === "online" && statusB !== "online") return -1;
    if (statusB === "online" && statusA !== "online") return 1;

    // If status is the same, sort alphabetically
    return a.name.localeCompare(b.name);
  });
});

// Filter only incoming friend requests
const incomingRequests = computed(() => {
  console.log("[FriendsList] Computing incoming requests...");
  console.log("[FriendsList] Raw pending requests:", friendsStore.pendingRequests);
  
  const currentUserId = authStore.user?.id;
  console.log("[FriendsList] Current user ID:", currentUserId);
  
  const filtered = friendsStore.pendingRequests?.filter((request) => {
    console.log("[FriendsList] Processing request:", request);
    
    if (!request) {
      console.log("[FriendsList] Request is null/undefined, skipping");
      return false;
    }

    // Primary check: direction field (this should match your API response)
    if (request.direction === "incoming") {
      console.log("[FriendsList] ✅ Request marked as incoming via direction field");
      return true;
    }
    
    // Secondary check: type field for compatibility
    if (request.type === "received") {
      console.log("[FriendsList] ✅ Request marked as incoming via type field");
      return true;
    }
    
    // Tertiary check: recipient_id match (if available)
    if (currentUserId && request.recipient_id === currentUserId) {
      console.log("[FriendsList] ✅ Request is incoming - current user is recipient");
      return true;
    }
    
    // Final fallback: if no direction/type specified but status is pending
    // This handles cases where API doesn't provide direction/type explicitly
    if (!request.direction && !request.type && request.status === "pending") {
      console.log("[FriendsList] ⚠️ Request has no direction/type, assuming incoming based on pending status");
      return true;
    }

    console.log("[FriendsList] ❌ Request doesn't match incoming criteria, excluding");
    return false;
  }) || [];
  
  console.log("[FriendsList] Filtered incoming requests:", filtered);
  console.log("[FriendsList] Incoming requests count:", filtered.length);
  
  return filtered;
});

// Count online friends
const onlineFriendsCount = computed(() => {
  return sortedFriends.value.filter(
    (friend) => getFriendStatus(friend.id) === "online"
  ).length;
});

// Handle friend selection with enhanced functionality
const handleFriendSelect = async (friendId: string) => {
  try {
    // Find the friend data to get the name
    const friend = sortedFriends.value.find((f) => f.id === friendId);

    // Construct friend name with multiple fallbacks
    let friendName = "";
    if (friend) {
      friendName = getFriendDisplayName(friend);
    }

    // Debug logging
    console.log("🔍 [FriendsList] handleFriendSelect called:", {
      friendId,
      friend,
      friendName,
      sortedFriendsCount: sortedFriends.value.length,
    });

    // Navigate to the chat with this friend
    const url = `/chat/messages/${friendId}${
      friendName ? `?name=${encodeURIComponent(friendName)}` : ""
    }`;
    console.log("🚀 [FriendsList] Navigating to URL:", url);
    
    await navigateTo(url);
  } catch (err) {
    console.error("[FriendsList] Error navigating to friend chat:", err);
    $toast.error("Failed to open chat");
  }
};

// Get friend display name with fallbacks
function getFriendDisplayName(friend: any): string {
  if (friend.name) {
    return friend.name;
  } else if (friend.first_name && friend.last_name) {
    return `${friend.first_name} ${friend.last_name}`;
  } else if (friend.first_name) {
    return friend.first_name;
  } else if (friend.display_name) {
    return friend.display_name;
  } else if (friend.full_name) {
    return friend.full_name;
  } else if (friend.username) {
    return friend.username;
  }
  return "Unknown User";
}

// Handle image loading errors
function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  if (target && target.parentElement) {
    target.style.display = "none";
    target.parentElement.classList.add("avatar-error");
    // The Icon component will show as fallback
  }
}
</script>
