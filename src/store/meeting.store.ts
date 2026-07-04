import { create } from "zustand";
import type { Participant, ChatMessage } from "@/types";

interface Reaction {
  id: string;
  emoji: string;
  timestamp: number;
}

interface MeetingState {
  micOn: boolean;
  cameraOn: boolean;
  screenSharing: boolean;
  handRaised: boolean;
  recording: boolean;
  fullscreen: boolean;
  participants: Participant[];
  messages: ChatMessage[];
  /** Device IDs selected in the lobby — carried into the room */
  selectedCamera: string | null;
  selectedMic: string | null;
  selectedSpeaker: string | null;
  /** Phase 3 Live States */
  activeSpeakerId: string | null;
  pinnedParticipantId: string | null;
  activeReactions: Reaction[];
  toggleMic: () => void;
  toggleCamera: () => void;
  toggleShare: () => void;
  toggleHand: () => void;
  toggleRecording: () => void;
  toggleFullscreen: () => void;
  setParticipants: (p: Participant[]) => void;
  addMessage: (m: ChatMessage) => void;
  setSelectedCamera: (id: string | null) => void;
  setSelectedMic: (id: string | null) => void;
  setSelectedSpeaker: (id: string | null) => void;
  setActiveSpeaker: (id: string | null) => void;
  setPinnedParticipant: (id: string | null) => void;
  addReaction: (emoji: string) => void;
  removeReaction: (id: string) => void;
  reset: () => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  micOn: true,
  cameraOn: true,
  screenSharing: false,
  handRaised: false,
  recording: false,
  fullscreen: false,
  participants: [],
  messages: [],
  selectedCamera: null,
  selectedMic: null,
  selectedSpeaker: null,
  activeSpeakerId: null,
  pinnedParticipantId: null,
  activeReactions: [],
  toggleMic: () => set((s) => ({ micOn: !s.micOn })),
  toggleCamera: () => set((s) => ({ cameraOn: !s.cameraOn })),
  toggleShare: () => set((s) => ({ screenSharing: !s.screenSharing })),
  toggleHand: () => set((s) => ({ handRaised: !s.handRaised })),
  toggleRecording: () => set((s) => ({ recording: !s.recording })),
  toggleFullscreen: () => set((s) => ({ fullscreen: !s.fullscreen })),
  setParticipants: (participants) => set({ participants }),
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  setSelectedCamera: (selectedCamera) => set({ selectedCamera }),
  setSelectedMic: (selectedMic) => set({ selectedMic }),
  setSelectedSpeaker: (selectedSpeaker) => set({ selectedSpeaker }),
  setActiveSpeaker: (activeSpeakerId) => set({ activeSpeakerId }),
  setPinnedParticipant: (pinnedParticipantId) => set({ pinnedParticipantId }),
  addReaction: (emoji) =>
    set((s) => ({
      activeReactions: [
        ...s.activeReactions,
        { id: Math.random().toString(), emoji, timestamp: Date.now() },
      ],
    })),
  removeReaction: (id) =>
    set((s) => ({
      activeReactions: s.activeReactions.filter((r) => r.id !== id),
    })),
  reset: () =>
    set({
      micOn: true,
      cameraOn: true,
      screenSharing: false,
      handRaised: false,
      recording: false,
      fullscreen: false,
      participants: [],
      messages: [],
      selectedCamera: null,
      selectedMic: null,
      selectedSpeaker: null,
      activeSpeakerId: null,
      pinnedParticipantId: null,
      activeReactions: [],
    }),
}));
