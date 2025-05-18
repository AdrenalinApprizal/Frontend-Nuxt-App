<template>
  <div>
    <!-- This page will redirect to login -->
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

// Redirect to login page
onMounted(() => {
  router.push("/auth/login");
});
</script>
