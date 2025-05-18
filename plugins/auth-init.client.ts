import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/composables/useAuth";

// Plugin ini hanya akan dijalankan di sisi klien (browser)
// Nama filenya berakhiran .client.ts untuk memastikannya
export default defineNuxtPlugin((nuxtApp) => {
  // Inisialisasi segera untuk halaman yang membutuhkan auth
  const authStore = useAuthStore();

  // Initialize auth state immediately
  authStore.init();

  // Re-initialize after hydration to ensure up-to-date state
  nuxtApp.hook("app:mounted", () => {
    // Re-run init to ensure we catch any changes
    authStore.init();

    console.log(
      "Auth state initialized, isAuthenticated:",
      authStore.isAuthenticated
    );
  });
});
