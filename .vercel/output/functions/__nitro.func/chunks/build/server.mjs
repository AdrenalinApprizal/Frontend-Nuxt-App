import decode__default from 'entities/lib/decode.js';
import { p as publicAssetsURL, l as lib, b as baseURL } from '../routes/renderer.mjs';
import estreeWalker__default from 'estree-walker';
import sourceMapJs__default from 'source-map-js';
import { n as parseQuery$1, o as hasProtocol, q as joinURL, t as getContext, v as withQuery, x as withTrailingSlash, y as withoutTrailingSlash, z as isScriptProtocol, A as sanitizeStatusCode, $ as $fetch, B as createHooks, C as executeAsync, k as createError$1, D as toRouteMatcher, E as createRouter$1, F as defu } from '../nitro/nitro.mjs';
import { defineStore, createPinia, setActivePinia, shouldHydrate } from 'pinia';
import node_stream__default from 'node:stream';
import '../_/shared.cjs.prod.mjs';
import '@vue/runtime-dom';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var vue = { exports: {} };
var vue_cjs_prod = {};
var compilerDom_cjs_prod = {};
var compilerCore_cjs_prod = {};
var shared_cjs_prod = {};
var hasRequiredShared_cjs_prod;
function requireShared_cjs_prod() {
  if (hasRequiredShared_cjs_prod) return shared_cjs_prod;
  hasRequiredShared_cjs_prod = 1;
  /**
  * @vue/shared v3.5.16
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  Object.defineProperty(shared_cjs_prod, "__esModule", { value: true });
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function makeMap(str) {
    const map = /* @__PURE__ */ Object.create(null);
    for (const key of str.split(",")) map[key] = 1;
    return (val) => val in map;
  }
  const EMPTY_OBJ = {};
  const EMPTY_ARR = [];
  const NOOP = () => {
  };
  const NO = () => false;
  const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
  (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
  const isModelListener = (key) => key.startsWith("onUpdate:");
  const extend = Object.assign;
  const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const isArray2 = Array.isArray;
  const isMap = (val) => toTypeString(val) === "[object Map]";
  const isSet = (val) => toTypeString(val) === "[object Set]";
  const isDate = (val) => toTypeString(val) === "[object Date]";
  const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject = (val) => toTypeString(val) === "[object Object]";
  const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  const isReservedProp = /* @__PURE__ */ makeMap(
    // the leading comma is intentional so empty string "" is also included
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  );
  const isBuiltInDirective = /* @__PURE__ */ makeMap(
    "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
  );
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  const camelizeRE = /-(\w)/g;
  const camelize = cacheStringFunction(
    (str) => {
      return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
    }
  );
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  );
  const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  const toHandlerKey = cacheStringFunction(
    (str) => {
      const s = str ? `on${capitalize(str)}` : ``;
      return s;
    }
  );
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const invokeArrayFns = (fns, ...arg) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](...arg);
    }
  };
  const def = (obj, key, value, writable = false) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      writable,
      value
    });
  };
  const looseToNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  const toNumber = (val) => {
    const n = isString(val) ? Number(val) : NaN;
    return isNaN(n) ? val : n;
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : {});
  };
  const identRE = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
  function genPropsAccessExp(name) {
    return identRE.test(name) ? `__props.${name}` : `__props[${JSON.stringify(name)}]`;
  }
  function genCacheKey(source, options) {
    return source + JSON.stringify(
      options,
      (_, val) => typeof val === "function" ? val.toString() : val
    );
  }
  const PatchFlags = {
    "TEXT": 1,
    "1": "TEXT",
    "CLASS": 2,
    "2": "CLASS",
    "STYLE": 4,
    "4": "STYLE",
    "PROPS": 8,
    "8": "PROPS",
    "FULL_PROPS": 16,
    "16": "FULL_PROPS",
    "NEED_HYDRATION": 32,
    "32": "NEED_HYDRATION",
    "STABLE_FRAGMENT": 64,
    "64": "STABLE_FRAGMENT",
    "KEYED_FRAGMENT": 128,
    "128": "KEYED_FRAGMENT",
    "UNKEYED_FRAGMENT": 256,
    "256": "UNKEYED_FRAGMENT",
    "NEED_PATCH": 512,
    "512": "NEED_PATCH",
    "DYNAMIC_SLOTS": 1024,
    "1024": "DYNAMIC_SLOTS",
    "DEV_ROOT_FRAGMENT": 2048,
    "2048": "DEV_ROOT_FRAGMENT",
    "CACHED": -1,
    "-1": "CACHED",
    "BAIL": -2,
    "-2": "BAIL"
  };
  const PatchFlagNames = {
    [1]: `TEXT`,
    [2]: `CLASS`,
    [4]: `STYLE`,
    [8]: `PROPS`,
    [16]: `FULL_PROPS`,
    [32]: `NEED_HYDRATION`,
    [64]: `STABLE_FRAGMENT`,
    [128]: `KEYED_FRAGMENT`,
    [256]: `UNKEYED_FRAGMENT`,
    [512]: `NEED_PATCH`,
    [1024]: `DYNAMIC_SLOTS`,
    [2048]: `DEV_ROOT_FRAGMENT`,
    [-1]: `HOISTED`,
    [-2]: `BAIL`
  };
  const ShapeFlags = {
    "ELEMENT": 1,
    "1": "ELEMENT",
    "FUNCTIONAL_COMPONENT": 2,
    "2": "FUNCTIONAL_COMPONENT",
    "STATEFUL_COMPONENT": 4,
    "4": "STATEFUL_COMPONENT",
    "TEXT_CHILDREN": 8,
    "8": "TEXT_CHILDREN",
    "ARRAY_CHILDREN": 16,
    "16": "ARRAY_CHILDREN",
    "SLOTS_CHILDREN": 32,
    "32": "SLOTS_CHILDREN",
    "TELEPORT": 64,
    "64": "TELEPORT",
    "SUSPENSE": 128,
    "128": "SUSPENSE",
    "COMPONENT_SHOULD_KEEP_ALIVE": 256,
    "256": "COMPONENT_SHOULD_KEEP_ALIVE",
    "COMPONENT_KEPT_ALIVE": 512,
    "512": "COMPONENT_KEPT_ALIVE",
    "COMPONENT": 6,
    "6": "COMPONENT"
  };
  const SlotFlags = {
    "STABLE": 1,
    "1": "STABLE",
    "DYNAMIC": 2,
    "2": "DYNAMIC",
    "FORWARDED": 3,
    "3": "FORWARDED"
  };
  const slotFlagsText = {
    [1]: "STABLE",
    [2]: "DYNAMIC",
    [3]: "FORWARDED"
  };
  const GLOBALS_ALLOWED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol";
  const isGloballyAllowed = /* @__PURE__ */ makeMap(GLOBALS_ALLOWED);
  const isGloballyWhitelisted = isGloballyAllowed;
  const range = 2;
  function generateCodeFrame(source, start = 0, end = source.length) {
    start = Math.max(0, Math.min(start, source.length));
    end = Math.max(0, Math.min(end, source.length));
    if (start > end) return "";
    let lines = source.split(/(\r?\n)/);
    const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
    lines = lines.filter((_, idx) => idx % 2 === 0);
    let count = 0;
    const res = [];
    for (let i = 0; i < lines.length; i++) {
      count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);
      if (count >= start) {
        for (let j = i - range; j <= i + range || end > count; j++) {
          if (j < 0 || j >= lines.length) continue;
          const line = j + 1;
          res.push(
            `${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`
          );
          const lineLength = lines[j].length;
          const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;
          if (j === i) {
            const pad = start - (count - (lineLength + newLineSeqLength));
            const length = Math.max(
              1,
              end > count ? lineLength - pad : end - start
            );
            res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
          } else if (j > i) {
            if (end > count) {
              const length = Math.max(Math.min(end - count, lineLength), 1);
              res.push(`   |  ` + "^".repeat(length));
            }
            count += lineLength + newLineSeqLength;
          }
        }
        break;
      }
    }
    return res.join("\n");
  }
  function normalizeStyle(value) {
    if (isArray2(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isString(value) || isObject(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([^]+)/;
  const styleCommentRE = /\/\*[^]*?\*\//g;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function stringifyStyle(styles) {
    if (!styles) return "";
    if (isString(styles)) return styles;
    let ret = "";
    for (const key in styles) {
      const value = styles[key];
      if (isString(value) || typeof value === "number") {
        const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
        ret += `${normalizedKey}:${value};`;
      }
    }
    return ret;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray2(value)) {
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        if (normalized) {
          res += normalized + " ";
        }
      }
    } else if (isObject(value)) {
      for (const name in value) {
        if (value[name]) {
          res += name + " ";
        }
      }
    }
    return res.trim();
  }
  function normalizeProps(props) {
    if (!props) return null;
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (style) {
      props.style = normalizeStyle(style);
    }
    return props;
  }
  const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
  const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
  const MATH_TAGS = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics";
  const VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
  const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
  const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
  const isMathMLTag = /* @__PURE__ */ makeMap(MATH_TAGS);
  const isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
  const isBooleanAttr = /* @__PURE__ */ makeMap(
    specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`
  );
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }
  const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
  const attrValidationCache = {};
  function isSSRSafeAttrName(name) {
    if (attrValidationCache.hasOwnProperty(name)) {
      return attrValidationCache[name];
    }
    const isUnsafe = unsafeAttrCharRE.test(name);
    if (isUnsafe) {
      console.error(`unsafe attribute name: ${name}`);
    }
    return attrValidationCache[name] = !isUnsafe;
  }
  const propsToAttrMap = {
    acceptCharset: "accept-charset",
    className: "class",
    htmlFor: "for",
    httpEquiv: "http-equiv"
  };
  const isKnownHtmlAttr = /* @__PURE__ */ makeMap(
    `accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,inert,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`
  );
  const isKnownSvgAttr = /* @__PURE__ */ makeMap(
    `xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xmlns:xlink,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`
  );
  const isKnownMathMLAttr = /* @__PURE__ */ makeMap(
    `accent,accentunder,actiontype,align,alignmentscope,altimg,altimg-height,altimg-valign,altimg-width,alttext,bevelled,close,columnsalign,columnlines,columnspan,denomalign,depth,dir,display,displaystyle,encoding,equalcolumns,equalrows,fence,fontstyle,fontweight,form,frame,framespacing,groupalign,height,href,id,indentalign,indentalignfirst,indentalignlast,indentshift,indentshiftfirst,indentshiftlast,indextype,justify,largetop,largeop,lquote,lspace,mathbackground,mathcolor,mathsize,mathvariant,maxsize,minlabelspacing,mode,other,overflow,position,rowalign,rowlines,rowspan,rquote,rspace,scriptlevel,scriptminsize,scriptsizemultiplier,selection,separator,separators,shift,side,src,stackalign,stretchy,subscriptshift,superscriptshift,symmetric,voffset,width,widths,xlink:href,xlink:show,xlink:type,xmlns`
  );
  function isRenderableAttrValue(value) {
    if (value == null) {
      return false;
    }
    const type = typeof value;
    return type === "string" || type === "number" || type === "boolean";
  }
  const escapeRE = /["'&<>]/;
  function escapeHtml(string) {
    const str = "" + string;
    const match = escapeRE.exec(str);
    if (!match) {
      return str;
    }
    let html = "";
    let escaped;
    let index;
    let lastIndex = 0;
    for (index = match.index; index < str.length; index++) {
      switch (str.charCodeAt(index)) {
        case 34:
          escaped = "&quot;";
          break;
        case 38:
          escaped = "&amp;";
          break;
        case 39:
          escaped = "&#39;";
          break;
        case 60:
          escaped = "&lt;";
          break;
        case 62:
          escaped = "&gt;";
          break;
        default:
          continue;
      }
      if (lastIndex !== index) {
        html += str.slice(lastIndex, index);
      }
      lastIndex = index + 1;
      html += escaped;
    }
    return lastIndex !== index ? html + str.slice(lastIndex, index) : html;
  }
  const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
  function escapeHtmlComment(src) {
    return src.replace(commentStripRE, "");
  }
  const cssVarNameEscapeSymbolsRE = /[ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g;
  function getEscapedCssVarName(key, doubleEscape) {
    return key.replace(
      cssVarNameEscapeSymbolsRE,
      (s) => doubleEscape ? s === '"' ? '\\\\\\"' : `\\\\${s}` : `\\${s}`
    );
  }
  function looseCompareArrays(a, b) {
    if (a.length !== b.length) return false;
    let equal = true;
    for (let i = 0; equal && i < a.length; i++) {
      equal = looseEqual(a[i], b[i]);
    }
    return equal;
  }
  function looseEqual(a, b) {
    if (a === b) return true;
    let aValidType = isDate(a);
    let bValidType = isDate(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? a.getTime() === b.getTime() : false;
    }
    aValidType = isSymbol(a);
    bValidType = isSymbol(b);
    if (aValidType || bValidType) {
      return a === b;
    }
    aValidType = isArray2(a);
    bValidType = isArray2(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? looseCompareArrays(a, b) : false;
    }
    aValidType = isObject(a);
    bValidType = isObject(b);
    if (aValidType || bValidType) {
      if (!aValidType || !bValidType) {
        return false;
      }
      const aKeysCount = Object.keys(a).length;
      const bKeysCount = Object.keys(b).length;
      if (aKeysCount !== bKeysCount) {
        return false;
      }
      for (const key in a) {
        const aHasKey = a.hasOwnProperty(key);
        const bHasKey = b.hasOwnProperty(key);
        if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
          return false;
        }
      }
    }
    return String(a) === String(b);
  }
  function looseIndexOf(arr, val) {
    return arr.findIndex((item) => looseEqual(item, val));
  }
  const isRef = (val) => {
    return !!(val && val["__v_isRef"] === true);
  };
  const toDisplayString = (val) => {
    return isString(val) ? val : val == null ? "" : isArray2(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
  };
  const replacer = (_key, val) => {
    if (isRef(val)) {
      return replacer(_key, val.value);
    } else if (isMap(val)) {
      return {
        [`Map(${val.size})`]: [...val.entries()].reduce(
          (entries, [key, val2], i) => {
            entries[stringifySymbol(key, i) + " =>"] = val2;
            return entries;
          },
          {}
        )
      };
    } else if (isSet(val)) {
      return {
        [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
      };
    } else if (isSymbol(val)) {
      return stringifySymbol(val);
    } else if (isObject(val) && !isArray2(val) && !isPlainObject(val)) {
      return String(val);
    }
    return val;
  };
  const stringifySymbol = (v, i = "") => {
    var _a;
    return (
      // Symbol.description in es2019+ so we need to cast here to pass
      // the lib: es2016 check
      isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
    );
  };
  shared_cjs_prod.EMPTY_ARR = EMPTY_ARR;
  shared_cjs_prod.EMPTY_OBJ = EMPTY_OBJ;
  shared_cjs_prod.NO = NO;
  shared_cjs_prod.NOOP = NOOP;
  shared_cjs_prod.PatchFlagNames = PatchFlagNames;
  shared_cjs_prod.PatchFlags = PatchFlags;
  shared_cjs_prod.ShapeFlags = ShapeFlags;
  shared_cjs_prod.SlotFlags = SlotFlags;
  shared_cjs_prod.camelize = camelize;
  shared_cjs_prod.capitalize = capitalize;
  shared_cjs_prod.cssVarNameEscapeSymbolsRE = cssVarNameEscapeSymbolsRE;
  shared_cjs_prod.def = def;
  shared_cjs_prod.escapeHtml = escapeHtml;
  shared_cjs_prod.escapeHtmlComment = escapeHtmlComment;
  shared_cjs_prod.extend = extend;
  shared_cjs_prod.genCacheKey = genCacheKey;
  shared_cjs_prod.genPropsAccessExp = genPropsAccessExp;
  shared_cjs_prod.generateCodeFrame = generateCodeFrame;
  shared_cjs_prod.getEscapedCssVarName = getEscapedCssVarName;
  shared_cjs_prod.getGlobalThis = getGlobalThis;
  shared_cjs_prod.hasChanged = hasChanged;
  shared_cjs_prod.hasOwn = hasOwn;
  shared_cjs_prod.hyphenate = hyphenate;
  shared_cjs_prod.includeBooleanAttr = includeBooleanAttr;
  shared_cjs_prod.invokeArrayFns = invokeArrayFns;
  shared_cjs_prod.isArray = isArray2;
  shared_cjs_prod.isBooleanAttr = isBooleanAttr;
  shared_cjs_prod.isBuiltInDirective = isBuiltInDirective;
  shared_cjs_prod.isDate = isDate;
  shared_cjs_prod.isFunction = isFunction;
  shared_cjs_prod.isGloballyAllowed = isGloballyAllowed;
  shared_cjs_prod.isGloballyWhitelisted = isGloballyWhitelisted;
  shared_cjs_prod.isHTMLTag = isHTMLTag;
  shared_cjs_prod.isIntegerKey = isIntegerKey;
  shared_cjs_prod.isKnownHtmlAttr = isKnownHtmlAttr;
  shared_cjs_prod.isKnownMathMLAttr = isKnownMathMLAttr;
  shared_cjs_prod.isKnownSvgAttr = isKnownSvgAttr;
  shared_cjs_prod.isMap = isMap;
  shared_cjs_prod.isMathMLTag = isMathMLTag;
  shared_cjs_prod.isModelListener = isModelListener;
  shared_cjs_prod.isObject = isObject;
  shared_cjs_prod.isOn = isOn;
  shared_cjs_prod.isPlainObject = isPlainObject;
  shared_cjs_prod.isPromise = isPromise;
  shared_cjs_prod.isRegExp = isRegExp;
  shared_cjs_prod.isRenderableAttrValue = isRenderableAttrValue;
  shared_cjs_prod.isReservedProp = isReservedProp;
  shared_cjs_prod.isSSRSafeAttrName = isSSRSafeAttrName;
  shared_cjs_prod.isSVGTag = isSVGTag;
  shared_cjs_prod.isSet = isSet;
  shared_cjs_prod.isSpecialBooleanAttr = isSpecialBooleanAttr;
  shared_cjs_prod.isString = isString;
  shared_cjs_prod.isSymbol = isSymbol;
  shared_cjs_prod.isVoidTag = isVoidTag;
  shared_cjs_prod.looseEqual = looseEqual;
  shared_cjs_prod.looseIndexOf = looseIndexOf;
  shared_cjs_prod.looseToNumber = looseToNumber;
  shared_cjs_prod.makeMap = makeMap;
  shared_cjs_prod.normalizeClass = normalizeClass;
  shared_cjs_prod.normalizeProps = normalizeProps;
  shared_cjs_prod.normalizeStyle = normalizeStyle;
  shared_cjs_prod.objectToString = objectToString;
  shared_cjs_prod.parseStringStyle = parseStringStyle;
  shared_cjs_prod.propsToAttrMap = propsToAttrMap;
  shared_cjs_prod.remove = remove;
  shared_cjs_prod.slotFlagsText = slotFlagsText;
  shared_cjs_prod.stringifyStyle = stringifyStyle;
  shared_cjs_prod.toDisplayString = toDisplayString;
  shared_cjs_prod.toHandlerKey = toHandlerKey;
  shared_cjs_prod.toNumber = toNumber;
  shared_cjs_prod.toRawType = toRawType;
  shared_cjs_prod.toTypeString = toTypeString;
  return shared_cjs_prod;
}
var hasRequiredCompilerCore_cjs_prod;
function requireCompilerCore_cjs_prod() {
  if (hasRequiredCompilerCore_cjs_prod) return compilerCore_cjs_prod;
  hasRequiredCompilerCore_cjs_prod = 1;
  /**
  * @vue/compiler-core v3.5.16
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  Object.defineProperty(compilerCore_cjs_prod, "__esModule", { value: true });
  var shared = /* @__PURE__ */ requireShared_cjs_prod();
  var decode_js = decode__default;
  var parser = lib;
  var estreeWalker = estreeWalker__default;
  var sourceMapJs = sourceMapJs__default;
  const FRAGMENT = Symbol(``);
  const TELEPORT = Symbol(``);
  const SUSPENSE = Symbol(``);
  const KEEP_ALIVE = Symbol(``);
  const BASE_TRANSITION = Symbol(
    ``
  );
  const OPEN_BLOCK = Symbol(``);
  const CREATE_BLOCK = Symbol(``);
  const CREATE_ELEMENT_BLOCK = Symbol(
    ``
  );
  const CREATE_VNODE = Symbol(``);
  const CREATE_ELEMENT_VNODE = Symbol(
    ``
  );
  const CREATE_COMMENT = Symbol(
    ``
  );
  const CREATE_TEXT = Symbol(
    ``
  );
  const CREATE_STATIC = Symbol(
    ``
  );
  const RESOLVE_COMPONENT = Symbol(
    ``
  );
  const RESOLVE_DYNAMIC_COMPONENT = Symbol(
    ``
  );
  const RESOLVE_DIRECTIVE = Symbol(
    ``
  );
  const RESOLVE_FILTER = Symbol(
    ``
  );
  const WITH_DIRECTIVES = Symbol(
    ``
  );
  const RENDER_LIST = Symbol(``);
  const RENDER_SLOT = Symbol(``);
  const CREATE_SLOTS = Symbol(``);
  const TO_DISPLAY_STRING = Symbol(
    ``
  );
  const MERGE_PROPS = Symbol(``);
  const NORMALIZE_CLASS = Symbol(
    ``
  );
  const NORMALIZE_STYLE = Symbol(
    ``
  );
  const NORMALIZE_PROPS = Symbol(
    ``
  );
  const GUARD_REACTIVE_PROPS = Symbol(
    ``
  );
  const TO_HANDLERS = Symbol(``);
  const CAMELIZE = Symbol(``);
  const CAPITALIZE = Symbol(``);
  const TO_HANDLER_KEY = Symbol(
    ``
  );
  const SET_BLOCK_TRACKING = Symbol(
    ``
  );
  const PUSH_SCOPE_ID = Symbol(``);
  const POP_SCOPE_ID = Symbol(``);
  const WITH_CTX = Symbol(``);
  const UNREF = Symbol(``);
  const IS_REF = Symbol(``);
  const WITH_MEMO = Symbol(``);
  const IS_MEMO_SAME = Symbol(``);
  const helperNameMap = {
    [FRAGMENT]: `Fragment`,
    [TELEPORT]: `Teleport`,
    [SUSPENSE]: `Suspense`,
    [KEEP_ALIVE]: `KeepAlive`,
    [BASE_TRANSITION]: `BaseTransition`,
    [OPEN_BLOCK]: `openBlock`,
    [CREATE_BLOCK]: `createBlock`,
    [CREATE_ELEMENT_BLOCK]: `createElementBlock`,
    [CREATE_VNODE]: `createVNode`,
    [CREATE_ELEMENT_VNODE]: `createElementVNode`,
    [CREATE_COMMENT]: `createCommentVNode`,
    [CREATE_TEXT]: `createTextVNode`,
    [CREATE_STATIC]: `createStaticVNode`,
    [RESOLVE_COMPONENT]: `resolveComponent`,
    [RESOLVE_DYNAMIC_COMPONENT]: `resolveDynamicComponent`,
    [RESOLVE_DIRECTIVE]: `resolveDirective`,
    [RESOLVE_FILTER]: `resolveFilter`,
    [WITH_DIRECTIVES]: `withDirectives`,
    [RENDER_LIST]: `renderList`,
    [RENDER_SLOT]: `renderSlot`,
    [CREATE_SLOTS]: `createSlots`,
    [TO_DISPLAY_STRING]: `toDisplayString`,
    [MERGE_PROPS]: `mergeProps`,
    [NORMALIZE_CLASS]: `normalizeClass`,
    [NORMALIZE_STYLE]: `normalizeStyle`,
    [NORMALIZE_PROPS]: `normalizeProps`,
    [GUARD_REACTIVE_PROPS]: `guardReactiveProps`,
    [TO_HANDLERS]: `toHandlers`,
    [CAMELIZE]: `camelize`,
    [CAPITALIZE]: `capitalize`,
    [TO_HANDLER_KEY]: `toHandlerKey`,
    [SET_BLOCK_TRACKING]: `setBlockTracking`,
    [PUSH_SCOPE_ID]: `pushScopeId`,
    [POP_SCOPE_ID]: `popScopeId`,
    [WITH_CTX]: `withCtx`,
    [UNREF]: `unref`,
    [IS_REF]: `isRef`,
    [WITH_MEMO]: `withMemo`,
    [IS_MEMO_SAME]: `isMemoSame`
  };
  function registerRuntimeHelpers(helpers) {
    Object.getOwnPropertySymbols(helpers).forEach((s) => {
      helperNameMap[s] = helpers[s];
    });
  }
  const Namespaces = {
    "HTML": 0,
    "0": "HTML",
    "SVG": 1,
    "1": "SVG",
    "MATH_ML": 2,
    "2": "MATH_ML"
  };
  const NodeTypes = {
    "ROOT": 0,
    "0": "ROOT",
    "ELEMENT": 1,
    "1": "ELEMENT",
    "TEXT": 2,
    "2": "TEXT",
    "COMMENT": 3,
    "3": "COMMENT",
    "SIMPLE_EXPRESSION": 4,
    "4": "SIMPLE_EXPRESSION",
    "INTERPOLATION": 5,
    "5": "INTERPOLATION",
    "ATTRIBUTE": 6,
    "6": "ATTRIBUTE",
    "DIRECTIVE": 7,
    "7": "DIRECTIVE",
    "COMPOUND_EXPRESSION": 8,
    "8": "COMPOUND_EXPRESSION",
    "IF": 9,
    "9": "IF",
    "IF_BRANCH": 10,
    "10": "IF_BRANCH",
    "FOR": 11,
    "11": "FOR",
    "TEXT_CALL": 12,
    "12": "TEXT_CALL",
    "VNODE_CALL": 13,
    "13": "VNODE_CALL",
    "JS_CALL_EXPRESSION": 14,
    "14": "JS_CALL_EXPRESSION",
    "JS_OBJECT_EXPRESSION": 15,
    "15": "JS_OBJECT_EXPRESSION",
    "JS_PROPERTY": 16,
    "16": "JS_PROPERTY",
    "JS_ARRAY_EXPRESSION": 17,
    "17": "JS_ARRAY_EXPRESSION",
    "JS_FUNCTION_EXPRESSION": 18,
    "18": "JS_FUNCTION_EXPRESSION",
    "JS_CONDITIONAL_EXPRESSION": 19,
    "19": "JS_CONDITIONAL_EXPRESSION",
    "JS_CACHE_EXPRESSION": 20,
    "20": "JS_CACHE_EXPRESSION",
    "JS_BLOCK_STATEMENT": 21,
    "21": "JS_BLOCK_STATEMENT",
    "JS_TEMPLATE_LITERAL": 22,
    "22": "JS_TEMPLATE_LITERAL",
    "JS_IF_STATEMENT": 23,
    "23": "JS_IF_STATEMENT",
    "JS_ASSIGNMENT_EXPRESSION": 24,
    "24": "JS_ASSIGNMENT_EXPRESSION",
    "JS_SEQUENCE_EXPRESSION": 25,
    "25": "JS_SEQUENCE_EXPRESSION",
    "JS_RETURN_STATEMENT": 26,
    "26": "JS_RETURN_STATEMENT"
  };
  const ElementTypes = {
    "ELEMENT": 0,
    "0": "ELEMENT",
    "COMPONENT": 1,
    "1": "COMPONENT",
    "SLOT": 2,
    "2": "SLOT",
    "TEMPLATE": 3,
    "3": "TEMPLATE"
  };
  const ConstantTypes = {
    "NOT_CONSTANT": 0,
    "0": "NOT_CONSTANT",
    "CAN_SKIP_PATCH": 1,
    "1": "CAN_SKIP_PATCH",
    "CAN_CACHE": 2,
    "2": "CAN_CACHE",
    "CAN_STRINGIFY": 3,
    "3": "CAN_STRINGIFY"
  };
  const locStub = {
    start: { line: 1, column: 1, offset: 0 },
    end: { line: 1, column: 1, offset: 0 },
    source: ""
  };
  function createRoot(children, source = "") {
    return {
      type: 0,
      source,
      children,
      helpers: /* @__PURE__ */ new Set(),
      components: [],
      directives: [],
      hoists: [],
      imports: [],
      cached: [],
      temps: 0,
      codegenNode: void 0,
      loc: locStub
    };
  }
  function createVNodeCall(context, tag, props, children, patchFlag, dynamicProps, directives, isBlock = false, disableTracking = false, isComponent2 = false, loc = locStub) {
    if (context) {
      if (isBlock) {
        context.helper(OPEN_BLOCK);
        context.helper(getVNodeBlockHelper(context.inSSR, isComponent2));
      } else {
        context.helper(getVNodeHelper(context.inSSR, isComponent2));
      }
      if (directives) {
        context.helper(WITH_DIRECTIVES);
      }
    }
    return {
      type: 13,
      tag,
      props,
      children,
      patchFlag,
      dynamicProps,
      directives,
      isBlock,
      disableTracking,
      isComponent: isComponent2,
      loc
    };
  }
  function createArrayExpression(elements, loc = locStub) {
    return {
      type: 17,
      loc,
      elements
    };
  }
  function createObjectExpression(properties, loc = locStub) {
    return {
      type: 15,
      loc,
      properties
    };
  }
  function createObjectProperty(key, value) {
    return {
      type: 16,
      loc: locStub,
      key: shared.isString(key) ? createSimpleExpression(key, true) : key,
      value
    };
  }
  function createSimpleExpression(content, isStatic = false, loc = locStub, constType = 0) {
    return {
      type: 4,
      loc,
      content,
      isStatic,
      constType: isStatic ? 3 : constType
    };
  }
  function createInterpolation(content, loc) {
    return {
      type: 5,
      loc,
      content: shared.isString(content) ? createSimpleExpression(content, false, loc) : content
    };
  }
  function createCompoundExpression(children, loc = locStub) {
    return {
      type: 8,
      loc,
      children
    };
  }
  function createCallExpression(callee, args = [], loc = locStub) {
    return {
      type: 14,
      loc,
      callee,
      arguments: args
    };
  }
  function createFunctionExpression(params, returns = void 0, newline = false, isSlot = false, loc = locStub) {
    return {
      type: 18,
      params,
      returns,
      newline,
      isSlot,
      loc
    };
  }
  function createConditionalExpression(test, consequent, alternate, newline = true) {
    return {
      type: 19,
      test,
      consequent,
      alternate,
      newline,
      loc: locStub
    };
  }
  function createCacheExpression(index, value, needPauseTracking = false, inVOnce = false) {
    return {
      type: 20,
      index,
      value,
      needPauseTracking,
      inVOnce,
      needArraySpread: false,
      loc: locStub
    };
  }
  function createBlockStatement(body) {
    return {
      type: 21,
      body,
      loc: locStub
    };
  }
  function createTemplateLiteral(elements) {
    return {
      type: 22,
      elements,
      loc: locStub
    };
  }
  function createIfStatement(test, consequent, alternate) {
    return {
      type: 23,
      test,
      consequent,
      alternate,
      loc: locStub
    };
  }
  function createAssignmentExpression(left, right) {
    return {
      type: 24,
      left,
      right,
      loc: locStub
    };
  }
  function createSequenceExpression(expressions) {
    return {
      type: 25,
      expressions,
      loc: locStub
    };
  }
  function createReturnStatement(returns) {
    return {
      type: 26,
      returns,
      loc: locStub
    };
  }
  function getVNodeHelper(ssr, isComponent2) {
    return ssr || isComponent2 ? CREATE_VNODE : CREATE_ELEMENT_VNODE;
  }
  function getVNodeBlockHelper(ssr, isComponent2) {
    return ssr || isComponent2 ? CREATE_BLOCK : CREATE_ELEMENT_BLOCK;
  }
  function convertToBlock(node, { helper, removeHelper, inSSR }) {
    if (!node.isBlock) {
      node.isBlock = true;
      removeHelper(getVNodeHelper(inSSR, node.isComponent));
      helper(OPEN_BLOCK);
      helper(getVNodeBlockHelper(inSSR, node.isComponent));
    }
  }
  const defaultDelimitersOpen = new Uint8Array([123, 123]);
  const defaultDelimitersClose = new Uint8Array([125, 125]);
  function isTagStartChar(c) {
    return c >= 97 && c <= 122 || c >= 65 && c <= 90;
  }
  function isWhitespace(c) {
    return c === 32 || c === 10 || c === 9 || c === 12 || c === 13;
  }
  function isEndOfTagSection(c) {
    return c === 47 || c === 62 || isWhitespace(c);
  }
  function toCharCodes(str) {
    const ret = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      ret[i] = str.charCodeAt(i);
    }
    return ret;
  }
  const Sequences = {
    Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
    // CDATA[
    CdataEnd: new Uint8Array([93, 93, 62]),
    // ]]>
    CommentEnd: new Uint8Array([45, 45, 62]),
    // `-->`
    ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
    // `<\/script`
    StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
    // `</style`
    TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101]),
    // `</title`
    TextareaEnd: new Uint8Array([
      60,
      47,
      116,
      101,
      120,
      116,
      97,
      114,
      101,
      97
    ])
    // `</textarea
  };
  class Tokenizer {
    constructor(stack2, cbs) {
      this.stack = stack2;
      this.cbs = cbs;
      this.state = 1;
      this.buffer = "";
      this.sectionStart = 0;
      this.index = 0;
      this.entityStart = 0;
      this.baseState = 1;
      this.inRCDATA = false;
      this.inXML = false;
      this.inVPre = false;
      this.newlines = [];
      this.mode = 0;
      this.delimiterOpen = defaultDelimitersOpen;
      this.delimiterClose = defaultDelimitersClose;
      this.delimiterIndex = -1;
      this.currentSequence = void 0;
      this.sequenceIndex = 0;
      {
        this.entityDecoder = new decode_js.EntityDecoder(
          decode_js.htmlDecodeTree,
          (cp, consumed) => this.emitCodePoint(cp, consumed)
        );
      }
    }
    get inSFCRoot() {
      return this.mode === 2 && this.stack.length === 0;
    }
    reset() {
      this.state = 1;
      this.mode = 0;
      this.buffer = "";
      this.sectionStart = 0;
      this.index = 0;
      this.baseState = 1;
      this.inRCDATA = false;
      this.currentSequence = void 0;
      this.newlines.length = 0;
      this.delimiterOpen = defaultDelimitersOpen;
      this.delimiterClose = defaultDelimitersClose;
    }
    /**
     * Generate Position object with line / column information using recorded
     * newline positions. We know the index is always going to be an already
     * processed index, so all the newlines up to this index should have been
     * recorded.
     */
    getPos(index) {
      let line = 1;
      let column = index + 1;
      for (let i = this.newlines.length - 1; i >= 0; i--) {
        const newlineIndex = this.newlines[i];
        if (index > newlineIndex) {
          line = i + 2;
          column = index - newlineIndex;
          break;
        }
      }
      return {
        column,
        line,
        offset: index
      };
    }
    peek() {
      return this.buffer.charCodeAt(this.index + 1);
    }
    stateText(c) {
      if (c === 60) {
        if (this.index > this.sectionStart) {
          this.cbs.ontext(this.sectionStart, this.index);
        }
        this.state = 5;
        this.sectionStart = this.index;
      } else if (c === 38) {
        this.startEntity();
      } else if (!this.inVPre && c === this.delimiterOpen[0]) {
        this.state = 2;
        this.delimiterIndex = 0;
        this.stateInterpolationOpen(c);
      }
    }
    stateInterpolationOpen(c) {
      if (c === this.delimiterOpen[this.delimiterIndex]) {
        if (this.delimiterIndex === this.delimiterOpen.length - 1) {
          const start = this.index + 1 - this.delimiterOpen.length;
          if (start > this.sectionStart) {
            this.cbs.ontext(this.sectionStart, start);
          }
          this.state = 3;
          this.sectionStart = start;
        } else {
          this.delimiterIndex++;
        }
      } else if (this.inRCDATA) {
        this.state = 32;
        this.stateInRCDATA(c);
      } else {
        this.state = 1;
        this.stateText(c);
      }
    }
    stateInterpolation(c) {
      if (c === this.delimiterClose[0]) {
        this.state = 4;
        this.delimiterIndex = 0;
        this.stateInterpolationClose(c);
      }
    }
    stateInterpolationClose(c) {
      if (c === this.delimiterClose[this.delimiterIndex]) {
        if (this.delimiterIndex === this.delimiterClose.length - 1) {
          this.cbs.oninterpolation(this.sectionStart, this.index + 1);
          if (this.inRCDATA) {
            this.state = 32;
          } else {
            this.state = 1;
          }
          this.sectionStart = this.index + 1;
        } else {
          this.delimiterIndex++;
        }
      } else {
        this.state = 3;
        this.stateInterpolation(c);
      }
    }
    stateSpecialStartSequence(c) {
      const isEnd = this.sequenceIndex === this.currentSequence.length;
      const isMatch = isEnd ? (
        // If we are at the end of the sequence, make sure the tag name has ended
        isEndOfTagSection(c)
      ) : (
        // Otherwise, do a case-insensitive comparison
        (c | 32) === this.currentSequence[this.sequenceIndex]
      );
      if (!isMatch) {
        this.inRCDATA = false;
      } else if (!isEnd) {
        this.sequenceIndex++;
        return;
      }
      this.sequenceIndex = 0;
      this.state = 6;
      this.stateInTagName(c);
    }
    /** Look for an end tag. For <title> and <textarea>, also decode entities. */
    stateInRCDATA(c) {
      if (this.sequenceIndex === this.currentSequence.length) {
        if (c === 62 || isWhitespace(c)) {
          const endOfText = this.index - this.currentSequence.length;
          if (this.sectionStart < endOfText) {
            const actualIndex = this.index;
            this.index = endOfText;
            this.cbs.ontext(this.sectionStart, endOfText);
            this.index = actualIndex;
          }
          this.sectionStart = endOfText + 2;
          this.stateInClosingTagName(c);
          this.inRCDATA = false;
          return;
        }
        this.sequenceIndex = 0;
      }
      if ((c | 32) === this.currentSequence[this.sequenceIndex]) {
        this.sequenceIndex += 1;
      } else if (this.sequenceIndex === 0) {
        if (this.currentSequence === Sequences.TitleEnd || this.currentSequence === Sequences.TextareaEnd && !this.inSFCRoot) {
          if (c === 38) {
            this.startEntity();
          } else if (!this.inVPre && c === this.delimiterOpen[0]) {
            this.state = 2;
            this.delimiterIndex = 0;
            this.stateInterpolationOpen(c);
          }
        } else if (this.fastForwardTo(60)) {
          this.sequenceIndex = 1;
        }
      } else {
        this.sequenceIndex = Number(c === 60);
      }
    }
    stateCDATASequence(c) {
      if (c === Sequences.Cdata[this.sequenceIndex]) {
        if (++this.sequenceIndex === Sequences.Cdata.length) {
          this.state = 28;
          this.currentSequence = Sequences.CdataEnd;
          this.sequenceIndex = 0;
          this.sectionStart = this.index + 1;
        }
      } else {
        this.sequenceIndex = 0;
        this.state = 23;
        this.stateInDeclaration(c);
      }
    }
    /**
     * When we wait for one specific character, we can speed things up
     * by skipping through the buffer until we find it.
     *
     * @returns Whether the character was found.
     */
    fastForwardTo(c) {
      while (++this.index < this.buffer.length) {
        const cc = this.buffer.charCodeAt(this.index);
        if (cc === 10) {
          this.newlines.push(this.index);
        }
        if (cc === c) {
          return true;
        }
      }
      this.index = this.buffer.length - 1;
      return false;
    }
    /**
     * Comments and CDATA end with `-->` and `]]>`.
     *
     * Their common qualities are:
     * - Their end sequences have a distinct character they start with.
     * - That character is then repeated, so we have to check multiple repeats.
     * - All characters but the start character of the sequence can be skipped.
     */
    stateInCommentLike(c) {
      if (c === this.currentSequence[this.sequenceIndex]) {
        if (++this.sequenceIndex === this.currentSequence.length) {
          if (this.currentSequence === Sequences.CdataEnd) {
            this.cbs.oncdata(this.sectionStart, this.index - 2);
          } else {
            this.cbs.oncomment(this.sectionStart, this.index - 2);
          }
          this.sequenceIndex = 0;
          this.sectionStart = this.index + 1;
          this.state = 1;
        }
      } else if (this.sequenceIndex === 0) {
        if (this.fastForwardTo(this.currentSequence[0])) {
          this.sequenceIndex = 1;
        }
      } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
        this.sequenceIndex = 0;
      }
    }
    startSpecial(sequence, offset) {
      this.enterRCDATA(sequence, offset);
      this.state = 31;
    }
    enterRCDATA(sequence, offset) {
      this.inRCDATA = true;
      this.currentSequence = sequence;
      this.sequenceIndex = offset;
    }
    stateBeforeTagName(c) {
      if (c === 33) {
        this.state = 22;
        this.sectionStart = this.index + 1;
      } else if (c === 63) {
        this.state = 24;
        this.sectionStart = this.index + 1;
      } else if (isTagStartChar(c)) {
        this.sectionStart = this.index;
        if (this.mode === 0) {
          this.state = 6;
        } else if (this.inSFCRoot) {
          this.state = 34;
        } else if (!this.inXML) {
          if (c === 116) {
            this.state = 30;
          } else {
            this.state = c === 115 ? 29 : 6;
          }
        } else {
          this.state = 6;
        }
      } else if (c === 47) {
        this.state = 8;
      } else {
        this.state = 1;
        this.stateText(c);
      }
    }
    stateInTagName(c) {
      if (isEndOfTagSection(c)) {
        this.handleTagName(c);
      }
    }
    stateInSFCRootTagName(c) {
      if (isEndOfTagSection(c)) {
        const tag = this.buffer.slice(this.sectionStart, this.index);
        if (tag !== "template") {
          this.enterRCDATA(toCharCodes(`</` + tag), 0);
        }
        this.handleTagName(c);
      }
    }
    handleTagName(c) {
      this.cbs.onopentagname(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = 11;
      this.stateBeforeAttrName(c);
    }
    stateBeforeClosingTagName(c) {
      if (isWhitespace(c)) ;
      else if (c === 62) {
        {
          this.cbs.onerr(14, this.index);
        }
        this.state = 1;
        this.sectionStart = this.index + 1;
      } else {
        this.state = isTagStartChar(c) ? 9 : 27;
        this.sectionStart = this.index;
      }
    }
    stateInClosingTagName(c) {
      if (c === 62 || isWhitespace(c)) {
        this.cbs.onclosetag(this.sectionStart, this.index);
        this.sectionStart = -1;
        this.state = 10;
        this.stateAfterClosingTagName(c);
      }
    }
    stateAfterClosingTagName(c) {
      if (c === 62) {
        this.state = 1;
        this.sectionStart = this.index + 1;
      }
    }
    stateBeforeAttrName(c) {
      if (c === 62) {
        this.cbs.onopentagend(this.index);
        if (this.inRCDATA) {
          this.state = 32;
        } else {
          this.state = 1;
        }
        this.sectionStart = this.index + 1;
      } else if (c === 47) {
        this.state = 7;
        if (this.peek() !== 62) {
          this.cbs.onerr(22, this.index);
        }
      } else if (c === 60 && this.peek() === 47) {
        this.cbs.onopentagend(this.index);
        this.state = 5;
        this.sectionStart = this.index;
      } else if (!isWhitespace(c)) {
        if (c === 61) {
          this.cbs.onerr(
            19,
            this.index
          );
        }
        this.handleAttrStart(c);
      }
    }
    handleAttrStart(c) {
      if (c === 118 && this.peek() === 45) {
        this.state = 13;
        this.sectionStart = this.index;
      } else if (c === 46 || c === 58 || c === 64 || c === 35) {
        this.cbs.ondirname(this.index, this.index + 1);
        this.state = 14;
        this.sectionStart = this.index + 1;
      } else {
        this.state = 12;
        this.sectionStart = this.index;
      }
    }
    stateInSelfClosingTag(c) {
      if (c === 62) {
        this.cbs.onselfclosingtag(this.index);
        this.state = 1;
        this.sectionStart = this.index + 1;
        this.inRCDATA = false;
      } else if (!isWhitespace(c)) {
        this.state = 11;
        this.stateBeforeAttrName(c);
      }
    }
    stateInAttrName(c) {
      if (c === 61 || isEndOfTagSection(c)) {
        this.cbs.onattribname(this.sectionStart, this.index);
        this.handleAttrNameEnd(c);
      } else if (c === 34 || c === 39 || c === 60) {
        this.cbs.onerr(
          17,
          this.index
        );
      }
    }
    stateInDirName(c) {
      if (c === 61 || isEndOfTagSection(c)) {
        this.cbs.ondirname(this.sectionStart, this.index);
        this.handleAttrNameEnd(c);
      } else if (c === 58) {
        this.cbs.ondirname(this.sectionStart, this.index);
        this.state = 14;
        this.sectionStart = this.index + 1;
      } else if (c === 46) {
        this.cbs.ondirname(this.sectionStart, this.index);
        this.state = 16;
        this.sectionStart = this.index + 1;
      }
    }
    stateInDirArg(c) {
      if (c === 61 || isEndOfTagSection(c)) {
        this.cbs.ondirarg(this.sectionStart, this.index);
        this.handleAttrNameEnd(c);
      } else if (c === 91) {
        this.state = 15;
      } else if (c === 46) {
        this.cbs.ondirarg(this.sectionStart, this.index);
        this.state = 16;
        this.sectionStart = this.index + 1;
      }
    }
    stateInDynamicDirArg(c) {
      if (c === 93) {
        this.state = 14;
      } else if (c === 61 || isEndOfTagSection(c)) {
        this.cbs.ondirarg(this.sectionStart, this.index + 1);
        this.handleAttrNameEnd(c);
        {
          this.cbs.onerr(
            27,
            this.index
          );
        }
      }
    }
    stateInDirModifier(c) {
      if (c === 61 || isEndOfTagSection(c)) {
        this.cbs.ondirmodifier(this.sectionStart, this.index);
        this.handleAttrNameEnd(c);
      } else if (c === 46) {
        this.cbs.ondirmodifier(this.sectionStart, this.index);
        this.sectionStart = this.index + 1;
      }
    }
    handleAttrNameEnd(c) {
      this.sectionStart = this.index;
      this.state = 17;
      this.cbs.onattribnameend(this.index);
      this.stateAfterAttrName(c);
    }
    stateAfterAttrName(c) {
      if (c === 61) {
        this.state = 18;
      } else if (c === 47 || c === 62) {
        this.cbs.onattribend(0, this.sectionStart);
        this.sectionStart = -1;
        this.state = 11;
        this.stateBeforeAttrName(c);
      } else if (!isWhitespace(c)) {
        this.cbs.onattribend(0, this.sectionStart);
        this.handleAttrStart(c);
      }
    }
    stateBeforeAttrValue(c) {
      if (c === 34) {
        this.state = 19;
        this.sectionStart = this.index + 1;
      } else if (c === 39) {
        this.state = 20;
        this.sectionStart = this.index + 1;
      } else if (!isWhitespace(c)) {
        this.sectionStart = this.index;
        this.state = 21;
        this.stateInAttrValueNoQuotes(c);
      }
    }
    handleInAttrValue(c, quote) {
      if (c === quote || false) {
        this.cbs.onattribdata(this.sectionStart, this.index);
        this.sectionStart = -1;
        this.cbs.onattribend(
          quote === 34 ? 3 : 2,
          this.index + 1
        );
        this.state = 11;
      } else if (c === 38) {
        this.startEntity();
      }
    }
    stateInAttrValueDoubleQuotes(c) {
      this.handleInAttrValue(c, 34);
    }
    stateInAttrValueSingleQuotes(c) {
      this.handleInAttrValue(c, 39);
    }
    stateInAttrValueNoQuotes(c) {
      if (isWhitespace(c) || c === 62) {
        this.cbs.onattribdata(this.sectionStart, this.index);
        this.sectionStart = -1;
        this.cbs.onattribend(1, this.index);
        this.state = 11;
        this.stateBeforeAttrName(c);
      } else if (c === 34 || c === 39 || c === 60 || c === 61 || c === 96) {
        this.cbs.onerr(
          18,
          this.index
        );
      } else if (c === 38) {
        this.startEntity();
      }
    }
    stateBeforeDeclaration(c) {
      if (c === 91) {
        this.state = 26;
        this.sequenceIndex = 0;
      } else {
        this.state = c === 45 ? 25 : 23;
      }
    }
    stateInDeclaration(c) {
      if (c === 62 || this.fastForwardTo(62)) {
        this.state = 1;
        this.sectionStart = this.index + 1;
      }
    }
    stateInProcessingInstruction(c) {
      if (c === 62 || this.fastForwardTo(62)) {
        this.cbs.onprocessinginstruction(this.sectionStart, this.index);
        this.state = 1;
        this.sectionStart = this.index + 1;
      }
    }
    stateBeforeComment(c) {
      if (c === 45) {
        this.state = 28;
        this.currentSequence = Sequences.CommentEnd;
        this.sequenceIndex = 2;
        this.sectionStart = this.index + 1;
      } else {
        this.state = 23;
      }
    }
    stateInSpecialComment(c) {
      if (c === 62 || this.fastForwardTo(62)) {
        this.cbs.oncomment(this.sectionStart, this.index);
        this.state = 1;
        this.sectionStart = this.index + 1;
      }
    }
    stateBeforeSpecialS(c) {
      if (c === Sequences.ScriptEnd[3]) {
        this.startSpecial(Sequences.ScriptEnd, 4);
      } else if (c === Sequences.StyleEnd[3]) {
        this.startSpecial(Sequences.StyleEnd, 4);
      } else {
        this.state = 6;
        this.stateInTagName(c);
      }
    }
    stateBeforeSpecialT(c) {
      if (c === Sequences.TitleEnd[3]) {
        this.startSpecial(Sequences.TitleEnd, 4);
      } else if (c === Sequences.TextareaEnd[3]) {
        this.startSpecial(Sequences.TextareaEnd, 4);
      } else {
        this.state = 6;
        this.stateInTagName(c);
      }
    }
    startEntity() {
      {
        this.baseState = this.state;
        this.state = 33;
        this.entityStart = this.index;
        this.entityDecoder.startEntity(
          this.baseState === 1 || this.baseState === 32 ? decode_js.DecodingMode.Legacy : decode_js.DecodingMode.Attribute
        );
      }
    }
    stateInEntity() {
      {
        const length = this.entityDecoder.write(this.buffer, this.index);
        if (length >= 0) {
          this.state = this.baseState;
          if (length === 0) {
            this.index = this.entityStart;
          }
        } else {
          this.index = this.buffer.length - 1;
        }
      }
    }
    /**
     * Iterates through the buffer, calling the function corresponding to the current state.
     *
     * States that are more likely to be hit are higher up, as a performance improvement.
     */
    parse(input) {
      this.buffer = input;
      while (this.index < this.buffer.length) {
        const c = this.buffer.charCodeAt(this.index);
        if (c === 10) {
          this.newlines.push(this.index);
        }
        switch (this.state) {
          case 1: {
            this.stateText(c);
            break;
          }
          case 2: {
            this.stateInterpolationOpen(c);
            break;
          }
          case 3: {
            this.stateInterpolation(c);
            break;
          }
          case 4: {
            this.stateInterpolationClose(c);
            break;
          }
          case 31: {
            this.stateSpecialStartSequence(c);
            break;
          }
          case 32: {
            this.stateInRCDATA(c);
            break;
          }
          case 26: {
            this.stateCDATASequence(c);
            break;
          }
          case 19: {
            this.stateInAttrValueDoubleQuotes(c);
            break;
          }
          case 12: {
            this.stateInAttrName(c);
            break;
          }
          case 13: {
            this.stateInDirName(c);
            break;
          }
          case 14: {
            this.stateInDirArg(c);
            break;
          }
          case 15: {
            this.stateInDynamicDirArg(c);
            break;
          }
          case 16: {
            this.stateInDirModifier(c);
            break;
          }
          case 28: {
            this.stateInCommentLike(c);
            break;
          }
          case 27: {
            this.stateInSpecialComment(c);
            break;
          }
          case 11: {
            this.stateBeforeAttrName(c);
            break;
          }
          case 6: {
            this.stateInTagName(c);
            break;
          }
          case 34: {
            this.stateInSFCRootTagName(c);
            break;
          }
          case 9: {
            this.stateInClosingTagName(c);
            break;
          }
          case 5: {
            this.stateBeforeTagName(c);
            break;
          }
          case 17: {
            this.stateAfterAttrName(c);
            break;
          }
          case 20: {
            this.stateInAttrValueSingleQuotes(c);
            break;
          }
          case 18: {
            this.stateBeforeAttrValue(c);
            break;
          }
          case 8: {
            this.stateBeforeClosingTagName(c);
            break;
          }
          case 10: {
            this.stateAfterClosingTagName(c);
            break;
          }
          case 29: {
            this.stateBeforeSpecialS(c);
            break;
          }
          case 30: {
            this.stateBeforeSpecialT(c);
            break;
          }
          case 21: {
            this.stateInAttrValueNoQuotes(c);
            break;
          }
          case 7: {
            this.stateInSelfClosingTag(c);
            break;
          }
          case 23: {
            this.stateInDeclaration(c);
            break;
          }
          case 22: {
            this.stateBeforeDeclaration(c);
            break;
          }
          case 25: {
            this.stateBeforeComment(c);
            break;
          }
          case 24: {
            this.stateInProcessingInstruction(c);
            break;
          }
          case 33: {
            this.stateInEntity();
            break;
          }
        }
        this.index++;
      }
      this.cleanup();
      this.finish();
    }
    /**
     * Remove data that has already been consumed from the buffer.
     */
    cleanup() {
      if (this.sectionStart !== this.index) {
        if (this.state === 1 || this.state === 32 && this.sequenceIndex === 0) {
          this.cbs.ontext(this.sectionStart, this.index);
          this.sectionStart = this.index;
        } else if (this.state === 19 || this.state === 20 || this.state === 21) {
          this.cbs.onattribdata(this.sectionStart, this.index);
          this.sectionStart = this.index;
        }
      }
    }
    finish() {
      if (this.state === 33) {
        this.entityDecoder.end();
        this.state = this.baseState;
      }
      this.handleTrailingData();
      this.cbs.onend();
    }
    /** Handle any trailing data. */
    handleTrailingData() {
      const endIndex = this.buffer.length;
      if (this.sectionStart >= endIndex) {
        return;
      }
      if (this.state === 28) {
        if (this.currentSequence === Sequences.CdataEnd) {
          this.cbs.oncdata(this.sectionStart, endIndex);
        } else {
          this.cbs.oncomment(this.sectionStart, endIndex);
        }
      } else if (this.state === 6 || this.state === 11 || this.state === 18 || this.state === 17 || this.state === 12 || this.state === 13 || this.state === 14 || this.state === 15 || this.state === 16 || this.state === 20 || this.state === 19 || this.state === 21 || this.state === 9) ;
      else {
        this.cbs.ontext(this.sectionStart, endIndex);
      }
    }
    emitCodePoint(cp, consumed) {
      {
        if (this.baseState !== 1 && this.baseState !== 32) {
          if (this.sectionStart < this.entityStart) {
            this.cbs.onattribdata(this.sectionStart, this.entityStart);
          }
          this.sectionStart = this.entityStart + consumed;
          this.index = this.sectionStart - 1;
          this.cbs.onattribentity(
            decode_js.fromCodePoint(cp),
            this.entityStart,
            this.sectionStart
          );
        } else {
          if (this.sectionStart < this.entityStart) {
            this.cbs.ontext(this.sectionStart, this.entityStart);
          }
          this.sectionStart = this.entityStart + consumed;
          this.index = this.sectionStart - 1;
          this.cbs.ontextentity(
            decode_js.fromCodePoint(cp),
            this.entityStart,
            this.sectionStart
          );
        }
      }
    }
  }
  const CompilerDeprecationTypes = {
    "COMPILER_IS_ON_ELEMENT": "COMPILER_IS_ON_ELEMENT",
    "COMPILER_V_BIND_SYNC": "COMPILER_V_BIND_SYNC",
    "COMPILER_V_BIND_OBJECT_ORDER": "COMPILER_V_BIND_OBJECT_ORDER",
    "COMPILER_V_ON_NATIVE": "COMPILER_V_ON_NATIVE",
    "COMPILER_V_IF_V_FOR_PRECEDENCE": "COMPILER_V_IF_V_FOR_PRECEDENCE",
    "COMPILER_NATIVE_TEMPLATE": "COMPILER_NATIVE_TEMPLATE",
    "COMPILER_INLINE_TEMPLATE": "COMPILER_INLINE_TEMPLATE",
    "COMPILER_FILTERS": "COMPILER_FILTERS"
  };
  const deprecationData = {
    ["COMPILER_IS_ON_ELEMENT"]: {
      message: `Platform-native elements with "is" prop will no longer be treated as components in Vue 3 unless the "is" value is explicitly prefixed with "vue:".`,
      link: `https://v3-migration.vuejs.org/breaking-changes/custom-elements-interop.html`
    },
    ["COMPILER_V_BIND_SYNC"]: {
      message: (key) => `.sync modifier for v-bind has been removed. Use v-model with argument instead. \`v-bind:${key}.sync\` should be changed to \`v-model:${key}\`.`,
      link: `https://v3-migration.vuejs.org/breaking-changes/v-model.html`
    },
    ["COMPILER_V_BIND_OBJECT_ORDER"]: {
      message: `v-bind="obj" usage is now order sensitive and behaves like JavaScript object spread: it will now overwrite an existing non-mergeable attribute that appears before v-bind in the case of conflict. To retain 2.x behavior, move v-bind to make it the first attribute. You can also suppress this warning if the usage is intended.`,
      link: `https://v3-migration.vuejs.org/breaking-changes/v-bind.html`
    },
    ["COMPILER_V_ON_NATIVE"]: {
      message: `.native modifier for v-on has been removed as is no longer necessary.`,
      link: `https://v3-migration.vuejs.org/breaking-changes/v-on-native-modifier-removed.html`
    },
    ["COMPILER_V_IF_V_FOR_PRECEDENCE"]: {
      message: `v-if / v-for precedence when used on the same element has changed in Vue 3: v-if now takes higher precedence and will no longer have access to v-for scope variables. It is best to avoid the ambiguity with <template> tags or use a computed property that filters v-for data source.`,
      link: `https://v3-migration.vuejs.org/breaking-changes/v-if-v-for.html`
    },
    ["COMPILER_NATIVE_TEMPLATE"]: {
      message: `<template> with no special directives will render as a native template element instead of its inner content in Vue 3.`
    },
    ["COMPILER_INLINE_TEMPLATE"]: {
      message: `"inline-template" has been removed in Vue 3.`,
      link: `https://v3-migration.vuejs.org/breaking-changes/inline-template-attribute.html`
    },
    ["COMPILER_FILTERS"]: {
      message: `filters have been removed in Vue 3. The "|" symbol will be treated as native JavaScript bitwise OR operator. Use method calls or computed properties instead.`,
      link: `https://v3-migration.vuejs.org/breaking-changes/filters.html`
    }
  };
  function getCompatValue(key, { compatConfig }) {
    const value = compatConfig && compatConfig[key];
    if (key === "MODE") {
      return value || 3;
    } else {
      return value;
    }
  }
  function isCompatEnabled(key, context) {
    const mode = getCompatValue("MODE", context);
    const value = getCompatValue(key, context);
    return mode === 3 ? value === true : value !== false;
  }
  function checkCompatEnabled(key, context, loc, ...args) {
    const enabled = isCompatEnabled(key, context);
    return enabled;
  }
  function warnDeprecation(key, context, loc, ...args) {
    const val = getCompatValue(key, context);
    if (val === "suppress-warning") {
      return;
    }
    const { message, link } = deprecationData[key];
    const msg = `(deprecation ${key}) ${typeof message === "function" ? message(...args) : message}${link ? `
  Details: ${link}` : ``}`;
    const err = new SyntaxError(msg);
    err.code = key;
    if (loc) err.loc = loc;
    context.onWarn(err);
  }
  function defaultOnError(error) {
    throw error;
  }
  function defaultOnWarn(msg) {
  }
  function createCompilerError(code, loc, messages, additionalMessage) {
    const msg = (messages || errorMessages)[code] + (additionalMessage || ``);
    const error = new SyntaxError(String(msg));
    error.code = code;
    error.loc = loc;
    return error;
  }
  const ErrorCodes = {
    "ABRUPT_CLOSING_OF_EMPTY_COMMENT": 0,
    "0": "ABRUPT_CLOSING_OF_EMPTY_COMMENT",
    "CDATA_IN_HTML_CONTENT": 1,
    "1": "CDATA_IN_HTML_CONTENT",
    "DUPLICATE_ATTRIBUTE": 2,
    "2": "DUPLICATE_ATTRIBUTE",
    "END_TAG_WITH_ATTRIBUTES": 3,
    "3": "END_TAG_WITH_ATTRIBUTES",
    "END_TAG_WITH_TRAILING_SOLIDUS": 4,
    "4": "END_TAG_WITH_TRAILING_SOLIDUS",
    "EOF_BEFORE_TAG_NAME": 5,
    "5": "EOF_BEFORE_TAG_NAME",
    "EOF_IN_CDATA": 6,
    "6": "EOF_IN_CDATA",
    "EOF_IN_COMMENT": 7,
    "7": "EOF_IN_COMMENT",
    "EOF_IN_SCRIPT_HTML_COMMENT_LIKE_TEXT": 8,
    "8": "EOF_IN_SCRIPT_HTML_COMMENT_LIKE_TEXT",
    "EOF_IN_TAG": 9,
    "9": "EOF_IN_TAG",
    "INCORRECTLY_CLOSED_COMMENT": 10,
    "10": "INCORRECTLY_CLOSED_COMMENT",
    "INCORRECTLY_OPENED_COMMENT": 11,
    "11": "INCORRECTLY_OPENED_COMMENT",
    "INVALID_FIRST_CHARACTER_OF_TAG_NAME": 12,
    "12": "INVALID_FIRST_CHARACTER_OF_TAG_NAME",
    "MISSING_ATTRIBUTE_VALUE": 13,
    "13": "MISSING_ATTRIBUTE_VALUE",
    "MISSING_END_TAG_NAME": 14,
    "14": "MISSING_END_TAG_NAME",
    "MISSING_WHITESPACE_BETWEEN_ATTRIBUTES": 15,
    "15": "MISSING_WHITESPACE_BETWEEN_ATTRIBUTES",
    "NESTED_COMMENT": 16,
    "16": "NESTED_COMMENT",
    "UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME": 17,
    "17": "UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME",
    "UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE": 18,
    "18": "UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE",
    "UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME": 19,
    "19": "UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME",
    "UNEXPECTED_NULL_CHARACTER": 20,
    "20": "UNEXPECTED_NULL_CHARACTER",
    "UNEXPECTED_QUESTION_MARK_INSTEAD_OF_TAG_NAME": 21,
    "21": "UNEXPECTED_QUESTION_MARK_INSTEAD_OF_TAG_NAME",
    "UNEXPECTED_SOLIDUS_IN_TAG": 22,
    "22": "UNEXPECTED_SOLIDUS_IN_TAG",
    "X_INVALID_END_TAG": 23,
    "23": "X_INVALID_END_TAG",
    "X_MISSING_END_TAG": 24,
    "24": "X_MISSING_END_TAG",
    "X_MISSING_INTERPOLATION_END": 25,
    "25": "X_MISSING_INTERPOLATION_END",
    "X_MISSING_DIRECTIVE_NAME": 26,
    "26": "X_MISSING_DIRECTIVE_NAME",
    "X_MISSING_DYNAMIC_DIRECTIVE_ARGUMENT_END": 27,
    "27": "X_MISSING_DYNAMIC_DIRECTIVE_ARGUMENT_END",
    "X_V_IF_NO_EXPRESSION": 28,
    "28": "X_V_IF_NO_EXPRESSION",
    "X_V_IF_SAME_KEY": 29,
    "29": "X_V_IF_SAME_KEY",
    "X_V_ELSE_NO_ADJACENT_IF": 30,
    "30": "X_V_ELSE_NO_ADJACENT_IF",
    "X_V_FOR_NO_EXPRESSION": 31,
    "31": "X_V_FOR_NO_EXPRESSION",
    "X_V_FOR_MALFORMED_EXPRESSION": 32,
    "32": "X_V_FOR_MALFORMED_EXPRESSION",
    "X_V_FOR_TEMPLATE_KEY_PLACEMENT": 33,
    "33": "X_V_FOR_TEMPLATE_KEY_PLACEMENT",
    "X_V_BIND_NO_EXPRESSION": 34,
    "34": "X_V_BIND_NO_EXPRESSION",
    "X_V_ON_NO_EXPRESSION": 35,
    "35": "X_V_ON_NO_EXPRESSION",
    "X_V_SLOT_UNEXPECTED_DIRECTIVE_ON_SLOT_OUTLET": 36,
    "36": "X_V_SLOT_UNEXPECTED_DIRECTIVE_ON_SLOT_OUTLET",
    "X_V_SLOT_MIXED_SLOT_USAGE": 37,
    "37": "X_V_SLOT_MIXED_SLOT_USAGE",
    "X_V_SLOT_DUPLICATE_SLOT_NAMES": 38,
    "38": "X_V_SLOT_DUPLICATE_SLOT_NAMES",
    "X_V_SLOT_EXTRANEOUS_DEFAULT_SLOT_CHILDREN": 39,
    "39": "X_V_SLOT_EXTRANEOUS_DEFAULT_SLOT_CHILDREN",
    "X_V_SLOT_MISPLACED": 40,
    "40": "X_V_SLOT_MISPLACED",
    "X_V_MODEL_NO_EXPRESSION": 41,
    "41": "X_V_MODEL_NO_EXPRESSION",
    "X_V_MODEL_MALFORMED_EXPRESSION": 42,
    "42": "X_V_MODEL_MALFORMED_EXPRESSION",
    "X_V_MODEL_ON_SCOPE_VARIABLE": 43,
    "43": "X_V_MODEL_ON_SCOPE_VARIABLE",
    "X_V_MODEL_ON_PROPS": 44,
    "44": "X_V_MODEL_ON_PROPS",
    "X_INVALID_EXPRESSION": 45,
    "45": "X_INVALID_EXPRESSION",
    "X_KEEP_ALIVE_INVALID_CHILDREN": 46,
    "46": "X_KEEP_ALIVE_INVALID_CHILDREN",
    "X_PREFIX_ID_NOT_SUPPORTED": 47,
    "47": "X_PREFIX_ID_NOT_SUPPORTED",
    "X_MODULE_MODE_NOT_SUPPORTED": 48,
    "48": "X_MODULE_MODE_NOT_SUPPORTED",
    "X_CACHE_HANDLER_NOT_SUPPORTED": 49,
    "49": "X_CACHE_HANDLER_NOT_SUPPORTED",
    "X_SCOPE_ID_NOT_SUPPORTED": 50,
    "50": "X_SCOPE_ID_NOT_SUPPORTED",
    "X_VNODE_HOOKS": 51,
    "51": "X_VNODE_HOOKS",
    "X_V_BIND_INVALID_SAME_NAME_ARGUMENT": 52,
    "52": "X_V_BIND_INVALID_SAME_NAME_ARGUMENT",
    "__EXTEND_POINT__": 53,
    "53": "__EXTEND_POINT__"
  };
  const errorMessages = {
    // parse errors
    [0]: "Illegal comment.",
    [1]: "CDATA section is allowed only in XML context.",
    [2]: "Duplicate attribute.",
    [3]: "End tag cannot have attributes.",
    [4]: "Illegal '/' in tags.",
    [5]: "Unexpected EOF in tag.",
    [6]: "Unexpected EOF in CDATA section.",
    [7]: "Unexpected EOF in comment.",
    [8]: "Unexpected EOF in script.",
    [9]: "Unexpected EOF in tag.",
    [10]: "Incorrectly closed comment.",
    [11]: "Incorrectly opened comment.",
    [12]: "Illegal tag name. Use '&lt;' to print '<'.",
    [13]: "Attribute value was expected.",
    [14]: "End tag name was expected.",
    [15]: "Whitespace was expected.",
    [16]: "Unexpected '<!--' in comment.",
    [17]: `Attribute name cannot contain U+0022 ("), U+0027 ('), and U+003C (<).`,
    [18]: "Unquoted attribute value cannot contain U+0022 (\"), U+0027 ('), U+003C (<), U+003D (=), and U+0060 (`).",
    [19]: "Attribute name cannot start with '='.",
    [21]: "'<?' is allowed only in XML context.",
    [20]: `Unexpected null character.`,
    [22]: "Illegal '/' in tags.",
    // Vue-specific parse errors
    [23]: "Invalid end tag.",
    [24]: "Element is missing end tag.",
    [25]: "Interpolation end sign was not found.",
    [27]: "End bracket for dynamic directive argument was not found. Note that dynamic directive argument cannot contain spaces.",
    [26]: "Legal directive name was expected.",
    // transform errors
    [28]: `v-if/v-else-if is missing expression.`,
    [29]: `v-if/else branches must use unique keys.`,
    [30]: `v-else/v-else-if has no adjacent v-if or v-else-if.`,
    [31]: `v-for is missing expression.`,
    [32]: `v-for has invalid expression.`,
    [33]: `<template v-for> key should be placed on the <template> tag.`,
    [34]: `v-bind is missing expression.`,
    [52]: `v-bind with same-name shorthand only allows static argument.`,
    [35]: `v-on is missing expression.`,
    [36]: `Unexpected custom directive on <slot> outlet.`,
    [37]: `Mixed v-slot usage on both the component and nested <template>. When there are multiple named slots, all slots should use <template> syntax to avoid scope ambiguity.`,
    [38]: `Duplicate slot names found. `,
    [39]: `Extraneous children found when component already has explicitly named default slot. These children will be ignored.`,
    [40]: `v-slot can only be used on components or <template> tags.`,
    [41]: `v-model is missing expression.`,
    [42]: `v-model value must be a valid JavaScript member expression.`,
    [43]: `v-model cannot be used on v-for or v-slot scope variables because they are not writable.`,
    [44]: `v-model cannot be used on a prop, because local prop bindings are not writable.
Use a v-bind binding combined with a v-on listener that emits update:x event instead.`,
    [45]: `Error parsing JavaScript expression: `,
    [46]: `<KeepAlive> expects exactly one child component.`,
    [51]: `@vnode-* hooks in templates are no longer supported. Use the vue: prefix instead. For example, @vnode-mounted should be changed to @vue:mounted. @vnode-* hooks support has been removed in 3.4.`,
    // generic errors
    [47]: `"prefixIdentifiers" option is not supported in this build of compiler.`,
    [48]: `ES module mode is not supported in this build of compiler.`,
    [49]: `"cacheHandlers" option is only supported when the "prefixIdentifiers" option is enabled.`,
    [50]: `"scopeId" option is only supported in module mode.`,
    // just to fulfill types
    [53]: ``
  };
  function walkIdentifiers(root, onIdentifier, includeAll = false, parentStack = [], knownIds = /* @__PURE__ */ Object.create(null)) {
    const rootExp = root.type === "Program" ? root.body[0].type === "ExpressionStatement" && root.body[0].expression : root;
    estreeWalker.walk(root, {
      enter(node, parent) {
        parent && parentStack.push(parent);
        if (parent && parent.type.startsWith("TS") && !TS_NODE_TYPES.includes(parent.type)) {
          return this.skip();
        }
        if (node.type === "Identifier") {
          const isLocal = !!knownIds[node.name];
          const isRefed = isReferencedIdentifier(node, parent, parentStack);
          if (includeAll || isRefed && !isLocal) {
            onIdentifier(node, parent, parentStack, isRefed, isLocal);
          }
        } else if (node.type === "ObjectProperty" && // eslint-disable-next-line no-restricted-syntax
        (parent == null ? void 0 : parent.type) === "ObjectPattern") {
          node.inPattern = true;
        } else if (isFunctionType(node)) {
          if (node.scopeIds) {
            node.scopeIds.forEach((id) => markKnownIds(id, knownIds));
          } else {
            walkFunctionParams(
              node,
              (id) => markScopeIdentifier(node, id, knownIds)
            );
          }
        } else if (node.type === "BlockStatement") {
          if (node.scopeIds) {
            node.scopeIds.forEach((id) => markKnownIds(id, knownIds));
          } else {
            walkBlockDeclarations(
              node,
              (id) => markScopeIdentifier(node, id, knownIds)
            );
          }
        } else if (node.type === "CatchClause" && node.param) {
          for (const id of extractIdentifiers(node.param)) {
            markScopeIdentifier(node, id, knownIds);
          }
        } else if (isForStatement(node)) {
          walkForStatement(
            node,
            false,
            (id) => markScopeIdentifier(node, id, knownIds)
          );
        }
      },
      leave(node, parent) {
        parent && parentStack.pop();
        if (node !== rootExp && node.scopeIds) {
          for (const id of node.scopeIds) {
            knownIds[id]--;
            if (knownIds[id] === 0) {
              delete knownIds[id];
            }
          }
        }
      }
    });
  }
  function isReferencedIdentifier(id, parent, parentStack) {
    if (!parent) {
      return true;
    }
    if (id.name === "arguments") {
      return false;
    }
    if (isReferenced(id, parent)) {
      return true;
    }
    switch (parent.type) {
      case "AssignmentExpression":
      case "AssignmentPattern":
        return true;
      case "ObjectPattern":
      case "ArrayPattern":
        return isInDestructureAssignment(parent, parentStack);
    }
    return false;
  }
  function isInDestructureAssignment(parent, parentStack) {
    if (parent && (parent.type === "ObjectProperty" || parent.type === "ArrayPattern")) {
      let i = parentStack.length;
      while (i--) {
        const p = parentStack[i];
        if (p.type === "AssignmentExpression") {
          return true;
        } else if (p.type !== "ObjectProperty" && !p.type.endsWith("Pattern")) {
          break;
        }
      }
    }
    return false;
  }
  function isInNewExpression(parentStack) {
    let i = parentStack.length;
    while (i--) {
      const p = parentStack[i];
      if (p.type === "NewExpression") {
        return true;
      } else if (p.type !== "MemberExpression") {
        break;
      }
    }
    return false;
  }
  function walkFunctionParams(node, onIdent) {
    for (const p of node.params) {
      for (const id of extractIdentifiers(p)) {
        onIdent(id);
      }
    }
  }
  function walkBlockDeclarations(block, onIdent) {
    for (const stmt of block.body) {
      if (stmt.type === "VariableDeclaration") {
        if (stmt.declare) continue;
        for (const decl of stmt.declarations) {
          for (const id of extractIdentifiers(decl.id)) {
            onIdent(id);
          }
        }
      } else if (stmt.type === "FunctionDeclaration" || stmt.type === "ClassDeclaration") {
        if (stmt.declare || !stmt.id) continue;
        onIdent(stmt.id);
      } else if (isForStatement(stmt)) {
        walkForStatement(stmt, true, onIdent);
      }
    }
  }
  function isForStatement(stmt) {
    return stmt.type === "ForOfStatement" || stmt.type === "ForInStatement" || stmt.type === "ForStatement";
  }
  function walkForStatement(stmt, isVar, onIdent) {
    const variable = stmt.type === "ForStatement" ? stmt.init : stmt.left;
    if (variable && variable.type === "VariableDeclaration" && (variable.kind === "var" ? isVar : !isVar)) {
      for (const decl of variable.declarations) {
        for (const id of extractIdentifiers(decl.id)) {
          onIdent(id);
        }
      }
    }
  }
  function extractIdentifiers(param, nodes = []) {
    switch (param.type) {
      case "Identifier":
        nodes.push(param);
        break;
      case "MemberExpression":
        let object = param;
        while (object.type === "MemberExpression") {
          object = object.object;
        }
        nodes.push(object);
        break;
      case "ObjectPattern":
        for (const prop of param.properties) {
          if (prop.type === "RestElement") {
            extractIdentifiers(prop.argument, nodes);
          } else {
            extractIdentifiers(prop.value, nodes);
          }
        }
        break;
      case "ArrayPattern":
        param.elements.forEach((element) => {
          if (element) extractIdentifiers(element, nodes);
        });
        break;
      case "RestElement":
        extractIdentifiers(param.argument, nodes);
        break;
      case "AssignmentPattern":
        extractIdentifiers(param.left, nodes);
        break;
    }
    return nodes;
  }
  function markKnownIds(name, knownIds) {
    if (name in knownIds) {
      knownIds[name]++;
    } else {
      knownIds[name] = 1;
    }
  }
  function markScopeIdentifier(node, child, knownIds) {
    const { name } = child;
    if (node.scopeIds && node.scopeIds.has(name)) {
      return;
    }
    markKnownIds(name, knownIds);
    (node.scopeIds || (node.scopeIds = /* @__PURE__ */ new Set())).add(name);
  }
  const isFunctionType = (node) => {
    return /Function(?:Expression|Declaration)$|Method$/.test(node.type);
  };
  const isStaticProperty = (node) => node && (node.type === "ObjectProperty" || node.type === "ObjectMethod") && !node.computed;
  const isStaticPropertyKey = (node, parent) => isStaticProperty(parent) && parent.key === node;
  function isReferenced(node, parent, grandparent) {
    switch (parent.type) {
      // yes: PARENT[NODE]
      // yes: NODE.child
      // no: parent.NODE
      case "MemberExpression":
      case "OptionalMemberExpression":
        if (parent.property === node) {
          return !!parent.computed;
        }
        return parent.object === node;
      case "JSXMemberExpression":
        return parent.object === node;
      // no: let NODE = init;
      // yes: let id = NODE;
      case "VariableDeclarator":
        return parent.init === node;
      // yes: () => NODE
      // no: (NODE) => {}
      case "ArrowFunctionExpression":
        return parent.body === node;
      // no: class { #NODE; }
      // no: class { get #NODE() {} }
      // no: class { #NODE() {} }
      // no: class { fn() { return this.#NODE; } }
      case "PrivateName":
        return false;
      // no: class { NODE() {} }
      // yes: class { [NODE]() {} }
      // no: class { foo(NODE) {} }
      case "ClassMethod":
      case "ClassPrivateMethod":
      case "ObjectMethod":
        if (parent.key === node) {
          return !!parent.computed;
        }
        return false;
      // yes: { [NODE]: "" }
      // no: { NODE: "" }
      // depends: { NODE }
      // depends: { key: NODE }
      case "ObjectProperty":
        if (parent.key === node) {
          return !!parent.computed;
        }
        return true;
      // no: class { NODE = value; }
      // yes: class { [NODE] = value; }
      // yes: class { key = NODE; }
      case "ClassProperty":
        if (parent.key === node) {
          return !!parent.computed;
        }
        return true;
      case "ClassPrivateProperty":
        return parent.key !== node;
      // no: class NODE {}
      // yes: class Foo extends NODE {}
      case "ClassDeclaration":
      case "ClassExpression":
        return parent.superClass === node;
      // yes: left = NODE;
      // no: NODE = right;
      case "AssignmentExpression":
        return parent.right === node;
      // no: [NODE = foo] = [];
      // yes: [foo = NODE] = [];
      case "AssignmentPattern":
        return parent.right === node;
      // no: NODE: for (;;) {}
      case "LabeledStatement":
        return false;
      // no: try {} catch (NODE) {}
      case "CatchClause":
        return false;
      // no: function foo(...NODE) {}
      case "RestElement":
        return false;
      case "BreakStatement":
      case "ContinueStatement":
        return false;
      // no: function NODE() {}
      // no: function foo(NODE) {}
      case "FunctionDeclaration":
      case "FunctionExpression":
        return false;
      // no: export NODE from "foo";
      // no: export * as NODE from "foo";
      case "ExportNamespaceSpecifier":
      case "ExportDefaultSpecifier":
        return false;
      // no: export { foo as NODE };
      // yes: export { NODE as foo };
      // no: export { NODE as foo } from "foo";
      case "ExportSpecifier":
        return parent.local === node;
      // no: import NODE from "foo";
      // no: import * as NODE from "foo";
      // no: import { NODE as foo } from "foo";
      // no: import { foo as NODE } from "foo";
      // no: import NODE from "bar";
      case "ImportDefaultSpecifier":
      case "ImportNamespaceSpecifier":
      case "ImportSpecifier":
        return false;
      // no: import "foo" assert { NODE: "json" }
      case "ImportAttribute":
        return false;
      // no: <div NODE="foo" />
      case "JSXAttribute":
        return false;
      // no: [NODE] = [];
      // no: ({ NODE }) = [];
      case "ObjectPattern":
      case "ArrayPattern":
        return false;
      // no: new.NODE
      // no: NODE.target
      case "MetaProperty":
        return false;
      // yes: type X = { someProperty: NODE }
      // no: type X = { NODE: OtherType }
      case "ObjectTypeProperty":
        return parent.key !== node;
      // yes: enum X { Foo = NODE }
      // no: enum X { NODE }
      case "TSEnumMember":
        return parent.id !== node;
      // yes: { [NODE]: value }
      // no: { NODE: value }
      case "TSPropertySignature":
        if (parent.key === node) {
          return !!parent.computed;
        }
        return true;
    }
    return true;
  }
  const TS_NODE_TYPES = [
    "TSAsExpression",
    // foo as number
    "TSTypeAssertion",
    // (<number>foo)
    "TSNonNullExpression",
    // foo!
    "TSInstantiationExpression",
    // foo<string>
    "TSSatisfiesExpression"
    // foo satisfies T
  ];
  function unwrapTSNode(node) {
    if (TS_NODE_TYPES.includes(node.type)) {
      return unwrapTSNode(node.expression);
    } else {
      return node;
    }
  }
  const isStaticExp = (p) => p.type === 4 && p.isStatic;
  function isCoreComponent(tag) {
    switch (tag) {
      case "Teleport":
      case "teleport":
        return TELEPORT;
      case "Suspense":
      case "suspense":
        return SUSPENSE;
      case "KeepAlive":
      case "keep-alive":
        return KEEP_ALIVE;
      case "BaseTransition":
      case "base-transition":
        return BASE_TRANSITION;
    }
  }
  const nonIdentifierRE = /^\d|[^\$\w\xA0-\uFFFF]/;
  const isSimpleIdentifier = (name) => !nonIdentifierRE.test(name);
  const validFirstIdentCharRE = /[A-Za-z_$\xA0-\uFFFF]/;
  const validIdentCharRE = /[\.\?\w$\xA0-\uFFFF]/;
  const whitespaceRE = /\s+[.[]\s*|\s*[.[]\s+/g;
  const getExpSource = (exp) => exp.type === 4 ? exp.content : exp.loc.source;
  const isMemberExpressionBrowser = (exp) => {
    const path = getExpSource(exp).trim().replace(whitespaceRE, (s) => s.trim());
    let state = 0;
    let stateStack = [];
    let currentOpenBracketCount = 0;
    let currentOpenParensCount = 0;
    let currentStringType = null;
    for (let i = 0; i < path.length; i++) {
      const char = path.charAt(i);
      switch (state) {
        case 0:
          if (char === "[") {
            stateStack.push(state);
            state = 1;
            currentOpenBracketCount++;
          } else if (char === "(") {
            stateStack.push(state);
            state = 2;
            currentOpenParensCount++;
          } else if (!(i === 0 ? validFirstIdentCharRE : validIdentCharRE).test(char)) {
            return false;
          }
          break;
        case 1:
          if (char === `'` || char === `"` || char === "`") {
            stateStack.push(state);
            state = 3;
            currentStringType = char;
          } else if (char === `[`) {
            currentOpenBracketCount++;
          } else if (char === `]`) {
            if (!--currentOpenBracketCount) {
              state = stateStack.pop();
            }
          }
          break;
        case 2:
          if (char === `'` || char === `"` || char === "`") {
            stateStack.push(state);
            state = 3;
            currentStringType = char;
          } else if (char === `(`) {
            currentOpenParensCount++;
          } else if (char === `)`) {
            if (i === path.length - 1) {
              return false;
            }
            if (!--currentOpenParensCount) {
              state = stateStack.pop();
            }
          }
          break;
        case 3:
          if (char === currentStringType) {
            state = stateStack.pop();
            currentStringType = null;
          }
          break;
      }
    }
    return !currentOpenBracketCount && !currentOpenParensCount;
  };
  const isMemberExpressionNode = (exp, context) => {
    try {
      let ret = exp.ast || parser.parseExpression(getExpSource(exp), {
        plugins: context.expressionPlugins ? [...context.expressionPlugins, "typescript"] : ["typescript"]
      });
      ret = unwrapTSNode(ret);
      return ret.type === "MemberExpression" || ret.type === "OptionalMemberExpression" || ret.type === "Identifier" && ret.name !== "undefined";
    } catch (e) {
      return false;
    }
  };
  const isMemberExpression = isMemberExpressionNode;
  const fnExpRE = /^\s*(async\s*)?(\([^)]*?\)|[\w$_]+)\s*(:[^=]+)?=>|^\s*(async\s+)?function(?:\s+[\w$]+)?\s*\(/;
  const isFnExpressionBrowser = (exp) => fnExpRE.test(getExpSource(exp));
  const isFnExpressionNode = (exp, context) => {
    try {
      let ret = exp.ast || parser.parseExpression(getExpSource(exp), {
        plugins: context.expressionPlugins ? [...context.expressionPlugins, "typescript"] : ["typescript"]
      });
      if (ret.type === "Program") {
        ret = ret.body[0];
        if (ret.type === "ExpressionStatement") {
          ret = ret.expression;
        }
      }
      ret = unwrapTSNode(ret);
      return ret.type === "FunctionExpression" || ret.type === "ArrowFunctionExpression";
    } catch (e) {
      return false;
    }
  };
  const isFnExpression = isFnExpressionNode;
  function advancePositionWithClone(pos, source, numberOfCharacters = source.length) {
    return advancePositionWithMutation(
      {
        offset: pos.offset,
        line: pos.line,
        column: pos.column
      },
      source,
      numberOfCharacters
    );
  }
  function advancePositionWithMutation(pos, source, numberOfCharacters = source.length) {
    let linesCount = 0;
    let lastNewLinePos = -1;
    for (let i = 0; i < numberOfCharacters; i++) {
      if (source.charCodeAt(i) === 10) {
        linesCount++;
        lastNewLinePos = i;
      }
    }
    pos.offset += numberOfCharacters;
    pos.line += linesCount;
    pos.column = lastNewLinePos === -1 ? pos.column + numberOfCharacters : numberOfCharacters - lastNewLinePos;
    return pos;
  }
  function assert(condition, msg) {
    if (!condition) {
      throw new Error(msg || `unexpected compiler condition`);
    }
  }
  function findDir(node, name, allowEmpty = false) {
    for (let i = 0; i < node.props.length; i++) {
      const p = node.props[i];
      if (p.type === 7 && (allowEmpty || p.exp) && (shared.isString(name) ? p.name === name : name.test(p.name))) {
        return p;
      }
    }
  }
  function findProp(node, name, dynamicOnly = false, allowEmpty = false) {
    for (let i = 0; i < node.props.length; i++) {
      const p = node.props[i];
      if (p.type === 6) {
        if (dynamicOnly) continue;
        if (p.name === name && (p.value || allowEmpty)) {
          return p;
        }
      } else if (p.name === "bind" && (p.exp || allowEmpty) && isStaticArgOf(p.arg, name)) {
        return p;
      }
    }
  }
  function isStaticArgOf(arg, name) {
    return !!(arg && isStaticExp(arg) && arg.content === name);
  }
  function hasDynamicKeyVBind(node) {
    return node.props.some(
      (p) => p.type === 7 && p.name === "bind" && (!p.arg || // v-bind="obj"
      p.arg.type !== 4 || // v-bind:[_ctx.foo]
      !p.arg.isStatic)
      // v-bind:[foo]
    );
  }
  function isText$1(node) {
    return node.type === 5 || node.type === 2;
  }
  function isVSlot(p) {
    return p.type === 7 && p.name === "slot";
  }
  function isTemplateNode(node) {
    return node.type === 1 && node.tagType === 3;
  }
  function isSlotOutlet(node) {
    return node.type === 1 && node.tagType === 2;
  }
  const propsHelperSet = /* @__PURE__ */ new Set([NORMALIZE_PROPS, GUARD_REACTIVE_PROPS]);
  function getUnnormalizedProps(props, callPath = []) {
    if (props && !shared.isString(props) && props.type === 14) {
      const callee = props.callee;
      if (!shared.isString(callee) && propsHelperSet.has(callee)) {
        return getUnnormalizedProps(
          props.arguments[0],
          callPath.concat(props)
        );
      }
    }
    return [props, callPath];
  }
  function injectProp(node, prop, context) {
    let propsWithInjection;
    let props = node.type === 13 ? node.props : node.arguments[2];
    let callPath = [];
    let parentCall;
    if (props && !shared.isString(props) && props.type === 14) {
      const ret = getUnnormalizedProps(props);
      props = ret[0];
      callPath = ret[1];
      parentCall = callPath[callPath.length - 1];
    }
    if (props == null || shared.isString(props)) {
      propsWithInjection = createObjectExpression([prop]);
    } else if (props.type === 14) {
      const first = props.arguments[0];
      if (!shared.isString(first) && first.type === 15) {
        if (!hasProp(prop, first)) {
          first.properties.unshift(prop);
        }
      } else {
        if (props.callee === TO_HANDLERS) {
          propsWithInjection = createCallExpression(context.helper(MERGE_PROPS), [
            createObjectExpression([prop]),
            props
          ]);
        } else {
          props.arguments.unshift(createObjectExpression([prop]));
        }
      }
      !propsWithInjection && (propsWithInjection = props);
    } else if (props.type === 15) {
      if (!hasProp(prop, props)) {
        props.properties.unshift(prop);
      }
      propsWithInjection = props;
    } else {
      propsWithInjection = createCallExpression(context.helper(MERGE_PROPS), [
        createObjectExpression([prop]),
        props
      ]);
      if (parentCall && parentCall.callee === GUARD_REACTIVE_PROPS) {
        parentCall = callPath[callPath.length - 2];
      }
    }
    if (node.type === 13) {
      if (parentCall) {
        parentCall.arguments[0] = propsWithInjection;
      } else {
        node.props = propsWithInjection;
      }
    } else {
      if (parentCall) {
        parentCall.arguments[0] = propsWithInjection;
      } else {
        node.arguments[2] = propsWithInjection;
      }
    }
  }
  function hasProp(prop, props) {
    let result = false;
    if (prop.key.type === 4) {
      const propKeyName = prop.key.content;
      result = props.properties.some(
        (p) => p.key.type === 4 && p.key.content === propKeyName
      );
    }
    return result;
  }
  function toValidAssetId(name, type) {
    return `_${type}_${name.replace(/[^\w]/g, (searchValue, replaceValue) => {
      return searchValue === "-" ? "_" : name.charCodeAt(replaceValue).toString();
    })}`;
  }
  function hasScopeRef(node, ids) {
    if (!node || Object.keys(ids).length === 0) {
      return false;
    }
    switch (node.type) {
      case 1:
        for (let i = 0; i < node.props.length; i++) {
          const p = node.props[i];
          if (p.type === 7 && (hasScopeRef(p.arg, ids) || hasScopeRef(p.exp, ids))) {
            return true;
          }
        }
        return node.children.some((c) => hasScopeRef(c, ids));
      case 11:
        if (hasScopeRef(node.source, ids)) {
          return true;
        }
        return node.children.some((c) => hasScopeRef(c, ids));
      case 9:
        return node.branches.some((b) => hasScopeRef(b, ids));
      case 10:
        if (hasScopeRef(node.condition, ids)) {
          return true;
        }
        return node.children.some((c) => hasScopeRef(c, ids));
      case 4:
        return !node.isStatic && isSimpleIdentifier(node.content) && !!ids[node.content];
      case 8:
        return node.children.some((c) => shared.isObject(c) && hasScopeRef(c, ids));
      case 5:
      case 12:
        return hasScopeRef(node.content, ids);
      case 2:
      case 3:
      case 20:
        return false;
      default:
        return false;
    }
  }
  function getMemoedVNodeCall(node) {
    if (node.type === 14 && node.callee === WITH_MEMO) {
      return node.arguments[1].returns;
    } else {
      return node;
    }
  }
  const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+(\S[\s\S]*)/;
  const defaultParserOptions = {
    parseMode: "base",
    ns: 0,
    delimiters: [`{{`, `}}`],
    getNamespace: () => 0,
    isVoidTag: shared.NO,
    isPreTag: shared.NO,
    isIgnoreNewlineTag: shared.NO,
    isCustomElement: shared.NO,
    onError: defaultOnError,
    onWarn: defaultOnWarn,
    comments: false,
    prefixIdentifiers: false
  };
  let currentOptions = defaultParserOptions;
  let currentRoot = null;
  let currentInput = "";
  let currentOpenTag = null;
  let currentProp = null;
  let currentAttrValue = "";
  let currentAttrStartIndex = -1;
  let currentAttrEndIndex = -1;
  let inPre = 0;
  let inVPre = false;
  let currentVPreBoundary = null;
  const stack = [];
  const tokenizer = new Tokenizer(stack, {
    onerr: emitError,
    ontext(start, end) {
      onText(getSlice(start, end), start, end);
    },
    ontextentity(char, start, end) {
      onText(char, start, end);
    },
    oninterpolation(start, end) {
      if (inVPre) {
        return onText(getSlice(start, end), start, end);
      }
      let innerStart = start + tokenizer.delimiterOpen.length;
      let innerEnd = end - tokenizer.delimiterClose.length;
      while (isWhitespace(currentInput.charCodeAt(innerStart))) {
        innerStart++;
      }
      while (isWhitespace(currentInput.charCodeAt(innerEnd - 1))) {
        innerEnd--;
      }
      let exp = getSlice(innerStart, innerEnd);
      if (exp.includes("&")) {
        {
          exp = decode_js.decodeHTML(exp);
        }
      }
      addNode({
        type: 5,
        content: createExp(exp, false, getLoc(innerStart, innerEnd)),
        loc: getLoc(start, end)
      });
    },
    onopentagname(start, end) {
      const name = getSlice(start, end);
      currentOpenTag = {
        type: 1,
        tag: name,
        ns: currentOptions.getNamespace(name, stack[0], currentOptions.ns),
        tagType: 0,
        // will be refined on tag close
        props: [],
        children: [],
        loc: getLoc(start - 1, end),
        codegenNode: void 0
      };
    },
    onopentagend(end) {
      endOpenTag(end);
    },
    onclosetag(start, end) {
      const name = getSlice(start, end);
      if (!currentOptions.isVoidTag(name)) {
        let found = false;
        for (let i = 0; i < stack.length; i++) {
          const e = stack[i];
          if (e.tag.toLowerCase() === name.toLowerCase()) {
            found = true;
            if (i > 0) {
              emitError(24, stack[0].loc.start.offset);
            }
            for (let j = 0; j <= i; j++) {
              const el = stack.shift();
              onCloseTag(el, end, j < i);
            }
            break;
          }
        }
        if (!found) {
          emitError(23, backTrack(start, 60));
        }
      }
    },
    onselfclosingtag(end) {
      const name = currentOpenTag.tag;
      currentOpenTag.isSelfClosing = true;
      endOpenTag(end);
      if (stack[0] && stack[0].tag === name) {
        onCloseTag(stack.shift(), end);
      }
    },
    onattribname(start, end) {
      currentProp = {
        type: 6,
        name: getSlice(start, end),
        nameLoc: getLoc(start, end),
        value: void 0,
        loc: getLoc(start)
      };
    },
    ondirname(start, end) {
      const raw = getSlice(start, end);
      const name = raw === "." || raw === ":" ? "bind" : raw === "@" ? "on" : raw === "#" ? "slot" : raw.slice(2);
      if (!inVPre && name === "") {
        emitError(26, start);
      }
      if (inVPre || name === "") {
        currentProp = {
          type: 6,
          name: raw,
          nameLoc: getLoc(start, end),
          value: void 0,
          loc: getLoc(start)
        };
      } else {
        currentProp = {
          type: 7,
          name,
          rawName: raw,
          exp: void 0,
          arg: void 0,
          modifiers: raw === "." ? [createSimpleExpression("prop")] : [],
          loc: getLoc(start)
        };
        if (name === "pre") {
          inVPre = tokenizer.inVPre = true;
          currentVPreBoundary = currentOpenTag;
          const props = currentOpenTag.props;
          for (let i = 0; i < props.length; i++) {
            if (props[i].type === 7) {
              props[i] = dirToAttr(props[i]);
            }
          }
        }
      }
    },
    ondirarg(start, end) {
      if (start === end) return;
      const arg = getSlice(start, end);
      if (inVPre) {
        currentProp.name += arg;
        setLocEnd(currentProp.nameLoc, end);
      } else {
        const isStatic = arg[0] !== `[`;
        currentProp.arg = createExp(
          isStatic ? arg : arg.slice(1, -1),
          isStatic,
          getLoc(start, end),
          isStatic ? 3 : 0
        );
      }
    },
    ondirmodifier(start, end) {
      const mod = getSlice(start, end);
      if (inVPre) {
        currentProp.name += "." + mod;
        setLocEnd(currentProp.nameLoc, end);
      } else if (currentProp.name === "slot") {
        const arg = currentProp.arg;
        if (arg) {
          arg.content += "." + mod;
          setLocEnd(arg.loc, end);
        }
      } else {
        const exp = createSimpleExpression(mod, true, getLoc(start, end));
        currentProp.modifiers.push(exp);
      }
    },
    onattribdata(start, end) {
      currentAttrValue += getSlice(start, end);
      if (currentAttrStartIndex < 0) currentAttrStartIndex = start;
      currentAttrEndIndex = end;
    },
    onattribentity(char, start, end) {
      currentAttrValue += char;
      if (currentAttrStartIndex < 0) currentAttrStartIndex = start;
      currentAttrEndIndex = end;
    },
    onattribnameend(end) {
      const start = currentProp.loc.start.offset;
      const name = getSlice(start, end);
      if (currentProp.type === 7) {
        currentProp.rawName = name;
      }
      if (currentOpenTag.props.some(
        (p) => (p.type === 7 ? p.rawName : p.name) === name
      )) {
        emitError(2, start);
      }
    },
    onattribend(quote, end) {
      if (currentOpenTag && currentProp) {
        setLocEnd(currentProp.loc, end);
        if (quote !== 0) {
          if (currentProp.type === 6) {
            if (currentProp.name === "class") {
              currentAttrValue = condense(currentAttrValue).trim();
            }
            if (quote === 1 && !currentAttrValue) {
              emitError(13, end);
            }
            currentProp.value = {
              type: 2,
              content: currentAttrValue,
              loc: quote === 1 ? getLoc(currentAttrStartIndex, currentAttrEndIndex) : getLoc(currentAttrStartIndex - 1, currentAttrEndIndex + 1)
            };
            if (tokenizer.inSFCRoot && currentOpenTag.tag === "template" && currentProp.name === "lang" && currentAttrValue && currentAttrValue !== "html") {
              tokenizer.enterRCDATA(toCharCodes(`</template`), 0);
            }
          } else {
            let expParseMode = 0;
            {
              if (currentProp.name === "for") {
                expParseMode = 3;
              } else if (currentProp.name === "slot") {
                expParseMode = 1;
              } else if (currentProp.name === "on" && currentAttrValue.includes(";")) {
                expParseMode = 2;
              }
            }
            currentProp.exp = createExp(
              currentAttrValue,
              false,
              getLoc(currentAttrStartIndex, currentAttrEndIndex),
              0,
              expParseMode
            );
            if (currentProp.name === "for") {
              currentProp.forParseResult = parseForExpression(currentProp.exp);
            }
            let syncIndex = -1;
            if (currentProp.name === "bind" && (syncIndex = currentProp.modifiers.findIndex(
              (mod) => mod.content === "sync"
            )) > -1 && checkCompatEnabled(
              "COMPILER_V_BIND_SYNC",
              currentOptions,
              currentProp.loc,
              currentProp.arg.loc.source
            )) {
              currentProp.name = "model";
              currentProp.modifiers.splice(syncIndex, 1);
            }
          }
        }
        if (currentProp.type !== 7 || currentProp.name !== "pre") {
          currentOpenTag.props.push(currentProp);
        }
      }
      currentAttrValue = "";
      currentAttrStartIndex = currentAttrEndIndex = -1;
    },
    oncomment(start, end) {
      if (currentOptions.comments) {
        addNode({
          type: 3,
          content: getSlice(start, end),
          loc: getLoc(start - 4, end + 3)
        });
      }
    },
    onend() {
      const end = currentInput.length;
      if (tokenizer.state !== 1) {
        switch (tokenizer.state) {
          case 5:
          case 8:
            emitError(5, end);
            break;
          case 3:
          case 4:
            emitError(
              25,
              tokenizer.sectionStart
            );
            break;
          case 28:
            if (tokenizer.currentSequence === Sequences.CdataEnd) {
              emitError(6, end);
            } else {
              emitError(7, end);
            }
            break;
          case 6:
          case 7:
          case 9:
          case 11:
          case 12:
          case 13:
          case 14:
          case 15:
          case 16:
          case 17:
          case 18:
          case 19:
          // "
          case 20:
          // '
          case 21:
            emitError(9, end);
            break;
        }
      }
      for (let index = 0; index < stack.length; index++) {
        onCloseTag(stack[index], end - 1);
        emitError(24, stack[index].loc.start.offset);
      }
    },
    oncdata(start, end) {
      if (stack[0].ns !== 0) {
        onText(getSlice(start, end), start, end);
      } else {
        emitError(1, start - 9);
      }
    },
    onprocessinginstruction(start) {
      if ((stack[0] ? stack[0].ns : currentOptions.ns) === 0) {
        emitError(
          21,
          start - 1
        );
      }
    }
  });
  const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  const stripParensRE = /^\(|\)$/g;
  function parseForExpression(input) {
    const loc = input.loc;
    const exp = input.content;
    const inMatch = exp.match(forAliasRE);
    if (!inMatch) return;
    const [, LHS, RHS] = inMatch;
    const createAliasExpression = (content, offset, asParam = false) => {
      const start = loc.start.offset + offset;
      const end = start + content.length;
      return createExp(
        content,
        false,
        getLoc(start, end),
        0,
        asParam ? 1 : 0
        /* Normal */
      );
    };
    const result = {
      source: createAliasExpression(RHS.trim(), exp.indexOf(RHS, LHS.length)),
      value: void 0,
      key: void 0,
      index: void 0,
      finalized: false
    };
    let valueContent = LHS.trim().replace(stripParensRE, "").trim();
    const trimmedOffset = LHS.indexOf(valueContent);
    const iteratorMatch = valueContent.match(forIteratorRE);
    if (iteratorMatch) {
      valueContent = valueContent.replace(forIteratorRE, "").trim();
      const keyContent = iteratorMatch[1].trim();
      let keyOffset;
      if (keyContent) {
        keyOffset = exp.indexOf(keyContent, trimmedOffset + valueContent.length);
        result.key = createAliasExpression(keyContent, keyOffset, true);
      }
      if (iteratorMatch[2]) {
        const indexContent = iteratorMatch[2].trim();
        if (indexContent) {
          result.index = createAliasExpression(
            indexContent,
            exp.indexOf(
              indexContent,
              result.key ? keyOffset + keyContent.length : trimmedOffset + valueContent.length
            ),
            true
          );
        }
      }
    }
    if (valueContent) {
      result.value = createAliasExpression(valueContent, trimmedOffset, true);
    }
    return result;
  }
  function getSlice(start, end) {
    return currentInput.slice(start, end);
  }
  function endOpenTag(end) {
    if (tokenizer.inSFCRoot) {
      currentOpenTag.innerLoc = getLoc(end + 1, end + 1);
    }
    addNode(currentOpenTag);
    const { tag, ns } = currentOpenTag;
    if (ns === 0 && currentOptions.isPreTag(tag)) {
      inPre++;
    }
    if (currentOptions.isVoidTag(tag)) {
      onCloseTag(currentOpenTag, end);
    } else {
      stack.unshift(currentOpenTag);
      if (ns === 1 || ns === 2) {
        tokenizer.inXML = true;
      }
    }
    currentOpenTag = null;
  }
  function onText(content, start, end) {
    const parent = stack[0] || currentRoot;
    const lastNode = parent.children[parent.children.length - 1];
    if (lastNode && lastNode.type === 2) {
      lastNode.content += content;
      setLocEnd(lastNode.loc, end);
    } else {
      parent.children.push({
        type: 2,
        content,
        loc: getLoc(start, end)
      });
    }
  }
  function onCloseTag(el, end, isImplied = false) {
    if (isImplied) {
      setLocEnd(el.loc, backTrack(end, 60));
    } else {
      setLocEnd(el.loc, lookAhead(end, 62) + 1);
    }
    if (tokenizer.inSFCRoot) {
      if (el.children.length) {
        el.innerLoc.end = shared.extend({}, el.children[el.children.length - 1].loc.end);
      } else {
        el.innerLoc.end = shared.extend({}, el.innerLoc.start);
      }
      el.innerLoc.source = getSlice(
        el.innerLoc.start.offset,
        el.innerLoc.end.offset
      );
    }
    const { tag, ns, children } = el;
    if (!inVPre) {
      if (tag === "slot") {
        el.tagType = 2;
      } else if (isFragmentTemplate(el)) {
        el.tagType = 3;
      } else if (isComponent(el)) {
        el.tagType = 1;
      }
    }
    if (!tokenizer.inRCDATA) {
      el.children = condenseWhitespace(children);
    }
    if (ns === 0 && currentOptions.isIgnoreNewlineTag(tag)) {
      const first = children[0];
      if (first && first.type === 2) {
        first.content = first.content.replace(/^\r?\n/, "");
      }
    }
    if (ns === 0 && currentOptions.isPreTag(tag)) {
      inPre--;
    }
    if (currentVPreBoundary === el) {
      inVPre = tokenizer.inVPre = false;
      currentVPreBoundary = null;
    }
    if (tokenizer.inXML && (stack[0] ? stack[0].ns : currentOptions.ns) === 0) {
      tokenizer.inXML = false;
    }
    {
      const props = el.props;
      if (!tokenizer.inSFCRoot && isCompatEnabled(
        "COMPILER_NATIVE_TEMPLATE",
        currentOptions
      ) && el.tag === "template" && !isFragmentTemplate(el)) {
        const parent = stack[0] || currentRoot;
        const index = parent.children.indexOf(el);
        parent.children.splice(index, 1, ...el.children);
      }
      const inlineTemplateProp = props.find(
        (p) => p.type === 6 && p.name === "inline-template"
      );
      if (inlineTemplateProp && checkCompatEnabled(
        "COMPILER_INLINE_TEMPLATE",
        currentOptions,
        inlineTemplateProp.loc
      ) && el.children.length) {
        inlineTemplateProp.value = {
          type: 2,
          content: getSlice(
            el.children[0].loc.start.offset,
            el.children[el.children.length - 1].loc.end.offset
          ),
          loc: inlineTemplateProp.loc
        };
      }
    }
  }
  function lookAhead(index, c) {
    let i = index;
    while (currentInput.charCodeAt(i) !== c && i < currentInput.length - 1) i++;
    return i;
  }
  function backTrack(index, c) {
    let i = index;
    while (currentInput.charCodeAt(i) !== c && i >= 0) i--;
    return i;
  }
  const specialTemplateDir = /* @__PURE__ */ new Set(["if", "else", "else-if", "for", "slot"]);
  function isFragmentTemplate({ tag, props }) {
    if (tag === "template") {
      for (let i = 0; i < props.length; i++) {
        if (props[i].type === 7 && specialTemplateDir.has(props[i].name)) {
          return true;
        }
      }
    }
    return false;
  }
  function isComponent({ tag, props }) {
    if (currentOptions.isCustomElement(tag)) {
      return false;
    }
    if (tag === "component" || isUpperCase(tag.charCodeAt(0)) || isCoreComponent(tag) || currentOptions.isBuiltInComponent && currentOptions.isBuiltInComponent(tag) || currentOptions.isNativeTag && !currentOptions.isNativeTag(tag)) {
      return true;
    }
    for (let i = 0; i < props.length; i++) {
      const p = props[i];
      if (p.type === 6) {
        if (p.name === "is" && p.value) {
          if (p.value.content.startsWith("vue:")) {
            return true;
          } else if (checkCompatEnabled(
            "COMPILER_IS_ON_ELEMENT",
            currentOptions,
            p.loc
          )) {
            return true;
          }
        }
      } else if (
        // :is on plain element - only treat as component in compat mode
        p.name === "bind" && isStaticArgOf(p.arg, "is") && checkCompatEnabled(
          "COMPILER_IS_ON_ELEMENT",
          currentOptions,
          p.loc
        )
      ) {
        return true;
      }
    }
    return false;
  }
  function isUpperCase(c) {
    return c > 64 && c < 91;
  }
  const windowsNewlineRE = /\r\n/g;
  function condenseWhitespace(nodes, tag) {
    const shouldCondense = currentOptions.whitespace !== "preserve";
    let removedWhitespace = false;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.type === 2) {
        if (!inPre) {
          if (isAllWhitespace(node.content)) {
            const prev = nodes[i - 1] && nodes[i - 1].type;
            const next = nodes[i + 1] && nodes[i + 1].type;
            if (!prev || !next || shouldCondense && (prev === 3 && (next === 3 || next === 1) || prev === 1 && (next === 3 || next === 1 && hasNewlineChar(node.content)))) {
              removedWhitespace = true;
              nodes[i] = null;
            } else {
              node.content = " ";
            }
          } else if (shouldCondense) {
            node.content = condense(node.content);
          }
        } else {
          node.content = node.content.replace(windowsNewlineRE, "\n");
        }
      }
    }
    return removedWhitespace ? nodes.filter(Boolean) : nodes;
  }
  function isAllWhitespace(str) {
    for (let i = 0; i < str.length; i++) {
      if (!isWhitespace(str.charCodeAt(i))) {
        return false;
      }
    }
    return true;
  }
  function hasNewlineChar(str) {
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      if (c === 10 || c === 13) {
        return true;
      }
    }
    return false;
  }
  function condense(str) {
    let ret = "";
    let prevCharIsWhitespace = false;
    for (let i = 0; i < str.length; i++) {
      if (isWhitespace(str.charCodeAt(i))) {
        if (!prevCharIsWhitespace) {
          ret += " ";
          prevCharIsWhitespace = true;
        }
      } else {
        ret += str[i];
        prevCharIsWhitespace = false;
      }
    }
    return ret;
  }
  function addNode(node) {
    (stack[0] || currentRoot).children.push(node);
  }
  function getLoc(start, end) {
    return {
      start: tokenizer.getPos(start),
      // @ts-expect-error allow late attachment
      end: end == null ? end : tokenizer.getPos(end),
      // @ts-expect-error allow late attachment
      source: end == null ? end : getSlice(start, end)
    };
  }
  function cloneLoc(loc) {
    return getLoc(loc.start.offset, loc.end.offset);
  }
  function setLocEnd(loc, end) {
    loc.end = tokenizer.getPos(end);
    loc.source = getSlice(loc.start.offset, end);
  }
  function dirToAttr(dir) {
    const attr = {
      type: 6,
      name: dir.rawName,
      nameLoc: getLoc(
        dir.loc.start.offset,
        dir.loc.start.offset + dir.rawName.length
      ),
      value: void 0,
      loc: dir.loc
    };
    if (dir.exp) {
      const loc = dir.exp.loc;
      if (loc.end.offset < dir.loc.end.offset) {
        loc.start.offset--;
        loc.start.column--;
        loc.end.offset++;
        loc.end.column++;
      }
      attr.value = {
        type: 2,
        content: dir.exp.content,
        loc
      };
    }
    return attr;
  }
  function createExp(content, isStatic = false, loc, constType = 0, parseMode = 0) {
    const exp = createSimpleExpression(content, isStatic, loc, constType);
    if (!isStatic && currentOptions.prefixIdentifiers && parseMode !== 3 && content.trim()) {
      if (isSimpleIdentifier(content)) {
        exp.ast = null;
        return exp;
      }
      try {
        const plugins2 = currentOptions.expressionPlugins;
        const options = {
          plugins: plugins2 ? [...plugins2, "typescript"] : ["typescript"]
        };
        if (parseMode === 2) {
          exp.ast = parser.parse(` ${content} `, options).program;
        } else if (parseMode === 1) {
          exp.ast = parser.parseExpression(`(${content})=>{}`, options);
        } else {
          exp.ast = parser.parseExpression(`(${content})`, options);
        }
      } catch (e) {
        exp.ast = false;
        emitError(45, loc.start.offset, e.message);
      }
    }
    return exp;
  }
  function emitError(code, index, message) {
    currentOptions.onError(
      createCompilerError(code, getLoc(index, index), void 0, message)
    );
  }
  function reset() {
    tokenizer.reset();
    currentOpenTag = null;
    currentProp = null;
    currentAttrValue = "";
    currentAttrStartIndex = -1;
    currentAttrEndIndex = -1;
    stack.length = 0;
  }
  function baseParse(input, options) {
    reset();
    currentInput = input;
    currentOptions = shared.extend({}, defaultParserOptions);
    if (options) {
      let key;
      for (key in options) {
        if (options[key] != null) {
          currentOptions[key] = options[key];
        }
      }
    }
    tokenizer.mode = currentOptions.parseMode === "html" ? 1 : currentOptions.parseMode === "sfc" ? 2 : 0;
    tokenizer.inXML = currentOptions.ns === 1 || currentOptions.ns === 2;
    const delimiters = options && options.delimiters;
    if (delimiters) {
      tokenizer.delimiterOpen = toCharCodes(delimiters[0]);
      tokenizer.delimiterClose = toCharCodes(delimiters[1]);
    }
    const root = currentRoot = createRoot([], input);
    tokenizer.parse(currentInput);
    root.loc = getLoc(0, input.length);
    root.children = condenseWhitespace(root.children);
    currentRoot = null;
    return root;
  }
  function cacheStatic(root, context) {
    walk(
      root,
      void 0,
      context,
      // Root node is unfortunately non-hoistable due to potential parent
      // fallthrough attributes.
      isSingleElementRoot(root, root.children[0])
    );
  }
  function isSingleElementRoot(root, child) {
    const { children } = root;
    return children.length === 1 && child.type === 1 && !isSlotOutlet(child);
  }
  function walk(node, parent, context, doNotHoistNode = false, inFor = false) {
    const { children } = node;
    const toCache = [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.type === 1 && child.tagType === 0) {
        const constantType = doNotHoistNode ? 0 : getConstantType(child, context);
        if (constantType > 0) {
          if (constantType >= 2) {
            child.codegenNode.patchFlag = -1;
            toCache.push(child);
            continue;
          }
        } else {
          const codegenNode = child.codegenNode;
          if (codegenNode.type === 13) {
            const flag = codegenNode.patchFlag;
            if ((flag === void 0 || flag === 512 || flag === 1) && getGeneratedPropsConstantType(child, context) >= 2) {
              const props = getNodeProps(child);
              if (props) {
                codegenNode.props = context.hoist(props);
              }
            }
            if (codegenNode.dynamicProps) {
              codegenNode.dynamicProps = context.hoist(codegenNode.dynamicProps);
            }
          }
        }
      } else if (child.type === 12) {
        const constantType = doNotHoistNode ? 0 : getConstantType(child, context);
        if (constantType >= 2) {
          toCache.push(child);
          continue;
        }
      }
      if (child.type === 1) {
        const isComponent2 = child.tagType === 1;
        if (isComponent2) {
          context.scopes.vSlot++;
        }
        walk(child, node, context, false, inFor);
        if (isComponent2) {
          context.scopes.vSlot--;
        }
      } else if (child.type === 11) {
        walk(child, node, context, child.children.length === 1, true);
      } else if (child.type === 9) {
        for (let i2 = 0; i2 < child.branches.length; i2++) {
          walk(
            child.branches[i2],
            node,
            context,
            child.branches[i2].children.length === 1,
            inFor
          );
        }
      }
    }
    let cachedAsArray = false;
    const slotCacheKeys = [];
    if (toCache.length === children.length && node.type === 1) {
      if (node.tagType === 0 && node.codegenNode && node.codegenNode.type === 13 && shared.isArray(node.codegenNode.children)) {
        node.codegenNode.children = getCacheExpression(
          createArrayExpression(node.codegenNode.children)
        );
        cachedAsArray = true;
      } else if (node.tagType === 1 && node.codegenNode && node.codegenNode.type === 13 && node.codegenNode.children && !shared.isArray(node.codegenNode.children) && node.codegenNode.children.type === 15) {
        const slot = getSlotNode(node.codegenNode, "default");
        if (slot) {
          slotCacheKeys.push(context.cached.length);
          slot.returns = getCacheExpression(
            createArrayExpression(slot.returns)
          );
          cachedAsArray = true;
        }
      } else if (node.tagType === 3 && parent && parent.type === 1 && parent.tagType === 1 && parent.codegenNode && parent.codegenNode.type === 13 && parent.codegenNode.children && !shared.isArray(parent.codegenNode.children) && parent.codegenNode.children.type === 15) {
        const slotName = findDir(node, "slot", true);
        const slot = slotName && slotName.arg && getSlotNode(parent.codegenNode, slotName.arg);
        if (slot) {
          slotCacheKeys.push(context.cached.length);
          slot.returns = getCacheExpression(
            createArrayExpression(slot.returns)
          );
          cachedAsArray = true;
        }
      }
    }
    if (!cachedAsArray) {
      for (const child of toCache) {
        slotCacheKeys.push(context.cached.length);
        child.codegenNode = context.cache(child.codegenNode);
      }
    }
    if (slotCacheKeys.length && node.type === 1 && node.tagType === 1 && node.codegenNode && node.codegenNode.type === 13 && node.codegenNode.children && !shared.isArray(node.codegenNode.children) && node.codegenNode.children.type === 15) {
      node.codegenNode.children.properties.push(
        createObjectProperty(
          `__`,
          createSimpleExpression(JSON.stringify(slotCacheKeys), false)
        )
      );
    }
    function getCacheExpression(value) {
      const exp = context.cache(value);
      if (inFor && context.hmr) {
        exp.needArraySpread = true;
      }
      return exp;
    }
    function getSlotNode(node2, name) {
      if (node2.children && !shared.isArray(node2.children) && node2.children.type === 15) {
        const slot = node2.children.properties.find(
          (p) => p.key === name || p.key.content === name
        );
        return slot && slot.value;
      }
    }
    if (toCache.length && context.transformHoist) {
      context.transformHoist(children, context, node);
    }
  }
  function getConstantType(node, context) {
    const { constantCache } = context;
    switch (node.type) {
      case 1:
        if (node.tagType !== 0) {
          return 0;
        }
        const cached = constantCache.get(node);
        if (cached !== void 0) {
          return cached;
        }
        const codegenNode = node.codegenNode;
        if (codegenNode.type !== 13) {
          return 0;
        }
        if (codegenNode.isBlock && node.tag !== "svg" && node.tag !== "foreignObject" && node.tag !== "math") {
          return 0;
        }
        if (codegenNode.patchFlag === void 0) {
          let returnType2 = 3;
          const generatedPropsType = getGeneratedPropsConstantType(node, context);
          if (generatedPropsType === 0) {
            constantCache.set(node, 0);
            return 0;
          }
          if (generatedPropsType < returnType2) {
            returnType2 = generatedPropsType;
          }
          for (let i = 0; i < node.children.length; i++) {
            const childType = getConstantType(node.children[i], context);
            if (childType === 0) {
              constantCache.set(node, 0);
              return 0;
            }
            if (childType < returnType2) {
              returnType2 = childType;
            }
          }
          if (returnType2 > 1) {
            for (let i = 0; i < node.props.length; i++) {
              const p = node.props[i];
              if (p.type === 7 && p.name === "bind" && p.exp) {
                const expType = getConstantType(p.exp, context);
                if (expType === 0) {
                  constantCache.set(node, 0);
                  return 0;
                }
                if (expType < returnType2) {
                  returnType2 = expType;
                }
              }
            }
          }
          if (codegenNode.isBlock) {
            for (let i = 0; i < node.props.length; i++) {
              const p = node.props[i];
              if (p.type === 7) {
                constantCache.set(node, 0);
                return 0;
              }
            }
            context.removeHelper(OPEN_BLOCK);
            context.removeHelper(
              getVNodeBlockHelper(context.inSSR, codegenNode.isComponent)
            );
            codegenNode.isBlock = false;
            context.helper(getVNodeHelper(context.inSSR, codegenNode.isComponent));
          }
          constantCache.set(node, returnType2);
          return returnType2;
        } else {
          constantCache.set(node, 0);
          return 0;
        }
      case 2:
      case 3:
        return 3;
      case 9:
      case 11:
      case 10:
        return 0;
      case 5:
      case 12:
        return getConstantType(node.content, context);
      case 4:
        return node.constType;
      case 8:
        let returnType = 3;
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          if (shared.isString(child) || shared.isSymbol(child)) {
            continue;
          }
          const childType = getConstantType(child, context);
          if (childType === 0) {
            return 0;
          } else if (childType < returnType) {
            returnType = childType;
          }
        }
        return returnType;
      case 20:
        return 2;
      default:
        return 0;
    }
  }
  const allowHoistedHelperSet = /* @__PURE__ */ new Set([
    NORMALIZE_CLASS,
    NORMALIZE_STYLE,
    NORMALIZE_PROPS,
    GUARD_REACTIVE_PROPS
  ]);
  function getConstantTypeOfHelperCall(value, context) {
    if (value.type === 14 && !shared.isString(value.callee) && allowHoistedHelperSet.has(value.callee)) {
      const arg = value.arguments[0];
      if (arg.type === 4) {
        return getConstantType(arg, context);
      } else if (arg.type === 14) {
        return getConstantTypeOfHelperCall(arg, context);
      }
    }
    return 0;
  }
  function getGeneratedPropsConstantType(node, context) {
    let returnType = 3;
    const props = getNodeProps(node);
    if (props && props.type === 15) {
      const { properties } = props;
      for (let i = 0; i < properties.length; i++) {
        const { key, value } = properties[i];
        const keyType = getConstantType(key, context);
        if (keyType === 0) {
          return keyType;
        }
        if (keyType < returnType) {
          returnType = keyType;
        }
        let valueType;
        if (value.type === 4) {
          valueType = getConstantType(value, context);
        } else if (value.type === 14) {
          valueType = getConstantTypeOfHelperCall(value, context);
        } else {
          valueType = 0;
        }
        if (valueType === 0) {
          return valueType;
        }
        if (valueType < returnType) {
          returnType = valueType;
        }
      }
    }
    return returnType;
  }
  function getNodeProps(node) {
    const codegenNode = node.codegenNode;
    if (codegenNode.type === 13) {
      return codegenNode.props;
    }
  }
  function createTransformContext(root, {
    filename = "",
    prefixIdentifiers = false,
    hoistStatic = false,
    hmr = false,
    cacheHandlers = false,
    nodeTransforms = [],
    directiveTransforms = {},
    transformHoist = null,
    isBuiltInComponent = shared.NOOP,
    isCustomElement = shared.NOOP,
    expressionPlugins = [],
    scopeId = null,
    slotted = true,
    ssr = false,
    inSSR = false,
    ssrCssVars = ``,
    bindingMetadata = shared.EMPTY_OBJ,
    inline = false,
    isTS = false,
    onError = defaultOnError,
    onWarn = defaultOnWarn,
    compatConfig
  }) {
    const nameMatch = filename.replace(/\?.*$/, "").match(/([^/\\]+)\.\w+$/);
    const context = {
      // options
      filename,
      selfName: nameMatch && shared.capitalize(shared.camelize(nameMatch[1])),
      prefixIdentifiers,
      hoistStatic,
      hmr,
      cacheHandlers,
      nodeTransforms,
      directiveTransforms,
      transformHoist,
      isBuiltInComponent,
      isCustomElement,
      expressionPlugins,
      scopeId,
      slotted,
      ssr,
      inSSR,
      ssrCssVars,
      bindingMetadata,
      inline,
      isTS,
      onError,
      onWarn,
      compatConfig,
      // state
      root,
      helpers: /* @__PURE__ */ new Map(),
      components: /* @__PURE__ */ new Set(),
      directives: /* @__PURE__ */ new Set(),
      hoists: [],
      imports: [],
      cached: [],
      constantCache: /* @__PURE__ */ new WeakMap(),
      temps: 0,
      identifiers: /* @__PURE__ */ Object.create(null),
      scopes: {
        vFor: 0,
        vSlot: 0,
        vPre: 0,
        vOnce: 0
      },
      parent: null,
      grandParent: null,
      currentNode: root,
      childIndex: 0,
      inVOnce: false,
      // methods
      helper(name) {
        const count = context.helpers.get(name) || 0;
        context.helpers.set(name, count + 1);
        return name;
      },
      removeHelper(name) {
        const count = context.helpers.get(name);
        if (count) {
          const currentCount = count - 1;
          if (!currentCount) {
            context.helpers.delete(name);
          } else {
            context.helpers.set(name, currentCount);
          }
        }
      },
      helperString(name) {
        return `_${helperNameMap[context.helper(name)]}`;
      },
      replaceNode(node) {
        context.parent.children[context.childIndex] = context.currentNode = node;
      },
      removeNode(node) {
        const list = context.parent.children;
        const removalIndex = node ? list.indexOf(node) : context.currentNode ? context.childIndex : -1;
        if (!node || node === context.currentNode) {
          context.currentNode = null;
          context.onNodeRemoved();
        } else {
          if (context.childIndex > removalIndex) {
            context.childIndex--;
            context.onNodeRemoved();
          }
        }
        context.parent.children.splice(removalIndex, 1);
      },
      onNodeRemoved: shared.NOOP,
      addIdentifiers(exp) {
        {
          if (shared.isString(exp)) {
            addId(exp);
          } else if (exp.identifiers) {
            exp.identifiers.forEach(addId);
          } else if (exp.type === 4) {
            addId(exp.content);
          }
        }
      },
      removeIdentifiers(exp) {
        {
          if (shared.isString(exp)) {
            removeId(exp);
          } else if (exp.identifiers) {
            exp.identifiers.forEach(removeId);
          } else if (exp.type === 4) {
            removeId(exp.content);
          }
        }
      },
      hoist(exp) {
        if (shared.isString(exp)) exp = createSimpleExpression(exp);
        context.hoists.push(exp);
        const identifier = createSimpleExpression(
          `_hoisted_${context.hoists.length}`,
          false,
          exp.loc,
          2
        );
        identifier.hoisted = exp;
        return identifier;
      },
      cache(exp, isVNode = false, inVOnce = false) {
        const cacheExp = createCacheExpression(
          context.cached.length,
          exp,
          isVNode,
          inVOnce
        );
        context.cached.push(cacheExp);
        return cacheExp;
      }
    };
    {
      context.filters = /* @__PURE__ */ new Set();
    }
    function addId(id) {
      const { identifiers } = context;
      if (identifiers[id] === void 0) {
        identifiers[id] = 0;
      }
      identifiers[id]++;
    }
    function removeId(id) {
      context.identifiers[id]--;
    }
    return context;
  }
  function transform(root, options) {
    const context = createTransformContext(root, options);
    traverseNode(root, context);
    if (options.hoistStatic) {
      cacheStatic(root, context);
    }
    if (!options.ssr) {
      createRootCodegen(root, context);
    }
    root.helpers = /* @__PURE__ */ new Set([...context.helpers.keys()]);
    root.components = [...context.components];
    root.directives = [...context.directives];
    root.imports = context.imports;
    root.hoists = context.hoists;
    root.temps = context.temps;
    root.cached = context.cached;
    root.transformed = true;
    {
      root.filters = [...context.filters];
    }
  }
  function createRootCodegen(root, context) {
    const { helper } = context;
    const { children } = root;
    if (children.length === 1) {
      const child = children[0];
      if (isSingleElementRoot(root, child) && child.codegenNode) {
        const codegenNode = child.codegenNode;
        if (codegenNode.type === 13) {
          convertToBlock(codegenNode, context);
        }
        root.codegenNode = codegenNode;
      } else {
        root.codegenNode = child;
      }
    } else if (children.length > 1) {
      let patchFlag = 64;
      root.codegenNode = createVNodeCall(
        context,
        helper(FRAGMENT),
        void 0,
        root.children,
        patchFlag,
        void 0,
        void 0,
        true,
        void 0,
        false
      );
    } else ;
  }
  function traverseChildren(parent, context) {
    let i = 0;
    const nodeRemoved = () => {
      i--;
    };
    for (; i < parent.children.length; i++) {
      const child = parent.children[i];
      if (shared.isString(child)) continue;
      context.grandParent = context.parent;
      context.parent = parent;
      context.childIndex = i;
      context.onNodeRemoved = nodeRemoved;
      traverseNode(child, context);
    }
  }
  function traverseNode(node, context) {
    context.currentNode = node;
    const { nodeTransforms } = context;
    const exitFns = [];
    for (let i2 = 0; i2 < nodeTransforms.length; i2++) {
      const onExit = nodeTransforms[i2](node, context);
      if (onExit) {
        if (shared.isArray(onExit)) {
          exitFns.push(...onExit);
        } else {
          exitFns.push(onExit);
        }
      }
      if (!context.currentNode) {
        return;
      } else {
        node = context.currentNode;
      }
    }
    switch (node.type) {
      case 3:
        if (!context.ssr) {
          context.helper(CREATE_COMMENT);
        }
        break;
      case 5:
        if (!context.ssr) {
          context.helper(TO_DISPLAY_STRING);
        }
        break;
      // for container types, further traverse downwards
      case 9:
        for (let i2 = 0; i2 < node.branches.length; i2++) {
          traverseNode(node.branches[i2], context);
        }
        break;
      case 10:
      case 11:
      case 1:
      case 0:
        traverseChildren(node, context);
        break;
    }
    context.currentNode = node;
    let i = exitFns.length;
    while (i--) {
      exitFns[i]();
    }
  }
  function createStructuralDirectiveTransform(name, fn) {
    const matches = shared.isString(name) ? (n) => n === name : (n) => name.test(n);
    return (node, context) => {
      if (node.type === 1) {
        const { props } = node;
        if (node.tagType === 3 && props.some(isVSlot)) {
          return;
        }
        const exitFns = [];
        for (let i = 0; i < props.length; i++) {
          const prop = props[i];
          if (prop.type === 7 && matches(prop.name)) {
            props.splice(i, 1);
            i--;
            const onExit = fn(node, prop, context);
            if (onExit) exitFns.push(onExit);
          }
        }
        return exitFns;
      }
    };
  }
  const PURE_ANNOTATION = `/*@__PURE__*/`;
  const aliasHelper = (s) => `${helperNameMap[s]}: _${helperNameMap[s]}`;
  function createCodegenContext(ast, {
    mode = "function",
    prefixIdentifiers = mode === "module",
    sourceMap = false,
    filename = `template.vue.html`,
    scopeId = null,
    optimizeImports = false,
    runtimeGlobalName = `Vue`,
    runtimeModuleName = `vue`,
    ssrRuntimeModuleName = "vue/server-renderer",
    ssr = false,
    isTS = false,
    inSSR = false
  }) {
    const context = {
      mode,
      prefixIdentifiers,
      sourceMap,
      filename,
      scopeId,
      optimizeImports,
      runtimeGlobalName,
      runtimeModuleName,
      ssrRuntimeModuleName,
      ssr,
      isTS,
      inSSR,
      source: ast.source,
      code: ``,
      column: 1,
      line: 1,
      offset: 0,
      indentLevel: 0,
      pure: false,
      map: void 0,
      helper(key) {
        return `_${helperNameMap[key]}`;
      },
      push(code, newlineIndex = -2, node) {
        context.code += code;
        if (context.map) {
          if (node) {
            let name;
            if (node.type === 4 && !node.isStatic) {
              const content = node.content.replace(/^_ctx\./, "");
              if (content !== node.content && isSimpleIdentifier(content)) {
                name = content;
              }
            }
            if (node.loc.source) {
              addMapping(node.loc.start, name);
            }
          }
          if (newlineIndex === -3) {
            advancePositionWithMutation(context, code);
          } else {
            context.offset += code.length;
            if (newlineIndex === -2) {
              context.column += code.length;
            } else {
              if (newlineIndex === -1) {
                newlineIndex = code.length - 1;
              }
              context.line++;
              context.column = code.length - newlineIndex;
            }
          }
          if (node && node.loc !== locStub && node.loc.source) {
            addMapping(node.loc.end);
          }
        }
      },
      indent() {
        newline(++context.indentLevel);
      },
      deindent(withoutNewLine = false) {
        if (withoutNewLine) {
          --context.indentLevel;
        } else {
          newline(--context.indentLevel);
        }
      },
      newline() {
        newline(context.indentLevel);
      }
    };
    function newline(n) {
      context.push(
        "\n" + `  `.repeat(n),
        0
        /* Start */
      );
    }
    function addMapping(loc, name = null) {
      const { _names, _mappings } = context.map;
      if (name !== null && !_names.has(name)) _names.add(name);
      _mappings.add({
        originalLine: loc.line,
        originalColumn: loc.column - 1,
        // source-map column is 0 based
        generatedLine: context.line,
        generatedColumn: context.column - 1,
        source: filename,
        name
      });
    }
    if (sourceMap) {
      context.map = new sourceMapJs.SourceMapGenerator();
      context.map.setSourceContent(filename, context.source);
      context.map._sources.add(filename);
    }
    return context;
  }
  function generate(ast, options = {}) {
    const context = createCodegenContext(ast, options);
    if (options.onContextCreated) options.onContextCreated(context);
    const {
      mode,
      push,
      prefixIdentifiers,
      indent,
      deindent,
      newline,
      scopeId,
      ssr
    } = context;
    const helpers = Array.from(ast.helpers);
    const hasHelpers = helpers.length > 0;
    const useWithBlock = !prefixIdentifiers && mode !== "module";
    const genScopeId = scopeId != null && mode === "module";
    const isSetupInlined = !!options.inline;
    const preambleContext = isSetupInlined ? createCodegenContext(ast, options) : context;
    if (mode === "module") {
      genModulePreamble(ast, preambleContext, genScopeId, isSetupInlined);
    } else {
      genFunctionPreamble(ast, preambleContext);
    }
    const functionName = ssr ? `ssrRender` : `render`;
    const args = ssr ? ["_ctx", "_push", "_parent", "_attrs"] : ["_ctx", "_cache"];
    if (options.bindingMetadata && !options.inline) {
      args.push("$props", "$setup", "$data", "$options");
    }
    const signature = options.isTS ? args.map((arg) => `${arg}: any`).join(",") : args.join(", ");
    if (isSetupInlined) {
      push(`(${signature}) => {`);
    } else {
      push(`function ${functionName}(${signature}) {`);
    }
    indent();
    if (useWithBlock) {
      push(`with (_ctx) {`);
      indent();
      if (hasHelpers) {
        push(
          `const { ${helpers.map(aliasHelper).join(", ")} } = _Vue
`,
          -1
          /* End */
        );
        newline();
      }
    }
    if (ast.components.length) {
      genAssets(ast.components, "component", context);
      if (ast.directives.length || ast.temps > 0) {
        newline();
      }
    }
    if (ast.directives.length) {
      genAssets(ast.directives, "directive", context);
      if (ast.temps > 0) {
        newline();
      }
    }
    if (ast.filters && ast.filters.length) {
      newline();
      genAssets(ast.filters, "filter", context);
      newline();
    }
    if (ast.temps > 0) {
      push(`let `);
      for (let i = 0; i < ast.temps; i++) {
        push(`${i > 0 ? `, ` : ``}_temp${i}`);
      }
    }
    if (ast.components.length || ast.directives.length || ast.temps) {
      push(
        `
`,
        0
        /* Start */
      );
      newline();
    }
    if (!ssr) {
      push(`return `);
    }
    if (ast.codegenNode) {
      genNode(ast.codegenNode, context);
    } else {
      push(`null`);
    }
    if (useWithBlock) {
      deindent();
      push(`}`);
    }
    deindent();
    push(`}`);
    return {
      ast,
      code: context.code,
      preamble: isSetupInlined ? preambleContext.code : ``,
      map: context.map ? context.map.toJSON() : void 0
    };
  }
  function genFunctionPreamble(ast, context) {
    const {
      ssr,
      prefixIdentifiers,
      push,
      newline,
      runtimeModuleName,
      runtimeGlobalName,
      ssrRuntimeModuleName
    } = context;
    const VueBinding = ssr ? `require(${JSON.stringify(runtimeModuleName)})` : runtimeGlobalName;
    const helpers = Array.from(ast.helpers);
    if (helpers.length > 0) {
      if (prefixIdentifiers) {
        push(
          `const { ${helpers.map(aliasHelper).join(", ")} } = ${VueBinding}
`,
          -1
          /* End */
        );
      } else {
        push(
          `const _Vue = ${VueBinding}
`,
          -1
          /* End */
        );
        if (ast.hoists.length) {
          const staticHelpers = [
            CREATE_VNODE,
            CREATE_ELEMENT_VNODE,
            CREATE_COMMENT,
            CREATE_TEXT,
            CREATE_STATIC
          ].filter((helper) => helpers.includes(helper)).map(aliasHelper).join(", ");
          push(
            `const { ${staticHelpers} } = _Vue
`,
            -1
            /* End */
          );
        }
      }
    }
    if (ast.ssrHelpers && ast.ssrHelpers.length) {
      push(
        `const { ${ast.ssrHelpers.map(aliasHelper).join(", ")} } = require("${ssrRuntimeModuleName}")
`,
        -1
        /* End */
      );
    }
    genHoists(ast.hoists, context);
    newline();
    push(`return `);
  }
  function genModulePreamble(ast, context, genScopeId, inline) {
    const {
      push,
      newline,
      optimizeImports,
      runtimeModuleName,
      ssrRuntimeModuleName
    } = context;
    if (ast.helpers.size) {
      const helpers = Array.from(ast.helpers);
      if (optimizeImports) {
        push(
          `import { ${helpers.map((s) => helperNameMap[s]).join(", ")} } from ${JSON.stringify(runtimeModuleName)}
`,
          -1
          /* End */
        );
        push(
          `
// Binding optimization for webpack code-split
const ${helpers.map((s) => `_${helperNameMap[s]} = ${helperNameMap[s]}`).join(", ")}
`,
          -1
          /* End */
        );
      } else {
        push(
          `import { ${helpers.map((s) => `${helperNameMap[s]} as _${helperNameMap[s]}`).join(", ")} } from ${JSON.stringify(runtimeModuleName)}
`,
          -1
          /* End */
        );
      }
    }
    if (ast.ssrHelpers && ast.ssrHelpers.length) {
      push(
        `import { ${ast.ssrHelpers.map((s) => `${helperNameMap[s]} as _${helperNameMap[s]}`).join(", ")} } from "${ssrRuntimeModuleName}"
`,
        -1
        /* End */
      );
    }
    if (ast.imports.length) {
      genImports(ast.imports, context);
      newline();
    }
    genHoists(ast.hoists, context);
    newline();
    if (!inline) {
      push(`export `);
    }
  }
  function genAssets(assets, type, { helper, push, newline, isTS }) {
    const resolver = helper(
      type === "filter" ? RESOLVE_FILTER : type === "component" ? RESOLVE_COMPONENT : RESOLVE_DIRECTIVE
    );
    for (let i = 0; i < assets.length; i++) {
      let id = assets[i];
      const maybeSelfReference = id.endsWith("__self");
      if (maybeSelfReference) {
        id = id.slice(0, -6);
      }
      push(
        `const ${toValidAssetId(id, type)} = ${resolver}(${JSON.stringify(id)}${maybeSelfReference ? `, true` : ``})${isTS ? `!` : ``}`
      );
      if (i < assets.length - 1) {
        newline();
      }
    }
  }
  function genHoists(hoists, context) {
    if (!hoists.length) {
      return;
    }
    context.pure = true;
    const { push, newline } = context;
    newline();
    for (let i = 0; i < hoists.length; i++) {
      const exp = hoists[i];
      if (exp) {
        push(`const _hoisted_${i + 1} = `);
        genNode(exp, context);
        newline();
      }
    }
    context.pure = false;
  }
  function genImports(importsOptions, context) {
    if (!importsOptions.length) {
      return;
    }
    importsOptions.forEach((imports) => {
      context.push(`import `);
      genNode(imports.exp, context);
      context.push(` from '${imports.path}'`);
      context.newline();
    });
  }
  function isText(n) {
    return shared.isString(n) || n.type === 4 || n.type === 2 || n.type === 5 || n.type === 8;
  }
  function genNodeListAsArray(nodes, context) {
    const multilines = nodes.length > 3 || nodes.some((n) => shared.isArray(n) || !isText(n));
    context.push(`[`);
    multilines && context.indent();
    genNodeList(nodes, context, multilines);
    multilines && context.deindent();
    context.push(`]`);
  }
  function genNodeList(nodes, context, multilines = false, comma = true) {
    const { push, newline } = context;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (shared.isString(node)) {
        push(
          node,
          -3
          /* Unknown */
        );
      } else if (shared.isArray(node)) {
        genNodeListAsArray(node, context);
      } else {
        genNode(node, context);
      }
      if (i < nodes.length - 1) {
        if (multilines) {
          comma && push(",");
          newline();
        } else {
          comma && push(", ");
        }
      }
    }
  }
  function genNode(node, context) {
    if (shared.isString(node)) {
      context.push(
        node,
        -3
        /* Unknown */
      );
      return;
    }
    if (shared.isSymbol(node)) {
      context.push(context.helper(node));
      return;
    }
    switch (node.type) {
      case 1:
      case 9:
      case 11:
        genNode(node.codegenNode, context);
        break;
      case 2:
        genText(node, context);
        break;
      case 4:
        genExpression(node, context);
        break;
      case 5:
        genInterpolation(node, context);
        break;
      case 12:
        genNode(node.codegenNode, context);
        break;
      case 8:
        genCompoundExpression(node, context);
        break;
      case 3:
        genComment(node, context);
        break;
      case 13:
        genVNodeCall(node, context);
        break;
      case 14:
        genCallExpression(node, context);
        break;
      case 15:
        genObjectExpression(node, context);
        break;
      case 17:
        genArrayExpression(node, context);
        break;
      case 18:
        genFunctionExpression(node, context);
        break;
      case 19:
        genConditionalExpression(node, context);
        break;
      case 20:
        genCacheExpression(node, context);
        break;
      case 21:
        genNodeList(node.body, context, true, false);
        break;
      // SSR only types
      case 22:
        genTemplateLiteral(node, context);
        break;
      case 23:
        genIfStatement(node, context);
        break;
      case 24:
        genAssignmentExpression(node, context);
        break;
      case 25:
        genSequenceExpression(node, context);
        break;
      case 26:
        genReturnStatement(node, context);
        break;
    }
  }
  function genText(node, context) {
    context.push(JSON.stringify(node.content), -3, node);
  }
  function genExpression(node, context) {
    const { content, isStatic } = node;
    context.push(
      isStatic ? JSON.stringify(content) : content,
      -3,
      node
    );
  }
  function genInterpolation(node, context) {
    const { push, helper, pure } = context;
    if (pure) push(PURE_ANNOTATION);
    push(`${helper(TO_DISPLAY_STRING)}(`);
    genNode(node.content, context);
    push(`)`);
  }
  function genCompoundExpression(node, context) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (shared.isString(child)) {
        context.push(
          child,
          -3
          /* Unknown */
        );
      } else {
        genNode(child, context);
      }
    }
  }
  function genExpressionAsPropertyKey(node, context) {
    const { push } = context;
    if (node.type === 8) {
      push(`[`);
      genCompoundExpression(node, context);
      push(`]`);
    } else if (node.isStatic) {
      const text = isSimpleIdentifier(node.content) ? node.content : JSON.stringify(node.content);
      push(text, -2, node);
    } else {
      push(`[${node.content}]`, -3, node);
    }
  }
  function genComment(node, context) {
    const { push, helper, pure } = context;
    if (pure) {
      push(PURE_ANNOTATION);
    }
    push(
      `${helper(CREATE_COMMENT)}(${JSON.stringify(node.content)})`,
      -3,
      node
    );
  }
  function genVNodeCall(node, context) {
    const { push, helper, pure } = context;
    const {
      tag,
      props,
      children,
      patchFlag,
      dynamicProps,
      directives,
      isBlock,
      disableTracking,
      isComponent: isComponent2
    } = node;
    let patchFlagString;
    if (patchFlag) {
      {
        patchFlagString = String(patchFlag);
      }
    }
    if (directives) {
      push(helper(WITH_DIRECTIVES) + `(`);
    }
    if (isBlock) {
      push(`(${helper(OPEN_BLOCK)}(${disableTracking ? `true` : ``}), `);
    }
    if (pure) {
      push(PURE_ANNOTATION);
    }
    const callHelper = isBlock ? getVNodeBlockHelper(context.inSSR, isComponent2) : getVNodeHelper(context.inSSR, isComponent2);
    push(helper(callHelper) + `(`, -2, node);
    genNodeList(
      genNullableArgs([tag, props, children, patchFlagString, dynamicProps]),
      context
    );
    push(`)`);
    if (isBlock) {
      push(`)`);
    }
    if (directives) {
      push(`, `);
      genNode(directives, context);
      push(`)`);
    }
  }
  function genNullableArgs(args) {
    let i = args.length;
    while (i--) {
      if (args[i] != null) break;
    }
    return args.slice(0, i + 1).map((arg) => arg || `null`);
  }
  function genCallExpression(node, context) {
    const { push, helper, pure } = context;
    const callee = shared.isString(node.callee) ? node.callee : helper(node.callee);
    if (pure) {
      push(PURE_ANNOTATION);
    }
    push(callee + `(`, -2, node);
    genNodeList(node.arguments, context);
    push(`)`);
  }
  function genObjectExpression(node, context) {
    const { push, indent, deindent, newline } = context;
    const { properties } = node;
    if (!properties.length) {
      push(`{}`, -2, node);
      return;
    }
    const multilines = properties.length > 1 || properties.some((p) => p.value.type !== 4);
    push(multilines ? `{` : `{ `);
    multilines && indent();
    for (let i = 0; i < properties.length; i++) {
      const { key, value } = properties[i];
      genExpressionAsPropertyKey(key, context);
      push(`: `);
      genNode(value, context);
      if (i < properties.length - 1) {
        push(`,`);
        newline();
      }
    }
    multilines && deindent();
    push(multilines ? `}` : ` }`);
  }
  function genArrayExpression(node, context) {
    genNodeListAsArray(node.elements, context);
  }
  function genFunctionExpression(node, context) {
    const { push, indent, deindent } = context;
    const { params, returns, body, newline, isSlot } = node;
    if (isSlot) {
      push(`_${helperNameMap[WITH_CTX]}(`);
    }
    push(`(`, -2, node);
    if (shared.isArray(params)) {
      genNodeList(params, context);
    } else if (params) {
      genNode(params, context);
    }
    push(`) => `);
    if (newline || body) {
      push(`{`);
      indent();
    }
    if (returns) {
      if (newline) {
        push(`return `);
      }
      if (shared.isArray(returns)) {
        genNodeListAsArray(returns, context);
      } else {
        genNode(returns, context);
      }
    } else if (body) {
      genNode(body, context);
    }
    if (newline || body) {
      deindent();
      push(`}`);
    }
    if (isSlot) {
      if (node.isNonScopedSlot) {
        push(`, undefined, true`);
      }
      push(`)`);
    }
  }
  function genConditionalExpression(node, context) {
    const { test, consequent, alternate, newline: needNewline } = node;
    const { push, indent, deindent, newline } = context;
    if (test.type === 4) {
      const needsParens = !isSimpleIdentifier(test.content);
      needsParens && push(`(`);
      genExpression(test, context);
      needsParens && push(`)`);
    } else {
      push(`(`);
      genNode(test, context);
      push(`)`);
    }
    needNewline && indent();
    context.indentLevel++;
    needNewline || push(` `);
    push(`? `);
    genNode(consequent, context);
    context.indentLevel--;
    needNewline && newline();
    needNewline || push(` `);
    push(`: `);
    const isNested = alternate.type === 19;
    if (!isNested) {
      context.indentLevel++;
    }
    genNode(alternate, context);
    if (!isNested) {
      context.indentLevel--;
    }
    needNewline && deindent(
      true
      /* without newline */
    );
  }
  function genCacheExpression(node, context) {
    const { push, helper, indent, deindent, newline } = context;
    const { needPauseTracking, needArraySpread } = node;
    if (needArraySpread) {
      push(`[...(`);
    }
    push(`_cache[${node.index}] || (`);
    if (needPauseTracking) {
      indent();
      push(`${helper(SET_BLOCK_TRACKING)}(-1`);
      if (node.inVOnce) push(`, true`);
      push(`),`);
      newline();
      push(`(`);
    }
    push(`_cache[${node.index}] = `);
    genNode(node.value, context);
    if (needPauseTracking) {
      push(`).cacheIndex = ${node.index},`);
      newline();
      push(`${helper(SET_BLOCK_TRACKING)}(1),`);
      newline();
      push(`_cache[${node.index}]`);
      deindent();
    }
    push(`)`);
    if (needArraySpread) {
      push(`)]`);
    }
  }
  function genTemplateLiteral(node, context) {
    const { push, indent, deindent } = context;
    push("`");
    const l = node.elements.length;
    const multilines = l > 3;
    for (let i = 0; i < l; i++) {
      const e = node.elements[i];
      if (shared.isString(e)) {
        push(
          e.replace(/(`|\$|\\)/g, "\\$1"),
          -3
          /* Unknown */
        );
      } else {
        push("${");
        if (multilines) indent();
        genNode(e, context);
        if (multilines) deindent();
        push("}");
      }
    }
    push("`");
  }
  function genIfStatement(node, context) {
    const { push, indent, deindent } = context;
    const { test, consequent, alternate } = node;
    push(`if (`);
    genNode(test, context);
    push(`) {`);
    indent();
    genNode(consequent, context);
    deindent();
    push(`}`);
    if (alternate) {
      push(` else `);
      if (alternate.type === 23) {
        genIfStatement(alternate, context);
      } else {
        push(`{`);
        indent();
        genNode(alternate, context);
        deindent();
        push(`}`);
      }
    }
  }
  function genAssignmentExpression(node, context) {
    genNode(node.left, context);
    context.push(` = `);
    genNode(node.right, context);
  }
  function genSequenceExpression(node, context) {
    context.push(`(`);
    genNodeList(node.expressions, context);
    context.push(`)`);
  }
  function genReturnStatement({ returns }, context) {
    context.push(`return `);
    if (shared.isArray(returns)) {
      genNodeListAsArray(returns, context);
    } else {
      genNode(returns, context);
    }
  }
  const isLiteralWhitelisted = /* @__PURE__ */ shared.makeMap("true,false,null,this");
  const transformExpression = (node, context) => {
    if (node.type === 5) {
      node.content = processExpression(
        node.content,
        context
      );
    } else if (node.type === 1) {
      const memo = findDir(node, "memo");
      for (let i = 0; i < node.props.length; i++) {
        const dir = node.props[i];
        if (dir.type === 7 && dir.name !== "for") {
          const exp = dir.exp;
          const arg = dir.arg;
          if (exp && exp.type === 4 && !(dir.name === "on" && arg) && // key has been processed in transformFor(vMemo + vFor)
          !(memo && arg && arg.type === 4 && arg.content === "key")) {
            dir.exp = processExpression(
              exp,
              context,
              // slot args must be processed as function params
              dir.name === "slot"
            );
          }
          if (arg && arg.type === 4 && !arg.isStatic) {
            dir.arg = processExpression(arg, context);
          }
        }
      }
    }
  };
  function processExpression(node, context, asParams = false, asRawStatements = false, localVars = Object.create(context.identifiers)) {
    if (!context.prefixIdentifiers || !node.content.trim()) {
      return node;
    }
    const { inline, bindingMetadata } = context;
    const rewriteIdentifier = (raw, parent, id) => {
      const type = shared.hasOwn(bindingMetadata, raw) && bindingMetadata[raw];
      if (inline) {
        const isAssignmentLVal = parent && parent.type === "AssignmentExpression" && parent.left === id;
        const isUpdateArg = parent && parent.type === "UpdateExpression" && parent.argument === id;
        const isDestructureAssignment = parent && isInDestructureAssignment(parent, parentStack);
        const isNewExpression = parent && isInNewExpression(parentStack);
        const wrapWithUnref = (raw2) => {
          const wrapped = `${context.helperString(UNREF)}(${raw2})`;
          return isNewExpression ? `(${wrapped})` : wrapped;
        };
        if (isConst(type) || type === "setup-reactive-const" || localVars[raw]) {
          return raw;
        } else if (type === "setup-ref") {
          return `${raw}.value`;
        } else if (type === "setup-maybe-ref") {
          return isAssignmentLVal || isUpdateArg || isDestructureAssignment ? `${raw}.value` : wrapWithUnref(raw);
        } else if (type === "setup-let") {
          if (isAssignmentLVal) {
            const { right: rVal, operator } = parent;
            const rExp = rawExp.slice(rVal.start - 1, rVal.end - 1);
            const rExpString = stringifyExpression(
              processExpression(
                createSimpleExpression(rExp, false),
                context,
                false,
                false,
                knownIds
              )
            );
            return `${context.helperString(IS_REF)}(${raw})${context.isTS ? ` //@ts-ignore
` : ``} ? ${raw}.value ${operator} ${rExpString} : ${raw}`;
          } else if (isUpdateArg) {
            id.start = parent.start;
            id.end = parent.end;
            const { prefix: isPrefix, operator } = parent;
            const prefix = isPrefix ? operator : ``;
            const postfix = isPrefix ? `` : operator;
            return `${context.helperString(IS_REF)}(${raw})${context.isTS ? ` //@ts-ignore
` : ``} ? ${prefix}${raw}.value${postfix} : ${prefix}${raw}${postfix}`;
          } else if (isDestructureAssignment) {
            return raw;
          } else {
            return wrapWithUnref(raw);
          }
        } else if (type === "props") {
          return shared.genPropsAccessExp(raw);
        } else if (type === "props-aliased") {
          return shared.genPropsAccessExp(bindingMetadata.__propsAliases[raw]);
        }
      } else {
        if (type && type.startsWith("setup") || type === "literal-const") {
          return `$setup.${raw}`;
        } else if (type === "props-aliased") {
          return `$props['${bindingMetadata.__propsAliases[raw]}']`;
        } else if (type) {
          return `$${type}.${raw}`;
        }
      }
      return `_ctx.${raw}`;
    };
    const rawExp = node.content;
    let ast = node.ast;
    if (ast === false) {
      return node;
    }
    if (ast === null || !ast && isSimpleIdentifier(rawExp)) {
      const isScopeVarReference = context.identifiers[rawExp];
      const isAllowedGlobal = shared.isGloballyAllowed(rawExp);
      const isLiteral = isLiteralWhitelisted(rawExp);
      if (!asParams && !isScopeVarReference && !isLiteral && (!isAllowedGlobal || bindingMetadata[rawExp])) {
        if (isConst(bindingMetadata[rawExp])) {
          node.constType = 1;
        }
        node.content = rewriteIdentifier(rawExp);
      } else if (!isScopeVarReference) {
        if (isLiteral) {
          node.constType = 3;
        } else {
          node.constType = 2;
        }
      }
      return node;
    }
    if (!ast) {
      const source = asRawStatements ? ` ${rawExp} ` : `(${rawExp})${asParams ? `=>{}` : ``}`;
      try {
        ast = parser.parseExpression(source, {
          sourceType: "module",
          plugins: context.expressionPlugins
        });
      } catch (e) {
        context.onError(
          createCompilerError(
            45,
            node.loc,
            void 0,
            e.message
          )
        );
        return node;
      }
    }
    const ids = [];
    const parentStack = [];
    const knownIds = Object.create(context.identifiers);
    walkIdentifiers(
      ast,
      (node2, parent, _, isReferenced2, isLocal) => {
        if (isStaticPropertyKey(node2, parent)) {
          return;
        }
        if (node2.name.startsWith("_filter_")) {
          return;
        }
        const needPrefix = isReferenced2 && canPrefix(node2);
        if (needPrefix && !isLocal) {
          if (isStaticProperty(parent) && parent.shorthand) {
            node2.prefix = `${node2.name}: `;
          }
          node2.name = rewriteIdentifier(node2.name, parent, node2);
          ids.push(node2);
        } else {
          if (!(needPrefix && isLocal) && (!parent || parent.type !== "CallExpression" && parent.type !== "NewExpression" && parent.type !== "MemberExpression")) {
            node2.isConstant = true;
          }
          ids.push(node2);
        }
      },
      true,
      // invoke on ALL identifiers
      parentStack,
      knownIds
    );
    const children = [];
    ids.sort((a, b) => a.start - b.start);
    ids.forEach((id, i) => {
      const start = id.start - 1;
      const end = id.end - 1;
      const last = ids[i - 1];
      const leadingText = rawExp.slice(last ? last.end - 1 : 0, start);
      if (leadingText.length || id.prefix) {
        children.push(leadingText + (id.prefix || ``));
      }
      const source = rawExp.slice(start, end);
      children.push(
        createSimpleExpression(
          id.name,
          false,
          {
            start: advancePositionWithClone(node.loc.start, source, start),
            end: advancePositionWithClone(node.loc.start, source, end),
            source
          },
          id.isConstant ? 3 : 0
        )
      );
      if (i === ids.length - 1 && end < rawExp.length) {
        children.push(rawExp.slice(end));
      }
    });
    let ret;
    if (children.length) {
      ret = createCompoundExpression(children, node.loc);
      ret.ast = ast;
    } else {
      ret = node;
      ret.constType = 3;
    }
    ret.identifiers = Object.keys(knownIds);
    return ret;
  }
  function canPrefix(id) {
    if (shared.isGloballyAllowed(id.name)) {
      return false;
    }
    if (id.name === "require") {
      return false;
    }
    return true;
  }
  function stringifyExpression(exp) {
    if (shared.isString(exp)) {
      return exp;
    } else if (exp.type === 4) {
      return exp.content;
    } else {
      return exp.children.map(stringifyExpression).join("");
    }
  }
  function isConst(type) {
    return type === "setup-const" || type === "literal-const";
  }
  const transformIf = createStructuralDirectiveTransform(
    /^(if|else|else-if)$/,
    (node, dir, context) => {
      return processIf(node, dir, context, (ifNode, branch, isRoot) => {
        const siblings = context.parent.children;
        let i = siblings.indexOf(ifNode);
        let key = 0;
        while (i-- >= 0) {
          const sibling = siblings[i];
          if (sibling && sibling.type === 9) {
            key += sibling.branches.length;
          }
        }
        return () => {
          if (isRoot) {
            ifNode.codegenNode = createCodegenNodeForBranch(
              branch,
              key,
              context
            );
          } else {
            const parentCondition = getParentCondition(ifNode.codegenNode);
            parentCondition.alternate = createCodegenNodeForBranch(
              branch,
              key + ifNode.branches.length - 1,
              context
            );
          }
        };
      });
    }
  );
  function processIf(node, dir, context, processCodegen) {
    if (dir.name !== "else" && (!dir.exp || !dir.exp.content.trim())) {
      const loc = dir.exp ? dir.exp.loc : node.loc;
      context.onError(
        createCompilerError(28, dir.loc)
      );
      dir.exp = createSimpleExpression(`true`, false, loc);
    }
    if (context.prefixIdentifiers && dir.exp) {
      dir.exp = processExpression(dir.exp, context);
    }
    if (dir.name === "if") {
      const branch = createIfBranch(node, dir);
      const ifNode = {
        type: 9,
        loc: cloneLoc(node.loc),
        branches: [branch]
      };
      context.replaceNode(ifNode);
      if (processCodegen) {
        return processCodegen(ifNode, branch, true);
      }
    } else {
      const siblings = context.parent.children;
      let i = siblings.indexOf(node);
      while (i-- >= -1) {
        const sibling = siblings[i];
        if (sibling && sibling.type === 3) {
          context.removeNode(sibling);
          continue;
        }
        if (sibling && sibling.type === 2 && !sibling.content.trim().length) {
          context.removeNode(sibling);
          continue;
        }
        if (sibling && sibling.type === 9) {
          if (dir.name === "else-if" && sibling.branches[sibling.branches.length - 1].condition === void 0) {
            context.onError(
              createCompilerError(30, node.loc)
            );
          }
          context.removeNode();
          const branch = createIfBranch(node, dir);
          {
            const key = branch.userKey;
            if (key) {
              sibling.branches.forEach(({ userKey }) => {
                if (isSameKey(userKey, key)) {
                  context.onError(
                    createCompilerError(
                      29,
                      branch.userKey.loc
                    )
                  );
                }
              });
            }
          }
          sibling.branches.push(branch);
          const onExit = processCodegen && processCodegen(sibling, branch, false);
          traverseNode(branch, context);
          if (onExit) onExit();
          context.currentNode = null;
        } else {
          context.onError(
            createCompilerError(30, node.loc)
          );
        }
        break;
      }
    }
  }
  function createIfBranch(node, dir) {
    const isTemplateIf = node.tagType === 3;
    return {
      type: 10,
      loc: node.loc,
      condition: dir.name === "else" ? void 0 : dir.exp,
      children: isTemplateIf && !findDir(node, "for") ? node.children : [node],
      userKey: findProp(node, `key`),
      isTemplateIf
    };
  }
  function createCodegenNodeForBranch(branch, keyIndex, context) {
    if (branch.condition) {
      return createConditionalExpression(
        branch.condition,
        createChildrenCodegenNode(branch, keyIndex, context),
        // make sure to pass in asBlock: true so that the comment node call
        // closes the current block.
        createCallExpression(context.helper(CREATE_COMMENT), [
          '""',
          "true"
        ])
      );
    } else {
      return createChildrenCodegenNode(branch, keyIndex, context);
    }
  }
  function createChildrenCodegenNode(branch, keyIndex, context) {
    const { helper } = context;
    const keyProperty = createObjectProperty(
      `key`,
      createSimpleExpression(
        `${keyIndex}`,
        false,
        locStub,
        2
      )
    );
    const { children } = branch;
    const firstChild = children[0];
    const needFragmentWrapper = children.length !== 1 || firstChild.type !== 1;
    if (needFragmentWrapper) {
      if (children.length === 1 && firstChild.type === 11) {
        const vnodeCall = firstChild.codegenNode;
        injectProp(vnodeCall, keyProperty, context);
        return vnodeCall;
      } else {
        let patchFlag = 64;
        return createVNodeCall(
          context,
          helper(FRAGMENT),
          createObjectExpression([keyProperty]),
          children,
          patchFlag,
          void 0,
          void 0,
          true,
          false,
          false,
          branch.loc
        );
      }
    } else {
      const ret = firstChild.codegenNode;
      const vnodeCall = getMemoedVNodeCall(ret);
      if (vnodeCall.type === 13) {
        convertToBlock(vnodeCall, context);
      }
      injectProp(vnodeCall, keyProperty, context);
      return ret;
    }
  }
  function isSameKey(a, b) {
    if (!a || a.type !== b.type) {
      return false;
    }
    if (a.type === 6) {
      if (a.value.content !== b.value.content) {
        return false;
      }
    } else {
      const exp = a.exp;
      const branchExp = b.exp;
      if (exp.type !== branchExp.type) {
        return false;
      }
      if (exp.type !== 4 || exp.isStatic !== branchExp.isStatic || exp.content !== branchExp.content) {
        return false;
      }
    }
    return true;
  }
  function getParentCondition(node) {
    while (true) {
      if (node.type === 19) {
        if (node.alternate.type === 19) {
          node = node.alternate;
        } else {
          return node;
        }
      } else if (node.type === 20) {
        node = node.value;
      }
    }
  }
  const transformBind = (dir, _node, context) => {
    const { modifiers, loc } = dir;
    const arg = dir.arg;
    let { exp } = dir;
    if (exp && exp.type === 4 && !exp.content.trim()) {
      {
        context.onError(
          createCompilerError(34, loc)
        );
        return {
          props: [
            createObjectProperty(arg, createSimpleExpression("", true, loc))
          ]
        };
      }
    }
    if (!exp) {
      if (arg.type !== 4 || !arg.isStatic) {
        context.onError(
          createCompilerError(
            52,
            arg.loc
          )
        );
        return {
          props: [
            createObjectProperty(arg, createSimpleExpression("", true, loc))
          ]
        };
      }
      transformBindShorthand(dir, context);
      exp = dir.exp;
    }
    if (arg.type !== 4) {
      arg.children.unshift(`(`);
      arg.children.push(`) || ""`);
    } else if (!arg.isStatic) {
      arg.content = `${arg.content} || ""`;
    }
    if (modifiers.some((mod) => mod.content === "camel")) {
      if (arg.type === 4) {
        if (arg.isStatic) {
          arg.content = shared.camelize(arg.content);
        } else {
          arg.content = `${context.helperString(CAMELIZE)}(${arg.content})`;
        }
      } else {
        arg.children.unshift(`${context.helperString(CAMELIZE)}(`);
        arg.children.push(`)`);
      }
    }
    if (!context.inSSR) {
      if (modifiers.some((mod) => mod.content === "prop")) {
        injectPrefix(arg, ".");
      }
      if (modifiers.some((mod) => mod.content === "attr")) {
        injectPrefix(arg, "^");
      }
    }
    return {
      props: [createObjectProperty(arg, exp)]
    };
  };
  const transformBindShorthand = (dir, context) => {
    const arg = dir.arg;
    const propName = shared.camelize(arg.content);
    dir.exp = createSimpleExpression(propName, false, arg.loc);
    {
      dir.exp = processExpression(dir.exp, context);
    }
  };
  const injectPrefix = (arg, prefix) => {
    if (arg.type === 4) {
      if (arg.isStatic) {
        arg.content = prefix + arg.content;
      } else {
        arg.content = `\`${prefix}\${${arg.content}}\``;
      }
    } else {
      arg.children.unshift(`'${prefix}' + (`);
      arg.children.push(`)`);
    }
  };
  const transformFor = createStructuralDirectiveTransform(
    "for",
    (node, dir, context) => {
      const { helper, removeHelper } = context;
      return processFor(node, dir, context, (forNode) => {
        const renderExp = createCallExpression(helper(RENDER_LIST), [
          forNode.source
        ]);
        const isTemplate = isTemplateNode(node);
        const memo = findDir(node, "memo");
        const keyProp = findProp(node, `key`, false, true);
        const isDirKey = keyProp && keyProp.type === 7;
        if (isDirKey && !keyProp.exp) {
          transformBindShorthand(keyProp, context);
        }
        let keyExp = keyProp && (keyProp.type === 6 ? keyProp.value ? createSimpleExpression(keyProp.value.content, true) : void 0 : keyProp.exp);
        if (memo && keyExp && isDirKey) {
          {
            keyProp.exp = keyExp = processExpression(
              keyExp,
              context
            );
          }
        }
        const keyProperty = keyProp && keyExp ? createObjectProperty(`key`, keyExp) : null;
        if (isTemplate) {
          if (memo) {
            memo.exp = processExpression(
              memo.exp,
              context
            );
          }
          if (keyProperty && keyProp.type !== 6) {
            keyProperty.value = processExpression(
              keyProperty.value,
              context
            );
          }
        }
        const isStableFragment = forNode.source.type === 4 && forNode.source.constType > 0;
        const fragmentFlag = isStableFragment ? 64 : keyProp ? 128 : 256;
        forNode.codegenNode = createVNodeCall(
          context,
          helper(FRAGMENT),
          void 0,
          renderExp,
          fragmentFlag,
          void 0,
          void 0,
          true,
          !isStableFragment,
          false,
          node.loc
        );
        return () => {
          let childBlock;
          const { children } = forNode;
          if (isTemplate) {
            node.children.some((c) => {
              if (c.type === 1) {
                const key = findProp(c, "key");
                if (key) {
                  context.onError(
                    createCompilerError(
                      33,
                      key.loc
                    )
                  );
                  return true;
                }
              }
            });
          }
          const needFragmentWrapper = children.length !== 1 || children[0].type !== 1;
          const slotOutlet = isSlotOutlet(node) ? node : isTemplate && node.children.length === 1 && isSlotOutlet(node.children[0]) ? node.children[0] : null;
          if (slotOutlet) {
            childBlock = slotOutlet.codegenNode;
            if (isTemplate && keyProperty) {
              injectProp(childBlock, keyProperty, context);
            }
          } else if (needFragmentWrapper) {
            childBlock = createVNodeCall(
              context,
              helper(FRAGMENT),
              keyProperty ? createObjectExpression([keyProperty]) : void 0,
              node.children,
              64,
              void 0,
              void 0,
              true,
              void 0,
              false
            );
          } else {
            childBlock = children[0].codegenNode;
            if (isTemplate && keyProperty) {
              injectProp(childBlock, keyProperty, context);
            }
            if (childBlock.isBlock !== !isStableFragment) {
              if (childBlock.isBlock) {
                removeHelper(OPEN_BLOCK);
                removeHelper(
                  getVNodeBlockHelper(context.inSSR, childBlock.isComponent)
                );
              } else {
                removeHelper(
                  getVNodeHelper(context.inSSR, childBlock.isComponent)
                );
              }
            }
            childBlock.isBlock = !isStableFragment;
            if (childBlock.isBlock) {
              helper(OPEN_BLOCK);
              helper(getVNodeBlockHelper(context.inSSR, childBlock.isComponent));
            } else {
              helper(getVNodeHelper(context.inSSR, childBlock.isComponent));
            }
          }
          if (memo) {
            const loop = createFunctionExpression(
              createForLoopParams(forNode.parseResult, [
                createSimpleExpression(`_cached`)
              ])
            );
            loop.body = createBlockStatement([
              createCompoundExpression([`const _memo = (`, memo.exp, `)`]),
              createCompoundExpression([
                `if (_cached`,
                ...keyExp ? [` && _cached.key === `, keyExp] : [],
                ` && ${context.helperString(
                  IS_MEMO_SAME
                )}(_cached, _memo)) return _cached`
              ]),
              createCompoundExpression([`const _item = `, childBlock]),
              createSimpleExpression(`_item.memo = _memo`),
              createSimpleExpression(`return _item`)
            ]);
            renderExp.arguments.push(
              loop,
              createSimpleExpression(`_cache`),
              createSimpleExpression(String(context.cached.length))
            );
            context.cached.push(null);
          } else {
            renderExp.arguments.push(
              createFunctionExpression(
                createForLoopParams(forNode.parseResult),
                childBlock,
                true
              )
            );
          }
        };
      });
    }
  );
  function processFor(node, dir, context, processCodegen) {
    if (!dir.exp) {
      context.onError(
        createCompilerError(31, dir.loc)
      );
      return;
    }
    const parseResult = dir.forParseResult;
    if (!parseResult) {
      context.onError(
        createCompilerError(32, dir.loc)
      );
      return;
    }
    finalizeForParseResult(parseResult, context);
    const { addIdentifiers, removeIdentifiers, scopes } = context;
    const { source, value, key, index } = parseResult;
    const forNode = {
      type: 11,
      loc: dir.loc,
      source,
      valueAlias: value,
      keyAlias: key,
      objectIndexAlias: index,
      parseResult,
      children: isTemplateNode(node) ? node.children : [node]
    };
    context.replaceNode(forNode);
    scopes.vFor++;
    if (context.prefixIdentifiers) {
      value && addIdentifiers(value);
      key && addIdentifiers(key);
      index && addIdentifiers(index);
    }
    const onExit = processCodegen && processCodegen(forNode);
    return () => {
      scopes.vFor--;
      if (context.prefixIdentifiers) {
        value && removeIdentifiers(value);
        key && removeIdentifiers(key);
        index && removeIdentifiers(index);
      }
      if (onExit) onExit();
    };
  }
  function finalizeForParseResult(result, context) {
    if (result.finalized) return;
    if (context.prefixIdentifiers) {
      result.source = processExpression(
        result.source,
        context
      );
      if (result.key) {
        result.key = processExpression(
          result.key,
          context,
          true
        );
      }
      if (result.index) {
        result.index = processExpression(
          result.index,
          context,
          true
        );
      }
      if (result.value) {
        result.value = processExpression(
          result.value,
          context,
          true
        );
      }
    }
    result.finalized = true;
  }
  function createForLoopParams({ value, key, index }, memoArgs = []) {
    return createParamsList([value, key, index, ...memoArgs]);
  }
  function createParamsList(args) {
    let i = args.length;
    while (i--) {
      if (args[i]) break;
    }
    return args.slice(0, i + 1).map((arg, i2) => arg || createSimpleExpression(`_`.repeat(i2 + 1), false));
  }
  const defaultFallback = createSimpleExpression(`undefined`, false);
  const trackSlotScopes = (node, context) => {
    if (node.type === 1 && (node.tagType === 1 || node.tagType === 3)) {
      const vSlot = findDir(node, "slot");
      if (vSlot) {
        const slotProps = vSlot.exp;
        if (context.prefixIdentifiers) {
          slotProps && context.addIdentifiers(slotProps);
        }
        context.scopes.vSlot++;
        return () => {
          if (context.prefixIdentifiers) {
            slotProps && context.removeIdentifiers(slotProps);
          }
          context.scopes.vSlot--;
        };
      }
    }
  };
  const trackVForSlotScopes = (node, context) => {
    let vFor;
    if (isTemplateNode(node) && node.props.some(isVSlot) && (vFor = findDir(node, "for"))) {
      const result = vFor.forParseResult;
      if (result) {
        finalizeForParseResult(result, context);
        const { value, key, index } = result;
        const { addIdentifiers, removeIdentifiers } = context;
        value && addIdentifiers(value);
        key && addIdentifiers(key);
        index && addIdentifiers(index);
        return () => {
          value && removeIdentifiers(value);
          key && removeIdentifiers(key);
          index && removeIdentifiers(index);
        };
      }
    }
  };
  const buildClientSlotFn = (props, _vForExp, children, loc) => createFunctionExpression(
    props,
    children,
    false,
    true,
    children.length ? children[0].loc : loc
  );
  function buildSlots(node, context, buildSlotFn = buildClientSlotFn) {
    context.helper(WITH_CTX);
    const { children, loc } = node;
    const slotsProperties = [];
    const dynamicSlots = [];
    let hasDynamicSlots = context.scopes.vSlot > 0 || context.scopes.vFor > 0;
    if (!context.ssr && context.prefixIdentifiers) {
      hasDynamicSlots = hasScopeRef(node, context.identifiers);
    }
    const onComponentSlot = findDir(node, "slot", true);
    if (onComponentSlot) {
      const { arg, exp } = onComponentSlot;
      if (arg && !isStaticExp(arg)) {
        hasDynamicSlots = true;
      }
      slotsProperties.push(
        createObjectProperty(
          arg || createSimpleExpression("default", true),
          buildSlotFn(exp, void 0, children, loc)
        )
      );
    }
    let hasTemplateSlots = false;
    let hasNamedDefaultSlot = false;
    const implicitDefaultChildren = [];
    const seenSlotNames = /* @__PURE__ */ new Set();
    let conditionalBranchIndex = 0;
    for (let i = 0; i < children.length; i++) {
      const slotElement = children[i];
      let slotDir;
      if (!isTemplateNode(slotElement) || !(slotDir = findDir(slotElement, "slot", true))) {
        if (slotElement.type !== 3) {
          implicitDefaultChildren.push(slotElement);
        }
        continue;
      }
      if (onComponentSlot) {
        context.onError(
          createCompilerError(37, slotDir.loc)
        );
        break;
      }
      hasTemplateSlots = true;
      const { children: slotChildren, loc: slotLoc } = slotElement;
      const {
        arg: slotName = createSimpleExpression(`default`, true),
        exp: slotProps,
        loc: dirLoc
      } = slotDir;
      let staticSlotName;
      if (isStaticExp(slotName)) {
        staticSlotName = slotName ? slotName.content : `default`;
      } else {
        hasDynamicSlots = true;
      }
      const vFor = findDir(slotElement, "for");
      const slotFunction = buildSlotFn(slotProps, vFor, slotChildren, slotLoc);
      let vIf;
      let vElse;
      if (vIf = findDir(slotElement, "if")) {
        hasDynamicSlots = true;
        dynamicSlots.push(
          createConditionalExpression(
            vIf.exp,
            buildDynamicSlot(slotName, slotFunction, conditionalBranchIndex++),
            defaultFallback
          )
        );
      } else if (vElse = findDir(
        slotElement,
        /^else(-if)?$/,
        true
        /* allowEmpty */
      )) {
        let j = i;
        let prev;
        while (j--) {
          prev = children[j];
          if (prev.type !== 3) {
            break;
          }
        }
        if (prev && isTemplateNode(prev) && findDir(prev, /^(else-)?if$/)) {
          let conditional = dynamicSlots[dynamicSlots.length - 1];
          while (conditional.alternate.type === 19) {
            conditional = conditional.alternate;
          }
          conditional.alternate = vElse.exp ? createConditionalExpression(
            vElse.exp,
            buildDynamicSlot(
              slotName,
              slotFunction,
              conditionalBranchIndex++
            ),
            defaultFallback
          ) : buildDynamicSlot(slotName, slotFunction, conditionalBranchIndex++);
        } else {
          context.onError(
            createCompilerError(30, vElse.loc)
          );
        }
      } else if (vFor) {
        hasDynamicSlots = true;
        const parseResult = vFor.forParseResult;
        if (parseResult) {
          finalizeForParseResult(parseResult, context);
          dynamicSlots.push(
            createCallExpression(context.helper(RENDER_LIST), [
              parseResult.source,
              createFunctionExpression(
                createForLoopParams(parseResult),
                buildDynamicSlot(slotName, slotFunction),
                true
              )
            ])
          );
        } else {
          context.onError(
            createCompilerError(
              32,
              vFor.loc
            )
          );
        }
      } else {
        if (staticSlotName) {
          if (seenSlotNames.has(staticSlotName)) {
            context.onError(
              createCompilerError(
                38,
                dirLoc
              )
            );
            continue;
          }
          seenSlotNames.add(staticSlotName);
          if (staticSlotName === "default") {
            hasNamedDefaultSlot = true;
          }
        }
        slotsProperties.push(createObjectProperty(slotName, slotFunction));
      }
    }
    if (!onComponentSlot) {
      const buildDefaultSlotProperty = (props, children2) => {
        const fn = buildSlotFn(props, void 0, children2, loc);
        if (context.compatConfig) {
          fn.isNonScopedSlot = true;
        }
        return createObjectProperty(`default`, fn);
      };
      if (!hasTemplateSlots) {
        slotsProperties.push(buildDefaultSlotProperty(void 0, children));
      } else if (implicitDefaultChildren.length && // #3766
      // with whitespace: 'preserve', whitespaces between slots will end up in
      // implicitDefaultChildren. Ignore if all implicit children are whitespaces.
      implicitDefaultChildren.some((node2) => isNonWhitespaceContent(node2))) {
        if (hasNamedDefaultSlot) {
          context.onError(
            createCompilerError(
              39,
              implicitDefaultChildren[0].loc
            )
          );
        } else {
          slotsProperties.push(
            buildDefaultSlotProperty(void 0, implicitDefaultChildren)
          );
        }
      }
    }
    const slotFlag = hasDynamicSlots ? 2 : hasForwardedSlots(node.children) ? 3 : 1;
    let slots = createObjectExpression(
      slotsProperties.concat(
        createObjectProperty(
          `_`,
          // 2 = compiled but dynamic = can skip normalization, but must run diff
          // 1 = compiled and static = can skip normalization AND diff as optimized
          createSimpleExpression(
            slotFlag + ``,
            false
          )
        )
      ),
      loc
    );
    if (dynamicSlots.length) {
      slots = createCallExpression(context.helper(CREATE_SLOTS), [
        slots,
        createArrayExpression(dynamicSlots)
      ]);
    }
    return {
      slots,
      hasDynamicSlots
    };
  }
  function buildDynamicSlot(name, fn, index) {
    const props = [
      createObjectProperty(`name`, name),
      createObjectProperty(`fn`, fn)
    ];
    if (index != null) {
      props.push(
        createObjectProperty(`key`, createSimpleExpression(String(index), true))
      );
    }
    return createObjectExpression(props);
  }
  function hasForwardedSlots(children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      switch (child.type) {
        case 1:
          if (child.tagType === 2 || hasForwardedSlots(child.children)) {
            return true;
          }
          break;
        case 9:
          if (hasForwardedSlots(child.branches)) return true;
          break;
        case 10:
        case 11:
          if (hasForwardedSlots(child.children)) return true;
          break;
      }
    }
    return false;
  }
  function isNonWhitespaceContent(node) {
    if (node.type !== 2 && node.type !== 12)
      return true;
    return node.type === 2 ? !!node.content.trim() : isNonWhitespaceContent(node.content);
  }
  const directiveImportMap = /* @__PURE__ */ new WeakMap();
  const transformElement = (node, context) => {
    return function postTransformElement() {
      node = context.currentNode;
      if (!(node.type === 1 && (node.tagType === 0 || node.tagType === 1))) {
        return;
      }
      const { tag, props } = node;
      const isComponent2 = node.tagType === 1;
      let vnodeTag = isComponent2 ? resolveComponentType(node, context) : `"${tag}"`;
      const isDynamicComponent = shared.isObject(vnodeTag) && vnodeTag.callee === RESOLVE_DYNAMIC_COMPONENT;
      let vnodeProps;
      let vnodeChildren;
      let patchFlag = 0;
      let vnodeDynamicProps;
      let dynamicPropNames;
      let vnodeDirectives;
      let shouldUseBlock = (
        // dynamic component may resolve to plain elements
        isDynamicComponent || vnodeTag === TELEPORT || vnodeTag === SUSPENSE || !isComponent2 && // <svg> and <foreignObject> must be forced into blocks so that block
        // updates inside get proper isSVG flag at runtime. (#639, #643)
        // This is technically web-specific, but splitting the logic out of core
        // leads to too much unnecessary complexity.
        (tag === "svg" || tag === "foreignObject" || tag === "math")
      );
      if (props.length > 0) {
        const propsBuildResult = buildProps(
          node,
          context,
          void 0,
          isComponent2,
          isDynamicComponent
        );
        vnodeProps = propsBuildResult.props;
        patchFlag = propsBuildResult.patchFlag;
        dynamicPropNames = propsBuildResult.dynamicPropNames;
        const directives = propsBuildResult.directives;
        vnodeDirectives = directives && directives.length ? createArrayExpression(
          directives.map((dir) => buildDirectiveArgs(dir, context))
        ) : void 0;
        if (propsBuildResult.shouldUseBlock) {
          shouldUseBlock = true;
        }
      }
      if (node.children.length > 0) {
        if (vnodeTag === KEEP_ALIVE) {
          shouldUseBlock = true;
          patchFlag |= 1024;
        }
        const shouldBuildAsSlots = isComponent2 && // Teleport is not a real component and has dedicated runtime handling
        vnodeTag !== TELEPORT && // explained above.
        vnodeTag !== KEEP_ALIVE;
        if (shouldBuildAsSlots) {
          const { slots, hasDynamicSlots } = buildSlots(node, context);
          vnodeChildren = slots;
          if (hasDynamicSlots) {
            patchFlag |= 1024;
          }
        } else if (node.children.length === 1 && vnodeTag !== TELEPORT) {
          const child = node.children[0];
          const type = child.type;
          const hasDynamicTextChild = type === 5 || type === 8;
          if (hasDynamicTextChild && getConstantType(child, context) === 0) {
            patchFlag |= 1;
          }
          if (hasDynamicTextChild || type === 2) {
            vnodeChildren = child;
          } else {
            vnodeChildren = node.children;
          }
        } else {
          vnodeChildren = node.children;
        }
      }
      if (dynamicPropNames && dynamicPropNames.length) {
        vnodeDynamicProps = stringifyDynamicPropNames(dynamicPropNames);
      }
      node.codegenNode = createVNodeCall(
        context,
        vnodeTag,
        vnodeProps,
        vnodeChildren,
        patchFlag === 0 ? void 0 : patchFlag,
        vnodeDynamicProps,
        vnodeDirectives,
        !!shouldUseBlock,
        false,
        isComponent2,
        node.loc
      );
    };
  };
  function resolveComponentType(node, context, ssr = false) {
    let { tag } = node;
    const isExplicitDynamic = isComponentTag(tag);
    const isProp = findProp(
      node,
      "is",
      false,
      true
      /* allow empty */
    );
    if (isProp) {
      if (isExplicitDynamic || isCompatEnabled(
        "COMPILER_IS_ON_ELEMENT",
        context
      )) {
        let exp;
        if (isProp.type === 6) {
          exp = isProp.value && createSimpleExpression(isProp.value.content, true);
        } else {
          exp = isProp.exp;
          if (!exp) {
            exp = createSimpleExpression(`is`, false, isProp.arg.loc);
            {
              exp = isProp.exp = processExpression(exp, context);
            }
          }
        }
        if (exp) {
          return createCallExpression(context.helper(RESOLVE_DYNAMIC_COMPONENT), [
            exp
          ]);
        }
      } else if (isProp.type === 6 && isProp.value.content.startsWith("vue:")) {
        tag = isProp.value.content.slice(4);
      }
    }
    const builtIn = isCoreComponent(tag) || context.isBuiltInComponent(tag);
    if (builtIn) {
      if (!ssr) context.helper(builtIn);
      return builtIn;
    }
    {
      const fromSetup = resolveSetupReference(tag, context);
      if (fromSetup) {
        return fromSetup;
      }
      const dotIndex = tag.indexOf(".");
      if (dotIndex > 0) {
        const ns = resolveSetupReference(tag.slice(0, dotIndex), context);
        if (ns) {
          return ns + tag.slice(dotIndex);
        }
      }
    }
    if (context.selfName && shared.capitalize(shared.camelize(tag)) === context.selfName) {
      context.helper(RESOLVE_COMPONENT);
      context.components.add(tag + `__self`);
      return toValidAssetId(tag, `component`);
    }
    context.helper(RESOLVE_COMPONENT);
    context.components.add(tag);
    return toValidAssetId(tag, `component`);
  }
  function resolveSetupReference(name, context) {
    const bindings = context.bindingMetadata;
    if (!bindings || bindings.__isScriptSetup === false) {
      return;
    }
    const camelName = shared.camelize(name);
    const PascalName = shared.capitalize(camelName);
    const checkType = (type) => {
      if (bindings[name] === type) {
        return name;
      }
      if (bindings[camelName] === type) {
        return camelName;
      }
      if (bindings[PascalName] === type) {
        return PascalName;
      }
    };
    const fromConst = checkType("setup-const") || checkType("setup-reactive-const") || checkType("literal-const");
    if (fromConst) {
      return context.inline ? (
        // in inline mode, const setup bindings (e.g. imports) can be used as-is
        fromConst
      ) : `$setup[${JSON.stringify(fromConst)}]`;
    }
    const fromMaybeRef = checkType("setup-let") || checkType("setup-ref") || checkType("setup-maybe-ref");
    if (fromMaybeRef) {
      return context.inline ? (
        // setup scope bindings that may be refs need to be unrefed
        `${context.helperString(UNREF)}(${fromMaybeRef})`
      ) : `$setup[${JSON.stringify(fromMaybeRef)}]`;
    }
    const fromProps = checkType("props");
    if (fromProps) {
      return `${context.helperString(UNREF)}(${context.inline ? "__props" : "$props"}[${JSON.stringify(fromProps)}])`;
    }
  }
  function buildProps(node, context, props = node.props, isComponent2, isDynamicComponent, ssr = false) {
    const { tag, loc: elementLoc, children } = node;
    let properties = [];
    const mergeArgs = [];
    const runtimeDirectives = [];
    const hasChildren = children.length > 0;
    let shouldUseBlock = false;
    let patchFlag = 0;
    let hasRef = false;
    let hasClassBinding = false;
    let hasStyleBinding = false;
    let hasHydrationEventBinding = false;
    let hasDynamicKeys = false;
    let hasVnodeHook = false;
    const dynamicPropNames = [];
    const pushMergeArg = (arg) => {
      if (properties.length) {
        mergeArgs.push(
          createObjectExpression(dedupeProperties(properties), elementLoc)
        );
        properties = [];
      }
      if (arg) mergeArgs.push(arg);
    };
    const pushRefVForMarker = () => {
      if (context.scopes.vFor > 0) {
        properties.push(
          createObjectProperty(
            createSimpleExpression("ref_for", true),
            createSimpleExpression("true")
          )
        );
      }
    };
    const analyzePatchFlag = ({ key, value }) => {
      if (isStaticExp(key)) {
        const name = key.content;
        const isEventHandler = shared.isOn(name);
        if (isEventHandler && (!isComponent2 || isDynamicComponent) && // omit the flag for click handlers because hydration gives click
        // dedicated fast path.
        name.toLowerCase() !== "onclick" && // omit v-model handlers
        name !== "onUpdate:modelValue" && // omit onVnodeXXX hooks
        !shared.isReservedProp(name)) {
          hasHydrationEventBinding = true;
        }
        if (isEventHandler && shared.isReservedProp(name)) {
          hasVnodeHook = true;
        }
        if (isEventHandler && value.type === 14) {
          value = value.arguments[0];
        }
        if (value.type === 20 || (value.type === 4 || value.type === 8) && getConstantType(value, context) > 0) {
          return;
        }
        if (name === "ref") {
          hasRef = true;
        } else if (name === "class") {
          hasClassBinding = true;
        } else if (name === "style") {
          hasStyleBinding = true;
        } else if (name !== "key" && !dynamicPropNames.includes(name)) {
          dynamicPropNames.push(name);
        }
        if (isComponent2 && (name === "class" || name === "style") && !dynamicPropNames.includes(name)) {
          dynamicPropNames.push(name);
        }
      } else {
        hasDynamicKeys = true;
      }
    };
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (prop.type === 6) {
        const { loc, name, nameLoc, value } = prop;
        let isStatic = true;
        if (name === "ref") {
          hasRef = true;
          pushRefVForMarker();
          if (value && context.inline) {
            const binding = context.bindingMetadata[value.content];
            if (binding === "setup-let" || binding === "setup-ref" || binding === "setup-maybe-ref") {
              isStatic = false;
              properties.push(
                createObjectProperty(
                  createSimpleExpression("ref_key", true),
                  createSimpleExpression(value.content, true, value.loc)
                )
              );
            }
          }
        }
        if (name === "is" && (isComponentTag(tag) || value && value.content.startsWith("vue:") || isCompatEnabled(
          "COMPILER_IS_ON_ELEMENT",
          context
        ))) {
          continue;
        }
        properties.push(
          createObjectProperty(
            createSimpleExpression(name, true, nameLoc),
            createSimpleExpression(
              value ? value.content : "",
              isStatic,
              value ? value.loc : loc
            )
          )
        );
      } else {
        const { name, arg, exp, loc, modifiers } = prop;
        const isVBind = name === "bind";
        const isVOn = name === "on";
        if (name === "slot") {
          if (!isComponent2) {
            context.onError(
              createCompilerError(40, loc)
            );
          }
          continue;
        }
        if (name === "once" || name === "memo") {
          continue;
        }
        if (name === "is" || isVBind && isStaticArgOf(arg, "is") && (isComponentTag(tag) || isCompatEnabled(
          "COMPILER_IS_ON_ELEMENT",
          context
        ))) {
          continue;
        }
        if (isVOn && ssr) {
          continue;
        }
        if (
          // #938: elements with dynamic keys should be forced into blocks
          isVBind && isStaticArgOf(arg, "key") || // inline before-update hooks need to force block so that it is invoked
          // before children
          isVOn && hasChildren && isStaticArgOf(arg, "vue:before-update")
        ) {
          shouldUseBlock = true;
        }
        if (isVBind && isStaticArgOf(arg, "ref")) {
          pushRefVForMarker();
        }
        if (!arg && (isVBind || isVOn)) {
          hasDynamicKeys = true;
          if (exp) {
            if (isVBind) {
              {
                pushMergeArg();
                if (isCompatEnabled(
                  "COMPILER_V_BIND_OBJECT_ORDER",
                  context
                )) {
                  mergeArgs.unshift(exp);
                  continue;
                }
              }
              pushRefVForMarker();
              pushMergeArg();
              mergeArgs.push(exp);
            } else {
              pushMergeArg({
                type: 14,
                loc,
                callee: context.helper(TO_HANDLERS),
                arguments: isComponent2 ? [exp] : [exp, `true`]
              });
            }
          } else {
            context.onError(
              createCompilerError(
                isVBind ? 34 : 35,
                loc
              )
            );
          }
          continue;
        }
        if (isVBind && modifiers.some((mod) => mod.content === "prop")) {
          patchFlag |= 32;
        }
        const directiveTransform = context.directiveTransforms[name];
        if (directiveTransform) {
          const { props: props2, needRuntime } = directiveTransform(prop, node, context);
          !ssr && props2.forEach(analyzePatchFlag);
          if (isVOn && arg && !isStaticExp(arg)) {
            pushMergeArg(createObjectExpression(props2, elementLoc));
          } else {
            properties.push(...props2);
          }
          if (needRuntime) {
            runtimeDirectives.push(prop);
            if (shared.isSymbol(needRuntime)) {
              directiveImportMap.set(prop, needRuntime);
            }
          }
        } else if (!shared.isBuiltInDirective(name)) {
          runtimeDirectives.push(prop);
          if (hasChildren) {
            shouldUseBlock = true;
          }
        }
      }
    }
    let propsExpression = void 0;
    if (mergeArgs.length) {
      pushMergeArg();
      if (mergeArgs.length > 1) {
        propsExpression = createCallExpression(
          context.helper(MERGE_PROPS),
          mergeArgs,
          elementLoc
        );
      } else {
        propsExpression = mergeArgs[0];
      }
    } else if (properties.length) {
      propsExpression = createObjectExpression(
        dedupeProperties(properties),
        elementLoc
      );
    }
    if (hasDynamicKeys) {
      patchFlag |= 16;
    } else {
      if (hasClassBinding && !isComponent2) {
        patchFlag |= 2;
      }
      if (hasStyleBinding && !isComponent2) {
        patchFlag |= 4;
      }
      if (dynamicPropNames.length) {
        patchFlag |= 8;
      }
      if (hasHydrationEventBinding) {
        patchFlag |= 32;
      }
    }
    if (!shouldUseBlock && (patchFlag === 0 || patchFlag === 32) && (hasRef || hasVnodeHook || runtimeDirectives.length > 0)) {
      patchFlag |= 512;
    }
    if (!context.inSSR && propsExpression) {
      switch (propsExpression.type) {
        case 15:
          let classKeyIndex = -1;
          let styleKeyIndex = -1;
          let hasDynamicKey = false;
          for (let i = 0; i < propsExpression.properties.length; i++) {
            const key = propsExpression.properties[i].key;
            if (isStaticExp(key)) {
              if (key.content === "class") {
                classKeyIndex = i;
              } else if (key.content === "style") {
                styleKeyIndex = i;
              }
            } else if (!key.isHandlerKey) {
              hasDynamicKey = true;
            }
          }
          const classProp = propsExpression.properties[classKeyIndex];
          const styleProp = propsExpression.properties[styleKeyIndex];
          if (!hasDynamicKey) {
            if (classProp && !isStaticExp(classProp.value)) {
              classProp.value = createCallExpression(
                context.helper(NORMALIZE_CLASS),
                [classProp.value]
              );
            }
            if (styleProp && // the static style is compiled into an object,
            // so use `hasStyleBinding` to ensure that it is a dynamic style binding
            (hasStyleBinding || styleProp.value.type === 4 && styleProp.value.content.trim()[0] === `[` || // v-bind:style and style both exist,
            // v-bind:style with static literal object
            styleProp.value.type === 17)) {
              styleProp.value = createCallExpression(
                context.helper(NORMALIZE_STYLE),
                [styleProp.value]
              );
            }
          } else {
            propsExpression = createCallExpression(
              context.helper(NORMALIZE_PROPS),
              [propsExpression]
            );
          }
          break;
        case 14:
          break;
        default:
          propsExpression = createCallExpression(
            context.helper(NORMALIZE_PROPS),
            [
              createCallExpression(context.helper(GUARD_REACTIVE_PROPS), [
                propsExpression
              ])
            ]
          );
          break;
      }
    }
    return {
      props: propsExpression,
      directives: runtimeDirectives,
      patchFlag,
      dynamicPropNames,
      shouldUseBlock
    };
  }
  function dedupeProperties(properties) {
    const knownProps = /* @__PURE__ */ new Map();
    const deduped = [];
    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i];
      if (prop.key.type === 8 || !prop.key.isStatic) {
        deduped.push(prop);
        continue;
      }
      const name = prop.key.content;
      const existing = knownProps.get(name);
      if (existing) {
        if (name === "style" || name === "class" || shared.isOn(name)) {
          mergeAsArray(existing, prop);
        }
      } else {
        knownProps.set(name, prop);
        deduped.push(prop);
      }
    }
    return deduped;
  }
  function mergeAsArray(existing, incoming) {
    if (existing.value.type === 17) {
      existing.value.elements.push(incoming.value);
    } else {
      existing.value = createArrayExpression(
        [existing.value, incoming.value],
        existing.loc
      );
    }
  }
  function buildDirectiveArgs(dir, context) {
    const dirArgs = [];
    const runtime = directiveImportMap.get(dir);
    if (runtime) {
      dirArgs.push(context.helperString(runtime));
    } else {
      const fromSetup = resolveSetupReference("v-" + dir.name, context);
      if (fromSetup) {
        dirArgs.push(fromSetup);
      } else {
        context.helper(RESOLVE_DIRECTIVE);
        context.directives.add(dir.name);
        dirArgs.push(toValidAssetId(dir.name, `directive`));
      }
    }
    const { loc } = dir;
    if (dir.exp) dirArgs.push(dir.exp);
    if (dir.arg) {
      if (!dir.exp) {
        dirArgs.push(`void 0`);
      }
      dirArgs.push(dir.arg);
    }
    if (Object.keys(dir.modifiers).length) {
      if (!dir.arg) {
        if (!dir.exp) {
          dirArgs.push(`void 0`);
        }
        dirArgs.push(`void 0`);
      }
      const trueExpression = createSimpleExpression(`true`, false, loc);
      dirArgs.push(
        createObjectExpression(
          dir.modifiers.map(
            (modifier) => createObjectProperty(modifier, trueExpression)
          ),
          loc
        )
      );
    }
    return createArrayExpression(dirArgs, dir.loc);
  }
  function stringifyDynamicPropNames(props) {
    let propsNamesString = `[`;
    for (let i = 0, l = props.length; i < l; i++) {
      propsNamesString += JSON.stringify(props[i]);
      if (i < l - 1) propsNamesString += ", ";
    }
    return propsNamesString + `]`;
  }
  function isComponentTag(tag) {
    return tag === "component" || tag === "Component";
  }
  const transformSlotOutlet = (node, context) => {
    if (isSlotOutlet(node)) {
      const { children, loc } = node;
      const { slotName, slotProps } = processSlotOutlet(node, context);
      const slotArgs = [
        context.prefixIdentifiers ? `_ctx.$slots` : `$slots`,
        slotName,
        "{}",
        "undefined",
        "true"
      ];
      let expectedLen = 2;
      if (slotProps) {
        slotArgs[2] = slotProps;
        expectedLen = 3;
      }
      if (children.length) {
        slotArgs[3] = createFunctionExpression([], children, false, false, loc);
        expectedLen = 4;
      }
      if (context.scopeId && !context.slotted) {
        expectedLen = 5;
      }
      slotArgs.splice(expectedLen);
      node.codegenNode = createCallExpression(
        context.helper(RENDER_SLOT),
        slotArgs,
        loc
      );
    }
  };
  function processSlotOutlet(node, context) {
    let slotName = `"default"`;
    let slotProps = void 0;
    const nonNameProps = [];
    for (let i = 0; i < node.props.length; i++) {
      const p = node.props[i];
      if (p.type === 6) {
        if (p.value) {
          if (p.name === "name") {
            slotName = JSON.stringify(p.value.content);
          } else {
            p.name = shared.camelize(p.name);
            nonNameProps.push(p);
          }
        }
      } else {
        if (p.name === "bind" && isStaticArgOf(p.arg, "name")) {
          if (p.exp) {
            slotName = p.exp;
          } else if (p.arg && p.arg.type === 4) {
            const name = shared.camelize(p.arg.content);
            slotName = p.exp = createSimpleExpression(name, false, p.arg.loc);
            {
              slotName = p.exp = processExpression(p.exp, context);
            }
          }
        } else {
          if (p.name === "bind" && p.arg && isStaticExp(p.arg)) {
            p.arg.content = shared.camelize(p.arg.content);
          }
          nonNameProps.push(p);
        }
      }
    }
    if (nonNameProps.length > 0) {
      const { props, directives } = buildProps(
        node,
        context,
        nonNameProps,
        false,
        false
      );
      slotProps = props;
      if (directives.length) {
        context.onError(
          createCompilerError(
            36,
            directives[0].loc
          )
        );
      }
    }
    return {
      slotName,
      slotProps
    };
  }
  const transformOn = (dir, node, context, augmentor) => {
    const { loc, modifiers, arg } = dir;
    if (!dir.exp && !modifiers.length) {
      context.onError(createCompilerError(35, loc));
    }
    let eventName;
    if (arg.type === 4) {
      if (arg.isStatic) {
        let rawName = arg.content;
        if (rawName.startsWith("vue:")) {
          rawName = `vnode-${rawName.slice(4)}`;
        }
        const eventString = node.tagType !== 0 || rawName.startsWith("vnode") || !/[A-Z]/.test(rawName) ? (
          // for non-element and vnode lifecycle event listeners, auto convert
          // it to camelCase. See issue #2249
          shared.toHandlerKey(shared.camelize(rawName))
        ) : (
          // preserve case for plain element listeners that have uppercase
          // letters, as these may be custom elements' custom events
          `on:${rawName}`
        );
        eventName = createSimpleExpression(eventString, true, arg.loc);
      } else {
        eventName = createCompoundExpression([
          `${context.helperString(TO_HANDLER_KEY)}(`,
          arg,
          `)`
        ]);
      }
    } else {
      eventName = arg;
      eventName.children.unshift(`${context.helperString(TO_HANDLER_KEY)}(`);
      eventName.children.push(`)`);
    }
    let exp = dir.exp;
    if (exp && !exp.content.trim()) {
      exp = void 0;
    }
    let shouldCache = context.cacheHandlers && !exp && !context.inVOnce;
    if (exp) {
      const isMemberExp = isMemberExpression(exp, context);
      const isInlineStatement = !(isMemberExp || isFnExpression(exp, context));
      const hasMultipleStatements = exp.content.includes(`;`);
      if (context.prefixIdentifiers) {
        isInlineStatement && context.addIdentifiers(`$event`);
        exp = dir.exp = processExpression(
          exp,
          context,
          false,
          hasMultipleStatements
        );
        isInlineStatement && context.removeIdentifiers(`$event`);
        shouldCache = context.cacheHandlers && // unnecessary to cache inside v-once
        !context.inVOnce && // runtime constants don't need to be cached
        // (this is analyzed by compileScript in SFC <script setup>)
        !(exp.type === 4 && exp.constType > 0) && // #1541 bail if this is a member exp handler passed to a component -
        // we need to use the original function to preserve arity,
        // e.g. <transition> relies on checking cb.length to determine
        // transition end handling. Inline function is ok since its arity
        // is preserved even when cached.
        !(isMemberExp && node.tagType === 1) && // bail if the function references closure variables (v-for, v-slot)
        // it must be passed fresh to avoid stale values.
        !hasScopeRef(exp, context.identifiers);
        if (shouldCache && isMemberExp) {
          if (exp.type === 4) {
            exp.content = `${exp.content} && ${exp.content}(...args)`;
          } else {
            exp.children = [...exp.children, ` && `, ...exp.children, `(...args)`];
          }
        }
      }
      if (isInlineStatement || shouldCache && isMemberExp) {
        exp = createCompoundExpression([
          `${isInlineStatement ? context.isTS ? `($event: any)` : `$event` : `${context.isTS ? `
//@ts-ignore
` : ``}(...args)`} => ${hasMultipleStatements ? `{` : `(`}`,
          exp,
          hasMultipleStatements ? `}` : `)`
        ]);
      }
    }
    let ret = {
      props: [
        createObjectProperty(
          eventName,
          exp || createSimpleExpression(`() => {}`, false, loc)
        )
      ]
    };
    if (augmentor) {
      ret = augmentor(ret);
    }
    if (shouldCache) {
      ret.props[0].value = context.cache(ret.props[0].value);
    }
    ret.props.forEach((p) => p.key.isHandlerKey = true);
    return ret;
  };
  const transformText = (node, context) => {
    if (node.type === 0 || node.type === 1 || node.type === 11 || node.type === 10) {
      return () => {
        const children = node.children;
        let currentContainer = void 0;
        let hasText = false;
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (isText$1(child)) {
            hasText = true;
            for (let j = i + 1; j < children.length; j++) {
              const next = children[j];
              if (isText$1(next)) {
                if (!currentContainer) {
                  currentContainer = children[i] = createCompoundExpression(
                    [child],
                    child.loc
                  );
                }
                currentContainer.children.push(` + `, next);
                children.splice(j, 1);
                j--;
              } else {
                currentContainer = void 0;
                break;
              }
            }
          }
        }
        if (!hasText || // if this is a plain element with a single text child, leave it
        // as-is since the runtime has dedicated fast path for this by directly
        // setting textContent of the element.
        // for component root it's always normalized anyway.
        children.length === 1 && (node.type === 0 || node.type === 1 && node.tagType === 0 && // #3756
        // custom directives can potentially add DOM elements arbitrarily,
        // we need to avoid setting textContent of the element at runtime
        // to avoid accidentally overwriting the DOM elements added
        // by the user through custom directives.
        !node.props.find(
          (p) => p.type === 7 && !context.directiveTransforms[p.name]
        ) && // in compat mode, <template> tags with no special directives
        // will be rendered as a fragment so its children must be
        // converted into vnodes.
        !(node.tag === "template"))) {
          return;
        }
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (isText$1(child) || child.type === 8) {
            const callArgs = [];
            if (child.type !== 2 || child.content !== " ") {
              callArgs.push(child);
            }
            if (!context.ssr && getConstantType(child, context) === 0) {
              callArgs.push(
                `1`
              );
            }
            children[i] = {
              type: 12,
              content: child,
              loc: child.loc,
              codegenNode: createCallExpression(
                context.helper(CREATE_TEXT),
                callArgs
              )
            };
          }
        }
      };
    }
  };
  const seen$1 = /* @__PURE__ */ new WeakSet();
  const transformOnce = (node, context) => {
    if (node.type === 1 && findDir(node, "once", true)) {
      if (seen$1.has(node) || context.inVOnce || context.inSSR) {
        return;
      }
      seen$1.add(node);
      context.inVOnce = true;
      context.helper(SET_BLOCK_TRACKING);
      return () => {
        context.inVOnce = false;
        const cur = context.currentNode;
        if (cur.codegenNode) {
          cur.codegenNode = context.cache(
            cur.codegenNode,
            true,
            true
          );
        }
      };
    }
  };
  const transformModel = (dir, node, context) => {
    const { exp, arg } = dir;
    if (!exp) {
      context.onError(
        createCompilerError(41, dir.loc)
      );
      return createTransformProps();
    }
    const rawExp = exp.loc.source.trim();
    const expString = exp.type === 4 ? exp.content : rawExp;
    const bindingType = context.bindingMetadata[rawExp];
    if (bindingType === "props" || bindingType === "props-aliased") {
      context.onError(createCompilerError(44, exp.loc));
      return createTransformProps();
    }
    const maybeRef = context.inline && (bindingType === "setup-let" || bindingType === "setup-ref" || bindingType === "setup-maybe-ref");
    if (!expString.trim() || !isMemberExpression(exp, context) && !maybeRef) {
      context.onError(
        createCompilerError(42, exp.loc)
      );
      return createTransformProps();
    }
    if (context.prefixIdentifiers && isSimpleIdentifier(expString) && context.identifiers[expString]) {
      context.onError(
        createCompilerError(43, exp.loc)
      );
      return createTransformProps();
    }
    const propName = arg ? arg : createSimpleExpression("modelValue", true);
    const eventName = arg ? isStaticExp(arg) ? `onUpdate:${shared.camelize(arg.content)}` : createCompoundExpression(['"onUpdate:" + ', arg]) : `onUpdate:modelValue`;
    let assignmentExp;
    const eventArg = context.isTS ? `($event: any)` : `$event`;
    if (maybeRef) {
      if (bindingType === "setup-ref") {
        assignmentExp = createCompoundExpression([
          `${eventArg} => ((`,
          createSimpleExpression(rawExp, false, exp.loc),
          `).value = $event)`
        ]);
      } else {
        const altAssignment = bindingType === "setup-let" ? `${rawExp} = $event` : `null`;
        assignmentExp = createCompoundExpression([
          `${eventArg} => (${context.helperString(IS_REF)}(${rawExp}) ? (`,
          createSimpleExpression(rawExp, false, exp.loc),
          `).value = $event : ${altAssignment})`
        ]);
      }
    } else {
      assignmentExp = createCompoundExpression([
        `${eventArg} => ((`,
        exp,
        `) = $event)`
      ]);
    }
    const props = [
      // modelValue: foo
      createObjectProperty(propName, dir.exp),
      // "onUpdate:modelValue": $event => (foo = $event)
      createObjectProperty(eventName, assignmentExp)
    ];
    if (context.prefixIdentifiers && !context.inVOnce && context.cacheHandlers && !hasScopeRef(exp, context.identifiers)) {
      props[1].value = context.cache(props[1].value);
    }
    if (dir.modifiers.length && node.tagType === 1) {
      const modifiers = dir.modifiers.map((m) => m.content).map((m) => (isSimpleIdentifier(m) ? m : JSON.stringify(m)) + `: true`).join(`, `);
      const modifiersKey = arg ? isStaticExp(arg) ? `${arg.content}Modifiers` : createCompoundExpression([arg, ' + "Modifiers"']) : `modelModifiers`;
      props.push(
        createObjectProperty(
          modifiersKey,
          createSimpleExpression(
            `{ ${modifiers} }`,
            false,
            dir.loc,
            2
          )
        )
      );
    }
    return createTransformProps(props);
  };
  function createTransformProps(props = []) {
    return { props };
  }
  const validDivisionCharRE = /[\w).+\-_$\]]/;
  const transformFilter = (node, context) => {
    if (!isCompatEnabled("COMPILER_FILTERS", context)) {
      return;
    }
    if (node.type === 5) {
      rewriteFilter(node.content, context);
    } else if (node.type === 1) {
      node.props.forEach((prop) => {
        if (prop.type === 7 && prop.name !== "for" && prop.exp) {
          rewriteFilter(prop.exp, context);
        }
      });
    }
  };
  function rewriteFilter(node, context) {
    if (node.type === 4) {
      parseFilter(node, context);
    } else {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (typeof child !== "object") continue;
        if (child.type === 4) {
          parseFilter(child, context);
        } else if (child.type === 8) {
          rewriteFilter(node, context);
        } else if (child.type === 5) {
          rewriteFilter(child.content, context);
        }
      }
    }
  }
  function parseFilter(node, context) {
    const exp = node.content;
    let inSingle = false;
    let inDouble = false;
    let inTemplateString = false;
    let inRegex = false;
    let curly = 0;
    let square = 0;
    let paren = 0;
    let lastFilterIndex = 0;
    let c, prev, i, expression, filters = [];
    for (i = 0; i < exp.length; i++) {
      prev = c;
      c = exp.charCodeAt(i);
      if (inSingle) {
        if (c === 39 && prev !== 92) inSingle = false;
      } else if (inDouble) {
        if (c === 34 && prev !== 92) inDouble = false;
      } else if (inTemplateString) {
        if (c === 96 && prev !== 92) inTemplateString = false;
      } else if (inRegex) {
        if (c === 47 && prev !== 92) inRegex = false;
      } else if (c === 124 && // pipe
      exp.charCodeAt(i + 1) !== 124 && exp.charCodeAt(i - 1) !== 124 && !curly && !square && !paren) {
        if (expression === void 0) {
          lastFilterIndex = i + 1;
          expression = exp.slice(0, i).trim();
        } else {
          pushFilter();
        }
      } else {
        switch (c) {
          case 34:
            inDouble = true;
            break;
          // "
          case 39:
            inSingle = true;
            break;
          // '
          case 96:
            inTemplateString = true;
            break;
          // `
          case 40:
            paren++;
            break;
          // (
          case 41:
            paren--;
            break;
          // )
          case 91:
            square++;
            break;
          // [
          case 93:
            square--;
            break;
          // ]
          case 123:
            curly++;
            break;
          // {
          case 125:
            curly--;
            break;
        }
        if (c === 47) {
          let j = i - 1;
          let p;
          for (; j >= 0; j--) {
            p = exp.charAt(j);
            if (p !== " ") break;
          }
          if (!p || !validDivisionCharRE.test(p)) {
            inRegex = true;
          }
        }
      }
    }
    if (expression === void 0) {
      expression = exp.slice(0, i).trim();
    } else if (lastFilterIndex !== 0) {
      pushFilter();
    }
    function pushFilter() {
      filters.push(exp.slice(lastFilterIndex, i).trim());
      lastFilterIndex = i + 1;
    }
    if (filters.length) {
      for (i = 0; i < filters.length; i++) {
        expression = wrapFilter(expression, filters[i], context);
      }
      node.content = expression;
      node.ast = void 0;
    }
  }
  function wrapFilter(exp, filter, context) {
    context.helper(RESOLVE_FILTER);
    const i = filter.indexOf("(");
    if (i < 0) {
      context.filters.add(filter);
      return `${toValidAssetId(filter, "filter")}(${exp})`;
    } else {
      const name = filter.slice(0, i);
      const args = filter.slice(i + 1);
      context.filters.add(name);
      return `${toValidAssetId(name, "filter")}(${exp}${args !== ")" ? "," + args : args}`;
    }
  }
  const seen = /* @__PURE__ */ new WeakSet();
  const transformMemo = (node, context) => {
    if (node.type === 1) {
      const dir = findDir(node, "memo");
      if (!dir || seen.has(node)) {
        return;
      }
      seen.add(node);
      return () => {
        const codegenNode = node.codegenNode || context.currentNode.codegenNode;
        if (codegenNode && codegenNode.type === 13) {
          if (node.tagType !== 1) {
            convertToBlock(codegenNode, context);
          }
          node.codegenNode = createCallExpression(context.helper(WITH_MEMO), [
            dir.exp,
            createFunctionExpression(void 0, codegenNode),
            `_cache`,
            String(context.cached.length)
          ]);
          context.cached.push(null);
        }
      };
    }
  };
  function getBaseTransformPreset(prefixIdentifiers) {
    return [
      [
        transformOnce,
        transformIf,
        transformMemo,
        transformFor,
        ...[transformFilter],
        ...prefixIdentifiers ? [
          // order is important
          trackVForSlotScopes,
          transformExpression
        ] : [],
        transformSlotOutlet,
        transformElement,
        trackSlotScopes,
        transformText
      ],
      {
        on: transformOn,
        bind: transformBind,
        model: transformModel
      }
    ];
  }
  function baseCompile(source, options = {}) {
    const onError = options.onError || defaultOnError;
    const isModuleMode = options.mode === "module";
    const prefixIdentifiers = options.prefixIdentifiers === true || isModuleMode;
    if (!prefixIdentifiers && options.cacheHandlers) {
      onError(createCompilerError(49));
    }
    if (options.scopeId && !isModuleMode) {
      onError(createCompilerError(50));
    }
    const resolvedOptions = shared.extend({}, options, {
      prefixIdentifiers
    });
    const ast = shared.isString(source) ? baseParse(source, resolvedOptions) : source;
    const [nodeTransforms, directiveTransforms] = getBaseTransformPreset(prefixIdentifiers);
    if (options.isTS) {
      const { expressionPlugins } = options;
      if (!expressionPlugins || !expressionPlugins.includes("typescript")) {
        options.expressionPlugins = [...expressionPlugins || [], "typescript"];
      }
    }
    transform(
      ast,
      shared.extend({}, resolvedOptions, {
        nodeTransforms: [
          ...nodeTransforms,
          ...options.nodeTransforms || []
          // user transforms
        ],
        directiveTransforms: shared.extend(
          {},
          directiveTransforms,
          options.directiveTransforms || {}
          // user transforms
        )
      })
    );
    return generate(ast, resolvedOptions);
  }
  const BindingTypes = {
    "DATA": "data",
    "PROPS": "props",
    "PROPS_ALIASED": "props-aliased",
    "SETUP_LET": "setup-let",
    "SETUP_CONST": "setup-const",
    "SETUP_REACTIVE_CONST": "setup-reactive-const",
    "SETUP_MAYBE_REF": "setup-maybe-ref",
    "SETUP_REF": "setup-ref",
    "OPTIONS": "options",
    "LITERAL_CONST": "literal-const"
  };
  const noopDirectiveTransform = () => ({ props: [] });
  compilerCore_cjs_prod.generateCodeFrame = shared.generateCodeFrame;
  compilerCore_cjs_prod.BASE_TRANSITION = BASE_TRANSITION;
  compilerCore_cjs_prod.BindingTypes = BindingTypes;
  compilerCore_cjs_prod.CAMELIZE = CAMELIZE;
  compilerCore_cjs_prod.CAPITALIZE = CAPITALIZE;
  compilerCore_cjs_prod.CREATE_BLOCK = CREATE_BLOCK;
  compilerCore_cjs_prod.CREATE_COMMENT = CREATE_COMMENT;
  compilerCore_cjs_prod.CREATE_ELEMENT_BLOCK = CREATE_ELEMENT_BLOCK;
  compilerCore_cjs_prod.CREATE_ELEMENT_VNODE = CREATE_ELEMENT_VNODE;
  compilerCore_cjs_prod.CREATE_SLOTS = CREATE_SLOTS;
  compilerCore_cjs_prod.CREATE_STATIC = CREATE_STATIC;
  compilerCore_cjs_prod.CREATE_TEXT = CREATE_TEXT;
  compilerCore_cjs_prod.CREATE_VNODE = CREATE_VNODE;
  compilerCore_cjs_prod.CompilerDeprecationTypes = CompilerDeprecationTypes;
  compilerCore_cjs_prod.ConstantTypes = ConstantTypes;
  compilerCore_cjs_prod.ElementTypes = ElementTypes;
  compilerCore_cjs_prod.ErrorCodes = ErrorCodes;
  compilerCore_cjs_prod.FRAGMENT = FRAGMENT;
  compilerCore_cjs_prod.GUARD_REACTIVE_PROPS = GUARD_REACTIVE_PROPS;
  compilerCore_cjs_prod.IS_MEMO_SAME = IS_MEMO_SAME;
  compilerCore_cjs_prod.IS_REF = IS_REF;
  compilerCore_cjs_prod.KEEP_ALIVE = KEEP_ALIVE;
  compilerCore_cjs_prod.MERGE_PROPS = MERGE_PROPS;
  compilerCore_cjs_prod.NORMALIZE_CLASS = NORMALIZE_CLASS;
  compilerCore_cjs_prod.NORMALIZE_PROPS = NORMALIZE_PROPS;
  compilerCore_cjs_prod.NORMALIZE_STYLE = NORMALIZE_STYLE;
  compilerCore_cjs_prod.Namespaces = Namespaces;
  compilerCore_cjs_prod.NodeTypes = NodeTypes;
  compilerCore_cjs_prod.OPEN_BLOCK = OPEN_BLOCK;
  compilerCore_cjs_prod.POP_SCOPE_ID = POP_SCOPE_ID;
  compilerCore_cjs_prod.PUSH_SCOPE_ID = PUSH_SCOPE_ID;
  compilerCore_cjs_prod.RENDER_LIST = RENDER_LIST;
  compilerCore_cjs_prod.RENDER_SLOT = RENDER_SLOT;
  compilerCore_cjs_prod.RESOLVE_COMPONENT = RESOLVE_COMPONENT;
  compilerCore_cjs_prod.RESOLVE_DIRECTIVE = RESOLVE_DIRECTIVE;
  compilerCore_cjs_prod.RESOLVE_DYNAMIC_COMPONENT = RESOLVE_DYNAMIC_COMPONENT;
  compilerCore_cjs_prod.RESOLVE_FILTER = RESOLVE_FILTER;
  compilerCore_cjs_prod.SET_BLOCK_TRACKING = SET_BLOCK_TRACKING;
  compilerCore_cjs_prod.SUSPENSE = SUSPENSE;
  compilerCore_cjs_prod.TELEPORT = TELEPORT;
  compilerCore_cjs_prod.TO_DISPLAY_STRING = TO_DISPLAY_STRING;
  compilerCore_cjs_prod.TO_HANDLERS = TO_HANDLERS;
  compilerCore_cjs_prod.TO_HANDLER_KEY = TO_HANDLER_KEY;
  compilerCore_cjs_prod.TS_NODE_TYPES = TS_NODE_TYPES;
  compilerCore_cjs_prod.UNREF = UNREF;
  compilerCore_cjs_prod.WITH_CTX = WITH_CTX;
  compilerCore_cjs_prod.WITH_DIRECTIVES = WITH_DIRECTIVES;
  compilerCore_cjs_prod.WITH_MEMO = WITH_MEMO;
  compilerCore_cjs_prod.advancePositionWithClone = advancePositionWithClone;
  compilerCore_cjs_prod.advancePositionWithMutation = advancePositionWithMutation;
  compilerCore_cjs_prod.assert = assert;
  compilerCore_cjs_prod.baseCompile = baseCompile;
  compilerCore_cjs_prod.baseParse = baseParse;
  compilerCore_cjs_prod.buildDirectiveArgs = buildDirectiveArgs;
  compilerCore_cjs_prod.buildProps = buildProps;
  compilerCore_cjs_prod.buildSlots = buildSlots;
  compilerCore_cjs_prod.checkCompatEnabled = checkCompatEnabled;
  compilerCore_cjs_prod.convertToBlock = convertToBlock;
  compilerCore_cjs_prod.createArrayExpression = createArrayExpression;
  compilerCore_cjs_prod.createAssignmentExpression = createAssignmentExpression;
  compilerCore_cjs_prod.createBlockStatement = createBlockStatement;
  compilerCore_cjs_prod.createCacheExpression = createCacheExpression;
  compilerCore_cjs_prod.createCallExpression = createCallExpression;
  compilerCore_cjs_prod.createCompilerError = createCompilerError;
  compilerCore_cjs_prod.createCompoundExpression = createCompoundExpression;
  compilerCore_cjs_prod.createConditionalExpression = createConditionalExpression;
  compilerCore_cjs_prod.createForLoopParams = createForLoopParams;
  compilerCore_cjs_prod.createFunctionExpression = createFunctionExpression;
  compilerCore_cjs_prod.createIfStatement = createIfStatement;
  compilerCore_cjs_prod.createInterpolation = createInterpolation;
  compilerCore_cjs_prod.createObjectExpression = createObjectExpression;
  compilerCore_cjs_prod.createObjectProperty = createObjectProperty;
  compilerCore_cjs_prod.createReturnStatement = createReturnStatement;
  compilerCore_cjs_prod.createRoot = createRoot;
  compilerCore_cjs_prod.createSequenceExpression = createSequenceExpression;
  compilerCore_cjs_prod.createSimpleExpression = createSimpleExpression;
  compilerCore_cjs_prod.createStructuralDirectiveTransform = createStructuralDirectiveTransform;
  compilerCore_cjs_prod.createTemplateLiteral = createTemplateLiteral;
  compilerCore_cjs_prod.createTransformContext = createTransformContext;
  compilerCore_cjs_prod.createVNodeCall = createVNodeCall;
  compilerCore_cjs_prod.errorMessages = errorMessages;
  compilerCore_cjs_prod.extractIdentifiers = extractIdentifiers;
  compilerCore_cjs_prod.findDir = findDir;
  compilerCore_cjs_prod.findProp = findProp;
  compilerCore_cjs_prod.forAliasRE = forAliasRE;
  compilerCore_cjs_prod.generate = generate;
  compilerCore_cjs_prod.getBaseTransformPreset = getBaseTransformPreset;
  compilerCore_cjs_prod.getConstantType = getConstantType;
  compilerCore_cjs_prod.getMemoedVNodeCall = getMemoedVNodeCall;
  compilerCore_cjs_prod.getVNodeBlockHelper = getVNodeBlockHelper;
  compilerCore_cjs_prod.getVNodeHelper = getVNodeHelper;
  compilerCore_cjs_prod.hasDynamicKeyVBind = hasDynamicKeyVBind;
  compilerCore_cjs_prod.hasScopeRef = hasScopeRef;
  compilerCore_cjs_prod.helperNameMap = helperNameMap;
  compilerCore_cjs_prod.injectProp = injectProp;
  compilerCore_cjs_prod.isCoreComponent = isCoreComponent;
  compilerCore_cjs_prod.isFnExpression = isFnExpression;
  compilerCore_cjs_prod.isFnExpressionBrowser = isFnExpressionBrowser;
  compilerCore_cjs_prod.isFnExpressionNode = isFnExpressionNode;
  compilerCore_cjs_prod.isFunctionType = isFunctionType;
  compilerCore_cjs_prod.isInDestructureAssignment = isInDestructureAssignment;
  compilerCore_cjs_prod.isInNewExpression = isInNewExpression;
  compilerCore_cjs_prod.isMemberExpression = isMemberExpression;
  compilerCore_cjs_prod.isMemberExpressionBrowser = isMemberExpressionBrowser;
  compilerCore_cjs_prod.isMemberExpressionNode = isMemberExpressionNode;
  compilerCore_cjs_prod.isReferencedIdentifier = isReferencedIdentifier;
  compilerCore_cjs_prod.isSimpleIdentifier = isSimpleIdentifier;
  compilerCore_cjs_prod.isSlotOutlet = isSlotOutlet;
  compilerCore_cjs_prod.isStaticArgOf = isStaticArgOf;
  compilerCore_cjs_prod.isStaticExp = isStaticExp;
  compilerCore_cjs_prod.isStaticProperty = isStaticProperty;
  compilerCore_cjs_prod.isStaticPropertyKey = isStaticPropertyKey;
  compilerCore_cjs_prod.isTemplateNode = isTemplateNode;
  compilerCore_cjs_prod.isText = isText$1;
  compilerCore_cjs_prod.isVSlot = isVSlot;
  compilerCore_cjs_prod.locStub = locStub;
  compilerCore_cjs_prod.noopDirectiveTransform = noopDirectiveTransform;
  compilerCore_cjs_prod.processExpression = processExpression;
  compilerCore_cjs_prod.processFor = processFor;
  compilerCore_cjs_prod.processIf = processIf;
  compilerCore_cjs_prod.processSlotOutlet = processSlotOutlet;
  compilerCore_cjs_prod.registerRuntimeHelpers = registerRuntimeHelpers;
  compilerCore_cjs_prod.resolveComponentType = resolveComponentType;
  compilerCore_cjs_prod.stringifyExpression = stringifyExpression;
  compilerCore_cjs_prod.toValidAssetId = toValidAssetId;
  compilerCore_cjs_prod.trackSlotScopes = trackSlotScopes;
  compilerCore_cjs_prod.trackVForSlotScopes = trackVForSlotScopes;
  compilerCore_cjs_prod.transform = transform;
  compilerCore_cjs_prod.transformBind = transformBind;
  compilerCore_cjs_prod.transformElement = transformElement;
  compilerCore_cjs_prod.transformExpression = transformExpression;
  compilerCore_cjs_prod.transformModel = transformModel;
  compilerCore_cjs_prod.transformOn = transformOn;
  compilerCore_cjs_prod.traverseNode = traverseNode;
  compilerCore_cjs_prod.unwrapTSNode = unwrapTSNode;
  compilerCore_cjs_prod.walkBlockDeclarations = walkBlockDeclarations;
  compilerCore_cjs_prod.walkFunctionParams = walkFunctionParams;
  compilerCore_cjs_prod.walkIdentifiers = walkIdentifiers;
  compilerCore_cjs_prod.warnDeprecation = warnDeprecation;
  return compilerCore_cjs_prod;
}
/**
* @vue/compiler-dom v3.5.16
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var hasRequiredCompilerDom_cjs_prod;
function requireCompilerDom_cjs_prod() {
  if (hasRequiredCompilerDom_cjs_prod) return compilerDom_cjs_prod;
  hasRequiredCompilerDom_cjs_prod = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var compilerCore = requireCompilerCore_cjs_prod();
    var shared = /* @__PURE__ */ requireShared_cjs_prod();
    const V_MODEL_RADIO = Symbol(``);
    const V_MODEL_CHECKBOX = Symbol(
      ``
    );
    const V_MODEL_TEXT = Symbol(``);
    const V_MODEL_SELECT = Symbol(
      ``
    );
    const V_MODEL_DYNAMIC = Symbol(
      ``
    );
    const V_ON_WITH_MODIFIERS = Symbol(
      ``
    );
    const V_ON_WITH_KEYS = Symbol(
      ``
    );
    const V_SHOW = Symbol(``);
    const TRANSITION = Symbol(``);
    const TRANSITION_GROUP = Symbol(
      ``
    );
    compilerCore.registerRuntimeHelpers({
      [V_MODEL_RADIO]: `vModelRadio`,
      [V_MODEL_CHECKBOX]: `vModelCheckbox`,
      [V_MODEL_TEXT]: `vModelText`,
      [V_MODEL_SELECT]: `vModelSelect`,
      [V_MODEL_DYNAMIC]: `vModelDynamic`,
      [V_ON_WITH_MODIFIERS]: `withModifiers`,
      [V_ON_WITH_KEYS]: `withKeys`,
      [V_SHOW]: `vShow`,
      [TRANSITION]: `Transition`,
      [TRANSITION_GROUP]: `TransitionGroup`
    });
    const parserOptions = {
      parseMode: "html",
      isVoidTag: shared.isVoidTag,
      isNativeTag: (tag) => shared.isHTMLTag(tag) || shared.isSVGTag(tag) || shared.isMathMLTag(tag),
      isPreTag: (tag) => tag === "pre",
      isIgnoreNewlineTag: (tag) => tag === "pre" || tag === "textarea",
      decodeEntities: void 0,
      isBuiltInComponent: (tag) => {
        if (tag === "Transition" || tag === "transition") {
          return TRANSITION;
        } else if (tag === "TransitionGroup" || tag === "transition-group") {
          return TRANSITION_GROUP;
        }
      },
      // https://html.spec.whatwg.org/multipage/parsing.html#tree-construction-dispatcher
      getNamespace(tag, parent, rootNamespace) {
        let ns = parent ? parent.ns : rootNamespace;
        if (parent && ns === 2) {
          if (parent.tag === "annotation-xml") {
            if (tag === "svg") {
              return 1;
            }
            if (parent.props.some(
              (a) => a.type === 6 && a.name === "encoding" && a.value != null && (a.value.content === "text/html" || a.value.content === "application/xhtml+xml")
            )) {
              ns = 0;
            }
          } else if (/^m(?:[ions]|text)$/.test(parent.tag) && tag !== "mglyph" && tag !== "malignmark") {
            ns = 0;
          }
        } else if (parent && ns === 1) {
          if (parent.tag === "foreignObject" || parent.tag === "desc" || parent.tag === "title") {
            ns = 0;
          }
        }
        if (ns === 0) {
          if (tag === "svg") {
            return 1;
          }
          if (tag === "math") {
            return 2;
          }
        }
        return ns;
      }
    };
    const transformStyle = (node) => {
      if (node.type === 1) {
        node.props.forEach((p, i) => {
          if (p.type === 6 && p.name === "style" && p.value) {
            node.props[i] = {
              type: 7,
              name: `bind`,
              arg: compilerCore.createSimpleExpression(`style`, true, p.loc),
              exp: parseInlineCSS(p.value.content, p.loc),
              modifiers: [],
              loc: p.loc
            };
          }
        });
      }
    };
    const parseInlineCSS = (cssText, loc) => {
      const normalized = shared.parseStringStyle(cssText);
      return compilerCore.createSimpleExpression(
        JSON.stringify(normalized),
        false,
        loc,
        3
      );
    };
    function createDOMCompilerError(code, loc) {
      return compilerCore.createCompilerError(
        code,
        loc,
        DOMErrorMessages
      );
    }
    const DOMErrorCodes = {
      "X_V_HTML_NO_EXPRESSION": 53,
      "53": "X_V_HTML_NO_EXPRESSION",
      "X_V_HTML_WITH_CHILDREN": 54,
      "54": "X_V_HTML_WITH_CHILDREN",
      "X_V_TEXT_NO_EXPRESSION": 55,
      "55": "X_V_TEXT_NO_EXPRESSION",
      "X_V_TEXT_WITH_CHILDREN": 56,
      "56": "X_V_TEXT_WITH_CHILDREN",
      "X_V_MODEL_ON_INVALID_ELEMENT": 57,
      "57": "X_V_MODEL_ON_INVALID_ELEMENT",
      "X_V_MODEL_ARG_ON_ELEMENT": 58,
      "58": "X_V_MODEL_ARG_ON_ELEMENT",
      "X_V_MODEL_ON_FILE_INPUT_ELEMENT": 59,
      "59": "X_V_MODEL_ON_FILE_INPUT_ELEMENT",
      "X_V_MODEL_UNNECESSARY_VALUE": 60,
      "60": "X_V_MODEL_UNNECESSARY_VALUE",
      "X_V_SHOW_NO_EXPRESSION": 61,
      "61": "X_V_SHOW_NO_EXPRESSION",
      "X_TRANSITION_INVALID_CHILDREN": 62,
      "62": "X_TRANSITION_INVALID_CHILDREN",
      "X_IGNORED_SIDE_EFFECT_TAG": 63,
      "63": "X_IGNORED_SIDE_EFFECT_TAG",
      "__EXTEND_POINT__": 64,
      "64": "__EXTEND_POINT__"
    };
    const DOMErrorMessages = {
      [53]: `v-html is missing expression.`,
      [54]: `v-html will override element children.`,
      [55]: `v-text is missing expression.`,
      [56]: `v-text will override element children.`,
      [57]: `v-model can only be used on <input>, <textarea> and <select> elements.`,
      [58]: `v-model argument is not supported on plain elements.`,
      [59]: `v-model cannot be used on file inputs since they are read-only. Use a v-on:change listener instead.`,
      [60]: `Unnecessary value binding used alongside v-model. It will interfere with v-model's behavior.`,
      [61]: `v-show is missing expression.`,
      [62]: `<Transition> expects exactly one child element or component.`,
      [63]: `Tags with side effect (<script> and <style>) are ignored in client component templates.`
    };
    const transformVHtml = (dir, node, context) => {
      const { exp, loc } = dir;
      if (!exp) {
        context.onError(
          createDOMCompilerError(53, loc)
        );
      }
      if (node.children.length) {
        context.onError(
          createDOMCompilerError(54, loc)
        );
        node.children.length = 0;
      }
      return {
        props: [
          compilerCore.createObjectProperty(
            compilerCore.createSimpleExpression(`innerHTML`, true, loc),
            exp || compilerCore.createSimpleExpression("", true)
          )
        ]
      };
    };
    const transformVText = (dir, node, context) => {
      const { exp, loc } = dir;
      if (!exp) {
        context.onError(
          createDOMCompilerError(55, loc)
        );
      }
      if (node.children.length) {
        context.onError(
          createDOMCompilerError(56, loc)
        );
        node.children.length = 0;
      }
      return {
        props: [
          compilerCore.createObjectProperty(
            compilerCore.createSimpleExpression(`textContent`, true),
            exp ? compilerCore.getConstantType(exp, context) > 0 ? exp : compilerCore.createCallExpression(
              context.helperString(compilerCore.TO_DISPLAY_STRING),
              [exp],
              loc
            ) : compilerCore.createSimpleExpression("", true)
          )
        ]
      };
    };
    const transformModel = (dir, node, context) => {
      const baseResult = compilerCore.transformModel(dir, node, context);
      if (!baseResult.props.length || node.tagType === 1) {
        return baseResult;
      }
      if (dir.arg) {
        context.onError(
          createDOMCompilerError(
            58,
            dir.arg.loc
          )
        );
      }
      const { tag } = node;
      const isCustomElement = context.isCustomElement(tag);
      if (tag === "input" || tag === "textarea" || tag === "select" || isCustomElement) {
        let directiveToUse = V_MODEL_TEXT;
        let isInvalidType = false;
        if (tag === "input" || isCustomElement) {
          const type = compilerCore.findProp(node, `type`);
          if (type) {
            if (type.type === 7) {
              directiveToUse = V_MODEL_DYNAMIC;
            } else if (type.value) {
              switch (type.value.content) {
                case "radio":
                  directiveToUse = V_MODEL_RADIO;
                  break;
                case "checkbox":
                  directiveToUse = V_MODEL_CHECKBOX;
                  break;
                case "file":
                  isInvalidType = true;
                  context.onError(
                    createDOMCompilerError(
                      59,
                      dir.loc
                    )
                  );
                  break;
              }
            }
          } else if (compilerCore.hasDynamicKeyVBind(node)) {
            directiveToUse = V_MODEL_DYNAMIC;
          } else ;
        } else if (tag === "select") {
          directiveToUse = V_MODEL_SELECT;
        } else ;
        if (!isInvalidType) {
          baseResult.needRuntime = context.helper(directiveToUse);
        }
      } else {
        context.onError(
          createDOMCompilerError(
            57,
            dir.loc
          )
        );
      }
      baseResult.props = baseResult.props.filter(
        (p) => !(p.key.type === 4 && p.key.content === "modelValue")
      );
      return baseResult;
    };
    const isEventOptionModifier = /* @__PURE__ */ shared.makeMap(`passive,once,capture`);
    const isNonKeyModifier = /* @__PURE__ */ shared.makeMap(
      // event propagation management
      `stop,prevent,self,ctrl,shift,alt,meta,exact,middle`
    );
    const maybeKeyModifier = /* @__PURE__ */ shared.makeMap("left,right");
    const isKeyboardEvent = /* @__PURE__ */ shared.makeMap(`onkeyup,onkeydown,onkeypress`);
    const resolveModifiers = (key, modifiers, context, loc) => {
      const keyModifiers = [];
      const nonKeyModifiers = [];
      const eventOptionModifiers = [];
      for (let i = 0; i < modifiers.length; i++) {
        const modifier = modifiers[i].content;
        if (modifier === "native" && compilerCore.checkCompatEnabled(
          "COMPILER_V_ON_NATIVE",
          context,
          loc
        )) {
          eventOptionModifiers.push(modifier);
        } else if (isEventOptionModifier(modifier)) {
          eventOptionModifiers.push(modifier);
        } else {
          if (maybeKeyModifier(modifier)) {
            if (compilerCore.isStaticExp(key)) {
              if (isKeyboardEvent(key.content.toLowerCase())) {
                keyModifiers.push(modifier);
              } else {
                nonKeyModifiers.push(modifier);
              }
            } else {
              keyModifiers.push(modifier);
              nonKeyModifiers.push(modifier);
            }
          } else {
            if (isNonKeyModifier(modifier)) {
              nonKeyModifiers.push(modifier);
            } else {
              keyModifiers.push(modifier);
            }
          }
        }
      }
      return {
        keyModifiers,
        nonKeyModifiers,
        eventOptionModifiers
      };
    };
    const transformClick = (key, event) => {
      const isStaticClick = compilerCore.isStaticExp(key) && key.content.toLowerCase() === "onclick";
      return isStaticClick ? compilerCore.createSimpleExpression(event, true) : key.type !== 4 ? compilerCore.createCompoundExpression([
        `(`,
        key,
        `) === "onClick" ? "${event}" : (`,
        key,
        `)`
      ]) : key;
    };
    const transformOn = (dir, node, context) => {
      return compilerCore.transformOn(dir, node, context, (baseResult) => {
        const { modifiers } = dir;
        if (!modifiers.length) return baseResult;
        let { key, value: handlerExp } = baseResult.props[0];
        const { keyModifiers, nonKeyModifiers, eventOptionModifiers } = resolveModifiers(key, modifiers, context, dir.loc);
        if (nonKeyModifiers.includes("right")) {
          key = transformClick(key, `onContextmenu`);
        }
        if (nonKeyModifiers.includes("middle")) {
          key = transformClick(key, `onMouseup`);
        }
        if (nonKeyModifiers.length) {
          handlerExp = compilerCore.createCallExpression(context.helper(V_ON_WITH_MODIFIERS), [
            handlerExp,
            JSON.stringify(nonKeyModifiers)
          ]);
        }
        if (keyModifiers.length && // if event name is dynamic, always wrap with keys guard
        (!compilerCore.isStaticExp(key) || isKeyboardEvent(key.content.toLowerCase()))) {
          handlerExp = compilerCore.createCallExpression(context.helper(V_ON_WITH_KEYS), [
            handlerExp,
            JSON.stringify(keyModifiers)
          ]);
        }
        if (eventOptionModifiers.length) {
          const modifierPostfix = eventOptionModifiers.map(shared.capitalize).join("");
          key = compilerCore.isStaticExp(key) ? compilerCore.createSimpleExpression(`${key.content}${modifierPostfix}`, true) : compilerCore.createCompoundExpression([`(`, key, `) + "${modifierPostfix}"`]);
        }
        return {
          props: [compilerCore.createObjectProperty(key, handlerExp)]
        };
      });
    };
    const transformShow = (dir, node, context) => {
      const { exp, loc } = dir;
      if (!exp) {
        context.onError(
          createDOMCompilerError(61, loc)
        );
      }
      return {
        props: [],
        needRuntime: context.helper(V_SHOW)
      };
    };
    const expReplaceRE = /__VUE_EXP_START__(.*?)__VUE_EXP_END__/g;
    const stringifyStatic = (children, context, parent) => {
      if (context.scopes.vSlot > 0) {
        return;
      }
      const isParentCached = parent.type === 1 && parent.codegenNode && parent.codegenNode.type === 13 && parent.codegenNode.children && !shared.isArray(parent.codegenNode.children) && parent.codegenNode.children.type === 20;
      let nc = 0;
      let ec = 0;
      const currentChunk = [];
      const stringifyCurrentChunk = (currentIndex) => {
        if (nc >= 20 || ec >= 5) {
          const staticCall = compilerCore.createCallExpression(context.helper(compilerCore.CREATE_STATIC), [
            JSON.stringify(
              currentChunk.map((node) => stringifyNode(node, context)).join("")
            ).replace(expReplaceRE, `" + $1 + "`),
            // the 2nd argument indicates the number of DOM nodes this static vnode
            // will insert / hydrate
            String(currentChunk.length)
          ]);
          const deleteCount = currentChunk.length - 1;
          if (isParentCached) {
            children.splice(
              currentIndex - currentChunk.length,
              currentChunk.length,
              // @ts-expect-error
              staticCall
            );
          } else {
            currentChunk[0].codegenNode.value = staticCall;
            if (currentChunk.length > 1) {
              children.splice(currentIndex - currentChunk.length + 1, deleteCount);
              const cacheIndex = context.cached.indexOf(
                currentChunk[currentChunk.length - 1].codegenNode
              );
              if (cacheIndex > -1) {
                for (let i2 = cacheIndex; i2 < context.cached.length; i2++) {
                  const c = context.cached[i2];
                  if (c) c.index -= deleteCount;
                }
                context.cached.splice(cacheIndex - deleteCount + 1, deleteCount);
              }
            }
          }
          return deleteCount;
        }
        return 0;
      };
      let i = 0;
      for (; i < children.length; i++) {
        const child = children[i];
        const isCached = isParentCached || getCachedNode(child);
        if (isCached) {
          const result = analyzeNode(child);
          if (result) {
            nc += result[0];
            ec += result[1];
            currentChunk.push(child);
            continue;
          }
        }
        i -= stringifyCurrentChunk(i);
        nc = 0;
        ec = 0;
        currentChunk.length = 0;
      }
      stringifyCurrentChunk(i);
    };
    const getCachedNode = (node) => {
      if ((node.type === 1 && node.tagType === 0 || node.type === 12) && node.codegenNode && node.codegenNode.type === 20) {
        return node.codegenNode;
      }
    };
    const dataAriaRE = /^(data|aria)-/;
    const isStringifiableAttr = (name, ns) => {
      return (ns === 0 ? shared.isKnownHtmlAttr(name) : ns === 1 ? shared.isKnownSvgAttr(name) : ns === 2 ? shared.isKnownMathMLAttr(name) : false) || dataAriaRE.test(name);
    };
    const isNonStringifiable = /* @__PURE__ */ shared.makeMap(
      `caption,thead,tr,th,tbody,td,tfoot,colgroup,col`
    );
    function analyzeNode(node) {
      if (node.type === 1 && isNonStringifiable(node.tag)) {
        return false;
      }
      if (node.type === 12) {
        return [1, 0];
      }
      let nc = 1;
      let ec = node.props.length > 0 ? 1 : 0;
      let bailed = false;
      const bail = () => {
        bailed = true;
        return false;
      };
      function walk(node2) {
        const isOptionTag = node2.tag === "option" && node2.ns === 0;
        for (let i = 0; i < node2.props.length; i++) {
          const p = node2.props[i];
          if (p.type === 6 && !isStringifiableAttr(p.name, node2.ns)) {
            return bail();
          }
          if (p.type === 7 && p.name === "bind") {
            if (p.arg && (p.arg.type === 8 || p.arg.isStatic && !isStringifiableAttr(p.arg.content, node2.ns))) {
              return bail();
            }
            if (p.exp && (p.exp.type === 8 || p.exp.constType < 3)) {
              return bail();
            }
            if (isOptionTag && compilerCore.isStaticArgOf(p.arg, "value") && p.exp && !p.exp.isStatic) {
              return bail();
            }
          }
        }
        for (let i = 0; i < node2.children.length; i++) {
          nc++;
          const child = node2.children[i];
          if (child.type === 1) {
            if (child.props.length > 0) {
              ec++;
            }
            walk(child);
            if (bailed) {
              return false;
            }
          }
        }
        return true;
      }
      return walk(node) ? [nc, ec] : false;
    }
    function stringifyNode(node, context) {
      if (shared.isString(node)) {
        return node;
      }
      if (shared.isSymbol(node)) {
        return ``;
      }
      switch (node.type) {
        case 1:
          return stringifyElement(node, context);
        case 2:
          return shared.escapeHtml(node.content);
        case 3:
          return `<!--${shared.escapeHtml(node.content)}-->`;
        case 5:
          return shared.escapeHtml(shared.toDisplayString(evaluateConstant(node.content)));
        case 8:
          return shared.escapeHtml(evaluateConstant(node));
        case 12:
          return stringifyNode(node.content, context);
        default:
          return "";
      }
    }
    function stringifyElement(node, context) {
      let res = `<${node.tag}`;
      let innerHTML = "";
      for (let i = 0; i < node.props.length; i++) {
        const p = node.props[i];
        if (p.type === 6) {
          res += ` ${p.name}`;
          if (p.value) {
            res += `="${shared.escapeHtml(p.value.content)}"`;
          }
        } else if (p.type === 7) {
          if (p.name === "bind") {
            const exp = p.exp;
            if (exp.content[0] === "_") {
              res += ` ${p.arg.content}="__VUE_EXP_START__${exp.content}__VUE_EXP_END__"`;
              continue;
            }
            if (shared.isBooleanAttr(p.arg.content) && exp.content === "false") {
              continue;
            }
            let evaluated = evaluateConstant(exp);
            if (evaluated != null) {
              const arg = p.arg && p.arg.content;
              if (arg === "class") {
                evaluated = shared.normalizeClass(evaluated);
              } else if (arg === "style") {
                evaluated = shared.stringifyStyle(shared.normalizeStyle(evaluated));
              }
              res += ` ${p.arg.content}="${shared.escapeHtml(
                evaluated
              )}"`;
            }
          } else if (p.name === "html") {
            innerHTML = evaluateConstant(p.exp);
          } else if (p.name === "text") {
            innerHTML = shared.escapeHtml(
              shared.toDisplayString(evaluateConstant(p.exp))
            );
          }
        }
      }
      if (context.scopeId) {
        res += ` ${context.scopeId}`;
      }
      res += `>`;
      if (innerHTML) {
        res += innerHTML;
      } else {
        for (let i = 0; i < node.children.length; i++) {
          res += stringifyNode(node.children[i], context);
        }
      }
      if (!shared.isVoidTag(node.tag)) {
        res += `</${node.tag}>`;
      }
      return res;
    }
    function evaluateConstant(exp) {
      if (exp.type === 4) {
        return new Function(`return (${exp.content})`)();
      } else {
        let res = ``;
        exp.children.forEach((c) => {
          if (shared.isString(c) || shared.isSymbol(c)) {
            return;
          }
          if (c.type === 2) {
            res += c.content;
          } else if (c.type === 5) {
            res += shared.toDisplayString(evaluateConstant(c.content));
          } else {
            res += evaluateConstant(c);
          }
        });
        return res;
      }
    }
    const ignoreSideEffectTags = (node, context) => {
      if (node.type === 1 && node.tagType === 0 && (node.tag === "script" || node.tag === "style")) {
        context.removeNode();
      }
    };
    const DOMNodeTransforms = [
      transformStyle,
      ...[]
    ];
    const DOMDirectiveTransforms = {
      cloak: compilerCore.noopDirectiveTransform,
      html: transformVHtml,
      text: transformVText,
      model: transformModel,
      // override compiler-core
      on: transformOn,
      // override compiler-core
      show: transformShow
    };
    function compile(src, options = {}) {
      return compilerCore.baseCompile(
        src,
        shared.extend({}, parserOptions, options, {
          nodeTransforms: [
            // ignore <script> and <tag>
            // this is not put inside DOMNodeTransforms because that list is used
            // by compiler-ssr to generate vnode fallback branches
            ignoreSideEffectTags,
            ...DOMNodeTransforms,
            ...options.nodeTransforms || []
          ],
          directiveTransforms: shared.extend(
            {},
            DOMDirectiveTransforms,
            options.directiveTransforms || {}
          ),
          transformHoist: stringifyStatic
        })
      );
    }
    function parse(template, options = {}) {
      return compilerCore.baseParse(template, shared.extend({}, parserOptions, options));
    }
    exports.DOMDirectiveTransforms = DOMDirectiveTransforms;
    exports.DOMErrorCodes = DOMErrorCodes;
    exports.DOMErrorMessages = DOMErrorMessages;
    exports.DOMNodeTransforms = DOMNodeTransforms;
    exports.TRANSITION = TRANSITION;
    exports.TRANSITION_GROUP = TRANSITION_GROUP;
    exports.V_MODEL_CHECKBOX = V_MODEL_CHECKBOX;
    exports.V_MODEL_DYNAMIC = V_MODEL_DYNAMIC;
    exports.V_MODEL_RADIO = V_MODEL_RADIO;
    exports.V_MODEL_SELECT = V_MODEL_SELECT;
    exports.V_MODEL_TEXT = V_MODEL_TEXT;
    exports.V_ON_WITH_KEYS = V_ON_WITH_KEYS;
    exports.V_ON_WITH_MODIFIERS = V_ON_WITH_MODIFIERS;
    exports.V_SHOW = V_SHOW;
    exports.compile = compile;
    exports.createDOMCompilerError = createDOMCompilerError;
    exports.parse = parse;
    exports.parserOptions = parserOptions;
    exports.transformStyle = transformStyle;
    Object.keys(compilerCore).forEach(function(k) {
      if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) exports[k] = compilerCore[k];
    });
  })(compilerDom_cjs_prod);
  return compilerDom_cjs_prod;
}
var runtimeDom_cjs_prod = {};
var runtimeCore_cjs_prod = {};
var reactivity_cjs_prod = {};
/**
* @vue/reactivity v3.5.16
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var hasRequiredReactivity_cjs_prod;
function requireReactivity_cjs_prod() {
  if (hasRequiredReactivity_cjs_prod) return reactivity_cjs_prod;
  hasRequiredReactivity_cjs_prod = 1;
  Object.defineProperty(reactivity_cjs_prod, "__esModule", { value: true });
  var shared = /* @__PURE__ */ requireShared_cjs_prod();
  let activeEffectScope;
  class EffectScope {
    constructor(detached = false) {
      this.detached = detached;
      this._active = true;
      this._on = 0;
      this.effects = [];
      this.cleanups = [];
      this._isPaused = false;
      this.parent = activeEffectScope;
      if (!detached && activeEffectScope) {
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
      }
    }
    get active() {
      return this._active;
    }
    pause() {
      if (this._active) {
        this._isPaused = true;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].pause();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].pause();
        }
      }
    }
    /**
     * Resumes the effect scope, including all child scopes and effects.
     */
    resume() {
      if (this._active) {
        if (this._isPaused) {
          this._isPaused = false;
          let i, l;
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].resume();
            }
          }
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].resume();
          }
        }
      }
    }
    run(fn) {
      if (this._active) {
        const currentEffectScope = activeEffectScope;
        try {
          activeEffectScope = this;
          return fn();
        } finally {
          activeEffectScope = currentEffectScope;
        }
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    on() {
      if (++this._on === 1) {
        this.prevScope = activeEffectScope;
        activeEffectScope = this;
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    off() {
      if (this._on > 0 && --this._on === 0) {
        activeEffectScope = this.prevScope;
        this.prevScope = void 0;
      }
    }
    stop(fromParent) {
      if (this._active) {
        this._active = false;
        let i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].stop();
        }
        this.effects.length = 0;
        for (i = 0, l = this.cleanups.length; i < l; i++) {
          this.cleanups[i]();
        }
        this.cleanups.length = 0;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].stop(true);
          }
          this.scopes.length = 0;
        }
        if (!this.detached && this.parent && !fromParent) {
          const last = this.parent.scopes.pop();
          if (last && last !== this) {
            this.parent.scopes[this.index] = last;
            last.index = this.index;
          }
        }
        this.parent = void 0;
      }
    }
  }
  function effectScope(detached) {
    return new EffectScope(detached);
  }
  function getCurrentScope() {
    return activeEffectScope;
  }
  function onScopeDispose(fn, failSilently = false) {
    if (activeEffectScope) {
      activeEffectScope.cleanups.push(fn);
    }
  }
  let activeSub;
  const EffectFlags = {
    "ACTIVE": 1,
    "1": "ACTIVE",
    "RUNNING": 2,
    "2": "RUNNING",
    "TRACKING": 4,
    "4": "TRACKING",
    "NOTIFIED": 8,
    "8": "NOTIFIED",
    "DIRTY": 16,
    "16": "DIRTY",
    "ALLOW_RECURSE": 32,
    "32": "ALLOW_RECURSE",
    "PAUSED": 64,
    "64": "PAUSED",
    "EVALUATED": 128,
    "128": "EVALUATED"
  };
  const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
  class ReactiveEffect {
    constructor(fn) {
      this.fn = fn;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 1 | 4;
      this.next = void 0;
      this.cleanup = void 0;
      this.scheduler = void 0;
      if (activeEffectScope && activeEffectScope.active) {
        activeEffectScope.effects.push(this);
      }
    }
    pause() {
      this.flags |= 64;
    }
    resume() {
      if (this.flags & 64) {
        this.flags &= -65;
        if (pausedQueueEffects.has(this)) {
          pausedQueueEffects.delete(this);
          this.trigger();
        }
      }
    }
    /**
     * @internal
     */
    notify() {
      if (this.flags & 2 && !(this.flags & 32)) {
        return;
      }
      if (!(this.flags & 8)) {
        batch(this);
      }
    }
    run() {
      if (!(this.flags & 1)) {
        return this.fn();
      }
      this.flags |= 2;
      cleanupEffect(this);
      prepareDeps(this);
      const prevEffect = activeSub;
      const prevShouldTrack = shouldTrack;
      activeSub = this;
      shouldTrack = true;
      try {
        return this.fn();
      } finally {
        cleanupDeps(this);
        activeSub = prevEffect;
        shouldTrack = prevShouldTrack;
        this.flags &= -3;
      }
    }
    stop() {
      if (this.flags & 1) {
        for (let link = this.deps; link; link = link.nextDep) {
          removeSub(link);
        }
        this.deps = this.depsTail = void 0;
        cleanupEffect(this);
        this.onStop && this.onStop();
        this.flags &= -2;
      }
    }
    trigger() {
      if (this.flags & 64) {
        pausedQueueEffects.add(this);
      } else if (this.scheduler) {
        this.scheduler();
      } else {
        this.runIfDirty();
      }
    }
    /**
     * @internal
     */
    runIfDirty() {
      if (isDirty(this)) {
        this.run();
      }
    }
    get dirty() {
      return isDirty(this);
    }
  }
  let batchDepth = 0;
  let batchedSub;
  let batchedComputed;
  function batch(sub, isComputed = false) {
    sub.flags |= 8;
    if (isComputed) {
      sub.next = batchedComputed;
      batchedComputed = sub;
      return;
    }
    sub.next = batchedSub;
    batchedSub = sub;
  }
  function startBatch() {
    batchDepth++;
  }
  function endBatch() {
    if (--batchDepth > 0) {
      return;
    }
    if (batchedComputed) {
      let e = batchedComputed;
      batchedComputed = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= -9;
        e = next;
      }
    }
    let error;
    while (batchedSub) {
      let e = batchedSub;
      batchedSub = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= -9;
        if (e.flags & 1) {
          try {
            ;
            e.trigger();
          } catch (err) {
            if (!error) error = err;
          }
        }
        e = next;
      }
    }
    if (error) throw error;
  }
  function prepareDeps(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      link.version = -1;
      link.prevActiveLink = link.dep.activeLink;
      link.dep.activeLink = link;
    }
  }
  function cleanupDeps(sub) {
    let head;
    let tail = sub.depsTail;
    let link = tail;
    while (link) {
      const prev = link.prevDep;
      if (link.version === -1) {
        if (link === tail) tail = prev;
        removeSub(link);
        removeDep(link);
      } else {
        head = link;
      }
      link.dep.activeLink = link.prevActiveLink;
      link.prevActiveLink = void 0;
      link = prev;
    }
    sub.deps = head;
    sub.depsTail = tail;
  }
  function isDirty(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
        return true;
      }
    }
    if (sub._dirty) {
      return true;
    }
    return false;
  }
  function refreshComputed(computed2) {
    if (computed2.flags & 4 && !(computed2.flags & 16)) {
      return;
    }
    computed2.flags &= -17;
    if (computed2.globalVersion === globalVersion) {
      return;
    }
    computed2.globalVersion = globalVersion;
    if (!computed2.isSSR && computed2.flags & 128 && (!computed2.deps && !computed2._dirty || !isDirty(computed2))) {
      return;
    }
    computed2.flags |= 2;
    const dep = computed2.dep;
    const prevSub = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = computed2;
    shouldTrack = true;
    try {
      prepareDeps(computed2);
      const value = computed2.fn(computed2._value);
      if (dep.version === 0 || shared.hasChanged(value, computed2._value)) {
        computed2.flags |= 128;
        computed2._value = value;
        dep.version++;
      }
    } catch (err) {
      dep.version++;
      throw err;
    } finally {
      activeSub = prevSub;
      shouldTrack = prevShouldTrack;
      cleanupDeps(computed2);
      computed2.flags &= -3;
    }
  }
  function removeSub(link, soft = false) {
    const { dep, prevSub, nextSub } = link;
    if (prevSub) {
      prevSub.nextSub = nextSub;
      link.prevSub = void 0;
    }
    if (nextSub) {
      nextSub.prevSub = prevSub;
      link.nextSub = void 0;
    }
    if (dep.subs === link) {
      dep.subs = prevSub;
      if (!prevSub && dep.computed) {
        dep.computed.flags &= -5;
        for (let l = dep.computed.deps; l; l = l.nextDep) {
          removeSub(l, true);
        }
      }
    }
    if (!soft && !--dep.sc && dep.map) {
      dep.map.delete(dep.key);
    }
  }
  function removeDep(link) {
    const { prevDep, nextDep } = link;
    if (prevDep) {
      prevDep.nextDep = nextDep;
      link.prevDep = void 0;
    }
    if (nextDep) {
      nextDep.prevDep = prevDep;
      link.nextDep = void 0;
    }
  }
  function effect(fn, options) {
    if (fn.effect instanceof ReactiveEffect) {
      fn = fn.effect.fn;
    }
    const e = new ReactiveEffect(fn);
    if (options) {
      shared.extend(e, options);
    }
    try {
      e.run();
    } catch (err) {
      e.stop();
      throw err;
    }
    const runner = e.run.bind(e);
    runner.effect = e;
    return runner;
  }
  function stop(runner) {
    runner.effect.stop();
  }
  let shouldTrack = true;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function onEffectCleanup(fn, failSilently = false) {
    if (activeSub instanceof ReactiveEffect) {
      activeSub.cleanup = fn;
    }
  }
  function cleanupEffect(e) {
    const { cleanup } = e;
    e.cleanup = void 0;
    if (cleanup) {
      const prevSub = activeSub;
      activeSub = void 0;
      try {
        cleanup();
      } finally {
        activeSub = prevSub;
      }
    }
  }
  let globalVersion = 0;
  class Link {
    constructor(sub, dep) {
      this.sub = sub;
      this.dep = dep;
      this.version = dep.version;
      this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
    }
  }
  class Dep {
    constructor(computed2) {
      this.computed = computed2;
      this.version = 0;
      this.activeLink = void 0;
      this.subs = void 0;
      this.map = void 0;
      this.key = void 0;
      this.sc = 0;
    }
    track(debugInfo) {
      if (!activeSub || !shouldTrack || activeSub === this.computed) {
        return;
      }
      let link = this.activeLink;
      if (link === void 0 || link.sub !== activeSub) {
        link = this.activeLink = new Link(activeSub, this);
        if (!activeSub.deps) {
          activeSub.deps = activeSub.depsTail = link;
        } else {
          link.prevDep = activeSub.depsTail;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
        }
        addSub(link);
      } else if (link.version === -1) {
        link.version = this.version;
        if (link.nextDep) {
          const next = link.nextDep;
          next.prevDep = link.prevDep;
          if (link.prevDep) {
            link.prevDep.nextDep = next;
          }
          link.prevDep = activeSub.depsTail;
          link.nextDep = void 0;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
          if (activeSub.deps === link) {
            activeSub.deps = next;
          }
        }
      }
      return link;
    }
    trigger(debugInfo) {
      this.version++;
      globalVersion++;
      this.notify(debugInfo);
    }
    notify(debugInfo) {
      startBatch();
      try {
        if (false) ;
        for (let link = this.subs; link; link = link.prevSub) {
          if (link.sub.notify()) {
            ;
            link.sub.dep.notify();
          }
        }
      } finally {
        endBatch();
      }
    }
  }
  function addSub(link) {
    link.dep.sc++;
    if (link.sub.flags & 4) {
      const computed2 = link.dep.computed;
      if (computed2 && !link.dep.subs) {
        computed2.flags |= 4 | 16;
        for (let l = computed2.deps; l; l = l.nextDep) {
          addSub(l);
        }
      }
      const currentTail = link.dep.subs;
      if (currentTail !== link) {
        link.prevSub = currentTail;
        if (currentTail) currentTail.nextSub = link;
      }
      link.dep.subs = link;
    }
  }
  const targetMap = /* @__PURE__ */ new WeakMap();
  const ITERATE_KEY = Symbol(
    ""
  );
  const MAP_KEY_ITERATE_KEY = Symbol(
    ""
  );
  const ARRAY_ITERATE_KEY = Symbol(
    ""
  );
  function track(target, type, key) {
    if (shouldTrack && activeSub) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = new Dep());
        dep.map = depsMap;
        dep.key = key;
      }
      {
        dep.track();
      }
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      globalVersion++;
      return;
    }
    const run = (dep) => {
      if (dep) {
        {
          dep.trigger();
        }
      }
    };
    startBatch();
    if (type === "clear") {
      depsMap.forEach(run);
    } else {
      const targetIsArray = shared.isArray(target);
      const isArrayIndex = targetIsArray && shared.isIntegerKey(key);
      if (targetIsArray && key === "length") {
        const newLength = Number(newValue);
        depsMap.forEach((dep, key2) => {
          if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !shared.isSymbol(key2) && key2 >= newLength) {
            run(dep);
          }
        });
      } else {
        if (key !== void 0 || depsMap.has(void 0)) {
          run(depsMap.get(key));
        }
        if (isArrayIndex) {
          run(depsMap.get(ARRAY_ITERATE_KEY));
        }
        switch (type) {
          case "add":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (shared.isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            } else if (isArrayIndex) {
              run(depsMap.get("length"));
            }
            break;
          case "delete":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (shared.isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            }
            break;
          case "set":
            if (shared.isMap(target)) {
              run(depsMap.get(ITERATE_KEY));
            }
            break;
        }
      }
    }
    endBatch();
  }
  function getDepFromReactive(object, key) {
    const depMap = targetMap.get(object);
    return depMap && depMap.get(key);
  }
  function reactiveReadArray(array) {
    const raw = toRaw(array);
    if (raw === array) return raw;
    track(raw, "iterate", ARRAY_ITERATE_KEY);
    return isShallow(array) ? raw : raw.map(toReactive);
  }
  function shallowReadArray(arr) {
    track(arr = toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
    return arr;
  }
  const arrayInstrumentations = {
    __proto__: null,
    [Symbol.iterator]() {
      return iterator(this, Symbol.iterator, toReactive);
    },
    concat(...args) {
      return reactiveReadArray(this).concat(
        ...args.map((x) => shared.isArray(x) ? reactiveReadArray(x) : x)
      );
    },
    entries() {
      return iterator(this, "entries", (value) => {
        value[1] = toReactive(value[1]);
        return value;
      });
    },
    every(fn, thisArg) {
      return apply(this, "every", fn, thisArg, void 0, arguments);
    },
    filter(fn, thisArg) {
      return apply(this, "filter", fn, thisArg, (v) => v.map(toReactive), arguments);
    },
    find(fn, thisArg) {
      return apply(this, "find", fn, thisArg, toReactive, arguments);
    },
    findIndex(fn, thisArg) {
      return apply(this, "findIndex", fn, thisArg, void 0, arguments);
    },
    findLast(fn, thisArg) {
      return apply(this, "findLast", fn, thisArg, toReactive, arguments);
    },
    findLastIndex(fn, thisArg) {
      return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
    },
    // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
    forEach(fn, thisArg) {
      return apply(this, "forEach", fn, thisArg, void 0, arguments);
    },
    includes(...args) {
      return searchProxy(this, "includes", args);
    },
    indexOf(...args) {
      return searchProxy(this, "indexOf", args);
    },
    join(separator) {
      return reactiveReadArray(this).join(separator);
    },
    // keys() iterator only reads `length`, no optimisation required
    lastIndexOf(...args) {
      return searchProxy(this, "lastIndexOf", args);
    },
    map(fn, thisArg) {
      return apply(this, "map", fn, thisArg, void 0, arguments);
    },
    pop() {
      return noTracking(this, "pop");
    },
    push(...args) {
      return noTracking(this, "push", args);
    },
    reduce(fn, ...args) {
      return reduce(this, "reduce", fn, args);
    },
    reduceRight(fn, ...args) {
      return reduce(this, "reduceRight", fn, args);
    },
    shift() {
      return noTracking(this, "shift");
    },
    // slice could use ARRAY_ITERATE but also seems to beg for range tracking
    some(fn, thisArg) {
      return apply(this, "some", fn, thisArg, void 0, arguments);
    },
    splice(...args) {
      return noTracking(this, "splice", args);
    },
    toReversed() {
      return reactiveReadArray(this).toReversed();
    },
    toSorted(comparer) {
      return reactiveReadArray(this).toSorted(comparer);
    },
    toSpliced(...args) {
      return reactiveReadArray(this).toSpliced(...args);
    },
    unshift(...args) {
      return noTracking(this, "unshift", args);
    },
    values() {
      return iterator(this, "values", toReactive);
    }
  };
  function iterator(self2, method, wrapValue) {
    const arr = shallowReadArray(self2);
    const iter = arr[method]();
    if (arr !== self2 && !isShallow(self2)) {
      iter._next = iter.next;
      iter.next = () => {
        const result = iter._next();
        if (result.value) {
          result.value = wrapValue(result.value);
        }
        return result;
      };
    }
    return iter;
  }
  const arrayProto = Array.prototype;
  function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
    const arr = shallowReadArray(self2);
    const needsWrap = arr !== self2 && !isShallow(self2);
    const methodFn = arr[method];
    if (methodFn !== arrayProto[method]) {
      const result2 = methodFn.apply(self2, args);
      return needsWrap ? toReactive(result2) : result2;
    }
    let wrappedFn = fn;
    if (arr !== self2) {
      if (needsWrap) {
        wrappedFn = function(item, index) {
          return fn.call(this, toReactive(item), index, self2);
        };
      } else if (fn.length > 2) {
        wrappedFn = function(item, index) {
          return fn.call(this, item, index, self2);
        };
      }
    }
    const result = methodFn.call(arr, wrappedFn, thisArg);
    return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
  }
  function reduce(self2, method, fn, args) {
    const arr = shallowReadArray(self2);
    let wrappedFn = fn;
    if (arr !== self2) {
      if (!isShallow(self2)) {
        wrappedFn = function(acc, item, index) {
          return fn.call(this, acc, toReactive(item), index, self2);
        };
      } else if (fn.length > 3) {
        wrappedFn = function(acc, item, index) {
          return fn.call(this, acc, item, index, self2);
        };
      }
    }
    return arr[method](wrappedFn, ...args);
  }
  function searchProxy(self2, method, args) {
    const arr = toRaw(self2);
    track(arr, "iterate", ARRAY_ITERATE_KEY);
    const res = arr[method](...args);
    if ((res === -1 || res === false) && isProxy(args[0])) {
      args[0] = toRaw(args[0]);
      return arr[method](...args);
    }
    return res;
  }
  function noTracking(self2, method, args = []) {
    pauseTracking();
    startBatch();
    const res = toRaw(self2)[method].apply(self2, args);
    endBatch();
    resetTracking();
    return res;
  }
  const isNonTrackableKeys = /* @__PURE__ */ shared.makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(shared.isSymbol)
  );
  function hasOwnProperty(key) {
    if (!shared.isSymbol(key)) key = String(key);
    const obj = toRaw(this);
    track(obj, "has", key);
    return obj.hasOwnProperty(key);
  }
  class BaseReactiveHandler {
    constructor(_isReadonly = false, _isShallow = false) {
      this._isReadonly = _isReadonly;
      this._isShallow = _isShallow;
    }
    get(target, key, receiver) {
      if (key === "__v_skip") return target["__v_skip"];
      const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return isShallow2;
      } else if (key === "__v_raw") {
        if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
        // this means the receiver is a user proxy of the reactive proxy
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
          return target;
        }
        return;
      }
      const targetIsArray = shared.isArray(target);
      if (!isReadonly2) {
        let fn;
        if (targetIsArray && (fn = arrayInstrumentations[key])) {
          return fn;
        }
        if (key === "hasOwnProperty") {
          return hasOwnProperty;
        }
      }
      const res = Reflect.get(
        target,
        key,
        // if this is a proxy wrapping a ref, return methods using the raw ref
        // as receiver so that we don't have to call `toRaw` on the ref in all
        // its class methods
        isRef(target) ? target : receiver
      );
      if (shared.isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (isShallow2) {
        return res;
      }
      if (isRef(res)) {
        return targetIsArray && shared.isIntegerKey(key) ? res : res.value;
      }
      if (shared.isObject(res)) {
        return isReadonly2 ? readonly(res) : reactive(res);
      }
      return res;
    }
  }
  class MutableReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(false, isShallow2);
    }
    set(target, key, value, receiver) {
      let oldValue = target[key];
      if (!this._isShallow) {
        const isOldValueReadonly = isReadonly(oldValue);
        if (!isShallow(value) && !isReadonly(value)) {
          oldValue = toRaw(oldValue);
          value = toRaw(value);
        }
        if (!shared.isArray(target) && isRef(oldValue) && !isRef(value)) {
          if (isOldValueReadonly) {
            return false;
          } else {
            oldValue.value = value;
            return true;
          }
        }
      }
      const hadKey = shared.isArray(target) && shared.isIntegerKey(key) ? Number(key) < target.length : shared.hasOwn(target, key);
      const result = Reflect.set(
        target,
        key,
        value,
        isRef(target) ? target : receiver
      );
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (shared.hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
      }
      return result;
    }
    deleteProperty(target, key) {
      const hadKey = shared.hasOwn(target, key);
      target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0);
      }
      return result;
    }
    has(target, key) {
      const result = Reflect.has(target, key);
      if (!shared.isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    ownKeys(target) {
      track(
        target,
        "iterate",
        shared.isArray(target) ? "length" : ITERATE_KEY
      );
      return Reflect.ownKeys(target);
    }
  }
  class ReadonlyReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(true, isShallow2);
    }
    set(target, key) {
      return true;
    }
    deleteProperty(target, key) {
      return true;
    }
  }
  const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
  const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
  const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
  const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
  const toShallow = (value) => value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const targetIsMap = shared.isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(
        rawTarget,
        "iterate",
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
      );
      return {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        // iterable protocol
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      return type === "delete" ? false : type === "clear" ? void 0 : this;
    };
  }
  function createInstrumentations(readonly2, shallow) {
    const instrumentations = {
      get(key) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!readonly2) {
          if (shared.hasChanged(key, rawKey)) {
            track(rawTarget, "get", key);
          }
          track(rawTarget, "get", rawKey);
        }
        const { has } = getProto(rawTarget);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        if (has.call(rawTarget, key)) {
          return wrap(target.get(key));
        } else if (has.call(rawTarget, rawKey)) {
          return wrap(target.get(rawKey));
        } else if (target !== rawTarget) {
          target.get(key);
        }
      },
      get size() {
        const target = this["__v_raw"];
        !readonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
        return Reflect.get(target, "size", target);
      },
      has(key) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!readonly2) {
          if (shared.hasChanged(key, rawKey)) {
            track(rawTarget, "has", key);
          }
          track(rawTarget, "has", rawKey);
        }
        return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
      },
      forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw"];
        const rawTarget = toRaw(target);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
        return target.forEach((value, key) => {
          return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
      }
    };
    shared.extend(
      instrumentations,
      readonly2 ? {
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear")
      } : {
        add(value) {
          if (!shallow && !isShallow(value) && !isReadonly(value)) {
            value = toRaw(value);
          }
          const target = toRaw(this);
          const proto = getProto(target);
          const hadKey = proto.has.call(target, value);
          if (!hadKey) {
            target.add(value);
            trigger(target, "add", value, value);
          }
          return this;
        },
        set(key, value) {
          if (!shallow && !isShallow(value) && !isReadonly(value)) {
            value = toRaw(value);
          }
          const target = toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = toRaw(key);
            hadKey = has.call(target, key);
          }
          const oldValue = get.call(target, key);
          target.set(key, value);
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (shared.hasChanged(value, oldValue)) {
            trigger(target, "set", key, value);
          }
          return this;
        },
        delete(key) {
          const target = toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = toRaw(key);
            hadKey = has.call(target, key);
          }
          get ? get.call(target, key) : void 0;
          const result = target.delete(key);
          if (hadKey) {
            trigger(target, "delete", key, void 0);
          }
          return result;
        },
        clear() {
          const target = toRaw(this);
          const hadItems = target.size !== 0;
          const result = target.clear();
          if (hadItems) {
            trigger(
              target,
              "clear",
              void 0,
              void 0
            );
          }
          return result;
        }
      }
    );
    const iteratorMethods = [
      "keys",
      "values",
      "entries",
      Symbol.iterator
    ];
    iteratorMethods.forEach((method) => {
      instrumentations[method] = createIterableMethod(method, readonly2, shallow);
    });
    return instrumentations;
  }
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = createInstrumentations(isReadonly2, shallow);
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(
        shared.hasOwn(instrumentations, key) && key in target ? instrumentations : target,
        key,
        receiver
      );
    };
  }
  const mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  const shallowReadonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, true)
  };
  const reactiveMap = /* @__PURE__ */ new WeakMap();
  const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  const readonlyMap = /* @__PURE__ */ new WeakMap();
  const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(shared.toRawType(value));
  }
  function reactive(target) {
    if (isReadonly(target)) {
      return target;
    }
    return createReactiveObject(
      target,
      false,
      mutableHandlers,
      mutableCollectionHandlers,
      reactiveMap
    );
  }
  function shallowReactive(target) {
    return createReactiveObject(
      target,
      false,
      shallowReactiveHandlers,
      shallowCollectionHandlers,
      shallowReactiveMap
    );
  }
  function readonly(target) {
    return createReactiveObject(
      target,
      true,
      readonlyHandlers,
      readonlyCollectionHandlers,
      readonlyMap
    );
  }
  function shallowReadonly2(target) {
    return createReactiveObject(
      target,
      true,
      shallowReadonlyHandlers,
      shallowReadonlyCollectionHandlers,
      shallowReadonlyMap
    );
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!shared.isObject(target)) {
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const proxy = new Proxy(
      target,
      targetType === 2 ? collectionHandlers : baseHandlers
    );
    proxyMap.set(target, proxy);
    return proxy;
  }
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  function isProxy(value) {
    return value ? !!value["__v_raw"] : false;
  }
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function markRaw(value) {
    if (!shared.hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
      shared.def(value, "__v_skip", true);
    }
    return value;
  }
  const toReactive = (value) => shared.isObject(value) ? reactive(value) : value;
  const toReadonly = (value) => shared.isObject(value) ? readonly(value) : value;
  function isRef(r2) {
    return r2 ? r2["__v_isRef"] === true : false;
  }
  function ref(value) {
    return createRef(value, false);
  }
  function shallowRef(value) {
    return createRef(value, true);
  }
  function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, shallow);
  }
  class RefImpl {
    constructor(value, isShallow2) {
      this.dep = new Dep();
      this["__v_isRef"] = true;
      this["__v_isShallow"] = false;
      this._rawValue = isShallow2 ? value : toRaw(value);
      this._value = isShallow2 ? value : toReactive(value);
      this["__v_isShallow"] = isShallow2;
    }
    get value() {
      {
        this.dep.track();
      }
      return this._value;
    }
    set value(newValue) {
      const oldValue = this._rawValue;
      const useDirectValue = this["__v_isShallow"] || isShallow(newValue) || isReadonly(newValue);
      newValue = useDirectValue ? newValue : toRaw(newValue);
      if (shared.hasChanged(newValue, oldValue)) {
        this._rawValue = newValue;
        this._value = useDirectValue ? newValue : toReactive(newValue);
        {
          this.dep.trigger();
        }
      }
    }
  }
  function triggerRef(ref2) {
    if (ref2.dep) {
      {
        ref2.dep.trigger();
      }
    }
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  function toValue(source) {
    return shared.isFunction(source) ? source() : unref(source);
  }
  const shallowUnwrapHandlers = {
    get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };
  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  class CustomRefImpl {
    constructor(factory) {
      this["__v_isRef"] = true;
      this._value = void 0;
      const dep = this.dep = new Dep();
      const { get, set } = factory(dep.track.bind(dep), dep.trigger.bind(dep));
      this._get = get;
      this._set = set;
    }
    get value() {
      return this._value = this._get();
    }
    set value(newVal) {
      this._set(newVal);
    }
  }
  function customRef(factory) {
    return new CustomRefImpl(factory);
  }
  function toRefs(object) {
    const ret = shared.isArray(object) ? new Array(object.length) : {};
    for (const key in object) {
      ret[key] = propertyToRef(object, key);
    }
    return ret;
  }
  class ObjectRefImpl {
    constructor(_object, _key, _defaultValue) {
      this._object = _object;
      this._key = _key;
      this._defaultValue = _defaultValue;
      this["__v_isRef"] = true;
      this._value = void 0;
    }
    get value() {
      const val = this._object[this._key];
      return this._value = val === void 0 ? this._defaultValue : val;
    }
    set value(newVal) {
      this._object[this._key] = newVal;
    }
    get dep() {
      return getDepFromReactive(toRaw(this._object), this._key);
    }
  }
  class GetterRefImpl {
    constructor(_getter) {
      this._getter = _getter;
      this["__v_isRef"] = true;
      this["__v_isReadonly"] = true;
      this._value = void 0;
    }
    get value() {
      return this._value = this._getter();
    }
  }
  function toRef(source, key, defaultValue) {
    if (isRef(source)) {
      return source;
    } else if (shared.isFunction(source)) {
      return new GetterRefImpl(source);
    } else if (shared.isObject(source) && arguments.length > 1) {
      return propertyToRef(source, key, defaultValue);
    } else {
      return ref(source);
    }
  }
  function propertyToRef(source, key, defaultValue) {
    const val = source[key];
    return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
  }
  class ComputedRefImpl {
    constructor(fn, setter, isSSR) {
      this.fn = fn;
      this.setter = setter;
      this._value = void 0;
      this.dep = new Dep(this);
      this.__v_isRef = true;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 16;
      this.globalVersion = globalVersion - 1;
      this.next = void 0;
      this.effect = this;
      this["__v_isReadonly"] = !setter;
      this.isSSR = isSSR;
    }
    /**
     * @internal
     */
    notify() {
      this.flags |= 16;
      if (!(this.flags & 8) && // avoid infinite self recursion
      activeSub !== this) {
        batch(this, true);
        return true;
      }
    }
    get value() {
      const link = this.dep.track();
      refreshComputed(this);
      if (link) {
        link.version = this.dep.version;
      }
      return this._value;
    }
    set value(newValue) {
      if (this.setter) {
        this.setter(newValue);
      }
    }
  }
  function computed(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    if (shared.isFunction(getterOrOptions)) {
      getter = getterOrOptions;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, isSSR);
    return cRef;
  }
  const TrackOpTypes = {
    "GET": "get",
    "HAS": "has",
    "ITERATE": "iterate"
  };
  const TriggerOpTypes = {
    "SET": "set",
    "ADD": "add",
    "DELETE": "delete",
    "CLEAR": "clear"
  };
  const ReactiveFlags = {
    "SKIP": "__v_skip",
    "IS_REACTIVE": "__v_isReactive",
    "IS_READONLY": "__v_isReadonly",
    "IS_SHALLOW": "__v_isShallow",
    "RAW": "__v_raw",
    "IS_REF": "__v_isRef"
  };
  const WatchErrorCodes = {
    "WATCH_GETTER": 2,
    "2": "WATCH_GETTER",
    "WATCH_CALLBACK": 3,
    "3": "WATCH_CALLBACK",
    "WATCH_CLEANUP": 4,
    "4": "WATCH_CLEANUP"
  };
  const INITIAL_WATCHER_VALUE = {};
  const cleanupMap = /* @__PURE__ */ new WeakMap();
  let activeWatcher = void 0;
  function getCurrentWatcher() {
    return activeWatcher;
  }
  function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
    if (owner) {
      let cleanups = cleanupMap.get(owner);
      if (!cleanups) cleanupMap.set(owner, cleanups = []);
      cleanups.push(cleanupFn);
    }
  }
  function watch(source, cb, options = shared.EMPTY_OBJ) {
    const { immediate, deep, once, scheduler, augmentJob, call } = options;
    const reactiveGetter = (source2) => {
      if (deep) return source2;
      if (isShallow(source2) || deep === false || deep === 0)
        return traverse(source2, 1);
      return traverse(source2);
    };
    let effect2;
    let getter;
    let cleanup;
    let boundCleanup;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
      getter = () => source.value;
      forceTrigger = isShallow(source);
    } else if (isReactive(source)) {
      getter = () => reactiveGetter(source);
      forceTrigger = true;
    } else if (shared.isArray(source)) {
      isMultiSource = true;
      forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
      getter = () => source.map((s) => {
        if (isRef(s)) {
          return s.value;
        } else if (isReactive(s)) {
          return reactiveGetter(s);
        } else if (shared.isFunction(s)) {
          return call ? call(s, 2) : s();
        } else ;
      });
    } else if (shared.isFunction(source)) {
      if (cb) {
        getter = call ? () => call(source, 2) : source;
      } else {
        getter = () => {
          if (cleanup) {
            pauseTracking();
            try {
              cleanup();
            } finally {
              resetTracking();
            }
          }
          const currentEffect = activeWatcher;
          activeWatcher = effect2;
          try {
            return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
          } finally {
            activeWatcher = currentEffect;
          }
        };
      }
    } else {
      getter = shared.NOOP;
    }
    if (cb && deep) {
      const baseGetter = getter;
      const depth = deep === true ? Infinity : deep;
      getter = () => traverse(baseGetter(), depth);
    }
    const scope = getCurrentScope();
    const watchHandle = () => {
      effect2.stop();
      if (scope && scope.active) {
        shared.remove(scope.effects, effect2);
      }
    };
    if (once && cb) {
      const _cb = cb;
      cb = (...args) => {
        _cb(...args);
        watchHandle();
      };
    }
    let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
    const job = (immediateFirstRun) => {
      if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
        return;
      }
      if (cb) {
        const newValue = effect2.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => shared.hasChanged(v, oldValue[i])) : shared.hasChanged(newValue, oldValue))) {
          if (cleanup) {
            cleanup();
          }
          const currentWatcher = activeWatcher;
          activeWatcher = effect2;
          try {
            const args = [
              newValue,
              // pass undefined as the old value when it's changed for the first time
              oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
              boundCleanup
            ];
            oldValue = newValue;
            call ? call(cb, 3, args) : (
              // @ts-expect-error
              cb(...args)
            );
          } finally {
            activeWatcher = currentWatcher;
          }
        }
      } else {
        effect2.run();
      }
    };
    if (augmentJob) {
      augmentJob(job);
    }
    effect2 = new ReactiveEffect(getter);
    effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
    boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
    cleanup = effect2.onStop = () => {
      const cleanups = cleanupMap.get(effect2);
      if (cleanups) {
        if (call) {
          call(cleanups, 4);
        } else {
          for (const cleanup2 of cleanups) cleanup2();
        }
        cleanupMap.delete(effect2);
      }
    };
    if (cb) {
      if (immediate) {
        job(true);
      } else {
        oldValue = effect2.run();
      }
    } else if (scheduler) {
      scheduler(job.bind(null, true), true);
    } else {
      effect2.run();
    }
    watchHandle.pause = effect2.pause.bind(effect2);
    watchHandle.resume = effect2.resume.bind(effect2);
    watchHandle.stop = watchHandle;
    return watchHandle;
  }
  function traverse(value, depth = Infinity, seen) {
    if (depth <= 0 || !shared.isObject(value) || value["__v_skip"]) {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Set();
    if (seen.has(value)) {
      return value;
    }
    seen.add(value);
    depth--;
    if (isRef(value)) {
      traverse(value.value, depth, seen);
    } else if (shared.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], depth, seen);
      }
    } else if (shared.isSet(value) || shared.isMap(value)) {
      value.forEach((v) => {
        traverse(v, depth, seen);
      });
    } else if (shared.isPlainObject(value)) {
      for (const key in value) {
        traverse(value[key], depth, seen);
      }
      for (const key of Object.getOwnPropertySymbols(value)) {
        if (Object.prototype.propertyIsEnumerable.call(value, key)) {
          traverse(value[key], depth, seen);
        }
      }
    }
    return value;
  }
  reactivity_cjs_prod.ARRAY_ITERATE_KEY = ARRAY_ITERATE_KEY;
  reactivity_cjs_prod.EffectFlags = EffectFlags;
  reactivity_cjs_prod.EffectScope = EffectScope;
  reactivity_cjs_prod.ITERATE_KEY = ITERATE_KEY;
  reactivity_cjs_prod.MAP_KEY_ITERATE_KEY = MAP_KEY_ITERATE_KEY;
  reactivity_cjs_prod.ReactiveEffect = ReactiveEffect;
  reactivity_cjs_prod.ReactiveFlags = ReactiveFlags;
  reactivity_cjs_prod.TrackOpTypes = TrackOpTypes;
  reactivity_cjs_prod.TriggerOpTypes = TriggerOpTypes;
  reactivity_cjs_prod.WatchErrorCodes = WatchErrorCodes;
  reactivity_cjs_prod.computed = computed;
  reactivity_cjs_prod.customRef = customRef;
  reactivity_cjs_prod.effect = effect;
  reactivity_cjs_prod.effectScope = effectScope;
  reactivity_cjs_prod.enableTracking = enableTracking;
  reactivity_cjs_prod.getCurrentScope = getCurrentScope;
  reactivity_cjs_prod.getCurrentWatcher = getCurrentWatcher;
  reactivity_cjs_prod.isProxy = isProxy;
  reactivity_cjs_prod.isReactive = isReactive;
  reactivity_cjs_prod.isReadonly = isReadonly;
  reactivity_cjs_prod.isRef = isRef;
  reactivity_cjs_prod.isShallow = isShallow;
  reactivity_cjs_prod.markRaw = markRaw;
  reactivity_cjs_prod.onEffectCleanup = onEffectCleanup;
  reactivity_cjs_prod.onScopeDispose = onScopeDispose;
  reactivity_cjs_prod.onWatcherCleanup = onWatcherCleanup;
  reactivity_cjs_prod.pauseTracking = pauseTracking;
  reactivity_cjs_prod.proxyRefs = proxyRefs;
  reactivity_cjs_prod.reactive = reactive;
  reactivity_cjs_prod.reactiveReadArray = reactiveReadArray;
  reactivity_cjs_prod.readonly = readonly;
  reactivity_cjs_prod.ref = ref;
  reactivity_cjs_prod.resetTracking = resetTracking;
  reactivity_cjs_prod.shallowReactive = shallowReactive;
  reactivity_cjs_prod.shallowReadArray = shallowReadArray;
  reactivity_cjs_prod.shallowReadonly = shallowReadonly2;
  reactivity_cjs_prod.shallowRef = shallowRef;
  reactivity_cjs_prod.stop = stop;
  reactivity_cjs_prod.toRaw = toRaw;
  reactivity_cjs_prod.toReactive = toReactive;
  reactivity_cjs_prod.toReadonly = toReadonly;
  reactivity_cjs_prod.toRef = toRef;
  reactivity_cjs_prod.toRefs = toRefs;
  reactivity_cjs_prod.toValue = toValue;
  reactivity_cjs_prod.track = track;
  reactivity_cjs_prod.traverse = traverse;
  reactivity_cjs_prod.trigger = trigger;
  reactivity_cjs_prod.triggerRef = triggerRef;
  reactivity_cjs_prod.unref = unref;
  reactivity_cjs_prod.watch = watch;
  return reactivity_cjs_prod;
}
var hasRequiredRuntimeCore_cjs_prod;
function requireRuntimeCore_cjs_prod() {
  if (hasRequiredRuntimeCore_cjs_prod) return runtimeCore_cjs_prod;
  hasRequiredRuntimeCore_cjs_prod = 1;
  /**
  * @vue/runtime-core v3.5.16
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  Object.defineProperty(runtimeCore_cjs_prod, "__esModule", { value: true });
  var reactivity = /* @__PURE__ */ requireReactivity_cjs_prod();
  var shared = /* @__PURE__ */ requireShared_cjs_prod();
  function pushWarningContext(vnode) {
  }
  function popWarningContext() {
  }
  function assertNumber(val, type) {
    return;
  }
  const ErrorCodes = {
    "SETUP_FUNCTION": 0,
    "0": "SETUP_FUNCTION",
    "RENDER_FUNCTION": 1,
    "1": "RENDER_FUNCTION",
    "NATIVE_EVENT_HANDLER": 5,
    "5": "NATIVE_EVENT_HANDLER",
    "COMPONENT_EVENT_HANDLER": 6,
    "6": "COMPONENT_EVENT_HANDLER",
    "VNODE_HOOK": 7,
    "7": "VNODE_HOOK",
    "DIRECTIVE_HOOK": 8,
    "8": "DIRECTIVE_HOOK",
    "TRANSITION_HOOK": 9,
    "9": "TRANSITION_HOOK",
    "APP_ERROR_HANDLER": 10,
    "10": "APP_ERROR_HANDLER",
    "APP_WARN_HANDLER": 11,
    "11": "APP_WARN_HANDLER",
    "FUNCTION_REF": 12,
    "12": "FUNCTION_REF",
    "ASYNC_COMPONENT_LOADER": 13,
    "13": "ASYNC_COMPONENT_LOADER",
    "SCHEDULER": 14,
    "14": "SCHEDULER",
    "COMPONENT_UPDATE": 15,
    "15": "COMPONENT_UPDATE",
    "APP_UNMOUNT_CLEANUP": 16,
    "16": "APP_UNMOUNT_CLEANUP"
  };
  const ErrorTypeStrings$1 = {
    ["sp"]: "serverPrefetch hook",
    ["bc"]: "beforeCreate hook",
    ["c"]: "created hook",
    ["bm"]: "beforeMount hook",
    ["m"]: "mounted hook",
    ["bu"]: "beforeUpdate hook",
    ["u"]: "updated",
    ["bum"]: "beforeUnmount hook",
    ["um"]: "unmounted hook",
    ["a"]: "activated hook",
    ["da"]: "deactivated hook",
    ["ec"]: "errorCaptured hook",
    ["rtc"]: "renderTracked hook",
    ["rtg"]: "renderTriggered hook",
    [0]: "setup function",
    [1]: "render function",
    [2]: "watcher getter",
    [3]: "watcher callback",
    [4]: "watcher cleanup function",
    [5]: "native event handler",
    [6]: "component event handler",
    [7]: "vnode hook",
    [8]: "directive hook",
    [9]: "transition hook",
    [10]: "app errorHandler",
    [11]: "app warnHandler",
    [12]: "ref function",
    [13]: "async component loader",
    [14]: "scheduler flush",
    [15]: "component update",
    [16]: "app unmount cleanup function"
  };
  function callWithErrorHandling(fn, instance, type, args) {
    try {
      return args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (shared.isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type, args);
      if (res && shared.isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    if (shared.isArray(fn)) {
      const values = [];
      for (let i = 0; i < fn.length; i++) {
        values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
      }
      return values;
    }
  }
  function handleError(err, instance, type, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || shared.EMPTY_OBJ;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      if (errorHandler) {
        reactivity.pauseTracking();
        callWithErrorHandling(errorHandler, null, 10, [
          err,
          exposedInstance,
          errorInfo
        ]);
        reactivity.resetTracking();
        return;
      }
    }
    logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
  }
  function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
    if (throwInProd) {
      throw err;
    } else {
      console.error(err);
    }
  }
  const queue = [];
  let flushIndex = -1;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null;
  let postFlushIndex = 0;
  const resolvedPromise = /* @__PURE__ */ Promise.resolve();
  let currentFlushPromise = null;
  function nextTick(fn) {
    const p = currentFlushPromise || resolvedPromise;
    return fn ? p.then(this ? fn.bind(this) : fn) : p;
  }
  function findInsertionIndex2(id) {
    let start = flushIndex + 1;
    let end = queue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJob = queue[middle];
      const middleJobId = getId(middleJob);
      if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }
    return start;
  }
  function queueJob(job) {
    if (!(job.flags & 1)) {
      const jobId = getId(job);
      const lastJob = queue[queue.length - 1];
      if (!lastJob || // fast path when the job id is larger than the tail
      !(job.flags & 2) && jobId >= getId(lastJob)) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex2(jobId), 0, job);
      }
      job.flags |= 1;
      queueFlush();
    }
  }
  function queueFlush() {
    if (!currentFlushPromise) {
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function queuePostFlushCb(cb) {
    if (!shared.isArray(cb)) {
      if (activePostFlushCbs && cb.id === -1) {
        activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
      } else if (!(cb.flags & 1)) {
        pendingPostFlushCbs.push(cb);
        cb.flags |= 1;
      }
    } else {
      pendingPostFlushCbs.push(...cb);
    }
    queueFlush();
  }
  function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
    for (; i < queue.length; i++) {
      const cb = queue[i];
      if (cb && cb.flags & 2) {
        if (instance && cb.id !== instance.uid) {
          continue;
        }
        queue.splice(i, 1);
        i--;
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        cb();
        if (!(cb.flags & 4)) {
          cb.flags &= -2;
        }
      }
    }
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)].sort(
        (a, b) => getId(a) - getId(b)
      );
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      activePostFlushCbs = deduped;
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        const cb = activePostFlushCbs[postFlushIndex];
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        if (!(cb.flags & 8)) cb();
        cb.flags &= -2;
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
  function flushJobs(seen) {
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && !(job.flags & 8)) {
          if (false) ;
          if (job.flags & 4) {
            job.flags &= ~1;
          }
          callWithErrorHandling(
            job,
            job.i,
            job.i ? 15 : 14
          );
          if (!(job.flags & 4)) {
            job.flags &= ~1;
          }
        }
      }
    } finally {
      for (; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job) {
          job.flags &= -2;
        }
      }
      flushIndex = -1;
      queue.length = 0;
      flushPostFlushCbs();
      currentFlushPromise = null;
      if (queue.length || pendingPostFlushCbs.length) {
        flushJobs();
      }
    }
  }
  let currentRenderingInstance = null;
  let currentScopeId = null;
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  function pushScopeId(id) {
    currentScopeId = id;
  }
  function popScopeId() {
    currentScopeId = null;
  }
  const withScopeId = (_id) => withCtx;
  function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
    if (!ctx) return fn;
    if (fn._n) {
      return fn;
    }
    const renderFnWithContext = (...args) => {
      if (renderFnWithContext._d) {
        setBlockTracking(-1);
      }
      const prevInstance = setCurrentRenderingInstance(ctx);
      let res;
      try {
        res = fn(...args);
      } finally {
        setCurrentRenderingInstance(prevInstance);
        if (renderFnWithContext._d) {
          setBlockTracking(1);
        }
      }
      return res;
    };
    renderFnWithContext._n = true;
    renderFnWithContext._c = true;
    renderFnWithContext._d = true;
    return renderFnWithContext;
  }
  function withDirectives(vnode, directives) {
    if (currentRenderingInstance === null) {
      return vnode;
    }
    const instance = getComponentPublicInstance(currentRenderingInstance);
    const bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
      let [dir, value, arg, modifiers = shared.EMPTY_OBJ] = directives[i];
      if (dir) {
        if (shared.isFunction(dir)) {
          dir = {
            mounted: dir,
            updated: dir
          };
        }
        if (dir.deep) {
          reactivity.traverse(value);
        }
        bindings.push({
          dir,
          instance,
          value,
          oldValue: void 0,
          arg,
          modifiers
        });
      }
    }
    return vnode;
  }
  function invokeDirectiveHook(vnode, prevVNode, instance, name) {
    const bindings = vnode.dirs;
    const oldBindings = prevVNode && prevVNode.dirs;
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i];
      if (oldBindings) {
        binding.oldValue = oldBindings[i].value;
      }
      let hook = binding.dir[name];
      if (hook) {
        reactivity.pauseTracking();
        callWithAsyncErrorHandling(hook, instance, 8, [
          vnode.el,
          binding,
          vnode,
          prevVNode
        ]);
        reactivity.resetTracking();
      }
    }
  }
  const TeleportEndKey = Symbol("_vte");
  const isTeleport = (type) => type.__isTeleport;
  const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
  const isTeleportDeferred = (props) => props && (props.defer || props.defer === "");
  const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
  const isTargetMathML = (target) => typeof MathMLElement === "function" && target instanceof MathMLElement;
  const resolveTarget = (props, select) => {
    const targetSelector = props && props.to;
    if (shared.isString(targetSelector)) {
      if (!select) {
        return null;
      } else {
        const target = select(targetSelector);
        return target;
      }
    } else {
      return targetSelector;
    }
  };
  const TeleportImpl = {
    name: "Teleport",
    __isTeleport: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals) {
      const {
        mc: mountChildren,
        pc: patchChildren,
        pbc: patchBlockChildren,
        o: { insert, querySelector, createText, createComment }
      } = internals;
      const disabled = isTeleportDisabled(n2.props);
      let { shapeFlag, children, dynamicChildren } = n2;
      if (n1 == null) {
        const placeholder = n2.el = createText("");
        const mainAnchor = n2.anchor = createText("");
        insert(placeholder, container, anchor);
        insert(mainAnchor, container, anchor);
        const mount = (container2, anchor2) => {
          if (shapeFlag & 16) {
            if (parentComponent && parentComponent.isCE) {
              parentComponent.ce._teleportTarget = container2;
            }
            mountChildren(
              children,
              container2,
              anchor2,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        };
        const mountToTarget = () => {
          const target = n2.target = resolveTarget(n2.props, querySelector);
          const targetAnchor = prepareAnchor(target, n2, createText, insert);
          if (target) {
            if (namespace !== "svg" && isTargetSVG(target)) {
              namespace = "svg";
            } else if (namespace !== "mathml" && isTargetMathML(target)) {
              namespace = "mathml";
            }
            if (!disabled) {
              mount(target, targetAnchor);
              updateCssVars(n2, false);
            }
          }
        };
        if (disabled) {
          mount(container, mainAnchor);
          updateCssVars(n2, true);
        }
        if (isTeleportDeferred(n2.props)) {
          n2.el.__isMounted = false;
          queuePostRenderEffect(() => {
            mountToTarget();
            delete n2.el.__isMounted;
          }, parentSuspense);
        } else {
          mountToTarget();
        }
      } else {
        if (isTeleportDeferred(n2.props) && n1.el.__isMounted === false) {
          queuePostRenderEffect(() => {
            TeleportImpl.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          }, parentSuspense);
          return;
        }
        n2.el = n1.el;
        n2.targetStart = n1.targetStart;
        const mainAnchor = n2.anchor = n1.anchor;
        const target = n2.target = n1.target;
        const targetAnchor = n2.targetAnchor = n1.targetAnchor;
        const wasDisabled = isTeleportDisabled(n1.props);
        const currentContainer = wasDisabled ? container : target;
        const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
        if (namespace === "svg" || isTargetSVG(target)) {
          namespace = "svg";
        } else if (namespace === "mathml" || isTargetMathML(target)) {
          namespace = "mathml";
        }
        if (dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            currentContainer,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds
          );
          traverseStaticChildren(n1, n2, true);
        } else if (!optimized) {
          patchChildren(
            n1,
            n2,
            currentContainer,
            currentAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            false
          );
        }
        if (disabled) {
          if (!wasDisabled) {
            moveTeleport(
              n2,
              container,
              mainAnchor,
              internals,
              1
            );
          } else {
            if (n2.props && n1.props && n2.props.to !== n1.props.to) {
              n2.props.to = n1.props.to;
            }
          }
        } else {
          if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
            const nextTarget = n2.target = resolveTarget(
              n2.props,
              querySelector
            );
            if (nextTarget) {
              moveTeleport(
                n2,
                nextTarget,
                null,
                internals,
                0
              );
            }
          } else if (wasDisabled) {
            moveTeleport(
              n2,
              target,
              targetAnchor,
              internals,
              1
            );
          }
        }
        updateCssVars(n2, disabled);
      }
    },
    remove(vnode, parentComponent, parentSuspense, { um: unmount, o: { remove: hostRemove } }, doRemove) {
      const {
        shapeFlag,
        children,
        anchor,
        targetStart,
        targetAnchor,
        target,
        props
      } = vnode;
      if (target) {
        hostRemove(targetStart);
        hostRemove(targetAnchor);
      }
      doRemove && hostRemove(anchor);
      if (shapeFlag & 16) {
        const shouldRemove = doRemove || !isTeleportDisabled(props);
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          unmount(
            child,
            parentComponent,
            parentSuspense,
            shouldRemove,
            !!child.dynamicChildren
          );
        }
      }
    },
    move: moveTeleport,
    hydrate: hydrateTeleport
  };
  function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
    if (moveType === 0) {
      insert(vnode.targetAnchor, container, parentAnchor);
    }
    const { el, anchor, shapeFlag, children, props } = vnode;
    const isReorder = moveType === 2;
    if (isReorder) {
      insert(el, container, parentAnchor);
    }
    if (!isReorder || isTeleportDisabled(props)) {
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          move(
            children[i],
            container,
            parentAnchor,
            2
          );
        }
      }
    }
    if (isReorder) {
      insert(anchor, container, parentAnchor);
    }
  }
  function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
    o: { nextSibling, parentNode, querySelector, insert, createText }
  }, hydrateChildren) {
    const target = vnode.target = resolveTarget(
      vnode.props,
      querySelector
    );
    if (target) {
      const disabled = isTeleportDisabled(vnode.props);
      const targetNode = target._lpa || target.firstChild;
      if (vnode.shapeFlag & 16) {
        if (disabled) {
          vnode.anchor = hydrateChildren(
            nextSibling(node),
            vnode,
            parentNode(node),
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
          vnode.targetStart = targetNode;
          vnode.targetAnchor = targetNode && nextSibling(targetNode);
        } else {
          vnode.anchor = nextSibling(node);
          let targetAnchor = targetNode;
          while (targetAnchor) {
            if (targetAnchor && targetAnchor.nodeType === 8) {
              if (targetAnchor.data === "teleport start anchor") {
                vnode.targetStart = targetAnchor;
              } else if (targetAnchor.data === "teleport anchor") {
                vnode.targetAnchor = targetAnchor;
                target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
                break;
              }
            }
            targetAnchor = nextSibling(targetAnchor);
          }
          if (!vnode.targetAnchor) {
            prepareAnchor(target, vnode, createText, insert);
          }
          hydrateChildren(
            targetNode && nextSibling(targetNode),
            vnode,
            target,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
        }
      }
      updateCssVars(vnode, disabled);
    }
    return vnode.anchor && nextSibling(vnode.anchor);
  }
  const Teleport = TeleportImpl;
  function updateCssVars(vnode, isDisabled) {
    const ctx = vnode.ctx;
    if (ctx && ctx.ut) {
      let node, anchor;
      if (isDisabled) {
        node = vnode.el;
        anchor = vnode.anchor;
      } else {
        node = vnode.targetStart;
        anchor = vnode.targetAnchor;
      }
      while (node && node !== anchor) {
        if (node.nodeType === 1) node.setAttribute("data-v-owner", ctx.uid);
        node = node.nextSibling;
      }
      ctx.ut();
    }
  }
  function prepareAnchor(target, vnode, createText, insert) {
    const targetStart = vnode.targetStart = createText("");
    const targetAnchor = vnode.targetAnchor = createText("");
    targetStart[TeleportEndKey] = targetAnchor;
    if (target) {
      insert(targetStart, target);
      insert(targetAnchor, target);
    }
    return targetAnchor;
  }
  const leaveCbKey = Symbol("_leaveCb");
  const enterCbKey = Symbol("_enterCb");
  function useTransitionState() {
    const state = {
      isMounted: false,
      isLeaving: false,
      isUnmounting: false,
      leavingVNodes: /* @__PURE__ */ new Map()
    };
    return state;
  }
  const TransitionHookValidator = [Function, Array];
  const BaseTransitionPropsValidators = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    // enter
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    // leave
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    // appear
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  };
  const recursiveGetSubtree = (instance) => {
    const subTree = instance.subTree;
    return subTree.component ? recursiveGetSubtree(subTree.component) : subTree;
  };
  const BaseTransitionImpl = {
    name: `BaseTransition`,
    props: BaseTransitionPropsValidators,
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const state = useTransitionState();
      return () => {
        const children = slots.default && getTransitionRawChildren(slots.default(), true);
        if (!children || !children.length) {
          return;
        }
        const child = findNonCommentChild(children);
        const rawProps = reactivity.toRaw(props);
        const { mode } = rawProps;
        if (state.isLeaving) {
          return emptyPlaceholder(child);
        }
        const innerChild = getInnerChild$1(child);
        if (!innerChild) {
          return emptyPlaceholder(child);
        }
        let enterHooks = resolveTransitionHooks(
          innerChild,
          rawProps,
          state,
          instance,
          // #11061, ensure enterHooks is fresh after clone
          (hooks) => enterHooks = hooks
        );
        if (innerChild.type !== Comment) {
          setTransitionHooks(innerChild, enterHooks);
        }
        let oldInnerChild = instance.subTree && getInnerChild$1(instance.subTree);
        if (oldInnerChild && oldInnerChild.type !== Comment && !isSameVNodeType(innerChild, oldInnerChild) && recursiveGetSubtree(instance).type !== Comment) {
          let leavingHooks = resolveTransitionHooks(
            oldInnerChild,
            rawProps,
            state,
            instance
          );
          setTransitionHooks(oldInnerChild, leavingHooks);
          if (mode === "out-in" && innerChild.type !== Comment) {
            state.isLeaving = true;
            leavingHooks.afterLeave = () => {
              state.isLeaving = false;
              if (!(instance.job.flags & 8)) {
                instance.update();
              }
              delete leavingHooks.afterLeave;
              oldInnerChild = void 0;
            };
            return emptyPlaceholder(child);
          } else if (mode === "in-out" && innerChild.type !== Comment) {
            leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
              const leavingVNodesCache = getLeavingNodesForType(
                state,
                oldInnerChild
              );
              leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
              el[leaveCbKey] = () => {
                earlyRemove();
                el[leaveCbKey] = void 0;
                delete enterHooks.delayedLeave;
                oldInnerChild = void 0;
              };
              enterHooks.delayedLeave = () => {
                delayedLeave();
                delete enterHooks.delayedLeave;
                oldInnerChild = void 0;
              };
            };
          } else {
            oldInnerChild = void 0;
          }
        } else if (oldInnerChild) {
          oldInnerChild = void 0;
        }
        return child;
      };
    }
  };
  function findNonCommentChild(children) {
    let child = children[0];
    if (children.length > 1) {
      for (const c of children) {
        if (c.type !== Comment) {
          child = c;
          break;
        }
      }
    }
    return child;
  }
  const BaseTransition = BaseTransitionImpl;
  function getLeavingNodesForType(state, vnode) {
    const { leavingVNodes } = state;
    let leavingVNodesCache = leavingVNodes.get(vnode.type);
    if (!leavingVNodesCache) {
      leavingVNodesCache = /* @__PURE__ */ Object.create(null);
      leavingVNodes.set(vnode.type, leavingVNodesCache);
    }
    return leavingVNodesCache;
  }
  function resolveTransitionHooks(vnode, props, state, instance, postClone) {
    const {
      appear,
      mode,
      persisted = false,
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      onEnterCancelled,
      onBeforeLeave,
      onLeave,
      onAfterLeave,
      onLeaveCancelled,
      onBeforeAppear,
      onAppear,
      onAfterAppear,
      onAppearCancelled
    } = props;
    const key = String(vnode.key);
    const leavingVNodesCache = getLeavingNodesForType(state, vnode);
    const callHook2 = (hook, args) => {
      hook && callWithAsyncErrorHandling(
        hook,
        instance,
        9,
        args
      );
    };
    const callAsyncHook = (hook, args) => {
      const done = args[1];
      callHook2(hook, args);
      if (shared.isArray(hook)) {
        if (hook.every((hook2) => hook2.length <= 1)) done();
      } else if (hook.length <= 1) {
        done();
      }
    };
    const hooks = {
      mode,
      persisted,
      beforeEnter(el) {
        let hook = onBeforeEnter;
        if (!state.isMounted) {
          if (appear) {
            hook = onBeforeAppear || onBeforeEnter;
          } else {
            return;
          }
        }
        if (el[leaveCbKey]) {
          el[leaveCbKey](
            true
            /* cancelled */
          );
        }
        const leavingVNode = leavingVNodesCache[key];
        if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) {
          leavingVNode.el[leaveCbKey]();
        }
        callHook2(hook, [el]);
      },
      enter(el) {
        let hook = onEnter;
        let afterHook = onAfterEnter;
        let cancelHook = onEnterCancelled;
        if (!state.isMounted) {
          if (appear) {
            hook = onAppear || onEnter;
            afterHook = onAfterAppear || onAfterEnter;
            cancelHook = onAppearCancelled || onEnterCancelled;
          } else {
            return;
          }
        }
        let called = false;
        const done = el[enterCbKey] = (cancelled) => {
          if (called) return;
          called = true;
          if (cancelled) {
            callHook2(cancelHook, [el]);
          } else {
            callHook2(afterHook, [el]);
          }
          if (hooks.delayedLeave) {
            hooks.delayedLeave();
          }
          el[enterCbKey] = void 0;
        };
        if (hook) {
          callAsyncHook(hook, [el, done]);
        } else {
          done();
        }
      },
      leave(el, remove) {
        const key2 = String(vnode.key);
        if (el[enterCbKey]) {
          el[enterCbKey](
            true
            /* cancelled */
          );
        }
        if (state.isUnmounting) {
          return remove();
        }
        callHook2(onBeforeLeave, [el]);
        let called = false;
        const done = el[leaveCbKey] = (cancelled) => {
          if (called) return;
          called = true;
          remove();
          if (cancelled) {
            callHook2(onLeaveCancelled, [el]);
          } else {
            callHook2(onAfterLeave, [el]);
          }
          el[leaveCbKey] = void 0;
          if (leavingVNodesCache[key2] === vnode) {
            delete leavingVNodesCache[key2];
          }
        };
        leavingVNodesCache[key2] = vnode;
        if (onLeave) {
          callAsyncHook(onLeave, [el, done]);
        } else {
          done();
        }
      },
      clone(vnode2) {
        const hooks2 = resolveTransitionHooks(
          vnode2,
          props,
          state,
          instance,
          postClone
        );
        if (postClone) postClone(hooks2);
        return hooks2;
      }
    };
    return hooks;
  }
  function emptyPlaceholder(vnode) {
    if (isKeepAlive(vnode)) {
      vnode = cloneVNode(vnode);
      vnode.children = null;
      return vnode;
    }
  }
  function getInnerChild$1(vnode) {
    if (!isKeepAlive(vnode)) {
      if (isTeleport(vnode.type) && vnode.children) {
        return findNonCommentChild(vnode.children);
      }
      return vnode;
    }
    if (vnode.component) {
      return vnode.component.subTree;
    }
    const { shapeFlag, children } = vnode;
    if (children) {
      if (shapeFlag & 16) {
        return children[0];
      }
      if (shapeFlag & 32 && shared.isFunction(children.default)) {
        return children.default();
      }
    }
  }
  function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6 && vnode.component) {
      vnode.transition = hooks;
      setTransitionHooks(vnode.component.subTree, hooks);
    } else if (vnode.shapeFlag & 128) {
      vnode.ssContent.transition = hooks.clone(vnode.ssContent);
      vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
    } else {
      vnode.transition = hooks;
    }
  }
  function getTransitionRawChildren(children, keepComment = false, parentKey) {
    let ret = [];
    let keyedFragmentCount = 0;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
      if (child.type === Fragment) {
        if (child.patchFlag & 128) keyedFragmentCount++;
        ret = ret.concat(
          getTransitionRawChildren(child.children, keepComment, key)
        );
      } else if (keepComment || child.type !== Comment) {
        ret.push(key != null ? cloneVNode(child, { key }) : child);
      }
    }
    if (keyedFragmentCount > 1) {
      for (let i = 0; i < ret.length; i++) {
        ret[i].patchFlag = -2;
      }
    }
    return ret;
  }
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function defineComponent(options, extraOptions) {
    return shared.isFunction(options) ? (
      // #8236: extend call and options.name access are considered side-effects
      // by Rollup, so we have to wrap it in a pure-annotated IIFE.
      /* @__PURE__ */ (() => shared.extend({ name: options.name }, extraOptions, { setup: options }))()
    ) : options;
  }
  function useId() {
    const i = getCurrentInstance();
    if (i) {
      return (i.appContext.config.idPrefix || "v") + "-" + i.ids[0] + i.ids[1]++;
    }
    return "";
  }
  function markAsyncBoundary(instance) {
    instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
  }
  function useTemplateRef(key) {
    const i = getCurrentInstance();
    const r2 = reactivity.shallowRef(null);
    if (i) {
      const refs = i.refs === shared.EMPTY_OBJ ? i.refs = {} : i.refs;
      {
        Object.defineProperty(refs, key, {
          enumerable: true,
          get: () => r2.value,
          set: (val) => r2.value = val
        });
      }
    }
    const ret = r2;
    return ret;
  }
  function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
    if (shared.isArray(rawRef)) {
      rawRef.forEach(
        (r2, i) => setRef(
          r2,
          oldRawRef && (shared.isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
          parentSuspense,
          vnode,
          isUnmount
        )
      );
      return;
    }
    if (isAsyncWrapper(vnode) && !isUnmount) {
      if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
        setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
      }
      return;
    }
    const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
    const value = isUnmount ? null : refValue;
    const { i: owner, r: ref } = rawRef;
    const oldRef = oldRawRef && oldRawRef.r;
    const refs = owner.refs === shared.EMPTY_OBJ ? owner.refs = {} : owner.refs;
    const setupState = owner.setupState;
    const rawSetupState = reactivity.toRaw(setupState);
    const canSetSetupRef = setupState === shared.EMPTY_OBJ ? () => false : (key) => {
      return shared.hasOwn(rawSetupState, key);
    };
    if (oldRef != null && oldRef !== ref) {
      if (shared.isString(oldRef)) {
        refs[oldRef] = null;
        if (canSetSetupRef(oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (reactivity.isRef(oldRef)) {
        oldRef.value = null;
      }
    }
    if (shared.isFunction(ref)) {
      callWithErrorHandling(ref, owner, 12, [value, refs]);
    } else {
      const _isString = shared.isString(ref);
      const _isRef = reactivity.isRef(ref);
      if (_isString || _isRef) {
        const doSet = () => {
          if (rawRef.f) {
            const existing = _isString ? canSetSetupRef(ref) ? setupState[ref] : refs[ref] : ref.value;
            if (isUnmount) {
              shared.isArray(existing) && shared.remove(existing, refValue);
            } else {
              if (!shared.isArray(existing)) {
                if (_isString) {
                  refs[ref] = [refValue];
                  if (canSetSetupRef(ref)) {
                    setupState[ref] = refs[ref];
                  }
                } else {
                  ref.value = [refValue];
                  if (rawRef.k) refs[rawRef.k] = ref.value;
                }
              } else if (!existing.includes(refValue)) {
                existing.push(refValue);
              }
            }
          } else if (_isString) {
            refs[ref] = value;
            if (canSetSetupRef(ref)) {
              setupState[ref] = value;
            }
          } else if (_isRef) {
            ref.value = value;
            if (rawRef.k) refs[rawRef.k] = value;
          } else ;
        };
        if (value) {
          doSet.id = -1;
          queuePostRenderEffect(doSet, parentSuspense);
        } else {
          doSet();
        }
      }
    }
  }
  let hasLoggedMismatchError = false;
  const logMismatchError = () => {
    if (hasLoggedMismatchError) {
      return;
    }
    console.error("Hydration completed but contains mismatches.");
    hasLoggedMismatchError = true;
  };
  const isSVGContainer = (container) => container.namespaceURI.includes("svg") && container.tagName !== "foreignObject";
  const isMathMLContainer = (container) => container.namespaceURI.includes("MathML");
  const getContainerType = (container) => {
    if (container.nodeType !== 1) return void 0;
    if (isSVGContainer(container)) return "svg";
    if (isMathMLContainer(container)) return "mathml";
    return void 0;
  };
  const isComment = (node) => node.nodeType === 8;
  function createHydrationFunctions(rendererInternals) {
    const {
      mt: mountComponent,
      p: patch,
      o: {
        patchProp,
        createText,
        nextSibling,
        parentNode,
        remove,
        insert,
        createComment
      }
    } = rendererInternals;
    const hydrate = (vnode, container) => {
      if (!container.hasChildNodes()) {
        patch(null, vnode, container);
        flushPostFlushCbs();
        container._vnode = vnode;
        return;
      }
      hydrateNode(container.firstChild, vnode, null, null, null);
      flushPostFlushCbs();
      container._vnode = vnode;
    };
    const hydrateNode = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
      optimized = optimized || !!vnode.dynamicChildren;
      const isFragmentStart = isComment(node) && node.data === "[";
      const onMismatch = () => handleMismatch(
        node,
        vnode,
        parentComponent,
        parentSuspense,
        slotScopeIds,
        isFragmentStart
      );
      const { type, ref, shapeFlag, patchFlag } = vnode;
      let domType = node.nodeType;
      vnode.el = node;
      if (patchFlag === -2) {
        optimized = false;
        vnode.dynamicChildren = null;
      }
      let nextNode = null;
      switch (type) {
        case Text:
          if (domType !== 3) {
            if (vnode.children === "") {
              insert(vnode.el = createText(""), parentNode(node), node);
              nextNode = node;
            } else {
              nextNode = onMismatch();
            }
          } else {
            if (node.data !== vnode.children) {
              logMismatchError();
              node.data = vnode.children;
            }
            nextNode = nextSibling(node);
          }
          break;
        case Comment:
          if (isTemplateNode(node)) {
            nextNode = nextSibling(node);
            replaceNode(
              vnode.el = node.content.firstChild,
              node,
              parentComponent
            );
          } else if (domType !== 8 || isFragmentStart) {
            nextNode = onMismatch();
          } else {
            nextNode = nextSibling(node);
          }
          break;
        case Static:
          if (isFragmentStart) {
            node = nextSibling(node);
            domType = node.nodeType;
          }
          if (domType === 1 || domType === 3) {
            nextNode = node;
            const needToAdoptContent = !vnode.children.length;
            for (let i = 0; i < vnode.staticCount; i++) {
              if (needToAdoptContent)
                vnode.children += nextNode.nodeType === 1 ? nextNode.outerHTML : nextNode.data;
              if (i === vnode.staticCount - 1) {
                vnode.anchor = nextNode;
              }
              nextNode = nextSibling(nextNode);
            }
            return isFragmentStart ? nextSibling(nextNode) : nextNode;
          } else {
            onMismatch();
          }
          break;
        case Fragment:
          if (!isFragmentStart) {
            nextNode = onMismatch();
          } else {
            nextNode = hydrateFragment(
              node,
              vnode,
              parentComponent,
              parentSuspense,
              slotScopeIds,
              optimized
            );
          }
          break;
        default:
          if (shapeFlag & 1) {
            if ((domType !== 1 || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) && !isTemplateNode(node)) {
              nextNode = onMismatch();
            } else {
              nextNode = hydrateElement(
                node,
                vnode,
                parentComponent,
                parentSuspense,
                slotScopeIds,
                optimized
              );
            }
          } else if (shapeFlag & 6) {
            vnode.slotScopeIds = slotScopeIds;
            const container = parentNode(node);
            if (isFragmentStart) {
              nextNode = locateClosingAnchor(node);
            } else if (isComment(node) && node.data === "teleport start") {
              nextNode = locateClosingAnchor(node, node.data, "teleport end");
            } else {
              nextNode = nextSibling(node);
            }
            mountComponent(
              vnode,
              container,
              null,
              parentComponent,
              parentSuspense,
              getContainerType(container),
              optimized
            );
            if (isAsyncWrapper(vnode) && !vnode.type.__asyncResolved) {
              let subTree;
              if (isFragmentStart) {
                subTree = createVNode(Fragment);
                subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
              } else {
                subTree = node.nodeType === 3 ? createTextVNode("") : createVNode("div");
              }
              subTree.el = node;
              vnode.component.subTree = subTree;
            }
          } else if (shapeFlag & 64) {
            if (domType !== 8) {
              nextNode = onMismatch();
            } else {
              nextNode = vnode.type.hydrate(
                node,
                vnode,
                parentComponent,
                parentSuspense,
                slotScopeIds,
                optimized,
                rendererInternals,
                hydrateChildren
              );
            }
          } else if (shapeFlag & 128) {
            nextNode = vnode.type.hydrate(
              node,
              vnode,
              parentComponent,
              parentSuspense,
              getContainerType(parentNode(node)),
              slotScopeIds,
              optimized,
              rendererInternals,
              hydrateNode
            );
          } else ;
      }
      if (ref != null) {
        setRef(ref, null, parentSuspense, vnode);
      }
      return nextNode;
    };
    const hydrateElement = (el, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      optimized = optimized || !!vnode.dynamicChildren;
      const { type, props, patchFlag, shapeFlag, dirs, transition } = vnode;
      const forcePatch = type === "input" || type === "option";
      if (forcePatch || patchFlag !== -1) {
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "created");
        }
        let needCallTransitionHooks = false;
        if (isTemplateNode(el)) {
          needCallTransitionHooks = needTransition(
            null,
            // no need check parentSuspense in hydration
            transition
          ) && parentComponent && parentComponent.vnode.props && parentComponent.vnode.props.appear;
          const content = el.content.firstChild;
          if (needCallTransitionHooks) {
            const cls = content.getAttribute("class");
            if (cls) content.$cls = cls;
            transition.beforeEnter(content);
          }
          replaceNode(content, el, parentComponent);
          vnode.el = el = content;
        }
        if (shapeFlag & 16 && // skip if element has innerHTML / textContent
        !(props && (props.innerHTML || props.textContent))) {
          let next = hydrateChildren(
            el.firstChild,
            vnode,
            el,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
          while (next) {
            if (!isMismatchAllowed(
              el,
              1
              /* CHILDREN */
            )) {
              logMismatchError();
            }
            const cur = next;
            next = next.nextSibling;
            remove(cur);
          }
        } else if (shapeFlag & 8) {
          let clientText = vnode.children;
          if (clientText[0] === "\n" && (el.tagName === "PRE" || el.tagName === "TEXTAREA")) {
            clientText = clientText.slice(1);
          }
          if (el.textContent !== clientText) {
            if (!isMismatchAllowed(
              el,
              0
              /* TEXT */
            )) {
              logMismatchError();
            }
            el.textContent = vnode.children;
          }
        }
        if (props) {
          if (forcePatch || !optimized || patchFlag & (16 | 32)) {
            const isCustomElement = el.tagName.includes("-");
            for (const key in props) {
              if (forcePatch && (key.endsWith("value") || key === "indeterminate") || shared.isOn(key) && !shared.isReservedProp(key) || // force hydrate v-bind with .prop modifiers
              key[0] === "." || isCustomElement) {
                patchProp(el, key, null, props[key], void 0, parentComponent);
              }
            }
          } else if (props.onClick) {
            patchProp(
              el,
              "onClick",
              null,
              props.onClick,
              void 0,
              parentComponent
            );
          } else if (patchFlag & 4 && reactivity.isReactive(props.style)) {
            for (const key in props.style) props.style[key];
          }
        }
        let vnodeHooks;
        if (vnodeHooks = props && props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHooks, parentComponent, vnode);
        }
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
        }
        if ((vnodeHooks = props && props.onVnodeMounted) || dirs || needCallTransitionHooks) {
          queueEffectWithSuspense(() => {
            vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
            needCallTransitionHooks && transition.enter(el);
            dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
          }, parentSuspense);
        }
      }
      return el.nextSibling;
    };
    const hydrateChildren = (node, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      optimized = optimized || !!parentVNode.dynamicChildren;
      const children = parentVNode.children;
      const l = children.length;
      for (let i = 0; i < l; i++) {
        const vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);
        const isText = vnode.type === Text;
        if (node) {
          if (isText && !optimized) {
            if (i + 1 < l && normalizeVNode(children[i + 1]).type === Text) {
              insert(
                createText(
                  node.data.slice(vnode.children.length)
                ),
                container,
                nextSibling(node)
              );
              node.data = vnode.children;
            }
          }
          node = hydrateNode(
            node,
            vnode,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
        } else if (isText && !vnode.children) {
          insert(vnode.el = createText(""), container);
        } else {
          if (!isMismatchAllowed(
            container,
            1
            /* CHILDREN */
          )) {
            logMismatchError();
          }
          patch(
            null,
            vnode,
            container,
            null,
            parentComponent,
            parentSuspense,
            getContainerType(container),
            slotScopeIds
          );
        }
      }
      return node;
    };
    const hydrateFragment = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      const { slotScopeIds: fragmentSlotScopeIds } = vnode;
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      const container = parentNode(node);
      const next = hydrateChildren(
        nextSibling(node),
        vnode,
        container,
        parentComponent,
        parentSuspense,
        slotScopeIds,
        optimized
      );
      if (next && isComment(next) && next.data === "]") {
        return nextSibling(vnode.anchor = next);
      } else {
        logMismatchError();
        insert(vnode.anchor = createComment(`]`), container, next);
        return next;
      }
    };
    const handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
      if (!isMismatchAllowed(
        node.parentElement,
        1
        /* CHILDREN */
      )) {
        logMismatchError();
      }
      vnode.el = null;
      if (isFragment) {
        const end = locateClosingAnchor(node);
        while (true) {
          const next2 = nextSibling(node);
          if (next2 && next2 !== end) {
            remove(next2);
          } else {
            break;
          }
        }
      }
      const next = nextSibling(node);
      const container = parentNode(node);
      remove(node);
      patch(
        null,
        vnode,
        container,
        next,
        parentComponent,
        parentSuspense,
        getContainerType(container),
        slotScopeIds
      );
      if (parentComponent) {
        parentComponent.vnode.el = vnode.el;
        updateHOCHostEl(parentComponent, vnode.el);
      }
      return next;
    };
    const locateClosingAnchor = (node, open = "[", close = "]") => {
      let match = 0;
      while (node) {
        node = nextSibling(node);
        if (node && isComment(node)) {
          if (node.data === open) match++;
          if (node.data === close) {
            if (match === 0) {
              return nextSibling(node);
            } else {
              match--;
            }
          }
        }
      }
      return node;
    };
    const replaceNode = (newNode, oldNode, parentComponent) => {
      const parentNode2 = oldNode.parentNode;
      if (parentNode2) {
        parentNode2.replaceChild(newNode, oldNode);
      }
      let parent = parentComponent;
      while (parent) {
        if (parent.vnode.el === oldNode) {
          parent.vnode.el = parent.subTree.el = newNode;
        }
        parent = parent.parent;
      }
    };
    const isTemplateNode = (node) => {
      return node.nodeType === 1 && node.tagName === "TEMPLATE";
    };
    return [hydrate, hydrateNode];
  }
  const allowMismatchAttr = "data-allow-mismatch";
  const MismatchTypeString = {
    [
      0
      /* TEXT */
    ]: "text",
    [
      1
      /* CHILDREN */
    ]: "children",
    [
      2
      /* CLASS */
    ]: "class",
    [
      3
      /* STYLE */
    ]: "style",
    [
      4
      /* ATTRIBUTE */
    ]: "attribute"
  };
  function isMismatchAllowed(el, allowedType) {
    if (allowedType === 0 || allowedType === 1) {
      while (el && !el.hasAttribute(allowMismatchAttr)) {
        el = el.parentElement;
      }
    }
    const allowedAttr = el && el.getAttribute(allowMismatchAttr);
    if (allowedAttr == null) {
      return false;
    } else if (allowedAttr === "") {
      return true;
    } else {
      const list = allowedAttr.split(",");
      if (allowedType === 0 && list.includes("children")) {
        return true;
      }
      return allowedAttr.split(",").includes(MismatchTypeString[allowedType]);
    }
  }
  const requestIdleCallback = shared.getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
  const cancelIdleCallback = shared.getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
  const hydrateOnIdle = (timeout = 1e4) => (hydrate) => {
    const id = requestIdleCallback(hydrate, { timeout });
    return () => cancelIdleCallback(id);
  };
  function elementIsVisibleInViewport(el) {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = void 0;
    return (top > 0 && top < innerHeight || bottom > 0 && bottom < innerHeight) && (left > 0 && left < innerWidth || right > 0 && right < innerWidth);
  }
  const hydrateOnVisible = (opts) => (hydrate, forEach) => {
    const ob = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        ob.disconnect();
        hydrate();
        break;
      }
    }, opts);
    forEach((el) => {
      if (!(el instanceof Element)) return;
      if (elementIsVisibleInViewport(el)) {
        hydrate();
        ob.disconnect();
        return false;
      }
      ob.observe(el);
    });
    return () => ob.disconnect();
  };
  const hydrateOnMediaQuery = (query) => (hydrate) => {
    if (query) {
      const mql = matchMedia(query);
      if (mql.matches) {
        hydrate();
      } else {
        mql.addEventListener("change", hydrate, { once: true });
        return () => mql.removeEventListener("change", hydrate);
      }
    }
  };
  const hydrateOnInteraction = (interactions = []) => (hydrate, forEach) => {
    if (shared.isString(interactions)) interactions = [interactions];
    let hasHydrated = false;
    const doHydrate = (e) => {
      if (!hasHydrated) {
        hasHydrated = true;
        teardown();
        hydrate();
        e.target.dispatchEvent(new e.constructor(e.type, e));
      }
    };
    const teardown = () => {
      forEach((el) => {
        for (const i of interactions) {
          el.removeEventListener(i, doHydrate);
        }
      });
    };
    forEach((el) => {
      for (const i of interactions) {
        el.addEventListener(i, doHydrate, { once: true });
      }
    });
    return teardown;
  };
  function forEachElement(node, cb) {
    if (isComment(node) && node.data === "[") {
      let depth = 1;
      let next = node.nextSibling;
      while (next) {
        if (next.nodeType === 1) {
          const result = cb(next);
          if (result === false) {
            break;
          }
        } else if (isComment(next)) {
          if (next.data === "]") {
            if (--depth === 0) break;
          } else if (next.data === "[") {
            depth++;
          }
        }
        next = next.nextSibling;
      }
    } else {
      cb(node);
    }
  }
  const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function defineAsyncComponent(source) {
    if (shared.isFunction(source)) {
      source = { loader: source };
    }
    const {
      loader,
      loadingComponent,
      errorComponent,
      delay = 200,
      hydrate: hydrateStrategy,
      timeout,
      // undefined = never times out
      suspensible = true,
      onError: userOnError
    } = source;
    let pendingRequest = null;
    let resolvedComp;
    let retries = 0;
    const retry = () => {
      retries++;
      pendingRequest = null;
      return load();
    };
    const load = () => {
      let thisRequest;
      return pendingRequest || (thisRequest = pendingRequest = loader().catch((err) => {
        err = err instanceof Error ? err : new Error(String(err));
        if (userOnError) {
          return new Promise((resolve2, reject) => {
            const userRetry = () => resolve2(retry());
            const userFail = () => reject(err);
            userOnError(err, userRetry, userFail, retries + 1);
          });
        } else {
          throw err;
        }
      }).then((comp) => {
        if (thisRequest !== pendingRequest && pendingRequest) {
          return pendingRequest;
        }
        if (comp && (comp.__esModule || comp[Symbol.toStringTag] === "Module")) {
          comp = comp.default;
        }
        resolvedComp = comp;
        return comp;
      }));
    };
    return /* @__PURE__ */ defineComponent({
      name: "AsyncComponentWrapper",
      __asyncLoader: load,
      __asyncHydrate(el, instance, hydrate) {
        const doHydrate = hydrateStrategy ? () => {
          const performHydrate = () => {
            hydrate();
          };
          const teardown = hydrateStrategy(
            performHydrate,
            (cb) => forEachElement(el, cb)
          );
          if (teardown) {
            (instance.bum || (instance.bum = [])).push(teardown);
          }
          (instance.u || (instance.u = [])).push(() => true);
        } : hydrate;
        if (resolvedComp) {
          doHydrate();
        } else {
          load().then(() => !instance.isUnmounted && doHydrate());
        }
      },
      get __asyncResolved() {
        return resolvedComp;
      },
      setup() {
        const instance = currentInstance;
        markAsyncBoundary(instance);
        if (resolvedComp) {
          return () => createInnerComp(resolvedComp, instance);
        }
        const onError = (err) => {
          pendingRequest = null;
          handleError(
            err,
            instance,
            13,
            !errorComponent
          );
        };
        if (suspensible && instance.suspense || isInSSRComponentSetup) {
          return load().then((comp) => {
            return () => createInnerComp(comp, instance);
          }).catch((err) => {
            onError(err);
            return () => errorComponent ? createVNode(errorComponent, {
              error: err
            }) : null;
          });
        }
        const loaded = reactivity.ref(false);
        const error = reactivity.ref();
        const delayed = reactivity.ref(!!delay);
        if (delay) {
          setTimeout(() => {
            delayed.value = false;
          }, delay);
        }
        if (timeout != null) {
          setTimeout(() => {
            if (!loaded.value && !error.value) {
              const err = new Error(
                `Async component timed out after ${timeout}ms.`
              );
              onError(err);
              error.value = err;
            }
          }, timeout);
        }
        load().then(() => {
          loaded.value = true;
          if (instance.parent && isKeepAlive(instance.parent.vnode)) {
            instance.parent.update();
          }
        }).catch((err) => {
          onError(err);
          error.value = err;
        });
        return () => {
          if (loaded.value && resolvedComp) {
            return createInnerComp(resolvedComp, instance);
          } else if (error.value && errorComponent) {
            return createVNode(errorComponent, {
              error: error.value
            });
          } else if (loadingComponent && !delayed.value) {
            return createVNode(loadingComponent);
          }
        };
      }
    });
  }
  function createInnerComp(comp, parent) {
    const { ref: ref2, props, children, ce } = parent.vnode;
    const vnode = createVNode(comp, props, children);
    vnode.ref = ref2;
    vnode.ce = ce;
    delete parent.vnode.ce;
    return vnode;
  }
  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  const KeepAliveImpl = {
    name: `KeepAlive`,
    // Marker for special handling inside the renderer. We are not using a ===
    // check directly on KeepAlive in the renderer, because importing it directly
    // would prevent it from being tree-shaken.
    __isKeepAlive: true,
    props: {
      include: [String, RegExp, Array],
      exclude: [String, RegExp, Array],
      max: [String, Number]
    },
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const sharedContext = instance.ctx;
      if (!sharedContext.renderer) {
        return () => {
          const children = slots.default && slots.default();
          return children && children.length === 1 ? children[0] : children;
        };
      }
      const cache = /* @__PURE__ */ new Map();
      const keys = /* @__PURE__ */ new Set();
      let current = null;
      const parentSuspense = instance.suspense;
      const {
        renderer: {
          p: patch,
          m: move,
          um: _unmount,
          o: { createElement }
        }
      } = sharedContext;
      const storageContainer = createElement("div");
      sharedContext.activate = (vnode, container, anchor, namespace, optimized) => {
        const instance2 = vnode.component;
        move(vnode, container, anchor, 0, parentSuspense);
        patch(
          instance2.vnode,
          vnode,
          container,
          anchor,
          instance2,
          parentSuspense,
          namespace,
          vnode.slotScopeIds,
          optimized
        );
        queuePostRenderEffect(() => {
          instance2.isDeactivated = false;
          if (instance2.a) {
            shared.invokeArrayFns(instance2.a);
          }
          const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance2.parent, vnode);
          }
        }, parentSuspense);
      };
      sharedContext.deactivate = (vnode) => {
        const instance2 = vnode.component;
        invalidateMount(instance2.m);
        invalidateMount(instance2.a);
        move(vnode, storageContainer, null, 1, parentSuspense);
        queuePostRenderEffect(() => {
          if (instance2.da) {
            shared.invokeArrayFns(instance2.da);
          }
          const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance2.parent, vnode);
          }
          instance2.isDeactivated = true;
        }, parentSuspense);
      };
      function unmount(vnode) {
        resetShapeFlag(vnode);
        _unmount(vnode, instance, parentSuspense, true);
      }
      function pruneCache(filter) {
        cache.forEach((vnode, key) => {
          const name = getComponentName(vnode.type);
          if (name && !filter(name)) {
            pruneCacheEntry(key);
          }
        });
      }
      function pruneCacheEntry(key) {
        const cached = cache.get(key);
        if (cached && (!current || !isSameVNodeType(cached, current))) {
          unmount(cached);
        } else if (current) {
          resetShapeFlag(current);
        }
        cache.delete(key);
        keys.delete(key);
      }
      watch(
        () => [props.include, props.exclude],
        ([include, exclude]) => {
          include && pruneCache((name) => matches(include, name));
          exclude && pruneCache((name) => !matches(exclude, name));
        },
        // prune post-render after `current` has been updated
        { flush: "post", deep: true }
      );
      return () => {
        if (!slots.default) {
          return current = null;
        }
        const children = slots.default();
        const rawVNode = children[0];
        if (children.length > 1) {
          current = null;
          return children;
        } else if (!isVNode(rawVNode) || !(rawVNode.shapeFlag & 4) && !(rawVNode.shapeFlag & 128)) {
          current = null;
          return rawVNode;
        }
        let vnode = getInnerChild(rawVNode);
        if (vnode.type === Comment) {
          current = null;
          return vnode;
        }
        const comp = vnode.type;
        const name = getComponentName(
          isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp
        );
        const { include, exclude, max } = props;
        if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
          vnode.shapeFlag &= -257;
          current = vnode;
          return rawVNode;
        }
        const key = vnode.key == null ? comp : vnode.key;
        const cachedVNode = cache.get(key);
        if (vnode.el) {
          vnode = cloneVNode(vnode);
          if (rawVNode.shapeFlag & 128) {
            rawVNode.ssContent = vnode;
          }
        }
        if (cachedVNode) {
          vnode.el = cachedVNode.el;
          vnode.component = cachedVNode.component;
          if (vnode.transition) {
            setTransitionHooks(vnode, vnode.transition);
          }
          vnode.shapeFlag |= 512;
          keys.delete(key);
          keys.add(key);
        } else {
          keys.add(key);
          if (max && keys.size > parseInt(max, 10)) {
            pruneCacheEntry(keys.values().next().value);
          }
        }
        vnode.shapeFlag |= 256;
        current = vnode;
        return isSuspense(rawVNode.type) ? rawVNode : vnode;
      };
    }
  };
  const KeepAlive = KeepAliveImpl;
  function matches(pattern, name) {
    if (shared.isArray(pattern)) {
      return pattern.some((p) => matches(p, name));
    } else if (shared.isString(pattern)) {
      return pattern.split(",").includes(name);
    } else if (shared.isRegExp(pattern)) {
      pattern.lastIndex = 0;
      return pattern.test(name);
    }
    return false;
  }
  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a", target);
  }
  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da", target);
  }
  function registerKeepAliveHook(hook, type, target = currentInstance) {
    const wrappedHook = hook.__wdc || (hook.__wdc = () => {
      let current = target;
      while (current) {
        if (current.isDeactivated) {
          return;
        }
        current = current.parent;
      }
      return hook();
    });
    injectHook(type, wrappedHook, target);
    if (target) {
      let current = target.parent;
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current);
        }
        current = current.parent;
      }
    }
  }
  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    injectHook(
      type,
      hook,
      keepAliveRoot,
      true
      /* prepend */
    );
  }
  function resetShapeFlag(vnode) {
    vnode.shapeFlag &= -257;
    vnode.shapeFlag &= -513;
  }
  function getInnerChild(vnode) {
    return vnode.shapeFlag & 128 ? vnode.ssContent : vnode;
  }
  function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type] || (target[type] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        reactivity.pauseTracking();
        const reset = setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type, args);
        reset();
        reactivity.resetTracking();
        return res;
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => {
    if (!isInSSRComponentSetup || lifecycle === "sp") {
      injectHook(lifecycle, (...args) => hook(...args), target);
    }
  };
  const onBeforeMount = createHook("bm");
  const onMounted = createHook("m");
  const onBeforeUpdate = createHook(
    "bu"
  );
  const onUpdated = createHook("u");
  const onBeforeUnmount = createHook(
    "bum"
  );
  const onUnmounted = createHook("um");
  const onServerPrefetch = createHook(
    "sp"
  );
  const onRenderTriggered = createHook("rtg");
  const onRenderTracked = createHook("rtc");
  function onErrorCaptured(hook, target = currentInstance) {
    injectHook("ec", hook, target);
  }
  const COMPONENTS = "components";
  const DIRECTIVES = "directives";
  function resolveComponent(name, maybeSelfReference) {
    return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
  }
  const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
  function resolveDynamicComponent(component) {
    if (shared.isString(component)) {
      return resolveAsset(COMPONENTS, component, false) || component;
    } else {
      return component || NULL_DYNAMIC_COMPONENT;
    }
  }
  function resolveDirective(name) {
    return resolveAsset(DIRECTIVES, name);
  }
  function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
    const instance = currentRenderingInstance || currentInstance;
    if (instance) {
      const Component = instance.type;
      if (type === COMPONENTS) {
        const selfName = getComponentName(
          Component,
          false
        );
        if (selfName && (selfName === name || selfName === shared.camelize(name) || selfName === shared.capitalize(shared.camelize(name)))) {
          return Component;
        }
      }
      const res = (
        // local registration
        // check instance[type] first which is resolved for options API
        resolve(instance[type] || Component[type], name) || // global registration
        resolve(instance.appContext[type], name)
      );
      if (!res && maybeSelfReference) {
        return Component;
      }
      return res;
    }
  }
  function resolve(registry, name) {
    return registry && (registry[name] || registry[shared.camelize(name)] || registry[shared.capitalize(shared.camelize(name))]);
  }
  function renderList(source, renderItem, cache, index) {
    let ret;
    const cached = cache && cache[index];
    const sourceIsArray = shared.isArray(source);
    if (sourceIsArray || shared.isString(source)) {
      const sourceIsReactiveArray = sourceIsArray && reactivity.isReactive(source);
      let needsWrap = false;
      let isReadonlySource = false;
      if (sourceIsReactiveArray) {
        needsWrap = !reactivity.isShallow(source);
        isReadonlySource = reactivity.isReadonly(source);
        source = reactivity.shallowReadArray(source);
      }
      ret = new Array(source.length);
      for (let i = 0, l = source.length; i < l; i++) {
        ret[i] = renderItem(
          needsWrap ? isReadonlySource ? reactivity.toReadonly(reactivity.toReactive(source[i])) : reactivity.toReactive(source[i]) : source[i],
          i,
          void 0,
          cached && cached[i]
        );
      }
    } else if (typeof source === "number") {
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
      }
    } else if (shared.isObject(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(
          source,
          (item, i) => renderItem(item, i, void 0, cached && cached[i])
        );
      } else {
        const keys = Object.keys(source);
        ret = new Array(keys.length);
        for (let i = 0, l = keys.length; i < l; i++) {
          const key = keys[i];
          ret[i] = renderItem(source[key], key, i, cached && cached[i]);
        }
      }
    } else {
      ret = [];
    }
    if (cache) {
      cache[index] = ret;
    }
    return ret;
  }
  function createSlots(slots, dynamicSlots) {
    for (let i = 0; i < dynamicSlots.length; i++) {
      const slot = dynamicSlots[i];
      if (shared.isArray(slot)) {
        for (let j = 0; j < slot.length; j++) {
          slots[slot[j].name] = slot[j].fn;
        }
      } else if (slot) {
        slots[slot.name] = slot.key ? (...args) => {
          const res = slot.fn(...args);
          if (res) res.key = slot.key;
          return res;
        } : slot.fn;
      }
    }
    return slots;
  }
  function renderSlot(slots, name, props = {}, fallback, noSlotted) {
    if (currentRenderingInstance.ce || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.ce) {
      if (name !== "default") props.name = name;
      return openBlock(), createBlock(
        Fragment,
        null,
        [createVNode("slot", props, fallback && fallback())],
        64
      );
    }
    let slot = slots[name];
    if (slot && slot._c) {
      slot._d = false;
    }
    openBlock();
    const validSlotContent = slot && ensureValidVNode(slot(props));
    const slotKey = props.key || // slot content array of a dynamic conditional slot may have a branch
    // key attached in the `createSlots` helper, respect that
    validSlotContent && validSlotContent.key;
    const rendered = createBlock(
      Fragment,
      {
        key: (slotKey && !shared.isSymbol(slotKey) ? slotKey : `_${name}`) + // #7256 force differentiate fallback content from actual content
        (!validSlotContent && fallback ? "_fb" : "")
      },
      validSlotContent || (fallback ? fallback() : []),
      validSlotContent && slots._ === 1 ? 64 : -2
    );
    if (!noSlotted && rendered.scopeId) {
      rendered.slotScopeIds = [rendered.scopeId + "-s"];
    }
    if (slot && slot._c) {
      slot._d = true;
    }
    return rendered;
  }
  function ensureValidVNode(vnodes) {
    return vnodes.some((child) => {
      if (!isVNode(child)) return true;
      if (child.type === Comment) return false;
      if (child.type === Fragment && !ensureValidVNode(child.children))
        return false;
      return true;
    }) ? vnodes : null;
  }
  function toHandlers(obj, preserveCaseIfNecessary) {
    const ret = {};
    for (const key in obj) {
      ret[preserveCaseIfNecessary && /[A-Z]/.test(key) ? `on:${key}` : shared.toHandlerKey(key)] = obj[key];
    }
    return ret;
  }
  const getPublicInstance = (i) => {
    if (!i) return null;
    if (isStatefulComponent(i)) return getComponentPublicInstance(i);
    return getPublicInstance(i.parent);
  };
  const publicPropertiesMap = (
    // Move PURE marker to new line to workaround compiler discarding it
    // due to type annotation
    /* @__PURE__ */ shared.extend(/* @__PURE__ */ Object.create(null), {
      $: (i) => i,
      $el: (i) => i.vnode.el,
      $data: (i) => i.data,
      $props: (i) => i.props,
      $attrs: (i) => i.attrs,
      $slots: (i) => i.slots,
      $refs: (i) => i.refs,
      $parent: (i) => getPublicInstance(i.parent),
      $root: (i) => getPublicInstance(i.root),
      $host: (i) => i.ce,
      $emit: (i) => i.emit,
      $options: (i) => resolveMergedOptions(i),
      $forceUpdate: (i) => i.f || (i.f = () => {
        queueJob(i.update);
      }),
      $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
      $watch: (i) => instanceWatch.bind(i)
    })
  );
  const hasSetupBinding = (state, key) => state !== shared.EMPTY_OBJ && !state.__isScriptSetup && shared.hasOwn(state, key);
  const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      if (key === "__v_skip") {
        return true;
      }
      const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
      let normalizedProps;
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0) {
          switch (n) {
            case 1:
              return setupState[key];
            case 2:
              return data[key];
            case 4:
              return ctx[key];
            case 3:
              return props[key];
          }
        } else if (hasSetupBinding(setupState, key)) {
          accessCache[key] = 1;
          return setupState[key];
        } else if (data !== shared.EMPTY_OBJ && shared.hasOwn(data, key)) {
          accessCache[key] = 2;
          return data[key];
        } else if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (normalizedProps = instance.propsOptions[0]) && shared.hasOwn(normalizedProps, key)
        ) {
          accessCache[key] = 3;
          return props[key];
        } else if (ctx !== shared.EMPTY_OBJ && shared.hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else if (shouldCacheAccess) {
          accessCache[key] = 0;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          reactivity.track(instance.attrs, "get", "");
        }
        return publicGetter(instance);
      } else if (
        // css module (injected by vue-loader)
        (cssModule = type.__cssModules) && (cssModule = cssModule[key])
      ) {
        return cssModule;
      } else if (ctx !== shared.EMPTY_OBJ && shared.hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (
        // global properties
        globalProperties = appContext.config.globalProperties, shared.hasOwn(globalProperties, key)
      ) {
        {
          return globalProperties[key];
        }
      } else ;
    },
    set({ _: instance }, key, value) {
      const { data, setupState, ctx } = instance;
      if (hasSetupBinding(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if (data !== shared.EMPTY_OBJ && shared.hasOwn(data, key)) {
        data[key] = value;
        return true;
      } else if (shared.hasOwn(instance.props, key)) {
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        return false;
      } else {
        {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({
      _: { data, setupState, accessCache, ctx, appContext, propsOptions }
    }, key) {
      let normalizedProps;
      return !!accessCache[key] || data !== shared.EMPTY_OBJ && shared.hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && shared.hasOwn(normalizedProps, key) || shared.hasOwn(ctx, key) || shared.hasOwn(publicPropertiesMap, key) || shared.hasOwn(appContext.config.globalProperties, key);
    },
    defineProperty(target, key, descriptor) {
      if (descriptor.get != null) {
        target._.accessCache[key] = 0;
      } else if (shared.hasOwn(descriptor, "value")) {
        this.set(target, key, descriptor.value, null);
      }
      return Reflect.defineProperty(target, key, descriptor);
    }
  };
  const RuntimeCompiledPublicInstanceProxyHandlers = /* @__PURE__ */ shared.extend({}, PublicInstanceProxyHandlers, {
    get(target, key) {
      if (key === Symbol.unscopables) {
        return;
      }
      return PublicInstanceProxyHandlers.get(target, key, target);
    },
    has(_, key) {
      const has = key[0] !== "_" && !shared.isGloballyAllowed(key);
      return has;
    }
  });
  function defineProps() {
    return null;
  }
  function defineEmits() {
    return null;
  }
  function defineExpose(exposed) {
  }
  function defineOptions(options) {
  }
  function defineSlots() {
    return null;
  }
  function defineModel() {
  }
  function withDefaults(props, defaults) {
    return null;
  }
  function useSlots() {
    return getContext2().slots;
  }
  function useAttrs() {
    return getContext2().attrs;
  }
  function getContext2() {
    const i = getCurrentInstance();
    return i.setupContext || (i.setupContext = createSetupContext(i));
  }
  function normalizePropsOrEmits(props) {
    return shared.isArray(props) ? props.reduce(
      (normalized, p) => (normalized[p] = null, normalized),
      {}
    ) : props;
  }
  function mergeDefaults(raw, defaults) {
    const props = normalizePropsOrEmits(raw);
    for (const key in defaults) {
      if (key.startsWith("__skip")) continue;
      let opt = props[key];
      if (opt) {
        if (shared.isArray(opt) || shared.isFunction(opt)) {
          opt = props[key] = { type: opt, default: defaults[key] };
        } else {
          opt.default = defaults[key];
        }
      } else if (opt === null) {
        opt = props[key] = { default: defaults[key] };
      } else ;
      if (opt && defaults[`__skip_${key}`]) {
        opt.skipFactory = true;
      }
    }
    return props;
  }
  function mergeModels(a, b) {
    if (!a || !b) return a || b;
    if (shared.isArray(a) && shared.isArray(b)) return a.concat(b);
    return shared.extend({}, normalizePropsOrEmits(a), normalizePropsOrEmits(b));
  }
  function createPropsRestProxy(props, excludedKeys) {
    const ret = {};
    for (const key in props) {
      if (!excludedKeys.includes(key)) {
        Object.defineProperty(ret, key, {
          enumerable: true,
          get: () => props[key]
        });
      }
    }
    return ret;
  }
  function withAsyncContext(getAwaitable) {
    const ctx = getCurrentInstance();
    let awaitable = getAwaitable();
    unsetCurrentInstance();
    if (shared.isPromise(awaitable)) {
      awaitable = awaitable.catch((e) => {
        setCurrentInstance(ctx);
        throw e;
      });
    }
    return [awaitable, () => setCurrentInstance(ctx)];
  }
  let shouldCacheAccess = true;
  function applyOptions(instance) {
    const options = resolveMergedOptions(instance);
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    shouldCacheAccess = false;
    if (options.beforeCreate) {
      callHook(options.beforeCreate, instance, "bc");
    }
    const {
      // state
      data: dataOptions,
      computed: computedOptions,
      methods,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
      // lifecycle
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      activated,
      deactivated,
      beforeDestroy,
      beforeUnmount,
      destroyed,
      unmounted,
      render,
      renderTracked,
      renderTriggered,
      errorCaptured,
      serverPrefetch,
      // public API
      expose,
      inheritAttrs,
      // assets
      components,
      directives,
      filters
    } = options;
    const checkDuplicateProperties = null;
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
    if (methods) {
      for (const key in methods) {
        const methodHandler = methods[key];
        if (shared.isFunction(methodHandler)) {
          {
            ctx[key] = methodHandler.bind(publicThis);
          }
        }
      }
    }
    if (dataOptions) {
      const data = dataOptions.call(publicThis, publicThis);
      if (!shared.isObject(data)) ;
      else {
        instance.data = reactivity.reactive(data);
      }
    }
    shouldCacheAccess = true;
    if (computedOptions) {
      for (const key in computedOptions) {
        const opt = computedOptions[key];
        const get = shared.isFunction(opt) ? opt.bind(publicThis, publicThis) : shared.isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : shared.NOOP;
        const set = !shared.isFunction(opt) && shared.isFunction(opt.set) ? opt.set.bind(publicThis) : shared.NOOP;
        const c = computed({
          get,
          set
        });
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => c.value,
          set: (v) => c.value = v
        });
      }
    }
    if (watchOptions) {
      for (const key in watchOptions) {
        createWatcher(watchOptions[key], ctx, publicThis, key);
      }
    }
    if (provideOptions) {
      const provides = shared.isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
    if (created) {
      callHook(created, instance, "c");
    }
    function registerLifecycleHook(register, hook) {
      if (shared.isArray(hook)) {
        hook.forEach((_hook) => register(_hook.bind(publicThis)));
      } else if (hook) {
        register(hook.bind(publicThis));
      }
    }
    registerLifecycleHook(onBeforeMount, beforeMount);
    registerLifecycleHook(onMounted, mounted);
    registerLifecycleHook(onBeforeUpdate, beforeUpdate);
    registerLifecycleHook(onUpdated, updated);
    registerLifecycleHook(onActivated, activated);
    registerLifecycleHook(onDeactivated, deactivated);
    registerLifecycleHook(onErrorCaptured, errorCaptured);
    registerLifecycleHook(onRenderTracked, renderTracked);
    registerLifecycleHook(onRenderTriggered, renderTriggered);
    registerLifecycleHook(onBeforeUnmount, beforeUnmount);
    registerLifecycleHook(onUnmounted, unmounted);
    registerLifecycleHook(onServerPrefetch, serverPrefetch);
    if (shared.isArray(expose)) {
      if (expose.length) {
        const exposed = instance.exposed || (instance.exposed = {});
        expose.forEach((key) => {
          Object.defineProperty(exposed, key, {
            get: () => publicThis[key],
            set: (val) => publicThis[key] = val
          });
        });
      } else if (!instance.exposed) {
        instance.exposed = {};
      }
    }
    if (render && instance.render === shared.NOOP) {
      instance.render = render;
    }
    if (inheritAttrs != null) {
      instance.inheritAttrs = inheritAttrs;
    }
    if (components) instance.components = components;
    if (directives) instance.directives = directives;
    if (serverPrefetch) {
      markAsyncBoundary(instance);
    }
  }
  function resolveInjections(injectOptions, ctx, checkDuplicateProperties = shared.NOOP) {
    if (shared.isArray(injectOptions)) {
      injectOptions = normalizeInject(injectOptions);
    }
    for (const key in injectOptions) {
      const opt = injectOptions[key];
      let injected;
      if (shared.isObject(opt)) {
        if ("default" in opt) {
          injected = inject(
            opt.from || key,
            opt.default,
            true
          );
        } else {
          injected = inject(opt.from || key);
        }
      } else {
        injected = inject(opt);
      }
      if (reactivity.isRef(injected)) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    }
  }
  function callHook(hook, instance, type) {
    callWithAsyncErrorHandling(
      shared.isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
      instance,
      type
    );
  }
  function createWatcher(raw, ctx, publicThis, key) {
    let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
    if (shared.isString(raw)) {
      const handler = ctx[raw];
      if (shared.isFunction(handler)) {
        {
          watch(getter, handler);
        }
      }
    } else if (shared.isFunction(raw)) {
      {
        watch(getter, raw.bind(publicThis));
      }
    } else if (shared.isObject(raw)) {
      if (shared.isArray(raw)) {
        raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
      } else {
        const handler = shared.isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
        if (shared.isFunction(handler)) {
          watch(getter, handler, raw);
        }
      }
    } else ;
  }
  function resolveMergedOptions(instance) {
    const base = instance.type;
    const { mixins, extends: extendsOptions } = base;
    const {
      mixins: globalMixins,
      optionsCache: cache,
      config: { optionMergeStrategies }
    } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};
      if (globalMixins.length) {
        globalMixins.forEach(
          (m) => mergeOptions2(resolved, m, optionMergeStrategies, true)
        );
      }
      mergeOptions2(resolved, base, optionMergeStrategies);
    }
    if (shared.isObject(base)) {
      cache.set(base, resolved);
    }
    return resolved;
  }
  function mergeOptions2(to, from, strats, asMixin = false) {
    const { mixins, extends: extendsOptions } = from;
    if (extendsOptions) {
      mergeOptions2(to, extendsOptions, strats, true);
    }
    if (mixins) {
      mixins.forEach(
        (m) => mergeOptions2(to, m, strats, true)
      );
    }
    for (const key in from) {
      if (asMixin && key === "expose") ;
      else {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }
    return to;
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeEmitsOrPropsOptions,
    emits: mergeEmitsOrPropsOptions,
    // objects
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    // lifecycle
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    // assets
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    // watch
    watch: mergeWatchOptions,
    // provide / inject
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }
    if (!to) {
      return from;
    }
    return function mergedDataFn() {
      return shared.extend(
        shared.isFunction(to) ? to.call(this, this) : to,
        shared.isFunction(from) ? from.call(this, this) : from
      );
    };
  }
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  function normalizeInject(raw) {
    if (shared.isArray(raw)) {
      const res = {};
      for (let i = 0; i < raw.length; i++) {
        res[raw[i]] = raw[i];
      }
      return res;
    }
    return raw;
  }
  function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
  }
  function mergeObjectOptions(to, from) {
    return to ? shared.extend(/* @__PURE__ */ Object.create(null), to, from) : from;
  }
  function mergeEmitsOrPropsOptions(to, from) {
    if (to) {
      if (shared.isArray(to) && shared.isArray(from)) {
        return [.../* @__PURE__ */ new Set([...to, ...from])];
      }
      return shared.extend(
        /* @__PURE__ */ Object.create(null),
        normalizePropsOrEmits(to),
        normalizePropsOrEmits(from != null ? from : {})
      );
    } else {
      return from;
    }
  }
  function mergeWatchOptions(to, from) {
    if (!to) return from;
    if (!from) return to;
    const merged = shared.extend(/* @__PURE__ */ Object.create(null), to);
    for (const key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }
    return merged;
  }
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: shared.NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  let uid$1 = 0;
  function createAppAPI(render, hydrate) {
    return function createApp(rootComponent, rootProps = null) {
      if (!shared.isFunction(rootComponent)) {
        rootComponent = shared.extend({}, rootComponent);
      }
      if (rootProps != null && !shared.isObject(rootProps)) {
        rootProps = null;
      }
      const context = createAppContext();
      const installedPlugins = /* @__PURE__ */ new WeakSet();
      const pluginCleanupFns = [];
      let isMounted = false;
      const app = context.app = {
        _uid: uid$1++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version,
        get config() {
          return context.config;
        },
        set config(v) {
        },
        use(plugin2, ...options) {
          if (installedPlugins.has(plugin2)) ;
          else if (plugin2 && shared.isFunction(plugin2.install)) {
            installedPlugins.add(plugin2);
            plugin2.install(app, ...options);
          } else if (shared.isFunction(plugin2)) {
            installedPlugins.add(plugin2);
            plugin2(app, ...options);
          } else ;
          return app;
        },
        mixin(mixin) {
          {
            if (!context.mixins.includes(mixin)) {
              context.mixins.push(mixin);
            }
          }
          return app;
        },
        component(name, component) {
          if (!component) {
            return context.components[name];
          }
          context.components[name] = component;
          return app;
        },
        directive(name, directive) {
          if (!directive) {
            return context.directives[name];
          }
          context.directives[name] = directive;
          return app;
        },
        mount(rootContainer, isHydrate, namespace) {
          if (!isMounted) {
            const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
            vnode.appContext = context;
            if (namespace === true) {
              namespace = "svg";
            } else if (namespace === false) {
              namespace = void 0;
            }
            if (isHydrate && hydrate) {
              hydrate(vnode, rootContainer);
            } else {
              render(vnode, rootContainer, namespace);
            }
            isMounted = true;
            app._container = rootContainer;
            rootContainer.__vue_app__ = app;
            return getComponentPublicInstance(vnode.component);
          }
        },
        onUnmount(cleanupFn) {
          pluginCleanupFns.push(cleanupFn);
        },
        unmount() {
          if (isMounted) {
            callWithAsyncErrorHandling(
              pluginCleanupFns,
              app._instance,
              16
            );
            render(null, app._container);
            delete app._container.__vue_app__;
          }
        },
        provide(key, value) {
          context.provides[key] = value;
          return app;
        },
        runWithContext(fn) {
          const lastApp = currentApp;
          currentApp = app;
          try {
            return fn();
          } finally {
            currentApp = lastApp;
          }
        }
      };
      return app;
    };
  }
  let currentApp = null;
  function provide(key, value) {
    if (!currentInstance) ;
    else {
      let provides = currentInstance.provides;
      const parentProvides = currentInstance.parent && currentInstance.parent.provides;
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
      provides[key] = value;
    }
  }
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = currentInstance || currentRenderingInstance;
    if (instance || currentApp) {
      let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && shared.isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
      } else ;
    }
  }
  function hasInjectionContext() {
    return !!(currentInstance || currentRenderingInstance || currentApp);
  }
  const internalObjectProto = {};
  const createInternalObject = () => Object.create(internalObjectProto);
  const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
  function initProps(instance, rawProps, isStateful, isSSR = false) {
    const props = {};
    const attrs = createInternalObject();
    instance.propsDefaults = /* @__PURE__ */ Object.create(null);
    setFullProps(instance, rawProps, props, attrs);
    for (const key in instance.propsOptions[0]) {
      if (!(key in props)) {
        props[key] = void 0;
      }
    }
    if (isStateful) {
      instance.props = isSSR ? props : reactivity.shallowReactive(props);
    } else {
      if (!instance.type.props) {
        instance.props = attrs;
      } else {
        instance.props = props;
      }
    }
    instance.attrs = attrs;
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const {
      props,
      attrs,
      vnode: { patchFlag }
    } = instance;
    const rawCurrentProps = reactivity.toRaw(props);
    const [options] = instance.propsOptions;
    let hasAttrsChanged = false;
    if (
      // always force full diff in dev
      // - #1942 if hmr is enabled with sfc component
      // - vite#872 non-sfc component used by sfc component
      (optimized || patchFlag > 0) && !(patchFlag & 16)
    ) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          let key = propsToUpdate[i];
          if (isEmitListener(instance.emitsOptions, key)) {
            continue;
          }
          const value = rawProps[key];
          if (options) {
            if (shared.hasOwn(attrs, key)) {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            } else {
              const camelizedKey = shared.camelize(key);
              props[camelizedKey] = resolvePropValue(
                options,
                rawCurrentProps,
                camelizedKey,
                value,
                instance,
                false
              );
            }
          } else {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
    } else {
      if (setFullProps(instance, rawProps, props, attrs)) {
        hasAttrsChanged = true;
      }
      let kebabKey;
      for (const key in rawCurrentProps) {
        if (!rawProps || // for camelCase
        !shared.hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
        // and converted to camelCase (#955)
        ((kebabKey = shared.hyphenate(key)) === key || !shared.hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && // for camelCase
            (rawPrevProps[key] !== void 0 || // for kebab-case
            rawPrevProps[kebabKey] !== void 0)) {
              props[key] = resolvePropValue(
                options,
                rawCurrentProps,
                key,
                void 0,
                instance,
                true
              );
            }
          } else {
            delete props[key];
          }
        }
      }
      if (attrs !== rawCurrentProps) {
        for (const key in attrs) {
          if (!rawProps || !shared.hasOwn(rawProps, key) && true) {
            delete attrs[key];
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (hasAttrsChanged) {
      reactivity.trigger(instance.attrs, "set", "");
    }
  }
  function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    let hasAttrsChanged = false;
    let rawCastValues;
    if (rawProps) {
      for (let key in rawProps) {
        if (shared.isReservedProp(key)) {
          continue;
        }
        const value = rawProps[key];
        let camelKey;
        if (options && shared.hasOwn(options, camelKey = shared.camelize(key))) {
          if (!needCastKeys || !needCastKeys.includes(camelKey)) {
            props[camelKey] = value;
          } else {
            (rawCastValues || (rawCastValues = {}))[camelKey] = value;
          }
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          if (!(key in attrs) || value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (needCastKeys) {
      const rawCurrentProps = reactivity.toRaw(props);
      const castValues = rawCastValues || shared.EMPTY_OBJ;
      for (let i = 0; i < needCastKeys.length; i++) {
        const key = needCastKeys[i];
        props[key] = resolvePropValue(
          options,
          rawCurrentProps,
          key,
          castValues[key],
          instance,
          !shared.hasOwn(castValues, key)
        );
      }
    }
    return hasAttrsChanged;
  }
  function resolvePropValue(options, props, key, value, instance, isAbsent) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = shared.hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        if (opt.type !== Function && !opt.skipFactory && shared.isFunction(defaultValue)) {
          const { propsDefaults } = instance;
          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            const reset = setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(
              null,
              props
            );
            reset();
          }
        } else {
          value = defaultValue;
        }
        if (instance.ce) {
          instance.ce._setProp(key, value);
        }
      }
      if (opt[
        0
        /* shouldCast */
      ]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[
          1
          /* shouldCastTrue */
        ] && (value === "" || value === shared.hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  const mixinPropsCache = /* @__PURE__ */ new WeakMap();
  function normalizePropsOptions(comp, appContext, asMixin = false) {
    const cache = asMixin ? mixinPropsCache : appContext.propsCache;
    const cached = cache.get(comp);
    if (cached) {
      return cached;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    let hasExtends = false;
    if (!shared.isFunction(comp)) {
      const extendProps = (raw2) => {
        hasExtends = true;
        const [props, keys] = normalizePropsOptions(raw2, appContext, true);
        shared.extend(normalized, props);
        if (keys) needCastKeys.push(...keys);
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendProps);
      }
      if (comp.extends) {
        extendProps(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendProps);
      }
    }
    if (!raw && !hasExtends) {
      if (shared.isObject(comp)) {
        cache.set(comp, shared.EMPTY_ARR);
      }
      return shared.EMPTY_ARR;
    }
    if (shared.isArray(raw)) {
      for (let i = 0; i < raw.length; i++) {
        const normalizedKey = shared.camelize(raw[i]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = shared.EMPTY_OBJ;
        }
      }
    } else if (raw) {
      for (const key in raw) {
        const normalizedKey = shared.camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = shared.isArray(opt) || shared.isFunction(opt) ? { type: opt } : shared.extend({}, opt);
          const propType = prop.type;
          let shouldCast = false;
          let shouldCastTrue = true;
          if (shared.isArray(propType)) {
            for (let index = 0; index < propType.length; ++index) {
              const type = propType[index];
              const typeName = shared.isFunction(type) && type.name;
              if (typeName === "Boolean") {
                shouldCast = true;
                break;
              } else if (typeName === "String") {
                shouldCastTrue = false;
              }
            }
          } else {
            shouldCast = shared.isFunction(propType) && propType.name === "Boolean";
          }
          prop[
            0
            /* shouldCast */
          ] = shouldCast;
          prop[
            1
            /* shouldCastTrue */
          ] = shouldCastTrue;
          if (shouldCast || shared.hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
    const res = [normalized, needCastKeys];
    if (shared.isObject(comp)) {
      cache.set(comp, res);
    }
    return res;
  }
  function validatePropName(key) {
    if (key[0] !== "$" && !shared.isReservedProp(key)) {
      return true;
    }
    return false;
  }
  const isInternalKey = (key) => key[0] === "_" || key === "$stable";
  const normalizeSlotValue = (value) => shared.isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
  const normalizeSlot2 = (key, rawSlot, ctx) => {
    if (rawSlot._n) {
      return rawSlot;
    }
    const normalized = withCtx((...args) => {
      if (false) ;
      return normalizeSlotValue(rawSlot(...args));
    }, ctx);
    normalized._c = false;
    return normalized;
  };
  const normalizeObjectSlots = (rawSlots, slots, instance) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key)) continue;
      const value = rawSlots[key];
      if (shared.isFunction(value)) {
        slots[key] = normalizeSlot2(key, value, ctx);
      } else if (value != null) {
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  };
  const normalizeVNodeSlots = (instance, children) => {
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  };
  const assignSlots = (slots, children, optimized) => {
    for (const key in children) {
      if (optimized || !isInternalKey(key)) {
        slots[key] = children[key];
      }
    }
  };
  const initSlots = (instance, children, optimized) => {
    const slots = instance.slots = createInternalObject();
    if (instance.vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        assignSlots(slots, children, optimized);
        if (optimized) {
          shared.def(slots, "_", type, true);
        }
      } else {
        normalizeObjectSlots(children, slots);
      }
    } else if (children) {
      normalizeVNodeSlots(instance, children);
    }
  };
  const updateSlots = (instance, children, optimized) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = shared.EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        if (optimized && type === 1) {
          needDeletionCheck = false;
        } else {
          assignSlots(slots, children, optimized);
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }
      deletionComparisonTarget = children;
    } else if (children) {
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = { default: 1 };
    }
    if (needDeletionCheck) {
      for (const key in slots) {
        if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
          delete slots[key];
        }
      }
    }
  };
  const queuePostRenderEffect = queueEffectWithSuspense;
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function createHydrationRenderer(options) {
    return baseCreateRenderer(options, createHydrationFunctions);
  }
  function baseCreateRenderer(options, createHydrationFns) {
    const target = shared.getGlobalThis();
    target.__VUE__ = true;
    const {
      insert: hostInsert,
      remove: hostRemove,
      patchProp: hostPatchProp,
      createElement: hostCreateElement,
      createText: hostCreateText,
      createComment: hostCreateComment,
      setText: hostSetText,
      setElementText: hostSetElementText,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setScopeId: hostSetScopeId = shared.NOOP,
      insertStaticContent: hostInsertStaticContent
    } = options;
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }
      if (n2.patchFlag === -2) {
        optimized = false;
        n2.dynamicChildren = null;
      }
      const { type, ref, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, namespace);
          }
          break;
        case Fragment:
          processFragment(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          break;
        default:
          if (shapeFlag & 1) {
            processElement(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 6) {
            processComponent(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 64) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else if (shapeFlag & 128) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else ;
      }
      if (ref != null && parentComponent) {
        setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
      }
    };
    const processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateText(n2.children),
          container,
          anchor
        );
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateComment(n2.children || ""),
          container,
          anchor
        );
      } else {
        n2.el = n1.el;
      }
    };
    const mountStaticNode = (n2, container, anchor, namespace) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(
        n2.children,
        container,
        anchor,
        namespace,
        n2.el,
        n2.anchor
      );
    };
    const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostInsert(el, container, nextSibling);
        el = next;
      }
      hostInsert(anchor, container, nextSibling);
    };
    const removeStaticNode = ({ el, anchor }) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostRemove(el);
        el = next;
      }
      hostRemove(anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      if (n2.type === "svg") {
        namespace = "svg";
      } else if (n2.type === "math") {
        namespace = "mathml";
      }
      if (n1 == null) {
        mountElement(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        patchElement(
          n1,
          n2,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let el;
      let vnodeHook;
      const { props, shapeFlag, transition, dirs } = vnode;
      el = vnode.el = hostCreateElement(
        vnode.type,
        namespace,
        props && props.is,
        props
      );
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(
          vnode.children,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(vnode, namespace),
          slotScopeIds,
          optimized
        );
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      if (props) {
        for (const key in props) {
          if (key !== "value" && !shared.isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], namespace, parentComponent);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value, namespace);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      const needCallTransitionHooks = needTransition(parentSuspense, transition);
      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }
      hostInsert(el, container, anchor);
      if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    };
    const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }
      if (slotScopeIds) {
        for (let i = 0; i < slotScopeIds.length; i++) {
          hostSetScopeId(el, slotScopeIds[i]);
        }
      }
      if (parentComponent) {
        let subTree = parentComponent.subTree;
        if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
          const parentVNode = parentComponent.vnode;
          setScopeId(
            el,
            parentVNode,
            parentVNode.scopeId,
            parentVNode.slotScopeIds,
            parentComponent.parent
          );
        }
      }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
      for (let i = start; i < children.length; i++) {
        const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(
          null,
          child,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const el = n2.el = n1.el;
      let { patchFlag, dynamicChildren, dirs } = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || shared.EMPTY_OBJ;
      const newProps = n2.props || shared.EMPTY_OBJ;
      let vnodeHook;
      parentComponent && toggleRecurse(parentComponent, false);
      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }
      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
      }
      parentComponent && toggleRecurse(parentComponent, true);
      if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
        hostSetElementText(el, "");
      }
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          el,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds
        );
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds,
          false
        );
      }
      if (patchFlag > 0) {
        if (patchFlag & 16) {
          patchProps(el, oldProps, newProps, parentComponent, namespace);
        } else {
          if (patchFlag & 2) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, "class", null, newProps.class, namespace);
            }
          }
          if (patchFlag & 4) {
            hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
          }
          if (patchFlag & 8) {
            const propsToUpdate = n2.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
              const key = propsToUpdate[i];
              const prev = oldProps[key];
              const next = newProps[key];
              if (next !== prev || key === "value") {
                hostPatchProp(el, key, prev, next, namespace, parentComponent);
              }
            }
          }
        }
        if (patchFlag & 1) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      }
      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
        }, parentSuspense);
      }
    };
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
      for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i];
        const newVNode = newChildren[i];
        const container = (
          // oldVNode may be an errored async setup() component inside Suspense
          // which will not have a mounted element
          oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
          // of the Fragment itself so it can move its children.
          (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
          // which also requires the correct parent container
          !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
          oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldVNode.el) : (
            // In other cases, the parent container is not actually used so we
            // just pass the block element here to avoid a DOM parentNode call.
            fallbackContainer
          )
        );
        patch(
          oldVNode,
          newVNode,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          true
        );
      }
    };
    const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
      if (oldProps !== newProps) {
        if (oldProps !== shared.EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!shared.isReservedProp(key) && !(key in newProps)) {
              hostPatchProp(
                el,
                key,
                oldProps[key],
                null,
                namespace,
                parentComponent
              );
            }
          }
        }
        for (const key in newProps) {
          if (shared.isReservedProp(key)) continue;
          const next = newProps[key];
          const prev = oldProps[key];
          if (next !== prev && key !== "value") {
            hostPatchProp(el, key, prev, next, namespace, parentComponent);
          }
        }
        if ("value" in newProps) {
          hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
      const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor);
        mountChildren(
          // #10007
          // such fragment like `<></>` will be compiled into
          // a fragment which doesn't have a children.
          // In this case fallback to an empty array
          n2.children || [],
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
        // of renderSlot() with no valid children
        n1.dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            container,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds
          );
          if (
            // #2080 if the stable fragment has a key, it's a <template v-for> that may
            //  get moved around. Make sure all root level vnodes inherit el.
            // #2134 or if it's a component root, it may also get moved around
            // as the component is being moved.
            n2.key != null || parentComponent && n2 === parentComponent.subTree
          ) {
            traverseStaticChildren(
              n1,
              n2,
              true
              /* shallow */
            );
          }
        } else {
          patchChildren(
            n1,
            n2,
            container,
            fragmentEndAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds;
      if (n1 == null) {
        if (n2.shapeFlag & 512) {
          parentComponent.ctx.activate(
            n2,
            container,
            anchor,
            namespace,
            optimized
          );
        } else {
          mountComponent(
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            optimized
          );
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
      const instance = initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent,
        parentSuspense
      );
      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      }
      {
        setupComponent(instance, false, optimized);
      }
      if (instance.asyncDep) {
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
        if (!initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
        }
      } else {
        setupRenderEffect(
          instance,
          initialVNode,
          container,
          anchor,
          parentSuspense,
          namespace,
          optimized
        );
      }
    };
    const updateComponent = (n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          updateComponentPreRender(instance, n2, optimized);
          return;
        } else {
          instance.next = n2;
          instance.update();
        }
      } else {
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
      const componentUpdateFn = () => {
        if (!instance.isMounted) {
          let vnodeHook;
          const { el, props } = initialVNode;
          const { bm, m, parent, root, type } = instance;
          const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
          toggleRecurse(instance, false);
          if (bm) {
            shared.invokeArrayFns(bm);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }
          toggleRecurse(instance, true);
          if (el && hydrateNode) {
            const hydrateSubTree = () => {
              instance.subTree = renderComponentRoot(instance);
              hydrateNode(
                el,
                instance.subTree,
                instance,
                parentSuspense,
                null
              );
            };
            if (isAsyncWrapperVNode && type.__asyncHydrate) {
              type.__asyncHydrate(
                el,
                instance,
                hydrateSubTree
              );
            } else {
              hydrateSubTree();
            }
          } else {
            if (root.ce) {
              root.ce._injectChildStyle(type);
            }
            const subTree = instance.subTree = renderComponentRoot(instance);
            patch(
              null,
              subTree,
              container,
              anchor,
              instance,
              parentSuspense,
              namespace
            );
            initialVNode.el = subTree.el;
          }
          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
              parentSuspense
            );
          }
          if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
          }
          instance.isMounted = true;
          initialVNode = container = anchor = null;
        } else {
          let { next, bu, u, parent, vnode } = instance;
          {
            const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
            if (nonHydratedAsyncRoot) {
              if (next) {
                next.el = vnode.el;
                updateComponentPreRender(instance, next, optimized);
              }
              nonHydratedAsyncRoot.asyncDep.then(() => {
                if (!instance.isUnmounted) {
                  componentUpdateFn();
                }
              });
              return;
            }
          }
          let originNext = next;
          let vnodeHook;
          toggleRecurse(instance, false);
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          }
          if (bu) {
            shared.invokeArrayFns(bu);
          }
          if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }
          toggleRecurse(instance, true);
          const nextTree = renderComponentRoot(instance);
          const prevTree = instance.subTree;
          instance.subTree = nextTree;
          patch(
            prevTree,
            nextTree,
            // parent may have changed if it's in a teleport
            hostParentNode(prevTree.el),
            // anchor may have changed if it's in a fragment
            getNextHostNode(prevTree),
            instance,
            parentSuspense,
            namespace
          );
          next.el = nextTree.el;
          if (originNext === null) {
            updateHOCHostEl(instance, nextTree.el);
          }
          if (u) {
            queuePostRenderEffect(u, parentSuspense);
          }
          if (vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, next, vnode),
              parentSuspense
            );
          }
        }
      };
      instance.scope.on();
      const effect = instance.effect = new reactivity.ReactiveEffect(componentUpdateFn);
      instance.scope.off();
      const update = instance.update = effect.run.bind(effect);
      const job = instance.job = effect.runIfDirty.bind(effect);
      job.i = instance;
      job.id = instance.uid;
      effect.scheduler = () => queueJob(job);
      toggleRecurse(instance, true);
      update();
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
      nextVNode.component = instance;
      const prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children, optimized);
      reactivity.pauseTracking();
      flushPreFlushCbs(instance);
      reactivity.resetTracking();
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
      const c1 = n1 && n1.children;
      const prevShapeFlag = n1 ? n1.shapeFlag : 0;
      const c2 = n2.children;
      const { patchFlag, shapeFlag } = n2;
      if (patchFlag > 0) {
        if (patchFlag & 128) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        }
      }
      if (shapeFlag & 8) {
        if (prevShapeFlag & 16) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }
        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16) {
          if (shapeFlag & 16) {
            patchKeyedChildren(
              c1,
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else {
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          if (prevShapeFlag & 8) {
            hostSetElementText(container, "");
          }
          if (shapeFlag & 16) {
            mountChildren(
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        }
      }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      c1 = c1 || shared.EMPTY_ARR;
      c2 = c2 || shared.EMPTY_ARR;
      const oldLength = c1.length;
      const newLength = c2.length;
      const commonLength = Math.min(oldLength, newLength);
      let i;
      for (i = 0; i < commonLength; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(
          c1[i],
          nextChild,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
      if (oldLength > newLength) {
        unmountChildren(
          c1,
          parentComponent,
          parentSuspense,
          true,
          false,
          commonLength
        );
      } else {
        mountChildren(
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
          commonLength
        );
      }
    };
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let i = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          while (i <= e2) {
            patch(
              null,
              c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            i++;
          }
        }
      } else if (i > e2) {
        while (i <= e1) {
          unmount(c1[i], parentComponent, parentSuspense, true);
          i++;
        }
      } else {
        const s1 = i;
        const s2 = i;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (i = s2; i <= e2; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (nextChild.key != null) {
            keyToNewIndexMap.set(nextChild.key, i);
          }
        }
        let j;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        let maxNewIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
        for (i = s1; i <= e1; i++) {
          const prevChild = c1[i];
          if (patched >= toBePatched) {
            unmount(prevChild, parentComponent, parentSuspense, true);
            continue;
          }
          let newIndex;
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (j = s2; j <= e2; j++) {
              if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                newIndex = j;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i + 1;
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            patch(
              prevChild,
              c2[newIndex],
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : shared.EMPTY_ARR;
        j = increasingNewIndexSequence.length - 1;
        for (i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = s2 + i;
          const nextChild = c2[nextIndex];
          const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
          if (newIndexToOldIndexMap[i] === 0) {
            patch(
              null,
              nextChild,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (moved) {
            if (j < 0 || i !== increasingNewIndexSequence[j]) {
              move(nextChild, container, anchor, 2);
            } else {
              j--;
            }
          }
        }
      }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
      const { el, type, transition, children, shapeFlag } = vnode;
      if (shapeFlag & 6) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }
      if (shapeFlag & 128) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }
      if (shapeFlag & 64) {
        type.move(vnode, container, anchor, internals);
        return;
      }
      if (type === Fragment) {
        hostInsert(el, container, anchor);
        for (let i = 0; i < children.length; i++) {
          move(children[i], container, anchor, moveType);
        }
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
      if (needTransition2) {
        if (moveType === 0) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          const { leave, delayLeave, afterLeave } = transition;
          const remove2 = () => {
            if (vnode.ctx.isUnmounted) {
              hostRemove(el);
            } else {
              hostInsert(el, container, anchor);
            }
          };
          const performLeave = () => {
            leave(el, () => {
              remove2();
              afterLeave && afterLeave();
            });
          };
          if (delayLeave) {
            delayLeave(el, remove2, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
      const {
        type,
        props,
        ref,
        children,
        dynamicChildren,
        shapeFlag,
        patchFlag,
        dirs,
        cacheIndex
      } = vnode;
      if (patchFlag === -2) {
        optimized = false;
      }
      if (ref != null) {
        reactivity.pauseTracking();
        setRef(ref, null, parentSuspense, vnode, true);
        reactivity.resetTracking();
      }
      if (cacheIndex != null) {
        parentComponent.renderCache[cacheIndex] = void 0;
      }
      if (shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs;
      const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      let vnodeHook;
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      if (shapeFlag & 6) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
        }
        if (shapeFlag & 64) {
          vnode.type.remove(
            vnode,
            parentComponent,
            parentSuspense,
            internals,
            doRemove
          );
        } else if (dynamicChildren && // #5154
        // when v-once is used inside a block, setBlockTracking(-1) marks the
        // parent block with hasOnce: true
        // so that it doesn't take the fast path during unmount - otherwise
        // components nested in v-once are never unmounted.
        !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
        (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
          unmountChildren(
            dynamicChildren,
            parentComponent,
            parentSuspense,
            false,
            true
          );
        } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
          unmountChildren(children, parentComponent, parentSuspense);
        }
        if (doRemove) {
          remove(vnode);
        }
      }
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        }, parentSuspense);
      }
    };
    const remove = (vnode) => {
      const { type, el, anchor, transition } = vnode;
      if (type === Fragment) {
        {
          removeFragment(el, anchor);
        }
        return;
      }
      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = () => {
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const { leave, delayLeave } = transition;
        const performLeave = () => leave(el, performRemove);
        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };
    const removeFragment = (cur, end) => {
      let next;
      while (cur !== end) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }
      hostRemove(end);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
      const {
        bum,
        scope,
        job,
        subTree,
        um,
        m,
        a,
        parent,
        slots: { __: slotCacheKeys }
      } = instance;
      invalidateMount(m);
      invalidateMount(a);
      if (bum) {
        shared.invokeArrayFns(bum);
      }
      if (parent && shared.isArray(slotCacheKeys)) {
        slotCacheKeys.forEach((v) => {
          parent.renderCache[v] = void 0;
        });
      }
      scope.stop();
      if (job) {
        job.flags |= 8;
        unmount(subTree, instance, parentSuspense, doRemove);
      }
      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }
      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense);
      if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
        parentSuspense.deps--;
        if (parentSuspense.deps === 0) {
          parentSuspense.resolve();
        }
      }
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
      for (let i = start; i < children.length; i++) {
        unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
      }
    };
    const getNextHostNode = (vnode) => {
      if (vnode.shapeFlag & 6) {
        return getNextHostNode(vnode.component.subTree);
      }
      if (vnode.shapeFlag & 128) {
        return vnode.suspense.next();
      }
      const el = hostNextSibling(vnode.anchor || vnode.el);
      const teleportEnd = el && el[TeleportEndKey];
      return teleportEnd ? hostNextSibling(teleportEnd) : el;
    };
    let isFlushing = false;
    const render = (vnode, container, namespace) => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(
          container._vnode || null,
          vnode,
          container,
          null,
          null,
          null,
          namespace
        );
      }
      container._vnode = vnode;
      if (!isFlushing) {
        isFlushing = true;
        flushPreFlushCbs();
        flushPostFlushCbs();
        isFlushing = false;
      }
    };
    const internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate;
    let hydrateNode;
    if (createHydrationFns) {
      [hydrate, hydrateNode] = createHydrationFns(
        internals
      );
    }
    return {
      render,
      hydrate,
      createApp: createAppAPI(render, hydrate)
    };
  }
  function resolveChildrenNamespace({ type, props }, currentNamespace) {
    return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
  }
  function toggleRecurse({ effect, job }, allowed) {
    if (allowed) {
      effect.flags |= 32;
      job.flags |= 4;
    } else {
      effect.flags &= -33;
      job.flags &= -5;
    }
  }
  function needTransition(parentSuspense, transition) {
    return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
  }
  function traverseStaticChildren(n1, n2, shallow = false) {
    const ch1 = n1.children;
    const ch2 = n2.children;
    if (shared.isArray(ch1) && shared.isArray(ch2)) {
      for (let i = 0; i < ch1.length; i++) {
        const c1 = ch1[i];
        let c2 = ch2[i];
        if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
            c2 = ch2[i] = cloneIfMounted(ch2[i]);
            c2.el = c1.el;
          }
          if (!shallow && c2.patchFlag !== -2)
            traverseStaticChildren(c1, c2);
        }
        if (c2.type === Text) {
          c2.el = c1.el;
        }
        if (c2.type === Comment && !c2.el) {
          c2.el = c1.el;
        }
      }
    }
  }
  function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }
    return result;
  }
  function locateNonHydratedAsyncRoot(instance) {
    const subComponent = instance.subTree.component;
    if (subComponent) {
      if (subComponent.asyncDep && !subComponent.asyncResolved) {
        return subComponent;
      } else {
        return locateNonHydratedAsyncRoot(subComponent);
      }
    }
  }
  function invalidateMount(hooks) {
    if (hooks) {
      for (let i = 0; i < hooks.length; i++)
        hooks[i].flags |= 8;
    }
  }
  const ssrContextKey = Symbol.for("v-scx");
  const useSSRContext = () => {
    {
      const ctx = inject(ssrContextKey);
      return ctx;
    }
  };
  function watchEffect(effect, options) {
    return doWatch(effect, null, options);
  }
  function watchPostEffect(effect, options) {
    return doWatch(
      effect,
      null,
      { flush: "post" }
    );
  }
  function watchSyncEffect(effect, options) {
    return doWatch(
      effect,
      null,
      { flush: "sync" }
    );
  }
  function watch(source, cb, options) {
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, options = shared.EMPTY_OBJ) {
    const { immediate, deep, flush, once } = options;
    const baseWatchOptions = shared.extend({}, options);
    const runsImmediately = cb && immediate || !cb && flush !== "post";
    let ssrCleanup;
    if (isInSSRComponentSetup) {
      if (flush === "sync") {
        const ctx = useSSRContext();
        ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
      } else if (!runsImmediately) {
        const watchStopHandle = () => {
        };
        watchStopHandle.stop = shared.NOOP;
        watchStopHandle.resume = shared.NOOP;
        watchStopHandle.pause = shared.NOOP;
        return watchStopHandle;
      }
    }
    const instance = currentInstance;
    baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
    let isPre = false;
    if (flush === "post") {
      baseWatchOptions.scheduler = (job) => {
        queuePostRenderEffect(job, instance && instance.suspense);
      };
    } else if (flush !== "sync") {
      isPre = true;
      baseWatchOptions.scheduler = (job, isFirstRun) => {
        if (isFirstRun) {
          job();
        } else {
          queueJob(job);
        }
      };
    }
    baseWatchOptions.augmentJob = (job) => {
      if (cb) {
        job.flags |= 4;
      }
      if (isPre) {
        job.flags |= 2;
        if (instance) {
          job.id = instance.uid;
          job.i = instance;
        }
      }
    };
    const watchHandle = reactivity.watch(source, cb, baseWatchOptions);
    if (isInSSRComponentSetup) {
      if (ssrCleanup) {
        ssrCleanup.push(watchHandle);
      } else if (runsImmediately) {
        watchHandle();
      }
    }
    return watchHandle;
  }
  function instanceWatch(source, value, options) {
    const publicThis = this.proxy;
    const getter = shared.isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    if (shared.isFunction(value)) {
      cb = value;
    } else {
      cb = value.handler;
      options = value;
    }
    const reset = setCurrentInstance(this);
    const res = doWatch(getter, cb.bind(publicThis), options);
    reset();
    return res;
  }
  function createPathGetter(ctx, path) {
    const segments = path.split(".");
    return () => {
      let cur = ctx;
      for (let i = 0; i < segments.length && cur; i++) {
        cur = cur[segments[i]];
      }
      return cur;
    };
  }
  function useModel(props, name, options = shared.EMPTY_OBJ) {
    const i = getCurrentInstance();
    const camelizedName = shared.camelize(name);
    const hyphenatedName = shared.hyphenate(name);
    const modifiers = getModelModifiers(props, camelizedName);
    const res = reactivity.customRef((track, trigger) => {
      let localValue;
      let prevSetValue = shared.EMPTY_OBJ;
      let prevEmittedValue;
      watchSyncEffect(() => {
        const propValue = props[camelizedName];
        if (shared.hasChanged(localValue, propValue)) {
          localValue = propValue;
          trigger();
        }
      });
      return {
        get() {
          track();
          return options.get ? options.get(localValue) : localValue;
        },
        set(value) {
          const emittedValue = options.set ? options.set(value) : value;
          if (!shared.hasChanged(emittedValue, localValue) && !(prevSetValue !== shared.EMPTY_OBJ && shared.hasChanged(value, prevSetValue))) {
            return;
          }
          const rawProps = i.vnode.props;
          if (!(rawProps && // check if parent has passed v-model
          (name in rawProps || camelizedName in rawProps || hyphenatedName in rawProps) && (`onUpdate:${name}` in rawProps || `onUpdate:${camelizedName}` in rawProps || `onUpdate:${hyphenatedName}` in rawProps))) {
            localValue = value;
            trigger();
          }
          i.emit(`update:${name}`, emittedValue);
          if (shared.hasChanged(value, emittedValue) && shared.hasChanged(value, prevSetValue) && !shared.hasChanged(emittedValue, prevEmittedValue)) {
            trigger();
          }
          prevSetValue = value;
          prevEmittedValue = emittedValue;
        }
      };
    });
    res[Symbol.iterator] = () => {
      let i2 = 0;
      return {
        next() {
          if (i2 < 2) {
            return { value: i2++ ? modifiers || shared.EMPTY_OBJ : res, done: false };
          } else {
            return { done: true };
          }
        }
      };
    };
    return res;
  }
  const getModelModifiers = (props, modelName) => {
    return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${shared.camelize(modelName)}Modifiers`] || props[`${shared.hyphenate(modelName)}Modifiers`];
  };
  function emit(instance, event, ...rawArgs) {
    if (instance.isUnmounted) return;
    const props = instance.vnode.props || shared.EMPTY_OBJ;
    let args = rawArgs;
    const isModelListener = event.startsWith("update:");
    const modifiers = isModelListener && getModelModifiers(props, event.slice(7));
    if (modifiers) {
      if (modifiers.trim) {
        args = rawArgs.map((a) => shared.isString(a) ? a.trim() : a);
      }
      if (modifiers.number) {
        args = rawArgs.map(shared.looseToNumber);
      }
    }
    let handlerName;
    let handler = props[handlerName = shared.toHandlerKey(event)] || // also try camelCase event handler (#2249)
    props[handlerName = shared.toHandlerKey(shared.camelize(event))];
    if (!handler && isModelListener) {
      handler = props[handlerName = shared.toHandlerKey(shared.hyphenate(event))];
    }
    if (handler) {
      callWithAsyncErrorHandling(
        handler,
        instance,
        6,
        args
      );
    }
    const onceHandler = props[handlerName + `Once`];
    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }
      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(
        onceHandler,
        instance,
        6,
        args
      );
    }
  }
  function normalizeEmitsOptions(comp, appContext, asMixin = false) {
    const cache = appContext.emitsCache;
    const cached = cache.get(comp);
    if (cached !== void 0) {
      return cached;
    }
    const raw = comp.emits;
    let normalized = {};
    let hasExtends = false;
    if (!shared.isFunction(comp)) {
      const extendEmits = (raw2) => {
        const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
        if (normalizedFromExtend) {
          hasExtends = true;
          shared.extend(normalized, normalizedFromExtend);
        }
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendEmits);
      }
      if (comp.extends) {
        extendEmits(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendEmits);
      }
    }
    if (!raw && !hasExtends) {
      if (shared.isObject(comp)) {
        cache.set(comp, null);
      }
      return null;
    }
    if (shared.isArray(raw)) {
      raw.forEach((key) => normalized[key] = null);
    } else {
      shared.extend(normalized, raw);
    }
    if (shared.isObject(comp)) {
      cache.set(comp, normalized);
    }
    return normalized;
  }
  function isEmitListener(options, key) {
    if (!options || !shared.isOn(key)) {
      return false;
    }
    key = key.slice(2).replace(/Once$/, "");
    return shared.hasOwn(options, key[0].toLowerCase() + key.slice(1)) || shared.hasOwn(options, shared.hyphenate(key)) || shared.hasOwn(options, key);
  }
  function markAttrsAccessed() {
  }
  function renderComponentRoot(instance) {
    const {
      type: Component,
      vnode,
      proxy,
      withProxy,
      propsOptions: [propsOptions],
      slots,
      attrs,
      emit: emit2,
      render,
      renderCache,
      props,
      data,
      setupState,
      ctx,
      inheritAttrs
    } = instance;
    const prev = setCurrentRenderingInstance(instance);
    let result;
    let fallthroughAttrs;
    try {
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy;
        const thisProxy = false ? new Proxy(proxyToUse, {
          get(target, key, receiver) {
            warn(
              `Property '${String(
                key
              )}' was accessed via 'this'. Avoid using 'this' in templates.`
            );
            return Reflect.get(target, key, receiver);
          }
        }) : proxyToUse;
        result = normalizeVNode(
          render.call(
            thisProxy,
            proxyToUse,
            renderCache,
            false ? shallowReadonly(props) : props,
            setupState,
            data,
            ctx
          )
        );
        fallthroughAttrs = attrs;
      } else {
        const render2 = Component;
        if (false) ;
        result = normalizeVNode(
          render2.length > 1 ? render2(
            false ? shallowReadonly(props) : props,
            false ? {
              get attrs() {
                markAttrsAccessed();
                return shallowReadonly(attrs);
              },
              slots,
              emit: emit2
            } : { attrs, slots, emit: emit2 }
          ) : render2(
            false ? shallowReadonly(props) : props,
            null
          )
        );
        fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      }
    } catch (err) {
      blockStack.length = 0;
      handleError(err, instance, 1);
      result = createVNode(Comment);
    }
    let root = result;
    if (fallthroughAttrs && inheritAttrs !== false) {
      const keys = Object.keys(fallthroughAttrs);
      const { shapeFlag } = root;
      if (keys.length) {
        if (shapeFlag & (1 | 6)) {
          if (propsOptions && keys.some(shared.isModelListener)) {
            fallthroughAttrs = filterModelListeners(
              fallthroughAttrs,
              propsOptions
            );
          }
          root = cloneVNode(root, fallthroughAttrs, false, true);
        }
      }
    }
    if (vnode.dirs) {
      root = cloneVNode(root, null, false, true);
      root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
    }
    if (vnode.transition) {
      setTransitionHooks(root, vnode.transition);
    }
    {
      result = root;
    }
    setCurrentRenderingInstance(prev);
    return result;
  }
  function filterSingleRoot(children, recurse = true) {
    let singleRoot;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (isVNode(child)) {
        if (child.type !== Comment || child.children === "v-if") {
          if (singleRoot) {
            return;
          } else {
            singleRoot = child;
          }
        }
      } else {
        return;
      }
    }
    return singleRoot;
  }
  const getFunctionalFallthrough = (attrs) => {
    let res;
    for (const key in attrs) {
      if (key === "class" || key === "style" || shared.isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }
    return res;
  };
  const filterModelListeners = (attrs, props) => {
    const res = {};
    for (const key in attrs) {
      if (!shared.isModelListener(key) || !(key.slice(9) in props)) {
        res[key] = attrs[key];
      }
    }
    return res;
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren, component } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    const emits = component.emitsOptions;
    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }
    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024) {
        return true;
      }
      if (patchFlag & 16) {
        if (!prevProps) {
          return !!nextProps;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      } else if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];
          if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
            return true;
          }
        }
      }
    } else {
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }
      if (prevProps === nextProps) {
        return false;
      }
      if (!prevProps) {
        return !!nextProps;
      }
      if (!nextProps) {
        return true;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    }
    return false;
  }
  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }
    return false;
  }
  function updateHOCHostEl({ vnode, parent }, el) {
    while (parent) {
      const root = parent.subTree;
      if (root.suspense && root.suspense.activeBranch === vnode) {
        root.el = vnode.el;
      }
      if (root === vnode) {
        (vnode = parent.vnode).el = el;
        parent = parent.parent;
      } else {
        break;
      }
    }
  }
  const isSuspense = (type) => type.__isSuspense;
  let suspenseId = 0;
  const SuspenseImpl = {
    name: "Suspense",
    // In order to make Suspense tree-shakable, we need to avoid importing it
    // directly in the renderer. The renderer checks for the __isSuspense flag
    // on a vnode's type and calls the `process` method, passing in renderer
    // internals.
    __isSuspense: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals) {
      if (n1 == null) {
        mountSuspense(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
          rendererInternals
        );
      } else {
        if (parentSuspense && parentSuspense.deps > 0 && !n1.suspense.isInFallback) {
          n2.suspense = n1.suspense;
          n2.suspense.vnode = n2;
          n2.el = n1.el;
          return;
        }
        patchSuspense(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          namespace,
          slotScopeIds,
          optimized,
          rendererInternals
        );
      }
    },
    hydrate: hydrateSuspense,
    normalize: normalizeSuspenseChildren
  };
  const Suspense = SuspenseImpl;
  function triggerEvent(vnode, name) {
    const eventListener = vnode.props && vnode.props[name];
    if (shared.isFunction(eventListener)) {
      eventListener();
    }
  }
  function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals) {
    const {
      p: patch,
      o: { createElement }
    } = rendererInternals;
    const hiddenContainer = createElement("div");
    const suspense = vnode.suspense = createSuspenseBoundary(
      vnode,
      parentSuspense,
      parentComponent,
      container,
      hiddenContainer,
      anchor,
      namespace,
      slotScopeIds,
      optimized,
      rendererInternals
    );
    patch(
      null,
      suspense.pendingBranch = vnode.ssContent,
      hiddenContainer,
      null,
      parentComponent,
      suspense,
      namespace,
      slotScopeIds
    );
    if (suspense.deps > 0) {
      triggerEvent(vnode, "onPending");
      triggerEvent(vnode, "onFallback");
      patch(
        null,
        vnode.ssFallback,
        container,
        anchor,
        parentComponent,
        null,
        // fallback tree will not have suspense context
        namespace,
        slotScopeIds
      );
      setActiveBranch(suspense, vnode.ssFallback);
    } else {
      suspense.resolve(false, true);
    }
  }
  function patchSuspense(n1, n2, container, anchor, parentComponent, namespace, slotScopeIds, optimized, { p: patch, um: unmount, o: { createElement } }) {
    const suspense = n2.suspense = n1.suspense;
    suspense.vnode = n2;
    n2.el = n1.el;
    const newBranch = n2.ssContent;
    const newFallback = n2.ssFallback;
    const { activeBranch, pendingBranch, isInFallback, isHydrating } = suspense;
    if (pendingBranch) {
      suspense.pendingBranch = newBranch;
      if (isSameVNodeType(newBranch, pendingBranch)) {
        patch(
          pendingBranch,
          newBranch,
          suspense.hiddenContainer,
          null,
          parentComponent,
          suspense,
          namespace,
          slotScopeIds,
          optimized
        );
        if (suspense.deps <= 0) {
          suspense.resolve();
        } else if (isInFallback) {
          if (!isHydrating) {
            patch(
              activeBranch,
              newFallback,
              container,
              anchor,
              parentComponent,
              null,
              // fallback tree will not have suspense context
              namespace,
              slotScopeIds,
              optimized
            );
            setActiveBranch(suspense, newFallback);
          }
        }
      } else {
        suspense.pendingId = suspenseId++;
        if (isHydrating) {
          suspense.isHydrating = false;
          suspense.activeBranch = pendingBranch;
        } else {
          unmount(pendingBranch, parentComponent, suspense);
        }
        suspense.deps = 0;
        suspense.effects.length = 0;
        suspense.hiddenContainer = createElement("div");
        if (isInFallback) {
          patch(
            null,
            newBranch,
            suspense.hiddenContainer,
            null,
            parentComponent,
            suspense,
            namespace,
            slotScopeIds,
            optimized
          );
          if (suspense.deps <= 0) {
            suspense.resolve();
          } else {
            patch(
              activeBranch,
              newFallback,
              container,
              anchor,
              parentComponent,
              null,
              // fallback tree will not have suspense context
              namespace,
              slotScopeIds,
              optimized
            );
            setActiveBranch(suspense, newFallback);
          }
        } else if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
          patch(
            activeBranch,
            newBranch,
            container,
            anchor,
            parentComponent,
            suspense,
            namespace,
            slotScopeIds,
            optimized
          );
          suspense.resolve(true);
        } else {
          patch(
            null,
            newBranch,
            suspense.hiddenContainer,
            null,
            parentComponent,
            suspense,
            namespace,
            slotScopeIds,
            optimized
          );
          if (suspense.deps <= 0) {
            suspense.resolve();
          }
        }
      }
    } else {
      if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
        patch(
          activeBranch,
          newBranch,
          container,
          anchor,
          parentComponent,
          suspense,
          namespace,
          slotScopeIds,
          optimized
        );
        setActiveBranch(suspense, newBranch);
      } else {
        triggerEvent(n2, "onPending");
        suspense.pendingBranch = newBranch;
        if (newBranch.shapeFlag & 512) {
          suspense.pendingId = newBranch.component.suspenseId;
        } else {
          suspense.pendingId = suspenseId++;
        }
        patch(
          null,
          newBranch,
          suspense.hiddenContainer,
          null,
          parentComponent,
          suspense,
          namespace,
          slotScopeIds,
          optimized
        );
        if (suspense.deps <= 0) {
          suspense.resolve();
        } else {
          const { timeout, pendingId } = suspense;
          if (timeout > 0) {
            setTimeout(() => {
              if (suspense.pendingId === pendingId) {
                suspense.fallback(newFallback);
              }
            }, timeout);
          } else if (timeout === 0) {
            suspense.fallback(newFallback);
          }
        }
      }
    }
  }
  function createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, namespace, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
    const {
      p: patch,
      m: move,
      um: unmount,
      n: next,
      o: { parentNode, remove }
    } = rendererInternals;
    let parentSuspenseId;
    const isSuspensible = isVNodeSuspensible(vnode);
    if (isSuspensible) {
      if (parentSuspense && parentSuspense.pendingBranch) {
        parentSuspenseId = parentSuspense.pendingId;
        parentSuspense.deps++;
      }
    }
    const timeout = vnode.props ? shared.toNumber(vnode.props.timeout) : void 0;
    const initialAnchor = anchor;
    const suspense = {
      vnode,
      parent: parentSuspense,
      parentComponent,
      namespace,
      container,
      hiddenContainer,
      deps: 0,
      pendingId: suspenseId++,
      timeout: typeof timeout === "number" ? timeout : -1,
      activeBranch: null,
      pendingBranch: null,
      isInFallback: !isHydrating,
      isHydrating,
      isUnmounted: false,
      effects: [],
      resolve(resume = false, sync = false) {
        const {
          vnode: vnode2,
          activeBranch,
          pendingBranch,
          pendingId,
          effects,
          parentComponent: parentComponent2,
          container: container2
        } = suspense;
        let delayEnter = false;
        if (suspense.isHydrating) {
          suspense.isHydrating = false;
        } else if (!resume) {
          delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === "out-in";
          if (delayEnter) {
            activeBranch.transition.afterLeave = () => {
              if (pendingId === suspense.pendingId) {
                move(
                  pendingBranch,
                  container2,
                  anchor === initialAnchor ? next(activeBranch) : anchor,
                  0
                );
                queuePostFlushCb(effects);
              }
            };
          }
          if (activeBranch) {
            if (parentNode(activeBranch.el) === container2) {
              anchor = next(activeBranch);
            }
            unmount(activeBranch, parentComponent2, suspense, true);
          }
          if (!delayEnter) {
            move(pendingBranch, container2, anchor, 0);
          }
        }
        setActiveBranch(suspense, pendingBranch);
        suspense.pendingBranch = null;
        suspense.isInFallback = false;
        let parent = suspense.parent;
        let hasUnresolvedAncestor = false;
        while (parent) {
          if (parent.pendingBranch) {
            parent.effects.push(...effects);
            hasUnresolvedAncestor = true;
            break;
          }
          parent = parent.parent;
        }
        if (!hasUnresolvedAncestor && !delayEnter) {
          queuePostFlushCb(effects);
        }
        suspense.effects = [];
        if (isSuspensible) {
          if (parentSuspense && parentSuspense.pendingBranch && parentSuspenseId === parentSuspense.pendingId) {
            parentSuspense.deps--;
            if (parentSuspense.deps === 0 && !sync) {
              parentSuspense.resolve();
            }
          }
        }
        triggerEvent(vnode2, "onResolve");
      },
      fallback(fallbackVNode) {
        if (!suspense.pendingBranch) {
          return;
        }
        const { vnode: vnode2, activeBranch, parentComponent: parentComponent2, container: container2, namespace: namespace2 } = suspense;
        triggerEvent(vnode2, "onFallback");
        const anchor2 = next(activeBranch);
        const mountFallback = () => {
          if (!suspense.isInFallback) {
            return;
          }
          patch(
            null,
            fallbackVNode,
            container2,
            anchor2,
            parentComponent2,
            null,
            // fallback tree will not have suspense context
            namespace2,
            slotScopeIds,
            optimized
          );
          setActiveBranch(suspense, fallbackVNode);
        };
        const delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === "out-in";
        if (delayEnter) {
          activeBranch.transition.afterLeave = mountFallback;
        }
        suspense.isInFallback = true;
        unmount(
          activeBranch,
          parentComponent2,
          null,
          // no suspense so unmount hooks fire now
          true
          // shouldRemove
        );
        if (!delayEnter) {
          mountFallback();
        }
      },
      move(container2, anchor2, type) {
        suspense.activeBranch && move(suspense.activeBranch, container2, anchor2, type);
        suspense.container = container2;
      },
      next() {
        return suspense.activeBranch && next(suspense.activeBranch);
      },
      registerDep(instance, setupRenderEffect, optimized2) {
        const isInPendingSuspense = !!suspense.pendingBranch;
        if (isInPendingSuspense) {
          suspense.deps++;
        }
        const hydratedEl = instance.vnode.el;
        instance.asyncDep.catch((err) => {
          handleError(err, instance, 0);
        }).then((asyncSetupResult) => {
          if (instance.isUnmounted || suspense.isUnmounted || suspense.pendingId !== instance.suspenseId) {
            return;
          }
          instance.asyncResolved = true;
          const { vnode: vnode2 } = instance;
          handleSetupResult(instance, asyncSetupResult, false);
          if (hydratedEl) {
            vnode2.el = hydratedEl;
          }
          const placeholder = !hydratedEl && instance.subTree.el;
          setupRenderEffect(
            instance,
            vnode2,
            // component may have been moved before resolve.
            // if this is not a hydration, instance.subTree will be the comment
            // placeholder.
            parentNode(hydratedEl || instance.subTree.el),
            // anchor will not be used if this is hydration, so only need to
            // consider the comment placeholder case.
            hydratedEl ? null : next(instance.subTree),
            suspense,
            namespace,
            optimized2
          );
          if (placeholder) {
            remove(placeholder);
          }
          updateHOCHostEl(instance, vnode2.el);
          if (isInPendingSuspense && --suspense.deps === 0) {
            suspense.resolve();
          }
        });
      },
      unmount(parentSuspense2, doRemove) {
        suspense.isUnmounted = true;
        if (suspense.activeBranch) {
          unmount(
            suspense.activeBranch,
            parentComponent,
            parentSuspense2,
            doRemove
          );
        }
        if (suspense.pendingBranch) {
          unmount(
            suspense.pendingBranch,
            parentComponent,
            parentSuspense2,
            doRemove
          );
        }
      }
    };
    return suspense;
  }
  function hydrateSuspense(node, vnode, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals, hydrateNode) {
    const suspense = vnode.suspense = createSuspenseBoundary(
      vnode,
      parentSuspense,
      parentComponent,
      node.parentNode,
      // eslint-disable-next-line no-restricted-globals
      (void 0).createElement("div"),
      null,
      namespace,
      slotScopeIds,
      optimized,
      rendererInternals,
      true
    );
    const result = hydrateNode(
      node,
      suspense.pendingBranch = vnode.ssContent,
      parentComponent,
      suspense,
      slotScopeIds,
      optimized
    );
    if (suspense.deps === 0) {
      suspense.resolve(false, true);
    }
    return result;
  }
  function normalizeSuspenseChildren(vnode) {
    const { shapeFlag, children } = vnode;
    const isSlotChildren = shapeFlag & 32;
    vnode.ssContent = normalizeSuspenseSlot(
      isSlotChildren ? children.default : children
    );
    vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : createVNode(Comment);
  }
  function normalizeSuspenseSlot(s) {
    let block;
    if (shared.isFunction(s)) {
      const trackBlock = isBlockTreeEnabled && s._c;
      if (trackBlock) {
        s._d = false;
        openBlock();
      }
      s = s();
      if (trackBlock) {
        s._d = true;
        block = currentBlock;
        closeBlock();
      }
    }
    if (shared.isArray(s)) {
      const singleChild = filterSingleRoot(s);
      s = singleChild;
    }
    s = normalizeVNode(s);
    if (block && !s.dynamicChildren) {
      s.dynamicChildren = block.filter((c) => c !== s);
    }
    return s;
  }
  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (shared.isArray(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }
  function setActiveBranch(suspense, branch) {
    suspense.activeBranch = branch;
    const { vnode, parentComponent } = suspense;
    let el = branch.el;
    while (!el && branch.component) {
      branch = branch.component.subTree;
      el = branch.el;
    }
    vnode.el = el;
    if (parentComponent && parentComponent.subTree === vnode) {
      parentComponent.vnode.el = el;
      updateHOCHostEl(parentComponent, el);
    }
  }
  function isVNodeSuspensible(vnode) {
    const suspensible = vnode.props && vnode.props.suspensible;
    return suspensible != null && suspensible !== false;
  }
  const Fragment = Symbol.for("v-fgt");
  const Text = Symbol.for("v-txt");
  const Comment = Symbol.for("v-cmt");
  const Static = Symbol.for("v-stc");
  const blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  }
  let isBlockTreeEnabled = 1;
  function setBlockTracking(value, inVOnce = false) {
    isBlockTreeEnabled += value;
    if (value < 0 && currentBlock && inVOnce) {
      currentBlock.hasOnce = true;
    }
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || shared.EMPTY_ARR : null;
    closeBlock();
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(
      createBaseVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        shapeFlag,
        true
      )
    );
  }
  function createBlock(type, props, children, patchFlag, dynamicProps) {
    return setupBlock(
      createVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        true
      )
    );
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  function transformVNodeArgs(transformer) {
  }
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({
    ref,
    ref_key,
    ref_for
  }) => {
    if (typeof ref === "number") {
      ref = "" + ref;
    }
    return ref != null ? shared.isString(ref) || reactivity.isRef(ref) || shared.isFunction(ref) ? { i: currentRenderingInstance, r: ref, k: ref_key, f: !!ref_for } : ref : null;
  };
  function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
    const vnode = {
      __v_isVNode: true,
      __v_skip: true,
      type,
      props,
      key: props && normalizeKey(props),
      ref: props && normalizeRef(props),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetStart: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null,
      ctx: currentRenderingInstance
    };
    if (needFullChildrenNormalization) {
      normalizeChildren(vnode, children);
      if (shapeFlag & 128) {
        type.normalize(vnode);
      }
    } else if (children) {
      vnode.shapeFlag |= shared.isString(children) ? 8 : 16;
    }
    if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
    !isBlockNode && // has current parent block
    currentBlock && // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== 32) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  const createVNode = _createVNode;
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
      type = Comment;
    }
    if (isVNode(type)) {
      const cloned = cloneVNode(
        type,
        props,
        true
        /* mergeRef: true */
      );
      if (children) {
        normalizeChildren(cloned, children);
      }
      if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
        if (cloned.shapeFlag & 6) {
          currentBlock[currentBlock.indexOf(type)] = cloned;
        } else {
          currentBlock.push(cloned);
        }
      }
      cloned.patchFlag = -2;
      return cloned;
    }
    if (isClassComponent(type)) {
      type = type.__vccOpts;
    }
    if (props) {
      props = guardReactiveProps(props);
      let { class: klass, style } = props;
      if (klass && !shared.isString(klass)) {
        props.class = shared.normalizeClass(klass);
      }
      if (shared.isObject(style)) {
        if (reactivity.isProxy(style) && !shared.isArray(style)) {
          style = shared.extend({}, style);
        }
        props.style = shared.normalizeStyle(style);
      }
    }
    const shapeFlag = shared.isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : shared.isObject(type) ? 4 : shared.isFunction(type) ? 2 : 0;
    return createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      isBlockNode,
      true
    );
  }
  function guardReactiveProps(props) {
    if (!props) return null;
    return reactivity.isProxy(props) || isInternalObject(props) ? shared.extend({}, props) : props;
  }
  function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
    const { props, ref, patchFlag, children, transition } = vnode;
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    const cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? (
        // #2078 in the case of <component :is="vnode" ref="extra"/>
        // if the vnode itself already has a ref, cloneVNode will need to merge
        // the refs so the single vnode can be set on multiple refs
        mergeRef && ref ? shared.isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps)
      ) : ref,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children,
      target: vnode.target,
      targetStart: vnode.targetStart,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      // if the vnode is cloned with extra props, we can no longer assume its
      // existing patch flag to be reliable and need to add the FULL_PROPS flag.
      // note: preserve flag for fragments since they use the flag for children
      // fast paths only.
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition,
      // These should technically only be non-null on mounted VNodes. However,
      // they *should* be copied for kept-alive vnodes. So we just always copy
      // them since them being non-null during a mount doesn't affect the logic as
      // they will simply be overwritten.
      component: vnode.component,
      suspense: vnode.suspense,
      ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
      ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
      el: vnode.el,
      anchor: vnode.anchor,
      ctx: vnode.ctx,
      ce: vnode.ce
    };
    if (transition && cloneTransition) {
      setTransitionHooks(
        cloned,
        transition.clone(cloned)
      );
    }
    return cloned;
  }
  function createTextVNode(text = " ", flag = 0) {
    return createVNode(Text, null, text, flag);
  }
  function createStaticVNode(content, numberOfNodes) {
    const vnode = createVNode(Static, null, content);
    vnode.staticCount = numberOfNodes;
    return vnode;
  }
  function createCommentVNode(text = "", asBlock = false) {
    return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
  }
  function normalizeVNode(child) {
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment);
    } else if (shared.isArray(child)) {
      return createVNode(
        Fragment,
        null,
        // #3666, avoid reference pollution when reusing vnode
        child.slice()
      );
    } else if (isVNode(child)) {
      return cloneIfMounted(child);
    } else {
      return createVNode(Text, null, String(child));
    }
  }
  function cloneIfMounted(child) {
    return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
  }
  function normalizeChildren(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
      children = null;
    } else if (shared.isArray(children)) {
      type = 16;
    } else if (typeof children === "object") {
      if (shapeFlag & (1 | 64)) {
        const slot = children.default;
        if (slot) {
          slot._c && (slot._d = false);
          normalizeChildren(vnode, slot());
          slot._c && (slot._d = true);
        }
        return;
      } else {
        type = 32;
        const slotFlag = children._;
        if (!slotFlag && !isInternalObject(children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3 && currentRenderingInstance) {
          if (currentRenderingInstance.slots._ === 1) {
            children._ = 1;
          } else {
            children._ = 2;
            vnode.patchFlag |= 1024;
          }
        }
      }
    } else if (shared.isFunction(children)) {
      children = { default: children, _ctx: currentRenderingInstance };
      type = 32;
    } else {
      children = String(children);
      if (shapeFlag & 64) {
        type = 16;
        children = [createTextVNode(children)];
      } else {
        type = 8;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
  }
  function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = shared.normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === "style") {
          ret.style = shared.normalizeStyle([ret.style, toMerge.style]);
        } else if (shared.isOn(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (incoming && existing !== incoming && !(shared.isArray(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== "") {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }
  const emptyAppContext = createAppContext();
  let uid = 0;
  function createComponentInstance(vnode, parent, suspense) {
    const type = vnode.type;
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
      uid: uid++,
      vnode,
      type,
      parent,
      appContext,
      root: null,
      // to be immediately set
      next: null,
      subTree: null,
      // will be set synchronously right after creation
      effect: null,
      update: null,
      // will be set synchronously right after creation
      job: null,
      scope: new reactivity.EffectScope(
        true
        /* detached */
      ),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      ids: parent ? parent.ids : ["", 0, 0],
      accessCache: null,
      renderCache: [],
      // local resolved assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
      // emit
      emit: null,
      // to be set immediately
      emitted: null,
      // props default value
      propsDefaults: shared.EMPTY_OBJ,
      // inheritAttrs
      inheritAttrs: type.inheritAttrs,
      // state
      ctx: shared.EMPTY_OBJ,
      data: shared.EMPTY_OBJ,
      props: shared.EMPTY_OBJ,
      attrs: shared.EMPTY_OBJ,
      slots: shared.EMPTY_OBJ,
      refs: shared.EMPTY_OBJ,
      setupState: shared.EMPTY_OBJ,
      setupContext: null,
      // suspense related
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      // lifecycle hooks
      // not using enums here because it results in computed properties
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
    {
      instance.ctx = { _: instance };
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    if (vnode.ce) {
      vnode.ce(instance);
    }
    return instance;
  }
  let currentInstance = null;
  const getCurrentInstance = () => currentInstance || currentRenderingInstance;
  let internalSetCurrentInstance;
  let setInSSRSetupState;
  {
    const g2 = shared.getGlobalThis();
    const registerGlobalSetter = (key, setter) => {
      let setters;
      if (!(setters = g2[key])) setters = g2[key] = [];
      setters.push(setter);
      return (v) => {
        if (setters.length > 1) setters.forEach((set) => set(v));
        else setters[0](v);
      };
    };
    internalSetCurrentInstance = registerGlobalSetter(
      `__VUE_INSTANCE_SETTERS__`,
      (v) => currentInstance = v
    );
    setInSSRSetupState = registerGlobalSetter(
      `__VUE_SSR_SETTERS__`,
      (v) => isInSSRComponentSetup = v
    );
  }
  const setCurrentInstance = (instance) => {
    const prev = currentInstance;
    internalSetCurrentInstance(instance);
    instance.scope.on();
    return () => {
      instance.scope.off();
      internalSetCurrentInstance(prev);
    };
  };
  const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    internalSetCurrentInstance(null);
  };
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  let isInSSRComponentSetup = false;
  function setupComponent(instance, isSSR = false, optimized = false) {
    isSSR && setInSSRSetupState(isSSR);
    const { props, children } = instance.vnode;
    const isStateful = isStatefulComponent(instance);
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children, optimized || isSSR);
    const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
    isSSR && setInSSRSetupState(false);
    return setupResult;
  }
  function setupStatefulComponent(instance, isSSR) {
    const Component = instance.type;
    instance.accessCache = /* @__PURE__ */ Object.create(null);
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
      reactivity.pauseTracking();
      const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      const reset = setCurrentInstance(instance);
      const setupResult = callWithErrorHandling(
        setup,
        instance,
        0,
        [
          instance.props,
          setupContext
        ]
      );
      const isAsyncSetup = shared.isPromise(setupResult);
      reactivity.resetTracking();
      reset();
      if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
        markAsyncBoundary(instance);
      }
      if (isAsyncSetup) {
        setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
        if (isSSR) {
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult, isSSR);
          }).catch((e) => {
            handleError(e, instance, 0);
          });
        } else {
          instance.asyncDep = setupResult;
        }
      } else {
        handleSetupResult(instance, setupResult, isSSR);
      }
    } else {
      finishComponentSetup(instance, isSSR);
    }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
    if (shared.isFunction(setupResult)) {
      if (instance.type.__ssrInlineRender) {
        instance.ssrRender = setupResult;
      } else {
        instance.render = setupResult;
      }
    } else if (shared.isObject(setupResult)) {
      instance.setupState = reactivity.proxyRefs(setupResult);
    } else ;
    finishComponentSetup(instance, isSSR);
  }
  let compile;
  let installWithProxy;
  function registerRuntimeCompiler(_compile) {
    compile = _compile;
    installWithProxy = (i) => {
      if (i.render._rc) {
        i.withProxy = new Proxy(i.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
      }
    };
  }
  const isRuntimeOnly = () => !compile;
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    if (!instance.render) {
      if (!isSSR && compile && !Component.render) {
        const template = Component.template || resolveMergedOptions(instance).template;
        if (template) {
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
          Component.render = compile(template, finalCompilerOptions);
        }
      }
      instance.render = Component.render || shared.NOOP;
      if (installWithProxy) {
        installWithProxy(instance);
      }
    }
    {
      const reset = setCurrentInstance(instance);
      reactivity.pauseTracking();
      try {
        applyOptions(instance);
      } finally {
        reactivity.resetTracking();
        reset();
      }
    }
  }
  const attrsProxyHandlers = {
    get(target, key) {
      reactivity.track(target, "get", "");
      return target[key];
    }
  };
  function createSetupContext(instance) {
    const expose = (exposed) => {
      instance.exposed = exposed || {};
    };
    {
      return {
        attrs: new Proxy(instance.attrs, attrsProxyHandlers),
        slots: instance.slots,
        emit: instance.emit,
        expose
      };
    }
  }
  function getComponentPublicInstance(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(reactivity.proxyRefs(reactivity.markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        },
        has(target, key) {
          return key in target || key in publicPropertiesMap;
        }
      }));
    } else {
      return instance.proxy;
    }
  }
  function getComponentName(Component, includeInferred = true) {
    return shared.isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
  }
  function isClassComponent(value) {
    return shared.isFunction(value) && "__vccOpts" in value;
  }
  const computed = (getterOrOptions, debugOptions) => {
    const c = reactivity.computed(getterOrOptions, debugOptions, isInSSRComponentSetup);
    return c;
  };
  function h(type, propsOrChildren, children) {
    const l = arguments.length;
    if (l === 2) {
      if (shared.isObject(propsOrChildren) && !shared.isArray(propsOrChildren)) {
        if (isVNode(propsOrChildren)) {
          return createVNode(type, null, [propsOrChildren]);
        }
        return createVNode(type, propsOrChildren);
      } else {
        return createVNode(type, null, propsOrChildren);
      }
    } else {
      if (l > 3) {
        children = Array.prototype.slice.call(arguments, 2);
      } else if (l === 3 && isVNode(children)) {
        children = [children];
      }
      return createVNode(type, propsOrChildren, children);
    }
  }
  function initCustomFormatter() {
    {
      return;
    }
  }
  function withMemo(memo, render, cache, index) {
    const cached = cache[index];
    if (cached && isMemoSame(cached, memo)) {
      return cached;
    }
    const ret = render();
    ret.memo = memo.slice();
    ret.cacheIndex = index;
    return cache[index] = ret;
  }
  function isMemoSame(cached, memo) {
    const prev = cached.memo;
    if (prev.length != memo.length) {
      return false;
    }
    for (let i = 0; i < prev.length; i++) {
      if (shared.hasChanged(prev[i], memo[i])) {
        return false;
      }
    }
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(cached);
    }
    return true;
  }
  const version = "3.5.16";
  const warn$12 = shared.NOOP;
  const ErrorTypeStrings = ErrorTypeStrings$1;
  const devtools = void 0;
  const setDevtoolsHook = shared.NOOP;
  const _ssrUtils = {
    createComponentInstance,
    setupComponent,
    renderComponentRoot,
    setCurrentRenderingInstance,
    isVNode,
    normalizeVNode,
    getComponentPublicInstance,
    ensureValidVNode,
    pushWarningContext,
    popWarningContext
  };
  const ssrUtils = _ssrUtils;
  const resolveFilter = null;
  const compatUtils = null;
  const DeprecationTypes = null;
  runtimeCore_cjs_prod.EffectScope = reactivity.EffectScope;
  runtimeCore_cjs_prod.ReactiveEffect = reactivity.ReactiveEffect;
  runtimeCore_cjs_prod.TrackOpTypes = reactivity.TrackOpTypes;
  runtimeCore_cjs_prod.TriggerOpTypes = reactivity.TriggerOpTypes;
  runtimeCore_cjs_prod.customRef = reactivity.customRef;
  runtimeCore_cjs_prod.effect = reactivity.effect;
  runtimeCore_cjs_prod.effectScope = reactivity.effectScope;
  runtimeCore_cjs_prod.getCurrentScope = reactivity.getCurrentScope;
  runtimeCore_cjs_prod.getCurrentWatcher = reactivity.getCurrentWatcher;
  runtimeCore_cjs_prod.isProxy = reactivity.isProxy;
  runtimeCore_cjs_prod.isReactive = reactivity.isReactive;
  runtimeCore_cjs_prod.isReadonly = reactivity.isReadonly;
  runtimeCore_cjs_prod.isRef = reactivity.isRef;
  runtimeCore_cjs_prod.isShallow = reactivity.isShallow;
  runtimeCore_cjs_prod.markRaw = reactivity.markRaw;
  runtimeCore_cjs_prod.onScopeDispose = reactivity.onScopeDispose;
  runtimeCore_cjs_prod.onWatcherCleanup = reactivity.onWatcherCleanup;
  runtimeCore_cjs_prod.proxyRefs = reactivity.proxyRefs;
  runtimeCore_cjs_prod.reactive = reactivity.reactive;
  runtimeCore_cjs_prod.readonly = reactivity.readonly;
  runtimeCore_cjs_prod.ref = reactivity.ref;
  runtimeCore_cjs_prod.shallowReactive = reactivity.shallowReactive;
  runtimeCore_cjs_prod.shallowReadonly = reactivity.shallowReadonly;
  runtimeCore_cjs_prod.shallowRef = reactivity.shallowRef;
  runtimeCore_cjs_prod.stop = reactivity.stop;
  runtimeCore_cjs_prod.toRaw = reactivity.toRaw;
  runtimeCore_cjs_prod.toRef = reactivity.toRef;
  runtimeCore_cjs_prod.toRefs = reactivity.toRefs;
  runtimeCore_cjs_prod.toValue = reactivity.toValue;
  runtimeCore_cjs_prod.triggerRef = reactivity.triggerRef;
  runtimeCore_cjs_prod.unref = reactivity.unref;
  runtimeCore_cjs_prod.camelize = shared.camelize;
  runtimeCore_cjs_prod.capitalize = shared.capitalize;
  runtimeCore_cjs_prod.normalizeClass = shared.normalizeClass;
  runtimeCore_cjs_prod.normalizeProps = shared.normalizeProps;
  runtimeCore_cjs_prod.normalizeStyle = shared.normalizeStyle;
  runtimeCore_cjs_prod.toDisplayString = shared.toDisplayString;
  runtimeCore_cjs_prod.toHandlerKey = shared.toHandlerKey;
  runtimeCore_cjs_prod.BaseTransition = BaseTransition;
  runtimeCore_cjs_prod.BaseTransitionPropsValidators = BaseTransitionPropsValidators;
  runtimeCore_cjs_prod.Comment = Comment;
  runtimeCore_cjs_prod.DeprecationTypes = DeprecationTypes;
  runtimeCore_cjs_prod.ErrorCodes = ErrorCodes;
  runtimeCore_cjs_prod.ErrorTypeStrings = ErrorTypeStrings;
  runtimeCore_cjs_prod.Fragment = Fragment;
  runtimeCore_cjs_prod.KeepAlive = KeepAlive;
  runtimeCore_cjs_prod.Static = Static;
  runtimeCore_cjs_prod.Suspense = Suspense;
  runtimeCore_cjs_prod.Teleport = Teleport;
  runtimeCore_cjs_prod.Text = Text;
  runtimeCore_cjs_prod.assertNumber = assertNumber;
  runtimeCore_cjs_prod.callWithAsyncErrorHandling = callWithAsyncErrorHandling;
  runtimeCore_cjs_prod.callWithErrorHandling = callWithErrorHandling;
  runtimeCore_cjs_prod.cloneVNode = cloneVNode;
  runtimeCore_cjs_prod.compatUtils = compatUtils;
  runtimeCore_cjs_prod.computed = computed;
  runtimeCore_cjs_prod.createBlock = createBlock;
  runtimeCore_cjs_prod.createCommentVNode = createCommentVNode;
  runtimeCore_cjs_prod.createElementBlock = createElementBlock;
  runtimeCore_cjs_prod.createElementVNode = createBaseVNode;
  runtimeCore_cjs_prod.createHydrationRenderer = createHydrationRenderer;
  runtimeCore_cjs_prod.createPropsRestProxy = createPropsRestProxy;
  runtimeCore_cjs_prod.createRenderer = createRenderer;
  runtimeCore_cjs_prod.createSlots = createSlots;
  runtimeCore_cjs_prod.createStaticVNode = createStaticVNode;
  runtimeCore_cjs_prod.createTextVNode = createTextVNode;
  runtimeCore_cjs_prod.createVNode = createVNode;
  runtimeCore_cjs_prod.defineAsyncComponent = defineAsyncComponent;
  runtimeCore_cjs_prod.defineComponent = defineComponent;
  runtimeCore_cjs_prod.defineEmits = defineEmits;
  runtimeCore_cjs_prod.defineExpose = defineExpose;
  runtimeCore_cjs_prod.defineModel = defineModel;
  runtimeCore_cjs_prod.defineOptions = defineOptions;
  runtimeCore_cjs_prod.defineProps = defineProps;
  runtimeCore_cjs_prod.defineSlots = defineSlots;
  runtimeCore_cjs_prod.devtools = devtools;
  runtimeCore_cjs_prod.getCurrentInstance = getCurrentInstance;
  runtimeCore_cjs_prod.getTransitionRawChildren = getTransitionRawChildren;
  runtimeCore_cjs_prod.guardReactiveProps = guardReactiveProps;
  runtimeCore_cjs_prod.h = h;
  runtimeCore_cjs_prod.handleError = handleError;
  runtimeCore_cjs_prod.hasInjectionContext = hasInjectionContext;
  runtimeCore_cjs_prod.hydrateOnIdle = hydrateOnIdle;
  runtimeCore_cjs_prod.hydrateOnInteraction = hydrateOnInteraction;
  runtimeCore_cjs_prod.hydrateOnMediaQuery = hydrateOnMediaQuery;
  runtimeCore_cjs_prod.hydrateOnVisible = hydrateOnVisible;
  runtimeCore_cjs_prod.initCustomFormatter = initCustomFormatter;
  runtimeCore_cjs_prod.inject = inject;
  runtimeCore_cjs_prod.isMemoSame = isMemoSame;
  runtimeCore_cjs_prod.isRuntimeOnly = isRuntimeOnly;
  runtimeCore_cjs_prod.isVNode = isVNode;
  runtimeCore_cjs_prod.mergeDefaults = mergeDefaults;
  runtimeCore_cjs_prod.mergeModels = mergeModels;
  runtimeCore_cjs_prod.mergeProps = mergeProps;
  runtimeCore_cjs_prod.nextTick = nextTick;
  runtimeCore_cjs_prod.onActivated = onActivated;
  runtimeCore_cjs_prod.onBeforeMount = onBeforeMount;
  runtimeCore_cjs_prod.onBeforeUnmount = onBeforeUnmount;
  runtimeCore_cjs_prod.onBeforeUpdate = onBeforeUpdate;
  runtimeCore_cjs_prod.onDeactivated = onDeactivated;
  runtimeCore_cjs_prod.onErrorCaptured = onErrorCaptured;
  runtimeCore_cjs_prod.onMounted = onMounted;
  runtimeCore_cjs_prod.onRenderTracked = onRenderTracked;
  runtimeCore_cjs_prod.onRenderTriggered = onRenderTriggered;
  runtimeCore_cjs_prod.onServerPrefetch = onServerPrefetch;
  runtimeCore_cjs_prod.onUnmounted = onUnmounted;
  runtimeCore_cjs_prod.onUpdated = onUpdated;
  runtimeCore_cjs_prod.openBlock = openBlock;
  runtimeCore_cjs_prod.popScopeId = popScopeId;
  runtimeCore_cjs_prod.provide = provide;
  runtimeCore_cjs_prod.pushScopeId = pushScopeId;
  runtimeCore_cjs_prod.queuePostFlushCb = queuePostFlushCb;
  runtimeCore_cjs_prod.registerRuntimeCompiler = registerRuntimeCompiler;
  runtimeCore_cjs_prod.renderList = renderList;
  runtimeCore_cjs_prod.renderSlot = renderSlot;
  runtimeCore_cjs_prod.resolveComponent = resolveComponent;
  runtimeCore_cjs_prod.resolveDirective = resolveDirective;
  runtimeCore_cjs_prod.resolveDynamicComponent = resolveDynamicComponent;
  runtimeCore_cjs_prod.resolveFilter = resolveFilter;
  runtimeCore_cjs_prod.resolveTransitionHooks = resolveTransitionHooks;
  runtimeCore_cjs_prod.setBlockTracking = setBlockTracking;
  runtimeCore_cjs_prod.setDevtoolsHook = setDevtoolsHook;
  runtimeCore_cjs_prod.setTransitionHooks = setTransitionHooks;
  runtimeCore_cjs_prod.ssrContextKey = ssrContextKey;
  runtimeCore_cjs_prod.ssrUtils = ssrUtils;
  runtimeCore_cjs_prod.toHandlers = toHandlers;
  runtimeCore_cjs_prod.transformVNodeArgs = transformVNodeArgs;
  runtimeCore_cjs_prod.useAttrs = useAttrs;
  runtimeCore_cjs_prod.useId = useId;
  runtimeCore_cjs_prod.useModel = useModel;
  runtimeCore_cjs_prod.useSSRContext = useSSRContext;
  runtimeCore_cjs_prod.useSlots = useSlots;
  runtimeCore_cjs_prod.useTemplateRef = useTemplateRef;
  runtimeCore_cjs_prod.useTransitionState = useTransitionState;
  runtimeCore_cjs_prod.version = version;
  runtimeCore_cjs_prod.warn = warn$12;
  runtimeCore_cjs_prod.watch = watch;
  runtimeCore_cjs_prod.watchEffect = watchEffect;
  runtimeCore_cjs_prod.watchPostEffect = watchPostEffect;
  runtimeCore_cjs_prod.watchSyncEffect = watchSyncEffect;
  runtimeCore_cjs_prod.withAsyncContext = withAsyncContext;
  runtimeCore_cjs_prod.withCtx = withCtx;
  runtimeCore_cjs_prod.withDefaults = withDefaults;
  runtimeCore_cjs_prod.withDirectives = withDirectives;
  runtimeCore_cjs_prod.withMemo = withMemo;
  runtimeCore_cjs_prod.withScopeId = withScopeId;
  return runtimeCore_cjs_prod;
}
var hasRequiredRuntimeDom_cjs_prod;
function requireRuntimeDom_cjs_prod() {
  if (hasRequiredRuntimeDom_cjs_prod) return runtimeDom_cjs_prod;
  hasRequiredRuntimeDom_cjs_prod = 1;
  (function(exports) {
    /**
    * @vue/runtime-dom v3.5.16
    * (c) 2018-present Yuxi (Evan) You and Vue contributors
    * @license MIT
    **/
    Object.defineProperty(exports, "__esModule", { value: true });
    var runtimeCore = /* @__PURE__ */ requireRuntimeCore_cjs_prod();
    var shared = /* @__PURE__ */ requireShared_cjs_prod();
    const unsafeToTrustedHTML = (val) => val;
    const svgNS = "http://www.w3.org/2000/svg";
    const mathmlNS = "http://www.w3.org/1998/Math/MathML";
    const doc = null;
    const templateContainer = doc;
    const nodeOps = {
      insert: (child, parent, anchor) => {
        parent.insertBefore(child, anchor || null);
      },
      remove: (child) => {
        const parent = child.parentNode;
        if (parent) {
          parent.removeChild(child);
        }
      },
      createElement: (tag, namespace, is, props) => {
        const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
        if (tag === "select" && props && props.multiple != null) {
          el.setAttribute("multiple", props.multiple);
        }
        return el;
      },
      createText: (text) => doc.createTextNode(text),
      createComment: (text) => doc.createComment(text),
      setText: (node, text) => {
        node.nodeValue = text;
      },
      setElementText: (el, text) => {
        el.textContent = text;
      },
      parentNode: (node) => node.parentNode,
      nextSibling: (node) => node.nextSibling,
      querySelector: (selector) => doc.querySelector(selector),
      setScopeId(el, id) {
        el.setAttribute(id, "");
      },
      // __UNSAFE__
      // Reason: innerHTML.
      // Static content here can only come from compiled templates.
      // As long as the user only uses trusted templates, this is safe.
      insertStaticContent(content, parent, anchor, namespace, start, end) {
        const before = anchor ? anchor.previousSibling : parent.lastChild;
        if (start && (start === end || start.nextSibling)) {
          while (true) {
            parent.insertBefore(start.cloneNode(true), anchor);
            if (start === end || !(start = start.nextSibling)) break;
          }
        } else {
          templateContainer.innerHTML = unsafeToTrustedHTML(
            namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
          );
          const template = templateContainer.content;
          if (namespace === "svg" || namespace === "mathml") {
            const wrapper = template.firstChild;
            while (wrapper.firstChild) {
              template.appendChild(wrapper.firstChild);
            }
            template.removeChild(wrapper);
          }
          parent.insertBefore(template, anchor);
        }
        return [
          // first
          before ? before.nextSibling : parent.firstChild,
          // last
          anchor ? anchor.previousSibling : parent.lastChild
        ];
      }
    };
    const TRANSITION = "transition";
    const ANIMATION = "animation";
    const vtcKey = Symbol("_vtc");
    const DOMTransitionPropsValidators = {
      name: String,
      type: String,
      css: {
        type: Boolean,
        default: true
      },
      duration: [String, Number, Object],
      enterFromClass: String,
      enterActiveClass: String,
      enterToClass: String,
      appearFromClass: String,
      appearActiveClass: String,
      appearToClass: String,
      leaveFromClass: String,
      leaveActiveClass: String,
      leaveToClass: String
    };
    const TransitionPropsValidators = /* @__PURE__ */ shared.extend(
      {},
      runtimeCore.BaseTransitionPropsValidators,
      DOMTransitionPropsValidators
    );
    const decorate$1 = (t) => {
      t.displayName = "Transition";
      t.props = TransitionPropsValidators;
      return t;
    };
    const Transition = /* @__PURE__ */ decorate$1(
      (props, { slots }) => runtimeCore.h(runtimeCore.BaseTransition, resolveTransitionProps(props), slots)
    );
    const callHook = (hook, args = []) => {
      if (shared.isArray(hook)) {
        hook.forEach((h2) => h2(...args));
      } else if (hook) {
        hook(...args);
      }
    };
    const hasExplicitCallback = (hook) => {
      return hook ? shared.isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
    };
    function resolveTransitionProps(rawProps) {
      const baseProps = {};
      for (const key in rawProps) {
        if (!(key in DOMTransitionPropsValidators)) {
          baseProps[key] = rawProps[key];
        }
      }
      if (rawProps.css === false) {
        return baseProps;
      }
      const {
        name = "v",
        type,
        duration,
        enterFromClass = `${name}-enter-from`,
        enterActiveClass = `${name}-enter-active`,
        enterToClass = `${name}-enter-to`,
        appearFromClass = enterFromClass,
        appearActiveClass = enterActiveClass,
        appearToClass = enterToClass,
        leaveFromClass = `${name}-leave-from`,
        leaveActiveClass = `${name}-leave-active`,
        leaveToClass = `${name}-leave-to`
      } = rawProps;
      const durations = normalizeDuration(duration);
      const enterDuration = durations && durations[0];
      const leaveDuration = durations && durations[1];
      const {
        onBeforeEnter,
        onEnter,
        onEnterCancelled,
        onLeave,
        onLeaveCancelled,
        onBeforeAppear = onBeforeEnter,
        onAppear = onEnter,
        onAppearCancelled = onEnterCancelled
      } = baseProps;
      const finishEnter = (el, isAppear, done, isCancelled) => {
        el._enterCancelled = isCancelled;
        removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
        removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
        done && done();
      };
      const finishLeave = (el, done) => {
        el._isLeaving = false;
        removeTransitionClass(el, leaveFromClass);
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
        done && done();
      };
      const makeEnterHook = (isAppear) => {
        return (el, done) => {
          const hook = isAppear ? onAppear : onEnter;
          const resolve = () => finishEnter(el, isAppear, done);
          callHook(hook, [el, resolve]);
          nextFrame(() => {
            removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
            addTransitionClass(el, isAppear ? appearToClass : enterToClass);
            if (!hasExplicitCallback(hook)) {
              whenTransitionEnds(el, type, enterDuration, resolve);
            }
          });
        };
      };
      return shared.extend(baseProps, {
        onBeforeEnter(el) {
          callHook(onBeforeEnter, [el]);
          addTransitionClass(el, enterFromClass);
          addTransitionClass(el, enterActiveClass);
        },
        onBeforeAppear(el) {
          callHook(onBeforeAppear, [el]);
          addTransitionClass(el, appearFromClass);
          addTransitionClass(el, appearActiveClass);
        },
        onEnter: makeEnterHook(false),
        onAppear: makeEnterHook(true),
        onLeave(el, done) {
          el._isLeaving = true;
          const resolve = () => finishLeave(el, done);
          addTransitionClass(el, leaveFromClass);
          if (!el._enterCancelled) {
            forceReflow();
            addTransitionClass(el, leaveActiveClass);
          } else {
            addTransitionClass(el, leaveActiveClass);
            forceReflow();
          }
          nextFrame(() => {
            if (!el._isLeaving) {
              return;
            }
            removeTransitionClass(el, leaveFromClass);
            addTransitionClass(el, leaveToClass);
            if (!hasExplicitCallback(onLeave)) {
              whenTransitionEnds(el, type, leaveDuration, resolve);
            }
          });
          callHook(onLeave, [el, resolve]);
        },
        onEnterCancelled(el) {
          finishEnter(el, false, void 0, true);
          callHook(onEnterCancelled, [el]);
        },
        onAppearCancelled(el) {
          finishEnter(el, true, void 0, true);
          callHook(onAppearCancelled, [el]);
        },
        onLeaveCancelled(el) {
          finishLeave(el);
          callHook(onLeaveCancelled, [el]);
        }
      });
    }
    function normalizeDuration(duration) {
      if (duration == null) {
        return null;
      } else if (shared.isObject(duration)) {
        return [NumberOf(duration.enter), NumberOf(duration.leave)];
      } else {
        const n = NumberOf(duration);
        return [n, n];
      }
    }
    function NumberOf(val) {
      const res = shared.toNumber(val);
      return res;
    }
    function addTransitionClass(el, cls) {
      cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
      (el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
    }
    function removeTransitionClass(el, cls) {
      cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
      const _vtc = el[vtcKey];
      if (_vtc) {
        _vtc.delete(cls);
        if (!_vtc.size) {
          el[vtcKey] = void 0;
        }
      }
    }
    function nextFrame(cb) {
      requestAnimationFrame(() => {
        requestAnimationFrame(cb);
      });
    }
    let endId = 0;
    function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
      const id = el._endId = ++endId;
      const resolveIfNotStale = () => {
        if (id === el._endId) {
          resolve();
        }
      };
      if (explicitTimeout != null) {
        return setTimeout(resolveIfNotStale, explicitTimeout);
      }
      const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
      if (!type) {
        return resolve();
      }
      const endEvent = type + "end";
      let ended = 0;
      const end = () => {
        el.removeEventListener(endEvent, onEnd);
        resolveIfNotStale();
      };
      const onEnd = (e) => {
        if (e.target === el && ++ended >= propCount) {
          end();
        }
      };
      setTimeout(() => {
        if (ended < propCount) {
          end();
        }
      }, timeout + 1);
      el.addEventListener(endEvent, onEnd);
    }
    function getTransitionInfo(el, expectedType) {
      const styles = (void 0).getComputedStyle(el);
      const getStyleProperties = (key) => (styles[key] || "").split(", ");
      const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
      const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
      const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
      const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
      const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
      const animationTimeout = getTimeout(animationDelays, animationDurations);
      let type = null;
      let timeout = 0;
      let propCount = 0;
      if (expectedType === TRANSITION) {
        if (transitionTimeout > 0) {
          type = TRANSITION;
          timeout = transitionTimeout;
          propCount = transitionDurations.length;
        }
      } else if (expectedType === ANIMATION) {
        if (animationTimeout > 0) {
          type = ANIMATION;
          timeout = animationTimeout;
          propCount = animationDurations.length;
        }
      } else {
        timeout = Math.max(transitionTimeout, animationTimeout);
        type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
        propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
      }
      const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(
        getStyleProperties(`${TRANSITION}Property`).toString()
      );
      return {
        type,
        timeout,
        propCount,
        hasTransform
      };
    }
    function getTimeout(delays, durations) {
      while (delays.length < durations.length) {
        delays = delays.concat(delays);
      }
      return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
    }
    function toMs(s) {
      if (s === "auto") return 0;
      return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
    }
    function forceReflow() {
      return (void 0).body.offsetHeight;
    }
    function patchClass(el, value, isSVG) {
      const transitionClasses = el[vtcKey];
      if (transitionClasses) {
        value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
      }
      if (value == null) {
        el.removeAttribute("class");
      } else if (isSVG) {
        el.setAttribute("class", value);
      } else {
        el.className = value;
      }
    }
    const vShowOriginalDisplay = Symbol("_vod");
    const vShowHidden = Symbol("_vsh");
    const vShow = {
      beforeMount(el, { value }, { transition }) {
        el[vShowOriginalDisplay] = el.style.display === "none" ? "" : el.style.display;
        if (transition && value) {
          transition.beforeEnter(el);
        } else {
          setDisplay(el, value);
        }
      },
      mounted(el, { value }, { transition }) {
        if (transition && value) {
          transition.enter(el);
        }
      },
      updated(el, { value, oldValue }, { transition }) {
        if (!value === !oldValue) return;
        if (transition) {
          if (value) {
            transition.beforeEnter(el);
            setDisplay(el, true);
            transition.enter(el);
          } else {
            transition.leave(el, () => {
              setDisplay(el, false);
            });
          }
        } else {
          setDisplay(el, value);
        }
      },
      beforeUnmount(el, { value }) {
        setDisplay(el, value);
      }
    };
    function setDisplay(el, value) {
      el.style.display = value ? el[vShowOriginalDisplay] : "none";
      el[vShowHidden] = !value;
    }
    function initVShowForSSR() {
      vShow.getSSRProps = ({ value }) => {
        if (!value) {
          return { style: { display: "none" } };
        }
      };
    }
    const CSS_VAR_TEXT = Symbol("");
    function useCssVars(getter) {
      return;
    }
    const displayRE = /(^|;)\s*display\s*:/;
    function patchStyle(el, prev, next) {
      const style = el.style;
      const isCssString = shared.isString(next);
      let hasControlledDisplay = false;
      if (next && !isCssString) {
        if (prev) {
          if (!shared.isString(prev)) {
            for (const key in prev) {
              if (next[key] == null) {
                setStyle(style, key, "");
              }
            }
          } else {
            for (const prevStyle of prev.split(";")) {
              const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
              if (next[key] == null) {
                setStyle(style, key, "");
              }
            }
          }
        }
        for (const key in next) {
          if (key === "display") {
            hasControlledDisplay = true;
          }
          setStyle(style, key, next[key]);
        }
      } else {
        if (isCssString) {
          if (prev !== next) {
            const cssVarText = style[CSS_VAR_TEXT];
            if (cssVarText) {
              next += ";" + cssVarText;
            }
            style.cssText = next;
            hasControlledDisplay = displayRE.test(next);
          }
        } else if (prev) {
          el.removeAttribute("style");
        }
      }
      if (vShowOriginalDisplay in el) {
        el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
        if (el[vShowHidden]) {
          style.display = "none";
        }
      }
    }
    const importantRE = /\s*!important$/;
    function setStyle(style, name, val) {
      if (shared.isArray(val)) {
        val.forEach((v) => setStyle(style, name, v));
      } else {
        if (val == null) val = "";
        if (name.startsWith("--")) {
          style.setProperty(name, val);
        } else {
          const prefixed = autoPrefix(style, name);
          if (importantRE.test(val)) {
            style.setProperty(
              shared.hyphenate(prefixed),
              val.replace(importantRE, ""),
              "important"
            );
          } else {
            style[prefixed] = val;
          }
        }
      }
    }
    const prefixes = ["Webkit", "Moz", "ms"];
    const prefixCache = {};
    function autoPrefix(style, rawName) {
      const cached = prefixCache[rawName];
      if (cached) {
        return cached;
      }
      let name = runtimeCore.camelize(rawName);
      if (name !== "filter" && name in style) {
        return prefixCache[rawName] = name;
      }
      name = shared.capitalize(name);
      for (let i = 0; i < prefixes.length; i++) {
        const prefixed = prefixes[i] + name;
        if (prefixed in style) {
          return prefixCache[rawName] = prefixed;
        }
      }
      return rawName;
    }
    const xlinkNS = "http://www.w3.org/1999/xlink";
    function patchAttr(el, key, value, isSVG, instance, isBoolean = shared.isSpecialBooleanAttr(key)) {
      if (isSVG && key.startsWith("xlink:")) {
        if (value == null) {
          el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
        } else {
          el.setAttributeNS(xlinkNS, key, value);
        }
      } else {
        if (value == null || isBoolean && !shared.includeBooleanAttr(value)) {
          el.removeAttribute(key);
        } else {
          el.setAttribute(
            key,
            isBoolean ? "" : shared.isSymbol(value) ? String(value) : value
          );
        }
      }
    }
    function patchDOMProp(el, key, value, parentComponent, attrName) {
      if (key === "innerHTML" || key === "textContent") {
        if (value != null) {
          el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
        }
        return;
      }
      const tag = el.tagName;
      if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
      !tag.includes("-")) {
        const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
        const newValue = value == null ? (
          // #11647: value should be set as empty string for null and undefined,
          // but <input type="checkbox"> should be set as 'on'.
          el.type === "checkbox" ? "on" : ""
        ) : String(value);
        if (oldValue !== newValue || !("_value" in el)) {
          el.value = newValue;
        }
        if (value == null) {
          el.removeAttribute(key);
        }
        el._value = value;
        return;
      }
      let needRemove = false;
      if (value === "" || value == null) {
        const type = typeof el[key];
        if (type === "boolean") {
          value = shared.includeBooleanAttr(value);
        } else if (value == null && type === "string") {
          value = "";
          needRemove = true;
        } else if (type === "number") {
          value = 0;
          needRemove = true;
        }
      }
      try {
        el[key] = value;
      } catch (e) {
      }
      needRemove && el.removeAttribute(attrName || key);
    }
    function addEventListener(el, event, handler, options) {
      el.addEventListener(event, handler, options);
    }
    function removeEventListener(el, event, handler, options) {
      el.removeEventListener(event, handler, options);
    }
    const veiKey = Symbol("_vei");
    function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
      const invokers = el[veiKey] || (el[veiKey] = {});
      const existingInvoker = invokers[rawName];
      if (nextValue && existingInvoker) {
        existingInvoker.value = nextValue;
      } else {
        const [name, options] = parseName(rawName);
        if (nextValue) {
          const invoker = invokers[rawName] = createInvoker(
            nextValue,
            instance
          );
          addEventListener(el, name, invoker, options);
        } else if (existingInvoker) {
          removeEventListener(el, name, existingInvoker, options);
          invokers[rawName] = void 0;
        }
      }
    }
    const optionsModifierRE = /(?:Once|Passive|Capture)$/;
    function parseName(name) {
      let options;
      if (optionsModifierRE.test(name)) {
        options = {};
        let m;
        while (m = name.match(optionsModifierRE)) {
          name = name.slice(0, name.length - m[0].length);
          options[m[0].toLowerCase()] = true;
        }
      }
      const event = name[2] === ":" ? name.slice(3) : shared.hyphenate(name.slice(2));
      return [event, options];
    }
    let cachedNow = 0;
    const p = /* @__PURE__ */ Promise.resolve();
    const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
    function createInvoker(initialValue, instance) {
      const invoker = (e) => {
        if (!e._vts) {
          e._vts = Date.now();
        } else if (e._vts <= invoker.attached) {
          return;
        }
        runtimeCore.callWithAsyncErrorHandling(
          patchStopImmediatePropagation(e, invoker.value),
          instance,
          5,
          [e]
        );
      };
      invoker.value = initialValue;
      invoker.attached = getNow();
      return invoker;
    }
    function patchStopImmediatePropagation(e, value) {
      if (shared.isArray(value)) {
        const originalStop = e.stopImmediatePropagation;
        e.stopImmediatePropagation = () => {
          originalStop.call(e);
          e._stopped = true;
        };
        return value.map(
          (fn) => (e2) => !e2._stopped && fn && fn(e2)
        );
      } else {
        return value;
      }
    }
    const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
    key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
    const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
      const isSVG = namespace === "svg";
      if (key === "class") {
        patchClass(el, nextValue, isSVG);
      } else if (key === "style") {
        patchStyle(el, prevValue, nextValue);
      } else if (shared.isOn(key)) {
        if (!shared.isModelListener(key)) {
          patchEvent(el, key, prevValue, nextValue, parentComponent);
        }
      } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
        patchDOMProp(el, key, nextValue);
        if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
          patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
        }
      } else if (
        // #11081 force set props for possible async custom element
        el._isVueCE && (/[A-Z]/.test(key) || !shared.isString(nextValue))
      ) {
        patchDOMProp(el, shared.camelize(key), nextValue, parentComponent, key);
      } else {
        if (key === "true-value") {
          el._trueValue = nextValue;
        } else if (key === "false-value") {
          el._falseValue = nextValue;
        }
        patchAttr(el, key, nextValue, isSVG);
      }
    };
    function shouldSetAsProp(el, key, value, isSVG) {
      if (isSVG) {
        if (key === "innerHTML" || key === "textContent") {
          return true;
        }
        if (key in el && isNativeOn(key) && shared.isFunction(value)) {
          return true;
        }
        return false;
      }
      if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
        return false;
      }
      if (key === "form") {
        return false;
      }
      if (key === "list" && el.tagName === "INPUT") {
        return false;
      }
      if (key === "type" && el.tagName === "TEXTAREA") {
        return false;
      }
      if (key === "width" || key === "height") {
        const tag = el.tagName;
        if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
          return false;
        }
      }
      if (isNativeOn(key) && shared.isString(value)) {
        return false;
      }
      return key in el;
    }
    const REMOVAL = {};
    /*! #__NO_SIDE_EFFECTS__ */
    // @__NO_SIDE_EFFECTS__
    function defineCustomElement(options, extraOptions, _createApp) {
      const Comp = runtimeCore.defineComponent(options, extraOptions);
      if (shared.isPlainObject(Comp)) shared.extend(Comp, extraOptions);
      class VueCustomElement extends VueElement {
        constructor(initialProps) {
          super(Comp, initialProps, _createApp);
        }
      }
      VueCustomElement.def = Comp;
      return VueCustomElement;
    }
    /*! #__NO_SIDE_EFFECTS__ */
    const defineSSRCustomElement = /* @__NO_SIDE_EFFECTS__ */ (options, extraOptions) => {
      return /* @__PURE__ */ defineCustomElement(options, extraOptions, createSSRApp);
    };
    const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {
    };
    class VueElement extends BaseClass {
      constructor(_def, _props = {}, _createApp = createApp) {
        super();
        this._def = _def;
        this._props = _props;
        this._createApp = _createApp;
        this._isVueCE = true;
        this._instance = null;
        this._app = null;
        this._nonce = this._def.nonce;
        this._connected = false;
        this._resolved = false;
        this._numberProps = null;
        this._styleChildren = /* @__PURE__ */ new WeakSet();
        this._ob = null;
        if (this.shadowRoot && _createApp !== createApp) {
          this._root = this.shadowRoot;
        } else {
          if (_def.shadowRoot !== false) {
            this.attachShadow({ mode: "open" });
            this._root = this.shadowRoot;
          } else {
            this._root = this;
          }
        }
      }
      connectedCallback() {
        if (!this.isConnected) return;
        if (!this.shadowRoot && !this._resolved) {
          this._parseSlots();
        }
        this._connected = true;
        let parent = this;
        while (parent = parent && (parent.parentNode || parent.host)) {
          if (parent instanceof VueElement) {
            this._parent = parent;
            break;
          }
        }
        if (!this._instance) {
          if (this._resolved) {
            this._mount(this._def);
          } else {
            if (parent && parent._pendingResolve) {
              this._pendingResolve = parent._pendingResolve.then(() => {
                this._pendingResolve = void 0;
                this._resolveDef();
              });
            } else {
              this._resolveDef();
            }
          }
        }
      }
      _setParent(parent = this._parent) {
        if (parent) {
          this._instance.parent = parent._instance;
          this._inheritParentContext(parent);
        }
      }
      _inheritParentContext(parent = this._parent) {
        if (parent && this._app) {
          Object.setPrototypeOf(
            this._app._context.provides,
            parent._instance.provides
          );
        }
      }
      disconnectedCallback() {
        this._connected = false;
        runtimeCore.nextTick(() => {
          if (!this._connected) {
            if (this._ob) {
              this._ob.disconnect();
              this._ob = null;
            }
            this._app && this._app.unmount();
            if (this._instance) this._instance.ce = void 0;
            this._app = this._instance = null;
          }
        });
      }
      /**
       * resolve inner component definition (handle possible async component)
       */
      _resolveDef() {
        if (this._pendingResolve) {
          return;
        }
        for (let i = 0; i < this.attributes.length; i++) {
          this._setAttr(this.attributes[i].name);
        }
        this._ob = new MutationObserver((mutations) => {
          for (const m of mutations) {
            this._setAttr(m.attributeName);
          }
        });
        this._ob.observe(this, { attributes: true });
        const resolve = (def, isAsync = false) => {
          this._resolved = true;
          this._pendingResolve = void 0;
          const { props, styles } = def;
          let numberProps;
          if (props && !shared.isArray(props)) {
            for (const key in props) {
              const opt = props[key];
              if (opt === Number || opt && opt.type === Number) {
                if (key in this._props) {
                  this._props[key] = shared.toNumber(this._props[key]);
                }
                (numberProps || (numberProps = /* @__PURE__ */ Object.create(null)))[shared.camelize(key)] = true;
              }
            }
          }
          this._numberProps = numberProps;
          this._resolveProps(def);
          if (this.shadowRoot) {
            this._applyStyles(styles);
          }
          this._mount(def);
        };
        const asyncDef = this._def.__asyncLoader;
        if (asyncDef) {
          this._pendingResolve = asyncDef().then(
            (def) => resolve(this._def = def, true)
          );
        } else {
          resolve(this._def);
        }
      }
      _mount(def) {
        this._app = this._createApp(def);
        this._inheritParentContext();
        if (def.configureApp) {
          def.configureApp(this._app);
        }
        this._app._ceVNode = this._createVNode();
        this._app.mount(this._root);
        const exposed = this._instance && this._instance.exposed;
        if (!exposed) return;
        for (const key in exposed) {
          if (!shared.hasOwn(this, key)) {
            Object.defineProperty(this, key, {
              // unwrap ref to be consistent with public instance behavior
              get: () => runtimeCore.unref(exposed[key])
            });
          }
        }
      }
      _resolveProps(def) {
        const { props } = def;
        const declaredPropKeys = shared.isArray(props) ? props : Object.keys(props || {});
        for (const key of Object.keys(this)) {
          if (key[0] !== "_" && declaredPropKeys.includes(key)) {
            this._setProp(key, this[key]);
          }
        }
        for (const key of declaredPropKeys.map(shared.camelize)) {
          Object.defineProperty(this, key, {
            get() {
              return this._getProp(key);
            },
            set(val) {
              this._setProp(key, val, true, true);
            }
          });
        }
      }
      _setAttr(key) {
        if (key.startsWith("data-v-")) return;
        const has = this.hasAttribute(key);
        let value = has ? this.getAttribute(key) : REMOVAL;
        const camelKey = shared.camelize(key);
        if (has && this._numberProps && this._numberProps[camelKey]) {
          value = shared.toNumber(value);
        }
        this._setProp(camelKey, value, false, true);
      }
      /**
       * @internal
       */
      _getProp(key) {
        return this._props[key];
      }
      /**
       * @internal
       */
      _setProp(key, val, shouldReflect = true, shouldUpdate = false) {
        if (val !== this._props[key]) {
          if (val === REMOVAL) {
            delete this._props[key];
          } else {
            this._props[key] = val;
            if (key === "key" && this._app) {
              this._app._ceVNode.key = val;
            }
          }
          if (shouldUpdate && this._instance) {
            this._update();
          }
          if (shouldReflect) {
            const ob = this._ob;
            ob && ob.disconnect();
            if (val === true) {
              this.setAttribute(shared.hyphenate(key), "");
            } else if (typeof val === "string" || typeof val === "number") {
              this.setAttribute(shared.hyphenate(key), val + "");
            } else if (!val) {
              this.removeAttribute(shared.hyphenate(key));
            }
            ob && ob.observe(this, { attributes: true });
          }
        }
      }
      _update() {
        const vnode = this._createVNode();
        if (this._app) vnode.appContext = this._app._context;
        render(vnode, this._root);
      }
      _createVNode() {
        const baseProps = {};
        if (!this.shadowRoot) {
          baseProps.onVnodeMounted = baseProps.onVnodeUpdated = this._renderSlots.bind(this);
        }
        const vnode = runtimeCore.createVNode(this._def, shared.extend(baseProps, this._props));
        if (!this._instance) {
          vnode.ce = (instance) => {
            this._instance = instance;
            instance.ce = this;
            instance.isCE = true;
            const dispatch = (event, args) => {
              this.dispatchEvent(
                new CustomEvent(
                  event,
                  shared.isPlainObject(args[0]) ? shared.extend({ detail: args }, args[0]) : { detail: args }
                )
              );
            };
            instance.emit = (event, ...args) => {
              dispatch(event, args);
              if (shared.hyphenate(event) !== event) {
                dispatch(shared.hyphenate(event), args);
              }
            };
            this._setParent();
          };
        }
        return vnode;
      }
      _applyStyles(styles, owner) {
        if (!styles) return;
        if (owner) {
          if (owner === this._def || this._styleChildren.has(owner)) {
            return;
          }
          this._styleChildren.add(owner);
        }
        const nonce = this._nonce;
        for (let i = styles.length - 1; i >= 0; i--) {
          const s = (void 0).createElement("style");
          if (nonce) s.setAttribute("nonce", nonce);
          s.textContent = styles[i];
          this.shadowRoot.prepend(s);
        }
      }
      /**
       * Only called when shadowRoot is false
       */
      _parseSlots() {
        const slots = this._slots = {};
        let n;
        while (n = this.firstChild) {
          const slotName = n.nodeType === 1 && n.getAttribute("slot") || "default";
          (slots[slotName] || (slots[slotName] = [])).push(n);
          this.removeChild(n);
        }
      }
      /**
       * Only called when shadowRoot is false
       */
      _renderSlots() {
        const outlets = (this._teleportTarget || this).querySelectorAll("slot");
        const scopeId = this._instance.type.__scopeId;
        for (let i = 0; i < outlets.length; i++) {
          const o = outlets[i];
          const slotName = o.getAttribute("name") || "default";
          const content = this._slots[slotName];
          const parent = o.parentNode;
          if (content) {
            for (const n of content) {
              if (scopeId && n.nodeType === 1) {
                const id = scopeId + "-s";
                const walker = (void 0).createTreeWalker(n, 1);
                n.setAttribute(id, "");
                let child;
                while (child = walker.nextNode()) {
                  child.setAttribute(id, "");
                }
              }
              parent.insertBefore(n, o);
            }
          } else {
            while (o.firstChild) parent.insertBefore(o.firstChild, o);
          }
          parent.removeChild(o);
        }
      }
      /**
       * @internal
       */
      _injectChildStyle(comp) {
        this._applyStyles(comp.styles, comp);
      }
      /**
       * @internal
       */
      _removeChildStyle(comp) {
      }
    }
    function useHost(caller) {
      const instance = runtimeCore.getCurrentInstance();
      const el = instance && instance.ce;
      if (el) {
        return el;
      }
      return null;
    }
    function useShadowRoot() {
      const el = useHost();
      return el && el.shadowRoot;
    }
    function useCssModule(name = "$style") {
      {
        const instance = runtimeCore.getCurrentInstance();
        if (!instance) {
          return shared.EMPTY_OBJ;
        }
        const modules = instance.type.__cssModules;
        if (!modules) {
          return shared.EMPTY_OBJ;
        }
        const mod = modules[name];
        if (!mod) {
          return shared.EMPTY_OBJ;
        }
        return mod;
      }
    }
    const positionMap = /* @__PURE__ */ new WeakMap();
    const newPositionMap = /* @__PURE__ */ new WeakMap();
    const moveCbKey = Symbol("_moveCb");
    const enterCbKey = Symbol("_enterCb");
    const decorate = (t) => {
      delete t.props.mode;
      return t;
    };
    const TransitionGroupImpl = /* @__PURE__ */ decorate({
      name: "TransitionGroup",
      props: /* @__PURE__ */ shared.extend({}, TransitionPropsValidators, {
        tag: String,
        moveClass: String
      }),
      setup(props, { slots }) {
        const instance = runtimeCore.getCurrentInstance();
        const state = runtimeCore.useTransitionState();
        let prevChildren;
        let children;
        runtimeCore.onUpdated(() => {
          if (!prevChildren.length) {
            return;
          }
          const moveClass = props.moveClass || `${props.name || "v"}-move`;
          if (!hasCSSTransform(
            prevChildren[0].el,
            instance.vnode.el,
            moveClass
          )) {
            prevChildren = [];
            return;
          }
          prevChildren.forEach(callPendingCbs);
          prevChildren.forEach(recordPosition);
          const movedChildren = prevChildren.filter(applyTranslation);
          forceReflow();
          movedChildren.forEach((c) => {
            const el = c.el;
            const style = el.style;
            addTransitionClass(el, moveClass);
            style.transform = style.webkitTransform = style.transitionDuration = "";
            const cb = el[moveCbKey] = (e) => {
              if (e && e.target !== el) {
                return;
              }
              if (!e || /transform$/.test(e.propertyName)) {
                el.removeEventListener("transitionend", cb);
                el[moveCbKey] = null;
                removeTransitionClass(el, moveClass);
              }
            };
            el.addEventListener("transitionend", cb);
          });
          prevChildren = [];
        });
        return () => {
          const rawProps = runtimeCore.toRaw(props);
          const cssTransitionProps = resolveTransitionProps(rawProps);
          let tag = rawProps.tag || runtimeCore.Fragment;
          prevChildren = [];
          if (children) {
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (child.el && child.el instanceof Element) {
                prevChildren.push(child);
                runtimeCore.setTransitionHooks(
                  child,
                  runtimeCore.resolveTransitionHooks(
                    child,
                    cssTransitionProps,
                    state,
                    instance
                  )
                );
                positionMap.set(
                  child,
                  child.el.getBoundingClientRect()
                );
              }
            }
          }
          children = slots.default ? runtimeCore.getTransitionRawChildren(slots.default()) : [];
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.key != null) {
              runtimeCore.setTransitionHooks(
                child,
                runtimeCore.resolveTransitionHooks(child, cssTransitionProps, state, instance)
              );
            }
          }
          return runtimeCore.createVNode(tag, null, children);
        };
      }
    });
    const TransitionGroup = TransitionGroupImpl;
    function callPendingCbs(c) {
      const el = c.el;
      if (el[moveCbKey]) {
        el[moveCbKey]();
      }
      if (el[enterCbKey]) {
        el[enterCbKey]();
      }
    }
    function recordPosition(c) {
      newPositionMap.set(c, c.el.getBoundingClientRect());
    }
    function applyTranslation(c) {
      const oldPos = positionMap.get(c);
      const newPos = newPositionMap.get(c);
      const dx = oldPos.left - newPos.left;
      const dy = oldPos.top - newPos.top;
      if (dx || dy) {
        const s = c.el.style;
        s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
        s.transitionDuration = "0s";
        return c;
      }
    }
    function hasCSSTransform(el, root, moveClass) {
      const clone = el.cloneNode();
      const _vtc = el[vtcKey];
      if (_vtc) {
        _vtc.forEach((cls) => {
          cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
        });
      }
      moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
      clone.style.display = "none";
      const container = root.nodeType === 1 ? root : root.parentNode;
      container.appendChild(clone);
      const { hasTransform } = getTransitionInfo(clone);
      container.removeChild(clone);
      return hasTransform;
    }
    const getModelAssigner = (vnode) => {
      const fn = vnode.props["onUpdate:modelValue"] || false;
      return shared.isArray(fn) ? (value) => shared.invokeArrayFns(fn, value) : fn;
    };
    function onCompositionStart(e) {
      e.target.composing = true;
    }
    function onCompositionEnd(e) {
      const target = e.target;
      if (target.composing) {
        target.composing = false;
        target.dispatchEvent(new Event("input"));
      }
    }
    const assignKey = Symbol("_assign");
    const vModelText = {
      created(el, { modifiers: { lazy, trim, number } }, vnode) {
        el[assignKey] = getModelAssigner(vnode);
        const castToNumber = number || vnode.props && vnode.props.type === "number";
        addEventListener(el, lazy ? "change" : "input", (e) => {
          if (e.target.composing) return;
          let domValue = el.value;
          if (trim) {
            domValue = domValue.trim();
          }
          if (castToNumber) {
            domValue = shared.looseToNumber(domValue);
          }
          el[assignKey](domValue);
        });
        if (trim) {
          addEventListener(el, "change", () => {
            el.value = el.value.trim();
          });
        }
        if (!lazy) {
          addEventListener(el, "compositionstart", onCompositionStart);
          addEventListener(el, "compositionend", onCompositionEnd);
          addEventListener(el, "change", onCompositionEnd);
        }
      },
      // set value on mounted so it's after min/max for type="range"
      mounted(el, { value }) {
        el.value = value == null ? "" : value;
      },
      beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
        el[assignKey] = getModelAssigner(vnode);
        if (el.composing) return;
        const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? shared.looseToNumber(el.value) : el.value;
        const newValue = value == null ? "" : value;
        if (elValue === newValue) {
          return;
        }
        if ((void 0).activeElement === el && el.type !== "range") {
          if (lazy && value === oldValue) {
            return;
          }
          if (trim && el.value.trim() === newValue) {
            return;
          }
        }
        el.value = newValue;
      }
    };
    const vModelCheckbox = {
      // #4096 array checkboxes need to be deep traversed
      deep: true,
      created(el, _, vnode) {
        el[assignKey] = getModelAssigner(vnode);
        addEventListener(el, "change", () => {
          const modelValue = el._modelValue;
          const elementValue = getValue(el);
          const checked = el.checked;
          const assign2 = el[assignKey];
          if (shared.isArray(modelValue)) {
            const index = shared.looseIndexOf(modelValue, elementValue);
            const found = index !== -1;
            if (checked && !found) {
              assign2(modelValue.concat(elementValue));
            } else if (!checked && found) {
              const filtered = [...modelValue];
              filtered.splice(index, 1);
              assign2(filtered);
            }
          } else if (shared.isSet(modelValue)) {
            const cloned = new Set(modelValue);
            if (checked) {
              cloned.add(elementValue);
            } else {
              cloned.delete(elementValue);
            }
            assign2(cloned);
          } else {
            assign2(getCheckboxValue(el, checked));
          }
        });
      },
      // set initial checked on mount to wait for true-value/false-value
      mounted: setChecked,
      beforeUpdate(el, binding, vnode) {
        el[assignKey] = getModelAssigner(vnode);
        setChecked(el, binding, vnode);
      }
    };
    function setChecked(el, { value, oldValue }, vnode) {
      el._modelValue = value;
      let checked;
      if (shared.isArray(value)) {
        checked = shared.looseIndexOf(value, vnode.props.value) > -1;
      } else if (shared.isSet(value)) {
        checked = value.has(vnode.props.value);
      } else {
        if (value === oldValue) return;
        checked = shared.looseEqual(value, getCheckboxValue(el, true));
      }
      if (el.checked !== checked) {
        el.checked = checked;
      }
    }
    const vModelRadio = {
      created(el, { value }, vnode) {
        el.checked = shared.looseEqual(value, vnode.props.value);
        el[assignKey] = getModelAssigner(vnode);
        addEventListener(el, "change", () => {
          el[assignKey](getValue(el));
        });
      },
      beforeUpdate(el, { value, oldValue }, vnode) {
        el[assignKey] = getModelAssigner(vnode);
        if (value !== oldValue) {
          el.checked = shared.looseEqual(value, vnode.props.value);
        }
      }
    };
    const vModelSelect = {
      // <select multiple> value need to be deep traversed
      deep: true,
      created(el, { value, modifiers: { number } }, vnode) {
        const isSetModel = shared.isSet(value);
        addEventListener(el, "change", () => {
          const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map(
            (o) => number ? shared.looseToNumber(getValue(o)) : getValue(o)
          );
          el[assignKey](
            el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
          );
          el._assigning = true;
          runtimeCore.nextTick(() => {
            el._assigning = false;
          });
        });
        el[assignKey] = getModelAssigner(vnode);
      },
      // set value in mounted & updated because <select> relies on its children
      // <option>s.
      mounted(el, { value }) {
        setSelected(el, value);
      },
      beforeUpdate(el, _binding, vnode) {
        el[assignKey] = getModelAssigner(vnode);
      },
      updated(el, { value }) {
        if (!el._assigning) {
          setSelected(el, value);
        }
      }
    };
    function setSelected(el, value) {
      const isMultiple = el.multiple;
      const isArrayValue = shared.isArray(value);
      if (isMultiple && !isArrayValue && !shared.isSet(value)) {
        return;
      }
      for (let i = 0, l = el.options.length; i < l; i++) {
        const option = el.options[i];
        const optionValue = getValue(option);
        if (isMultiple) {
          if (isArrayValue) {
            const optionType = typeof optionValue;
            if (optionType === "string" || optionType === "number") {
              option.selected = value.some((v) => String(v) === String(optionValue));
            } else {
              option.selected = shared.looseIndexOf(value, optionValue) > -1;
            }
          } else {
            option.selected = value.has(optionValue);
          }
        } else if (shared.looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) el.selectedIndex = i;
          return;
        }
      }
      if (!isMultiple && el.selectedIndex !== -1) {
        el.selectedIndex = -1;
      }
    }
    function getValue(el) {
      return "_value" in el ? el._value : el.value;
    }
    function getCheckboxValue(el, checked) {
      const key = checked ? "_trueValue" : "_falseValue";
      return key in el ? el[key] : checked;
    }
    const vModelDynamic = {
      created(el, binding, vnode) {
        callModelHook(el, binding, vnode, null, "created");
      },
      mounted(el, binding, vnode) {
        callModelHook(el, binding, vnode, null, "mounted");
      },
      beforeUpdate(el, binding, vnode, prevVNode) {
        callModelHook(el, binding, vnode, prevVNode, "beforeUpdate");
      },
      updated(el, binding, vnode, prevVNode) {
        callModelHook(el, binding, vnode, prevVNode, "updated");
      }
    };
    function resolveDynamicModel(tagName, type) {
      switch (tagName) {
        case "SELECT":
          return vModelSelect;
        case "TEXTAREA":
          return vModelText;
        default:
          switch (type) {
            case "checkbox":
              return vModelCheckbox;
            case "radio":
              return vModelRadio;
            default:
              return vModelText;
          }
      }
    }
    function callModelHook(el, binding, vnode, prevVNode, hook) {
      const modelToUse = resolveDynamicModel(
        el.tagName,
        vnode.props && vnode.props.type
      );
      const fn = modelToUse[hook];
      fn && fn(el, binding, vnode, prevVNode);
    }
    function initVModelForSSR() {
      vModelText.getSSRProps = ({ value }) => ({ value });
      vModelRadio.getSSRProps = ({ value }, vnode) => {
        if (vnode.props && shared.looseEqual(vnode.props.value, value)) {
          return { checked: true };
        }
      };
      vModelCheckbox.getSSRProps = ({ value }, vnode) => {
        if (shared.isArray(value)) {
          if (vnode.props && shared.looseIndexOf(value, vnode.props.value) > -1) {
            return { checked: true };
          }
        } else if (shared.isSet(value)) {
          if (vnode.props && value.has(vnode.props.value)) {
            return { checked: true };
          }
        } else if (value) {
          return { checked: true };
        }
      };
      vModelDynamic.getSSRProps = (binding, vnode) => {
        if (typeof vnode.type !== "string") {
          return;
        }
        const modelToUse = resolveDynamicModel(
          // resolveDynamicModel expects an uppercase tag name, but vnode.type is lowercase
          vnode.type.toUpperCase(),
          vnode.props && vnode.props.type
        );
        if (modelToUse.getSSRProps) {
          return modelToUse.getSSRProps(binding, vnode);
        }
      };
    }
    const systemModifiers = ["ctrl", "shift", "alt", "meta"];
    const modifierGuards = {
      stop: (e) => e.stopPropagation(),
      prevent: (e) => e.preventDefault(),
      self: (e) => e.target !== e.currentTarget,
      ctrl: (e) => !e.ctrlKey,
      shift: (e) => !e.shiftKey,
      alt: (e) => !e.altKey,
      meta: (e) => !e.metaKey,
      left: (e) => "button" in e && e.button !== 0,
      middle: (e) => "button" in e && e.button !== 1,
      right: (e) => "button" in e && e.button !== 2,
      exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
    };
    const withModifiers = (fn, modifiers) => {
      const cache = fn._withMods || (fn._withMods = {});
      const cacheKey = modifiers.join(".");
      return cache[cacheKey] || (cache[cacheKey] = (event, ...args) => {
        for (let i = 0; i < modifiers.length; i++) {
          const guard = modifierGuards[modifiers[i]];
          if (guard && guard(event, modifiers)) return;
        }
        return fn(event, ...args);
      });
    };
    const keyNames = {
      esc: "escape",
      space: " ",
      up: "arrow-up",
      left: "arrow-left",
      right: "arrow-right",
      down: "arrow-down",
      delete: "backspace"
    };
    const withKeys = (fn, modifiers) => {
      const cache = fn._withKeys || (fn._withKeys = {});
      const cacheKey = modifiers.join(".");
      return cache[cacheKey] || (cache[cacheKey] = (event) => {
        if (!("key" in event)) {
          return;
        }
        const eventKey = shared.hyphenate(event.key);
        if (modifiers.some(
          (k) => k === eventKey || keyNames[k] === eventKey
        )) {
          return fn(event);
        }
      });
    };
    const rendererOptions = /* @__PURE__ */ shared.extend({ patchProp }, nodeOps);
    let renderer;
    let enabledHydration = false;
    function ensureRenderer() {
      return renderer || (renderer = runtimeCore.createRenderer(rendererOptions));
    }
    function ensureHydrationRenderer() {
      renderer = enabledHydration ? renderer : runtimeCore.createHydrationRenderer(rendererOptions);
      enabledHydration = true;
      return renderer;
    }
    const render = (...args) => {
      ensureRenderer().render(...args);
    };
    const hydrate = (...args) => {
      ensureHydrationRenderer().hydrate(...args);
    };
    const createApp = (...args) => {
      const app = ensureRenderer().createApp(...args);
      const { mount } = app;
      app.mount = (containerOrSelector) => {
        const container = normalizeContainer(containerOrSelector);
        if (!container) return;
        const component = app._component;
        if (!shared.isFunction(component) && !component.render && !component.template) {
          component.template = container.innerHTML;
        }
        if (container.nodeType === 1) {
          container.textContent = "";
        }
        const proxy = mount(container, false, resolveRootNamespace(container));
        if (container instanceof Element) {
          container.removeAttribute("v-cloak");
          container.setAttribute("data-v-app", "");
        }
        return proxy;
      };
      return app;
    };
    const createSSRApp = (...args) => {
      const app = ensureHydrationRenderer().createApp(...args);
      const { mount } = app;
      app.mount = (containerOrSelector) => {
        const container = normalizeContainer(containerOrSelector);
        if (container) {
          return mount(container, true, resolveRootNamespace(container));
        }
      };
      return app;
    };
    function resolveRootNamespace(container) {
      if (container instanceof SVGElement) {
        return "svg";
      }
      if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
        return "mathml";
      }
    }
    function normalizeContainer(container) {
      if (shared.isString(container)) {
        const res = (void 0).querySelector(container);
        return res;
      }
      return container;
    }
    let ssrDirectiveInitialized = false;
    const initDirectivesForSSR = () => {
      if (!ssrDirectiveInitialized) {
        ssrDirectiveInitialized = true;
        initVModelForSSR();
        initVShowForSSR();
      }
    };
    exports.Transition = Transition;
    exports.TransitionGroup = TransitionGroup;
    exports.VueElement = VueElement;
    exports.createApp = createApp;
    exports.createSSRApp = createSSRApp;
    exports.defineCustomElement = defineCustomElement;
    exports.defineSSRCustomElement = defineSSRCustomElement;
    exports.hydrate = hydrate;
    exports.initDirectivesForSSR = initDirectivesForSSR;
    exports.render = render;
    exports.useCssModule = useCssModule;
    exports.useCssVars = useCssVars;
    exports.useHost = useHost;
    exports.useShadowRoot = useShadowRoot;
    exports.vModelCheckbox = vModelCheckbox;
    exports.vModelDynamic = vModelDynamic;
    exports.vModelRadio = vModelRadio;
    exports.vModelSelect = vModelSelect;
    exports.vModelText = vModelText;
    exports.vShow = vShow;
    exports.withKeys = withKeys;
    exports.withModifiers = withModifiers;
    Object.keys(runtimeCore).forEach(function(k) {
      if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) exports[k] = runtimeCore[k];
    });
  })(runtimeDom_cjs_prod);
  return runtimeDom_cjs_prod;
}
var hasRequiredVue_cjs_prod;
function requireVue_cjs_prod() {
  if (hasRequiredVue_cjs_prod) return vue_cjs_prod;
  hasRequiredVue_cjs_prod = 1;
  (function(exports) {
    /**
    * vue v3.5.16
    * (c) 2018-present Yuxi (Evan) You and Vue contributors
    * @license MIT
    **/
    Object.defineProperty(exports, "__esModule", { value: true });
    var compilerDom = /* @__PURE__ */ requireCompilerDom_cjs_prod();
    var runtimeDom = /* @__PURE__ */ requireRuntimeDom_cjs_prod();
    var shared = /* @__PURE__ */ requireShared_cjs_prod();
    function _interopNamespaceDefault(e) {
      var n = /* @__PURE__ */ Object.create(null);
      if (e) {
        for (var k in e) {
          n[k] = e[k];
        }
      }
      n.default = e;
      return Object.freeze(n);
    }
    var runtimeDom__namespace = /* @__PURE__ */ _interopNamespaceDefault(runtimeDom);
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
        const el = (void 0).querySelector(template);
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
    Object.keys(runtimeDom).forEach(function(k) {
      if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) exports[k] = runtimeDom[k];
    });
  })(vue_cjs_prod);
  return vue_cjs_prod;
}
var hasRequiredVue;
function requireVue() {
  if (hasRequiredVue) return vue.exports;
  hasRequiredVue = 1;
  {
    vue.exports = requireVue_cjs_prod();
  }
  return vue.exports;
}
var vueExports = requireVue();
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
    _scope: vueExports.effectScope(),
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
    payload: vueExports.shallowReactive({
      ...((_a = options.ssrContext) == null ? void 0 : _a.payload) || {},
      data: vueExports.shallowReactive({}),
      state: vueExports.reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: vueExports.shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !vueExports.getCurrentScope()) {
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
    _asyncData: vueExports.shallowReactive({}),
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
    const { provide } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide && typeof provide === "object") {
      for (const key in provide) {
        nuxtApp.provide(key, provide[key]);
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
  if (vueExports.hasInjectionContext()) {
    nuxtAppInstance = (_a = vueExports.getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
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
  if (vueExports.hasInjectionContext()) {
    return vueExports.inject(PageRouteSymbol, useNuxtApp()._route);
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
const useError = () => vueExports.toRef(useNuxtApp().payload, "error");
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
  const router = vueExports.inject(routerKey);
  const currentRoute = vueExports.inject(routeLocationKey);
  const route = vueExports.computed(() => {
    const to = vueExports.unref(props.to);
    return router.resolve(to);
  });
  const activeRecordIndex = vueExports.computed(() => {
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
  const isActive = vueExports.computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = vueExports.computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      const p = router[vueExports.unref(props.replace) ? "replace" : "push"](
        vueExports.unref(props.to)
        // avoid uncaught errors are they are logged anyway
      ).catch(noop);
      if (props.viewTransition && false) ;
      return p;
    }
    return Promise.resolve();
  }
  return {
    route,
    href: vueExports.computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
function preferSingleVNode(vnodes) {
  return vnodes.length === 1 ? vnodes[0] : vnodes;
}
const RouterLinkImpl = /* @__PURE__ */ vueExports.defineComponent({
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
    const link = vueExports.reactive(useLink(props));
    const { options } = vueExports.inject(routerKey);
    const elClass = vueExports.computed(() => ({
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
      return props.custom ? children : vueExports.h("a", {
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
const RouterViewImpl = /* @__PURE__ */ vueExports.defineComponent({
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
    const injectedRoute = vueExports.inject(routerViewLocationKey);
    const routeToDisplay = vueExports.computed(() => props.route || injectedRoute.value);
    const injectedDepth = vueExports.inject(viewDepthKey, 0);
    const depth = vueExports.computed(() => {
      let initialDepth = vueExports.unref(injectedDepth);
      const { matched } = routeToDisplay.value;
      let matchedRoute;
      while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
        initialDepth++;
      }
      return initialDepth;
    });
    const matchedRouteRef = vueExports.computed(() => routeToDisplay.value.matched[depth.value]);
    vueExports.provide(viewDepthKey, vueExports.computed(() => depth.value + 1));
    vueExports.provide(matchedRouteKey, matchedRouteRef);
    vueExports.provide(routerViewLocationKey, routeToDisplay);
    const viewRef = vueExports.ref();
    vueExports.watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
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
      const component = vueExports.h(ViewComponent, assign({}, routeProps, attrs, {
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
  const currentRoute = vueExports.shallowRef(START_LOCATION_NORMALIZED);
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
        get: () => vueExports.unref(currentRoute)
      });
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        Object.defineProperty(reactiveRoute, key, {
          get: () => currentRoute.value[key],
          enumerable: true
        });
      }
      app.provide(routerKey, router2);
      app.provide(routeLocationKey, vueExports.shallowReactive(reactiveRoute));
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
  return vueExports.inject(routeLocationKey);
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const _routes = [
  {
    name: "index",
    path: "/",
    component: () => import('./index-3gYi0LLn.mjs')
  },
  {
    name: "auth-login",
    path: "/auth/login",
    component: () => import('./login--rob6rXh.mjs')
  },
  {
    name: "chat-groups",
    path: "/chat/groups",
    component: () => import('./groups-CyuVHcl0.mjs'),
    children: [
      {
        name: "chat-groups-id",
        path: ":id()",
        component: () => import('./_id_-BEiV-2ey.mjs')
      }
    ]
  },
  {
    name: "chat-friends",
    path: "/chat/friends",
    component: () => import('./friends-r6fR8X8y.mjs')
  },
  {
    name: "auth-register",
    path: "/auth/register",
    component: () => import('./register-Cz_gJZLX.mjs')
  },
  {
    name: "chat-messages",
    path: "/chat/messages",
    meta: { "middleware": ["auth"] },
    component: () => import('./messages-Dvh2q1Bk.mjs'),
    children: [
      {
        name: "chat-messages-id",
        path: ":id()",
        component: () => import('./_id_-CMeCtZAv.mjs')
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
  auth: () => import('./auth-DWFPniUs.mjs')
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
    const previousRoute = vueExports.shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = vueExports.shallowRef(router.currentRoute.value);
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
    nuxtApp._route = vueExports.shallowReactive(route);
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
      to.meta = vueExports.reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !vueExports.isReadonly(to.meta.layout)) {
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
  ["EmptyShallowRef", (data) => vueExports.isRef(data) && vueExports.isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => vueExports.isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => vueExports.isRef(data) && vueExports.isShallow(data) && data.value],
  ["ShallowReactive", (data) => vueExports.isReactive(data) && vueExports.isShallow(data) && vueExports.toRaw(data)],
  ["Ref", (data) => vueExports.isRef(data) && data.value],
  ["Reactive", (data) => vueExports.isReactive(data) && vueExports.toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
vueExports.defineComponent({
  name: "ServerPlaceholder",
  render() {
    return vueExports.createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
vueExports.defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(props, { slots, attrs }) {
    const mounted = vueExports.shallowRef(false);
    const vm = vueExports.getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    vueExports.provide(clientOnlySymbol, true);
    return () => {
      var _a;
      if (mounted.value) {
        const vnodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
        if (vnodes && vnodes.length === 1) {
          return [vueExports.cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return vueExports.h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return vueExports.createElementBlock(fallbackTag, attrs, fallbackStr);
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
    const hasTarget = vueExports.computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = vueExports.computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = vueExports.resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = vueExports.computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = vueExports.computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, props.trailingSlash);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink == null ? void 0 : useBuiltinLink({ ...props, to });
    const href = vueExports.computed(() => {
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
      isActive: (link == null ? void 0 : link.isActive) ?? vueExports.computed(() => to.value === router.currentRoute.value.path),
      isExactActive: (link == null ? void 0 : link.isExactActive) ?? vueExports.computed(() => to.value === router.currentRoute.value.path),
      route: (link == null ? void 0 : link.route) ?? vueExports.computed(() => router.resolve(to.value)),
      async navigate(_e) {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return vueExports.defineComponent({
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
      vueExports.shallowRef(false);
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
          return vueExports.h(
            vueExports.resolveComponent("RouterLink"),
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
        return vueExports.h("a", { ref: el, href: href.value || null, rel, target }, (_a = slots.default) == null ? void 0 : _a.call(slots));
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
      nuxtApp.payload.pinia = vueExports.toRaw(pinia.state.value);
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
  const user = vueExports.ref(null);
  const isAuthenticated = vueExports.computed(() => !!user.value);
  const token = vueExports.ref(null);
  const proxyUrl = "/api/proxy";
  const isConnecting = vueExports.ref(false);
  const connectionError = vueExports.ref(null);
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
vueExports.reactive({});
vueExports.reactive({});
vueExports.reactive({ items: [] });
vueExports.reactive({ useHandler: void 0 });
vueExports.reactive({});
vueExports.reactive({});
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
var serverRenderer_cjs_prod = {};
var compilerSsr_cjs = {};
/**
* @vue/compiler-ssr v3.5.16
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var hasRequiredCompilerSsr_cjs;
function requireCompilerSsr_cjs() {
  if (hasRequiredCompilerSsr_cjs) return compilerSsr_cjs;
  hasRequiredCompilerSsr_cjs = 1;
  Object.defineProperty(compilerSsr_cjs, "__esModule", { value: true });
  var compilerDom = /* @__PURE__ */ requireCompilerDom_cjs_prod();
  var shared = /* @__PURE__ */ requireShared_cjs_prod();
  const SSR_INTERPOLATE = Symbol(`ssrInterpolate`);
  const SSR_RENDER_VNODE = Symbol(`ssrRenderVNode`);
  const SSR_RENDER_COMPONENT = Symbol(`ssrRenderComponent`);
  const SSR_RENDER_SLOT = Symbol(`ssrRenderSlot`);
  const SSR_RENDER_SLOT_INNER = Symbol(`ssrRenderSlotInner`);
  const SSR_RENDER_CLASS = Symbol(`ssrRenderClass`);
  const SSR_RENDER_STYLE = Symbol(`ssrRenderStyle`);
  const SSR_RENDER_ATTRS = Symbol(`ssrRenderAttrs`);
  const SSR_RENDER_ATTR = Symbol(`ssrRenderAttr`);
  const SSR_RENDER_DYNAMIC_ATTR = Symbol(`ssrRenderDynamicAttr`);
  const SSR_RENDER_LIST = Symbol(`ssrRenderList`);
  const SSR_INCLUDE_BOOLEAN_ATTR = Symbol(
    `ssrIncludeBooleanAttr`
  );
  const SSR_LOOSE_EQUAL = Symbol(`ssrLooseEqual`);
  const SSR_LOOSE_CONTAIN = Symbol(`ssrLooseContain`);
  const SSR_RENDER_DYNAMIC_MODEL = Symbol(
    `ssrRenderDynamicModel`
  );
  const SSR_GET_DYNAMIC_MODEL_PROPS = Symbol(
    `ssrGetDynamicModelProps`
  );
  const SSR_RENDER_TELEPORT = Symbol(`ssrRenderTeleport`);
  const SSR_RENDER_SUSPENSE = Symbol(`ssrRenderSuspense`);
  const SSR_GET_DIRECTIVE_PROPS = Symbol(`ssrGetDirectiveProps`);
  const ssrHelpers = {
    [SSR_INTERPOLATE]: `ssrInterpolate`,
    [SSR_RENDER_VNODE]: `ssrRenderVNode`,
    [SSR_RENDER_COMPONENT]: `ssrRenderComponent`,
    [SSR_RENDER_SLOT]: `ssrRenderSlot`,
    [SSR_RENDER_SLOT_INNER]: `ssrRenderSlotInner`,
    [SSR_RENDER_CLASS]: `ssrRenderClass`,
    [SSR_RENDER_STYLE]: `ssrRenderStyle`,
    [SSR_RENDER_ATTRS]: `ssrRenderAttrs`,
    [SSR_RENDER_ATTR]: `ssrRenderAttr`,
    [SSR_RENDER_DYNAMIC_ATTR]: `ssrRenderDynamicAttr`,
    [SSR_RENDER_LIST]: `ssrRenderList`,
    [SSR_INCLUDE_BOOLEAN_ATTR]: `ssrIncludeBooleanAttr`,
    [SSR_LOOSE_EQUAL]: `ssrLooseEqual`,
    [SSR_LOOSE_CONTAIN]: `ssrLooseContain`,
    [SSR_RENDER_DYNAMIC_MODEL]: `ssrRenderDynamicModel`,
    [SSR_GET_DYNAMIC_MODEL_PROPS]: `ssrGetDynamicModelProps`,
    [SSR_RENDER_TELEPORT]: `ssrRenderTeleport`,
    [SSR_RENDER_SUSPENSE]: `ssrRenderSuspense`,
    [SSR_GET_DIRECTIVE_PROPS]: `ssrGetDirectiveProps`
  };
  compilerDom.registerRuntimeHelpers(ssrHelpers);
  const ssrTransformIf = compilerDom.createStructuralDirectiveTransform(
    /^(if|else|else-if)$/,
    compilerDom.processIf
  );
  function ssrProcessIf(node, context, disableNestedFragments = false, disableComment = false) {
    const [rootBranch] = node.branches;
    const ifStatement = compilerDom.createIfStatement(
      rootBranch.condition,
      processIfBranch(rootBranch, context, disableNestedFragments)
    );
    context.pushStatement(ifStatement);
    let currentIf = ifStatement;
    for (let i = 1; i < node.branches.length; i++) {
      const branch = node.branches[i];
      const branchBlockStatement = processIfBranch(
        branch,
        context,
        disableNestedFragments
      );
      if (branch.condition) {
        currentIf = currentIf.alternate = compilerDom.createIfStatement(
          branch.condition,
          branchBlockStatement
        );
      } else {
        currentIf.alternate = branchBlockStatement;
      }
    }
    if (!currentIf.alternate && !disableComment) {
      currentIf.alternate = compilerDom.createBlockStatement([
        compilerDom.createCallExpression(`_push`, ["`<!---->`"])
      ]);
    }
  }
  function processIfBranch(branch, context, disableNestedFragments = false) {
    const { children } = branch;
    const needFragmentWrapper = !disableNestedFragments && (children.length !== 1 || children[0].type !== 1) && // optimize away nested fragments when the only child is a ForNode
    !(children.length === 1 && children[0].type === 11);
    return processChildrenAsStatement(branch, context, needFragmentWrapper);
  }
  const ssrTransformFor = compilerDom.createStructuralDirectiveTransform("for", compilerDom.processFor);
  function ssrProcessFor(node, context, disableNestedFragments = false) {
    const needFragmentWrapper = !disableNestedFragments && (node.children.length !== 1 || node.children[0].type !== 1);
    const renderLoop = compilerDom.createFunctionExpression(
      compilerDom.createForLoopParams(node.parseResult)
    );
    renderLoop.body = processChildrenAsStatement(
      node,
      context,
      needFragmentWrapper
    );
    if (!disableNestedFragments) {
      context.pushStringPart(`<!--[-->`);
    }
    context.pushStatement(
      compilerDom.createCallExpression(context.helper(SSR_RENDER_LIST), [
        node.source,
        renderLoop
      ])
    );
    if (!disableNestedFragments) {
      context.pushStringPart(`<!--]-->`);
    }
  }
  const ssrTransformSlotOutlet = (node, context) => {
    if (compilerDom.isSlotOutlet(node)) {
      const { slotName, slotProps } = compilerDom.processSlotOutlet(node, context);
      const args = [
        `_ctx.$slots`,
        slotName,
        slotProps || `{}`,
        // fallback content placeholder. will be replaced in the process phase
        `null`,
        `_push`,
        `_parent`
      ];
      if (context.scopeId && context.slotted !== false) {
        args.push(`"${context.scopeId}-s"`);
      }
      let method = SSR_RENDER_SLOT;
      let parent = context.parent;
      if (parent) {
        const children = parent.children;
        if (parent.type === 10) {
          parent = context.grandParent;
        }
        let componentType;
        if (parent.type === 1 && parent.tagType === 1 && ((componentType = compilerDom.resolveComponentType(parent, context, true)) === compilerDom.TRANSITION || componentType === compilerDom.TRANSITION_GROUP) && children.filter((c) => c.type === 1).length === 1) {
          method = SSR_RENDER_SLOT_INNER;
          if (!(context.scopeId && context.slotted !== false)) {
            args.push("null");
          }
          args.push("true");
        }
      }
      node.ssrCodegenNode = compilerDom.createCallExpression(context.helper(method), args);
    }
  };
  function ssrProcessSlotOutlet(node, context) {
    const renderCall = node.ssrCodegenNode;
    if (node.children.length) {
      const fallbackRenderFn = compilerDom.createFunctionExpression([]);
      fallbackRenderFn.body = processChildrenAsStatement(node, context);
      renderCall.arguments[3] = fallbackRenderFn;
    }
    if (context.withSlotScopeId) {
      const slotScopeId = renderCall.arguments[6];
      renderCall.arguments[6] = slotScopeId ? `${slotScopeId} + _scopeId` : `_scopeId`;
    }
    context.pushStatement(node.ssrCodegenNode);
  }
  function createSSRCompilerError(code, loc) {
    return compilerDom.createCompilerError(code, loc, SSRErrorMessages);
  }
  const SSRErrorMessages = {
    [65]: `Unsafe attribute name for SSR.`,
    [66]: `Missing the 'to' prop on teleport element.`,
    [67]: `Invalid AST node during SSR transform.`
  };
  function ssrProcessTeleport(node, context) {
    const targetProp = compilerDom.findProp(node, "to");
    if (!targetProp) {
      context.onError(
        createSSRCompilerError(66, node.loc)
      );
      return;
    }
    let target;
    if (targetProp.type === 6) {
      target = targetProp.value && compilerDom.createSimpleExpression(targetProp.value.content, true);
    } else {
      target = targetProp.exp;
    }
    if (!target) {
      context.onError(
        createSSRCompilerError(
          66,
          targetProp.loc
        )
      );
      return;
    }
    const disabledProp = compilerDom.findProp(
      node,
      "disabled",
      false,
      true
      /* allow empty */
    );
    const disabled = disabledProp ? disabledProp.type === 6 ? `true` : disabledProp.exp || `false` : `false`;
    const contentRenderFn = compilerDom.createFunctionExpression(
      [`_push`],
      void 0,
      // Body is added later
      true,
      // newline
      false,
      // isSlot
      node.loc
    );
    contentRenderFn.body = processChildrenAsStatement(node, context);
    context.pushStatement(
      compilerDom.createCallExpression(context.helper(SSR_RENDER_TELEPORT), [
        `_push`,
        contentRenderFn,
        target,
        disabled,
        `_parent`
      ])
    );
  }
  const wipMap$3 = /* @__PURE__ */ new WeakMap();
  function ssrTransformSuspense(node, context) {
    return () => {
      if (node.children.length) {
        const wipEntry = {
          slotsExp: null,
          // to be immediately set
          wipSlots: []
        };
        wipMap$3.set(node, wipEntry);
        wipEntry.slotsExp = compilerDom.buildSlots(
          node,
          context,
          (_props, _vForExp, children, loc) => {
            const fn = compilerDom.createFunctionExpression(
              [],
              void 0,
              // no return, assign body later
              true,
              // newline
              false,
              // suspense slots are not treated as normal slots
              loc
            );
            wipEntry.wipSlots.push({
              fn,
              children
            });
            return fn;
          }
        ).slots;
      }
    };
  }
  function ssrProcessSuspense(node, context) {
    const wipEntry = wipMap$3.get(node);
    if (!wipEntry) {
      return;
    }
    const { slotsExp, wipSlots } = wipEntry;
    for (let i = 0; i < wipSlots.length; i++) {
      const slot = wipSlots[i];
      slot.fn.body = processChildrenAsStatement(slot, context);
    }
    context.pushStatement(
      compilerDom.createCallExpression(context.helper(SSR_RENDER_SUSPENSE), [
        `_push`,
        slotsExp
      ])
    );
  }
  const rawChildrenMap = /* @__PURE__ */ new WeakMap();
  const ssrTransformElement = (node, context) => {
    if (node.type !== 1 || node.tagType !== 0) {
      return;
    }
    return function ssrPostTransformElement() {
      const openTag = [`<${node.tag}`];
      const needTagForRuntime = node.tag === "textarea" || node.tag.indexOf("-") > 0;
      const hasDynamicVBind = compilerDom.hasDynamicKeyVBind(node);
      const hasCustomDir = node.props.some(
        (p) => p.type === 7 && !shared.isBuiltInDirective(p.name)
      );
      const needMergeProps = hasDynamicVBind || hasCustomDir;
      if (needMergeProps) {
        const { props, directives } = compilerDom.buildProps(
          node,
          context,
          node.props,
          false,
          false,
          true
        );
        if (props || directives.length) {
          const mergedProps = buildSSRProps(props, directives, context);
          const propsExp = compilerDom.createCallExpression(
            context.helper(SSR_RENDER_ATTRS),
            [mergedProps]
          );
          if (node.tag === "textarea") {
            const existingText = node.children[0];
            if (!existingText || existingText.type !== 5) {
              const tempId = `_temp${context.temps++}`;
              propsExp.arguments = [
                compilerDom.createAssignmentExpression(
                  compilerDom.createSimpleExpression(tempId, false),
                  mergedProps
                )
              ];
              rawChildrenMap.set(
                node,
                compilerDom.createCallExpression(context.helper(SSR_INTERPOLATE), [
                  compilerDom.createConditionalExpression(
                    compilerDom.createSimpleExpression(`"value" in ${tempId}`, false),
                    compilerDom.createSimpleExpression(`${tempId}.value`, false),
                    compilerDom.createSimpleExpression(
                      existingText ? existingText.content : ``,
                      true
                    ),
                    false
                  )
                ])
              );
            }
          } else if (node.tag === "input") {
            const vModel = findVModel(node);
            if (vModel) {
              const tempId = `_temp${context.temps++}`;
              const tempExp = compilerDom.createSimpleExpression(tempId, false);
              propsExp.arguments = [
                compilerDom.createSequenceExpression([
                  compilerDom.createAssignmentExpression(tempExp, mergedProps),
                  compilerDom.createCallExpression(context.helper(compilerDom.MERGE_PROPS), [
                    tempExp,
                    compilerDom.createCallExpression(
                      context.helper(SSR_GET_DYNAMIC_MODEL_PROPS),
                      [
                        tempExp,
                        // existing props
                        vModel.exp
                        // model
                      ]
                    )
                  ])
                ])
              ];
            }
          } else if (directives.length && !node.children.length) {
            const vText = compilerDom.findDir(node, "text");
            if (!vText) {
              const tempId = `_temp${context.temps++}`;
              propsExp.arguments = [
                compilerDom.createAssignmentExpression(
                  compilerDom.createSimpleExpression(tempId, false),
                  mergedProps
                )
              ];
              rawChildrenMap.set(
                node,
                compilerDom.createConditionalExpression(
                  compilerDom.createSimpleExpression(`"textContent" in ${tempId}`, false),
                  compilerDom.createCallExpression(context.helper(SSR_INTERPOLATE), [
                    compilerDom.createSimpleExpression(`${tempId}.textContent`, false)
                  ]),
                  compilerDom.createSimpleExpression(`${tempId}.innerHTML ?? ''`, false),
                  false
                )
              );
            }
          }
          if (needTagForRuntime) {
            propsExp.arguments.push(`"${node.tag}"`);
          }
          openTag.push(propsExp);
        }
      }
      let dynamicClassBinding = void 0;
      let staticClassBinding = void 0;
      let dynamicStyleBinding = void 0;
      for (let i = 0; i < node.props.length; i++) {
        const prop = node.props[i];
        if (node.tag === "input" && isTrueFalseValue(prop)) {
          continue;
        }
        if (prop.type === 7) {
          if (prop.name === "html" && prop.exp) {
            rawChildrenMap.set(
              node,
              compilerDom.createCompoundExpression([`(`, prop.exp, `) ?? ''`])
            );
          } else if (prop.name === "text" && prop.exp) {
            node.children = [compilerDom.createInterpolation(prop.exp, prop.loc)];
          } else if (prop.name === "slot") {
            context.onError(
              compilerDom.createCompilerError(40, prop.loc)
            );
          } else if (isTextareaWithValue(node, prop) && prop.exp) {
            if (!needMergeProps) {
              node.children = [compilerDom.createInterpolation(prop.exp, prop.loc)];
            }
          } else if (!needMergeProps && prop.name !== "on") {
            const directiveTransform = context.directiveTransforms[prop.name];
            if (directiveTransform) {
              const { props, ssrTagParts } = directiveTransform(
                prop,
                node,
                context
              );
              if (ssrTagParts) {
                openTag.push(...ssrTagParts);
              }
              for (let j = 0; j < props.length; j++) {
                const { key, value } = props[j];
                if (compilerDom.isStaticExp(key)) {
                  let attrName = key.content;
                  if (attrName === "key" || attrName === "ref") {
                    continue;
                  }
                  if (attrName === "class") {
                    openTag.push(
                      ` class="`,
                      dynamicClassBinding = compilerDom.createCallExpression(
                        context.helper(SSR_RENDER_CLASS),
                        [value]
                      ),
                      `"`
                    );
                  } else if (attrName === "style") {
                    if (dynamicStyleBinding) {
                      mergeCall(dynamicStyleBinding, value);
                    } else {
                      openTag.push(
                        ` style="`,
                        dynamicStyleBinding = compilerDom.createCallExpression(
                          context.helper(SSR_RENDER_STYLE),
                          [value]
                        ),
                        `"`
                      );
                    }
                  } else {
                    attrName = node.tag.indexOf("-") > 0 ? attrName : shared.propsToAttrMap[attrName] || attrName.toLowerCase();
                    if (shared.isBooleanAttr(attrName)) {
                      openTag.push(
                        compilerDom.createConditionalExpression(
                          compilerDom.createCallExpression(
                            context.helper(SSR_INCLUDE_BOOLEAN_ATTR),
                            [value]
                          ),
                          compilerDom.createSimpleExpression(" " + attrName, true),
                          compilerDom.createSimpleExpression("", true),
                          false
                        )
                      );
                    } else if (shared.isSSRSafeAttrName(attrName)) {
                      openTag.push(
                        compilerDom.createCallExpression(context.helper(SSR_RENDER_ATTR), [
                          key,
                          value
                        ])
                      );
                    } else {
                      context.onError(
                        createSSRCompilerError(
                          65,
                          key.loc
                        )
                      );
                    }
                  }
                } else {
                  const args = [key, value];
                  if (needTagForRuntime) {
                    args.push(`"${node.tag}"`);
                  }
                  openTag.push(
                    compilerDom.createCallExpression(
                      context.helper(SSR_RENDER_DYNAMIC_ATTR),
                      args
                    )
                  );
                }
              }
            }
          }
        } else {
          const name = prop.name;
          if (node.tag === "textarea" && name === "value" && prop.value) {
            rawChildrenMap.set(node, shared.escapeHtml(prop.value.content));
          } else if (!needMergeProps) {
            if (name === "key" || name === "ref") {
              continue;
            }
            if (name === "class" && prop.value) {
              staticClassBinding = JSON.stringify(prop.value.content);
            }
            openTag.push(
              ` ${prop.name}` + (prop.value ? `="${shared.escapeHtml(prop.value.content)}"` : ``)
            );
          }
        }
      }
      if (dynamicClassBinding && staticClassBinding) {
        mergeCall(dynamicClassBinding, staticClassBinding);
        removeStaticBinding(openTag, "class");
      }
      if (context.scopeId) {
        openTag.push(` ${context.scopeId}`);
      }
      node.ssrCodegenNode = compilerDom.createTemplateLiteral(openTag);
    };
  };
  function buildSSRProps(props, directives, context) {
    let mergePropsArgs = [];
    if (props) {
      if (props.type === 14) {
        mergePropsArgs = props.arguments;
      } else {
        mergePropsArgs.push(props);
      }
    }
    if (directives.length) {
      for (const dir of directives) {
        mergePropsArgs.push(
          compilerDom.createCallExpression(context.helper(SSR_GET_DIRECTIVE_PROPS), [
            `_ctx`,
            ...compilerDom.buildDirectiveArgs(dir, context).elements
          ])
        );
      }
    }
    return mergePropsArgs.length > 1 ? compilerDom.createCallExpression(context.helper(compilerDom.MERGE_PROPS), mergePropsArgs) : mergePropsArgs[0];
  }
  function isTrueFalseValue(prop) {
    if (prop.type === 7) {
      return prop.name === "bind" && prop.arg && compilerDom.isStaticExp(prop.arg) && (prop.arg.content === "true-value" || prop.arg.content === "false-value");
    } else {
      return prop.name === "true-value" || prop.name === "false-value";
    }
  }
  function isTextareaWithValue(node, prop) {
    return !!(node.tag === "textarea" && prop.name === "bind" && compilerDom.isStaticArgOf(prop.arg, "value"));
  }
  function mergeCall(call, arg) {
    const existing = call.arguments[0];
    if (existing.type === 17) {
      existing.elements.push(arg);
    } else {
      call.arguments[0] = compilerDom.createArrayExpression([existing, arg]);
    }
  }
  function removeStaticBinding(tag, binding) {
    const regExp = new RegExp(`^ ${binding}=".+"$`);
    const i = tag.findIndex((e) => typeof e === "string" && regExp.test(e));
    if (i > -1) {
      tag.splice(i, 1);
    }
  }
  function findVModel(node) {
    return node.props.find(
      (p) => p.type === 7 && p.name === "model" && p.exp
    );
  }
  function ssrProcessElement(node, context) {
    const isVoidTag = context.options.isVoidTag || shared.NO;
    const elementsToAdd = node.ssrCodegenNode.elements;
    for (let j = 0; j < elementsToAdd.length; j++) {
      context.pushStringPart(elementsToAdd[j]);
    }
    if (context.withSlotScopeId) {
      context.pushStringPart(compilerDom.createSimpleExpression(`_scopeId`, false));
    }
    context.pushStringPart(`>`);
    const rawChildren = rawChildrenMap.get(node);
    if (rawChildren) {
      context.pushStringPart(rawChildren);
    } else if (node.children.length) {
      processChildren(node, context);
    }
    if (!isVoidTag(node.tag)) {
      context.pushStringPart(`</${node.tag}>`);
    }
  }
  const wipMap$2 = /* @__PURE__ */ new WeakMap();
  function ssrTransformTransitionGroup(node, context) {
    return () => {
      const tag = compilerDom.findProp(node, "tag");
      if (tag) {
        const otherProps = node.props.filter((p) => p !== tag);
        const { props, directives } = compilerDom.buildProps(
          node,
          context,
          otherProps,
          true,
          false,
          true
        );
        let propsExp = null;
        if (props || directives.length) {
          propsExp = compilerDom.createCallExpression(context.helper(SSR_RENDER_ATTRS), [
            buildSSRProps(props, directives, context)
          ]);
        }
        wipMap$2.set(node, {
          tag,
          propsExp,
          scopeId: context.scopeId || null
        });
      }
    };
  }
  function ssrProcessTransitionGroup(node, context) {
    const entry2 = wipMap$2.get(node);
    if (entry2) {
      const { tag, propsExp, scopeId } = entry2;
      if (tag.type === 7) {
        context.pushStringPart(`<`);
        context.pushStringPart(tag.exp);
        if (propsExp) {
          context.pushStringPart(propsExp);
        }
        if (scopeId) {
          context.pushStringPart(` ${scopeId}`);
        }
        context.pushStringPart(`>`);
        processChildren(
          node,
          context,
          false,
          /**
           * TransitionGroup has the special runtime behavior of flattening and
           * concatenating all children into a single fragment (in order for them to
           * be patched using the same key map) so we need to account for that here
           * by disabling nested fragment wrappers from being generated.
           */
          true,
          /**
           * TransitionGroup filters out comment children at runtime and thus
           * doesn't expect comments to be present during hydration. We need to
           * account for that by disabling the empty comment that is otherwise
           * rendered for a falsy v-if that has no v-else specified. (#6715)
           */
          true
        );
        context.pushStringPart(`</`);
        context.pushStringPart(tag.exp);
        context.pushStringPart(`>`);
      } else {
        context.pushStringPart(`<${tag.value.content}`);
        if (propsExp) {
          context.pushStringPart(propsExp);
        }
        if (scopeId) {
          context.pushStringPart(` ${scopeId}`);
        }
        context.pushStringPart(`>`);
        processChildren(node, context, false, true, true);
        context.pushStringPart(`</${tag.value.content}>`);
      }
    } else {
      processChildren(node, context, true, true, true);
    }
  }
  const wipMap$1 = /* @__PURE__ */ new WeakMap();
  function ssrTransformTransition(node, context) {
    return () => {
      const appear = compilerDom.findProp(node, "appear", false, true);
      wipMap$1.set(node, !!appear);
    };
  }
  function ssrProcessTransition(node, context) {
    node.children = node.children.filter((c) => c.type !== 3);
    const appear = wipMap$1.get(node);
    if (appear) {
      context.pushStringPart(`<template>`);
      processChildren(node, context, false, true);
      context.pushStringPart(`</template>`);
    } else {
      processChildren(node, context, false, true);
    }
  }
  const wipMap = /* @__PURE__ */ new WeakMap();
  const WIP_SLOT = Symbol();
  const componentTypeMap = /* @__PURE__ */ new WeakMap();
  const ssrTransformComponent = (node, context) => {
    if (node.type !== 1 || node.tagType !== 1) {
      return;
    }
    const component = compilerDom.resolveComponentType(
      node,
      context,
      true
      /* ssr */
    );
    const isDynamicComponent = shared.isObject(component) && component.callee === compilerDom.RESOLVE_DYNAMIC_COMPONENT;
    componentTypeMap.set(node, component);
    if (shared.isSymbol(component)) {
      if (component === compilerDom.SUSPENSE) {
        return ssrTransformSuspense(node, context);
      } else if (component === compilerDom.TRANSITION_GROUP) {
        return ssrTransformTransitionGroup(node, context);
      } else if (component === compilerDom.TRANSITION) {
        return ssrTransformTransition(node);
      }
      return;
    }
    const vnodeBranches = [];
    const clonedNode = clone(node);
    return function ssrPostTransformComponent() {
      if (clonedNode.children.length) {
        compilerDom.buildSlots(clonedNode, context, (props, vFor, children) => {
          vnodeBranches.push(
            createVNodeSlotBranch(props, vFor, children, context)
          );
          return compilerDom.createFunctionExpression(void 0);
        });
      }
      let propsExp = `null`;
      if (node.props.length) {
        const { props, directives } = compilerDom.buildProps(
          node,
          context,
          void 0,
          true,
          isDynamicComponent
        );
        if (props || directives.length) {
          propsExp = buildSSRProps(props, directives, context);
        }
      }
      const wipEntries = [];
      wipMap.set(node, wipEntries);
      const buildSSRSlotFn = (props, _vForExp, children, loc) => {
        const param0 = props && compilerDom.stringifyExpression(props) || `_`;
        const fn = compilerDom.createFunctionExpression(
          [param0, `_push`, `_parent`, `_scopeId`],
          void 0,
          // no return, assign body later
          true,
          // newline
          true,
          // isSlot
          loc
        );
        wipEntries.push({
          type: WIP_SLOT,
          fn,
          children,
          // also collect the corresponding vnode branch built earlier
          vnodeBranch: vnodeBranches[wipEntries.length]
        });
        return fn;
      };
      const slots = node.children.length ? compilerDom.buildSlots(node, context, buildSSRSlotFn).slots : `null`;
      if (typeof component !== "string") {
        node.ssrCodegenNode = compilerDom.createCallExpression(
          context.helper(SSR_RENDER_VNODE),
          [
            `_push`,
            compilerDom.createCallExpression(context.helper(compilerDom.CREATE_VNODE), [
              component,
              propsExp,
              slots
            ]),
            `_parent`
          ]
        );
      } else {
        node.ssrCodegenNode = compilerDom.createCallExpression(
          context.helper(SSR_RENDER_COMPONENT),
          [component, propsExp, slots, `_parent`]
        );
      }
    };
  };
  function ssrProcessComponent(node, context, parent) {
    const component = componentTypeMap.get(node);
    if (!node.ssrCodegenNode) {
      if (component === compilerDom.TELEPORT) {
        return ssrProcessTeleport(node, context);
      } else if (component === compilerDom.SUSPENSE) {
        return ssrProcessSuspense(node, context);
      } else if (component === compilerDom.TRANSITION_GROUP) {
        return ssrProcessTransitionGroup(node, context);
      } else {
        if (parent.type === WIP_SLOT) {
          context.pushStringPart(``);
        }
        if (component === compilerDom.TRANSITION) {
          return ssrProcessTransition(node, context);
        }
        processChildren(node, context);
      }
    } else {
      const wipEntries = wipMap.get(node) || [];
      for (let i = 0; i < wipEntries.length; i++) {
        const { fn, vnodeBranch } = wipEntries[i];
        fn.body = compilerDom.createIfStatement(
          compilerDom.createSimpleExpression(`_push`, false),
          processChildrenAsStatement(
            wipEntries[i],
            context,
            false,
            true
          ),
          vnodeBranch
        );
      }
      if (context.withSlotScopeId) {
        node.ssrCodegenNode.arguments.push(`_scopeId`);
      }
      if (typeof component === "string") {
        context.pushStatement(
          compilerDom.createCallExpression(`_push`, [node.ssrCodegenNode])
        );
      } else {
        context.pushStatement(node.ssrCodegenNode);
      }
    }
  }
  const rawOptionsMap = /* @__PURE__ */ new WeakMap();
  const [baseNodeTransforms, baseDirectiveTransforms] = compilerDom.getBaseTransformPreset(true);
  const vnodeNodeTransforms = [...baseNodeTransforms, ...compilerDom.DOMNodeTransforms];
  const vnodeDirectiveTransforms = {
    ...baseDirectiveTransforms,
    ...compilerDom.DOMDirectiveTransforms
  };
  function createVNodeSlotBranch(slotProps, vFor, children, parentContext) {
    const rawOptions = rawOptionsMap.get(parentContext.root);
    const subOptions = {
      ...rawOptions,
      // overwrite with vnode-based transforms
      nodeTransforms: [
        ...vnodeNodeTransforms,
        ...rawOptions.nodeTransforms || []
      ],
      directiveTransforms: {
        ...vnodeDirectiveTransforms,
        ...rawOptions.directiveTransforms || {}
      }
    };
    const wrapperProps = [];
    if (slotProps) {
      wrapperProps.push({
        type: 7,
        name: "slot",
        exp: slotProps,
        arg: void 0,
        modifiers: [],
        loc: compilerDom.locStub
      });
    }
    if (vFor) {
      wrapperProps.push(shared.extend({}, vFor));
    }
    const wrapperNode = {
      type: 1,
      ns: 0,
      tag: "template",
      tagType: 3,
      props: wrapperProps,
      children,
      loc: compilerDom.locStub,
      codegenNode: void 0
    };
    subTransform(wrapperNode, subOptions, parentContext);
    return compilerDom.createReturnStatement(children);
  }
  function subTransform(node, options, parentContext) {
    const childRoot = compilerDom.createRoot([node]);
    const childContext = compilerDom.createTransformContext(childRoot, options);
    childContext.ssr = false;
    childContext.scopes = { ...parentContext.scopes };
    childContext.identifiers = { ...parentContext.identifiers };
    childContext.imports = parentContext.imports;
    compilerDom.traverseNode(childRoot, childContext);
    ["helpers", "components", "directives"].forEach((key) => {
      childContext[key].forEach((value, helperKey) => {
        if (key === "helpers") {
          const parentCount = parentContext.helpers.get(helperKey);
          if (parentCount === void 0) {
            parentContext.helpers.set(helperKey, value);
          } else {
            parentContext.helpers.set(helperKey, value + parentCount);
          }
        } else {
          parentContext[key].add(value);
        }
      });
    });
  }
  function clone(v) {
    if (shared.isArray(v)) {
      return v.map(clone);
    } else if (shared.isPlainObject(v)) {
      const res = {};
      for (const key in v) {
        res[key] = clone(v[key]);
      }
      return res;
    } else {
      return v;
    }
  }
  function ssrCodegenTransform(ast, options) {
    const context = createSSRTransformContext(ast, options);
    if (options.ssrCssVars) {
      const cssContext = compilerDom.createTransformContext(compilerDom.createRoot([]), options);
      const varsExp = compilerDom.processExpression(
        compilerDom.createSimpleExpression(options.ssrCssVars, false),
        cssContext
      );
      context.body.push(
        compilerDom.createCompoundExpression([`const _cssVars = { style: `, varsExp, `}`])
      );
      Array.from(cssContext.helpers.keys()).forEach((helper) => {
        ast.helpers.add(helper);
      });
    }
    const isFragment = ast.children.length > 1 && ast.children.some((c) => !compilerDom.isText(c));
    processChildren(ast, context, isFragment);
    ast.codegenNode = compilerDom.createBlockStatement(context.body);
    ast.ssrHelpers = Array.from(
      /* @__PURE__ */ new Set([
        ...Array.from(ast.helpers).filter((h) => h in ssrHelpers),
        ...context.helpers
      ])
    );
    ast.helpers = new Set(Array.from(ast.helpers).filter((h) => !(h in ssrHelpers)));
  }
  function createSSRTransformContext(root, options, helpers = /* @__PURE__ */ new Set(), withSlotScopeId = false) {
    const body = [];
    let currentString = null;
    return {
      root,
      options,
      body,
      helpers,
      withSlotScopeId,
      onError: options.onError || ((e) => {
        throw e;
      }),
      helper(name) {
        helpers.add(name);
        return name;
      },
      pushStringPart(part) {
        if (!currentString) {
          const currentCall = compilerDom.createCallExpression(`_push`);
          body.push(currentCall);
          currentString = compilerDom.createTemplateLiteral([]);
          currentCall.arguments.push(currentString);
        }
        const bufferedElements = currentString.elements;
        const lastItem = bufferedElements[bufferedElements.length - 1];
        if (shared.isString(part) && shared.isString(lastItem)) {
          bufferedElements[bufferedElements.length - 1] += part;
        } else {
          bufferedElements.push(part);
        }
      },
      pushStatement(statement) {
        currentString = null;
        body.push(statement);
      }
    };
  }
  function createChildContext(parent, withSlotScopeId = parent.withSlotScopeId) {
    return createSSRTransformContext(
      parent.root,
      parent.options,
      parent.helpers,
      withSlotScopeId
    );
  }
  function processChildren(parent, context, asFragment = false, disableNestedFragments = false, disableComment = false) {
    if (asFragment) {
      context.pushStringPart(`<!--[-->`);
    }
    const { children } = parent;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      switch (child.type) {
        case 1:
          switch (child.tagType) {
            case 0:
              ssrProcessElement(child, context);
              break;
            case 1:
              ssrProcessComponent(child, context, parent);
              break;
            case 2:
              ssrProcessSlotOutlet(child, context);
              break;
            case 3:
              break;
            default:
              context.onError(
                createSSRCompilerError(
                  67,
                  child.loc
                )
              );
              const exhaustiveCheck2 = child;
              return exhaustiveCheck2;
          }
          break;
        case 2:
          context.pushStringPart(shared.escapeHtml(child.content));
          break;
        case 3:
          if (!disableComment) {
            context.pushStringPart(`<!--${child.content}-->`);
          }
          break;
        case 5:
          context.pushStringPart(
            compilerDom.createCallExpression(context.helper(SSR_INTERPOLATE), [
              child.content
            ])
          );
          break;
        case 9:
          ssrProcessIf(child, context, disableNestedFragments, disableComment);
          break;
        case 11:
          ssrProcessFor(child, context, disableNestedFragments);
          break;
        case 10:
          break;
        case 12:
        case 8:
          break;
        default:
          context.onError(
            createSSRCompilerError(
              67,
              child.loc
            )
          );
          const exhaustiveCheck = child;
          return exhaustiveCheck;
      }
    }
    if (asFragment) {
      context.pushStringPart(`<!--]-->`);
    }
  }
  function processChildrenAsStatement(parent, parentContext, asFragment = false, withSlotScopeId = parentContext.withSlotScopeId) {
    const childContext = createChildContext(parentContext, withSlotScopeId);
    processChildren(parent, childContext, asFragment);
    return compilerDom.createBlockStatement(childContext.body);
  }
  const ssrTransformModel = (dir, node, context) => {
    const model = dir.exp;
    function checkDuplicatedValue() {
      const value = compilerDom.findProp(node, "value");
      if (value) {
        context.onError(
          compilerDom.createDOMCompilerError(
            60,
            value.loc
          )
        );
      }
    }
    function processOption(plainNode) {
      if (plainNode.tag === "option") {
        if (plainNode.props.findIndex((p) => p.name === "selected") === -1) {
          const value = findValueBinding(plainNode);
          plainNode.ssrCodegenNode.elements.push(
            compilerDom.createConditionalExpression(
              compilerDom.createCallExpression(context.helper(SSR_INCLUDE_BOOLEAN_ATTR), [
                compilerDom.createConditionalExpression(
                  compilerDom.createCallExpression(`Array.isArray`, [model]),
                  compilerDom.createCallExpression(context.helper(SSR_LOOSE_CONTAIN), [
                    model,
                    value
                  ]),
                  compilerDom.createCallExpression(context.helper(SSR_LOOSE_EQUAL), [
                    model,
                    value
                  ])
                )
              ]),
              compilerDom.createSimpleExpression(" selected", true),
              compilerDom.createSimpleExpression("", true),
              false
            )
          );
        }
      } else if (plainNode.tag === "optgroup") {
        plainNode.children.forEach(
          (option) => processOption(option)
        );
      }
    }
    if (node.tagType === 0) {
      const res = { props: [] };
      const defaultProps = [
        // default value binding for text type inputs
        compilerDom.createObjectProperty(`value`, model)
      ];
      if (node.tag === "input") {
        const type = compilerDom.findProp(node, "type");
        if (type) {
          const value = findValueBinding(node);
          if (type.type === 7) {
            res.ssrTagParts = [
              compilerDom.createCallExpression(context.helper(SSR_RENDER_DYNAMIC_MODEL), [
                type.exp,
                model,
                value
              ])
            ];
          } else if (type.value) {
            switch (type.value.content) {
              case "radio":
                res.props = [
                  compilerDom.createObjectProperty(
                    `checked`,
                    compilerDom.createCallExpression(context.helper(SSR_LOOSE_EQUAL), [
                      model,
                      value
                    ])
                  )
                ];
                break;
              case "checkbox":
                const trueValueBinding = compilerDom.findProp(node, "true-value");
                if (trueValueBinding) {
                  const trueValue = trueValueBinding.type === 6 ? JSON.stringify(trueValueBinding.value.content) : trueValueBinding.exp;
                  res.props = [
                    compilerDom.createObjectProperty(
                      `checked`,
                      compilerDom.createCallExpression(context.helper(SSR_LOOSE_EQUAL), [
                        model,
                        trueValue
                      ])
                    )
                  ];
                } else {
                  res.props = [
                    compilerDom.createObjectProperty(
                      `checked`,
                      compilerDom.createConditionalExpression(
                        compilerDom.createCallExpression(`Array.isArray`, [model]),
                        compilerDom.createCallExpression(context.helper(SSR_LOOSE_CONTAIN), [
                          model,
                          value
                        ]),
                        model
                      )
                    )
                  ];
                }
                break;
              case "file":
                context.onError(
                  compilerDom.createDOMCompilerError(
                    59,
                    dir.loc
                  )
                );
                break;
              default:
                checkDuplicatedValue();
                res.props = defaultProps;
                break;
            }
          }
        } else if (compilerDom.hasDynamicKeyVBind(node)) ;
        else {
          checkDuplicatedValue();
          res.props = defaultProps;
        }
      } else if (node.tag === "textarea") {
        checkDuplicatedValue();
        node.children = [compilerDom.createInterpolation(model, model.loc)];
      } else if (node.tag === "select") {
        const processChildren2 = (children) => {
          children.forEach((child) => {
            if (child.type === 1) {
              processOption(child);
            } else if (child.type === 11) {
              processChildren2(child.children);
            } else if (child.type === 9) {
              child.branches.forEach((b) => processChildren2(b.children));
            }
          });
        };
        processChildren2(node.children);
      } else {
        context.onError(
          compilerDom.createDOMCompilerError(
            57,
            dir.loc
          )
        );
      }
      return res;
    } else {
      return compilerDom.transformModel(dir, node, context);
    }
  };
  function findValueBinding(node) {
    const valueBinding = compilerDom.findProp(node, "value");
    return valueBinding ? valueBinding.type === 7 ? valueBinding.exp : compilerDom.createSimpleExpression(valueBinding.value.content, true) : compilerDom.createSimpleExpression(`null`, false);
  }
  const ssrTransformShow = (dir, node, context) => {
    if (!dir.exp) {
      context.onError(
        compilerDom.createDOMCompilerError(61)
      );
    }
    return {
      props: [
        compilerDom.createObjectProperty(
          `style`,
          compilerDom.createConditionalExpression(
            dir.exp,
            compilerDom.createSimpleExpression(`null`, false),
            compilerDom.createObjectExpression([
              compilerDom.createObjectProperty(
                `display`,
                compilerDom.createSimpleExpression(`none`, true)
              )
            ]),
            false
          )
        )
      ]
    };
  };
  const filterChild = (node) => node.children.filter((n) => n.type !== 3);
  const hasSingleChild = (node) => filterChild(node).length === 1;
  const ssrInjectFallthroughAttrs = (node, context) => {
    if (node.type === 0) {
      context.identifiers._attrs = 1;
    }
    if (node.type === 1 && node.tagType === 1 && (node.tag === "transition" || node.tag === "Transition" || node.tag === "KeepAlive" || node.tag === "keep-alive")) {
      const rootChildren = filterChild(context.root);
      if (rootChildren.length === 1 && rootChildren[0] === node) {
        if (hasSingleChild(node)) {
          injectFallthroughAttrs(node.children[0]);
        }
        return;
      }
    }
    const parent = context.parent;
    if (!parent || parent.type !== 0) {
      return;
    }
    if (node.type === 10 && hasSingleChild(node)) {
      let hasEncounteredIf = false;
      for (const c of filterChild(parent)) {
        if (c.type === 9 || c.type === 1 && compilerDom.findDir(c, "if")) {
          if (hasEncounteredIf) return;
          hasEncounteredIf = true;
        } else if (
          // node before v-if
          !hasEncounteredIf || // non else nodes
          !(c.type === 1 && compilerDom.findDir(c, /else/, true))
        ) {
          return;
        }
      }
      injectFallthroughAttrs(node.children[0]);
    } else if (hasSingleChild(parent)) {
      injectFallthroughAttrs(node);
    }
  };
  function injectFallthroughAttrs(node) {
    if (node.type === 1 && (node.tagType === 0 || node.tagType === 1) && !compilerDom.findDir(node, "for")) {
      node.props.push({
        type: 7,
        name: "bind",
        arg: void 0,
        exp: compilerDom.createSimpleExpression(`_attrs`, false),
        modifiers: [],
        loc: compilerDom.locStub
      });
    }
  }
  const ssrInjectCssVars = (node, context) => {
    if (!context.ssrCssVars) {
      return;
    }
    if (node.type === 0) {
      context.identifiers._cssVars = 1;
    }
    const parent = context.parent;
    if (!parent || parent.type !== 0) {
      return;
    }
    if (node.type === 10) {
      for (const child of node.children) {
        injectCssVars(child);
      }
    } else {
      injectCssVars(node);
    }
  };
  function injectCssVars(node) {
    if (node.type === 1 && (node.tagType === 0 || node.tagType === 1) && !compilerDom.findDir(node, "for")) {
      if (node.tag === "suspense" || node.tag === "Suspense") {
        for (const child of node.children) {
          if (child.type === 1 && child.tagType === 3) {
            child.children.forEach(injectCssVars);
          } else {
            injectCssVars(child);
          }
        }
      } else {
        node.props.push({
          type: 7,
          name: "bind",
          arg: void 0,
          exp: compilerDom.createSimpleExpression(`_cssVars`, false),
          modifiers: [],
          loc: compilerDom.locStub
        });
      }
    }
  }
  function compile(source, options = {}) {
    options = {
      ...options,
      ...compilerDom.parserOptions,
      ssr: true,
      inSSR: true,
      scopeId: options.mode === "function" ? null : options.scopeId,
      // always prefix since compiler-ssr doesn't have size concern
      prefixIdentifiers: true,
      // disable optimizations that are unnecessary for ssr
      cacheHandlers: false,
      hoistStatic: false
    };
    const ast = typeof source === "string" ? compilerDom.baseParse(source, options) : source;
    rawOptionsMap.set(ast, options);
    compilerDom.transform(ast, {
      ...options,
      hoistStatic: false,
      nodeTransforms: [
        ssrTransformIf,
        ssrTransformFor,
        compilerDom.trackVForSlotScopes,
        compilerDom.transformExpression,
        ssrTransformSlotOutlet,
        ssrInjectFallthroughAttrs,
        ssrInjectCssVars,
        ssrTransformElement,
        ssrTransformComponent,
        compilerDom.trackSlotScopes,
        compilerDom.transformStyle,
        ...options.nodeTransforms || []
        // user transforms
      ],
      directiveTransforms: {
        // reusing core v-bind
        bind: compilerDom.transformBind,
        on: compilerDom.transformOn,
        // model and show have dedicated SSR handling
        model: ssrTransformModel,
        show: ssrTransformShow,
        // the following are ignored during SSR
        // on: noopDirectiveTransform,
        cloak: compilerDom.noopDirectiveTransform,
        once: compilerDom.noopDirectiveTransform,
        memo: compilerDom.noopDirectiveTransform,
        ...options.directiveTransforms || {}
        // user transforms
      }
    });
    ssrCodegenTransform(ast, options);
    return compilerDom.generate(ast, options);
  }
  compilerSsr_cjs.compile = compile;
  return compilerSsr_cjs;
}
/**
* @vue/server-renderer v3.5.16
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var hasRequiredServerRenderer_cjs_prod;
function requireServerRenderer_cjs_prod() {
  if (hasRequiredServerRenderer_cjs_prod) return serverRenderer_cjs_prod;
  hasRequiredServerRenderer_cjs_prod = 1;
  Object.defineProperty(serverRenderer_cjs_prod, "__esModule", { value: true });
  var Vue = requireVue_cjs_prod();
  var shared = /* @__PURE__ */ requireShared_cjs_prod();
  var compilerSsr = requireCompilerSsr_cjs();
  function _interopNamespaceDefault(e) {
    var n = /* @__PURE__ */ Object.create(null);
    if (e) {
      for (var k in e) {
        n[k] = e[k];
      }
    }
    n.default = e;
    return Object.freeze(n);
  }
  var Vue__namespace = /* @__PURE__ */ _interopNamespaceDefault(Vue);
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
  var helpers = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    ssrGetDirectiveProps,
    ssrGetDynamicModelProps,
    ssrIncludeBooleanAttr: shared.includeBooleanAttr,
    ssrInterpolate,
    ssrLooseContain,
    ssrLooseEqual,
    ssrRenderAttr,
    ssrRenderAttrs,
    ssrRenderClass,
    ssrRenderComponent,
    ssrRenderDynamicAttr,
    ssrRenderDynamicModel,
    ssrRenderList,
    ssrRenderSlot,
    ssrRenderSlotInner,
    ssrRenderStyle,
    ssrRenderSuspense,
    ssrRenderTeleport,
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
    const stream = new node_stream__default.Readable({ read() {
    } });
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
  serverRenderer_cjs_prod.renderToString = renderToString;
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
  return serverRenderer_cjs_prod;
}
var serverRenderer_cjs_prodExports = requireServerRenderer_cjs_prod();
const _sfc_main$6 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Icon",
  __ssrInlineRender: true,
  props: {
    name: {},
    class: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const iconClass = vueExports.computed(() => {
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
      _push(`<i${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: vueExports.unref(iconClass) }, _attrs))}></i>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Icon.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ vueExports.defineComponent({
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
    vueExports.ref(null);
    vueExports.ref(null);
    const previewUrl = vueExports.ref(null);
    const isUploading = vueExports.ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = _sfc_main$6;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm" }, _attrs))}><div class="bg-[#050C1B] border border-blue-500/30 p-4 rounded-lg shadow-lg max-w-md w-full text-white relative"><button class="absolute top-2 right-2 text-gray-400 hover:text-gray-200">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "fa:times",
        size: "18"
      }, null, _parent));
      _push(`</button><div class="text-center mb-4"><h3 class="text-lg font-bold">Change Profile Picture</h3></div><div class="flex flex-col items-center justify-center space-y-4"><div class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "animate-pulse": vueExports.unref(isUploading) }, "w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500 flex items-center justify-center bg-blue-600/30"])}">`);
      if (vueExports.unref(isUploading)) {
        _push(`<div class="h-full w-full flex items-center justify-center bg-black bg-opacity-60"><div class="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent border-blue-400"></div></div>`);
      } else if (vueExports.unref(previewUrl)) {
        _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(previewUrl))} alt="Preview" class="h-full w-full object-cover">`);
      } else if (__props.currentImageUrl) {
        _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", __props.currentImageUrl)} alt="Current Profile Picture" class="h-full w-full object-cover">`);
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:user",
          class: "h-16 w-16 text-blue-400"
        }, null, _parent));
      }
      _push(`</div><div class="w-full">`);
      if (!vueExports.unref(previewUrl) && !vueExports.unref(isUploading)) {
        _push(`<div class="text-center space-y-6"><p class="text-gray-300 text-sm">Choose a new profile picture</p><button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded w-full">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: "fa:upload",
          class: "mr-2"
        }, null, _parent));
        _push(` Select Image </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(previewUrl) && !vueExports.unref(isUploading)) {
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
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProfilePictureModal.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ProfilePopup",
  __ssrInlineRender: true,
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    useRouter();
    const { $toast } = useNuxtApp();
    const authStore = useAuthStore();
    vueExports.ref(false);
    const isLoading = vueExports.ref(true);
    const userProfile = vueExports.ref(null);
    const activeTab = vueExports.ref("profile");
    const isEditing = vueExports.ref(false);
    const isSubmitting = vueExports.ref(false);
    const showCurrentPassword = vueExports.ref(false);
    const showNewPassword = vueExports.ref(false);
    const showConfirmPassword = vueExports.ref(false);
    vueExports.ref(false);
    vueExports.ref(null);
    const formData = vueExports.ref({
      first_name: "",
      last_name: "",
      phone_number: "",
      about_me: ""
    });
    const passwordData = vueExports.ref({
      current_password: "",
      new_password: "",
      confirm_password: ""
    });
    vueExports.computed(() => {
      if (!userProfile.value) return "User";
      if (userProfile.value.name) return userProfile.value.name;
      const firstName = userProfile.value.first_name || "";
      const lastName = userProfile.value.last_name || "";
      if (firstName || lastName) {
        return `${firstName} ${lastName}`.trim();
      }
      return userProfile.value.username || userProfile.value.email || "User";
    });
    const passwordMismatch = vueExports.computed(() => {
      return Boolean(
        passwordData.value.new_password !== passwordData.value.confirm_password && passwordData.value.confirm_password
      );
    });
    const showProfilePictureModal = vueExports.ref(false);
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
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm" }, _attrs))}><div class="bg-[#050C1B] border border-blue-500/30 p-4 rounded-lg shadow-lg w-80 text-white relative"><button class="absolute top-2 right-2 text-gray-400 hover:text-gray-200">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "fa:times",
        size: "18"
      }, null, _parent));
      _push(`</button><div class="text-center mb-3"><h3 class="text-lg font-bold">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(activeTab) === "profile" ? "My Profile" : "Change Password")}</h3></div>`);
      if (vueExports.unref(isLoading)) {
        _push(`<div class="flex flex-col items-center py-6"><div class="animate-pulse flex flex-col items-center w-full"><div class="w-16 h-16 rounded-full bg-blue-600/30 mb-3"></div><div class="h-4 w-32 bg-blue-600/30 rounded mb-2"></div><div class="h-3 w-24 bg-blue-600/30 rounded"></div></div></div>`);
      } else if (vueExports.unref(activeTab) === "profile") {
        _push(`<!--[-->`);
        if (!vueExports.unref(isEditing)) {
          _push(`<div><div class="flex justify-center mb-4"><div class="relative"><div class="h-16 w-16 rounded-full overflow-hidden bg-blue-600/30 border-2 border-blue-500 flex items-center justify-center" title="Profile Picture">`);
          if ((_a = vueExports.unref(userProfile)) == null ? void 0 : _a.profile_picture_url) {
            _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(userProfile).profile_picture_url)} alt="Profile Picture" class="h-full w-full object-cover">`);
          } else {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:user",
              class: "h-8 w-8 text-blue-400"
            }, null, _parent));
          }
          _push(`</div></div></div><div class="space-y-3 px-1"><div class="grid grid-cols-2 gap-2"><div class="space-y-1"><label class="text-sm text-gray-300 block">First Name</label><input type="text"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", ((_b = vueExports.unref(userProfile)) == null ? void 0 : _b.first_name) || "")} readonly class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="First Name"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Last Name</label><input type="text"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", ((_c = vueExports.unref(userProfile)) == null ? void 0 : _c.last_name) || "")} readonly class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Last Name"></div></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Username</label><input type="text"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", ((_d = vueExports.unref(userProfile)) == null ? void 0 : _d.username) || "")} readonly class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Username"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Email</label><input type="email"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", ((_e = vueExports.unref(userProfile)) == null ? void 0 : _e.email) || "")} readonly class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Email"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Phone Number</label><input type="tel"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", ((_f = vueExports.unref(userProfile)) == null ? void 0 : _f.phone_number) || "")} readonly class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Phone Number"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">About Me</label><textarea readonly rows="2" class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 min-h-[60px] resize-none text-sm" placeholder="Write something about yourself...">${serverRenderer_cjs_prodExports.ssrInterpolate(((_g = vueExports.unref(userProfile)) == null ? void 0 : _g.about_me) || "")}</textarea></div><div class="space-y-2 pt-2"><button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1.5 px-4 rounded h-9 w-full text-sm flex items-center justify-center">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:camera",
            class: "mr-2 h-3 w-3"
          }, null, _parent));
          _push(` Change Profile Picture </button><button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded h-9 w-full text-sm"> Edit Profile </button></div><div class="flex justify-center pt-1"><button class="text-blue-400 text-sm hover:text-blue-300 hover:underline"> Change Password </button></div></div></div>`);
        } else {
          _push(`<form class="space-y-3"><div class="flex justify-center mb-4"><div class="relative"><div class="h-16 w-16 rounded-full overflow-hidden bg-blue-600/30 border-2 border-blue-500 flex items-center justify-center" title="Profile Picture">`);
          if ((_h = vueExports.unref(userProfile)) == null ? void 0 : _h.profile_picture_url) {
            _push(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(userProfile).profile_picture_url)} alt="Profile Picture" class="h-full w-full object-cover">`);
          } else {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:user",
              class: "h-8 w-8 text-blue-400"
            }, null, _parent));
          }
          _push(`</div><button class="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600" title="Change Profile Picture">`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
            name: "fa:camera",
            size: "12"
          }, null, _parent));
          _push(`</button></div></div><div class="space-y-3 px-1"><div class="grid grid-cols-2 gap-2"><div class="space-y-1"><label class="text-sm text-gray-300 block">First Name</label><input type="text"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(formData).first_name)} class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="First Name"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Last Name</label><input type="text"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(formData).last_name)} class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Last Name"></div></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Username</label><input type="text"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", ((_i = vueExports.unref(userProfile)) == null ? void 0 : _i.username) || "")} readonly class="w-full bg-[#0b1529]/70 text-gray-400 rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Username"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Email</label><input type="email"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", ((_j = vueExports.unref(userProfile)) == null ? void 0 : _j.email) || "")} readonly class="w-full bg-[#0b1529]/70 text-gray-400 rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Email"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Phone Number</label><input type="tel"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(formData).phone_number)} class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm" placeholder="Phone Number"></div><div class="space-y-1"><label class="text-sm text-gray-300 block">About Me</label><textarea rows="2" class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 min-h-[60px] resize-none text-sm" placeholder="Write something about yourself...">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(formData).about_me)}</textarea></div><div class="flex justify-between pt-2"><button type="button" class="border border-gray-700 text-gray-300 bg-[#0b1529] hover:bg-[#0b1529]/90 font-medium py-1.5 px-4 rounded h-9 text-sm"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting)) ? " disabled" : ""}> Cancel </button><button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded h-9 text-sm"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting)) ? " disabled" : ""}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(isSubmitting) ? "Saving..." : "Save Changes")}</button></div></div></form>`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(showProfilePictureModal)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ProfilePictureModal, {
          currentImageUrl: (_k = vueExports.unref(userProfile)) == null ? void 0 : _k.profile_picture_url,
          onClose: ($event) => showProfilePictureModal.value = false,
          onUploaded: onProfilePictureUploaded
        }, null, _parent));
      } else if (vueExports.unref(activeTab) === "password") {
        _push(`<form class="space-y-3"><div class="space-y-1"><label class="text-sm text-gray-300 block">Current Password</label><div class="relative"><input${serverRenderer_cjs_prodExports.ssrRenderAttr("type", vueExports.unref(showCurrentPassword) ? "text" : "password")}${serverRenderer_cjs_prodExports.ssrRenderDynamicModel(vueExports.unref(showCurrentPassword) ? "text" : "password", vueExports.unref(passwordData).current_password, null)} required class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"><button type="button" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: vueExports.unref(showCurrentPassword) ? "fa:eye" : "fa:eye-slash",
          size: "16"
        }, null, _parent));
        _push(`</button></div></div><div class="space-y-1"><label class="text-sm text-gray-300 block">New Password</label><div class="relative"><input${serverRenderer_cjs_prodExports.ssrRenderAttr("type", vueExports.unref(showNewPassword) ? "text" : "password")}${serverRenderer_cjs_prodExports.ssrRenderDynamicModel(vueExports.unref(showNewPassword) ? "text" : "password", vueExports.unref(passwordData).new_password, null)} required class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"><button type="button" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: vueExports.unref(showNewPassword) ? "fa:eye" : "fa:eye-slash",
          size: "16"
        }, null, _parent));
        _push(`</button></div></div><div class="space-y-1"><label class="text-sm text-gray-300 block">Confirm Password</label><div class="relative"><input${serverRenderer_cjs_prodExports.ssrRenderAttr("type", vueExports.unref(showConfirmPassword) ? "text" : "password")}${serverRenderer_cjs_prodExports.ssrRenderDynamicModel(vueExports.unref(showConfirmPassword) ? "text" : "password", vueExports.unref(passwordData).confirm_password, null)} required class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"><button type="button" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
          name: vueExports.unref(showConfirmPassword) ? "fa:eye" : "fa:eye-slash",
          size: "16"
        }, null, _parent));
        _push(`</button></div>`);
        if (vueExports.unref(passwordMismatch)) {
          _push(`<p class="text-red-500 text-xs mt-1"> Passwords do not match </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex justify-between pt-3"><button type="button" class="border border-gray-700 text-gray-300 bg-[#0b1529] hover:bg-[#0b1529]/90 font-medium py-1.5 px-4 rounded h-9 text-sm"> Cancel </button><button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded h-9 text-sm"${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isSubmitting) || vueExports.unref(passwordMismatch)) ? " disabled" : ""}>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(isSubmitting) ? "Changing..." : "Change Password")}</button></div></form>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProfilePopup.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _imports_0 = publicAssetsURL("/images/voxtalogo.png");
const _sfc_main$3 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const { $toast } = useNuxtApp();
    useAuthStore();
    const isProfilePopupOpen = vueExports.ref(false);
    const isLoggingOut = vueExports.ref(false);
    const showLogoutConfirmation = vueExports.ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_Icon = _sfc_main$6;
      const _component_ProfilePopup = _sfc_main$4;
      _push(`<!--[--><nav class="flex flex-col justify-between h-screen w-16 bg-[#050C1B] text-white py-5"><div class="flex flex-col items-center"><div class="flex items-center justify-center w-12 h-12 mb-10"><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", _imports_0)} alt="Voxta Logo" class="rounded-full w-10 h-10"></div><div class="flex flex-col space-y-8">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/chat/messages",
        class: ["p-2 rounded-md", {
          "bg-gray-700": _ctx.$route.path === "/chat/messages",
          "hover:bg-gray-800": _ctx.$route.path !== "/chat/messages"
        }]
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:envelope",
              class: "h-6 w-6"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_Icon, {
                name: "fa:envelope",
                class: "h-6 w-6"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/chat/friends",
        class: ["p-2 rounded-md", {
          "bg-gray-700": _ctx.$route.path === "/chat/friends",
          "hover:bg-gray-800": _ctx.$route.path !== "/chat/friends"
        }]
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:user",
              class: "h-6 w-6"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_Icon, {
                name: "fa:user",
                class: "h-6 w-6"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtLink, {
        to: "/chat/groups",
        class: ["p-2 rounded-md", {
          "bg-gray-700": _ctx.$route.path === "/chat/groups",
          "hover:bg-gray-800": _ctx.$route.path !== "/chat/groups"
        }]
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
              name: "fa:users",
              class: "h-6 w-6"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_Icon, {
                name: "fa:users",
                class: "h-6 w-6"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="flex flex-col items-center space-y-4"><button class="p-2 rounded-md hover:bg-gray-800 relative" title="Profile Settings"><div class="w-8 h-8 rounded-full overflow-hidden bg-blue-600/30 flex items-center justify-center">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "fa:user",
        class: "h-5 w-5 text-blue-400"
      }, null, _parent));
      _push(`</div><div class="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-500 border border-blue-600 shadow-sm p-0 flex items-center justify-center">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "fa:cog",
        class: "h-2 w-2 text-white"
      }, null, _parent));
      _push(`</div></button><button${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isLoggingOut)) ? " disabled" : ""} class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "opacity-50 cursor-not-allowed": vueExports.unref(isLoggingOut) }, "p-2 rounded-md hover:bg-gray-800"])}" title="Sign out">`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Icon, {
        name: "fa:sign-out",
        class: "h-6 w-6"
      }, null, _parent));
      _push(`</button></div></nav>`);
      if (vueExports.unref(isProfilePopupOpen)) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ProfilePopup, {
          onClose: ($event) => isProfilePopupOpen.value = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(showLogoutConfirmation)) {
        _push(`<div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm"><div class="bg-[#050C1B] border border-blue-500/30 p-5 rounded-lg shadow-lg w-80 text-white"><h3 class="text-lg font-semibold mb-3">Confirm Logout</h3><p class="mb-4 text-gray-300"> Are you sure you want to log out from your account? </p><div class="flex justify-end space-x-3"><button class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"> Cancel </button><button${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(isLoggingOut)) ? " disabled" : ""} class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "opacity-50 cursor-not-allowed": vueExports.unref(isLoggingOut) }, "px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"])}">${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(isLoggingOut) ? "Logging out..." : "Yes, Log Out")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const defineRouteProvider = (name = "RouteProvider") => vueExports.defineComponent({
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
    vueExports.provide(PageRouteSymbol, vueExports.shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return vueExports.h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_0 = vueExports.defineComponent({
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
    const pageRef = vueExports.ref();
    vueExports.inject(PageRouteSymbol, null);
    expose({ pageRef });
    vueExports.inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return vueExports.h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return vueExports.h(vueExports.Suspense, { suspensible: true }, {
            default() {
              return vueExports.h(RouteProvider, {
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
  return slotContent.length === 1 ? vueExports.h(slotContent[0]) : vueExports.h(vueExports.Fragment, void 0, slotContent);
}
const _sfc_main$2 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const authStore = useAuthStore();
    const shouldShowSidebar = vueExports.computed(() => {
      return authStore.isAuthenticated && authStore.token && !route.path.startsWith("/auth/") && route.path !== "/";
    });
    vueExports.watch(
      () => authStore.isAuthenticated,
      (newValue) => {
      }
    );
    vueExports.watch(
      () => route.fullPath,
      (newPath) => {
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Sidebar = _sfc_main$3;
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "app-container" }, _attrs))}>`);
      if (vueExports.unref(shouldShowSidebar)) {
        _push(`<div class="flex">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Sidebar, null, null, _parent));
        _push(`<main class="flex-1">`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtPage, null, null, _parent));
        _push(`</main></div>`);
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
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
    const _Error404 = vueExports.defineAsyncComponent(() => import('./error-404-C65yu2Y-.mjs'));
    const _Error = vueExports.defineAsyncComponent(() => import('./error-500-DRIA-kAS.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ErrorTemplate), vueExports.mergeProps({ statusCode: vueExports.unref(statusCode), statusMessage: vueExports.unref(statusMessage), description: vueExports.unref(description), stack: vueExports.unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
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
    vueExports.provide(PageRouteSymbol, useRoute$1());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    vueExports.onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        vueExports.onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      serverRenderer_cjs_prodExports.ssrRenderSuspense(_push, {
        default: () => {
          if (vueExports.unref(abortRender)) {
            _push(`<div></div>`);
          } else if (vueExports.unref(error)) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(_sfc_main$1), { error: vueExports.unref(error) }, null, _parent));
          } else if (vueExports.unref(islandContext)) {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(IslandRenderer), { context: vueExports.unref(islandContext) }, null, _parent));
          } else if (vueExports.unref(SingleRenderer)) {
            serverRenderer_cjs_prodExports.ssrRenderVNode(_push, vueExports.createVNode(vueExports.resolveDynamicComponent(vueExports.unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    var _a;
    const vueApp = vueExports.createApp(_sfc_main);
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

export { __nuxt_component_0$1 as _, useNuxtApp as a, useAuthStore as b, _imports_0 as c, _sfc_main$6 as d, entry$1 as default, useRoute as e, useRoute$1 as f, __nuxt_component_0 as g, useRuntimeConfig as h, defineNuxtRouteMiddleware as i, serverRenderer_cjs_prodExports as s, tryUseNuxtApp as t, useRouter as u, vueExports as v };
//# sourceMappingURL=server.mjs.map
