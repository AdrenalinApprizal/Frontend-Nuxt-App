<template>
  <div class="h-full flex flex-col p-6 bg-white">
    <!-- Header with title and action buttons -->
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-xl font-bold text-gray-800">Friends</h1>
      <div class="flex items-center space-x-2">
        <NotificationDropdown />
        <button
          @click="showAddFriendPopup = true"
          class="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
          aria-label="Add Friend"
        >
          <Icon name="lucide:user-plus" class="h-4 w-4" />
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
    </div>

    <!-- Loading state -->
    <div
      v-if="friendsStore.isLoading"
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
      v-else-if="friendsStore.error"
      class="flex-1 flex items-center justify-center"
    >
      <div class="flex flex-col items-center text-center">
        <Icon name="lucide:alert-triangle" class="h-8 w-8 text-red-500 mb-2" />
        <p class="text-red-500">{{ friendsStore.error }}</p>
        <button
          @click="refreshData"
          class="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    </div>

    <template v-else>
      <!-- Friend Requests Section -->
      <div v-if="pendingRequests.length > 0" class="mb-5">
        <div v-if="requestsHidden">
          <!-- Collapsed view - shows a summary with count -->
          <div
            class="border border-blue-200 rounded-xl shadow-sm overflow-hidden cursor-pointer hover:bg-blue-50 transition-all"
            @click="requestsHidden = false"
          >
            <div class="p-4 flex items-center justify-between bg-white">
              <div class="flex items-center space-x-3">
                <div class="w-1 h-6 bg-blue-500 rounded-r"></div>
                <div class="flex flex-col">
                  <div class="flex items-center">
                    <span class="font-semibold text-gray-800 text-sm">
                      Friend Requests
                    </span>
                    <span
                      class="ml-2 bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ pendingRequests.length }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">
                    {{
                      pendingRequests.length === 1
                        ? `${
                            pendingRequests[0].sender?.name || "Someone"
                          } wants to be your friend`
                        : `${
                            pendingRequests[0].sender?.name || "Someone"
                          } and ${pendingRequests.length - 1} other${
                            pendingRequests.length > 2 ? "s" : ""
                          }`
                    }}
                  </p>
                </div>
              </div>
              <div class="text-blue-500">
                <Icon name="lucide:chevron-down" class="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <!-- Expanded view - shows all friend requests -->
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center">
              <div class="w-1 h-6 bg-blue-500 rounded-r mr-2"></div>
              <h2 class="font-semibold text-gray-800 text-sm">
                Friend Requests
                <span
                  class="ml-1 text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full"
                >
                  {{ pendingRequests.length }}
                </span>
              </h2>
            </div>
            <button
              @click="requestsHidden = true"
              class="text-xs text-blue-500 hover:text-blue-700 transition-colors flex items-center"
            >
              <span>Collapse</span>
              <Icon name="lucide:chevron-up" class="h-3 w-3 ml-1" />
            </button>
          </div>
          <div
            class="border border-blue-200 rounded-xl shadow-sm divide-y divide-gray-200 overflow-hidden"
          >
            <div
              v-for="request in pendingRequests"
              :key="request.id"
              class="p-4 bg-white hover:bg-blue-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div
                    class="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-blue-600 mr-4 flex-shrink-0 flex items-center justify-center border-2 border-white shadow-sm"
                  >
                    <img
                      v-if="request.sender?.profile_picture_url"
                      :src="request.sender.profile_picture_url"
                      :alt="request.sender?.name || 'User'"
                      class="h-full w-full object-cover"
                    />
                    <Icon v-else name="fa:user" class="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">
                      {{ request.sender?.name || "User" }}
                    </p>
                    <p class="text-xs text-gray-500 flex items-center mt-1">
                      <Icon name="lucide:download" class="h-3 w-3 mr-1" />
                      Sent you a request
                    </p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="handleRejectRequest(request.id)"
                    class="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-red-100 hover:text-red-600 transition-all transform hover:scale-105"
                    aria-label="Reject Request"
                  >
                    <Icon name="lucide:x" class="h-4 w-4" />
                  </button>
                  <button
                    @click="handleAcceptRequest(request.id)"
                    class="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 hover:text-blue-700 transition-all transform hover:scale-105"
                    aria-label="Accept Request"
                  >
                    <Icon name="lucide:check" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div
              v-if="pendingRequests.length > 0"
              class="bg-gray-50 p-3 text-center"
            >
              <button
                class="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                {{
                  pendingRequests.length > 2
                    ? "View all requests"
                    : "Manage requests"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Friends list -->
      <div class="flex-1 overflow-auto">
        <div
          v-if="filteredFriends.length === 0"
          class="h-full flex flex-col items-center justify-center text-center p-6"
        >
          <Icon name="fa:user" class="h-12 w-12 text-gray-300 mb-3" />
          <p class="text-gray-500 font-medium">
            {{
              searchQuery ? `No results for "${searchQuery}"` : "No friends yet"
            }}
          </p>
          <p class="text-sm text-gray-400 mt-2">
            Add friends to start chatting
          </p>
        </div>
        <div v-else>
          <!-- Friend section header -->
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center">
              <div class="w-1 h-6 bg-blue-500 rounded-r mr-2"></div>
              <h2 class="font-semibold text-gray-800 text-sm">
                Your Friends
                <span
                  class="ml-1 text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full"
                >
                  {{ filteredFriends.length }}
                </span>
              </h2>
            </div>
          </div>

          <div class="space-y-3">
            <NuxtLink
              v-for="friend in sortedFriends"
              :key="friend.id"
              :to="`/chat/messages/${friend.id}`"
              @click="
                () => {
                  console.log('Friend Chat Clicked:', friend.id);
                  console.log('Route params will be:', { id: friend.id });
                  console.log('Route query will be:', { type: null });
                }
              "
            >
              <div
                :class="`flex items-center p-4 rounded-lg transition-colors ${
                  $route.path === `/chat/messages/${friend.id}`
                    ? 'bg-blue-50 border border-blue-100'
                    : 'hover:bg-gray-50 border border-transparent'
                }`"
              >
                <!-- Avatar with online status -->
                <div class="relative mr-3">
                  <div
                    class="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center border border-gray-200 shadow-sm"
                  >
                    <img
                      v-if="friend.profile_picture_url"
                      :src="friend.profile_picture_url"
                      :alt="friend.name"
                      class="h-full w-full object-cover"
                    />
                    <Icon v-else name="fa:user" class="h-6 w-6 text-gray-500" />
                  </div>
                  <!-- Status indicator -->
                  <div
                    :class="`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      getFriendStatus(friend.id) === 'online'
                        ? 'bg-green-500'
                        : getFriendStatus(friend.id) === 'offline'
                        ? 'bg-gray-300'
                        : 'bg-gray-400'
                    }`"
                  ></div>
                </div>

                <!-- Friend info -->
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <h3 class="font-medium text-gray-900 truncate text-sm">
                      {{ friend.first_name }} {{ friend.last_name }}
                    </h3>
                    <span class="text-xs text-gray-500 ml-1">
                      {{
                        getFriendStatus(friend.id) === "online"
                          ? "Online"
                          : formatLastActive(getLastActive(friend.id))
                      }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-600 truncate mt-1">
                    @{{ (friend as any).username || friend.email }}
                  </p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>

    <!-- Add Friend Popup -->
    <div
      v-if="showAddFriendPopup"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform transition-all"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Add a Friend</h2>
          <button
            @click="closeAddFriendPopup"
            class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Icon name="fa:times" class="h-4 w-4" />
          </button>
        </div>

        <!-- Add by Username -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <div class="flex space-x-2">
            <input
              type="text"
              v-model="addByUsername"
              placeholder="Enter username"
              class="flex-1 p-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              @click="handleAddFriendByUsername"
              :disabled="!addByUsername.trim() || isAddingByUsername"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div v-if="isAddingByUsername" class="flex items-center">
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                ></div>
                Adding...
              </div>
              <span v-else>Add</span>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Enter your friend's username to send them a friend request
          </p>
        </div>

        <div class="flex justify-end">
          <button
            @click="closeAddFriendPopup"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFriendsStore } from "~/composables/useFriends";
import { usePresence } from "~/composables/usePresence";
import { useRuntimeConfig } from "#app";

const route = useRoute();
const { $toast } = useNuxtApp();
const friendsStore = useFriendsStore();
const presence = usePresence(); // Add presence composable
const config = useRuntimeConfig();

// Import auth store to get current user info
import { useAuthStore } from "~/composables/useAuth";
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
  return friends.value.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
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
</script>
