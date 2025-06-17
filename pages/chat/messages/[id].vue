<template>
  <!-- Chat component based on conversation type -->
  <div class="h-full flex flex-col w-full">
    <ChatArea
      v-if="!isGroup"
      :recipientId="recipientId"
      :recipientName="chatDetails?.name || recipientId"
      :chatMessages="chatMessages"
    />
    <GroupChatArea
      v-else
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
import { computed, onMounted } from "vue";

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

// Use the URL parameter as the recipient or group ID directly
const recipientId = computed(() => route.params.id as string);
const isGroup = computed(() => route.query.type === "group");

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
