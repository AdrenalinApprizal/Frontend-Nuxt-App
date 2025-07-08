import { defineStore } from "pinia";
import { ref } from "vue";
import { useNuxtApp } from "#app";

// Define media type
type MediaType = "image" | "video" | "audio" | "document" | "all";

// Define file metadata interface (enhanced to match React)
export interface FileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  shared_with?: string[];
  conversation_id?: string;
  message_id?: string;
}

// Original FileItem interface (matching React)
export interface FileItem {
  id: string;
  name: string;
  size: number;
  content_type: string;
  url: string;
  uploader_id: string;
  uploaded_at: string;
  access_type: "public" | "private";
  type: "attachment" | "profile" | "avatar";
  related_to?: string;
}

// Define pagination interface
export interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_more_pages: boolean;
}

// Original FilesResponse interface (matching React)
export interface FilesResponse {
  files: FileItem[];
  current_page: number;
  page_size: number;
  total: number;
}

// Define API response interface
export interface ApiResponse {
  message?: string;
  data?: any;
  pagination?: Pagination;
}

// Share request interface (matching React)
export interface ShareRequest {
  permission: string; // read, write, etc.
  target_id: string; // user ID or group ID
  target_type: string; // "user" or "group"
}

// Use proper path format for the proxy - no /api/proxy prefix needed since $api adds it
const FILE_SERVICE_PATH = "";

export const useFilesStore = defineStore("files", () => {
  // State (enhanced to match React implementation)
  const files = ref<FileMetadata[]>([]);
  const userMedia = ref<FileMetadata[]>([]);
  const groupMedia = ref<FileMetadata[]>([]);
  const userFiles = ref<FileMetadata[]>([]);
  const groupFiles = ref<FileMetadata[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<Pagination>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 20,
    has_more_pages: false,
  });
  const filesResponse = ref<FilesResponse | null>(null);

  // Get nuxt app to access the API plugin
  const nuxtApp = useNuxtApp();
  const $api = nuxtApp.$api;

  // Check if we're in browser environment
  const isClient = process.client;

  // Helper function for API calls (matching React implementation)
  const callApi = async (endpoint: string, method: string, body?: any) => {
    try {
      const options: Record<string, any> = {
        method,
      };

      if (body && method !== "GET") {
        if (body instanceof FormData) {
          // For FormData, let the browser set the content-type
          options.body = body;
        } else {
          options.headers = {
            "Content-Type": "application/json",
          };
          options.body = JSON.stringify(body);
        }
      }

      // Use $api which already handles /api/proxy prefix
      if (method === "GET") {
        return await $api.get(endpoint);
      } else if (method === "POST") {
        if (body instanceof FormData) {
          return await $api.raw.post(endpoint, body);
        }
        return await $api.post(endpoint, body);
      } else if (method === "DELETE") {
        return await $api.delete(endpoint);
      } else if (method === "PUT") {
        return await $api.put(endpoint, body);
      }

      throw new Error(`Unsupported method: ${method}`);
    } catch (error: any) {
      throw new Error(error.message || "API request failed");
    }
  };

  /**
   * Check if file service is healthy (matching React implementation)
   */
  const checkHealth = async (): Promise<{ status: string }> => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await callApi(`${FILE_SERVICE_PATH}/health`, "GET");
      return response;
    } catch (err: any) {
      error.value = `Failed to check file service health: ${err.message}`;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get media from a specific user's conversations
   * This retrieves all media files shared in conversations with a specific user
   */
  async function getUserMedia(
    userId: string,
    type: MediaType = "all",
    page = 1,
    limit = 20
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Construct the endpoint URL with query parameters
      const endpoint = `${FILE_SERVICE_PATH}/media/user/${userId}?type=${type}&page=${page}&limit=${limit}`;

      const response = await callApi(endpoint, "GET");

      // Check if the response is valid
      if (!response) {
        console.warn(
          `[useFiles] No response received for media endpoint: ${endpoint}`
        );
        return { data: [], pagination: undefined };
      }

      // Log the response structure for debugging
      console.log(`[useFiles] Media API response structure:`, {
        hasData: !!response.data,
        hasPagination: !!response.pagination,
        responseKeys: Object.keys(response),
        dataLength: Array.isArray(response.data)
          ? response.data.length
          : "not array",
      });

      // Handle different response structures
      const responseData = response.data || response;

      // Handle pagination differently based on page number
      if (page === 1) {
        // Replace existing data on first page
        userMedia.value = Array.isArray(responseData) ? responseData : [];
      } else {
        // Append data for subsequent pages
        const newData = Array.isArray(responseData) ? responseData : [];
        userMedia.value = [...userMedia.value, ...newData];
      }

      // Update pagination if available
      if (response.pagination) {
        pagination.value = response.pagination;
      }

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch user media";
      console.error(`Error fetching media for user ${userId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get media from a specific group
   * This retrieves all media files shared in a group chat
   */
  async function getGroupMedia(
    groupId: string,
    type: MediaType = "all",
    page = 1,
    limit = 20
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Construct the endpoint URL with query parameters
      const endpoint = `${FILE_SERVICE_PATH}/media/group/${groupId}?type=${type}&page=${page}&limit=${limit}`;

      const response = await callApi(endpoint, "GET");

      // Check if the response is valid
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      // Handle pagination differently based on page number
      if (page === 1) {
        // Replace existing data on first page
        groupMedia.value = response.data || [];
      } else {
        // Append data for subsequent pages
        groupMedia.value = [...groupMedia.value, ...(response.data || [])];
      }

      // Update pagination if available
      if (response.pagination) {
        pagination.value = response.pagination;
      }

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch group media";
      console.error(`Error fetching media for group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get files from a specific user
   */
  async function getUserFiles(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Construct the endpoint URL with query parameters
      const endpoint = `files/user/${userId}?page=${page}&limit=${limit}`;

      const response = await $api.get(endpoint);

      // Update state
      userFiles.value = response.data || [];

      // Update pagination if available
      if (response.pagination) {
        pagination.value = response.pagination;
      }

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch user files";
      console.error(`Error fetching files for user ${userId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get files from a specific group
   */
  async function getGroupFiles(
    groupId: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Construct the endpoint URL with query parameters
      const endpoint = `files/group/${groupId}?page=${page}&limit=${limit}`;

      const response = await $api.get(endpoint);

      // Update state
      groupFiles.value = response.data || [];

      // Update pagination if available
      if (response.pagination) {
        pagination.value = response.pagination;
      }

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch group files";
      console.error(`Error fetching files for group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get list of all user files (enhanced to match React)
   */
  async function getAllFiles(page = 1, limit = 20): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Construct the endpoint URL with query parameters
      const endpoint = `${FILE_SERVICE_PATH}/files?page=${page}&limit=${limit}`;

      const response = await callApi(endpoint, "GET");

      // Update state
      files.value = response.data || [];

      // Update pagination if available
      if (response.pagination) {
        pagination.value = response.pagination;
      }

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch files";
      console.error("Error fetching all files:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Upload a file to the files service (enhanced to match React implementation)
   * @param file - The file to upload
   * @param type - File type (attachment, profile, avatar)
   * @param relatedTo - UUID of related entity (optional)
   * @param additionalMetadata - Any other metadata to include
   */
  async function uploadFile(
    file: File,
    type: "attachment" | "profile" | "avatar" = "attachment",
    relatedTo?: string,
    additionalMetadata?: Record<string, any>
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      if (!file) {
        throw new Error("No file provided");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      // Add related_to if specified
      if (relatedTo) {
        formData.append("related_to", relatedTo);
      }

      // Add any additional metadata as form fields
      if (additionalMetadata) {
        Object.entries(additionalMetadata).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
      }

      console.log(
        `[useFiles] Uploading file to files service via /files/upload`
      );

      // Use the files/upload endpoint
      const endpoint = `${FILE_SERVICE_PATH}/files/upload`;

      const response = await callApi(endpoint, "POST", formData);

      // Handle response from raw fetch
      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      // Refresh the files list after a successful upload
      await getAllFiles();

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to upload file";
      console.error("Error uploading file:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Attach media files to messages using the messages service (port 8082)
   * This creates a media attachment within a message context
   * @param file - The file to attach
   * @param messageId - ID of the message to attach media to
   * @param conversationId - ID of the conversation (optional)
   * @param additionalMetadata - Any other metadata to include
   */
  async function attachMediaToMessage(
    file: File,
    messageId: string,
    conversationId?: string,
    additionalMetadata?: Record<string, any>
  ): Promise<{ file_url: string; media_type: string; message_id: string }> {
    isLoading.value = true;
    error.value = null;

    try {
      if (!file) {
        throw new Error("No file provided");
      }

      if (!messageId) {
        throw new Error("Message ID is required for media attachment");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("message_id", messageId);

      // Add conversation ID if provided
      if (conversationId) {
        formData.append("conversation_id", conversationId);
      }

      // Add media type based on file type
      formData.append("media_type", getFileTypeCategory(file.type));

      // Add any additional metadata as form fields
      if (additionalMetadata) {
        Object.entries(additionalMetadata).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
      }

      console.log(
        `[useFiles] Attaching media to message ${messageId} via messages service`
      );

      // Use the messages/media endpoint on the messages service (port 8082)
      const response = await $api.raw.post("messages/media", formData);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Media attachment failed: ${errorText}`);
      }

      // Safely parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error("Failed to parse server response");
      }

      // Check if we have a file_url in the response
      if (!data.file_url) {
        throw new Error(
          "Media attachment succeeded but no file URL was returned"
        );
      }

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to attach media to message";
      console.error("Error attaching media:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Download a file
   */
  async function downloadFile(fileId: string): Promise<Blob> {
    isLoading.value = true;
    error.value = null;

    try {
      if (!fileId) {
        throw new Error("No file ID provided");
      }

      // For direct download, use the download URL that goes through the proxy
      const url = getFileUrl(fileId);

      // Use browser fetch for direct download (avoiding any response processing)
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to download file (status: ${response.status})`);
      }

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get("content-disposition");
      let filename = fileId;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Convert response to blob
      const blob = await response.blob();

      // Create a download link and trigger the download
      if (isClient) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      return blob;
    } catch (err: any) {
      error.value = err.message || "Failed to download file";
      console.error(`Error downloading file ${fileId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Delete a file
   */
  async function deleteFile(fileId: string): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      if (!fileId) {
        throw new Error("No file ID provided");
      }

      const endpoint = `files/${fileId}`;

      const response = await $api.delete(endpoint);

      // Refresh the files list after successful deletion
      await getAllFiles();

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to delete file";
      console.error(`Error deleting file ${fileId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Share a file with another user or group
   */
  async function shareFile(
    fileId: string,
    userIds: string[],
    permission: string = "read"
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      if (!fileId) {
        throw new Error("No file ID provided");
      }

      if (!userIds || userIds.length === 0) {
        throw new Error("No users specified to share with");
      }

      const endpoint = `files/${fileId}/share`;

      // Share with the first user in the array
      // If you need to share with multiple users, you'll need to call this function multiple times
      // or modify the backend to accept an array
      const response = await $api.post(endpoint, {
        permission: permission,
        target_id: userIds[0],
        target_type: "user",
      });

      // If there are multiple users, make additional API calls
      if (userIds.length > 1) {
        for (let i = 1; i < userIds.length; i++) {
          await $api.post(endpoint, {
            permission: permission,
            target_id: userIds[i],
            target_type: "user",
          });
        }
      }

      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to share file";
      console.error(`Error sharing file ${fileId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Send a file as a message in a chat (direct message)
   * This function handles both upload and message creation in one step
   */
  async function sendChatFileMessage(
    recipientId: string,
    file: File,
    messageText: string = "File attachment"
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      if (!file) {
        throw new Error("No file provided");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("receiver_id", recipientId);
      formData.append("content", messageText);
      formData.append("type", getFileTypeCategory(file.type));

      // Use the unified message endpoint for consistency
      const response = await $api.raw.post("/message", formData);

      // Handle response from raw fetch
      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      // Update user media list with the new file to keep UI in sync
      await getUserMedia(recipientId, "all", 1);

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to send file message";
      console.error("Error sending file message:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Send a file as a message in a group chat
   * This function handles both upload and message creation in one step
   */
  async function sendGroupFileMessage(
    groupId: string,
    file: File,
    messageText: string = "File attachment"
  ): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      if (!file) {
        throw new Error("No file provided");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("group_id", groupId);
      formData.append("content", messageText);
      formData.append("type", getFileTypeCategory(file.type));

      // Use the unified message endpoint for consistency
      const response = await $api.raw.post("/message", formData);

      // Handle response from raw fetch
      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      // Update group media list with the new file to keep UI in sync
      await getGroupMedia(groupId, "all", 1);

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to send file message";
      console.error("Error sending file message to group:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Helper function to determine file type category
   */
  function getFileTypeCategory(mimeType: string): string {
    if (!mimeType) return "file";

    if (mimeType.startsWith("image/")) {
      return "image";
    } else if (mimeType.startsWith("video/")) {
      return "video";
    } else if (mimeType.startsWith("audio/")) {
      return "audio";
    } else if (
      mimeType.includes("pdf") ||
      mimeType.includes("doc") ||
      mimeType.includes("xls") ||
      mimeType.includes("ppt") ||
      mimeType.includes("txt")
    ) {
      return "document";
    }

    return "file";
  }

  /**
   * Get file URL (helper function) - Enhanced to match React implementation
   */
  function getFileUrl(fileId: string, groupId?: string): string {
    if (!fileId) return "";
    // Construct proper proxy URL without duplicating paths
    if (groupId) {
      return `/api/proxy/files/group/${groupId}/${fileId}`;
    }
    return `/api/proxy/files/${fileId}`;
  }

  /**
   * Get file download URL (new from React implementation)
   */
  function getDownloadUrl(fileId: string, groupId?: string): string {
    if (!fileId) return "";
    if (groupId) {
      return `/api/proxy/files/group/${groupId}/${fileId}/download`;
    }
    return `/api/proxy/files/${fileId}/download`;
  }

  /**
   * Get thumbnail URL for image files (helper function)
   */
  function getThumbnailUrl(fileId: string, groupId?: string): string {
    if (!fileId) return "";
    // Add a thumbnail parameter to the URL for the backend to generate a thumbnail
    if (groupId) {
      return `/api/proxy/files/group/${groupId}/${fileId}?thumbnail=true`;
    }
    return `/api/proxy/files/${fileId}?thumbnail=true`;
  }

  /**
   * Get file preview URL (new from React implementation)
   */
  function getPreviewUrl(fileId: string, groupId?: string): string {
    if (!fileId) return "";
    if (groupId) {
      return `/api/proxy/files/group/${groupId}/${fileId}/preview`;
    }
    return `/api/proxy/files/${fileId}/preview`;
  }

  /**
   * Get file details (new from React implementation)
   */
  async function getFileDetails(fileId: string): Promise<ApiResponse> {
    return await callApi(`${FILE_SERVICE_PATH}/files/${fileId}`, "GET");
  }

  /**
   * Format file size for display (helper function)
   */
  function formatFileSize(bytes: number): string {
    if (typeof bytes !== "number" || isNaN(bytes) || bytes < 0) {
      return "0 bytes";
    }

    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  }

  return {
    // State (enhanced to match React implementation)
    files,
    userMedia,
    groupMedia,
    userFiles,
    groupFiles,
    loading: isLoading, // Alias for React compatibility
    isLoading,
    error,
    pagination,
    filesResponse,

    // Core methods (matching React implementation)
    checkHealth,
    getFiles: getAllFiles, // Alias for React compatibility
    getAllFiles,
    getUserFiles,
    getGroupFiles,
    getGroupMedia,
    getUserMedia,
    getFileDetails,
    uploadFile,
    downloadFile,
    deleteFile,
    shareFile,

    // URL helpers (enhanced to match React implementation)
    getPreviewUrl,
    getDownloadUrl,
    getFileUrl,
    getThumbnailUrl,

    // Message integration methods
    sendChatFileMessage,
    sendGroupFileMessage,
    attachMediaToMessage,

    // Utility methods
    formatFileSize,
    getFileTypeCategory,

    // New method from React implementation for message attachments
    uploadMessageAttachment: (file: File, chatId: string, isGroup: boolean) => {
      const additionalData: Record<string, string> = {
        type: "attachment",
        related_to: chatId,
        related_type: isGroup ? "group" : "user",
        for_message: "true",
      };
      return uploadFile(file, "attachment", chatId, additionalData);
    },
  };
});

// Export the store as a composable
export function useFiles() {
  return useFilesStore();
}
