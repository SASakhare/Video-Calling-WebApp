import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import { useMeetingStore } from "@/store/meeting.store";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { useMeetingTimer } from "@/hooks/useMeetingTimer";
import { meetingService } from "@/services/meeting.service";

import { GridLayout } from "@/components/room/GridLayout";
import { SpeakerLayout } from "@/components/room/SpeakerLayout";
import { PresentationLayout } from "@/components/room/PresentationLayout";
import { ControlBar } from "@/components/room/ControlBar";
import { ChatPanel } from "@/components/room/ChatPanel";
import { ParticipantsPanel } from "@/components/room/ParticipantsPanel";
import { ReactionOverlay } from "@/components/room/ReactionOverlay";
import type { ChatMessage, Participant } from "@/types";

export default function MeetingRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Zustand stores
  const user = useAuthStore((s) => s.user);
  const {
    micOn,
    cameraOn,
    screenSharing,
    handRaised,
    recording,
    participants,
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
    setActiveSpeaker,
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

  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Queries
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

  // Local user participant representation
  const selfParticipant = useMemo<Participant>(() => {
    return {
      id: user?.id || "u_self",
      name: user?.name || "You",
      avatar: user?.avatar,
      isHost: meetingQuery.data?.hostId === user?.id || user?.role === "host",
      isMuted: !micOn,
      isCameraOn: cameraOn,
      isSharing: screenSharing,
      handRaised: handRaised,
      reaction: null,
      connection: "excellent",
      joinedAt: new Date().toISOString(),
    };
  }, [user, meetingQuery.data, micOn, cameraOn, screenSharing, handRaised]);

  // Duration timer
  const { format: formatTimer } = useMeetingTimer(!!meetingQuery.data);

  // Sync initial seeds to store on load
  useEffect(() => {
    if (participantsQuery.data) {
      // Exclude self since it's locally controlled
      const remote = participantsQuery.data.filter((p) => p.id !== user?.id);
      setParticipants(remote);
    }
  }, [participantsQuery.data, setParticipants, user?.id]);

  useEffect(() => {
    if (messagesQuery.data && messages.length === 0) {
      messagesQuery.data.forEach((m) => addMessage(m));
    }
  }, [messagesQuery.data, addMessage, messages.length]);

  // Simulated notifications: New remote participant joins after 8s
  useEffect(() => {
    const timer = setTimeout(() => {
      const newP: Participant = {
        id: "p_temp",
        name: "Taylor Vance",
        avatar: "https://api.dicebear.com/9.x/glass/svg?seed=taylor",
        isMuted: true,
        isCameraOn: true,
        connection: "excellent",
        joinedAt: new Date().toISOString(),
      };
      setParticipants([...participants, newP]);
      toast.info("Taylor Vance joined the meeting");

      // Post system join message
      addMessage({
        id: `sys_${Math.random()}`,
        meetingId: id!,
        senderId: "system",
        senderName: "Meetly",
        content: "Taylor Vance joined the meeting",
        createdAt: new Date().toISOString(),
        system: true,
      });
    }, 8000);

    return () => clearTimeout(timer);
  }, [id, participants, setParticipants, addMessage]);

  // Simulated active speaker rotation switcher
  useEffect(() => {
    const interval = setInterval(() => {
      const activeList = participants.filter((p) => p.isCameraOn);
      if (activeList.length === 0) return;
      const randomP = activeList[Math.floor(Math.random() * activeList.length)];
      
      // Update participants state setting isSpeaking flags
      const updated = participants.map((p) => ({
        ...p,
        isSpeaking: p.id === randomP.id,
      }));
      setParticipants(updated);
      setActiveSpeaker(randomP.id);
    }, 5500);

    return () => clearInterval(interval);
  }, [participants, setParticipants, setActiveSpeaker]);

  // Chat notification increments
  useEffect(() => {
    if (!chatOpen && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg.system && lastMsg.senderId !== user?.id) {
        setUnreadChatCount((c) => c + 1);
      }
    }
  }, [messages, chatOpen, user?.id]);

  useEffect(() => {
    if (chatOpen) setUnreadChatCount(0);
  }, [chatOpen]);

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      meetingId: id!,
      senderId: user?.id || "u_self",
      senderName: user?.name || "You",
      content: text,
      createdAt: new Date().toISOString(),
    };
    addMessage(newMsg);
  };

  const handleLeave = () => {
    resetMeetingStore();
    toast.success("Meeting ended");
    navigate(`/meetings/summary/${id}`);
  };

  // Layout selection render switcher
  const renderLayout = () => {
    const props = {
      participants,
      selfParticipant,
      activeSpeakerId,
      pinnedId: pinnedParticipantId,
      onPinToggle: (pId: string) =>
        setPinnedParticipant(pinnedParticipantId === pId ? null : pId),
    };

    switch (layoutMode) {
      case "speaker":
        return <SpeakerLayout {...props} />;
      case "presentation":
        return <PresentationLayout {...props} />;
      case "grid":
      default:
        return (
          <GridLayout
            participants={participants}
            selfParticipant={selfParticipant}
            pinnedId={pinnedParticipantId}
            onPinToggle={(pId: string) =>
              setPinnedParticipant(pinnedParticipantId === pId ? null : pId)
            }
          />
        );
    }
  };

  if (meetingQuery.isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-white select-none">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-3 text-sm text-white/50">Setting up meeting room…</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-slate-950 overflow-hidden relative">
      {/* Reaction Visual Float Area */}
      <ReactionOverlay
        reactions={activeReactions}
        onRemoveReaction={removeReaction}
      />

      {/* Main room grid display zone */}
      <div className="flex-1 flex min-h-0 min-w-0 relative overflow-hidden">
        {renderLayout()}

        {/* Slide Panels */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="h-full relative z-40"
            >
              <ChatPanel
                open={chatOpen}
                onClose={() => setChatOpen(false)}
                messages={messages}
                onSendMessage={handleSendMessage}
                selfId={user?.id || "u_self"}
              />
            </motion.div>
          )}

          {participantsOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="h-full relative z-40"
            >
              <ParticipantsPanel
                open={participantsOpen}
                onClose={() => setParticipantsOpen(false)}
                participants={participants}
                selfParticipant={selfParticipant}
                pinnedId={pinnedParticipantId}
                onPinToggle={(pId: string) =>
                  setPinnedParticipant(pinnedParticipantId === pId ? null : pId)
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Bar controls */}
      <ControlBar
        micOn={micOn}
        cameraOn={cameraOn}
        screenSharing={screenSharing}
        handRaised={handRaised}
        recording={recording}
        chatOpen={chatOpen}
        participantsOpen={participantsOpen}
        unreadCount={unreadChatCount}
        participantCount={participants.length + 1}
        layoutMode={layoutMode}
        meetingTimer={formatTimer()}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleShare={toggleShare}
        onToggleHand={toggleHand}
        onToggleRecording={toggleRecording}
        onToggleChat={() => setChatOpen(!chatOpen)}
        onToggleParticipants={() => setParticipantsOpen(!participantsOpen)}
        onChangeLayout={setLayoutMode}
        onSendReaction={addReaction}
        onLeave={handleLeave}
      />
    </div>
  );
}
