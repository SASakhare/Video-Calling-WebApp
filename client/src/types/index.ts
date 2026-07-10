export type ID = string;

export interface User {
  username: string;
  userId: ID;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string
  avatar?: string;
  cover?: string;
  title?: string;
  bio?: string;
  createdAt: string;
}

export interface Participant {
  id: ID;
  name: string;
  avatar?: string;
  isHost?: boolean;
  isMuted: boolean;
  isCameraOn: boolean;
  isSharing?: boolean;
  isSpeaking?: boolean;
  handRaised?: boolean;
  reaction?: string | null;
  connection: "excellent" | "good" | "poor";
  joinedAt: string;
}

export interface Meeting {
  meetingId: ID;

  title: string;
  description?: string;

  hostId: ID;
  hostName?: string;

  meetingLink: string;

  meetingPassword?: string;

  type_: "INSTANT" | "SCHEDULED";

  status:
  | "CREATED"
  | "WAITING"
  | "LIVE"
  | "ENDED"
  | "CANCELLED";

  scheduledStartTime?: string;

  actualStartTime?: string;

  actualEndTime?: string;

  participantLimit: number;

  participantsCount: number;

  waitingRoomEnabled: boolean;

  recordingEnabled?: boolean;
}

export interface ChatMessage {
  id: ID;
  meetingId: ID;
  senderId: ID;
  senderName: string;
  content: string;
  createdAt: string;
  system?: boolean;
}

export interface Invitation {
  id: ID;
  meetingId: ID;
  email: string;
  status: "pending" | "accepted" | "declined" | "expired";
  sentAt: string;
}

export interface Notification {
  id: ID;
  type: "invite" | "system" | "meeting" | "reminder";
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  href?: string;
}
