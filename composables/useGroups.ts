import { defineStore } from "pinia";
import { ref } from "vue";
import { useNuxtApp } from "#app";

// Define Group types
export interface Group {
  id: string;
  name: string;
  avatar_url?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  member_count?: number;
  is_active?: boolean;
  owner_id?: string;
  unread_count?: number;
  members?: string[];
  last_message?: {
    content: string;
    sender_name: string;
    created_at: string;
    message_id?: string;
    message_type?: string;
    sender_id?: string;
    sent_at?: string;
    read_at?: string;
    delivered_at?: string;
    attachment_url?: string;
  };
}

// Define Group Member type
interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: "admin" | "member";
  joined_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
    profile_picture_url?: string;
  };
}

// Define Group Message type
interface GroupMessage {
  id: string;
  group_id: string;
  sender_id: string;
  content: string;
  type: string;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// Pagination interface
interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_more_pages: boolean;
}

// Request data types
interface CreateGroupData {
  name: string;
  description?: string;
  members: string[];
  avatar?: File | null;
}

interface UpdateGroupData {
  name?: string;
  avatar?: File | null;
}

// Define API response
interface ApiResponse {
  message?: string;
  data?: any;
  pagination?: Pagination;
}

// Define the store for groups management
export const useGroupsStore = defineStore("groups", () => {
  // State
  const groups = ref<Group[]>([]);
  const currentGroup = ref<Group | null>(null);
  const groupMembers = ref<GroupMember[]>([]);
  const groupMessages = ref<GroupMessage[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Pagination
  const messagesPagination = ref<Pagination>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 20,
    has_more_pages: false,
  });

  const membersPagination = ref<Pagination>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 20,
    has_more_pages: false,
  });

  // Define block user state
  const blockedUsers = ref<{ id: string; user_id: string; name?: string }[]>(
    []
  );

  // Get Nuxt app instance for access to API and toast functionality
  const nuxtApp = useNuxtApp();
  const { $api, $toast } = nuxtApp;

  /**
   * Fetch all groups for the current user
   */
  async function getGroups(): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      console.log("Fetching groups from /groups endpoint");

      // Use API utility which already parses JSON responses
      const response = await $api.get("/groups");

      console.log("API Response:", JSON.stringify(response, null, 2));

      // According to the provided JSON structure, groups are in the "groups" property
      if (response && typeof response === "object") {
        if (response.groups && Array.isArray(response.groups)) {
          console.log(
            "Found groups array in response.groups, length:",
            response.groups.length
          );

          // Log group names to ensure they're being extracted
          if (response.groups.length > 0) {
            console.log(
              "Group names:",
              response.groups.map((group: Group) => group.name).join(", ")
            );
          }

          groups.value = response.groups;
        }
        // Fallback to checking data property for compatibility with older code
        else if (response.data && Array.isArray(response.data)) {
          console.log(
            "Found groups array in response.data, length:",
            response.data.length
          );
          groups.value = response.data;
        }
        // Direct array response
        else if (Array.isArray(response)) {
          console.log(
            "Response is directly an array of groups, length:",
            response.length
          );
          groups.value = response;
        }
        // If data is present but not an array, check if it contains a groups property
        else if (
          response.data &&
          typeof response.data === "object" &&
          response.data.groups &&
          Array.isArray(response.data.groups)
        ) {
          console.log(
            "Found groups in response.data.groups, length:",
            response.data.groups.length
          );
          groups.value = response.data.groups;
        }
        // Last resort - look for any property that might contain the groups array
        else {
          console.log("Looking for groups array in response properties");
          for (const key in response) {
            if (Array.isArray(response[key])) {
              if (
                response[key].length > 0 &&
                response[key][0] &&
                (response[key][0].name !== undefined ||
                  response[key][0].id !== undefined)
              ) {
                console.log(
                  `Using array found in response.${key} as groups:`,
                  response[key]
                );
                groups.value = response[key];
                break;
              }
            }
          }
        }
      }

      // Make sure groups.value is always an array
      if (!Array.isArray(groups.value)) {
        console.log(
          "No valid groups array found in response, setting to empty array"
        );
        groups.value = [];
      } else {
        console.log("Final groups data:", groups.value);
        console.log(
          "Group names:",
          groups.value.map((group: Group) => group.name).join(", ")
        );
      }

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch groups";
      console.error("Error fetching groups:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Create a new group
   */
  async function createGroup(groupData: CreateGroupData): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Handle file upload if needed
      let data;

      if (groupData.avatar) {
        const formData = new FormData();
        formData.append("name", groupData.name);
        groupData.members.forEach((memberId) => {
          formData.append("members[]", memberId);
        });
        formData.append("avatar", groupData.avatar);

        // Use raw fetch for FormData
        const response = await $api.raw.post("/groups", formData);
        data = await response.json();
      } else {
        // Normal JSON request
        data = await $api.post("/groups", {
          name: groupData.name,
          members: groupData.members,
        });
      }

      // Refresh groups list after creating a new one
      await getGroups();
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to create group";
      console.error("Error creating group:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get details for a specific group
   */
  async function getGroupDetails(groupId: string): Promise<Group> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $api.get(`/groups/${groupId}`);
      currentGroup.value = data;
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch group details";
      console.error(`Error fetching group ${groupId} details:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Update a group's details
   */
  async function updateGroup(
    groupId: string,
    updateData: UpdateGroupData
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Handle file upload if needed
      let data;

      if (updateData.avatar) {
        const formData = new FormData();
        if (updateData.name) {
          formData.append("name", updateData.name);
        }
        formData.append("avatar", updateData.avatar);

        // Use raw fetch for FormData
        const response = await $api.raw.put(`/groups/${groupId}`, formData);
        data = await response.json();
      } else {
        // Normal JSON request
        data = await $api.put(`/groups/${groupId}`, updateData);
      }

      // Refresh group details
      await getGroupDetails(groupId);
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to update group";
      console.error(`Error updating group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get members of a specific group
   */
  async function getGroupMembers(
    groupId: string,
    page = 1
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $api.get(`/groups/${groupId}/members?page=${page}`);

      if (page === 1 || page <= 0) {
        groupMembers.value = data.data || [];
      } else {
        // Append new members to existing list for pagination
        groupMembers.value = [...groupMembers.value, ...(data.data || [])];
      }

      // Update pagination info
      if (data.pagination) {
        membersPagination.value = data.pagination;
      }

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch group members";
      console.error(`Error fetching members for group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Load more group members (pagination)
   */
  async function loadMoreMembers(groupId: string): Promise<ApiResponse | null> {
    if (membersPagination.value.has_more_pages) {
      const nextPage = membersPagination.value.current_page + 1;
      return getGroupMembers(groupId, nextPage);
    }
    return null;
  }

  /**
   * Add members to a group
   */
  async function addGroupMembers(
    groupId: string,
    memberIds: string[]
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $api.post(`/groups/${groupId}/members`, {
        memberIds,
      });

      // Refresh group members list
      await getGroupMembers(groupId);
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to add members to group";
      console.error(`Error adding members to group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Remove a member from a group
   */
  async function removeGroupMember(
    groupId: string,
    userId: string
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $api.delete(`/groups/${groupId}/members/${userId}`);

      // Update local state by removing the member
      groupMembers.value = groupMembers.value.filter(
        (member) => member.user_id !== userId
      );
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to remove member from group";
      console.error(
        `Error removing member ${userId} from group ${groupId}:`,
        err
      );
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Leave a group
   */
  async function leaveGroup(groupId: string): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $api.post(`/groups/${groupId}/leave`, {}); // Added empty object as data parameter

      // Update local state by removing the group
      groups.value = groups.value.filter((group) => group.id !== groupId);
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to leave group";
      console.error(`Error leaving group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get messages for a specific group
   */
  async function getGroupMessages(
    groupId: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse> {
    console.log(`[useGroups] Getting messages for group ${groupId}, page ${page}, limit ${limit}`);
    isLoading.value = true;
    error.value = null;

    try {
      console.log(`[useGroups] Making API call to /groups/${groupId}/messages`);
      const startTime = performance.now();
      
      const data = await $api.get(
        `/groups/${groupId}/messages?page=${page}&limit=${limit}`
      );
      
      const endTime = performance.now();
      console.log(`[useGroups] API call completed in ${(endTime - startTime).toFixed(2)}ms`);
      console.log(`[useGroups] Retrieved ${data?.data?.length || 0} messages`);
      
      if (data && data.data) {
        console.log(`[useGroups] First message:`, 
          data.data.length > 0 ? {
            id: data.data[0].id,
            content: data.data[0].content?.substring(0, 20) + '...',
            sender_id: data.data[0].sender_id,
          } : 'none'
        );
      }

      if (page === 1 || page <= 0) {
        console.log(`[useGroups] Replacing groupMessages with ${data?.data?.length || 0} new messages`);
        groupMessages.value = data.data || [];
      } else {
        console.log(`[useGroups] Adding ${data?.data?.length || 0} older messages to existing ${groupMessages.value.length}`);
        // For pagination, older messages are usually added at the beginning
        groupMessages.value = [...(data.data || []), ...groupMessages.value];
      }

      // Update pagination info
      if (data.pagination) {
        console.log(`[useGroups] Updated pagination:`, {
          current_page: data.pagination.current_page,
          total_pages: data.pagination.total_pages,
          has_more_pages: data.pagination.has_more_pages
        });
        messagesPagination.value = data.pagination;
      }

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch group messages";
      console.error(`[useGroups] Error fetching messages for group ${groupId}:`, err);
      throw err;
    } finally {
      console.log(`[useGroups] Finished getGroupMessages, setting isLoading to false`);
      isLoading.value = false;
    }
  }

  /**
   * Load more messages (older messages)
   */
  async function loadMoreMessages(
    groupId: string
  ): Promise<ApiResponse | null> {
    if (messagesPagination.value.has_more_pages) {
      const nextPage = messagesPagination.value.current_page + 1;
      return getGroupMessages(
        groupId,
        nextPage,
        messagesPagination.value.items_per_page
      );
    }
    return null;
  }

  /**
   * Send a message to a group
   */
  async function sendGroupMessage(
    groupId: string,
    content: string,
    type = "text"
  ): Promise<ApiResponse> {
    console.log(`[useGroups] Sending message to group ${groupId}`);
    console.log(`[useGroups] Message content: ${content.substring(0, 20)}${content.length > 20 ? '...' : ''}`);
    
    isLoading.value = true;
    error.value = null;

    try {
      console.log(`[useGroups] Making API call to /groups/${groupId}/messages`);
      const startTime = performance.now();
      
      const data = await $api.post(`/groups/${groupId}/messages`, {
        content,
        type,
      });
      
      const endTime = performance.now();
      console.log(`[useGroups] Message sent in ${(endTime - startTime).toFixed(2)}ms`);
      console.log(`[useGroups] API response:`, data ? {
        message: data.message,
        dataPresent: !!data.data,
      } : 'null response');

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to send message";
      console.error(`[useGroups] Error sending message to group ${groupId}:`, err);
      throw err;
    } finally {
      console.log(`[useGroups] Finished sendGroupMessage, setting isLoading to false`);
      isLoading.value = false;
    }
  }

  /**
   * Send a message with an attachment
   */
  async function sendGroupMessageWithAttachment(
    groupId: string,
    content: string,
    type: string,
    attachment: File
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("type", type);
      formData.append("attachment", attachment);

      // Use raw fetch for FormData
      const response = await $api.raw.post(
        `/groups/${groupId}/messages`,
        formData
      );
      const data = await response.json();

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to send message with attachment";
      console.error(
        `Error sending message with attachment to group ${groupId}:`,
        err
      );
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get blocked users from a group
   */
  async function getGroupBlocks(
    groupId: string,
    page = 1
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $api.get(`/groups/${groupId}/blocks?page=${page}`);

      blockedUsers.value = data.data || [];
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch blocked users";
      console.error(`Error fetching blocked users for group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Block a user in a group
   */
  async function blockGroupUser(
    groupId: string,
    userId: string
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Use blocked_user_id as per API specification
      const data = await $api.post(`/groups/${groupId}/blocks`, {
        blocked_user_id: userId,
      });

      // Refresh blocked users list
      await getGroupBlocks(groupId);
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to block user in group";
      console.error(`Error blocking user ${userId} in group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Unblock a user from a group
   */
  async function unblockGroupUser(
    groupId: string,
    userId: string
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $api.delete(`/groups/${groupId}/blocks/${userId}`);

      // Update local state by removing the blocked user
      blockedUsers.value = blockedUsers.value.filter(
        (block) => block.user_id !== userId
      );
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to unblock user in group";
      console.error(
        `Error unblocking user ${userId} in group ${groupId}:`,
        err
      );
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    groups,
    currentGroup,
    groupMembers,
    groupMessages,
    blockedUsers,
    isLoading,
    error,
    messagesPagination,
    membersPagination,

    // Actions
    getGroups,
    createGroup,
    getGroupDetails,
    updateGroup,
    getGroupMembers,
    loadMoreMembers,
    addGroupMembers,
    removeGroupMember,
    leaveGroup,
    getGroupMessages,
    loadMoreMessages,
    sendGroupMessage,
    sendGroupMessageWithAttachment,
    getGroupBlocks,
    blockGroupUser,
    unblockGroupUser,
  };
});
