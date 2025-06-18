import { w as withLeadingSlash, j as joinRelativeURL, u as useRuntimeConfig, f as getResponseStatusText, h as getResponseStatus, i as defineRenderHandler, c as getQuery, k as createError, l as getRouteRules, m as useNitroApp } from '../nitro/nitro.mjs';
import * as compilerDom from '@vue/compiler-dom';
import * as runtimeDom from '@vue/runtime-dom';
import * as shared$1 from '@vue/shared';
import * as compilerSsr$1 from '@vue/compiler-ssr';
import * as node_stream from 'node:stream';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'unhead/server';
import { stringify, uneval } from 'devalue';
import { walkResolver } from 'unhead/utils';
import { DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'unhead/plugins';

function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== 'string' && !Array.isArray(e)) { for (const k in e) {
      if (k !== 'default' && !(k in n)) {
        const d = Object.getOwnPropertyDescriptor(e, k);
        if (d) {
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      }
    } }
  }
  return Object.freeze(n);
}

function createRendererContext({ manifest, buildAssetsURL }) {
  const ctx = {
    // Manifest
    buildAssetsURL: buildAssetsURL || withLeadingSlash,
    manifest: void 0,
    updateManifest,
    // Internal cache
    _dependencies: void 0,
    _dependencySets: void 0,
    _entrypoints: void 0
  };
  function updateManifest(manifest2) {
    const manifestEntries = Object.entries(manifest2);
    ctx.manifest = manifest2;
    ctx._dependencies = {};
    ctx._dependencySets = {};
    ctx._entrypoints = manifestEntries.filter((e) => e[1].isEntry).map(([module]) => module);
  }
  updateManifest(manifest);
  return ctx;
}
function getModuleDependencies(id, rendererContext) {
  if (rendererContext._dependencies[id]) {
    return rendererContext._dependencies[id];
  }
  const dependencies = rendererContext._dependencies[id] = {
    scripts: {},
    styles: {},
    preload: {},
    prefetch: {}
  };
  const meta = rendererContext.manifest[id];
  if (!meta) {
    return dependencies;
  }
  if (meta.file) {
    dependencies.preload[id] = meta;
    if (meta.isEntry || meta.sideEffects) {
      dependencies.scripts[id] = meta;
    }
  }
  for (const css of meta.css || []) {
    dependencies.styles[css] = dependencies.preload[css] = dependencies.prefetch[css] = rendererContext.manifest[css];
  }
  for (const asset of meta.assets || []) {
    dependencies.preload[asset] = dependencies.prefetch[asset] = rendererContext.manifest[asset];
  }
  for (const depId of meta.imports || []) {
    const depDeps = getModuleDependencies(depId, rendererContext);
    Object.assign(dependencies.styles, depDeps.styles);
    Object.assign(dependencies.preload, depDeps.preload);
    Object.assign(dependencies.prefetch, depDeps.prefetch);
  }
  const filteredPreload = {};
  for (const id2 in dependencies.preload) {
    const dep = dependencies.preload[id2];
    if (dep.preload) {
      filteredPreload[id2] = dep;
    }
  }
  dependencies.preload = filteredPreload;
  return dependencies;
}
function getAllDependencies(ids, rendererContext) {
  const cacheKey = Array.from(ids).sort().join(",");
  if (rendererContext._dependencySets[cacheKey]) {
    return rendererContext._dependencySets[cacheKey];
  }
  const allDeps = {
    scripts: {},
    styles: {},
    preload: {},
    prefetch: {}
  };
  for (const id of ids) {
    const deps = getModuleDependencies(id, rendererContext);
    Object.assign(allDeps.scripts, deps.scripts);
    Object.assign(allDeps.styles, deps.styles);
    Object.assign(allDeps.preload, deps.preload);
    Object.assign(allDeps.prefetch, deps.prefetch);
    for (const dynamicDepId of rendererContext.manifest[id]?.dynamicImports || []) {
      const dynamicDeps = getModuleDependencies(dynamicDepId, rendererContext);
      Object.assign(allDeps.prefetch, dynamicDeps.scripts);
      Object.assign(allDeps.prefetch, dynamicDeps.styles);
      Object.assign(allDeps.prefetch, dynamicDeps.preload);
    }
  }
  const filteredPrefetch = {};
  for (const id in allDeps.prefetch) {
    const dep = allDeps.prefetch[id];
    if (dep.prefetch) {
      filteredPrefetch[id] = dep;
    }
  }
  allDeps.prefetch = filteredPrefetch;
  for (const id in allDeps.preload) {
    delete allDeps.prefetch[id];
  }
  for (const style in allDeps.styles) {
    delete allDeps.preload[style];
    delete allDeps.prefetch[style];
  }
  rendererContext._dependencySets[cacheKey] = allDeps;
  return allDeps;
}
function getRequestDependencies(ssrContext, rendererContext) {
  if (ssrContext._requestDependencies) {
    return ssrContext._requestDependencies;
  }
  const ids = new Set(Array.from([
    ...rendererContext._entrypoints,
    ...ssrContext.modules || ssrContext._registeredComponents || []
  ]));
  const deps = getAllDependencies(ids, rendererContext);
  ssrContext._requestDependencies = deps;
  return deps;
}
function renderStyles(ssrContext, rendererContext) {
  const { styles } = getRequestDependencies(ssrContext, rendererContext);
  return Object.values(styles).map(
    (resource) => renderLinkToString({ rel: "stylesheet", href: rendererContext.buildAssetsURL(resource.file), crossorigin: "" })
  ).join("");
}
function getResources(ssrContext, rendererContext) {
  return [...getPreloadLinks(ssrContext, rendererContext), ...getPrefetchLinks(ssrContext, rendererContext)];
}
function renderResourceHints(ssrContext, rendererContext) {
  return getResources(ssrContext, rendererContext).map(renderLinkToString).join("");
}
function renderResourceHeaders(ssrContext, rendererContext) {
  return {
    link: getResources(ssrContext, rendererContext).map(renderLinkToHeader).join(", ")
  };
}
function getPreloadLinks(ssrContext, rendererContext) {
  const { preload } = getRequestDependencies(ssrContext, rendererContext);
  return Object.values(preload).map((resource) => ({
    rel: resource.module ? "modulepreload" : "preload",
    as: resource.resourceType,
    type: resource.mimeType ?? null,
    crossorigin: resource.resourceType === "style" || resource.resourceType === "font" || resource.resourceType === "script" || resource.module ? "" : null,
    href: rendererContext.buildAssetsURL(resource.file)
  }));
}
function getPrefetchLinks(ssrContext, rendererContext) {
  const { prefetch } = getRequestDependencies(ssrContext, rendererContext);
  return Object.values(prefetch).map((resource) => ({
    rel: "prefetch",
    as: resource.resourceType,
    type: resource.mimeType ?? null,
    crossorigin: resource.resourceType === "style" || resource.resourceType === "font" || resource.resourceType === "script" || resource.module ? "" : null,
    href: rendererContext.buildAssetsURL(resource.file)
  }));
}
function renderScripts(ssrContext, rendererContext) {
  const { scripts } = getRequestDependencies(ssrContext, rendererContext);
  return Object.values(scripts).map((resource) => renderScriptToString({
    type: resource.module ? "module" : null,
    src: rendererContext.buildAssetsURL(resource.file),
    defer: resource.module ? null : "",
    crossorigin: ""
  })).join("");
}
function createRenderer(createApp, renderOptions) {
  const rendererContext = createRendererContext(renderOptions);
  return {
    rendererContext,
    async renderToString(ssrContext) {
      ssrContext._registeredComponents = ssrContext._registeredComponents || /* @__PURE__ */ new Set();
      const _createApp = await Promise.resolve(createApp).then((r) => "default" in r ? r.default : r);
      const app = await _createApp(ssrContext);
      const html = await renderOptions.renderToString(app, ssrContext);
      const wrap = (fn) => () => fn(ssrContext, rendererContext);
      return {
        html,
        renderResourceHeaders: wrap(renderResourceHeaders),
        renderResourceHints: wrap(renderResourceHints),
        renderStyles: wrap(renderStyles),
        renderScripts: wrap(renderScripts)
      };
    }
  };
}
function renderScriptToString(attrs) {
  return `<script${Object.entries(attrs).map(([key, value]) => value === null ? "" : value ? ` ${key}="${value}"` : " " + key).join("")}><\/script>`;
}
function renderLinkToString(attrs) {
  return `<link${Object.entries(attrs).map(([key, value]) => value === null ? "" : value ? ` ${key}="${value}"` : " " + key).join("")}>`;
}
function renderLinkToHeader(attrs) {
  return `<${attrs.href}>${Object.entries(attrs).map(([key, value]) => key === "href" || value === null ? "" : value ? `; ${key}="${value}"` : `; ${key}`).join("")}`;
}

function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

var vue$1 = {exports: {}};

var vue_cjs_prod = {};

const require$$0$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(compilerDom);

const require$$1$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(runtimeDom);

const require$$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(shared$1);

/**
* vue v3.5.16
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/

(function (exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	var compilerDom = require$$0$1;
	var runtimeDom = require$$1$1;
	var shared = require$$1;

	function _interopNamespaceDefault(e) {
	  var n = Object.create(null);
	  if (e) {
	    for (var k in e) {
	      n[k] = e[k];
	    }
	  }
	  n.default = e;
	  return Object.freeze(n);
	}

	var runtimeDom__namespace = /*#__PURE__*/_interopNamespaceDefault(runtimeDom);

	const compileCache = /* @__PURE__ */ Object.create(null);
	function compileToFunction(template, options) {
	  if (!shared.isString(template)) {
	    if (template.nodeType) {
	      template = template.innerHTML;
	    } else {
	      return shared.NOOP;
	    }
	  }
	  const key = shared.genCacheKey(template, options);
	  const cached = compileCache[key];
	  if (cached) {
	    return cached;
	  }
	  if (template[0] === "#") {
	    const el = document.querySelector(template);
	    template = el ? el.innerHTML : ``;
	  }
	  const opts = shared.extend(
	    {
	      hoistStatic: true,
	      onError: void 0,
	      onWarn: shared.NOOP
	    },
	    options
	  );
	  if (!opts.isCustomElement && typeof customElements !== "undefined") {
	    opts.isCustomElement = (tag) => !!customElements.get(tag);
	  }
	  const { code } = compilerDom.compile(template, opts);
	  const render = new Function("Vue", code)(runtimeDom__namespace);
	  render._rc = true;
	  return compileCache[key] = render;
	}
	runtimeDom.registerRuntimeCompiler(compileToFunction);

	exports.compile = compileToFunction;
	Object.keys(runtimeDom).forEach(function (k) {
	  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) exports[k] = runtimeDom[k];
	}); 
} (vue_cjs_prod));

{
  vue$1.exports = vue_cjs_prod;
}

var vueExports = vue$1.exports;

const vue = /*#__PURE__*/_mergeNamespaces({
  __proto__: null
}, [vueExports]);

const VueResolver = (_, value) => {
  return vueExports.isRef(value) ? vueExports.toValue(value) : value;
};

const headSymbol = "usehead";
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

function injectHead() {
  if (vueExports.hasInjectionContext()) {
    const instance = vueExports.inject(headSymbol);
    if (!instance) {
      throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.");
    }
    return instance;
  }
  throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.");
}
function useHead(input, options = {}) {
  const head = options.head || injectHead();
  return head.ssr ? head.push(input || {}, options) : clientUseHead(head, input, options);
}
function clientUseHead(head, input, options = {}) {
  const deactivated = vueExports.ref(false);
  let entry;
  vueExports.watchEffect(() => {
    const i = deactivated.value ? {} : walkResolver(input, VueResolver);
    if (entry) {
      entry.patch(i);
    } else {
      entry = head.push(i, options);
    }
  });
  const vm = vueExports.getCurrentInstance();
  if (vm) {
    vueExports.onBeforeUnmount(() => {
      entry.dispose();
    });
    vueExports.onDeactivated(() => {
      deactivated.value = true;
    });
    vueExports.onActivated(() => {
      deactivated.value = false;
    });
  }
  return entry;
}

function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

var serverRenderer_cjs_prod = {};

const require$$0 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(vue);

const require$$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(compilerSsr$1);

const require$$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_stream);

/**
* @vue/server-renderer v3.5.16
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/

Object.defineProperty(serverRenderer_cjs_prod, '__esModule', { value: true });

var Vue = require$$0;
var shared = require$$1;
var compilerSsr = require$$2;

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    for (var k in e) {
      n[k] = e[k];
    }
  }
  n.default = e;
  return Object.freeze(n);
}

var Vue__namespace = /*#__PURE__*/_interopNamespaceDefault(Vue);

const shouldIgnoreProp = /* @__PURE__ */ shared.makeMap(
  `,key,ref,innerHTML,textContent,ref_key,ref_for`
);
function ssrRenderAttrs(props, tag) {
  let ret = "";
  for (const key in props) {
    if (shouldIgnoreProp(key) || shared.isOn(key) || tag === "textarea" && key === "value") {
      continue;
    }
    const value = props[key];
    if (key === "class") {
      ret += ` class="${ssrRenderClass(value)}"`;
    } else if (key === "style") {
      ret += ` style="${ssrRenderStyle(value)}"`;
    } else if (key === "className") {
      ret += ` class="${String(value)}"`;
    } else {
      ret += ssrRenderDynamicAttr(key, value, tag);
    }
  }
  return ret;
}
function ssrRenderDynamicAttr(key, value, tag) {
  if (!shared.isRenderableAttrValue(value)) {
    return ``;
  }
  const attrKey = tag && (tag.indexOf("-") > 0 || shared.isSVGTag(tag)) ? key : shared.propsToAttrMap[key] || key.toLowerCase();
  if (shared.isBooleanAttr(attrKey)) {
    return shared.includeBooleanAttr(value) ? ` ${attrKey}` : ``;
  } else if (shared.isSSRSafeAttrName(attrKey)) {
    return value === "" ? ` ${attrKey}` : ` ${attrKey}="${shared.escapeHtml(value)}"`;
  } else {
    console.warn(
      `[@vue/server-renderer] Skipped rendering unsafe attribute name: ${attrKey}`
    );
    return ``;
  }
}
function ssrRenderAttr(key, value) {
  if (!shared.isRenderableAttrValue(value)) {
    return ``;
  }
  return ` ${key}="${shared.escapeHtml(value)}"`;
}
function ssrRenderClass(raw) {
  return shared.escapeHtml(shared.normalizeClass(raw));
}
function ssrRenderStyle(raw) {
  if (!raw) {
    return "";
  }
  if (shared.isString(raw)) {
    return shared.escapeHtml(raw);
  }
  const styles = shared.normalizeStyle(raw);
  return shared.escapeHtml(shared.stringifyStyle(styles));
}

function ssrRenderComponent(comp, props = null, children = null, parentComponent = null, slotScopeId) {
  return renderComponentVNode(
    Vue.createVNode(comp, props, children),
    parentComponent,
    slotScopeId
  );
}

const { ensureValidVNode } = Vue.ssrUtils;
function ssrRenderSlot(slots, slotName, slotProps, fallbackRenderFn, push, parentComponent, slotScopeId) {
  push(`<!--[-->`);
  ssrRenderSlotInner(
    slots,
    slotName,
    slotProps,
    fallbackRenderFn,
    push,
    parentComponent,
    slotScopeId
  );
  push(`<!--]-->`);
}
function ssrRenderSlotInner(slots, slotName, slotProps, fallbackRenderFn, push, parentComponent, slotScopeId, transition) {
  const slotFn = slots[slotName];
  if (slotFn) {
    const slotBuffer = [];
    const bufferedPush = (item) => {
      slotBuffer.push(item);
    };
    const ret = slotFn(
      slotProps,
      bufferedPush,
      parentComponent,
      slotScopeId ? " " + slotScopeId : ""
    );
    if (shared.isArray(ret)) {
      const validSlotContent = ensureValidVNode(ret);
      if (validSlotContent) {
        renderVNodeChildren(
          push,
          validSlotContent,
          parentComponent,
          slotScopeId
        );
      } else if (fallbackRenderFn) {
        fallbackRenderFn();
      }
    } else {
      let isEmptySlot = true;
      if (transition) {
        isEmptySlot = false;
      } else {
        for (let i = 0; i < slotBuffer.length; i++) {
          if (!isComment(slotBuffer[i])) {
            isEmptySlot = false;
            break;
          }
        }
      }
      if (isEmptySlot) {
        if (fallbackRenderFn) {
          fallbackRenderFn();
        }
      } else {
        let start = 0;
        let end = slotBuffer.length;
        if (transition && slotBuffer[0] === "<!--[-->" && slotBuffer[end - 1] === "<!--]-->") {
          start++;
          end--;
        }
        for (let i = start; i < end; i++) {
          push(slotBuffer[i]);
        }
      }
    }
  } else if (fallbackRenderFn) {
    fallbackRenderFn();
  }
}
const commentTestRE = /^<!--[\s\S]*-->$/;
const commentRE = /<!--[^]*?-->/gm;
function isComment(item) {
  if (typeof item !== "string" || !commentTestRE.test(item)) return false;
  if (item.length <= 8) return true;
  return !item.replace(commentRE, "").trim();
}

function ssrRenderTeleport(parentPush, contentRenderFn, target, disabled, parentComponent) {
  parentPush("<!--teleport start-->");
  const context = parentComponent.appContext.provides[Vue.ssrContextKey];
  const teleportBuffers = context.__teleportBuffers || (context.__teleportBuffers = {});
  const targetBuffer = teleportBuffers[target] || (teleportBuffers[target] = []);
  const bufferIndex = targetBuffer.length;
  let teleportContent;
  if (disabled) {
    contentRenderFn(parentPush);
    teleportContent = `<!--teleport start anchor--><!--teleport anchor-->`;
  } else {
    const { getBuffer, push } = createBuffer();
    push(`<!--teleport start anchor-->`);
    contentRenderFn(push);
    push(`<!--teleport anchor-->`);
    teleportContent = getBuffer();
  }
  targetBuffer.splice(bufferIndex, 0, teleportContent);
  parentPush("<!--teleport end-->");
}

function ssrInterpolate(value) {
  return shared.escapeHtml(shared.toDisplayString(value));
}

function ssrRenderList(source, renderItem) {
  if (shared.isArray(source) || shared.isString(source)) {
    for (let i = 0, l = source.length; i < l; i++) {
      renderItem(source[i], i);
    }
  } else if (typeof source === "number") {
    for (let i = 0; i < source; i++) {
      renderItem(i + 1, i);
    }
  } else if (shared.isObject(source)) {
    if (source[Symbol.iterator]) {
      const arr = Array.from(source);
      for (let i = 0, l = arr.length; i < l; i++) {
        renderItem(arr[i], i);
      }
    } else {
      const keys = Object.keys(source);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        renderItem(source[key], key, i);
      }
    }
  }
}

async function ssrRenderSuspense(push, { default: renderContent }) {
  if (renderContent) {
    renderContent();
  } else {
    push(`<!---->`);
  }
}

function ssrGetDirectiveProps(instance, dir, value, arg, modifiers = {}) {
  if (typeof dir !== "function" && dir.getSSRProps) {
    return dir.getSSRProps(
      {
        dir,
        instance: Vue.ssrUtils.getComponentPublicInstance(instance.$),
        value,
        oldValue: void 0,
        arg,
        modifiers
      },
      null
    ) || {};
  }
  return {};
}

const ssrLooseEqual = shared.looseEqual;
function ssrLooseContain(arr, value) {
  return shared.looseIndexOf(arr, value) > -1;
}
function ssrRenderDynamicModel(type, model, value) {
  switch (type) {
    case "radio":
      return shared.looseEqual(model, value) ? " checked" : "";
    case "checkbox":
      return (shared.isArray(model) ? ssrLooseContain(model, value) : model) ? " checked" : "";
    default:
      return ssrRenderAttr("value", model);
  }
}
function ssrGetDynamicModelProps(existingProps = {}, model) {
  const { type, value } = existingProps;
  switch (type) {
    case "radio":
      return shared.looseEqual(model, value) ? { checked: true } : null;
    case "checkbox":
      return (shared.isArray(model) ? ssrLooseContain(model, value) : model) ? { checked: true } : null;
    default:
      return { value: model };
  }
}

var helpers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ssrGetDirectiveProps: ssrGetDirectiveProps,
  ssrGetDynamicModelProps: ssrGetDynamicModelProps,
  ssrIncludeBooleanAttr: shared.includeBooleanAttr,
  ssrInterpolate: ssrInterpolate,
  ssrLooseContain: ssrLooseContain,
  ssrLooseEqual: ssrLooseEqual,
  ssrRenderAttr: ssrRenderAttr,
  ssrRenderAttrs: ssrRenderAttrs,
  ssrRenderClass: ssrRenderClass,
  ssrRenderComponent: ssrRenderComponent,
  ssrRenderDynamicAttr: ssrRenderDynamicAttr,
  ssrRenderDynamicModel: ssrRenderDynamicModel,
  ssrRenderList: ssrRenderList,
  ssrRenderSlot: ssrRenderSlot,
  ssrRenderSlotInner: ssrRenderSlotInner,
  ssrRenderStyle: ssrRenderStyle,
  ssrRenderSuspense: ssrRenderSuspense,
  ssrRenderTeleport: ssrRenderTeleport,
  ssrRenderVNode: renderVNode
});

const compileCache = /* @__PURE__ */ Object.create(null);
function ssrCompile(template, instance) {
  const Component = instance.type;
  const { isCustomElement, compilerOptions } = instance.appContext.config;
  const { delimiters, compilerOptions: componentCompilerOptions } = Component;
  const finalCompilerOptions = shared.extend(
    shared.extend(
      {
        isCustomElement,
        delimiters
      },
      compilerOptions
    ),
    componentCompilerOptions
  );
  finalCompilerOptions.isCustomElement = finalCompilerOptions.isCustomElement || shared.NO;
  finalCompilerOptions.isNativeTag = finalCompilerOptions.isNativeTag || shared.NO;
  const cacheKey = JSON.stringify(
    {
      template,
      compilerOptions: finalCompilerOptions
    },
    (key, value) => {
      return shared.isFunction(value) ? value.toString() : value;
    }
  );
  const cached = compileCache[cacheKey];
  if (cached) {
    return cached;
  }
  finalCompilerOptions.onError = (err) => {
    {
      throw err;
    }
  };
  const { code } = compilerSsr.compile(template, finalCompilerOptions);
  const requireMap = {
    vue: Vue__namespace,
    "vue/server-renderer": helpers
  };
  const fakeRequire = (id) => requireMap[id];
  return compileCache[cacheKey] = Function("require", code)(fakeRequire);
}

const {
  createComponentInstance,
  setCurrentRenderingInstance,
  setupComponent,
  renderComponentRoot,
  normalizeVNode,
  pushWarningContext,
  popWarningContext
} = Vue.ssrUtils;
function createBuffer() {
  let appendable = false;
  const buffer = [];
  return {
    getBuffer() {
      return buffer;
    },
    push(item) {
      const isStringItem = shared.isString(item);
      if (appendable && isStringItem) {
        buffer[buffer.length - 1] += item;
        return;
      }
      buffer.push(item);
      appendable = isStringItem;
      if (shared.isPromise(item) || shared.isArray(item) && item.hasAsync) {
        buffer.hasAsync = true;
      }
    }
  };
}
function renderComponentVNode(vnode, parentComponent = null, slotScopeId) {
  const instance = vnode.component = createComponentInstance(
    vnode,
    parentComponent,
    null
  );
  const res = setupComponent(
    instance,
    true
    /* isSSR */
  );
  const hasAsyncSetup = shared.isPromise(res);
  let prefetches = instance.sp;
  if (hasAsyncSetup || prefetches) {
    const p = Promise.resolve(res).then(() => {
      if (hasAsyncSetup) prefetches = instance.sp;
      if (prefetches) {
        return Promise.all(
          prefetches.map((prefetch) => prefetch.call(instance.proxy))
        );
      }
    }).catch(shared.NOOP);
    return p.then(() => renderComponentSubTree(instance, slotScopeId));
  } else {
    return renderComponentSubTree(instance, slotScopeId);
  }
}
function renderComponentSubTree(instance, slotScopeId) {
  const comp = instance.type;
  const { getBuffer, push } = createBuffer();
  if (shared.isFunction(comp)) {
    let root = renderComponentRoot(instance);
    if (!comp.props) {
      for (const key in instance.attrs) {
        if (key.startsWith(`data-v-`)) {
          (root.props || (root.props = {}))[key] = ``;
        }
      }
    }
    renderVNode(push, instance.subTree = root, instance, slotScopeId);
  } else {
    if ((!instance.render || instance.render === shared.NOOP) && !instance.ssrRender && !comp.ssrRender && shared.isString(comp.template)) {
      comp.ssrRender = ssrCompile(comp.template, instance);
    }
    const ssrRender = instance.ssrRender || comp.ssrRender;
    if (ssrRender) {
      let attrs = instance.inheritAttrs !== false ? instance.attrs : void 0;
      let hasCloned = false;
      let cur = instance;
      while (true) {
        const scopeId = cur.vnode.scopeId;
        if (scopeId) {
          if (!hasCloned) {
            attrs = { ...attrs };
            hasCloned = true;
          }
          attrs[scopeId] = "";
        }
        const parent = cur.parent;
        if (parent && parent.subTree && parent.subTree === cur.vnode) {
          cur = parent;
        } else {
          break;
        }
      }
      if (slotScopeId) {
        if (!hasCloned) attrs = { ...attrs };
        const slotScopeIdList = slotScopeId.trim().split(" ");
        for (let i = 0; i < slotScopeIdList.length; i++) {
          attrs[slotScopeIdList[i]] = "";
        }
      }
      const prev = setCurrentRenderingInstance(instance);
      try {
        ssrRender(
          instance.proxy,
          push,
          instance,
          attrs,
          // compiler-optimized bindings
          instance.props,
          instance.setupState,
          instance.data,
          instance.ctx
        );
      } finally {
        setCurrentRenderingInstance(prev);
      }
    } else if (instance.render && instance.render !== shared.NOOP) {
      renderVNode(
        push,
        instance.subTree = renderComponentRoot(instance),
        instance,
        slotScopeId
      );
    } else {
      const componentName = comp.name || comp.__file || `<Anonymous>`;
      Vue.warn(`Component ${componentName} is missing template or render function.`);
      push(`<!---->`);
    }
  }
  return getBuffer();
}
function renderVNode(push, vnode, parentComponent, slotScopeId) {
  const { type, shapeFlag, children, dirs, props } = vnode;
  if (dirs) {
    vnode.props = applySSRDirectives(vnode, props, dirs);
  }
  switch (type) {
    case Vue.Text:
      push(shared.escapeHtml(children));
      break;
    case Vue.Comment:
      push(
        children ? `<!--${shared.escapeHtmlComment(children)}-->` : `<!---->`
      );
      break;
    case Vue.Static:
      push(children);
      break;
    case Vue.Fragment:
      if (vnode.slotScopeIds) {
        slotScopeId = (slotScopeId ? slotScopeId + " " : "") + vnode.slotScopeIds.join(" ");
      }
      push(`<!--[-->`);
      renderVNodeChildren(
        push,
        children,
        parentComponent,
        slotScopeId
      );
      push(`<!--]-->`);
      break;
    default:
      if (shapeFlag & 1) {
        renderElementVNode(push, vnode, parentComponent, slotScopeId);
      } else if (shapeFlag & 6) {
        push(renderComponentVNode(vnode, parentComponent, slotScopeId));
      } else if (shapeFlag & 64) {
        renderTeleportVNode(push, vnode, parentComponent, slotScopeId);
      } else if (shapeFlag & 128) {
        renderVNode(push, vnode.ssContent, parentComponent, slotScopeId);
      } else {
        Vue.warn(
          "[@vue/server-renderer] Invalid VNode type:",
          type,
          `(${typeof type})`
        );
      }
  }
}
function renderVNodeChildren(push, children, parentComponent, slotScopeId) {
  for (let i = 0; i < children.length; i++) {
    renderVNode(push, normalizeVNode(children[i]), parentComponent, slotScopeId);
  }
}
function renderElementVNode(push, vnode, parentComponent, slotScopeId) {
  const tag = vnode.type;
  let { props, children, shapeFlag, scopeId } = vnode;
  let openTag = `<${tag}`;
  if (props) {
    openTag += ssrRenderAttrs(props, tag);
  }
  if (scopeId) {
    openTag += ` ${scopeId}`;
  }
  let curParent = parentComponent;
  let curVnode = vnode;
  while (curParent && curVnode === curParent.subTree) {
    curVnode = curParent.vnode;
    if (curVnode.scopeId) {
      openTag += ` ${curVnode.scopeId}`;
    }
    curParent = curParent.parent;
  }
  if (slotScopeId) {
    openTag += ` ${slotScopeId}`;
  }
  push(openTag + `>`);
  if (!shared.isVoidTag(tag)) {
    let hasChildrenOverride = false;
    if (props) {
      if (props.innerHTML) {
        hasChildrenOverride = true;
        push(props.innerHTML);
      } else if (props.textContent) {
        hasChildrenOverride = true;
        push(shared.escapeHtml(props.textContent));
      } else if (tag === "textarea" && props.value) {
        hasChildrenOverride = true;
        push(shared.escapeHtml(props.value));
      }
    }
    if (!hasChildrenOverride) {
      if (shapeFlag & 8) {
        push(shared.escapeHtml(children));
      } else if (shapeFlag & 16) {
        renderVNodeChildren(
          push,
          children,
          parentComponent,
          slotScopeId
        );
      }
    }
    push(`</${tag}>`);
  }
}
function applySSRDirectives(vnode, rawProps, dirs) {
  const toMerge = [];
  for (let i = 0; i < dirs.length; i++) {
    const binding = dirs[i];
    const {
      dir: { getSSRProps }
    } = binding;
    if (getSSRProps) {
      const props = getSSRProps(binding, vnode);
      if (props) toMerge.push(props);
    }
  }
  return Vue.mergeProps(rawProps || {}, ...toMerge);
}
function renderTeleportVNode(push, vnode, parentComponent, slotScopeId) {
  const target = vnode.props && vnode.props.to;
  const disabled = vnode.props && vnode.props.disabled;
  if (!target) {
    if (!disabled) {
      Vue.warn(`[@vue/server-renderer] Teleport is missing target prop.`);
    }
    return [];
  }
  if (!shared.isString(target)) {
    Vue.warn(
      `[@vue/server-renderer] Teleport target must be a query selector string.`
    );
    return [];
  }
  ssrRenderTeleport(
    push,
    (push2) => {
      renderVNodeChildren(
        push2,
        vnode.children,
        parentComponent,
        slotScopeId
      );
    },
    target,
    disabled || disabled === "",
    parentComponent
  );
}

const { isVNode: isVNode$1 } = Vue.ssrUtils;
function nestedUnrollBuffer(buffer, parentRet, startIndex) {
  if (!buffer.hasAsync) {
    return parentRet + unrollBufferSync$1(buffer);
  }
  let ret = parentRet;
  for (let i = startIndex; i < buffer.length; i += 1) {
    const item = buffer[i];
    if (shared.isString(item)) {
      ret += item;
      continue;
    }
    if (shared.isPromise(item)) {
      return item.then((nestedItem) => {
        buffer[i] = nestedItem;
        return nestedUnrollBuffer(buffer, ret, i);
      });
    }
    const result = nestedUnrollBuffer(item, ret, 0);
    if (shared.isPromise(result)) {
      return result.then((nestedItem) => {
        buffer[i] = nestedItem;
        return nestedUnrollBuffer(buffer, "", i);
      });
    }
    ret = result;
  }
  return ret;
}
function unrollBuffer$1(buffer) {
  return nestedUnrollBuffer(buffer, "", 0);
}
function unrollBufferSync$1(buffer) {
  let ret = "";
  for (let i = 0; i < buffer.length; i++) {
    let item = buffer[i];
    if (shared.isString(item)) {
      ret += item;
    } else {
      ret += unrollBufferSync$1(item);
    }
  }
  return ret;
}
async function renderToString(input, context = {}) {
  if (isVNode$1(input)) {
    return renderToString(Vue.createApp({ render: () => input }), context);
  }
  const vnode = Vue.createVNode(input._component, input._props);
  vnode.appContext = input._context;
  input.provide(Vue.ssrContextKey, context);
  const buffer = await renderComponentVNode(vnode);
  const result = await unrollBuffer$1(buffer);
  await resolveTeleports(context);
  if (context.__watcherHandles) {
    for (const unwatch of context.__watcherHandles) {
      unwatch();
    }
  }
  return result;
}
async function resolveTeleports(context) {
  if (context.__teleportBuffers) {
    context.teleports = context.teleports || {};
    for (const key in context.__teleportBuffers) {
      context.teleports[key] = await unrollBuffer$1(
        await Promise.all([context.__teleportBuffers[key]])
      );
    }
  }
}

const { isVNode } = Vue.ssrUtils;
async function unrollBuffer(buffer, stream) {
  if (buffer.hasAsync) {
    for (let i = 0; i < buffer.length; i++) {
      let item = buffer[i];
      if (shared.isPromise(item)) {
        item = await item;
      }
      if (shared.isString(item)) {
        stream.push(item);
      } else {
        await unrollBuffer(item, stream);
      }
    }
  } else {
    unrollBufferSync(buffer, stream);
  }
}
function unrollBufferSync(buffer, stream) {
  for (let i = 0; i < buffer.length; i++) {
    let item = buffer[i];
    if (shared.isString(item)) {
      stream.push(item);
    } else {
      unrollBufferSync(item, stream);
    }
  }
}
function renderToSimpleStream(input, context, stream) {
  if (isVNode(input)) {
    return renderToSimpleStream(
      Vue.createApp({ render: () => input }),
      context,
      stream
    );
  }
  const vnode = Vue.createVNode(input._component, input._props);
  vnode.appContext = input._context;
  input.provide(Vue.ssrContextKey, context);
  Promise.resolve(renderComponentVNode(vnode)).then((buffer) => unrollBuffer(buffer, stream)).then(() => resolveTeleports(context)).then(() => {
    if (context.__watcherHandles) {
      for (const unwatch of context.__watcherHandles) {
        unwatch();
      }
    }
  }).then(() => stream.push(null)).catch((error) => {
    stream.destroy(error);
  });
  return stream;
}
function renderToStream(input, context = {}) {
  console.warn(
    `[@vue/server-renderer] renderToStream is deprecated - use renderToNodeStream instead.`
  );
  return renderToNodeStream(input, context);
}
function renderToNodeStream(input, context = {}) {
  const stream = new (require$$3).Readable({ read() {
  } }) ;
  if (!stream) {
    throw new Error(
      `ESM build of renderToStream() does not support renderToNodeStream(). Use pipeToNodeWritable() with an existing Node.js Writable stream instance instead.`
    );
  }
  return renderToSimpleStream(input, context, stream);
}
function pipeToNodeWritable(input, context = {}, writable) {
  renderToSimpleStream(input, context, {
    push(content) {
      if (content != null) {
        writable.write(content);
      } else {
        writable.end();
      }
    },
    destroy(err) {
      writable.destroy(err);
    }
  });
}
function renderToWebStream(input, context = {}) {
  if (typeof ReadableStream !== "function") {
    throw new Error(
      `ReadableStream constructor is not available in the global scope. If the target environment does support web streams, consider using pipeToWebWritable() with an existing WritableStream instance instead.`
    );
  }
  const encoder = new TextEncoder();
  let cancelled = false;
  return new ReadableStream({
    start(controller) {
      renderToSimpleStream(input, context, {
        push(content) {
          if (cancelled) return;
          if (content != null) {
            controller.enqueue(encoder.encode(content));
          } else {
            controller.close();
          }
        },
        destroy(err) {
          controller.error(err);
        }
      });
    },
    cancel() {
      cancelled = true;
    }
  });
}
function pipeToWebWritable(input, context = {}, writable) {
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  let hasReady = false;
  try {
    hasReady = shared.isPromise(writer.ready);
  } catch (e) {
  }
  renderToSimpleStream(input, context, {
    async push(content) {
      if (hasReady) {
        await writer.ready;
      }
      if (content != null) {
        return writer.write(encoder.encode(content));
      } else {
        return writer.close();
      }
    },
    destroy(err) {
      console.log(err);
      writer.close();
    }
  });
}

Vue.initDirectivesForSSR();

serverRenderer_cjs_prod.ssrIncludeBooleanAttr = shared.includeBooleanAttr;
serverRenderer_cjs_prod.pipeToNodeWritable = pipeToNodeWritable;
serverRenderer_cjs_prod.pipeToWebWritable = pipeToWebWritable;
serverRenderer_cjs_prod.renderToNodeStream = renderToNodeStream;
serverRenderer_cjs_prod.renderToSimpleStream = renderToSimpleStream;
serverRenderer_cjs_prod.renderToStream = renderToStream;
var renderToString_1 = serverRenderer_cjs_prod.renderToString = renderToString;
serverRenderer_cjs_prod.renderToWebStream = renderToWebStream;
serverRenderer_cjs_prod.ssrGetDirectiveProps = ssrGetDirectiveProps;
serverRenderer_cjs_prod.ssrGetDynamicModelProps = ssrGetDynamicModelProps;
serverRenderer_cjs_prod.ssrInterpolate = ssrInterpolate;
serverRenderer_cjs_prod.ssrLooseContain = ssrLooseContain;
serverRenderer_cjs_prod.ssrLooseEqual = ssrLooseEqual;
serverRenderer_cjs_prod.ssrRenderAttr = ssrRenderAttr;
serverRenderer_cjs_prod.ssrRenderAttrs = ssrRenderAttrs;
serverRenderer_cjs_prod.ssrRenderClass = ssrRenderClass;
serverRenderer_cjs_prod.ssrRenderComponent = ssrRenderComponent;
serverRenderer_cjs_prod.ssrRenderDynamicAttr = ssrRenderDynamicAttr;
serverRenderer_cjs_prod.ssrRenderDynamicModel = ssrRenderDynamicModel;
serverRenderer_cjs_prod.ssrRenderList = ssrRenderList;
serverRenderer_cjs_prod.ssrRenderSlot = ssrRenderSlot;
serverRenderer_cjs_prod.ssrRenderSlotInner = ssrRenderSlotInner;
serverRenderer_cjs_prod.ssrRenderStyle = ssrRenderStyle;
serverRenderer_cjs_prod.ssrRenderSuspense = ssrRenderSuspense;
serverRenderer_cjs_prod.ssrRenderTeleport = ssrRenderTeleport;
serverRenderer_cjs_prod.ssrRenderVNode = renderVNode;

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"}],"link":[],"style":[],"script":[],"noscript":[],"htmlAttrs":{"class":"antialiased"},"bodyAttrs":{"class":"bg-white dark:bg-black dark:text-white font-sans"}};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appId = "nuxt-app";

function baseURL() {
  return useRuntimeConfig().app.baseURL;
}
function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getServerEntry = () => import('../build/server.mjs').then((r) => r.default || r);
const getClientManifest = () => import('../build/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getSSRRenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  if (!manifest) {
    throw new Error("client.manifest is not available");
  }
  const createSSRApp = await getServerEntry();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const options = {
    manifest,
    renderToString,
    buildAssetsURL
  };
  const renderer = createRenderer(createSSRApp, options);
  async function renderToString(input, context) {
    const html = await renderToString_1(input, context);
    return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
  }
  return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  const spaTemplate = await import('../virtual/_virtual_spa-template.mjs').then((r) => r.template).catch(() => "").then((r) => {
    {
      return APP_ROOT_OPEN_TAG + r + APP_ROOT_CLOSE_TAG;
    }
  });
  const options = {
    manifest,
    renderToString: () => spaTemplate,
    buildAssetsURL
  };
  const renderer = createRenderer(() => () => {
  }, options);
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig(ssrContext.event);
    ssrContext.modules ||= /* @__PURE__ */ new Set();
    ssrContext.payload.serverRendered = false;
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}
function getRenderer(ssrContext) {
  return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
const getSSRStyles = lazyCachedFunction(() => import('../build/styles.mjs').then((r) => r.default || r));
const getEntryIds = () => getClientManifest().then((r) => Object.values(r).filter(
  (r2) => (
    // @ts-expect-error internal key set by CSS inlining configuration
    r2._globalCSS
  )
).map((r2) => r2.src));

function renderPayloadResponse(ssrContext) {
  return {
    body: stringify(splitPayload(ssrContext).payload, ssrContext._payloadReducers) ,
    statusCode: getResponseStatus(ssrContext.event),
    statusMessage: getResponseStatusText(ssrContext.event),
    headers: {
      "content-type": "application/json;charset=utf-8" ,
      "x-powered-by": "Nuxt"
    }
  };
}
function renderPayloadJsonScript(opts) {
  const contents = opts.data ? stringify(opts.data, opts.ssrContext._payloadReducers) : "";
  const payload = {
    "type": "application/json",
    "innerHTML": contents,
    "data-nuxt-data": appId,
    "data-ssr": !(opts.ssrContext.noSSR)
  };
  {
    payload.id = "__NUXT_DATA__";
  }
  if (opts.src) {
    payload["data-src"] = opts.src;
  }
  const config = uneval(opts.ssrContext.config);
  return [
    payload,
    {
      innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}`
    }
  ];
}
function splitPayload(ssrContext) {
  const { data, prerenderedAt, ...initial } = ssrContext.payload;
  return {
    initial: { ...initial, prerenderedAt },
    payload: { data, prerenderedAt }
  };
}

const unheadOptions = {
  disableDefaults: true,
  disableCapoSorting: false,
  plugins: [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin],
};

function createSSRContext(event) {
  const ssrContext = {
    url: event.path,
    event,
    runtimeConfig: useRuntimeConfig(event),
    noSSR: event.context.nuxt?.noSSR || (false),
    head: createHead(unheadOptions),
    error: false,
    nuxt: void 0,
    /* NuxtApp */
    payload: {},
    _payloadReducers: /* @__PURE__ */ Object.create(null),
    modules: /* @__PURE__ */ new Set()
  };
  return ssrContext;
}
function setSSRError(ssrContext, error) {
  ssrContext.error = true;
  ssrContext.payload = { error };
  ssrContext.url = error.url;
}

async function renderInlineStyles(usedModules) {
  const styleMap = await getSSRStyles();
  const inlinedStyles = /* @__PURE__ */ new Set();
  for (const mod of usedModules) {
    if (mod in styleMap && styleMap[mod]) {
      for (const style of await styleMap[mod]()) {
        inlinedStyles.add(style);
      }
    }
  }
  return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

const renderSSRHeadOptions = {"omitLineBreaks":false};

globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const renderer = defineRenderHandler(async (event) => {
  const nitroApp = useNitroApp();
  const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery(event) : null;
  if (ssrError && !("__unenv__" in event.node.req)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found: /__nuxt_error"
    });
  }
  const ssrContext = createSSRContext(event);
  const headEntryOptions = { mode: "server" };
  ssrContext.head.push(appHead, headEntryOptions);
  if (ssrError) {
    ssrError.statusCode &&= Number.parseInt(ssrError.statusCode);
    setSSRError(ssrContext, ssrError);
  }
  const isRenderingPayload = PAYLOAD_URL_RE.test(ssrContext.url);
  if (isRenderingPayload) {
    const url = ssrContext.url.substring(0, ssrContext.url.lastIndexOf("/")) || "/";
    ssrContext.url = url;
    event._path = event.node.req.url = url;
  }
  const routeOptions = getRouteRules(event);
  if (routeOptions.ssr === false) {
    ssrContext.noSSR = true;
  }
  const renderer = await getRenderer(ssrContext);
  {
    for (const id of await getEntryIds()) {
      ssrContext.modules.add(id);
    }
  }
  const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
    if (ssrContext._renderResponse && error.message === "skipping render") {
      return {};
    }
    const _err = !ssrError && ssrContext.payload?.error || error;
    await ssrContext.nuxt?.hooks.callHook("app:error", _err);
    throw _err;
  });
  const inlinedStyles = !ssrContext._renderResponse && !isRenderingPayload ? await renderInlineStyles(ssrContext.modules ?? []) : [];
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult: _rendered });
  if (ssrContext._renderResponse) {
    return ssrContext._renderResponse;
  }
  if (ssrContext.payload?.error && !ssrError) {
    throw ssrContext.payload.error;
  }
  if (isRenderingPayload) {
    const response = renderPayloadResponse(ssrContext);
    return response;
  }
  const NO_SCRIPTS = routeOptions.noScripts;
  const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
  if (ssrContext._preloadManifest && !NO_SCRIPTS) {
    ssrContext.head.push({
      link: [
        { rel: "preload", as: "fetch", fetchpriority: "low", crossorigin: "anonymous", href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`) }
      ]
    }, { ...headEntryOptions, tagPriority: "low" });
  }
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  const link = [];
  for (const resource of Object.values(styles)) {
    link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
  }
  if (link.length) {
    ssrContext.head.push({ link }, headEntryOptions);
  }
  if (!NO_SCRIPTS) {
    ssrContext.head.push({
      link: getPreloadLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      link: getPrefetchLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      script: renderPayloadJsonScript({ ssrContext, data: ssrContext.payload }) 
    }, {
      ...headEntryOptions,
      // this should come before another end of body scripts
      tagPosition: "bodyClose",
      tagPriority: "high"
    });
  }
  if (!routeOptions.noScripts) {
    ssrContext.head.push({
      script: Object.values(scripts).map((resource) => ({
        type: resource.module ? "module" : null,
        src: renderer.rendererContext.buildAssetsURL(resource.file),
        defer: resource.module ? null : true,
        // if we are rendering script tag payloads that import an async payload
        // we need to ensure this resolves before executing the Nuxt entry
        tagPosition: "head",
        crossorigin: ""
      }))
    }, headEntryOptions);
  }
  const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
  const htmlContext = {
    htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
    head: normalizeChunks([headTags]),
    bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
    bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
    body: [
      _rendered.html,
      APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG
    ],
    bodyAppend: [bodyTags]
  };
  await nitroApp.hooks.callHook("render:html", htmlContext, { event });
  return {
    body: renderHTMLDocument(htmlContext),
    statusCode: getResponseStatus(event),
    statusMessage: getResponseStatusText(event),
    headers: {
      "content-type": "text/html;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
});
function normalizeChunks(chunks) {
  return chunks.filter(Boolean).map((i) => i.trim());
}
function joinTags(tags) {
  return tags.join("");
}
function joinAttrs(chunks) {
  if (chunks.length === 0) {
    return "";
  }
  return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
  return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}

const renderer$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: renderer
});

export { buildAssetsURL as a, baseURL as b, headSymbol as h, publicAssetsURL as p, renderer$1 as r, useHead as u };
//# sourceMappingURL=renderer.mjs.map
