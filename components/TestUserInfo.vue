<template>
  <div
    class="user-info-test p-4 bg-white rounded shadow-md max-w-3xl mx-auto mt-8"
  >
    <h2 class="text-xl font-bold mb-4">Test User Info API</h2>

    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"
      ></div>
      <span class="ml-2">Testing endpoint...</span>
    </div>

    <div v-else>
      <div v-if="error" class="p-4 bg-red-100 text-red-800 rounded mb-4">
        <p class="font-bold">Error occurred:</p>
        <p>{{ error }}</p>
      </div>

      <div v-if="success" class="p-4 bg-green-100 text-green-800 rounded mb-4">
        <p class="font-bold">✅ Endpoint working properly!</p>
        <p>
          The /api/auth/user/info endpoint returned user information
          successfully.
        </p>
      </div>

      <div v-if="userData" class="mt-4">
        <h3 class="text-lg font-semibold mb-2">User Information:</h3>
        <table class="min-w-full border-collapse">
          <tbody>
            <tr v-for="(value, key) in userData" :key="key" class="border-b">
              <td class="py-2 px-4 font-medium">{{ key }}</td>
              <td class="py-2 px-4">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 flex">
        <button
          @click="testEndpoint"
          class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mr-2"
        >
          Test Endpoint Again
        </button>

        <button
          @click="$emit('close')"
          class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/composables/useAuth";

const authStore = useAuthStore();
const isLoading = ref(false);
const userData = ref(null);
const error = ref(null);
const success = ref(false);

// Test the user info endpoint
async function testEndpoint() {
  isLoading.value = true;
  userData.value = null;
  error.value = null;
  success.value = false;

  try {
    // Verify we have authentication
    if (!authStore.isAuthenticated) {
      error.value = "User is not authenticated. Please log in first.";
      return;
    }

    // Call the user info endpoint
    const result = await authStore.getUserInfo();

    // Display the result
    userData.value = result;
    success.value = true;
    console.log("User info endpoint test result:", result);
  } catch (err) {
    error.value = err.message || "Failed to test endpoint";
    console.error("User info endpoint test error:", err);
  } finally {
    isLoading.value = false;
  }
}

// Run the test automatically when component mounts
onMounted(testEndpoint);

defineEmits(["close"]);
</script>
