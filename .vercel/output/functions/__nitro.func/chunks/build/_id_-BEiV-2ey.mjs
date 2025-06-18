import { v as vueExports, e as useRoute, u as useRouter, b as useAuthStore, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { u as useGroupsStore } from './useGroups-CkV_vNHq.mjs';
import 'entities/lib/decode.js';
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
import 'estree-walker';
import 'source-map-js';
import '@vue/runtime-dom';
import 'node:stream';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const groupsStore = useGroupsStore();
    useAuthStore();
    const groupId = vueExports.computed(() => route.params.id);
    const groupName = vueExports.ref("");
    vueExports.watch(
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
      const _component_GroupsList = vueExports.resolveComponent("GroupsList");
      const _component_GroupChatArea = vueExports.resolveComponent("GroupChatArea");
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "h-screen flex" }, _attrs))}><div class="w-80 border-r border-gray-200 flex-shrink-0">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_GroupsList, null, null, _parent));
      _push(`</div><div class="flex-1">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_GroupChatArea, {
        groupId: groupId.value,
        groupName: groupName.value
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/chat/groups/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BEiV-2ey.mjs.map
