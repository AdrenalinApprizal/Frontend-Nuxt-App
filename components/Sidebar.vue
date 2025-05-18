<template>
  <nav
    class="flex flex-col justify-between h-screen w-16 bg-[#050C1B] text-white py-5"
  >
    <!-- Logo at the top -->
    <div class="flex flex-col items-center">
      <div class="flex items-center justify-center w-12 h-12 mb-10">
        <img
          src="/images/voxtalogo.png"
          alt="Voxta Logo"
          class="rounded-full w-10 h-10"
        />
      </div>

      <!-- Navigation Icons -->
      <div class="flex flex-col space-y-8">
        <NuxtLink
          to="/chat/messages"
          class="p-2 rounded-md"
          :class="{
            'bg-gray-700': $route.path === '/chat/messages',
            'hover:bg-gray-800': $route.path !== '/chat/messages',
          }"
        >
          <Icon name="fa:envelope" class="h-6 w-6" />
        </NuxtLink>

        <NuxtLink
          to="/chat/friends"
          class="p-2 rounded-md"
          :class="{
            'bg-gray-700': $route.path === '/chat/friends',
            'hover:bg-gray-800': $route.path !== '/chat/friends',
          }"
        >
          <Icon name="fa:user" class="h-6 w-6" />
        </NuxtLink>

        <NuxtLink
          to="/chat/groups"
          class="p-2 rounded-md"
          :class="{
            'bg-gray-700': $route.path === '/chat/groups',
            'hover:bg-gray-800': $route.path !== '/chat/groups',
          }"
        >
          <Icon name="fa:users" class="h-6 w-6" />
        </NuxtLink>
      </div>
    </div>

    <!-- Bottom buttons section -->
    <div class="flex flex-col items-center space-y-4">
      <!-- Profile button -->
      <button
        @click="isProfilePopupOpen = true"
        class="p-2 rounded-md hover:bg-gray-800 relative"
        title="Profile Settings"
      >
        <div
          class="w-8 h-8 rounded-full overflow-hidden bg-blue-600/30 flex items-center justify-center"
        >
          <Icon name="fa:user" class="h-5 w-5 text-blue-400" />
        </div>
        <div
          class="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-500 border border-blue-600 shadow-sm p-0 flex items-center justify-center"
        >
          <Icon name="fa:cog" class="h-2 w-2 text-white" />
        </div>
      </button>

      <!-- Sign Out Button -->
      <button
        @click="showLogoutConfirmation = true"
        :disabled="isLoggingOut"
        class="p-2 rounded-md hover:bg-gray-800"
        :class="{ 'opacity-50 cursor-not-allowed': isLoggingOut }"
        title="Sign out"
      >
        <Icon name="fa:sign-out" class="h-6 w-6" />
      </button>
    </div>
  </nav>

  <!-- Profile Popup -->
  <ProfilePopup v-if="isProfilePopupOpen" @close="isProfilePopupOpen = false" />

  <!-- Logout Confirmation Modal -->
  <div
    v-if="showLogoutConfirmation"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm"
  >
    <div
      class="bg-[#050C1B] border border-blue-500/30 p-5 rounded-lg shadow-lg w-80 text-white"
    >
      <h3 class="text-lg font-semibold mb-3">Confirm Logout</h3>
      <p class="mb-4 text-gray-300">
        Are you sure you want to log out from your account?
      </p>

      <div class="flex justify-end space-x-3">
        <button
          @click="showLogoutConfirmation = false"
          class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          @click="handleLogout"
          :disabled="isLoggingOut"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          :class="{ 'opacity-50 cursor-not-allowed': isLoggingOut }"
        >
          {{ isLoggingOut ? "Logging out..." : "Yes, Log Out" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/composables/useAuth";

const router = useRouter();
const { $toast } = useNuxtApp();
const authStore = useAuthStore();

const isProfilePopupOpen = ref(false);
const isLoggingOut = ref(false);
const showLogoutConfirmation = ref(false);

const handleLogout = async () => {
  try {
    isLoggingOut.value = true;
    showLogoutConfirmation.value = false; // Close the confirmation dialog

    // Show logout in progress message
    $toast.info("Logging out...");

    // Clear user session data
    await authStore.logout();

    // Display success message
    $toast.success("Successfully logged out");

    // Add delay before navigation to ensure toast is visible and state is updated
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Navigate back to login page
    router.push("/auth/login");
  } catch (error: any) {
    console.error("Logout error:", error);
    $toast.error(error?.message || "An error occurred during logout");
  } finally {
    isLoggingOut.value = false;
  }
};
</script>
