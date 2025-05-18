import { defineStore } from "pinia";
import { ref } from "vue";
import { useNuxtApp } from "#app";

// Define Message types
interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  type: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    name: string;
    profile_picture_url?: string;
  };
  recipient?: {
    id: string;
    name: string;
    profile_picture_url?: string;
  };
  media_url?: string;
}

// Updated interface for SearchMessagesParams
interface SearchMessagesParams {
  q: string;
  chatId: string;
  type: "user" | "group";
  limit?: number;
  offset?: number;
}

// Message history request params
interface MessageHistoryParams {
  type: "private" | "group";
  target_id: string;
  limit?: number;
  before?: string;
}

// New message request interface
interface SendMessageRequest {
  content: string;
  receiver_id?: string;
  group_id?: string;
  type?: string;
  attachment_url?: string;
}

// Pagination interface
interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_more_pages: boolean;
}

// Define API response
interface ApiResponse {
  message?: string;
  data?: any;
  pagination?: Pagination;
}

// Define the store for messages management
export const useMessagesStore = defineStore("messages", () => {
  // State
  const messages = ref<Message[]>([]);
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

  // Get Nuxt app instance for access to API and toast functionality
  const nuxtApp = useNuxtApp();
  const { $api, $toast } = nuxtApp;

  // Use proxy URL instead of direct API calls to avoid CORS issues
  const proxyUrl = "/api/proxy";

  /**
   * Get messages with a specific user
   */
  async function getMessages(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Use the API proxy instead of direct API calls
      const response = await $api.get(
        `/groups/messages?userId=${userId}&page=${page}&limit=${limit}`
      );

      if (page === 1 || page <= 0) {
        messages.value = response.data || [];
      } else {
        // For pagination, append older messages
        messages.value = [...(response.data || []), ...messages.value];
      }

      // Update pagination info
      if (response.pagination) {
        messagesPagination.value = response.pagination;
      }

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch messages";
      console.error(`Error fetching messages with user ${userId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Load more messages (pagination)
   */
  async function loadMoreMessages(userId: string): Promise<ApiResponse | null> {
    if (messagesPagination.value.has_more_pages) {
      const nextPage = messagesPagination.value.current_page + 1;
      return getMessages(userId, nextPage);
    }
    return null;
  }

  /**
   * Send a message to a user
   */
  async function sendMessage(
    recipientId: string,
    content: string,
    type = "text"
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $api.post(`/groups/messages/send`, {
        recipient_id: recipientId,
        content,
        type,
      });

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to send message";
      console.error(`Error sending message to user ${recipientId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Edit a message
   */
  async function editMessage(
    messageId: string,
    content: string
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $api.put(`/groups/messages/${messageId}`, {
        content,
      });

      // Update the message in our local state
      messages.value = messages.value.map((message) => {
        if (message.id === messageId) {
          return { ...message, content, updated_at: new Date().toISOString() };
        }
        return message;
      });

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to edit message";
      console.error(`Error editing message ${messageId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Delete a message
   */
  async function deleteMessage(messageId: string): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $api.delete(`/groups/messages/${messageId}`);

      // Remove the message from our local state
      messages.value = messages.value.filter(
        (message) => message.id !== messageId
      );

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to delete message";
      console.error(`Error deleting message ${messageId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Mark messages as read
   */
  async function markMessagesAsRead(
    messagesIds: string[]
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $api.put(`/groups/messages/read`, {
        message_ids: messagesIds,
      });

      // Update messages in our local state
      messages.value = messages.value.map((message) => {
        if (messagesIds.includes(message.id)) {
          return { ...message, read: true };
        }
        return message;
      });

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to mark messages as read";
      console.error("Error marking messages as read:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Upload media (image, file) with a message
   */
  async function sendMessageWithMedia(
    recipientId: string,
    content: string,
    type: string,
    mediaFile: File
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      formData.append("recipient_id", recipientId);
      formData.append("content", content);
      formData.append("type", type);
      formData.append("media", mediaFile);

      const response = await $api.raw.post(`/groups/messages/media`, formData);
      const data = await response.json();

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to send message with media";
      console.error(
        `Error sending message with media to user ${recipientId}:`,
        err
      );
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Search messages in a chat by query text
   */
  async function searchMessages(
    params: SearchMessagesParams
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const { q, chatId, type, limit = 20, offset = 0 } = params;
      const queryParams = new URLSearchParams({
        q,
        chatId,
        type,
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response = await $api.get(
        `/groups/search/messages?${queryParams.toString()}`
      );
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to search messages";
      console.error("Error searching messages:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get message history for private chat or group conversation
   */
  async function getMessageHistory(
    params: MessageHistoryParams
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const { type, target_id, limit = 20, before } = params;
      let queryParams = new URLSearchParams({
        type,
        target_id,
        limit: limit.toString(),
      });

      if (before) {
        queryParams.append("before", before);
      }

      const response = await $api.get(
        `/groups/messages/history?${queryParams.toString()}`
      );

      // Update messages based on history if it's the initial load
      if (!before) {
        messages.value = response.data || [];
      } else {
        // For pagination, append older messages
        messages.value = [...(response.data || []), ...messages.value];
      }

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to get message history";
      console.error(`Error getting message history:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Send a new message using the /messages POST endpoint
   */
  async function postMessage(
    messageData: SendMessageRequest
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $api.post(`/groups/messages`, messageData);
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to post message";
      console.error("Error posting message:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get unread messages count
   */
  async function getUnreadCount(): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Gunakan endpoint messages langsung tanpa prefix groups
      const response = await $api.get(`/messages/unread-count`);
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to get unread count";
      console.error("Error getting unread message count:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    messages,
    isLoading,
    error,
    messagesPagination,

    // Actions
    getMessages,
    loadMoreMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    markMessagesAsRead,
    sendMessageWithMedia,
    searchMessages,
    getMessageHistory,
    postMessage,
    getUnreadCount,
  };
});
