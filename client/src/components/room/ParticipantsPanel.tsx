import { useState } from "react";
import {
  X,
  Users,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Search,
  Pin,
  Shield,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { MeetingParticipant } from "@/types";

interface ParticipantsPanelProps {
  open: boolean;
  onClose: () => void;
  participants: MeetingParticipant[];
  pinnedId: string | null;
  onPinToggle: (participantId: string) => void;
}

export function ParticipantsPanel({
  open,
  onClose,
  participants,
  pinnedId,
  onPinToggle,
}: ParticipantsPanelProps) {
  const [search, setSearch] = useState("");

  const user = useAuthStore((state) => state.user);

  const filtered = participants.filter((participant) =>
    participant.username
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="w-full md:w-[360px] h-full shrink-0 border-l border-white/5 bg-slate-900 flex flex-col relative z-40 select-none">
      {/* Header */}

      <div className="h-16 shrink-0 flex items-center justify-between px-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">
            People ({participants.length})
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 hover:bg-white/10 text-white/60 hover:text-white rounded-lg"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}

      <div className="p-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participants"
            className="h-9 pl-9 rounded-xl border-white/10 bg-white/5 text-xs text-white placeholder:text-white/30"
          />
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Participants */}

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {filtered.map((participant) => {
            const isSelf =
              participant.userId === user?.userId;

            const initials =
              participant.fullName
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

            return (
              <div
                key={participant.participantId}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 group/row transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarImage
                      src={participant.avatar ?? undefined}
                    />

                    <AvatarFallback className="bg-gradient-brand text-[10px] text-white uppercase">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white/90 truncate flex items-center gap-1">
                      <span>
                        {isSelf
                          ? `${participant.username} (You)`
                          : participant.username}
                      </span>

                      {participant.role === "HOST" && (
                        <Shield
                          className="h-3 w-3 text-primary shrink-0"
                        />
                      )}
                    </p>

                    <p className="text-[10px] text-white/40 mt-0.5">
                      {participant.role === "HOST"
                        ? "Host"
                        : "Participant"}
                    </p>
                  </div>
                </div>

                {/* Right Actions */}

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    onClick={() =>
                      onPinToggle(
                        participant.participantId
                      )
                    }
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover/row:opacity-100 focus:opacity-100 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-opacity"
                  >
                    <Pin
                      className={`h-3.5 w-3.5 ${pinnedId ===
                          participant.participantId
                          ? "text-primary fill-primary"
                          : ""
                        }`}
                    />
                  </Button>

                  <div className="flex items-center gap-1">
                    {participant.isMicOn ? (
                      <Mic className="h-3.5 w-3.5 text-white/40" />
                    ) : (
                      <MicOff className="h-3.5 w-3.5 text-red-500" />
                    )}

                    {participant.isCameraOn ? (
                      <Camera className="h-3.5 w-3.5 text-white/40" />
                    ) : (
                      <CameraOff className="h-3.5 w-3.5 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default ParticipantsPanel;