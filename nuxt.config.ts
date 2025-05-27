// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  build: {
    transpile: ["vue3-toastify", "vue-router"],
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
    },
  },
  vite: {
    resolve: {
      alias: {
        "estree-walker": "estree-walker/dist/esm/index.js",
      },
    },
  },
});
