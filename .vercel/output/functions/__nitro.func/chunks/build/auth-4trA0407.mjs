import { i as defineNuxtRouteMiddleware } from './server.mjs';
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

const auth = defineNuxtRouteMiddleware((to, from) => {
  console.log("Auth middleware temporarily disabled for debugging");
  return;
});

export { auth as default };
//# sourceMappingURL=auth-4trA0407.mjs.map
