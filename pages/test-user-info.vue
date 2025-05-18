<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">User Info API Test</h1>

    <div class="mb-4 p-4 bg-blue-100 rounded">
      <p>
        This page tests the <code>/api/auth/user/info</code> endpoint to verify
        it's working correctly.
      </p>
      <p class="mt-2">
        You need to be logged in for this test to work. If you're not logged in,
        please
        <NuxtLink to="/auth/login" class="text-blue-600 underline"
          >login first</NuxtLink
        >.
      </p>
    </div>

    <TestUserInfo @close="$router.push('/chat/messages')" />
  </div>
</template>

<script setup>
// Import middleware to ensure user is authenticated
definePageMeta({
  middleware: ["auth"],
});
</script>
