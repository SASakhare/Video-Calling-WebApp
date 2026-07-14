import { create } from "zustand";
import type { Meeting, Participant, ChatMessage } from "@/types";
import { persist } from "zustand/middleware";

interface Reaction {
  id: string;
  emoji: string;
  timestamp: number;
}
type MeetingLayout =
  | "speaker"
  | "gallery"
  | "sidebar";


interface MeetingState {
  // * ----------------- current Meeting -----------------------------

  currentMeeting: Meeting | null;
  setCurrentMeeting: (meeting: Meeting | null) => void;
  clearCurrentMeeting: () => void;


  // *--------------------- User Meeting -----------------------------

  meetings: Meeting[];
  setMeetings: (meetings: Meeting[]) => void;
  addMeetings: (meeting: Meeting) => void;
  updateMeeting: (meeting: Meeting) => void;
  removeMeeting: (meetingId: string) => void;

  // * Live Meeting layout 

  layout: MeetingLayout;

  setLayout: (layout: MeetingLayout) => void;

  pinParticipant: (participantId: string | null) => void;

  unpinParticipant: () => void;

  // * -------------------- Live Meeting --------------------------------
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


export const useMeetingStore = create<MeetingState>()(
  persist(
    (set) => ({
      // your entire store
      currentMeeting: null,
      meetings: [],

      setCurrentMeeting: (meeting) => {
        set({
          currentMeeting: meeting,
        })
      },
      clearCurrentMeeting: () => {
        set({
          currentMeeting: null,
        })
      },
      setMeetings: (meetings) =>
        set({
          meetings,
        }),

      addMeetings: (meeting) =>
        set((state) => ({
          meetings: [meeting, ...state.meetings],
        })),
      updateMeeting: (meeting) =>
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.meetingId === meeting.meetingId ? meeting : m
          ),
        })),
      removeMeeting: (meetingId) =>
        set((state) => ({
          meetings: state.meetings.filter(
            (m) => m.meetingId !== meetingId
          ),
        })),

      layout: "speaker",

      setLayout: (layout) =>
        set({ layout }),

      pinParticipant: (participantId) =>
        set({
          pinnedParticipantId: participantId,
        }),

      unpinParticipant: () =>
        set({
          pinnedParticipantId: null,
        }),

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
    }),
    {
      name: "meeting-storage",
    }
  )
);

export const getDisplayedParticipant = (
  participants: Participant[],
  pinnedParticipantId: string | null,
  activeSpeakerId: string | null
) => {

  if (pinnedParticipantId) {

    const pinned = participants.find(
      p => p.id === pinnedParticipantId
    );

    if (pinned) return pinned;

  }

  if (activeSpeakerId) {

    const active = participants.find(
      p => p.id === activeSpeakerId
    );

    if (active) return active;

  }

  const host = participants.find(
    p => p.isHost
  );

  if (host) return host;

  return participants[0] ?? null;

};