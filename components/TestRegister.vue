<template>
  <div
    class="register-test p-4 bg-white rounded shadow-md max-w-3xl mx-auto mt-8"
  >
    <h2 class="text-xl font-bold mb-4">Test Register API</h2>

    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"
      ></div>
      <span class="ml-2">Testing register endpoint...</span>
    </div>

    <div v-else>
      <div v-if="error" class="p-4 bg-red-100 text-red-800 rounded mb-4">
        <p class="font-bold">Error occurred:</p>
        <p>{{ error }}</p>
      </div>

      <div v-if="success" class="p-4 bg-green-100 text-green-800 rounded mb-4">
        <p class="font-bold">✅ Register endpoint working properly!</p>
        <p>
          The /api/auth/register endpoint processed the request successfully.
        </p>
        <p class="mt-2">
          <strong>Response message:</strong> {{ successMessage }}
        </p>
      </div>

      <form @submit.prevent="testRegisterEndpoint" class="space-y-4 mt-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Username</label>
            <input
              v-model="formData.username"
              type="text"
              class="w-full p-2 border rounded"
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full p-2 border rounded"
              placeholder="Email"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input
              v-model="formData.password"
              type="password"
              class="w-full p-2 border rounded"
              placeholder="Password"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">First Name</label>
            <input
              v-model="formData.first_name"
              type="text"
              class="w-full p-2 border rounded"
              placeholder="First Name"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Last Name</label>
            <input
              v-model="formData.last_name"
              type="text"
              class="w-full p-2 border rounded"
              placeholder="Last Name"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1"
              >Phone Number (optional)</label
            >
            <input
              v-model="formData.phone_number"
              type="text"
              class="w-full p-2 border rounded"
              placeholder="Phone Number"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="generateTestData"
            class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Generate Test Data
          </button>

          <button
            type="submit"
            class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            :disabled="isLoading"
          >
            {{ isLoading ? "Testing..." : "Test Register Endpoint" }}
          </button>
        </div>
      </form>

      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-2">Request Data:</h3>
        <pre class="bg-gray-100 p-3 rounded text-xs overflow-auto">{{
          JSON.stringify(formData, null, 2)
        }}</pre>

        <div v-if="responseData" class="mt-4">
          <h3 class="text-lg font-semibold mb-2">Response Data:</h3>
          <pre class="bg-gray-100 p-3 rounded text-xs overflow-auto">{{
            JSON.stringify(responseData, null, 2)
          }}</pre>
        </div>
      </div>

      <div class="mt-6 flex justify-between">
        <button
          @click="testRegisterEndpoint"
          class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          :disabled="isLoading"
        >
          Test Again
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
import { ref } from "vue";
import { useAuthStore } from "~/composables/useAuth";

const authStore = useAuthStore();
const { $toast } = useNuxtApp();
const isLoading = ref(false);
const success = ref(false);
const error = ref(null);
const responseData = ref(null);
const successMessage = ref("");

const formData = ref({
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone_number: "",
});

// Generate random test data
function generateTestData() {
  const randomString = Math.random().toString(36).substring(2, 8);

  formData.value = {
    username: `testuser_${randomString}`,
    email: `test_${randomString}@example.com`,
    password: `TestPass123!`,
    first_name: "Test",
    last_name: "User",
    phone_number: `+${Math.floor(Math.random() * 10000000000)}`,
  };

  $toast.info("Test data generated");
}

// Test the register endpoint
async function testRegisterEndpoint() {
  isLoading.value = true;
  success.value = false;
  error.value = null;
  responseData.value = null;
  successMessage.value = "";

  try {
    // Call register function from auth store
    const result = await authStore.register(formData.value);

    // Display success
    success.value = true;
    responseData.value = result;
    successMessage.value = result.message;

    console.log("Register endpoint test result:", result);
    $toast.success("Registration test successful!");
  } catch (err) {
    error.value = err.message || "Failed to test register endpoint";
    console.error("Register endpoint test error:", err);
    $toast.error(error.value);
  } finally {
    isLoading.value = false;
  }
}

defineEmits(["close"]);
</script>
