import { ParticipantTile } from "./ParticipantTile";
import type { Participant } from "@/types";

interface GridLayoutProps {
  participants: Participant[];
  selfParticipant: Participant;
  pinnedId: string | null;
  onPinToggle: (id: string) => void;
}

export function GridLayout({
  participants,
  selfParticipant,
  pinnedId,
  onPinToggle,
}: GridLayoutProps) {
  const allList = [selfParticipant, ...participants];

  // Grid dynamic dimensions calculations based on count
  const count = allList.length;
  let colsClass = "grid-cols-1";
  let mdColsClass = "md:grid-cols-1";

  if (count >= 2 && count <= 4) {
    colsClass = "grid-cols-2";
    mdColsClass = "md:grid-cols-2";
  } else if (count >= 5 && count <= 6) {
    colsClass = "grid-cols-2";
    mdColsClass = "md:grid-cols-3";
  } else if (count > 6) {
    colsClass = "grid-cols-3";
    mdColsClass = "md:grid-cols-4";
  }

  return (
    <div className="flex-1 min-h-0 w-full p-4 overflow-y-auto flex items-center justify-center">
      <div className={`grid ${colsClass} ${mdColsClass} gap-3 w-full h-full max-h-[85vh] max-w-6xl`}>
        {allList.map((p) => (
          <ParticipantTile
            key={p.id}
            participant={p}
            isSelf={p.id === selfParticipant.id}
            isPinned={pinnedId === p.id}
            onPinToggle={() => onPinToggle(p.id)}
            className="w-full h-full min-h-[160px] aspect-video md:min-h-[220px]"
          />
        ))}
      </div>
    </div>
  );
}
export default GridLayout;
