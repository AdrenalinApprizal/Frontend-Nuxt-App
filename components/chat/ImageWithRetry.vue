<template>
  <div class="relative">
    <!-- Loading spinner -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded"
    >
      <div
        class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"
      ></div>
    </div>

    <!-- Error state with retry -->
    <div
      v-if="hasError"
      class="flex flex-col items-center justify-center p-4 bg-gray-100 rounded border border-gray-300"
    >
      <Icon name="lucide:alert-triangle" class="text-yellow-500 mb-2 h-6 w-6" />
      <p class="text-sm text-gray-600 mb-2">Gambar gagal dimuat</p>
      <p class="text-xs text-gray-500 mb-3">URL mungkin sudah kadaluarsa</p>
      <button
        @click="handleRetry"
        :disabled="isLoading"
        class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? "Memuat..." : "Coba Lagi" }}
      </button>
    </div>

    <!-- Image -->
    <img
      v-else
      :src="imageSrc"
      :alt="alt"
      :class="className"
      @click="handleClick"
      @error="handleError"
      @load="handleLoad"
      :style="{ display: isLoading ? 'none' : 'block' }"
      loading="lazy"
      decoding="async"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface ImageWithRetryProps {
  src: string;
  alt: string;
  className?: string;
  messageId: string;
}

const props = defineProps<ImageWithRetryProps>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// State
const imageSrc = ref(props.src);
const isLoading = ref(false);
const hasError = ref(false);
const retryCount = ref(0);
const maxRetries = 2;

// Watch for src changes
watch(
  () => props.src,
  (newSrc) => {
    imageSrc.value = newSrc;
    hasError.value = false;
    retryCount.value = 0;
  }
);

// Handlers
const handleClick = (event: MouseEvent) => {
  emit("click", event);
};

const handleLoad = () => {
  isLoading.value = false;
  hasError.value = false;
};

const handleError = () => {
  isLoading.value = false;

  // Check if URL might be expired (contains AWS signature parameters)
  const isExpiredUrl =
    imageSrc.value.includes("X-Amz-Expires") ||
    imageSrc.value.includes("X-Amz-Date");

  if (isExpiredUrl && retryCount.value < maxRetries) {
    refreshImageUrl();
  } else {
    hasError.value = true;
  }
};

const refreshImageUrl = async () => {
  if (retryCount.value >= maxRetries) {
    hasError.value = true;
    return;
  }

  isLoading.value = true;
  retryCount.value++;

  try {
    // Try to refresh the URL by making a request to get updated attachment info
    // Use the unified message endpoint for consistency
    const response = await $fetch(`/api/proxy/message/${props.messageId}`);
    if (response && response.attachment && response.attachment.url) {
      imageSrc.value = response.attachment.url;
      hasError.value = false;
    } else {
      hasError.value = true;
    }
  } catch (error) {
    console.error("Failed to refresh image URL:", error);
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const handleRetry = () => {
  retryCount.value = 0;
  hasError.value = false;
  refreshImageUrl();
};
</script>
