import { ParticipantTile } from "./ParticipantTile";
import type { MeetingParticipant } from "@/types";

interface GridLayoutProps {
  participants: MeetingParticipant[];
  pinnedId: string | null;
  onPinToggle: (participantId: string) => void;
}

export function GridLayout({
  participants,
  pinnedId,
  onPinToggle,
}: GridLayoutProps) {
  const count = participants.length;

  const getColumns = () => {
    if (count <= 1) return 1;
    if (count <= 4) return 2;
    if (count <= 9) return 3;
    if (count <= 16) return 4;
    if (count <= 25) return 5;

    return 6;
  };

  const columns = getColumns();

  return (
    <div
      className="
        w-full
        h-full
        overflow-y-auto
        overflow-x-hidden
        p-4
      "
    >
      <div
        className="
          grid
          gap-4
          w-full
          min-h-full
        "
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {participants.map((participant) => (
          <div
            key={participant.participantId}
            className="
              aspect-video
              min-h-[180px]
            "
          >
            <ParticipantTile
              participant={participant}
              isPinned={participant.participantId === pinnedId}
              onPinToggle={() =>
                onPinToggle(participant.participantId)
              }
              className="
                w-full
                h-full
                rounded-2xl
              "
            />
          </div>
        ))}
      </div>
    </div>
  );
}