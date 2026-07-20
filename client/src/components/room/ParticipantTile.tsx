import { motion } from "framer-motion";
import { MicOff, Pin, Hand } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { MeetingParticipant } from "@/types";
import { useEffect, useRef } from "react";

interface ParticipantTileProps {
  participant: MeetingParticipant;
  isSelf?: boolean;
  isPinned?: boolean;
  onPinToggle?: () => void;
  className?: string;
}

export function ParticipantTile({
  participant,
  isSelf = false,
  isPinned = false,
  onPinToggle,
  className,
}: ParticipantTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const initials = participant.username
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const hasVideoProducer = participant.producers.some(
    (producer) => producer.kind === "video"
  );

  useEffect(() => {
    // TODO:
    // const stream = RemoteStreamManager.getStream(participant.participantId);
    // if (stream && videoRef.current) {
    //   videoRef.current.srcObject = stream;
    // }
  }, [participant.participantId]);

  return (
    <div
      className={cn(
        "group relative flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900 border transition-all duration-300",
        participant.isSpeaking
          ? "border-primary/80 ring-2 ring-primary/40 shadow-glow"
          : "border-white/5 hover:border-white/20",
        className
      )}
    >
      {/* ================= Video / Avatar ================= */}

      {participant.isCameraOn && hasVideoProducer ? (
        <div className="absolute inset-0 bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isSelf}
            className="h-full w-full object-cover"
          />

          {!videoRef.current?.srcObject && (
            <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 opacity-80" />

              <div className="relative text-xs text-white/40 flex flex-col items-center gap-1.5 z-10 select-none">
                <span className="animate-pulse flex h-2 w-2 rounded-full bg-primary" />
                <span>Live Feed</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center gap-3">
          <Avatar className="h-20 w-20 border-2 border-white/10 ring-4 ring-primary/10">
            <AvatarImage src={participant.avatar ?? undefined} />

            <AvatarFallback className="bg-gradient-brand text-xl font-bold text-white uppercase select-none">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* ================= Screen Share ================= */}

      {participant.isScreenSharing && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20 select-none">
          <div className="animate-bounce flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-brand">
            🖥️
          </div>

          <p className="text-sm font-semibold">
            {participant.username} is sharing screen
          </p>
        </div>
      )}

      {/* ================= Bottom Info ================= */}

      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none select-none">
        <div className="flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1.5 text-[11px] font-medium text-white backdrop-blur">
          {participant.role === "HOST" && (
            <span className="rounded bg-primary/20 border border-primary/30 px-1 py-px text-[9px] text-primary">
              HOST
            </span>
          )}

          <span className="truncate max-w-[140px]">
            {isSelf
              ? `${participant.username} (You)`
              : participant.username}
          </span>

          {!participant.isMicOn && (
            <MicOff className="h-3 w-3 text-red-500 shrink-0" />
          )}
        </div>

        <div
          className={cn(
            "h-2 w-2 rounded-full",
            participant.connectionState === "CONNECTED"
              ? "bg-emerald-500"
              : participant.connectionState === "RECONNECTING"
                ? "bg-amber-500"
                : "bg-red-500"
          )}
        />
      </div>

      {/* ================= Hand Raised ================= */}

      {participant.isHandRaised && (
        <div className="absolute right-3 top-3 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg animate-float">
          <Hand className="h-4 w-4" />
        </div>
      )}

      {/* ================= Pin Button ================= */}

      <div className="absolute right-3 top-3 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onPinToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPinToggle();
            }}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-all",
              isPinned
                ? "bg-primary text-white"
                : "bg-black/40 hover:bg-black/60 text-white/80"
            )}
            title={isPinned ? "Unpin tile" : "Pin tile"}
          >
            <Pin className={cn("h-4 w-4", isPinned && "rotate-45")} />
          </button>
        )}
      </div>

      {/* ================= Recording ================= */}

      {participant.isRecording && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-red-600 px-2 py-1 text-[10px] font-semibold text-white"
        >
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          REC
        </motion.div>
      )}
    </div>
  );
}

export default ParticipantTile;