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

// Unified message request params interface
interface UnifiedMessageParams {
  target_id: string;
  type: "private" | "group";
  limit?: number;
  page?: number;
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
   * Unified function to get messages - supports both initial load and pagination
   * Uses consistent parameter structure for both scenarios
   */
  async function getMessages(
    params: UnifiedMessageParams
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const { target_id, type = "private", limit = 20, page, before } = params;

      // Determine if this is pagination (before parameter) or page-based load
      const isPagination = !!before;
      const isInitialLoad = !page || page === 1;

      // Build query parameters consistently
      let queryParams = new URLSearchParams({
        type,
        target_id,
        limit: limit.toString(),
      });

      // Add pagination parameter (before takes precedence over page)
      if (before) {
        queryParams.append("before", before);
      } else if (page && page > 1) {
        queryParams.append("page", page.toString());
      }

      console.log(
        `[useMessages] getMessages: ${type} chat with ${target_id}, ` +
          `${
            isPagination ? `pagination before ${before}` : `page ${page || 1}`
          }`
      );

      console.log(`[useMessages] Query parameters:`, queryParams.toString());
      console.log(`[useMessages] Full URL:`, `/messages/history?${queryParams.toString()}`);

      // Use unified /messages/history endpoint for consistency
      const response = await $api.get(
        `/messages/history?${queryParams.toString()}`
      );

      console.log(`[useMessages] API Response:`, {
        status: 'success',
        data_length: response.data?.length || 0,
        data_sample: response.data?.slice(0, 2),
        pagination: response.pagination,
        full_response: response
      });

      console.log(
        `[useMessages] Retrieved ${response.data?.length || 0} messages`
      );

      // Handle message array updates based on load type
      if (isInitialLoad && !before) {
        // Initial load - replace messages array
        messages.value = response.data || [];
        console.log(
          `[useMessages] Initial load: Set ${messages.value.length} messages`
        );
      } else {
        // Pagination - safely merge messages without duplicates
        const existingIds = new Set(messages.value.map((m) => m.id));
        const newMessages = (response.data || []).filter(
          (msg: any) => !existingIds.has(msg.id)
        );

        if (newMessages.length > 0) {
          if (before) {
            // Cursor pagination - add older messages at the beginning
            console.log(
              `[useMessages] Pagination: Adding ${newMessages.length} older messages`
            );
            messages.value = [...newMessages, ...messages.value];
          } else {
            // Page pagination - add older messages at the beginning
            console.log(
              `[useMessages] Page load: Adding ${newMessages.length} messages`
            );
            messages.value = [...newMessages, ...messages.value];
          }
        }
      }

      // Update pagination info if provided
      if (response.pagination) {
        messagesPagination.value = response.pagination;
      }

      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to fetch messages";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Legacy function for backward compatibility - converts old parameters to new format
   * @deprecated Use getMessages with UnifiedMessageParams instead
   */
  async function getMessagesLegacy(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse> {
    console.log(
      `[useMessages] Legacy getMessages called - converting to unified format`
    );
    return getMessages({
      target_id: userId,
      type: "private",
      page,
      limit,
    });
  }

  /**
   * Get group messages using group ID
   */
  async function getGroupMessages(
    groupId: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${proxyUrl}/groups/messages`, {
        method: "GET",
        params: {
          group_id: groupId,
          page,
          limit,
        },
        credentials: "include",
      });

      if (page === 1 || page <= 0) {
        messages.value = response.data || [];
      } else {
        // For pagination, append older messages at the start
        messages.value = [...(response.data || []), ...messages.value];
      }

      if (response.pagination) {
        messagesPagination.value = response.pagination;
      }

      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to fetch group messages";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Send a message to a user
   */
  async function sendMessage(
    recipientId: string,
    content: string,
    type = "text",
    attachmentUrl?: string
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const messageData = {
        content,
        receiver_id: recipientId,
        type,
        attachment_url: attachmentUrl,
      };

      // Use $api instead of $fetch for consistent error handling
      const response = await $api.post("/messages", messageData);

      // Add message to the messages array if successful
      if (response.data) {
        messages.value.push(response.data);
      }

      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to send message";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Send a message to a group
   */
  async function sendGroupMessage(
    groupId: string,
    content: string,
    type = "text",
    attachmentUrl?: string
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const messageData = {
        content,
        group_id: groupId,
        type,
        attachment_url: attachmentUrl,
      };

      // Use $api for consistent error handling
      const response = await $api.post("/groups/messages", messageData);

      // Add message to the messages array if successful
      if (response.data) {
        messages.value.push(response.data);
      }

      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to send group message";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
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
      const errorMsg = err.message || "Failed to edit message";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
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
      const errorMsg = err.message || "Failed to delete message";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
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
      const errorMsg = err.message || "Failed to mark messages as read";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Upload media (image, file) with a message
   * Uses the /messages/media endpoint to upload media files
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
      console.log(`[useMessages] Uploading media file to /messages/media endpoint`);
      console.log(`[useMessages] Media file details:`, {
        name: mediaFile.name,
        size: mediaFile.size,
        type: mediaFile.type
      });
      
      // First upload the media file to get the file URL
      const formData = new FormData();
      formData.append("file", mediaFile);
      
      // Log the FormData to ensure it's created correctly
      console.log(`[useMessages] FormData created with file: ${mediaFile.name}`);
      
      // Use the proxy URL instead of direct localhost URL
      const uploadUrl = "/api/proxy/messages/media";
      console.log(`[useMessages] Sending media upload request to: ${uploadUrl}`);
      
            console.log(`[useMessages] About to call $api.raw.post with FormData`);
      
      let uploadResult;
      try {
        const uploadResponse = await $api.raw.post(uploadUrl, formData, {
          headers: {
            // Don't set Content-Type here, it will be set automatically with boundary for FormData
            // Add authorization headers explicitly for the upload
            'Accept': 'application/json'
          },
          // Make sure credentials are included (cookies, authorization headers)
          credentials: 'include'
        });
        
        console.log(`[useMessages] Upload response status:`, uploadResponse.status);
        
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error(`[useMessages] Upload failed with status ${uploadResponse.status}:`, errorText);
          throw new Error(`Media upload failed with status: ${uploadResponse.status}. Details: ${errorText}`);
        }
        
        uploadResult = await uploadResponse.json();
        console.log(`[useMessages] Media upload successful:`, uploadResult);
      } catch (uploadErr) {
        console.error(`[useMessages] Error during fetch operation:`, uploadErr);
        throw uploadErr;
      }
      
      // Check if we have a file_url in the response
      if (!uploadResult.file_url) {
        throw new Error("Media upload succeeded but no file URL was returned");
      }
      
      // Now send the message with the file URL
      const messageData = {
        content,
        receiver_id: recipientId,
        type: type,
        attachment_url: uploadResult.file_url,
        media_type: mediaFile.type
      };
      
      // Send the message with the attachment URL
      const messageResponse = await $api.post(`/messages`, messageData);
      console.log(`[useMessages] Message with media sent successfully:`, messageResponse);
      
      return messageResponse;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to send message with media";
      error.value = errorMsg;
      console.error(`[useMessages] Error uploading media:`, err);
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Upload media file to get a URL that can be used in messages
   * @param file The file to upload
   * @param mediaType The type of media (image, video, document, etc.)
   * @param relatedTo Optional field to relate the media to a specific entity
   * @returns Promise with the response containing file_url
   */
  async function uploadMedia(
    file: File,
    mediaType?: string,
    relatedTo?: string
  ): Promise<{ file_url: string; media_type: string; related_to?: string }> {
    isLoading.value = true;
    error.value = null;

    try {
      console.log(`[useMessages] Uploading media file to /messages/media endpoint`);
      
      // Create FormData for the file upload
      const formData = new FormData();
      formData.append("file", file);
      
      // Add optional metadata if provided
      if (mediaType) {
        formData.append("media_type", mediaType);
      } else {
        // Try to infer media type from file.type
        formData.append("media_type", file.type || "application/octet-stream");
      }
      
      if (relatedTo) {
        formData.append("related_to", relatedTo);
      }
      
      // Use the proxy URL instead of direct localhost URL
      const uploadUrl = "/api/proxy/messages/media";
      console.log(`[useMessages] Sending media upload request to: ${uploadUrl}`);
      
      const uploadResponse = await $api.raw.post(uploadUrl, formData, {
        headers: {
          // Don't set Content-Type here, it will be set automatically with boundary for FormData
          'Accept': 'application/json'
        },
        // Make sure credentials are included (cookies, authorization headers)
        credentials: 'include'
      });
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error(`[useMessages] Upload failed with status ${uploadResponse.status}:`, errorText);
        throw new Error(`Media upload failed with status: ${uploadResponse.status}. Details: ${errorText}`);
      }
      
      const uploadResult = await uploadResponse.json();
      console.log(`[useMessages] Media upload successful:`, uploadResult);
      
      // Check if we have a file_url in the response
      if (!uploadResult.file_url) {
        throw new Error("Media upload succeeded but no file URL was returned");
      }
      
      return uploadResult;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to upload media file";
      error.value = errorMsg;
      console.error(`[useMessages] Error uploading media:`, err);
      if ($toast) $toast.error(errorMsg);
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
      const errorMsg = err.message || "Failed to search messages";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get message history for private chat or group conversation
   * @deprecated This function now delegates to the unified getMessages function
   */
  async function getMessageHistory(
    params: MessageHistoryParams
  ): Promise<ApiResponse> {
    console.log(
      `[useMessages] getMessageHistory called - delegating to unified getMessages`
    );

    // Convert MessageHistoryParams to UnifiedMessageParams
    const unifiedParams: UnifiedMessageParams = {
      target_id: params.target_id,
      type: params.type,
      limit: params.limit,
      before: params.before,
    };

    return getMessages(unifiedParams);
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
      const errorMsg = err.message || "Failed to post message";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
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
      const response = await $fetch(`${proxyUrl}/messages/unread-count`, {
        method: "GET",
        credentials: "include",
      });
      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to get unread count";
      error.value = errorMsg;
      if ($toast) $toast.error(errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Load more messages for pagination using unified approach
   */
  async function loadMoreMessages(
    targetId: string,
    type: "private" | "group" = "private"
  ): Promise<ApiResponse | null> {
    if (messagesPagination.value.has_more_pages) {
      const nextPage = messagesPagination.value.current_page + 1;
      console.log(
        `[useMessages] loadMoreMessages: Loading page ${nextPage} for ${type} chat with ${targetId}`
      );

      return getMessages({
        target_id: targetId,
        type,
        page: nextPage,
        limit: messagesPagination.value.items_per_page,
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
    getMessages, // New unified function
    getMessagesLegacy, // Legacy compatibility function

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
    getMessageHistory, // Now delegates to unified getMessages
    postMessage,
    getUnreadCount,
    loadMoreMessages,
  };
});
