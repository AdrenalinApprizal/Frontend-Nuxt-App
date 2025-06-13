import { defineStore } from "pinia";
import { ref } from "vue";

// Updated interfaces to match the provided example
export interface User {
  id: string;
  name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  profile_picture_url?: string;
  avatar_url?: string;
  avatar?: string;
  username?: string;
  status?: "online" | "offline";
  phone?: string;
  location?: string;
  display_name?: string;
  created_at?: string;
}

export interface Friend extends User {
  last_seen?: string;
  unread_count?: number;
  last_active?: string;
}

export interface FriendRequest {
  friendship_id: string;
  user: User;
  created_at: string;
  direction?: "incoming" | "outgoing";
  status?: "pending" | "accepted" | "rejected";
  type?: "sent" | "received";
  requestor_id?: string;
  recipient_id?: string;
  sender_id?: string;
  id?: string; // Some APIs might return id instead of friendship_id
  friend_id?: string; // Alternative field for user ID
  friend?: User; // Alternative to user
  sender?: User;
  recipient?: User;
}

export interface SearchResult extends User {
  is_friend?: boolean;
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
  const friends = ref<Friend[]>([]);
  const pendingRequests = ref<FriendRequest[]>([]);
  const blockedUsers = ref<User[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const searchResults = ref<SearchResult[]>([]);
  const selectedFriend = ref<Friend | null>(null);
  const recipientData = ref<Friend | null>(null);
  
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

  // Helper function for API calls with enhanced error handling
  const apiCall = async (endpoint: string, options: any = {}) => {
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include" as RequestCredentials,
    };

    // Fix endpoint path properly
    let formattedEndpoint = endpoint;
    if (!endpoint.startsWith("/") && !endpoint.startsWith("http")) {
      formattedEndpoint = `/${endpoint}`;
    }

    const url = `${proxyUrl}${formattedEndpoint}`;
    console.log(`[Friends API] Calling: ${url}`);

    // Merge default options with provided options
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await $fetch(url, mergedOptions);
      console.log(`[Friends API] Response for ${endpoint}:`, response);
      return response;
    } catch (err: any) {
      console.error(`[Friends API] Fetch error for ${endpoint}:`, err);

      // For critical endpoints, return fallback values to avoid UI failures
      if (endpoint.includes("friends") && !endpoint.includes("add")) {
        console.log(`[Friends API] Using fallback for ${endpoint} after error`);
        return endpoint.includes("requests") ? [] : [];
      }
      throw err;
    }
  };

  // Get list of friends with enhanced error handling and logging
  const getFriends = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      console.log("[Friends Store] Fetching friends list...");

      // Try multiple endpoint variations to handle different backend API patterns
      let response;
      const endpoints = ["/friends", "/user/friends", "/users/friends"];
      let successEndpoint = "";

      for (const endpoint of endpoints) {
        try {
          console.log(`[Friends Store] Trying endpoint: ${endpoint}`);
          response = await apiCall(endpoint, { method: "GET" });
          successEndpoint = endpoint;
          console.log(`[Friends Store] Success with endpoint: ${endpoint}`);
          break;
        } catch (err) {
          console.log(`[Friends Store] Failed with endpoint ${endpoint}:`, err);
          continue;
        }
      }

      // If all endpoints failed, use an empty array as fallback
      if (!response) {
        console.log("[Friends Store] All endpoints failed, using empty array fallback");
        friends.value = [];
        return [];
      }

      console.log(`[Friends] Raw Friends API Response from ${successEndpoint}:`, response);

      // Add detailed logging to see the actual API response structure
      console.log("[Friends] API Response Analysis:", {
        responseType: typeof response,
        isArray: Array.isArray(response),
        responseKeys: response && typeof response === "object" ? Object.keys(response) : "not an object",
        firstItemIfArray: Array.isArray(response) && response.length > 0 ? {
          keys: Object.keys(response[0]),
          profile_picture_url: response[0].profile_picture_url,
          avatar_url: response[0].avatar_url,
          avatar: response[0].avatar,
          sample_data: response[0],
        } : "not array or empty",
        dataFieldIfExists: (response as any)?.data ? {
          isArray: Array.isArray((response as any).data),
          length: Array.isArray((response as any).data) ? (response as any).data.length : "not array",
          firstItem: Array.isArray((response as any).data) && (response as any).data.length > 0 ? {
            keys: Object.keys((response as any).data[0]),
            profile_picture_url: (response as any).data[0].profile_picture_url,
            avatar_url: (response as any).data[0].avatar_url,
            avatar: (response as any).data[0].avatar,
          } : "no first item",
        } : "no data field",
      });

      let friendsList: Array<any> = [];

      // Handle various response formats
      if (Array.isArray(response)) {
        console.log("[Friends] Setting friends from array response", response);
        friendsList = response;
      } else if (response && Array.isArray((response as any).data)) {
        console.log("[Friends] Setting friends from response.data", (response as any).data);
        friendsList = (response as any).data;
      } else if (response && (response as any).friends && Array.isArray((response as any).friends)) {
        console.log("[Friends] Setting friends from response.friends", (response as any).friends);
        friendsList = (response as any).friends;
      } else if (response && typeof response === "object") {
        // Try to extract any array property from the response
        const responseObj = response as Record<string, any>;
        const arrayProps = Object.entries(responseObj)
          .filter(([_, value]) => Array.isArray(value))
          .sort(([_, a], [__, b]) => 
            Array.isArray(b) ? b.length - (Array.isArray(a) ? a.length : 0) : 0
          );

        if (arrayProps.length > 0) {
          const [propName, array] = arrayProps[0];
          console.log(`[Friends] Found array property '${propName}' in response`, array);
          friendsList = array as Array<any>;
        } else {
          console.error("[Friends] Unexpected response format:", response);
          friendsList = [];
        }
      } else {
        console.error("[Friends] Unexpected response format:", response);
        friendsList = [];
      }

      console.log("[Friends] Processing friends list:", friendsList);
      const processedFriends = friendsList
        .filter((friend): friend is any => friend !== null && friend !== undefined)
        .map((friend) => {
          // Extract last_seen value safely
          const lastSeen = friend.last_seen || friend.last_active || "";
          const first_name = friend.first_name || "";
          const last_name = friend.last_name || "";

          // Build full name from components when available
          const full_name = first_name && last_name 
            ? `${first_name} ${last_name}` 
            : friend.full_name || "";

          // Create a properly formatted Friend object
          const processedFriend: Friend = {
            id: friend.id || "",
            name: full_name || friend.name || friend.username || "Unknown User",
            email: friend.email || "",
            username: friend.username || friend.name?.toLowerCase().replace(/\s+/g, "_") || "unknown",
            first_name,
            last_name,
            full_name,
            avatar: friend.profile_picture_url || friend.avatar_url || friend.avatar,
            profile_picture_url: friend.profile_picture_url || friend.avatar_url || friend.avatar,
            status: friend.status || "offline",
            phone: friend.phone || "",
            location: friend.location || "",
            display_name: friend.display_name || full_name || friend.name || friend.username || "Unknown User",
            last_seen: lastSeen,
            unread_count: friend.unread_count || 0,
            created_at: friend.created_at || "",
          };

          console.log("[Friends] Processed friend:", processedFriend);
          console.log("[Friends] Avatar mapping for friend:", {
            friend_id: friend.id,
            original_profile_picture_url: friend.profile_picture_url,
            original_avatar_url: friend.avatar_url,
            original_avatar: friend.avatar,
            final_avatar: processedFriend.avatar,
            final_profile_picture_url: processedFriend.profile_picture_url,
          });
          return processedFriend;
        });

      console.log("[Friends] Setting processed friends list:", processedFriends);
      friends.value = processedFriends;
      return processedFriends;
    } catch (err: any) {
      console.error("[Friends] Error fetching friends:", err);

      // Handle specific error types
      let errorMessage = "Failed to get friends";
      if (err?.message?.includes("timeout")) {
        errorMessage = "Request timed out. Please check your connection and try again.";
      } else if (err?.message?.includes("Network error") || err?.message?.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (err?.message?.includes("No authentication token")) {
        errorMessage = "Authentication required. Please log in again.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      error.value = errorMessage;
      friends.value = []; // Set empty array as fallback
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  // Get pending friend requests
  async function getPendingRequests(page: number = 1) {
    isLoading.value = true;
    error.value = null;
    try {
      console.log(`[Friends] Fetching pending friend requests (page: ${page})...`);

      // Build params object for pagination support
      const params: any = {};
      if (page > 1) {
        params.page = page;
      }

      const response = await $fetch(`${proxyUrl}/friends/requests`, {
        method: "GET",
        params,
        credentials: "include",
      });

      console.log("[Friends] Raw friend requests response:", response);

      // Initialize variables for processing
      let requestsData: FriendRequest[] = [];
      let paginationData: PaginationMeta | null = null;

      // Handle different response formats
      if (response && typeof response === 'object') {
        // Case 1: Response has a 'data' property with the requests array
        if (response.data && Array.isArray(response.data)) {
          requestsData = response.data;
          console.log(`[Friends] Found ${requestsData.length} requests in response.data`);
          
          // Check for pagination metadata
          if (response.meta) {
            paginationData = response.meta;
          } else if (response.pagination) {
            paginationData = response.pagination;
          }
        }
        // Case 2: Response itself is an array of requests
        else if (Array.isArray(response)) {
          requestsData = response;
          console.log(`[Friends] Response is direct array with ${requestsData.length} requests`);
        }
        // Case 3: Response has requests in a different structure
        else if (response.requests && Array.isArray(response.requests)) {
          requestsData = response.requests;
          console.log(`[Friends] Found ${requestsData.length} requests in response.requests`);
        }
        // Case 4: Check for other possible array properties
        else {
          const possibleArrayKeys = ['friend_requests', 'pending_requests', 'incoming_requests'];
          for (const key of possibleArrayKeys) {
            if (response[key] && Array.isArray(response[key])) {
              requestsData = response[key];
              console.log(`[Friends] Found ${requestsData.length} requests in response.${key}`);
              break;
            }
          }
        }
      }

      // Process and normalize the requests data
      if (requestsData.length > 0) {
        console.log("[Friends] Sample request structure:", requestsData[0]);
        
        // Normalize the requests to ensure consistent structure
        requestsData = requestsData.map((request: any) => {
          console.log("[Friends] Normalizing request:", request);
          
          const normalized = {
            id: request.id || request.friendship_id || `req_${Date.now()}_${Math.random()}`,
            friendship_id: request.friendship_id || request.id,
            // Don't override sender_id/recipient_id if they don't exist in original
            sender_id: request.sender_id || request.from_user_id || request.user?.id,
            recipient_id: request.recipient_id || request.to_user_id,
            status: request.status || 'pending',
            sender: request.sender || request.from_user || request.user,
            recipient: request.recipient || request.to_user,
            user: request.user, // Keep original user object intact
            created_at: request.created_at || request.timestamp,
            direction: request.direction || (request.type === 'received' ? 'incoming' : 'outgoing'),
            type: request.type || 'received'
          };
          
          console.log("[Friends] Normalized request:", normalized);
          return normalized;
        });
        
        console.log("[Friends] Final normalized requests:", requestsData);
      }

      // Update the store state
      if (page === 1) {
        // Replace existing requests for first page
        pendingRequests.value = requestsData;
      } else {
        // Append for pagination
        pendingRequests.value = [...pendingRequests.value, ...requestsData];
      }

      // Update pagination metadata
      if (paginationData) {
        requestsPagination.value = paginationData;
      } else {
        // Set default pagination if not provided
        requestsPagination.value = {
          current_page: page,
          total: requestsData.length,
          per_page: requestsData.length,
          last_page: 1,
          has_more_pages: false
        };
      }

      console.log(`[Friends] Successfully processed ${requestsData.length} friend requests`);
      console.log(`[Friends] Total pending requests in store: ${pendingRequests.value.length}`);

      return response;
    } catch (err: any) {
      console.error("[Friends] Error fetching friend requests:", err);
      
      // Provide more specific error messages
      if (err.status === 401) {
        error.value = "Authentication required to fetch friend requests";
      } else if (err.status === 403) {
        error.value = "Not authorized to access friend requests";
      } else if (err.status === 404) {
        error.value = "Friend requests endpoint not found";
      } else {
        error.value = err.message || "Failed to fetch friend requests";
      }
      
      // Don't clear existing requests on error, just throw
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

  // Get a friend by their ID
  async function getFriendById(friendId: string): Promise<Friend | null> {
    if (!friendId) {
      console.error("[Friends] Invalid friendId provided:", friendId);
      return null;
    }

    isLoading.value = true;
    error.value = null;
    try {
      console.log("[Friends] Fetching friend by ID:", friendId);

      // First check if friend already exists in our cached list
      const cachedFriend = friends.value.find((friend) => friend.id === friendId);
      if (cachedFriend) {
        console.log("[Friends] Found friend in cache:", cachedFriend);
        recipientData.value = cachedFriend;
        return cachedFriend;
      }

      // If not in cache, try to get from API
      try {
        const response = await apiCall(`friends/${friendId}`, {
          method: "GET",
        });

        console.log("[Friends] API response for friend by ID:", response);

        // Process the response based on the format
        let friendData = null;
        const responseObj = response as any;

        if (responseObj.data) {
          friendData = responseObj.data;
        } else if (responseObj.friend) {
          friendData = responseObj.friend;
        } else if (typeof response === "object" && response !== null) {
          friendData = response;
        }

        // Format the friend object if we found data
        if (friendData) {
          const first_name = friendData.first_name || "";
          const last_name = friendData.last_name || "";
          const full_name = first_name && last_name 
            ? `${first_name} ${last_name}` 
            : friendData.full_name || "";

          const formattedFriend: Friend = {
            id: friendData.id || friendId,
            name: full_name || friendData.name || friendData.username || "Unknown",
            email: friendData.email || "",
            username: friendData.username || "",
            first_name,
            last_name,
            full_name,
            avatar: friendData.profile_picture_url || friendData.avatar_url || friendData.avatar,
            profile_picture_url: friendData.profile_picture_url || friendData.avatar_url || friendData.avatar,
            status: friendData.status || "offline",
            phone: friendData.phone || "",
            location: friendData.location || "",
            display_name: friendData.display_name || friendData.name || friendData.username || "Unknown",
            created_at: friendData.created_at || "",
          };

          console.log("[Friends] Formatted friend data:", formattedFriend);

          // Set recipient data
          recipientData.value = formattedFriend;

          // Add to local cache
          const exists = friends.value.some((f) => f.id === formattedFriend.id);
          if (!exists) {
            friends.value = [...friends.value, formattedFriend];
          }

          return formattedFriend;
        }
      } catch (apiError) {
        console.error("[Friends] API error fetching friend:", apiError);
      }

      // If API fails, try to construct a minimal friend object from the ID
      console.log("[Friends] Constructing minimal friend data from ID");
      const minimalFriend: Friend = {
        id: friendId,
        name: `User ${friendId.substring(0, 8)}...`,
        email: `user-${friendId}@example.com`,
        username: `user_${friendId.substring(0, 6)}`,
        status: "offline",
        display_name: `User ${friendId.substring(0, 8)}...`,
      };

      recipientData.value = minimalFriend;
      return minimalFriend;
    } catch (err: any) {
      console.error("[Friends] Error fetching friend by ID:", err);
      error.value = `Failed to get friend by ID: ${err.message}`;

      // Return minimal data in case of error
      const fallbackFriend: Friend = {
        id: friendId,
        name: `User ${friendId.substring(0, 8)}...`,
        email: `user-${friendId}@example.com`,
        username: `user_${friendId.substring(0, 6)}`,
        status: "offline",
        display_name: `User ${friendId.substring(0, 8)}...`,
      };
      recipientData.value = fallbackFriend;
      return fallbackFriend;
    } finally {
      isLoading.value = false;
    }
  }

  // Set recipient data
  function setRecipientData(friend: Friend | null) {
    recipientData.value = friend;
  }

  // Set friends state
  function setFriends(updatedFriends: Friend[]) {
    friends.value = updatedFriends;
  }

  // Set friend requests state
  function setFriendRequests(updatedRequests: FriendRequest[]) {
    pendingRequests.value = updatedRequests;
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
    selectedFriend,
    recipientData,
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
    getFriendById,
    setRecipientData,
    setFriends,
    setFriendRequests,
  };
});

// Export the store as a composable
export { useFriendsStore };
