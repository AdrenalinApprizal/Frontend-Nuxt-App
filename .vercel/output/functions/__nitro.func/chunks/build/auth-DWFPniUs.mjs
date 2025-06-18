import { i as defineNuxtRouteMiddleware } from './server.mjs';
import 'entities/lib/decode.js';
import 'estree-walker';
import 'source-map-js';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import '@vue/compiler-dom';
import '@vue/runtime-dom';
import '@vue/shared';
import '@vue/compiler-ssr';
import 'node:stream';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';

const auth = defineNuxtRouteMiddleware((to, from) => {
  console.log("Auth middleware temporarily disabled for debugging");
  return;
});

export { auth as default };
//# sourceMappingURL=auth-DWFPniUs.mjs.map
