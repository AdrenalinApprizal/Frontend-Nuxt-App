import mitt from "mitt";

export type EventTypes = {
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
    timestamp?: string;
    formattedLastSeen?: string | null;
  };
  "private-message": any;
  "group-message": any;
  "refresh-messages": void;
  "friend-added": void;
  // Enhanced WebSocket events
  "websocket-connected": "messages" | "presence";
  "websocket-disconnected": "messages" | "presence";
  "connection-quality-changed": "excellent" | "good" | "poor" | "disconnected";
  // Additional events
  "message-reaction": any;
  "temp-message-replaced": { tempId: string; realId: string; content: string };
  "new-message-received": {
    messageId: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    formattedTimestamp?: string;
  };
};

export const eventBus = mitt<EventTypes>();

export default eventBus;
