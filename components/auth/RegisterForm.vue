<template>
  <div
    class="flex items-center justify-center min-h-screen bg-[#050C1B] relative overflow-hidden py-2"
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
    <div
      class="w-full max-w-lg p-4 lg:p-6 space-y-3 bg-[#050C1B]/50 backdrop-blur-md rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/20"
    >
      <div class="flex justify-center">
        <div
          class="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden shadow-md shadow-blue-500/50"
        >
          <img
            src="/images/voxtalogo.png"
            alt="Voxta Logo"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
      <h2 class="text-xl lg:text-2xl font-bold text-center text-white">
        Create Your Account
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label
              for="first-name"
              class="block mb-1 text-xs lg:text-sm font-medium text-blue-100"
            >
              First Name
            </label>
            <input
              type="text"
              id="first-name"
              v-model="firstName"
              required
              class="w-full px-3 py-1.5 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50 text-sm"
              placeholder="Your first name"
            />
          </div>
          <div>
            <label
              for="last-name"
              class="block mb-1 text-xs lg:text-sm font-medium text-blue-100"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last-name"
              v-model="lastName"
              required
              class="w-full px-3 py-1.5 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50 text-sm"
              placeholder="Your last name"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label
              for="username"
              class="block mb-1 text-xs lg:text-sm font-medium text-blue-100"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              v-model="username"
              required
              class="w-full px-3 py-1.5 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50 text-sm"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label
              for="email"
              class="block mb-1 text-xs lg:text-sm font-medium text-blue-100"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              class="w-full px-3 py-1.5 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50 text-sm"
              placeholder="Your email address"
            />
          </div>
        </div>

        <div>
          <label
            for="phone-number"
            class="block mb-1 text-xs lg:text-sm font-medium text-blue-100"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone-number"
            v-model="phoneNumber"
            class="w-full px-3 py-1.5 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50 text-sm"
            placeholder="Your phone number"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label
              for="password"
              class="block mb-1 text-xs lg:text-sm font-medium text-blue-100"
            >
              Password
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
                class="w-full px-3 py-1.5 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50 text-sm"
                placeholder="Create a password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-2 top-2 text-blue-900 text-sm"
              >
                <Icon v-if="showPassword" name="fa:eye" class="h-3 w-3" />
                <Icon v-else name="fa:eye-slash" class="h-3 w-3" />
              </button>
            </div>
          </div>

          <div>
            <label
              for="confirm-password"
              class="block mb-1 text-xs lg:text-sm font-medium text-blue-100"
            >
              Confirm Password
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="confirm-password"
                v-model="confirmPassword"
                required
                class="w-full px-3 py-1.5 bg-white border border-blue-500/30 rounded text-[#050C1B] focus:outline-none focus:ring focus:ring-blue-500 placeholder-[#050C1B]/70 placeholder-opacity-50 text-sm"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-2 top-2 text-blue-900 text-sm"
              >
                <Icon v-if="showPassword" name="fa:eye" class="h-3 w-3" />
                <Icon v-else name="fa:eye-slash" class="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none text-sm"
          :class="{ 'opacity-50 cursor-not-allowed': loading }"
        >
          {{ loading ? "Loading..." : "Register" }}
        </button>

        <p class="text-xs text-center text-blue-100 mt-2">
          Already have an account?
          <NuxtLink
            to="/auth/login"
            class="text-blue-300 hover:text-blue-200 hover:underline"
          >
            Login
          </NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/composables/useAuth";

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const firstName = ref("");
const lastName = ref("");
const phoneNumber = ref("");
const aboutMe = ref("");
const profilePictureUrl = ref("");
const showPassword = ref(false);
const loading = ref(false);
const isServerCheckLoading = ref(false);
const serverStatus = ref<{ online: boolean; message: string } | null>(null);
const errorMsg = ref("");
const router = useRouter();
const { $toast } = useNuxtApp();
const authStore = useAuthStore();

onMounted(async () => {
  await checkServerStatus();
});

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
    if (serverStatus.value && !serverStatus.value.online) {
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

    if (password.value !== confirmPassword.value) {
      $toast.error("Passwords don't match");
      loading.value = false;
      return;
    }

    const registerData = {
      username: username.value,
      email: email.value,
      password: password.value,
      first_name: firstName.value,
      last_name: lastName.value,
      phone_number: phoneNumber.value,
    };

    const result = await authStore.register(registerData);

    if (result.success) {
      $toast.success(
        result.message || "Registration successful! Please login."
      );

      // Add delay before navigation to ensure toast is visible
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push("/auth/login");
    }
  } catch (error: any) {
    $toast.error(error?.message || "Something went wrong. Please try again.");
    console.error("Registration error:", error);
  } finally {
    loading.value = false;
  }
};
</script>
