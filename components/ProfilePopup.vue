<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm"
  >
    <div
      class="bg-[#050C1B] border border-blue-500/30 p-4 rounded-lg shadow-lg w-80 text-white relative"
    >
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
      >
        <Icon name="fa:times" size="18" />
      </button>

      <!-- Header with tabs -->
      <div class="text-center mb-3">
        <h3 class="text-lg font-bold">
          {{ activeTab === "profile" ? "My Profile" : "Change Password" }}
        </h3>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex flex-col items-center py-6">
        <div class="animate-pulse flex flex-col items-center w-full">
          <div class="w-16 h-16 rounded-full bg-blue-600/30 mb-3"></div>
          <div class="h-4 w-32 bg-blue-600/30 rounded mb-2"></div>
          <div class="h-3 w-24 bg-blue-600/30 rounded"></div>
        </div>
      </div>

      <!-- Profile Tab Content -->
      <template v-else-if="activeTab === 'profile'">
        <!-- Profile View Mode -->
        <div v-if="!isEditing">
          <div class="flex justify-center mb-4">
            <div class="relative">
              <div
                class="h-16 w-16 rounded-full overflow-hidden bg-blue-600/30 border-2 border-blue-500 flex items-center justify-center"
                title="Profile Picture"
              >
                <img
                  v-if="userProfile?.profile_picture_url"
                  :src="userProfile.profile_picture_url"
                  alt="Profile Picture"
                  class="h-full w-full object-cover"
                />
                <Icon v-else name="fa:user" class="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </div>

          <div class="space-y-3 px-1">
            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <label class="text-sm text-gray-300 block">First Name</label>
                <input
                  type="text"
                  :value="userProfile?.first_name || ''"
                  readonly
                  class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"
                  placeholder="First Name"
                />
              </div>
              <div class="space-y-1">
                <label class="text-sm text-gray-300 block">Last Name</label>
                <input
                  type="text"
                  :value="userProfile?.last_name || ''"
                  readonly
                  class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm text-gray-300 block">Username</label>
              <input
                type="text"
                :value="userProfile?.username || ''"
                readonly
                class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"
                placeholder="Username"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm text-gray-300 block">Email</label>
              <input
                type="email"
                :value="userProfile?.email || ''"
                readonly
                class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"
                placeholder="Email"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm text-gray-300 block">Phone Number</label>
              <input
                type="tel"
                :value="userProfile?.phone_number || ''"
                readonly
                class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"
                placeholder="Phone Number"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm text-gray-300 block">About Me</label>
              <textarea
                :value="userProfile?.about_me || ''"
                readonly
                rows="2"
                class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 min-h-[60px] resize-none text-sm"
                placeholder="Write something about yourself..."
              ></textarea>
            </div>

            <div class="space-y-2 pt-2">
              <!-- Profile Picture Button -->
              <button
                @click="openProfilePictureModal"
                class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1.5 px-4 rounded h-9 w-full text-sm flex items-center justify-center"
              >
                <Icon name="fa:camera" class="mr-2 h-3 w-3" />
                Change Profile Picture
              </button>

              <!-- Edit Profile Button -->
              <button
                @click="setEditing(true)"
                class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded h-9 w-full text-sm"
              >
                Edit Profile
              </button>
            </div>

            <div class="flex justify-center pt-1">
              <button
                @click="activeTab = 'password'"
                class="text-blue-400 text-sm hover:text-blue-300 hover:underline"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        <!-- Profile Edit Mode -->
        <form v-else @submit.prevent="handleProfileUpdate" class="space-y-3">
          <div class="flex justify-center mb-4">
            <div class="relative">
              <div
                class="h-16 w-16 rounded-full overflow-hidden bg-blue-600/30 border-2 border-blue-500 flex items-center justify-center"
                title="Profile Picture"
              >
                <img
                  v-if="userProfile?.profile_picture_url"
                  :src="userProfile.profile_picture_url"
                  alt="Profile Picture"
                  class="h-full w-full object-cover"
                />
                <Icon v-else name="fa:user" class="h-8 w-8 text-blue-400" />
              </div>
              <button
                @click="openProfilePictureModal"
                class="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                title="Change Profile Picture"
              >
                <Icon name="fa:camera" size="12" />
              </button>
            </div>
          </div>

          <div class="space-y-3 px-1">
            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <label class="text-sm text-gray-300 block">First Name</label>
                <input
                  type="text"
                  v-model="formData.first_name"
                  class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"
                  placeholder="First Name"
                />
              </div>
              <div class="space-y-1">
                <label class="text-sm text-gray-300 block">Last Name</label>
                <input
                  type="text"
                  v-model="formData.last_name"
                  class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm text-gray-300 block">Username</label>
              <input
                type="text"
                :value="userProfile?.username || ''"
                readonly
                class="w-full bg-[#0b1529]/70 text-gray-400 rounded border border-gray-700 p-2 h-9 text-sm"
                placeholder="Username"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm text-gray-300 block">Email</label>
              <input
                type="email"
                :value="userProfile?.email || ''"
                readonly
                class="w-full bg-[#0b1529]/70 text-gray-400 rounded border border-gray-700 p-2 h-9 text-sm"
                placeholder="Email"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm text-gray-300 block">Phone Number</label>
              <input
                type="tel"
                v-model="formData.phone_number"
                class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"
                placeholder="Phone Number"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm text-gray-300 block">About Me</label>
              <textarea
                v-model="formData.about_me"
                rows="2"
                class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 min-h-[60px] resize-none text-sm"
                placeholder="Write something about yourself..."
              ></textarea>
            </div>

            <div class="flex justify-between pt-2">
              <button
                type="button"
                @click="setEditing(false)"
                class="border border-gray-700 text-gray-300 bg-[#0b1529] hover:bg-[#0b1529]/90 font-medium py-1.5 px-4 rounded h-9 text-sm"
                :disabled="isSubmitting"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded h-9 text-sm"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? "Saving..." : "Save Changes" }}
              </button>
            </div>
          </div>
        </form>
      </template>

      <!-- Password Tab Content -->
      <!-- Profile Picture Modal -->
      <ProfilePictureModal
        v-if="showProfilePictureModal"
        :currentImageUrl="userProfile?.profile_picture_url"
        @close="showProfilePictureModal = false"
        @uploaded="onProfilePictureUploaded"
      />

      <template v-else-if="activeTab === 'password'">
        <form @submit.prevent="handlePasswordUpdate" class="space-y-3">
          <div class="space-y-1">
            <label class="text-sm text-gray-300 block">Current Password</label>
            <div class="relative">
              <input
                :type="showCurrentPassword ? 'text' : 'password'"
                v-model="passwordData.current_password"
                required
                class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                @click="showCurrentPassword = !showCurrentPassword"
              >
                <Icon
                  :name="showCurrentPassword ? 'fa:eye' : 'fa:eye-slash'"
                  size="16"
                />
              </button>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-sm text-gray-300 block">New Password</label>
            <div class="relative">
              <input
                :type="showNewPassword ? 'text' : 'password'"
                v-model="passwordData.new_password"
                required
                class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                @click="showNewPassword = !showNewPassword"
              >
                <Icon
                  :name="showNewPassword ? 'fa:eye' : 'fa:eye-slash'"
                  size="16"
                />
              </button>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-sm text-gray-300 block">Confirm Password</label>
            <div class="relative">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="passwordData.confirm_password"
                required
                class="w-full bg-[#0b1529] text-white rounded border border-gray-700 p-2 h-9 text-sm"
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <Icon
                  :name="showConfirmPassword ? 'fa:eye' : 'fa:eye-slash'"
                  size="16"
                />
              </button>
            </div>
            <p v-if="passwordMismatch" class="text-red-500 text-xs mt-1">
              Passwords do not match
            </p>
          </div>

          <div class="flex justify-between pt-3">
            <button
              type="button"
              @click="activeTab = 'profile'"
              class="border border-gray-700 text-gray-300 bg-[#0b1529] hover:bg-[#0b1529]/90 font-medium py-1.5 px-4 rounded h-9 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded h-9 text-sm"
              :disabled="isSubmitting || passwordMismatch"
            >
              {{ isSubmitting ? "Changing..." : "Change Password" }}
            </button>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/composables/useAuth";

// Define user profile interface
interface UserProfile {
  id?: string;
  email?: string;
  name?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  about_me?: string;
  profile_picture_url?: string;
  [key: string]: any; // Allow additional properties
}

const emit = defineEmits(["close"]);
const router = useRouter();
const { $toast } = useNuxtApp();
const authStore = useAuthStore();

// State variables
const isLoggingOut = ref(false);
const isLoading = ref(true);
const userProfile = ref<UserProfile | null>(null);
const activeTab = ref("profile");
const isEditing = ref(false);
const isSubmitting = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isUploadingProfilePicture = ref(false); // Added for profile picture upload state
const profilePicturePreview = ref<string | null>(null); // Added for profile picture preview

// Form data for profile edit
const formData = ref({
  first_name: "",
  last_name: "",
  phone_number: "",
  about_me: "",
});

// Form data for password change
const passwordData = ref({
  current_password: "",
  new_password: "",
  confirm_password: "",
});

// Computed properties
const displayName = computed(() => {
  if (!userProfile.value) return "User";

  if (userProfile.value.name) return userProfile.value.name;

  // Try first_name + last_name combination
  const firstName = userProfile.value.first_name || "";
  const lastName = userProfile.value.last_name || "";
  if (firstName || lastName) {
    return `${firstName} ${lastName}`.trim();
  }

  // Fallback to username or email
  return userProfile.value.username || userProfile.value.email || "User";
});

const passwordMismatch = computed((): boolean => {
  return Boolean(
    passwordData.value.new_password !== passwordData.value.confirm_password &&
      passwordData.value.confirm_password
  );
});

// Method to set editing mode
function setEditing(value: boolean) {
  isEditing.value = value;

  if (value && userProfile.value) {
    // Initialize form data with current user profile
    formData.value = {
      first_name: userProfile.value.first_name || "",
      last_name: userProfile.value.last_name || "",
      phone_number: userProfile.value.phone_number || "",
      about_me: userProfile.value.about_me || "",
    };
  }
}

// Method to handle profile update
async function handleProfileUpdate() {
  try {
    isSubmitting.value = true;

    // Call the updateProfile method from useAuth
    await authStore.updateProfile(formData.value);

    // Fetch the updated user profile
    await loadUserProfile();

    $toast.success("Profile updated successfully");
    setEditing(false);
  } catch (error: any) {
    console.error("Profile update error:", error);
    $toast.error(error.message || "Failed to update profile");
  } finally {
    isSubmitting.value = false;
  }
}

// Method to handle password update
async function handlePasswordUpdate() {
  if (passwordMismatch.value) {
    $toast.error("Passwords do not match");
    return;
  }

  try {
    isSubmitting.value = true;

    // Call the changePassword method from useAuth
    await authStore.changePassword({
      current_password: passwordData.value.current_password,
      new_password: passwordData.value.new_password,
    });

    // Reset password form
    passwordData.value = {
      current_password: "",
      new_password: "",
      confirm_password: "",
    };

    $toast.success("Password changed successfully");
    activeTab.value = "profile";
  } catch (error: any) {
    console.error("Password update error:", error);
    $toast.error(error.message || "Failed to change password");
  } finally {
    isSubmitting.value = false;
  }
}

// State for profile picture modal
const showProfilePictureModal = ref(false);

// Method to open the profile picture modal
function openProfilePictureModal() {
  showProfilePictureModal.value = true;
}

// Method to load user profile data
async function loadUserProfile() {
  isLoading.value = true;
  try {
    // Use existing user data if available
    if (authStore.user) {
      userProfile.value = { ...authStore.user } as UserProfile;
    }

    // Fetch latest user data
    const userData = await authStore.getUserInfo();
    if (userData) {
      userProfile.value = userData as UserProfile;
    }
  } catch (error) {
    console.error("Failed to load user profile:", error);
    $toast.error("Failed to load profile data");

    // Use existing data as fallback
    if (!userProfile.value && authStore.user) {
      userProfile.value = { ...authStore.user } as UserProfile;
    }
  } finally {
    isLoading.value = false;
  }
}

const goToSettings = () => {
  emit("close");
  router.push("/settings");
};

// Load user profile when component mounts
onMounted(async () => {
  await loadUserProfile();
});

// Handle when an avatar is uploaded via the modal
function onProfilePictureUploaded(newPictureUrl: string) {
  // Update the user profile with the new avatar URL
  if (userProfile.value) {
    userProfile.value.profile_picture_url = newPictureUrl;
  }

  // Update the auth store user data
  if (authStore.user) {
    authStore.user.profile_picture_url = newPictureUrl;
  }

  // Hide the modal
  showProfilePictureModal.value = false;
}

// No need for cleanup as we no longer use blob URLs directly
</script>
