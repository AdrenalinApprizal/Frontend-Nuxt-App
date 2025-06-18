import { p as pinia_prodExports, v as vueExports, a as useNuxtApp } from './server.mjs';

const useGroupsStore = pinia_prodExports.defineStore("groups", () => {
  const groups = vueExports.ref([]);
  const currentGroup = vueExports.ref(null);
  const groupMembers = vueExports.ref([]);
  const groupMessages = vueExports.ref([]);
  const isLoading = vueExports.ref(false);
  const error = vueExports.ref(null);
  const messagesPagination = vueExports.ref({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 20,
    has_more_pages: false
  });
  const membersPagination = vueExports.ref({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 20,
    has_more_pages: false
  });
  const blockedUsers = vueExports.ref(
    []
  );
  const nuxtApp = useNuxtApp();
  const { $api, $toast } = nuxtApp;
  function extractMemberName(member) {
    console.log(
      `\u{1F50D} [extractMemberName] Processing member ID:`,
      member.id || member.user_id
    );
    if (!member || typeof member !== "object") {
      console.warn(`\u26A0\uFE0F [extractMemberName] Invalid member object:`, member);
      return "Unknown User";
    }
    if (typeof member === "string") {
      return `User ${member.substring(0, 8)}...`;
    }
    if (member.full_name && typeof member.full_name === "string" && member.full_name.trim()) {
      console.log(
        `\u2705 [extractMemberName] Found full_name from API: "${member.full_name}"`
      );
      return member.full_name.trim();
    }
    if (member.first_name && member.last_name) {
      const fullName = `${member.first_name} ${member.last_name}`.trim();
      console.log(
        `\u2705 [extractMemberName] Found name from first_name+last_name: "${fullName}"`
      );
      return fullName;
    }
    if (member.user && member.user.first_name && member.user.last_name) {
      const fullName = `${member.user.first_name} ${member.user.last_name}`.trim();
      console.log(
        `\u2705 [extractMemberName] Found name from user.first_name+user.last_name: "${fullName}"`
      );
      return fullName;
    }
    if (member.user && member.user.full_name && typeof member.user.full_name === "string" && member.user.full_name.trim()) {
      console.log(
        `\u2705 [extractMemberName] Found user.full_name: "${member.user.full_name}"`
      );
      return member.user.full_name.trim();
    }
    if (member.first_name) {
      console.log(
        `\u2705 [extractMemberName] Found first_name: "${member.first_name}"`
      );
      return member.first_name;
    }
    if (member.name) {
      console.log(`\u2705 [extractMemberName] Found name: "${member.name}"`);
      return member.name;
    }
    if (member.username) {
      console.log(
        `\u2705 [extractMemberName] Found username: "${member.username}"`
      );
      return member.username;
    }
    if (member.user) {
      if (member.user.first_name) {
        console.log(
          `\u2705 [extractMemberName] Found user.first_name: "${member.user.first_name}"`
        );
        return member.user.first_name;
      }
      if (member.user.name) {
        console.log(
          `\u2705 [extractMemberName] Found user.name: "${member.user.name}"`
        );
        return member.user.name;
      }
      if (member.user.full_name) {
        console.log(
          `\u2705 [extractMemberName] Found user.full_name: "${member.user.full_name}"`
        );
        return member.user.full_name;
      }
      if (member.user.username) {
        console.log(
          `\u2705 [extractMemberName] Found user.username: "${member.user.username}"`
        );
        return member.user.username;
      }
      if (member.user.email) {
        const emailName = member.user.email.split("@")[0];
        console.log(
          `\u2705 [extractMemberName] Using user.email username: "${emailName}"`
        );
        return emailName;
      }
    }
    if (member.email) {
      const emailName = member.email.split("@")[0];
      console.log(
        `\u2705 [extractMemberName] Using email username: "${emailName}"`
      );
      return emailName;
    }
    if (member.user_id) {
      console.log(`\u{1F194} [extractMemberName] Using user_id: "${member.user_id}"`);
      return `User ${member.user_id.substring(0, 8)}...`;
    }
    if (member.id) {
      console.log(`\u{1F194} [extractMemberName] Using id: "${member.id}"`);
      return `User ${member.id.substring(0, 8)}...`;
    }
    const possibleFields = Object.keys(member).filter(
      (key) => typeof member[key] === "string" && member[key].length > 0 && key !== "role" && key !== "group_id" && !key.includes("_at") && !key.includes("_url")
    );
    if (possibleFields.length > 0) {
      const field = possibleFields[0];
      console.log(
        `\u26A0\uFE0F [extractMemberName] Using custom field ${field}: "${member[field]}"`
      );
      return member[field];
    }
    console.warn(`\u26A0\uFE0F [extractMemberName] No name found for member:`, {
      memberId: member.id || member.user_id,
      availableFields: Object.keys(member)
    });
    return "Unknown User";
  }
  async function getGroups() {
    isLoading.value = true;
    error.value = null;
    try {
      console.log("Fetching groups from /groups endpoint");
      const response = await $api.get("/groups");
      console.log("API Response:", JSON.stringify(response, null, 2));
      if (response && typeof response === "object") {
        if (response.groups && Array.isArray(response.groups)) {
          console.log(
            "Found groups array in response.groups, length:",
            response.groups.length
          );
          if (response.groups.length > 0) {
            console.log(
              "Group names:",
              response.groups.map((group) => group.name).join(", ")
            );
          }
          groups.value = response.groups;
        } else if (response.data && Array.isArray(response.data)) {
          console.log(
            "Found groups array in response.data, length:",
            response.data.length
          );
          groups.value = response.data;
        } else if (Array.isArray(response)) {
          console.log(
            "Response is directly an array of groups, length:",
            response.length
          );
          groups.value = response;
        } else if (response.data && typeof response.data === "object" && response.data.groups && Array.isArray(response.data.groups)) {
          console.log(
            "Found groups in response.data.groups, length:",
            response.data.groups.length
          );
          groups.value = response.data.groups;
        } else {
          console.log("Looking for groups array in response properties");
          for (const key in response) {
            if (Array.isArray(response[key])) {
              if (response[key].length > 0 && response[key][0] && (response[key][0].name !== void 0 || response[key][0].id !== void 0)) {
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
      if (!Array.isArray(groups.value)) {
        console.log(
          "No valid groups array found in response, setting to empty array"
        );
        groups.value = [];
      } else {
        console.log("Final groups data:", groups.value);
        console.log(
          "Group names:",
          groups.value.map((group) => group.name).join(", ")
        );
      }
      return response;
    } catch (err) {
      error.value = err.message || "Failed to fetch groups";
      console.error("Error fetching groups:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function createGroup(groupData) {
    isLoading.value = true;
    error.value = null;
    try {
      let data;
      if (groupData.avatar) {
        const formData = new FormData();
        formData.append("name", groupData.name);
        groupData.members.forEach((memberId) => {
          formData.append("members[]", memberId);
        });
        formData.append("avatar", groupData.avatar);
        const response = await $api.raw.post("/groups", formData);
        data = await response.json();
      } else {
        data = await $api.post("/groups", {
          name: groupData.name,
          members: groupData.members
        });
      }
      await getGroups();
      return data;
    } catch (err) {
      error.value = err.message || "Failed to create group";
      console.error("Error creating group:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function getGroupDetails(groupId) {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await $api.get(`/groups/${groupId}`);
      currentGroup.value = data;
      return data;
    } catch (err) {
      error.value = err.message || "Failed to fetch group details";
      console.error(`Error fetching group ${groupId} details:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function updateGroup(groupId, updateData) {
    isLoading.value = true;
    error.value = null;
    try {
      let data;
      if (updateData.avatar) {
        const formData = new FormData();
        if (updateData.name) {
          formData.append("name", updateData.name);
        }
        formData.append("avatar", updateData.avatar);
        const response = await $api.raw.put(`/groups/${groupId}`, formData);
        data = await response.json();
      } else {
        data = await $api.put(`/groups/${groupId}`, updateData);
      }
      await getGroupDetails(groupId);
      return data;
    } catch (err) {
      error.value = err.message || "Failed to update group";
      console.error(`Error updating group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function getGroupMembers(groupId, page = 1) {
    var _a, _b;
    isLoading.value = true;
    error.value = null;
    try {
      const data = await $api.get(`/groups/${groupId}/members?page=${page}`);
      console.log(`\u{1F4CA} [Groups] API Response for getGroupMembers:`, {
        data,
        membersArray: data.members,
        dataArray: data.data,
        sampleMember: ((_a = data.members) == null ? void 0 : _a[0]) || ((_b = data.data) == null ? void 0 : _b[0])
      });
      console.log(`\u{1F50D} [Groups] DETAILED API RESPONSE ANALYSIS:`);
      console.log(
        `\u{1F50D} [Groups] Full Response Structure:`,
        JSON.stringify(data, null, 2)
      );
      if (data.members && data.members.length > 0) {
        console.log(
          `\u{1F50D} [Groups] First Member Full Object:`,
          JSON.stringify(data.members[0], null, 2)
        );
        console.log(`\u{1F50D} [Groups] Available name fields in first member:`, {
          first_name: data.members[0].first_name,
          last_name: data.members[0].last_name,
          full_name: data.members[0].full_name,
          name: data.members[0].name,
          username: data.members[0].username,
          user: data.members[0].user
        });
      }
      if (data.data && data.data.length > 0) {
        console.log(
          `\u{1F50D} [Groups] First Data Member Full Object:`,
          JSON.stringify(data.data[0], null, 2)
        );
        console.log(`\u{1F50D} [Groups] Available name fields in first data member:`, {
          first_name: data.data[0].first_name,
          last_name: data.data[0].last_name,
          full_name: data.data[0].full_name,
          name: data.data[0].name,
          username: data.data[0].username,
          user: data.data[0].user
        });
      }
      if (data.members && Array.isArray(data.members)) {
        console.log(
          `\u{1F4CA} [Groups] Found members array with ${data.members.length} members`
        );
        console.log(`\u{1F4CA} [Groups] First member structure:`, data.members[0]);
        const processedMembers = data.members.map((member) => {
          const extractedName = extractMemberName(member);
          console.log(
            `\u{1F4CA} [Groups] Member ${member.id} name extracted: "${extractedName}" from:`,
            {
              first_name: member.first_name,
              last_name: member.last_name,
              full_name: member.full_name,
              username: member.username,
              user: member.user
            }
          );
          return {
            ...member,
            extracted_name: extractedName,
            display_name: extractedName
          };
        });
        if (page === 1 || page <= 0) {
          groupMembers.value = processedMembers;
        } else {
          groupMembers.value = [...groupMembers.value, ...processedMembers];
        }
      } else if (data.data && Array.isArray(data.data)) {
        console.log(
          `\u{1F4CA} [Groups] Found data array with ${data.data.length} members`
        );
        console.log(`\u{1F4CA} [Groups] First member structure:`, data.data[0]);
        const processedMembers = data.data.map((member) => {
          const extractedName = extractMemberName(member);
          console.log(
            `\u{1F4CA} [Groups] Member ${member.id} name extracted: "${extractedName}" from:`,
            {
              first_name: member.first_name,
              last_name: member.last_name,
              full_name: member.full_name,
              username: member.username,
              user: member.user
            }
          );
          return {
            ...member,
            extracted_name: extractedName,
            display_name: extractedName
          };
        });
        if (page === 1 || page <= 0) {
          groupMembers.value = processedMembers;
        } else {
          groupMembers.value = [...groupMembers.value, ...processedMembers];
        }
      } else {
        console.warn("\u26A0\uFE0F [Groups] Unexpected response structure:", data);
        groupMembers.value = [];
      }
      if (data.pagination) {
        membersPagination.value = data.pagination;
      }
      console.log(
        `\u{1F4CA} [Groups] Loaded ${groupMembers.value.length} members for group ${groupId}`
      );
      return data;
    } catch (err) {
      error.value = err.message || "Failed to fetch group members";
      console.error(`Error fetching members for group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function loadMoreMembers(groupId) {
    if (membersPagination.value.has_more_pages) {
      const nextPage = membersPagination.value.current_page + 1;
      return getGroupMembers(groupId, nextPage);
    }
    return null;
  }
  async function addGroupMembers(groupId, memberIds) {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await $api.post(`/groups/${groupId}/members`, {
        memberIds
      });
      await getGroupMembers(groupId);
      return data;
    } catch (err) {
      error.value = err.message || "Failed to add members to group";
      console.error(`Error adding members to group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function removeGroupMember(groupId, userId) {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await $api.delete(`/groups/${groupId}/members/${userId}`);
      groupMembers.value = groupMembers.value.filter(
        (member) => member.user_id !== userId
      );
      return data;
    } catch (err) {
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
  async function leaveGroup(groupId) {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await $api.post(`/groups/${groupId}/leave`, {});
      groups.value = groups.value.filter((group) => group.id !== groupId);
      return data;
    } catch (err) {
      error.value = err.message || "Failed to leave group";
      console.error(`Error leaving group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function getGroupMessages(groupId, page = 1, limit = 20) {
    var _a, _b, _c, _d;
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
      console.log(`[useGroups] Retrieved ${((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.length) || 0} messages`);
      if (data && data.data) {
        console.log(
          `[useGroups] First message:`,
          data.data.length > 0 ? {
            id: data.data[0].id,
            content: ((_b = data.data[0].content) == null ? void 0 : _b.substring(0, 20)) + "...",
            sender_id: data.data[0].sender_id
          } : "none"
        );
      }
      if (page === 1 || page <= 0) {
        console.log(
          `[useGroups] Replacing groupMessages with ${((_c = data == null ? void 0 : data.data) == null ? void 0 : _c.length) || 0} new messages`
        );
        groupMessages.value = data.data || [];
      } else {
        console.log(
          `[useGroups] Adding ${((_d = data == null ? void 0 : data.data) == null ? void 0 : _d.length) || 0} older messages to existing ${groupMessages.value.length}`
        );
        groupMessages.value = [...data.data || [], ...groupMessages.value];
      }
      if (data.pagination) {
        console.log(`[useGroups] Updated pagination:`, {
          current_page: data.pagination.current_page,
          total_pages: data.pagination.total_pages,
          has_more_pages: data.pagination.has_more_pages
        });
        messagesPagination.value = data.pagination;
      }
      return data;
    } catch (err) {
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
  async function loadMoreMessages(groupId) {
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
  async function sendGroupMessage(groupId, content, type = "text") {
    console.log(`[useGroups] Sending message to group ${groupId}`);
    console.log(
      `[useGroups] Message content: ${content.substring(0, 20)}${content.length > 20 ? "..." : ""}`
    );
    isLoading.value = true;
    error.value = null;
    try {
      console.log(`[useGroups] Making API call to /groups/${groupId}/messages`);
      const startTime = performance.now();
      const data = await $api.post(`/groups/${groupId}/messages`, {
        content,
        type
      });
      const endTime = performance.now();
      console.log(
        `[useGroups] Message sent in ${(endTime - startTime).toFixed(2)}ms`
      );
      console.log(
        `[useGroups] API response:`,
        data ? {
          message: data.message,
          dataPresent: !!data.data
        } : "null response"
      );
      return data;
    } catch (err) {
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
  async function sendGroupMessageWithAttachment(groupId, content, type, attachment) {
    isLoading.value = true;
    error.value = null;
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("type", type);
      formData.append("attachment", attachment);
      const response = await $api.raw.post(
        `/groups/${groupId}/messages`,
        formData
      );
      const data = await response.json();
      return data;
    } catch (err) {
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
  async function getGroupBlocks(groupId, page = 1) {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await $api.get(`/groups/${groupId}/blocks?page=${page}`);
      blockedUsers.value = data.data || [];
      return data;
    } catch (err) {
      error.value = err.message || "Failed to fetch blocked users";
      console.error(`Error fetching blocked users for group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function blockGroupUser(groupId, userId) {
    isLoading.value = true;
    error.value = null;
    try {
      console.log(
        `\u{1F512} [blockGroupUser] Blocking user ${userId} in group ${groupId}`
      );
      console.log(
        `\u{1F512} [blockGroupUser] PUT endpoint: /groups/${groupId}/blocks`
      );
      console.log(`\u{1F512} [blockGroupUser] Body:`, { blocked_user_id: userId });
      const data = await $api.put(`/groups/${groupId}/blocks`, {
        blocked_user_id: userId
      });
      console.log(`\u2705 [blockGroupUser] Block successful:`, data);
      await getGroupBlocks(groupId);
      return data;
    } catch (err) {
      console.error(
        `\u274C [blockGroupUser] Error blocking user ${userId} in group ${groupId}:`,
        {
          error: err,
          message: err.message,
          response: err.response,
          data: err.data
        }
      );
      error.value = err.message || "Failed to block user in group";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function unblockGroupUser(groupId, userId) {
    isLoading.value = true;
    error.value = null;
    try {
      console.log(
        `\u{1F513} [unblockGroupUser] Unblocking user ${userId} from group ${groupId}`
      );
      console.log(
        `\u{1F513} [unblockGroupUser] DELETE endpoint: /groups/${groupId}/blocks/${userId}`
      );
      const data = await $api.delete(`/groups/${groupId}/blocks/${userId}`);
      console.log(`\u2705 [unblockGroupUser] Unblock successful:`, data);
      blockedUsers.value = blockedUsers.value.filter(
        (block) => block.user_id !== userId
      );
      return data;
    } catch (err) {
      console.error(
        `\u274C [unblockGroupUser] Error unblocking user ${userId} in group ${groupId}:`,
        {
          error: err,
          message: err.message,
          response: err.response,
          data: err.data
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
    unblockGroupUser
  };
});

export { useGroupsStore as u };
//# sourceMappingURL=useGroups-DELxsTvM.mjs.map
