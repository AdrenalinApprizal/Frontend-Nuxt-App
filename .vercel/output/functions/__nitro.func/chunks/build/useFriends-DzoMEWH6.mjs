import { defineStore } from 'pinia';
import { v as vueExports } from './server.mjs';

const useFriendsStore = defineStore("friends", () => {
  const friends = vueExports.ref([]);
  const pendingRequests = vueExports.ref([]);
  const blockedUsers = vueExports.ref([]);
  const isLoading = vueExports.ref(false);
  const error = vueExports.ref(null);
  const searchResults = vueExports.ref([]);
  const selectedFriend = vueExports.ref(null);
  const recipientData = vueExports.ref(null);
  const searchPagination = vueExports.ref({
    current_page: 1,
    total: 0,
    per_page: 10,
    last_page: 1,
    has_more_pages: false
  });
  const requestsPagination = vueExports.ref({
    current_page: 1,
    total: 0,
    per_page: 10,
    last_page: 1,
    has_more_pages: false
  });
  const proxyUrl = "/api/proxy";
  const apiCall = async (endpoint, options = {}) => {
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      credentials: "include"
    };
    let formattedEndpoint = endpoint;
    if (!endpoint.startsWith("/") && !endpoint.startsWith("http")) {
      formattedEndpoint = `/${endpoint}`;
    }
    const url = `${proxyUrl}${formattedEndpoint}`;
    console.log(`[Friends API] Calling: ${url}`);
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };
    try {
      const response = await $fetch(url, mergedOptions);
      console.log(`[Friends API] Response for ${endpoint}:`, response);
      return response;
    } catch (err) {
      console.error(`[Friends API] Fetch error for ${endpoint}:`, err);
      if (endpoint.includes("friends") && !endpoint.includes("add")) {
        console.log(`[Friends API] Using fallback for ${endpoint} after error`);
        return endpoint.includes("requests") ? [] : [];
      }
      throw err;
    }
  };
  const getFriends = async () => {
    var _a, _b, _c, _d;
    isLoading.value = true;
    error.value = null;
    try {
      console.log("[Friends Store] Fetching friends list...");
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
      if (!response) {
        console.log("[Friends Store] All endpoints failed, using empty array fallback");
        friends.value = [];
        return [];
      }
      console.log(`[Friends] Raw Friends API Response from ${successEndpoint}:`, response);
      console.log("[Friends] API Response Analysis:", {
        responseType: typeof response,
        isArray: Array.isArray(response),
        responseKeys: response && typeof response === "object" ? Object.keys(response) : "not an object",
        firstItemIfArray: Array.isArray(response) && response.length > 0 ? {
          keys: Object.keys(response[0]),
          profile_picture_url: response[0].profile_picture_url,
          avatar_url: response[0].avatar_url,
          avatar: response[0].avatar,
          sample_data: response[0]
        } : "not array or empty",
        dataFieldIfExists: (response == null ? void 0 : response.data) ? {
          isArray: Array.isArray(response.data),
          length: Array.isArray(response.data) ? response.data.length : "not array",
          firstItem: Array.isArray(response.data) && response.data.length > 0 ? {
            keys: Object.keys(response.data[0]),
            profile_picture_url: response.data[0].profile_picture_url,
            avatar_url: response.data[0].avatar_url,
            avatar: response.data[0].avatar
          } : "no first item"
        } : "no data field"
      });
      let friendsList = [];
      if (Array.isArray(response)) {
        console.log("[Friends] Setting friends from array response", response);
        friendsList = response;
      } else if (response && Array.isArray(response.data)) {
        console.log("[Friends] Setting friends from response.data", response.data);
        friendsList = response.data;
      } else if (response && response.friends && Array.isArray(response.friends)) {
        console.log("[Friends] Setting friends from response.friends", response.friends);
        friendsList = response.friends;
      } else if (response && typeof response === "object") {
        const responseObj = response;
        const arrayProps = Object.entries(responseObj).filter(([_, value]) => Array.isArray(value)).sort(
          ([_, a], [__, b]) => Array.isArray(b) ? b.length - (Array.isArray(a) ? a.length : 0) : 0
        );
        if (arrayProps.length > 0) {
          const [propName, array] = arrayProps[0];
          console.log(`[Friends] Found array property '${propName}' in response`, array);
          friendsList = array;
        } else {
          console.error("[Friends] Unexpected response format:", response);
          friendsList = [];
        }
      } else {
        console.error("[Friends] Unexpected response format:", response);
        friendsList = [];
      }
      console.log("[Friends] Processing friends list:", friendsList);
      const processedFriends = friendsList.filter((friend) => friend !== null && friend !== void 0).map((friend) => {
        var _a2;
        const lastSeen = friend.last_seen || friend.last_active || "";
        const first_name = friend.first_name || "";
        const last_name = friend.last_name || "";
        const full_name = first_name && last_name ? `${first_name} ${last_name}` : friend.full_name || "";
        const processedFriend = {
          id: friend.id || "",
          name: full_name || friend.name || friend.username || "Unknown User",
          email: friend.email || "",
          username: friend.username || ((_a2 = friend.name) == null ? void 0 : _a2.toLowerCase().replace(/\s+/g, "_")) || "unknown",
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
          created_at: friend.created_at || ""
        };
        console.log("[Friends] Processed friend:", processedFriend);
        console.log("[Friends] Avatar mapping for friend:", {
          friend_id: friend.id,
          original_profile_picture_url: friend.profile_picture_url,
          original_avatar_url: friend.avatar_url,
          original_avatar: friend.avatar,
          final_avatar: processedFriend.avatar,
          final_profile_picture_url: processedFriend.profile_picture_url
        });
        return processedFriend;
      });
      console.log("[Friends] Setting processed friends list:", processedFriends);
      friends.value = processedFriends;
      return processedFriends;
    } catch (err) {
      console.error("[Friends] Error fetching friends:", err);
      let errorMessage = "Failed to get friends";
      if ((_a = err == null ? void 0 : err.message) == null ? void 0 : _a.includes("timeout")) {
        errorMessage = "Request timed out. Please check your connection and try again.";
      } else if (((_b = err == null ? void 0 : err.message) == null ? void 0 : _b.includes("Network error")) || ((_c = err == null ? void 0 : err.message) == null ? void 0 : _c.includes("Failed to fetch"))) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if ((_d = err == null ? void 0 : err.message) == null ? void 0 : _d.includes("No authentication token")) {
        errorMessage = "Authentication required. Please log in again.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      error.value = errorMessage;
      friends.value = [];
      return [];
    } finally {
      isLoading.value = false;
    }
  };
  async function getPendingRequests(page = 1) {
    isLoading.value = true;
    error.value = null;
    try {
      console.log(`[Friends] Fetching pending friend requests (page: ${page})...`);
      const params = {};
      if (page > 1) {
        params.page = page;
      }
      const response = await $fetch(`${proxyUrl}/friends/requests`, {
        method: "GET",
        params,
        credentials: "include"
      });
      console.log("[Friends] Raw friend requests response:", response);
      let requestsData = [];
      let paginationData = null;
      if (response && typeof response === "object") {
        if (response.data && Array.isArray(response.data)) {
          requestsData = response.data;
          console.log(`[Friends] Found ${requestsData.length} requests in response.data`);
          if (response.meta) {
            paginationData = response.meta;
          } else if (response.pagination) {
            paginationData = response.pagination;
          }
        } else if (Array.isArray(response)) {
          requestsData = response;
          console.log(`[Friends] Response is direct array with ${requestsData.length} requests`);
        } else if (response.requests && Array.isArray(response.requests)) {
          requestsData = response.requests;
          console.log(`[Friends] Found ${requestsData.length} requests in response.requests`);
        } else {
          const possibleArrayKeys = ["friend_requests", "pending_requests", "incoming_requests"];
          for (const key of possibleArrayKeys) {
            if (response[key] && Array.isArray(response[key])) {
              requestsData = response[key];
              console.log(`[Friends] Found ${requestsData.length} requests in response.${key}`);
              break;
            }
          }
        }
      }
      if (requestsData.length > 0) {
        console.log("[Friends] Sample request structure:", requestsData[0]);
        requestsData = requestsData.map((request) => {
          var _a;
          console.log("[Friends] Normalizing request:", request);
          const normalized = {
            id: request.id || request.friendship_id || `req_${Date.now()}_${Math.random()}`,
            friendship_id: request.friendship_id || request.id,
            // Don't override sender_id/recipient_id if they don't exist in original
            sender_id: request.sender_id || request.from_user_id || ((_a = request.user) == null ? void 0 : _a.id),
            recipient_id: request.recipient_id || request.to_user_id,
            status: request.status || "pending",
            sender: request.sender || request.from_user || request.user,
            recipient: request.recipient || request.to_user,
            user: request.user,
            // Keep original user object intact
            created_at: request.created_at || request.timestamp,
            direction: request.direction || (request.type === "received" ? "incoming" : "outgoing"),
            type: request.type || "received"
          };
          console.log("[Friends] Normalized request:", normalized);
          return normalized;
        });
        console.log("[Friends] Final normalized requests:", requestsData);
      }
      if (page === 1) {
        pendingRequests.value = requestsData;
      } else {
        pendingRequests.value = [...pendingRequests.value, ...requestsData];
      }
      if (paginationData) {
        requestsPagination.value = paginationData;
      } else {
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
    } catch (err) {
      console.error("[Friends] Error fetching friend requests:", err);
      if (err.status === 401) {
        error.value = "Authentication required to fetch friend requests";
      } else if (err.status === 403) {
        error.value = "Not authorized to access friend requests";
      } else if (err.status === 404) {
        error.value = "Friend requests endpoint not found";
      } else {
        error.value = err.message || "Failed to fetch friend requests";
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function loadMorePendingRequests() {
    if (!requestsPagination.value.has_more_pages) {
      return { message: "No more requests to load" };
    }
    const nextPage = requestsPagination.value.current_page + 1;
    return getPendingRequests(nextPage);
  }
  async function sendFriendRequest(userId) {
    isLoading.value = true;
    error.value = null;
    try {
      const user = searchResults.value.find((u) => u.id === userId);
      if (!user || !user.email) {
        throw new Error("User not found or missing email");
      }
      const username = user.email.split("@")[0];
      const response = await $fetch(`${proxyUrl}/friends/add`, {
        method: "POST",
        body: { username },
        credentials: "include"
      });
      await getPendingRequests();
      return response;
    } catch (err) {
      error.value = err.message || "Failed to send friend request";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function acceptFriendRequest(friendshipId) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/accept`, {
        method: "POST",
        body: { friendship_id: friendshipId },
        credentials: "include"
      });
      await Promise.all([getFriends(), getPendingRequests()]);
      return response;
    } catch (err) {
      error.value = err.message || "Failed to accept friend request";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function rejectFriendRequest(friendshipId) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/reject`, {
        method: "POST",
        body: { friendship_id: friendshipId },
        credentials: "include"
      });
      await getPendingRequests();
      return response;
    } catch (err) {
      error.value = err.message || "Failed to reject friend request";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function removeFriend(friendId) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/${friendId}`, {
        method: "DELETE",
        credentials: "include"
      });
      await getFriends();
      return response;
    } catch (err) {
      error.value = err.message || "Failed to remove friend";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function searchUsers(query, page = 1) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/users/search`, {
        method: "GET",
        params: { query, page },
        credentials: "include"
      });
      if (page === 1) {
        searchResults.value = response.data || [];
      } else {
        searchResults.value = [
          ...searchResults.value,
          ...response.data || []
        ];
      }
      if (response.meta) {
        searchPagination.value = response.meta;
      }
      return response.data || [];
    } catch (err) {
      error.value = err.message || "Failed to search users";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function loadMoreSearchResults() {
    if (!searchPagination.value.has_more_pages) {
      return [];
    }
    const nextPage = searchPagination.value.current_page + 1;
    return searchUsers("", nextPage);
  }
  async function addFriendByUsername(username) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/add`, {
        method: "POST",
        // Using POST method as per API requirements
        body: { username },
        credentials: "include"
      });
      console.log(`[Friends] Successfully sent friend request to ${username}`);
      try {
        console.log(
          "[Friends] Refreshing friend requests after sending request"
        );
        await getPendingRequests(1);
      } catch (refreshErr) {
        console.error(
          "[Friends] Error refreshing friend requests:",
          refreshErr
        );
      }
      return response;
    } catch (err) {
      console.error(`[Friends] Error adding friend ${username}:`, err.message);
      error.value = err.message || "Failed to add friend by username";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function blockUserByUsername(username) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/block`, {
        method: "POST",
        body: { username },
        credentials: "include"
      });
      await getFriends();
      return response;
    } catch (err) {
      error.value = err.message || "Failed to block user";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function unblockUserByUsername(username) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/unblock`, {
        method: "POST",
        body: { username },
        credentials: "include"
      });
      await getBlockedUsers();
      return response;
    } catch (err) {
      error.value = err.message || "Failed to unblock user";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function getBlockedUsers() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/blocked`, {
        method: "GET",
        credentials: "include"
      });
      blockedUsers.value = response.data || [];
      return response;
    } catch (err) {
      error.value = err.message || "Failed to fetch blocked users";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function blockUser(userId) {
    isLoading.value = true;
    error.value = null;
    try {
      const user = [...friends.value, ...searchResults.value].find(
        (u) => u.id === userId
      );
      if (!user || !user.email) {
        throw new Error("User not found");
      }
      const username = user.email.split("@")[0];
      const response = await blockUserByUsername(username);
      return response;
    } catch (err) {
      error.value = err.message || "Failed to block user";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function unblockUser(userId) {
    isLoading.value = true;
    error.value = null;
    try {
      const user = [...blockedUsers.value].find((u) => u.id === userId);
      if (!user || !user.email) {
        throw new Error("User not found in blocked list");
      }
      const username = user.email.split("@")[0];
      const response = await unblockUserByUsername(username);
      return response;
    } catch (err) {
      error.value = err.message || "Failed to unblock user";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function searchFriends(query, limit = 20) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/friends/search`, {
        method: "GET",
        params: {
          q: query,
          limit
        },
        credentials: "include"
      });
      const results = response.data || [];
      return results;
    } catch (err) {
      error.value = err.message || "Failed to search friends";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function getFriendById(friendId) {
    if (!friendId) {
      console.error("[Friends] Invalid friendId provided:", friendId);
      return null;
    }
    isLoading.value = true;
    error.value = null;
    try {
      console.log("[Friends] Fetching friend by ID:", friendId);
      const cachedFriend = friends.value.find((friend) => friend.id === friendId);
      if (cachedFriend) {
        console.log("[Friends] Found friend in cache:", cachedFriend);
        recipientData.value = cachedFriend;
        return cachedFriend;
      }
      try {
        const response = await apiCall(`friends/${friendId}`, {
          method: "GET"
        });
        console.log("[Friends] API response for friend by ID:", response);
        let friendData = null;
        const responseObj = response;
        if (responseObj.data) {
          friendData = responseObj.data;
        } else if (responseObj.friend) {
          friendData = responseObj.friend;
        } else if (typeof response === "object" && response !== null) {
          friendData = response;
        }
        if (friendData) {
          const first_name = friendData.first_name || "";
          const last_name = friendData.last_name || "";
          const full_name = first_name && last_name ? `${first_name} ${last_name}` : friendData.full_name || "";
          const formattedFriend = {
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
            created_at: friendData.created_at || ""
          };
          console.log("[Friends] Formatted friend data:", formattedFriend);
          recipientData.value = formattedFriend;
          const exists = friends.value.some((f) => f.id === formattedFriend.id);
          if (!exists) {
            friends.value = [...friends.value, formattedFriend];
          }
          return formattedFriend;
        }
      } catch (apiError) {
        console.error("[Friends] API error fetching friend:", apiError);
      }
      console.log("[Friends] Constructing minimal friend data from ID");
      const minimalFriend = {
        id: friendId,
        name: `User ${friendId.substring(0, 8)}...`,
        email: `user-${friendId}@example.com`,
        username: `user_${friendId.substring(0, 6)}`,
        status: "offline",
        display_name: `User ${friendId.substring(0, 8)}...`
      };
      recipientData.value = minimalFriend;
      return minimalFriend;
    } catch (err) {
      console.error("[Friends] Error fetching friend by ID:", err);
      error.value = `Failed to get friend by ID: ${err.message}`;
      const fallbackFriend = {
        id: friendId,
        name: `User ${friendId.substring(0, 8)}...`,
        email: `user-${friendId}@example.com`,
        username: `user_${friendId.substring(0, 6)}`,
        status: "offline",
        display_name: `User ${friendId.substring(0, 8)}...`
      };
      recipientData.value = fallbackFriend;
      return fallbackFriend;
    } finally {
      isLoading.value = false;
    }
  }
  function setRecipientData(friend) {
    recipientData.value = friend;
  }
  function setFriends(updatedFriends) {
    friends.value = updatedFriends;
  }
  function setFriendRequests(updatedRequests) {
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
    setFriendRequests
  };
});

export { useFriendsStore as u };
//# sourceMappingURL=useFriends-DzoMEWH6.mjs.map
