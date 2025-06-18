import { b as useNuxtApp, c as useAuthStore, e as __nuxt_component_0$1 } from './server.mjs';
import { ref, defineComponent, computed, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { formatDistanceToNow } from 'date-fns';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const useNotifications = () => {
  const notifications = ref([]);
  const unreadCount = ref(0);
  const isLoading = ref(false);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    items_per_page: 10,
    has_more_pages: false
  });
  useNuxtApp();
  const authStore = useAuthStore();
  const API_ENDPOINT = "/api/proxy/notifications";
  const apiCall = async (endpoint, options = {}) => {
    try {
      const defaultOptions = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        credentials: "include"
      };
      if (authStore.token) {
        defaultOptions.headers = {
          ...defaultOptions.headers,
          Authorization: `Bearer ${authStore.token}`
        };
      }
      const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers
        }
      };
      let url;
      if (endpoint.startsWith("http")) {
        url = endpoint;
      } else {
        const endpointPath = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
        url = `${API_ENDPOINT}/${endpointPath}`.replace(/\/+/g, "/");
      }
      console.log(`[Notification API] Calling: ${url}`);
      const response = await fetch(url, mergedOptions);
      if (!response.ok) {
        const contentType2 = response.headers.get("content-type");
        let errorMessage;
        try {
          if (contentType2 && contentType2.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
          } else {
            const errorText = await response.text();
            errorMessage = errorText || `Error ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      const contentType = response.headers.get("content-type");
      if (contentType == null ? void 0 : contentType.includes("application/json")) {
        return await response.json();
      }
      return await response.text();
    } catch (err) {
      console.error(`API call failed for ${endpoint}:`, err);
      throw err;
    }
  };
  const getNotifications = async (page = 1, limit = 20) => {
    isLoading.value = true;
    loading.value = true;
    error.value = null;
    try {
      const offset = (page - 1) * limit;
      const data = await apiCall(`?offset=${offset}&limit=${limit}`, {
        method: "GET"
      });
      console.log("[DEBUG] Response data from notifications API:", data);
      let notificationsData = [];
      let paginationData = {
        current_page: page,
        total_pages: 1,
        total_count: 0,
        items_per_page: limit,
        has_more_pages: false
      };
      if (data && Array.isArray(data)) {
        notificationsData = data.map((notification) => ({
          ...notification,
          id: notification.id || notification._id || `temp-${Date.now()}`,
          content: notification.content || notification.message || "New notification",
          read: notification.read || false,
          created_at: notification.created_at || notification.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
          type: notification.type || "default"
        }));
        paginationData = {
          current_page: page,
          total_pages: data.length > 0 ? Math.ceil(data.length / limit) : 1,
          total_count: data.length,
          items_per_page: limit,
          has_more_pages: data.length >= limit
        };
      } else if (data && (data.notifications || data.data || data.results)) {
        const notificationsArray = data.notifications || data.data || data.results || [];
        notificationsData = notificationsArray.map((notification) => ({
          ...notification,
          id: notification.id || notification._id || `temp-${Date.now()}`,
          content: notification.content || notification.message || "New notification",
          read: notification.read || false,
          created_at: notification.created_at || notification.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
          type: notification.type || "default"
        }));
        if (data.pagination) {
          paginationData = data.pagination;
        } else if (data.meta) {
          paginationData = {
            current_page: data.meta.current_page || data.meta.page || page,
            total_pages: data.meta.total_pages || data.meta.pageCount || 1,
            total_count: data.meta.total_count || data.meta.totalCount || notificationsArray.length,
            items_per_page: data.meta.per_page || data.meta.itemsPerPage || limit,
            has_more_pages: data.meta.has_more_pages || data.meta.hasNextPage || false
          };
        } else {
          paginationData = {
            current_page: page,
            total_pages: notificationsArray.length > 0 ? Math.ceil(notificationsArray.length / limit) : 1,
            total_count: notificationsArray.length,
            items_per_page: limit,
            has_more_pages: notificationsArray.length >= limit
          };
        }
      }
      notifications.value = notificationsData;
      pagination.value = paginationData;
      return {
        notifications: notificationsData,
        pagination: paginationData
      };
    } catch (err) {
      error.value = `Failed to get notifications: ${err.message}`;
      console.error("Error fetching notifications:", err);
      throw err;
    } finally {
      isLoading.value = false;
      loading.value = false;
    }
  };
  const loadMoreNotifications = async () => {
    if (!pagination.value.has_more_pages) {
      return null;
    }
    try {
      const nextPage = pagination.value.current_page + 1;
      const response = await getNotifications(
        nextPage,
        pagination.value.items_per_page
      );
      if (response && response.notifications) {
        notifications.value = [
          ...notifications.value,
          ...response.notifications
        ];
      }
      return response;
    } catch (err) {
      console.error("Error loading more notifications:", err);
      throw err;
    }
  };
  const getUnreadCount = async () => {
    error.value = null;
    try {
      console.log("[Notifications] Fetching unread count...");
      const response = await apiCall("/unread-count", {
        method: "GET"
      });
      console.log("[DEBUG] Unread count response:", response);
      if (response && typeof response.count === "number") {
        unreadCount.value = response.count;
        return response;
      } else if (response && typeof response === "object") {
        const possibleCountProps = ["count", "unread_count", "total", "unread"];
        for (const prop of possibleCountProps) {
          if (typeof response[prop] === "number") {
            console.log(`[Notifications] Found count in property: ${prop}`);
            const count = response[prop];
            unreadCount.value = count;
            return { count };
          }
        }
        console.warn(
          "[Notifications] Invalid unread count response:",
          response
        );
        return { count: unreadCount.value };
      } else if (typeof response === "number") {
        unreadCount.value = response;
        return { count: response };
      } else {
        console.warn("[Notifications] Unexpected response format:", response);
        return { count: unreadCount.value };
      }
    } catch (err) {
      error.value = `Failed to get unread notification count: ${err.message}`;
      console.error("[Notifications] Error fetching unread count:", err);
      return { count: 0 };
    }
  };
  const markAsRead = async (notificationId) => {
    if (!notificationId) {
      console.error("Invalid notification ID provided");
      throw new Error("Invalid notification ID");
    }
    isLoading.value = true;
    loading.value = true;
    error.value = null;
    try {
      const response = await apiCall(`/${notificationId}/read`, {
        method: "PUT",
        body: JSON.stringify({})
      });
      notifications.value = notifications.value.map(
        (notification) => notification.id === notificationId ? { ...notification, read: true } : notification
      );
      if (unreadCount.value > 0) {
        unreadCount.value -= 1;
      }
      return response;
    } catch (err) {
      error.value = err.message || "Failed to mark notification as read";
      console.error("Error marking notification as read:", err);
      throw err;
    } finally {
      isLoading.value = false;
      loading.value = false;
    }
  };
  const markAllAsRead = async () => {
    isLoading.value = true;
    loading.value = true;
    error.value = null;
    try {
      const response = await apiCall("/read-all", {
        method: "PUT",
        body: JSON.stringify({})
      });
      notifications.value = notifications.value.map(
        (notification) => ({
          ...notification,
          read: true
        })
      );
      unreadCount.value = 0;
      return response;
    } catch (err) {
      error.value = err.message || "Failed to mark all notifications as read";
      console.error("Error marking all notifications as read:", err);
      throw err;
    } finally {
      isLoading.value = false;
      loading.value = false;
    }
  };
  const checkHealth = async () => {
    isLoading.value = true;
    loading.value = true;
    error.value = null;
    try {
      const response = await apiCall("/health", {
        method: "GET"
      });
      return response;
    } catch (err) {
      error.value = `Failed to check notification service health: ${err.message}`;
      console.error("Error checking notification service health:", err);
      throw err;
    } finally {
      isLoading.value = false;
      loading.value = false;
    }
  };
  return {
    // State (matching React implementation)
    notifications,
    unreadCount,
    isLoading,
    loading,
    // Alias for React compatibility
    error,
    pagination,
    // Actions (matching React implementation)
    getNotifications,
    loadMoreNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    checkHealth
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "NotificationDropdown",
  __ssrInlineRender: true,
  setup(__props) {
    const { $toast } = useNuxtApp();
    const notificationsStore = useNotifications();
    const dropdownRef = ref(null);
    const isOpen = ref(false);
    const isLoadingMore = ref(false);
    const isRefreshing = ref(false);
    const isMarkingAllAsRead = ref(false);
    const isInitializing = ref(true);
    ref(null);
    const notifications = computed(() => notificationsStore.notifications.value);
    const unreadCount = computed(() => notificationsStore.unreadCount.value);
    const isLoading = computed(() => notificationsStore.isLoading.value);
    const error = computed(() => notificationsStore.error.value);
    const hasMorePages = computed(
      () => notificationsStore.pagination.value.has_more_pages
    );
    const bellButtonClasses = computed(() => [
      "p-2.5 rounded-full transition-all duration-200 relative focus:outline-none focus:ring-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      isInitializing.value ? "bg-gray-100 text-gray-400" : unreadCount.value > 0 ? "bg-blue-100 text-blue-600 hover:bg-blue-200 focus:ring-blue-300 shadow-sm" : "bg-gray-200 text-gray-600 hover:bg-gray-300 focus:ring-gray-300"
    ]);
    const iconClasses = computed(() => [
      "h-4 w-4 transition-transform duration-200",
      unreadCount.value > 0 ? "animate-pulse" : ""
    ]);
    const badgeClasses = computed(() => [
      "absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center",
      "font-medium shadow-sm border-2 border-white transition-all duration-200",
      unreadCount.value > 9 ? "bg-red-500" : "bg-blue-500"
    ]);
    const notificationTitle = computed(() => {
      if (isInitializing.value) return "Loading notifications...";
      if (unreadCount.value === 0) return "No new notifications";
      return `${unreadCount.value} unread notification${unreadCount.value === 1 ? "" : "s"}`;
    });
    const remainingCount = computed(() => {
      const total = notificationsStore.pagination.value.total_count;
      const current = notifications.value.length;
      return Math.max(0, total - current);
    });
    const formatUnreadCount = (count) => {
      if (count > 99) return "99+";
      if (count > 9) return "9+";
      return count.toString();
    };
    const formatTimestamp = (timestamp) => {
      try {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
      } catch (error2) {
        console.warn("Error formatting timestamp:", error2);
        return "Recently";
      }
    };
    const getNotificationIcon = (type) => {
      const iconMap = {
        friend_request: "lucide:user-plus",
        group_invitation: "lucide:users",
        new_message: "lucide:message-circle",
        system: "lucide:settings",
        announcement: "lucide:megaphone",
        reminder: "lucide:clock",
        file_shared: "lucide:file-share",
        default: "lucide:bell"
      };
      return iconMap[type] || iconMap.default;
    };
    const getNotificationIconClasses = (notification) => {
      const baseClasses = "h-6 w-6 rounded-full flex items-center justify-center";
      if (!notification.read) {
        const typeClasses = {
          friend_request: "bg-green-100 text-green-600",
          group_invitation: "bg-blue-100 text-blue-600",
          new_message: "bg-purple-100 text-purple-600",
          system: "bg-gray-100 text-gray-600",
          announcement: "bg-yellow-100 text-yellow-600",
          reminder: "bg-orange-100 text-orange-600",
          file_shared: "bg-indigo-100 text-indigo-600",
          default: "bg-blue-100 text-blue-600"
        };
        return `${baseClasses} ${typeClasses[notification.type] || typeClasses.default}`;
      }
      return `${baseClasses} bg-gray-100 text-gray-400`;
    };
    const getNotificationItemClasses = (notification) => {
      const baseClasses = "px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 focus:outline-none focus:bg-gray-100";
      return notification.read ? baseClasses : `${baseClasses} bg-blue-50 border-l-4 border-blue-400`;
    };
    const getPriorityClasses = (priority) => {
      const priorityClasses = {
        urgent: "bg-red-100 text-red-700",
        high: "bg-orange-100 text-orange-700",
        medium: "bg-yellow-100 text-yellow-700",
        low: "bg-gray-100 text-gray-700"
      };
      return priorityClasses[priority] || priorityClasses.low;
    };
    watch(
      () => isOpen.value,
      async (newValue) => {
        if (newValue && !isLoading.value) {
          console.log(
            "Notification dropdown opened, fetching latest notifications..."
          );
          try {
            await notificationsStore.getNotifications(1, 10);
          } catch (err) {
            console.error("Failed to fetch notifications:", err);
            if (err.message && !err.message.includes("Invalid response format")) {
              $toast == null ? void 0 : $toast.error("Failed to load latest notifications");
            }
          }
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative",
        ref_key: "dropdownRef",
        ref: dropdownRef
      }, _attrs))} data-v-7f7606b5><button class="${ssrRenderClass(bellButtonClasses.value)}"${ssrRenderAttr("title", notificationTitle.value)}${ssrIncludeBooleanAttr(isInitializing.value) ? " disabled" : ""} data-v-7f7606b5>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "fa:bell",
        class: iconClasses.value
      }, null, _parent));
      if (unreadCount.value > 0) {
        _push(`<span class="${ssrRenderClass(badgeClasses.value)}" data-v-7f7606b5>${ssrInterpolate(formatUnreadCount(unreadCount.value))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
      if (isOpen.value) {
        _push(`<div class="absolute z-50 mt-2 -right-10 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden" data-v-7f7606b5><div class="px-4 py-3 border-b border-gray-100 bg-gray-50" data-v-7f7606b5><div class="flex justify-between items-center" data-v-7f7606b5><h3 class="font-semibold text-gray-900 text-sm" data-v-7f7606b5> Notifications `);
        if (unreadCount.value > 0) {
          _push(`<span class="text-blue-600" data-v-7f7606b5> (${ssrInterpolate(unreadCount.value)} unread) </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</h3><div class="flex items-center space-x-2" data-v-7f7606b5><button${ssrIncludeBooleanAttr(isRefreshing.value) ? " disabled" : ""} class="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors" title="Refresh notifications" data-v-7f7606b5>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:refresh-cw",
          class: ["h-3 w-3", { "animate-spin": isRefreshing.value }]
        }, null, _parent));
        _push(`</button>`);
        if (notifications.value.length > 0 && unreadCount.value > 0) {
          _push(`<button${ssrIncludeBooleanAttr(isMarkingAllAsRead.value) ? " disabled" : ""} class="text-xs text-blue-500 hover:text-blue-700 disabled:text-gray-400 transition-colors" data-v-7f7606b5>${ssrInterpolate(isMarkingAllAsRead.value ? "Marking..." : "Mark all as read")}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div><div class="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" data-v-7f7606b5>`);
        if (isLoading.value) {
          _push(`<div class="flex flex-col justify-center items-center py-8" data-v-7f7606b5><div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" data-v-7f7606b5></div><p class="mt-2 text-xs text-gray-500" data-v-7f7606b5>Loading notifications...</p></div>`);
        } else if (notifications.value.length === 0) {
          _push(`<div class="px-4 py-8 text-center" data-v-7f7606b5>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "fa:bell-slash",
            class: "h-8 w-8 text-gray-300 mx-auto mb-2"
          }, null, _parent));
          _push(`<p class="text-sm text-gray-500" data-v-7f7606b5>No notifications yet</p><p class="text-xs text-gray-400 mt-1" data-v-7f7606b5> You&#39;ll see new notifications here </p></div>`);
        } else {
          _push(`<div class="divide-y divide-gray-100" data-v-7f7606b5><!--[-->`);
          ssrRenderList(notifications.value, (notification) => {
            _push(`<div class="${ssrRenderClass(getNotificationItemClasses(notification))}" role="button" tabindex="0" data-v-7f7606b5><div class="flex items-start space-x-3" data-v-7f7606b5><div class="flex-shrink-0 mt-1" data-v-7f7606b5><div class="${ssrRenderClass(getNotificationIconClasses(notification))}" data-v-7f7606b5>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: getNotificationIcon(notification.type),
              class: "h-3 w-3"
            }, null, _parent));
            _push(`</div></div><div class="flex-1 min-w-0" data-v-7f7606b5><div class="flex justify-between items-start" data-v-7f7606b5><div class="flex-1 pr-2" data-v-7f7606b5>`);
            if (notification.title) {
              _push(`<p class="text-sm font-medium text-gray-900 line-clamp-1" data-v-7f7606b5>${ssrInterpolate(notification.title)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<p class="${ssrRenderClass([{ "mt-1": notification.title }, "text-sm text-gray-600 line-clamp-2"])}" data-v-7f7606b5>${ssrInterpolate(notification.content)}</p></div>`);
            if (!notification.read) {
              _push(`<div class="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" aria-label="Unread notification" data-v-7f7606b5></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="flex justify-between items-center mt-2" data-v-7f7606b5><p class="text-xs text-gray-400" data-v-7f7606b5>${ssrInterpolate(formatTimestamp(notification.created_at))}</p>`);
            if (notification.priority && notification.priority !== "low") {
              _push(`<span class="${ssrRenderClass([getPriorityClasses(notification.priority), "text-xs px-1.5 py-0.5 rounded-full"])}" data-v-7f7606b5>${ssrInterpolate(notification.priority)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div>`);
        if (hasMorePages.value && !isLoading.value) {
          _push(`<div class="px-4 py-3 border-t border-gray-100 bg-gray-50" data-v-7f7606b5><button${ssrIncludeBooleanAttr(isLoadingMore.value) ? " disabled" : ""} class="w-full text-sm text-blue-500 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium" data-v-7f7606b5>`);
          if (isLoadingMore.value) {
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:loader-2",
              class: "h-4 w-4 animate-spin inline mr-2"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(isLoadingMore.value ? "Loading more..." : `Load more (${remainingCount.value} remaining)`)}</button></div>`);
        } else {
          _push(`<!---->`);
        }
        if (error.value && !isLoading.value) {
          _push(`<div class="px-4 py-3 border-t border-red-100 bg-red-50" data-v-7f7606b5><div class="flex items-center space-x-2 text-red-600" data-v-7f7606b5>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "lucide:alert-triangle",
            class: "h-4 w-4"
          }, null, _parent));
          _push(`<p class="text-xs" data-v-7f7606b5>${ssrInterpolate(error.value)}</p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NotificationDropdown.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7f7606b5"]]);

export { __nuxt_component_1 as _, useNotifications as u };
//# sourceMappingURL=NotificationDropdown-HE4n8n_y.mjs.map
