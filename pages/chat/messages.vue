<template>
  <div class="h-screen flex">
    <!-- Messages List -->
    <div class="w-80 border-r border-gray-200">
      <ChatMessagesList />
    </div>

    <!-- Content area that shows chat or welcome screen -->
    <div class="flex-1 flex">
      <template v-if="$route.params.id">
        <!-- This renders the actual [id].vue page content -->
        <NuxtPage class="flex-1" />
      </template>
      <template v-else>
        <!-- Placeholder content when no chat is selected -->
        <div
          class="flex-1 bg-gray-50 flex flex-col items-center justify-center"
        >
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
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/composables/useAuth";

// Apply the auth middleware to protect this route
definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const authStore = useAuthStore();
const isAuthChecked = ref(false);

// Keep our existing auth check for additional security and fetching user data
onMounted(async () => {
  try {
    // First check if we have a token in the store
    if (!authStore.token) {
      // If no token in the store, wait briefly to see if it gets loaded from cookies
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Final check for authentication after possible cookie loading
    if (!authStore.isAuthenticated && !authStore.token) {
      console.log("Not authenticated, redirecting to login");
      router.push("/auth/login");
    } else {
      console.log("User is authenticated, staying on chat page");
      // User is authenticated, make sure we have the latest user info
      if (!authStore.user) {
        try {
          await authStore.getUserInfo();
        } catch (error) {
          console.warn("Could not retrieve user info:", error);
        }
      }
    }
  } catch (error) {
    console.error("Error during auth check:", error);
  } finally {
    isAuthChecked.value = true;
  }
});
</script>
