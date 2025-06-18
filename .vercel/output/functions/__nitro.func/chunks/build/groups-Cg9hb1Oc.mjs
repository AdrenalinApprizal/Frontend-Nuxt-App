import { v as vueExports, u as useRouter, b as useAuthStore, s as serverRenderer_cjs_prodExports, c as _imports_0, a as useNuxtApp, d as _sfc_main$6, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as __nuxt_component_1 } from './NotificationDropdown-BcpzIWTO.mjs';
import { format, formatDistanceToNow } from 'date-fns';
import { u as useGroupsStore } from './useGroups-CkV_vNHq.mjs';
import { u as useFriendsStore } from './useFriends-DzoMEWH6.mjs';
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
import 'pinia';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "GroupsList",
  __ssrInlineRender: true,
  setup(__props) {
    const { $toast } = useNuxtApp();
    const groupsStore = useGroupsStore();
    const friendsStore = useFriendsStore();
    vueExports.ref(false);
    const searchQuery = vueExports.ref("");
    const showCreateGroupModal = vueExports.ref(false);
    const newGroup = vueExports.ref({ name: "", description: "" });
    const friendSearch = vueExports.ref("");
    vueExports.ref(false);
    const selectedFriendIds = vueExports.ref([]);
    vueExports.ref(null);
    const avatarPreview = vueExports.ref(null);
    vueExports.ref(null);
    const isCreating = vueExports.ref(false);
    const errors = vueExports.ref({});
    const filteredGroups = vueExports.computed(() => {
      const groups = Array.isArray(groupsStore.groups) ? groupsStore.groups : [];
      if (!searchQuery.value) {
        return groups;
      }
      const query = searchQuery.value.toLowerCase();
      return groups.filter(
        (group) => group && group.name && group.name.toLowerCase().includes(query)
      );
    });
    const filteredFriends = vueExports.computed(() => {
      if (!friendSearch.value) {
        return friendsStore.friends;
      }
      const query = friendSearch.value.toLowerCase();
      return friendsStore.friends.filter(
        (friend) => friend.name && friend.name.toLowerCase().includes(query) || friend.email && friend.email.toLowerCase().includes(query)
      );
    });
    vueExports.computed(() => {
      return friendsStore.friends.filter(
        (friend) => selectedFriendIds.value.includes(friend.id)
      );
    });
    const isSelected = (friendId) => {
      return selectedFriendIds.value.includes(friendId);
    };
    const formatTimestamp = (dateString) => {
      try {
        const date = new Date(dateString);
        const now = /* @__PURE__ */ new Date();
        const isToday = date.toDateString() === now.toDateString();
        if (isToday) {
          return format(date, "h:mm a");
        } else {
          return formatDistanceToNow(date, { addSuffix: true });
        }
      } catch (error) {
        return dateString;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NotificationDropdown = __nuxt_component_1;
      const _component_Icon = _sfc_main$6;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "h-full flex flex-col p-6 bg-white" }, _attrs))}><div class="mb-6 flex justify-between items-center"><h1 class="text-xl font-bold text-gray-800">Groups</h1><div class="flex items-center space-x-2"><div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NotificationDropdown, null, null, _parent));
      _push(`</div><button class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors shadow-sm" aria-label="Create Group">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "material-symbols:add",
        class: "h-5 w-5"
      }, null, _parent));
      _push(`</button></div></div><div class="relative mb-5"><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "lucide:search",
        class: "h-4 w-4 text-gray-400"
      }, null, _parent));
      _push(`</div><input type="text"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", searchQuery.value)} placeholder="Search groups" class="pl-11 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-sm"></div>`);
      if (vueExports.unref(groupsStore).isLoading) {
        _push(`<div class="flex-1 flex items-center justify-center"><div class="flex flex-col items-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div><p class="mt-2 text-sm text-gray-500">Loading...</p></div></div>`);
      } else if (vueExports.unref(groupsStore).error) {
        _push(`<div class="flex-1 flex items-center justify-center"><div class="flex flex-col items-center text-center">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "lucide:alert-triangle",
          class: "h-8 w-8 text-red-500 mb-2"
        }, null, _parent));
        _push(`<p class="text-red-500">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(groupsStore).error)}</p><button class="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"> Try Again </button></div></div>`);
      } else {
        _push(`<div class="flex-1 overflow-auto">`);
        if (filteredGroups.value.length === 0) {
          _push(`<div class="h-full flex flex-col items-center justify-center text-center p-6">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:users",
            class: "h-12 w-12 text-gray-300 mb-3"
          }, null, _parent));
          _push(`<p class="text-gray-500 font-medium">${serverRenderer_cjs_prodExports.ssrInterpolate(searchQuery.value ? `No results for "${searchQuery.value}"` : "No groups yet")}</p><p class="text-sm text-gray-400 mt-2"> Create a group to start chatting </p><button class="mt-4 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors flex items-center">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "lucide:users-plus",
            class: "h-4 w-4 mr-2"
          }, null, _parent));
          _push(`<span>Create Group</span></button></div>`);
        } else {
          _push(`<div><div class="flex justify-between items-center mb-3"><div class="flex items-center"><div class="w-1 h-6 bg-blue-500 rounded-r mr-2"></div><h2 class="font-semibold text-gray-800 text-sm"> Your Groups <span class="ml-1 text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">${serverRenderer_cjs_prodExports.ssrInterpolate(filteredGroups.value.length)}</span></h2></div></div><div class="space-y-3"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(filteredGroups.value, (group, index) => {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
              key: group.id || index,
              to: `/chat/messages/${group.id}?type=group`
            }, {
              default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                if (_push2) {
                  _push2(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass(`flex items-center p-4 rounded-lg transition-colors ${_ctx.$route.path === `/chat/messages/${group.id}` && _ctx.$route.query.type === "group" ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50 border border-transparent"}`)}"${_scopeId}><div class="relative mr-3"${_scopeId}><div class="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200 shadow-sm"${_scopeId}>`);
                  if (group.avatar_url) {
                    _push2(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", group.avatar_url)} alt="Group avatar" class="h-full w-full object-cover"${_scopeId}>`);
                  } else {
                    _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                      name: "fa:users",
                      class: "h-6 w-6 text-gray-400"
                    }, null, _parent2, _scopeId));
                  }
                  _push2(`</div></div><div class="flex-1 min-w-0"${_scopeId}><div class="flex justify-between items-start"${_scopeId}><h3 class="font-medium text-gray-900 truncate"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(group.name || "Unnamed Group")}</h3><span class="text-xs text-gray-500 ml-1"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(((_a = group.last_message) == null ? void 0 : _a.created_at) ? formatTimestamp(group.last_message.created_at) : group.created_at ? formatTimestamp(group.created_at) : "")}</span></div><div class="flex justify-between items-center mt-1"${_scopeId}><div class="flex-1 min-w-0"${_scopeId}>`);
                  if ((_b = group.last_message) == null ? void 0 : _b.content) {
                    _push2(`<p class="text-xs text-gray-600 truncate"${_scopeId}><span class="font-medium"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(((_c = group.last_message) == null ? void 0 : _c.sender_name) || "Someone")}</span> : ${serverRenderer_cjs_prodExports.ssrInterpolate((_d = group.last_message) == null ? void 0 : _d.content)}</p>`);
                  } else {
                    _push2(`<p class="text-xs text-gray-500"${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(group.description || `${group.member_count || 0} members`)}</p>`);
                  }
                  _push2(`</div></div></div></div>`);
                } else {
                  return [
                    vueExports.createVNode("div", {
                      class: `flex items-center p-4 rounded-lg transition-colors ${_ctx.$route.path === `/chat/messages/${group.id}` && _ctx.$route.query.type === "group" ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50 border border-transparent"}`
                    }, [
                      vueExports.createVNode("div", { class: "relative mr-3" }, [
                        vueExports.createVNode("div", { class: "h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200 shadow-sm" }, [
                          group.avatar_url ? (vueExports.openBlock(), vueExports.createBlock("img", {
                            key: 0,
                            src: group.avatar_url,
                            alt: "Group avatar",
                            class: "h-full w-full object-cover"
                          }, null, 8, ["src"])) : (vueExports.openBlock(), vueExports.createBlock(_component_Icon, {
                            key: 1,
                            name: "fa:users",
                            class: "h-6 w-6 text-gray-400"
                          }))
                        ])
                      ]),
                      vueExports.createVNode("div", { class: "flex-1 min-w-0" }, [
                        vueExports.createVNode("div", { class: "flex justify-between items-start" }, [
                          vueExports.createVNode("h3", { class: "font-medium text-gray-900 truncate" }, vueExports.toDisplayString(group.name || "Unnamed Group"), 1),
                          vueExports.createVNode("span", { class: "text-xs text-gray-500 ml-1" }, vueExports.toDisplayString(((_e = group.last_message) == null ? void 0 : _e.created_at) ? formatTimestamp(group.last_message.created_at) : group.created_at ? formatTimestamp(group.created_at) : ""), 1)
                        ]),
                        vueExports.createVNode("div", { class: "flex justify-between items-center mt-1" }, [
                          vueExports.createVNode("div", { class: "flex-1 min-w-0" }, [
                            ((_f = group.last_message) == null ? void 0 : _f.content) ? (vueExports.openBlock(), vueExports.createBlock("p", {
                              key: 0,
                              class: "text-xs text-gray-600 truncate"
                            }, [
                              vueExports.createVNode("span", { class: "font-medium" }, vueExports.toDisplayString(((_g = group.last_message) == null ? void 0 : _g.sender_name) || "Someone"), 1),
                              vueExports.createTextVNode(" : " + vueExports.toDisplayString((_h = group.last_message) == null ? void 0 : _h.content), 1)
                            ])) : (vueExports.openBlock(), vueExports.createBlock("p", {
                              key: 1,
                              class: "text-xs text-gray-500"
                            }, vueExports.toDisplayString(group.description || `${group.member_count || 0} members`), 1))
                          ])
                        ])
                      ])
                    ], 2)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        }
        _push(`</div>`);
      }
      if (showCreateGroupModal.value) {
        _push(`<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in"><div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform transition-all"><div class="flex justify-between items-center mb-4"><h2 class="text-lg font-semibold text-gray-800">Create a Group</h2><button class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:times",
          class: "h-4 w-4"
        }, null, _parent));
        _push(`</button></div>`);
        if (errors.value.general) {
          _push(`<div class="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">${serverRenderer_cjs_prodExports.ssrInterpolate(errors.value.general)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mb-4"><label class="block text-sm font-medium text-gray-700 mb-2"> Group Name </label><input${serverRenderer_cjs_prodExports.ssrRenderAttr("value", newGroup.value.name)} type="text" placeholder="Enter group name" class="w-full p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">`);
        if (errors.value.name) {
          _push(`<p class="mt-1 text-sm text-red-500">${serverRenderer_cjs_prodExports.ssrInterpolate(errors.value.name)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="mb-4"><label class="block text-sm font-medium text-gray-700 mb-2"> Description </label><textarea placeholder="Enter group description" rows="2" class="w-full p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all">${serverRenderer_cjs_prodExports.ssrInterpolate(newGroup.value.description)}</textarea></div><div class="mb-4"><label class="block text-sm font-medium text-gray-700 mb-2"> Group Avatar </label><div class="flex items-center"><div class="h-20 w-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center border border-gray-300">`);
        if (avatarPreview.value) {
          _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", avatarPreview.value)} alt="Group avatar preview" class="h-full w-full object-cover">`);
        } else {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "mdi:account-group",
            class: "h-10 w-10 text-gray-400"
          }, null, _parent));
        }
        _push(`</div><div class="ml-5"><button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"> Upload Image </button>`);
        if (avatarPreview.value) {
          _push(`<p class="mt-2 text-xs text-gray-500"><button class="text-red-500 hover:underline"> Remove </button></p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><input type="file" accept="image/*" class="hidden text-black"></div></div><div class="mb-4"><label class="block text-sm font-medium text-gray-700 mb-2"> Select Friends </label>`);
        if (vueExports.unref(friendsStore).friends.length === 0) {
          _push(`<div class="text-sm text-gray-500 p-2"> No friends to add. Add some friends first. </div>`);
        } else {
          _push(`<div><div class="relative mb-2"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "lucide:search",
            class: "h-4 w-4 text-gray-400"
          }, null, _parent));
          _push(`</div><input${serverRenderer_cjs_prodExports.ssrRenderAttr("value", friendSearch.value)} type="text" placeholder="Search friends..." class="w-full pl-10 p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div class="max-h-40 overflow-y-auto border border-gray-200 rounded-lg"><!--[-->`);
          serverRenderer_cjs_prodExports.ssrRenderList(filteredFriends.value, (friend) => {
            _push(`<div class="${serverRenderer_cjs_prodExports.ssrRenderClass(`flex items-center p-2 cursor-pointer hover:bg-gray-50 transition-colors ${isSelected(friend.id) ? "bg-blue-50" : ""}`)}"><div class="h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex-shrink-0 flex items-center justify-center">`);
            if (friend.profile_picture_url) {
              _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", friend.profile_picture_url)}${serverRenderer_cjs_prodExports.ssrRenderAttr("alt", friend.name)} class="h-full w-full object-cover">`);
            } else {
              _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
                name: "fa:user",
                class: "h-4 w-4 text-gray-500"
              }, null, _parent));
            }
            _push(`</div><div class="flex-1"><p class="font-medium text-sm">${serverRenderer_cjs_prodExports.ssrInterpolate(friend.name || "Unknown")}</p><p class="text-xs text-gray-500"> @${serverRenderer_cjs_prodExports.ssrInterpolate(friend.email ? friend.email.split("@")[0] : (friend.name || "user").toLowerCase().replace(/\s+/g, "_"))}</p></div><input type="checkbox"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isSelected(friend.id)) ? " checked" : ""} class="h-4 w-4 text-blue-600"></div>`);
          });
          _push(`<!--]-->`);
          if (filteredFriends.value.length === 0) {
            _push(`<div class="p-4 text-center text-gray-500"> No friends found </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        }
        if (errors.value.members) {
          _push(`<p class="mt-1 text-sm text-red-500">${serverRenderer_cjs_prodExports.ssrInterpolate(errors.value.members)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex justify-end space-x-3"><button class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"> Cancel </button><button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isCreating.value) ? " disabled" : ""}>`);
        if (!isCreating.value) {
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "lucide:users-plus",
            class: "h-4 w-4 mr-2"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (isCreating.value) {
          _push(`<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span>${serverRenderer_cjs_prodExports.ssrInterpolate(isCreating.value ? "Creating..." : "Create Group")}</span></button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/GroupsList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "groups",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useAuthStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "h-screen flex" }, _attrs))}><div class="w-80 border-r border-gray-200 flex-shrink-0">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div><div class="flex-1 bg-gray-50 flex flex-col items-center justify-center"><div class="text-center max-w-md"><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", _imports_0)} alt="Logo" class="w-24 h-24 mx-auto mb-6 rounded-full"><h2 class="text-2xl font-semibold text-gray-800 mb-2"> Welcome to Chat </h2><p class="text-gray-600"> Select a conversation from the list or start a new one to begin messaging. </p></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/chat/groups.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=groups-Cg9hb1Oc.mjs.map
