<template>
  <div
    class="min-h-screen flex items-center justify-center relative bg-[#050C1B] overflow-hidden"
  >
    <!-- Elliptical gradient decoration in the top left -->
    <div
      class="absolute -top-24 -left-24 w-96 h-96 rounded-full"
      style="
        background: radial-gradient(
          circle,
          rgba(27, 62, 136, 0.8) 0%,
          rgba(27, 62, 136, 0) 70%
        );
      "
    />

    <!-- Elliptical gradient decoration in the bottom right -->
    <div
      class="absolute -bottom-24 -right-24 w-96 h-96 rounded-full"
      style="
        background: radial-gradient(
          circle,
          rgba(27, 62, 136, 0.8) 0%,
          rgba(27, 62, 136, 0) 70%
        );
      "
    />

    <!-- Main background gradient -->
    <div
      class="absolute inset-0 z-0 opacity-70"
      style="
        background-image: radial-gradient(
          circle,
          rgba(27, 62, 136, 0.8) 0%,
          rgba(27, 62, 136, 0) 70%
        );
      "
    />
    <div
      class="w-full max-w-md p-12 space-y-6 bg-[#050C1B]/50 backdrop-blur-md rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/20 z-10"
    >
      <div class="flex justify-center">
        <div
          class="w-24 h-24 rounded-full overflow-hidden shadow-md shadow-blue-500/50"
        >
          <img
            src="/images/voxtalogo.png"
            alt="Logo"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
      <h2 class="text-2xl font-bold text-center text-white">
        Sign In to Your Account
      </h2>
      <div
        v-if="errorMsg"
        class="bg-red-500/20 border border-red-500 text-white px-4 py-2 rounded"
      >
        {{ errorMsg }}
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-blue-100"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            @blur="validateEmail"
            class="w-full px-4 py-2 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50"
            :class="{ 'border-red-500': emailError }"
            placeholder="Enter your email"
          />
          <p v-if="emailError" class="mt-1 text-sm text-red-400">
            {{ emailError }}
          </p>
        </div>
        <div class="mb-4">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-blue-100"
          >
            Password
          </label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              class="w-full px-4 py-2 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50"
              placeholder="Enter your password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-3 text-blue-900"
            >
              <Icon v-if="showPassword" name="fa:eye" class="h-4 w-4" />
              <Icon v-else name="fa:eye-slash" class="h-4 w-4" />
            </button>
          </div>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
          :class="{ 'opacity-50 cursor-not-allowed': loading }"
        >
          {{ loading ? "Loading..." : "Login" }}
        </button>
        <p class="mt-4 text-sm text-center text-blue-100">
          Don't have an account?
          <NuxtLink
            to="/auth/register"
            class="text-blue-300 hover:text-blue-200 hover:underline"
          >
            Register
          </NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/composables/useAuth";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errorMsg = ref("");
const emailError = ref("");
const isServerCheckLoading = ref(false);
const serverStatus = ref<{ online: boolean; message: string } | null>(null);
const router = useRouter();
const { $toast } = useNuxtApp();
const authStore = useAuthStore();

// Validate email for common typos
function validateEmail() {
  emailError.value = "";

  if (!email.value) return;

  // Check for common email typos
  if (email.value.includes("@gmail.coma")) {
    emailError.value =
      "Invalid email format: '@gmail.coma' should be '@gmail.com'";
  } else if (email.value.endsWith(".coma")) {
    emailError.value =
      "Invalid email format: your email ends with '.coma' instead of '.com'";
  } else if (email.value.includes(".con")) {
    emailError.value = "Invalid email format: '.con' should be '.com'";
  }
}

// Check server connectivity on component mount
onMounted(async () => {
  await checkServerStatus();
});

// Function to check server status
async function checkServerStatus() {
  isServerCheckLoading.value = true;
  errorMsg.value = "";

  try {
    // Type assertion to access the checkServerConnectivity method
    const checkConnectivity =
      authStore.checkServerConnectivity as () => Promise<{
        online: boolean;
        message: string;
      }>;
    serverStatus.value = await checkConnectivity();

    if (serverStatus.value && !serverStatus.value.online) {
      errorMsg.value =
        "Authentication server appears to be offline. Please check server connection.";
      console.warn(serverStatus.value.message);
    }
  } catch (error) {
    console.error("Error checking server status:", error);
    errorMsg.value = "Could not verify authentication server status.";
  } finally {
    isServerCheckLoading.value = false;
  }
}

const handleSubmit = async () => {
  loading.value = true;
  errorMsg.value = "";

  try {
    // Validate form inputs
    if (!email.value || !password.value) {
      errorMsg.value = "Email and password are required.";
      $toast.error(errorMsg.value);
      loading.value = false;
      return;
    }

    // Validate email before submitting
    validateEmail();
    if (emailError.value) {
      errorMsg.value = emailError.value;
      $toast.error(errorMsg.value);
      loading.value = false;
      return;
    }

    // Check server connectivity again before trying to login
    if (!serverStatus.value?.online) {
      // Type assertion to access the checkServerConnectivity method
      const checkConnectivity =
        authStore.checkServerConnectivity as () => Promise<{
          online: boolean;
          message: string;
        }>;
      const status = await checkConnectivity();

      if (!status.online) {
        throw new Error(
          "Cannot connect to authentication server. Please check if the server is running."
        );
      }
    }

    // Use auth store for login with the connected backend API
    const result = await authStore.login(email.value, password.value);

    // Display success message
    $toast.success("Login successful!");

    // Set fresh login flag for auto-refresh
    sessionStorage.setItem("freshLogin", "true");
    sessionStorage.setItem("loginTimestamp", Date.now().toString());

    // Make sure user data is loaded before navigation
    await authStore.getUserInfo().catch((error) => {
      console.warn("Error fetching user info:", error);
      // Continue even if this fails
    });

    // Force a state refresh to ensure isAuthenticated is properly updated
    console.log(
      "Login successful, authenticated status:",
      authStore.isAuthenticated
    );

    // Use nextTick to ensure Vue state is updated
    await nextTick();

    // Enhanced refresh strategy - similar to router.refresh()
    console.log(
      "Implementing comprehensive page refresh similar to router.refresh..."
    );

    // Strategy 1: Clear any cached data
    if (process.client) {
      // Clear browser cache for this session
      sessionStorage.clear();

      // Reset flags after clearing to maintain login state
      sessionStorage.setItem("freshLogin", "true");
      sessionStorage.setItem("loginTimestamp", Date.now().toString());
    }

    // Strategy 2: Force refresh of all app state
    window.dispatchEvent(new Event("resize"));
    window.dispatchEvent(
      new CustomEvent("auth-state-changed", {
        detail: { authenticated: true, timestamp: Date.now() },
      })
    );

    // Display navigation message
    $toast.success("Login successful! Redirecting to chat...");

    // Strategy 3: Enhanced navigation with multiple fallbacks
    console.log(
      "Navigating to chat/messages with router.refresh-like behavior..."
    );

    try {
      // Primary navigation strategy - replace current history
      await navigateTo("/chat/messages", {
        replace: true,
        external: false,
      });

      // Strategy 4: Post-navigation refresh (similar to router.refresh effect)
      setTimeout(() => {
        if (process.client && window.location.pathname === "/chat/messages") {
          console.log("Executing post-navigation refresh...");

          // Force complete app state refresh
          window.dispatchEvent(
            new CustomEvent("login-refresh", {
              detail: {
                timestamp: Date.now(),
                type: "post-navigation-refresh",
              },
            })
          );

          // Simple navigation without refresh parameters
          const newUrl = window.location.pathname;
          window.history.replaceState({}, "", newUrl);
        }
      }, 1500);
    } catch (navigationError) {
      console.error(
        "Navigation error, using fallback refresh strategy:",
        navigationError
      );

      // Fallback strategy: Direct router navigation with refresh
      if (process.client) {
        // Use router-based navigation instead of direct window.location
        await router.push("/chat/messages");
      }
    }
  } catch (error: any) {
    // Handle login errors
    console.error("Login error:", error);
    errorMsg.value = error?.message || "An error occurred during login.";
    $toast.error(errorMsg.value);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Additional component-specific styles can be added here */
</style>
