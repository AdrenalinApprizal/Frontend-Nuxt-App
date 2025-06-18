import { u as useRouter, a as useNuxtApp, b as useAuthStore, c as _imports_0, d as _sfc_main$6, _ as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderDynamicModel, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { u as useHead } from './v3-C9MI93no.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LoginForm",
  __ssrInlineRender: true,
  setup(__props) {
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const loading = ref(false);
    const errorMsg = ref("");
    const emailError = ref("");
    ref(false);
    ref(null);
    useRouter();
    const { $toast } = useNuxtApp();
    useAuthStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = _sfc_main$6;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center relative bg-[#050C1B] overflow-hidden" }, _attrs))} data-v-21a9bd9e><div class="absolute -top-24 -left-24 w-96 h-96 rounded-full" style="${ssrRenderStyle({ "background": "radial-gradient(\n          circle,\n          rgba(27, 62, 136, 0.8) 0%,\n          rgba(27, 62, 136, 0) 70%\n        )" })}" data-v-21a9bd9e></div><div class="absolute -bottom-24 -right-24 w-96 h-96 rounded-full" style="${ssrRenderStyle({ "background": "radial-gradient(\n          circle,\n          rgba(27, 62, 136, 0.8) 0%,\n          rgba(27, 62, 136, 0) 70%\n        )" })}" data-v-21a9bd9e></div><div class="absolute inset-0 z-0 opacity-70" style="${ssrRenderStyle({ "background-image": "radial-gradient(\n          circle,\n          rgba(27, 62, 136, 0.8) 0%,\n          rgba(27, 62, 136, 0) 70%\n        )" })}" data-v-21a9bd9e></div><div class="w-full max-w-md p-12 space-y-6 bg-[#050C1B]/50 backdrop-blur-md rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/20 z-10" data-v-21a9bd9e><div class="flex justify-center" data-v-21a9bd9e><div class="w-24 h-24 rounded-full overflow-hidden shadow-md shadow-blue-500/50" data-v-21a9bd9e><img${ssrRenderAttr("src", _imports_0)} alt="Logo" class="w-full h-full object-cover" data-v-21a9bd9e></div></div><h2 class="text-2xl font-bold text-center text-white" data-v-21a9bd9e> Sign In to Your Account </h2>`);
      if (unref(errorMsg)) {
        _push(`<div class="bg-red-500/20 border border-red-500 text-white px-4 py-2 rounded" data-v-21a9bd9e>${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form data-v-21a9bd9e><div class="mb-4" data-v-21a9bd9e><label for="email" class="block mb-2 text-sm font-medium text-blue-100" data-v-21a9bd9e> Email </label><input type="email" id="email"${ssrRenderAttr("value", unref(email))} required class="${ssrRenderClass([{ "border-red-500": unref(emailError) }, "w-full px-4 py-2 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50"])}" placeholder="Enter your email" data-v-21a9bd9e>`);
      if (unref(emailError)) {
        _push(`<p class="mt-1 text-sm text-red-400" data-v-21a9bd9e>${ssrInterpolate(unref(emailError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mb-4" data-v-21a9bd9e><label for="password" class="block mb-2 text-sm font-medium text-blue-100" data-v-21a9bd9e> Password </label><div class="relative" data-v-21a9bd9e><input${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} id="password"${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(password), null)} required class="w-full px-4 py-2 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50" placeholder="Enter your password" data-v-21a9bd9e><button type="button" class="absolute right-3 top-3 text-blue-900" data-v-21a9bd9e>`);
      if (unref(showPassword)) {
        _push(ssrRenderComponent(_component_Icon, {
          name: "fa:eye",
          class: "h-4 w-4"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_Icon, {
          name: "fa:eye-slash",
          class: "h-4 w-4"
        }, null, _parent));
      }
      _push(`</button></div></div><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": unref(loading) }, "w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"])}" data-v-21a9bd9e>${ssrInterpolate(unref(loading) ? "Loading..." : "Login")}</button><p class="mt-4 text-sm text-center text-blue-100" data-v-21a9bd9e> Don&#39;t have an account? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/register",
        class: "text-blue-300 hover:text-blue-200 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Register `);
          } else {
            return [
              createTextVNode(" Register ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></form></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/LoginForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-21a9bd9e"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Login",
      meta: [{ name: "description", content: "Login to your account" }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AuthLoginForm = __nuxt_component_0;
      _push(ssrRenderComponent(_component_AuthLoginForm, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-D9Zox7yL.mjs.map
