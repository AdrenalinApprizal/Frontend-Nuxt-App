import { toast } from "vue3-toastify";
import type { ToastOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast: {
        success: (message: string, options?: ToastOptions) =>
          toast.success(message, options),
        error: (message: string, options?: ToastOptions) =>
          toast.error(message, options),
        info: (message: string, options?: ToastOptions) =>
          toast.info(message, options),
        warning: (message: string, options?: ToastOptions) =>
          toast.warning(message, options),
      },
    },
  };
});
