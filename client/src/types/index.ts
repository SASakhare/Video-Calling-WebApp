import { RtpParameters } from "mediasoup-client/types";

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
  isPinned?: boolean;
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

  recordingEnabled?: boolean
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


// ======================================================
// Producer
// ======================================================

export interface ParticipantProducer {
  producerId: string;
  kind: "audio" | "video";
  appData?: Record<string, unknown>;
}

// ======================================================
// Presence
// ======================================================

export interface ParticipantPresence {
  connectionState: "CONNECTED" | "RECONNECTING" | "DISCONNECTED";

  isMicOn: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  isRecording: boolean;
  isSpeaking: boolean;
}

// ======================================================
// Participant
// ======================================================

export interface MeetingParticipant
  extends ParticipantPresence {

  // Identity
  participantId: string;
  userId: string;

  username: string;
  fullName: string;
  email: string;
  avatar: string | null;

  // Meeting
  meetingId: string;
  hostId: string;
  role: "HOST" | "PARTICIPANT";

  joinedAt: string;

  // Media
  producers: ParticipantProducer[];
}


export interface ConsumeOptions {

  participantId: string;

  producerId: string;

  id: string;

  kind: "audio" | "video";

  rtpParameters: RtpParameters;

  appData?: Record<string, unknown>;

}


export interface ConsumeResponse {
  success: boolean;
  consumer: ConsumeOptions;
}