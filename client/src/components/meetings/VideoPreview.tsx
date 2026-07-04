import { motion } from "framer-motion";
import { VideoOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

interface VideoPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraOn: boolean;
  micOn: boolean;
  audioLevel: number;
  className?: string;
  /** Compact mode for waiting room */
  compact?: boolean;
}

export function VideoPreview({
  videoRef,
  cameraOn,
  micOn,
  audioLevel,
  className,
  compact = false,
}: VideoPreviewProps) {
  const user = useAuthStore((s) => s.user);
  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-slate-950",
        compact ? "aspect-video max-w-sm" : "aspect-video w-full",
        className
      )}
    >
      {/* Live video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
          cameraOn ? "opacity-100" : "opacity-0",
          "scale-x-[-1]" // Mirror for natural self-view
        )}
      />

      {/* Camera-off fallback */}
      {!cameraOn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-2xl font-bold text-white shadow-xl">
            {initials}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/60">
            <VideoOff className="h-3.5 w-3.5" />
            Camera off
          </div>
        </div>
      )}

      {/* Mic level indicator */}
      {micOn && (
        <div className="absolute bottom-3 left-3 flex items-end gap-[2px]">
          {[0.2, 0.4, 0.6, 0.8, 1].map((threshold, i) => (
            <motion.div
              key={i}
              className={cn(
                "w-[3px] rounded-full transition-colors duration-75",
                audioLevel >= threshold ? "bg-emerald-400" : "bg-white/20"
              )}
              animate={{
                height: audioLevel >= threshold ? 8 + i * 3 : 4,
              }}
              transition={{ duration: 0.05 }}
            />
          ))}
        </div>
      )}

      {/* Subtle vignette overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_60px_rgba(0,0,0,0.3)]" />
    </div>
  );
}
