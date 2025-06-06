import { useAuthStore } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {
  // TEMPORARILY DISABLED FOR DEBUGGING
  console.log("Auth middleware temporarily disabled for debugging");
  return;

  // Skip middleware if on server (we'll handle auth check client-side)
  if (process.server) return;

  const authStore = useAuthStore();

  // Check for authentication token first
  const hasToken =
    authStore.token ||
    (process.client && document.cookie.includes("auth_token="));

  // If not authenticated and not on an auth page, redirect to login
  if (!hasToken && !to.path.startsWith("/auth/")) {
    console.log("Middleware: Not authenticated, redirecting to login");
    return navigateTo("/auth/login");
  }

  // If authenticated and trying to access login/register page, redirect to chat
  if (hasToken && to.path.startsWith("/auth/")) {
    console.log("Middleware: Already authenticated, redirecting to chat");
    return navigateTo("/chat/messages");
  }
});
