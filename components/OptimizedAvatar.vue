<template>
  <div
    :class="`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center ${className || ''}`"
  >
    <!-- Fallback icon when no image or error -->
    <template v-if="showFallback">
      <slot name="fallback">
        <Icon :name="fallbackIcon" :class="`${iconSizes[size]} text-gray-500`" />
      </slot>
    </template>

    <!-- Image with loading state -->
    <div v-else class="relative h-full w-full">
      <!-- Loading spinner -->
      <div
        v-if="isLoading"
        class="absolute inset-0 flex items-center justify-center bg-gray-100"
      >
        <div
          class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"
        ></div>
      </div>

      <!-- Optimized image -->
      <img
        :src="optimizedSrc"
        :alt="alt"
        class="h-full w-full object-cover transition-opacity duration-200 ease-in-out"
        :style="{
          imageRendering: 'auto',
          opacity: isLoading ? 0 : 1,
        }"
        loading="lazy"
        decoding="async"
        @load="handleLoad"
        @error="handleError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface OptimizedAvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallbackIcon?: string;
}

// Define props with defaults
const props = withDefaults(defineProps<OptimizedAvatarProps>(), {
  src: null,
  className: "",
  size: "md",
  fallbackIcon: "fa:user",
});

// Reactive state
const hasError = ref(false);
const isLoading = ref(!!props.src);

// Size mappings
const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

// Validate and optimize image URL
const optimizedSrc = computed(() => {
 ({
    hasSrc: !!props.src,
    srcType: typeof props.src,
    srcLength: props.src?.length || 0,
    srcPreview: props.src?.substring?.(0, 50) || "no src",
    isDataUrl: props.src?.startsWith?.("data:") || false,
  });

  if (!props.src) {
    return undefined;
  }

  // Check if it's a data URL
  if (props.src.startsWith("data:")) {

    // Validate data URL format
    const dataUrlRegex =
      /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/;
    if (!dataUrlRegex.test(props.src)) {
      
      return undefined;
    }


    // Check size limit (2MB for safety across browsers)
    const maxSize = 2 * 1024 * 1024;
    if (props.src.length > maxSize) {
      

      // Try to compress or return undefined
      try {
        // For very large images, we could implement client-side compression here
        // For now, we'll just reject them
        return undefined;
      } catch (error) {
        
        return undefined;
      }
    }


    // Check if base64 data appears to be corrupted (very short or has invalid characters)
    const base64Data = props.src.split(",")[1];
    if (!base64Data || base64Data.length < 100) {
      
      return undefined;
    }

    

    // Test if base64 is valid
    try {
      atob(base64Data.substring(0, 100)); // Test decode a small portion
    } catch (error) {
      return undefined;
    }

    return props.src;
  }

  console.log("[OptimizedAvatar] Not a data URL, returning as-is:", props.src);
  return props.src;
});

// Computed property to determine when to show fallback
const showFallback = computed(() => !optimizedSrc.value || hasError.value);

// Event handlers
const handleLoad = () => {
  console.log("[OptimizedAvatar] ✅ Image loaded successfully for:", props.alt);
  isLoading.value = false;
  hasError.value = false;
};

const handleError = () => {
  console.error("[OptimizedAvatar] ❌ Image failed to load for:", props.alt, {
    src: optimizedSrc.value?.substring?.(0, 100),
    srcLength: optimizedSrc.value?.length,
  });
  isLoading.value = false;
  hasError.value = true;
};

// Watch for src changes to reset loading state
watch(
  () => props.src,
  (newSrc) => {
    if (newSrc) {
      isLoading.value = true;
      hasError.value = false;
    } else {
      isLoading.value = false;
      hasError.value = false;
    }
  }
);
</script>

<style scoped>
/* Additional optimizations for image rendering */
img {
  /* Optimize rendering performance */
  image-rendering: auto;
  /* Improve rendering quality */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Fallback for browsers that don't support image-rendering */
@supports not (image-rendering: -webkit-optimize-contrast) {
  img {
    image-rendering: auto;
  }
}

/* Prevent layout shift during loading */
.relative {
  min-height: 100%;
  min-width: 100%;
}

/* Smooth transitions */
.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>