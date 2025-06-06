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
  // API response fields
  first_name?: string;
  last_name?: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  is_owner?: boolean;
  // Processed name fields from extractMemberName function
  extracted_name?: string;
  display_name?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    profile_picture_url?: string;
    first_name?: string;
    last_name?: string;
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
   * Helper function to extract name from member object with multiple fallbacks
   * Enhanced to prioritize full_name from the API response structure
   */
  function extractMemberName(member: any): string {
    // Simplified logging for better performance
    console.log(
      `🔍 [extractMemberName] Processing member ID:`,
      member.id || member.user_id
    );

    // Handle invalid member objects
    if (!member || typeof member !== "object") {
      console.warn(`⚠️ [extractMemberName] Invalid member object:`, member);
      return "Unknown User";
    }

    // 1. DIRECT APPROACH: Check member.id or member.user_id to see if it's a string ID
    if (typeof member === "string") {
      return `User ${member.substring(0, 8)}...`;
    }

    // 2. PRIORITY: full_name field from API response structure
    // Based on /groups/{id}/members API endpoint that returns { "full_name": "string" }
    if (
      member.full_name &&
      typeof member.full_name === "string" &&
      member.full_name.trim()
    ) {
      console.log(
        `✅ [extractMemberName] Found full_name from API: "${member.full_name}"`
      );
      return member.full_name.trim();
    }

    // 3. FALLBACK: FIRST+LAST NAME APPROACH - combine first and last name
    // First try direct properties
    if (member.first_name && member.last_name) {
      const fullName = `${member.first_name} ${member.last_name}`.trim();
      console.log(
        `✅ [extractMemberName] Found name from first_name+last_name: "${fullName}"`
      );
      return fullName;
    }

    // Then try nested user object
    if (member.user && member.user.first_name && member.user.last_name) {
      const fullName =
        `${member.user.first_name} ${member.user.last_name}`.trim();
      console.log(
        `✅ [extractMemberName] Found name from user.first_name+user.last_name: "${fullName}"`
      );
      return fullName;
    }

    // Check nested user object for full_name
    if (
      member.user &&
      member.user.full_name &&
      typeof member.user.full_name === "string" &&
      member.user.full_name.trim()
    ) {
      console.log(
        `✅ [extractMemberName] Found user.full_name: "${member.user.full_name}"`
      );
      return member.user.full_name.trim();
    }

    // 4. SINGLE NAME FIELDS APPROACH: Try various single name fields in priority order
    // First check member direct fields
    if (member.first_name) {
      console.log(
        `✅ [extractMemberName] Found first_name: "${member.first_name}"`
      );
      return member.first_name;
    }

    if (member.name) {
      console.log(`✅ [extractMemberName] Found name: "${member.name}"`);
      return member.name;
    }

    if (member.username) {
      console.log(
        `✅ [extractMemberName] Found username: "${member.username}"`
      );
      return member.username;
    }

    // Then try user nested fields
    if (member.user) {
      if (member.user.first_name) {
        console.log(
          `✅ [extractMemberName] Found user.first_name: "${member.user.first_name}"`
        );
        return member.user.first_name;
      }

      if (member.user.name) {
        console.log(
          `✅ [extractMemberName] Found user.name: "${member.user.name}"`
        );
        return member.user.name;
      }

      if (member.user.full_name) {
        console.log(
          `✅ [extractMemberName] Found user.full_name: "${member.user.full_name}"`
        );
        return member.user.full_name;
      }

      if (member.user.username) {
        console.log(
          `✅ [extractMemberName] Found user.username: "${member.user.username}"`
        );
        return member.user.username;
      }

      if (member.user.email) {
        const emailName = member.user.email.split("@")[0];
        console.log(
          `✅ [extractMemberName] Using user.email username: "${emailName}"`
        );
        return emailName;
      }
    }

    // 4. EMAIL APPROACH: Use email username if available
    if (member.email) {
      const emailName = member.email.split("@")[0];
      console.log(
        `✅ [extractMemberName] Using email username: "${emailName}"`
      );
      return emailName;
    }

    // 5. ID APPROACH: Fall back to user IDs
    if (member.user_id) {
      console.log(`🆔 [extractMemberName] Using user_id: "${member.user_id}"`);
      return `User ${member.user_id.substring(0, 8)}...`;
    }

    if (member.id) {
      console.log(`🆔 [extractMemberName] Using id: "${member.id}"`);
      return `User ${member.id.substring(0, 8)}...`;
    }

    // 6. CUSTOM FIELD SEARCH: If all else fails, try to find any field that might be a name
    const possibleFields = Object.keys(member).filter(
      (key) =>
        typeof member[key] === "string" &&
        member[key].length > 0 &&
        key !== "role" &&
        key !== "group_id" &&
        !key.includes("_at") &&
        !key.includes("_url")
    );

    if (possibleFields.length > 0) {
      const field = possibleFields[0];
      console.log(
        `⚠️ [extractMemberName] Using custom field ${field}: "${member[field]}"`
      );
      return member[field];
    }

    console.warn(`⚠️ [extractMemberName] No name found for member:`, {
      memberId: member.id || member.user_id,
      availableFields: Object.keys(member),
    });

    return "Unknown User";
  }

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
      // Use the correct endpoint as per API documentation: /groups/{groupId}/members
      const data = await $api.get(`/groups/${groupId}/members?page=${page}`);

      console.log(`📊 [Groups] API Response for getGroupMembers:`, {
        data: data,
        membersArray: data.members,
        dataArray: data.data,
        sampleMember: data.members?.[0] || data.data?.[0],
      });

      // More detailed logging for debugging member name extraction
      console.log(`🔍 [Groups] DETAILED API RESPONSE ANALYSIS:`);
      console.log(
        `🔍 [Groups] Full Response Structure:`,
        JSON.stringify(data, null, 2)
      );

      if (data.members && data.members.length > 0) {
        console.log(
          `🔍 [Groups] First Member Full Object:`,
          JSON.stringify(data.members[0], null, 2)
        );
        console.log(`🔍 [Groups] Available name fields in first member:`, {
          first_name: data.members[0].first_name,
          last_name: data.members[0].last_name,
          full_name: data.members[0].full_name,
          name: data.members[0].name,
          username: data.members[0].username,
          user: data.members[0].user,
        });
      }

      if (data.data && data.data.length > 0) {
        console.log(
          `🔍 [Groups] First Data Member Full Object:`,
          JSON.stringify(data.data[0], null, 2)
        );
        console.log(`🔍 [Groups] Available name fields in first data member:`, {
          first_name: data.data[0].first_name,
          last_name: data.data[0].last_name,
          full_name: data.data[0].full_name,
          name: data.data[0].name,
          username: data.data[0].username,
          user: data.data[0].user,
        });
      }

      // Check if the response has the expected structure based on API docs
      if (data.members && Array.isArray(data.members)) {
        console.log(
          `📊 [Groups] Found members array with ${data.members.length} members`
        );
        console.log(`📊 [Groups] First member structure:`, data.members[0]);

        // Process members and extract proper names
        const processedMembers = data.members.map((member: any) => {
          const extractedName = extractMemberName(member);
          console.log(
            `📊 [Groups] Member ${member.id} name extracted: "${extractedName}" from:`,
            {
              first_name: member.first_name,
              last_name: member.last_name,
              full_name: member.full_name,
              username: member.username,
              user: member.user,
            }
          );

          return {
            ...member,
            extracted_name: extractedName,
            display_name: extractedName,
          };
        });

        if (page === 1 || page <= 0) {
          groupMembers.value = processedMembers;
        } else {
          // Append new members to existing list for pagination
          groupMembers.value = [...groupMembers.value, ...processedMembers];
        }
      } else if (data.data && Array.isArray(data.data)) {
        console.log(
          `📊 [Groups] Found data array with ${data.data.length} members`
        );
        console.log(`📊 [Groups] First member structure:`, data.data[0]);

        // Process members and extract proper names
        const processedMembers = data.data.map((member: any) => {
          const extractedName = extractMemberName(member);
          console.log(
            `📊 [Groups] Member ${member.id} name extracted: "${extractedName}" from:`,
            {
              first_name: member.first_name,
              last_name: member.last_name,
              full_name: member.full_name,
              username: member.username,
              user: member.user,
            }
          );

          return {
            ...member,
            extracted_name: extractedName,
            display_name: extractedName,
          };
        });

        // Fallback for different response structure
        if (page === 1 || page <= 0) {
          groupMembers.value = processedMembers;
        } else {
          groupMembers.value = [...groupMembers.value, ...processedMembers];
        }
      } else {
        console.warn("⚠️ [Groups] Unexpected response structure:", data);
        groupMembers.value = [];
      }

      // Update pagination info if available
      if (data.pagination) {
        membersPagination.value = data.pagination;
      }

      console.log(
        `📊 [Groups] Loaded ${groupMembers.value.length} members for group ${groupId}`
      );
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
    console.log(
      `[useGroups] Getting messages for group ${groupId}, page ${page}, limit ${limit}`
    );
    isLoading.value = true;
    error.value = null;

    try {
      console.log(`[useGroups] Making API call to /groups/${groupId}/messages`);
      const startTime = performance.now();

      const data = await $api.get(
        `/groups/${groupId}/messages?page=${page}&limit=${limit}`
      );

      const endTime = performance.now();
      console.log(
        `[useGroups] API call completed in ${(endTime - startTime).toFixed(
          2
        )}ms`
      );
      console.log(`[useGroups] Retrieved ${data?.data?.length || 0} messages`);

      if (data && data.data) {
        console.log(
          `[useGroups] First message:`,
          data.data.length > 0
            ? {
                id: data.data[0].id,
                content: data.data[0].content?.substring(0, 20) + "...",
                sender_id: data.data[0].sender_id,
              }
            : "none"
        );
      }

      if (page === 1 || page <= 0) {
        console.log(
          `[useGroups] Replacing groupMessages with ${
            data?.data?.length || 0
          } new messages`
        );
        groupMessages.value = data.data || [];
      } else {
        console.log(
          `[useGroups] Adding ${
            data?.data?.length || 0
          } older messages to existing ${groupMessages.value.length}`
        );
        // For pagination, older messages are usually added at the beginning
        groupMessages.value = [...(data.data || []), ...groupMessages.value];
      }

      // Update pagination info
      if (data.pagination) {
        console.log(`[useGroups] Updated pagination:`, {
          current_page: data.pagination.current_page,
          total_pages: data.pagination.total_pages,
          has_more_pages: data.pagination.has_more_pages,
        });
        messagesPagination.value = data.pagination;
      }

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch group messages";
      console.error(
        `[useGroups] Error fetching messages for group ${groupId}:`,
        err
      );
      throw err;
    } finally {
      console.log(
        `[useGroups] Finished getGroupMessages, setting isLoading to false`
      );
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
    console.log(
      `[useGroups] Message content: ${content.substring(0, 20)}${
        content.length > 20 ? "..." : ""
      }`
    );

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
      console.log(
        `[useGroups] Message sent in ${(endTime - startTime).toFixed(2)}ms`
      );
      console.log(
        `[useGroups] API response:`,
        data
          ? {
              message: data.message,
              dataPresent: !!data.data,
            }
          : "null response"
      );

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to send message";
      console.error(
        `[useGroups] Error sending message to group ${groupId}:`,
        err
      );
      throw err;
    } finally {
      console.log(
        `[useGroups] Finished sendGroupMessage, setting isLoading to false`
      );
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
      console.log(
        `🔒 [blockGroupUser] Blocking user ${userId} in group ${groupId}`
      );
      console.log(
        `🔒 [blockGroupUser] PUT endpoint: /groups/${groupId}/blocks`
      );
      console.log(`🔒 [blockGroupUser] Body:`, { blocked_user_id: userId });

      // Use PUT method as per API specification
      const data = await $api.put(`/groups/${groupId}/blocks`, {
        blocked_user_id: userId,
      });

      console.log(`✅ [blockGroupUser] Block successful:`, data);

      // Refresh blocked users list
      await getGroupBlocks(groupId);
      return data;
    } catch (err: any) {
      console.error(
        `❌ [blockGroupUser] Error blocking user ${userId} in group ${groupId}:`,
        {
          error: err,
          message: err.message,
          response: err.response,
          data: err.data,
        }
      );

      error.value = err.message || "Failed to block user in group";
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
      console.log(
        `🔓 [unblockGroupUser] Unblocking user ${userId} from group ${groupId}`
      );
      console.log(
        `🔓 [unblockGroupUser] DELETE endpoint: /groups/${groupId}/blocks/${userId}`
      );

      // Use DELETE method as per API specification
      const data = await $api.delete(`/groups/${groupId}/blocks/${userId}`);

      console.log(`✅ [unblockGroupUser] Unblock successful:`, data);

      // Update local state by removing the blocked user
      blockedUsers.value = blockedUsers.value.filter(
        (block) => block.user_id !== userId
      );
      return data;
    } catch (err: any) {
      console.error(
        `❌ [unblockGroupUser] Error unblocking user ${userId} in group ${groupId}:`,
        {
          error: err,
          message: err.message,
          response: err.response,
          data: err.data,
        }
      );

      error.value = err.message || "Failed to unblock user in group";
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
