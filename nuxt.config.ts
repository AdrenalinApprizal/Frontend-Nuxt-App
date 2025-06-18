// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  build: {
    transpile: ["vue3-toastify", "vue-router"],
  },
  nitro: {
    preset: "vercel",
    experimental: {
      wasm: false
    },
    esbuild: {
      options: {
        target: "es2022"
      }
    },
    rollupConfig: {
      external: ["@iconify/utils", "@iconify/tools", "@iconify/types"]
    }
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
      groupApiUrl:
        process.env.NUXT_PUBLIC_GROUP_API_URL || "http://localhost:8082/api",
      notificationApiUrl:
        process.env.NUXT_PUBLIC_NOTIFICATION_API_URL || "http://localhost:8083/api",
      fileServiceUrl:
        process.env.NUXT_PUBLIC_FILE_SERVICE_URL || "http://localhost:8084",
      presenceServiceUrl:
        process.env.NUXT_PUBLIC_PRESENCE_SERVICE_URL || "http://localhost:8085/api",
      wsMessagesUrl:
        process.env.NUXT_PUBLIC_WS_MESSAGES_URL || "ws://localhost:8082",
      wsPresenceUrl:
        process.env.NUXT_PUBLIC_WS_PRESENCE_URL || "ws://localhost:8085",
    },
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
