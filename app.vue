<template>
  <div class="app-container">
    <template v-if="shouldShowSidebar">
      <div class="flex">
        <Sidebar />
        <main class="flex-1">
          <NuxtPage />
        </main>
      </div>
    </template>
    <template v-else>
      <NuxtPage />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/composables/useAuth";

const route = useRoute();
const authStore = useAuthStore();

// Buat computed property yang lebih reaktif untuk menentukan apakah sidebar harus ditampilkan
const shouldShowSidebar = computed(() => {
  // Cek apakah user sudah terautentikasi dan bukan di route autentikasi
  return (
    authStore.isAuthenticated &&
    authStore.token &&
    !route.path.startsWith("/auth/") &&
    route.path !== "/"
  );
});

// Initialize auth store when app is mounted
onMounted(async () => {
  await authStore.init();
});

// Watch for authentication state changes
watch(
  () => authStore.isAuthenticated,
  (newValue) => {
    // Authentication state changed
  }
);

// Watch for route changes
watch(
  () => route.fullPath,
  (newPath) => {
    // Route changed
  }
);
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: "Inter", sans-serif;
}

#__nuxt {
  height: 100%;
}

.app-container {
  height: 100%;
}

body {
  background-color: #070e22;
  color: white;
}
</style>
