import { v as vueExports, f as useRoute$1, u as useRouter, b as useAuthStore, s as serverRenderer_cjs_prodExports, a as useNuxtApp, d as _sfc_main$6$1 } from './server.mjs';
import { u as useGroupsStore } from './useGroups-CkV_vNHq.mjs';
import { u as usePresence } from './usePresence-DI3wi_wD.mjs';
import { defineStore } from 'pinia';
import { u as useFriendsStore } from './useFriends-DzoMEWH6.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { a as useMessagesStore, u as useWebSocket, b as formatDateForSeparator, e as eventBus, f as formatMessageTimestamp, _ as __nuxt_component_0 } from './OptimizedAvatar-CIwqHRpr.mjs';
import '../routes/renderer.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../_/shared.cjs.prod.mjs';
import '@vue/runtime-dom';
import 'node:stream';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'mitt';

const _sfc_main$8 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SearchOnGroup",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    groupMembers: {}
  },
  emits: ["close", "search"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const searchQuery = vueExports.ref("");
    const showFilter = vueExports.ref(false);
    const selectedMembers = vueExports.ref([]);
    const filtersApplied = vueExports.ref(false);
    const memberSearchQuery = vueExports.ref("");
    vueExports.ref(null);
    const inputRef = vueExports.ref(null);
    const filteredMembers = vueExports.computed(() => {
      if (!memberSearchQuery.value) {
        return props.groupMembers;
      }
      return props.groupMembers.filter(
        (member) => member.name.toLowerCase().includes(memberSearchQuery.value.toLowerCase())
      );
    });
    const groupedMembers = vueExports.computed(() => {
      const grouped = {};
      filteredMembers.value.forEach((member) => {
        const firstLetter = member.name.charAt(0).toUpperCase();
        if (!grouped[firstLetter]) {
          grouped[firstLetter] = [];
        }
        grouped[firstLetter].push(member);
      });
      return grouped;
    });
    vueExports.watch(
      () => props.isOpen,
      (newVal) => {
        if (!newVal) {
          if (!filtersApplied.value) {
            searchQuery.value = "";
            selectedMembers.value = [];
            showFilter.value = false;
          }
        } else {
          vueExports.nextTick(() => {
            if (inputRef.value) {
              inputRef.value.focus();
            }
          });
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = _sfc_main$6$1;
      if (_ctx.isOpen) {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "fixed inset-0 flex items-start justify-center pt-20 bg-black bg-opacity-30 z-50" }, _attrs))}><div class="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md"><div class="px-4 py-3 border-b border-gray-200 flex justify-between items-center"><div class="flex flex-1 items-center"><div class="relative flex-1"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:search",
          class: "h-4 w-4 text-gray-400"
        }, null, _parent));
        _push(`</div><input type="text"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", searchQuery.value)} placeholder="Search Messages" class="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"></div><button class="${serverRenderer_cjs_prodExports.ssrRenderClass(`ml-3 p-2 rounded-full ${filtersApplied.value ? "bg-blue-500 text-white" : "hover:bg-gray-100 text-gray-500"}`)}">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:filter",
          class: "h-4 w-4"
        }, null, _parent));
        _push(`</button><button class="ml-2 p-2 hover:bg-gray-100 rounded-full">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:times",
          class: "h-5 w-5 text-gray-500"
        }, null, _parent));
        _push(`</button></div></div>`);
        if (showFilter.value) {
          _push(`<div class="bg-white rounded"><div class="px-6 py-3 border-b border-gray-200 flex justify-between items-center"><h2 class="text-lg text-black font-medium">Search Filter</h2><button class="p-1 rounded-full hover:bg-gray-100">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:times",
            class: "h-5 w-5"
          }, null, _parent));
          _push(`</button></div><div class="px-6 py-4"><p class="text-sm text-gray-500 mb-4">${serverRenderer_cjs_prodExports.ssrInterpolate(filtersApplied.value ? "Filters Applied" : "No Filters Applied")}</p><div class="relative mb-4"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:search",
            class: "h-4 w-4 text-gray-400"
          }, null, _parent));
          _push(`</div><input type="text"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", memberSearchQuery.value)} placeholder="Search by name" class="w-full text-black pl-10 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none"></div><div class="mt-2 max-h-60 overflow-y-auto"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(groupedMembers.value, (members, letter) => {
            _push(`<div><div class="mb-2 text-xs text-gray-500">${serverRenderer_cjs_prodExports.ssrInterpolate(letter)}</div><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(members, (member) => {
              _push(`<div class="flex items-center justify-between py-2"><div class="flex items-center text-black"><div class="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex items-center justify-center">`);
              if (member.avatar) {
                _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", member.avatar)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", member.name)} class="w-full h-full object-cover">`);
              } else {
                _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                  name: "fa:user",
                  class: "h-5 w-5 text-gray-500"
                }, null, _parent));
              }
              _push(`</div><span>${serverRenderer_cjs_prodExports.ssrInterpolate(member.name)}</span></div><input type="checkbox"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(selectedMembers.value.includes(member.id)) ? " checked" : ""} class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"></div>`);
            });
            _push(`<!--]--></div>`);
          });
          _push(`<!--]-->`);
          if (Object.keys(groupedMembers.value).length === 0) {
            _push(`<div class="text-center py-6 text-gray-500"> No members found </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="mt-6 flex justify-end space-x-3"><button class="px-4 py-2 text-gray-700 rounded hover:bg-gray-100"> Cancel </button><button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"> Apply </button></div></div></div>`);
        } else {
          _push(`<div class="px-6 py-4">`);
          if (filtersApplied.value) {
            _push(`<div class="px-4 py-2 bg-blue-50 flex items-center rounded mb-4"><span class="mr-2 text-sm text-blue-700">${serverRenderer_cjs_prodExports.ssrInterpolate(selectedMembers.value.length)} ${serverRenderer_cjs_prodExports.ssrInterpolate(selectedMembers.value.length === 1 ? "person" : "people")} added to the filter </span><button class="ml-auto text-blue-700 hover:text-blue-800"> Clear </button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex justify-center items-center py-4"><button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"> Search </button></div></div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/SearchOnGroup.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const FILE_SERVICE_PATH = "";
const useFilesStore = defineStore("files", () => {
  const files = vueExports.ref([]);
  const userMedia = vueExports.ref([]);
  const groupMedia = vueExports.ref([]);
  const userFiles = vueExports.ref([]);
  const groupFiles = vueExports.ref([]);
  const isLoading = vueExports.ref(false);
  const error = vueExports.ref(null);
  const pagination = vueExports.ref({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 20,
    has_more_pages: false
  });
  const filesResponse = vueExports.ref(null);
  const nuxtApp = useNuxtApp();
  const $api = nuxtApp.$api;
  const isClient = false;
  const callApi = async (endpoint, method, body) => {
    try {
      const options = {
        method
      };
      if (body && method !== "GET") {
        if (body instanceof FormData) {
          options.body = body;
        } else {
          options.headers = {
            "Content-Type": "application/json"
          };
          options.body = JSON.stringify(body);
        }
      }
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
    } catch (error2) {
      throw new Error(error2.message || "API request failed");
    }
  };
  const checkHealth = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await callApi(`${FILE_SERVICE_PATH}/health`, "GET");
      return response;
    } catch (err) {
      error.value = `Failed to check file service health: ${err.message}`;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  async function getUserMedia(userId, type = "all", page = 1, limit = 20) {
    isLoading.value = true;
    error.value = null;
    try {
      const endpoint = `${FILE_SERVICE_PATH}/media/user/${userId}?type=${type}&page=${page}&limit=${limit}`;
      const response = await callApi(endpoint, "GET");
      if (!response) {
        console.warn(
          `[useFiles] No response received for media endpoint: ${endpoint}`
        );
        return { data: [], pagination: void 0 };
      }
      console.log(`[useFiles] Media API response structure:`, {
        hasData: !!response.data,
        hasPagination: !!response.pagination,
        responseKeys: Object.keys(response),
        dataLength: Array.isArray(response.data) ? response.data.length : "not array"
      });
      const responseData = response.data || response;
      if (page === 1) {
        userMedia.value = Array.isArray(responseData) ? responseData : [];
      } else {
        const newData = Array.isArray(responseData) ? responseData : [];
        userMedia.value = [...userMedia.value, ...newData];
      }
      if (response.pagination) {
        pagination.value = response.pagination;
      }
      return response;
    } catch (err) {
      error.value = err.message || "Failed to fetch user media";
      console.error(`Error fetching media for user ${userId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function getGroupMedia(groupId, type = "all", page = 1, limit = 20) {
    isLoading.value = true;
    error.value = null;
    try {
      const endpoint = `${FILE_SERVICE_PATH}/media/group/${groupId}?type=${type}&page=${page}&limit=${limit}`;
      const response = await callApi(endpoint, "GET");
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }
      if (page === 1) {
        groupMedia.value = response.data || [];
      } else {
        groupMedia.value = [...groupMedia.value, ...response.data || []];
      }
      if (response.pagination) {
        pagination.value = response.pagination;
      }
      return response;
    } catch (err) {
      error.value = err.message || "Failed to fetch group media";
      console.error(`Error fetching media for group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function getUserFiles(userId, page = 1, limit = 20) {
    isLoading.value = true;
    error.value = null;
    try {
      const endpoint = `files/user/${userId}?page=${page}&limit=${limit}`;
      const response = await $api.get(endpoint);
      userFiles.value = response.data || [];
      if (response.pagination) {
        pagination.value = response.pagination;
      }
      return response;
    } catch (err) {
      error.value = err.message || "Failed to fetch user files";
      console.error(`Error fetching files for user ${userId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function getGroupFiles(groupId, page = 1, limit = 20) {
    isLoading.value = true;
    error.value = null;
    try {
      const endpoint = `files/group/${groupId}?page=${page}&limit=${limit}`;
      const response = await $api.get(endpoint);
      groupFiles.value = response.data || [];
      if (response.pagination) {
        pagination.value = response.pagination;
      }
      return response;
    } catch (err) {
      error.value = err.message || "Failed to fetch group files";
      console.error(`Error fetching files for group ${groupId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function getAllFiles(page = 1, limit = 20) {
    isLoading.value = true;
    error.value = null;
    try {
      const endpoint = `${FILE_SERVICE_PATH}/files?page=${page}&limit=${limit}`;
      const response = await callApi(endpoint, "GET");
      files.value = response.data || [];
      if (response.pagination) {
        pagination.value = response.pagination;
      }
      return response;
    } catch (err) {
      error.value = err.message || "Failed to fetch files";
      console.error("Error fetching all files:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function uploadFile(file, type = "attachment", relatedTo, additionalMetadata) {
    isLoading.value = true;
    error.value = null;
    try {
      if (!file) {
        throw new Error("No file provided");
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      if (relatedTo) {
        formData.append("related_to", relatedTo);
      }
      if (additionalMetadata) {
        Object.entries(additionalMetadata).forEach(([key, value]) => {
          if (value !== void 0 && value !== null) {
            formData.append(key, String(value));
          }
        });
      }
      console.log(
        `[useFiles] Uploading file to files service via /files/upload`
      );
      const endpoint = `${FILE_SERVICE_PATH}/files/upload`;
      const response = await callApi(endpoint, "POST", formData);
      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
      await getAllFiles();
      return data;
    } catch (err) {
      error.value = err.message || "Failed to upload file";
      console.error("Error uploading file:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function attachMediaToMessage(file, messageId, conversationId, additionalMetadata) {
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
      if (conversationId) {
        formData.append("conversation_id", conversationId);
      }
      formData.append("media_type", getFileTypeCategory(file.type));
      if (additionalMetadata) {
        Object.entries(additionalMetadata).forEach(([key, value]) => {
          if (value !== void 0 && value !== null) {
            formData.append(key, String(value));
          }
        });
      }
      console.log(
        `[useFiles] Attaching media to message ${messageId} via messages service`
      );
      const response = await $api.raw.post("messages/media", formData);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Media attachment failed: ${errorText}`);
      }
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error("Failed to parse server response");
      }
      if (!data.file_url) {
        throw new Error(
          "Media attachment succeeded but no file URL was returned"
        );
      }
      return data;
    } catch (err) {
      error.value = err.message || "Failed to attach media to message";
      console.error("Error attaching media:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function downloadFile(fileId) {
    isLoading.value = true;
    error.value = null;
    try {
      if (!fileId) {
        throw new Error("No file ID provided");
      }
      const url = getFileUrl(fileId);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download file (status: ${response.status})`);
      }
      const contentDisposition = response.headers.get("content-disposition");
      let filename = fileId;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      const blob = await response.blob();
      if (isClient) ;
      return blob;
    } catch (err) {
      error.value = err.message || "Failed to download file";
      console.error(`Error downloading file ${fileId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteFile(fileId) {
    isLoading.value = true;
    error.value = null;
    try {
      if (!fileId) {
        throw new Error("No file ID provided");
      }
      const endpoint = `files/${fileId}`;
      const response = await $api.delete(endpoint);
      await getAllFiles();
      return response;
    } catch (err) {
      error.value = err.message || "Failed to delete file";
      console.error(`Error deleting file ${fileId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function shareFile(fileId, userIds, permission = "read") {
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
      const response = await $api.post(endpoint, {
        permission,
        target_id: userIds[0],
        target_type: "user"
      });
      if (userIds.length > 1) {
        for (let i = 1; i < userIds.length; i++) {
          await $api.post(endpoint, {
            permission,
            target_id: userIds[i],
            target_type: "user"
          });
        }
      }
      return response;
    } catch (err) {
      error.value = err.message || "Failed to share file";
      console.error(`Error sharing file ${fileId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function sendChatFileMessage(recipientId, file, messageText = "File attachment") {
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
      const endpoint = `${FILE_SERVICE_PATH}/chat/messages/media`;
      const response = await callApi(endpoint, "POST", formData);
      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
      await getUserMedia(recipientId, "all", 1);
      return data;
    } catch (err) {
      error.value = err.message || "Failed to send file message";
      console.error("Error sending file message:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function sendGroupFileMessage(groupId, file, messageText = "File attachment") {
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
      const endpoint = `${FILE_SERVICE_PATH}/groups/${groupId}/messages`;
      const response = await callApi(endpoint, "POST", formData);
      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
      await getGroupMedia(groupId, "all", 1);
      return data;
    } catch (err) {
      error.value = err.message || "Failed to send file message";
      console.error("Error sending file message to group:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  function getFileTypeCategory(mimeType) {
    if (!mimeType) return "file";
    if (mimeType.startsWith("image/")) {
      return "image";
    } else if (mimeType.startsWith("video/")) {
      return "video";
    } else if (mimeType.startsWith("audio/")) {
      return "audio";
    } else if (mimeType.includes("pdf") || mimeType.includes("doc") || mimeType.includes("xls") || mimeType.includes("ppt") || mimeType.includes("txt")) {
      return "document";
    }
    return "file";
  }
  function getFileUrl(fileId, groupId) {
    if (!fileId) return "";
    if (groupId) {
      return `/api/proxy/files/group/${groupId}/${fileId}`;
    }
    return `/api/proxy/files/${fileId}`;
  }
  function getDownloadUrl(fileId, groupId) {
    if (!fileId) return "";
    if (groupId) {
      return `/api/proxy/files/group/${groupId}/${fileId}/download`;
    }
    return `/api/proxy/files/${fileId}/download`;
  }
  function getThumbnailUrl(fileId, groupId) {
    if (!fileId) return "";
    if (groupId) {
      return `/api/proxy/files/group/${groupId}/${fileId}?thumbnail=true`;
    }
    return `/api/proxy/files/${fileId}?thumbnail=true`;
  }
  function getPreviewUrl(fileId, groupId) {
    if (!fileId) return "";
    if (groupId) {
      return `/api/proxy/files/group/${groupId}/${fileId}/preview`;
    }
    return `/api/proxy/files/${fileId}/preview`;
  }
  async function getFileDetails(fileId) {
    return await callApi(`${FILE_SERVICE_PATH}/files/${fileId}`, "GET");
  }
  function formatFileSize(bytes) {
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
    loading: isLoading,
    // Alias for React compatibility
    isLoading,
    error,
    pagination,
    filesResponse,
    // Core methods (matching React implementation)
    checkHealth,
    getFiles: getAllFiles,
    // Alias for React compatibility
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
    uploadMessageAttachment: (file, chatId, isGroup) => {
      const additionalData = {
        type: "attachment",
        related_to: chatId,
        related_type: isGroup ? "group" : "user",
        for_message: "true"
      };
      return uploadFile(file, "attachment", chatId, additionalData);
    }
  };
});
function useFiles() {
  return useFilesStore();
}
const _sfc_main$7 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "GroupInfoPanel",
  __ssrInlineRender: true,
  props: {
    groupDetails: {}
  },
  emits: ["update:group", "close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { $toast } = useNuxtApp();
    const presence = usePresence();
    const groupsStore = useGroupsStore();
    useAuthStore();
    const friendsStore = useFriendsStore();
    const {
      downloadFile: downloadFileAction,
      shareFile,
      formatFileSize
    } = useFiles();
    const expandedSection = vueExports.ref(null);
    const showAddMemberPopup = vueExports.ref(false);
    const showAttachmentsModal = vueExports.ref(false);
    const showShareModal = vueExports.ref(false);
    const showPreview = vueExports.ref(false);
    const searchQuery = vueExports.ref("");
    vueExports.ref(null);
    const activeDropdown = vueExports.ref(null);
    const attachments = vueExports.ref([]);
    const selectedAttachment = vueExports.ref(null);
    const isLoading = vueExports.ref(false);
    const isLoadingMore = vueExports.ref(false);
    const currentPage = vueExports.ref(1);
    const pagination = vueExports.ref({
      current_page: 1,
      total_pages: 1,
      total_items: 0,
      items_per_page: 8,
      has_more_pages: false
    });
    const friends = vueExports.ref([]);
    const friendsList = vueExports.ref([]);
    const groupName = vueExports.computed(() => props.groupDetails.name);
    const displayedAttachments = vueExports.computed(() => {
      return attachments.value.slice(0, 6);
    });
    const hasMoreAttachments = vueExports.computed(() => {
      return attachments.value.length > 6;
    });
    const currentAttachmentIndex = vueExports.computed(() => {
      if (!selectedAttachment.value) return -1;
      return attachments.value.findIndex(
        (item) => item.file_id === selectedAttachment.value.file_id
      );
    });
    const hasPreviousAttachment = vueExports.computed(() => {
      return currentAttachmentIndex.value > 0;
    });
    const hasNextAttachment = vueExports.computed(() => {
      return currentAttachmentIndex.value < attachments.value.length - 1;
    });
    const filteredFriends = vueExports.computed(() => {
      if (!searchQuery.value) return friends.value;
      return friends.value.filter(
        (friend) => {
          var _a, _b;
          return ((_a = friend.name) == null ? void 0 : _a.toLowerCase().includes(searchQuery.value.toLowerCase())) || ((_b = friend.username) == null ? void 0 : _b.toLowerCase().includes(searchQuery.value.toLowerCase()));
        }
      );
    });
    const blockedUsers = vueExports.computed(() => groupsStore.blockedUsers || []);
    const membersWithStatus = vueExports.computed(() => {
      return props.groupDetails.members.map((member) => {
        const userId = member.id || member.user_id || "";
        const blockedUser = blockedUsers.value.find((user) => {
          return user.user_id === userId || user.user_id === member.id || user.user_id === member.user_id;
        });
        const isBlocked = !!blockedUser;
        const presenceStatus = presence.getStatus(
          member.user_id || member.id
        );
        let displayName = member.extracted_name || member.display_name || member.name || member.full_name || `${member.first_name || ""} ${member.last_name || ""}`.trim() || member.username || "Unknown User";
        return {
          ...member,
          name: displayName,
          isBlocked,
          presenceStatus,
          lastActive: formatLastActive(
            presence.getLastActive(member.user_id || member.id)
          ),
          avatar: member.avatar || member.avatar_url || member.profile_picture_url,
          role: member.is_owner ? "owner" : member.role || "member",
          // React-style enhancement properties
          permissions: {
            canKick: !member.is_owner && !isBlocked,
            canMute: !member.is_owner && !isBlocked,
            canPromote: !member.is_owner && !isBlocked,
            canEdit: member.is_owner
          },
          lastSeen: presence.getLastActive(member.user_id || member.id),
          isTyping: false,
          // Could be enhanced with real typing indicators
          muteUntil: void 0,
          // Could be enhanced with mute functionality
          joinedVia: "invite",
          // Default value, could be from API
          customTitle: member.is_owner ? "Owner" : void 0
        };
      });
    });
    const blockedMembersCount = vueExports.computed(() => {
      return membersWithStatus.value.filter((member) => member.isBlocked).length;
    });
    const isImage = (mimeType) => {
      return mimeType.startsWith("image/");
    };
    const getFileIcon = (mimeType) => {
      if (mimeType.startsWith("image/")) return "fa:image";
      if (mimeType.startsWith("video/")) return "fa:video";
      if (mimeType.startsWith("audio/")) return "fa:music";
      if (mimeType.includes("pdf")) return "fa:file-pdf";
      if (mimeType.includes("word")) return "fa:file-word";
      if (mimeType.includes("excel") || mimeType.includes("sheet"))
        return "fa:file-excel";
      if (mimeType.includes("powerpoint") || mimeType.includes("presentation"))
        return "fa:file-powerpoint";
      if (mimeType.includes("zip") || mimeType.includes("archive"))
        return "fa:file-archive";
      return "fa:file";
    };
    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      } catch {
        return "Unknown date";
      }
    };
    const formatLastActive = (lastActiveTimestamp) => {
      if (!lastActiveTimestamp) return "Not available";
      try {
        const lastActiveDate = new Date(lastActiveTimestamp);
        const now = /* @__PURE__ */ new Date();
        const diffInSeconds = Math.floor(
          (now.getTime() - lastActiveDate.getTime()) / 1e3
        );
        if (diffInSeconds < 60) return "Just now";
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hr ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7)
          return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
        return lastActiveDate.toLocaleDateString();
      } catch (error) {
        return "Not available";
      }
    };
    vueExports.watch(
      () => friendsStore.friends,
      (friends2) => {
        if (friends2) {
          friendsList.value = friends2.map((friend) => ({
            ...friend,
            name: friend.name || friend.display_name || friend.full_name || "Unknown User",
            role: "member",
            user_id: friend.id,
            status: friend.status || "offline",
            shareSelected: false
          }));
        }
      },
      { immediate: true }
    );
    const loadAttachments = async () => {
      var _a;
      if (!((_a = props.groupDetails) == null ? void 0 : _a.id)) return;
      try {
        isLoading.value = true;
        const response = await fetch(
          `/api/proxy/messages/history?type=group&target_id=${props.groupDetails.id}&limit=100`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let messages = [];
        if ((data == null ? void 0 : data.data) && Array.isArray(data.data)) {
          messages = data.data;
        } else if ((data == null ? void 0 : data.messages) && Array.isArray(data.messages)) {
          messages = data.messages;
        } else if (Array.isArray(data)) {
          messages = data;
        }
        const extractedAttachments = [];
        messages.forEach((message) => {
          if (message.attachment || message.attachments) {
            const attachment = message.attachment || message.attachments;
            if (attachment.url && attachment.filename) {
              extractedAttachments.push({
                file_id: attachment.file_id || attachment.id || message.id,
                filename: attachment.filename || attachment.name || "Unknown File",
                size: attachment.size || 0,
                mime_type: attachment.mime_type || attachment.type || "application/octet-stream",
                url: attachment.url,
                uploaded_at: attachment.uploaded_at || message.created_at || (/* @__PURE__ */ new Date()).toISOString()
              });
            }
          }
        });
        extractedAttachments.sort(
          (a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
        );
        attachments.value = extractedAttachments;
        pagination.value = {
          current_page: 1,
          total_pages: Math.ceil(extractedAttachments.length / 8),
          total_items: extractedAttachments.length,
          items_per_page: 8,
          has_more_pages: extractedAttachments.length > 8
        };
      } catch (error) {
        console.error("Error loading attachments:", error);
      } finally {
        isLoading.value = false;
      }
    };
    const loadBlockedUsers = async () => {
      var _a;
      try {
        if ((_a = props.groupDetails) == null ? void 0 : _a.id) {
          await groupsStore.getGroupBlocks(props.groupDetails.id);
        }
      } catch (err) {
        console.error("Failed to load blocked users:", err);
      }
    };
    vueExports.watch(
      () => {
        var _a;
        return (_a = props.groupDetails) == null ? void 0 : _a.id;
      },
      (groupId) => {
        if (groupId) {
          currentPage.value = 1;
          loadAttachments();
          loadBlockedUsers();
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = _sfc_main$6$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "w-80 h-full border-l border-gray-200 bg-white overflow-y-auto shadow-lg" }, _attrs))} data-v-6eb20b78><div class="p-4 border-b border-gray-200" data-v-6eb20b78><div class="flex justify-between items-center mb-4" data-v-6eb20b78><div data-v-6eb20b78></div><button class="text-gray-500 hover:text-gray-700" data-v-6eb20b78>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "fa:times",
        class: "h-5 w-5"
      }, null, _parent));
      _push(`</button></div><div class="flex flex-col items-center" data-v-6eb20b78><div class="h-24 w-24 rounded-full overflow-hidden bg-gray-200 mb-3 flex items-center justify-center" data-v-6eb20b78>`);
      if (_ctx.groupDetails.avatar_url) {
        _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", _ctx.groupDetails.avatar_url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", _ctx.groupDetails.name)} class="h-full w-full object-cover" data-v-6eb20b78>`);
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:users",
          class: "h-12 w-12 text-gray-400"
        }, null, _parent));
      }
      _push(`</div><h2 class="text-xl text-black font-semibold" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(groupName.value)}</h2><p class="text-gray-500 text-sm" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(_ctx.groupDetails.description)}</p></div></div><div class="border-b border-gray-200" data-v-6eb20b78><div class="p-4 flex justify-between items-center cursor-pointer" data-v-6eb20b78><div class="flex items-center" data-v-6eb20b78><h3 class="font-medium text-black" data-v-6eb20b78> Members <span class="text-gray-500" data-v-6eb20b78> (${serverRenderer_cjs_prodExports.ssrInterpolate(_ctx.groupDetails.memberCount)}) </span></h3></div><div class="text-gray-500 text-sm" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(expandedSection.value === "members" ? "\u25B2" : "\u25BC")}</div></div>`);
      if (expandedSection.value === "members") {
        _push(`<div class="px-4 pb-4" data-v-6eb20b78>`);
        if (blockedMembersCount.value > 0) {
          _push(`<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" data-v-6eb20b78><div class="flex items-center text-red-700" data-v-6eb20b78>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:ban",
            class: "h-4 w-4 mr-2"
          }, null, _parent));
          _push(`<span class="text-sm font-medium" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(blockedMembersCount.value)} member${serverRenderer_cjs_prodExports.ssrInterpolate(blockedMembersCount.value > 1 ? "s" : "")} blocked </span></div><p class="text-xs text-red-600 mt-1" data-v-6eb20b78> Blocked members cannot send or receive messages in this group </p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="mb-4 flex items-center text-blue-500 hover:text-blue-600 text-sm" data-v-6eb20b78><div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2" data-v-6eb20b78>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:user-plus",
          class: "h-4 w-4"
        }, null, _parent));
        _push(`</div> Add Member </button><div class="space-y-3" data-v-6eb20b78><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(membersWithStatus.value, (member) => {
          _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass(`flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${member.isBlocked ? "bg-red-50 border border-red-200" : "hover:bg-gray-50"}`)}" data-v-6eb20b78><div class="flex items-center" data-v-6eb20b78><div class="relative mr-3" data-v-6eb20b78><div class="${serverRenderer_cjs_prodExports.ssrRenderClass(`w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${member.isBlocked ? "opacity-60 grayscale" : ""}`)}" data-v-6eb20b78>`);
          if (member.avatar) {
            _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", member.avatar)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", member.name)} class="w-full h-full object-cover" data-v-6eb20b78>`);
          } else {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:user",
              class: "h-4 w-4 text-gray-500"
            }, null, _parent));
          }
          _push(`</div>`);
          if (member.isBlocked) {
            _push(`<div class="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-20 rounded-full" data-v-6eb20b78>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:ban",
              class: "h-3 w-3 text-red-600"
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (!member.isBlocked) {
            _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass(`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white ${member.presenceStatus === "online" ? "bg-green-500" : member.presenceStatus === "busy" ? "bg-red-500" : member.presenceStatus === "away" ? "bg-yellow-500" : "bg-gray-400"}`)}" data-v-6eb20b78></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex flex-col" data-v-6eb20b78><div class="flex items-center gap-2" data-v-6eb20b78><span class="${serverRenderer_cjs_prodExports.ssrRenderClass(`text-sm font-medium ${member.isBlocked ? "text-gray-500 line-through" : "text-black"}`)}" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(member.name)}</span>`);
          if (member.isBlocked) {
            _push(`<span class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium" data-v-6eb20b78> Blocked </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (!member.isBlocked) {
            _push(`<div data-v-6eb20b78>`);
            if (member.presenceStatus === "online") {
              _push(`<span class="text-xs text-green-500 font-medium" data-v-6eb20b78> Online </span>`);
            } else {
              _push(`<span class="text-xs text-gray-500" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(member.lastActive)}</span>`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (member.isBlocked) {
            _push(`<span class="text-xs text-red-500" data-v-6eb20b78> User blocked \u2022 Cannot receive messages </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="relative" data-v-6eb20b78><button class="${serverRenderer_cjs_prodExports.ssrRenderClass(`p-1 rounded-full transition-colors ${member.isBlocked ? "text-red-400 hover:text-red-600 hover:bg-red-100" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`)}" data-v-6eb20b78>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:ellipsis-v",
            class: "h-3 w-3"
          }, null, _parent));
          _push(`</button>`);
          if (activeDropdown.value === member.id) {
            _push(`<div class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden" data-v-6eb20b78><button class="${serverRenderer_cjs_prodExports.ssrRenderClass(`flex w-full text-left px-4 py-3 text-sm items-center transition-colors ${member.isBlocked ? "hover:bg-green-50 text-green-700" : "hover:bg-red-50 text-red-700"}`)}"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-6eb20b78>`);
            if (member.isBlocked) {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                name: "fa:check",
                class: "mr-3 h-4 w-4 text-green-600"
              }, null, _parent));
            } else {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                name: "fa:ban",
                class: "mr-3 h-4 w-4 text-red-600"
              }, null, _parent));
            }
            _push(`<div class="flex flex-col" data-v-6eb20b78><span class="${serverRenderer_cjs_prodExports.ssrRenderClass(`font-medium ${member.isBlocked ? "text-green-700" : "text-red-700"}`)}" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(member.isBlocked ? "Unblock User" : "Block User")}</span><span class="${serverRenderer_cjs_prodExports.ssrRenderClass(`text-xs ${member.isBlocked ? "text-green-600" : "text-red-600"}`)}" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(member.isBlocked ? "Allow messages again" : "Stop receiving messages")}</span></div>`);
            if (isLoading.value) {
              _push(`<div class="ml-auto" data-v-6eb20b78><div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" data-v-6eb20b78></div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="border-b border-gray-200" data-v-6eb20b78><div class="p-4 flex justify-between items-center cursor-pointer" data-v-6eb20b78><div class="flex items-center" data-v-6eb20b78><h3 class="font-medium text-black" data-v-6eb20b78> Attachments <span class="text-gray-500" data-v-6eb20b78> (${serverRenderer_cjs_prodExports.ssrInterpolate(attachments.value.length)}) </span></h3></div><div class="text-gray-500 text-sm" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(expandedSection.value === "attachments" ? "\u25B2" : "\u25BC")}</div></div>`);
      if (expandedSection.value === "attachments") {
        _push(`<div class="px-4 pb-4" data-v-6eb20b78>`);
        if (isLoading.value) {
          _push(`<div class="flex items-center justify-center py-8" data-v-6eb20b78><div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" data-v-6eb20b78></div></div>`);
        } else if (attachments.value.length === 0) {
          _push(`<div class="py-8 text-center text-gray-500" data-v-6eb20b78>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:paperclip",
            class: "h-8 w-8 mx-auto mb-2 text-gray-300"
          }, null, _parent));
          _push(`<p data-v-6eb20b78>No attachments found</p></div>`);
        } else {
          _push(`<div class="space-y-3" data-v-6eb20b78><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(displayedAttachments.value, (attachment) => {
            _push(`<div class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" data-v-6eb20b78><div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 mr-3" data-v-6eb20b78>`);
            if (isImage(attachment.mime_type)) {
              _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", attachment.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", attachment.filename)} class="w-full h-full object-cover" data-v-6eb20b78>`);
            } else {
              _push(`<div class="w-full h-full flex items-center justify-center" data-v-6eb20b78>`);
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                name: getFileIcon(attachment.mime_type),
                class: "h-5 w-5 text-gray-500"
              }, null, _parent));
              _push(`</div>`);
            }
            _push(`</div><div class="flex-1 min-w-0" data-v-6eb20b78><p class="text-sm font-medium text-gray-900 truncate" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(attachment.filename)}</p><div class="flex items-center space-x-2 text-xs text-gray-500" data-v-6eb20b78><span data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(formatFileSize)(attachment.size))}</span><span data-v-6eb20b78>\u2022</span><span data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(formatDate(attachment.uploaded_at))}</span></div></div><div class="flex items-center space-x-1" data-v-6eb20b78><button class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Download" data-v-6eb20b78>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:download",
              class: "h-4 w-4"
            }, null, _parent));
            _push(`</button><button class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Share" data-v-6eb20b78>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:share-alt",
              class: "h-4 w-4"
            }, null, _parent));
            _push(`</button></div></div>`);
          });
          _push(`<!--]-->`);
          if (hasMoreAttachments.value) {
            _push(`<div class="text-center pt-2" data-v-6eb20b78><button class="px-4 py-2 text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" data-v-6eb20b78> View All (${serverRenderer_cjs_prodExports.ssrInterpolate(attachments.value.length)}) </button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (showAttachmentsModal.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center" data-v-6eb20b78><div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden" data-v-6eb20b78><div class="flex justify-between items-center p-4 border-b" data-v-6eb20b78><h3 class="font-medium text-lg" data-v-6eb20b78>All Attachments</h3><button class="text-gray-500 hover:text-gray-700" data-v-6eb20b78>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:times",
          class: "h-5 w-5"
        }, null, _parent));
        _push(`</button></div><div class="overflow-y-auto p-4" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "max-height": "calc(90vh - 8rem)" })}" data-v-6eb20b78>`);
        if (isLoadingMore.value) {
          _push(`<div class="flex justify-center py-4" data-v-6eb20b78><div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" data-v-6eb20b78></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-3" data-v-6eb20b78><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(attachments.value, (attachment) => {
          _push(`<div class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" data-v-6eb20b78><div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 mr-3" data-v-6eb20b78>`);
          if (isImage(attachment.mime_type)) {
            _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", attachment.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", attachment.filename)} class="w-full h-full object-cover" data-v-6eb20b78>`);
          } else {
            _push(`<div class="w-full h-full flex items-center justify-center" data-v-6eb20b78>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: getFileIcon(attachment.mime_type),
              class: "h-5 w-5 text-gray-500"
            }, null, _parent));
            _push(`</div>`);
          }
          _push(`</div><div class="flex-1 min-w-0" data-v-6eb20b78><p class="text-sm font-medium text-gray-900 truncate" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(attachment.filename)}</p><div class="flex items-center space-x-2 text-xs text-gray-500" data-v-6eb20b78><span data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(formatFileSize)(attachment.size))}</span><span data-v-6eb20b78>\u2022</span><span data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(formatDate(attachment.uploaded_at))}</span></div></div><div class="flex items-center space-x-1" data-v-6eb20b78><button class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Download" data-v-6eb20b78>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:download",
            class: "h-4 w-4"
          }, null, _parent));
          _push(`</button></div></div>`);
        });
        _push(`<!--]--></div>`);
        if (pagination.value.has_more_pages) {
          _push(`<div class="flex justify-center mt-4" data-v-6eb20b78><button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isLoadingMore.value) ? " disabled" : ""} data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(isLoadingMore.value ? "Loading..." : "Load More")}</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showShareModal.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center" data-v-6eb20b78><div class="bg-white rounded-lg p-6 max-w-md w-full" data-v-6eb20b78><div class="flex justify-between items-center mb-4" data-v-6eb20b78><h3 class="font-medium text-lg" data-v-6eb20b78>Share File</h3><button class="text-gray-500 hover:text-gray-700" data-v-6eb20b78>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:times",
          class: "h-5 w-5"
        }, null, _parent));
        _push(`</button></div><div class="mb-4" data-v-6eb20b78><label class="block text-sm font-medium mb-2" data-v-6eb20b78>Share with:</label><div class="max-h-60 overflow-y-auto border border-gray-200 rounded-lg" data-v-6eb20b78><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(friendsList.value, (friend) => {
          _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass(`flex items-center justify-between p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${friend.shareSelected ? "bg-blue-50" : ""}`)}" data-v-6eb20b78><div class="flex items-center" data-v-6eb20b78><div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex items-center justify-center" data-v-6eb20b78>`);
          if (friend.avatar) {
            _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", friend.avatar)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", friend.name)} class="h-full w-full object-cover" data-v-6eb20b78>`);
          } else {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:user",
              class: "h-4 w-4 text-gray-500"
            }, null, _parent));
          }
          _push(`</div><span class="text-sm" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(friend.name)}</span></div>`);
          if (friend.shareSelected) {
            _push(`<div class="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center" data-v-6eb20b78>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:check",
              class: "h-2 w-2 text-white"
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div></div><div class="flex justify-end" data-v-6eb20b78><button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(!friendsList.value.some((friend) => friend.shareSelected)) ? " disabled" : ""} data-v-6eb20b78> Share </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showPreview.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" data-v-6eb20b78><div class="relative w-full max-w-4xl" data-v-6eb20b78><button class="absolute top-4 right-4 text-white hover:text-gray-300 z-10" data-v-6eb20b78>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:times",
          class: "h-6 w-6"
        }, null, _parent));
        _push(`</button>`);
        if (selectedAttachment.value) {
          _push(`<div class="flex flex-col items-center" data-v-6eb20b78>`);
          if (isImage(selectedAttachment.value.mime_type)) {
            _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", selectedAttachment.value.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", selectedAttachment.value.filename)} class="max-h-[80vh] max-w-full object-contain" data-v-6eb20b78>`);
          } else {
            _push(`<div class="bg-white rounded-lg p-8 text-center" data-v-6eb20b78>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: getFileIcon(selectedAttachment.value.mime_type),
              class: "h-16 w-16 mx-auto mb-4 text-gray-400"
            }, null, _parent));
            _push(`<p class="text-lg font-medium text-gray-900 mb-2" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(selectedAttachment.value.filename)}</p><p class="text-gray-500 mb-4" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(formatFileSize)(selectedAttachment.value.size))}</p><button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" data-v-6eb20b78>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:download",
              class: "h-4 w-4 mr-2"
            }, null, _parent));
            _push(` Download </button></div>`);
          }
          if (hasPreviousAttachment.value) {
            _push(`<div class="absolute inset-y-0 left-0 flex items-center" data-v-6eb20b78><button class="bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white" data-v-6eb20b78>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:chevron-left",
              class: "h-6 w-6"
            }, null, _parent));
            _push(`</button></div>`);
          } else {
            _push(`<!---->`);
          }
          if (hasNextAttachment.value) {
            _push(`<div class="absolute inset-y-0 right-0 flex items-center" data-v-6eb20b78><button class="bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white" data-v-6eb20b78>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:chevron-right",
              class: "h-6 w-6"
            }, null, _parent));
            _push(`</button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showAddMemberPopup.value) {
        _push(`<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" data-v-6eb20b78><div class="bg-white rounded-lg p-5 max-w-md w-full shadow-lg" data-v-6eb20b78><div class="flex justify-between items-center mb-4" data-v-6eb20b78><h2 class="text-lg font-semibold text-black" data-v-6eb20b78>Add Members</h2><button class="p-1 rounded-full hover:bg-gray-100" data-v-6eb20b78>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "lucide:x",
          class: "text-gray-500",
          size: "20"
        }, null, _parent));
        _push(`</button></div><div class="relative mb-4" data-v-6eb20b78>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "lucide:search",
          class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",
          size: "18"
        }, null, _parent));
        _push(`<input type="text" placeholder="Search friends..."${serverRenderer_cjs_prodExports.ssrRenderAttr("value", searchQuery.value)} class="w-full pl-10 pr-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-6eb20b78></div><div class="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded-lg" data-v-6eb20b78>`);
        if (filteredFriends.value.length === 0) {
          _push(`<div class="p-4 text-center text-gray-500" data-v-6eb20b78> No friends found </div>`);
        } else {
          _push(`<!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(filteredFriends.value, (friend) => {
            _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass(`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 ${friend.selected ? "bg-blue-50" : ""}`)}" data-v-6eb20b78><div class="flex items-center" data-v-6eb20b78><div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex items-center justify-center" data-v-6eb20b78>`);
            if (friend.avatar) {
              _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", friend.avatar)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", friend.name)} class="h-full w-full object-cover" data-v-6eb20b78>`);
            } else {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                name: "fa:user",
                class: "h-5 w-5 text-gray-500"
              }, null, _parent));
            }
            _push(`</div><div data-v-6eb20b78><p class="font-medium text-sm text-black" data-v-6eb20b78>${serverRenderer_cjs_prodExports.ssrInterpolate(friend.name)}</p><p class="text-gray-700 text-xs" data-v-6eb20b78>@${serverRenderer_cjs_prodExports.ssrInterpolate(friend.username)}</p></div></div>`);
            if (friend.selected) {
              _push(`<div class="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center" data-v-6eb20b78>`);
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                name: "fa:check",
                class: "h-3 w-3 text-white"
              }, null, _parent));
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]-->`);
        }
        _push(`</div><div class="flex justify-end space-x-2" data-v-6eb20b78><button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50" data-v-6eb20b78> Cancel </button><button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(!friends.value.some((friend) => friend.selected)) ? " disabled" : ""} data-v-6eb20b78> Add to Group </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/GroupInfoPanel.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const GroupInfoPanel = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-6eb20b78"]]);
const _sfc_main$6 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "GroupMessageItem",
  __ssrInlineRender: true,
  props: {
    message: {}
  },
  emits: ["retryClick", "editClick", "deleteClick"],
  setup(__props, { emit: __emit }) {
    var _a;
    const props = __props;
    const showActions = vueExports.ref(false);
    vueExports.ref(null);
    const actionLoading = vueExports.ref(false);
    const messageClasses = vueExports.computed(() => {
      const baseClasses = "relative p-3 sm:p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md max-w-full break-words";
      if (isDefinitelyCurrentUser.value) {
        return `${baseClasses} bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-auto`;
      }
      return `${baseClasses} bg-white border border-gray-200 hover:border-gray-300`;
    });
    const getMessageBubbleClasses = vueExports.computed(() => {
      let classes = messageClasses.value;
      if (props.message.pending) {
        classes += " opacity-75 cursor-not-allowed";
      }
      if (props.message.failed) {
        classes += " border-red-300 bg-red-50";
      }
      if (props.message.isEdited) {
        classes += " border-l-4 border-l-yellow-400";
      }
      return classes;
    });
    const getMessageStatus = vueExports.computed(() => {
      if (props.message.pending) return "pending";
      if (props.message.failed) return "failed";
      if (props.message.retrying) return "retrying";
      if (props.message.read) return "read";
      if (props.message.delivered) return "delivered";
      return "sent";
    });
    const getMessageTitle = vueExports.computed(() => {
      const timestamp = formatTimestamp(props.message.timestamp);
      const status = getMessageStatus.value;
      let title = `Sent ${timestamp}`;
      if (props.message.isEdited) {
        title += " (edited)";
      }
      if (status !== "sent") {
        title += ` \u2022 Status: ${status}`;
      }
      return title;
    });
    const showMessageActions = vueExports.computed(() => {
      return isDefinitelyCurrentUser.value && !props.message.pending && !props.message.isDeleted;
    });
    const senderOnlineStatus = vueExports.computed(() => {
      return props.message.sender.status === "online";
    });
    const isDefinitelyCurrentUser = vueExports.computed(() => {
      var _a2;
      return props.message.isCurrentUser === true || props.message.sender.name === "You" || props.message._isOptimisticMessage === true || ((_a2 = props.message.id) == null ? void 0 : _a2.startsWith("temp-"));
    });
    const formatTimestamp = (timestamp) => {
      if (!timestamp) return "";
      return formatMessageTimestamp({ timestamp, format: "time" });
    };
    const messageContentClasses = vueExports.computed(() => {
      const baseClasses = "text-sm break-words whitespace-pre-wrap leading-relaxed";
      if (props.message.isDeleted) {
        return `${baseClasses} italic text-gray-500`;
      }
      if (props.message.failed) {
        return `${baseClasses} text-red-700`;
      }
      return baseClasses;
    });
    const getFileIcon = (attachment) => {
      if (attachment.type === "image") return "fa:image";
      const name = attachment.name.toLowerCase();
      const ext = name.split(".").pop() || "";
      if (["pdf"].includes(ext)) return "fa:file-pdf";
      if (["doc", "docx"].includes(ext)) return "fa:file-word";
      if (["xls", "xlsx"].includes(ext)) return "fa:file-excel";
      if (["ppt", "pptx"].includes(ext)) return "fa:file-powerpoint";
      if (["zip", "rar", "7z"].includes(ext)) return "fa:file-archive";
      if (["mp3", "wav", "ogg"].includes(ext)) return "fa:music";
      if (["mp4", "avi", "mov"].includes(ext)) return "fa:video";
      if (["txt"].includes(ext)) return "fa:file-text";
      return "fa:file";
    };
    console.log(
      `\u{1F7E2} DETAILED: Rendering message in GroupMessageItem ID ${props.message.id}:`,
      {
        content: props.message.content,
        isCurrentUser: props.message.isCurrentUser,
        forcedIsCurrentUser: isDefinitelyCurrentUser.value,
        senderName: props.message.sender.name,
        senderId: props.message.sender.id,
        messageId: props.message.id,
        isOptimistic: props.message._isOptimisticMessage,
        isTemp: (_a = props.message.id) == null ? void 0 : _a.startsWith("temp-"),
        allMessageProps: Object.keys(props.message),
        showActions: showActions.value
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h;
      const _component_OptimizedAvatar = __nuxt_component_0;
      const _component_Icon = _sfc_main$6$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        key: _ctx.message.id,
        class: `flex ${isDefinitelyCurrentUser.value ? "justify-end" : "justify-start"} mb-3 sm:mb-4 group message-item transition-all duration-200`,
        "data-message-id": _ctx.message.id,
        "data-is-current": isDefinitelyCurrentUser.value ? "true" : "false",
        "data-message-status": getMessageStatus.value
      }, _attrs))} data-v-2ff1d7b6>`);
      if (!isDefinitelyCurrentUser.value) {
        _push(`<div class="mr-2 sm:mr-3 flex-shrink-0" data-v-2ff1d7b6><div class="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ring-2 ring-white shadow-sm transition-all duration-200 hover:ring-gray-300" data-v-2ff1d7b6>`);
        if ((_a2 = _ctx.message.sender) == null ? void 0 : _a2.avatar) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_OptimizedAvatar, {
            src: _ctx.message.sender.avatar,
            alt: ((_b = _ctx.message.sender) == null ? void 0 : _b.name) || "User",
            size: "sm",
            class: "w-full h-full object-cover sm:hidden"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if ((_c = _ctx.message.sender) == null ? void 0 : _c.avatar) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_OptimizedAvatar, {
            src: _ctx.message.sender.avatar,
            alt: ((_d = _ctx.message.sender) == null ? void 0 : _d.name) || "User",
            size: "md",
            class: "w-full h-full object-cover hidden sm:block"
          }, null, _parent));
        } else {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:user",
            class: "h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
          }, null, _parent));
        }
        _push(`</div>`);
        if (senderOnlineStatus.value) {
          _push(`<div class="w-3 h-3 bg-green-400 border-2 border-white rounded-full -mt-2 ml-6 sm:ml-7" data-v-2ff1d7b6></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col max-w-[85%] sm:max-w-[75%] min-w-0 flex-1" data-v-2ff1d7b6>`);
      if (!isDefinitelyCurrentUser.value) {
        _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass(`text-xs text-gray-600 mb-1 font-medium ml-1 transition-colors duration-200 hover:text-gray-800`)}" data-v-2ff1d7b6>${serverRenderer_cjs_prodExports.ssrInterpolate(((_e = _ctx.message.sender) == null ? void 0 : _e.name) || "Unknown User")} `);
        if ((_f = _ctx.message.sender) == null ? void 0 : _f.role) {
          _push(`<span class="ml-1 text-gray-400 lowercase" data-v-2ff1d7b6> \u2022 ${serverRenderer_cjs_prodExports.ssrInterpolate(_ctx.message.sender.role)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if ((_g = _ctx.message.sender) == null ? void 0 : _g.customTitle) {
          _push(`<span class="ml-1 text-blue-500 text-xs" data-v-2ff1d7b6> \u2022 ${serverRenderer_cjs_prodExports.ssrInterpolate(_ctx.message.sender.customTitle)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass(getMessageBubbleClasses.value)}"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", getMessageTitle.value)}${serverRenderer_cjs_prodExports.ssrRenderAttr("data-testid", `message-${_ctx.message.id}`)} data-v-2ff1d7b6>`);
      if (_ctx.message.pending || _ctx.message.retrying) {
        _push(`<div class="absolute inset-0 bg-black bg-opacity-10 rounded-2xl flex items-center justify-center backdrop-blur-sm" data-v-2ff1d7b6><div class="bg-white rounded-full p-1.5 shadow-lg" data-v-2ff1d7b6><div class="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent" data-v-2ff1d7b6></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showMessageActions.value) {
        _push(`<div class="absolute -top-2 -right-2 z-20" data-v-2ff1d7b6><div class="opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-100 scale-95" data-v-2ff1d7b6><button class="bg-white text-gray-600 hover:text-gray-800 p-2 rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-xl"${serverRenderer_cjs_prodExports.ssrRenderAttr(
          "aria-label",
          "Message actions for " + (((_h = _ctx.message.sender) == null ? void 0 : _h.name) || "message")
        )} data-v-2ff1d7b6>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:ellipsis-v",
          class: "h-3.5 w-3.5"
        }, null, _parent));
        _push(`</button>`);
        if (showActions.value) {
          _push(`<div class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden animate-slideDown" data-v-2ff1d7b6><div class="py-2" data-v-2ff1d7b6><button class="w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center transition-all duration-200 group/action"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(actionLoading.value) ? " disabled" : ""} data-v-2ff1d7b6><div class="p-1.5 rounded-lg bg-blue-100 mr-3 group-hover/action:bg-blue-200 transition-colors" data-v-2ff1d7b6>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:pencil-alt",
            class: "h-3.5 w-3.5 text-blue-600"
          }, null, _parent));
          _push(`</div><span class="font-medium" data-v-2ff1d7b6>Edit message</span></button><button class="w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center transition-all duration-200 group/action"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(actionLoading.value) ? " disabled" : ""} data-v-2ff1d7b6><div class="p-1.5 rounded-lg bg-red-100 mr-3 group-hover/action:bg-red-200 transition-colors" data-v-2ff1d7b6>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:trash",
            class: "h-3.5 w-3.5 text-red-600"
          }, null, _parent));
          _push(`</div><span class="font-medium" data-v-2ff1d7b6>Delete message</span></button><button class="w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center transition-all duration-200 group/action"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(actionLoading.value) ? " disabled" : ""} data-v-2ff1d7b6><div class="p-1.5 rounded-lg bg-gray-100 mr-3 group-hover/action:bg-gray-200 transition-colors" data-v-2ff1d7b6>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:copy",
            class: "h-3.5 w-3.5 text-gray-600"
          }, null, _parent));
          _push(`</div><span class="font-medium" data-v-2ff1d7b6>Copy text</span></button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.message.attachment) {
        _push(`<div class="mb-3 rounded-lg overflow-hidden border border-gray-200" data-v-2ff1d7b6>`);
        if (_ctx.message.attachment.type === "image") {
          _push(`<div class="relative" data-v-2ff1d7b6><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", _ctx.message.attachment.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", _ctx.message.attachment.name)} class="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity" data-v-2ff1d7b6><div class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded" data-v-2ff1d7b6>${serverRenderer_cjs_prodExports.ssrInterpolate(_ctx.message.attachment.size)}</div></div>`);
        } else {
          _push(`<div class="flex items-center p-3 bg-gray-50" data-v-2ff1d7b6>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: getFileIcon(_ctx.message.attachment),
            class: "h-8 w-8 text-gray-600 mr-3"
          }, null, _parent));
          _push(`<div class="flex-1 min-w-0" data-v-2ff1d7b6><p class="text-sm font-medium text-gray-900 truncate" data-v-2ff1d7b6>${serverRenderer_cjs_prodExports.ssrInterpolate(_ctx.message.attachment.name)}</p><p class="text-xs text-gray-500" data-v-2ff1d7b6>${serverRenderer_cjs_prodExports.ssrInterpolate(_ctx.message.attachment.size)}</p></div><button class="ml-3 p-2 text-gray-500 hover:text-blue-500 transition-colors" data-v-2ff1d7b6>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:download",
            class: "h-4 w-4"
          }, null, _parent));
          _push(`</button></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass(messageContentClasses.value)}" data-v-2ff1d7b6>`);
      if (_ctx.message.isDeleted) {
        _push(`<span class="italic text-gray-500 flex items-center" data-v-2ff1d7b6>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:ban",
          class: "h-3 w-3 mr-1.5 opacity-60"
        }, null, _parent));
        _push(` This message was deleted </span>`);
      } else if (_ctx.message.failed) {
        _push(`<span class="text-red-700 flex items-center" data-v-2ff1d7b6>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:exclamation-triangle",
          class: "h-3 w-3 mr-1.5"
        }, null, _parent));
        _push(` Failed to send </span>`);
      } else {
        _push(`<!--[-->${serverRenderer_cjs_prodExports.ssrInterpolate(_ctx.message.content)}<!--]-->`);
      }
      _push(`</div><div class="flex items-center justify-between mt-2.5 min-h-[16px]" data-v-2ff1d7b6><div class="flex items-center space-x-2" data-v-2ff1d7b6>`);
      if (_ctx.message.isEdited && !_ctx.message.isDeleted) {
        _push(`<span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 font-medium" data-v-2ff1d7b6>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:edit",
          class: "h-2.5 w-2.5 mr-1"
        }, null, _parent));
        _push(` edited </span>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.message.reactions && _ctx.message.reactions.length > 0) {
        _push(`<div class="flex items-center space-x-1" data-v-2ff1d7b6><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(_ctx.message.reactions, (reaction) => {
          _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "bg-blue-100 text-blue-700": reaction.hasReacted }, "inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"])}" data-v-2ff1d7b6><span class="mr-1" data-v-2ff1d7b6>${serverRenderer_cjs_prodExports.ssrInterpolate(reaction.emoji)}</span><span class="font-medium" data-v-2ff1d7b6>${serverRenderer_cjs_prodExports.ssrInterpolate(reaction.count)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center space-x-1.5 text-xs" data-v-2ff1d7b6><span class="${serverRenderer_cjs_prodExports.ssrRenderClass(`font-medium ${isDefinitelyCurrentUser.value ? "text-blue-100" : "text-gray-500"}`)}" data-v-2ff1d7b6>${serverRenderer_cjs_prodExports.ssrInterpolate(formatTimestamp(_ctx.message.timestamp))}</span>`);
      if (isDefinitelyCurrentUser.value) {
        _push(`<div class="flex items-center" data-v-2ff1d7b6>`);
        if (_ctx.message.pending) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:clock",
            class: "h-3 w-3 opacity-60 animate-pulse",
            title: "Sending..."
          }, null, _parent));
        } else if (_ctx.message.retrying) {
          _push(`<div class="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent opacity-60" title="Retrying..." data-v-2ff1d7b6></div>`);
        } else if (_ctx.message.failed) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:exclamation-triangle",
            class: "h-3 w-3 text-red-400",
            title: "Failed to send"
          }, null, _parent));
        } else if (_ctx.message.read) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:check-double",
            class: "h-3 w-3 text-blue-400",
            title: "Read"
          }, null, _parent));
        } else if (_ctx.message.delivered) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:check-double",
            class: "h-3 w-3 opacity-60",
            title: "Delivered"
          }, null, _parent));
        } else if (!_ctx.message.pending && !_ctx.message.failed && !_ctx.message.retrying) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:check",
            class: "h-3 w-3 opacity-50",
            title: "Sent"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (_ctx.message.failed && isDefinitelyCurrentUser.value) {
        _push(`<div class="mt-2 flex justify-end" data-v-2ff1d7b6><button class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(_ctx.message.retrying) ? " disabled" : ""} data-v-2ff1d7b6>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: _ctx.message.retrying ? "fa:spinner" : "fa:redo",
          class: `h-3 w-3 mr-1.5 ${_ctx.message.retrying ? "animate-spin" : ""}`
        }, null, _parent));
        _push(` ${serverRenderer_cjs_prodExports.ssrInterpolate(_ctx.message.retrying ? "Retrying..." : "Try again")}</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/GroupMessageItem.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const GroupMessageItem = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-2ff1d7b6"]]);
function useWebSocketListener() {
  const activeListeners = vueExports.ref([]);
  function listenToWSEvent(eventName, callback) {
    activeListeners.value.push({ event: eventName, callback });
    eventBus.on(eventName, callback);
    console.log(
      `[WebSocketListener] Registered listener for event: ${eventName}`
    );
  }
  function listenToNewMessages(callback, options = {}) {
    const debounceMs = options.debounceMs || 250;
    const groupSimilar = options.groupSimilar !== false;
    const recentMessageIds = /* @__PURE__ */ new Set();
    const messageQueue = [];
    let debounceTimer = null;
    const processQueue = () => {
      if (messageQueue.length === 0) return;
      if (groupSimilar && messageQueue.length > 1) {
        callback(messageQueue);
        messageQueue.length = 0;
      } else {
        const message = messageQueue.shift();
        if (message) callback(message);
      }
      if (messageQueue.length > 0) {
        debounceTimer = setTimeout(processQueue, debounceMs);
      } else {
        debounceTimer = null;
      }
    };
    const directMessageHandler = (message) => {
      if (message.id && recentMessageIds.has(message.id)) {
        return;
      }
      if (message.id) {
        recentMessageIds.add(message.id);
        setTimeout(() => recentMessageIds.delete(message.id), 1e4);
      }
      messageQueue.push(message);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(processQueue, debounceMs);
    };
    const newMessageHandler = (message) => {
      messageQueue.push(message);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(processQueue, debounceMs);
    };
    const tempMessageHandler = (message) => {
      messageQueue.push(message);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(processQueue, debounceMs);
    };
    listenToWSEvent("private-message", directMessageHandler);
    listenToWSEvent("new-message-received", newMessageHandler);
    listenToWSEvent("temp-message-replaced", tempMessageHandler);
  }
  function cleanupListeners() {
    activeListeners.value.forEach(({ event, callback }) => {
      eventBus.off(event, callback);
    });
    activeListeners.value = [];
    console.log("[WebSocketListener] Cleaned up all listeners");
  }
  return {
    listenToWSEvent,
    listenToNewMessages,
    cleanupListeners,
    activeListenersCount: () => activeListeners.value.length
  };
}
const FETCH_DEBOUNCE_TIME = 5e3;
const _sfc_main$5 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "GroupChatArea",
  __ssrInlineRender: true,
  props: {
    groupId: {},
    groupName: {},
    groupMessages: {}
  },
  setup(__props) {
    const presence = usePresence();
    useWebSocketListener();
    const { $toast } = useNuxtApp();
    const props = __props;
    const groupsStore = useGroupsStore();
    const authStore = useAuthStore();
    const messagesStore = useMessagesStore();
    const inputMessage = vueExports.ref("");
    const editingMessageId = vueExports.ref(null);
    const showDropdown = vueExports.ref(null);
    const showSearch = vueExports.ref(false);
    const showInfo = vueExports.ref(false);
    const isAttachmentMenuOpen = vueExports.ref(false);
    const searchQuery = vueExports.ref("");
    const isSearching = vueExports.ref(false);
    const filteredMessages = vueExports.ref([]);
    const selectedMembers = vueExports.ref([]);
    const isLoading = vueExports.ref(false);
    const isSending = vueExports.ref(false);
    const isLoadingMore = vueExports.ref(false);
    const uploadProgress = vueExports.ref([]);
    const isUploading = vueExports.ref(false);
    const lastFetchTime = vueExports.ref(0);
    const recentWebSocketActivity = vueExports.ref(false);
    vueExports.ref(null);
    const messagesEndRef = vueExports.ref(null);
    vueExports.ref(null);
    vueExports.ref(null);
    vueExports.ref(null);
    const messages = vueExports.ref([]);
    const currentUser = vueExports.computed(() => authStore.user);
    const currentGroup = vueExports.computed(() => groupsStore.currentGroup);
    const groupMembers = vueExports.computed(() => {
      return groupsStore.groupMembers.map((member) => {
        var _a;
        let displayName = member.extracted_name || member.display_name || "Unknown User";
        console.log(
          `\u{1F4CA} [GroupChatArea] Member ${member.id} processed name: "${displayName}"`,
          {
            extracted_name: member.extracted_name,
            display_name: member.display_name,
            first_name: member.first_name,
            last_name: member.last_name,
            user: member.user
          }
        );
        return {
          ...member,
          name: displayName,
          status: "offline",
          avatar: member.avatar_url || ((_a = member.user) == null ? void 0 : _a.profile_picture_url)
        };
      });
    });
    const storeMessages = vueExports.computed(() => groupsStore.groupMessages);
    const memberCount = vueExports.computed(() => {
      var _a;
      const actualMembersCount = groupMembers.value.length;
      const apiMemberCount = ((_a = currentGroup.value) == null ? void 0 : _a.member_count) || 0;
      return actualMembersCount > 0 ? actualMembersCount : apiMemberCount;
    });
    const currentGroupForProfile = vueExports.computed(() => {
      if (!currentGroup.value) {
        return {
          id: "",
          name: "",
          description: "No description available",
          createdAt: "",
          memberCount: 0,
          members: []
        };
      }
      console.log(`\u{1F4CA} [GroupChatArea] Formatting group profile data:`, {
        groupMembersLength: groupMembers.value.length,
        groupMembers: groupMembers.value,
        currentGroup: currentGroup.value
      });
      const mappedMembers = groupMembers.value.map((member) => {
        var _a, _b, _c, _d, _e, _f, _g;
        let displayName = "Unknown User";
        const firstName = member.first_name || ((_a = member.user) == null ? void 0 : _a.first_name);
        const lastName = member.last_name || ((_b = member.user) == null ? void 0 : _b.last_name);
        if (firstName && lastName) {
          displayName = `${firstName} ${lastName}`.trim();
        } else if (firstName) {
          displayName = firstName;
        } else if (member.full_name) {
          displayName = member.full_name;
        } else if ((_c = member.user) == null ? void 0 : _c.name) {
          displayName = member.user.name;
        } else if (member.username) {
          displayName = member.username;
        }
        const memberData = {
          id: member.id || member.user_id,
          name: displayName,
          status: "online",
          role: member.is_owner ? "admin" : "member",
          avatar: member.avatar_url || ((_d = member.user) == null ? void 0 : _d.profile_picture_url),
          isBlocked: false,
          user_id: member.id || member.user_id,
          group_id: ((_e = currentGroup.value) == null ? void 0 : _e.id) || "",
          joined_at: member.joined_at || "",
          // Include API response fields
          first_name: member.first_name || ((_f = member.user) == null ? void 0 : _f.first_name),
          last_name: member.last_name || ((_g = member.user) == null ? void 0 : _g.last_name),
          full_name: member.full_name,
          username: member.username,
          avatar_url: member.avatar_url,
          is_owner: member.is_owner,
          user: member.user
        };
        console.log(`\u{1F4CA} [GroupChatArea] Mapped member:`, {
          original: member,
          mapped: memberData,
          constructedName: displayName
        });
        return memberData;
      });
      return {
        id: currentGroup.value.id || "",
        name: currentGroup.value.name || "",
        description: currentGroup.value.description || "No description available",
        createdAt: currentGroup.value.created_at || "",
        memberCount: memberCount.value,
        members: mappedMembers,
        avatar: currentGroup.value.avatar_url,
        avatar_url: currentGroup.value.avatar_url,
        created_at: currentGroup.value.created_at,
        updated_at: currentGroup.value.updated_at,
        member_count: currentGroup.value.member_count,
        last_message: currentGroup.value.last_message
      };
    });
    const canLoadMoreMessages = vueExports.computed(() => {
      return groupsStore.messagesPagination.has_more_pages;
    });
    async function loadGroupData() {
      isLoading.value = true;
      try {
        await Promise.all([
          groupsStore.getGroupDetails(props.groupId),
          groupsStore.getGroupMembers(props.groupId),
          fetchGroupMessages()
        ]);
      } catch (error) {
        if ($toast) {
          $toast.error("Failed to load group data");
        }
      } finally {
        isLoading.value = false;
      }
    }
    function processMessages() {
      var _a;
      (_a = currentUser.value) == null ? void 0 : _a.id;
      if (!storeMessages.value || storeMessages.value.length === 0) {
        return;
      }
      messages.value = storeMessages.value.map((message) => {
        const isCurrentUser = isCurrentUserMessage(message);
        return {
          ...message,
          isCurrentUser
        };
      });
    }
    const isCurrentUserMessage = (message) => {
      var _a, _b;
      const currentUserId = (_a = currentUser.value) == null ? void 0 : _a.id;
      if (!currentUserId) return false;
      const senderId = message.sender_id || ((_b = message.sender) == null ? void 0 : _b.id) || message.from_id || message.user_id;
      if (!senderId) {
        if (message.id && (message.id.startsWith("temp-") || message.id.startsWith("msg-") || message.id.startsWith("ws-"))) {
          return true;
        }
        if (typeof message.isCurrentUser === "boolean") {
          return message.isCurrentUser;
        }
      }
      return senderId === currentUserId;
    };
    const saveToSessionStorage = (messagesToSave) => {
      if (!messagesToSave || messagesToSave.length === 0) {
        return;
      }
      try {
        const conversationKey = `group_chat_${props.groupId}`;
        const optimizedMessages = messagesToSave.map((msg) => ({
          id: msg.id,
          message_id: msg.message_id,
          temp_id: msg.temp_id,
          content: msg.content,
          type: msg.type,
          sender_id: msg.sender_id,
          group_id: msg.group_id,
          timestamp: msg.timestamp,
          raw_timestamp: msg.raw_timestamp,
          sent_at: msg.sent_at,
          created_at: msg.created_at,
          updated_at: msg.updated_at,
          isCurrentUser: msg.isCurrentUser,
          isEdited: msg.isEdited,
          isDeleted: msg.isDeleted,
          attachment: msg.attachment,
          pending: msg.pending,
          failed: msg.failed,
          // Retain minimal sender info
          sender: msg.sender ? {
            id: msg.sender.id,
            name: msg.sender.name,
            avatar: msg.sender.avatar
          } : void 0
        }));
        sessionStorage.setItem(conversationKey, JSON.stringify(optimizedMessages));
        console.log(
          `\u{1F4BE} [GroupChatArea] Saved ${optimizedMessages.length} messages to session storage for group ${props.groupId}`
        );
      } catch (error) {
        console.error(
          "\u274C [GroupChatArea] Failed to save messages to session storage:",
          error
        );
        if (error instanceof DOMException && error.name === "QuotaExceededError") {
          try {
            const reducedMessages = messagesToSave.slice(-50).map((msg) => ({
              id: msg.id,
              content: msg.content,
              sender_id: msg.sender_id,
              timestamp: msg.timestamp,
              isCurrentUser: msg.isCurrentUser,
              type: msg.type,
              group_id: msg.group_id
            }));
            const conversationKey = `group_chat_${props.groupId}_reduced`;
            sessionStorage.setItem(
              conversationKey,
              JSON.stringify(reducedMessages)
            );
            console.log(
              `\u{1F4BE} [GroupChatArea] Saved ${reducedMessages.length} reduced messages to session storage`
            );
          } catch (secondError) {
            console.error(
              "\u274C [GroupChatArea] Failed to save even reduced messages:",
              secondError
            );
          }
        }
      }
    };
    const validateMessageBubbles = () => {
      let fixedCount = 0;
      messages.value = messages.value.map((msg) => {
        const correctIsCurrentUser = isCurrentUserMessage(msg);
        if (msg.isCurrentUser !== correctIsCurrentUser) {
          fixedCount++;
          return {
            ...msg,
            isCurrentUser: correctIsCurrentUser
          };
        }
        return msg;
      });
      return fixedCount;
    };
    async function fetchGroupMessages(page = 1, limit = 20) {
      var _a;
      const startTime = performance.now();
      console.log(
        `\u{1F504} [GroupChatArea] Fetching messages for group ${props.groupId}, page ${page}`
      );
      if (page === 1 && recentWebSocketActivity.value) {
        const timeSinceLastFetch = Date.now() - lastFetchTime.value;
        if (timeSinceLastFetch < FETCH_DEBOUNCE_TIME) {
          console.log(
            `\u23F8\uFE0F [GroupChatArea] Skipping API fetch due to recent WebSocket activity (${timeSinceLastFetch}ms ago)`
          );
          return { data: [] };
        }
      }
      lastFetchTime.value = Date.now();
      try {
        const data = await groupsStore.getGroupMessages(props.groupId, page, limit);
        if ((data == null ? void 0 : data.data) && data.data.length > 0) {
          console.log("\u{1F4E9} [GroupChatArea] API Message Format:", {
            firstMsgId: data.data[0].id || data.data[0].message_id,
            messageCount: data.data.length,
            fields: Object.keys(data.data[0])
          });
        } else {
          console.log("\u{1F4E9} [GroupChatArea] No messages returned from API");
        }
        const userId = (_a = currentUser.value) == null ? void 0 : _a.id;
        const processedMessages = (data.data || []).map((message) => {
          var _a2, _b, _c, _d, _e;
          try {
            const id = message.id || message.message_id;
            const senderId = message.sender_id || ((_a2 = message.sender) == null ? void 0 : _a2.id);
            let senderName = "Unknown User";
            if (senderId) {
              const member = groupMembers.value.find(
                (m) => m.user_id === senderId || m.id === senderId
              );
              if (member) {
                senderName = member.name;
                console.log(
                  `\u{1F4DD} [GroupChatArea] Found member name for ${senderId}: "${senderName}"`
                );
              } else {
                if ((_b = message.sender) == null ? void 0 : _b.name) {
                  senderName = message.sender.name;
                } else if (message.sender_name) {
                  senderName = message.sender_name;
                } else if (senderId === userId) {
                  senderName = ((_c = currentUser.value) == null ? void 0 : _c.name) || "You";
                }
                console.log(
                  `\u26A0\uFE0F [GroupChatArea] Member not found for ${senderId}, using fallback: "${senderName}"`
                );
              }
            }
            const senderInfo = {
              id: senderId,
              name: senderName,
              avatar: (_d = message.sender) == null ? void 0 : _d.avatar
            };
            const sentAt = message.sent_at || message.created_at;
            const createdAt = message.created_at || message.sent_at;
            const timestampForDisplay = sentAt || createdAt;
            let formattedTimestamp = "";
            if (timestampForDisplay) {
              try {
                const date = new Date(timestampForDisplay);
                if (!isNaN(date.getTime())) {
                  formattedTimestamp = date.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                  });
                }
              } catch (e) {
                console.warn("Error formatting timestamp:", e);
              }
            }
            const processedMessage = {
              ...message,
              // Ensure ID field consistency
              id,
              message_id: id,
              // Set message_id for consistency
              // Normalize sender info with proper name
              sender: senderInfo,
              // Mark messages from current user
              isCurrentUser: senderId === userId,
              // Add consistent timestamp fields
              sent_at: sentAt,
              created_at: createdAt,
              // Add raw_timestamp for consistent sorting and date parsing
              raw_timestamp: sentAt || createdAt,
              // Add properly formatted timestamp for display
              timestamp: formattedTimestamp,
              // Source tracking for debugging
              sourceApi: true
            };
            console.log(`\u{1F4E9} [GroupChatArea] Processed message:`, {
              id: processedMessage.id,
              senderId,
              senderName,
              isCurrentUser: processedMessage.isCurrentUser,
              content: (_e = processedMessage.content) == null ? void 0 : _e.substring(0, 30)
            });
            return processedMessage;
          } catch (err) {
            console.error("\u26A0\uFE0F [GroupChatArea] Error processing message:", err);
            return {
              id: message.id || message.message_id || `error-${Date.now()}`,
              content: message.content || "Error displaying message",
              sender: {
                id: message.sender_id || "unknown",
                name: "Unknown User"
              },
              isCurrentUser: false,
              hasProcessingError: true
            };
          }
        });
        if (page === 1) {
          console.log(
            `[GroupChatArea] Merging ${processedMessages.length} API messages with ${messages.value.length} existing messages`
          );
          const currentMessages = [...messages.value];
          const existingMessageIds = new Set(
            currentMessages.map((msg) => msg.id || msg.message_id).filter(Boolean)
          );
          const newApiMessages = processedMessages.filter((apiMsg) => {
            const apiMsgId = apiMsg.id || apiMsg.message_id;
            return !existingMessageIds.has(apiMsgId);
          });
          console.log(
            `[GroupChatArea] Filtered ${processedMessages.length} API messages to ${newApiMessages.length} new messages (${processedMessages.length - newApiMessages.length} duplicates removed)`
          );
          const recentWebSocketMessages = currentMessages.filter((currentMsg) => {
            var _a2;
            if (currentMsg.pending || ((_a2 = currentMsg.id) == null ? void 0 : _a2.startsWith("temp-"))) {
              console.log(
                `[GroupChatArea] Preserving pending/temp message: ${currentMsg.id}`
              );
              return true;
            }
            if (currentMsg.fromWebSocket || currentMsg.receivedViaWebSocket) {
              const currentMsgId = currentMsg.id || currentMsg.message_id;
              const isInApiResponse = processedMessages.some(
                (apiMsg) => (apiMsg.id || apiMsg.message_id) === currentMsgId
              );
              if (!isInApiResponse) {
                const timestamp = currentMsg.raw_timestamp || currentMsg.sent_at || currentMsg.created_at;
                if (timestamp) {
                  const msgTime = new Date(timestamp);
                  const timeDiff = Date.now() - msgTime.getTime();
                  if (timeDiff < 3e4) {
                    console.log(
                      `[GroupChatArea] Preserving recent WebSocket message: ${currentMsgId} (${timeDiff}ms ago)`
                    );
                    return true;
                  }
                }
              }
            }
            return false;
          });
          const mergedMessages = [...newApiMessages, ...recentWebSocketMessages];
          const uniqueMessages = mergedMessages.filter((msg, index, arr) => {
            const msgId = msg.id || msg.message_id;
            return arr.findIndex((m) => (m.id || m.message_id) === msgId) === index;
          });
          uniqueMessages.sort((a, b) => {
            const timeA = new Date(
              a.raw_timestamp || a.sent_at || a.created_at || 0
            ).getTime();
            const timeB = new Date(
              b.raw_timestamp || b.sent_at || b.created_at || 0
            ).getTime();
            return timeA - timeB;
          });
          console.log(
            `[GroupChatArea] Merged result: ${newApiMessages.length} new API + ${recentWebSocketMessages.length} WebSocket = ${uniqueMessages.length} unique total messages`
          );
          messages.value = uniqueMessages;
        } else {
          console.log(
            `[GroupChatArea] Adding ${processedMessages.length} older messages to existing ${messages.value.length}`
          );
          messages.value = [...processedMessages, ...messages.value];
        }
        if (data.pagination) {
          groupsStore.messagesPagination = data.pagination;
        }
        const fixedCount = validateMessageBubbles();
        if (fixedCount > 0) {
          console.log(
            `\u{1F6E0}\uFE0F [GroupChatArea] Fixed ${fixedCount} message bubble positions`
          );
        }
        const endTime = performance.now();
        console.log(
          `\u2705 [GroupChatArea] Fetched ${processedMessages.length} messages in ${(endTime - startTime).toFixed(2)}ms`
        );
        saveToSessionStorage(messages.value);
        return data;
      } catch (error) {
        console.error(`\u274C [GroupChatArea] Error fetching messages:`, error);
        if ($toast) {
          $toast.error("Failed to load messages");
        }
        throw error;
      }
    }
    vueExports.watch(
      () => props.groupId,
      async (newGroupId) => {
        if (newGroupId) {
          await loadGroupData();
          vueExports.nextTick(() => {
            if (messagesEndRef.value) {
              messagesEndRef.value.scrollIntoView();
            }
          });
        }
      },
      { immediate: true }
    );
    vueExports.watch(storeMessages, () => {
      processMessages();
      vueExports.nextTick(() => {
        if (messagesEndRef.value && messages.value.length > 0) {
          messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
    const displayMessages = vueExports.computed(() => {
      if (!messages.value || !Array.isArray(messages.value)) {
        console.warn("\u26A0\uFE0F [GroupChatArea] Invalid messages array:", messages.value);
        return [];
      }
      let messagesToDisplay = messages.value;
      if (isSearching.value) {
        messagesToDisplay = filteredMessages.value.filter((message) => {
          var _a;
          if (selectedMembers.value.length === 0) return true;
          return selectedMembers.value.includes(((_a = message.sender) == null ? void 0 : _a.id) || "");
        });
      }
      messagesToDisplay = messagesToDisplay.filter((msg) => {
        if (!msg || typeof msg !== "object") {
          console.warn("\u26A0\uFE0F [GroupChatArea] Filtered out invalid message:", msg);
          return false;
        }
        return true;
      });
      return messagesToDisplay.sort((a, b) => {
        const getTimestamp = (msg) => {
          var _a;
          try {
            if (msg.raw_timestamp && typeof msg.raw_timestamp === "string") {
              const rawDate = new Date(msg.raw_timestamp);
              if (!isNaN(rawDate.getTime())) {
                return rawDate.getTime();
              }
            }
            if (msg.sent_at) {
              const sentDate = new Date(msg.sent_at);
              if (!isNaN(sentDate.getTime())) {
                return sentDate.getTime();
              }
            }
            if (msg.created_at) {
              const createdDate = new Date(msg.created_at);
              if (!isNaN(createdDate.getTime())) {
                return createdDate.getTime();
              }
            }
            if ((_a = msg.id) == null ? void 0 : _a.startsWith("temp-")) {
              const parts = msg.id.split("-");
              if (parts.length > 1) {
                const possibleTs = parseInt(parts[1]);
                if (!isNaN(possibleTs)) return possibleTs;
              }
            }
            if (msg.timestamp && typeof msg.timestamp === "string" && msg.timestamp.includes("T")) {
              const timestampDate = new Date(msg.timestamp);
              if (!isNaN(timestampDate.getTime())) {
                return timestampDate.getTime();
              }
            }
            return Date.now();
          } catch (e) {
            console.warn("\u26A0\uFE0F [GroupChatArea] Error parsing message timestamp:", e);
            return Date.now();
          }
        };
        try {
          const timestampA = getTimestamp(a);
          const timestampB = getTimestamp(b);
          return timestampA - timestampB;
        } catch (e) {
          console.error("\u274C [GroupChatArea] Error sorting messages:", e);
          return 0;
        }
      });
    });
    const retryMessage = async (tempId, content) => {
      try {
        isSending.value = true;
        messages.value = messages.value.map((msg) => {
          if (msg.id === tempId) {
            return {
              ...msg,
              pending: true,
              failed: false,
              retrying: true,
              isCurrentUser: isCurrentUserMessage(msg)
              // Ensure correct user ownership
            };
          }
          return msg;
        });
        await groupsStore.sendGroupMessage(props.groupId, content);
        messages.value = messages.value.map((msg) => {
          if (msg.id === tempId) {
            return {
              ...msg,
              pending: false,
              failed: false,
              retrying: false
            };
          }
          return msg;
        });
        await fetchGroupMessages();
        saveToSessionStorage(messages.value);
        if ($toast) {
          $toast.success("Message sent successfully");
        }
      } catch (error) {
        messages.value = messages.value.map((msg) => {
          if (msg.id === tempId) {
            return {
              ...msg,
              pending: false,
              failed: true,
              retrying: false
            };
          }
          return msg;
        });
        if ($toast) {
          $toast.error("Failed to send message again");
        }
      } finally {
        isSending.value = false;
      }
    };
    function updateMembersStatus() {
      if (groupMembers.value.length > 0) {
        const userIds = groupMembers.value.map((member) => member.user_id);
        presence.getUsersStatus(userIds);
      }
    }
    function getMemberStatus(memberId) {
      return presence.getStatus(memberId) || "offline";
    }
    vueExports.watch(
      () => groupMembers.value,
      (newMembers) => {
        if (newMembers.length > 0 && presence.isWsConnected) {
          updateMembersStatus();
        }
      },
      { deep: true }
    );
    vueExports.watch(
      () => messages.value,
      (newMessages, oldMessages) => {
        const editedMessages = newMessages.filter((m) => m.isEdited);
        if (editedMessages.length > 0) {
          console.log(
            `[DEBUG] Messages with isEdited=true:`,
            editedMessages.map((m) => {
              var _a;
              return {
                id: m.id,
                content: (_a = m.content) == null ? void 0 : _a.substring(0, 30),
                isEdited: m.isEdited,
                updated_at: m.updated_at
              };
            })
          );
        }
      },
      { deep: true }
    );
    const handleEditMessage = (messageId) => {
      const message = messages.value.find((m) => m.id === messageId);
      if (message) {
        editingMessageId.value = messageId;
        inputMessage.value = message.content;
        showDropdown.value = null;
        vueExports.nextTick(() => {
          const inputElement = (void 0).querySelector("input.flex-1");
          if (inputElement instanceof HTMLInputElement) {
            inputElement.focus();
          }
        });
      }
    };
    const handleUnsendMessage = async (messageId) => {
      try {
        console.log(
          `[GroupChatArea] Attempting to delete message id: ${messageId}`
        );
        const messageToDelete = messages.value.find((msg) => msg.id === messageId);
        console.log(`[GroupChatArea] Message to delete:`, messageToDelete);
        const hasValidId = messageId && typeof messageId === "string" && messageId.length > 0;
        console.log(`[GroupChatArea] Message has valid ID: ${hasValidId}`);
        if (!hasValidId) {
          throw new Error("Invalid message ID for deletion");
        }
        const isTempMessage = messageId.startsWith("temp-");
        const realMessageId = isTempMessage && messageToDelete && messageToDelete.message_id ? messageToDelete.message_id : messageId;
        console.log(
          `[GroupChatArea] Using message ID for deletion: ${realMessageId} (${isTempMessage ? "temp message" : "regular message"})`
        );
        const isGroupMessage = true;
        const response = await messagesStore.deleteMessage(
          realMessageId,
          isGroupMessage
        );
        console.log(`[GroupChatArea] Delete response:`, response);
        if (!response) {
          throw new Error("Failed to delete message");
        }
        messages.value = messages.value.map((message) => {
          if (message.id === messageId || message.message_id && message.message_id === realMessageId) {
            return {
              ...message,
              content: "This message was unsent",
              isDeleted: true,
              isCurrentUser: isCurrentUserMessage(message)
              // Ensure correct user ownership
            };
          }
          return message;
        });
        if ($toast) {
          $toast.success("Message unsent successfully");
        }
        saveToSessionStorage(messages.value);
        showDropdown.value = null;
      } catch (error) {
        console.error(`[GroupChatArea] Error deleting message:`, error);
        if ($toast) {
          $toast.error("Failed to unsend message");
        }
      }
    };
    const clearSearch = () => {
      searchQuery.value = "";
      isSearching.value = false;
      filteredMessages.value = [];
      selectedMembers.value = [];
    };
    const handleAdvancedSearch = (query, memberIds = []) => {
      if (!query.trim() && memberIds.length === 0) {
        clearSearch();
        return;
      }
      isSearching.value = true;
      searchQuery.value = query;
      selectedMembers.value = memberIds;
      filteredMessages.value = messages.value.filter((message) => {
        var _a;
        const contentMatch = !query.trim() || message.content.toLowerCase().includes(query.toLowerCase());
        const memberMatch = memberIds.length === 0 || memberIds.includes(((_a = message.sender) == null ? void 0 : _a.id) || "");
        return contentMatch && memberMatch;
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_Icon = _sfc_main$6$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "h-full flex bg-gray-50" }, _attrs))} data-v-6c1ff8b1><div class="flex-1 flex flex-col h-full" data-v-6c1ff8b1><div class="px-4 sm:px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between" data-v-6c1ff8b1><div class="flex items-center min-w-0 flex-1" data-v-6c1ff8b1><div class="relative mr-3 flex-shrink-0" data-v-6c1ff8b1><div class="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ring-2 ring-white shadow-sm" data-v-6c1ff8b1>`);
      if ((_a = currentGroup.value) == null ? void 0 : _a.avatar_url) {
        _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", currentGroup.value.avatar_url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", (_b = currentGroup.value) == null ? void 0 : _b.name)} class="h-full w-full object-cover" data-v-6c1ff8b1>`);
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:users",
          class: "h-5 w-5 sm:h-6 sm:w-6 text-gray-500"
        }, null, _parent));
      }
      _push(`</div>`);
      if (memberCount.value > 1) {
        _push(`<div class="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full" data-v-6c1ff8b1></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="min-w-0 flex-1" data-v-6c1ff8b1><h2 class="font-semibold text-gray-800 text-lg truncate" data-v-6c1ff8b1>${serverRenderer_cjs_prodExports.ssrInterpolate(((_c = currentGroup.value) == null ? void 0 : _c.name) || "Loading...")}</h2><p class="text-xs sm:text-sm text-gray-500 truncate" data-v-6c1ff8b1>${serverRenderer_cjs_prodExports.ssrInterpolate(memberCount.value)} member${serverRenderer_cjs_prodExports.ssrInterpolate(memberCount.value !== 1 ? "s" : "")} `);
      if (groupMembers.value.filter(
        (m) => getMemberStatus(m.user_id) === "online"
      ).length > 0) {
        _push(`<span class="ml-1" data-v-6c1ff8b1> \xB7 ${serverRenderer_cjs_prodExports.ssrInterpolate(groupMembers.value.filter(
          (m) => getMemberStatus(m.user_id) === "online"
        ).length)} online </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p></div></div><div class="flex items-center space-x-1 sm:space-x-2 flex-shrink-0" data-v-6c1ff8b1>`);
      if (isLoading.value) {
        _push(`<div class="mr-2" data-v-6c1ff8b1><div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" data-v-6c1ff8b1></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200" title="Search in conversation" data-v-6c1ff8b1>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "fa:search",
        class: "h-4 w-4"
      }, null, _parent));
      _push(`</button><button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "bg-blue-50 text-blue-500": showInfo.value }, "p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200"])}" title="Group info" data-v-6c1ff8b1>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "fa:info-circle",
        class: "h-4 w-4"
      }, null, _parent));
      _push(`</button><button class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200" title="More options" data-v-6c1ff8b1>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "fa:ellipsis-v",
        class: "h-4 w-4"
      }, null, _parent));
      _push(`</button></div></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$8, {
        isOpen: showSearch.value,
        groupMembers: groupMembers.value,
        onClose: ($event) => showSearch.value = false,
        onSearch: handleAdvancedSearch
      }, null, _parent));
      _push(`<div class="flex-1 overflow-auto px-4 sm:px-6 py-4 space-y-4 relative bg-gray-50" data-v-6c1ff8b1>`);
      if (vueExports.unref(groupsStore).isLoading) {
        _push(`<div class="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 z-10 backdrop-blur-sm" data-v-6c1ff8b1><div class="flex flex-col items-center bg-white rounded-lg p-6 shadow-lg" data-v-6c1ff8b1><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3" data-v-6c1ff8b1></div><p class="text-sm font-medium text-gray-600" data-v-6c1ff8b1>Loading messages...</p></div></div>`);
      } else if (displayMessages.value.length === 0) {
        _push(`<div class="absolute inset-0 flex items-center justify-center" data-v-6c1ff8b1>`);
        if (isSearching.value) {
          _push(`<div class="text-center" data-v-6c1ff8b1><div class="mb-4" data-v-6c1ff8b1>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:search",
            class: "h-12 w-12 text-gray-300 mx-auto mb-3"
          }, null, _parent));
          _push(`<p class="text-gray-500 font-medium mb-1" data-v-6c1ff8b1> No matching messages found </p><p class="text-sm text-gray-400" data-v-6c1ff8b1> Try adjusting your search criteria </p></div><button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium" data-v-6c1ff8b1> Clear search </button></div>`);
        } else {
          _push(`<div class="text-center" data-v-6c1ff8b1><div class="mb-4" data-v-6c1ff8b1>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:comments",
            class: "h-12 w-12 text-gray-300 mx-auto mb-3"
          }, null, _parent));
          _push(`<p class="text-gray-500 font-medium mb-1" data-v-6c1ff8b1>No messages yet</p><p class="text-sm text-gray-400" data-v-6c1ff8b1> Start the conversation by sending a message </p></div></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (canLoadMoreMessages.value && displayMessages.value.length > 0) {
        _push(`<div class="text-center mb-6" data-v-6c1ff8b1><button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "opacity-50 cursor-not-allowed": isLoadingMore.value }, "inline-flex items-center px-4 py-2 text-sm bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 shadow-sm"])}"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isLoadingMore.value) ? " disabled" : ""} data-v-6c1ff8b1>`);
        if (isLoadingMore.value) {
          _push(`<div class="flex items-center" data-v-6c1ff8b1><div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2" data-v-6c1ff8b1></div> Loading... </div>`);
        } else {
          _push(`<span class="flex items-center" data-v-6c1ff8b1>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:chevron-up",
            class: "h-4 w-4 mr-2"
          }, null, _parent));
          _push(` Load earlier messages </span>`);
        }
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(displayMessages.value, (message) => {
        _push(`<div class="message-wrapper" data-v-6c1ff8b1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(GroupMessageItem, {
          message: {
            ...message,
            sender: message.sender || {
              id: message.sender_id || "unknown",
              name: "Unknown User",
              avatar: void 0,
              role: "member",
              status: "offline"
            },
            timestamp: message.timestamp || "",
            isCurrentUser: message.isCurrentUser ?? false
          },
          onEditClick: handleEditMessage,
          onDeleteClick: handleUnsendMessage,
          onRetryClick: (messageId) => retryMessage(messageId, message.content)
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--><div class="h-1" data-v-6c1ff8b1></div></div><div class="px-4 sm:px-6 py-4 bg-white border-t border-gray-200" data-v-6c1ff8b1>`);
      if (isUploading.value && uploadProgress.value.length > 0) {
        _push(`<div class="mb-3 bg-blue-50 rounded-lg p-3 border border-blue-200" data-v-6c1ff8b1><div class="text-sm font-medium text-blue-800 mb-3 flex items-center" data-v-6c1ff8b1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:cloud-upload",
          class: "h-4 w-4 mr-2"
        }, null, _parent));
        _push(` Uploading ${serverRenderer_cjs_prodExports.ssrInterpolate(uploadProgress.value.length)} file${serverRenderer_cjs_prodExports.ssrInterpolate(uploadProgress.value.length > 1 ? "s" : "")}... </div><div class="space-y-3" data-v-6c1ff8b1><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(uploadProgress.value, (progress) => {
          _push(`<div class="bg-white rounded-lg p-3 shadow-sm border border-gray-200" data-v-6c1ff8b1><div class="flex items-center justify-between mb-2" data-v-6c1ff8b1><div class="flex items-center space-x-2 flex-1 min-w-0" data-v-6c1ff8b1>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: progress.file.type.startsWith("image/") ? "fa:image" : "fa:file",
            class: "h-4 w-4 text-gray-500 flex-shrink-0"
          }, null, _parent));
          _push(`<span class="text-sm font-medium text-gray-900 truncate" data-v-6c1ff8b1>${serverRenderer_cjs_prodExports.ssrInterpolate(progress.file.name)}</span></div><div class="flex items-center space-x-2" data-v-6c1ff8b1><span class="text-xs text-gray-500" data-v-6c1ff8b1>${serverRenderer_cjs_prodExports.ssrInterpolate(progress.progress)}%</span><div class="w-4 h-4" data-v-6c1ff8b1>`);
          if (progress.status === "uploading") {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "svg-spinners:270-ring",
              class: "h-4 w-4 text-blue-500"
            }, null, _parent));
          } else if (progress.status === "success") {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:check-circle",
              class: "h-4 w-4 text-green-500"
            }, null, _parent));
          } else if (progress.status === "error") {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:times-circle",
              class: "h-4 w-4 text-red-500"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div><div class="w-full bg-gray-200 rounded-full h-2" data-v-6c1ff8b1><div style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: `${progress.progress}%` })}" class="${serverRenderer_cjs_prodExports.ssrRenderClass([{
            "bg-blue-500": progress.status === "uploading",
            "bg-green-500": progress.status === "success",
            "bg-red-500": progress.status === "error"
          }, "h-2 rounded-full transition-all duration-300"])}" data-v-6c1ff8b1></div></div>`);
          if (progress.error) {
            _push(`<div class="text-red-600 text-xs mt-2 flex items-center" data-v-6c1ff8b1>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:exclamation-triangle",
              class: "h-3 w-3 mr-1"
            }, null, _parent));
            _push(` ${serverRenderer_cjs_prodExports.ssrInterpolate(progress.error)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (editingMessageId.value) {
        _push(`<div class="flex items-center justify-between mb-3 bg-blue-50 p-3 rounded-lg border border-blue-200" data-v-6c1ff8b1><div class="flex items-center" data-v-6c1ff8b1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:edit",
          class: "h-4 w-4 text-blue-600 mr-2"
        }, null, _parent));
        _push(`<span class="text-sm font-medium text-blue-700" data-v-6c1ff8b1>Editing message</span></div><button class="p-1 text-gray-600 hover:text-gray-800 rounded transition-colors" data-v-6c1ff8b1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "lucide:x",
          class: "h-4 w-4"
        }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-end space-x-3" data-v-6c1ff8b1><div class="relative" data-v-6c1ff8b1><button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "bg-blue-100 text-blue-600": isAttachmentMenuOpen.value }, "p-2.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200"])}" title="Attach file"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isSending.value || isUploading.value) ? " disabled" : ""} data-v-6c1ff8b1>`);
      if (isUploading.value) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "svg-spinners:270-ring",
          class: "h-5 w-5"
        }, null, _parent));
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "lucide:paperclip",
          class: "h-5 w-5"
        }, null, _parent));
      }
      _push(`</button>`);
      if (isAttachmentMenuOpen.value) {
        _push(`<div class="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 animate-fadeIn" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "min-width": "180px" })}" data-v-6c1ff8b1><button type="button"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isSending.value || isUploading.value) ? " disabled" : ""} class="${serverRenderer_cjs_prodExports.ssrRenderClass([{
          "opacity-50 cursor-not-allowed": isSending.value || isUploading.value
        }, "flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"])}" data-v-6c1ff8b1><div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3" data-v-6c1ff8b1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:file",
          class: "h-4 w-4 text-blue-600"
        }, null, _parent));
        _push(`</div><div class="flex-1" data-v-6c1ff8b1><div class="text-sm font-medium" data-v-6c1ff8b1>Document</div><div class="text-xs text-gray-500" data-v-6c1ff8b1>Share a file</div></div>`);
        if (isUploading.value) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "svg-spinners:270-ring",
            class: "h-4 w-4 text-blue-500"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</button><button type="button"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isSending.value || isUploading.value) ? " disabled" : ""} class="${serverRenderer_cjs_prodExports.ssrRenderClass([{
          "opacity-50 cursor-not-allowed": isSending.value || isUploading.value
        }, "flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"])}" data-v-6c1ff8b1><div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3" data-v-6c1ff8b1>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:image",
          class: "h-4 w-4 text-green-600"
        }, null, _parent));
        _push(`</div><div class="flex-1" data-v-6c1ff8b1><div class="text-sm font-medium" data-v-6c1ff8b1>Photo</div><div class="text-xs text-gray-500" data-v-6c1ff8b1>Share an image</div></div>`);
        if (isUploading.value) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "svg-spinners:270-ring",
            class: "h-4 w-4 text-blue-500"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><input type="file" class="hidden" multiple${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isSending.value || isUploading.value) ? " disabled" : ""} data-v-6c1ff8b1><input type="file" accept="image/*" class="hidden" multiple${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isSending.value || isUploading.value) ? " disabled" : ""} data-v-6c1ff8b1><div class="flex-1 relative" data-v-6c1ff8b1><input${serverRenderer_cjs_prodExports.ssrRenderAttr("value", inputMessage.value)} type="text"${serverRenderer_cjs_prodExports.ssrRenderAttr(
        "placeholder",
        editingMessageId.value ? "Edit your message..." : "Type your message..."
      )} class="w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:border-blue-400 focus:bg-white text-gray-700 transition-colors duration-200"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isSending.value || isUploading.value) ? " disabled" : ""} data-v-6c1ff8b1></div><button${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(
        isSending.value || isUploading.value || !inputMessage.value.trim() && !editingMessageId.value
      ) ? " disabled" : ""} class="${serverRenderer_cjs_prodExports.ssrRenderClass([{
        "opacity-50 cursor-not-allowed": isSending.value || isUploading.value || !inputMessage.value.trim() && !editingMessageId.value,
        "shadow-lg": !isSending.value && !isUploading.value && (inputMessage.value.trim() || editingMessageId.value)
      }, "bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"])}" data-v-6c1ff8b1>`);
      if (isSending.value) {
        _push(`<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white" data-v-6c1ff8b1></div>`);
      } else if (editingMessageId.value) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:check",
          class: "h-5 w-5"
        }, null, _parent));
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:paper-plane",
          class: "h-5 w-5"
        }, null, _parent));
      }
      _push(`</button></div></div></div>`);
      if (showInfo.value) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(GroupInfoPanel, {
          groupName: ((_d = currentGroup.value) == null ? void 0 : _d.name) || "Loading...",
          groupDetails: currentGroupForProfile.value,
          onClose: ($event) => showInfo.value = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/GroupChatArea.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const GroupChatArea = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-6c1ff8b1"]]);
const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "SearchOnFriend",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean }
  },
  emits: ["close", "search"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const searchQuery = vueExports.ref("");
    vueExports.ref(null);
    const inputRef = vueExports.ref(null);
    vueExports.watch(
      () => props.isOpen,
      (newVal) => {
        if (!newVal) {
          searchQuery.value = "";
        } else {
          vueExports.nextTick(() => {
            if (inputRef.value) {
              inputRef.value.focus();
            }
          });
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = _sfc_main$6$1;
      if (_ctx.isOpen) {
        _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "fixed inset-0 flex items-start justify-center pt-20 bg-black bg-opacity-30 z-50" }, _attrs))}><div class="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md"><div class="px-4 py-3 border-b border-gray-200 flex justify-between items-center"><div class="flex flex-1 items-center"><div class="relative flex-1"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:search",
          class: "h-4 w-4 text-gray-400"
        }, null, _parent));
        _push(`</div><input type="text"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", searchQuery.value)} placeholder="Search Messages" class="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"></div><button class="ml-2 p-2 hover:bg-gray-100 rounded-full">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:times",
          size: "20",
          class: "text-gray-500"
        }, null, _parent));
        _push(`</button></div></div><div class="px-6 py-4"><div class="flex justify-center items-center py-4"><button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"> Search </button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/SearchOnFriend.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "FriendInfoPanel",
  __ssrInlineRender: true,
  props: {
    username: {},
    friendDetails: {}
  },
  emits: ["close"],
  setup(__props) {
    const props = __props;
    const { downloadFile: downloadFileAction, shareFile, formatFileSize } = useFiles();
    const { $toast } = useNuxtApp();
    const friendsStore = useFriendsStore();
    const attachments = vueExports.ref([]);
    const isLoading = vueExports.ref(false);
    const isLoadingMore = vueExports.ref(false);
    const showAttachmentsModal = vueExports.ref(false);
    const showShareModal = vueExports.ref(false);
    const showPreview = vueExports.ref(false);
    const selectedAttachment = vueExports.ref(null);
    const friendsList = vueExports.ref([]);
    const currentPage = vueExports.ref(1);
    const pagination = vueExports.ref({
      current_page: 1,
      total_pages: 1,
      total_items: 0,
      items_per_page: 8,
      has_more_pages: false
    });
    const displayName = vueExports.computed(() => {
      if (!props.friendDetails) return "User";
      return props.friendDetails.first_name && props.friendDetails.last_name ? `${props.friendDetails.first_name} ${props.friendDetails.last_name}` : props.friendDetails.name;
    });
    const currentAttachmentIndex = vueExports.computed(() => {
      if (!selectedAttachment.value) return -1;
      return attachments.value.findIndex(
        (item) => item.file_id === selectedAttachment.value.file_id
      );
    });
    const hasPreviousAttachment = vueExports.computed(() => {
      return currentAttachmentIndex.value > 0;
    });
    const hasNextAttachment = vueExports.computed(() => {
      return currentAttachmentIndex.value < attachments.value.length - 1;
    });
    const isImage = (mimeType) => {
      return mimeType.startsWith("image/");
    };
    vueExports.watch(() => friendsStore.friends, (friends) => {
      if (friends) {
        friendsList.value = friends.map((friend) => ({
          ...friend,
          name: friend.name || friend.display_name || friend.full_name || "Unknown User",
          shareSelected: false
        }));
      }
    }, { immediate: true });
    vueExports.watch(() => {
      var _a;
      return (_a = props.friendDetails) == null ? void 0 : _a.id;
    }, (friendId) => {
      if (friendId) {
        currentPage.value = 1;
        loadAttachments();
      }
    }, { immediate: true });
    const loadAttachments = async () => {
      var _a;
      if (!((_a = props.friendDetails) == null ? void 0 : _a.id)) return;
      try {
        isLoading.value = true;
        const response = await fetch(
          `/api/proxy/messages/history?type=private&target_id=${props.friendDetails.id}&limit=100`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Message history response:", data);
        let messages = [];
        if ((data == null ? void 0 : data.data) && Array.isArray(data.data)) {
          messages = data.data;
        } else if ((data == null ? void 0 : data.messages) && Array.isArray(data.messages)) {
          messages = data.messages;
        } else if (Array.isArray(data)) {
          messages = data;
        }
        const attachmentMessages = messages.filter(
          (msg) => msg.attachment_url && msg.message_type === "file"
        );
        const attachmentData = attachmentMessages.map(
          (msg) => {
            var _a2, _b;
            const filename = ((_a2 = msg.content) == null ? void 0 : _a2.replace("\u{1F4CE} ", "")) || "Unknown File";
            let mimeType = "application/octet-stream";
            const extension = (_b = filename.split(".").pop()) == null ? void 0 : _b.toLowerCase();
            if (extension) {
              const imageExtensions = [
                "jpg",
                "jpeg",
                "png",
                "gif",
                "webp",
                "svg"
              ];
              const documentExtensions = ["pdf", "doc", "docx", "txt"];
              if (imageExtensions.includes(extension)) {
                mimeType = `image/${extension === "jpg" ? "jpeg" : extension}`;
              } else if (documentExtensions.includes(extension)) {
                mimeType = extension === "pdf" ? "application/pdf" : extension === "doc" ? "application/msword" : extension === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "text/plain";
              }
            }
            return {
              file_id: msg.message_id || msg.id,
              filename,
              size: 0,
              // Size not available from message history
              mime_type: mimeType,
              url: msg.attachment_url,
              uploaded_at: msg.sent_at || msg.created_at || (/* @__PURE__ */ new Date()).toISOString()
            };
          }
        );
        attachments.value = attachmentData;
        console.log("Loaded attachments from messages:", attachmentData);
        pagination.value = {
          current_page: 1,
          total_pages: 1,
          total_items: attachmentData.length,
          items_per_page: attachmentData.length,
          has_more_pages: false
        };
        currentPage.value = 1;
      } catch (error) {
        console.error("Error loading attachments from messages:", error);
        attachments.value = [];
      } finally {
        isLoading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      const _component_Icon = _sfc_main$6$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "w-80 border-l border-gray-200 bg-white overflow-y-auto h-full flex-shrink-0" }, _attrs))} data-v-c54c0065><div class="p-4 border-b border-gray-200 bg-white shadow-sm" data-v-c54c0065><div class="flex justify-between items-center mb-4" data-v-c54c0065><h3 class="text-lg font-semibold text-gray-900" data-v-c54c0065>Profile</h3><button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Close profile" data-v-c54c0065>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "fa:times",
        class: "h-5 w-5"
      }, null, _parent));
      _push(`</button></div><div class="flex flex-col items-center" data-v-c54c0065><div class="h-24 w-24 rounded-full overflow-hidden bg-gray-200 mb-3 flex items-center justify-center ring-2 ring-gray-100" data-v-c54c0065>`);
      if (((_a = _ctx.friendDetails) == null ? void 0 : _a.avatar) || ((_b = _ctx.friendDetails) == null ? void 0 : _b.profile_picture_url)) {
        _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", _ctx.friendDetails.avatar || _ctx.friendDetails.profile_picture_url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", _ctx.friendDetails.name)} class="h-full w-full object-cover" data-v-c54c0065>`);
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:user",
          class: "h-12 w-12 text-gray-400"
        }, null, _parent));
      }
      _push(`</div><h2 class="text-black text-xl font-semibold text-center" data-v-c54c0065>${serverRenderer_cjs_prodExports.ssrInterpolate(displayName.value)}</h2><p class="text-gray-500 text-sm" data-v-c54c0065> @${serverRenderer_cjs_prodExports.ssrInterpolate(((_c = _ctx.friendDetails) == null ? void 0 : _c.username) || ((_d = _ctx.friendDetails) == null ? void 0 : _d.name) || "user")}</p><div class="flex items-center space-x-2 mt-2" data-v-c54c0065><div class="${serverRenderer_cjs_prodExports.ssrRenderClass(`w-3 h-3 rounded-full ${((_e = _ctx.friendDetails) == null ? void 0 : _e.status) === "online" ? "bg-green-500" : "bg-gray-400"}`)}" data-v-c54c0065></div><span class="text-sm text-gray-600 capitalize" data-v-c54c0065>${serverRenderer_cjs_prodExports.ssrInterpolate(((_f = _ctx.friendDetails) == null ? void 0 : _f.status) || "offline")}</span></div></div></div><div class="p-4 border-b border-gray-200" data-v-c54c0065><div class="flex justify-between items-center mb-3" data-v-c54c0065><h3 class="text-black font-medium" data-v-c54c0065> Attachments <span class="text-gray-500 text-sm" data-v-c54c0065>(${serverRenderer_cjs_prodExports.ssrInterpolate(attachments.value.length)})</span></h3><button class="text-sm text-blue-500 hover:underline" data-v-c54c0065> View All </button></div><div class="relative" data-v-c54c0065>`);
      if (isLoading.value) {
        _push(`<div class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75" data-v-c54c0065><div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" data-v-c54c0065></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (attachments.value.length === 0 && !isLoading.value) {
        _push(`<div class="py-4 text-center text-gray-500" data-v-c54c0065> No attachments </div>`);
      } else {
        _push(`<div class="space-y-3" data-v-c54c0065><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(attachments.value.slice(0, 5), (attachment) => {
          _push(`<div class="flex items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100 cursor-pointer" data-v-c54c0065><div class="mr-3" data-v-c54c0065>`);
          if (isImage(attachment.mime_type)) {
            _push(`<div class="w-10 h-10 rounded-md overflow-hidden bg-gray-200" data-v-c54c0065><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", attachment.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", attachment.filename)} class="w-full h-full object-cover" data-v-c54c0065></div>`);
          } else {
            _push(`<div class="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center" data-v-c54c0065>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:file",
              class: "h-5 w-5 text-blue-500"
            }, null, _parent));
            _push(`</div>`);
          }
          _push(`</div><div class="flex-grow min-w-0" data-v-c54c0065><p class="text-sm font-medium truncate" data-v-c54c0065>${serverRenderer_cjs_prodExports.ssrInterpolate(attachment.filename)}</p><p class="text-xs text-gray-500" data-v-c54c0065>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(formatFileSize)(attachment.size))}</p></div><div class="ml-2 flex" data-v-c54c0065><button class="p-1 text-gray-500 hover:text-blue-500" title="Download" data-v-c54c0065>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:download",
            class: "h-4 w-4"
          }, null, _parent));
          _push(`</button><button class="p-1 text-gray-500 hover:text-blue-500" title="Share" data-v-c54c0065>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:share-alt",
            class: "h-4 w-4"
          }, null, _parent));
          _push(`</button></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div>`);
      if (showAttachmentsModal.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center" data-v-c54c0065><div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden" data-v-c54c0065><div class="flex justify-between items-center p-4 border-b" data-v-c54c0065><h3 class="font-medium text-lg" data-v-c54c0065>All Attachments</h3><button class="text-gray-500 hover:text-gray-700" data-v-c54c0065>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:times",
          class: "h-5 w-5"
        }, null, _parent));
        _push(`</button></div><div class="overflow-y-auto p-4" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "max-height": "calc(90vh - 8rem)" })}" data-v-c54c0065>`);
        if (isLoadingMore.value) {
          _push(`<div class="flex justify-center py-4" data-v-c54c0065><div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" data-v-c54c0065></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-3" data-v-c54c0065><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(attachments.value, (attachment) => {
          _push(`<div class="flex items-center bg-gray-50 p-3 rounded-md hover:bg-gray-100 cursor-pointer" data-v-c54c0065><div class="mr-3" data-v-c54c0065>`);
          if (isImage(attachment.mime_type)) {
            _push(`<div class="w-12 h-12 rounded-md overflow-hidden bg-gray-200" data-v-c54c0065><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", attachment.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", attachment.filename)} class="w-full h-full object-cover" data-v-c54c0065></div>`);
          } else {
            _push(`<div class="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center" data-v-c54c0065>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:file",
              class: "h-6 w-6 text-blue-500"
            }, null, _parent));
            _push(`</div>`);
          }
          _push(`</div><div class="flex-grow min-w-0" data-v-c54c0065><p class="text-sm font-medium truncate" data-v-c54c0065>${serverRenderer_cjs_prodExports.ssrInterpolate(attachment.filename)}</p><p class="text-xs text-gray-500" data-v-c54c0065>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(formatFileSize)(attachment.size))}</p><p class="text-xs text-gray-400" data-v-c54c0065>${serverRenderer_cjs_prodExports.ssrInterpolate(new Date(attachment.uploaded_at).toLocaleDateString())}</p></div><div class="ml-2 flex" data-v-c54c0065><button class="p-2 text-gray-500 hover:text-blue-500" title="Download" data-v-c54c0065>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:download",
            class: "h-4 w-4"
          }, null, _parent));
          _push(`</button><button class="p-2 text-gray-500 hover:text-blue-500" title="Share" data-v-c54c0065>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:share-alt",
            class: "h-4 w-4"
          }, null, _parent));
          _push(`</button></div></div>`);
        });
        _push(`<!--]--></div>`);
        if (pagination.value.has_more_pages) {
          _push(`<div class="flex justify-center mt-4" data-v-c54c0065><button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isLoadingMore.value) ? " disabled" : ""} data-v-c54c0065>${serverRenderer_cjs_prodExports.ssrInterpolate(isLoadingMore.value ? "Loading..." : "Load More")}</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showShareModal.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center" data-v-c54c0065><div class="bg-white rounded-lg p-6 max-w-md w-full" data-v-c54c0065><div class="flex justify-between items-center mb-4" data-v-c54c0065><h3 class="font-medium text-lg" data-v-c54c0065>Share File</h3><button class="text-gray-500 hover:text-gray-700" data-v-c54c0065>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:times",
          class: "h-5 w-5"
        }, null, _parent));
        _push(`</button></div>`);
        if (selectedAttachment.value) {
          _push(`<div class="mb-4 p-3 bg-gray-50 rounded-md flex items-center" data-v-c54c0065><div class="mr-3" data-v-c54c0065><div class="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center" data-v-c54c0065>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:file",
            class: "h-5 w-5 text-blue-500"
          }, null, _parent));
          _push(`</div></div><div data-v-c54c0065><p class="text-sm font-medium" data-v-c54c0065>${serverRenderer_cjs_prodExports.ssrInterpolate(selectedAttachment.value.filename)}</p><p class="text-xs text-gray-500" data-v-c54c0065>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(formatFileSize)(selectedAttachment.value.size))}</p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mb-4" data-v-c54c0065><label class="block text-sm font-medium mb-2" data-v-c54c0065> Share with: </label><div class="max-h-60 overflow-y-auto border border-gray-200 rounded-lg" data-v-c54c0065><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(friendsList.value, (friend) => {
          _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass(`flex items-center justify-between p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${friend.shareSelected ? "bg-blue-50" : ""}`)}" data-v-c54c0065><div class="flex items-center" data-v-c54c0065><div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex items-center justify-center" data-v-c54c0065>`);
          if (friend.avatar || friend.profile_picture_url) {
            _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", friend.avatar || friend.profile_picture_url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", friend.name)} class="h-full w-full object-cover" data-v-c54c0065>`);
          } else {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:user",
              class: "h-4 w-4 text-gray-500"
            }, null, _parent));
          }
          _push(`</div><span class="text-sm" data-v-c54c0065>${serverRenderer_cjs_prodExports.ssrInterpolate(friend.name)}</span></div>`);
          if (friend.shareSelected) {
            _push(`<div class="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center" data-v-c54c0065>`);
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:check",
              class: "h-2 w-2 text-white"
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div></div><div class="flex justify-end" data-v-c54c0065><button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(!friendsList.value.some((friend) => friend.shareSelected)) ? " disabled" : ""} data-v-c54c0065> Share </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showPreview.value && selectedAttachment.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" data-v-c54c0065><div class="relative w-full max-w-4xl" data-v-c54c0065><button class="absolute top-4 right-4 text-white hover:text-gray-300 z-10" data-v-c54c0065>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:times",
          class: "h-6 w-6"
        }, null, _parent));
        _push(`</button><div class="flex flex-col items-center" data-v-c54c0065>`);
        if (isImage(selectedAttachment.value.mime_type)) {
          _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", selectedAttachment.value.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", selectedAttachment.value.filename)} class="max-h-[80vh] max-w-full object-contain" data-v-c54c0065>`);
        } else {
          _push(`<div class="bg-white rounded-lg p-8 text-center" data-v-c54c0065><div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4" data-v-c54c0065>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:file",
            class: "h-8 w-8 text-blue-500"
          }, null, _parent));
          _push(`</div><h3 class="text-lg font-medium text-gray-900 mb-2" data-v-c54c0065>${serverRenderer_cjs_prodExports.ssrInterpolate(selectedAttachment.value.filename)}</h3><p class="text-sm text-gray-500 mb-4" data-v-c54c0065>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(formatFileSize)(selectedAttachment.value.size))}</p><p class="text-sm text-gray-600" data-v-c54c0065> This file type cannot be previewed </p></div>`);
        }
        _push(`<div class="mt-4 flex justify-center space-x-4" data-v-c54c0065><button class="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center" data-v-c54c0065>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:download",
          class: "h-4 w-4 mr-2"
        }, null, _parent));
        _push(` Download </button><button class="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center" data-v-c54c0065>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:share-alt",
          class: "h-4 w-4 mr-2"
        }, null, _parent));
        _push(` Share </button></div>`);
        if (hasPreviousAttachment.value) {
          _push(`<div class="absolute inset-y-0 left-0 flex items-center" data-v-c54c0065><button class="bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white" data-v-c54c0065>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:chevron-left",
            class: "h-6 w-6"
          }, null, _parent));
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        if (hasNextAttachment.value) {
          _push(`<div class="absolute inset-y-0 right-0 flex items-center" data-v-c54c0065><button class="bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white" data-v-c54c0065>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:chevron-right",
            class: "h-6 w-6"
          }, null, _parent));
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/FriendInfoPanel.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const FriendInfoPanel = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-c54c0065"]]);
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ChatAreaItem",
  __ssrInlineRender: true,
  props: {
    message: {},
    recipient: {}
  },
  emits: ["retryClick", "editClick", "deleteClick"],
  setup(__props, { emit: __emit }) {
    var _a, _b, _c, _d, _e;
    const props = __props;
    const { downloadFile } = useFiles();
    const { $toast } = useNuxtApp();
    const showActions = vueExports.ref(false);
    const isDownloading = vueExports.ref(false);
    vueExports.ref(null);
    console.log("[ChatAreaItem] Rendering message:", {
      messageId: props.message.id,
      content: (_a = props.message.content) == null ? void 0 : _a.substring(0, 20),
      isCurrentUser: props.message.isCurrentUser,
      sender_id: props.message.sender_id,
      positioning: props.message.isCurrentUser ? "right" : "left"
    });
    const senderName = vueExports.computed(() => {
      var _a2;
      return props.message.isCurrentUser ? "You" : ((_a2 = props.message.sender) == null ? void 0 : _a2.name) || props.recipient.name || "Unknown";
    });
    const senderAvatar = vueExports.computed(() => {
      var _a2;
      if (props.message.isCurrentUser) return null;
      return ((_a2 = props.message.sender) == null ? void 0 : _a2.avatar_url) || props.recipient.profile_picture_url || props.recipient.avatar;
    });
    const validatedAvatar = vueExports.computed(() => {
      const avatarUrl = senderAvatar.value;
      if (!avatarUrl) return null;
      if (avatarUrl.startsWith("data:")) {
        const maxSize = 2 * 1024 * 1024;
        if (avatarUrl.length > maxSize) {
          console.warn(
            "[ChatAreaItem] Avatar too large:",
            avatarUrl.length,
            "bytes, max:",
            maxSize
          );
          return null;
        }
        const dataUrlRegex = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/;
        if (!dataUrlRegex.test(avatarUrl)) {
          console.warn(
            "[ChatAreaItem] Invalid data URL format:",
            avatarUrl.substring(0, 100)
          );
          return null;
        }
      }
      return avatarUrl;
    });
    if (!props.message.isCurrentUser) {
      console.log("[ChatAreaItem] Avatar debug for message:", {
        messageId: props.message.id,
        senderName: senderName.value,
        senderAvatar: validatedAvatar.value ? validatedAvatar.value.substring(0, 50) + "..." : null,
        avatarLength: ((_b = validatedAvatar.value) == null ? void 0 : _b.length) || 0,
        isDataUrl: ((_c = validatedAvatar.value) == null ? void 0 : _c.startsWith("data:")) || false,
        isBase64: ((_d = validatedAvatar.value) == null ? void 0 : _d.includes("base64")) || false,
        messageData: {
          sender: props.message.sender,
          senderAvatarUrl: (_e = props.message.sender) == null ? void 0 : _e.avatar_url
        },
        recipientData: {
          profile_picture_url: props.recipient.profile_picture_url ? props.recipient.profile_picture_url.substring(0, 50) + "..." : null,
          avatar: props.recipient.avatar ? props.recipient.avatar.substring(0, 50) + "..." : null
        }
      });
    }
    const showActionsButton = vueExports.computed(() => {
      return props.message.isCurrentUser && !props.message.isDeleted && !props.message.pending && !props.message.failed && !props.message.retrying;
    });
    const formattedTimestamp = vueExports.computed(() => {
      return formatMessageTimestamp({
        timestamp: props.message.timestamp,
        raw_timestamp: props.message.raw_timestamp,
        created_at: props.message.created_at,
        sent_at: props.message.sent_at,
        format: "time"
      }) || "No Time";
    });
    const bubbleClasses = vueExports.computed(() => {
      const baseClasses = "rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 relative group shadow-sm transition-all duration-200";
      const hoverClass = props.message.isCurrentUser ? "" : "hover:shadow-md";
      return `${baseClasses} ${getBubbleClasses()} ${hoverClass}`;
    });
    const getBubbleClasses = () => {
      if (props.message.isCurrentUser) {
        if (props.message.isDeleted) {
          return "bg-gray-200 text-gray-500 italic";
        } else if (props.message.failed) {
          return "bg-red-100 text-red-800 border border-red-300 cursor-pointer hover:bg-red-200";
        } else {
          return "bg-blue-500 text-white";
        }
      } else {
        return "bg-white border border-gray-200 text-gray-800";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_OptimizedAvatar = __nuxt_component_0;
      const _component_Icon = _sfc_main$6$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        class: `flex ${_ctx.message.isCurrentUser ? "justify-end" : "justify-start"} mb-3 sm:mb-4`,
        "data-message-id": _ctx.message.id,
        "data-sender-id": _ctx.message.sender_id,
        "data-recipient-id": _ctx.message.recipient_id || _ctx.message.receiver_id,
        "data-is-current-user": _ctx.message.isCurrentUser,
        "data-positioning": _ctx.message.isCurrentUser ? "right" : "left"
      }, _attrs))} data-v-4d2ec189>`);
      if (!_ctx.message.isCurrentUser) {
        _push(`<div class="mr-2" data-v-4d2ec189>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_OptimizedAvatar, {
          src: validatedAvatar.value,
          alt: senderName.value,
          size: "md",
          class: "flex-shrink-0"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass(bubbleClasses.value)}"${serverRenderer_cjs_prodExports.ssrRenderAttr(
        "title",
        _ctx.message.failed ? "Click to retry sending this message" : void 0
      )} data-v-4d2ec189>`);
      if (showActionsButton.value) {
        _push(`<div class="absolute top-2 right-2" data-v-4d2ec189><button class="text-white hover:text-blue-200 p-1.5 rounded-full focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-20 hover:bg-opacity-40" data-v-4d2ec189>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:ellipsis-v",
          class: "h-3 w-3"
        }, null, _parent));
        _push(`</button>`);
        if (showActions.value) {
          _push(`<div class="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50" data-v-4d2ec189><div class="py-1" data-v-4d2ec189><button class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center transition-colors" data-v-4d2ec189>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "lucide:edit-2",
            class: "mr-2 text-xs"
          }, null, _parent));
          _push(` Edit </button><button class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center transition-colors" data-v-4d2ec189>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "lucide:trash",
            class: "mr-2 text-xs"
          }, null, _parent));
          _push(` Unsend </button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.message.pending) {
        _push(`<div class="absolute top-0 right-0 -mt-1 -mr-1" data-v-4d2ec189><div class="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent" data-v-4d2ec189></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.message.retrying) {
        _push(`<div class="absolute top-0 right-0 -mt-1 -mr-1" data-v-4d2ec189><div class="animate-pulse rounded-full h-3 w-3 bg-yellow-500" data-v-4d2ec189></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.message.attachment) {
        _push(`<div class="mb-1" data-v-4d2ec189>`);
        if (_ctx.message.attachment.type === "image") {
          _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", _ctx.message.attachment.url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", _ctx.message.attachment.name)} class="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity max-h-48" data-v-4d2ec189>`);
        } else {
          _push(`<button${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isDownloading.value) ? " disabled" : ""} class="text-blue-500 hover:underline flex items-center space-x-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", `Download ${_ctx.message.attachment.name}`)} data-v-4d2ec189>`);
          if (isDownloading.value) {
            _push(`<div class="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent" data-v-4d2ec189></div>`);
          } else {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:file",
              class: "text-gray-500 h-3 w-3"
            }, null, _parent));
          }
          _push(`<span class="text-xs truncate max-w-32" data-v-4d2ec189>${serverRenderer_cjs_prodExports.ssrInterpolate(_ctx.message.attachment.name)}</span>`);
          if (!isDownloading.value) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:download",
              class: "h-2.5 w-2.5 text-gray-400"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div data-v-4d2ec189><p class="text-sm break-words whitespace-pre-wrap" data-v-4d2ec189>${serverRenderer_cjs_prodExports.ssrInterpolate(_ctx.message.isDeleted ? "This message was deleted" : _ctx.message.content || "(No message content)")}</p>`);
      if (_ctx.message.failed && _ctx.message.errorMessage) {
        _push(`<p class="text-xs text-red-300 mt-1 italic" data-v-4d2ec189>${serverRenderer_cjs_prodExports.ssrInterpolate(_ctx.message.errorMessage)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center justify-end space-x-1 mt-1" data-v-4d2ec189>`);
      if (_ctx.message.isEdited && !_ctx.message.isDeleted) {
        _push(`<span class="text-xs opacity-75" data-v-4d2ec189> (edited) </span>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.message.failed) {
        _push(`<span class="text-xs text-red-600 font-medium" data-v-4d2ec189> Failed `);
        if (_ctx.message.retryCount && _ctx.message.retryCount > 0) {
          _push(`<span data-v-4d2ec189> (${serverRenderer_cjs_prodExports.ssrInterpolate(_ctx.message.retryCount)}) </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="text-xs opacity-75" data-v-4d2ec189>${serverRenderer_cjs_prodExports.ssrInterpolate(formattedTimestamp.value)}</span>`);
      if (_ctx.message.isCurrentUser) {
        _push(`<div class="ml-1" data-v-4d2ec189>`);
        if (_ctx.message.pending) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:clock",
            class: "h-3 w-3 opacity-75"
          }, null, _parent));
        } else if (_ctx.message.retrying) {
          _push(`<div class="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent opacity-75" data-v-4d2ec189></div>`);
        } else if (_ctx.message.failed) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "lucide:alert-triangle",
            class: "h-3 w-3 text-red-300"
          }, null, _parent));
        } else if (!_ctx.message.pending && !_ctx.message.failed && !_ctx.message.retrying && _ctx.message.delivered) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:check",
            class: "h-3 w-3 opacity-75"
          }, null, _parent));
        } else if (!_ctx.message.pending && !_ctx.message.failed && !_ctx.message.retrying && _ctx.message.read) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:check",
            class: "h-3 w-3 opacity-75 text-blue-300"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/ChatAreaItem.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ChatAreaItem = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-4d2ec189"]]);
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ChatArea",
  __ssrInlineRender: true,
  props: {
    recipientId: {},
    recipientName: {},
    chatMessages: {}
  },
  setup(__props) {
    const { $toast } = useNuxtApp();
    const messagesStore = useMessagesStore();
    const authStore = useAuthStore();
    const friendsStore = useFriendsStore();
    const webSocketStore = useWebSocket();
    useWebSocketListener();
    const presence = usePresence();
    vueExports.computed(() => authStore.user);
    const props = __props;
    const inputMessage = vueExports.ref("");
    const editingMessageId = vueExports.ref(null);
    const showDropdown = vueExports.ref(null);
    vueExports.ref(false);
    const showSearch = vueExports.ref(false);
    const showInfo = vueExports.ref(false);
    const isAttachmentMenuOpen = vueExports.ref(false);
    const searchQuery = vueExports.ref("");
    const isSearching = vueExports.ref(false);
    const filteredMessages = vueExports.ref([]);
    const isTyping = vueExports.ref(false);
    const isLoadingMore = vueExports.ref(false);
    vueExports.ref(null);
    const isSending = vueExports.ref(false);
    const isLoading = vueExports.ref(false);
    const uploadProgress = vueExports.ref([]);
    const isUploading = vueExports.ref(false);
    vueExports.ref(false);
    vueExports.ref(null);
    vueExports.ref(null);
    vueExports.ref(null);
    vueExports.ref(null);
    vueExports.ref(null);
    const validatedRecipientAvatar = vueExports.computed(() => {
      const avatarUrl = recipient.value.profile_picture_url || recipient.value.avatar;
      if (!avatarUrl) return null;
      if (avatarUrl.startsWith("data:")) {
        const maxSize = 2 * 1024 * 1024;
        if (avatarUrl.length > maxSize) {
          console.warn(
            "[ChatArea] Avatar too large:",
            avatarUrl.length,
            "bytes, max:",
            maxSize
          );
          return null;
        }
        const dataUrlRegex = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/;
        if (!dataUrlRegex.test(avatarUrl)) {
          console.warn(
            "[ChatArea] Invalid data URL format:",
            avatarUrl.substring(0, 100)
          );
          return null;
        }
      }
      return avatarUrl;
    });
    const groupedMessages = vueExports.computed(() => {
      if (!displayMessages.value || !Array.isArray(displayMessages.value))
        return [];
      const messagesByDate = {};
      const today = (/* @__PURE__ */ new Date()).toDateString();
      const yesterday = new Date(Date.now() - 864e5).toDateString();
      const sortedMessages = [...displayMessages.value].sort((a, b) => {
        const timeA = new Date(
          a.raw_timestamp || a.sent_at || a.created_at || a.timestamp || 0
        ).getTime();
        const timeB = new Date(
          b.raw_timestamp || b.sent_at || b.created_at || b.timestamp || 0
        ).getTime();
        return timeA - timeB;
      });
      sortedMessages.forEach((message) => {
        var _a;
        const messageDate = new Date(
          message.raw_timestamp || message.sent_at || message.created_at || message.timestamp || /* @__PURE__ */ new Date()
        );
        if (isNaN(messageDate.getTime())) {
          console.warn("Invalid date for message:", {
            messageId: message.id,
            content: (_a = message.content) == null ? void 0 : _a.substring(0, 20),
            raw_timestamp: message.raw_timestamp,
            sent_at: message.sent_at,
            created_at: message.created_at,
            timestamp: message.timestamp
          });
          messageDate.setTime((/* @__PURE__ */ new Date()).getTime());
        }
        const dateKey = messageDate.toDateString();
        if (!messagesByDate[dateKey]) {
          messagesByDate[dateKey] = {
            dateKey,
            date: formatDateForSeparator(messageDate),
            messages: [],
            isToday: dateKey === today,
            isYesterday: dateKey === yesterday
          };
        }
        messagesByDate[dateKey].messages.push(message);
      });
      return Object.values(messagesByDate).sort(
        (a, b) => new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime()
      );
    });
    const retryFailedMessage = async (message) => {
      var _a, _b;
      if (!message.content || !props.recipientId) return;
      console.log(`[ChatArea] Retrying failed message: ${message.id}`);
      const messageIndex = messages.value.findIndex((msg) => msg.id === message.id);
      if (messageIndex !== -1) {
        messages.value[messageIndex] = {
          ...messages.value[messageIndex],
          retrying: true,
          failed: false,
          errorMessage: void 0
        };
      }
      try {
        let response = null;
        let messageId = message.id;
        if (webSocketStore.isConnected) {
          try {
            console.log("[ChatArea] Retrying via WebSocket");
          } catch (wsError) {
            console.warn("[ChatArea] WebSocket retry failed, using API:", wsError);
            response = await messagesStore.sendMessage(
              props.recipientId,
              message.content
            );
            if ((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.id) {
              messageId = response.data.id;
            }
          }
        } else {
          response = await messagesStore.sendMessage(
            props.recipientId,
            message.content
          );
          if ((_b = response == null ? void 0 : response.data) == null ? void 0 : _b.id) {
            messageId = response.data.id;
          }
        }
        if (messageIndex !== -1) {
          messages.value[messageIndex] = {
            ...messages.value[messageIndex],
            id: messageId,
            retrying: false,
            failed: false,
            sent: true,
            errorMessage: void 0,
            retryCount: (messages.value[messageIndex].retryCount || 0) + 1
          };
        }
        saveToSessionStorage(messages.value);
        $toast == null ? void 0 : $toast.success("Message sent successfully!");
      } catch (error) {
        console.error("[ChatArea] Retry failed:", error);
        if (messageIndex !== -1) {
          messages.value[messageIndex] = {
            ...messages.value[messageIndex],
            retrying: false,
            failed: true,
            errorMessage: error instanceof Error ? error.message : "Retry failed",
            retryCount: (messages.value[messageIndex].retryCount || 0) + 1
          };
        }
        $toast == null ? void 0 : $toast.error("Retry failed. Please try again.");
      }
    };
    const handleAdvancedSearch = (query) => {
      searchQuery.value = query;
      if (query.trim()) {
        filteredMessages.value = messages.value.filter(
          (msg) => msg.content.toLowerCase().includes(query.toLowerCase())
        );
      } else {
        filteredMessages.value = [];
      }
    };
    const handleEditMessage = (messageId) => {
      const message = messages.value.find((msg) => msg.id === messageId);
      if (message) {
        editingMessageId.value = messageId;
        inputMessage.value = message.content;
        showDropdown.value = null;
        vueExports.nextTick(() => {
          const inputElement = (void 0).querySelector(
            "input.flex-1"
          );
          if (inputElement) {
            inputElement.focus();
          }
        });
      }
    };
    const handleUnsendMessage = async (messageId) => {
      try {
        const response = await messagesStore.deleteMessage(messageId);
        if (response.message) {
          const messageIndex = messages.value.findIndex(
            (msg) => msg.id === messageId
          );
          if (messageIndex !== -1) {
            messages.value[messageIndex] = {
              ...messages.value[messageIndex],
              isDeleted: true,
              content: "This message was deleted"
            };
          }
          $toast == null ? void 0 : $toast.success("Message deleted successfully");
          showDropdown.value = null;
          saveToSessionStorage(messages.value);
        }
      } catch (error) {
        $toast == null ? void 0 : $toast.error("Failed to delete message");
      }
    };
    const recipient = vueExports.computed(() => {
      const friend = friendsStore.friends.find((f) => f.id === props.recipientId);
      const presenceStatus = presence.getStatus(props.recipientId);
      const normalizeStatus = (status) => {
        if (!status) return "offline";
        if (status === "online" || status === "offline" || status === "busy")
          return status;
        if (status === "away") return "busy";
        return "offline";
      };
      if (!friend) {
        return {
          id: props.recipientId,
          name: props.recipientName,
          first_name: "",
          last_name: "",
          status: normalizeStatus(presenceStatus),
          avatar: void 0,
          // Add avatar property
          email: ""
          // Add email property
        };
      }
      return {
        ...friend,
        status: normalizeStatus(presenceStatus),
        avatar: friend.profile_picture_url || friend.avatar
        // Ensure avatar is set
      };
    });
    const adaptRecipientToFriendDetails = (recipient2) => {
      const normalizedStatus = recipient2.status === "online" ? "online" : "offline";
      return {
        id: recipient2.id || props.recipientId,
        name: recipient2.name || `${recipient2.first_name || ""} ${recipient2.last_name || ""}`.trim() || "User",
        first_name: recipient2.first_name || "",
        last_name: recipient2.last_name || "",
        email: recipient2.email || "",
        phone: recipient2.phone || "",
        status: normalizedStatus,
        avatar: recipient2.avatar || recipient2.profile_picture_url,
        profile_picture_url: recipient2.profile_picture_url || recipient2.avatar,
        username: recipient2.username || recipient2.name,
        avatar_url: recipient2.avatar_url || recipient2.profile_picture_url || recipient2.avatar,
        display_name: recipient2.display_name || `${recipient2.first_name || ""} ${recipient2.last_name || ""}`.trim() || recipient2.name,
        full_name: recipient2.full_name || `${recipient2.first_name || ""} ${recipient2.last_name || ""}`.trim()
      };
    };
    const messages = vueExports.ref([]);
    const displayMessages = vueExports.computed(() => {
      var _a;
      if (!messages.value || !Array.isArray(messages.value)) {
        console.log(
          `\u{1F50D} [ChatArea] displayMessages: messages.value is not an array:`,
          messages.value
        );
        return [];
      }
      let messagesToDisplay = messages.value;
      if (isSearching.value && filteredMessages.value.length > 0) {
        messagesToDisplay = filteredMessages.value;
      }
      const sorted = messagesToDisplay.sort((a, b) => {
        const timeA = new Date(
          a.created_at || a.sent_at || a.timestamp || 0
        ).getTime();
        const timeB = new Date(
          b.created_at || b.sent_at || b.timestamp || 0
        ).getTime();
        return timeA - timeB;
      });
      console.log(
        `\u{1F50D} [ChatArea] displayMessages computed: ${sorted.length} messages`,
        {
          rawMessages: messages.value.length,
          isSearching: isSearching.value,
          firstMessage: sorted[0] ? {
            id: sorted[0].id,
            content: (_a = sorted[0].content) == null ? void 0 : _a.substring(0, 50),
            isCurrentUser: sorted[0].isCurrentUser,
            sender_id: sorted[0].sender_id
          } : null
        }
      );
      return sorted;
    });
    const getConnectionErrorMessage = () => {
      if (!webSocketStore.connectionError) return "";
      const error = webSocketStore.connectionError.toLowerCase();
      if (error.includes("authentication") || error.includes("token")) {
        return "Auth error";
      } else if (error.includes("timeout")) {
        return "Connection timeout";
      } else {
        return "Connection error";
      }
    };
    vueExports.watch(
      () => webSocketStore.connectionError,
      (error) => {
      }
    );
    vueExports.ref(false);
    const saveToSessionStorage = (messagesList) => {
      if (!messagesList || messagesList.length === 0) {
        return;
      }
      try {
        const conversationKey = `chat_${props.recipientId}`;
        const optimizedMessages = messagesList.map((msg) => ({
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          recipient_id: msg.recipient_id,
          timestamp: msg.timestamp,
          raw_timestamp: msg.raw_timestamp,
          sent_at: msg.sent_at,
          created_at: msg.created_at,
          updated_at: msg.updated_at,
          isCurrentUser: msg.isCurrentUser,
          isEdited: msg.isEdited,
          isDeleted: msg.isDeleted,
          attachment: msg.attachment,
          pending: msg.pending,
          failed: msg.failed,
          read: msg.read
        }));
        sessionStorage.setItem(conversationKey, JSON.stringify(optimizedMessages));
        console.log(
          `\u{1F4BE} [ChatArea] Saved ${optimizedMessages.length} messages to session storage for recipient ${props.recipientId}`
        );
      } catch (error) {
        console.error(
          "\u274C [ChatArea] Failed to save messages to session storage:",
          error
        );
        if (error instanceof DOMException && error.name === "QuotaExceededError") {
          try {
            const reducedMessages = messagesList.slice(-50).map((msg) => ({
              id: msg.id,
              content: msg.content,
              sender_id: msg.sender_id,
              timestamp: msg.timestamp,
              isCurrentUser: msg.isCurrentUser
            }));
            const conversationKey = `chat_${props.recipientId}`;
            sessionStorage.setItem(
              conversationKey,
              JSON.stringify(reducedMessages)
            );
            console.log(
              "\u{1F4BE} [ChatArea] Saved reduced message set due to storage quota limits"
            );
          } catch (secondError) {
            console.error(
              "\u274C [ChatArea] Failed to save even reduced message set:",
              secondError
            );
            try {
              sessionStorage.removeItem(`chat_${props.recipientId}`);
            } catch (e) {
            }
          }
        }
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = _sfc_main$6$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "h-full flex bg-gray-50" }, _attrs))} data-v-b6946581><div class="flex-1 flex flex-col h-full" data-v-b6946581><div class="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between" data-v-b6946581><div class="flex items-center" data-v-b6946581><div class="relative mr-3" data-v-b6946581><div class="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center" data-v-b6946581>`);
      if (validatedRecipientAvatar.value) {
        _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", validatedRecipientAvatar.value)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", recipient.value.name)} class="h-full w-full object-cover" data-v-b6946581>`);
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:user",
          class: "h-6 w-6 text-gray-500"
        }, null, _parent));
      }
      _push(`</div>`);
      if (recipient.value.status === "online") {
        _push(`<span class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" data-v-b6946581></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-b6946581><h2 class="font-semibold text-gray-800" data-v-b6946581>${serverRenderer_cjs_prodExports.ssrInterpolate(recipient.value.first_name)} ${serverRenderer_cjs_prodExports.ssrInterpolate(recipient.value.last_name)}</h2><p class="text-xs text-gray-500" data-v-b6946581>${serverRenderer_cjs_prodExports.ssrInterpolate(recipient.value.status === "online" ? "Online" : "Offline")} `);
      if (isTyping.value) {
        _push(`<span class="ml-2 text-blue-500" data-v-b6946581>typing...</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p></div></div><div class="flex items-center" data-v-b6946581><button class="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200 mr-2" title="Search in conversation" data-v-b6946581>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "fa:search",
        class: "h-4 w-4"
      }, null, _parent));
      _push(`</button><button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "text-blue-500": showInfo.value }, "p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200"])}" title="View info" data-v-b6946581>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "fa:info-circle",
        class: "h-4 w-4"
      }, null, _parent));
      _push(`</button></div></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$4, {
        isOpen: showSearch.value,
        onClose: ($event) => showSearch.value = false,
        onSearch: handleAdvancedSearch
      }, null, _parent));
      _push(`<div class="flex-1 overflow-auto p-6 space-y-4 relative" data-v-b6946581>`);
      if (isLoadingMore.value) {
        _push(`<div class="text-center py-2" data-v-b6946581><span class="inline-flex items-center" data-v-b6946581>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "svg-spinners:270-ring",
          class: "h-4 w-4 mr-2 text-blue-500"
        }, null, _parent));
        _push(` Loading older messages... </span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isLoading.value) {
        _push(`<div class="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80 z-10" data-v-b6946581><div class="flex flex-col items-center" data-v-b6946581><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" data-v-b6946581></div><p class="mt-2 text-sm text-gray-500" data-v-b6946581>Loading messages...</p></div></div>`);
      } else if (displayMessages.value.length === 0) {
        _push(`<div class="absolute inset-0 flex items-center justify-center" data-v-b6946581>`);
        if (isSearching.value) {
          _push(`<div class="text-center text-gray-500" data-v-b6946581><p class="mb-1" data-v-b6946581>No matching messages found</p><button class="text-blue-500 hover:underline" data-v-b6946581> Clear search </button></div>`);
        } else {
          _push(`<div class="text-center text-gray-500" data-v-b6946581><p class="mb-1" data-v-b6946581>No messages yet</p><p class="text-sm" data-v-b6946581>Start the conversation by sending a message</p></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(groupedMessages.value, (group) => {
        _push(`<div class="message-group" data-v-b6946581><div class="flex justify-center my-4" data-v-b6946581><div class="bg-gray-100 rounded-full px-3 py-1" data-v-b6946581><span class="text-xs text-gray-600 font-medium" data-v-b6946581>${serverRenderer_cjs_prodExports.ssrInterpolate(group.isToday ? "Today" : group.isYesterday ? "Yesterday" : group.date)}</span></div></div><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(group.messages, (message) => {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(ChatAreaItem, {
            key: message.id,
            message: {
              ...message,
              created_at: message.created_at || message.timestamp || (/* @__PURE__ */ new Date()).toISOString()
            },
            recipient: {
              id: recipient.value.id,
              name: recipient.value.name || recipient.value.first_name + " " + recipient.value.last_name || "Unknown User",
              avatar: recipient.value.avatar,
              profile_picture_url: recipient.value.profile_picture_url || recipient.value.avatar
            },
            onRetryClick: retryFailedMessage,
            onEditClick: handleEditMessage,
            onDeleteClick: handleUnsendMessage
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--><div data-v-b6946581></div></div><div class="p-4 bg-white border-t border-gray-200" data-v-b6946581>`);
      if (isUploading.value && uploadProgress.value.length > 0) {
        _push(`<div class="mb-3" data-v-b6946581><div class="text-sm text-gray-600 mb-2" data-v-b6946581> Uploading ${serverRenderer_cjs_prodExports.ssrInterpolate(uploadProgress.value.length)} file(s)... </div><div class="space-y-2" data-v-b6946581><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(uploadProgress.value, (progress) => {
          _push(`<div class="flex items-center space-x-3" data-v-b6946581><div class="flex-1" data-v-b6946581><div class="flex justify-between text-xs text-gray-600 mb-1" data-v-b6946581><span data-v-b6946581>${serverRenderer_cjs_prodExports.ssrInterpolate(progress.file.name)}</span><span data-v-b6946581>${serverRenderer_cjs_prodExports.ssrInterpolate(progress.progress)}%</span></div><div class="w-full bg-gray-200 rounded-full h-2" data-v-b6946581><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([{
            "bg-blue-500": progress.status === "uploading",
            "bg-green-500": progress.status === "success",
            "bg-red-500": progress.status === "error",
            "bg-gray-300": progress.status === "pending"
          }, "h-2 rounded-full transition-all duration-300"])}" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: `${progress.progress}%` })}" data-v-b6946581></div></div>`);
          if (progress.error) {
            _push(`<div class="text-xs text-red-500 mt-1" data-v-b6946581>${serverRenderer_cjs_prodExports.ssrInterpolate(progress.error)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (editingMessageId.value) {
        _push(`<div class="flex items-center mb-2 bg-blue-50 p-2 rounded" data-v-b6946581><span class="text-sm text-blue-700 flex-1" data-v-b6946581> Editing message </span><button class="text-gray-600 hover:text-gray-800" data-v-b6946581>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "lucide:x",
          class: "h-4 w-4"
        }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="flex flex-col" data-v-b6946581><div class="flex items-center" data-v-b6946581><div class="relative" data-v-b6946581><button type="button" class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "bg-blue-100 text-blue-600": isAttachmentMenuOpen.value }, "p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors duration-200 mr-2"])}" title="Attach file"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isSending.value || isUploading.value) ? " disabled" : ""} data-v-b6946581>`);
      if (isUploading.value) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "svg-spinners:270-ring",
          class: "h-5 w-5"
        }, null, _parent));
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "lucide:paperclip",
          class: "h-5 w-5"
        }, null, _parent));
      }
      _push(`</button>`);
      if (isAttachmentMenuOpen.value) {
        _push(`<div class="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 animate-fadeIn" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "min-width": "150px" })}" data-v-b6946581><button type="button" class="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 mb-2 w-full text-left px-4 py-2 rounded transition-all duration-200"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isSending.value || isUploading.value) ? " disabled" : ""} data-v-b6946581>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:file",
          class: "mr-2"
        }, null, _parent));
        _push(`<span data-v-b6946581>File</span>`);
        if (isUploading.value) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "svg-spinners:270-ring",
            class: "ml-auto h-4 w-4 text-blue-500"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</button><button type="button" class="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left px-4 py-2 rounded transition-all duration-200"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isSending.value || isUploading.value) ? " disabled" : ""} data-v-b6946581>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:image",
          class: "mr-2"
        }, null, _parent));
        _push(`<span data-v-b6946581>Image</span>`);
        if (isUploading.value) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "svg-spinners:270-ring",
            class: "ml-auto h-4 w-4 text-blue-500"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><input type="file" class="hidden" multiple${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isSending.value || isUploading.value) ? " disabled" : ""} data-v-b6946581><input type="file" accept="image/*" class="hidden" multiple${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isSending.value || isUploading.value) ? " disabled" : ""} data-v-b6946581>`);
      if (isSending.value) {
        _push(`<div class="fixed top-0 left-0 right-0 bg-blue-500 h-1 z-50" data-v-b6946581><div class="h-full bg-white animate-progress" data-v-b6946581></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${serverRenderer_cjs_prodExports.ssrRenderAttr("value", inputMessage.value)} type="text"${serverRenderer_cjs_prodExports.ssrRenderAttr(
        "placeholder",
        editingMessageId.value ? "Edit your message..." : "Type your message..."
      )} class="flex-1 py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-400 text-gray-700"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isSending.value) ? " disabled" : ""} data-v-b6946581><button type="submit" class="bg-blue-500 text-white p-3 rounded-full ml-2 hover:bg-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(
        !inputMessage.value.trim() && !editingMessageId.value || isSending.value || isUploading.value
      ) ? " disabled" : ""} data-v-b6946581>`);
      if (isSending.value || isUploading.value) {
        _push(`<div class="animate-spin rounded-full h-4 w-4 border-t-2 border-white" data-v-b6946581></div>`);
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:paper-plane",
          class: "h-4 w-4"
        }, null, _parent));
      }
      _push(`</button></div><div class="mt-1 flex justify-end" data-v-b6946581>`);
      if (vueExports.unref(webSocketStore).isConnected) {
        _push(`<span class="text-xs text-green-500 flex items-center" title="Connected to real-time messaging" data-v-b6946581><span class="inline-block h-2 w-2 rounded-full bg-green-500 mr-1" data-v-b6946581></span> Live </span>`);
      } else if (vueExports.unref(webSocketStore).isConnecting) {
        _push(`<span class="text-xs text-yellow-500 flex items-center" title="Connecting to real-time messaging" data-v-b6946581><span class="inline-block h-2 w-2 rounded-full bg-yellow-500 mr-1 animate-pulse" data-v-b6946581></span> Connecting... </span>`);
      } else {
        _push(`<span class="text-xs text-red-500 flex items-center cursor-pointer" title="Click to reconnect" data-v-b6946581><span class="inline-block h-2 w-2 rounded-full bg-red-500 mr-1" data-v-b6946581></span> Offline (Click to reconnect) </span>`);
      }
      if (vueExports.unref(webSocketStore).connectionError) {
        _push(`<span class="text-xs text-red-500 ml-2"${serverRenderer_cjs_prodExports.ssrRenderAttr("title", vueExports.unref(webSocketStore).connectionError)} data-v-b6946581>${serverRenderer_cjs_prodExports.ssrInterpolate(getConnectionErrorMessage())}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form></div></div>`);
      if (showInfo.value) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(FriendInfoPanel, {
          username: recipient.value.name,
          friendDetails: adaptRecipientToFriendDetails(recipient.value),
          onClose: ($event) => showInfo.value = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/ChatArea.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ChatArea = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-b6946581"]]);
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    useRouter();
    useAuthStore();
    const recipientId = vueExports.computed(() => route.params.id);
    const isGroup = vueExports.computed(() => route.query.type === "group");
    const chatDetails = vueExports.computed(() => {
      if (isGroup.value) {
        return {
          name: recipientId.value,
          avatar: void 0,
          memberCount: 0
        };
      } else {
        return {
          name: recipientId.value,
          status: "Unknown",
          avatar: void 0
        };
      }
    });
    const chatMessages = vueExports.computed(() => {
      return [];
    });
    vueExports.computed(() => {
      return [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "h-full flex flex-col w-full" }, _attrs))}>`);
      if (!isGroup.value) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(ChatArea, {
          recipientId: recipientId.value,
          recipientName: ((_a = chatDetails.value) == null ? void 0 : _a.name) || recipientId.value,
          chatMessages: chatMessages.value
        }, null, _parent));
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(GroupChatArea, {
          groupId: recipientId.value,
          groupName: ((_b = chatDetails.value) == null ? void 0 : _b.name) || recipientId.value
        }, null, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/chat/messages/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-wkPnpng_.mjs.map
