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
            @click="showFilter = !showFilter"
            :class="`ml-3 p-2 rounded-full ${
              filtersApplied
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100 text-gray-500'
            }`"
          >
            <Icon name="fa:filter" class="h-4 w-4" />
          </button>

          <button
            @click="$emit('close')"
            class="ml-2 p-2 hover:bg-gray-100 rounded-full"
          >
            <Icon name="fa:times" class="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      <!-- Filter Content -->
      <template v-if="showFilter">
        <div class="bg-white rounded">
          <div
            class="px-6 py-3 border-b border-gray-200 flex justify-between items-center"
          >
            <h2 class="text-lg text-black font-medium">Search Filter</h2>
            <button
              @click="showFilter = false"
              class="p-1 rounded-full hover:bg-gray-100"
            >
              <Icon name="fa:times" class="h-5 w-5" />
            </button>
          </div>

          <div class="px-6 py-4">
            <p class="text-sm text-gray-500 mb-4">
              {{ filtersApplied ? "Filters Applied" : "No Filters Applied" }}
            </p>

            <div class="relative mb-4">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <Icon name="fa:search" class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                v-model="memberSearchQuery"
                placeholder="Search by name"
                class="w-full text-black pl-10 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none"
              />
            </div>

            <div class="mt-2 max-h-60 overflow-y-auto">
              <template
                v-for="(members, letter) in groupedMembers"
                :key="letter"
              >
                <div>
                  <div class="mb-2 text-xs text-gray-500">{{ letter }}</div>
                  <div
                    v-for="member in members"
                    :key="member.id"
                    class="flex items-center justify-between py-2"
                  >
                    <div class="flex items-center text-black">
                      <div
                        class="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex items-center justify-center"
                      >
                        <img
                          v-if="member.avatar"
                          :src="member.avatar"
                          :alt="member.name"
                          class="w-full h-full object-cover"
                        />
                        <Icon
                          v-else
                          name="fa:user"
                          class="h-5 w-5 text-gray-500"
                        />
                      </div>
                      <span>{{ member.name }}</span>
                    </div>
                    <input
                      type="checkbox"
                      :checked="selectedMembers.includes(member.id)"
                      @change="toggleMember(member.id)"
                      class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </template>

              <div
                v-if="Object.keys(groupedMembers).length === 0"
                class="text-center py-6 text-gray-500"
              >
                No members found
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                @click="cancelFilters"
                class="px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                @click="applyFilters"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="px-6 py-4">
          <div
            v-if="filtersApplied"
            class="px-4 py-2 bg-blue-50 flex items-center rounded mb-4"
          >
            <span class="mr-2 text-sm text-blue-700">
              {{ selectedMembers.length }}
              {{ selectedMembers.length === 1 ? "person" : "people" }} added to
              the filter
            </span>
            <button
              @click="clearFilters"
              class="ml-auto text-blue-700 hover:text-blue-800"
            >
              Clear
            </button>
          </div>

          <div class="flex justify-center items-center py-4">
            <button
              @click="handleSearch"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";

interface GroupMember {
  id: string;
  name: string;
  status: "online" | "offline";
  role: "admin" | "member";
  avatar?: string;
}

const props = defineProps<{
  isOpen: boolean;
  groupMembers: GroupMember[];
}>();

const emit = defineEmits(["close", "search"]);

const searchQuery = ref("");
const showFilter = ref(false);
const selectedMembers = ref<string[]>([]);
const filtersApplied = ref(false);
const memberSearchQuery = ref("");
const popupRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

// Filter members based on search query
const filteredMembers = computed(() => {
  if (!memberSearchQuery.value) {
    return props.groupMembers;
  }
  return props.groupMembers.filter((member) =>
    member.name.toLowerCase().includes(memberSearchQuery.value.toLowerCase())
  );
});

// Group members by first letter of name for alphabetical organization
const groupedMembers = computed(() => {
  const grouped: Record<string, GroupMember[]> = {};
  filteredMembers.value.forEach((member) => {
    const firstLetter = member.name.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(member);
  });
  return grouped;
});

// Handle search action
const handleSearch = () => {
  emit("search", searchQuery.value, selectedMembers.value);
  if (!searchQuery.value.trim() && selectedMembers.value.length === 0) {
    emit("close");
  }
};

// Clear all filters
const clearFilters = () => {
  selectedMembers.value = [];
  filtersApplied.value = false;
  emit("search", searchQuery.value, []);
};

// Apply filters
const applyFilters = () => {
  showFilter.value = false;
  filtersApplied.value = selectedMembers.value.length > 0;
  handleSearch();
};

// Cancel filters without applying
const cancelFilters = () => {
  showFilter.value = false;
  selectedMembers.value = [];
  filtersApplied.value = false;
  emit("search", searchQuery.value, []);
};

// Toggle member selection
const toggleMember = (memberId: string) => {
  const index = selectedMembers.value.indexOf(memberId);
  if (index === -1) {
    selectedMembers.value.push(memberId);
  } else {
    selectedMembers.value.splice(index, 1);
  }
};

// Reset states when popup is closed
watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      if (!filtersApplied.value) {
        searchQuery.value = "";
        selectedMembers.value = [];
        showFilter.value = false;
      }
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
