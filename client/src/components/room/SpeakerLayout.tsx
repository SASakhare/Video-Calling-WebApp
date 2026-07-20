import { ParticipantTile } from "./ParticipantTile";
import type { MeetingParticipant } from "@/types";

interface SpeakerLayoutProps {
  participants: MeetingParticipant[];
  activeSpeakerId: string | null;
  pinnedId: string | null;
  participantsOpen: boolean;
  chatOpen: boolean;
  onPinToggle: (participantId: string) => void;
}

export default function SpeakerLayout({
  participants,
  activeSpeakerId,
  pinnedId,
  participantsOpen,
  chatOpen,
  onPinToggle,
}: SpeakerLayoutProps) {
  const sidePanelOpen = participantsOpen || chatOpen;

  const displayedParticipant =
    participants.find(
      (participant) =>
        participant.participantId === pinnedId
    ) ??
    participants.find(
      (participant) =>
        participant.participantId === activeSpeakerId
    ) ??
    participants.find(
      (participant) => participant.isSpeaking
    ) ??
    participants.find(
      (participant) => participant.role === "HOST"
    );

  if (!displayedParticipant) {
    return null;
  }

  const thumbnails = participants.filter(
    (participant) =>
      participant.participantId !==
      displayedParticipant.participantId
  );

  return (
    <div className="flex-1 h-full w-full overflow-hidden">
      {/* ================= NO SIDE PANEL ================= */}

      {!sidePanelOpen && (
        <div className="flex h-full gap-4 p-4">
          {/* Main Stage */}

          <div className="flex-1 min-w-0 flex items-center justify-center">
            <ParticipantTile
              participant={displayedParticipant}
              isPinned={
                displayedParticipant.participantId === pinnedId
              }
              onPinToggle={() =>
                onPinToggle(displayedParticipant.participantId)
              }
              className="w-full h-full rounded-2xl"
            />
          </div>

          {/* Right Film Strip */}

          {thumbnails.length > 0 && (
            <div className="w-[280px] shrink-0 overflow-y-auto flex flex-col gap-4 px-1">
              {thumbnails.map((participant) => (
                <ParticipantTile
                  key={participant.participantId}
                  participant={participant}
                  isPinned={
                    participant.participantId === pinnedId
                  }
                  onPinToggle={() =>
                    onPinToggle(participant.participantId)
                  }
                  className="w-full aspect-video rounded-xl shrink-0 cursor-pointer transition-transform hover:scale-[1.02]"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= CHAT / PARTICIPANTS PANEL OPEN ================= */}

      {sidePanelOpen && (
        <div className="flex h-full flex-col p-4 gap-4">
          {/* Main Stage */}

          <div className="flex-1 min-h-0 flex items-center justify-center">
            <ParticipantTile
              participant={displayedParticipant}
              isPinned={
                displayedParticipant.participantId === pinnedId
              }
              onPinToggle={() =>
                onPinToggle(displayedParticipant.participantId)
              }
              className="w-full h-full rounded-2xl"
            />
          </div>

          {/* Bottom Film Strip */}

          {thumbnails.length > 0 && (
            <div className="h-28 shrink-0 overflow-x-auto">
              <div className="flex h-full items-center gap-3">
                {thumbnails.map((participant) => (
                  <ParticipantTile
                    key={participant.participantId}
                    participant={participant}
                    isPinned={
                      participant.participantId === pinnedId
                    }
                    onPinToggle={() =>
                      onPinToggle(participant.participantId)
                    }
                    className="h-full w-44 shrink-0 rounded-xl cursor-pointer transition-transform hover:scale-[1.02]"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}