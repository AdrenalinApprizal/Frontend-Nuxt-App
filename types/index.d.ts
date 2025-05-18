import type { ToastOptions } from "vue3-toastify";

declare module "#app" {
  interface NuxtApp {
    $toast: {
      success: (message: string, options?: ToastOptions) => void;
      error: (message: string, options?: ToastOptions) => void;
      info: (message: string, options?: ToastOptions) => void;
      warning: (message: string, options?: ToastOptions) => void;
    };
  }
}
