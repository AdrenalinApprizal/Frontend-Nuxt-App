import { defineStore } from "pinia";
import { ref } from "vue";
import { useNuxtApp } from "#app";

// Define media type
type MediaType = "image" | "video" | "audio" | "document" | "all";

// Define file metadata interface
interface FileMetadata {
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

// Define pagination interface
interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_more_pages: boolean;
}

// Define API response interface
interface ApiResponse {
  message?: string;
  data?: any;
  pagination?: Pagination;
}

// Use proper path format for the proxy - direct to files and media endpoints
const FILE_SERVICE_PATH = "";

export const useFilesStore = defineStore("files", () => {
  // State
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

  // Get nuxt app to access the API plugin
  const nuxtApp = useNuxtApp();
  const $api = nuxtApp.$api;

  // Check if we're in browser environment
  const isClient = process.client;

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
      const endpoint = `media/user/${userId}?type=${type}&page=${page}&limit=${limit}`;

      const response = await $api.get(endpoint);

      // Check if the response is valid
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      // Handle pagination differently based on page number
      if (page === 1) {
        // Replace existing data on first page
        userMedia.value = response.data || [];
      } else {
        // Append data for subsequent pages
        userMedia.value = [...userMedia.value, ...(response.data || [])];
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
      const endpoint = `media/group/${groupId}?type=${type}&page=${page}&limit=${limit}`;

      const response = await $api.get(endpoint);

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
   * Get list of all user files
   */
  async function getAllFiles(page = 1, limit = 20): Promise<ApiResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      // Construct the endpoint URL with query parameters
      const endpoint = `files?page=${page}&limit=${limit}`;

      const response = await $api.get(endpoint);

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
   * Upload a file to the system
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

      const endpoint = `files/upload`;

      // Use raw fetch for FormData
      const response = await $api.raw.post(endpoint, formData);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      // Safely parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error("Failed to parse server response");
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
      formData.append("recipient_id", recipientId);
      formData.append("content", messageText);
      formData.append("type", getFileTypeCategory(file.type));

      const endpoint = `media/chat/messages`;

      // Use raw fetch for FormData
      const response = await $api.raw.post(endpoint, formData);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      // Safely parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error("Failed to parse server response");
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

      const endpoint = `media/group/messages`;

      // Use raw fetch for FormData
      const response = await $api.raw.post(endpoint, formData);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      // Safely parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error("Failed to parse server response");
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
   * Get file URL (helper function)
   */
  function getFileUrl(fileId: string): string {
    if (!fileId) return "";
    // Use relative URL with proxy path to ensure proper functioning with the proxy
    return `/api/proxy/files/${fileId}`;
  }

  /**
   * Get thumbnail URL for image files (helper function)
   */
  function getThumbnailUrl(fileId: string): string {
    if (!fileId) return "";
    // Add a thumbnail parameter to the URL for the backend to generate a thumbnail
    return `/api/proxy/files/${fileId}?thumbnail=true`;
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
    // State
    files,
    userMedia,
    groupMedia,
    userFiles,
    groupFiles,
    isLoading,
    error,
    pagination,

    // Methods
    getUserMedia,
    getGroupMedia,
    getUserFiles,
    getGroupFiles,
    getAllFiles,
    uploadFile,
    downloadFile,
    deleteFile,
    shareFile,
    getFileUrl,
    getThumbnailUrl,
    formatFileSize,
    sendChatFileMessage,
    sendGroupFileMessage,
  };
});

// Export the store as a composable
export function useFiles() {
  return useFilesStore();
}
