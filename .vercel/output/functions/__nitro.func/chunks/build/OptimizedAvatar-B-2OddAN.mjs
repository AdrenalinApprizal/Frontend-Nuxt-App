import { ref, computed, defineComponent, watch, mergeProps, useSSRContext } from 'vue';
import { defineStore } from 'pinia';
import { a as useRouter, c as useAuthStore, b as useNuxtApp, i as useRuntimeConfig, e as __nuxt_component_0$1 } from './server.mjs';
import mitt from 'mitt';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = () => {
  console.error(intervalError);
};
const useMessagesStore = defineStore("messages", () => {
  const messages = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const messagesPagination = ref({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 20,
    has_more_pages: false
  });
  const nuxtApp = useNuxtApp();
  const { $api, $toast } = nuxtApp;
  const proxyUrl = "/api/proxy";
  async function getMessages(params) {
    var _a, _b;
    isLoading.value = true;
    error.value = null;
    try {
      const { target_id, type = "private", limit = 20, page, before } = params;
      const isPagination = !!before;
      const isInitialLoad = !page || page === 1;
      let queryParams = new URLSearchParams({
        type,
        target_id,
        limit: limit.toString()
      });
      if (before) {
        queryParams.append("before", before);
      } else if (page && page > 1) {
        queryParams.append("page", page.toString());
      }
      console.log(
        `[useMessages] getMessages: ${type} chat with ${target_id}, ${isPagination ? `pagination before ${before}` : `page ${page || 1}`}`
      );
      console.log(`[useMessages] Query parameters:`, queryParams.toString());
      console.log(
        `[useMessages] Full URL:`,
        `/messages/history?${queryParams.toString()}`
      );
      const endpoint = `/messages/history?${queryParams.toString().replace(/\+/g, "%2B")}`;
      console.log(`[useMessages] Making API request to endpoint: ${endpoint}`);
      const response = await $api.get(endpoint);
      console.log(`[useMessages] API Response:`, {
        status: "success",
        data_length: ((_a = response.data) == null ? void 0 : _a.length) || 0,
        data_sample: (_b = response.data) == null ? void 0 : _b.slice(0, 2),
        pagination: response.pagination,
        full_response: response
      });
      let messagesArray = [];
      if (Array.isArray(response)) {
        console.log(
          `[useMessages] Response is direct array with ${response.length} messages`
        );
        messagesArray = response;
      } else if (Array.isArray(response.data)) {
        console.log(
          `[useMessages] Response.data contains ${response.data.length} messages`
        );
        messagesArray = response.data;
      } else {
        console.warn(`[useMessages] Unexpected response structure:`, {
          responseKeys: Object.keys(response || {}),
          responseType: typeof response,
          isArray: Array.isArray(response),
          dataExists: !!(response == null ? void 0 : response.data),
          dataType: typeof (response == null ? void 0 : response.data),
          dataIsArray: Array.isArray(response == null ? void 0 : response.data)
        });
        messagesArray = [];
      }
      messagesArray = messagesArray.map((msg) => ({
        ...msg,
        // Ensure both id and message_id are available for compatibility
        id: msg.id || msg.message_id,
        message_id: msg.message_id || msg.id
      }));
      console.log(`[useMessages] Retrieved ${messagesArray.length} messages`);
      if (isInitialLoad && !before) {
        messages.value = messagesArray;
        console.log(
          `[useMessages] Initial load: Set ${messages.value.length} messages`
        );
      } else {
        const existingIds = new Set(
          messages.value.map((m) => m.id || m.message_id).filter(Boolean)
        );
        const newMessages = messagesArray.filter((msg) => {
          const msgId = msg.id || msg.message_id;
          return msgId && !existingIds.has(msgId);
        });
        if (newMessages.length > 0) {
          if (before) {
            console.log(
              `[useMessages] Pagination: Adding ${newMessages.length} older messages`
            );
            messages.value = [...newMessages, ...messages.value];
          } else {
            console.log(
              `[useMessages] Page load: Adding ${newMessages.length} messages`
            );
            messages.value = [...newMessages, ...messages.value];
          }
        }
      }
      if (response.pagination) {
        messagesPagination.value = response.pagination;
      }
      return response;
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch messages";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function getMessagesLegacy(userId, page = 1, limit = 20) {
    console.log(
      `[useMessages] Legacy getMessages called - converting to unified format`
    );
    return getMessages({
      target_id: userId,
      type: "private",
      page,
      limit
    });
  }
  async function getGroupMessages(groupId, page = 1, limit = 20) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/group/${groupId}/messages`, {
        method: "GET",
        params: {
          page,
          limit
        },
        credentials: "include"
      });
      if (page === 1 || page <= 0) {
        messages.value = response.data || [];
      } else {
        messages.value = [...response.data || [], ...messages.value];
      }
      if (response.pagination) {
        messagesPagination.value = response.pagination;
      }
      return response;
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch group messages";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function sendMessage(recipientId, content, type = "text", attachmentUrl) {
    isLoading.value = true;
    error.value = null;
    try {
      const messageData = {
        content,
        receiver_id: recipientId,
        type,
        attachment_url: attachmentUrl
      };
      const response = await $api.post("/messages", messageData);
      if (response.data) {
        messages.value.push(response.data);
      }
      return response;
    } catch (err) {
      const errorMsg = err.message || "Failed to send message";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function sendGroupMessage(groupId, content, type = "text", attachmentUrl) {
    isLoading.value = true;
    error.value = null;
    try {
      const messageData = {
        content,
        group_id: groupId,
        type,
        attachment_url: attachmentUrl
      };
      const response = await $api.post("/groups/messages", messageData);
      if (response.data) {
        messages.value.push(response.data);
      }
      return response;
    } catch (err) {
      const errorMsg = err.message || "Failed to send group message";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function editMessage(messageId, content) {
    isLoading.value = true;
    error.value = null;
    try {
      if (messageId.startsWith("temp-")) {
        console.log(
          `[useMessages] Attempting to edit a temp message: ${messageId}`
        );
        const messageToEdit = messages.value.find(
          (msg) => msg.id === messageId
        );
        if ((messageToEdit == null ? void 0 : messageToEdit.message_id) && !messageToEdit.message_id.startsWith("temp-")) {
          console.log(
            `[useMessages] Using real message_id ${messageToEdit.message_id} instead of temp ID`
          );
          messageId = messageToEdit.message_id;
        } else {
          messages.value = messages.value.map((message) => {
            if (message.id === messageId) {
              return {
                ...message,
                content,
                updated_at: (/* @__PURE__ */ new Date()).toISOString(),
                isEdited: true
              };
            }
            return message;
          });
          console.log(
            `[useMessages] This is a local-only temporary message, updating without API call`
          );
          return { message: "Local temporary message updated" };
        }
      }
      console.log(
        `[useMessages] Sending edit request for message ${messageId} with content:`,
        content
      );
      const response = await $api.put(`/messages/${messageId}`, {
        content
      });
      console.log(`[useMessages] Edit API response:`, response);
      const beforeCount = messages.value.length;
      messages.value = messages.value.map((message) => {
        if (message.id === messageId || message.message_id === messageId) {
          console.log(
            `[useMessages] Updating message ${messageId} in local state:`,
            {
              oldContent: message.content,
              newContent: content,
              isEdited: true
            }
          );
          return {
            ...message,
            content,
            updated_at: (/* @__PURE__ */ new Date()).toISOString(),
            isEdited: true
          };
        }
        return message;
      });
      console.log(
        `[useMessages] Updated ${beforeCount} messages in local state`
      );
      if (response.data && response.data.isEdited !== void 0) {
        console.log(
          `[useMessages] Server returned isEdited field:`,
          response.data.isEdited
        );
        messages.value = messages.value.map((message) => {
          if (message.id === messageId || message.message_id === messageId) {
            return {
              ...message,
              content: response.data.content || content,
              updated_at: response.data.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
              isEdited: response.data.isEdited || true
            };
          }
          return message;
        });
      }
      return response;
    } catch (err) {
      const errorMsg = err.message || "Failed to edit message";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteMessage(messageId, isGroupMessage) {
    isLoading.value = true;
    error.value = null;
    try {
      console.log(
        `[useMessages] Deleting message ${messageId}, is group message: ${!!isGroupMessage}`
      );
      if (messageId.startsWith("temp-")) {
        console.log(
          `[useMessages] Attempting to delete a temp message: ${messageId}`
        );
        const messageToDelete = messages.value.find(
          (msg) => msg.id === messageId
        );
        if (messageToDelete) {
          if (messageToDelete.message_id && typeof messageToDelete.message_id === "string" && !messageToDelete.message_id.startsWith("temp-")) {
            console.log(
              `[useMessages] Using real message_id ${messageToDelete.message_id} instead of temp ID`
            );
            messageId = messageToDelete.message_id;
          } else {
            console.log(
              `[useMessages] This is a local-only temporary message, removing without API call`
            );
            messages.value = messages.value.filter(
              (message) => message.id !== messageId
            );
            return { message: "Local temporary message removed" };
          }
        } else {
          console.log(
            `[useMessages] Could not find message with ID: ${messageId}`
          );
          return { message: "Message not found in local state" };
        }
      }
      console.log(`[useMessages] Deleting message with ID: ${messageId}`);
      let deleteEndpoint = `/messages/${messageId}`;
      if (isGroupMessage) {
        console.log(`[useMessages] Using group message deletion endpoint`);
        deleteEndpoint = `/messages/${messageId}`;
      }
      console.log(`[useMessages] Message deletion context:`, {
        messageId,
        endpoint: deleteEndpoint,
        isGroupMessage: !!isGroupMessage,
        validation: `Valid URL: ${typeof messageId === "string" && messageId.length > 0}`
      });
      const response = await $api.delete(deleteEndpoint);
      console.log(`[useMessages] Delete response:`, response);
      const beforeCount = messages.value.length;
      messages.value = messages.value.filter(
        (message) => (
          // Filter out both the original message and any duplicates with matching message_id
          message.id !== messageId && message.message_id !== messageId
        )
      );
      const afterCount = messages.value.length;
      console.log(
        `[useMessages] Removed ${beforeCount - afterCount} messages from local state`
      );
      return response;
    } catch (err) {
      const errorMsg = err.message || "Failed to delete message";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function markMessagesAsRead(messagesIds) {
    isLoading.value = true;
    error.value = null;
    try {
      const finalMessageIds = messagesIds.map((id) => {
        if (id.startsWith("temp-")) {
          const message = messages.value.find((msg) => msg.id === id);
          return (message == null ? void 0 : message.message_id) || id;
        }
        return id;
      }).filter((id) => !id.startsWith("temp-"));
      if (finalMessageIds.length === 0) {
        console.log("[useMessages] No valid message IDs to mark as read");
        return { message: "No valid messages to mark as read" };
      }
      const response = await $api.put(`/messages/read`, {
        message_ids: finalMessageIds
      });
      messages.value = messages.value.map((message) => {
        if (messagesIds.includes(message.id) || message.message_id && finalMessageIds.includes(message.message_id)) {
          return { ...message, read: true };
        }
        return message;
      });
      return response;
    } catch (err) {
      const errorMsg = err.message || "Failed to mark messages as read";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function sendMessageWithMedia(recipientId, content, type, mediaFile) {
    isLoading.value = true;
    error.value = null;
    try {
      console.log(
        `[useMessages] Uploading media file to /messages/media endpoint`
      );
      console.log(`[useMessages] Media file details:`, {
        name: mediaFile.name,
        size: mediaFile.size,
        type: mediaFile.type
      });
      const formData = new FormData();
      formData.append("file", mediaFile);
      console.log(
        `[useMessages] FormData created with file: ${mediaFile.name}`
      );
      const uploadUrl = "/messages/media";
      console.log(
        `[useMessages] Sending media upload request to: ${uploadUrl}`
      );
      console.log(`[useMessages] About to call $api.raw.post with FormData`);
      let uploadResult;
      try {
        const uploadResponse = await $api.raw.post(uploadUrl, formData, {
          headers: {
            // Don't set Content-Type here, it will be set automatically with boundary for FormData
            // Add authorization headers explicitly for the upload
            Accept: "application/json"
          },
          // Make sure credentials are included (cookies, authorization headers)
          credentials: "include"
        });
        console.log(
          `[useMessages] Upload response status:`,
          uploadResponse.status
        );
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error(
            `[useMessages] Upload failed with status ${uploadResponse.status}:`,
            errorText
          );
          throw new Error(
            `Media upload failed with status: ${uploadResponse.status}. Details: ${errorText}`
          );
        }
        uploadResult = await uploadResponse.json();
        console.log(`[useMessages] Media upload successful:`, uploadResult);
      } catch (uploadErr) {
        console.error(`[useMessages] Error during fetch operation:`, uploadErr);
        throw uploadErr;
      }
      if (!uploadResult.file_url) {
        throw new Error("Media upload succeeded but no file URL was returned");
      }
      const messageData = {
        content,
        receiver_id: recipientId,
        type,
        attachment_url: uploadResult.file_url,
        media_type: mediaFile.type
      };
      const messageResponse = await $api.post(`/messages`, messageData);
      console.log(
        `[useMessages] Message with media sent successfully:`,
        messageResponse
      );
      return messageResponse;
    } catch (err) {
      const errorMsg = err.message || "Failed to send message with media";
      error.value = errorMsg;
      console.error(`[useMessages] Error uploading media:`, err);
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function uploadMedia(file, mediaType, relatedTo) {
    isLoading.value = true;
    error.value = null;
    try {
      console.log(
        `[useMessages] Uploading media file to /messages/media endpoint`
      );
      const formData = new FormData();
      formData.append("file", file);
      if (mediaType) {
        formData.append("media_type", mediaType);
      } else {
        formData.append("media_type", file.type || "application/octet-stream");
      }
      if (relatedTo) {
        formData.append("related_to", relatedTo);
      }
      const uploadUrl = "/messages/media";
      console.log(
        `[useMessages] Sending media upload request to: ${uploadUrl}`
      );
      const uploadResponse = await $api.raw.post(uploadUrl, formData, {
        headers: {
          // Don't set Content-Type here, it will be set automatically with boundary for FormData
          Accept: "application/json"
        },
        // Make sure credentials are included (cookies, authorization headers)
        credentials: "include"
      });
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error(
          `[useMessages] Upload failed with status ${uploadResponse.status}:`,
          errorText
        );
        throw new Error(
          `Media upload failed with status: ${uploadResponse.status}. Details: ${errorText}`
        );
      }
      const uploadResult = await uploadResponse.json();
      console.log(`[useMessages] Media upload successful:`, uploadResult);
      if (!uploadResult.file_url) {
        throw new Error("Media upload succeeded but no file URL was returned");
      }
      return uploadResult;
    } catch (err) {
      const errorMsg = err.message || "Failed to upload media file";
      error.value = errorMsg;
      console.error(`[useMessages] Error uploading media:`, err);
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function searchMessages(params) {
    isLoading.value = true;
    error.value = null;
    try {
      const { q, chatId, type, limit = 20, offset = 0 } = params;
      const queryParams = new URLSearchParams({
        q,
        chatId,
        type,
        limit: limit.toString(),
        offset: offset.toString()
      });
      const response = await $api.get(
        `/groups/search/messages?${queryParams.toString()}`
      );
      return response;
    } catch (err) {
      const errorMsg = err.message || "Failed to search messages";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function getMessageHistory(params) {
    console.log(
      `[useMessages] getMessageHistory called - delegating to unified getMessages`
    );
    const unifiedParams = {
      target_id: params.target_id,
      type: params.type,
      limit: params.limit,
      before: params.before
    };
    return getMessages(unifiedParams);
  }
  async function postMessage(messageData) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $api.post(`/groups/messages`, messageData);
      return response;
    } catch (err) {
      const errorMsg = err.message || "Failed to post message";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function getUnreadCount() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/messages/unread-count`, {
        method: "GET",
        credentials: "include"
      });
      return response;
    } catch (err) {
      const errorMsg = err.message || "Failed to get unread count";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function loadMoreMessages(targetId, type = "private") {
    if (messagesPagination.value.has_more_pages) {
      const nextPage = messagesPagination.value.current_page + 1;
      console.log(
        `[useMessages] loadMoreMessages: Loading page ${nextPage} for ${type} chat with ${targetId}`
      );
      return getMessages({
        target_id: targetId,
        type,
        page: nextPage,
        limit: messagesPagination.value.items_per_page
      });
    }
    console.log(`[useMessages] loadMoreMessages: No more pages available`);
    return null;
  }
  return {
    // State
    messages,
    isLoading,
    error,
    messagesPagination,
    // Actions - Unified Interface
    getMessages,
    // New unified function
    getMessagesLegacy,
    // Legacy compatibility function
    // Other Actions
    getGroupMessages,
    sendMessage,
    sendGroupMessage,
    editMessage,
    deleteMessage,
    markMessagesAsRead,
    sendMessageWithMedia,
    uploadMedia,
    searchMessages,
    getMessageHistory,
    // Now delegates to unified getMessages
    postMessage,
    getUnreadCount,
    loadMoreMessages
  };
});
const eventBus = mitt();
function formatMessageTimestamp(options) {
  const {
    timestamp,
    raw_timestamp,
    created_at,
    sent_at,
    format = "time"
  } = options;
  try {
    const timestampToUse = raw_timestamp || timestamp || created_at || sent_at;
    if (!timestampToUse) {
      return "";
    }
    const date = extractValidDate(timestampToUse);
    if (!date) {
      return "";
    }
    switch (format) {
      case "full":
        return date.toLocaleString("id-ID");
      case "time":
        return date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
      case "date":
        return date.toLocaleDateString("id-ID");
      case "relative":
        const now = /* @__PURE__ */ new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1e3 * 60));
        const diffInHours = Math.floor(diffInMs / (1e3 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1e3 * 60 * 60 * 24));
        if (diffInMinutes < 1) {
          return "Just now";
        } else if (diffInMinutes < 60) {
          return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
          return `${diffInHours}h ago`;
        } else if (diffInDays < 7) {
          return `${diffInDays}d ago`;
        } else {
          return date.toLocaleDateString("id-ID");
        }
      default:
        return date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
    }
  } catch (error) {
    console.warn("Error formatting timestamp:", error);
    return "";
  }
}
function formatTimeString(timestamp) {
  try {
    const date = extractValidDate(timestamp);
    if (!date) {
      return "";
    }
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  } catch (error) {
    console.warn("Error formatting time string:", error);
    return "";
  }
}
function extractValidDate(timestamp) {
  try {
    if (!timestamp) {
      return null;
    }
    if (typeof timestamp === "object" && timestamp !== null && !(timestamp instanceof Date)) {
      const objTimestamp = timestamp;
      if (objTimestamp.raw_timestamp) {
        return extractValidDate(objTimestamp.raw_timestamp);
      }
      return null;
    }
    if (timestamp instanceof Date) {
      return isNaN(timestamp.getTime()) ? null : timestamp;
    }
    if (typeof timestamp === "number") {
      const date = timestamp > 1e10 ? new Date(timestamp) : new Date(timestamp * 1e3);
      return isNaN(date.getTime()) ? null : date;
    }
    if (typeof timestamp === "string") {
      const trimmedTimestamp = timestamp.trim();
      if (!trimmedTimestamp || trimmedTimestamp === "undefined" || trimmedTimestamp === "null" || trimmedTimestamp === "Invalid Date" || trimmedTimestamp === "") {
        console.warn("Invalid timestamp string detected:", timestamp);
        return null;
      }
      const date = new Date(trimmedTimestamp);
      if (isNaN(date.getTime())) {
        console.warn("Could not parse timestamp string:", timestamp);
        return null;
      }
      return date;
    }
    return null;
  } catch (error) {
    console.warn(
      "Error extracting date from timestamp:",
      error,
      "Input:",
      timestamp
    );
    return null;
  }
}
function formatDateForSeparator(timestamp) {
  try {
    const date = extractValidDate(timestamp);
    if (!date) {
      console.warn(
        "formatDateForSeparator received invalid timestamp:",
        timestamp
      );
      return "Unknown Date";
    }
    const now = /* @__PURE__ */ new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const diffInMs = today.getTime() - messageDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1e3 * 60 * 60 * 24));
    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } else if (diffInDays < 365) {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric"
      });
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
  } catch (error) {
    console.warn(
      "Error formatting date for separator:",
      error,
      "Input:",
      timestamp
    );
    return "Unknown Date";
  }
}
const useWebSocket = defineStore("websocket", () => {
  const socketMessages = ref(null);
  const isMessagesConnected = ref(false);
  const isMessagesConnecting = ref(false);
  const socketPresence = ref(null);
  const isPresenceConnected = ref(false);
  const isPresenceConnecting = ref(false);
  const reconnectAttempts = ref(0);
  const maxReconnectAttempts = 8;
  const baseReconnectInterval = 1e3;
  const maxReconnectInterval = 3e4;
  const connectionError = ref(null);
  const messageQueue = ref([]);
  const activeSubscriptions = ref([]);
  const authCheckInProgress = ref(false);
  const heartbeatInterval = ref(null);
  const lastHeartbeatTime = ref(0);
  const pendingPings = ref(/* @__PURE__ */ new Set());
  const connectionQuality = ref(
    "disconnected"
  );
  const lastMessageTime = ref(0);
  const networkChangeHandler = ref(null);
  const maxQueueSize = 50;
  const messageRetryCount = ref(/* @__PURE__ */ new Map());
  const maxRetries = 3;
  useRouter();
  const authStore = useAuthStore();
  const messagesStore = useMessagesStore();
  const nuxtApp = useNuxtApp();
  const { $toast } = nuxtApp;
  const getMessagesWebSocketUrl = () => {
    const config = useRuntimeConfig();
    const wsBaseUrl = config.public.wsMessagesUrl;
    const token = authStore.token;
    if (!token) {
      throw new Error("No authentication token available");
    }
    return `${wsBaseUrl}/api/messages/ws?token=${token}`;
  };
  const getPresenceWebSocketUrl = () => {
    const config = useRuntimeConfig();
    const wsBaseUrl = config.public.wsPresenceUrl;
    const token = authStore.token;
    if (!token) {
      console.error("[WebSocket Presence] No authentication token available");
      throw new Error("No authentication token available");
    }
    return `${wsBaseUrl}/api/presence/ws?token=${token}`;
  };
  const validateToken = async () => {
    if (authCheckInProgress.value) return false;
    try {
      authCheckInProgress.value = true;
      if (!authStore.token || !authStore.isAuthenticated) {
        console.log("[WebSocket] No valid token, attempting to refresh auth");
        try {
          await authStore.getUserInfo();
          return !!authStore.token;
        } catch (error) {
          console.error("[WebSocket] Failed to refresh authentication:", error);
          handleAuthFailure();
          return false;
        }
      }
      return true;
    } finally {
      authCheckInProgress.value = false;
    }
  };
  const connect = async () => {
    if (!authStore.isAuthenticated) {
      console.warn("[WebSocket] Not authenticated, cannot connect");
      return;
    }
    try {
      const isTokenValid = await validateToken();
      if (!isTokenValid) {
        console.warn("[WebSocket] Invalid token, cannot connect");
        return;
      }
      setupNetworkChangeDetection();
      restoreMessageQueue();
      try {
        await Promise.all([
          connectMessagesWebSocket(),
          connectPresenceWebSocket()
        ]);
        startHealthChecks();
      } catch (wsError) {
        console.error("[WebSocket] Error during connection:", wsError);
        if (!isMessagesConnected.value) {
          setTimeout(() => connectMessagesWebSocket(), 1e3);
        }
        if (!isPresenceConnected.value) {
          setTimeout(() => connectPresenceWebSocket(), 1500);
        }
      }
    } catch (error) {
      console.error("[WebSocket] Connection initialization error:", error);
      setTimeout(() => {
        if (!isMessagesConnected.value || !isPresenceConnected.value) {
          reconnect();
        }
      }, 3e3);
    }
  };
  const connectMessagesWebSocket = async () => {
    var _a, _b, _c;
    if (isMessagesConnecting.value || isMessagesConnected.value) {
      return;
    }
    try {
      isMessagesConnecting.value = true;
      connectionError.value = null;
      const wsUrl = getMessagesWebSocketUrl();
      console.log(`[WebSocket Messages] Connecting to ${wsUrl}`);
      socketMessages.value = new WebSocket(wsUrl);
      const timeoutId = setTimeout(() => {
        if (isMessagesConnecting.value && socketMessages.value) {
          console.warn("[WebSocket Messages] Connection timeout");
          socketMessages.value.close(4e3, "Connection timeout");
          connectionError.value = "Connection timeout";
          isMessagesConnecting.value = false;
        }
      }, 1e4);
      socketMessages.value.onopen = (event) => {
        clearTimeout(timeoutId);
        handleMessagesOpen(event);
      };
      socketMessages.value.onmessage = handleMessagesMessage;
      socketMessages.value.onerror = handleMessagesError;
      socketMessages.value.onclose = handleMessagesClose;
    } catch (error) {
      console.error("[WebSocket Messages] Connection error:", error);
      connectionError.value = error.message || "Failed to connect to Messages WebSocket server";
      if (((_a = error.message) == null ? void 0 : _a.includes("authentication")) || ((_b = error.message) == null ? void 0 : _b.includes("token")) || ((_c = error.message) == null ? void 0 : _c.includes("No authentication token available"))) {
        handleAuthFailure();
      } else {
        handleMessagesReconnect();
      }
    }
  };
  const connectPresenceWebSocket = async () => {
    var _a, _b, _c;
    if (isPresenceConnecting.value || isPresenceConnected.value) {
      return;
    }
    try {
      isPresenceConnecting.value = true;
      connectionError.value = null;
      const wsUrl = getPresenceWebSocketUrl();
      console.log(`[WebSocket Presence] Connecting to ${wsUrl}`);
      socketPresence.value = new WebSocket(wsUrl);
      const timeoutId = setTimeout(() => {
        if (isPresenceConnecting.value && socketPresence.value) {
          console.warn("[WebSocket Presence] Connection timeout");
          socketPresence.value.close(4e3, "Connection timeout");
          connectionError.value = "Connection timeout";
          isPresenceConnecting.value = false;
        }
      }, 1e4);
      socketPresence.value.onopen = (event) => {
        clearTimeout(timeoutId);
        handlePresenceOpen(event);
      };
      socketPresence.value.onmessage = handlePresenceMessage;
      socketPresence.value.onerror = handlePresenceError;
      socketPresence.value.onclose = handlePresenceClose;
    } catch (error) {
      console.error("[WebSocket Presence] Connection error:", error);
      connectionError.value = error.message || "Failed to connect to Presence WebSocket server";
      if (((_a = error.message) == null ? void 0 : _a.includes("authentication")) || ((_b = error.message) == null ? void 0 : _b.includes("token")) || ((_c = error.message) == null ? void 0 : _c.includes("No authentication token available"))) {
        handleAuthFailure();
      } else {
        handlePresenceReconnect();
      }
    }
  };
  const handleMessagesOpen = (event) => {
    console.log("[WebSocket Messages] Connection established");
    isMessagesConnected.value = true;
    isMessagesConnecting.value = false;
    reconnectAttempts.value = 0;
    lastHeartbeatTime.value = Date.now();
    lastMessageTime.value = Date.now();
    updateConnectionQuality("excellent");
    subscribeToUnreadCounts();
    startHeartbeat();
    processMessageQueue();
    if ($toast) {
      $toast.success("Connected to messaging service");
    }
  };
  const handlePresenceOpen = (event) => {
    console.log("[WebSocket Presence] Connection established");
    isPresenceConnected.value = true;
    isPresenceConnecting.value = false;
    if (activeSubscriptions.value.length > 0) {
      activeSubscriptions.value.forEach((channel) => {
        subscribeToChannel(channel);
      });
    }
    if ($toast) {
      $toast.success("Connected to presence service");
    }
  };
  const subscribeToUnreadCounts = () => {
    if (!isMessagesConnected.value || !socketMessages.value) return;
    const unreadSubscription = {
      action: "subscribe",
      channel: "unread_counts"
    };
    try {
      socketMessages.value.send(JSON.stringify(unreadSubscription));
      console.log("[WebSocket Messages] Subscribed to unread counts");
    } catch (error) {
      console.error(
        "[WebSocket Messages] Error subscribing to unread counts:",
        error
      );
    }
  };
  const subscribeToChannel = (channel) => {
    if (!isPresenceConnected.value || !socketPresence.value) return;
    if (activeSubscriptions.value.includes(channel)) return;
    const subscription = {
      action: "subscribe",
      channel
    };
    try {
      socketPresence.value.send(JSON.stringify(subscription));
      console.log(`[WebSocket Presence] Subscribed to channel: ${channel}`);
      if (!activeSubscriptions.value.includes(channel)) {
        activeSubscriptions.value.push(channel);
      }
    } catch (error) {
      console.error(
        `[WebSocket Presence] Error subscribing to channel ${channel}:`,
        error
      );
    }
  };
  const handleMessagesMessage = (event) => {
    var _a;
    try {
      const message = JSON.parse(event.data);
      lastMessageTime.value = Date.now();
      assessConnectionQuality();
      if (message.type === "pong" && ((_a = message.data) == null ? void 0 : _a.id)) {
        const pingId = message.data.id;
        if (pendingPings.value.has(pingId)) {
          pendingPings.value.delete(pingId);
          lastHeartbeatTime.value = Date.now();
          const latency = Date.now() - message.data.timestamp;
          if (latency < 100) {
            updateConnectionQuality("excellent");
          } else if (latency < 500) {
            updateConnectionQuality("good");
          } else {
            updateConnectionQuality("poor");
          }
        }
        return;
      }
      console.log("[WebSocket Messages] Received message:", message);
      switch (message.type) {
        case "message":
          handleNewMessage(message.data);
          break;
        case "typing":
          handleTypingNotification(message.data);
          break;
        case "stop_typing":
          handleTypingNotification({
            ...message.data,
            is_typing: false
          });
          break;
        case "read":
          handleMessageRead(message.data);
          break;
        case "unread_count":
          handleUnreadCount(message.data);
          break;
        case "message_reaction":
          eventBus.emit("message-reaction", message.data);
          break;
        case "error":
          console.error(
            "[WebSocket Messages] Error from server:",
            message.data
          );
          if ($toast) {
            $toast.error(message.data.message || "Error from messaging server");
          }
          break;
        default:
          console.log(
            "[WebSocket Messages] Unhandled message type:",
            message.type
          );
      }
    } catch (error) {
      console.error("[WebSocket Messages] Failed to parse message:", error);
      updateConnectionQuality("poor");
    }
  };
  const handlePresenceMessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log("[WebSocket Presence] Received message:", message);
      switch (message.type) {
        case "status":
          handleStatusChange(message.data);
          break;
        case "error":
          console.error(
            "[WebSocket Presence] Error from server:",
            message.data
          );
          if ($toast) {
            $toast.error(message.data.message || "Error from presence server");
          }
          break;
        default:
          console.log(
            "[WebSocket Presence] Unhandled message type:",
            message.type
          );
      }
    } catch (error) {
      console.error("[WebSocket Presence] Failed to parse message:", error);
    }
  };
  const handleUnreadCount = (data) => {
    if (!data.unreadCounts) return;
    eventBus.emit("unread-counts-updated", data.unreadCounts);
  };
  const handleTypingNotification = (data) => {
    console.log(
      `[WebSocket] User ${data.user_id} is ${data.is_typing ? "typing" : "not typing"} to ${data.recipient_id}`
    );
    eventBus.emit("typing-status-changed", {
      userId: data.user_id,
      recipientId: data.recipient_id,
      isTyping: data.is_typing
    });
  };
  const handleStatusChange = (data) => {
    try {
      if (!data.user_id) {
        console.error(
          "[WebSocket Presence] Missing user_id in status data:",
          data
        );
        return;
      }
      if (data.status !== "online" && data.status !== "offline") {
        console.warn(
          `[WebSocket Presence] Invalid status value: ${data.status}`
        );
        data.status = "offline";
      }
      let formattedLastSeen = data.last_seen;
      if (data.last_seen) {
        try {
          const date = extractValidDate({ raw_timestamp: data.last_seen });
          if (date && !isNaN(date.getTime())) {
            formattedLastSeen = date.toISOString();
          }
        } catch (e) {
          console.warn(
            "[WebSocket Presence] Invalid last_seen format:",
            data.last_seen
          );
        }
      }
      console.log(
        `[WebSocket Presence] User ${data.user_id} status changed to ${data.status}`
      );
      const currentTimestamp = (/* @__PURE__ */ new Date()).toISOString();
      eventBus.emit("user-status-changed", {
        userId: data.user_id,
        status: data.status,
        lastSeen: formattedLastSeen,
        timestamp: currentTimestamp,
        // ISO string for internal use
        // Add formatted timestamp for direct display in UI components
        formattedLastSeen: data.status === "offline" && formattedLastSeen ? formatTimeString(formattedLastSeen) : null
      });
    } catch (error) {
      console.error(
        "[WebSocket Presence] Error processing status change:",
        error
      );
    }
  };
  const handleAuthFailure = async () => {
    console.warn("[WebSocket] Authentication failure detected");
    disconnect();
    clear();
    try {
      await authStore.getUserInfo();
      if (authStore.isAuthenticated && authStore.token) {
        console.log("[WebSocket] Authentication refreshed, reconnecting");
        setTimeout(() => connect(), 1e3);
        return;
      }
    } catch (error) {
      console.error("[WebSocket] Failed to refresh authentication:", error);
    }
    if (authStore.handleAuthError) {
      authStore.handleAuthError();
    } else {
      authStore.logout();
      if ($toast) {
        $toast.error("Authentication failed. Please log in again.");
      }
    }
  };
  const handleMessagesError = (event) => {
    console.error("[WebSocket Messages] Error:", event);
    connectionError.value = "WebSocket Messages connection error";
    isMessagesConnecting.value = false;
    updateConnectionQuality("poor");
    stopHeartbeat();
  };
  const handlePresenceError = (event) => {
    console.error("[WebSocket Presence] Error:", event);
    connectionError.value = "WebSocket Presence connection error";
    isPresenceConnecting.value = false;
  };
  const handleMessagesClose = (event) => {
    var _a, _b;
    console.log(
      `[WebSocket Messages] Connection closed. Code: ${event.code}, Reason: ${event.reason}`
    );
    isMessagesConnected.value = false;
    isMessagesConnecting.value = false;
    updateConnectionQuality("disconnected");
    stopHeartbeat();
    if (event.code === 1008 || event.code >= 4e3 && event.code <= 4099 || ((_a = event.reason) == null ? void 0 : _a.toLowerCase().includes("auth")) || ((_b = event.reason) == null ? void 0 : _b.toLowerCase().includes("token"))) {
      handleAuthFailure();
    } else if (event.code !== 1e3 && event.code !== 1001) {
      handleMessagesReconnect();
    }
  };
  const handlePresenceClose = (event) => {
    var _a, _b;
    console.log(
      `[WebSocket Presence] Connection closed. Code: ${event.code}, Reason: ${event.reason}`
    );
    isPresenceConnected.value = false;
    isPresenceConnecting.value = false;
    if (event.code === 1008 || event.code >= 4e3 && event.code <= 4099 || ((_a = event.reason) == null ? void 0 : _a.toLowerCase().includes("auth")) || ((_b = event.reason) == null ? void 0 : _b.toLowerCase().includes("token"))) {
      handleAuthFailure();
    } else if (event.code !== 1e3 && event.code !== 1001) {
      handlePresenceReconnect();
    }
  };
  const handleMessagesReconnect = () => {
    if (!authStore.isAuthenticated || reconnectAttempts.value >= maxReconnectAttempts) {
      if (reconnectAttempts.value >= maxReconnectAttempts) {
        console.log("[WebSocket Messages] Max reconnection attempts reached");
        connectionError.value = "Failed to connect after multiple attempts";
        updateConnectionQuality("disconnected");
        if ($toast) {
          $toast.error(
            "Failed to connect to messaging service. Please refresh the page."
          );
        }
      }
      return;
    }
    if (isMessagesConnecting.value) {
      return;
    }
    const delay = getReconnectDelay(reconnectAttempts.value);
    reconnectAttempts.value++;
    console.log(
      `[WebSocket Messages] Reconnecting in ${Math.round(delay)}ms (attempt ${reconnectAttempts.value}/${maxReconnectAttempts})`
    );
    setTimeout(() => {
      if (!isMessagesConnected.value && !isMessagesConnecting.value) {
        connectMessagesWebSocket();
      }
    }, delay);
  };
  const handlePresenceReconnect = () => {
    if (!authStore.isAuthenticated || reconnectAttempts.value >= maxReconnectAttempts) {
      if (reconnectAttempts.value >= maxReconnectAttempts) {
        console.log("[WebSocket Presence] Max reconnection attempts reached");
        connectionError.value = "Failed to connect after multiple attempts";
        if ($toast) {
          $toast.error(
            "Failed to connect to presence service. Please refresh the page."
          );
        }
      }
      return;
    }
    if (isPresenceConnecting.value) {
      return;
    }
    const delay = getReconnectDelay(reconnectAttempts.value);
    reconnectAttempts.value++;
    console.log(
      `[WebSocket Presence] Reconnecting in ${Math.round(delay)}ms (attempt ${reconnectAttempts.value}/${maxReconnectAttempts})`
    );
    setTimeout(() => {
      if (!isPresenceConnected.value && !isPresenceConnecting.value) {
        connectPresenceWebSocket();
      }
    }, delay);
  };
  const send = (message) => {
    var _a;
    try {
      if (message.type === "message") {
        const clientTimestamp = (/* @__PURE__ */ new Date()).toISOString();
        const clientId = `client-${(_a = authStore.user) == null ? void 0 : _a.id}-${Date.now()}`;
        message.data = {
          ...message.data,
          client_timestamp: clientTimestamp,
          // Store raw_timestamp consistently for our utility functions
          raw_timestamp: clientTimestamp,
          client_id: clientId,
          sender_device: "web-client",
          client_send_time: Date.now()
        };
        if (!message.data.id) {
          message.data.id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        }
      }
      if (message.type === "typing" || message.type === "stop_typing") {
        message.data = {
          ...message.data,
          timestamp: Date.now()
        };
      }
      if (!isMessagesConnected.value || !socketMessages.value) {
        console.log(
          "[WebSocket Messages] Connection not ready, queueing message"
        );
        addToQueue(message);
        if (!isMessagesConnecting.value && !isMessagesConnected.value) {
          connectMessagesWebSocket();
        }
        return;
      }
      if (socketMessages.value.readyState !== WebSocket.OPEN) {
        console.warn(
          "[WebSocket Messages] Socket not in OPEN state, queueing message"
        );
        addToQueue(message);
        if (!isMessagesConnecting.value) {
          reconnect();
        }
        return;
      }
      socketMessages.value.send(JSON.stringify(message));
      console.log("[WebSocket Messages] Message sent successfully");
      lastMessageTime.value = Date.now();
    } catch (error) {
      console.error("[WebSocket Messages] Failed to send message:", error);
      addToQueue(message);
      updateConnectionQuality("poor");
    }
  };
  const handleNewMessage = (data) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!messagesStore.messages) {
      console.error("[WebSocket] Messages store not initialized");
      return;
    }
    try {
      if (!data.id) {
        console.warn("[WebSocket] Received message without ID:", data);
        data.id = `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      if (!data.sender_id) {
        console.warn("[WebSocket] Received message without sender_id:", data);
        data.sender_id = ((_a = data.sender) == null ? void 0 : _a.id) || "unknown-sender";
      }
      const existingMessage = messagesStore.messages.find(
        (m) => m.id === data.id || m.message_id === data.id
      );
      const tempMessageIndex = messagesStore.messages.findIndex((m) => {
        var _a2;
        const isTempMessage = m.id && (m.id.startsWith("temp-") || m.id.startsWith("msg-") || m.pending === true);
        if (!isTempMessage) return false;
        if (m.sender_id !== ((_a2 = authStore.user) == null ? void 0 : _a2.id)) return false;
        const normalizedMsgContent = (m.content || "").trim().replace(/\s+/g, " ");
        const normalizedNewContent = (data.content || "").trim().replace(/\s+/g, " ");
        if (normalizedMsgContent === normalizedNewContent) {
          return true;
        }
        if (normalizedMsgContent.length > 10 && normalizedNewContent.length > 10) {
          if (normalizedMsgContent.includes(normalizedNewContent) || normalizedNewContent.includes(normalizedMsgContent)) {
            return true;
          }
        }
        const messageTime = new Date(
          m.sent_at || m.created_at || m.raw_timestamp || /* @__PURE__ */ new Date()
        ).getTime();
        return Date.now() - messageTime < 45e3;
      });
      if (existingMessage) {
        console.log(`[WebSocket] Updating existing message: ${data.id}`);
        const idx = messagesStore.messages.findIndex(
          (m) => m.id === data.id || m.message_id === data.id
        );
        if (idx !== -1) {
          const preservedTimestamp = existingMessage.raw_timestamp || existingMessage.sent_at;
          const messageTimestamp = preservedTimestamp || data.created_at || data.sent_at || (/* @__PURE__ */ new Date()).toISOString();
          const date = extractValidDate({
            raw_timestamp: messageTimestamp
          });
          const formattedTimestamp = existingMessage.timestamp || formatMessageTimestamp({
            raw_timestamp: messageTimestamp
          });
          messagesStore.messages[idx] = {
            ...messagesStore.messages[idx],
            ...data,
            // Keep important fields for consistency
            raw_timestamp: messageTimestamp,
            timestamp: formattedTimestamp,
            sent: true,
            pending: false,
            message_id: data.id,
            // Make sure message_id is consistent
            // Mark as updated via WebSocket
            updatedViaWebSocket: true
          };
        }
      } else if (tempMessageIndex !== -1 && ((_b = authStore.user) == null ? void 0 : _b.id) === data.sender_id) {
        console.log(`[WebSocket] Replacing temporary message with: ${data.id}`);
        const tempMessage = messagesStore.messages[tempMessageIndex];
        const tempId = tempMessage.id;
        const messageTimestamp = tempMessage.raw_timestamp || data.sent_at || data.created_at || (/* @__PURE__ */ new Date()).toISOString();
        const formattedTimestamp = tempMessage.timestamp || formatMessageTimestamp({
          raw_timestamp: messageTimestamp
        });
        const enhancedMessage = {
          ...data,
          // Preserve the "isCurrentUser" flag to ensure consistent display
          isCurrentUser: tempMessage.isCurrentUser,
          // Store the original temp ID as a reference for better sync
          temp_id: tempId,
          sent: true,
          pending: false,
          // Ensure consistent timestamp handling
          raw_timestamp: messageTimestamp,
          timestamp: formattedTimestamp,
          message_id: data.id,
          // Flag to indicate this replaced a temp message
          replacedTempMessage: true
        };
        messagesStore.messages[tempMessageIndex] = enhancedMessage;
        eventBus.emit("temp-message-replaced", {
          tempId,
          realId: data.id,
          content: data.content
        });
      } else {
        const contentMatch = messagesStore.messages.find((m) => {
          if (m.isDeleted) return false;
          const normalizedMsgContent = (m.content || "").trim().replace(/\s+/g, " ");
          const normalizedNewContent = (data.content || "").trim().replace(/\s+/g, " ");
          if (m.sender_id !== data.sender_id) return false;
          const contentMatches = normalizedMsgContent === normalizedNewContent || normalizedMsgContent.length > 10 && normalizedNewContent.length > 10 && (normalizedMsgContent.includes(normalizedNewContent) || normalizedNewContent.includes(normalizedMsgContent));
          if (!contentMatches) return false;
          try {
            const msgTime = new Date(
              m.sent_at || m.created_at || m.raw_timestamp || ""
            ).getTime();
            const dataTime = new Date(
              data.sent_at || data.created_at || ""
            ).getTime();
            return !isNaN(msgTime) && !isNaN(dataTime) && Math.abs(msgTime - dataTime) < 6e4;
          } catch (e) {
            return false;
          }
        });
        if (contentMatch) {
          console.log(
            `[WebSocket] Found duplicate message by content, updating instead of adding new`
          );
          const idx = messagesStore.messages.findIndex(
            (m) => m.id === contentMatch.id
          );
          if (idx !== -1) {
            const isCurrentUser = contentMatch.isCurrentUser;
            messagesStore.messages[idx] = {
              ...contentMatch,
              ...data,
              isCurrentUser,
              message_id: data.id,
              sent: true,
              pending: false
            };
          }
        } else {
          const messageTimestamp = data.sent_at || data.created_at || (/* @__PURE__ */ new Date()).toISOString();
          const formattedTimestamp = formatMessageTimestamp({
            raw_timestamp: messageTimestamp
          });
          const enhancedMessage = {
            ...data,
            isCurrentUser: data.sender_id === ((_c = authStore.user) == null ? void 0 : _c.id),
            sent: true,
            pending: false,
            raw_timestamp: messageTimestamp,
            message_id: data.id,
            timestamp: formattedTimestamp,
            // Add websocket flag to help identify where message came from
            fromWebSocket: true,
            // Ensure all required fields are present
            type: data.type || "text",
            read: data.read || false,
            created_at: data.created_at || (/* @__PURE__ */ new Date()).toISOString(),
            updated_at: data.updated_at || (/* @__PURE__ */ new Date()).toISOString()
          };
          console.log(`[WebSocket] Adding new message: ${data.id}`);
          messagesStore.messages.push(enhancedMessage);
          if (data.sender_id !== ((_d = authStore.user) == null ? void 0 : _d.id) && $toast) {
            $toast.info(`New message from ${((_e = data.sender) == null ? void 0 : _e.name) || "User"}`);
            const eventTimestamp = data.sent_at || data.created_at || (/* @__PURE__ */ new Date()).toISOString();
            eventBus.emit("new-message-received", {
              messageId: data.id,
              senderId: data.sender_id,
              senderName: ((_f = data.sender) == null ? void 0 : _f.name) || "User",
              content: data.content,
              timestamp: eventTimestamp,
              formattedTimestamp: formatMessageTimestamp({
                raw_timestamp: eventTimestamp
              })
            });
          }
        }
      }
      eventBus.emit("private-message", data);
    } catch (error) {
      console.error("[WebSocket] Error processing new message:", error, data);
      try {
        const fallbackMessage = {
          id: data.id || `ws-fallback-${Date.now()}`,
          content: data.content || "(Message content unavailable)",
          sender_id: data.sender_id || "unknown",
          recipient_id: data.recipient_id || "unknown",
          // Required fields from NewMessageData
          type: data.type || "text",
          read: data.read || false,
          created_at: data.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: data.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
          // Additional fields
          isCurrentUser: data.sender_id === ((_g = authStore.user) == null ? void 0 : _g.id),
          sent: true,
          pending: false,
          raw_timestamp: data.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          timestamp: formatMessageTimestamp({
            raw_timestamp: data.created_at || (/* @__PURE__ */ new Date()).toISOString()
          }),
          fromWebSocket: true,
          recoveredFromError: true
        };
        const exists = messagesStore.messages.some(
          (m) => m.id === fallbackMessage.id
        );
        if (!exists) {
          messagesStore.messages.push(fallbackMessage);
        }
      } catch (fallbackError) {
        console.error(
          "[WebSocket] Failed to add fallback message:",
          fallbackError
        );
      }
    }
  };
  const handleMessageRead = (data) => {
    if (messagesStore.messages && data.message_ids) {
      messagesStore.messages = messagesStore.messages.map((message) => {
        if (data.message_ids.includes(message.id)) {
          return { ...message, read: true };
        }
        return message;
      });
    }
  };
  const sendTypingStatus = (recipientId, isTyping) => {
    if (!authStore.user) return;
    send({
      type: isTyping ? "typing" : "stop_typing",
      data: {
        user_id: authStore.user.id,
        recipient_id: recipientId,
        is_typing: isTyping
      }
    });
  };
  const disconnect = () => {
    console.log("[WebSocket] Initiating graceful disconnect");
    stopHeartbeat();
    cleanupNetworkChangeDetection();
    disconnectMessages();
    disconnectPresence();
    clearPersistedQueue();
  };
  const disconnectMessages = () => {
    if (socketMessages.value && (isMessagesConnected.value || isMessagesConnecting.value)) {
      console.log("[WebSocket Messages] Disconnecting...");
      try {
        if (socketMessages.value.readyState === WebSocket.OPEN) {
          socketMessages.value.close(1e3, "User disconnect");
        }
      } catch (error) {
        console.warn("[WebSocket Messages] Error during disconnect:", error);
      }
      isMessagesConnected.value = false;
      isMessagesConnecting.value = false;
      updateConnectionQuality("disconnected");
    }
  };
  const disconnectPresence = () => {
    if (socketPresence.value && (isPresenceConnected.value || isPresenceConnecting.value)) {
      console.log("[WebSocket Presence] Disconnecting...");
      try {
        if (socketPresence.value.readyState === WebSocket.OPEN) {
          socketPresence.value.close(1e3, "User disconnect");
        }
      } catch (error) {
        console.warn("[WebSocket Presence] Error during disconnect:", error);
      }
      isPresenceConnected.value = false;
      isPresenceConnecting.value = false;
    }
  };
  const clear = () => {
    console.log("[WebSocket] Clearing all state");
    stopHeartbeat();
    cleanupNetworkChangeDetection();
    socketMessages.value = null;
    socketPresence.value = null;
    isMessagesConnected.value = false;
    isMessagesConnecting.value = false;
    isPresenceConnected.value = false;
    isPresenceConnecting.value = false;
    reconnectAttempts.value = 0;
    connectionError.value = null;
    updateConnectionQuality("disconnected");
    messageQueue.value = [];
    activeSubscriptions.value = [];
    messageRetryCount.value.clear();
    pendingPings.value.clear();
    clearPersistedQueue();
    lastHeartbeatTime.value = 0;
    lastMessageTime.value = 0;
  };
  const getReconnectDelay = (attempt) => {
    const exponentialDelay = Math.min(
      baseReconnectInterval * Math.pow(2, attempt),
      maxReconnectInterval
    );
    const jitter = Math.random() * 0.3 * exponentialDelay;
    return exponentialDelay + jitter;
  };
  const setupNetworkChangeDetection = () => {
  };
  const cleanupNetworkChangeDetection = () => {
    if (networkChangeHandler.value && false) ;
  };
  const startHeartbeat = () => {
    stopHeartbeat();
    heartbeatInterval.value = setInterval();
  };
  const stopHeartbeat = () => {
    if (heartbeatInterval.value) {
      clearInterval(heartbeatInterval.value);
      heartbeatInterval.value = null;
    }
    pendingPings.value.clear();
  };
  const updateConnectionQuality = (quality) => {
    if (connectionQuality.value !== quality) {
      connectionQuality.value = quality;
      eventBus.emit("connection-quality-changed", quality);
      console.log(`[WebSocket] Connection quality changed to: ${quality}`);
    }
  };
  const assessConnectionQuality = () => {
    if (!isMessagesConnected.value) {
      updateConnectionQuality("disconnected");
      return;
    }
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime.value;
    const timeSinceLastHeartbeat = now - lastHeartbeatTime.value;
    if (timeSinceLastMessage > 12e4 || timeSinceLastHeartbeat > 12e4) {
      updateConnectionQuality("poor");
    } else if (timeSinceLastMessage > 6e4 || timeSinceLastHeartbeat > 6e4) {
      updateConnectionQuality("good");
    } else {
      updateConnectionQuality("excellent");
    }
  };
  const addToQueue = (message) => {
    try {
      const isDuplicate = messageQueue.value.some((queuedMessage) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
        if (message.type === "message" && queuedMessage.type === "message") {
          const queuedContent = (_c = (_b = (_a = queuedMessage.data) == null ? void 0 : _a.content) == null ? void 0 : _b.trim) == null ? void 0 : _c.call(_b);
          const newContent = (_f = (_e = (_d = message.data) == null ? void 0 : _d.content) == null ? void 0 : _e.trim) == null ? void 0 : _f.call(_e);
          if (queuedContent && newContent && queuedContent === newContent) {
            if (((_g = queuedMessage.data) == null ? void 0 : _g.recipient_id) === ((_h = message.data) == null ? void 0 : _h.recipient_id) && ((_i = queuedMessage.data) == null ? void 0 : _i.sender_id) === ((_j = message.data) == null ? void 0 : _j.sender_id)) {
              return true;
            }
          }
        }
        if ((message.type === "typing" || message.type === "stop_typing") && message.type === queuedMessage.type) {
          return ((_k = message.data) == null ? void 0 : _k.user_id) === ((_l = queuedMessage.data) == null ? void 0 : _l.user_id) && ((_m = message.data) == null ? void 0 : _m.recipient_id) === ((_n = queuedMessage.data) == null ? void 0 : _n.recipient_id);
        }
        return false;
      });
      if (isDuplicate) {
        console.log("[WebSocket] Skipping duplicate queued message");
        return;
      }
      if (messageQueue.value.length >= maxQueueSize) {
        console.warn("[WebSocket] Message queue full, removing oldest message");
        messageQueue.value.shift();
      }
      const messageWithId = {
        ...message,
        _queueId: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        _timestamp: Date.now(),
        _retryCount: 0
        // Track retry attempts
      };
      messageQueue.value.push(messageWithId);
      try {
        sessionStorage.setItem(
          "ws_message_queue",
          JSON.stringify(messageQueue.value)
        );
      } catch (error) {
        console.warn("[WebSocket] Failed to persist message queue:", error);
      }
    } catch (error) {
      console.error("[WebSocket] Error adding message to queue:", error);
      messageQueue.value.push({
        ...message,
        _timestamp: Date.now()
      });
    }
  };
  const restoreMessageQueue = () => {
    try {
      const savedQueue = sessionStorage.getItem("ws_message_queue");
      if (savedQueue) {
        const parsedQueue = JSON.parse(savedQueue);
        const fiveMinutesAgo = Date.now() - 3e5;
        messageQueue.value = parsedQueue.filter(
          (msg) => msg._timestamp && msg._timestamp > fiveMinutesAgo
        );
        console.log(
          `[WebSocket] Restored ${messageQueue.value.length} messages from queue`
        );
      }
    } catch (error) {
      console.warn("[WebSocket] Failed to restore message queue:", error);
      messageQueue.value = [];
    }
  };
  const clearPersistedQueue = () => {
    try {
      sessionStorage.removeItem("ws_message_queue");
    } catch (error) {
      console.warn("[WebSocket] Failed to clear persisted queue:", error);
    }
  };
  const processMessageQueue = () => {
    if (!isMessagesConnected.value || !socketMessages.value || messageQueue.value.length === 0) {
      return;
    }
    if (socketMessages.value.readyState !== WebSocket.OPEN) {
      console.warn(
        "[WebSocket] Socket not in OPEN state, delaying queue processing"
      );
      return;
    }
    const messagesToProcess = [...messageQueue.value];
    messageQueue.value = [];
    const currentTime = Date.now();
    const processPromises = messagesToProcess.map(async (message) => {
      try {
        const messageTime = message._timestamp || 0;
        const messageAge = currentTime - messageTime;
        if ((message.type === "typing" || message.type === "stop_typing") && messageAge > 1e4) {
          console.log(
            "[WebSocket] Dropping old typing indicator:",
            message.type
          );
          return;
        }
        if (messageAge > 36e5) {
          console.log("[WebSocket] Dropping very old queued message");
          return;
        }
        const queueId = message._queueId;
        const retryCount = message._retryCount || messageRetryCount.value.get(queueId) || 0;
        if (retryCount >= maxRetries) {
          console.warn(
            "[WebSocket] Message exceeded max retries, dropping:",
            message
          );
          messageRetryCount.value.delete(queueId);
          if (message.type === "message" && $toast) {
            $toast.error("Message couldn't be delivered. Please try again.");
          }
          return;
        }
        if (retryCount > 0) {
          const backoffDelay = Math.min(
            1e3 * Math.pow(2, retryCount - 1),
            1e4
          );
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        }
        const cleanMessage = { ...message };
        delete cleanMessage._queueId;
        delete cleanMessage._timestamp;
        delete cleanMessage._retryCount;
        socketMessages.value.send(JSON.stringify(cleanMessage));
        messageRetryCount.value.delete(queueId);
        console.log("[WebSocket] Successfully sent queued message");
      } catch (error) {
        console.error("[WebSocket] Failed to send queued message:", error);
        const queueId = message._queueId;
        const currentRetryCount = message._retryCount || messageRetryCount.value.get(queueId) || 0;
        message = {
          ...message,
          _retryCount: currentRetryCount + 1
        };
        messageRetryCount.value.set(queueId, currentRetryCount + 1);
        addToQueue(message);
      }
    });
    Promise.all(processPromises).then(() => {
      if (messageQueue.value.length > 0) {
        try {
          sessionStorage.setItem(
            "ws_message_queue",
            JSON.stringify(messageQueue.value)
          );
        } catch (error) {
          console.warn(
            "[WebSocket] Failed to persist updated message queue:",
            error
          );
        }
      } else {
        clearPersistedQueue();
      }
    }).catch((error) => {
      console.error("[WebSocket] Error in queue processing:", error);
    });
  };
  const reconnect = async () => {
    console.log("[WebSocket] Manual reconnection triggered");
    disconnect();
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    reconnectAttempts.value = 0;
    connectionError.value = null;
    await connect();
  };
  const forceReconnect = async () => {
    console.log("[WebSocket] Force reconnection triggered");
    clear();
    await new Promise((resolve) => setTimeout(resolve, 2e3));
    await connect();
  };
  const checkConnectionHealth = (autoRecover = false) => {
    var _a, _b;
    const issues = [];
    const recommendations = [];
    const now = Date.now();
    let socketState = "unknown";
    if (socketMessages.value) {
      switch (socketMessages.value.readyState) {
        case WebSocket.CONNECTING:
          socketState = "connecting";
          break;
        case WebSocket.OPEN:
          socketState = "open";
          break;
        case WebSocket.CLOSING:
          socketState = "closing";
          break;
        case WebSocket.CLOSED:
          socketState = "closed";
          break;
      }
    }
    if (!isMessagesConnected.value) {
      issues.push("Messages WebSocket disconnected");
      recommendations.push("Try reconnecting to messaging service");
    } else if (((_a = socketMessages.value) == null ? void 0 : _a.readyState) !== WebSocket.OPEN) {
      issues.push(`Messages WebSocket in unexpected state: ${socketState}`);
      recommendations.push("WebSocket connection may be unhealthy");
    }
    if (!isPresenceConnected.value) {
      issues.push("Presence WebSocket disconnected");
      recommendations.push("Try reconnecting to presence service");
    }
    if (pendingPings.value.size > 3) {
      issues.push(`Multiple pending heartbeats (${pendingPings.value.size})`);
      recommendations.push("Connection may be unstable");
    }
    if (messageQueue.value.length > 0) {
      issues.push(
        `Message queue not empty (${messageQueue.value.length} messages)`
      );
      if (messageQueue.value.length > 10) {
        recommendations.push("Messages may be delayed");
      }
    }
    if (connectionQuality.value === "poor") {
      issues.push("Poor connection quality");
      recommendations.push("Check network connection");
    }
    const lastMessageAge = now - lastMessageTime.value;
    if (isMessagesConnected.value && lastMessageAge > 3e5) {
      issues.push(
        `No recent message activity (${Math.round(
          lastMessageAge / 6e4
        )} minutes)`
      );
      recommendations.push("Connection may be stale");
      if (autoRecover && lastMessageAge > 6e5) {
        console.warn(
          "[WebSocket Health] Connection stale, attempting recovery"
        );
        setTimeout(() => forceReconnect(), 500);
      }
    }
    assessConnectionQuality();
    if (autoRecover) {
      if (isMessagesConnected.value && ((_b = socketMessages.value) == null ? void 0 : _b.readyState) === WebSocket.CLOSED) {
        console.warn(
          "[WebSocket Health] Socket inconsistency detected, forcing reconnection"
        );
        setTimeout(() => forceReconnect(), 1e3);
      }
      if (pendingPings.value.size > 5) {
        console.warn(
          "[WebSocket Health] Too many pending pings, forcing reconnection"
        );
        setTimeout(() => forceReconnect(), 1500);
      }
    }
    return {
      isHealthy: issues.length === 0,
      issues,
      recommendations,
      lastMessageAge,
      socketState,
      reconnectCount: reconnectAttempts.value
    };
  };
  const healthCheckInterval = ref(null);
  const startHealthChecks = () => {
    stopHealthChecks();
    healthCheckInterval.value = setInterval();
  };
  const stopHealthChecks = () => {
    if (healthCheckInterval.value) {
      clearInterval(healthCheckInterval.value);
      healthCheckInterval.value = null;
    }
  };
  return {
    // Connection State
    isConnected: computed(
      () => isMessagesConnected.value && isPresenceConnected.value
    ),
    isConnecting: computed(
      () => isMessagesConnecting.value || isPresenceConnecting.value
    ),
    isMessagesConnected: computed(() => isMessagesConnected.value),
    isPresenceConnected: computed(() => isPresenceConnected.value),
    connectionError: computed(() => connectionError.value),
    connectionQuality: computed(() => connectionQuality.value),
    // Queue Management
    queueLength: computed(() => messageQueue.value.length),
    hasQueuedMessages: computed(() => messageQueue.value.length > 0),
    // Connection Health
    reconnectAttempts: computed(() => reconnectAttempts.value),
    maxReconnectAttempts: computed(() => maxReconnectAttempts),
    // Core Actions
    connect,
    disconnect,
    reconnect,
    forceReconnect,
    clear,
    send,
    sendTypingStatus,
    // Subscription Management
    subscribeToUnreadCounts,
    subscribeToChannel,
    // Health Management
    startHealthChecks,
    stopHealthChecks,
    // Utilities
    validateToken,
    checkConnectionHealth,
    updateConnectionQuality,
    assessConnectionQuality,
    // Advanced Features
    processMessageQueue,
    restoreMessageQueue,
    handleNewMessage,
    // Exposed for direct message processing if needed
    // Internal State (for development monitoring)
    _internal: void 0
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "OptimizedAvatar",
  __ssrInlineRender: true,
  props: {
    src: { default: null },
    alt: {},
    className: { default: "" },
    size: { default: "md" },
    fallbackIcon: { default: "fa:user" }
  },
  setup(__props) {
    const props = __props;
    const hasError = ref(false);
    const isLoading = ref(!!props.src);
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
      xl: "h-16 w-16"
    };
    const iconSizes = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8"
    };
    const optimizedSrc = computed(() => {
      var _a, _b, _c, _d, _e;
      console.log("[OptimizedAvatar] Processing src:", {
        hasSrc: !!props.src,
        srcType: typeof props.src,
        srcLength: ((_a = props.src) == null ? void 0 : _a.length) || 0,
        srcPreview: ((_c = (_b = props.src) == null ? void 0 : _b.substring) == null ? void 0 : _c.call(_b, 0, 50)) || "no src",
        isDataUrl: ((_e = (_d = props.src) == null ? void 0 : _d.startsWith) == null ? void 0 : _e.call(_d, "data:")) || false
      });
      if (!props.src) {
        console.log("[OptimizedAvatar] No src provided, returning undefined");
        return void 0;
      }
      if (props.src.startsWith("data:")) {
        console.log("[OptimizedAvatar] Processing data URL...");
        const dataUrlRegex = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/;
        if (!dataUrlRegex.test(props.src)) {
          console.warn(
            "[OptimizedAvatar] Invalid data URL format:",
            props.src.substring(0, 100)
          );
          return void 0;
        }
        console.log("[OptimizedAvatar] Data URL format is valid");
        const maxSize = 2 * 1024 * 1024;
        if (props.src.length > maxSize) {
          console.warn(
            "[OptimizedAvatar] Avatar too large:",
            props.src.length,
            "bytes, max:",
            maxSize
          );
          try {
            return void 0;
          } catch (error) {
            console.error(
              "[OptimizedAvatar] Error processing large image:",
              error
            );
            return void 0;
          }
        }
        console.log("[OptimizedAvatar] Size check passed:", props.src.length, "bytes");
        const base64Data = props.src.split(",")[1];
        if (!base64Data || base64Data.length < 100) {
          console.warn(
            "[OptimizedAvatar] Base64 data too short or missing, length:",
            (base64Data == null ? void 0 : base64Data.length) || 0
          );
          return void 0;
        }
        console.log(
          "[OptimizedAvatar] Base64 data length check passed:",
          base64Data.length
        );
        try {
          atob(base64Data.substring(0, 100));
          console.log("[OptimizedAvatar] Base64 validation passed");
        } catch (error) {
          console.warn("[OptimizedAvatar] Invalid base64 data:", error);
          return void 0;
        }
        console.log(
          "[OptimizedAvatar] \u2705 All validations passed, returning data URL"
        );
        return props.src;
      }
      console.log("[OptimizedAvatar] Not a data URL, returning as-is:", props.src);
      return props.src;
    });
    const showFallback = computed(() => !optimizedSrc.value || hasError.value);
    watch(
      () => props.src,
      (newSrc) => {
        if (newSrc) {
          isLoading.value = true;
          hasError.value = false;
        } else {
          isLoading.value = false;
          hasError.value = false;
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: `${sizeClasses[_ctx.size]} rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center ${_ctx.className || ""}`
      }, _attrs))} data-v-3baf5395>`);
      if (showFallback.value) {
        ssrRenderSlot(_ctx.$slots, "fallback", {}, () => {
          _push(ssrRenderComponent(_component_Icon, {
            name: _ctx.fallbackIcon,
            class: `${iconSizes[_ctx.size]} text-gray-500`
          }, null, _parent));
        }, _push, _parent);
      } else {
        _push(`<div class="relative h-full w-full" data-v-3baf5395>`);
        if (isLoading.value) {
          _push(`<div class="absolute inset-0 flex items-center justify-center bg-gray-100" data-v-3baf5395><div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" data-v-3baf5395></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<img${ssrRenderAttr("src", optimizedSrc.value)}${ssrRenderAttr("alt", _ctx.alt)} class="h-full w-full object-cover transition-opacity duration-200 ease-in-out" style="${ssrRenderStyle({
          imageRendering: "auto",
          opacity: isLoading.value ? 0 : 1
        })}" loading="lazy" decoding="async" data-v-3baf5395></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/OptimizedAvatar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3baf5395"]]);

export { __nuxt_component_0 as _, useMessagesStore as a, formatDateForSeparator as b, eventBus as e, formatMessageTimestamp as f, setInterval as s, useWebSocket as u };
//# sourceMappingURL=OptimizedAvatar-B-2OddAN.mjs.map
