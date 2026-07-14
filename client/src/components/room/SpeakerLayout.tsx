import { ParticipantTile } from "./ParticipantTile";
import type { Participant } from "@/types";

interface SpeakerLayoutProps {
  participants: Participant[];
  selfParticipant: Participant;
  activeSpeakerId: string | null;
  pinnedId: string | null;
  participantsOpen: boolean;
  chatOpen: boolean;
  onPinToggle: (id: string) => void;
}

export default function SpeakerLayout({
  participants,
  selfParticipant,
  activeSpeakerId,
  pinnedId,
  participantsOpen,
  chatOpen,
  onPinToggle,
}: SpeakerLayoutProps) {
  const sidePanelOpen = participantsOpen || chatOpen;

  const allParticipants = [
    selfParticipant,
    ...participants.filter((p) => p.id !== selfParticipant.id),
  ];

  const displayedParticipant =
    allParticipants.find((p) => p.id === pinnedId) ??
    allParticipants.find((p) => p.id === activeSpeakerId) ??
    allParticipants.find((p) => p.isSpeaking) ??
    allParticipants.find((p) => p.isHost) ??
    selfParticipant;

  const thumbnails = allParticipants.filter(
    (p) => p.id !== displayedParticipant.id
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
              isSelf={displayedParticipant.id === selfParticipant.id}
              isPinned={displayedParticipant.id === pinnedId}
              onPinToggle={() => onPinToggle(displayedParticipant.id)}
              className="w-full h-full rounded-2xl"
            />
          </div>

          {/* Right FilmStrip */}

          {thumbnails.length > 0 && (
            <div className="w-[280px] shrink-0 overflow-y-auto flex flex-col gap-4 px-1">

              {thumbnails.map((participant) => (
                <ParticipantTile
                  key={participant.id}
                  participant={participant}
                  isSelf={participant.id === selfParticipant.id}
                  isPinned={participant.id === pinnedId}
                  onPinToggle={() => onPinToggle(participant.id)}
                  className="w-full aspect-video rounded-xl shrink-0 cursor-pointer transition-transform hover:scale-[1.02]"
                />
              ))}

            </div>
          )}

        </div>
      )}

      {/* ================= CHAT / PEOPLE PANEL OPEN ================= */}

      {sidePanelOpen && (
        <div className="flex h-full flex-col p-4 gap-4">

          {/* Main Stage */}

          <div className="flex-1 min-h-0 flex items-center justify-center">
            <ParticipantTile
              participant={displayedParticipant}
              isSelf={displayedParticipant.id === selfParticipant.id}
              isPinned={displayedParticipant.id === pinnedId}
              onPinToggle={() => onPinToggle(displayedParticipant.id)}
              className="w-full h-full rounded-2xl"
            />
          </div>

          {/* Bottom FilmStrip */}

          {thumbnails.length > 0 && (
            <div className="h-28 shrink-0 overflow-x-auto">

              <div className="flex h-full items-center gap-3">

                {thumbnails.map((participant) => (
                  <ParticipantTile
                    key={participant.id}
                    participant={participant}
                    isSelf={participant.id === selfParticipant.id}
                    isPinned={participant.id === pinnedId}
                    onPinToggle={() => onPinToggle(participant.id)}
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