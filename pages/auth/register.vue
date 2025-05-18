<template>
  <AuthRegisterForm />
</template>

<script setup lang="ts">
// This page simply uses the RegisterForm component
// You could add page-specific logic or meta information here if needed
useHead({
  title: "Register",
  meta: [{ name: "description", content: "Create a new account" }],
});
</script>
