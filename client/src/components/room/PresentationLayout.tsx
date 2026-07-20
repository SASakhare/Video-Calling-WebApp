import { ParticipantTile } from "./ParticipantTile";
import type { MeetingParticipant } from "@/types";
import { useAuthStore } from "@/store/auth.store";

interface PresentationLayoutProps {
  participants: MeetingParticipant[];
  activeSpeakerId: string | null;
  pinnedId: string | null;
  participantsOpen: boolean;
  chatOpen: boolean;
  onPinToggle: (participantId: string) => void;
}

export default function PresentationLayout({
  participants,
  pinnedId,
  participantsOpen,
  chatOpen,
  onPinToggle,
}: PresentationLayoutProps) {
  const sidePanelOpen = participantsOpen || chatOpen;

  const user = useAuthStore((state) => state.user);

  const selfParticipant = participants.find(
    (participant) => participant.userId === user?.userId
  );

  if (!selfParticipant) {
    return null;
  }

  const presenter =
    participants.find(
      (participant) => participant.isScreenSharing
    ) ??
    participants.find(
      (participant) => participant.role === "HOST"
    ) ??
    selfParticipant;

  return (
    <div className="flex-1 h-full w-full overflow-hidden">
      {/* ================= NO SIDE PANEL ================= */}

      {!sidePanelOpen && (
        <div className="flex h-full gap-4 p-4">
          {/* Presentation */}

          <div className="flex-1 relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center">
              <div className="text-6xl animate-pulse">📊</div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Q3 Roadmap Presentation.pdf
              </h3>

              <p className="text-sm text-white/50">
                Presented by {presenter.username}
              </p>

              <div className="mt-5 rounded-full border border-primary/30 bg-primary/20 px-4 py-1 text-xs text-primary">
                LIVE SCREEN SHARE
              </div>
            </div>
          </div>

          {/* Right Film Strip */}

          <div className="w-[280px] shrink-0 overflow-y-auto flex flex-col gap-4 px-1">
            {participants.map((participant) => (
              <ParticipantTile
                key={participant.participantId}
                participant={participant}
                isSelf={
                  participant.participantId ===
                  selfParticipant.participantId
                }
                isPinned={
                  participant.participantId === pinnedId
                }
                onPinToggle={() =>
                  onPinToggle(participant.participantId)
                }
                className="w-full aspect-video rounded-xl shrink-0"
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= CHAT / PARTICIPANTS PANEL OPEN ================= */}

      {sidePanelOpen && (
        <div className="flex h-full flex-col p-4 gap-4">
          {/* Presentation */}

          <div className="flex-1 relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center">
              <div className="text-6xl animate-pulse">📊</div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Q3 Roadmap Presentation.pdf
              </h3>

              <p className="text-sm text-white/50">
                Presented by {presenter.username}
              </p>

              <div className="mt-5 rounded-full border border-primary/30 bg-primary/20 px-4 py-1 text-xs text-primary">
                LIVE SCREEN SHARE
              </div>
            </div>
          </div>

          {/* Bottom Film Strip */}

          <div className="h-28 shrink-0 overflow-x-auto">
            <div className="flex h-full items-center gap-3">
              {participants.map((participant) => (
                <ParticipantTile
                  key={participant.participantId}
                  participant={participant}
                  isSelf={
                    participant.participantId ===
                    selfParticipant.participantId
                  }
                  isPinned={
                    participant.participantId === pinnedId
                  }
                  onPinToggle={() =>
                    onPinToggle(participant.participantId)
                  }
                  className="h-full w-[180px] rounded-xl shrink-0"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}