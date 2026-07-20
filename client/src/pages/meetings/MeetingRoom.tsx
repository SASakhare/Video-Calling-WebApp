import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import MeetingLayoutManager from "@/components/room/MeetingLayoutManager";
import { ControlBar } from "@/components/room/ControlBar";
import { ChatPanel } from "@/components/room/ChatPanel";
import { ParticipantsPanel } from "@/components/room/ParticipantsPanel";
import { ReactionOverlay } from "@/components/room/ReactionOverlay";

import { useMeetingStore } from "@/store/meeting.store";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";

import { useMeetingTimer } from "@/hooks/useMeetingTimer";
import { meetingService } from "@/services/meeting.service";

import type { ChatMessage } from "@/types";

export default function MeetingRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const {
    micOn,
    cameraOn,
    screenSharing,
    handRaised,
    recording,

    meetingParticipants,
    messages,

    activeSpeakerId,
    pinnedParticipantId,
    activeReactions,

    toggleMic,
    toggleCamera,
    toggleShare,
    toggleHand,
    toggleRecording,

    setParticipants,
    addMessage,
    setPinnedParticipant,

    addReaction,
    removeReaction,

    reset: resetMeetingStore,
  } = useMeetingStore();

  const {
    chatOpen,
    participantsOpen,
    layoutMode,

    setChatOpen,
    setParticipantsOpen,
    setLayoutMode,
  } = useUIStore();

  const [unreadChatCount] = useState(0);

  const meetingQuery = useQuery({
    queryKey: ["meeting", id],
    queryFn: () => meetingService.get(id!),
    enabled: !!id,
  });

  const participantsQuery = useQuery({
    queryKey: ["meeting", id, "participants"],
    queryFn: () => meetingService.participants(id!),
    enabled: !!id,
  });

  const messagesQuery = useQuery({
    queryKey: ["meeting", id, "messages"],
    queryFn: () => meetingService.messages(id!),
    enabled: !!id,
  });

  const { format: formatTimer } = useMeetingTimer(
    !!meetingQuery.data
  );

  useEffect(() => {
    if (participantsQuery.data) {
      setParticipants(participantsQuery.data);
    }
  }, [participantsQuery.data, setParticipants]);

  useEffect(() => {
    if (messagesQuery.data && messages.length === 0) {
      messagesQuery.data.forEach(addMessage);
    }
  }, [messagesQuery.data, messages.length, addMessage]);

  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      meetingId: id!,
      senderId: user?.userId ?? "",
      senderName: user?.username ?? "You",
      content: text,
      createdAt: new Date().toISOString(),
    };

    addMessage(newMessage);
  };

  const handleLeave = () => {
    resetMeetingStore();
    toast.success("Meeting ended");
    navigate(`/meetings/summary/${id}`);
  };

  if (meetingQuery.isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-3 text-sm text-white/50">
          Setting up meeting room…
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          className={`absolute inset-0 flex transition-all duration-300 ${chatOpen || participantsOpen
              ? "pr-[360px]"
              : ""
            }`}
        >
          <MeetingLayoutManager
            layoutMode={layoutMode}
            participants={meetingParticipants}
            activeSpeakerId={activeSpeakerId}
            pinnedParticipantId={pinnedParticipantId}
            participantsOpen={participantsOpen}
            chatOpen={chatOpen}
            onPinToggle={(participantId) =>
              setPinnedParticipant(
                pinnedParticipantId === participantId
                  ? null
                  : participantId
              )
            }
          />
        </div>

        <ReactionOverlay
          reactions={activeReactions}
          onRemoveReaction={removeReaction}
        />

        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25 }}
              className="absolute right-0 top-0 z-40 h-full"
            >
              <ChatPanel
                open={chatOpen}
                onClose={() => setChatOpen(false)}
                messages={messages}
                onSendMessage={handleSendMessage}
                selfId={user?.userId ?? ""}
              />
            </motion.div>
          )}

          {participantsOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25 }}
              className="absolute right-0 top-0 z-40 h-full"
            >
              <ParticipantsPanel
                open={participantsOpen}
                onClose={() =>
                  setParticipantsOpen(false)
                }
                participants={meetingParticipants}
                pinnedId={pinnedParticipantId}
                onPinToggle={(participantId) =>
                  setPinnedParticipant(
                    pinnedParticipantId === participantId
                      ? null
                      : participantId
                  )
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ControlBar
        micOn={micOn}
        cameraOn={cameraOn}
        screenSharing={screenSharing}
        handRaised={handRaised}
        recording={recording}
        chatOpen={chatOpen}
        participantsOpen={participantsOpen}
        unreadCount={unreadChatCount}
        participantCount={meetingParticipants.length}
        layoutMode={layoutMode}
        meetingTimer={formatTimer()}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleShare={toggleShare}
        onToggleHand={toggleHand}
        onToggleRecording={toggleRecording}
        onToggleChat={() => setChatOpen(!chatOpen)}
        onToggleParticipants={() =>
          setParticipantsOpen(!participantsOpen)
        }
        onChangeLayout={setLayoutMode}
        onSendReaction={addReaction}
        onLeave={handleLeave}
      />
    </div>
  );
}