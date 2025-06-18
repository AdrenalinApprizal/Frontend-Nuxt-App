import { _ as __nuxt_component_1 } from './NotificationDropdown-BcpzIWTO.mjs';
import { v as vueExports, u as useRouter, b as useAuthStore, s as serverRenderer_cjs_prodExports, c as _imports_0, f as useRoute$1, a as useNuxtApp, d as _sfc_main$6 } from './server.mjs';
import { u as useFriendsStore } from './useFriends-DzoMEWH6.mjs';
import { u as usePresence } from './usePresence-DI3wi_wD.mjs';
import 'date-fns';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import 'node:stream';
import 'devalue';
import 'pinia';

const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "FriendRequest",
  __ssrInlineRender: true,
  props: {
    request: {}
  },
  emits: ["accept", "reject"],
  setup(__props) {
    const props = __props;
    const friendshipId = vueExports.computed(() => {
      return props.request.friendship_id || props.request.id || "";
    });
    const debugInfo = vueExports.computed(() => {
      const info = {
        rawRequest: props.request,
        extractedId: friendshipId.value,
        idSource: props.request.friendship_id ? "friendship_id" : props.request.id ? "id" : "none",
        availableKeys: Object.keys(props.request || {}),
        hasValidId: !!friendshipId.value
      };
      console.log("[FriendRequest] Debug Info:", info);
      if (!info.hasValidId) {
        console.error("[FriendRequest] \u274C NO VALID ID FOUND - Accept/Reject will fail!");
        console.error("[FriendRequest] Available request data:", props.request);
      }
      return info;
    });
    const userData = vueExports.computed(() => {
      const possibleUserData = props.request.user || props.request.sender || props.request.friend || props.request.from_user || props.request;
      console.log("[FriendRequest] User data source:", possibleUserData);
      return possibleUserData;
    });
    const userName = vueExports.computed(() => {
      var _a, _b, _c, _d, _e, _f, _g;
      if (((_a = userData.value) == null ? void 0 : _a.first_name) && ((_b = userData.value) == null ? void 0 : _b.last_name)) {
        const fullName = `${userData.value.first_name} ${userData.value.last_name}`;
        console.log("[FriendRequest] Using first_name + last_name:", fullName);
        return fullName;
      }
      if ((_c = userData.value) == null ? void 0 : _c.first_name) {
        console.log("[FriendRequest] Using first_name only:", userData.value.first_name);
        return userData.value.first_name;
      }
      const name = ((_d = userData.value) == null ? void 0 : _d.full_name) || ((_e = userData.value) == null ? void 0 : _e.name) || ((_f = userData.value) == null ? void 0 : _f.username) || ((_g = userData.value) == null ? void 0 : _g.display_name) || "Unknown User";
      console.log("[FriendRequest] Resolved user name:", name);
      return name;
    });
    const userAvatar = vueExports.computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const avatar = ((_a = userData.value) == null ? void 0 : _a.profile_picture_url) || ((_b = userData.value) == null ? void 0 : _b.avatar_url) || ((_c = userData.value) == null ? void 0 : _c.avatar) || ((_d = userData.value) == null ? void 0 : _d.profile_pic) || ((_e = userData.value) == null ? void 0 : _e.profile_image) || null;
      console.log("[FriendRequest] Resolved user avatar:", avatar);
      console.log("[FriendRequest] Avatar field check:", {
        profile_picture_url: (_f = userData.value) == null ? void 0 : _f.profile_picture_url,
        avatar_url: (_g = userData.value) == null ? void 0 : _g.avatar_url,
        avatar: (_h = userData.value) == null ? void 0 : _h.avatar,
        final_avatar: avatar
      });
      return avatar;
    });
    vueExports.watch(() => props.request, (newRequest) => {
      console.log("[FriendRequest] \u{1F504} Request prop changed:", newRequest);
      debugInfo.value;
    }, { deep: true, immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = _sfc_main$6;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "p-3 bg-white rounded-md border border-gray-200 shadow-sm flex items-center gap-3" }, _attrs))}><div class="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">`);
      if (vueExports.unref(userAvatar)) {
        _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(userAvatar))}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", vueExports.unref(userName))} class="h-full w-full object-cover">`);
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:user",
          class: "h-5 w-5 text-gray-500"
        }, null, _parent));
      }
      _push(`</div><div class="flex-grow"><h4 class="font-medium text-sm text-gray-800">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(userName))}</h4><p class="text-xs text-gray-500">Wants to be your friend</p></div><div class="flex space-x-2"><button class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" aria-label="Reject">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "fa:times",
        class: "h-4 w-4 text-gray-500"
      }, null, _parent));
      _push(`</button><button class="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors" aria-label="Accept">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "fa:check",
        class: "h-4 w-4 text-white"
      }, null, _parent));
      _push(`</button></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/FriendRequest.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "FriendsList",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute$1();
    const { $toast } = useNuxtApp();
    const friendsStore = useFriendsStore();
    const presence = usePresence();
    const authStore = useAuthStore();
    const searchQuery = vueExports.ref("");
    const showAddFriendPopup = vueExports.ref(false);
    const requestsHidden = vueExports.ref(false);
    vueExports.ref("");
    vueExports.ref([]);
    vueExports.ref(false);
    vueExports.ref(false);
    const addByUsername = vueExports.ref("");
    const isAddingByUsername = vueExports.ref(false);
    vueExports.watch(
      () => friendsStore.friends,
      (newFriends) => {
        if (newFriends.length > 0) {
          updateFriendsStatus();
        }
      },
      { deep: true }
    );
    async function updateFriendsStatus() {
      try {
        const userIds = friendsStore.friends.map((friend) => friend.id);
        if (userIds.length > 0) {
          await presence.getUsersStatus(userIds);
        }
      } catch (err) {
        console.error("Error fetching friends' presence status:", err);
      }
    }
    const friends = vueExports.computed(() => friendsStore.friends);
    vueExports.computed(() => friendsStore.pendingRequests);
    const handleAcceptRequest = async (requestId) => {
      try {
        const result = await friendsStore.acceptFriendRequest(requestId);
        $toast.success(result.message);
      } catch (err) {
        $toast.error(err.message || "Failed to accept friend request");
      }
    };
    const handleRejectRequest = async (requestId) => {
      try {
        const result = await friendsStore.rejectFriendRequest(requestId);
        $toast.success(result.message);
      } catch (err) {
        $toast.error(err.message || "Failed to reject friend request");
      }
    };
    const filteredFriends = vueExports.computed(() => {
      if (!searchQuery.value.trim()) {
        return friends.value;
      }
      return friends.value.filter((friend) => {
        const friendName = getFriendDisplayName(friend);
        return friendName.toLowerCase().includes(searchQuery.value.toLowerCase());
      });
    });
    let friendSearchTimer;
    const isSearchingFriends = vueExports.ref(false);
    const searchedFriends = vueExports.ref([]);
    function searchFriendsDebounced() {
      clearTimeout(friendSearchTimer);
      if (!searchQuery.value.trim()) {
        searchedFriends.value = [];
        return;
      }
      isSearchingFriends.value = true;
      friendSearchTimer = setTimeout(async () => {
        try {
          const results = await friendsStore.searchFriends(searchQuery.value);
          searchedFriends.value = results;
        } catch (err) {
          console.error("Error searching friends:", err);
          searchedFriends.value = [];
        } finally {
          isSearchingFriends.value = false;
        }
      }, 300);
    }
    vueExports.watch(
      () => searchQuery.value,
      (newVal) => {
        if (newVal.trim()) {
          searchFriendsDebounced();
        } else {
          searchedFriends.value = [];
        }
      }
    );
    const displayedFriends = vueExports.computed(() => {
      if (searchedFriends.value.length > 0) {
        return searchedFriends.value;
      }
      return filteredFriends.value;
    });
    function getFriendStatus(friendId) {
      return presence.getStatus(friendId);
    }
    function getLastActive(friendId) {
      return presence.getLastActive(friendId);
    }
    function formatLastActive(timestamp) {
      if (!timestamp) return "Offline";
      const lastActive = new Date(timestamp);
      const now = /* @__PURE__ */ new Date();
      const diffMs = now.getTime() - lastActive.getTime();
      const diffMins = Math.floor(diffMs / 6e4);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return "Yesterday";
      return `${diffDays} days ago`;
    }
    const sortedFriends = vueExports.computed(() => {
      return [...displayedFriends.value].sort((a, b) => {
        const statusA = getFriendStatus(a.id);
        const statusB = getFriendStatus(b.id);
        if (statusA === "online" && statusB !== "online") return -1;
        if (statusB === "online" && statusA !== "online") return 1;
        return a.name.localeCompare(b.name);
      });
    });
    const incomingRequests = vueExports.computed(() => {
      var _a, _b;
      console.log("[FriendsList] Computing incoming requests...");
      console.log(
        "[FriendsList] Raw pending requests:",
        friendsStore.pendingRequests
      );
      const currentUserId = (_a = authStore.user) == null ? void 0 : _a.id;
      console.log("[FriendsList] Current user ID:", currentUserId);
      const filtered = ((_b = friendsStore.pendingRequests) == null ? void 0 : _b.filter((request) => {
        console.log("[FriendsList] Processing request:", request);
        if (!request) {
          console.log("[FriendsList] Request is null/undefined, skipping");
          return false;
        }
        if (request.direction === "incoming") {
          console.log(
            "[FriendsList] \u2705 Request marked as incoming via direction field"
          );
          return true;
        }
        if (request.type === "received") {
          console.log(
            "[FriendsList] \u2705 Request marked as incoming via type field"
          );
          return true;
        }
        if (currentUserId && request.recipient_id === currentUserId) {
          console.log(
            "[FriendsList] \u2705 Request is incoming - current user is recipient"
          );
          return true;
        }
        if (!request.direction && !request.type && request.status === "pending") {
          console.log(
            "[FriendsList] \u26A0\uFE0F Request has no direction/type, assuming incoming based on pending status"
          );
          return true;
        }
        console.log(
          "[FriendsList] \u274C Request doesn't match incoming criteria, excluding"
        );
        return false;
      })) || [];
      console.log("[FriendsList] Filtered incoming requests:", filtered);
      console.log("[FriendsList] Incoming requests count:", filtered.length);
      return filtered;
    });
    const onlineFriendsCount = vueExports.computed(() => {
      return sortedFriends.value.filter(
        (friend) => getFriendStatus(friend.id) === "online"
      ).length;
    });
    function getFriendDisplayName(friend) {
      if (friend.name) {
        return friend.name;
      } else if (friend.first_name && friend.last_name) {
        return `${friend.first_name} ${friend.last_name}`;
      } else if (friend.first_name) {
        return friend.first_name;
      } else if (friend.display_name) {
        return friend.display_name;
      } else if (friend.full_name) {
        return friend.full_name;
      } else if (friend.username) {
        return friend.username;
      }
      return "Unknown User";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NotificationDropdown = __nuxt_component_1;
      const _component_Icon = _sfc_main$6;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "h-full flex flex-col p-6 bg-white" }, _attrs))}><div class="mb-6 flex justify-between items-center"><h1 class="text-xl font-bold text-gray-800">Friends</h1><div class="flex items-center space-x-2"><div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NotificationDropdown, null, null, _parent));
      _push(`</div><button class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors shadow-sm" aria-label="Add Friend">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "lucide:user-plus",
        class: "h-5 w-5"
      }, null, _parent));
      _push(`</button></div></div><div class="relative mb-5"><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "lucide:search",
        class: "h-4 w-4 text-gray-400"
      }, null, _parent));
      _push(`</div><input type="text"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(searchQuery))} placeholder="Search friends" class="pl-11 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-sm">`);
      if (vueExports.unref(isSearchingFriends)) {
        _push(`<div class="absolute right-3 top-1/2 transform -translate-y-1/2"><div class="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (vueExports.unref(friendsStore).isLoading) {
        _push(`<div class="flex-1 flex flex-col items-center justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div><p class="mt-2 text-sm text-gray-500">Loading friends...</p></div>`);
      } else if (vueExports.unref(friendsStore).error) {
        _push(`<div class="flex-1 flex items-center justify-center"><div class="bg-red-50 p-4 rounded-lg border border-red-200 text-center"><p class="text-red-500 font-medium">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(friendsStore).error)}</p><button class="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm transition-colors"> Retry </button></div></div>`);
      } else {
        _push(`<!--[-->`);
        if (vueExports.unref(incomingRequests).length > 0) {
          _push(`<div class="mb-6 bg-blue-50 rounded-lg overflow-hidden border border-blue-100"><div class="flex justify-between items-center p-3 cursor-pointer bg-blue-100 hover:bg-blue-200 transition-colors"><h2 class="font-medium text-blue-800 text-sm flex items-center">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:user-plus",
            class: "mr-2 h-3.5 w-3.5"
          }, null, _parent));
          _push(` Friend Requests <span class="ml-2 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(incomingRequests).length)}</span></h2><button class="text-blue-700 hover:text-blue-900 p-1">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: vueExports.unref(requestsHidden) ? "lucide:chevron-down" : "lucide:chevron-up",
            class: "h-4 w-4"
          }, null, _parent));
          _push(`</button></div>`);
          if (!vueExports.unref(requestsHidden)) {
            _push(`<div class="p-3 space-y-2 bg-blue-50"><!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(incomingRequests), (request) => {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$2, {
                key: request.friendship_id || request.id || `request-${Math.random()}`,
                request,
                onAccept: handleAcceptRequest,
                onReject: handleRejectRequest
              }, null, _parent));
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex-1 overflow-auto"><h2 class="font-medium text-gray-500 text-xs uppercase tracking-wider mb-3">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(onlineFriendsCount) > 0 ? "Online" : "All")} Friends `);
        if (vueExports.unref(sortedFriends).length > 0) {
          _push(`<span class="ml-2 text-gray-400"> (${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(sortedFriends).length)}) </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</h2>`);
        if (vueExports.unref(sortedFriends).length === 0) {
          _push(`<div class="h-64 flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-lg border border-gray-100">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:user",
            class: "h-12 w-12 text-gray-300 mb-3"
          }, null, _parent));
          _push(`<p class="text-gray-500 font-medium">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(searchQuery) ? `No results for "${vueExports.unref(searchQuery)}"` : "No friends yet")}</p><p class="text-sm text-gray-400 mt-2"> Add friends to start chatting </p><button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center text-sm">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "lucide:user-plus",
            class: "mr-2 h-3.5 w-3.5"
          }, null, _parent));
          _push(` Add Friend </button></div>`);
        } else {
          _push(`<div class="space-y-2.5"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(vueExports.unref(sortedFriends), (friend) => {
            _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass(`flex items-center p-3 rounded-xl transition-all cursor-pointer ${_ctx.$route.path === `/chat/messages/${friend.id}` ? "bg-blue-50 border border-blue-200 shadow-sm" : "hover:bg-gray-50 border border-transparent"}`)}"><div class="relative mr-3"><div class="h-11 w-11 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">`);
            if (friend.profile_picture_url || friend.avatar) {
              _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", friend.profile_picture_url || friend.avatar)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", friend.name)} class="h-full w-full object-cover">`);
            } else {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                name: "fa:user",
                class: "h-5 w-5 text-gray-500"
              }, null, _parent));
            }
            _push(`</div>`);
            if (getFriendStatus(friend.id) === "online") {
              _push(`<div class="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white"></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="flex-1 min-w-0"><div class="flex justify-between items-center"><h3 class="font-semibold text-gray-900 truncate">${serverRenderer_cjs_prodExports.ssrInterpolate(getFriendDisplayName(friend))}</h3><span class="text-xs text-gray-500 whitespace-nowrap ml-2">${serverRenderer_cjs_prodExports.ssrInterpolate(friend.last_active ? formatLastActive(friend.last_active) : formatLastActive(getLastActive(friend.id)))}</span></div><div class="flex items-center mt-0.5"><p class="text-xs text-gray-500 truncate flex-1">${serverRenderer_cjs_prodExports.ssrInterpolate(getFriendStatus(friend.id) === "online" ? "Active now" : friend.username ? `@${friend.username}` : friend.email || "offline")}</p>`);
            if (friend.unread_count && friend.unread_count > 0) {
              _push(`<span class="inline-flex items-center justify-center px-2 py-0.5 ml-2 text-xs font-medium leading-none text-white bg-red-500 rounded-full">${serverRenderer_cjs_prodExports.ssrInterpolate(friend.unread_count)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (_ctx.$route.path === `/chat/messages/${friend.id}`) {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                name: "lucide:message-square",
                class: "text-blue-500 ml-1 h-3.5 w-3.5"
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div><!--]-->`);
      }
      if (vueExports.unref(showAddFriendPopup)) {
        _push(`<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"><div class="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all"><div class="flex justify-between items-center mb-5"><h2 class="text-xl font-semibold text-gray-800 flex items-center">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:user-plus",
          class: "mr-2 h-5 w-5 text-blue-500"
        }, null, _parent));
        _push(` Add a Friend </h2><button type="button" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Close">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:times",
          class: "h-4 w-4"
        }, null, _parent));
        _push(`</button></div><p class="text-sm text-gray-600 mb-4"> You can add a friend with their username. It&#39;s case sensitive! </p><form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Username </label><div class="relative"><input type="text"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(addByUsername))} placeholder="Enter friend&#39;s username" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-10 text-gray-900 placeholder-gray-500"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isAddingByUsername)) ? " disabled" : ""}><div class="absolute left-3 top-1/2 transform -translate-y-1/2">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:user",
          class: "h-4 w-4 text-gray-400"
        }, null, _parent));
        _push(`</div></div></div><div class="flex justify-end space-x-3 pt-2"><button type="button" class="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"> Cancel </button><button type="submit" class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(!vueExports.unref(addByUsername).trim() || vueExports.unref(isAddingByUsername)) ? " disabled" : ""}>`);
        if (vueExports.unref(isAddingByUsername)) {
          _push(`<div class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>`);
        } else {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "lucide:user-plus",
            class: "mr-2 h-4 w-4"
          }, null, _parent));
        }
        _push(` ${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(isAddingByUsername) ? "Sending..." : "Send Request")}</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/FriendsList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "friends",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useAuthStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ChatFriendsList = _sfc_main$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "h-screen flex" }, _attrs))}><div class="w-80 border-r border-gray-200 flex-shrink-0">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ChatFriendsList, null, null, _parent));
      _push(`</div><div class="flex-1 bg-gray-50 flex flex-col items-center justify-center"><div class="text-center max-w-md"><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", _imports_0)} alt="Logo" class="w-24 h-24 mx-auto mb-6 rounded-full"><h2 class="text-2xl font-semibold text-gray-800 mb-2"> Welcome to Chat </h2><p class="text-gray-600"> Select a conversation from the list or start a new one to begin messaging. </p></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/chat/friends.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=friends-D6cDy8Lz.mjs.map
