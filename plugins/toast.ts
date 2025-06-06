import { toast } from "vue3-toastify";
import type { ToastOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default defineNuxtPlugin(() => {
  // Default toast options that work in both client and server environments
  const defaultOptions: ToastOptions = {
    autoClose: 3000,
    position: "top-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    // Ensure container is only created on client side to avoid location errors
    ...(process.client ? {} : { container: false }),
  };

  return {
    provide: {
      toast: {
        success: (message: string, options?: ToastOptions) => {
          // Only show toasts on client side to avoid SSR issues
          if (process.client) {
            return toast.success(message, { ...defaultOptions, ...options });
          }
          console.log(`[Toast] Success (SSR): ${message}`);
        },
        error: (message: string, options?: ToastOptions) => {
          if (process.client) {
            return toast.error(message, { ...defaultOptions, ...options });
          }
          console.error(`[Toast] Error (SSR): ${message}`);
        },
        info: (message: string, options?: ToastOptions) => {
          if (process.client) {
            return toast.info(message, { ...defaultOptions, ...options });
          }
          console.info(`[Toast] Info (SSR): ${message}`);
        },
        warning: (message: string, options?: ToastOptions) => {
          if (process.client) {
            return toast.warning(message, { ...defaultOptions, ...options });
          }
          console.warn(`[Toast] Warning (SSR): ${message}`);
        },
      },
    },
  };
});
