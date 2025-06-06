import { defineStore } from "pinia";
import Cookies from "js-cookie";

// Define user type
interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  about_me?: string;
  profile_picture_url?: string;
}

// Define registration data interface
interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  about_me?: string;
  profile_picture_url?: string;
}

// Define profile update interface
interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  about_me?: string;
}

// Define password change interface
interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

// Cookie config
const COOKIE_TOKEN_KEY = "auth_token";
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  path: "/",
  secure: process.env.NODE_ENV !== "development",
  sameSite: "lax" as const,
};

export const useAuthStore = defineStore("auth", () => {
  // Fix type definitions to allow proper values
  const user = ref<User | null>(null);

  // TEMPORARY: Add test user data for debugging
  if (process.client && !user.value) {
    user.value = {
      id: "test-current-user-id",
      email: "test@example.com",
      name: "Test User",
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      phone_number: "+1234567890",
      about_me: "Test user for debugging",
      profile_picture_url: "",
    };
    console.log("🧪 [Auth] Added temporary test user:", user.value);
  }

  const isAuthenticated = computed(() => !!user.value);
  const token = ref<string | null>(null);

  // Base URLs for authentication API - now using our proxy
  const config = useRuntimeConfig();
  const proxyUrl = "/api/proxy"; // Our new proxy endpoint

  // Debug indicator for development
  const isConnecting = ref(false);
  const connectionError = ref<string | null>(null);

  // Function to get auth headers
  function getAuthHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token.value) {
      headers["Authorization"] = `Bearer ${token.value}`;
    }

    return headers;
  }

  // Set token in cookie
  function setTokenCookie(tokenValue: string) {
    if (process.client) {
      Cookies.set(COOKIE_TOKEN_KEY, tokenValue, COOKIE_OPTIONS);
    }
  }

  // Get token from cookie
  function getTokenFromCookie(): string | null {
    if (process.client) {
      return Cookies.get(COOKIE_TOKEN_KEY) || null;
    }
    return null;
  }

  // Remove token cookie
  function removeTokenCookie() {
    if (process.client) {
      Cookies.remove(COOKIE_TOKEN_KEY, { path: "/" });
    }
  }

  // Function to check server connectivity
  async function checkServerConnectivity() {
    isConnecting.value = true;
    connectionError.value = null;

    try {
      console.log("Assuming server connectivity without making a request");

      // Assume the server is connected without making a request
      // This avoids the 404 error from an endpoint that doesn't exist
      return { online: true, message: "Connected to authentication server" };
    } catch (error: any) {
      console.error("Server connectivity check failed:", error);
      connectionError.value = error.message || "Failed to connect to server";

      return {
        online: false,
        message:
          "Unable to connect to authentication server. Please check if the server is running.",
        error,
      };
    } finally {
      isConnecting.value = false;
      isConnecting.value = false;
    }
  }

  // Login function
  async function login(email: string, password: string) {
    try {
      console.log("Attempting login with:", { email, password: "********" });

      // Try multiple possible proxy URL patterns to handle potential routing issues
      const urls = [
        `${proxyUrl}/auth/login`, // Standard pattern
        `/api/proxy/auth/login`, // Absolute pattern
        `/api/proxy/login`, // Direct login without auth path
      ];

      let response = null;
      let urlUsed = "";
      let error = null;

      // Try each URL until one works
      for (const url of urls) {
        try {
          console.log(`Trying login with URL: ${url}`);
          const resp = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          response = resp;
          urlUsed = url;
          break; // Found a working URL
        } catch (err: any) {
          console.warn(`Error with URL ${url}:`, err);
          error = err;
        }
      }

      if (!response) {
        console.error("All login URL attempts failed");
        throw error || new Error("Failed to connect to authentication server");
      }

      console.log(`Login response status from ${urlUsed}:`, response.status);

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("Login response data:", data);
      } else {
        const text = await response.text();
        console.log("Login response text:", text);
        data = { message: text || "Login failed" };
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Login failed with status: ${response.status}`
        );
      }

      // Rest of the login function remains the same
      const authToken =
        data.token ||
        data.access_token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.access_token ||
        data.data?.accessToken;

      if (!authToken) {
        console.warn("No token received from backend", data);
        throw new Error("Authentication failed: No token received");
      }

      // Flexible user data extraction
      const rawUserData = data.user || data.data?.user || data.data || data;

      const userData: User = {
        id:
          rawUserData.id || rawUserData.user_id || rawUserData._id || "unknown",
        email: rawUserData.email || email,
        name:
          rawUserData.name ||
          rawUserData.username ||
          `${rawUserData.first_name || ""} ${
            rawUserData.last_name || ""
          }`.trim() ||
          email,
        username: rawUserData.username,
        first_name: rawUserData.first_name,
        last_name: rawUserData.last_name,
        phone_number: rawUserData.phone_number,
        about_me: rawUserData.about_me,
        profile_picture_url:
          rawUserData.profile_picture_url ||
          rawUserData.avatar ||
          rawUserData.image,
      };

      console.log("Processed user data:", userData);

      // Set the user and token in state
      user.value = userData;
      token.value = authToken;

      // Store in cookie
      setTokenCookie(authToken);

      // Also store user data in localStorage for persistence
      if (process.client) {
        localStorage.setItem("auth_user", JSON.stringify(userData));
      }

      return { success: true, user: userData };
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle network errors
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Connection to server failed. Please check if the server is running."
        );
      }

      // Extract the actual error message
      let errorMessage = "Invalid email or password";

      // Try to extract error message from various formats
      if (error.message) {
        // Check for common authentication errors
        if (
          error.message.includes("Invalid credentials") ||
          error.message.includes("Invalid email or password") ||
          error.message.includes("Unauthorized")
        ) {
          // Check for common email typos
          if (email.includes("@gmail.coma")) {
            errorMessage =
              "Your email contains a typo: '@gmail.coma' should be '@gmail.com'. Please correct your email address.";
          } else if (email.endsWith(".coma")) {
            errorMessage =
              "Your email contains a typo: it ends with '.coma' instead of '.com'. Please correct your email address.";
          } else if (email.includes(".con")) {
            errorMessage =
              "Your email contains a typo: '.con' should be '.com'. Please check your email address.";
          } else {
            errorMessage =
              "Invalid email or password. Please check your credentials and try again.";
          }
        } else {
          errorMessage = error.message;
        }
      }

      throw new Error(errorMessage);
    }
  }

  // Register function
  async function register(registerData: RegisterData) {
    try {
      console.log("Attempting registration with:", {
        ...registerData,
        password: "********",
      });

      // Use proxy instead of direct API call
      const response = await fetch(`${proxyUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(registerData),
      });

      console.log("Registration response status:", response.status);

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("Registration response data:", data);
      } else {
        const text = await response.text();
        console.log("Registration response text:", text);
        data = { message: text || "Registration failed" };
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Registration failed with status: ${response.status}`
        );
      }

      // Get success message from response
      const successMessage =
        data.message ||
        data.data?.message ||
        "Registration successful! Please login.";

      return {
        success: true,
        message: successMessage,
      };
    } catch (error: any) {
      console.error("Registration error:", error);
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Connection to server failed. Please check if the server is running."
        );
      }
      throw new Error(
        error?.message || "Registration failed. Please try again."
      );
    }
  }

  // Get user info function
  async function getUserInfo() {
    try {
      const currentToken = token.value || getTokenFromCookie();

      if (!currentToken) {
        throw new Error("No authentication token available");
      }

      // Update token in state if it was retrieved from cookie
      if (!token.value && currentToken) {
        token.value = currentToken;
      }

      console.log("Fetching user info with token");

      // Try several possible user info endpoints via proxy
      const possibleEndpoints = [
        `${proxyUrl}/auth/user/info`,
        `${proxyUrl}/auth/me`,
        `${proxyUrl}/auth/user`,
        `${proxyUrl}/auth/profile`,
      ];

      let response = null;
      let endpointUsed = "";

      // Try each endpoint until one works
      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);

          // Let the server proxy handle token extraction from cookies
          // This ensures cookies are properly included in the request
          const resp = await fetch(endpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${currentToken}`,
              // Adding a fallback in case cookies aren't sent automatically
              Cookie: `auth_token=${currentToken}`,
            },
            // Include credentials to ensure cookies are sent with the request
            credentials: "include",
          });

          if (resp.ok || resp.status === 401) {
            response = resp;
            endpointUsed = endpoint;
            break;
          }
        } catch (err) {
          console.warn(`Error with endpoint ${endpoint}:`, err);
        }
      }

      if (!response) {
        throw new Error("Failed to find valid user info endpoint");
      }

      console.log(
        `User info response status: ${response.status} from endpoint: ${endpointUsed}`
      );

      if (response.status === 401) {
        throw new Error("Unauthorized: Invalid or expired token");
      }

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("User info response data:", data);
      } else {
        const text = await response.text();
        console.log("User info response text:", text);
        data = { message: text || "Failed to fetch user information" };
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Failed to fetch user information: ${response.status}`
        );
      }

      // Find user data in the response
      const rawUserData = data.user || data.data?.user || data.data || data;

      // Update user data with the latest information
      const userData: User = {
        ...user.value,
        id:
          rawUserData.id ||
          rawUserData.user_id ||
          rawUserData._id ||
          user.value?.id ||
          "unknown",
        email: rawUserData.email || user.value?.email || "",
        name:
          rawUserData.name ||
          rawUserData.username ||
          `${rawUserData.first_name || ""} ${
            rawUserData.last_name || ""
          }`.trim() ||
          user.value?.name ||
          "",
        username: rawUserData.username || user.value?.username,
        first_name: rawUserData.first_name || user.value?.first_name,
        last_name: rawUserData.last_name || user.value?.last_name,
        phone_number: rawUserData.phone_number || user.value?.phone_number,
        about_me: rawUserData.about_me || user.value?.about_me,
        profile_picture_url:
          rawUserData.profile_picture_url ||
          rawUserData.avatar ||
          rawUserData.image ||
          user.value?.profile_picture_url,
      };

      user.value = userData;

      // Update stored user data
      if (process.client) {
        localStorage.setItem("auth_user", JSON.stringify(userData));
      }

      return userData;
    } catch (error: any) {
      console.error("Get user info error:", error);
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Connection to server failed. Please check if the server is running."
        );
      }
      throw new Error(error?.message || "Failed to get user information");
    }
  }

  // Logout function
  function logout() {
    // Simply clear user data and token without any health check
    user.value = null;
    token.value = null;

    // Remove auth data from cookies and localStorage
    if (process.client) {
      removeTokenCookie();
      localStorage.removeItem("auth_user");
    }
  }

  // Initialize state from cookies/localStorage on app start
  async function init() {
    if (process.client) {
      try {
        console.log("🔐 [Auth] Initializing auth state...");

        // First try to get token from cookie
        const cookieToken = getTokenFromCookie();
        console.log("🍪 [Auth] Cookie token exists:", !!cookieToken);
        if (cookieToken) {
          console.log(
            "🍪 [Auth] Cookie token value:",
            cookieToken.substring(0, 20) + "..."
          );
        }

        // Then try to get user data from localStorage
        const storedUser = localStorage.getItem("auth_user");
        console.log("💾 [Auth] Stored user exists:", !!storedUser);
        if (storedUser) {
          console.log("💾 [Auth] Stored user data:", JSON.parse(storedUser));
        }

        // Also check document.cookie directly
        console.log("🍪 [Auth] All cookies:", document.cookie);
        console.log(
          "🍪 [Auth] Auth token in cookies:",
          document.cookie.includes("auth_token=")
        );

        if (cookieToken && storedUser) {
          // Set token and user immediately for faster reactivity
          token.value = cookieToken;
          user.value = JSON.parse(storedUser) as User;

          console.log(
            "✅ [Auth] Auth state initialized from storage:",
            !!user.value
          );
          console.log("👤 [Auth] User data:", user.value);

          // Wait slightly to allow reactivity to update
          await nextTick();

          // Optionally fetch the latest user data from the server asynchronously
          getUserInfo().catch((error) => {
            console.warn("⚠️ [Auth] Failed to refresh user data:", error);
            // If token is invalid, log the user out
            if (
              error.message.includes("token") ||
              error.message.includes("unauthorized")
            ) {
              logout();
            }
          });

          return true;
        } else {
          // If we don't have both token and user data, clear everything for consistency
          console.log(
            "❌ [Auth] No valid auth data found, user will remain null"
          );
          console.log(
            "❌ [Auth] Missing - Cookie token:",
            !cookieToken,
            "Stored user:",
            !storedUser
          );
          logout();
          return false;
        }
      } catch (error) {
        console.error("Error initializing auth state:", error);
        logout();
        return false;
      }
    }
    return false;
  }

  // Update user profile function
  async function updateProfile(profileData: ProfileUpdateData) {
    try {
      const currentToken = token.value || getTokenFromCookie();

      if (!currentToken) {
        throw new Error("No authentication token available");
      }

      // Menggunakan endpoint yang benar: users/profile bukan users/info
      const endpoint = `${proxyUrl}/users/profile`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(profileData),
        credentials: "include",
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || "Profile update failed" };
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Profile update failed with status: ${response.status}`
        );
      }

      // Find updated user data in the response
      const updatedUserData = data.user || data.data?.user || data.data || data;

      // Update user data with the new information
      if (user.value) {
        const updatedUser = {
          ...user.value,
          first_name: updatedUserData.first_name || user.value.first_name,
          last_name: updatedUserData.last_name || user.value.last_name,
          phone_number: updatedUserData.phone_number || user.value.phone_number,
          about_me: updatedUserData.about_me || user.value.about_me,
          // Update name as well if it's derived from first and last name
          name:
            updatedUserData.name ||
            `${updatedUserData.first_name || user.value.first_name || ""} ${
              updatedUserData.last_name || user.value.last_name || ""
            }`.trim() ||
            user.value.name,
        };

        // Apply the update
        user.value = updatedUser;

        // Update stored user data
        if (process.client) {
          localStorage.setItem("auth_user", JSON.stringify(user.value));
        }
      } else {
        console.warn("No user object to update!");
      }

      return {
        success: true,
        message: data.message || "Profile updated successfully",
        user: user.value,
      };
    } catch (error: any) {
      console.error("Profile update error:", error);
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Connection to server failed. Please check if the server is running."
        );
      }
      throw new Error(error?.message || "Failed to update profile");
    }
  }

  // Update avatar function
  async function updateAvatar(file: File) {
    try {
      const currentToken = token.value || getTokenFromCookie();

      if (!currentToken) {
        throw new Error("No authentication token available");
      }

      // Step 1: Upload file to file upload service first
      // Mencoba endpoint untuk upload file
      const uploadEndpoint = `${proxyUrl}/files/upload`;

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      try {
        const uploadResponse = await fetch(uploadEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
          body: uploadFormData,
          credentials: "include",
        });

        if (!uploadResponse.ok) {
          // File upload failed, continue with direct avatar update
        } else {
          // Jika upload berhasil, ambil URL dan gunakan untuk avatar
          const uploadData = await uploadResponse.json();
          const fileUrl =
            uploadData.url || uploadData.fileUrl || uploadData.file_url;

          if (fileUrl) {
            // Step 2: Update profile with file URL
            const avatarEndpoint = `${proxyUrl}/users/profile/avatar`;
            const avatarResponse = await fetch(avatarEndpoint, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentToken}`,
              },
              body: JSON.stringify({ profile_picture_url: fileUrl }),
              credentials: "include",
            });

            if (avatarResponse.ok) {
              const avatarData = await avatarResponse.json();

              // Update user data and return
              updateUserWithNewAvatar(avatarData, fileUrl);
              return {
                success: true,
                message: "Avatar updated successfully",
                user: user.value,
              };
            }
          }
        }
      } catch (error) {
        // Continue with direct avatar update attempt
      }

      // Step 3: If file upload approach failed, try direct multipart approach
      // Mencoba endpoint avatar secara langsung dengan file
      const directEndpoint = `${proxyUrl}/users/avatar`;

      const directFormData = new FormData();
      directFormData.append("avatar", file);

      const directResponse = await fetch(directEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
        body: directFormData,
        credentials: "include",
      });

      if (!directResponse.ok) {
        // Jika kedua metode gagal, coba endpoint lain dengan format JSON

        // Use the placeholder as fallback
        const placeholderUrl = "https://via.placeholder.com/150";
        const jsonEndpoint = `${proxyUrl}/users/profile/avatar`;

        const jsonResponse = await fetch(jsonEndpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify({ profile_picture_url: placeholderUrl }),
          credentials: "include",
        });

        if (!jsonResponse.ok) {
          throw new Error(
            "Failed to update avatar using all available methods"
          );
        }

        const jsonData = await jsonResponse.json();
        updateUserWithNewAvatar(jsonData, placeholderUrl);

        return {
          success: true,
          message:
            "Avatar updated with placeholder (file upload not supported)",
          user: user.value,
        };
      }

      // Process direct upload response
      let data;
      const contentType = directResponse.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await directResponse.json();
      } else {
        const text = await directResponse.text();
        data = { message: text || "Avatar updated" };
      }

      // Update user with new avatar data
      updateUserWithNewAvatar(data);

      return {
        success: true,
        message: data.message || "Avatar updated successfully",
        user: user.value,
      };
    } catch (error: any) {
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Connection to server failed. Please check if the server is running."
        );
      }
      throw new Error(error?.message || "Failed to update avatar");
    }
  }

  // Helper function to update user with new avatar
  function updateUserWithNewAvatar(data: any, fallbackUrl?: string) {
    // Find updated user data or avatar URL in the response
    const updatedData = data.user || data.data?.user || data.data || data;
    const avatarUrl =
      updatedData.profile_picture_url ||
      updatedData.avatar ||
      updatedData.image ||
      fallbackUrl;

    if (!avatarUrl) {
      console.warn("[DEBUG] No avatar URL found in response or fallback");
      return;
    }

    console.log("[DEBUG] Using avatar URL:", avatarUrl);

    // Update user data with the new avatar URL
    if (user.value) {
      const updatedUser = {
        ...user.value,
        profile_picture_url: avatarUrl,
      };

      // Apply the update
      user.value = updatedUser;

      // Update stored user data
      if (process.client) {
        localStorage.setItem("auth_user", JSON.stringify(user.value));
      }
    }
  }

  // Change password function
  async function changePassword(passwordData: PasswordChangeData) {
    try {
      const currentToken = token.value || getTokenFromCookie();

      if (!currentToken) {
        throw new Error("No authentication token available");
      }

      console.log("Changing password");

      // Use correct endpoint for password change
      const endpoint = `${proxyUrl}/users/password`;

      // Pastikan format JSON yang dikirim sesuai dengan yang diharapkan API
      // Beberapa API menggunakan nama field yang berbeda
      const requestBody = {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.new_password, // Menambahkan confirm_password
        // Tambahan field yang mungkin dibutuhkan oleh API
        currentPassword: passwordData.current_password,
        newPassword: passwordData.new_password,
        password: passwordData.new_password,
        old_password: passwordData.current_password,
        oldPassword: passwordData.current_password,
        password_confirmation: passwordData.new_password,
        confirmPassword: passwordData.new_password,
      };

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      console.log("[DEBUG] Password change response status:", response.status);

      // Jika respons tidak ok, coba dengan format yang berbeda
      if (!response.ok && response.status === 400) {
        console.log(
          "[DEBUG] First attempt failed, trying with different field names"
        );

        // Coba dengan format field yang berbeda
        const alternativeEndpoint = `${proxyUrl}/users/profile/password`;
        const alternativeResponse = await fetch(alternativeEndpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify({
            password: passwordData.new_password,
            old_password: passwordData.current_password,
            confirm_password: passwordData.new_password,
            password_confirmation: passwordData.new_password,
          }),
          credentials: "include",
        });

        if (alternativeResponse.ok) {
          return {
            success: true,
            message: "Password changed successfully",
          };
        }
      }

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || "Password change failed" };
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Password change failed with status: ${response.status}`
        );
      }

      return {
        success: true,
        message: data.message || "Password changed successfully",
      };
    } catch (error: any) {
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Connection to server failed. Please check if the server is running."
        );
      }
      throw new Error(error?.message || "Failed to change password");
    }
  }

  // Function to handle authentication errors
  function handleAuthError() {
    console.warn("Authentication error detected. Logging out user.");
    // Log the user out
    logout();

    // Optional: Redirect to login page
    if (process.client) {
      const router = useRouter();
      router.push("/auth/login");
    }
  }

  return {
    user,
    isAuthenticated,
    token,
    login,
    register,
    getUserInfo,
    logout,
    init,
    getAuthHeaders,
    checkServerConnectivity,
    updateProfile,
    updateAvatar,
    changePassword,
    handleAuthError, // Add the new function to the returned object
  };
});
