<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-start justify-center pt-20 bg-black bg-opacity-30 z-50"
  >
    <div
      ref="popupRef"
      class="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md"
    >
      <!-- Search Header -->
      <div
        class="px-4 py-3 border-b border-gray-200 flex justify-between items-center"
      >
        <div class="flex flex-1 items-center">
          <div class="relative flex-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Icon name="fa:search" class="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search Messages"
              class="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keydown.enter="handleSearch"
              ref="inputRef"
            />
          </div>

          <button
            @click="$emit('close')"
            class="ml-2 p-2 hover:bg-gray-100 rounded-full"
          >
            <Icon name="fa:times" size="20" class="text-gray-500" />
          </button>
        </div>
      </div>

      <!-- Search Button Area -->
      <div class="px-6 py-4">
        <div class="flex justify-center items-center py-4">
          <button
            @click="handleSearch"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close", "search"]);

const searchQuery = ref("");
const popupRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

// Handle search action
const handleSearch = () => {
  emit("search", searchQuery.value);
  if (!searchQuery.value.trim()) {
    emit("close");
  }
};

// Reset states when popup is closed
watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      searchQuery.value = "";
    } else {
      // Focus the input when opened
      nextTick(() => {
        if (inputRef.value) {
          inputRef.value.focus();
        }
      });
    }
  }
);

// Handle click outside to close
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.value && !popupRef.value.contains(event.target as Node)) {
      emit("close");
    }
  };

  watch(
    () => props.isOpen,
    (newVal) => {
      if (newVal) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    },
    { immediate: true }
  );
});
</script>
