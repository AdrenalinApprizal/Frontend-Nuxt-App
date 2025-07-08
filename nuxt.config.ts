// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", "@pinia/nuxt"],
  icon: {
    serverBundle: {
      collections: ["fa", "lucide", "mdi"],
    },
    clientBundle: {
      icons: [
        // Core FontAwesome icons (verified available)
        "fa:user",
        "fa:users",
        "fa:envelope",
        "fa:bell",
        "fa:times",
        "fa:check",
        "fa:edit",
        "fa:trash",
        "fa:download",
        "fa:upload",
        "fa:image",
        "fa:file",
        "fa:paperclip",
        "fa:search",
        "fa:cog",
        "fa:sign-out",
        "fa:eye",
        "fa:eye-slash",
        "fa:chevron-left",
        "fa:chevron-right",
        "fa:chevron-up",
        "fa:chevron-down",
        "fa:ellipsis-v",
        "fa:plus",
        "fa:minus",
        "fa:ban",
        "fa:share-alt",
        "fa:exclamation-triangle",
        "fa:circle",
        "fa:user-plus",
        "fa:music",
        "fa:camera",

        // Core Lucide icons (more reliable for file types and other icons)
        "lucide:message-square",
        "lucide:info",
        "lucide:search",
        "lucide:paperclip",
        "lucide:send",
        "lucide:file",
        "lucide:image",
        "lucide:x",
        "lucide:edit-2",
        "lucide:trash-2",
        "lucide:download",
        "lucide:alert-triangle",
        "lucide:check",
        "lucide:check-check",
        "lucide:clock",
        "lucide:file-text",
        "lucide:file-spreadsheet",
        "lucide:folder-archive",
        "lucide:code",
        "lucide:play",
        "lucide:video",

        // MDI icons
        "mdi:account-group",
      ],
    },
  },
  css: ["~/assets/css/main.css"],
  build: {
    transpile: [
      "vue3-toastify",
      "vue-router",
      "@iconify-json/fa",
      "@iconify-json/lucide",
    ],
  },
  app: {
    head: {
      htmlAttrs: {
        class: "antialiased",
      },
      bodyAttrs: {
        class: "bg-white dark:bg-black dark:text-white font-sans",
      },
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  runtimeConfig: {
    // Private keys (server-side only)

    // Public keys that are exposed to the client
    public: {
      dev: process.env.NODE_ENV !== "production",
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api",
      apiAuthUrl:
        process.env.NUXT_PUBLIC_API_AUTH_URL ||
        "http://localhost:8081/api/auth",
      groupApiBaseUrl:
        process.env.NUXT_PUBLIC_GROUP_API_BASE_URL ||
        "http://localhost:8082/api",
      notificationApiBaseUrl:
        process.env.NUXT_PUBLIC_NOTIFICATION_API_BASE_URL ||
        "http://localhost:8083/api",
      fileServiceBaseUrl:
        process.env.NUXT_PUBLIC_FILE_SERVICE_BASE_URL ||
        "http://localhost:8084",
      presenceServiceBaseUrl:
        process.env.NUXT_PUBLIC_PRESENCE_SERVICE_BASE_URL ||
        "http://localhost:8085/api",
    },
  },
  nitro: {
    experimental: {
      wasm: true,
    },
    esbuild: {
      options: {
        target: "esnext",
      },
    },
    bundledStorage: ["redis"],
  },
  vite: {
    resolve: {
      alias: {
        "estree-walker": "~/packages/estree-walker-fix.js",
      },
    },
    optimizeDeps: {
      exclude: ["estree-walker"],
    },
  },
});
