<template>
  <!-- Chat component based on conversation type -->
  <div class="h-full flex flex-col w-full">
    <ChatArea
      v-if="!isGroup"
      :recipientId="senderName"
      :recipientName="chatDetails?.name || senderName"
      :chatMessages="chatMessages"
    />
    <GroupChatArea
      v-else
      :groupId="senderName"
      :groupName="chatDetails?.name || senderName"
      :groupMessages="groupChatMessages"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/composables/useAuth";
import GroupChatArea from "@/components/chat/GroupChatArea.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Decode the URL parameter which is now the sender's name
const senderName = computed(() =>
  decodeURIComponent(route.params.id as string)
);
const isGroup = computed(() => route.query.type === "group");

// Middleware-like protection to ensure only authenticated users can access this page
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push("/auth/login");
  }

  // Detail logging untuk membantu debug
  console.log("==== ROUTE DEBUGGING ====");
  console.log("Route params:", route.params);
  console.log("Route query:", route.query);
  console.log("isGroup computed value:", isGroup.value);
  console.log("senderName computed value:", senderName.value);
  console.log("chatDetails value:", chatDetails.value);

  // Initialize chat group data correctly
  if (isGroup.value) {
    console.log("==== GROUP CHAT DEBUGGING ====");
    console.log("Loading group chat with name:", senderName.value);
    console.log("Group messages available:", !!groupChatMessages.value);
    console.log("Group messages count:", groupChatMessages.value?.length || 0);
  } else {
    console.log("==== FRIEND CHAT DEBUGGING ====");
    console.log("Loading friend chat with name:", senderName.value);
    console.log("Friend messages available:", !!chatMessages.value);
    console.log("Friend messages count:", chatMessages.value?.length || 0);
  }

  // Debug component rendering condition
  console.log(
    "Rendering component:",
    isGroup.value ? "GroupChatArea" : "ChatArea"
  );
});

// Mock data - in a real app, you would fetch this from an API
const chatDetails = computed(() => {
  if (isGroup.value) {
    // Group data based on name instead of ID
    switch (senderName.value) {
      case "Frontend Developers":
        return {
          name: "Frontend Developers",
          avatar: undefined,
          memberCount: 6,
        };
      case "Project Alpha Team":
        return {
          name: "Project Alpha Team",
          avatar: undefined,
          memberCount: 8,
        };
      case "Marketing Department":
        return {
          name: "Marketing Department",
          avatar: undefined,
          memberCount: 15,
        };
      case "Design Team":
        return {
          name: "Design Team",
          avatar: undefined,
          memberCount: 4,
        };
      case "Company Announcements":
        return {
          name: "Company Announcements",
          avatar: undefined,
          memberCount: 42,
        };
      default:
        return {
          name: senderName.value,
          avatar: undefined,
          memberCount: 6,
        };
    }
  } else {
    // Friend data based on name instead of ID
    const details = {
      "Izhar Alif": { name: "Izhar Alif", status: "Online", avatar: undefined },
      "Budi Santoso": {
        name: "Budi Santoso",
        status: "Last seen 5 minutes ago",
        avatar: undefined,
      },
      "Anita Wijaya": {
        name: "Anita Wijaya",
        status: "Last seen yesterday",
        avatar: undefined,
      },
    };
    return (
      details[senderName.value as keyof typeof details] || {
        name: senderName.value,
        status: "Offline",
        avatar: undefined,
      }
    );
  }
});

// Mock chat messages data for each user
interface Attachment {
  type: "image" | "file";
  url: string;
  name: string;
  size?: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  read?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  attachment?: Attachment;
}

interface GroupMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  isCurrentUser: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  attachment?: Attachment;
}

// Generate unique mock conversations for each user based on name
const chatMessages = computed<Message[]>(() => {
  switch (senderName.value) {
    case "Izhar Alif":
      return [
        {
          id: "1",
          content: "Halo, apa kabar?",
          timestamp: "09:30 AM",
          isCurrentUser: false,
          read: true,
        },
        {
          id: "2",
          content: "Baik, kamu sendiri bagaimana?",
          timestamp: "09:32 AM",
          isCurrentUser: true,
          read: true,
        },
        {
          id: "3",
          content: "Alhamdulillah baik juga. Kita jadi meeting hari ini?",
          timestamp: "09:33 AM",
          isCurrentUser: false,
          read: true,
        },
        {
          id: "4",
          content: "Jadi, jam 2 siang ya di kantor?",
          timestamp: "09:35 AM",
          isCurrentUser: true,
          read: true,
        },
        {
          id: "5",
          content: "Oke, sampai ketemu nanti! 👍",
          timestamp: "09:36 AM",
          isCurrentUser: false,
          read: true,
        },
        {
          id: "6",
          content: "Saya sudah siapkan presentasinya",
          timestamp: "10:15 AM",
          isCurrentUser: false,
          read: true,
          attachment: {
            type: "file",
            url: "#",
            name: "Presentasi_Project.pdf",
            size: "2.3 MB",
          },
        },
        {
          id: "7",
          content: "Terima kasih! Saya akan mempelajarinya sebelum meeting",
          timestamp: "10:20 AM",
          isCurrentUser: true,
          read: true,
        },
      ];

    case "Budi Santoso":
      return [
        {
          id: "1",
          content: "Hei, sudah lihat update yang baru?",
          timestamp: "Yesterday",
          isCurrentUser: false,
          read: true,
        },
        {
          id: "2",
          content: "Belum, ada apa ya?",
          timestamp: "Yesterday",
          isCurrentUser: true,
          read: true,
        },
        {
          id: "3",
          content: "Ada fitur baru di aplikasi kita. Coba deh lihat.",
          timestamp: "Yesterday",
          isCurrentUser: false,
          read: true,
        },
        {
          id: "4",
          content: "Ini screenshot-nya",
          timestamp: "Yesterday",
          isCurrentUser: false,
          read: true,
          attachment: {
            type: "image",
            url: "/images/voxtalogo.png",
            name: "Screenshot_Fitur.jpg",
            size: "356 KB",
          },
        },
        {
          id: "5",
          content: "Wah keren! Kapan kita rilis fitur ini?",
          timestamp: "Yesterday",
          isCurrentUser: true,
          read: true,
        },
        {
          id: "6",
          content:
            "Rencananya minggu depan, tapi masih ada beberapa bug yang perlu diperbaiki",
          timestamp: "Yesterday",
          isCurrentUser: false,
          read: true,
        },
        {
          id: "7",
          content: "Okay, saya akan bantu test juga",
          timestamp: "11:45 AM",
          isCurrentUser: true,
          read: false,
        },
      ];

    case "Anita Wijaya":
      return [
        {
          id: "1",
          content: "Selamat pagi! 😊",
          timestamp: "08:15 AM",
          isCurrentUser: false,
          read: true,
        },
        {
          id: "2",
          content: "Pagi, Anita! Ada yang bisa saya bantu?",
          timestamp: "08:20 AM",
          isCurrentUser: true,
          read: true,
        },
        {
          id: "3",
          content:
            "Saya mau tanya tentang laporan bulanan. Sudah selesai belum ya?",
          timestamp: "08:22 AM",
          isCurrentUser: false,
          read: true,
        },
        {
          id: "4",
          content: "Sudah hampir selesai, tinggal finalisasi beberapa data",
          timestamp: "08:25 AM",
          isCurrentUser: true,
          read: true,
        },
        {
          id: "5",
          content: "Ini draft-nya yang sudah saya kerjakan",
          timestamp: "08:26 AM",
          isCurrentUser: true,
          read: true,
          attachment: {
            type: "file",
            url: "#",
            name: "Laporan_Bulanan_Draft.xlsx",
            size: "1.7 MB",
          },
        },
        {
          id: "6",
          content:
            "Terima kasih! Akan saya review. Kalau ada revisi saya kabari lagi ya",
          timestamp: "08:30 AM",
          isCurrentUser: false,
          read: true,
        },
        {
          id: "7",
          content: "Siap! Ditunggu feedback-nya",
          timestamp: "08:31 AM",
          isCurrentUser: true,
          read: true,
        },
      ];

    default:
      // Default messages for unknown users
      return [
        {
          id: "1",
          content: "Hello!",
          timestamp: "10:20 AM",
          isCurrentUser: false,
          read: true,
        },
        {
          id: "2",
          content: "Hi there! How can I help you?",
          timestamp: "10:22 AM",
          isCurrentUser: true,
          read: true,
        },
      ];
  }
});

// Generate mock group conversations based on group name
const groupChatMessages = computed<GroupMessage[]>(() => {
  switch (senderName.value) {
    case "Frontend Developers":
      return [
        {
          id: "1",
          content: "Selamat pagi semua! Ada update untuk sprint minggu ini?",
          sender: { id: "1", name: "Izhar Alif", avatar: undefined },
          timestamp: "09:00 AM",
          isCurrentUser: false,
        },
        {
          id: "2",
          content: "Pagi! Saya sudah selesai dengan fitur login dan register",
          sender: { id: "2", name: "Budi Santoso", avatar: undefined },
          timestamp: "09:05 AM",
          isCurrentUser: false,
        },
        {
          id: "3",
          content:
            "Saya juga sudah selesai dengan integrasi API untuk dashboard",
          sender: { id: "user", name: "You", avatar: undefined },
          timestamp: "09:10 AM",
          isCurrentUser: true,
        },
        {
          id: "4",
          content:
            "Bagus! Saya sudah review code PR kalian, ada beberapa komentar minor",
          sender: { id: "1", name: "Izhar Alif", avatar: undefined },
          timestamp: "09:15 AM",
          isCurrentUser: false,
        },
        {
          id: "5",
          content: "Ini dokumentasi API terbaru dari backend team",
          sender: { id: "3", name: "Anita Wijaya", avatar: undefined },
          timestamp: "09:20 AM",
          isCurrentUser: false,
          attachment: {
            type: "file",
            url: "#",
            name: "API_Documentation_v2.pdf",
            size: "1.5 MB",
          },
        },
        {
          id: "6",
          content: "Terima kasih Anita! Ini sangat membantu",
          sender: { id: "user", name: "You", avatar: undefined },
          timestamp: "09:22 AM",
          isCurrentUser: true,
        },
        {
          id: "7",
          content: "Ada yang bisa tolong review PR saya untuk fitur chat?",
          sender: { id: "4", name: "Dimas Prakoso", avatar: undefined },
          timestamp: "09:30 AM",
          isCurrentUser: false,
        },
        {
          id: "8",
          content: "Saya bisa review hari ini",
          sender: { id: "user", name: "You", avatar: undefined },
          timestamp: "09:32 AM",
          isCurrentUser: true,
        },
        {
          id: "9",
          content: "Meeting standup jam 10 ya, jangan lupa",
          sender: { id: "1", name: "Izhar Alif", avatar: undefined },
          timestamp: "09:45 AM",
          isCurrentUser: false,
        },
      ];

    case "Project Alpha Team":
      return [
        {
          id: "1",
          content: "Hi team, ada update untuk project timeline?",
          sender: { id: "5", name: "Lina Susanti", avatar: undefined },
          timestamp: "Yesterday",
          isCurrentUser: false,
        },
        {
          id: "2",
          content:
            "Menurut jadwal, kita seharusnya sudah di fase testing minggu ini",
          sender: { id: "1", name: "Izhar Alif", avatar: undefined },
          timestamp: "Yesterday",
          isCurrentUser: false,
        },
        {
          id: "3",
          content: "Benar, tapi masih ada beberapa fitur yang belum selesai",
          sender: { id: "user", name: "You", avatar: undefined },
          timestamp: "Yesterday",
          isCurrentUser: true,
        },
        {
          id: "4",
          content: "Ini status report terakhir",
          sender: { id: "5", name: "Lina Susanti", avatar: undefined },
          timestamp: "Yesterday",
          isCurrentUser: false,
          attachment: {
            type: "file",
            url: "#",
            name: "Project_Alpha_Status_Report.xlsx",
            size: "2.1 MB",
          },
        },
        {
          id: "5",
          content: "Meeting dengan client diundur jadi minggu depan ya",
          sender: { id: "3", name: "Anita Wijaya", avatar: undefined },
          timestamp: "Yesterday",
          isCurrentUser: false,
        },
        {
          id: "6",
          content: "Ok noted, thanks infonya",
          sender: { id: "user", name: "You", avatar: undefined },
          timestamp: "Yesterday",
          isCurrentUser: true,
        },
        {
          id: "7",
          content: "Ada yang mau discuss soal feedback dari user testing?",
          sender: { id: "2", name: "Budi Santoso", avatar: undefined },
          timestamp: "10:05 AM",
          isCurrentUser: false,
        },
        {
          id: "8",
          content: "Saya ada waktu siang ini kalau mau bahas",
          sender: { id: "user", name: "You", avatar: undefined },
          timestamp: "10:10 AM",
          isCurrentUser: true,
        },
      ];

    case "Marketing Department":
      return [
        {
          id: "1",
          content: "Selamat pagi tim marketing!",
          sender: { id: "5", name: "Lina Susanti", avatar: undefined },
          timestamp: "08:30 AM",
          isCurrentUser: false,
        },
        {
          id: "2",
          content: "Ada update tentang kampanye baru yang akan diluncurkan?",
          sender: { id: "3", name: "Anita Wijaya", avatar: undefined },
          timestamp: "08:35 AM",
          isCurrentUser: false,
        },
        {
          id: "3",
          content: "Ya, kita akan mulai kampanye sosial media minggu depan",
          sender: { id: "user", name: "You", avatar: undefined },
          timestamp: "08:40 AM",
          isCurrentUser: true,
        },
        {
          id: "4",
          content: "Saya sudah siapkan materinya, akan saya share nanti",
          sender: { id: "user", name: "You", avatar: undefined },
          timestamp: "08:42 AM",
          isCurrentUser: true,
        },
        {
          id: "5",
          content: "Bagus, jangan lupa koordinasi dengan tim design juga ya",
          sender: { id: "5", name: "Lina Susanti", avatar: undefined },
          timestamp: "08:45 AM",
          isCurrentUser: false,
        },
      ];

    case "Design Team":
      return [
        {
          id: "1",
          content: "Meeting design review jam 2 siang ya",
          sender: { id: "4", name: "Dimas Prakoso", avatar: undefined },
          timestamp: "10:15 AM",
          isCurrentUser: false,
        },
        {
          id: "2",
          content: "Siap, saya akan siapkan prototype-nya",
          sender: { id: "user", name: "You", avatar: undefined },
          timestamp: "10:20 AM",
          isCurrentUser: true,
        },
        {
          id: "3",
          content: "Ada feedback dari client tentang desain landing page",
          sender: { id: "3", name: "Anita Wijaya", avatar: undefined },
          timestamp: "10:25 AM",
          isCurrentUser: false,
        },
        {
          id: "4",
          content: "Mereka ingin warna yang lebih cerah untuk CTA button",
          sender: { id: "3", name: "Anita Wijaya", avatar: undefined },
          timestamp: "10:26 AM",
          isCurrentUser: false,
        },
        {
          id: "5",
          content: "Ok, nanti saya revisi",
          sender: { id: "user", name: "You", avatar: undefined },
          timestamp: "10:30 AM",
          isCurrentUser: true,
        },
      ];

    case "Company Announcements":
      return [
        {
          id: "1",
          content: "PENGUMUMAN: Libur bersama tanggal 17 Agustus 2023",
          sender: { id: "admin", name: "HR Department", avatar: undefined },
          timestamp: "Yesterday",
          isCurrentUser: false,
        },
        {
          id: "2",
          content:
            "Akan ada acara perayaan kemerdekaan di kantor tanggal 16 Agustus",
          sender: { id: "admin", name: "HR Department", avatar: undefined },
          timestamp: "Yesterday",
          isCurrentUser: false,
        },
        {
          id: "3",
          content: "Apakah dress code-nya merah putih?",
          sender: { id: "2", name: "Budi Santoso", avatar: undefined },
          timestamp: "Yesterday",
          isCurrentUser: false,
        },
        {
          id: "4",
          content: "Benar, dress code merah putih. Jangan lupa hadir ya semua.",
          sender: { id: "admin", name: "HR Department", avatar: undefined },
          timestamp: "Yesterday",
          isCurrentUser: false,
        },
        {
          id: "5",
          content: "Noted, terima kasih infonya",
          sender: { id: "user", name: "You", avatar: undefined },
          timestamp: "Today, 08:05 AM",
          isCurrentUser: true,
        },
      ];

    default:
      return [
        {
          id: "1",
          content: "Welcome to the group!",
          sender: { id: "admin", name: "Admin", avatar: undefined },
          timestamp: "10:00 AM",
          isCurrentUser: false,
        },
        {
          id: "2",
          content: "Hi everyone, thanks for adding me!",
          sender: { id: "user", name: "You", avatar: undefined },
          timestamp: "10:05 AM",
          isCurrentUser: true,
        },
      ];
  }
});
</script>
