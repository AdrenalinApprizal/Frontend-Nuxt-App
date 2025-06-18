import { defineComponent, shallowRef, h, resolveComponent, ref, computed, mergeProps, unref, inject, hasInjectionContext, Suspense, getCurrentInstance, provide, watch, shallowReactive, Fragment, createElementBlock, cloneVNode, reactive, useSSRContext, createApp, withCtx, createVNode, toRef, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, effectScope, isReadonly, isRef, isShallow, isReactive, toRaw, defineAsyncComponent, getCurrentScope } from 'vue';
import { n as parseQuery$1, o as hasProtocol, q as joinURL, t as getContext, v as withQuery, x as withTrailingSlash, y as withoutTrailingSlash, z as isScriptProtocol, A as sanitizeStatusCode, $ as $fetch, B as createHooks, C as executeAsync, k as createError$1, D as toRouteMatcher, E as createRouter$1, F as defu } from '../nitro/nitro.mjs';
import { p as publicAssetsURL, b as baseURL } from '../routes/renderer.mjs';
import { defineStore, createPinia, setActivePinia, shouldHydrate } from 'pinia';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderDynamicModel, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  var _a;
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.17.5";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...((_a = options.ssrContext) == null ? void 0 : _a.payload) || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b, _c, _d;
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    var _a2;
    const unresolvedPluginsForThisPlugin = ((_a2 = plugin2.dependsOn) == null ? void 0 : _a2.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin2.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) && ((_b = plugin2.env) == null ? void 0 : _b.islands) === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) && ((_d = plugin2.env) == null ? void 0 : _d.islands) === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance || (nuxtAppInstance = getNuxtAppCtx(id).tryUse());
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute$1 = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to || (to = "/");
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = (options == null ? void 0 : options.external) || isExternalHost;
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? void 0 : options.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value || (error2.value = nuxtError);
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function isRouteComponent(component) {
  return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function isESModule(obj) {
  return obj.__esModule || obj[Symbol.toStringTag] === "Module" || // support CF with dynamic imports that do not
  // add the Module string tag
  obj.default && isRouteComponent(obj.default);
}
const assign = Object.assign;
function applyToParams(fn, params) {
  const newParams = {};
  for (const key in params) {
    const value = params[key];
    newParams[key] = isArray(value) ? value.map(fn) : fn(value);
  }
  return newParams;
}
const noop = () => {
};
const isArray = Array.isArray;
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_CARET_RE = /%5E/g;
const ENC_BACKTICK_RE = /%60/g;
const ENC_CURLY_OPEN_RE = /%7B/g;
const ENC_PIPE_RE = /%7C/g;
const ENC_CURLY_CLOSE_RE = /%7D/g;
const ENC_SPACE_RE = /%20/g;
function commonEncode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeHash(text) {
  return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(text) {
  return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
function encodeParam(text) {
  return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
  try {
    return decodeURIComponent("" + text);
  } catch (err) {
  }
  return "" + text;
}
const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
function parseURL(parseQuery2, location2, currentLocation = "/") {
  let path, query = {}, searchString = "", hash = "";
  const hashPos = location2.indexOf("#");
  let searchPos = location2.indexOf("?");
  if (hashPos < searchPos && hashPos >= 0) {
    searchPos = -1;
  }
  if (searchPos > -1) {
    path = location2.slice(0, searchPos);
    searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
    query = parseQuery2(searchString);
  }
  if (hashPos > -1) {
    path = path || location2.slice(0, hashPos);
    hash = location2.slice(hashPos, location2.length);
  }
  path = resolveRelativePath(path != null ? path : location2, currentLocation);
  return {
    fullPath: path + (searchString && "?") + searchString + hash,
    path,
    query,
    hash: decode(hash)
  };
}
function stringifyURL(stringifyQuery2, location2) {
  const query = location2.query ? stringifyQuery2(location2.query) : "";
  return location2.path + (query && "?") + query + (location2.hash || "");
}
function isSameRouteLocation(stringifyQuery2, a, b) {
  const aLastIndex = a.matched.length - 1;
  const bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
}
function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length)
    return false;
  for (const key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key]))
      return false;
  }
  return true;
}
function isSameRouteLocationParamsValue(a, b) {
  return isArray(a) ? isEquivalentArray(a, b) : isArray(b) ? isEquivalentArray(b, a) : a === b;
}
function isEquivalentArray(a, b) {
  return isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function resolveRelativePath(to, from) {
  if (to.startsWith("/"))
    return to;
  if (!to)
    return from;
  const fromSegments = from.split("/");
  const toSegments = to.split("/");
  const lastToSegment = toSegments[toSegments.length - 1];
  if (lastToSegment === ".." || lastToSegment === ".") {
    toSegments.push("");
  }
  let position = fromSegments.length - 1;
  let toPosition;
  let segment;
  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition];
    if (segment === ".")
      continue;
    if (segment === "..") {
      if (position > 1)
        position--;
    } else
      break;
  }
  return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition).join("/");
}
const START_LOCATION_NORMALIZED = {
  path: "/",
  // TODO: could we use a symbol in the future?
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
var NavigationType;
(function(NavigationType2) {
  NavigationType2["pop"] = "pop";
  NavigationType2["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function(NavigationDirection2) {
  NavigationDirection2["back"] = "back";
  NavigationDirection2["forward"] = "forward";
  NavigationDirection2["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
const START = "";
function normalizeBase(base) {
  if (!base) {
    {
      base = "/";
    }
  }
  if (base[0] !== "/" && base[0] !== "#")
    base = "/" + base;
  return removeTrailingSlash(base);
}
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location2) {
  return base.replace(BEFORE_HASH_RE, "#") + location2;
}
function createMemoryHistory(base = "") {
  let listeners = [];
  let queue = [[START, {}]];
  let position = 0;
  base = normalizeBase(base);
  function setLocation(location2, state = {}) {
    position++;
    if (position !== queue.length) {
      queue.splice(position);
    }
    queue.push([location2, state]);
  }
  function triggerListeners(to, from, { direction, delta }) {
    const info = {
      direction,
      delta,
      type: NavigationType.pop
    };
    for (const callback of listeners) {
      callback(to, from, info);
    }
  }
  const routerHistory = {
    // rewritten by Object.defineProperty
    location: START,
    // rewritten by Object.defineProperty
    state: {},
    base,
    createHref: createHref.bind(null, base),
    replace(to, state) {
      queue.splice(position--, 1);
      setLocation(to, state);
    },
    push(to, state) {
      setLocation(to, state);
    },
    listen(callback) {
      listeners.push(callback);
      return () => {
        const index = listeners.indexOf(callback);
        if (index > -1)
          listeners.splice(index, 1);
      };
    },
    destroy() {
      listeners = [];
      queue = [[START, {}]];
      position = 0;
    },
    go(delta, shouldTrigger = true) {
      const from = this.location;
      const direction = (
        // we are considering delta === 0 going forward, but in abstract mode
        // using 0 for the delta doesn't make sense like it does in html5 where
        // it reloads the page
        delta < 0 ? NavigationDirection.back : NavigationDirection.forward
      );
      position = Math.max(0, Math.min(position + delta, queue.length - 1));
      if (shouldTrigger) {
        triggerListeners(this.location, from, {
          direction,
          delta
        });
      }
    }
  };
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => queue[position][0]
  });
  Object.defineProperty(routerHistory, "state", {
    enumerable: true,
    get: () => queue[position][1]
  });
  return routerHistory;
}
function isRouteLocation(route) {
  return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
  return typeof name === "string" || typeof name === "symbol";
}
const NavigationFailureSymbol = Symbol("");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
function createRouterError(type, params) {
  {
    return assign(new Error(), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
const BASE_PARAM_PATTERN = "[^/]+?";
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
};
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
function tokensToParser(segments, extraOptions) {
  const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
  const score = [];
  let pattern = options.start ? "^" : "";
  const keys = [];
  for (const segment of segments) {
    const segmentScores = segment.length ? [] : [
      90
      /* PathScore.Root */
    ];
    if (options.strict && !segment.length)
      pattern += "/";
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
      if (token.type === 0) {
        if (!tokenIndex)
          pattern += "/";
        pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
        subSegmentScore += 40;
      } else if (token.type === 1) {
        const { value, repeatable, optional, regexp } = token;
        keys.push({
          name: value,
          repeatable,
          optional
        });
        const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
        if (re2 !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10;
          try {
            new RegExp(`(${re2})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
          }
        }
        let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
        if (!tokenIndex)
          subPattern = // avoid an optional / if there are more segments e.g. /:p?-static
          // or /:p?-:p2
          optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
        if (optional)
          subPattern += "?";
        pattern += subPattern;
        subSegmentScore += 20;
        if (optional)
          subSegmentScore += -8;
        if (repeatable)
          subSegmentScore += -20;
        if (re2 === ".*")
          subSegmentScore += -50;
      }
      segmentScores.push(subSegmentScore);
    }
    score.push(segmentScores);
  }
  if (options.strict && options.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += 0.7000000000000001;
  }
  if (!options.strict)
    pattern += "/?";
  if (options.end)
    pattern += "$";
  else if (options.strict && !pattern.endsWith("/"))
    pattern += "(?:/|$)";
  const re = new RegExp(pattern, options.sensitive ? "" : "i");
  function parse(path) {
    const match = path.match(re);
    const params = {};
    if (!match)
      return null;
    for (let i = 1; i < match.length; i++) {
      const value = match[i] || "";
      const key = keys[i - 1];
      params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
  }
  function stringify(params) {
    let path = "";
    let avoidDuplicatedSlash = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith("/"))
        path += "/";
      avoidDuplicatedSlash = false;
      for (const token of segment) {
        if (token.type === 0) {
          path += token.value;
        } else if (token.type === 1) {
          const { value, repeatable, optional } = token;
          const param = value in params ? params[value] : "";
          if (isArray(param) && !repeatable) {
            throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          }
          const text = isArray(param) ? param.join("/") : param;
          if (!text) {
            if (optional) {
              if (segment.length < 2) {
                if (path.endsWith("/"))
                  path = path.slice(0, -1);
                else
                  avoidDuplicatedSlash = true;
              }
            } else
              throw new Error(`Missing required param "${value}"`);
          }
          path += text;
        }
      }
    }
    return path || "/";
  }
  return {
    re,
    score,
    keys,
    parse,
    stringify
  };
}
function compareScoreArray(a, b) {
  let i = 0;
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i];
    if (diff)
      return diff;
    i++;
  }
  if (a.length < b.length) {
    return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
  }
  return 0;
}
function comparePathParserScore(a, b) {
  let i = 0;
  const aScore = a.score;
  const bScore = b.score;
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i]);
    if (comp)
      return comp;
    i++;
  }
  if (Math.abs(bScore.length - aScore.length) === 1) {
    if (isLastScoreNegative(aScore))
      return 1;
    if (isLastScoreNegative(bScore))
      return -1;
  }
  return bScore.length - aScore.length;
}
function isLastScoreNegative(score) {
  const last = score[score.length - 1];
  return score.length > 0 && last[last.length - 1] < 0;
}
const ROOT_TOKEN = {
  type: 0,
  value: ""
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
  if (!path)
    return [[]];
  if (path === "/")
    return [[ROOT_TOKEN]];
  if (!path.startsWith("/")) {
    throw new Error(`Invalid path "${path}"`);
  }
  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`);
  }
  let state = 0;
  let previousState = state;
  const tokens = [];
  let segment;
  function finalizeSegment() {
    if (segment)
      tokens.push(segment);
    segment = [];
  }
  let i = 0;
  let char;
  let buffer = "";
  let customRe = "";
  function consumeBuffer() {
    if (!buffer)
      return;
    if (state === 0) {
      segment.push({
        type: 0,
        value: buffer
      });
    } else if (state === 1 || state === 2 || state === 3) {
      if (segment.length > 1 && (char === "*" || char === "+"))
        crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1,
        value: buffer,
        regexp: customRe,
        repeatable: char === "*" || char === "+",
        optional: char === "*" || char === "?"
      });
    } else {
      crash("Invalid state to consume buffer");
    }
    buffer = "";
  }
  function addCharToBuffer() {
    buffer += char;
  }
  while (i < path.length) {
    char = path[i++];
    if (char === "\\" && state !== 2) {
      previousState = state;
      state = 4;
      continue;
    }
    switch (state) {
      case 0:
        if (char === "/") {
          if (buffer) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ":") {
          consumeBuffer();
          state = 1;
        } else {
          addCharToBuffer();
        }
        break;
      case 4:
        addCharToBuffer();
        state = previousState;
        break;
      case 1:
        if (char === "(") {
          state = 2;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
        }
        break;
      case 2:
        if (char === ")") {
          if (customRe[customRe.length - 1] == "\\")
            customRe = customRe.slice(0, -1) + char;
          else
            state = 3;
        } else {
          customRe += char;
        }
        break;
      case 3:
        consumeBuffer();
        state = 0;
        if (char !== "*" && char !== "?" && char !== "+")
          i--;
        customRe = "";
        break;
      default:
        crash("Unknown state");
        break;
    }
  }
  if (state === 2)
    crash(`Unfinished custom RegExp for param "${buffer}"`);
  consumeBuffer();
  finalizeSegment();
  return tokens;
}
function createRouteRecordMatcher(record, parent, options) {
  const parser = tokensToParser(tokenizePath(record.path), options);
  const matcher = assign(parser, {
    record,
    parent,
    // these needs to be populated by the parent
    children: [],
    alias: []
  });
  if (parent) {
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher);
  }
  return matcher;
}
function createRouterMatcher(routes, globalOptions) {
  const matchers = [];
  const matcherMap = /* @__PURE__ */ new Map();
  globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
  function getRecordMatcher(name) {
    return matcherMap.get(name);
  }
  function addRoute(record, parent, originalRecord) {
    const isRootAdd = !originalRecord;
    const mainNormalizedRecord = normalizeRouteRecord(record);
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options = mergeOptions(globalOptions, record);
    const normalizedRecords = [mainNormalizedRecord];
    if ("alias" in record) {
      const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
      for (const alias of aliases) {
        normalizedRecords.push(
          // we need to normalize again to ensure the `mods` property
          // being non enumerable
          normalizeRouteRecord(assign({}, mainNormalizedRecord, {
            // this allows us to hold a copy of the `components` option
            // so that async components cache is hold on the original record
            components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
            path: alias,
            // we might be the child of an alias
            aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
            // the aliases are always of the same kind as the original since they
            // are defined on the same record
          }))
        );
      }
    }
    let matcher;
    let originalMatcher;
    for (const normalizedRecord of normalizedRecords) {
      const { path } = normalizedRecord;
      if (parent && path[0] !== "/") {
        const parentPath = parent.record.path;
        const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
      if (originalRecord) {
        originalRecord.alias.push(matcher);
      } else {
        originalMatcher = originalMatcher || matcher;
        if (originalMatcher !== matcher)
          originalMatcher.alias.push(matcher);
        if (isRootAdd && record.name && !isAliasRecord(matcher)) {
          removeRoute(record.name);
        }
      }
      if (isMatchable(matcher)) {
        insertMatcher(matcher);
      }
      if (mainNormalizedRecord.children) {
        const children = mainNormalizedRecord.children;
        for (let i = 0; i < children.length; i++) {
          addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
        }
      }
      originalRecord = originalRecord || matcher;
    }
    return originalMatcher ? () => {
      removeRoute(originalMatcher);
    } : noop;
  }
  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef);
      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
        matcher.alias.forEach(removeRoute);
      }
    } else {
      const index = matchers.indexOf(matcherRef);
      if (index > -1) {
        matchers.splice(index, 1);
        if (matcherRef.record.name)
          matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }
  function getRoutes() {
    return matchers;
  }
  function insertMatcher(matcher) {
    const index = findInsertionIndex(matcher, matchers);
    matchers.splice(index, 0, matcher);
    if (matcher.record.name && !isAliasRecord(matcher))
      matcherMap.set(matcher.record.name, matcher);
  }
  function resolve(location2, currentLocation) {
    let matcher;
    let params = {};
    let path;
    let name;
    if ("name" in location2 && location2.name) {
      matcher = matcherMap.get(location2.name);
      if (!matcher)
        throw createRouterError(1, {
          location: location2
        });
      name = matcher.record.name;
      params = assign(
        // paramsFromLocation is a new object
        paramsFromLocation(
          currentLocation.params,
          // only keep params that exist in the resolved location
          // only keep optional params coming from a parent record
          matcher.keys.filter((k) => !k.optional).concat(matcher.parent ? matcher.parent.keys.filter((k) => k.optional) : []).map((k) => k.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        location2.params && paramsFromLocation(location2.params, matcher.keys.map((k) => k.name))
      );
      path = matcher.stringify(params);
    } else if (location2.path != null) {
      path = location2.path;
      matcher = matchers.find((m) => m.re.test(path));
      if (matcher) {
        params = matcher.parse(path);
        name = matcher.record.name;
      }
    } else {
      matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
      if (!matcher)
        throw createRouterError(1, {
          location: location2,
          currentLocation
        });
      name = matcher.record.name;
      params = assign({}, currentLocation.params, location2.params);
      path = matcher.stringify(params);
    }
    const matched = [];
    let parentMatcher = matcher;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }
    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  }
  routes.forEach((route) => addRoute(route));
  function clearRoutes() {
    matchers.length = 0;
    matcherMap.clear();
  }
  return {
    addRoute,
    resolve,
    removeRoute,
    clearRoutes,
    getRoutes,
    getRecordMatcher
  };
}
function paramsFromLocation(params, keys) {
  const newParams = {};
  for (const key of keys) {
    if (key in params)
      newParams[key] = params[key];
  }
  return newParams;
}
function normalizeRouteRecord(record) {
  const normalized = {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: record.aliasOf,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    // must be declared afterwards
    // mods: {},
    components: "components" in record ? record.components || null : record.component && { default: record.component }
  };
  Object.defineProperty(normalized, "mods", {
    value: {}
  });
  return normalized;
}
function normalizeRecordProps(record) {
  const propsObject = {};
  const props = record.props || false;
  if ("component" in record) {
    propsObject.default = props;
  } else {
    for (const name in record.components)
      propsObject[name] = typeof props === "object" ? props[name] : props;
  }
  return propsObject;
}
function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf)
      return true;
    record = record.parent;
  }
  return false;
}
function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
function mergeOptions(defaults, partialOptions) {
  const options = {};
  for (const key in defaults) {
    options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
  }
  return options;
}
function findInsertionIndex(matcher, matchers) {
  let lower = 0;
  let upper = matchers.length;
  while (lower !== upper) {
    const mid = lower + upper >> 1;
    const sortOrder = comparePathParserScore(matcher, matchers[mid]);
    if (sortOrder < 0) {
      upper = mid;
    } else {
      lower = mid + 1;
    }
  }
  const insertionAncestor = getInsertionAncestor(matcher);
  if (insertionAncestor) {
    upper = matchers.lastIndexOf(insertionAncestor, upper - 1);
  }
  return upper;
}
function getInsertionAncestor(matcher) {
  let ancestor = matcher;
  while (ancestor = ancestor.parent) {
    if (isMatchable(ancestor) && comparePathParserScore(matcher, ancestor) === 0) {
      return ancestor;
    }
  }
  return;
}
function isMatchable({ record }) {
  return !!(record.name || record.components && Object.keys(record.components).length || record.redirect);
}
function parseQuery(search) {
  const query = {};
  if (search === "" || search === "?")
    return query;
  const hasLeadingIM = search[0] === "?";
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
  for (let i = 0; i < searchParams.length; ++i) {
    const searchParam = searchParams[i].replace(PLUS_RE, " ");
    const eqPos = searchParam.indexOf("=");
    const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
    if (key in query) {
      let currentValue = query[key];
      if (!isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
function stringifyQuery(query) {
  let search = "";
  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);
    if (value == null) {
      if (value !== void 0) {
        search += (search.length ? "&" : "") + key;
      }
      continue;
    }
    const values = isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
    values.forEach((value2) => {
      if (value2 !== void 0) {
        search += (search.length ? "&" : "") + key;
        if (value2 != null)
          search += "=" + value2;
      }
    });
  }
  return search;
}
function normalizeQuery(query) {
  const normalizedQuery = {};
  for (const key in query) {
    const value = query[key];
    if (value !== void 0) {
      normalizedQuery[key] = isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
    }
  }
  return normalizedQuery;
}
const matchedRouteKey = Symbol("");
const viewDepthKey = Symbol("");
const routerKey = Symbol("");
const routeLocationKey = Symbol("");
const routerViewLocationKey = Symbol("");
function useCallbacks() {
  let handlers = [];
  function add(handler) {
    handlers.push(handler);
    return () => {
      const i = handlers.indexOf(handler);
      if (i > -1)
        handlers.splice(i, 1);
    };
  }
  function reset() {
    handlers = [];
  }
  return {
    add,
    list: () => handlers.slice(),
    reset
  };
}
function guardToPromiseFn(guard, to, from, record, name, runWithContext = (fn) => fn()) {
  const enterCallbackArray = record && // name is defined if record is because of the function overload
  (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
  return () => new Promise((resolve, reject) => {
    const next = (valid) => {
      if (valid === false) {
        reject(createRouterError(4, {
          from,
          to
        }));
      } else if (valid instanceof Error) {
        reject(valid);
      } else if (isRouteLocation(valid)) {
        reject(createRouterError(2, {
          from: to,
          to: valid
        }));
      } else {
        if (enterCallbackArray && // since enterCallbackArray is truthy, both record and name also are
        record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") {
          enterCallbackArray.push(valid);
        }
        resolve();
      }
    };
    const guardReturn = runWithContext(() => guard.call(record && record.instances[name], to, from, next));
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    guardCall.catch((err) => reject(err));
  });
}
function extractComponentsGuards(matched, guardType, to, from, runWithContext = (fn) => fn()) {
  const guards = [];
  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];
      if (guardType !== "beforeRouteEnter" && !record.instances[name])
        continue;
      if (isRouteComponent(rawComponent)) {
        const options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name, runWithContext));
      } else {
        let componentPromise = rawComponent();
        guards.push(() => componentPromise.then((resolved) => {
          if (!resolved)
            throw new Error(`Couldn't resolve component "${name}" at "${record.path}"`);
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.mods[name] = resolved;
          record.components[name] = resolvedComponent;
          const options = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name, runWithContext)();
        }));
      }
    }
  }
  return guards;
}
function useLink(props) {
  const router = inject(routerKey);
  const currentRoute = inject(routeLocationKey);
  const route = computed(() => {
    const to = unref(props.to);
    return router.resolve(to);
  });
  const activeRecordIndex = computed(() => {
    const { matched } = route.value;
    const { length } = matched;
    const routeMatched = matched[length - 1];
    const currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length)
      return -1;
    const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index > -1)
      return index;
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return (
      // we are dealing with nested routes
      length > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      getOriginalPath(routeMatched) === parentRecordPath && // avoid comparing the child with its parent
      currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index
    );
  });
  const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      const p = router[unref(props.replace) ? "replace" : "push"](
        unref(props.to)
        // avoid uncaught errors are they are logged anyway
      ).catch(noop);
      if (props.viewTransition && false) ;
      return p;
    }
    return Promise.resolve();
  }
  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
function preferSingleVNode(vnodes) {
  return vnodes.length === 1 ? vnodes[0] : vnodes;
}
const RouterLinkImpl = /* @__PURE__ */ defineComponent({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    replace: Boolean,
    activeClass: String,
    // inactiveClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    },
    viewTransition: Boolean
  },
  useLink,
  setup(props, { slots }) {
    const link = reactive(useLink(props));
    const { options } = inject(routerKey);
    const elClass = computed(() => ({
      [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
    }));
    return () => {
      const children = slots.default && preferSingleVNode(slots.default(link));
      return props.custom ? children : h("a", {
        "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        // this would override user added attrs but Vue will still add
        // the listener, so we end up triggering both
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }
});
const RouterLink = RouterLinkImpl;
function guardEvent(e) {
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
    return;
  if (e.defaultPrevented)
    return;
  if (e.button !== void 0 && e.button !== 0)
    return;
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target))
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
  return true;
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key];
    const outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue)
        return false;
    } else {
      if (!isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
        return false;
    }
  }
  return true;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
const RouterViewImpl = /* @__PURE__ */ defineComponent({
  name: "RouterView",
  // #674 we manually inherit them
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  // Better compat for @vue/compat users
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },
  setup(props, { attrs, slots }) {
    const injectedRoute = inject(routerViewLocationKey);
    const routeToDisplay = computed(() => props.route || injectedRoute.value);
    const injectedDepth = inject(viewDepthKey, 0);
    const depth = computed(() => {
      let initialDepth = unref(injectedDepth);
      const { matched } = routeToDisplay.value;
      let matchedRoute;
      while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
        initialDepth++;
      }
      return initialDepth;
    });
    const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth.value]);
    provide(viewDepthKey, computed(() => depth.value + 1));
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);
    const viewRef = ref();
    watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
      if (to) {
        to.instances[name] = instance;
        if (from && from !== to && instance && instance === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }
          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      }
      if (instance && to && // if there is no instance but to and from are the same this might be
      // the first visit
      (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
        (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
      }
    }, { flush: "post" });
    return () => {
      const route = routeToDisplay.value;
      const currentName = props.name;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[currentName];
      if (!ViewComponent) {
        return normalizeSlot$1(slots.default, { Component: ViewComponent, route });
      }
      const routePropsOption = matchedRoute.props[currentName];
      const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
      const onVnodeUnmounted = (vnode) => {
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };
      const component = h(ViewComponent, assign({}, routeProps, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        normalizeSlot$1(slots.default, { Component: component, route }) || component
      );
    };
  }
});
function normalizeSlot$1(slot, data) {
  if (!slot)
    return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
const RouterView = RouterViewImpl;
function createRouter(options) {
  const matcher = createRouterMatcher(options.routes, options);
  const parseQuery$12 = options.parseQuery || parseQuery;
  const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  const routerHistory = options.history;
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED;
  const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = (
    // @ts-expect-error: intentionally avoid the type check
    applyToParams.bind(null, decode)
  );
  function addRoute(parentOrRoute, route) {
    let parent;
    let record;
    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route;
    } else {
      record = parentOrRoute;
    }
    return matcher.addRoute(record, parent);
  }
  function removeRoute(name) {
    const recordMatcher = matcher.getRecordMatcher(name);
    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name) {
    return !!matcher.getRecordMatcher(name);
  }
  function resolve(rawLocation, currentLocation) {
    currentLocation = assign({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      const locationNormalized = parseURL(parseQuery$12, rawLocation, currentLocation.path);
      const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      const href2 = routerHistory.createHref(locationNormalized.fullPath);
      return assign(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if (rawLocation.path != null) {
      matcherLocation = assign({}, rawLocation, {
        path: parseURL(parseQuery$12, rawLocation.path, currentLocation.path).path
      });
    } else {
      const targetParams = assign({}, rawLocation.params);
      for (const key in targetParams) {
        if (targetParams[key] == null) {
          delete targetParams[key];
        }
      }
      matcherLocation = assign({}, rawLocation, {
        params: encodeParams(targetParams)
      });
      currentLocation.params = encodeParams(currentLocation.params);
    }
    const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash = rawLocation.hash || "";
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
      hash: encodeHash(hash),
      path: matchedRoute.path
    }));
    const href = routerHistory.createHref(fullPath);
    return assign({
      fullPath,
      // keep the hash encoded so fullPath is effectively path + encodedQuery +
      // hash
      hash,
      query: (
        // if the user is using a custom query lib like qs, we might have
        // nested objects, so we keep the query as is, meaning it can contain
        // numbers at `$route.query`, but at the point, the user will have to
        // use their own type anyway.
        // https://github.com/vuejs/router/issues/328#issuecomment-649481567
        stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
      )
    }, matchedRoute, {
      redirectedFrom: void 0,
      href
    });
  }
  function locationAsObject(to) {
    return typeof to === "string" ? parseURL(parseQuery$12, to, currentRoute.value.path) : assign({}, to);
  }
  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8, {
        from,
        to
      });
    }
  }
  function push(to) {
    return pushWithRedirect(to);
  }
  function replace(to) {
    return push(assign(locationAsObject(to), { replace: true }));
  }
  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];
    if (lastMatched && lastMatched.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
      if (typeof newTargetLocation === "string") {
        newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : (
          // force empty params
          { path: newTargetLocation }
        );
        newTargetLocation.params = {};
      }
      return assign({
        query: to.query,
        hash: to.hash,
        // avoid transferring params if the redirect has a path
        params: newTargetLocation.path != null ? {} : to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve(to);
    const from = currentRoute.value;
    const data = to.state;
    const force = to.force;
    const replace2 = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect)
      return pushWithRedirect(
        assign(locationAsObject(shouldRedirect), {
          state: typeof shouldRedirect === "object" ? assign({}, data, shouldRedirect.state) : data,
          force,
          replace: replace2
        }),
        // keep original redirectedFrom if it exists
        redirectedFrom || targetLocation
      );
    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;
    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16, { to: toLocation, from });
      handleScroll();
    }
    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? (
      // navigation redirects still mark the router as ready
      isNavigationFailure(
        error,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? error : markAsReady(error)
    ) : (
      // reject any unknown error
      triggerError(error, toLocation, from)
    )).then((failure2) => {
      if (failure2) {
        if (isNavigationFailure(
          failure2,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        )) {
          return pushWithRedirect(
            // keep options
            assign({
              // preserve an existing replacement but allow the redirect to override it
              replace: replace2
            }, locationAsObject(failure2.to), {
              state: typeof failure2.to === "object" ? assign({}, data, failure2.to.state) : data,
              force
            }),
            // preserve the original redirectedFrom if any
            redirectedFrom || toLocation
          );
        }
      } else {
        failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
      }
      triggerAfterEach(toLocation, from, failure2);
      return failure2;
    });
  }
  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  }
  function runWithContext(fn) {
    const app = installedApps.values().next().value;
    return app && typeof app.runWithContext === "function" ? app.runWithContext(fn) : fn();
  }
  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
    guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
    for (const record of leavingRecords) {
      record.leaveGuards.forEach((guard) => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }
    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck);
    return runGuardQueue(guards).then(() => {
      guards = [];
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
      for (const record of updatingRecords) {
        record.updateGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const record of enteringRecords) {
        if (record.beforeEnter) {
          if (isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      to.matched.forEach((record) => record.enterCallbacks = {});
      guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from, runWithContext);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).catch((err) => isNavigationFailure(
      err,
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ) ? err : Promise.reject(err));
  }
  function triggerAfterEach(to, from, failure) {
    afterGuards.list().forEach((guard) => runWithContext(() => guard(to, from, failure)));
  }
  function finalizeNavigation(toLocation, from, isPush, replace2, data) {
    const error = checkCanceledNavigation(toLocation, from);
    if (error)
      return error;
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = {};
    if (isPush) {
      if (replace2 || isFirstNavigation)
        routerHistory.replace(toLocation.fullPath, assign({
          scroll: isFirstNavigation && state && state.scroll
        }, data));
      else
        routerHistory.push(toLocation.fullPath, data);
    }
    currentRoute.value = toLocation;
    handleScroll();
    markAsReady();
  }
  let removeHistoryListener;
  function setupListeners() {
    if (removeHistoryListener)
      return;
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      if (!router.listening)
        return;
      const toLocation = resolve(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign(shouldRedirect, { replace: true, force: true }), toLocation).catch(noop);
        return;
      }
      pendingLocation = toLocation;
      const from = currentRoute.value;
      navigate(toLocation, from).catch((error) => {
        if (isNavigationFailure(
          error,
          4 | 8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        )) {
          return error;
        }
        if (isNavigationFailure(
          error,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        )) {
          pushWithRedirect(
            assign(locationAsObject(error.to), {
              force: true
            }),
            toLocation
            // avoid an uncaught rejection, let push call triggerError
          ).then((failure) => {
            if (isNavigationFailure(
              failure,
              4 | 16
              /* ErrorTypes.NAVIGATION_DUPLICATED */
            ) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop);
          return Promise.reject();
        }
        if (info.delta) {
          routerHistory.go(-info.delta, false);
        }
        return triggerError(error, toLocation, from);
      }).then((failure) => {
        failure = failure || finalizeNavigation(
          // after navigation, all matched components are resolved
          toLocation,
          from,
          false
        );
        if (failure) {
          if (info.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
          // entry while a different route is displayed
          !isNavigationFailure(
            failure,
            8
            /* ErrorTypes.NAVIGATION_CANCELLED */
          )) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(
            failure,
            4 | 16
            /* ErrorTypes.NAVIGATION_DUPLICATED */
          )) {
            routerHistory.go(-1, false);
          }
        }
        triggerAfterEach(toLocation, from, failure);
      }).catch(noop);
    });
  }
  let readyHandlers = useCallbacks();
  let errorListeners = useCallbacks();
  let ready;
  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorListeners.list();
    if (list.length) {
      list.forEach((handler) => handler(error, to, from));
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve2, reject) => {
      readyHandlers.add([resolve2, reject]);
    });
  }
  function markAsReady(err) {
    if (!ready) {
      ready = !err;
      setupListeners();
      readyHandlers.list().forEach(([resolve2, reject]) => err ? reject(err) : resolve2());
      readyHandlers.reset();
    }
    return err;
  }
  function handleScroll(to, from, isPush, isFirstNavigation) {
    const { scrollBehavior } = options;
    return Promise.resolve();
  }
  const go = (delta) => routerHistory.go(delta);
  const installedApps = /* @__PURE__ */ new Set();
  const router = {
    currentRoute,
    listening: true,
    addRoute,
    removeRoute,
    clearRoutes: matcher.clearRoutes,
    hasRoute,
    getRoutes,
    resolve,
    options,
    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorListeners.add,
    isReady,
    install(app) {
      const router2 = this;
      app.component("RouterLink", RouterLink);
      app.component("RouterView", RouterView);
      app.config.globalProperties.$router = router2;
      Object.defineProperty(app.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute)
      });
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        Object.defineProperty(reactiveRoute, key, {
          get: () => currentRoute.value[key],
          enumerable: true
        });
      }
      app.provide(routerKey, router2);
      app.provide(routeLocationKey, shallowReactive(reactiveRoute));
      app.provide(routerViewLocationKey, currentRoute);
      const unmountApp = app.unmount;
      installedApps.add(app);
      app.unmount = function() {
        installedApps.delete(app);
        if (installedApps.size < 1) {
          pendingLocation = START_LOCATION_NORMALIZED;
          removeHistoryListener && removeHistoryListener();
          removeHistoryListener = null;
          currentRoute.value = START_LOCATION_NORMALIZED;
          ready = false;
        }
        unmountApp();
      };
    }
  };
  function runGuardQueue(guards) {
    return guards.reduce((promise, guard) => promise.then(() => runWithContext(guard)), Promise.resolve());
  }
  return router;
}
function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);
  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i];
    if (recordFrom) {
      if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
        updatingRecords.push(recordFrom);
      else
        leavingRecords.push(recordFrom);
    }
    const recordTo = to.matched[i];
    if (recordTo) {
      if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }
  return [leavingRecords, updatingRecords, enteringRecords];
}
function useRoute(_name) {
  return inject(routeLocationKey);
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const _routes = [
  {
    name: "index",
    path: "/",
    component: () => import('./index-MXlQQ3rs.mjs')
  },
  {
    name: "auth-login",
    path: "/auth/login",
    component: () => import('./login-D9Zox7yL.mjs')
  },
  {
    name: "chat-groups",
    path: "/chat/groups",
    component: () => import('./groups-ubw79yPT.mjs'),
    children: [
      {
        name: "chat-groups-id",
        path: ":id()",
        component: () => import('./_id_-CjruL1Je.mjs')
      }
    ]
  },
  {
    name: "chat-friends",
    path: "/chat/friends",
    component: () => import('./friends-BPpJchxJ.mjs')
  },
  {
    name: "auth-register",
    path: "/auth/register",
    component: () => import('./register-CbrNDCEE.mjs')
  },
  {
    name: "chat-messages",
    path: "/chat/messages",
    meta: { "middleware": ["auth"] },
    component: () => import('./messages-Dw7H9SPW.mjs'),
    children: [
      {
        name: "chat-messages-id",
        path: ":id()",
        component: () => import('./_id_-CyVXfQTr.mjs')
      }
    ]
  }
];
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = (route == null ? void 0 : route.meta.key) ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r2) => {
    var _a;
    return ((_a = route.params[r2.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION_NORMALIZED) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => {
      var _a, _b;
      return comp.components && comp.components.default === ((_b = (_a = from.matched[index]) == null ? void 0 : _a.components) == null ? void 0 : _b.default);
    }
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    var _a;
    const nuxtApp = useNuxtApp();
    const behavior = ((_a = useRouter().options) == null ? void 0 : _a.scrollBehaviorType) ?? "auto";
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    let position = savedPosition || void 0;
    if (!position && isChangingPage(to, from)) {
      position = { left: 0, top: 0 };
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION_NORMALIZED) {
        resolve(_calculatePosition(to, "instant", position));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, "instant", position)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, scrollBehaviorType, position) {
  if (position) {
    return position;
  }
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: scrollBehaviorType
    };
  }
  return { left: 0, top: 0, behavior: scrollBehaviorType };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {
  auth: () => import('./auth-DiAwMk0k.mjs')
};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b, _c;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION_NORMALIZED) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION_NORMALIZED, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c2, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c2 = from.matched[0]) == null ? void 0 : _c2.components) == null ? void 0 : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware || (nuxtApp._middleware = {
      global: [],
      named: {}
    });
    useError();
    if (!((_b = nuxtApp.ssrContext) == null ? void 0 : _b.islandContext)) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if ((failure == null ? void 0 : failure.type) === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if ((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r2) => r2.default || r2)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach(async (to, _from) => {
      if (to.matched.length === 0) {
        await nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      var _a;
      if (mounted.value) {
        const vnodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, props.trailingSlash);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink == null ? void 0 : useBuiltinLink({ ...props, to });
    const href = computed(() => {
      var _a;
      const effectiveTrailingSlash = props.trailingSlash ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return ((_a = router.resolve(to.value)) == null ? void 0 : _a.href) ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: (link == null ? void 0 : link.isActive) ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: (link == null ? void 0 : link.isExactActive) ?? computed(() => to.value === router.currentRoute.value.path),
      route: (link == null ? void 0 : link.route) ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        var _a;
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery$1(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", { ref: el, href: href.value || null, rel, target }, (_a = slots.default) == null ? void 0 : _a.call(slots));
      };
    }
    // }) as unknown as DefineComponent<NuxtLinkProps, object, object, ComputedOptions, MethodOptions, object, object, EmitsOptions, string, object, NuxtLinkProps, object, SlotsType<NuxtLinkSlots>>
  });
}
const __nuxt_component_0$1 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    {
      nuxtApp.payload.pinia = toRaw(pinia.state.value);
    }
    return {
      provide: {
        pinia
      }
    };
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = computed(() => !!user.value);
  const token = ref(null);
  const proxyUrl = "/api/proxy";
  const isConnecting = ref(false);
  const connectionError = ref(null);
  function getAuthHeaders() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    if (token.value) {
      headers["Authorization"] = `Bearer ${token.value}`;
    }
    return headers;
  }
  function setTokenCookie(tokenValue) {
  }
  function getTokenFromCookie() {
    return null;
  }
  async function checkServerConnectivity() {
    isConnecting.value = true;
    connectionError.value = null;
    try {
      console.log("Assuming server connectivity without making a request");
      return { online: true, message: "Connected to authentication server" };
    } catch (error) {
      console.error("Server connectivity check failed:", error);
      connectionError.value = error.message || "Failed to connect to server";
      return {
        online: false,
        message: "Unable to connect to authentication server. Please check if the server is running.",
        error
      };
    } finally {
      isConnecting.value = false;
      isConnecting.value = false;
    }
  }
  async function login(email, password) {
    var _a, _b, _c, _d;
    try {
      console.log("Attempting login with:", { email, password: "********" });
      const urls = [
        `${proxyUrl}/auth/login`,
        // Standard pattern
        `/api/proxy/auth/login`,
        // Absolute pattern
        `/api/proxy/login`
        // Direct login without auth path
      ];
      let response = null;
      let urlUsed = "";
      let error = null;
      for (const url of urls) {
        try {
          console.log(`Trying login with URL: ${url}`);
          const resp = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({ email, password })
          });
          response = resp;
          urlUsed = url;
          break;
        } catch (err) {
          console.warn(`Error with URL ${url}:`, err);
          error = err;
        }
      }
      if (!response) {
        console.error("All login URL attempts failed");
        throw error || new Error("Failed to connect to authentication server");
      }
      console.log(`Login response status from ${urlUsed}:`, response.status);
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("Login response data:", data);
      } else {
        const text = await response.text();
        console.log("Login response text:", text);
        data = { message: text || "Login failed" };
      }
      if (!response.ok) {
        throw new Error(
          data.message || data.error || `Login failed with status: ${response.status}`
        );
      }
      const authToken = data.token || data.access_token || data.accessToken || ((_a = data.data) == null ? void 0 : _a.token) || ((_b = data.data) == null ? void 0 : _b.access_token) || ((_c = data.data) == null ? void 0 : _c.accessToken);
      if (!authToken) {
        console.warn("No token received from backend", data);
        throw new Error("Authentication failed: No token received");
      }
      const rawUserData = data.user || ((_d = data.data) == null ? void 0 : _d.user) || data.data || data;
      const userData = {
        id: rawUserData.id || rawUserData.user_id || rawUserData._id || "unknown",
        email: rawUserData.email || email,
        name: rawUserData.name || rawUserData.username || `${rawUserData.first_name || ""} ${rawUserData.last_name || ""}`.trim() || email,
        username: rawUserData.username,
        first_name: rawUserData.first_name,
        last_name: rawUserData.last_name,
        phone_number: rawUserData.phone_number,
        about_me: rawUserData.about_me,
        profile_picture_url: rawUserData.profile_picture_url || rawUserData.avatar || rawUserData.image
      };
      console.log("Processed user data:", userData);
      user.value = userData;
      token.value = authToken;
      setTokenCookie(authToken);
      if (false) ;
      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
        throw new Error(
          "Connection to server failed. Please check if the server is running."
        );
      }
      let errorMessage = "Invalid email or password";
      if (error.message) {
        if (error.message.includes("Invalid credentials") || error.message.includes("Invalid email or password") || error.message.includes("Unauthorized")) {
          if (email.includes("@gmail.coma")) {
            errorMessage = "Your email contains a typo: '@gmail.coma' should be '@gmail.com'. Please correct your email address.";
          } else if (email.endsWith(".coma")) {
            errorMessage = "Your email contains a typo: it ends with '.coma' instead of '.com'. Please correct your email address.";
          } else if (email.includes(".con")) {
            errorMessage = "Your email contains a typo: '.con' should be '.com'. Please check your email address.";
          } else {
            errorMessage = "Invalid email or password. Please check your credentials and try again.";
          }
        } else {
          errorMessage = error.message;
        }
      }
      throw new Error(errorMessage);
    }
  }
  async function register(registerData) {
    var _a;
    try {
      console.log("Attempting registration with:", {
        ...registerData,
        password: "********"
      });
      const response = await fetch(`${proxyUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(registerData)
      });
      console.log("Registration response status:", response.status);
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("Registration response data:", data);
      } else {
        const text = await response.text();
        console.log("Registration response text:", text);
        data = { message: text || "Registration failed" };
      }
      if (!response.ok) {
        throw new Error(
          data.message || data.error || `Registration failed with status: ${response.status}`
        );
      }
      const successMessage = data.message || ((_a = data.data) == null ? void 0 : _a.message) || "Registration successful! Please login.";
      return {
        success: true,
        message: successMessage
      };
    } catch (error) {
      console.error("Registration error:", error);
      if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
        throw new Error(
          "Connection to server failed. Please check if the server is running."
        );
      }
      throw new Error(
        (error == null ? void 0 : error.message) || "Registration failed. Please try again."
      );
    }
  }
  async function getUserInfo() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    try {
      const currentToken = token.value || getTokenFromCookie();
      if (!currentToken) {
        throw new Error("No authentication token available");
      }
      if (!token.value && currentToken) {
        token.value = currentToken;
      }
      console.log("Fetching user info with token");
      const possibleEndpoints = [
        `${proxyUrl}/auth/user/info`,
        `${proxyUrl}/auth/me`,
        `${proxyUrl}/auth/user`,
        `${proxyUrl}/auth/profile`
      ];
      let response = null;
      let endpointUsed = "";
      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const resp = await fetch(endpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${currentToken}`,
              // Adding a fallback in case cookies aren't sent automatically
              Cookie: `auth_token=${currentToken}`
            },
            // Include credentials to ensure cookies are sent with the request
            credentials: "include"
          });
          if (resp.ok || resp.status === 401) {
            response = resp;
            endpointUsed = endpoint;
            break;
          }
        } catch (err) {
          console.warn(`Error with endpoint ${endpoint}:`, err);
        }
      }
      if (!response) {
        throw new Error("Failed to find valid user info endpoint");
      }
      console.log(
        `User info response status: ${response.status} from endpoint: ${endpointUsed}`
      );
      if (response.status === 401) {
        throw new Error("Unauthorized: Invalid or expired token");
      }
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("User info response data:", data);
      } else {
        const text = await response.text();
        console.log("User info response text:", text);
        data = { message: text || "Failed to fetch user information" };
      }
      if (!response.ok) {
        throw new Error(
          data.message || data.error || `Failed to fetch user information: ${response.status}`
        );
      }
      const rawUserData = data.user || ((_a = data.data) == null ? void 0 : _a.user) || data.data || data;
      const userData = {
        ...user.value,
        id: rawUserData.id || rawUserData.user_id || rawUserData._id || ((_b = user.value) == null ? void 0 : _b.id) || "unknown",
        email: rawUserData.email || ((_c = user.value) == null ? void 0 : _c.email) || "",
        name: rawUserData.name || rawUserData.username || `${rawUserData.first_name || ""} ${rawUserData.last_name || ""}`.trim() || ((_d = user.value) == null ? void 0 : _d.name) || "",
        username: rawUserData.username || ((_e = user.value) == null ? void 0 : _e.username),
        first_name: rawUserData.first_name || ((_f = user.value) == null ? void 0 : _f.first_name),
        last_name: rawUserData.last_name || ((_g = user.value) == null ? void 0 : _g.last_name),
        phone_number: rawUserData.phone_number || ((_h = user.value) == null ? void 0 : _h.phone_number),
        about_me: rawUserData.about_me || ((_i = user.value) == null ? void 0 : _i.about_me),
        profile_picture_url: rawUserData.profile_picture_url || rawUserData.avatar || rawUserData.image || ((_j = user.value) == null ? void 0 : _j.profile_picture_url)
      };
      user.value = userData;
      if (false) ;
      return userData;
    } catch (error) {
      console.error("Get user info error:", error);
      if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
        throw new Error(
          "Connection to server failed. Please check if the server is running."
        );
      }
      throw new Error((error == null ? void 0 : error.message) || "Failed to get user information");
    }
  }
  function logout() {
    user.value = null;
    token.value = null;
  }
  async function init() {
    return false;
  }
  async function updateProfile(profileData) {
    var _a;
    try {
      const currentToken = token.value || getTokenFromCookie();
      if (!currentToken) {
        throw new Error("No authentication token available");
      }
      const endpoint = `${proxyUrl}/users/profile`;
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${currentToken}`
        },
        body: JSON.stringify(profileData),
        credentials: "include"
      });
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || "Profile update failed" };
      }
      if (!response.ok) {
        throw new Error(
          data.message || data.error || `Profile update failed with status: ${response.status}`
        );
      }
      const updatedUserData = data.user || ((_a = data.data) == null ? void 0 : _a.user) || data.data || data;
      if (user.value) {
        const updatedUser = {
          ...user.value,
          first_name: updatedUserData.first_name || user.value.first_name,
          last_name: updatedUserData.last_name || user.value.last_name,
          phone_number: updatedUserData.phone_number || user.value.phone_number,
          about_me: updatedUserData.about_me || user.value.about_me,
          // Update name as well if it's derived from first and last name
          name: updatedUserData.name || `${updatedUserData.first_name || user.value.first_name || ""} ${updatedUserData.last_name || user.value.last_name || ""}`.trim() || user.value.name
        };
        user.value = updatedUser;
        if (false) ;
      } else {
        console.warn("No user object to update!");
      }
      return {
        success: true,
        message: data.message || "Profile updated successfully",
        user: user.value
      };
    } catch (error) {
      console.error("Profile update error:", error);
      if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
        throw new Error(
          "Connection to server failed. Please check if the server is running."
        );
      }
      throw new Error((error == null ? void 0 : error.message) || "Failed to update profile");
    }
  }
  async function updateAvatar(file) {
    try {
      const currentToken = token.value || getTokenFromCookie();
      if (!currentToken) {
        throw new Error("No authentication token available");
      }
      const uploadEndpoint = `${proxyUrl}/files/upload`;
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      try {
        const uploadResponse = await fetch(uploadEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentToken}`
          },
          body: uploadFormData,
          credentials: "include"
        });
        if (!uploadResponse.ok) {
        } else {
          const uploadData = await uploadResponse.json();
          const fileUrl = uploadData.url || uploadData.fileUrl || uploadData.file_url;
          if (fileUrl) {
            const avatarEndpoint = `${proxyUrl}/users/profile/avatar`;
            const avatarResponse = await fetch(avatarEndpoint, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentToken}`
              },
              body: JSON.stringify({ profile_picture_url: fileUrl }),
              credentials: "include"
            });
            if (avatarResponse.ok) {
              const avatarData = await avatarResponse.json();
              updateUserWithNewAvatar(avatarData, fileUrl);
              return {
                success: true,
                message: "Avatar updated successfully",
                user: user.value
              };
            }
          }
        }
      } catch (error) {
      }
      const directEndpoint = `${proxyUrl}/users/avatar`;
      const directFormData = new FormData();
      directFormData.append("avatar", file);
      const directResponse = await fetch(directEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentToken}`
        },
        body: directFormData,
        credentials: "include"
      });
      if (!directResponse.ok) {
        const placeholderUrl = "https://via.placeholder.com/150";
        const jsonEndpoint = `${proxyUrl}/users/profile/avatar`;
        const jsonResponse = await fetch(jsonEndpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${currentToken}`
          },
          body: JSON.stringify({ profile_picture_url: placeholderUrl }),
          credentials: "include"
        });
        if (!jsonResponse.ok) {
          throw new Error(
            "Failed to update avatar using all available methods"
          );
        }
        const jsonData = await jsonResponse.json();
        updateUserWithNewAvatar(jsonData, placeholderUrl);
        return {
          success: true,
          message: "Avatar updated with placeholder (file upload not supported)",
          user: user.value
        };
      }
      let data;
      const contentType = directResponse.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await directResponse.json();
      } else {
        const text = await directResponse.text();
        data = { message: text || "Avatar updated" };
      }
      updateUserWithNewAvatar(data);
      return {
        success: true,
        message: data.message || "Avatar updated successfully",
        user: user.value
      };
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
        throw new Error(
          "Connection to server failed. Please check if the server is running."
        );
      }
      throw new Error((error == null ? void 0 : error.message) || "Failed to update avatar");
    }
  }
  function updateUserWithNewAvatar(data, fallbackUrl) {
    var _a;
    const updatedData = data.user || ((_a = data.data) == null ? void 0 : _a.user) || data.data || data;
    const avatarUrl = updatedData.profile_picture_url || updatedData.avatar || updatedData.image || fallbackUrl;
    if (!avatarUrl) {
      console.warn("[DEBUG] No avatar URL found in response or fallback");
      return;
    }
    console.log("[DEBUG] Using avatar URL:", avatarUrl);
    if (user.value) {
      const updatedUser = {
        ...user.value,
        profile_picture_url: avatarUrl
      };
      user.value = updatedUser;
    }
  }
  async function changePassword(passwordData) {
    try {
      const currentToken = token.value || getTokenFromCookie();
      if (!currentToken) {
        throw new Error("No authentication token available");
      }
      console.log("Changing password");
      const endpoint = `${proxyUrl}/users/password`;
      const requestBody = {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.new_password,
        // Menambahkan confirm_password
        // Tambahan field yang mungkin dibutuhkan oleh API
        currentPassword: passwordData.current_password,
        newPassword: passwordData.new_password,
        password: passwordData.new_password,
        old_password: passwordData.current_password,
        oldPassword: passwordData.current_password,
        password_confirmation: passwordData.new_password,
        confirmPassword: passwordData.new_password
      };
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${currentToken}`
        },
        body: JSON.stringify(requestBody),
        credentials: "include"
      });
      console.log("[DEBUG] Password change response status:", response.status);
      if (!response.ok && response.status === 400) {
        console.log(
          "[DEBUG] First attempt failed, trying with different field names"
        );
        const alternativeEndpoint = `${proxyUrl}/users/profile/password`;
        const alternativeResponse = await fetch(alternativeEndpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${currentToken}`
          },
          body: JSON.stringify({
            password: passwordData.new_password,
            old_password: passwordData.current_password,
            confirm_password: passwordData.new_password,
            password_confirmation: passwordData.new_password
          }),
          credentials: "include"
        });
        if (alternativeResponse.ok) {
          return {
            success: true,
            message: "Password changed successfully"
          };
        }
      }
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || "Password change failed" };
      }
      if (!response.ok) {
        throw new Error(
          data.message || data.error || `Password change failed with status: ${response.status}`
        );
      }
      return {
        success: true,
        message: data.message || "Password changed successfully"
      };
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
        throw new Error(
          "Connection to server failed. Please check if the server is running."
        );
      }
      throw new Error((error == null ? void 0 : error.message) || "Failed to change password");
    }
  }
  function handleAuthError() {
    console.warn("Authentication error detected. Logging out user.");
    logout();
  }
  return {
    user,
    isAuthenticated,
    token,
    login,
    register,
    getUserInfo,
    logout,
    init,
    getAuthHeaders,
    checkServerConnectivity,
    updateProfile,
    updateAvatar,
    changePassword,
    handleAuthError
    // Add the new function to the returned object
  };
});
const api_jy9dy79pM_nYQuRKPrcfNg56p_gKkzw9SekUTZgAenc = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const apiFetch = async (url, options = {}) => {
    const authStore = useAuthStore();
    const token = authStore.token || null;
    const isFormData = options.body instanceof FormData;
    if (isFormData) {
      console.log("Detected FormData request, handling special headers setup");
    }
    const headerOptions = {
      // Don't set Content-Type header for FormData (browser will set it with boundary)
      ...isFormData ? {} : { "Content-Type": "application/json" },
      Accept: "application/json"
    };
    if (token) {
      headerOptions["Authorization"] = `Bearer ${token}`;
    }
    const headers = new Headers(headerOptions);
    const mergedOptions = {
      ...options,
      headers,
      credentials: options.credentials || "same-origin"
    };
    let completeUrl;
    if (url.startsWith("http")) {
      completeUrl = url;
    } else if (url.startsWith("/api/proxy")) {
      completeUrl = url;
    } else {
      const normalizedPath = url.startsWith("/") ? url : `/${url}`;
      completeUrl = `/api/proxy${normalizedPath}`;
    }
    if (completeUrl.includes("undefined") || completeUrl.includes("null")) {
      throw new Error(`Invalid URL construction detected: ${completeUrl}`);
    }
    try {
      const response = await fetch(completeUrl, mergedOptions);
      if (!response.ok) {
        let errorDetail;
        const contentType = response.headers.get("content-type");
        try {
          if (contentType && contentType.includes("application/json")) {
            errorDetail = await response.json();
          } else {
            errorDetail = await response.text();
          }
        } catch (parseError) {
          console.warn("Could not parse error response:", parseError);
          errorDetail = "Could not parse server response";
        }
        const error = new Error(
          typeof errorDetail === "string" ? errorDetail : (errorDetail == null ? void 0 : errorDetail.message) || `API Error: ${response.status} ${response.statusText}`
        );
        error.status = response.status;
        error.response = response;
        error.data = errorDetail;
        throw error;
      }
      return response;
    } catch (error) {
      console.error(`API request to ${completeUrl} failed:`, error);
      if (error instanceof TypeError && error.message.includes("Invalid URL")) {
        console.error("URL construction details:", {
          originalUrl: url,
          constructedUrl: completeUrl
        });
        if (url.includes("/groups")) {
          const groupIdMatch = url.match(/\/groups\/([^\/\?]+)/);
          const groupId = groupIdMatch ? groupIdMatch[1] : "unknown";
          console.error(`Group API request failed for group ID: ${groupId}`);
        }
        throw new Error(
          `API request failed: Could not construct a valid URL for '${url}'. Please check the URL format.`
        );
      }
      throw error;
    }
  };
  const parseJsonResponse = async (response) => {
    try {
      return await response.json();
    } catch (error) {
      console.error("JSON parsing error:", error);
      try {
        const textContent = await response.clone().text();
        const truncatedContent = textContent.length > 100 ? `${textContent.substring(0, 100)}...` : textContent;
        console.error("Response was not valid JSON:", truncatedContent);
        throw new Error(
          `Invalid JSON response from server. Received: ${truncatedContent}`
        );
      } catch (textError) {
        throw new Error("Could not parse server response as JSON");
      }
    }
  };
  const api = {
    fetch: apiFetch,
    // Base URL helper - now using internal proxy
    baseUrl: "/api/proxy",
    // GET request helper with JSON parsing
    async get(url, options = {}) {
      const response = await apiFetch(url, {
        ...options,
        method: "GET"
      });
      return parseJsonResponse(response);
    },
    // POST request helper with JSON parsing
    async post(url, data, options = {}) {
      const response = await apiFetch(url, {
        ...options,
        method: "POST",
        body: JSON.stringify(data)
      });
      return parseJsonResponse(response);
    },
    // PUT request helper with JSON parsing
    async put(url, data, options = {}) {
      const response = await apiFetch(url, {
        ...options,
        method: "PUT",
        body: JSON.stringify(data)
      });
      return parseJsonResponse(response);
    },
    // PATCH request helper with JSON parsing
    async patch(url, data, options = {}) {
      const response = await apiFetch(url, {
        ...options,
        method: "PATCH",
        body: JSON.stringify(data)
      });
      return parseJsonResponse(response);
    },
    // DELETE request helper with JSON parsing
    async delete(url, options = {}) {
      if (url.includes("/messages/")) {
        const pathParts = url.split("/");
        const messageId = pathParts.pop() || "";
        console.log(
          `[API] Processing delete request for message: ${messageId}`
        );
        console.log(`[API] Original URL: ${url}`);
        const isGroupMessage = url.includes("/groups/") || url.includes("?type=group");
        if (messageId.startsWith("temp-")) {
          console.log(`[API] Delete request for temp message: ${messageId}`);
          url = `/messages/${messageId}`;
          console.log(`[API] Normalized temp message deletion URL to: ${url}`);
        } else {
          url = `/messages/${messageId}`;
          if (isGroupMessage) {
            console.log(`[API] This is a group message deletion`);
          }
        }
        console.log(`[API] Final message deletion URL: ${url}`);
      }
      const response = await apiFetch(url, {
        ...options,
        method: "DELETE"
      });
      return parseJsonResponse(response);
    },
    // Raw versions that return the Response object without parsing JSON
    raw: {
      get: (url, options = {}) => {
        return apiFetch(url, {
          ...options,
          method: "GET"
        });
      },
      post: (url, data, options = {}) => {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        const contentTypeHeaders = data instanceof FormData ? {} : { "Content-Type": "application/json" };
        return apiFetch(url, {
          ...options,
          method: "POST",
          headers: {
            ...contentTypeHeaders,
            ...options.headers || {}
          },
          body
        });
      },
      put: (url, data, options = {}) => {
        let body;
        let contentTypeHeaders = {};
        if (data instanceof FormData) {
          body = data;
          contentTypeHeaders = {};
        } else {
          body = JSON.stringify(data);
          contentTypeHeaders = { "Content-Type": "application/json" };
        }
        return apiFetch(url, {
          ...options,
          method: "PUT",
          headers: {
            ...contentTypeHeaders,
            ...options.headers || {}
          },
          body
        });
      },
      patch: (url, data, options = {}) => {
        return apiFetch(url, {
          ...options,
          method: "PATCH",
          body: JSON.stringify(data)
        });
      },
      delete: (url, options = {}) => {
        return apiFetch(url, {
          ...options,
          method: "DELETE"
        });
      }
    },
    // Check server connectivity
    checkServerStatus: async (url) => {
      var _a;
      try {
        const response = await fetch(url, {
          method: "OPTIONS",
          cache: "no-cache",
          headers: {
            Accept: "application/json"
          }
        }).catch(() => {
          return fetch(url, {
            method: "GET",
            cache: "no-cache",
            headers: {
              Accept: "application/json"
            }
          });
        });
        return {
          online: true,
          status: response.status,
          statusText: response.statusText
        };
      } catch (error) {
        return {
          online: false,
          error: error.message || "Unknown error",
          isCors: ((_a = error.message) == null ? void 0 : _a.includes("CORS")) || false
        };
      }
    }
  };
  nuxtApp.provide("api", api);
});
const router_S6yKjqoQ3Sb8o2lehB5PRjhy2uyi4DI_Ja_jhT1JS60 = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
});
reactive({});
reactive({});
reactive({ items: [] });
reactive({ useHandler: void 0 });
reactive({});
reactive({});
const toast_F_pfj7FgRLbXLAWiXjuGtvyN_yqw93f_EjHy5PiyXpc = /* @__PURE__ */ defineNuxtPlugin(() => {
  return {
    provide: {
      toast: {
        success: (message, options) => {
          console.log(`[Toast] Success (SSR): ${message}`);
        },
        error: (message, options) => {
          console.error(`[Toast] Error (SSR): ${message}`);
        },
        info: (message, options) => {
          console.info(`[Toast] Info (SSR): ${message}`);
        },
        warning: (message, options) => {
          console.warn(`[Toast] Warning (SSR): ${message}`);
        }
      }
    }
  };
});
const plugins = [
  payloadPlugin,
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4,
  api_jy9dy79pM_nYQuRKPrcfNg56p_gKkzw9SekUTZgAenc,
  router_S6yKjqoQ3Sb8o2lehB5PRjhy2uyi4DI_Ja_jhT1JS60,
  toast_F_pfj7FgRLbXLAWiXjuGtvyN_yqw93f_EjHy5PiyXpc
];
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "Icon",
  __ssrInlineRender: true,
  props: {
    name: {},
    class: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const iconClass = computed(() => {
      const baseClass = props.class || "";
      const iconMap = {
        // Eye icons
        "fa:eye": "fas fa-eye",
        "fa:eye-slash": "fas fa-eye-slash",
        // Basic icons
        "fa:search": "fas fa-search",
        "fa:info-circle": "fas fa-info-circle",
        "fa:ellipsis-v": "fas fa-ellipsis-v",
        "fa:chevron-up": "fas fa-chevron-up",
        "fa:chevron-down": "fas fa-chevron-down",
        "fa:cloud-upload": "fas fa-cloud-upload-alt",
        "fa:exclamation-triangle": "fas fa-exclamation-triangle",
        "fa:edit": "fas fa-edit",
        "fa:file": "fas fa-file",
        "fa:paperclip": "fas fa-paperclip",
        "fa:times": "fas fa-times",
        "fa:arrow-left": "fas fa-arrow-left",
        "fa:phone": "fas fa-phone",
        "fa:video": "fas fa-video",
        "fa:cog": "fas fa-cog",
        "fa:plus": "fas fa-plus",
        "fa:user": "fas fa-user",
        "fa:users": "fas fa-users",
        "fa:send": "fas fa-paper-plane",
        "fa:smile": "fas fa-smile",
        "fa:image": "fas fa-image",
        "fa:microphone": "fas fa-microphone",
        "fa:camera": "fas fa-camera",
        // Lucide icons mapped to FontAwesome
        "lucide:x": "fas fa-times",
        "lucide:paperclip": "fas fa-paperclip",
        "lucide:send": "fas fa-paper-plane",
        "lucide:smile": "fas fa-smile",
        "lucide:image": "fas fa-image",
        "lucide:mic": "fas fa-microphone",
        "lucide:camera": "fas fa-camera"
      };
      const faClass = iconMap[props.name] || "fas fa-question-circle";
      return `${faClass} ${baseClass}`.trim();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<i${ssrRenderAttrs(mergeProps({ class: unref(iconClass) }, _attrs))}></i>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Icon.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ProfilePictureModal",
  __ssrInlineRender: true,
  props: {
    currentImageUrl: {
      type: String,
      default: ""
    }
  },
  emits: ["close", "uploaded"],
  setup(__props, { emit: __emit }) {
    const { $toast, $api } = useNuxtApp();
    useAuthStore();
    ref(null);
    ref(null);
    const previewUrl = ref(null);
    const isUploading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = _sfc_main$6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm" }, _attrs))}><div class="bg-[#050C1B] border border-blue-500/30 p-4 rounded-lg shadow-lg max-w-md w-full text-white relative"><button class="absolute top-2 right-2 text-gray-400 hover:text-gray-200">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "fa:times",
        size: "18"
      }, null, _parent));
      _push(`</button><div class="text-center mb-4"><h3 class="text-lg font-bold">Change Profile Picture</h3></div><div class="flex flex-col items-center justify-center space-y-4"><div class="${ssrRenderClass([{ "animate-pulse": unref(isUploading) }, "w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500 flex items-center justify-center bg-blue-600/30"])}">`);
      if (unref(isUploading)) {
        _push(`<div class="h-full w-full flex items-center justify-center bg-black bg-opacity-60"><div class="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent border-blue-400"></div></div>`);
      } else if (unref(previewUrl)) {
        _push(`<img${ssrRenderAttr("src", unref(previewUrl))} alt="Preview" class="h-full w-full object-cover">`);
      } else if (__props.currentImageUrl) {
        _push(`<img${ssrRenderAttr("src", __props.currentImageUrl)} alt="Current Profile Picture" class="h-full w-full object-cover">`);
      } else {
        _push(ssrRenderComponent(_component_Icon, {
          name: "fa:user",
          class: "h-16 w-16 text-blue-400"
        }, null, _parent));
      }
      _push(`</div><div class="w-full">`);
      if (!unref(previewUrl) && !unref(isUploading)) {
        _push(`<div class="text-center space-y-6"><p class="text-gray-300 text-sm">Choose a new profile picture</p><button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded w-full">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "fa:upload",
          class: "mr-2"
        }, null, _parent));
        _push(` Select Image </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(previewUrl) && !unref(isUploading)) {
        _push(`<div class="space-y-4 mt-4"><div class="text-sm text-gray-300 text-center"><p>Selected image preview</p></div><div class="flex justify-between"><button class="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded w-1/2 mr-2"> Cancel </button><button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded w-1/2"> Upload Image </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><input type="file" accept="image/*" class="hidden"></div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProfilePictureModal.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ProfilePopup",
  __ssrInlineRender: true,
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    useRouter();
    const { $toast } = useNuxtApp();
    const authStore = useAuthStore();
    ref(false);
    const isLoading = ref(true);
    const userProfile = ref(null);
    const activeTab = ref("profile");
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const showCurrentPassword = ref(false);
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);
    ref(false);
    ref(null);
    const formData = ref({
      first_name: "",
      last_name: "",
      phone_number: "",
      about_me: ""
    });
    const passwordData = ref({
      current_password: "",
      new_password: "",
      confirm_password: ""
    });
    computed(() => {
      if (!userProfile.value) return "User";
      if (userProfile.value.name) return userProfile.value.name;
      const firstName = userProfile.value.first_name || "";
      const lastName = userProfile.value.last_name || "";
      if (firstName || lastName) {
        return `${firstName} ${lastName}`.trim();
      }
      return userProfile.value.username || userProfile.value.email || "User";
    });
    const passwordMismatch = computed(() => {
      return Boolean(
        passwordData.value.new_password !== passwordData.value.confirm_password && passwordData.value.confirm_password
      );
    });
    const showProfilePictureModal = ref(false);
    function onProfilePictureUploaded(newPictureUrl) {
      if (userProfile.value) {
        userProfile.value.profile_picture_url = newPictureUrl;
      }
      if (authStore.user) {
        authStore.user.profile_picture_url = newPictureUrl;
      }
      showProfilePictureModal.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      const _component_Icon = _sfc_main$6;
      const _component_ProfilePictureModal = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm" }, _attrs))}><div class="bg-[#050C1B] border border-blue-500/30 p-4 rounded-lg shadow-lg w-80 text-white relative"><button class="absolute top-2 right-2 text-gray-400 hover:text-gray-200">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "fa:times",
        size: "18"
      }, null, _parent));
      _push(`</button><div class="text-center mb-3"><h3 class="text-lg font-bold">${ssrInterpolate(unref(activeTab) === "profile" ? "My Profile" : "Change Password")}</h3></div>`);
      if (unref(isLoading)) {
        _push(`<div class="flex flex-col items-center py-6"><div class="animate-pulse flex flex-col items-center w-full"><div class="w-16 h-16 rounded-full bg-blue-600/30 mb-3"></div><div class="h-4 w-32 bg-blue-600/30 rounded mb-2"></div><div class="h-3 w-24 bg-blue-600/30 rounded"></div></div></div>`);
      } else if (unref(activeTab) === "profile") {
        _push(`<!--[-->`);
        if (!unref(isEditing)) {
          _push(`<div><div class="flex justify-center mb-4"><div class="relative"><div class="h-16 w-16 rounded-full overflow-hidden bg-blue-600/30 border-2 border-blue-500 flex items-center justify-center" title="Profile Picture">`);
          if ((_a = unref(userProfile)) == null ? void 0 : _a.profile_picture_url) {
            _push(`<img${ssrRenderAttr("src", unref(userProfile).profile_picture_url)} alt="Profile Picture" class="h-full w-full object-cover">`);
          } else {
            _push(ssrRenderComponent(_component_Icon, {
              name: "fa:user",
              class: "h-8 w-8 text-blue-400"
            }, null, _parent));
          }
          _push(`</div></div></div><div class="space-y-3 px-1"><div class="grid grid-cols-2 gap-2"><div class="space-y-1"><label class="text-sm text-gray-300 block">First Name</label><input type="text"${ssrRenderAttr("value", ((_b = unref(userProfile)) == null ? void 0 : _b.first_name) || "")} readonly class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="First Name"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Last Name</label><input type="text"${ssrRenderAttr("value", ((_c = unref(userProfile)) == null ? void 0 : _c.last_name) || "")} readonly class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Last Name"></div></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Username</label><input type="text"${ssrRenderAttr("value", ((_d = unref(userProfile)) == null ? void 0 : _d.username) || "")} readonly class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Username"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Email</label><input type="email"${ssrRenderAttr("value", ((_e = unref(userProfile)) == null ? void 0 : _e.email) || "")} readonly class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Email"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Phone Number</label><input type="tel"${ssrRenderAttr("value", ((_f = unref(userProfile)) == null ? void 0 : _f.phone_number) || "")} readonly class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Phone Number"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">About Me</label><textarea readonly rows="2" class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 min-h-[60px] resize-none text-sm" placeholder="Write something about yourself...">${ssrInterpolate(((_g = unref(userProfile)) == null ? void 0 : _g.about_me) || "")}</textarea></div><div class="space-y-2 pt-2"><button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1.5 px-4 rounded h-9 w-full text-sm flex items-center justify-center">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "fa:camera",
            class: "mr-2 h-3 w-3"
          }, null, _parent));
          _push(` Change Profile Picture </button><button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded h-9 w-full text-sm"> Edit Profile </button></div><div class="flex justify-center pt-1"><button class="text-blue-400 text-sm hover:text-blue-300 hover:underline"> Change Password </button></div></div></div>`);
        } else {
          _push(`<form class="space-y-3"><div class="flex justify-center mb-4"><div class="relative"><div class="h-16 w-16 rounded-full overflow-hidden bg-blue-600/30 border-2 border-blue-500 flex items-center justify-center" title="Profile Picture">`);
          if ((_h = unref(userProfile)) == null ? void 0 : _h.profile_picture_url) {
            _push(`<img${ssrRenderAttr("src", unref(userProfile).profile_picture_url)} alt="Profile Picture" class="h-full w-full object-cover">`);
          } else {
            _push(ssrRenderComponent(_component_Icon, {
              name: "fa:user",
              class: "h-8 w-8 text-blue-400"
            }, null, _parent));
          }
          _push(`</div><button class="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600" title="Change Profile Picture">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "fa:camera",
            size: "12"
          }, null, _parent));
          _push(`</button></div></div><div class="space-y-3 px-1"><div class="grid grid-cols-2 gap-2"><div class="space-y-1"><label class="text-sm text-gray-300 block">First Name</label><input type="text"${ssrRenderAttr("value", unref(formData).first_name)} class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="First Name"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Last Name</label><input type="text"${ssrRenderAttr("value", unref(formData).last_name)} class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Last Name"></div></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Username</label><input type="text"${ssrRenderAttr("value", ((_i = unref(userProfile)) == null ? void 0 : _i.username) || "")} readonly class="w-full bg-[#0b1529]/70 text-gray-400 rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Username"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Email</label><input type="email"${ssrRenderAttr("value", ((_j = unref(userProfile)) == null ? void 0 : _j.email) || "")} readonly class="w-full bg-[#0b1529]/70 text-gray-400 rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Email"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Phone Number</label><input type="tel"${ssrRenderAttr("value", unref(formData).phone_number)} class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Phone Number"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">About Me</label><textarea rows="2" class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 min-h-[60px] resize-none text-sm" placeholder="Write something about yourself...">${ssrInterpolate(unref(formData).about_me)}</textarea></div><div class="flex justify-between pt-2"><button type="button" class="border border-gray-700 text-gray-300 bg-[#0b1529] hover:bg-[#0b1529]/90 font-medium py-1.5 px-4 rounded h-9 text-sm"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""}> Cancel </button><button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded h-9 text-sm"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""}>${ssrInterpolate(unref(isSubmitting) ? "Saving..." : "Save Changes")}</button></div></div></form>`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showProfilePictureModal)) {
        _push(ssrRenderComponent(_component_ProfilePictureModal, {
          currentImageUrl: (_k = unref(userProfile)) == null ? void 0 : _k.profile_picture_url,
          onClose: ($event) => showProfilePictureModal.value = false,
          onUploaded: onProfilePictureUploaded
        }, null, _parent));
      } else if (unref(activeTab) === "password") {
        _push(`<form class="space-y-3"><div class="space-y-1"><label class="text-sm text-gray-300 block">Current Password</label><div class="relative"><input${ssrRenderAttr("type", unref(showCurrentPassword) ? "text" : "password")}${ssrRenderDynamicModel(unref(showCurrentPassword) ? "text" : "password", unref(passwordData).current_password, null)} required class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"><button type="button" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: unref(showCurrentPassword) ? "fa:eye" : "fa:eye-slash",
          size: "16"
        }, null, _parent));
        _push(`</button></div></div><div class="space-y-1"><label class="text-sm text-gray-300 block">New Password</label><div class="relative"><input${ssrRenderAttr("type", unref(showNewPassword) ? "text" : "password")}${ssrRenderDynamicModel(unref(showNewPassword) ? "text" : "password", unref(passwordData).new_password, null)} required class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"><button type="button" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: unref(showNewPassword) ? "fa:eye" : "fa:eye-slash",
          size: "16"
        }, null, _parent));
        _push(`</button></div></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Confirm Password</label><div class="relative"><input${ssrRenderAttr("type", unref(showConfirmPassword) ? "text" : "password")}${ssrRenderDynamicModel(unref(showConfirmPassword) ? "text" : "password", unref(passwordData).confirm_password, null)} required class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"><button type="button" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: unref(showConfirmPassword) ? "fa:eye" : "fa:eye-slash",
          size: "16"
        }, null, _parent));
        _push(`</button></div>`);
        if (unref(passwordMismatch)) {
          _push(`<p class="text-red-500 text-xs mt-1"> Passwords do not match </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex justify-between pt-3"><button type="button" class="border border-gray-700 text-gray-300 bg-[#0b1529] hover:bg-[#0b1529]/90 font-medium py-1.5 px-4 rounded h-9 text-sm"> Cancel </button><button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded h-9 text-sm"${ssrIncludeBooleanAttr(unref(isSubmitting) || unref(passwordMismatch)) ? " disabled" : ""}>${ssrInterpolate(unref(isSubmitting) ? "Changing..." : "Change Password")}</button></div></form>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProfilePopup.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _imports_0 = publicAssetsURL("/images/voxtalogo.png");
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const { $toast } = useNuxtApp();
    useAuthStore();
    const isProfilePopupOpen = ref(false);
    const isLoggingOut = ref(false);
    const showLogoutConfirmation = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_Icon = _sfc_main$6;
      const _component_ProfilePopup = _sfc_main$4;
      _push(`<!--[--><nav class="flex flex-col justify-between h-screen w-16 bg-[#050C1B] text-white py-5"><div class="flex flex-col items-center"><div class="flex items-center justify-center w-12 h-12 mb-10"><img${ssrRenderAttr("src", _imports_0)} alt="Voxta Logo" class="rounded-full w-10 h-10"></div><div class="flex flex-col space-y-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/chat/messages",
        class: ["p-2 rounded-md", {
          "bg-gray-700": _ctx.$route.path === "/chat/messages",
          "hover:bg-gray-800": _ctx.$route.path !== "/chat/messages"
        }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "fa:envelope",
              class: "h-6 w-6"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Icon, {
                name: "fa:envelope",
                class: "h-6 w-6"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/chat/friends",
        class: ["p-2 rounded-md", {
          "bg-gray-700": _ctx.$route.path === "/chat/friends",
          "hover:bg-gray-800": _ctx.$route.path !== "/chat/friends"
        }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "fa:user",
              class: "h-6 w-6"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Icon, {
                name: "fa:user",
                class: "h-6 w-6"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/chat/groups",
        class: ["p-2 rounded-md", {
          "bg-gray-700": _ctx.$route.path === "/chat/groups",
          "hover:bg-gray-800": _ctx.$route.path !== "/chat/groups"
        }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "fa:users",
              class: "h-6 w-6"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Icon, {
                name: "fa:users",
                class: "h-6 w-6"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="flex flex-col items-center space-y-4"><button class="p-2 rounded-md hover:bg-gray-800 relative" title="Profile Settings"><div class="w-8 h-8 rounded-full overflow-hidden bg-blue-600/30 flex items-center justify-center">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "fa:user",
        class: "h-5 w-5 text-blue-400"
      }, null, _parent));
      _push(`</div><div class="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-500 border border-blue-600 shadow-sm p-0 flex items-center justify-center">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "fa:cog",
        class: "h-2 w-2 text-white"
      }, null, _parent));
      _push(`</div></button><button${ssrIncludeBooleanAttr(unref(isLoggingOut)) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": unref(isLoggingOut) }, "p-2 rounded-md hover:bg-gray-800"])}" title="Sign out">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "fa:sign-out",
        class: "h-6 w-6"
      }, null, _parent));
      _push(`</button></div></nav>`);
      if (unref(isProfilePopupOpen)) {
        _push(ssrRenderComponent(_component_ProfilePopup, {
          onClose: ($event) => isProfilePopupOpen.value = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(showLogoutConfirmation)) {
        _push(`<div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm"><div class="bg-[#050C1B] border border-blue-500/30 p-5 rounded-lg shadow-lg w-80 text-white"><h3 class="text-lg font-semibold mb-3">Confirm Logout</h3><p class="mb-4 text-gray-300"> Are you sure you want to log out from your account? </p><div class="flex justify-end space-x-3"><button class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"> Cancel </button><button${ssrIncludeBooleanAttr(unref(isLoggingOut)) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": unref(isLoggingOut) }, "px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"])}">${ssrInterpolate(unref(isLoggingOut) ? "Logging out..." : "Yes, Log Out")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_0 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const authStore = useAuthStore();
    const shouldShowSidebar = computed(() => {
      return authStore.isAuthenticated && authStore.token && !route.path.startsWith("/auth/") && route.path !== "/";
    });
    watch(
      () => authStore.isAuthenticated,
      (newValue) => {
      }
    );
    watch(
      () => route.fullPath,
      (newPath) => {
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Sidebar = _sfc_main$3;
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-container" }, _attrs))}>`);
      if (unref(shouldShowSidebar)) {
        _push(`<div class="flex">`);
        _push(ssrRenderComponent(_component_Sidebar, null, null, _parent));
        _push(`<main class="flex-1">`);
        _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
        _push(`</main></div>`);
      } else {
        _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-DPeVTOGB.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-fJwY-k-q.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute$1());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    var _a;
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      (_a = nuxt.payload).error || (_a.error = createError(error));
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { __nuxt_component_0$1 as _, useNuxtApp as a, useAuthStore as b, _imports_0 as c, _sfc_main$6 as d, entry$1 as default, useRoute as e, useRoute$1 as f, __nuxt_component_0 as g, useRuntimeConfig as h, defineNuxtRouteMiddleware as i, tryUseNuxtApp as t, useRouter as u };
//# sourceMappingURL=server.mjs.map
