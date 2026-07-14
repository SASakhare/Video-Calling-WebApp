import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import MeetingLayoutManager from "@/components/room/MeetingLayoutManager";
import { useMeetingStore } from "@/store/meeting.store";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { useMeetingTimer } from "@/hooks/useMeetingTimer";
import { meetingService } from "@/services/meeting.service";

import { GridLayout } from "@/components/room/GridLayout";
import { ControlBar } from "@/components/room/ControlBar";
import { ChatPanel } from "@/components/room/ChatPanel";
import { ParticipantsPanel } from "@/components/room/ParticipantsPanel";
import { ReactionOverlay } from "@/components/room/ReactionOverlay";
import type { ChatMessage, Participant } from "@/types";

export default function MeetingRoom() {
  const { id } = useParams<{ id: string }>(); // * id :=> meetingId
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
  //  * it run during rendering phase and run when dependency array item change
  const selfParticipant = useMemo<Participant>(() => {
    return {
      id: user?.userId || "u_self",
      name: user?.username || "You",
      avatar: user?.avatar,
      isHost: meetingQuery.data?.hostId === user?.userId,
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
      const remote = participantsQuery.data.filter((p) => p.id !== user?.userId);
      setParticipants(remote);
    }
  }, [participantsQuery.data, setParticipants, user?.userId]);

  useEffect(() => {
    if (messagesQuery.data && messages.length === 0) {
      messagesQuery.data.forEach((m) => addMessage(m));
    }
  }, [messagesQuery.data, addMessage, messages.length]);


  // * Handle Send Message  function :
  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      meetingId: id!,
      senderId: user?.userId || "u_self",
      senderName: user?.username || "You",
      content: text,
      createdAt: new Date().toISOString(),
    };
    addMessage(newMsg);
  };

  // * handle leave function which end the meeting and goto service page
  const handleLeave = () => {
    resetMeetingStore();
    toast.success("Meeting ended");
    navigate(`/meetings/summary/${id}`);
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
    <div
      className="
      h-screen
      w-screen
      flex
      flex-col
      bg-slate-950
      overflow-hidden
    "
    >

      {/* ================= MEETING AREA ================= */}

      <div
        className="
        flex-1
        relative
        min-h-0
        overflow-hidden
      "
      >

        {/* Layout */}

        <div
          className={`
          absolute
          inset-0
          flex
          min-h-0
          min-w-0
          transition-all
          duration-300
          ${(chatOpen || participantsOpen) ? "pr-[360px]" : ""}
        `}
        >
          <MeetingLayoutManager
            layoutMode={layoutMode}
            participants={participants}
            selfParticipant={selfParticipant}
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



        {/* Floating Reaction Layer */}

        <ReactionOverlay
          reactions={activeReactions}
          onRemoveReaction={removeReaction}
        />



        {/* ================= SIDE PANELS ================= */}


        <AnimatePresence>


          {chatOpen && (

            <motion.div

              initial={{
                x: "100%"
              }}

              animate={{
                x: 0
              }}

              exit={{
                x: "100%"
              }}

              transition={{
                duration: 0.25
              }}

              className="
              absolute
              right-0
              top-0
              h-full
              z-40
            "

            >

              <ChatPanel

                open={chatOpen}

                onClose={() =>
                  setChatOpen(false)
                }

                messages={messages}

                onSendMessage={handleSendMessage}

                selfId={
                  user?.userId ?? "self"
                }

              />


            </motion.div>

          )}



          {participantsOpen && (

            <motion.div

              initial={{
                x: "100%"
              }}

              animate={{
                x: 0
              }}

              exit={{
                x: "100%"
              }}

              transition={{
                duration: 0.25
              }}

              className="
              absolute
              right-0
              top-0
              h-full
              z-40
            "

            >

              <ParticipantsPanel

                open={participantsOpen}

                onClose={() =>
                  setParticipantsOpen(false)
                }

                participants={participants}

                selfParticipant={selfParticipant}

                pinnedId={pinnedParticipantId}

                onPinToggle={(id) =>


                  setPinnedParticipant(
                    pinnedParticipantId === id
                      ? null
                      : id
                  )

                }

              />


            </motion.div>

          )}

        </AnimatePresence>


      </div>




      {/* ================= CONTROL BAR ================= */}


      <ControlBar

        micOn={micOn}

        cameraOn={cameraOn}

        screenSharing={screenSharing}

        handRaised={handRaised}

        recording={recording}

        chatOpen={chatOpen}

        participantsOpen={participantsOpen}

        unreadCount={unreadChatCount}

        participantCount={
          participants.length + 1
        }

        layoutMode={layoutMode}

        meetingTimer={formatTimer()}

        onToggleMic={toggleMic}

        onToggleCamera={toggleCamera}

        onToggleShare={toggleShare}

        onToggleHand={toggleHand}

        onToggleRecording={toggleRecording}

        onToggleChat={() =>
          setChatOpen(!chatOpen)
        }

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
