import { defineStore } from "pinia";
import { ref } from "vue";

interface User {
  id: string;
  name: string;
  email: string;
  profile_picture_url?: string;
  avatar?: string;
  status?: "online" | "offline" | "busy";
  phone?: string;
  location?: string;
}

interface FriendRequest {
  id: string;
  sender_id: string;
  recipient_id: string;
  status: "pending" | "accepted" | "rejected";
  sender?: User;
  recipient?: User;
  created_at?: string;
}

interface ApiResponse {
  message: string;
  data?: any;
}

interface PaginationMeta {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  has_more_pages: boolean;
}

// Define the store
const useFriendsStore = defineStore("friends", () => {
  const friends = ref<User[]>([]);
  const pendingRequests = ref<FriendRequest[]>([]);
  const blockedUsers = ref<User[]>([]); // Add blockedUsers state
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const searchResults = ref<User[]>([]);
  const searchPagination = ref<PaginationMeta>({
    current_page: 1,
    total: 0,
    per_page: 10,
    last_page: 1,
    has_more_pages: false,
  });
  const requestsPagination = ref<PaginationMeta>({
    current_page: 1,
    total: 0,
    per_page: 10,
    last_page: 1,
    has_more_pages: false,
  });

  // Base URLs for API - using our proxy
  const proxyUrl = "/api/proxy";

  // Get all friends
  async function getFriends() {
    isLoading.value = true;
    error.value = null;
    try {
      console.log("[Friends Store] Fetching friends from API...");
      const response = await $fetch(`${proxyUrl}/friends`, {
        method: "GET",
        credentials: "include",
      });
      console.log("[Friends Store] Raw API response:", response);

      if (response.data) {
        console.log(
          "[Friends Store] Friends data found in response. Count:",
          response.data.length
        );
        console.log("[Friends Store] First friend sample:", response.data[0]);
        friends.value = response.data;
      } else {
        console.log(
          "[Friends Store] No data property found in response, using response directly"
        );
        friends.value = response || [];
      }

      return response;
    } catch (err: any) {
      console.error("[Friends Store] Error fetching friends:", err.message);
      error.value = err.message || "Failed to fetch friends";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Get pending friend requests
  async function getPendingRequests(page?: number) {
    isLoading.value = true;
    error.value = null;
    try {
      console.log("[Friends] Fetching pending friend requests...");

      const response = await $fetch(`${proxyUrl}/friends/requests`, {
        method: "GET",
        credentials: "include",
      });

      // Detailed logging of the response
      console.log("[Friends] Raw friend requests response:", response);
      console.log("[Friends] Response type:", typeof response);

      // Check if the data property exists and what it contains
      if (response.data) {
        console.log(
          "[Friends] Data property exists with type:",
          typeof response.data
        );
        console.log(
          "[Friends] Is data an array?",
          Array.isArray(response.data)
        );
        console.log(
          "[Friends] Data length:",
          Array.isArray(response.data) ? response.data.length : "not an array"
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          console.log("[Friends] First request sample:", response.data[0]);
        }
      } else {
        console.log("[Friends] Response has no data property");
        // Check if the response itself is the array of requests
        if (Array.isArray(response)) {
          console.log(
            "[Friends] Response itself is an array with length:",
            response.length
          );
          if (response.length > 0) {
            console.log(
              "[Friends] First request sample from direct array:",
              response[0]
            );
          }
        }
      }

      // Try to determine the correct data structure and assign accordingly
      if (Array.isArray(response)) {
        // If the response itself is an array of requests
        pendingRequests.value = response;
        console.log(
          "[Friends] Assigned response directly to pendingRequests:",
          pendingRequests.value.length
        );
      } else if (response.data && Array.isArray(response.data)) {
        // If the response has a data property that is an array
        pendingRequests.value = response.data;
        console.log(
          "[Friends] Assigned response.data to pendingRequests:",
          pendingRequests.value.length
        );
      } else {
        // Fallback
        pendingRequests.value = [];
        console.log(
          "[Friends] Could not determine correct data structure, cleared pendingRequests"
        );
      }

      return response;
    } catch (err: any) {
      console.error("[Friends] Error fetching friend requests:", err.message);
      error.value = err.message || "Failed to fetch friend requests";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Load more pending requests
  async function loadMorePendingRequests() {
    if (!requestsPagination.value.has_more_pages) {
      return { message: "No more requests to load" };
    }

    const nextPage = requestsPagination.value.current_page + 1;
    return getPendingRequests(nextPage);
  }

  // Send friend request
  async function sendFriendRequest(userId: string): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;
    try {
      // Find the user to get their username
      const user = searchResults.value.find((u) => u.id === userId);

      if (!user || !user.email) {
        throw new Error("User not found or missing email");
      }

      // Extract username from email (assuming email is username@domain.com)
      // You may need to adjust this based on how usernames are stored in your system
      const username = user.email.split("@")[0];

      // Use POST to /friends/add with username parameter
      const response = await $fetch(`${proxyUrl}/friends/add`, {
        method: "POST",
        body: { username },
        credentials: "include",
      });

      // Refresh pending requests after sending a new one
      await getPendingRequests();
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to send friend request";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Accept friend request
  async function acceptFriendRequest(
    friendshipId: string
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/accept`, {
        method: "POST",
        body: { friendship_id: friendshipId },
        credentials: "include",
      });
      // Refresh friends and pending requests after accepting
      await Promise.all([getFriends(), getPendingRequests()]);
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to accept friend request";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Reject friend request
  async function rejectFriendRequest(
    friendshipId: string
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/reject`, {
        method: "POST",
        body: { friendship_id: friendshipId },
        credentials: "include",
      });
      // Refresh pending requests after rejecting
      await getPendingRequests();
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to reject friend request";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Remove friend
  async function removeFriend(friendId: string): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/${friendId}`, {
        method: "DELETE",
        credentials: "include",
      });
      // Refresh friends list after removing
      await getFriends();
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to remove friend";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Search for users to add as friends
  async function searchUsers(query: string, page: number = 1): Promise<User[]> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/users/search`, {
        method: "GET",
        params: { query, page },
        credentials: "include",
      });

      if (page === 1) {
        searchResults.value = response.data || [];
      } else {
        // Append results for pagination
        searchResults.value = [
          ...searchResults.value,
          ...(response.data || []),
        ];
      }

      // Update pagination metadata
      if (response.meta) {
        searchPagination.value = response.meta;
      }

      return response.data || [];
    } catch (err: any) {
      error.value = err.message || "Failed to search users";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Load more search results
  async function loadMoreSearchResults(): Promise<User[]> {
    if (!searchPagination.value.has_more_pages) {
      return [];
    }

    const nextPage = searchPagination.value.current_page + 1;
    // Use the last search query that was used (which is stored in searchUserQuery in the component)
    // We don't need to pass the query here as we're just paginating existing results
    return searchUsers("", nextPage);
  }

  // Add friend by username
  async function addFriendByUsername(username: string): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;
    try {
      // Send the friend request
      const response = await $fetch(`${proxyUrl}/friends/add`, {
        method: "POST", // Using POST method as per API requirements
        body: { username },
        credentials: "include",
      });

      console.log(`[Friends] Successfully sent friend request to ${username}`);

      // Force refresh pending requests to update the UI
      try {
        console.log(
          "[Friends] Refreshing friend requests after sending request"
        );
        await getPendingRequests(1); // Force refresh from page 1
      } catch (refreshErr) {
        console.error(
          "[Friends] Error refreshing friend requests:",
          refreshErr
        );
      }

      return response;
    } catch (err: any) {
      console.error(`[Friends] Error adding friend ${username}:`, err.message);
      error.value = err.message || "Failed to add friend by username";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Block user by username
  async function blockUserByUsername(username: string): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/block`, {
        method: "POST",
        body: { username },
        credentials: "include",
      });

      // Refresh friends list to reflect changes
      await getFriends();
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to block user";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Unblock user by username
  async function unblockUserByUsername(username: string): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/unblock`, {
        method: "POST",
        body: { username },
        credentials: "include",
      });

      // Refresh blocked users list to reflect changes
      await getBlockedUsers();
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to unblock user";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Get all blocked users
  async function getBlockedUsers() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/blocked`, {
        method: "GET",
        credentials: "include",
      });
      blockedUsers.value = response.data || [];
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch blocked users";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Block user by ID
  async function blockUser(userId: string): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;
    try {
      // First get user's username from the id
      const user = [...friends.value, ...searchResults.value].find(
        (u) => u.id === userId
      );
      if (!user || !user.email) {
        throw new Error("User not found");
      }

      // Extract username from email (assuming email is username@domain.com)
      // You may need to adjust this based on how usernames are stored in your system
      const username = user.email.split("@")[0];

      const response = await blockUserByUsername(username);
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to block user";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Unblock user by ID
  async function unblockUser(userId: string): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;
    try {
      // First get user's username from the id
      const user = [...blockedUsers.value].find((u) => u.id === userId);
      if (!user || !user.email) {
        throw new Error("User not found in blocked list");
      }

      // Extract username from email (assuming email is username@domain.com)
      // You may need to adjust this based on how usernames are stored in your system
      const username = user.email.split("@")[0];

      const response = await unblockUserByUsername(username);
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to unblock user";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Search for friends by name, email, or username
  async function searchFriends(
    query: string,
    limit: number = 20
  ): Promise<User[]> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/search`, {
        method: "GET",
        params: {
          q: query,
          limit,
        },
        credentials: "include",
      });

      // Store results in a temporary variable instead of updating global state
      const results = response.data || [];
      return results;
    } catch (err: any) {
      error.value = err.message || "Failed to search friends";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    friends,
    pendingRequests,
    blockedUsers,
    isLoading,
    error,
    searchResults,
    searchPagination,
    requestsPagination,
    getFriends,
    getPendingRequests,
    getBlockedUsers,
    loadMorePendingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    searchUsers,
    loadMoreSearchResults,
    addFriendByUsername,
    blockUserByUsername,
    unblockUserByUsername,
    blockUser,
    unblockUser,
    searchFriends,
  };
});

// Export the store as a composable
export { useFriendsStore };
