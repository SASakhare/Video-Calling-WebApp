import { ParticipantTile } from "./ParticipantTile";
import type { Participant } from "@/types";

interface PresentationLayoutProps {
  participants: Participant[];
  selfParticipant: Participant;
  activeSpeakerId: string | null;
  pinnedId: string | null;
  onPinToggle: (id: string) => void;
}

export function PresentationLayout({
  participants,
  selfParticipant,
  pinnedId,
  onPinToggle,
}: PresentationLayoutProps) {
  const allList = [selfParticipant, ...participants];
  
  // Who is presenting? We'll prioritize anyone with isSharing flag, or fall back to Alex Rivera
  const presenter = allList.find((p) => p.isSharing) || allList.find((p) => p.isHost) || selfParticipant;

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0 w-full p-4 gap-4 overflow-hidden">
      {/* Screenshare presentation panel */}
      <div className="flex-1 flex flex-col justify-center items-center relative overflow-hidden bg-slate-900 border border-white/5 rounded-2xl">
        {/* Mock visual preview window content */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 flex flex-col justify-center items-center gap-4 text-center select-none z-10 p-6">
          <div className="text-6xl animate-pulse">📊</div>
          <div>
            <h3 className="text-lg font-bold text-white/90">Q3 Roadmap Presentation.pdf</h3>
            <p className="text-xs text-white/50 mt-1">Presented by {presenter.name}</p>
          </div>
          <div className="rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-xs text-primary animate-pulse mt-4">
            LIVE SCREEN SHARE
          </div>
        </div>

        {/* Screen layout framing overlay border shadow */}
        <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_60px_rgba(0,0,0,0.6)]" />
      </div>

      {/* Side filmstrip column vertical layout list */}
      <div className="w-full md:w-[220px] shrink-0 md:h-full overflow-y-auto flex md:flex-col items-center justify-start gap-3 px-1 py-1 scrollbar-thin select-none">
        {allList.map((p) => (
          <ParticipantTile
            key={p.id}
            participant={p}
            isSelf={p.id === selfParticipant.id}
            isPinned={pinnedId === p.id}
            onPinToggle={() => onPinToggle(p.id)}
            className="w-[180px] md:w-full aspect-video shrink-0 rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}
export default PresentationLayout;
