<template>
  <!-- Chat component based on conversation type -->
  <div class="h-full flex flex-col w-full">
    <ChatArea
      v-if="!isGroup"
      :key="`chat-${recipientId}-${refreshKey}`"
      :recipientId="recipientId"
      :recipientName="chatDetails?.name || recipientId"
      :chatMessages="chatMessages"
    />
    <GroupChatArea
      v-else
      :key="`group-${recipientId}-${refreshKey}`"
      :groupId="recipientId"
      :groupName="chatDetails?.name || recipientId"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/composables/useAuth";
import GroupChatArea from "@/components/chat/GroupChatArea.vue";
import ChatArea from "@/components/chat/ChatArea.vue";
import { useGroupsStore } from "~/composables/useGroups";
import { computed, onMounted, watch, ref, nextTick } from "vue";

// Define interfaces based on those used in components
interface Message {
  id: string;
  sender_id: string; // Required to match ChatArea interface
  recipient_id?: string;
  content: string;
  timestamp: string; // Required by ChatArea component
  type?: string;
  read?: boolean;
  created_at?: string;
  updated_at?: string;
  sender?: {
    id: string;
    name: string;
    profile_picture_url?: string;
  };
  recipient?: {
    id: string;
    name: string;
    profile_picture_url?: string;
  };
  media_url?: string;
  isCurrentUser: boolean; // Required property for ChatArea component compatibility
}

interface GroupMessage {
  id: string;
  group_id?: string;
  sender_id?: string;
  content: string;
  type?: string;
  created_at?: string;
  updated_at?: string;
  sent_at?: string;
  timestamp?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  isCurrentUser?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  attachment?: any;
}

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Refresh key to force component re-render on route changes
const refreshKey = ref(0);

// Get the group ID from the route params
const recipientId = computed(() => route.params.id as string);
const isGroup = computed(() => route.query.type === "group");

// Enhanced router refresh functionality for smooth chat switching
const isRouterRefreshing = ref(false);

// Function to perform comprehensive route refresh similar to router.refresh()
const performRouterRefresh = async (newId: string, oldId?: string) => {
  if (isRouterRefreshing.value) return;

  try {
    isRouterRefreshing.value = true;
    console.log(
      `🔄 [ChatMessages] Performing router refresh from ${oldId} to ${newId}`
    );

    // Step 1: Clear all cached data for previous conversation
    if (oldId) {
      // Clear session storage for previous chat
      try {
        if (route.query.type === "group") {
          sessionStorage.removeItem(`group_chat_${oldId}`);
        } else {
          sessionStorage.removeItem(`chat_${oldId}`);
        }
        console.log(`🧹 [ChatMessages] Cleared cache for ${oldId}`);
      } catch (e) {
        console.warn("Failed to clear cache:", e);
      }
    }

    // Step 2: Force component refresh by incrementing key
    refreshKey.value++;

    // Step 3: Wait for DOM update
    await nextTick();

    // Step 4: Small delay to ensure proper state cleanup
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Step 5: Emit refresh event for other components
    if (process.client) {
      window.dispatchEvent(
        new CustomEvent("chat-switched", {
          detail: { newId, oldId, timestamp: Date.now() },
        })
      );
    }

    console.log(`✅ [ChatMessages] Router refresh completed for ${newId}`);
  } catch (error) {
    console.error("Router refresh failed:", error);
  } finally {
    isRouterRefreshing.value = false;
  }
};

// Force refresh when recipientId changes (similar to router.refresh())
watch(
  () => recipientId.value,
  async (newId, oldId) => {
    if (newId !== oldId && oldId !== undefined) {
      console.log(
        `🔄 [ChatMessages] Route changed from ${oldId} to ${newId} - performing router refresh`
      );
      await performRouterRefresh(newId, oldId);
    }
  },
  { immediate: false }
);

// Also watch for conversation type changes (friend to group or vice versa)
watch(
  () => isGroup.value,
  async (newType, oldType) => {
    if (newType !== oldType && oldType !== undefined) {
      console.log(
        `🔄 [ChatMessages] Conversation type changed - performing router refresh`
      );
      await performRouterRefresh(recipientId.value);
    }
  },
  { immediate: false }
);

// Middleware-like protection to ensure only authenticated users can access this page
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push("/auth/login");
  }
});

// Chat details - fetch from API or use real data
const chatDetails = computed(() => {
  if (isGroup.value) {
    // For groups, we should fetch real group data from the store
    // This is a placeholder that should be replaced with real group data
    return {
      name: recipientId.value,
      avatar: undefined,
      memberCount: 0,
    };
  } else {
    // For friends, we should fetch real user data from the store
    // This is a placeholder that should be replaced with real friend data
    return {
      name: recipientId.value,
      status: "Unknown",
      avatar: undefined,
    };
  }
});

// Chat messages - these should come from the ChatArea and GroupChatArea components
// which handle their own data fetching from the respective stores
const chatMessages = computed<Message[]>(() => {
  // Return empty array as messages are handled by the components themselves
  return [];
});

const groupChatMessages = computed<GroupMessage[]>(() => {
  // Return empty array as messages are handled by the components themselves
  return [];
});
</script>
