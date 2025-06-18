import { u as useRouter, e as useRoute$1, a as useNuxtApp, b as useAuthStore, f as __nuxt_component_0, c as _imports_0, d as useRoute, _ as __nuxt_component_0$1$1 } from './server.mjs';
import { defineComponent, ref, provide, readonly, mergeProps, computed, watch, resolveComponent, withCtx, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useNotifications, _ as __nuxt_component_0$1 } from './NotificationDropdown-cZhdRx1L.mjs';
import { u as useFriendsStore } from './useFriends-Bggh7amy.mjs';
import { u as useGroupsStore } from './useGroups-CJVvUzW6.mjs';
import { u as useWebSocket, s as setInterval, a as useMessagesStore, _ as __nuxt_component_0$2, f as formatMessageTimestamp } from './OptimizedAvatar-DSoaiwcz.mjs';
import { u as usePresence } from './usePresence-CKauVF0L.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'date-fns';
import 'mitt';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MessagesList",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    computed(() => authStore.user);
    const route = useRoute();
    const { $toast } = useNuxtApp();
    const groupsStore = useGroupsStore();
    const friendsStore = useFriendsStore();
    const messagesStore = useMessagesStore();
    const presence = usePresence();
    useWebSocket();
    const messages = ref([]);
    ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const activeTab = ref("all");
    const searchQuery = ref("");
    const showNewChatPopup = ref(false);
    const showAddFriendPopup = ref(false);
    const showCreateGroupPopup = ref(false);
    const friendUsername = ref("");
    const isAddingFriend = ref(false);
    const groupName = ref("");
    const groupDescription = ref("");
    const isRefreshing = ref(false);
    const isTyping = ref({});
    const friendSelections = ref({});
    ref(null);
    const autoRefreshEnabled = ref(false);
    const lastRefreshTime = ref("");
    ref(null);
    ref(0);
    ref(50);
    ref(true);
    const filteredMessages = computed(() => {
      let filtered = messages.value;
      if (activeTab.value !== "all") {
        filtered = filtered.filter((message) => {
          if (activeTab.value === "friends") return message.type === "friend";
          if (activeTab.value === "groups") return message.type === "group";
          return true;
        });
      }
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter((message) => {
          const nameMatch = message.sender.name.toLowerCase().includes(query);
          const contentMatch = message.content.toLowerCase().includes(query);
          return nameMatch || contentMatch;
        });
      }
      return filtered;
    });
    const sortedMessages = computed(() => {
      return [...filteredMessages.value].sort((a, b) => {
        if (a.unreadCount && !b.unreadCount) return -1;
        if (!a.unreadCount && b.unreadCount) return 1;
        const aHasMessages = a.hasMessages ? 1 : 0;
        const bHasMessages = b.hasMessages ? 1 : 0;
        if (aHasMessages !== bHasMessages) {
          return bHasMessages - aHasMessages;
        }
        const aTime = new Date(a.lastActivity || a.timestamp || "").getTime();
        const bTime = new Date(b.lastActivity || b.timestamp || "").getTime();
        return bTime - aTime;
      });
    });
    const availableFriendsForGroup = computed(() => {
      return friendsStore.friends.map((friend) => {
        const typedFriend = friend;
        return {
          ...friend,
          name: buildFriendName(typedFriend),
          selected: !!friendSelections.value[friend.id]
        };
      });
    });
    const selectedFriendsCount = computed(() => {
      return Object.values(friendSelections.value).filter(Boolean).length;
    });
    const buildFriendName = (friend) => {
      if (friend.first_name && friend.last_name) {
        return `${friend.first_name} ${friend.last_name}`;
      } else if (friend.full_name) {
        return friend.full_name;
      } else if (friend.display_name) {
        return friend.display_name;
      } else if (friend.name) {
        return friend.name;
      } else if (friend.username) {
        return friend.username;
      } else {
        return "User";
      }
    };
    const formatTimestamp = (timestamp) => {
      if (!timestamp) return "Never";
      return formatMessageTimestamp({ timestamp, format: "relative" });
    };
    const getLastMessageForConversation = async (conversationId, type) => {
      try {
        if (type === "group") {
          const response = await groupsStore.getGroupMessages(conversationId, 1, 1);
          if (response && response.data && response.data.length > 0) {
            return response.data[0];
          }
        } else {
          const response = await messagesStore.getMessages({
            target_id: conversationId,
            type: "private",
            limit: 1,
            page: 1
          });
          if (response && response.data && response.data.length > 0) {
            return response.data[0];
          }
        }
        return null;
      } catch (error2) {
        console.error(
          `[MessagesList] Failed to get last message for ${type} ${conversationId}:`,
          error2
        );
        return null;
      }
    };
    const transformGroupsToMessages = async (groups) => {
      const validGroups = await Promise.all(
        groups.filter((group) => group && group.id).map(async (group) => {
          let lastMessage = group.last_message || {};
          console.log(
            `[MessagesList] Group ${group.name || group.id} last_message:`,
            lastMessage
          );
          if (!lastMessage || !Object.keys(lastMessage).length) {
            lastMessage = await getLastMessageForConversation(group.id, "group");
          }
          let messageContent = "";
          let hasMessage = false;
          if (lastMessage && typeof lastMessage === "object") {
            messageContent = lastMessage.content || lastMessage.message_content || lastMessage.text || lastMessage.message || "";
            hasMessage = !!(messageContent && messageContent.trim() !== "");
          }
          const lastActivity = (lastMessage == null ? void 0 : lastMessage.sent_at) || (lastMessage == null ? void 0 : lastMessage.created_at) || group.updated_at || group.created_at || (/* @__PURE__ */ new Date()).toISOString();
          let content;
          if (hasMessage) {
            content = lastMessage.sender_name ? `${lastMessage.sender_name}: ${messageContent}` : messageContent;
          } else {
            content = "No messages yet";
          }
          return {
            id: group.id,
            sender: {
              name: group.name || "Unnamed Group",
              profile_picture_url: group.avatar_url || group.profile_picture_url || null,
              id: group.id
            },
            content,
            timestamp: hasMessage ? formatTimestamp(lastMessage.sent_at || lastMessage.created_at) : "",
            formattedTime: formatTimestamp(lastActivity),
            readStatus: group.unread_count && group.unread_count > 0 ? "unread" : "read",
            unreadCount: group.unread_count && group.unread_count > 0 ? group.unread_count : void 0,
            type: "group",
            lastActivity,
            isTyping: false,
            hasMessages: hasMessage,
            memberCount: group.member_count
          };
        })
      );
      return validGroups.sort((a, b) => {
        const aHasMessages = a.hasMessages ? 1 : 0;
        const bHasMessages = b.hasMessages ? 1 : 0;
        if (aHasMessages !== bHasMessages) {
          return bHasMessages - aHasMessages;
        }
        const aTime = new Date(a.lastActivity || "").getTime();
        const bTime = new Date(b.lastActivity || "").getTime();
        return bTime - aTime;
      });
    };
    const transformFriendsToMessages = async (friends2) => {
      const friendMessages = await Promise.all(
        friends2.map(async (friend) => {
          const userId = friend.id;
          const friendStatus = presence.getStatus(userId);
          let lastMessage = friend.last_message;
          console.log(
            `[MessagesList] Friend ${friend.username || friend.name || friend.id} last_message:`,
            lastMessage
          );
          if (!lastMessage || !Object.keys(lastMessage).length) {
            lastMessage = await getLastMessageForConversation(friend.id, "friend");
          }
          let messageContent = "";
          let hasMessage = false;
          if (lastMessage && typeof lastMessage === "object") {
            messageContent = lastMessage.content || lastMessage.message_content || lastMessage.text || lastMessage.message || "";
            hasMessage = !!(messageContent && messageContent.trim() !== "");
          }
          const lastActivity = friend.last_active || (lastMessage == null ? void 0 : lastMessage.sent_at) || (lastMessage == null ? void 0 : lastMessage.created_at) || friend.created_at || (/* @__PURE__ */ new Date()).toISOString();
          const displayName = buildFriendName(friend);
          return {
            id: friend.id,
            sender: {
              name: displayName,
              profile_picture_url: friend.profile_picture_url || null,
              id: friend.id,
              status: friendStatus === "online" ? "online" : "offline"
            },
            content: hasMessage ? messageContent : "No messages yet",
            timestamp: hasMessage ? formatTimestamp(lastMessage.sent_at || lastMessage.created_at) : friendStatus === "online" ? "Online" : "Offline",
            formattedTime: formatTimestamp(lastActivity),
            readStatus: friend.unread_count && friend.unread_count > 0 ? "unread" : "read",
            unreadCount: friend.unread_count && friend.unread_count > 0 ? friend.unread_count : void 0,
            type: "friend",
            lastActivity,
            isTyping: isTyping.value[userId] || false,
            hasMessages: hasMessage
          };
        })
      );
      return friendMessages.sort((a, b) => {
        const aHasMessages = a.hasMessages ? 1 : 0;
        const bHasMessages = b.hasMessages ? 1 : 0;
        if (aHasMessages !== bHasMessages) {
          return bHasMessages - aHasMessages;
        }
        const aTime = new Date(a.lastActivity).getTime();
        const bTime = new Date(b.lastActivity).getTime();
        return bTime - aTime;
      });
    };
    const getUserStatus = (userId) => {
      return presence.getStatus(userId) === "online" ? "online" : "offline";
    };
    const isCurrentlyActive = (message) => {
      const currentPath = route.path;
      const expectedPath = `/chat/messages/${message.id}`;
      if (message.type === "group") {
        return currentPath === expectedPath && route.query.type === "group";
      } else {
        return currentPath === expectedPath && route.query.type !== "group";
      }
    };
    const buildMessageUrl = (message) => {
      const baseUrl = `/chat/messages/${message.id}`;
      if (message.type === "group") {
        return `${baseUrl}?type=group&name=${encodeURIComponent(
          message.sender.name
        )}`;
      } else {
        return `${baseUrl}?name=${encodeURIComponent(message.sender.name)}`;
      }
    };
    const formatMessageContent = (message) => {
      if (!message.content || message.content.trim() === "") {
        return message.type === "friend" ? "No messages yet" : "No messages in this group";
      }
      return message.content;
    };
    watch(
      () => friendsStore.friends,
      async (newFriends) => {
        if (newFriends && Array.isArray(newFriends)) {
          const friendMessages = await transformFriendsToMessages(newFriends);
          messages.value = [
            ...messages.value.filter((msg) => msg.type !== "friend"),
            ...friendMessages
          ];
        }
      },
      { immediate: true }
    );
    watch(
      () => groupsStore.groups,
      async (newGroups) => {
        if (newGroups && Array.isArray(newGroups)) {
          const groupMessages = await transformGroupsToMessages(newGroups);
          messages.value = [
            ...messages.value.filter((msg) => msg.type !== "group"),
            ...groupMessages
          ];
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = resolveComponent("Icon");
      const _component_NotificationDropdown = __nuxt_component_0$1;
      const _component_NuxtLink = __nuxt_component_0$1$1;
      const _component_OptimizedAvatar = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-full flex flex-col p-6 bg-white" }, _attrs))} data-v-3b837865><div class="mb-6 flex justify-between items-center" data-v-3b837865><div class="flex items-center" data-v-3b837865><h1 class="text-xl font-bold text-gray-800" data-v-3b837865>Messages</h1><button${ssrIncludeBooleanAttr(isRefreshing.value) ? " disabled" : ""} class="ml-2 p-1.5 text-gray-400 hover:text-blue-500 rounded-full focus:outline-none transition-colors" title="Refresh Messages" data-v-3b837865>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:refresh-cw",
        class: ["h-4 w-4", { "animate-spin": isRefreshing.value }]
      }, null, _parent));
      _push(`</button>`);
      if (autoRefreshEnabled.value) {
        _push(`<div class="ml-2 flex items-center text-xs text-green-600"${ssrRenderAttr("title", `Auto-refresh enabled. Last refresh: ${lastRefreshTime.value}`)} data-v-3b837865><div class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" data-v-3b837865></div><span class="hidden sm:inline" data-v-3b837865>Auto</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center space-x-2" data-v-3b837865><button class="${ssrRenderClass(`p-1.5 rounded-full focus:outline-none transition-colors ${autoRefreshEnabled.value ? "text-green-500 hover:text-green-600" : "text-gray-400 hover:text-gray-500"}`)}"${ssrRenderAttr(
        "title",
        autoRefreshEnabled.value ? "Disable Auto-refresh" : "Enable Auto-refresh"
      )} data-v-3b837865>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: autoRefreshEnabled.value ? "lucide:refresh-cw" : "lucide:pause-circle",
        class: "h-4 w-4"
      }, null, _parent));
      _push(`</button>`);
      _push(ssrRenderComponent(_component_NotificationDropdown, null, null, _parent));
      _push(`<button class="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors" title="New Chat" data-v-3b837865>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:plus",
        class: "h-4 w-4"
      }, null, _parent));
      _push(`</button></div></div><div class="flex mb-5 border-b border-gray-200" data-v-3b837865><button class="${ssrRenderClass(`py-2.5 px-5 text-sm font-medium transition-colors ${activeTab.value === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`)}" data-v-3b837865> All </button><button class="${ssrRenderClass(`py-2.5 px-5 text-sm font-medium transition-colors ${activeTab.value === "friends" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`)}" data-v-3b837865> Friends </button><button class="${ssrRenderClass(`py-2.5 px-5 text-sm font-medium transition-colors ${activeTab.value === "groups" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`)}" data-v-3b837865> Groups </button></div><div class="relative mb-5" data-v-3b837865><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" data-v-3b837865>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:search",
        class: "h-4 w-4 text-gray-400"
      }, null, _parent));
      _push(`</div><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search messages" class="pl-11 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-sm" data-v-3b837865></div>`);
      if (isLoading.value) {
        _push(`<div class="flex-1 flex items-center justify-center" data-v-3b837865><div class="flex flex-col items-center" data-v-3b837865><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" data-v-3b837865></div><p class="mt-2 text-sm text-gray-500" data-v-3b837865>Loading...</p></div></div>`);
      } else if (error.value) {
        _push(`<div class="flex-1 flex items-center justify-center" data-v-3b837865><div class="flex flex-col items-center text-center" data-v-3b837865>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:alert-triangle",
          class: "h-8 w-8 text-red-500 mb-2"
        }, null, _parent));
        _push(`<p class="text-red-500" data-v-3b837865>${ssrInterpolate(error.value)}</p><button class="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm" data-v-3b837865> Try Again </button></div></div>`);
      } else {
        _push(`<div class="flex-1 overflow-auto" data-v-3b837865>`);
        if (filteredMessages.value.length === 0) {
          _push(`<div class="h-full flex flex-col items-center justify-center text-center p-6" data-v-3b837865>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "fa:envelope",
            class: "h-12 w-12 text-gray-300 mb-3"
          }, null, _parent));
          _push(`<p class="text-gray-500 font-medium" data-v-3b837865>No conversations yet</p><p class="text-sm text-gray-400 mt-2" data-v-3b837865> Start chatting with friends or groups to see them here </p></div>`);
        } else {
          _push(`<div class="space-y-3" data-v-3b837865><!--[-->`);
          ssrRenderList(sortedMessages.value, (message) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: message.id,
              to: buildMessageUrl(message)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                var _a, _b, _c, _d, _e, _f;
                if (_push2) {
                  _push2(`<div class="${ssrRenderClass(`flex items-start p-4 rounded-lg transition-colors ${isCurrentlyActive(message) ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50"}`)}" data-v-3b837865${_scopeId}><div class="relative" data-v-3b837865${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_OptimizedAvatar, {
                    src: (_a = message.sender) == null ? void 0 : _a.profile_picture_url,
                    alt: ((_b = message.sender) == null ? void 0 : _b.name) || "User",
                    size: "md",
                    class: "mr-3 flex-shrink-0",
                    "fallback-icon": message.type === "friend" ? "fa:user" : "fa:users"
                  }, null, _parent2, _scopeId));
                  if (message.type === "friend") {
                    _push2(`<div class="${ssrRenderClass(`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getUserStatus(message.id) === "online" ? "bg-green-500" : "bg-gray-400"}`)}" data-v-3b837865${_scopeId}></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div><div class="flex-1 min-w-0" data-v-3b837865${_scopeId}><div class="flex justify-between items-start" data-v-3b837865${_scopeId}><h3 class="font-medium text-gray-900 truncate text-sm" data-v-3b837865${_scopeId}>${ssrInterpolate((_c = message.sender) == null ? void 0 : _c.name)}</h3><span class="text-xs text-gray-500 ml-1 whitespace-nowrap" data-v-3b837865${_scopeId}>${ssrInterpolate(message.timestamp)}</span></div><div class="flex justify-between items-start mt-1" data-v-3b837865${_scopeId}><div class="flex-1 relative" data-v-3b837865${_scopeId}>`);
                  if (message.isTyping) {
                    _push2(`<p class="text-xs text-blue-500 truncate flex items-center" data-v-3b837865${_scopeId}><span class="mr-1" data-v-3b837865${_scopeId}>Typing</span><span class="flex" data-v-3b837865${_scopeId}>`);
                    _push2(ssrRenderComponent(_component_Icon, {
                      name: "fa:circle",
                      class: "animate-pulse h-1 w-1 mx-0.5"
                    }, null, _parent2, _scopeId));
                    _push2(ssrRenderComponent(_component_Icon, {
                      name: "fa:circle",
                      class: "animate-pulse h-1 w-1 mx-0.5",
                      style: { "animation-delay": "100ms" }
                    }, null, _parent2, _scopeId));
                    _push2(ssrRenderComponent(_component_Icon, {
                      name: "fa:circle",
                      class: "animate-pulse h-1 w-1 mx-0.5",
                      style: { "animation-delay": "200ms" }
                    }, null, _parent2, _scopeId));
                    _push2(`</span></p>`);
                  } else {
                    _push2(`<p class="text-xs text-gray-600 truncate" data-v-3b837865${_scopeId}>${ssrInterpolate(formatMessageContent(message))}</p>`);
                  }
                  _push2(`</div>`);
                  if (message.unreadCount && message.unreadCount > 0) {
                    _push2(`<div class="ml-2 h-5 w-5 min-w-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0" data-v-3b837865${_scopeId}>${ssrInterpolate(message.unreadCount)}</div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div></div>`);
                } else {
                  return [
                    createVNode("div", {
                      class: `flex items-start p-4 rounded-lg transition-colors ${isCurrentlyActive(message) ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50"}`
                    }, [
                      createVNode("div", { class: "relative" }, [
                        createVNode(_component_OptimizedAvatar, {
                          src: (_d = message.sender) == null ? void 0 : _d.profile_picture_url,
                          alt: ((_e = message.sender) == null ? void 0 : _e.name) || "User",
                          size: "md",
                          class: "mr-3 flex-shrink-0",
                          "fallback-icon": message.type === "friend" ? "fa:user" : "fa:users"
                        }, null, 8, ["src", "alt", "fallback-icon"]),
                        message.type === "friend" ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: `absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getUserStatus(message.id) === "online" ? "bg-green-500" : "bg-gray-400"}`
                        }, null, 2)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex-1 min-w-0" }, [
                        createVNode("div", { class: "flex justify-between items-start" }, [
                          createVNode("h3", { class: "font-medium text-gray-900 truncate text-sm" }, toDisplayString((_f = message.sender) == null ? void 0 : _f.name), 1),
                          createVNode("span", { class: "text-xs text-gray-500 ml-1 whitespace-nowrap" }, toDisplayString(message.timestamp), 1)
                        ]),
                        createVNode("div", { class: "flex justify-between items-start mt-1" }, [
                          createVNode("div", { class: "flex-1 relative" }, [
                            message.isTyping ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-xs text-blue-500 truncate flex items-center"
                            }, [
                              createVNode("span", { class: "mr-1" }, "Typing"),
                              createVNode("span", { class: "flex" }, [
                                createVNode(_component_Icon, {
                                  name: "fa:circle",
                                  class: "animate-pulse h-1 w-1 mx-0.5"
                                }),
                                createVNode(_component_Icon, {
                                  name: "fa:circle",
                                  class: "animate-pulse h-1 w-1 mx-0.5",
                                  style: { "animation-delay": "100ms" }
                                }),
                                createVNode(_component_Icon, {
                                  name: "fa:circle",
                                  class: "animate-pulse h-1 w-1 mx-0.5",
                                  style: { "animation-delay": "200ms" }
                                })
                              ])
                            ])) : (openBlock(), createBlock("p", {
                              key: 1,
                              class: "text-xs text-gray-600 truncate"
                            }, toDisplayString(formatMessageContent(message)), 1))
                          ]),
                          message.unreadCount && message.unreadCount > 0 ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "ml-2 h-5 w-5 min-w-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0"
                          }, toDisplayString(message.unreadCount), 1)) : createCommentVNode("", true)
                        ])
                      ])
                    ], 2)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div>`);
      }
      if (showNewChatPopup.value) {
        _push(`<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" data-v-3b837865><div class="bg-white rounded-lg shadow-lg p-6 w-96 max-w-md mx-4" data-v-3b837865><div class="flex justify-between items-center mb-4" data-v-3b837865><h3 class="text-lg font-semibold text-gray-900" data-v-3b837865>Start New Chat</h3><button class="text-gray-500 hover:text-gray-700" data-v-3b837865>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "fa:times",
          class: "h-5 w-5"
        }, null, _parent));
        _push(`</button></div><div class="space-y-3" data-v-3b837865><button class="flex items-center w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors" data-v-3b837865><div class="p-2 bg-blue-100 rounded-full mr-3" data-v-3b837865>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:user-plus",
          class: "h-5 w-5 text-blue-600"
        }, null, _parent));
        _push(`</div><div class="text-left" data-v-3b837865><div class="font-medium text-black" data-v-3b837865>Add a Friend</div><div class="text-xs text-gray-600" data-v-3b837865>Find and add new friends</div></div></button><button class="flex items-center w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors" data-v-3b837865><div class="p-2 bg-green-100 rounded-full mr-3" data-v-3b837865>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:users",
          class: "h-5 w-5 text-green-600"
        }, null, _parent));
        _push(`</div><div class="text-left" data-v-3b837865><div class="font-medium text-black" data-v-3b837865>Create a Group</div><div class="text-xs text-gray-600" data-v-3b837865> Start a group conversation </div></div></button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showAddFriendPopup.value) {
        _push(`<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" data-v-3b837865><div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform transition-all" data-v-3b837865><div class="flex justify-between items-center mb-4" data-v-3b837865><h2 class="text-lg font-semibold text-gray-800" data-v-3b837865>Add a Friend</h2><button class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors" data-v-3b837865>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "fa:times",
          class: "h-4 w-4"
        }, null, _parent));
        _push(`</button></div><div class="mb-4" data-v-3b837865><label class="block text-sm font-medium text-gray-700 mb-2" data-v-3b837865>Username</label><input type="text"${ssrRenderAttr("value", friendUsername.value)} placeholder="Enter username" class="w-full p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" data-v-3b837865></div><div class="flex justify-end" data-v-3b837865><button class="px-4 py-2 mr-2 text-gray-700 hover:bg-gray-100 rounded transition-colors" data-v-3b837865> Cancel </button><button${ssrIncludeBooleanAttr(!friendUsername.value.trim() || isAddingFriend.value) ? " disabled" : ""} class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors" data-v-3b837865>`);
        if (isAddingFriend.value) {
          _push(`<div class="flex items-center" data-v-3b837865><div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" data-v-3b837865></div> Adding... </div>`);
        } else {
          _push(`<span data-v-3b837865>Add Friend</span>`);
        }
        _push(`</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showCreateGroupPopup.value) {
        _push(`<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" data-v-3b837865><div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform transition-all" data-v-3b837865><div class="flex justify-between items-center mb-4" data-v-3b837865><h2 class="text-lg font-semibold text-gray-800" data-v-3b837865>Create a Group</h2><button class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors" data-v-3b837865>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "fa:times",
          class: "h-4 w-4"
        }, null, _parent));
        _push(`</button></div><div class="mb-4" data-v-3b837865><label class="block text-sm font-medium text-gray-700 mb-2" data-v-3b837865>Group Name</label><input type="text"${ssrRenderAttr("value", groupName.value)} placeholder="Enter group name" class="w-full p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" data-v-3b837865></div><div class="mb-4" data-v-3b837865><label class="block text-sm font-medium text-gray-700 mb-2" data-v-3b837865>Description</label><textarea placeholder="Enter group description" class="w-full p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all" rows="2" data-v-3b837865>${ssrInterpolate(groupDescription.value)}</textarea></div><div class="mb-4" data-v-3b837865><label class="block text-sm font-medium text-gray-700 mb-2" data-v-3b837865>Select Friends</label><div class="max-h-40 text-black overflow-y-auto border border-gray-200 rounded-lg" data-v-3b837865><!--[-->`);
        ssrRenderList(availableFriendsForGroup.value, (friend) => {
          _push(`<div class="${ssrRenderClass(`flex items-center p-2 cursor-pointer hover:bg-gray-50 transition-colors ${friend.selected ? "bg-blue-50" : ""}`)}" data-v-3b837865>`);
          _push(ssrRenderComponent(_component_OptimizedAvatar, {
            src: friend.profile_picture_url,
            alt: friend.name,
            size: "sm",
            class: "mr-2 flex-shrink-0",
            "fallback-icon": "fa:user"
          }, null, _parent));
          _push(`<div class="flex-1" data-v-3b837865><p class="font-medium text-sm text-black" data-v-3b837865>${ssrInterpolate(friend.name)}</p><p class="text-gray-700 text-xs" data-v-3b837865>@${ssrInterpolate(friend.username)}</p></div><input type="checkbox"${ssrIncludeBooleanAttr(!!friend.selected) ? " checked" : ""} class="h-4 w-4 text-blue-600" data-v-3b837865></div>`);
        });
        _push(`<!--]--></div></div><div class="flex justify-end" data-v-3b837865><button class="px-4 py-2 mr-2 text-gray-700 hover:bg-gray-100 rounded transition-colors" data-v-3b837865> Cancel </button><button${ssrIncludeBooleanAttr(!groupName.value.trim() || !selectedFriendsCount.value) ? " disabled" : ""} class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors" data-v-3b837865> Create Group </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessagesList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const MessagesList = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-3b837865"]]);
const AUTO_REFRESH_INTERVAL = 3e4;
const MAX_REFRESH_ATTEMPTS = 10;
const SLOW_REFRESH_INTERVAL = 6e4;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "messages",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useRoute$1();
    const { $toast } = useNuxtApp();
    const authStore = useAuthStore();
    const notifications = useNotifications();
    const friendsStore = useFriendsStore();
    const groupsStore = useGroupsStore();
    useWebSocket();
    usePresence();
    ref(false);
    const isAutoRefreshEnabled = ref(true);
    const refreshInterval = ref(null);
    const lastRefreshTime = ref(/* @__PURE__ */ new Date());
    const refreshCount = ref(0);
    const performAutoRefresh = async () => {
      if (!isAutoRefreshEnabled.value || !authStore.isAuthenticated) {
        return;
      }
      try {
        console.log(`[Auto-Refresh] Performing refresh #${refreshCount.value + 1}`);
        lastRefreshTime.value = /* @__PURE__ */ new Date();
        refreshCount.value++;
        const refreshPromises = [
          // Refresh friends list
          friendsStore.getFriends().catch((error) => {
            console.warn("[Auto-Refresh] Failed to refresh friends:", error);
          }),
          // Refresh groups list
          groupsStore.getGroups().catch((error) => {
            console.warn("[Auto-Refresh] Failed to refresh groups:", error);
          }),
          // Refresh notifications count
          notifications.getUnreadCount().catch((error) => {
            console.warn("[Auto-Refresh] Failed to refresh notifications:", error);
          })
        ];
        await Promise.allSettled(refreshPromises);
        console.log(`[Auto-Refresh] Completed refresh #${refreshCount.value}`);
        if (refreshCount.value % 5 === 0) {
          $toast.success("Data refreshed");
        }
      } catch (error) {
        console.error("[Auto-Refresh] Error during auto-refresh:", error);
        if (refreshCount.value % 3 === 0) {
          $toast.error("Failed to refresh data");
        }
      }
    };
    const startAutoRefresh = () => {
      if (refreshInterval.value) {
        clearInterval(refreshInterval.value);
      }
      const interval = refreshCount.value >= MAX_REFRESH_ATTEMPTS ? SLOW_REFRESH_INTERVAL : AUTO_REFRESH_INTERVAL;
      refreshInterval.value = setInterval();
      isAutoRefreshEnabled.value = true;
      console.log(`[Auto-Refresh] Started with ${interval}ms interval`);
    };
    const stopAutoRefresh = () => {
      if (refreshInterval.value) {
        clearInterval(refreshInterval.value);
        refreshInterval.value = null;
      }
      isAutoRefreshEnabled.value = false;
      console.log("[Auto-Refresh] Stopped");
    };
    const toggleAutoRefresh = () => {
      if (isAutoRefreshEnabled.value) {
        stopAutoRefresh();
        $toast.info("Auto-refresh disabled");
      } else {
        startAutoRefresh();
        $toast.success("Auto-refresh enabled");
      }
    };
    provide("autoRefresh", {
      refresh: performAutoRefresh,
      toggle: toggleAutoRefresh,
      isEnabled: readonly(isAutoRefreshEnabled),
      lastRefresh: readonly(lastRefreshTime),
      refreshCount: readonly(refreshCount)
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-screen flex" }, _attrs))}><div class="w-80 border-r border-gray-200">`);
      _push(ssrRenderComponent(MessagesList, null, null, _parent));
      _push(`</div><div class="flex-1 flex">`);
      if (_ctx.$route.params.id) {
        _push(ssrRenderComponent(_component_NuxtPage, { class: "flex-1" }, null, _parent));
      } else {
        _push(`<div class="flex-1 bg-gray-50 flex flex-col items-center justify-center"><div class="text-center max-w-md"><img${ssrRenderAttr("src", _imports_0)} alt="Logo" class="w-24 h-24 mx-auto mb-6 rounded-full"><h2 class="text-2xl font-semibold text-gray-800 mb-2"> Welcome to Chat </h2><p class="text-gray-600"> Select a conversation from the list or start a new one to begin messaging. </p></div></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/chat/messages.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=messages-DOOiA_Lt.mjs.map
