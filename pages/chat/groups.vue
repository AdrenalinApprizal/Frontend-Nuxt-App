<template>
  <div class="h-screen flex">
    <!-- Group list -->
    <div class="w-80 border-r border-gray-200 flex-shrink-0">
      <GroupsList />
    </div>

    <!-- Empty chat area with placeholder -->
    <div class="flex-1 bg-gray-50 flex flex-col items-center justify-center">
      <div class="text-center max-w-md">
        <img
          src="/images/voxtalogo.png"
          alt="Logo"
          class="w-24 h-24 mx-auto mb-6 rounded-full"
        />
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">
          Welcome to Chat
        </h2>
        <p class="text-gray-600">
          Select a conversation from the list or start a new one to begin
          messaging.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/composables/useAuth";
import GroupsList from "~/components/chat/GroupsList.vue";

const router = useRouter();
const authStore = useAuthStore();

// Middleware-like protection to ensure only authenticated users can access this page
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push("/auth/login");
  }
});
</script>
