import mitt from "mitt";

type EventTypes = {
  "unread-counts-updated": any[];
  "message-received": any;
  "message-sent": any;
  "message-read": string[];
  "friend-status-changed": { userId: string; status: "online" | "offline" };
  "retry-failed-message": string;
  "typing-status-changed": {
    userId: string;
    recipientId: string;
    isTyping: boolean;
  };
  "user-status-changed": {
    userId: string;
    status: "online" | "offline";
    lastSeen?: string;
  };
};

export const eventBus = mitt<EventTypes>();

export default eventBus;
