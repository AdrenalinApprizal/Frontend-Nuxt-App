import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/composables/useAuth";
import Cookies from "js-cookie";

export default defineNuxtPlugin((nuxtApp) => {
  // Mendapatkan konfigurasi runtime
  const config = useRuntimeConfig();

  // Define a global fetch function that includes authentication headers
  const apiFetch = async (url: string, options: RequestInit = {}) => {
    // Get store only when needed (avoid hydration issues)
    const authStore = useAuthStore();

    // Get auth token either from store or directly from cookie in case store isn't initialized yet
    const token =
      authStore.token || (process.client ? Cookies.get("auth_token") : null);

    // Prepare headers with auth token if available
    const headerOptions: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Only add Authorization and Cookie headers if we have a token
    if (token) {
      headerOptions["Authorization"] = `Bearer ${token}`;
      headerOptions["Cookie"] = `auth_token=${token}`;
    }

    const headers = new Headers(headerOptions);

    // Create new options with merged headers
    const mergedOptions: RequestInit = {
      ...options,
      headers,
      // Gunakan 'same-origin' sebagai default agar tidak terjadi masalah CORS
      // hanya gunakan 'include' jika server API dikonfigurasi untuk menerima credentials
      credentials: options.credentials || "same-origin",
    };

    // Complete URL with base URL, now using the internal proxy
    // This ensures that the request goes through our proxy which handles routing and CORS
    const completeUrl = url.startsWith("http")
      ? url
      : // Use the internal proxy endpoint instead of direct API access
        `/api/proxy${url.startsWith("/") ? url : `/${url}`}`;

    // Log request untuk debugging
    console.log(`API ${options.method || "GET"} request to:`, completeUrl);

    try {
      // Make the fetch request
      const response = await fetch(completeUrl, mergedOptions);

      // Log response untuk debugging
      console.log(
        `API response from ${completeUrl}:`,
        response.status,
        response.statusText
      );

      // Check if response is ok (status in the range 200-299)
      if (!response.ok) {
        // Try to get error details from response
        let errorDetail;
        const contentType = response.headers.get("content-type");

        try {
          if (contentType && contentType.includes("application/json")) {
            errorDetail = await response.json();
          } else {
            errorDetail = await response.text();
          }
        } catch (parseError) {
          console.warn("Could not parse error response:", parseError);
          errorDetail = "Could not parse server response";
        }

        // Create custom error with details
        const error = new Error(
          typeof errorDetail === "string"
            ? errorDetail
            : errorDetail?.message ||
              `API Error: ${response.status} ${response.statusText}`
        );
        // Add response and parsed details to error object
        (error as any).status = response.status;
        (error as any).response = response;
        (error as any).data = errorDetail;

        throw error;
      }

      return response;
    } catch (error) {
      console.error(`API request to ${completeUrl} failed:`, error);
      throw error;
    }
  };

  // Helper to safely parse JSON responses
  const parseJsonResponse = async (response: Response) => {
    try {
      return await response.json();
    } catch (error) {
      console.error("JSON parsing error:", error);

      // Try to get the text content to see what went wrong
      try {
        const textContent = await response.clone().text();
        const truncatedContent =
          textContent.length > 100
            ? `${textContent.substring(0, 100)}...`
            : textContent;

        console.error("Response was not valid JSON:", truncatedContent);
        throw new Error(
          `Invalid JSON response from server. Received: ${truncatedContent}`
        );
      } catch (textError) {
        throw new Error("Could not parse server response as JSON");
      }
    }
  };

  // Create API helper for common HTTP methods
  const api = {
    fetch: apiFetch,

    // Base URL helper - now using internal proxy
    baseUrl: "/api/proxy",

    // GET request helper with JSON parsing
    async get<T = any>(url: string, options: RequestInit = {}): Promise<T> {
      const response = await apiFetch(url, {
        ...options,
        method: "GET",
      });
      return parseJsonResponse(response) as Promise<T>;
    },

    // POST request helper with JSON parsing
    async post<T = any>(
      url: string,
      data: any,
      options: RequestInit = {}
    ): Promise<T> {
      const response = await apiFetch(url, {
        ...options,
        method: "POST",
        body: JSON.stringify(data),
      });
      return parseJsonResponse(response) as Promise<T>;
    },

    // PUT request helper with JSON parsing
    async put<T = any>(
      url: string,
      data: any,
      options: RequestInit = {}
    ): Promise<T> {
      const response = await apiFetch(url, {
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
      });
      return parseJsonResponse(response) as Promise<T>;
    },

    // PATCH request helper with JSON parsing
    async patch<T = any>(
      url: string,
      data: any,
      options: RequestInit = {}
    ): Promise<T> {
      const response = await apiFetch(url, {
        ...options,
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return parseJsonResponse(response) as Promise<T>;
    },

    // DELETE request helper with JSON parsing
    async delete<T = any>(url: string, options: RequestInit = {}): Promise<T> {
      const response = await apiFetch(url, {
        ...options,
        method: "DELETE",
      });
      return parseJsonResponse(response) as Promise<T>;
    },

    // Raw versions that return the Response object without parsing JSON
    raw: {
      get: (url: string, options: RequestInit = {}) => {
        return apiFetch(url, {
          ...options,
          method: "GET",
        });
      },
      post: (url: string, data: any, options: RequestInit = {}) => {
        // Special handling for FormData - don't stringify it
        const body = data instanceof FormData ? data : JSON.stringify(data);
        const contentTypeHeaders: Record<string, string> =
          data instanceof FormData
            ? {} // Let browser set appropriate content-type with boundary for FormData
            : { "Content-Type": "application/json" };

        return apiFetch(url, {
          ...options,
          method: "POST",
          headers: {
            ...contentTypeHeaders,
            ...(options.headers || {}),
          },
          body,
        });
      },
      put: (url: string, data: any, options: RequestInit = {}) => {
        // Special handling for FormData - don't stringify it
        const body = data instanceof FormData ? data : JSON.stringify(data);
        const contentTypeHeaders: Record<string, string> =
          data instanceof FormData
            ? {} // Let browser set appropriate content-type with boundary for FormData
            : { "Content-Type": "application/json" };

        return apiFetch(url, {
          ...options,
          method: "PUT",
          headers: {
            ...contentTypeHeaders,
            ...(options.headers || {}),
          },
          body,
        });
      },
      patch: (url: string, data: any, options: RequestInit = {}) => {
        return apiFetch(url, {
          ...options,
          method: "PATCH",
          body: JSON.stringify(data),
        });
      },
      delete: (url: string, options: RequestInit = {}) => {
        return apiFetch(url, {
          ...options,
          method: "DELETE",
        });
      },
    },

    // Check server connectivity
    checkServerStatus: async (url: string) => {
      try {
        // Coba menggunakan OPTIONS untuk menghindari pembatasan CORS untuk preflight requests
        const response = await fetch(url, {
          method: "OPTIONS",
          cache: "no-cache",
          headers: {
            Accept: "application/json",
          },
        }).catch(() => {
          // Jika OPTIONS gagal, coba dengan GET
          return fetch(url, {
            method: "GET",
            cache: "no-cache",
            headers: {
              Accept: "application/json",
            },
          });
        });

        return {
          online: true,
          status: response.status,
          statusText: response.statusText,
        };
      } catch (error: any) {
        return {
          online: false,
          error: error.message || "Unknown error",
          isCors: error.message?.includes("CORS") || false,
        };
      }
    },
  };

  // Make the API available in the Nuxt app
  nuxtApp.provide("api", api);
});

// Type definition for the API
declare module "#app" {
  interface NuxtApp {
    $api: {
      fetch: (url: string, options?: RequestInit) => Promise<Response>;
      get<T = any>(url: string, options?: RequestInit): Promise<T>;
      post<T = any>(url: string, data: any, options?: RequestInit): Promise<T>;
      put<T = any>(url: string, data: any, options?: RequestInit): Promise<T>;
      patch<T = any>(url: string, data: any, options?: RequestInit): Promise<T>;
      delete<T = any>(url: string, options?: RequestInit): Promise<T>;
      raw: {
        get: (url: string, options?: RequestInit) => Promise<Response>;
        post: (
          url: string,
          data: any,
          options?: RequestInit
        ) => Promise<Response>;
        put: (
          url: string,
          data: any,
          options?: RequestInit
        ) => Promise<Response>;
        patch: (
          url: string,
          data: any,
          options?: RequestInit
        ) => Promise<Response>;
        delete: (url: string, options?: RequestInit) => Promise<Response>;
      };
      checkServerStatus: (url: string) => Promise<{
        online: boolean;
        status?: number;
        statusText?: string;
        error?: string;
        isCors?: boolean;
      }>;
      baseUrl: string;
    };
  }
}
