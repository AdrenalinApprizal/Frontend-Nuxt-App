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
import 'node:stream';
import 'pinia';

const auth = defineNuxtRouteMiddleware((to, from) => {
  console.log("Auth middleware temporarily disabled for debugging");
  return;
});

export { auth as default };
//# sourceMappingURL=auth-vOm5Q-5t.mjs.map
