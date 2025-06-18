import { defineComponent, computed, ref, watch, resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useGroupsStore } from './useGroups-CJVvUzW6.mjs';
import { d as useRoute, u as useRouter, b as useAuthStore } from './server.mjs';
import 'pinia';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const groupsStore = useGroupsStore();
    useAuthStore();
    const groupId = computed(() => route.params.id);
    const groupName = ref("");
    watch(
      () => groupId.value,
      async (newGroupId) => {
        try {
          if (newGroupId) {
            const group = await groupsStore.getGroupDetails(newGroupId);
            groupName.value = group.name || "Group Chat";
          }
        } catch (error) {
          console.error("Error loading group:", error);
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_GroupsList = resolveComponent("GroupsList");
      const _component_GroupChatArea = resolveComponent("GroupChatArea");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-screen flex" }, _attrs))}><div class="w-80 border-r border-gray-200 flex-shrink-0">`);
      _push(ssrRenderComponent(_component_GroupsList, null, null, _parent));
      _push(`</div><div class="flex-1">`);
      _push(ssrRenderComponent(_component_GroupChatArea, {
        groupId: groupId.value,
        groupName: groupName.value
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/chat/groups/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CdGRu37S.mjs.map
