<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm"
  >
    <div
      class="bg-[#050C1B] border border-blue-500/30 p-4 rounded-lg shadow-lg max-w-md w-full text-white relative"
    >
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
      >
        <Icon name="fa:times" size="18" />
      </button>

      <!-- Header -->
      <div class="text-center mb-4">
        <h3 class="text-lg font-bold">Change Profile Picture</h3>
      </div>

      <!-- Content -->
      <div class="flex flex-col items-center justify-center space-y-4">
        <!-- Preview Area -->
        <div
          class="w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500 flex items-center justify-center bg-blue-600/30"
          :class="{ 'animate-pulse': isUploading }"
        >
          <template v-if="isUploading">
            <div
              class="h-full w-full flex items-center justify-center bg-black bg-opacity-60"
            >
              <div
                class="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent border-blue-400"
              ></div>
            </div>
          </template>
          <template v-else-if="previewUrl">
            <img
              :src="previewUrl"
              alt="Preview"
              class="h-full w-full object-cover"
            />
          </template>
          <template v-else-if="currentImageUrl">
            <img
              :src="currentImageUrl"
              alt="Current Profile Picture"
              class="h-full w-full object-cover"
            />
          </template>
          <template v-else>
            <Icon name="fa:user" class="h-16 w-16 text-blue-400" />
          </template>
        </div>

        <!-- Upload Controls -->
        <div class="w-full">
          <div v-if="!previewUrl && !isUploading" class="text-center space-y-6">
            <p class="text-gray-300 text-sm">Choose a new profile picture</p>
            <button
              @click="triggerFileInput"
              class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded w-full"
            >
              <Icon name="fa:upload" class="mr-2" />
              Select Image
            </button>
          </div>

          <div v-if="previewUrl && !isUploading" class="space-y-4 mt-4">
            <div class="text-sm text-gray-300 text-center">
              <p>Selected image preview</p>
            </div>
            <div class="flex justify-between">
              <button
                @click="cancelSelection"
                class="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded w-1/2 mr-2"
              >
                Cancel
              </button>
              <button
                @click="uploadImage"
                class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded w-1/2"
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref="fileInput"
        @change="onFileSelected"
        accept="image/*"
        class="hidden"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/composables/useAuth";

const { $toast, $api } = useNuxtApp();
const emit = defineEmits(["close", "uploaded"]);
const authStore = useAuthStore();

// Props
const props = defineProps({
  currentImageUrl: {
    type: String,
    default: "",
  },
});

// State
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const isUploading = ref(false);

// Functions
function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    selectedFile.value = file;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      $toast.error("Please select an image file");
      resetSelection();
      return;
    }

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      $toast.error("Image size should be less than 5MB");
      resetSelection();
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function cancelSelection() {
  resetSelection();
}

function resetSelection() {
  selectedFile.value = null;
  previewUrl.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}

async function uploadImage() {
  if (!selectedFile.value) return;

  try {
    isUploading.value = true;

    // First, we need to upload the file to a hosting service and get a URL
    // Since we don't know how the file uploading is actually implemented in your backend,
    // we'll do this in two steps:

    // 1. First, convert the file to a base64 string
    const reader = new FileReader();
    const filePromise = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(selectedFile.value!);
    });

    const base64String = (await filePromise) as string;
    console.log("File converted to base64, sending to API...");

    // 2. Send the URL to the profile avatar endpoint as JSON
    // According to the API spec, we need to send JSON with a profile_picture_url field
    const response = await $api.raw.put("/users/profile/avatar", {
      profile_picture_url: base64String,
    });

    console.log("Upload response status:", response.status);
    const data = await response.json();

    if (data && data.profile_picture_url) {
      $toast.success("Profile picture updated successfully");
      emit("uploaded", data.profile_picture_url);
      emit("close");
    } else {
      throw new Error("Invalid server response");
    }
  } catch (error: any) {
    console.error("Profile picture upload error:", error);
    $toast.error(error.message || "Failed to upload profile picture");
  } finally {
    isUploading.value = false;
  }
}

// Cleanup
onUnmounted(() => {
  if (previewUrl.value && previewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>
