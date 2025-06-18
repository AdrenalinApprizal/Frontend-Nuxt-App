import { u as useRouter, a as useNuxtApp, b as useAuthStore, c as _imports_0, d as _sfc_main$6, _ as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrRenderDynamicModel, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "RegisterForm",
  __ssrInlineRender: true,
  setup(__props) {
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const firstName = ref("");
    const lastName = ref("");
    const phoneNumber = ref("");
    ref("");
    ref("");
    const showPassword = ref(false);
    const loading = ref(false);
    ref(false);
    ref(null);
    ref("");
    useRouter();
    const { $toast } = useNuxtApp();
    useAuthStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = _sfc_main$6;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center min-h-screen bg-[#050C1B] relative overflow-hidden py-2" }, _attrs))}><div class="absolute -top-24 -left-24 w-96 h-96 rounded-full" style="${ssrRenderStyle({ "background": "radial-gradient(\n          circle,\n          rgba(27, 62, 136, 0.8) 0%,\n          rgba(27, 62, 136, 0) 70%\n        )" })}"></div><div class="absolute -bottom-24 -right-24 w-96 h-96 rounded-full" style="${ssrRenderStyle({ "background": "radial-gradient(\n          circle,\n          rgba(27, 62, 136, 0.8) 0%,\n          rgba(27, 62, 136, 0) 70%\n        )" })}"></div><div class="w-full max-w-lg p-4 lg:p-6 space-y-3 bg-[#050C1B]/50 backdrop-blur-md rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/20"><div class="flex justify-center"><div class="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden shadow-md shadow-blue-500/50"><img${ssrRenderAttr("src", _imports_0)} alt="Voxta Logo" class="w-full h-full object-cover"></div></div><h2 class="text-xl lg:text-2xl font-bold text-center text-white"> Create Your Account </h2><form class="space-y-4"><div class="grid grid-cols-2 gap-3"><div><label for="first-name" class="block mb-1 text-xs lg:text-sm font-medium text-blue-100"> First Name </label><input type="text" id="first-name"${ssrRenderAttr("value", unref(firstName))} required class="w-full px-3 py-1.5 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50 text-sm" placeholder="Your first name"></div><div><label for="last-name" class="block mb-1 text-xs lg:text-sm font-medium text-blue-100"> Last Name </label><input type="text" id="last-name"${ssrRenderAttr("value", unref(lastName))} required class="w-full px-3 py-1.5 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50 text-sm" placeholder="Your last name"></div></div><div class="grid grid-cols-2 gap-3"><div><label for="username" class="block mb-1 text-xs lg:text-sm font-medium text-blue-100"> Username </label><input type="text" id="username"${ssrRenderAttr("value", unref(username))} required class="w-full px-3 py-1.5 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50 text-sm" placeholder="Choose a username"></div><div><label for="email" class="block mb-1 text-xs lg:text-sm font-medium text-blue-100"> Email </label><input type="email" id="email"${ssrRenderAttr("value", unref(email))} required class="w-full px-3 py-1.5 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50 text-sm" placeholder="Your email address"></div></div><div><label for="phone-number" class="block mb-1 text-xs lg:text-sm font-medium text-blue-100"> Phone Number </label><input type="tel" id="phone-number"${ssrRenderAttr("value", unref(phoneNumber))} class="w-full px-3 py-1.5 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50 text-sm" placeholder="Your phone number"></div><div class="grid grid-cols-2 gap-3"><div><label for="password" class="block mb-1 text-xs lg:text-sm font-medium text-blue-100"> Password </label><div class="relative"><input${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} id="password"${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(password), null)} required class="w-full px-3 py-1.5 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50 text-sm" placeholder="Create a password"><button type="button" class="absolute right-2 top-2 text-blue-900 text-sm">`);
      if (unref(showPassword)) {
        _push(ssrRenderComponent(_component_Icon, {
          name: "fa:eye",
          class: "h-3 w-3"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_Icon, {
          name: "fa:eye-slash",
          class: "h-3 w-3"
        }, null, _parent));
      }
      _push(`</button></div></div><div><label for="confirm-password" class="block mb-1 text-xs lg:text-sm font-medium text-blue-100"> Confirm Password </label><div class="relative"><input${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} id="confirm-password"${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(confirmPassword), null)} required class="w-full px-3 py-1.5 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50 text-sm" placeholder="Confirm your password"><button type="button" class="absolute right-2 top-2 text-blue-900 text-sm">`);
      if (unref(showPassword)) {
        _push(ssrRenderComponent(_component_Icon, {
          name: "fa:eye",
          class: "h-3 w-3"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_Icon, {
          name: "fa:eye-slash",
          class: "h-3 w-3"
        }, null, _parent));
      }
      _push(`</button></div></div></div><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": unref(loading) }, "w-full px-4 py-2 mt-4 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none text-sm"])}">${ssrInterpolate(unref(loading) ? "Loading..." : "Register")}</button><p class="text-xs text-center text-blue-100 mt-2"> Already have an account? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/login",
        class: "text-blue-300 hover:text-blue-200 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Login `);
          } else {
            return [
              createTextVNode(" Login ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/RegisterForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Register",
      meta: [{ name: "description", content: "Create a new account" }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AuthRegisterForm = _sfc_main$1;
      _push(ssrRenderComponent(_component_AuthRegisterForm, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-CbrNDCEE.mjs.map
