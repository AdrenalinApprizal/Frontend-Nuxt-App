<template>
  <div class="h-screen flex">
    <!-- Group list -->
    <div class="w-80 border-r border-gray-200 flex-shrink-0">
      <GroupsList />
    </div>

    <!-- Group chat area -->
    <div class="flex-1">
      <GroupChatArea :groupId="groupId" :groupName="groupName" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useGroupsStore } from "@/composables/useGroups";
import { useAuthStore } from "@/composables/useAuth";
import { ref, onMounted, watch, computed } from "vue";

const route = useRoute();
const router = useRouter();
const groupsStore = useGroupsStore();
const authStore = useAuthStore();

// Get the group ID from the route params
const groupId = computed(() => route.params.id as string);
const groupName = ref("");

// Load the group details when the component mounts or when the ID changes
watch(
  () => groupId.value,
  async (newGroupId) => {
    try {
      if (newGroupId) {
        // Load group data
        const group = await groupsStore.getGroupDetails(newGroupId);
        groupName.value = group.name || "Group Chat";
      }
    } catch (error) {
      console.error("Error loading group:", error);
    }
  },
  { immediate: true }
);

// Middleware-like protection to ensure only authenticated users can access this page
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push("/auth/login");
  }
});
</script>
