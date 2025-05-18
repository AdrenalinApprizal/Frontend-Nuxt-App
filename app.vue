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

// Inisialisasi auth store saat aplikasi dimuat dan tambahkan watch untuk debugging
onMounted(async () => {
  console.log("App mounted, initializing auth store");
  await authStore.init();
  console.log("Auth initialized, isAuthenticated:", authStore.isAuthenticated);
});

// Tambahkan watcher untuk debugging perubahan state autentikasi
watch(
  () => authStore.isAuthenticated,
  (newValue) => {
    console.log("isAuthenticated changed to:", newValue);
  }
);

// Tambahkan watcher untuk debugging perubahan route
watch(
  () => route.fullPath,
  (newPath) => {
    console.log("Route changed to:", newPath);
    console.log("Should show sidebar:", shouldShowSidebar.value);
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
