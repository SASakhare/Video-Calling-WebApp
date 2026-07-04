import { ParticipantTile } from "./ParticipantTile";
import type { Participant } from "@/types";

interface SpeakerLayoutProps {
  participants: Participant[];
  selfParticipant: Participant;
  activeSpeakerId: string | null;
  pinnedId: string | null;
  onPinToggle: (id: string) => void;
}

export function SpeakerLayout({
  participants,
  selfParticipant,
  activeSpeakerId,
  pinnedId,
  onPinToggle,
}: SpeakerLayoutProps) {
  const allList = [selfParticipant, ...participants];

  // Speaker calculation priority: Pinned > ActiveSpeaker > Host > You
  const activeSpeaker = allList.find((p) => p.id === (pinnedId || activeSpeakerId)) 
    || allList.find((p) => p.isSpeaking) 
    || allList.find((p) => p.isHost) 
    || selfParticipant;

  const filmstrip = allList.filter((p) => p.id !== activeSpeaker.id);

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full p-4 gap-4 overflow-hidden">
      {/* Active Speaker Large Video Block */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <ParticipantTile
          participant={activeSpeaker}
          isSelf={activeSpeaker.id === selfParticipant.id}
          isPinned={pinnedId === activeSpeaker.id}
          onPinToggle={() => onPinToggle(activeSpeaker.id)}
          className="w-full max-w-5xl h-full max-h-[60vh] aspect-video"
        />
      </div>

      {/* Filmstrip film layout at the bottom */}
      <div className="h-[120px] md:h-[160px] shrink-0 w-full overflow-x-auto flex items-center justify-start gap-3 px-2 py-1 scrollbar-thin select-none">
        {filmstrip.map((p) => (
          <ParticipantTile
            key={p.id}
            participant={p}
            isSelf={p.id === selfParticipant.id}
            isPinned={pinnedId === p.id}
            onPinToggle={() => onPinToggle(p.id)}
            className="h-full aspect-video shrink-0 rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}
export default SpeakerLayout;
