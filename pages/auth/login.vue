<template>
  <AuthLoginForm />
</template>

<script setup lang="ts">
// This page simply uses the LoginForm component
// You could add page-specific logic or meta information here if needed
useHead({
  title: "Login",
  meta: [{ name: "description", content: "Login to your account" }],
});
</script>
